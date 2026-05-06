import { Dimensions, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { useMemo } from 'react';

import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';

import type { SharedValue } from 'react-native-reanimated';

export type ScrollCardData = {
  color: string;
  accent: string;
  label: string;
  sub: string;
  emoji: string;
};

export type ScrollCardProps = {
  index: number;
  data: ScrollCardData;
  scrollOffset: SharedValue<number>;
};

const { width: INITIAL_WINDOW_WIDTH } = Dimensions.get('window');
export const CARD_WIDTH = INITIAL_WINDOW_WIDTH / 3;
export const CARD_HEIGHT = (CARD_WIDTH / 3) * 4;

const ANIM = {
  scale: { min: 0.75, medium: 0.8, active: 1 },
  rotation: { max: Math.PI / 5, medium: Math.PI / 10, small: Math.PI / 20 },
  tx: { small: 0.2, medium: 0.25, large: 0.3 },
  ty: { small: 0.02, medium: 0.025, large: 0.04, active: 0.05 },
  swapDiv: 2.8,
  perspective: { val: 10000000, rot: Math.PI / 10, swap: Math.PI / 5 },
  zIndex: { min: 0, low: 200, medium: 300, high: 400 },
};

export const ScrollCard: React.FC<ScrollCardProps> = ({ index, data, scrollOffset }) => {
  const { width: windowWidth } = useWindowDimensions();

  const inputRange = [
    (index - 3) * CARD_WIDTH,
    (index - 2) * CARD_WIDTH,
    (index - 1) * CARD_WIDTH,
    index * CARD_WIDTH,
    (index + 1) * CARD_WIDTH,
    (index + 2) * CARD_WIDTH,
    (index + 3) * CARD_WIDTH,
  ];

  const rStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollOffset.value,
      inputRange,
      [ANIM.scale.min, ANIM.scale.medium, ANIM.scale.medium, ANIM.scale.active, ANIM.scale.medium, ANIM.scale.medium, ANIM.scale.min],
      Extrapolation.CLAMP,
    );

    const rotate = interpolate(
      scrollOffset.value,
      inputRange,
      [-ANIM.rotation.max, -ANIM.rotation.medium, -ANIM.rotation.small, 0, ANIM.rotation.small, ANIM.rotation.medium, ANIM.rotation.max],
      Extrapolation.CLAMP,
    );

    const translateX = interpolate(
      scrollOffset.value,
      inputRange,
      [
        -CARD_WIDTH * ANIM.tx.large,
        -CARD_WIDTH * ANIM.tx.medium,
        -CARD_WIDTH * ANIM.tx.small,
        0,
        CARD_WIDTH * ANIM.tx.small,
        CARD_WIDTH * ANIM.tx.medium,
        CARD_WIDTH * ANIM.tx.large,
      ],
      Extrapolation.CLAMP,
    );

    const translateY = interpolate(
      scrollOffset.value,
      inputRange,
      [
        -CARD_HEIGHT * ANIM.ty.active,
        -CARD_HEIGHT * ANIM.ty.medium,
        -CARD_HEIGHT * ANIM.ty.large,
        0,
        -CARD_HEIGHT * ANIM.ty.large,
        -CARD_HEIGHT * ANIM.ty.medium,
        -CARD_HEIGHT * ANIM.ty.small,
      ],
      Extrapolation.CLAMP,
    );

    const perspectiveRotateY = interpolate(
      scrollOffset.value,
      [
        (index - 3) * CARD_WIDTH,
        (index - 2) * CARD_WIDTH,
        (index - 1) * CARD_WIDTH,
        (index - 0.5) * CARD_WIDTH,
        index * CARD_WIDTH,
        (index + 0.5) * CARD_WIDTH,
        (index + 1) * CARD_WIDTH,
        (index + 2) * CARD_WIDTH,
        (index + 3) * CARD_WIDTH,
      ],
      [
        -ANIM.perspective.rot,
        -ANIM.perspective.rot,
        -ANIM.rotation.small,
        -ANIM.perspective.swap,
        0,
        ANIM.perspective.swap,
        ANIM.rotation.small,
        ANIM.perspective.rot,
        ANIM.perspective.rot,
      ],
      Extrapolation.CLAMP,
    );

    const additionalTranslateX = interpolate(
      scrollOffset.value,
      [
        (index - 3) * CARD_WIDTH,
        (index - 2) * CARD_WIDTH,
        (index - 1) * CARD_WIDTH,
        (index - 0.5) * CARD_WIDTH,
        index * CARD_WIDTH,
        (index + 0.5) * CARD_WIDTH,
        (index + 1) * CARD_WIDTH,
        (index + 2) * CARD_WIDTH,
        (index + 3) * CARD_WIDTH,
      ],
      [0, 0, 0, -CARD_WIDTH / ANIM.swapDiv, 0, CARD_WIDTH / ANIM.swapDiv, 0, 0, 0],
      Extrapolation.CLAMP,
    );

    // Hide cards that have already been scrolled past
    const opacity = scrollOffset.value > (index + 0.6) * CARD_WIDTH ? 0 : 1;

    return {
      opacity,
      transform: [
        { translateX },
        { translateY },
        { translateX: additionalTranslateX },
        { scale },
        { rotate: `${rotate}rad` },
        { rotateY: `${perspectiveRotateY}rad` },
      ],
    };
  });

  const zIndexStyle = useAnimatedStyle(() => {
    const zIndex = interpolate(
      scrollOffset.value,
      inputRange,
      [ANIM.zIndex.min, ANIM.zIndex.low, ANIM.zIndex.medium, ANIM.zIndex.high, ANIM.zIndex.medium, ANIM.zIndex.low, ANIM.zIndex.min],
      Extrapolation.CLAMP,
    );

    return { zIndex };
  });

  const shadowStyle = useMemo(
    () => ({
      boxShadow: '0px 6px 18px rgba(0, 0, 0, 0.09)',
    }),
    [],
  );

  return (
    <Animated.View style={[StyleSheet.absoluteFillObject, zIndexStyle]}>
      <Animated.View
        style={[
          {
            position: 'absolute',
            left: (windowWidth - CARD_WIDTH) / 2,
            height: CARD_HEIGHT,
            width: CARD_WIDTH,
            borderRadius: 20,
            borderCurve: 'continuous' as never,
            backgroundColor: data.color,
          } as object,
          shadowStyle,
          rStyle,
        ]}>
        <View style={[styles.emojiArea, { backgroundColor: data.accent }]}>
          <Text style={styles.emoji}>{data.emoji}</Text>
        </View>
        <View style={styles.body}>
          <Text style={styles.label} numberOfLines={2}>{data.label}</Text>
          <Text style={styles.sub} numberOfLines={2}>{data.sub}</Text>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  emojiArea: {
    alignItems: 'center',
    borderRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    flex: 1,
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 38,
  },
  body: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  label: {
    color: '#171A18',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: -0.2,
    marginBottom: 3,
  },
  sub: {
    color: '#7C827D',
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 15,
  },
});
