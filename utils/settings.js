import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_KEY = 'appSettings';

// Default settings
const defaultSettings = {
  highPriorityReminderTime: '18:00', // 6:00 PM
  enableHighPriorityReminders: true,
  reminderFrequency: 'daily', // daily, hourly
  notifications: {
    dailyReminders: true,
    priorityReminders: true,
    badHabitReminders: true,
    customReminders: true,
  },
};

// Get app settings
export const getSettings = async () => {
  try {
    const settings = await AsyncStorage.getItem(SETTINGS_KEY);
    return settings ? { ...defaultSettings, ...JSON.parse(settings) } : defaultSettings;
  } catch (error) {
    console.error('Error getting settings:', error);
    return defaultSettings;
  }
};

// Save app settings
export const saveSettings = async (newSettings) => {
  try {
    const currentSettings = await getSettings();
    const updatedSettings = { ...currentSettings, ...newSettings };
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updatedSettings));
    return updatedSettings;
  } catch (error) {
    console.error('Error saving settings:', error);
    return null;
  }
};

// Update specific setting
export const updateSetting = async (key, value) => {
  try {
    const settings = await getSettings();
    const updatedSettings = { ...settings, [key]: value };
    await saveSettings(updatedSettings);
    return updatedSettings;
  } catch (error) {
    console.error('Error updating setting:', error);
    return null;
  }
};

// Get high priority reminder time
export const getHighPriorityReminderTime = async () => {
  const settings = await getSettings();
  return settings.highPriorityReminderTime;
};

// Set high priority reminder time
export const setHighPriorityReminderTime = async (time) => {
  return await updateSetting('highPriorityReminderTime', time);
};

// Check if high priority reminders are enabled
export const isHighPriorityRemindersEnabled = async () => {
  const settings = await getSettings();
  return settings.enableHighPriorityReminders;
};