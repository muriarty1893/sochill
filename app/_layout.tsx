import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { SofiaSansCondensed_800ExtraBold } from '@expo-google-fonts/sofia-sans-condensed';
import { SplineSansMono_400Regular, SplineSansMono_600SemiBold } from '@expo-google-fonts/spline-sans-mono';
import { RobotoSlab_400Regular, RobotoSlab_500Medium } from '@expo-google-fonts/roboto-slab';
import { Merriweather_400Regular } from '@expo-google-fonts/merriweather';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { ToastProvider } from '@/components/sochill/toast';
import { AuthProvider, useAuth } from '@/contexts/auth-context';
import { SparksProvider } from '@/contexts/sparks-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

function AuthRedirect() {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    const inAuth = segments[0] === '(auth)';
    if (!session && !inAuth) {
      router.replace('/(auth)/sign-in');
    } else if (session && inAuth) {
      router.replace('/(tabs)');
    }
  }, [session, loading, segments]);

  return null;
}

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    SofiaSansCondensed_800ExtraBold,
    SplineSansMono_400Regular,
    SplineSansMono_600SemiBold,
    RobotoSlab_400Regular,
    RobotoSlab_500Medium,
    Merriweather_400Regular,
  });

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <SparksProvider>
          <ToastProvider>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
              <AuthRedirect />
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="privacy" options={{ headerShown: false }} />
                <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
              </Stack>
              <StatusBar style="auto" />
            </ThemeProvider>
          </ToastProvider>
        </SparksProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
