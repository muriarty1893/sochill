import { type FC, memo } from 'react';
import { Pressable } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Animated, { Extrapolation, interpolate, type SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { FLOATING_BUTTON_SIZE } from './constants';

type AddCloseIconProps = {
  onPress: () => void;
  progress: SharedValue<number>;
  isDark?: boolean;
};

export const AddCloseIcon: FC<AddCloseIconProps> = memo(({ onPress, progress, isDark }) => {
  const iconColor = isDark ? 'white' : 'black';

  const rIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${interpolate(progress.value, [0, 1], [0, Math.PI / 4], Extrapolation.CLAMP)}rad` }],
  }), []);

  return (
    <Pressable
      onPress={onPress}
      style={{
        position: 'absolute',
        width: FLOATING_BUTTON_SIZE,
        aspectRatio: 1,
        top: 0,
        left: 0,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Animated.View style={rIconStyle}>
        <AntDesign name="plus" size={28} color={iconColor} />
      </Animated.View>
    </Pressable>
  );
});

AddCloseIcon.displayName = 'AddCloseIcon';
