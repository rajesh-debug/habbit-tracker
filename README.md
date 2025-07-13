# Habit Tracker App

A React Native mobile application built with Expo to help users establish and sustain daily habits while addressing procrastination.

## Features

### Core Features
- **Habit Management**: Add, edit, or delete habits with icon selection
- **Habit Tracking**: Mark habits as completed/uncompleted daily with streak tracking
- **Weekly View**: Continuous scrollable calendar view for tick-off across the week
- **Icon Selection**: Choose from 30+ emoji icons to personalize your habits
- **Local Storage**: All data stored locally using AsyncStorage (offline-capable)
- **Clean UI**: Minimalist design with high-contrast text for accessibility

### Anti-Procrastination Features
- **Daily Motivational Quotes**: Random inspirational quote refreshed daily
- **Local Notifications**: Daily reminders at 7:00 PM for incomplete habits
- **Progress Visualization**: Bar chart showing streak lengths for all habits
- **Focus Mode**: 5-minute timer for focused habit completion

## Installation

1. **Prerequisites**
   - Node.js (14 or newer)
   - Expo CLI: `npm install -g @expo/cli`
   - iOS Simulator (for iOS testing) or Android Studio (for Android testing)

2. **Clone and Install**
   ```bash
   cd Habbit-Tracker
   npm install
   ```

3. **Start Development Server**
   ```bash
   npx expo start
   ```

4. **Run on Device/Simulator**
   - For iOS: Press `i` or scan QR code with Camera app
   - For Android: Press `a` or scan QR code with Expo Go app
   - For Web: Press `w`

## Usage

### Adding Habits
1. Tap the floating "+" button at the bottom right
2. Enter habit name (e.g., "Exercise 30 minutes")
3. Choose an icon from the picker or use a quick suggestion
4. Tap "Add" to create the habit
5. Habit appears in the list with selected icon and 0-day streak

### Tracking Habits

#### Daily View
1. Tap the checkbox next to any habit to mark as completed
2. Completed habits show strikethrough text and green checkmark
3. Streak increments by 1 for each consecutive day completed
4. Daily completion status resets at midnight

#### Weekly View
1. Tap "Weekly" in the view toggle at the top
2. Scroll horizontally to see different weeks
3. Tap any checkbox to mark habits complete for specific dates
4. Green background indicates today's column
5. Red background shows missed days for incomplete habits

### Focus Mode
1. Tap the "🎯 Focus" button below any incomplete habit
2. 5-minute timer starts to help you focus on that specific habit
3. App prompts to mark habit as completed when timer ends

### Progress Visualization
1. Tap "Show Progress Chart" to view streak data
2. Bar chart displays streak lengths for all habits
3. Chart shows up to 10 habits for optimal performance

### Notifications
1. App requests notification permissions on first launch
2. Daily reminders sent at 7:00 PM for incomplete habits
3. Notifications automatically update as habits are completed

## Technical Architecture

### Dependencies
- **@react-native-async-storage/async-storage**: Local data persistence
- **expo-notifications**: Push notification management
- **react-native-chart-kit**: Chart visualization
- **react-native-svg**: SVG support for charts

### Data Models
```javascript
// Habit
{
  id: "string",           // Unique timestamp ID
  name: "string",         // Habit name
  icon: {                 // Habit icon object
    id: "string",         // Icon identifier
    emoji: "string",      // Emoji character
    label: "string"       // Icon label
  },
  completed: false,       // Daily completion status
  streak: 0,              // Consecutive days completed
  lastCompleted: null,    // ISO date string
  completionHistory: {}   // Object mapping dates to completion status
}

// Daily Quote
{
  quote: "string",        // Motivational quote text
  date: "string"          // ISO date (YYYY-MM-DD)
}
```

### File Structure
```
components/
  ├── HabitItem.js          # Individual habit list item with icon
  ├── ProgressChart.js      # Streak visualization chart
  ├── FocusMode.js          # 5-minute focus timer modal
  ├── WeeklyView.js         # Weekly calendar view
  ├── AddHabitModal.js      # Modal for adding new habits
  ├── IconPicker.js         # Icon selection component
  └── EmptyState.js         # Empty state component

screens/
  └── HomeScreen.js         # Main app screen with view toggle

services/
  └── notificationService.js # Notification management

utils/
  ├── habitStorage.js       # AsyncStorage data operations
  ├── quotes.js             # Motivational quotes collection
  └── habitIcons.js         # Available habit icons
```

## Performance Notes

- **Chart Limit**: Progress chart displays maximum 10 habits for performance
- **Load Time**: App loads in <2 seconds with up to 50 habits
- **Memory**: Efficiently handles habit data with AsyncStorage
- **Notifications**: Optimized to schedule only for incomplete habits

## Platform Compatibility

- **iOS**: 12.0 or later
- **Android**: 9.0 (API level 28) or later
- **Web**: Modern browsers with ES6 support

## Privacy & Data

- **Local Storage Only**: All data stored on device using AsyncStorage
- **No Backend**: No server communication or data collection
- **Offline Capable**: Fully functional without internet connection
- **Notification Permissions**: Required for daily reminders

## Development

### Building for Production
```bash
# iOS
npx expo build:ios

# Android
npx expo build:android
```

### Running Tests
```bash
npm test
```

### Environment Setup
- Ensure Expo CLI is installed globally
- For notifications testing, use physical device (simulators have limitations)
- Chart performance best tested on actual devices

## Troubleshooting

### Common Issues
1. **Notifications not working**: Check device notification permissions
2. **Chart not displaying**: Ensure react-native-svg is properly installed
3. **Data not persisting**: Check AsyncStorage permissions
4. **App crashes**: Verify all dependencies are compatible versions

### Reset App Data
To clear all habits and quotes:
```javascript
// In AsyncStorage debug console
AsyncStorage.clear()
```

## Future Enhancements

- Customizable reminder times
- Cloud synchronization (Firebase)
- Habit categories and tags
- Weekly/monthly progress reports
- Gamification with badges
- Calendar view for habit history
- Export data functionality

## License

This project is open source and available under the MIT License.

## Contributing

1. Fork the repository
2. Create feature branch
3. Submit pull request with detailed description

Built with ❤️ using React Native and Expo# habbit-tracker
