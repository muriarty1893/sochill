import { View, Text, FlatList, Pressable } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useGetMode } from '@/hooks/use-mode';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { getConversations } from '@/lib/api';
import { setConversations, clearNew } from '@/redux/slices/chat';
import AnimatedScreen from '@/components/global/AnimatedScreen';
import ProfileImage from '@/components/post/ProfileImage';
import { AddMessage } from '@/components/icons';
import { dateAgo } from '@/util/date';

function ConversationItem({ item }: { item: any }) {
  const isDark = useGetMode();
  const router = useRouter();
  const color = isDark ? 'white' : 'black';
  const rColor = isDark ? '#FFFFFF14' : '#00000014';

  return (
    <Pressable
      android_ripple={{ color: rColor, foreground: true }}
      onPress={() => router.push({ pathname: '/(app)/chat/[id]', params: { id: item.id } })}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 16, paddingVertical: 12 }}
    >
      <ProfileImage imageUri={item.other_user?.avatar_url} size={52} />
      <View style={{ flex: 1 }}>
        <Text style={{ color, fontFamily: 'jakaraBold', fontSize: 15 }}>
          {item.other_user?.display_name ?? item.other_user?.username}
        </Text>
        {item.last_message ? (
          <Text style={{ color: 'grey', fontFamily: 'jakara', fontSize: 13 }} numberOfLines={1}>{item.last_message}</Text>
        ) : null}
      </View>
      <View style={{ alignItems: 'flex-end', gap: 4 }}>
        {item.last_message_at && (
          <Text style={{ color: 'grey', fontFamily: 'jakara', fontSize: 11 }}>
            {dateAgo(new Date(item.last_message_at))}
          </Text>
        )}
        {item.unread_count > 0 && (
          <View style={{ backgroundColor: '#1DA1F2', borderRadius: 99, paddingHorizontal: 6, paddingVertical: 2 }}>
            <Text style={{ color: 'white', fontFamily: 'jakaraBold', fontSize: 11 }}>{item.unread_count}</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

export default function MessagesScreen() {
  const isDark = useGetMode();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const color = isDark ? 'white' : 'black';
  const conversations = useAppSelector((s) => s.chat.conversations);

  useFocusEffect(
    useCallback(() => {
      getConversations()
        .then((data) => dispatch(setConversations(data)))
        .catch(() => {});
      dispatch(clearNew());
    }, [dispatch])
  );

  return (
    <AnimatedScreen style={{ marginTop: 80, flex: 1 }}>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 60 }}>
            <Text style={{ color: 'grey', fontFamily: 'mulish', fontSize: 14 }}>No messages yet</Text>
          </View>
        }
        renderItem={({ item }) => <ConversationItem item={item} />}
      />

      {/* FAB */}
      <View style={{ position: 'absolute', bottom: 80, right: 20, borderRadius: 999, overflow: 'hidden' }}>
        <Pressable
          android_ripple={{ color: isDark ? '#555' : '#aaa', foreground: true }}
          onPress={() => router.push('/(app)/new-conversation')}
          style={{
            width: 56, height: 56, borderRadius: 28, backgroundColor: isDark ? 'white' : 'black',
            justifyContent: 'center', alignItems: 'center', elevation: 6,
          }}
        >
          <AddMessage size={26} color={isDark ? 'black' : 'white'} />
        </Pressable>
      </View>
    </AnimatedScreen>
  );
}
