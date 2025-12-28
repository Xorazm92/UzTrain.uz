import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Appearance } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
  isDark: boolean;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    warning: string;
    info: string;
  };
}

const lightColors = {
  primary: '#2563eb',
  secondary: '#64748b',
  background: '#ffffff',
  surface: '#f8fafc',
  text: '#0f172a',
  textSecondary: '#64748b',
  border: '#e2e8f0',
  error: '#dc2626',
  success: '#16a34a',
  warning: '#d97706',
  info: '#0ea5e9',
};

const darkColors = {
  primary: '#3b82f6',
  secondary: '#94a3b8',
  background: '#0f172a',
  surface: '#1e293b',
  text: '#f8fafc',
  textSecondary: '#94a3b8',
  border: '#334155',
  error: '#ef4444',
  success: '#22c55e',
  warning: '#f59e0b',
  info: '#06b6d4',
};

const getSystemTheme = (): boolean => {
  return Appearance.getColorScheme() === 'dark';
};

const initialState: ThemeState = {
  mode: 'system',
  isDark: getSystemTheme(),
  colors: getSystemTheme() ? darkColors : lightColors,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
      
      if (action.payload === 'system') {
        state.isDark = getSystemTheme();
      } else {
        state.isDark = action.payload === 'dark';
      }
      
      state.colors = state.isDark ? darkColors : lightColors;
    },
    
    updateSystemTheme: (state) => {
      if (state.mode === 'system') {
        state.isDark = getSystemTheme();
        state.colors = state.isDark ? darkColors : lightColors;
      }
    },
    
    setCustomColors: (state, action: PayloadAction<Partial<typeof lightColors>>) => {
      state.colors = { ...state.colors, ...action.payload };
    },
  },
});

export const { setThemeMode, updateSystemTheme, setCustomColors } = themeSlice.actions;
export default themeSlice.reducer;
