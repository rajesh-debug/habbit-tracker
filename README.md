# Looply - Smart Habit Tracker

A React Native mobile application built with Expo to help users build consistent loops of positive behavior and break the cycle of procrastination.

## 🔄 What is Looply?

Looply is designed around the concept of creating positive feedback loops in your daily routine. The app helps you establish habits as continuous "loops" that reinforce themselves over time, making it easier to maintain long-term behavior change.

## ✨ Features

### Core Features
- **Habit Loop Management**: Add, edit, or delete habits with icon selection
- **Smart Tracking**: Mark habits as completed/uncompleted daily with streak tracking
- **Weekly Loop View**: Continuous scrollable calendar view for tracking across the week
- **Priority System**: Color-coded habits (High: Red, Normal: Black, Low: Gray)
- **Icon Selection**: Choose from 30+ emoji icons to personalize your habits
- **Local Storage**: All data stored locally using AsyncStorage (offline-capable)
- **Elegant UI**: Clean design with serif fonts and Facebook-inspired blue theme

### Anti-Procrastination Features
- **Daily Motivational Quotes**: Random inspirational quote refreshed daily
- **Smart Notifications**: 
  - Daily reminders at 7:00 PM for incomplete habits
  - Custom timer reminders for high-priority habits
  - Bad habit interruption reminders every 30 minutes
- **Progress Visualization**: Bar chart showing streak lengths for all habits
- **Focus Mode**: 5-minute timer for focused habit completion
- **One-Click Protection**: Prevents accidental unchecking of completed habits

## 🚀 Installation

1. **Prerequisites**
   - Node.js (14 or newer)
   - Expo CLI: `npm install -g @expo/cli`
   - iOS Simulator (for iOS testing) or Android Studio (for Android testing)

2. **Clone and Install**
   ```bash
   cd Looply
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

## 📱 Usage

### Creating Habit Loops
1. Tap the floating "+" button at the bottom right
2. Enter habit name (e.g., "Exercise 30 minutes")
3. Choose habit type: Good Habit or Bad Habit to Break
4. Set priority level: High, Normal, or Low
5. Choose an icon from the picker or use a quick suggestion
6. Set custom reminder intervals if needed
7. Tap "Add" to create your habit loop

### Tracking Your Loops

#### Daily View
1. Tap the checkbox next to any habit to mark as completed
2. Completed habits show with strikethrough text and confirmation
3. One-click prevention: Tapping completed habits shows friendly reminder
4. Streak increments by 1 for each consecutive day completed
5. Priority-based coloring helps focus on important habits

#### Weekly View
1. Tap "Weekly" in the view toggle at the top
2. Scroll horizontally to see different weeks
3. Click on habit names in the first column to edit habits
4. Tap any checkbox to mark habits complete for specific dates
5. Green checkmarks show completed days
6. Red highlighting shows missed days for incomplete habits
7. High priority habits show "!" when time is missed

### Focus Mode
1. Tap the "🎯 Focus" button below any incomplete habit
2. 5-minute timer starts to help you focus on that specific habit
3. App prompts to mark habit as completed when timer ends

### Progress Visualization
1. Tap "Show Progress Chart" to view streak data
2. Bar chart displays streak lengths for all habits
3. Chart shows up to 10 habits for optimal performance

### Smart Notifications
1. App requests notification permissions on first launch
2. Daily reminders sent at 7:00 PM for incomplete habits
3. High-priority habits get configurable reminder intervals
4. Bad habits trigger interruption reminders every 30 minutes
5. Notifications automatically update as habits are completed

## 🏗️ Technical Architecture

### Dependencies
- **@react-native-async-storage/async-storage**: Local data persistence
- **expo-notifications**: Push notification management  
- **react-native-chart-kit**: Chart visualization
- **react-native-svg**: SVG support for charts

### Data Models
```javascript
// Habit Loop
{
  id: "string",               // Unique timestamp ID
  name: "string",             // Habit name
  type: "good" | "bad",       // Habit type
  priority: "low" | "normal" | "high", // Priority level
  reminderInterval: number,   // Custom reminder minutes
  icon: {                     // Habit icon object
    id: "string",             // Icon identifier
    emoji: "string",          // Emoji character
    label: "string"           // Icon label
  },
  completed: false,           // Daily completion status
  streak: 0,                  // Consecutive days completed
  failedDays: 0,              // Consecutive failed days
  lastCompleted: null,        // ISO date string
  lastFailed: null,           // ISO date string
  completionHistory: {}       // Object mapping dates to completion status
}

// Daily Quote
{
  quote: "string",            // Motivational quote text
  date: "string"              // ISO date (YYYY-MM-DD)
}
```

### File Structure
```
components/
  ├── HabitItem.js              # Individual habit list item with priority colors
  ├── ProgressChart.js          # Streak visualization chart
  ├── FocusMode.js              # 5-minute focus timer modal
  ├── WeeklyView.js             # Weekly calendar grid with edit functionality
  ├── AddHabitModal.js          # Modal for adding new habits with priority
  ├── EditHabitModal.js         # Modal for editing existing habits
  ├── SettingsModal.js          # App settings and notification preferences
  ├── IconPicker.js             # Icon selection component
  └── EmptyState.js             # Empty state component

screens/
  └── HomeScreen.js             # Main app screen with view toggle

services/
  └── notificationService.js    # Advanced notification management

utils/
  ├── habitStorage.js           # AsyncStorage data operations
  ├── quotes.js                 # Motivational quotes collection
  ├── habitIcons.js             # Available habit icons
  ├── colorTheme.js             # Facebook-inspired color theme
  ├── typography.js             # Serif font system
  └── settings.js               # App settings persistence
```

## 🎨 Design Philosophy

Looply uses a **Facebook-inspired blue theme (#1877F2)** with **serif fonts** for elegance and readability. The design emphasizes:

- **Visual Hierarchy**: Priority-based color coding
- **Feedback Loops**: Clear visual confirmation of actions
- **Minimal Friction**: One-tap habit completion
- **Smart Spacing**: Notch-aware design for modern phones
- **Rich Interactions**: Shadows, animations, and depth

## 🔧 Performance Notes

- **Chart Limit**: Progress chart displays maximum 10 habits for performance
- **Load Time**: App loads in <2 seconds with up to 50 habits
- **Memory**: Efficiently handles habit data with AsyncStorage
- **Notifications**: Optimized to schedule only for incomplete habits
- **Smart Caching**: Daily quotes cached to prevent redundant generation

## 📱 Platform Compatibility

- **iOS**: 12.0 or later
- **Android**: 9.0 (API level 28) or later  
- **Web**: Modern browsers with ES6 support

## 🔒 Privacy & Data

- **Local Storage Only**: All data stored on device using AsyncStorage
- **No Backend**: No server communication or data collection
- **Offline Capable**: Fully functional without internet connection
- **Notification Permissions**: Required for daily reminders

## 🏗️ Development

### Building for Production
```bash
# Using EAS Build (Recommended)
npm install -g eas-cli
eas login
eas build -p android --profile preview  # For APK
eas build -p ios --profile preview      # For iOS

# Local builds (requires setup)
npx expo run:android --variant release
npx expo run:ios --configuration Release
```

### Building APK
```bash
eas build -p android --profile preview
```

### Environment Setup
- Ensure Expo CLI is installed globally
- For notifications testing, use physical device (simulators have limitations)
- Chart performance best tested on actual devices

## 🚨 Troubleshooting

### Common Issues
1. **Notifications not working**: Check device notification permissions
2. **Chart not displaying**: Ensure react-native-svg is properly installed
3. **Data not persisting**: Check AsyncStorage permissions
4. **Build failures**: Use EAS Build instead of local builds

### Reset App Data
To clear all habits and quotes:
```javascript
// In AsyncStorage debug console
AsyncStorage.clear()
```

## 🔮 Future Enhancements

- **Cloud Synchronization**: Cross-device habit syncing
- **Advanced Analytics**: Weekly/monthly habit insights
- **Social Features**: Share streaks and compete with friends
- **Habit Categories**: Organize habits by life areas
- **Gamification**: Achievements and milestone rewards
- **Calendar Integration**: Sync with device calendar
- **Export/Import**: Backup and restore habit data
- **Dark Mode**: Alternative UI theme
- **Widget Support**: Home screen habit widgets

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Submit pull request with detailed description

## 🙏 Acknowledgments

Built with ❤️ using React Native and Expo.

**Looply** - Building better habits, one loop at a time. 🔄

---

*Version 1.0.0 - Package: com.looply.app*