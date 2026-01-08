import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack, useSegments, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect, useContext, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';

import { AppContext, AppContextProvider } from '@/context/AppContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

function AppLayout() {
  const { theme } = useTheme();
  const { token, isAuthLoading } = useContext(AppContext);
  const segments = useSegments();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // Wait for navigation to be ready
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || isAuthLoading) return;

    const inAuthGroup = segments[0] === '(tabs)';
    
    // If not logged in and trying to access protected routes
    if (!token && inAuthGroup) {
       router.replace('/login');
    } else if (token && segments[0] === 'login') {
      router.replace('/(tabs)');
    }
  }, [token, segments, isMounted, isAuthLoading]);

  if (!isMounted || isAuthLoading) {
     return (
       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
         <ActivityIndicator size="large" />
       </View>
     );
  }

  return (
    <NavigationThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppContextProvider>
        <AppLayout />
      </AppContextProvider>
    </ThemeProvider>
  );
}

