import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
  RefreshControl,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import HabitItem from '../components/HabitItem';
import ProgressChart from '../components/ProgressChart';
import FocusMode from '../components/FocusMode';
import WeeklyView from '../components/WeeklyView';
import AddHabitModal from '../components/AddHabitModal';
import EditHabitModal from '../components/EditHabitModal';
import SettingsModal from '../components/SettingsModal';
import { colors } from '../utils/colorTheme';
import {
  getHabits,
  addHabit,
  updateHabit,
  toggleHabitCompletion,
  deleteHabit,
  resetDailyCompletions,
  getDailyQuote,
  saveDailyQuote,
} from '../utils/habitStorage';
import { getDailyQuote as getRandomDailyQuote } from '../utils/quotes';
import {
  requestNotificationPermissions,
  scheduleDailyReminders,
} from '../services/notificationService';

const HomeScreen = () => {
  const [habits, setHabits] = useState([]);
  const [dailyQuote, setDailyQuote] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [viewMode, setViewMode] = useState('daily'); // 'daily' or 'weekly'
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [focusMode, setFocusMode] = useState({
    visible: false,
    habit: null,
  });

  // Load initial data
  useEffect(() => {
    loadData();
    requestNotificationPermissions();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Reset daily completions for new day
      await resetDailyCompletions();
      
      // Load habits
      const habitsData = await getHabits();
      setHabits(habitsData);
      
      // Load or generate daily quote
      await loadDailyQuote();
      
      // Schedule notifications for incomplete habits
      await scheduleDailyReminders(habitsData.filter(h => !h.completed));
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadDailyQuote = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const savedQuote = await getDailyQuote();
      
      if (savedQuote && savedQuote.date === today) {
        setDailyQuote(savedQuote.quote);
      } else {
        const newQuote = getRandomDailyQuote();
        setDailyQuote(newQuote);
        await saveDailyQuote({ quote: newQuote, date: today });
      }
    } catch (error) {
      console.error('Error loading daily quote:', error);
      setDailyQuote('Make today count!');
    }
  };

  const handleAddHabit = async (name, icon, type, priority, reminderInterval) => {
    const success = await addHabit(name, icon, type, priority, reminderInterval);
    if (success) {
      const updatedHabits = await getHabits();
      setHabits(updatedHabits);
      return true;
    } else {
      return false;
    }
  };

  const handleToggleHabit = async (habitId, date = null) => {
    const updatedHabits = await toggleHabitCompletion(habitId, date);
    if (updatedHabits) {
      setHabits(updatedHabits);
      // Update notifications only for today's changes
      if (!date || date === new Date().toISOString().split('T')[0]) {
        await scheduleDailyReminders(updatedHabits.filter(h => !h.completed));
      }
    }
  };

  const handleUpdateHabit = async (updatedHabit) => {
    const updatedHabits = await updateHabit(updatedHabit);
    if (updatedHabits) {
      setHabits(updatedHabits);
      // Update notifications
      await scheduleDailyReminders(updatedHabits);
      return true;
    }
    return false;
  };

  const handleDeleteHabit = async (habitId) => {
    const updatedHabits = await deleteHabit(habitId);
    if (updatedHabits) {
      setHabits(updatedHabits);
      // Update notifications
      await scheduleDailyReminders(updatedHabits.filter(h => !h.completed));
      return true;
    }
    return false;
  };

  const handleEditHabit = (habit) => {
    setEditingHabit(habit);
    setShowEditModal(true);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  const openFocusMode = (habit) => {
    if (habit.completed) {
      Alert.alert('Already Completed', 'This habit is already completed for today!');
      return;
    }
    setFocusMode({ visible: true, habit });
  };

  const closeFocusMode = () => {
    setFocusMode({ visible: false, habit: null });
  };

  const renderHabitItem = ({ item }) => (
    <View>
      <HabitItem
        habit={item}
        onToggle={handleToggleHabit}
        onDelete={handleDeleteHabit}
        onEdit={handleEditHabit}
      />
      <TouchableOpacity
        style={styles.focusButton}
        onPress={() => openFocusMode(item)}
      >
        <Text style={styles.focusButtonText}>🎯 Focus</Text>
      </TouchableOpacity>
    </View>
  );

  const completedHabits = habits.filter(h => h.completed).length;
  const totalHabits = habits.length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header with View Toggle */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => setShowSettingsModal(true)}
        >
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={styles.viewToggle}>
            <TouchableOpacity
              style={[styles.toggleButton, viewMode === 'daily' && styles.activeToggle]}
              onPress={() => setViewMode('daily')}
            >
              <Text style={[styles.toggleText, viewMode === 'daily' && styles.activeToggleText]}>
                Daily
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, viewMode === 'weekly' && styles.activeToggle]}
              onPress={() => setViewMode('weekly')}
            >
              <Text style={[styles.toggleText, viewMode === 'weekly' && styles.activeToggleText]}>
                Weekly
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {viewMode === 'weekly' ? (
        <WeeklyView 
          habits={habits} 
          onToggleHabit={handleToggleHabit}
          onSwitchToDaily={() => setViewMode('daily')}
          onEditHabit={handleEditHabit}
        />
      ) : (
        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Daily Quote */}
          <View style={styles.quoteContainer}>
            <Text style={styles.quoteText}>"{dailyQuote}"</Text>
          </View>

          {/* Progress Summary */}
          {totalHabits > 0 && (
            <View style={styles.progressSummary}>
              <Text style={styles.progressText}>
                Today's Progress: {completedHabits}/{totalHabits} habits completed
              </Text>
              <View style={styles.progressBarContainer}>
                <View 
                  style={[
                    styles.progressBar, 
                    { width: `${totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0}%` }
                  ]} 
                />
              </View>
            </View>
          )}

          {/* Chart Toggle */}
          {habits.length > 0 && (
            <TouchableOpacity
              style={styles.chartToggle}
              onPress={() => setShowChart(!showChart)}
            >
              <Text style={styles.chartToggleText}>
                {showChart ? 'Hide' : 'Show'} Progress Chart
              </Text>
            </TouchableOpacity>
          )}

          {/* Progress Chart */}
          {showChart && <ProgressChart habits={habits} />}

          {/* Habits List */}
          <View style={styles.habitsContainer}>
            {habits.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  No habits yet. Tap the + button to add your first habit!
                </Text>
              </View>
            ) : (
              <FlatList
                data={habits}
                renderItem={renderHabitItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </ScrollView>
      )}

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.floatingAddButton}
        onPress={() => setShowAddModal(true)}
      >
        <Text style={styles.floatingAddText}>+</Text>
      </TouchableOpacity>

      {/* Add Habit Modal */}
      <AddHabitModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddHabit={handleAddHabit}
      />

      {/* Edit Habit Modal */}
      <EditHabitModal
        visible={showEditModal}
        habit={editingHabit}
        onClose={() => {
          setShowEditModal(false);
          setEditingHabit(null);
        }}
        onUpdateHabit={handleUpdateHabit}
        onDeleteHabit={handleDeleteHabit}
      />

      {/* Settings Modal */}
      <SettingsModal
        visible={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        onSettingsChange={async () => {
          // Reload notifications when settings change
          await scheduleDailyReminders(habits);
        }}
      />

      {/* Focus Mode Modal */}
      <FocusMode
        visible={focusMode.visible}
        habit={focusMode.habit}
        onClose={closeFocusMode}
        onComplete={handleToggleHabit}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa', // Softer background
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60, // Increased from 20 to 60 for notch/camera spacing
    paddingBottom: 20,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  settingsIcon: {
    fontSize: 20,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: Platform.select({
      ios: 'Times New Roman',
      android: 'serif',
    }),
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 16,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceLight,
    borderRadius: 8,
    padding: 4,
    alignSelf: 'center',
  },
  toggleButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
  },
  activeToggle: {
    backgroundColor: colors.primary,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Platform.select({
      ios: 'Times New Roman',
      android: 'serif',
    }),
    color: colors.textSecondary,
  },
  activeToggleText: {
    color: colors.textInverse,
  },
  quoteContainer: {
    backgroundColor: colors.primary,
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 16,
    padding: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  quoteText: {
    fontSize: 16,
    fontFamily: Platform.select({
      ios: 'Times New Roman',
      android: 'serif',
    }),
    color: colors.textInverse,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 24,
  },
  progressSummary: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.select({
      ios: 'Times New Roman',
      android: 'serif',
    }),
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  chartToggle: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: colors.border + '30',
  },
  chartToggleText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.select({
      ios: 'Times New Roman',
      android: 'serif',
    }),
    color: colors.primary,
  },
  habitsContainer: {
    paddingBottom: 32,
  },
  emptyState: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: Platform.select({
      ios: 'Times New Roman',
      android: 'serif',
    }),
    color: '#666',
    textAlign: 'center',
  },
  focusButton: {
    backgroundColor: '#ff9800',
    marginHorizontal: 16,
    marginTop: -6,
    marginBottom: 12,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  focusButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Platform.select({
      ios: 'Times New Roman',
      android: 'serif',
    }),
  },
  floatingAddButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  floatingAddText: {
    fontSize: 32,
    fontFamily: Platform.select({
      ios: 'Times New Roman',
      android: 'serif',
    }),
    color: colors.textInverse,
    fontWeight: '300',
    lineHeight: 32,
  },
});

export default HomeScreen;