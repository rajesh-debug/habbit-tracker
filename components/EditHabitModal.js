import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
} from 'react-native';
import IconPicker from './IconPicker';
import { getRandomIcon } from '../utils/habitIcons';
import { colors } from '../utils/colorTheme';
import { textStyles } from '../utils/typography';

const EditHabitModal = ({ visible, habit, onClose, onUpdateHabit, onDeleteHabit }) => {
  const [habitName, setHabitName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [habitType, setHabitType] = useState('good');
  const [priority, setPriority] = useState('normal');
  const [hasCustomReminder, setHasCustomReminder] = useState(false);
  const [reminderInterval, setReminderInterval] = useState('30');

  // Initialize form with habit data
  useEffect(() => {
    if (habit) {
      setHabitName(habit.name || '');
      setSelectedIcon(habit.icon || null);
      setHabitType(habit.type || 'good');
      setPriority(habit.priority || 'normal');
      setHasCustomReminder(!!habit.reminderInterval);
      setReminderInterval(habit.reminderInterval?.toString() || '30');
    }
  }, [habit]);

  const resetForm = () => {
    setHabitName('');
    setSelectedIcon(null);
    setShowIconPicker(false);
    setHabitType('good');
    setPriority('normal');
    setHasCustomReminder(false);
    setReminderInterval('30');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleUpdateHabit = async () => {
    if (!habitName.trim()) {
      Alert.alert('Error', 'Please enter a habit name.');
      return;
    }

    const iconToUse = selectedIcon || getRandomIcon();
    const customInterval = hasCustomReminder ? parseInt(reminderInterval) : null;
    
    const updatedHabit = {
      ...habit,
      name: habitName.trim(),
      icon: iconToUse,
      type: habitType,
      priority: priority,
      reminderInterval: customInterval,
    };
    
    const success = await onUpdateHabit(updatedHabit);
    
    if (success) {
      handleClose();
    } else {
      Alert.alert('Error', 'Failed to update habit. Please try again.');
    }
  };

  const handleDeleteHabit = () => {
    Alert.alert(
      'Delete Habit',
      `Are you sure you want to delete "${habit?.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: async () => {
            const success = await onDeleteHabit(habit.id);
            if (success) {
              handleClose();
            }
          }
        },
      ]
    );
  };

  const openIconPicker = () => {
    setShowIconPicker(true);
  };

  const handleIconSelect = (icon) => {
    setSelectedIcon(icon);
    setShowIconPicker(false);
  };

  if (!habit) return null;

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleClose}
      >
        <KeyboardAvoidingView 
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.header}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Edit Habit</Text>
            <TouchableOpacity 
              style={[styles.saveButton, !habitName.trim() && styles.disabledButton]} 
              onPress={handleUpdateHabit}
              disabled={!habitName.trim()}
            >
              <Text style={[styles.saveButtonText, !habitName.trim() && styles.disabledButtonText]}>
                Save
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <Text style={styles.sectionTitle}>Habit Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Exercise for 30 minutes"
              value={habitName}
              onChangeText={setHabitName}
              maxLength={50}
              returnKeyType="done"
              onSubmitEditing={handleUpdateHabit}
            />
            <Text style={styles.characterCount}>{habitName.length}/50</Text>

            <Text style={styles.sectionTitle}>Habit Type</Text>
            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[styles.typeButton, habitType === 'good' && styles.activeTypeButton]}
                onPress={() => setHabitType('good')}
              >
                <Text style={[styles.typeButtonText, habitType === 'good' && styles.activeTypeButtonText]}>
                  ✅ Good Habit
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeButton, habitType === 'bad' && styles.activeTypeButton]}
                onPress={() => setHabitType('bad')}
              >
                <Text style={[styles.typeButtonText, habitType === 'bad' && styles.activeTypeButtonText]}>
                  🚫 Bad Habit
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Priority</Text>
            <View style={styles.prioritySelector}>
              {['low', 'normal', 'high'].map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[styles.priorityButton, priority === level && styles.activePriorityButton]}
                  onPress={() => setPriority(level)}
                >
                  <Text style={[styles.priorityButtonText, priority === level && styles.activePriorityButtonText]}>
                    {level === 'low' && '⬇️ Low'}
                    {level === 'normal' && '➡️ Normal'}
                    {level === 'high' && '⬆️ High'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Icon</Text>
            <TouchableOpacity style={styles.iconSelector} onPress={openIconPicker}>
              <View style={styles.iconDisplay}>
                {selectedIcon ? (
                  <>
                    <Text style={styles.selectedIcon}>{selectedIcon.emoji}</Text>
                    <Text style={styles.selectedIconLabel}>{selectedIcon.label}</Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.placeholderIcon}>🎯</Text>
                    <Text style={styles.placeholderText}>Choose Icon</Text>
                  </>
                )}
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>Custom Reminders</Text>
            <View style={styles.reminderContainer}>
              <View style={styles.reminderHeader}>
                <Text style={styles.reminderLabel}>Enable custom timer reminders</Text>
                <Switch
                  value={hasCustomReminder}
                  onValueChange={setHasCustomReminder}
                  trackColor={{ false: colors.border, true: colors.primary + '50' }}
                  thumbColor={hasCustomReminder ? colors.primary : colors.textLight}
                />
              </View>
              {hasCustomReminder && (
                <View style={styles.intervalContainer}>
                  <Text style={styles.intervalLabel}>Reminder interval (minutes):</Text>
                  <TextInput
                    style={styles.intervalInput}
                    value={reminderInterval}
                    onChangeText={setReminderInterval}
                    keyboardType="numeric"
                    placeholder="30"
                    maxLength={3}
                  />
                </View>
              )}
            </View>

            {/* Habit Statistics */}
            <View style={styles.statsContainer}>
              <Text style={styles.sectionTitle}>Statistics</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{habit.streak}</Text>
                  <Text style={styles.statLabel}>Current Streak</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{habit.failedDays || 0}</Text>
                  <Text style={styles.statLabel}>Failed Days</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    {Object.keys(habit.completionHistory || {}).filter(date => 
                      habit.completionHistory[date]
                    ).length}
                  </Text>
                  <Text style={styles.statLabel}>Total Complete</Text>
                </View>
              </View>
            </View>

            {/* Delete Button */}
            <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteHabit}>
              <Text style={styles.deleteButtonText}>🗑️ Delete Habit</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>

      <IconPicker
        visible={showIconPicker}
        selectedIcon={selectedIcon}
        onSelectIcon={handleIconSelect}
        onClose={() => setShowIconPicker(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  cancelButtonText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: textStyles.h4.fontFamily,
    color: colors.textPrimary,
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  disabledButton: {
    backgroundColor: colors.textLight,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textInverse,
  },
  disabledButtonText: {
    color: colors.textSecondary,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: textStyles.h5.fontFamily,
    color: colors.textPrimary,
    marginBottom: 12,
    marginTop: 24,
  },
  input: {
    fontSize: 16,
    fontFamily: textStyles.input.fontFamily,
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  characterCount: {
    fontSize: 12,
    fontFamily: textStyles.caption.fontFamily,
    color: colors.textSecondary,
    textAlign: 'right',
    marginBottom: 16,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  activeTypeButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeButtonText: {
    fontSize: 14,
    fontFamily: textStyles.bodySecondary.fontFamily,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  activeTypeButtonText: {
    color: colors.textInverse,
  },
  prioritySelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  activePriorityButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  priorityButtonText: {
    fontSize: 12,
    fontFamily: textStyles.caption.fontFamily,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  activePriorityButtonText: {
    color: colors.textInverse,
  },
  iconSelector: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  iconDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  selectedIcon: {
    fontSize: 24,
  },
  selectedIconLabel: {
    fontSize: 16,
    fontFamily: textStyles.bodyText.fontFamily,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  placeholderIcon: {
    fontSize: 24,
    opacity: 0.5,
  },
  placeholderText: {
    fontSize: 16,
    fontFamily: textStyles.bodyText.fontFamily,
    color: colors.textSecondary,
  },
  chevron: {
    fontSize: 18,
    color: colors.textSecondary,
  },
  reminderContainer: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reminderLabel: {
    fontSize: 14,
    fontFamily: textStyles.bodySecondary.fontFamily,
    color: colors.textPrimary,
    fontWeight: '500',
    flex: 1,
  },
  intervalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  intervalLabel: {
    fontSize: 14,
    fontFamily: textStyles.bodySecondary.fontFamily,
    color: colors.textSecondary,
  },
  intervalInput: {
    fontSize: 14,
    fontFamily: textStyles.bodySecondary.fontFamily,
    backgroundColor: colors.surfaceLight,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 60,
    textAlign: 'center',
  },
  statsContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: textStyles.h3.fontFamily,
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: textStyles.caption.fontFamily,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  deleteButton: {
    backgroundColor: colors.error,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 32,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: textStyles.buttonText.fontFamily,
    color: colors.textInverse,
  },
});

export default EditHabitModal;