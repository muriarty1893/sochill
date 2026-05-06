import { StyleSheet } from 'react-native';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';

import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

type ComposableTextProps = {
  text: string;
  style?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
};

export function ComposableText({ text, style, containerStyle }: ComposableTextProps) {
  return (
    <Animated.View style={[styles.container, containerStyle]}>
      {text.split('').map((char, index) => (
        <Animated.Text
          key={`${index}-${text}`}
          entering={FadeInRight.duration(160).delay(index * 18)}
          exiting={FadeOutLeft.duration(120)}
          style={style}
        >
          {char === ' ' ? ' ' : char}
        </Animated.Text>
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    overflow: 'hidden',
  },
});
