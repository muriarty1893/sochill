import { View, Text, TextInput, ScrollView, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGetMode } from '@/hooks/use-mode';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { updateProfile } from '@/lib/api';
import { updateUser } from '@/redux/slices/user';
import { openToast } from '@/redux/slices/toast';
import Button from '@/components/global/Button';
import { BackIcon } from '@/components/icons';

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
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const updated = await updateProfile({ display_name: displayName, username, bio });
      dispatch(updateUser({ display_name: updated.display_name, username: updated.username, bio: updated.bio }));
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
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: insets.top + 16, paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 0.5, borderColor: isDark ? '#333' : '#eee' }}>
        <Pressable onPress={() => router.back()}>
          <BackIcon size={24} color={color} />
        </Pressable>
        <Text style={{ color, fontFamily: 'jakaraBold', fontSize: 18 }}>Edit Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 60 }}>
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
