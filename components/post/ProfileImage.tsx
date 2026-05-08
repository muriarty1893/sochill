import { Image } from 'expo-image';
import { View } from 'react-native';
import { ProfileIcon } from '../icons';
import { useGetMode } from '@/hooks/use-mode';

export default function ProfileImage({ imageUri, size = 50 }: { imageUri?: string; size?: number }) {
  const isDark = useGetMode();
  const color = isDark ? 'white' : 'black';

  if (!imageUri) {
    return (
      <View style={{ height: size, width: size, justifyContent: 'center', alignItems: 'center' }}>
        <ProfileIcon color={color} size={size} />
      </View>
    );
  }

  return (
    <Image
      source={{ uri: imageUri }}
      style={{ height: size, width: size, borderRadius: size / 2 }}
      contentFit="cover"
      transition={300}
    />
  );
}
