import { Pressable, StyleSheet, View } from 'react-native';

import { AntDesign } from '@expo/vector-icons';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

type TabProps = {
  label: string;
  maxWidth: number;
  minWidth: number;
  isActive: boolean;
  onPress: () => void;
  icon: keyof typeof AntDesign.glyphMap;
};

const IconSize = 20;

export const Tab = ({
  label,
  maxWidth,
  minWidth,
  isActive,
  onPress,
  icon,
}: TabProps) => {
  const progress = useDerivedValue(() => {
    return withSpring(isActive ? 1 : 0, {
      dampingRatio: 1,
      duration: 400,
    });
  }, [isActive]);

  const pressScale = useSharedValue(1);

  const rTabStyle = useAnimatedStyle(() => {
    return {
      width: interpolate(progress.value, [0, 1], [minWidth, maxWidth]),
      backgroundColor: isActive ? '#171A18' : '#F4F0E8',
      transform: [{ scale: pressScale.value }],
    };
  }, [isActive]);

  const gap = useDerivedValue(() => {
    return interpolate(progress.value, [0, 1], [0, 15]);
  }, []);

  const rTextStyle = useAnimatedStyle(() => {
    return {
      opacity: progress.value ** 3,
      marginLeft: gap.value,
    };
  }, [isActive]);

  const rIconStyle = useAnimatedStyle(() => {
    const translateX = interpolate(progress.value, [0, 1], [(minWidth - IconSize) / 2, IconSize]);

    return {
      left: translateX,
      position: 'absolute',
    };
  }, []);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => { pressScale.value = withSpring(0.92, { stiffness: 400, damping: 20 }); }}
      onPressOut={() => { pressScale.value = withSpring(1, { stiffness: 400, damping: 20 }); }}>
      <Animated.View style={[rTabStyle, styles.container]}>
        <View style={styles.innerContainer}>
          <Animated.View style={[styles.iconContainer, rIconStyle]}>
            <AntDesign name={icon} size={IconSize} color={isActive ? '#FFFFFF' : '#59605A'} />
          </Animated.View>
          <Animated.Text numberOfLines={1} key={label} style={[styles.label, rTextStyle]}>
            {label}
          </Animated.Text>
        </View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 15,
    height: 52,
    justifyContent: 'center',
  },
  iconContainer: {
    height: IconSize,
    width: IconSize,
    zIndex: 100,
  },
  innerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    overflow: 'hidden',
    width: '100%',
  },
  label: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    zIndex: 100,
  },
});
