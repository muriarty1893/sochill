import { StyleSheet, Text, View } from 'react-native';

import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';

import type { SharedValue } from 'react-native-reanimated';
import type { CharityPost } from '@/data/mock';

export type SwipeCardProps = {
  index: number;
  data: CharityPost;
  currentIndex: SharedValue<number>;
  panX: SharedValue<number>;
  screenWidth: number;
};

const STACK_DEPTH = 3;

export const SwipeCard: React.FC<SwipeCardProps> = ({ index, data, currentIndex, panX, screenWidth }) => {
  const rStyle = useAnimatedStyle(() => {
    const dist = currentIndex.value - index;

    if (dist < 0) {
      return { opacity: 0, zIndex: 0, pointerEvents: 'none' as const };
    }

    if (dist === 0) {
      const rotation = (panX.value / screenWidth) * 12;
      return {
        opacity: 1,
        zIndex: 100,
        transform: [
          { translateX: panX.value },
          { rotate: `${rotation}deg` },
          { scale: 1 },
          { translateY: 0 },
        ],
      };
    }

    const clampedDist = Math.min(dist, STACK_DEPTH);
    const scale = interpolate(clampedDist, [1, STACK_DEPTH], [0.96, 0.88], Extrapolation.CLAMP);
    const translateY = interpolate(clampedDist, [1, STACK_DEPTH], [10, 28], Extrapolation.CLAMP);

    return {
      opacity: dist <= STACK_DEPTH ? 1 : 0,
      zIndex: 100 - clampedDist * 10,
      transform: [
        { translateX: 0 },
        { rotate: '0deg' },
        { scale },
        { translateY },
      ],
    };
  });

  const sparkBadgeStyle = useAnimatedStyle(() => ({
    opacity: currentIndex.value === index
      ? interpolate(panX.value, [0, screenWidth * 0.25], [0, 1], Extrapolation.CLAMP)
      : 0,
  }));

  const skipBadgeStyle = useAnimatedStyle(() => ({
    opacity: currentIndex.value === index
      ? interpolate(panX.value, [0, -screenWidth * 0.25], [0, 1], Extrapolation.CLAMP)
      : 0,
  }));

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.card, rStyle]}>
      <View style={[styles.top, { backgroundColor: data.accent }]}>
        <Text style={styles.emoji}>{data.emoji}</Text>
        <View style={styles.topMeta}>
          <View style={[styles.categoryPill, { backgroundColor: 'rgba(0,0,0,0.18)' }]}>
            <Text style={styles.categoryText}>{data.category}</Text>
          </View>
          <Text style={styles.charityName}>{data.charityName}</Text>
        </View>
      </View>

      <View style={styles.body}>
        <Text style={styles.title}>{data.title}</Text>
        <Text style={styles.bodyText}>{data.body}</Text>
        <Text style={styles.supporters}>{data.supporters} supporters</Text>
      </View>

      <Animated.View style={[styles.sparkBadge, sparkBadgeStyle]}>
        <Text style={styles.sparkBadgeText}>✦ spark</Text>
      </Animated.View>

      <Animated.View style={[styles.skipBadge, skipBadgeStyle]}>
        <Text style={styles.skipBadgeText}>skip</Text>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
  top: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    gap: 14,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  emoji: {
    fontSize: 56,
  },
  topMeta: {
    alignItems: 'center',
    gap: 8,
  },
  categoryPill: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  categoryText: {
    color: 'rgba(255,255,255,0.9)',
    fontFamily: 'SplineSansMono_600SemiBold',
    fontSize: 11,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  charityName: {
    color: '#FFFFFF',
    fontFamily: 'SofiaSansCondensed_800ExtraBold',
    fontSize: 26,
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  body: {
    backgroundColor: '#FFFFFF',
    gap: 10,
    padding: 22,
    paddingBottom: 26,
  },
  title: {
    color: '#171A18',
    fontFamily: 'SofiaSansCondensed_800ExtraBold',
    fontSize: 22,
    letterSpacing: 0.1,
    lineHeight: 27,
  },
  bodyText: {
    color: '#4E554F',
    fontFamily: 'RobotoSlab_400Regular',
    fontSize: 14,
    lineHeight: 22,
  },
  supporters: {
    color: '#90968F',
    fontFamily: 'SplineSansMono_400Regular',
    fontSize: 12,
    marginTop: 2,
  },
  sparkBadge: {
    backgroundColor: '#2E8B77',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    position: 'absolute',
    right: 20,
    top: 28,
  },
  sparkBadgeText: {
    color: '#FFFFFF',
    fontFamily: 'SofiaSansCondensed_800ExtraBold',
    fontSize: 18,
    letterSpacing: 0.5,
  },
  skipBadge: {
    backgroundColor: '#6B7280',
    borderRadius: 12,
    left: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    position: 'absolute',
    top: 28,
  },
  skipBadgeText: {
    color: '#FFFFFF',
    fontFamily: 'SofiaSansCondensed_800ExtraBold',
    fontSize: 18,
    letterSpacing: 0.5,
  },
});
