import { useCallback, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';

import { AntDesign, FontAwesome6 } from '@expo/vector-icons';
import { PressableScale } from 'pressto';
import Animated, {
  cancelAnimation,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { BlastCircleEffect, type BlastEffectRefType } from './components/blast-effect';

type CircularButtonProps = {
  blastRadius: number;
  size: number;
  baseIcon?: React.ReactNode;
  activeIcon?: React.ReactNode;
  autoReset?: boolean;
  onPress?: () => void;
  backgroundColor?: string;
};

const BlastCurveConfig = {
  mass: 0.5,
  stiffness: 70,
  damping: 16,
};

const FastResetConfig = {
  mass: 0.5,
  stiffness: 120,
  damping: 14,
};

const BlastEffectConfig = {
  mass: 1,
  stiffness: 100,
  damping: 20,
};

const lightColor = '#FDFBF5';
const darkColor = '#171A18';

export const CircularButton: React.FC<CircularButtonProps> = ({
  blastRadius,
  size,
  baseIcon: baseIconProp,
  activeIcon: activeIconProp,
  autoReset = true,
  onPress,
  backgroundColor = darkColor,
}) => {
  const progress = useSharedValue(0);
  const isAnimating = useSharedValue(false);

  const boxStyle = useMemo(() => {
    return {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor,
    };
  }, [backgroundColor, size]);

  const blastSize = size * 5;
  const blastEffectRef = useRef<BlastEffectRefType>(null);

  const baseIcon = useMemo(() => {
    if (baseIconProp) {
      return baseIconProp;
    }

    return <AntDesign name="plus-circle" size={size} color={lightColor} />;
  }, [baseIconProp, size]);

  const activeIcon = useMemo(() => {
    if (activeIconProp) {
      return activeIconProp;
    }

    return <FontAwesome6 name="check" size={size / 2} color={lightColor} />;
  }, [activeIconProp, size]);

  const rBaseIconStyle = useAnimatedStyle(() => {
    const rotate = interpolate(progress.value, [0, 0.5], [0, 45], Extrapolation.CLAMP);

    return {
      opacity: interpolate(progress.value, [0, 0.5], [1, 0]),
      transform: [
        {
          rotate: `${rotate}deg`,
        },
      ],
    };
  }, [progress]);

  const rActiveIconStyle = useAnimatedStyle(() => {
    const rotate = interpolate(progress.value, [0, 1], [-45, 0], Extrapolation.CLAMP);

    return {
      opacity: interpolate(progress.value, [0, 1], [0, 1]),
      transform: [
        {
          rotate: `${rotate}deg`,
        },
      ],
    };
  }, [progress]);

  const blastCenterStyle = useMemo(() => {
    return {
      transform: [
        { translateX: -blastSize / 2 + size / 2 },
        { translateY: -blastSize / 2 + size / 2 },
      ],
    };
  }, [blastSize, size]);

  const onPressHandler = useCallback(() => {
    if (isAnimating.value) {
      return;
    }

    onPress?.();

    cancelAnimation(progress);
    isAnimating.value = true;

    progress.value = withSpring(1, BlastCurveConfig, (isFinished) => {
      if (autoReset && isFinished) {
        progress.value = withSpring(0, FastResetConfig, (resetFinished) => {
          if (resetFinished) {
            isAnimating.value = false;
          }
        });
      } else {
        isAnimating.value = false;
      }
    });

    blastEffectRef.current?.blast(BlastEffectConfig, 100);
  }, [autoReset, isAnimating, onPress, progress]);

  return (
    <View style={styles.boxContainer}>
      <View style={[styles.blastContainer, blastCenterStyle]}>
        <BlastCircleEffect
          blastRadius={blastRadius}
          size={blastSize}
          ref={blastEffectRef}
          count={20}
          circleRadius={2}
        />
      </View>
      <PressableScale style={boxStyle} onPress={onPressHandler}>
        <Animated.View style={[styles.iconContainer, rBaseIconStyle]}>{baseIcon}</Animated.View>
        <Animated.View style={[styles.iconContainer, rActiveIconStyle]}>{activeIcon}</Animated.View>
      </PressableScale>
    </View>
  );
};

const styles = StyleSheet.create({
  blastContainer: {
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  boxContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    ...StyleSheet.absoluteFillObject,
  },
});
