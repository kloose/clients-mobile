export const Colors = {
  // Bullish-inspired Color Palette
  gray: {
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
    950: '#09090b',
  },

  // Bullish Signature Green
  bullish: {
    green: '#18e589',
    greenDark: '#15d177',
    greenLight: '#2ef194',
    green50: '#ecfff5',
    green100: '#d1ffdf',
  },

  emerald: {
    50: '#ecfdf5',
    500: '#10b981',
    600: '#059669',
  },

  orange: {
    50: '#fff7ed',
    500: '#f97316',
    600: '#ea580c',
  },

  rose: {
    50: '#fff1f2',
    500: '#f43f5e',
    600: '#e11d48',
  },

  white: '#ffffff',
  black: '#000000',
};

// Dark theme (default - Bullish aesthetic)
export const DarkTheme = {
  background: Colors.black,
  surface: Colors.gray[900],
  surfaceElevated: Colors.gray[800],
  border: Colors.gray[700],
  textPrimary: Colors.white,
  textSecondary: Colors.gray[300],
  textMuted: Colors.gray[500],
  accent: Colors.bullish.green,
  accentHover: Colors.bullish.greenDark,
  success: Colors.bullish.green,
  warning: Colors.orange[500],
  danger: Colors.rose[500],
};

// Light theme (optional)
export const LightTheme = {
  background: Colors.gray[50],
  surface: Colors.white,
  surfaceElevated: Colors.white,
  border: Colors.gray[200],
  textPrimary: Colors.gray[900],
  textSecondary: Colors.gray[600],
  textMuted: Colors.gray[400],
  accent: Colors.bullish.green,
  accentHover: Colors.bullish.greenDark,
  success: Colors.bullish.green,
  warning: Colors.orange[500],
  danger: Colors.rose[500],
};

// Export the dark theme as default for Bullish aesthetic
export const Theme = DarkTheme;