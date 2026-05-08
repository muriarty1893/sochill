import { View, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useGetMode } from '@/hooks/use-mode';
import { RepostUnFocused } from '../icons';

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
  const inactiveColor = isDark ? 'white' : 'black';
  const activeColor = '#17BF63';

  const progress = useSharedValue(isPosted ? 1 : 0);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(1 + progress.value * 0.15, { damping: 12, stiffness: 300 }) }],
  }));

  const color = clicked ? activeColor : inactiveColor;

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
      <Pressable
        style={{ flexDirection: 'row', width: 30, height: 22, gap: 2, alignItems: 'center' }}
        onPress={() => {
          progress.value = withSpring(clicked ? 0 : 1, { damping: 12, stiffness: 300 });
          setReposted(!clicked);
        }}
      >
        <Animated.View style={iconStyle}>
          <RepostUnFocused size={18} color={color} />
        </Animated.View>
      </Pressable>
    </View>
  );
}
