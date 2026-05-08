import { View, Text, TextInput, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGetMode } from '@/hooks/use-mode';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { openToast } from '@/redux/slices/toast';
import { searchUsers, getOrCreateConversation } from '@/lib/api';
import ProfileImage from '@/components/post/ProfileImage';

export default function NewConversationScreen() {
  const isDark = useGetMode();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const currentUserId = useAppSelector((s) => s.user.data?.id);
  const color = isDark ? 'white' : 'black';
  const bg = isDark ? 'black' : 'white';
  const inputBg = isDark ? '#1a1a1a' : '#f0f0f0';

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [openingId, setOpeningId] = useState<string | null>(null);

  const handleSearch = useCallback(async (text: string) => {
    setQuery(text);
    if (text.trim().length < 2) { setResults([]); return; }
    setSearching(true);
    try {
      const data = await searchUsers(text.trim());
      setResults(data.filter((u: any) => u.id !== currentUserId));
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, [currentUserId]);

  const handleSelectUser = useCallback(async (userId: string) => {
    setOpeningId(userId);
    try {
      const convId = await getOrCreateConversation(userId);
      router.replace({ pathname: '/(app)/chat/[id]', params: { id: convId } });
    } catch (e: any) {
      dispatch(openToast({ text: e.message ?? 'Could not start conversation', type: 'Failed' }));
      setOpeningId(null);
    }
  }, [router, dispatch]);

  return (
    <View style={{ flex: 1, backgroundColor: bg, paddingTop: insets.top + 16 }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginBottom: 16, gap: 12 }}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={{ color, fontFamily: 'jakara', fontSize: 16 }}>Cancel</Text>
        </Pressable>
        <Text style={{ flex: 1, textAlign: 'center', color, fontFamily: 'jakaraBold', fontSize: 18 }}>
          New Message
        </Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Search input */}
      <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
        <TextInput
          autoFocus
          value={query}
          onChangeText={handleSearch}
          placeholder="Search by username or name…"
          placeholderTextColor="grey"
          style={{
            backgroundColor: inputBg,
            borderRadius: 12,
            paddingHorizontal: 14,
            paddingVertical: 12,
            color,
            fontFamily: 'jakara',
            fontSize: 15,
          }}
        />
      </View>

      {searching && (
        <View style={{ paddingVertical: 20, alignItems: 'center' }}>
          <ActivityIndicator color={color} />
        </View>
      )}

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 40 }}
        ListEmptyComponent={
          !searching && query.length >= 2 ? (
            <View style={{ alignItems: 'center', marginTop: 40 }}>
              <Text style={{ color: 'grey', fontFamily: 'mulish', fontSize: 14 }}>No users found</Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => handleSelectUser(item.id)}
            disabled={openingId === item.id}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 16, paddingVertical: 12 }}
          >
            <ProfileImage imageUri={item.avatar_url} size={48} />
            <View style={{ flex: 1 }}>
              <Text style={{ color, fontFamily: 'jakaraBold', fontSize: 15 }}>
                {item.display_name ?? item.username}
              </Text>
              <Text style={{ color: 'grey', fontFamily: 'jakara', fontSize: 13 }}>{item.handle}</Text>
            </View>
            {openingId === item.id && <ActivityIndicator color={color} />}
          </Pressable>
        )}
      />
    </View>
  );
}
