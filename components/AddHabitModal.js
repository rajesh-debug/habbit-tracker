import React, { useState } from 'react';
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

const AddHabitModal = ({ visible, onClose, onAddHabit }) => {
  const [habitName, setHabitName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [habitType, setHabitType] = useState('good');
  const [priority, setPriority] = useState('normal');
  const [hasCustomReminder, setHasCustomReminder] = useState(false);
  const [reminderInterval, setReminderInterval] = useState('30');

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

  const handleAddHabit = async () => {
    if (!habitName.trim()) {
      Alert.alert('Error', 'Please enter a habit name.');
      return;
    }

    const iconToUse = selectedIcon || getRandomIcon();
    const customInterval = hasCustomReminder ? parseInt(reminderInterval) : null;
    
    const success = await onAddHabit(
      habitName.trim(), 
      iconToUse, 
      habitType, 
      priority, 
      customInterval
    );
    
    if (success) {
      resetForm();
      onClose();
    } else {
      Alert.alert('Error', 'Failed to add habit. Please try again.');
    }
  };

  const openIconPicker = () => {
    setShowIconPicker(true);
  };

  const handleIconSelect = (icon) => {
    setSelectedIcon(icon);
    setShowIconPicker(false);
  };

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
            <Text style={styles.title}>New Habit</Text>
            <TouchableOpacity 
              style={[styles.addButton, !habitName.trim() && styles.disabledButton]} 
              onPress={handleAddHabit}
              disabled={!habitName.trim()}
            >
              <Text style={[styles.addButtonText, !habitName.trim() && styles.disabledButtonText]}>
                Add
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
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleAddHabit}
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
            <Text style={styles.helpText}>
              {habitType === 'good' 
                ? 'Track positive habits you want to build' 
                : 'Track negative habits you want to avoid'
              }
            </Text>

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
            
            <Text style={styles.helpText}>
              Custom reminders work independently of the daily and priority notifications.
            </Text>

            {/* Quick Add Suggestions */}
            <View style={styles.suggestions}>
              <Text style={styles.sectionTitle}>Quick Suggestions</Text>
              <View style={styles.suggestionGrid}>
                {quickSuggestions.map((suggestion, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestionItem}
                    onPress={() => {
                      setHabitName(suggestion.name);
                      setSelectedIcon(suggestion.icon);
                      setHabitType(suggestion.type || 'good');
                      setPriority(suggestion.priority || 'normal');
                    }}
                  >
                    <Text style={styles.suggestionIcon}>{suggestion.icon.emoji}</Text>
                    <Text style={styles.suggestionText}>{suggestion.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
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

const quickSuggestions = [
  { 
    name: 'Drink 8 glasses of water', 
    icon: { id: 'water', emoji: '💧', label: 'Water' },
    type: 'good',
    priority: 'high'
  },
  { 
    name: 'Exercise for 30 minutes', 
    icon: { id: 'exercise', emoji: '💪', label: 'Exercise' },
    type: 'good',
    priority: 'high'
  },
  { 
    name: 'Read for 20 minutes', 
    icon: { id: 'reading', emoji: '📚', label: 'Reading' },
    type: 'good',
    priority: 'normal'
  },
  { 
    name: 'Avoid social media', 
    icon: { id: 'phone', emoji: '📱', label: 'Phone' },
    type: 'bad',
    priority: 'high'
  },
  { 
    name: 'No junk food', 
    icon: { id: 'food', emoji: '🍔', label: 'Food' },
    type: 'bad',
    priority: 'normal'
  },
  { 
    name: 'Meditate for 10 minutes', 
    icon: { id: 'meditation', emoji: '🧘', label: 'Meditation' },
    type: 'good',
    priority: 'normal'
  },
];

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
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  disabledButton: {
    backgroundColor: colors.textLight,
  },
  addButtonText: {
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
    color: '#333',
    marginBottom: 12,
    marginTop: 24,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 8,
  },
  characterCount: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginBottom: 16,
  },
  iconSelector: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 8,
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
    color: '#333',
    fontWeight: '500',
  },
  placeholderIcon: {
    fontSize: 24,
    opacity: 0.5,
  },
  placeholderText: {
    fontSize: 16,
    color: '#666',
  },
  chevron: {
    fontSize: 18,
    color: '#666',
  },
  helpText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
    marginBottom: 8,
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
    color: colors.textPrimary,
    fontWeight: '500',
  },
  activePriorityButtonText: {
    color: colors.textInverse,
  },
  reminderContainer: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
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
    color: colors.textSecondary,
  },
  intervalInput: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 60,
    textAlign: 'center',
  },
  suggestions: {
    marginTop: 16,
  },
  suggestionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  suggestionItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    minWidth: '45%',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  suggestionIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  suggestionText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default AddHabitModal;