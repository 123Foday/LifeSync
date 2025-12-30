import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme as _useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
  isSystemTheme: true,
  useSystemTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemColorScheme = _useColorScheme();
  const [theme, setTheme] = useState('light');
  const [isSystemTheme, setIsSystemTheme] = useState(true);

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem('user-theme');
      if (savedTheme) {
        setTheme(savedTheme);
        setIsSystemTheme(false);
      } else {
        setTheme(systemColorScheme || 'light');
        setIsSystemTheme(true);
      }
    };
    loadTheme();
  }, [systemColorScheme]);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    setIsSystemTheme(false);
    await AsyncStorage.setItem('user-theme', newTheme);
  };

  const useSystemTheme = async () => {
    setIsSystemTheme(true);
    setTheme(systemColorScheme || 'light');
    await AsyncStorage.removeItem('user-theme');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isSystemTheme, useSystemTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
