import { forwardRef, memo, useImperativeHandle, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import Animated, {
  cancelAnimation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';

import type { FC } from 'react';
import type { SharedValue, WithSpringConfig } from 'react-native-reanimated';

type BlastCircleEffectProps = {
  size: number;
  count: number;
  circleRadius: number;
  blastRadius?: number;
};

export type BlastEffectRefType = {
  blast: (springAnimationConfig?: WithSpringConfig, delay?: number) => void;
};

type ParticleProps = {
  progress: SharedValue<number>;
  angle: number;
  radiusFactor: number;
  blastRadius: number;
  circleRadius: number;
  containerSize: number;
};

const Particle: FC<ParticleProps> = memo(function Particle({
  progress,
  angle,
  radiusFactor,
  blastRadius,
  circleRadius,
  containerSize,
}) {
  const rStyle = useAnimatedStyle(() => {
    const r = interpolate(progress.value, [0, 1], [0, blastRadius * radiusFactor]);
    const opacity = interpolate(progress.value, [0, 0.15, 0.7, 1], [0, 1, 0.6, 0]);
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    return {
      opacity,
      transform: [
        { translateX: containerSize / 2 - circleRadius + x },
        { translateY: containerSize / 2 - circleRadius + y },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        styles.particle,
        { width: circleRadius * 2, height: circleRadius * 2, borderRadius: circleRadius },
        rStyle,
      ]}
    />
  );
});

export const BlastCircleEffect = forwardRef<BlastEffectRefType, BlastCircleEffectProps>(
  ({ size: containerSize, count, circleRadius, blastRadius: blastRadiusProp }, ref) => {
    const blastRadius = blastRadiusProp ?? containerSize / 2 - circleRadius * 2;
    const progress = useSharedValue(0);

    const particles = useMemo(
      () =>
        Array.from({ length: count }, (_, i) => ({
          angle:
            (i / count) * Math.PI * 2 +
            (Math.random() - 0.5) * ((Math.PI * 2) / count) * 0.4,
          radiusFactor: 0.8 + Math.random() * 0.4,
        })),
      [count],
    );

    useImperativeHandle(
      ref,
      () => ({
        blast: (springAnimationConfig?: WithSpringConfig, delay?: number) => {
          cancelAnimation(progress);
          progress.value = 0;
          progress.value = withDelay(delay ?? 0, withSpring(1, springAnimationConfig));
        },
      }),
      [progress],
    );

    return (
      <View style={{ width: containerSize, height: containerSize }}>
        {particles.map((p, i) => (
          <Particle
            key={i}
            progress={progress}
            angle={p.angle}
            radiusFactor={p.radiusFactor}
            blastRadius={blastRadius}
            circleRadius={circleRadius}
            containerSize={containerSize}
          />
        ))}
      </View>
    );
  },
);

BlastCircleEffect.displayName = 'BlastCircleEffect';

const styles = StyleSheet.create({
  particle: {
    backgroundColor: '#ffffff',
    position: 'absolute',
  },
});
