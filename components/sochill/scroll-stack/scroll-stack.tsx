import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useGetMode } from '@/hooks/use-mode';
import { SwipeCard } from './scroll-card';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.35;

type Props = {
  posts: any[];
  swipeCount: number;
  onSwipe: (index: number, isRight: boolean) => void;
};

export const ScrollStack = ({ posts, swipeCount, onSwipe }: Props) => {
  const isDark = useGetMode();
  const color = isDark ? 'white' : 'black';

  const currentIndex = useSharedValue(posts.length - 1);
  const panX = useSharedValue(0);

  const handleSwipeComplete = (idx: number, isRight: boolean) => {
    onSwipe(idx, isRight);
  };

  const gesture = Gesture.Pan()
    .onUpdate((e) => {
      if (currentIndex.value < 0) return;
      panX.value = e.translationX;
    })
    .onEnd((e) => {
      if (currentIndex.value < 0) return;
      const isRight = e.translationX > SWIPE_THRESHOLD;
      const isLeft = e.translationX < -SWIPE_THRESHOLD;
      if (isRight || isLeft) {
        const idx = currentIndex.value;
        panX.value = withTiming((isRight ? 1 : -1) * SCREEN_WIDTH * 1.5, { duration: 300 }, () => {
          'worklet';
          currentIndex.value = idx - 1;
          panX.value = 0;
          runOnJS(handleSwipeComplete)(idx, isRight);
        });
      } else {
        panX.value = withSpring(0, { damping: 20, stiffness: 300 });
      }
    });

  if (swipeCount >= posts.length) {
    return (
      <View style={styles.empty}>
        <Text style={{ fontSize: 36, marginBottom: 16 }}>✦</Text>
        <Text style={[styles.emptyTitle, { color }]}>All caught up</Text>
        <Text style={styles.emptyBody}>
          You've seen every cause for today. Check back later for new posts from charities.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.counter}>
        <Text style={[styles.counterText, { color: isDark ? '#666' : '#90968F' }]}>
          {swipeCount} / {posts.length}
        </Text>
      </View>

      <GestureDetector gesture={gesture}>
        <Animated.View style={styles.deck}>
          {posts.map((post, i) => (
            <SwipeCard
              key={post.id}
              index={i}
              data={post}
              currentIndex={currentIndex}
              panX={panX}
              screenWidth={SCREEN_WIDTH}
              isDark={isDark}
            />
          ))}
        </Animated.View>
      </GestureDetector>

      <View style={styles.hints}>
        <View style={styles.hintRow}>
          <MaterialIcons name="close" size={18} color="#6B7280" />
          <Text style={[styles.hintText, { color: isDark ? '#666' : '#7C827D' }]}>skip</Text>
        </View>
        <View style={styles.hintRow}>
          <Text style={[styles.hintText, { color: isDark ? '#666' : '#7C827D' }]}>spark</Text>
          <MaterialIcons name="auto-awesome" size={18} color="#2E8B77" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 20 },
  counter: { alignItems: 'flex-end', marginBottom: 12 },
  counterText: { fontFamily: 'mulish', fontSize: 12 },
  deck: { flex: 1 },
  hints: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, paddingHorizontal: 8 },
  hintRow: { alignItems: 'center', flexDirection: 'row', gap: 6 },
  hintText: { fontFamily: 'mulish', fontSize: 13 },
  empty: { alignItems: 'center', flex: 1, justifyContent: 'center', paddingHorizontal: 36 },
  emptyTitle: { fontFamily: 'uberBold', fontSize: 28, marginBottom: 10, textAlign: 'center' },
  emptyBody: { color: '#7C827D', fontFamily: 'mulish', fontSize: 14, lineHeight: 22, textAlign: 'center' },
});
