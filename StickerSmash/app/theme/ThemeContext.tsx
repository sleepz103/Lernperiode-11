import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Theme {
  name: string;
  primary: string;
  background: string;
  text: string;
}

export const themes: Theme[] = [
  {
    name: 'Classic',
    primary: '#424242',
    background: '#ffffff',
    text: '#000000'
  },
  {
    name: 'Dark',
    primary: '#666666',
    background: '#121212',
    text: '#ffffff'
  },
  {
    name: 'Nature',
    primary: '#4CAF50',
    background: '#E8F5E9',
    text: '#1B5E20'
  }
];

interface ThemeContextType {
  currentTheme: Theme;
  cycleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'app_theme_index';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeIndex, setThemeIndex] = useState(0);

  useEffect(() => {
    // Load saved theme index
    AsyncStorage.getItem(THEME_STORAGE_KEY)
      .then(saved => {
        if (saved !== null) {
          setThemeIndex(parseInt(saved));
        }
      })
      .catch(console.error);
  }, []);

  const cycleTheme = () => {
    const nextIndex = (themeIndex + 1) % themes.length;
    setThemeIndex(nextIndex);
    AsyncStorage.setItem(THEME_STORAGE_KEY, nextIndex.toString())
      .catch(console.error);
  };

  return (
    <ThemeContext.Provider value={{
      currentTheme: themes[themeIndex],
      cycleTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};