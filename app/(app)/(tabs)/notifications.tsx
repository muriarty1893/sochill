import { View, Text, ActivityIndicator } from 'react-native';
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGetMode } from '@/hooks/use-mode';
import { useAppDispatch } from '@/redux/hooks';
import { openToast } from '@/redux/slices/toast';
import { getCharityPosts, sparkCharityPost } from '@/lib/api';
import { ScrollStack } from '@/components/sochill/scroll-stack/scroll-stack';
import AnimatedScreen from '@/components/global/AnimatedScreen';

export default function SparkTabScreen() {
  const isDark = useGetMode();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const color = isDark ? 'white' : 'black';

  const [posts, setPosts] = useState<any[]>([]);
  const [swipeCount, setSwipeCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      setSwipeCount(0);
      getCharityPosts()
        .then((data) => setPosts(data))
        .catch(() => dispatch(openToast({ text: 'Could not load causes', type: 'Failed' })))
        .finally(() => setLoading(false));
    }, [dispatch])
  );

  const handleSwipe = useCallback(async (index: number, isRight: boolean) => {
    setSwipeCount((c) => c + 1);
    if (!isRight) return;
    const post = posts[index];
    if (!post) return;
    try {
      await sparkCharityPost(post.id);
      dispatch(openToast({ text: `✦ Sparked! ${post.charity_name}`, type: 'Success' }));
    } catch {
      dispatch(openToast({ text: 'Could not save spark', type: 'Failed' }));
    }
  }, [posts, dispatch]);

  return (
    <AnimatedScreen>
      <View style={{ flex: 1, paddingTop: insets.top + 56 }}>
        {/* Header */}
        <View style={{ paddingHorizontal: 20, marginBottom: 12 }}>
          <Text style={{ color, fontFamily: 'uberBold', fontSize: 26 }}>Spark ⚡</Text>
          <Text style={{ color: isDark ? '#aaa' : '#666', fontFamily: 'mulish', fontSize: 13, marginTop: 2 }}>
            Swipe right to support · swipe left to skip
          </Text>
        </View>

        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator color={color} />
          </View>
        ) : (
          <ScrollStack posts={posts} swipeCount={swipeCount} onSwipe={handleSwipe} />
        )}
      </View>
    </AnimatedScreen>
  );
}
