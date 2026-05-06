import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { useToast } from '@/components/sochill/toast';
import { useSparks } from '@/contexts/sparks-context';
import type { CharityPost } from '@/data/mock';
import { SwipeCard } from './scroll-card';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.35;

type SwipeStackProps = {
  posts: CharityPost[];
};

export const ScrollStack = ({ posts }: SwipeStackProps) => {
  const { showToast } = useToast();
  const { support } = useSparks();
  const [isEmpty, setIsEmpty] = useState(false);
  const [swipeCount, setSwipeCount] = useState(0);

  const currentIndex = useSharedValue(posts.length - 1);
  const panX = useSharedValue(0);

  const handleSupport = (postId: string, charityName: string) => {
    support(postId);
    showToast({
      title: `✦ Sparked! ${charityName} gets 1 spark`,
      autodismiss: true,
      leading: () => <MaterialIcons name="auto-awesome" size={20} color="#C86B4A" />,
    });
  };

  const handleSwipeComplete = (idx: number, isRight: boolean) => {
    const post = posts[idx];
    if (isRight) handleSupport(post.id, post.charityName);
    setSwipeCount((c) => c + 1);
    if (idx - 1 < 0) setIsEmpty(true);
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
        const dir = isRight ? 1 : -1;
        const idx = currentIndex.value;

        panX.value = withTiming(dir * SCREEN_WIDTH * 1.5, { duration: 300 }, () => {
          'worklet';
          currentIndex.value = idx - 1;
          panX.value = 0;
          runOnJS(handleSwipeComplete)(idx, isRight);
        });
      } else {
        panX.value = withSpring(0, { damping: 20, stiffness: 300 });
      }
    });

  if (isEmpty) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyEmoji}>✦</Text>
        <Text style={styles.emptyTitle}>All caught up</Text>
        <Text style={styles.emptyBody}>You've seen every cause for today. Check back tomorrow for new posts from charities near you.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.counter}>
        <Text style={styles.counterText}>{swipeCount} / {posts.length}</Text>
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
            />
          ))}
        </Animated.View>
      </GestureDetector>

      <View style={styles.hints}>
        <View style={styles.hintLeft}>
          <MaterialIcons name="close" size={18} color="#6B7280" />
          <Text style={styles.hintText}>skip</Text>
        </View>
        <View style={styles.hintRight}>
          <Text style={styles.hintText}>spark</Text>
          <MaterialIcons name="auto-awesome" size={18} color="#2E8B77" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
  },
  counter: {
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  counterText: {
    color: '#90968F',
    fontFamily: 'SplineSansMono_400Regular',
    fontSize: 12,
  },
  deck: {
    flex: 1,
  },
  hints: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingHorizontal: 8,
  },
  hintLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  hintRight: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  hintText: {
    color: '#7C827D',
    fontFamily: 'SplineSansMono_400Regular',
    fontSize: 13,
  },
  emptyState: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 36,
  },
  emptyEmoji: {
    color: '#C86B4A',
    fontSize: 36,
    marginBottom: 16,
  },
  emptyTitle: {
    color: '#171A18',
    fontFamily: 'SofiaSansCondensed_800ExtraBold',
    fontSize: 28,
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyBody: {
    color: '#7C827D',
    fontFamily: 'RobotoSlab_400Regular',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
  },
});
