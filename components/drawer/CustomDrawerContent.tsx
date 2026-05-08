import { View, Text, Pressable, Platform } from 'react-native';
import { DrawerContentComponentProps, DrawerContentScrollView } from '@react-navigation/drawer';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Switch } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { clearUser } from '@/redux/slices/user';
import { clearChat } from '@/redux/slices/chat';
import { resetPosts } from '@/redux/slices/posts';
import { setHighEnd, setMode } from '@/redux/slices/prefs';
import { useGetMode } from '@/hooks/use-mode';
import { LogoutIcon, MoonIcon, ProfileIconUnfocused, SparkIcon } from '../icons';
import { supabase } from '@/lib/supabase';

export default function CustomDrawerContent(props: DrawerContentComponentProps) {
  const isDark = useGetMode();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useAppSelector((s) => s.user.data);
  const isHighEnd = useAppSelector((s) => s.prefs.isHighEnd);
  const mode = useAppSelector((s) => s.prefs.mode);

  const color = isDark ? 'white' : 'black';
  const backgroundColor = isDark ? 'black' : 'white';
  const pressColor = isDark ? '#BEBEBE' : '#4F4F4F';
  const style = isDark ? 'dark' : 'light';

  const handleLogout = async () => {
    props.navigation.closeDrawer();
    await supabase.auth.signOut();
    dispatch(clearUser());
    dispatch(clearChat());
    dispatch(resetPosts());
  };

  const toggleDarkMode = () => {
    if (mode === 'dark') {
      dispatch(setMode('light'));
    } else if (mode === 'light') {
      dispatch(setMode('system'));
    } else {
      dispatch(setMode('dark'));
    }
  };

  const modeLabel = mode === 'dark' ? 'Dark' : mode === 'light' ? 'Light' : 'System';

  return (
    <View style={{ flex: 1, padding: 20, paddingBottom: Platform.select({ ios: insets.bottom, android: 40 }) }}>
      {isHighEnd ? (
        <BlurView
          experimentalBlurMethod="dimezisBlurView"
          style={{ position: 'absolute', bottom: 0, left: 0, right: 0, top: 0 }}
          tint={style}
          intensity={200}
        />
      ) : (
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, top: 0, backgroundColor }} />
      )}

      <DrawerContentScrollView {...props}>
        {/* Profile header */}
        <Pressable
          onPress={() => {
            props.navigation.closeDrawer();
            router.push('/(app)/profile');
          }}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16 }}
        >
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              overflow: 'hidden',
              backgroundColor: isDark ? '#333' : '#eee',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {user?.avatar_url ? (
              <Image source={{ uri: user.avatar_url }} style={{ width: 60, height: 60 }} contentFit="cover" />
            ) : (
              <Text style={{ fontSize: 22, fontFamily: 'jakaraBold', color }}>
                {user?.username?.[0]?.toUpperCase() ?? '?'}
              </Text>
            )}
          </View>
          <View>
            <Text style={{ color, fontFamily: 'jakaraBold', fontSize: 18 }}>{user?.display_name ?? user?.username}</Text>
            <Text style={{ color: 'grey', fontFamily: 'jakara', fontSize: 13 }}>{user?.handle}</Text>
          </View>
        </Pressable>

        <View style={{ height: 1, width: '100%', marginVertical: 16, backgroundColor: isDark ? '#333' : '#eee' }} />

        {/* Profile link */}
        <Pressable
          android_ripple={{ color: pressColor, foreground: true }}
          onPress={() => {
            props.navigation.closeDrawer();
            router.push('/(app)/profile');
          }}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12, borderRadius: 8, overflow: 'hidden' }}
        >
          <ProfileIconUnfocused size={25} color={color} />
          <Text style={{ color, fontFamily: 'jakaraBold', fontSize: 18 }}>Profile</Text>
        </Pressable>

        {/* Spark link */}
        <Pressable
          android_ripple={{ color: pressColor, foreground: true }}
          onPress={() => {
            props.navigation.closeDrawer();
            router.push('/(app)/spark');
          }}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12, borderRadius: 8, overflow: 'hidden' }}
        >
          <SparkIcon size={25} color={color} />
          <Text style={{ color, fontFamily: 'jakaraBold', fontSize: 18 }}>Spark</Text>
        </Pressable>
      </DrawerContentScrollView>

      {/* Glass UI toggle */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingRight: 20, paddingBottom: 16 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: 'mulishBold', color }}>{isHighEnd ? 'Disable' : 'Enable'} Glass UI</Text>
          <Text style={{ fontFamily: 'mulish', color: 'grey', fontSize: 12 }}>May cause issues on low-end devices</Text>
        </View>
        <Switch color={color} value={isHighEnd} onValueChange={(v: boolean) => { dispatch(setHighEnd({ isHighEnd: v })); }} />
      </View>

      {/* Bottom actions */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 }}>
        {/* Dark mode */}
        <View style={{ height: 40, width: 40, borderRadius: 999, overflow: 'hidden' }}>
          <Pressable
            android_ripple={{ color: pressColor, foreground: true }}
            onPress={toggleDarkMode}
            style={{ height: 40, width: 40, borderRadius: 999, justifyContent: 'center', alignItems: 'center' }}
          >
            <MoonIcon size={25} color={color} />
          </Pressable>
        </View>

        {/* Logout */}
        <View style={{ height: 40, width: 40, borderRadius: 999, overflow: 'hidden' }}>
          <Pressable
            android_ripple={{ color: pressColor, foreground: true }}
            onPress={handleLogout}
            style={{ height: 40, width: 40, borderRadius: 999, justifyContent: 'center', alignItems: 'center' }}
          >
            <LogoutIcon size={25} color={color} />
          </Pressable>
        </View>
      </View>

      <Text style={{ color: 'grey', fontFamily: 'mulish', fontSize: 11, marginBottom: 10, textAlign: 'center' }}>
        Theme: {modeLabel}
      </Text>
    </View>
  );
}
