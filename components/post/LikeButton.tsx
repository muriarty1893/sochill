import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useGetMode } from '@/hooks/use-mode';
import { HeartUnfocused, HeartsFocused } from '../icons';

export default function LikeButton({
  isLiked,
  clicked,
  text,
  setClicked,
}: {
  text?: string;
  setClicked: (v: boolean) => void;
  clicked: boolean;
  isLiked?: boolean;
}) {
  const isDark = useGetMode();
  const color = isDark ? 'white' : 'black';
  const liked = useSharedValue(isLiked ? 1 : 0);

  const outlineStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(liked.value, [0, 1], [1, 0], Extrapolation.CLAMP) }],
  }));
  const fillStyle = useAnimatedStyle(() => ({ transform: [{ scale: liked.value }] }));

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
      <Pressable
        style={{ flexDirection: 'row', width: 36, height: 22, gap: 2, alignItems: 'center' }}
        onPress={() => {
          liked.value = withSpring(liked.value ? 0 : 1);
          setClicked(!clicked);
        }}
      >
        <View style={{ width: 18 }}>
          <Animated.View style={[StyleSheet.absoluteFillObject, outlineStyle]}>
            <HeartUnfocused size={18} color="red" />
          </Animated.View>
          <Animated.View style={fillStyle}>
            <HeartsFocused size={18} color="red" />
          </Animated.View>
        </View>
        <Text style={{ color, fontFamily: 'jakara', includeFontPadding: false }}>{text}</Text>
      </Pressable>
    </View>
  );
}
