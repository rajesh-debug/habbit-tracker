import AsyncStorage from '@react-native-async-storage/async-storage';

const HABITS_KEY = 'habits';
const QUOTE_KEY = 'dailyQuote';

// Habit Data Model
export const createHabit = (name, icon = null, type = 'good', priority = 'normal', reminderInterval = null) => ({
  id: Date.now().toString(),
  name,
  icon,
  type, // 'good' or 'bad'
  priority, // 'low', 'normal', 'high'
  reminderInterval, // minutes for custom reminders
  completed: false,
  streak: 0,
  lastCompleted: null,
  completionHistory: {}, // Track completion by date for weekly view
  failedDays: 0, // Track consecutive failed days
  lastFailed: null, // Last date this habit was failed
});

// Quote Data Model
export const createQuote = (quote) => ({
  quote,
  date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
});

// Habit Storage Functions
export const getHabits = async () => {
  try {
    const habits = await AsyncStorage.getItem(HABITS_KEY);
    return habits ? JSON.parse(habits) : [];
  } catch (error) {
    console.error('Error getting habits:', error);
    return [];
  }
};

export const saveHabits = async (habits) => {
  try {
    await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(habits));
  } catch (error) {
    console.error('Error saving habits:', error);
  }
};

export const addHabit = async (name, icon = null, type = 'good', priority = 'normal', reminderInterval = null) => {
  if (!name.trim()) return false;
  
  try {
    const existingHabits = await getHabits();
    const newHabit = createHabit(name.trim(), icon, type, priority, reminderInterval);
    const updatedHabits = [...existingHabits, newHabit];
    await saveHabits(updatedHabits);
    return true;
  } catch (error) {
    console.error('Error adding habit:', error);
    return false;
  }
};

export const toggleHabitCompletion = async (habitId, date = null) => {
  try {
    const habits = await getHabits();
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    const updatedHabits = habits.map(habit => {
      if (habit.id === habitId) {
        const completionHistory = habit.completionHistory || {};
        const isCurrentlyCompleted = completionHistory[targetDate] || false;
        const newCompletionStatus = !isCurrentlyCompleted;
        
        // Update completion history
        const updatedHistory = {
          ...completionHistory,
          [targetDate]: newCompletionStatus,
        };
        
        // If toggling today's completion, update the main completed field
        const today = new Date().toISOString().split('T')[0];
        const isToday = targetDate === today;
        
        let newStreak = habit.streak;
        let newCompleted = habit.completed;
        let newLastCompleted = habit.lastCompleted;
        
        if (isToday) {
          newCompleted = newCompletionStatus;
          if (newCompletionStatus) {
            newStreak = habit.streak + 1;
            newLastCompleted = today;
            // Reset failed days on completion
            habit.failedDays = 0;
            habit.lastFailed = null;
          } else {
            // For good habits, failing breaks the streak
            if (habit.type === 'good') {
              newStreak = 0;
              habit.failedDays = (habit.failedDays || 0) + 1;
              habit.lastFailed = today;
            }
            newLastCompleted = null;
          }
        }
        
        return {
          ...habit,
          completed: newCompleted,
          streak: newStreak,
          lastCompleted: newLastCompleted,
          completionHistory: updatedHistory,
        };
      }
      return habit;
    });
    
    await saveHabits(updatedHabits);
    return updatedHabits;
  } catch (error) {
    console.error('Error toggling habit:', error);
    return null;
  }
};

export const updateHabit = async (updatedHabit) => {
  try {
    const habits = await getHabits();
    const updatedHabits = habits.map(habit =>
      habit.id === updatedHabit.id ? updatedHabit : habit
    );
    await saveHabits(updatedHabits);
    return updatedHabits;
  } catch (error) {
    console.error('Error updating habit:', error);
    return null;
  }
};

export const deleteHabit = async (habitId) => {
  try {
    const habits = await getHabits();
    const updatedHabits = habits.filter(habit => habit.id !== habitId);
    await saveHabits(updatedHabits);
    return updatedHabits;
  } catch (error) {
    console.error('Error deleting habit:', error);
    return null;
  }
};

// Quote Storage Functions
export const getDailyQuote = async () => {
  try {
    const quoteData = await AsyncStorage.getItem(QUOTE_KEY);
    return quoteData ? JSON.parse(quoteData) : null;
  } catch (error) {
    console.error('Error getting daily quote:', error);
    return null;
  }
};

export const saveDailyQuote = async (quoteData) => {
  try {
    await AsyncStorage.setItem(QUOTE_KEY, JSON.stringify(quoteData));
  } catch (error) {
    console.error('Error saving daily quote:', error);
  }
};

// Reset daily completion status (call this on app start to handle new day)
export const resetDailyCompletions = async () => {
  try {
    const habits = await getHabits();
    const today = new Date().toISOString().split('T')[0];
    
    const updatedHabits = habits.map(habit => {
      // Reset completion status if last completed was not today
      if (habit.lastCompleted !== today) {
        return {
          ...habit,
          completed: false,
        };
      }
      return habit;
    });
    
    await saveHabits(updatedHabits);
    return updatedHabits;
  } catch (error) {
    console.error('Error resetting daily completions:', error);
    return null;
  }
};