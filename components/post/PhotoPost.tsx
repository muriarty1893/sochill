import { View, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';

export default function PhotoPost({
  imageUrl,
  postId,
}: {
  imageUrl: string;
  width?: number;
  height?: number;
  postId: string;
}) {
  const router = useRouter();

  return (
    <View style={{ width: '100%', height: 200, marginTop: 10, marginBottom: 10, borderRadius: 15, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' }}>
      <Pressable
        android_ripple={{ color: '#000000', foreground: true }}
        onPress={(e) => {
          e.stopPropagation();
          router.push({ pathname: '/(app)/image-viewer', params: { uri: imageUrl } });
        }}
        style={{ width: '100%', height: 200, borderRadius: 15 }}
      >
        <Image
          style={{ height: '100%', width: '100%' }}
          contentFit="cover"
          transition={1000}
          source={{ uri: imageUrl }}
        />
      </Pressable>
    </View>
  );
}
