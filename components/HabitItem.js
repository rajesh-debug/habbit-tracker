import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { getIconById } from '../utils/habitIcons';
import { colors, getHabitColor, getPriorityColor, getStreakColor } from '../utils/colorTheme';

const HabitItem = ({ habit, onToggle, onDelete, onEdit }) => {
  const handleLongPress = () => {
    Alert.alert(
      'Habit Options',
      `What would you like to do with "${habit.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Edit', onPress: () => onEdit && onEdit(habit) },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: async () => {
            if (onDelete) {
              const success = await onDelete(habit.id);
              if (!success) {
                Alert.alert('Error', 'Failed to delete habit. Please try again.');
              }
            }
          }
        },
      ]
    );
  };

  const habitColor = getHabitColor(habit);
  const priorityColor = getPriorityColor(habit.priority);
  const streakColor = getStreakColor(habit);
  
  const getStreakText = () => {
    if (habit.type === 'bad') {
      return habit.streak > 0 
        ? `⚠️ ${habit.streak} ${habit.streak === 1 ? 'day' : 'days'} streak`
        : `✅ ${Math.abs(habit.streak)} clean days`;
    }
    
    if (habit.failedDays > 0) {
      return `💔 ${habit.failedDays} ${habit.failedDays === 1 ? 'day' : 'days'} missed`;
    }
    
    return `🔥 ${habit.streak} ${habit.streak === 1 ? 'day' : 'days'}`;
  };

  return (
    <TouchableOpacity
      style={[
        styles.container, 
        habit.completed && styles.completedContainer,
        { borderLeftColor: priorityColor, borderLeftWidth: 4 }
      ]}
      onPress={() => {
        if (habit.completed) {
          Alert.alert(
            'Already Completed!',
            `You've already completed "${habit.name}" today. Great job! 🎉\n\nCome back tomorrow to continue your streak.`,
            [
              { text: 'OK', style: 'default' },
              { 
                text: 'Mark as Incomplete', 
                style: 'destructive',
                onPress: () => onToggle(habit.id)
              }
            ]
          );
        } else {
          onToggle(habit.id);
        }
      }}
      onLongPress={handleLongPress}
      accessibilityLabel={`${habit.name}, ${habit.completed ? 'completed' : 'not completed'}, streak ${habit.streak} days`}
      accessibilityHint={habit.completed ? "Already completed today, long press for options" : "Tap to complete, long press for options"}
    >
      <View style={styles.content}>
        <View style={styles.habitHeader}>
          {habit.icon && (
            <Text style={styles.habitIcon}>
              {getIconById(habit.icon.id)?.emoji || habit.icon.emoji}
            </Text>
          )}
          <Text style={[styles.habitName, habit.completed && styles.completedText]}>
            {habit.name}
          </Text>
          {habit.priority === 'high' && (
            <View style={styles.priorityBadge}>
              <Text style={styles.priorityText}>!</Text>
            </View>
          )}
        </View>
        <View style={styles.streakContainer}>
          <Text style={[styles.streakText, { color: streakColor }]}>
            {getStreakText()}
          </Text>
          {habit.reminderInterval && (
            <Text style={styles.reminderText}>
              ⏰ {habit.reminderInterval}min
            </Text>
          )}
        </View>
      </View>
      <View style={[
        styles.checkbox, 
        habit.completed && styles.checkedBox,
        { borderColor: habitColor }
      ]}>
        {habit.completed && <Text style={styles.checkmark}>✓</Text>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: colors.border + '20',
  },
  completedContainer: {
    backgroundColor: colors.success + '10',
    borderColor: colors.success + '30',
    transform: [{ scale: 0.98 }],
  },
  content: {
    flex: 1,
  },
  habitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  habitIcon: {
    fontSize: 24,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
    fontFamily: Platform.select({
      ios: 'Times New Roman',
      android: 'serif',
    }),
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  priorityBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    elevation: 2,
    shadowColor: colors.error,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  priorityText: {
    color: colors.textInverse,
    fontSize: 12,
    fontWeight: 'bold',
  },
  streakContainer: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  streakText: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: Platform.select({
      ios: 'Times New Roman',
      android: 'serif',
    }),
  },
  reminderText: {
    fontSize: 12,
    color: colors.textLight,
    fontWeight: '400',
    fontFamily: Platform.select({
      ios: 'Times New Roman',
      android: 'serif',
    }),
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  checkedBox: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  checkmark: {
    color: colors.textInverse,
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
});

export default HabitItem;