// Motivational quotes for daily inspiration
export const motivationalQuotes = [
  "The journey of a thousand miles begins with a single step. – Lao Tzu",
  "Success is the sum of small efforts repeated day in and day out. – Robert Collier",
  "We are what we repeatedly do. Excellence, then, is not an act, but a habit. – Aristotle",
  "The secret of getting ahead is getting started. – Mark Twain",
  "A goal is a dream with a deadline. – Napoleon Hill",
  "The best time to plant a tree was 20 years ago. The second best time is now. – Chinese Proverb",
  "Don't watch the clock; do what it does. Keep going. – Sam Levenson",
  "It does not matter how slowly you go as long as you do not stop. – Confucius",
  "The only impossible journey is the one you never begin. – Tony Robbins",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. – Winston Churchill",
  "The way to get started is to quit talking and begin doing. – Walt Disney",
  "Your limitation—it's only your imagination.",
  "Push yourself, because no one else is going to do it for you.",
  "Great things never come from comfort zones.",
  "Dream it. Wish it. Do it.",
  "Success doesn't just find you. You have to go out and get it.",
  "The harder you work for something, the greater you'll feel when you achieve it.",
  "Dream bigger. Do bigger.",
  "Don't stop when you're tired. Stop when you're done.",
  "Wake up with determination. Go to bed with satisfaction.",
  "Do something today that your future self will thank you for.",
  "Little things make big days.",
  "It's going to be hard, but hard does not mean impossible.",
  "Don't wish it were easier; wish you were better. – Jim Rohn",
  "If you want something you've never had, you must be willing to do something you've never done.",
];

// Get a random quote for today
export const getRandomQuote = () => {
  const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
  return motivationalQuotes[randomIndex];
};

// Get quote based on date to ensure same quote per day
export const getDailyQuote = () => {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  const quoteIndex = dayOfYear % motivationalQuotes.length;
  return motivationalQuotes[quoteIndex];
};