import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';

export type SwipeCardProps = {
  index: number;
  data: any;
  currentIndex: SharedValue<number>;
  panX: SharedValue<number>;
  screenWidth: number;
  isDark: boolean;
};

const STACK_DEPTH = 3;

export const SwipeCard: React.FC<SwipeCardProps> = ({ index, data, currentIndex, panX, screenWidth, isDark }) => {
  const cardBg = isDark ? '#111' : '#fff';
  const titleColor = isDark ? '#fff' : '#171A18';
  const bodyColor = isDark ? '#aaa' : '#4E554F';
  const supportersColor = isDark ? '#666' : '#90968F';

  const rStyle = useAnimatedStyle(() => {
    const dist = currentIndex.value - index;
    if (dist < 0) return { opacity: 0, zIndex: 0, pointerEvents: 'none' as const };
    if (dist === 0) {
      return {
        opacity: 1,
        zIndex: 100,
        transform: [
          { translateX: panX.value },
          { rotate: `${(panX.value / screenWidth) * 12}deg` },
          { scale: 1 },
          { translateY: 0 },
        ],
      };
    }
    const d = Math.min(dist, STACK_DEPTH);
    return {
      opacity: dist <= STACK_DEPTH ? 1 : 0,
      zIndex: 100 - d * 10,
      transform: [
        { translateX: 0 },
        { rotate: '0deg' },
        { scale: interpolate(d, [1, STACK_DEPTH], [0.96, 0.88], Extrapolation.CLAMP) },
        { translateY: interpolate(d, [1, STACK_DEPTH], [12, 30], Extrapolation.CLAMP) },
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
    <Animated.View style={[StyleSheet.absoluteFill, styles.card, { backgroundColor: cardBg }, rStyle]}>
      <View style={[styles.top, { backgroundColor: data.accent ?? '#555' }]}>
        <Text style={styles.emoji}>{data.emoji}</Text>
        <View style={styles.topMeta}>
          <View style={[styles.categoryPill, { backgroundColor: 'rgba(0,0,0,0.2)' }]}>
            <Text style={styles.categoryText}>{data.category}</Text>
          </View>
          <Text style={styles.charityName}>{data.charity_name}</Text>
        </View>
      </View>

      <View style={[styles.body, { backgroundColor: cardBg }]}>
        <Text style={[styles.title, { color: titleColor }]}>{data.title}</Text>
        <Text style={[styles.bodyText, { color: bodyColor }]}>{data.body}</Text>
        <Text style={[styles.supporters, { color: supportersColor }]}>
          {data.supporters_count?.toLocaleString()} supporters
        </Text>
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
    borderRadius: 24,
    elevation: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
  },
  top: { alignItems: 'center', flex: 1, gap: 14, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 32 },
  emoji: { fontSize: 56 },
  topMeta: { alignItems: 'center', gap: 8 },
  categoryPill: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  categoryText: { color: 'rgba(255,255,255,0.9)', fontFamily: 'mulishMedium', fontSize: 11, letterSpacing: 0.5, textTransform: 'uppercase' },
  charityName: { color: '#fff', fontFamily: 'uberBold', fontSize: 26, letterSpacing: 0.2, textAlign: 'center' },
  body: { gap: 10, padding: 22, paddingBottom: 26 },
  title: { fontFamily: 'jakaraBold', fontSize: 20, lineHeight: 26 },
  bodyText: { fontFamily: 'mulish', fontSize: 13, lineHeight: 21 },
  supporters: { fontFamily: 'mulish', fontSize: 12, marginTop: 2 },
  sparkBadge: { backgroundColor: '#2E8B77', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 8, position: 'absolute', right: 20, top: 28 },
  sparkBadgeText: { color: '#fff', fontFamily: 'jakaraBold', fontSize: 17 },
  skipBadge: { backgroundColor: '#6B7280', borderRadius: 12, left: 20, paddingHorizontal: 16, paddingVertical: 8, position: 'absolute', top: 28 },
  skipBadgeText: { color: '#fff', fontFamily: 'jakaraBold', fontSize: 17 },
});
