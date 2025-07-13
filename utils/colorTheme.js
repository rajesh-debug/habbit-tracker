// Facebook-inspired color theme
export const colors = {
  // Primary Facebook blue
  primary: '#1877F2',
  primaryDark: '#166FE5',
  primaryLight: '#42A5F5',
  
  // Secondary colors
  secondary: '#42B883',
  secondaryLight: '#66D9A7',
  
  // Status colors
  success: '#00C851',
  warning: '#FF8800',
  error: '#FF3547',
  info: '#33B5E5',
  
  // Background colors
  background: '#F0F2F5',
  surface: '#FFFFFF',
  surfaceLight: '#F8F9FA',
  
  // Text colors
  textPrimary: '#1C1E21',
  textSecondary: '#65676B',
  textLight: '#8A8D91',
  textInverse: '#FFFFFF',
  
  // Border colors
  border: '#DAE0E6',
  borderLight: '#E4E6EA',
  
  // Habit-specific colors
  goodHabit: '#00C851',
  badHabit: '#FF3547',
  priority: {
    low: '#8A8D91',
    normal: '#1877F2',
    high: '#FF3547'
  },
  
  // Streak colors
  streakGood: '#00C851',
  streakFailed: '#FF3547',
  streakNeutral: '#65676B',
};

export const getHabitColor = (habit) => {
  if (habit.type === 'bad') {
    return colors.badHabit;
  }
  
  if (habit.failedDays > 0) {
    return colors.streakFailed;
  }
  
  return colors.goodHabit;
};

export const getPriorityColor = (priority) => {
  return colors.priority[priority] || colors.priority.normal;
};

export const getStreakColor = (habit) => {
  if (habit.type === 'bad') {
    return habit.streak > 0 ? colors.streakFailed : colors.goodHabit;
  }
  
  if (habit.failedDays > 0) {
    return colors.streakFailed;
  }
  
  return colors.streakGood;
};