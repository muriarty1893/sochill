import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { useState } from 'react';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useGetMode } from '@/hooks/use-mode';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { createPost } from '@/lib/api';
import { prependPost } from '@/redux/slices/posts';
import { openToast } from '@/redux/slices/toast';
import { FloatingModal } from '@/components/sochill/floating-modal';
import ProfileImage from './ProfileImage';
import { CameraIcon, CloseCircleIcon } from '@/components/icons';

export function PostComposer() {
  const isDark = useGetMode();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.user.data);
  const color = isDark ? 'white' : 'black';
  const inputBg = isDark ? '#1e1e1e' : '#f5f5f5';

  const [text, setText] = useState('');
  const [photo, setPhoto] = useState<{ uri: string; width: number; height: number } | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8, allowsEditing: false });
    if (!result.canceled && result.assets[0]) {
      const a = result.assets[0];
      setPhoto({ uri: a.uri, width: a.width ?? 800, height: a.height ?? 600 });
    }
  };

  const handlePost = async (): Promise<boolean | void> => {
    if (!text.trim() && !photo) {
      dispatch(openToast({ text: 'Write something or add a photo', type: 'Info' }));
      return false;
    }
    try {
      const created = await createPost(text.trim(), photo ?? undefined);
      dispatch(prependPost(created));
      dispatch(openToast({ text: 'Posted!', type: 'Success' }));
      setText('');
      setPhoto(null);
    } catch (e: any) {
      dispatch(openToast({ text: e.message ?? 'Failed to post', type: 'Failed' }));
      return false;
    }
  };

  return (
    <FloatingModal isDark={isDark} title="New Post" doneLabel="Post" onDone={handlePost}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 14, paddingBottom: 8 }} keyboardShouldPersistTaps="handled">
        {/* Author row */}
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', marginBottom: 12 }}>
          <ProfileImage imageUri={user?.avatar_url} size={38} />
          <View>
            <Text style={{ color, fontFamily: 'jakaraBold', fontSize: 14 }}>{user?.display_name ?? user?.username}</Text>
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
          style={{ color, fontFamily: 'jakara', fontSize: 15, minHeight: 100, backgroundColor: inputBg, borderRadius: 12, padding: 12, marginBottom: 10, textAlignVertical: 'top' }}
        />

        {/* Photo preview */}
        {photo && (
          <View style={{ position: 'relative', marginBottom: 10 }}>
            <Image source={{ uri: photo.uri }} style={{ width: '100%', height: 160, borderRadius: 10 }} contentFit="cover" />
            <Pressable
              onPress={() => setPhoto(null)}
              style={{ position: 'absolute', top: 6, right: 6, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 999 }}
            >
              <CloseCircleIcon size={26} color="white" />
            </Pressable>
          </View>
        )}

        {/* Add photo button */}
        <Pressable
          onPress={pickImage}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: isDark ? '#333' : '#ddd', borderRadius: 10, padding: 10, borderStyle: 'dashed' }}
        >
          <CameraIcon size={20} color={color} />
          <Text style={{ color, fontFamily: 'jakara', fontSize: 13 }}>Add a photo</Text>
        </Pressable>
      </ScrollView>
    </FloatingModal>
  );
}
