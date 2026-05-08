import { ActivityIndicator, Pressable, View, ViewStyle } from 'react-native';
import { ReactNode } from 'react';
import { useGetMode } from '@/hooks/use-mode';

export default function Button({
  children,
  onPress,
  loading,
  style,
}: {
  children: ReactNode;
  onPress: () => void;
  loading?: boolean;
  style?: ViewStyle;
}) {
  const isDark = useGetMode();
  const backgroundColor = isDark ? 'white' : 'black';
  const color = !isDark ? 'white' : 'black';
  const loadingColor = isDark ? 'black' : 'white';

  return (
    <View style={[{ height: 50, width: '100%', borderRadius: 10, overflow: 'hidden', backgroundColor }, style]}>
      <Pressable
        disabled={loading}
        android_ripple={{ color }}
        onPress={onPress}
        style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}
      >
        {loading ? <ActivityIndicator color={loadingColor} /> : children}
      </Pressable>
    </View>
  );
}
