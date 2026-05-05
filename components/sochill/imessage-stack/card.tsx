import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';

import type { SharedValue } from 'react-native-reanimated';
import type { FC } from 'react';

export interface CardData {
  id: string;
  name: string;
  handle?: string;
  avatar: string;
  imageColor: string;
  subtitle: string;
  type: 'friend' | 'cause';
  icon: string;
  description?: string;
  progress?: number;
  supporters?: number;
  category?: string;
}

export type QueueCardProps = {
  data: CardData;
  stackPosition: number;
  translateX: SharedValue<number>;
  total: number;
  cardWidth: number;
  cardHeight: number;
  swipeThreshold: number;
};

const STACK_SCALE = 0.055;
const STACK_OFFSET_Y = 18;

export const QueueCard: FC<QueueCardProps> = ({
  data,
  stackPosition,
  translateX,
  total,
  cardWidth,
  cardHeight,
  swipeThreshold,
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const isFront = stackPosition === 0;
  const imageHeight = cardHeight * 0.52;

  const rStyle = useAnimatedStyle(() => {
    if (isFront) {
      const rotate = interpolate(
        translateX.value,
        [-cardWidth, cardWidth],
        [-10, 10],
        Extrapolation.CLAMP,
      );
      return {
        transform: [
          { translateX: translateX.value },
          { rotate: `${rotate}deg` },
        ],
        zIndex: total,
      };
    }

    // Rise 0→1 while dragging, hold at 1 during early flight, then fall back
    // to 0 as the card exits the viewport — so swipeProgress is already 0 when
    // advance() fires and the state re-maps which card sits at which stackPos.
    const absX = Math.abs(translateX.value);
    const swipeProgress = interpolate(
      absX,
      [0, swipeThreshold, windowWidth * 0.9, windowWidth * 1.5],
      [0, 1, 1, 0],
      Extrapolation.CLAMP,
    );

    const scale = interpolate(
      swipeProgress,
      [0, 1],
      [1 - stackPosition * STACK_SCALE, 1 - (stackPosition - 1) * STACK_SCALE],
    );
    const translateY = interpolate(
      swipeProgress,
      [0, 1],
      [stackPosition * STACK_OFFSET_Y, (stackPosition - 1) * STACK_OFFSET_Y],
    );

    return {
      transform: [{ scale }, { translateY }],
      zIndex: total - stackPosition,
    };
  });

  const rightLabelStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [0, swipeThreshold * 0.4],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  const leftLabelStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [-swipeThreshold * 0.4, 0],
      [1, 0],
      Extrapolation.CLAMP,
    ),
  }));

  return (
    <Animated.View
      style={[
        styles.card,
        {
          width: cardWidth,
          height: cardHeight,
          left: (windowWidth - cardWidth) / 2,
        },
        rStyle,
      ]}>
      <View style={[styles.imageArea, { height: imageHeight, backgroundColor: data.imageColor }]}>
        <MaterialIcons
          name={data.icon as keyof typeof MaterialIcons.glyphMap}
          size={88}
          color="rgba(255,255,255,0.12)"
        />
        {data.category ? (
          <View style={styles.categoryChip}>
            <Text style={styles.chipText}>{data.category.toUpperCase()}</Text>
          </View>
        ) : (
          <View style={styles.avatarChip}>
            <Text style={styles.chipText}>{data.avatar}</Text>
          </View>
        )}
        {data.type === 'cause' && (
          <View style={styles.causeBadge}>
            <Text style={styles.causeBadgeText}>cause</Text>
          </View>
        )}
      </View>

      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>{data.name}</Text>
        {data.handle ? (
          <Text style={styles.handle}>{data.handle}</Text>
        ) : null}
        <Text style={styles.subtitle} numberOfLines={2}>
          {data.description ?? data.subtitle}
        </Text>
        {data.progress !== undefined && (
          <View style={styles.progressSection}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${Math.round(data.progress * 100)}%` }]} />
            </View>
            <Text style={styles.progressMeta}>
              {Math.round(data.progress * 100)}% funded · {data.supporters} supporters
            </Text>
          </View>
        )}
      </View>

      {isFront && (
        <>
          <Animated.View style={[styles.swipeLabel, styles.swipeLabelRight, rightLabelStyle]}>
            <Text style={[styles.swipeLabelText, { color: '#2E8B77' }]}>LIKE</Text>
          </Animated.View>
          <Animated.View style={[styles.swipeLabel, styles.swipeLabelLeft, leftLabelStyle]}>
            <Text style={[styles.swipeLabelText, { color: '#9A8174' }]}>SKIP</Text>
          </Animated.View>
        </>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#3B3B3B',
    borderRadius: 24,
    boxShadow: '0px 10px 32px rgba(5,2,6,0.45)',
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
  },
  imageArea: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryChip: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 12,
    left: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
    position: 'absolute',
    top: 16,
  },
  avatarChip: {
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: 12,
    left: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
    position: 'absolute',
    top: 16,
  },
  chipText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  causeBadge: {
    backgroundColor: '#9A8174',
    borderRadius: 10,
    bottom: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    position: 'absolute',
    right: 16,
  },
  causeBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  name: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
    marginBottom: 3,
  },
  handle: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  progressSection: {
    marginTop: 12,
  },
  progressTrack: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 3,
    height: 5,
    marginBottom: 6,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: '#2E8B77',
    borderRadius: 3,
    height: '100%',
  },
  progressMeta: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 11,
    fontWeight: '600',
  },
  swipeLabel: {
    borderRadius: 8,
    borderWidth: 3,
    paddingHorizontal: 10,
    paddingVertical: 5,
    position: 'absolute',
    top: 28,
  },
  swipeLabelRight: {
    borderColor: '#2E8B77',
    right: 16,
    transform: [{ rotate: '15deg' }],
  },
  swipeLabelLeft: {
    borderColor: '#9A8174',
    left: 16,
    transform: [{ rotate: '-15deg' }],
  },
  swipeLabelText: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 2,
  },
});
