import { View, Text, Pressable, RefreshControl, Dimensions } from 'react-native';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInRight, FadeOutRight } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { ActivityIndicator } from 'react-native-paper';
import { useGetMode } from '@/hooks/use-mode';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { getPosts, getFollowedPosts } from '@/lib/api';
import { setPosts, addPosts, setLoading } from '@/redux/slices/posts';
import { openToast } from '@/redux/slices/toast';
import AnimatedScreen from '@/components/global/AnimatedScreen';
import PostBuilder from '@/components/post/PostBuilder';
import { PostComposer } from '@/components/post/PostComposer';
import type { Post } from '@/redux/slices/posts';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const isDark = useGetMode();
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();
  const color = isDark ? 'white' : 'black';
  const posts = useAppSelector((s) => s.posts.data);
  const loading = useAppSelector((s) => s.posts.loading);
  const [isAll, setIsAll] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [skip, setSkip] = useState(0);
  const [noMore, setNoMore] = useState(false);

  const fetchPosts = useCallback(async (reset = false) => {
    dispatch(setLoading(true));
    try {
      const data = await (isAll ? getPosts(20, reset ? 0 : skip) : getFollowedPosts(20, reset ? 0 : skip));
      if (reset) {
        dispatch(setPosts(data as Post[]));
        setSkip(data.length);
      } else {
        dispatch(addPosts(data as Post[]));
        setSkip((prev) => prev + data.length);
      }
      if (data.length === 0) setNoMore(true);
    } catch {
      dispatch(openToast({ text: "Couldn't load posts", type: 'Failed' }));
    } finally {
      dispatch(setLoading(false));
    }
  }, [isAll, skip, dispatch]);

  useEffect(() => {
    setSkip(0);
    setNoMore(false);
    fetchPosts(true);
  }, [isAll]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setSkip(0);
    setNoMore(false);
    try {
      const data = await (isAll ? getPosts(20, 0) : getFollowedPosts(20, 0));
      dispatch(setPosts(data as Post[]));
      setSkip(data.length);
    } catch {
      dispatch(openToast({ text: "Couldn't refresh", type: 'Failed' }));
    } finally {
      setRefreshing(false);
    }
  }, [isAll, dispatch]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={() => setIsAll((prev) => !prev)}
          style={{ marginRight: 20, borderColor: color, borderWidth: 1, padding: 4, borderRadius: 999, borderStyle: 'dotted' }}
        >
          <Animated.View key={isAll ? 'all' : 'followed'} entering={FadeInRight.springify()} exiting={FadeOutRight.springify()}>
            <Text style={{ fontFamily: 'uberBold', fontSize: 12, color }}>
              {isAll ? 'All Posts' : 'Followed Posts'}
            </Text>
          </Animated.View>
        </Pressable>
      ),
    });
  }, [color, isAll]);

  const renderItem = ({ item }: { item: Post }) => <PostBuilder post={item} />;
  const keyExtractor = (item: Post) => item.id;

  return (
    <AnimatedScreen>
      <View style={{ flex: 1 }}>
        {loading && posts.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator color={color} size={28} />
          </View>
        ) : (
          <FlashList
            data={posts}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[color]} />}
            contentContainerStyle={{ paddingTop: insets.top, paddingBottom: 100 }}
            onEndReachedThreshold={0.3}
            onEndReached={() => { if (!noMore && !loading) fetchPosts(); }}
            ListFooterComponent={
              !noMore && loading ? (
                <View style={{ padding: 20, alignItems: 'center' }}>
                  <ActivityIndicator color={color} size={20} />
                </View>
              ) : noMore ? (
                <View style={{ padding: 20, alignItems: 'center' }}>
                  <Text style={{ color: 'grey', fontFamily: 'mulish' }}>You're all caught up!</Text>
                </View>
              ) : null
            }
            ListEmptyComponent={
              !loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 60 }}>
                  <Text style={{ color: 'grey', fontFamily: 'mulish', fontSize: 14 }}>No posts yet. Be the first!</Text>
                </View>
              ) : null
            }
          />
        )}
        <PostComposer />
      </View>
    </AnimatedScreen>
  );
}
