import { View, Text, TextInput, Pressable, Keyboard, TouchableWithoutFeedback, ScrollView, Image as RNImage } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedKeyboard, useAnimatedStyle } from 'react-native-reanimated';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { useGetMode } from '@/hooks/use-mode';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { createPost } from '@/lib/api';
import { prependPost } from '@/redux/slices/posts';
import { openToast } from '@/redux/slices/toast';
import Button from '@/components/global/Button';
import ProfileImage from '@/components/post/ProfileImage';
import { CameraIcon, CloseCircleIcon } from '@/components/icons';

export default function PostContentScreen() {
  const isDark = useGetMode();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const user = useAppSelector((s) => s.user.data);
  const color = isDark ? 'white' : 'black';
  const backgroundColor = isDark ? 'black' : 'white';
  const inputBg = isDark ? '#1a1a1a' : '#f5f5f5';

  const [text, setText] = useState('');
  const [photo, setPhoto] = useState<{ uri: string; width: number; height: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const keyboard = useAnimatedKeyboard({ isStatusBarTranslucentAndroid: true });
  const animatedStyles = useAnimatedStyle(() => ({ bottom: keyboard.height.value }));

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsEditing: false,
    });
    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      setPhoto({ uri: asset.uri, width: asset.width ?? 800, height: asset.height ?? 600 });
    }
  };

  const handlePost = async () => {
    if (!text.trim() && !photo) {
      dispatch(openToast({ text: 'Write something or add a photo', type: 'Info' }));
      return;
    }
    setLoading(true);
    Keyboard.dismiss();
    try {
      const created = await createPost(text.trim(), photo ?? undefined);
      dispatch(prependPost(created));
      dispatch(openToast({ text: 'Posted!', type: 'Success' }));
      router.back();
    } catch (e: any) {
      dispatch(openToast({ text: e.message ?? 'Failed to post', type: 'Failed' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1, backgroundColor, paddingTop: insets.top + 16 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 16 }}>
          <Pressable onPress={() => router.back()}>
            <Text style={{ color, fontFamily: 'jakara', fontSize: 16 }}>Cancel</Text>
          </Pressable>
          <Text style={{ color, fontFamily: 'jakaraBold', fontSize: 18 }}>New Post</Text>
          <Button loading={loading} onPress={handlePost} style={{ width: 80, height: 38 }}>
            <Text style={{ fontFamily: 'jakaraBold', fontSize: 14, color: isDark ? 'black' : 'white' }}>Post</Text>
          </Button>
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 200 }}>
          {/* User info */}
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
            <ProfileImage imageUri={user?.avatar_url} size={44} />
            <View>
              <Text style={{ color, fontFamily: 'jakaraBold', fontSize: 15 }}>{user?.display_name ?? user?.username}</Text>
              <Text style={{ color: 'grey', fontFamily: 'jakara', fontSize: 12 }}>{user?.handle}</Text>
            </View>
          </View>

          {/* Text input */}
          <TextInput
            multiline
            value={text}
            onChangeText={setText}
            placeholder="What's on your mind?"
            placeholderTextColor="grey"
            style={{
              color,
              fontFamily: 'jakara',
              fontSize: 16,
              minHeight: 120,
              backgroundColor: inputBg,
              borderRadius: 12,
              padding: 14,
              marginBottom: 12,
              textAlignVertical: 'top',
            }}
          />

          {/* Photo preview */}
          {photo && (
            <View style={{ position: 'relative', marginBottom: 12 }}>
              <Image source={{ uri: photo.uri }} style={{ width: '100%', height: 200, borderRadius: 12 }} contentFit="cover" />
              <Pressable
                onPress={() => setPhoto(null)}
                style={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 999 }}
              >
                <CloseCircleIcon size={28} color="white" />
              </Pressable>
            </View>
          )}

          {/* Add photo button */}
          <Pressable
            onPress={pickImage}
            style={{
              flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1,
              borderColor: isDark ? '#444' : '#ccc', borderRadius: 10, padding: 12,
              borderStyle: 'dashed',
            }}
          >
            <CameraIcon size={22} color={color} />
            <Text style={{ color, fontFamily: 'jakara', fontSize: 14 }}>Add a photo</Text>
          </Pressable>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}
