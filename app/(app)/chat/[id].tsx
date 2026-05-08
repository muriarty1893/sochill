import { View, Text, FlatList, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGetMode } from '@/hooks/use-mode';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { getMessages, sendMessage, markMessagesRead } from '@/lib/api';
import { setMessages, addMessage } from '@/redux/slices/chat';
import { supabase } from '@/lib/supabase';
import { BackIcon, SendIcon } from '@/components/icons';
import { dateAgo } from '@/util/date';

export default function ChatScreen() {
  const { id: conversationId } = useLocalSearchParams<{ id: string }>();
  const isDark = useGetMode();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const currentUser = useAppSelector((s) => s.user.data);
  const rawMessages = useAppSelector((s) => s.chat.messages[conversationId]);
  const messages = useMemo(() => rawMessages ?? [], [rawMessages]);
  const conversations = useAppSelector((s) => s.chat.conversations);
  const conversation = conversations.find((c) => c.id === conversationId);

  const color = isDark ? 'white' : 'black';
  const bg = isDark ? 'black' : 'white';
  const inputBg = isDark ? '#1a1a1a' : '#f5f5f5';
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    getMessages(conversationId).then((msgs) => dispatch(setMessages({ conversationId, messages: msgs }))).catch(() => {});
    markMessagesRead(conversationId);

    const channel = supabase
      .channel(`chat:${conversationId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` }, (payload) => {
        if (payload.new.sender_id !== currentUser?.id) {
          dispatch(addMessage({ conversationId, message: payload.new as any }));
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [conversationId]);

  useEffect(() => {
    if (messages.length > 0) setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages.length]);

  const handleSend = async () => {
    if (!text.trim()) return;
    const body = text.trim();
    setText('');
    setLoading(true);
    try {
      const msg = await sendMessage(conversationId, body);
      dispatch(addMessage({ conversationId, message: msg as any }));
    } catch {}
    setLoading(false);
  };

  const renderMessage = ({ item }: { item: any }) => {
    const isMe = item.sender_id === currentUser?.id;
    return (
      <View style={{ flexDirection: 'row', justifyContent: isMe ? 'flex-end' : 'flex-start', marginHorizontal: 12, marginVertical: 4 }}>
        <View style={{
          maxWidth: '75%', padding: 10, borderRadius: 14,
          backgroundColor: isMe ? (isDark ? '#fff' : '#000') : (isDark ? '#2a2a2a' : '#f0f0f0'),
          borderBottomRightRadius: isMe ? 4 : 14,
          borderBottomLeftRadius: isMe ? 14 : 4,
        }}>
          <Text style={{ color: isMe ? (isDark ? 'black' : 'white') : color, fontFamily: 'jakara', fontSize: 14 }}>{item.body}</Text>
          <Text style={{ color: isMe ? (isDark ? '#888' : '#aaa') : 'grey', fontFamily: 'jakara', fontSize: 10, marginTop: 2, textAlign: 'right' }}>
            {dateAgo(new Date(item.created_at))}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: insets.top + 12, paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 0.5, borderColor: isDark ? '#333' : '#eee' }}>
        <Pressable onPress={() => router.back()} style={{ marginRight: 14 }}>
          <BackIcon size={24} color={color} />
        </Pressable>
        <View>
          <Text style={{ color, fontFamily: 'jakaraBold', fontSize: 16 }}>
            {conversation?.other_user?.display_name ?? conversation?.other_user?.username ?? 'Chat'}
          </Text>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={{ paddingVertical: 12, paddingBottom: 20 }}
      />

      {/* Input */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, paddingBottom: insets.bottom + 8, borderTopWidth: 0.5, borderColor: isDark ? '#333' : '#eee', gap: 10 }}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Message…"
          placeholderTextColor="grey"
          style={{ flex: 1, color, fontFamily: 'jakara', fontSize: 14, backgroundColor: inputBg, borderRadius: 22, paddingHorizontal: 16, paddingVertical: 10 }}
          multiline
        />
        <Pressable onPress={handleSend} disabled={loading} style={{ padding: 8, backgroundColor: isDark ? 'white' : 'black', borderRadius: 999 }}>
          <SendIcon size={20} color={isDark ? 'black' : 'white'} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
