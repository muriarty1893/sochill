import { View, Text, Pressable, ScrollView, RefreshControl } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ImageBackground, Image } from 'expo-image';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useGetMode } from '@/hooks/use-mode';
import { useAppSelector } from '@/redux/hooks';
import { getProfile, getFollowDetails, getUserPosts, follow, unfollow, isFollowing, getOrCreateConversation } from '@/lib/api';
import AnimatedScreen from '@/components/global/AnimatedScreen';
import PostBuilder from '@/components/post/PostBuilder';
import { BackIcon, ProfileIcon } from '@/components/icons';
import type { Post } from '@/redux/slices/posts';

const HEADER_HEIGHT = 220;

export default function PeopleProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isDark = useGetMode();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const currentUser = useAppSelector((s) => s.user.data);
  const color = isDark ? 'white' : 'black';
  const backgroundColor = isDark ? 'black' : 'white';

  const [profile, setProfile] = useState<any>(null);
  const [followData, setFollowData] = useState<any>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [following, setFollowing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const offset = useSharedValue(0);

  const load = useCallback(async () => {
    const [p, fd, up, fol] = await Promise.all([
      getProfile(id),
      getFollowDetails(id),
      getUserPosts(id),
      isFollowing(id),
    ]).catch(() => [null, null, [], false]);
    setProfile(p);
    setFollowData(fd);
    setPosts(up as Post[]);
    setFollowing(fol as boolean);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const onRefresh = useCallback(async () => { setRefreshing(true); await load(); setRefreshing(false); }, [load]);

  const handleFollowToggle = async () => {
    try {
      if (following) { await unfollow(id); setFollowing(false); setFollowData((prev: any) => prev ? { ...prev, followersCount: prev.followersCount - 1 } : prev); }
      else { await follow(id); setFollowing(true); setFollowData((prev: any) => prev ? { ...prev, followersCount: prev.followersCount + 1 } : prev); }
    } catch {}
  };

  const handleMessage = async () => {
    try {
      const convId = await getOrCreateConversation(id);
      router.push({ pathname: '/(app)/chat/[id]', params: { id: convId } });
    } catch {}
  };

  const scrollHandler = useAnimatedScrollHandler((e) => { offset.value = e.contentOffset.y; });
  const headerHeightStyle = useAnimatedStyle(() => ({
    height: interpolate(offset.value, [0, HEADER_HEIGHT + insets.top], [HEADER_HEIGHT + insets.top, insets.top + 58], Extrapolation.CLAMP),
  }));
  const imageStyle = useAnimatedStyle(() => ({
    height: interpolate(offset.value, [0, 80 + insets.top], [80, 0]),
    aspectRatio: 1,
    opacity: interpolate(offset.value, [0, 1 + insets.top], [1, 0]),
  }));

  return (
    <AnimatedScreen>
      <View style={{ flex: 1 }}>
        {/* Back button */}
        <Pressable onPress={() => router.back()} style={{ position: 'absolute', top: insets.top + 10, left: 16, zIndex: 99, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 999, padding: 8 }}>
          <BackIcon size={22} color="white" />
        </Pressable>

        {/* Animated Header */}
        <Animated.View style={[{ width: '100%' }, headerHeightStyle]}>
          <View style={{ height: '100%', width: '100%', backgroundColor: 'black' }}>
            {profile?.avatar_url && (
              <ImageBackground style={{ flex: 1, opacity: 0.3 }} blurRadius={10} source={{ uri: profile.avatar_url }} />
            )}
          </View>
        </Animated.View>

        {/* Avatar */}
        <Animated.View
          style={[{
            width: 80, position: 'absolute', top: 60 + insets.top, padding: 5,
            overflow: 'hidden', marginLeft: 15, zIndex: 99, borderRadius: 999,
            justifyContent: 'center', alignItems: 'center', backgroundColor,
          }, imageStyle]}
        >
          {profile?.avatar_url ? (
            <Image contentFit="cover" style={{ height: '100%', width: '100%', borderRadius: 999 }} source={{ uri: profile.avatar_url }} />
          ) : (
            <ProfileIcon color={color} size={80} />
          )}
        </Animated.View>

        <Animated.ScrollView
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View style={{ height: HEADER_HEIGHT + insets.top + 20 }} />

          <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View>
                <Text style={{ color, fontFamily: 'jakaraBold', fontSize: 20 }}>{profile?.display_name ?? profile?.username}</Text>
                <Text style={{ color: 'grey', fontFamily: 'jakara', fontSize: 13 }}>{profile?.handle}</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Pressable
                  onPress={handleMessage}
                  style={{ borderWidth: 1, borderColor: isDark ? '#555' : '#ccc', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 }}
                >
                  <Text style={{ color, fontFamily: 'jakara', fontSize: 13 }}>Message</Text>
                </Pressable>
                <Pressable
                  onPress={handleFollowToggle}
                  style={{ backgroundColor: following ? (isDark ? '#333' : '#f0f0f0') : (isDark ? 'white' : 'black'), borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8 }}
                >
                  <Text style={{ color: following ? color : (isDark ? 'black' : 'white'), fontFamily: 'jakaraBold', fontSize: 13 }}>
                    {following ? 'Unfollow' : 'Follow'}
                  </Text>
                </Pressable>
              </View>
            </View>

            {profile?.bio ? <Text style={{ color, fontFamily: 'jakara', fontSize: 13, marginTop: 10 }}>{profile.bio}</Text> : null}

            <View style={{ flexDirection: 'row', gap: 24, marginTop: 16 }}>
              <View>
                <Text style={{ color, fontFamily: 'jakaraBold', fontSize: 18 }}>{followData?.followersCount ?? 0}</Text>
                <Text style={{ color: 'grey', fontFamily: 'jakara', fontSize: 12 }}>Followers</Text>
              </View>
              <View>
                <Text style={{ color, fontFamily: 'jakaraBold', fontSize: 18 }}>{followData?.followingCount ?? 0}</Text>
                <Text style={{ color: 'grey', fontFamily: 'jakara', fontSize: 12 }}>Following</Text>
              </View>
              <View>
                <Text style={{ color, fontFamily: 'jakaraBold', fontSize: 18 }}>{posts.length}</Text>
                <Text style={{ color: 'grey', fontFamily: 'jakara', fontSize: 12 }}>Posts</Text>
              </View>
            </View>
          </View>

          <View style={{ height: 1, backgroundColor: isDark ? '#222' : '#eee', marginTop: 16 }} />
          {posts.map((post) => <PostBuilder key={post.id} post={post} />)}
        </Animated.ScrollView>
      </View>
    </AnimatedScreen>
  );
}
