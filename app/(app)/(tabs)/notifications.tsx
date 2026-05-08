import { View, Text, FlatList, Pressable, Dimensions } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Image } from 'expo-image';
import { ActivityIndicator } from 'react-native-paper';
import { useGetMode } from '@/hooks/use-mode';
import { getNotifications, markNotificationsRead } from '@/lib/api';
import AnimatedScreen from '@/components/global/AnimatedScreen';
import ProfileImage from '@/components/post/ProfileImage';
import { dateAgo } from '@/util/date';

const { width } = Dimensions.get('window');

function NotificationItem({ item }: { item: any }) {
  const isDark = useGetMode();
  const color = isDark ? 'white' : 'black';
  const bg = isDark ? '#1a1a1a' : '#f9f9f9';
  const actor = item.actor;

  const typeLabel: Record<string, string> = {
    reaction: 'reacted to your post',
    follow: 'started following you',
    reply: 'commented on your post',
    charity_milestone: 'reached a milestone',
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, backgroundColor: item.read ? 'transparent' : bg, borderRadius: 10, marginHorizontal: 10 }}>
      <ProfileImage imageUri={actor?.avatar_url} size={44} />
      <View style={{ flex: 1 }}>
        <Text style={{ color, fontFamily: 'jakaraBold', fontSize: 14 }}>{actor?.display_name ?? actor?.username ?? 'Someone'}</Text>
        <Text style={{ color: 'grey', fontFamily: 'jakara', fontSize: 12 }}>
          {typeLabel[item.action_type] ?? 'interacted with you'}
        </Text>
      </View>
      <Text style={{ color: 'grey', fontFamily: 'jakara', fontSize: 11 }}>
        {dateAgo(new Date(item.created_at))}
      </Text>
    </View>
  );
}

export default function NotificationsScreen() {
  const isDark = useGetMode();
  const color = isDark ? 'white' : 'black';
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getNotifications();
      setNotifications(data ?? []);
      markNotificationsRead();
    } catch {}
    setLoading(false);
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  return (
    <AnimatedScreen style={{ marginTop: 120 }}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 6, paddingBottom: 80 }}
        ListEmptyComponent={
          loading ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 60 }}>
              <ActivityIndicator color={color} size={24} />
            </View>
          ) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 60 }}>
              <Text style={{ color: 'grey', fontFamily: 'mulish', fontSize: 14 }}>No notifications yet</Text>
            </View>
          )
        }
        renderItem={({ item }) => <NotificationItem item={item} />}
      />
    </AnimatedScreen>
  );
}
