import { View, Text, ScrollView, Pressable, RefreshControl, FlatList, Dimensions } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Image, ImageBackground } from 'expo-image';
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { useGetMode } from '@/hooks/use-mode';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { getMyProfile, getFollowDetails, getUserPosts, updateProfile, uploadAvatar } from '@/lib/api';
import { updateUser } from '@/redux/slices/user';
import AnimatedScreen from '@/components/global/AnimatedScreen';
import PostBuilder from '@/components/post/PostBuilder';
import { EditIcon, ProfileIcon } from '@/components/icons';
import type { Post } from '@/redux/slices/posts';
import * as ImagePicker from 'expo-image-picker';
import { openToast } from '@/redux/slices/toast';

const HEADER_HEIGHT = 220;
const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const isDark = useGetMode();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useAppSelector((s) => s.user.data);
  const [followData, setFollowData] = useState<any>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const offset = useSharedValue(0);

  const color = isDark ? 'white' : 'black';
  const backgroundColor = isDark ? 'black' : 'white';

  const load = useCallback(async () => {
    if (!user?.id) return;
    const [fd, userPosts] = await Promise.all([
      getFollowDetails(user.id),
      getUserPosts(user.id),
    ]).catch(() => [null, []]);
    setFollowData(fd);
    setPosts(userPosts as Post[]);
  }, [user?.id]);

  useEffect(() => { load(); }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    offset.value = event.contentOffset.y;
  });

  const headerHeightStyle = useAnimatedStyle(() => ({
    height: interpolate(offset.value, [0, HEADER_HEIGHT + insets.top], [HEADER_HEIGHT + insets.top, insets.top + 58], Extrapolation.CLAMP),
  }));
  const imageStyle = useAnimatedStyle(() => ({
    height: interpolate(offset.value, [0, 80 + insets.top], [80, 0]),
    aspectRatio: 1,
    opacity: interpolate(offset.value, [0, 1 + insets.top], [1, 0]),
  }));
  const nameStyle = useAnimatedStyle(() => ({
    opacity: interpolate(offset.value, [0, 1 + insets.top + 58], [0, 1]),
  }));

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8, allowsEditing: true, aspect: [1, 1] });
    if (!result.canceled && result.assets[0]) {
      try {
        const url = await uploadAvatar(result.assets[0].uri);
        await updateProfile({ avatar_url: url });
        dispatch(updateUser({ avatar_url: url }));
        dispatch(openToast({ text: 'Avatar updated!', type: 'Success' }));
      } catch {
        dispatch(openToast({ text: 'Failed to update avatar', type: 'Failed' }));
      }
    }
  };

  return (
    <AnimatedScreen>
      <StatusBar style="light" backgroundColor="transparent" translucent />
      <View style={{ flex: 1 }}>
        {/* Animated Header */}
        <Animated.View style={[{ width: '100%' }, headerHeightStyle]}>
          <View style={{ height: '100%', width: '100%', backgroundColor: 'black' }}>
            {user?.avatar_url && (
              <ImageBackground style={{ flex: 1, opacity: 0.3 }} blurRadius={10} source={{ uri: user.avatar_url }} />
            )}
            <View style={{ position: 'absolute', bottom: 0, width: '100%', justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 50, paddingVertical: 20 }}>
              <Animated.Text style={[{ color: 'white', fontFamily: 'jakaraBold', fontSize: 16 }, nameStyle]}>
                {user?.display_name ?? user?.username}
              </Animated.Text>
            </View>
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
          <Pressable onPress={pickAvatar} style={{ height: '100%', width: '100%', borderRadius: 999, justifyContent: 'center', alignItems: 'center' }}>
            {user?.avatar_url ? (
              <Image contentFit="cover" style={{ height: '100%', width: '100%', borderRadius: 999 }} source={{ uri: user.avatar_url }} />
            ) : (
              <ProfileIcon color={color} size={80} />
            )}
          </Pressable>
        </Animated.View>

        {/* Scrollable content */}
        <Animated.ScrollView
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Spacer for header */}
          <View style={{ height: HEADER_HEIGHT + insets.top + 20 }} />

          {/* Profile info */}
          <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View>
                <Text style={{ color, fontFamily: 'jakaraBold', fontSize: 20 }}>{user?.display_name ?? user?.username}</Text>
                <Text style={{ color: 'grey', fontFamily: 'jakara', fontSize: 13 }}>{user?.handle}</Text>
              </View>
              <Pressable
                onPress={() => router.push('/(app)/edit-profile')}
                style={{ flexDirection: 'row', gap: 6, alignItems: 'center', borderWidth: 1, borderColor: isDark ? '#555' : '#ccc', borderRadius: 8, padding: 8 }}
              >
                <EditIcon size={16} color={color} />
                <Text style={{ color, fontFamily: 'jakara', fontSize: 13 }}>Edit</Text>
              </Pressable>
            </View>

            {user?.bio ? (
              <Text style={{ color, fontFamily: 'jakara', fontSize: 13, marginTop: 10, lineHeight: 18 }}>{user.bio}</Text>
            ) : null}

            {/* Follow stats */}
            <View style={{ flexDirection: 'row', gap: 24, marginTop: 16 }}>
              <Pressable onPress={() => router.push({ pathname: '/(app)/followers', params: { id: user?.id } })}>
                <Text style={{ color, fontFamily: 'jakaraBold', fontSize: 18 }}>{followData?.followersCount ?? 0}</Text>
                <Text style={{ color: 'grey', fontFamily: 'jakara', fontSize: 12 }}>Followers</Text>
              </Pressable>
              <Pressable onPress={() => router.push({ pathname: '/(app)/following', params: { id: user?.id } })}>
                <Text style={{ color, fontFamily: 'jakaraBold', fontSize: 18 }}>{followData?.followingCount ?? 0}</Text>
                <Text style={{ color: 'grey', fontFamily: 'jakara', fontSize: 12 }}>Following</Text>
              </Pressable>
              <View>
                <Text style={{ color, fontFamily: 'jakaraBold', fontSize: 18 }}>{posts.length}</Text>
                <Text style={{ color: 'grey', fontFamily: 'jakara', fontSize: 12 }}>Posts</Text>
              </View>
            </View>
          </View>

          <View style={{ height: 1, backgroundColor: isDark ? '#222' : '#eee', marginTop: 16 }} />

          {/* Posts */}
          {posts.map((post) => <PostBuilder key={post.id} post={post} />)}
        </Animated.ScrollView>
      </View>
    </AnimatedScreen>
  );
}
