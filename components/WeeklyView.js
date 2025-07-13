import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { getIconById } from '../utils/habitIcons';
import { colors, getHabitColor, getPriorityColor } from '../utils/colorTheme';

const { width: screenWidth } = Dimensions.get('window');
const dayWidth = screenWidth / 8; // 7 days + 1 for habit column

const WeeklyView = ({ habits, onToggleHabit, onSwitchToDaily, onEditHabit }) => {
  const [currentWeekStart, setCurrentWeekStart] = useState(getWeekStart(new Date()));
  const scrollViewRef = useRef(null);

  function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  const getWeekDates = (weekStart) => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const navigateWeek = (direction) => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(currentWeekStart.getDate() + direction * 7);
    setCurrentWeekStart(newWeekStart);
  };

  const formatDate = (date, format = 'short') => {
    if (format === 'short') {
      return date.toLocaleDateString('en-US', {
        weekday: 'short', // only day name
      });
    }
    return date.toISOString().split('T')[0];
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isHabitCompletedOnDate = (habit, date) => {
    const dateKey = formatDate(date, 'iso');
    return habit.completionHistory?.[dateKey] || false;
  };

  const handleHabitToggle = (habitId, date) => {
    const dateKey = formatDate(date, 'iso');
    onToggleHabit(habitId, dateKey);
  };

  const weekDates = getWeekDates(currentWeekStart);
  const today = new Date();

  return (
    <View style={styles.container}>
      {/* Navigation Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigateWeek(-1)}>
          <Text style={styles.navButtonText}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.weekTitle}>
          {currentWeekStart.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}{' '}
          -{' '}
          {weekDates[6].toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}
        </Text>

        <TouchableOpacity style={styles.navButton} onPress={() => navigateWeek(1)}>
          <Text style={styles.navButtonText}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Grid */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          {/* Header Row */}
          <View style={[styles.row, styles.headerRow]}>
            <View style={[styles.habitNameColumn, styles.headerColumn]}>
              <Text style={styles.habitHeaderText}>Habits</Text>
            </View>
            {weekDates.map((date, index) => (
              <View
                key={index}
                style={[
                  styles.dayColumn,
                  styles.headerColumn,
                  isToday(date) && styles.todayHeaderColumn,
                ]}
              >
                <Text
                  style={[
                    styles.dayText,
                    styles.headerText,
                    isToday(date) && styles.todayHeaderText,
                  ]}
                >
                  {formatDate(date)}
                </Text>
              </View>
            ))}
          </View>

          {/* Habit Rows */}
          <ScrollView 
            style={styles.habitsContainer}
            showsVerticalScrollIndicator={true}
            bounces={true}
          >
            {habits.map((habit) => (
              <View key={habit.id} style={[styles.row, styles.habitRow]}>
                <TouchableOpacity
                  style={[
                    styles.habitNameColumn,
                    styles.habitDataColumn,
                    { borderLeftColor: getPriorityColor(habit.priority), borderLeftWidth: 3 },
                  ]}
                  onPress={() => onEditHabit && onEditHabit(habit)}
                  activeOpacity={0.7}
                >
                  <View style={styles.habitInfo}>
                    {habit.icon && (
                      <Text style={styles.habitIcon}>
                        {getIconById(habit.icon.id)?.emoji || habit.icon.emoji}
                      </Text>
                    )}
                    <Text style={[
                      styles.habitName,
                      habit.priority === 'high' ? styles.highPriorityText :
                      habit.priority === 'normal' ? styles.normalPriorityText :
                      styles.lowPriorityText
                    ]} numberOfLines={1} ellipsizeMode="tail">
                      {habit.name}
                    </Text>
                  </View>
                </TouchableOpacity>

                {weekDates.map((date, index) => {
                  const isCompleted = isHabitCompletedOnDate(habit, date);
                  const isTodayDate = isToday(date);
                  const isPastDate = date < today && !isTodayDate;

                  return (
                    <View
                      key={index}
                      style={[
                        styles.dayColumn,
                        styles.habitDataColumn,
                        isTodayDate && styles.todayColumn,
                      ]}
                    >
                      <TouchableOpacity
                        style={[
                          styles.checkbox,
                          isCompleted && styles.checkedBox,
                          isPastDate && !isCompleted && styles.missedBox,
                          isTodayDate && styles.todayCheckbox,
                          { borderColor: getHabitColor(habit) },
                        ]}
                        onPress={() => handleHabitToggle(habit.id, date)}
                      >
                        {isCompleted && <Text style={styles.checkmark}>✓</Text>}
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Go to Today Button */}
      <TouchableOpacity
        style={styles.todayButton}
        onPress={() => {
          setCurrentWeekStart(getWeekStart(new Date()));
          if (onSwitchToDaily) onSwitchToDaily();
        }}
      >
        <Text style={styles.todayButtonText}>Go to Today</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60, // Added top padding for notch/camera
    paddingBottom: 18,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  navButtonText: {
    fontSize: 24,
    color: colors.textSecondary,
    fontWeight: 'bold',
  },
  weekTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: Platform.select({
      ios: 'Times New Roman',
      android: 'serif',
    }),
    color: colors.textPrimary,
  },
  row: {
    flexDirection: 'row',
  },
  habitsContainer: {
    maxHeight: '100%',
  },
  habitRow: {
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  habitNameColumn: {
    width: dayWidth * 3, // Increased from 2.5 to 3 for wider column
    paddingHorizontal: 12,
    justifyContent: 'center',
    height: 48,
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  habitInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  habitIcon: {
    fontSize: 16,
  },
  habitName: {
    fontSize: 12,
    fontFamily: Platform.select({
      ios: 'Times New Roman',
      android: 'serif',
    }),
    fontWeight: '500',
    flex: 1,
    marginHorizontal: 4,
  },
  highPriorityText: {
    color: colors.error, // Red for high priority
  },
  normalPriorityText: {
    color: colors.textPrimary, // Normal color
  },
  lowPriorityText: {
    color: colors.textSecondary, // Gray for low priority
  },
  editIcon: {
    fontSize: 8, // Reduced from 10
    color: colors.textLight,
    marginLeft: 4,
  },
  dayColumn: {
    width: dayWidth,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    paddingHorizontal: 2,
  },
  headerRow: {
    height: 48,
  },
  headerColumn: {
    backgroundColor: colors.primary,
    elevation: 1,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  habitDataColumn: {
    backgroundColor: colors.surface,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border + '30',
  },
  habitHeaderText: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: Platform.select({
      ios: 'Times New Roman',
      android: 'serif',
    }),
    color: colors.textInverse,
    textAlign: 'center',
  },
  dayText: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: Platform.select({
      ios: 'Times New Roman',
      android: 'serif',
    }),
    color: colors.textInverse,
    textAlign: 'center',
  },
  todayHeaderColumn: {
    backgroundColor: colors.primaryDark,
  },
  todayHeaderText: {
    color: colors.textInverse,
    fontWeight: 'bold',
  },
  todayColumn: {
    backgroundColor: colors.primaryLight + '20',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  checkedBox: {
    backgroundColor: colors.success,
    borderColor: colors.success,
    elevation: 3,
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  missedBox: {
    backgroundColor: colors.error + '20',
    borderColor: colors.error + '60',
  },
  todayCheckbox: {
    borderColor: colors.primary,
    borderWidth: 3,
  },
  checkmark: {
    color: colors.textInverse,
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  todayButton: {
    backgroundColor: colors.primary,
    marginHorizontal: 20,
    marginVertical: 16,
    paddingVertical: 14,
    borderRadius: 28,
    alignItems: 'center',
    elevation: 6,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  todayButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: Platform.select({
      ios: 'Times New Roman',
      android: 'serif',
    }),
    color: colors.textInverse,
  },
});

export default WeeklyView;
