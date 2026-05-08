import { Tabs } from 'expo-router';
import { SochillTabBar } from '@/components/sochill/tabs';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props: BottomTabBarProps) => <SochillTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="discover" options={{ title: 'Discover' }} />
      <Tabs.Screen name="notifications" options={{ title: 'Notifications' }} />
      <Tabs.Screen name="messages" options={{ title: 'Messages' }} />
    </Tabs>
  );
}
