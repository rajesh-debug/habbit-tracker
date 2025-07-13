// Available habit icons
export const habitIcons = [
  { id: 'exercise', emoji: '💪', label: 'Exercise' },
  { id: 'reading', emoji: '📚', label: 'Reading' },
  { id: 'meditation', emoji: '🧘', label: 'Meditation' },
  { id: 'water', emoji: '💧', label: 'Drink Water' },
  { id: 'sleep', emoji: '😴', label: 'Sleep' },
  { id: 'writing', emoji: '✍️', label: 'Writing' },
  { id: 'cooking', emoji: '🍳', label: 'Cooking' },
  { id: 'walking', emoji: '🚶', label: 'Walking' },
  { id: 'music', emoji: '🎵', label: 'Music' },
  { id: 'cleaning', emoji: '🧹', label: 'Cleaning' },
  { id: 'study', emoji: '📖', label: 'Study' },
  { id: 'yoga', emoji: '🧘‍♀️', label: 'Yoga' },
  { id: 'running', emoji: '🏃', label: 'Running' },
  { id: 'vitamins', emoji: '💊', label: 'Vitamins' },
  { id: 'journal', emoji: '📝', label: 'Journal' },
  { id: 'language', emoji: '🗣️', label: 'Language' },
  { id: 'art', emoji: '🎨', label: 'Art' },
  { id: 'code', emoji: '💻', label: 'Coding' },
  { id: 'garden', emoji: '🌱', label: 'Gardening' },
  { id: 'mindfulness', emoji: '🌸', label: 'Mindfulness' },
  { id: 'stretch', emoji: '🤸', label: 'Stretching' },
  { id: 'photo', emoji: '📸', label: 'Photography' },
  { id: 'call', emoji: '📞', label: 'Call Family' },
  { id: 'organize', emoji: '🗂️', label: 'Organize' },
  { id: 'budget', emoji: '💰', label: 'Budget' },
  { id: 'teeth', emoji: '🦷', label: 'Brush Teeth' },
  { id: 'skincare', emoji: '🧴', label: 'Skincare' },
  { id: 'pray', emoji: '🙏', label: 'Prayer' },
  { id: 'dance', emoji: '💃', label: 'Dancing' },
  { id: 'bike', emoji: '🚴', label: 'Cycling' },
  { id: 'swim', emoji: '🏊', label: 'Swimming' },
  { id: 'podcast', emoji: '🎧', label: 'Podcast' },
];

// Get icon by ID
export const getIconById = (iconId) => {
  return habitIcons.find(icon => icon.id === iconId) || habitIcons[0];
};

// Get random icon
export const getRandomIcon = () => {
  const randomIndex = Math.floor(Math.random() * habitIcons.length);
  return habitIcons[randomIndex];
};