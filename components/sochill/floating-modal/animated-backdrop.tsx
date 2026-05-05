import { StyleSheet } from 'react-native';

import { type FC, memo } from 'react';

import Animated, {
  type SharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

type AnimatedBackdropProps = {
  onBackdropPress?: () => void;
  isVisible: SharedValue<boolean>;
};

export const AnimatedBackdrop: FC<AnimatedBackdropProps> = memo(
  ({ onBackdropPress, isVisible }) => {
    const rAnimatedStyle = useAnimatedStyle(() => {
      return {
        opacity: withTiming(isVisible.value ? 1 : 0),
      };
    }, [isVisible]);

    const rAnimatedProps = useAnimatedProps(() => {
      return {
        pointerEvents: isVisible.value ? 'auto' : 'none',
      } as never;
    }, [isVisible]);

    return (
      <Animated.View
        animatedProps={rAnimatedProps}
        onTouchStart={onBackdropPress}
        style={[
          {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0,0,0,0.4)',
          },
          rAnimatedStyle,
        ]}
      />
    );
  },
);

AnimatedBackdrop.displayName = 'AnimatedBackdrop';
