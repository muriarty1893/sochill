import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { PaperProvider } from 'react-native-paper';

import { store, persistor } from '@/redux/store';
import { AuthProvider, useAuth } from '@/contexts/auth-context';
import { useGetMode } from '@/hooks/use-mode';
import { useColorScheme } from '@/hooks/use-color-scheme';
import CustomToast from '@/components/global/Toast';

function AuthRedirect() {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    const inAuth = segments[0] === '(auth)';
    const inApp = segments[0] === '(app)';
    if (!session && !inAuth) {
      router.replace('/(auth)/sign-in');
    } else if (session && inAuth) {
      router.replace('/(app)/(tabs)');
    }
  }, [session, loading, segments]);

  return null;
}

function ThemedApp() {
  const isDark = useGetMode();
  const theme = isDark ? DarkTheme : DefaultTheme;

  return (
    <ThemeProvider value={theme}>
      <AuthRedirect />
      <Stack>
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="privacy" options={{ headerShown: false }} />
      </Stack>
      <CustomToast />
      <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor="transparent" translucent />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    mulish: require('../assets/fonts/Mulish-Light.ttf'),
    mulishBold: require('../assets/fonts/Mulish-Black.ttf'),
    mulishMedium: require('../assets/fonts/Mulish-Medium.ttf'),
    mulishRegular: require('../assets/fonts/Mulish-Medium.ttf'),
    uberBold: require('../assets/fonts/UberMove-Bold.ttf'),
    jakaraBold: require('../assets/fonts/PlusJakartaSans-ExtraBold.ttf'),
    jakara: require('../assets/fonts/PlusJakartaSans-Medium.ttf'),
  });

  if (!fontsLoaded) return null;

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <PaperProvider>
            <AuthProvider>
              <ThemedApp />
            </AuthProvider>
          </PaperProvider>
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
}
