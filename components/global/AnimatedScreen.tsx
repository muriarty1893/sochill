import { ReactNode, useCallback } from 'react';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useFocusEffect } from '@react-navigation/native';
import { View, ViewStyle } from 'react-native';
import { Image } from 'expo-image';

export default function AnimatedScreen({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(opacity.value, [0, 1], [0, 1]),
  }));

  useFocusEffect(
    useCallback(() => {
      opacity.value = withTiming(1, { duration: 250 });
      return () => {
        Image.clearMemoryCache();
        opacity.value = withTiming(0, { duration: 250 });
      };
    }, [opacity]),
  );

  return (
    <View style={{ flex: 1, backgroundColor: 'transparent' }}>
      <Animated.View style={[{ flex: 1, backgroundColor: 'transparent' }, style, animatedStyle]}>
        {children}
      </Animated.View>
    </View>
  );
}
