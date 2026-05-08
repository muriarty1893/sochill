import { View, Text, TextInput, ScrollView, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useGetMode } from '@/hooks/use-mode';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { updateProfile, uploadAvatar } from '@/lib/api';
import { updateUser } from '@/redux/slices/user';
import { openToast } from '@/redux/slices/toast';
import Button from '@/components/global/Button';
import { BackIcon, CameraIcon } from '@/components/icons';

export default function EditProfileScreen() {
  const isDark = useGetMode();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const user = useAppSelector((s) => s.user.data);
  const color = isDark ? 'white' : 'black';
  const bg = isDark ? 'black' : 'white';
  const inputBg = isDark ? '#1a1a1a' : '#f5f5f5';

  const [displayName, setDisplayName] = useState(user?.display_name ?? '');
  const [username, setUsername] = useState(user?.username ?? '');
  const [bio, setBio] = useState(user?.bio ?? '');
  const [pickedAvatarUri, setPickedAvatarUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const avatarDisplay = pickedAvatarUri ?? user?.avatar_url;

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled && result.assets[0]) {
      setPickedAvatarUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      let avatar_url = user?.avatar_url;
      if (pickedAvatarUri) {
        avatar_url = await uploadAvatar(pickedAvatarUri);
      }
      const updated = await updateProfile({ display_name: displayName, username, bio, avatar_url });
      dispatch(updateUser({
        display_name: updated.display_name,
        username: updated.username,
        bio: updated.bio,
        avatar_url: updated.avatar_url,
      }));
      dispatch(openToast({ text: 'Profile updated!', type: 'Success' }));
      router.back();
    } catch (e: any) {
      dispatch(openToast({ text: e.message ?? 'Failed to update', type: 'Failed' }));
    } finally {
      setLoading(false);
    }
  };

  const labelStyle = { color: 'grey', fontFamily: 'jakara', fontSize: 13, marginBottom: 6, marginTop: 16 };
  const inputStyle = { backgroundColor: inputBg, borderRadius: 10, padding: 14, color, fontFamily: 'jakara', fontSize: 15 };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: insets.top + 16, paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 0.5, borderColor: isDark ? '#333' : '#eee' }}>
        <Pressable onPress={() => router.back()}>
          <BackIcon size={24} color={color} />
        </Pressable>
        <Text style={{ color, fontFamily: 'jakaraBold', fontSize: 18 }}>Edit Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 60 }}>
        {/* Avatar picker */}
        <View style={{ alignItems: 'center', paddingVertical: 24 }}>
          <Pressable onPress={pickAvatar}>
            <View style={{ width: 90, height: 90, borderRadius: 45, overflow: 'hidden', backgroundColor: isDark ? '#333' : '#ddd' }}>
              {avatarDisplay ? (
                <Image source={{ uri: avatarDisplay }} style={{ width: 90, height: 90 }} contentFit="cover" />
              ) : (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ color, fontFamily: 'jakaraBold', fontSize: 32 }}>
                    {user?.username?.[0]?.toUpperCase() ?? '?'}
                  </Text>
                </View>
              )}
            </View>
            <View style={{
              position: 'absolute', bottom: 0, right: 0,
              width: 28, height: 28, borderRadius: 14,
              backgroundColor: isDark ? '#2a2a2a' : '#e8e8e8',
              justifyContent: 'center', alignItems: 'center',
              borderWidth: 2, borderColor: bg,
            }}>
              <CameraIcon size={14} color={color} />
            </View>
          </Pressable>
          <Text style={{ color: 'grey', fontFamily: 'jakara', fontSize: 12, marginTop: 8 }}>Tap to change photo</Text>
        </View>

        <Text style={labelStyle}>Display Name</Text>
        <TextInput value={displayName} onChangeText={setDisplayName} style={inputStyle} placeholderTextColor="grey" placeholder="Your name" />

        <Text style={labelStyle}>Username</Text>
        <TextInput value={username} onChangeText={setUsername} style={inputStyle} placeholderTextColor="grey" placeholder="username" autoCapitalize="none" />

        <Text style={labelStyle}>Bio</Text>
        <TextInput value={bio} onChangeText={setBio} style={[inputStyle, { minHeight: 80, textAlignVertical: 'top' }]} placeholderTextColor="grey" placeholder="Tell people about yourself" multiline />

        <View style={{ marginTop: 30 }}>
          <Button loading={loading} onPress={handleSave}>
            <Text style={{ fontFamily: 'jakaraBold', fontSize: 15, color: isDark ? 'black' : 'white' }}>Save Changes</Text>
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
