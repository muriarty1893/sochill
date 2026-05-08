import { Text } from 'react-native';
import { useGetMode } from '@/hooks/use-mode';

export default function TextPost({ body }: { body: string }) {
  const isDark = useGetMode();
  const color = isDark ? 'white' : 'black';
  const selectionColor = isDark ? '#C5C5C591' : '#0000007A';

  return (
    <Text
      selectable
      selectionColor={selectionColor}
      numberOfLines={2}
      style={{ color, marginBottom: 2 }}
    >
      {body}
    </Text>
  );
}
