import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Switch,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors } from '../utils/colorTheme';
import { getSettings, saveSettings } from '../utils/settings';

const SettingsModal = ({ visible, onClose, onSettingsChange }) => {
  const [settings, setSettings] = useState({});
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [reminderTime, setReminderTime] = useState(new Date());

  useEffect(() => {
    if (visible) {
      loadSettings();
    }
  }, [visible]);

  const loadSettings = async () => {
    try {
      const currentSettings = await getSettings();
      setSettings(currentSettings);
      
      // Parse time string to Date object
      const [hour, minute] = currentSettings.highPriorityReminderTime.split(':').map(Number);
      const timeDate = new Date();
      timeDate.setHours(hour, minute, 0, 0);
      setReminderTime(timeDate);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSaveSettings = async () => {
    try {
      const updatedSettings = await saveSettings(settings);
      if (updatedSettings) {
        onSettingsChange?.(updatedSettings);
        Alert.alert('Success', 'Settings saved successfully');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Error', 'Failed to save settings');
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setReminderTime(selectedTime);
      const timeString = selectedTime.toTimeString().slice(0, 5); // HH:MM format
      setSettings(prev => ({
        ...prev,
        highPriorityReminderTime: timeString,
      }));
    }
  };

  const toggleSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleNotificationSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key],
      },
    }));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Settings</Text>
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveSettings}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>High Priority Reminders</Text>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Enable high priority reminders</Text>
            <Switch
              value={settings.enableHighPriorityReminders}
              onValueChange={() => toggleSetting('enableHighPriorityReminders')}
              trackColor={{ false: colors.border, true: colors.primary + '50' }}
              thumbColor={settings.enableHighPriorityReminders ? colors.primary : colors.textLight}
            />
          </View>

          <TouchableOpacity 
            style={[styles.timePickerButton, !settings.enableHighPriorityReminders && styles.disabledButton]}
            onPress={() => settings.enableHighPriorityReminders && setShowTimePicker(true)}
            disabled={!settings.enableHighPriorityReminders}
          >
            <Text style={styles.timePickerLabel}>Reminder Time</Text>
            <Text style={[styles.timePickerText, !settings.enableHighPriorityReminders && styles.disabledText]}>
              {settings.highPriorityReminderTime}
            </Text>
          </TouchableOpacity>

          <Text style={styles.helpText}>
            Get reminded about incomplete high priority habits at this time daily.
          </Text>

          <Text style={styles.sectionTitle}>Notification Types</Text>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Daily habit reminders</Text>
            <Switch
              value={settings.notifications?.dailyReminders}
              onValueChange={() => toggleNotificationSetting('dailyReminders')}
              trackColor={{ false: colors.border, true: colors.primary + '50' }}
              thumbColor={settings.notifications?.dailyReminders ? colors.primary : colors.textLight}
            />
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Priority habit reminders</Text>
            <Switch
              value={settings.notifications?.priorityReminders}
              onValueChange={() => toggleNotificationSetting('priorityReminders')}
              trackColor={{ false: colors.border, true: colors.primary + '50' }}
              thumbColor={settings.notifications?.priorityReminders ? colors.primary : colors.textLight}
            />
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Bad habit reminders</Text>
            <Switch
              value={settings.notifications?.badHabitReminders}
              onValueChange={() => toggleNotificationSetting('badHabitReminders')}
              trackColor={{ false: colors.border, true: colors.primary + '50' }}
              thumbColor={settings.notifications?.badHabitReminders ? colors.primary : colors.textLight}
            />
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Custom timer reminders</Text>
            <Switch
              value={settings.notifications?.customReminders}
              onValueChange={() => toggleNotificationSetting('customReminders')}
              trackColor={{ false: colors.border, true: colors.primary + '50' }}
              thumbColor={settings.notifications?.customReminders ? colors.primary : colors.textLight}
            />
          </View>
        </View>

        {showTimePicker && (
          <DateTimePicker
            value={reminderTime}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={handleTimeChange}
          />
        )}
      </View>
    </Modal>
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
    color: colors.textPrimary,
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textInverse,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
    marginTop: 24,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  settingLabel: {
    fontSize: 16,
    color: colors.textPrimary,
    flex: 1,
  },
  timePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  disabledButton: {
    opacity: 0.5,
  },
  timePickerLabel: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  timePickerText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  disabledText: {
    color: colors.textLight,
  },
  helpText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
    marginBottom: 16,
  },
});

export default SettingsModal;