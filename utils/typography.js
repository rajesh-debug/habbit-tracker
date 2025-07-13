import { Platform } from 'react-native';

// Best serif fonts available on iOS and Android
export const fonts = {
  // Serif fonts for elegant, readable text
  serif: {
    regular: Platform.select({
      ios: 'Times New Roman',
      android: 'serif',
    }),
    bold: Platform.select({
      ios: 'Times New Roman',
      android: 'serif',
    }),
    italic: Platform.select({
      ios: 'Times New Roman',
      android: 'serif',
    }),
  },
  
  // Sans-serif for modern, clean text (fallback)
  sansSerif: {
    regular: Platform.select({
      ios: 'San Francisco',
      android: 'Roboto',
    }),
    bold: Platform.select({
      ios: 'San Francisco',
      android: 'Roboto',
    }),
  },
  
  // Monospace for code or specific UI elements
  monospace: Platform.select({
    ios: 'Menlo',
    android: 'monospace',
  }),
};

// Typography scale with serif fonts
export const typography = {
  // Display text (large headings)
  display: {
    fontSize: 32,
    fontFamily: fonts.serif.bold,
    fontWeight: Platform.select({ ios: '700', android: 'bold' }),
    lineHeight: 40,
  },
  
  // Main headings
  h1: {
    fontSize: 28,
    fontFamily: fonts.serif.bold,
    fontWeight: Platform.select({ ios: '700', android: 'bold' }),
    lineHeight: 36,
  },
  
  // Sub headings
  h2: {
    fontSize: 24,
    fontFamily: fonts.serif.bold,
    fontWeight: Platform.select({ ios: '600', android: 'bold' }),
    lineHeight: 32,
  },
  
  // Section headings
  h3: {
    fontSize: 20,
    fontFamily: fonts.serif.bold,
    fontWeight: Platform.select({ ios: '600', android: 'bold' }),
    lineHeight: 28,
  },
  
  // Sub-section headings
  h4: {
    fontSize: 18,
    fontFamily: fonts.serif.bold,
    fontWeight: Platform.select({ ios: '600', android: 'bold' }),
    lineHeight: 24,
  },
  
  // Small headings
  h5: {
    fontSize: 16,
    fontFamily: fonts.serif.bold,
    fontWeight: Platform.select({ ios: '600', android: 'bold' }),
    lineHeight: 22,
  },
  
  // Body text
  body: {
    fontSize: 16,
    fontFamily: fonts.serif.regular,
    fontWeight: Platform.select({ ios: '400', android: 'normal' }),
    lineHeight: 24,
  },
  
  // Secondary body text
  bodySecondary: {
    fontSize: 14,
    fontFamily: fonts.serif.regular,
    fontWeight: Platform.select({ ios: '400', android: 'normal' }),
    lineHeight: 20,
  },
  
  // Caption text
  caption: {
    fontSize: 12,
    fontFamily: fonts.serif.regular,
    fontWeight: Platform.select({ ios: '400', android: 'normal' }),
    lineHeight: 16,
  },
  
  // Button text
  button: {
    fontSize: 16,
    fontFamily: fonts.serif.bold,
    fontWeight: Platform.select({ ios: '600', android: 'bold' }),
    lineHeight: 20,
  },
  
  // Small button text
  buttonSmall: {
    fontSize: 14,
    fontFamily: fonts.serif.bold,
    fontWeight: Platform.select({ ios: '600', android: 'bold' }),
    lineHeight: 18,
  },
  
  // Labels
  label: {
    fontSize: 14,
    fontFamily: fonts.serif.regular,
    fontWeight: Platform.select({ ios: '500', android: 'normal' }),
    lineHeight: 18,
  },
  
  // Input text
  input: {
    fontSize: 16,
    fontFamily: fonts.serif.regular,
    fontWeight: Platform.select({ ios: '400', android: 'normal' }),
    lineHeight: 20,
  },
};

// Helper function to get font style object
export const getTextStyle = (variant, customStyles = {}) => {
  const baseStyle = typography[variant] || typography.body;
  return { ...baseStyle, ...customStyles };
};

// Common text style combinations
export const textStyles = {
  title: getTextStyle('h1'),
  subtitle: getTextStyle('h3'),
  sectionTitle: getTextStyle('h4'),
  bodyText: getTextStyle('body'),
  bodySecondary: getTextStyle('bodySecondary'),
  caption: getTextStyle('caption'),
  buttonText: getTextStyle('button'),
  labelText: getTextStyle('label'),
  input: getTextStyle('input'),
  h1: getTextStyle('h1'),
  h2: getTextStyle('h2'),
  h3: getTextStyle('h3'),
  h4: getTextStyle('h4'),
  h5: getTextStyle('h5'),
};