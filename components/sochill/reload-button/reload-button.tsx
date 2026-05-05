import { useMemo, type FC } from 'react';
import { StyleSheet, View } from 'react-native';

import * as Haptics from 'expo-haptics';
import { PressableScale } from 'pressto';
import { Path } from 'react-native-svg';
import Animated, {
  type SharedValue,
  runOnJS,
  useAnimatedProps,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg from 'react-native-svg';

import { buildSvgHalfPaths } from './create-svg-path';

import type { StyleProp, ViewStyle } from 'react-native';

const AnimatedPath = Animated.createAnimatedComponent(Path);

export type ReloadButtonProps = {
  width: number;
  height: number;
  progress: SharedValue<number>;
  strokeWidth?: number;
  borderRadius?: number;
  color: string;
  label?: string;
  onPress?: () => void;
  fontSize?: number;
  style?: StyleProp<ViewStyle>;
};

const hapticFeedback = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
};

export const ReloadButton: FC<ReloadButtonProps> = ({
  width,
  height,
  progress,
  strokeWidth = 0,
  borderRadius = 0,
  onPress,
  color,
  label = 'Reload',
  fontSize = 16,
  style,
}) => {
  const { rightPath, leftPath, pathLength } = useMemo(() => {
    return buildSvgHalfPaths({ strokeWidth, borderRadius, width, height });
  }, [borderRadius, height, strokeWidth, width]);

  const activated = useDerivedValue(() => progress.value > 0.98, [progress]);

  const rContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(!activated.value ? 1 : 1.1) }],
  }));

  useAnimatedReaction(
    () => activated.value,
    (curr, prev) => {
      if (curr && !prev) {
        runOnJS(hapticFeedback)();
      }
    },
  );

  const fillOpacity = useDerivedValue(() => withTiming(activated.value ? 1 : 0));

  const rFillStyle = useAnimatedStyle(() => ({ opacity: fillOpacity.value }));

  const rTextStyle = useAnimatedStyle(() => ({
    fontSize,
    color: activated.value ? 'white' : color,
    opacity: progress.value,
    fontWeight: activated.value ? '600' : '500',
  }));

  const rightPathProps = useAnimatedProps(() => ({
    strokeDashoffset: pathLength * (1 - progress.value),
  }));

  const leftPathProps = useAnimatedProps(() => ({
    strokeDashoffset: pathLength * (1 - progress.value),
  }));

  return (
    <PressableScale onPress={onPress} style={style}>
      <Animated.View style={rContainerStyle}>
        <Svg height={height} width={width} style={StyleSheet.absoluteFill}>
          <AnimatedPath
            d={rightPath}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={pathLength}
            animatedProps={rightPathProps}
          />
          <AnimatedPath
            d={leftPath}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={pathLength}
            animatedProps={leftPathProps}
          />
        </Svg>
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { borderRadius, backgroundColor: color },
            rFillStyle,
          ]}
        />
        <View style={[{ height, width }, styles.container]}>
          <Animated.Text style={[{ fontSize }, styles.label, rTextStyle]}>
            {label}
          </Animated.Text>
        </View>
      </Animated.View>
    </PressableScale>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    alignItems: 'baseline',
    alignSelf: 'center',
    flex: 1,
    position: 'absolute',
  },
});
