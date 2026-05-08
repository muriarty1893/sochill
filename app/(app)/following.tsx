import { View, Text, FlatList, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGetMode } from '@/hooks/use-mode';
import { getFollowDetails } from '@/lib/api';
import { BackIcon } from '@/components/icons';
import ProfileImage from '@/components/post/ProfileImage';

export default function FollowingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isDark = useGetMode();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const color = isDark ? 'white' : 'black';
  const bg = isDark ? 'black' : 'white';
  const [following, setFollowing] = useState<any[]>([]);

  useEffect(() => {
    getFollowDetails(id).then((data) => setFollowing(data.following)).catch(() => {});
  }, [id]);

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: insets.top + 16, paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 0.5, borderColor: isDark ? '#333' : '#eee' }}>
        <Pressable onPress={() => router.back()} style={{ marginRight: 14 }}>
          <BackIcon size={24} color={color} />
        </Pressable>
        <Text style={{ color, fontFamily: 'jakaraBold', fontSize: 18 }}>Following</Text>
      </View>
      <FlatList
        data={following}
        keyExtractor={(item, i) => item.following_id ?? i.toString()}
        contentContainerStyle={{ padding: 16, gap: 14 }}
        renderItem={({ item }) => {
          const p = item.profiles;
          return (
            <Pressable onPress={() => router.push({ pathname: '/(app)/user/[id]', params: { id: p?.id } })} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <ProfileImage imageUri={p?.avatar_url} size={48} />
              <View>
                <Text style={{ color, fontFamily: 'jakaraBold', fontSize: 15 }}>{p?.display_name ?? p?.username}</Text>
                <Text style={{ color: 'grey', fontFamily: 'jakara', fontSize: 12 }}>{p?.handle}</Text>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
}
