import { Drawer } from 'expo-router/drawer';
import { Platform, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { useGetMode } from '@/hooks/use-mode';
import { useAppSelector } from '@/redux/hooks';
import CustomDrawerContent from '@/components/drawer/CustomDrawerContent';
import { DrawerNavigationOptions } from '@react-navigation/drawer';
import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function AppLayout() {
  const isDark = useGetMode();
  const backgroundColor = isDark ? 'black' : 'white';
  const isHighEnd = useAppSelector((s) => s.prefs.isHighEnd);
  const tint = isDark ? 'dark' : 'light';
  const borderColor = isDark ? '#FFFFFF7D' : '#4545452D';
  const color = isDark ? 'white' : 'black';

  const drawerBg: DrawerNavigationOptions = isHighEnd
    ? { drawerStyle: { backgroundColor: 'transparent', width: width * 0.85 } }
    : { drawerStyle: { backgroundColor, width: width * 0.85 } };

  return (
    <Drawer
      drawerContent={(props: DrawerContentComponentProps) => <CustomDrawerContent {...props} />}
      screenOptions={{
        ...drawerBg,
        headerStatusBarHeight: 30,
        headerShadowVisible: false,
        headerTransparent: true,
        headerTitleStyle: { fontFamily: 'uberBold', fontSize: 20, color },
        headerTitleAlign: 'center',
        headerStyle: {
          height: Platform.OS === 'ios' ? 100 : undefined,
        },
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerItemStyle: { display: 'none' },
          headerShown: false,
          title: 'Home',
        }}
      />
      <Drawer.Screen name="profile" options={{ drawerItemStyle: { display: 'none' }, headerShown: false }} />
      <Drawer.Screen name="post/[id]" options={{ drawerItemStyle: { display: 'none' }, headerShown: false }} />
      <Drawer.Screen name="user/[id]" options={{ drawerItemStyle: { display: 'none' }, headerShown: false }} />
      <Drawer.Screen name="chat/[id]" options={{ drawerItemStyle: { display: 'none' }, headerShown: false }} />
      <Drawer.Screen name="post-content" options={{ drawerItemStyle: { display: 'none' }, headerShown: false }} />
      <Drawer.Screen name="edit-profile" options={{ drawerItemStyle: { display: 'none' }, headerShown: false }} />
      <Drawer.Screen name="followers" options={{ drawerItemStyle: { display: 'none' }, headerShown: false }} />
      <Drawer.Screen name="following" options={{ drawerItemStyle: { display: 'none' }, headerShown: false }} />
      <Drawer.Screen name="new-conversation" options={{ drawerItemStyle: { display: 'none' }, headerShown: false }} />
      <Drawer.Screen name="spark" options={{ drawerItemStyle: { display: 'none' }, headerShown: false }} />
    </Drawer>
  );
}
