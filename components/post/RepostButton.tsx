import { View, Pressable, StyleSheet } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useGetMode } from '@/hooks/use-mode';
import { Repost, RepostUnFocused } from '../icons';

export default function RepostButton({
  isPosted,
  clicked,
  setReposted,
}: {
  setReposted: (v: boolean) => void;
  clicked: boolean;
  isPosted?: boolean;
}) {
  const isDark = useGetMode();
  const color = isDark ? 'white' : 'black';
  const rColor = isDark ? '#75B8C8' : '#11262C';

  const reposted = useSharedValue(isPosted ? 1 : 0);

  const outlineStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(reposted.value, [0, 1], [1, 0], Extrapolation.CLAMP) }],
  }));

  const fillStyle = useAnimatedStyle(() => ({
    transform: [{ scale: reposted.value }],
  }));

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
      <Pressable
        style={{ flexDirection: 'row', width: 30, height: 22, gap: 2, alignItems: 'center' }}
        onPress={() => {
          reposted.value = withSpring(reposted.value ? 0 : 1);
          setReposted(!clicked);
        }}
      >
        <View style={{ width: 18 }}>
          <Animated.View style={[StyleSheet.absoluteFillObject, outlineStyle]}>
            <RepostUnFocused size={18} color={color} />
          </Animated.View>
          <Animated.View style={fillStyle}>
            <Repost size={18} color={rColor} />
          </Animated.View>
        </View>
      </Pressable>
    </View>
  );
}
