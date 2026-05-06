import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { SofiaSansCondensed_800ExtraBold } from '@expo-google-fonts/sofia-sans-condensed';
import { SplineSansMono_400Regular, SplineSansMono_600SemiBold } from '@expo-google-fonts/spline-sans-mono';
import { RobotoSlab_400Regular, RobotoSlab_500Medium } from '@expo-google-fonts/roboto-slab';
import { Merriweather_400Regular } from '@expo-google-fonts/merriweather';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { ToastProvider } from '@/components/sochill/toast';
import { SparksProvider } from '@/contexts/sparks-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

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
      <SparksProvider>
      <ToastProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </ToastProvider>
      </SparksProvider>
    </GestureHandlerRootView>
  );
}
