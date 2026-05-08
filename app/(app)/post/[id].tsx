import { View, Text, FlatList, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useGetMode } from '@/hooks/use-mode';
import { useAppSelector } from '@/redux/hooks';
import { getComments, addComment } from '@/lib/api';
import AnimatedScreen from '@/components/global/AnimatedScreen';
import ProfileImage from '@/components/post/ProfileImage';
import { BackIcon, SendIcon } from '@/components/icons';
import { dateAgo } from '@/util/date';

export default function PostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isDark = useGetMode();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const color = isDark ? 'white' : 'black';
  const bg = isDark ? 'black' : 'white';
  const inputBg = isDark ? '#1a1a1a' : '#f5f5f5';

  const [comments, setComments] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getComments(id).then(setComments).catch(() => {});
  }, [id]);

  const handleSend = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const c = await addComment(id, text.trim());
      setComments((prev) => [...prev, c]);
      setText('');
    } catch {}
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: insets.top + 16, paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 0.5, borderColor: isDark ? '#333' : '#eee' }}>
        <Pressable onPress={() => router.back()} style={{ marginRight: 16 }}>
          <BackIcon size={24} color={color} />
        </Pressable>
        <Text style={{ color, fontFamily: 'jakaraBold', fontSize: 18 }}>Post</Text>
      </View>

      {/* Comments */}
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 80 }}
        ListEmptyComponent={<Text style={{ color: 'grey', fontFamily: 'mulish', textAlign: 'center', marginTop: 40 }}>No comments yet. Be first!</Text>}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <ProfileImage imageUri={item.profiles?.avatar_url} size={40} />
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
                <Text style={{ color, fontFamily: 'jakaraBold', fontSize: 13 }}>{item.profiles?.display_name ?? item.profiles?.username}</Text>
                <Text style={{ color: 'grey', fontFamily: 'jakara', fontSize: 11 }}>{dateAgo(new Date(item.created_at))}</Text>
              </View>
              <Text style={{ color, fontFamily: 'jakara', fontSize: 14, marginTop: 2 }}>{item.body}</Text>
            </View>
          </View>
        )}
      />

      {/* Input */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, paddingBottom: insets.bottom + 10, borderTopWidth: 0.5, borderColor: isDark ? '#333' : '#eee', backgroundColor: bg, gap: 10 }}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Write a comment…"
          placeholderTextColor="grey"
          style={{ flex: 1, color, fontFamily: 'jakara', fontSize: 14, backgroundColor: inputBg, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 10 }}
        />
        <Pressable onPress={handleSend} disabled={loading} style={{ padding: 8 }}>
          <SendIcon size={22} color={loading ? 'grey' : isDark ? 'white' : 'black'} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
