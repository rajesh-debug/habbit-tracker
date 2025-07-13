import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { getSettings, isHighPriorityRemindersEnabled } from '../utils/settings';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Request notification permissions
export const requestNotificationPermissions = async () => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Notification permissions not granted');
      return false;
    }
    
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
};

// Schedule daily reminders for incomplete habits
export const scheduleDailyReminders = async (habits) => {
  try {
    // Cancel all existing notifications first
    await Notifications.cancelAllScheduledNotificationsAsync();
    
    // Schedule different types of reminders
    await scheduleGoodHabitReminders(habits);
    await scheduleBadHabitReminders(habits);
    await schedulePriorityHabitReminders(habits);
    await scheduleCustomTimerReminders(habits);
    await scheduleIncompleteHighPriorityReminder(habits);
    
    console.log('All reminders scheduled successfully');
  } catch (error) {
    console.error('Error scheduling reminders:', error);
  }
};

// Schedule reminders for good habits (incomplete ones)
const scheduleGoodHabitReminders = async (habits) => {
  const incompleteGoodHabits = habits.filter(habit => 
    habit.type !== 'bad' && !habit.completed
  );
  
  // Schedule notification for 7:00 PM daily
  for (const habit of incompleteGoodHabits) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Habit Reminder',
        body: `Complete "${habit.name}" now to keep your streak!`,
        data: { habitId: habit.id, type: 'good' },
      },
      trigger: {
        hour: 19, // 7:00 PM
        minute: 0,
        repeats: true,
      },
    });
  }
};

// Schedule reminders for bad habits every 30 minutes
const scheduleBadHabitReminders = async (habits) => {
  const badHabits = habits.filter(habit => habit.type === 'bad');
  
  for (const habit of badHabits) {
    // Schedule multiple reminders throughout the day
    const reminderTimes = [
      { hour: 9, minute: 0 },   // 9:00 AM
      { hour: 9, minute: 30 },  // 9:30 AM
      { hour: 12, minute: 0 },  // 12:00 PM
      { hour: 12, minute: 30 }, // 12:30 PM
      { hour: 15, minute: 0 },  // 3:00 PM
      { hour: 15, minute: 30 }, // 3:30 PM
      { hour: 18, minute: 0 },  // 6:00 PM
      { hour: 18, minute: 30 }, // 6:30 PM
      { hour: 21, minute: 0 },  // 9:00 PM
      { hour: 21, minute: 30 }, // 9:30 PM
    ];
    
    for (const time of reminderTimes) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Avoid Bad Habit',
          body: `Stay strong! Avoid "${habit.name}" to maintain your progress.`,
          data: { habitId: habit.id, type: 'bad' },
        },
        trigger: {
          hour: time.hour,
          minute: time.minute,
          repeats: true,
        },
      });
    }
  }
};

// Schedule priority habit reminders at defined intervals
const schedulePriorityHabitReminders = async (habits) => {
  const priorityHabits = habits.filter(habit => 
    habit.priority === 'high' && habit.type !== 'bad'
  );
  
  // Check if priority reminders are enabled
  const enabled = await isHighPriorityRemindersEnabled();
  if (!enabled || priorityHabits.length === 0) {
    return;
  }
  
  const settings = await getSettings();
  const reminderTime = settings.highPriorityReminderTime || '18:00';
  const [hour, minute] = reminderTime.split(':').map(Number);
  
  for (const habit of priorityHabits) {
    // Schedule reminder at configured time
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Priority Habit Alert!',
        body: `Don't procrastinate! Time for "${habit.name}" - High priority habit.`,
        data: { habitId: habit.id, type: 'priority' },
      },
      trigger: {
        hour,
        minute,
        repeats: true,
      },
    });
  }
};

// Schedule incomplete high priority habit reminder
export const scheduleIncompleteHighPriorityReminder = async (habits) => {
  try {
    const incompleteHighPriorityHabits = habits.filter(habit => 
      habit.priority === 'high' && 
      habit.type !== 'bad' && 
      !habit.completed
    );
    
    if (incompleteHighPriorityHabits.length === 0) {
      return;
    }
    
    const enabled = await isHighPriorityRemindersEnabled();
    if (!enabled) {
      return;
    }
    
    const settings = await getSettings();
    const reminderTime = settings.highPriorityReminderTime || '18:00';
    const [hour, minute] = reminderTime.split(':').map(Number);
    
    const habitNames = incompleteHighPriorityHabits.map(h => h.name).join(', ');
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `${incompleteHighPriorityHabits.length} High Priority Habits Pending!`,
        body: `Complete these important habits: ${habitNames}`,
        data: { type: 'incomplete_priority', count: incompleteHighPriorityHabits.length },
      },
      trigger: {
        hour,
        minute,
        repeats: true,
      },
    });
    
    console.log(`Scheduled incomplete high priority reminder for ${incompleteHighPriorityHabits.length} habits`);
  } catch (error) {
    console.error('Error scheduling incomplete high priority reminder:', error);
  }
};

// Schedule custom timer reminders
const scheduleCustomTimerReminders = async (habits) => {
  const customReminderHabits = habits.filter(habit => 
    habit.reminderInterval && habit.reminderInterval > 0
  );
  
  for (const habit of customReminderHabits) {
    // Schedule reminder based on custom interval
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Custom Reminder',
        body: `Time for "${habit.name}"!`,
        data: { habitId: habit.id, type: 'custom' },
      },
      trigger: {
        seconds: habit.reminderInterval * 60, // Convert minutes to seconds
        repeats: true,
      },
    });
  }
};

// Schedule notification for a specific habit
export const scheduleHabitReminder = async (habit, hour = 19, minute = 0) => {
  try {
    if (habit.completed) {
      return; // Don't schedule for completed habits
    }
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Habit Reminder',
        body: `Time to complete "${habit.name}"!`,
        data: { habitId: habit.id },
      },
      trigger: {
        hour,
        minute,
        repeats: true,
      },
    });
  } catch (error) {
    console.error('Error scheduling habit reminder:', error);
  }
};

// Cancel all notifications
export const cancelAllNotifications = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('All notifications cancelled');
  } catch (error) {
    console.error('Error cancelling notifications:', error);
  }
};

// Get scheduled notifications (for debugging)
export const getScheduledNotifications = async () => {
  try {
    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    console.log('Scheduled notifications:', notifications);
    return notifications;
  } catch (error) {
    console.error('Error getting scheduled notifications:', error);
    return [];
  }
};