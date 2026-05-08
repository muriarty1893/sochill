import { View, Text, FlatList, TextInput, Pressable, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Menu } from 'react-native-paper';
import { BlurView } from 'expo-blur';
import Entypo from '@expo/vector-icons/Entypo';
import { useGetMode } from '@/hooks/use-mode';
import { useAppSelector } from '@/redux/hooks';
import { getCommentById, getCommentReplies, addComment, likeComment, deleteComment } from '@/lib/api';
import ProfileImage from '@/components/post/ProfileImage';
import { BackIcon, SendIcon, CameraIcon, SparkIconUnfocused, SparkIcon, TrashIcon, CloseCircleIcon } from '@/components/icons';

type ReplyItem = {
  id: string;
  user_id: string;
  post_id: string;
  body: string;
  image_url?: string;
  created_at: string;
  likes_count: number;
  is_liked: boolean;
  profiles: { id: string; username: string; display_name?: string; avatar_url?: string } | null;
};

function ReplyCard({
  item,
  color,
  isDark,
  divider,
  currentUserId,
  onReply,
  onImagePress,
  onDelete,
  onPress,
}: {
  item: ReplyItem;
  color: string;
  isDark: boolean;
  divider: string;
  currentUserId?: string;
  onReply: (target: { id: string; username: string }) => void;
  onImagePress: (uri: string) => void;
  onDelete: (id: string) => void;
  onPress: (id: string) => void;
}) {
  const p = item.profiles;
  const [liked, setLiked] = useState(item.is_liked);
  const [likeCount, setLikeCount] = useState(item.likes_count);
  const [menuVisible, setMenuVisible] = useState(false);
  const isOwn = currentUserId === item.user_id;
  const blurTint = isDark ? 'dark' : 'light';

  const handleLike = () => {
    const next = !liked;
    setLiked(next);
    setLikeCount((n) => n + (next ? 1 : -1));
    likeComment(item.id).catch(() => {
      setLiked(!next);
      setLikeCount((n) => n + (next ? -1 : 1));
    });
  };

  const handleDelete = async () => {
    setMenuVisible(false);
    try {
      await deleteComment(item.id);
      onDelete(item.id);
    } catch {}
  };

  return (
    <Pressable onPress={() => onPress(item.id)}>
      <View style={{ flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 0.5, borderColor: divider, paddingHorizontal: 16 }}>
        <View style={{ width: 36, height: 36, borderRadius: 18, overflow: 'hidden', marginRight: 10, flexShrink: 0 }}>
          {p?.avatar_url
            ? <ProfileImage imageUri={p.avatar_url} size={36} />
            : <View style={{ flex: 1, backgroundColor: isDark ? '#333' : '#ddd', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color, fontFamily: 'jakaraBold', fontSize: 13 }}>{p?.username?.[0]?.toUpperCase() ?? '?'}</Text>
              </View>
          }
        </View>

        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center', flex: 1, flexWrap: 'wrap' }}>
              <Text style={{ color, fontFamily: 'jakaraBold', fontSize: 13 }}>{p?.display_name ?? p?.username}</Text>
              <Text style={{ color: 'grey', fontFamily: 'jakara', fontSize: 12 }}>@{p?.username}</Text>
            </View>
            {isOwn && (
              <Menu
                contentStyle={{ backgroundColor: 'transparent', elevation: 0, shadowColor: 'transparent', borderWidth: 1, borderColor: '#B4B4B488', borderRadius: 10, overflow: 'hidden' }}
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={
                  <Pressable onPress={() => setMenuVisible(true)}>
                    <Entypo name="dots-three-horizontal" size={16} color={isDark ? '#555' : '#aaa'} />
                  </Pressable>
                }
              >
                <BlurView experimentalBlurMethod="dimezisBlurView" tint={blurTint} style={{ height: '130%', width: '300%', position: 'absolute' }} />
                <Menu.Item titleStyle={{ fontFamily: 'jakara', color: 'red' }} onPress={handleDelete} trailingIcon={() => <TrashIcon size={18} color="red" />} title="Delete" />
                <Menu.Item titleStyle={{ fontFamily: 'jakara', color }} onPress={() => setMenuVisible(false)} trailingIcon={() => <CloseCircleIcon size={18} color={color} />} title="Cancel" />
              </Menu>
            )}
          </View>

          {item.body ? (
            <Text style={{ color, fontFamily: 'jakara', fontSize: 14, marginTop: 3, lineHeight: 20 }}>{item.body}</Text>
          ) : null}

          {item.image_url ? (
            <Pressable onPress={() => onImagePress(item.image_url!)} style={{ marginTop: 8, borderRadius: 12, overflow: 'hidden', height: 160 }}>
              <Image source={{ uri: item.image_url }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
            </Pressable>
          ) : null}

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 8 }}>
            <Pressable onPress={() => onReply({ id: item.id, username: p?.username ?? '' })}>
              <Text style={{ color: isDark ? '#555' : '#aaa', fontFamily: 'jakara', fontSize: 12 }}>Reply</Text>
            </Pressable>
            <Pressable onPress={handleLike} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              {liked
                ? <SparkIcon size={14} color="#F4AC0C" />
                : <SparkIconUnfocused size={14} color={isDark ? '#555' : '#aaa'} />
              }
              {likeCount > 0 && (
                <Text style={{ color: isDark ? '#555' : '#aaa', fontFamily: 'jakara', fontSize: 12 }}>{likeCount}</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default function CommentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isDark = useGetMode();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const currentUser = useAppSelector((s) => s.user.data);
  const inputRef = useRef<TextInput>(null);

  const color = isDark ? 'white' : 'black';
  const bg = isDark ? 'black' : 'white';
  const divider = isDark ? '#1f1f1f' : '#efefef';
  const inputBg = isDark ? '#1a1a1a' : '#f5f5f5';

  const [comment, setComment] = useState<any>(null);
  const [replies, setReplies] = useState<ReplyItem[]>([]);
  const [replyingTo, setReplyingTo] = useState<{ id: string; username: string } | null>(null);
  const [text, setText] = useState('');
  const [pickedImage, setPickedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    Promise.all([getCommentById(id), getCommentReplies(id)])
      .then(([c, r]) => {
        setComment(c);
        setReplies(r as ReplyItem[]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleReply = (target: { id: string; username: string }) => {
    setReplyingTo(target);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleDelete = (replyId: string) => {
    setReplies((prev) => prev.filter((r) => r.id !== replyId));
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8, allowsEditing: true });
    if (!result.canceled && result.assets[0]) setPickedImage(result.assets[0].uri);
  };

  const handleSend = async () => {
    if (!text.trim() && !pickedImage) return;
    if (!comment) return;
    setSending(true);
    try {
      const c = await addComment(comment.post_id, text.trim(), replyingTo?.id ?? id, pickedImage ?? undefined);
      setReplies((prev) => [...prev, c as ReplyItem]);
      setText('');
      setPickedImage(null);
      setReplyingTo(null);
    } catch {}
    setSending(false);
  };

  const p = comment?.profiles;

  const CommentHeader = comment ? (
    <View style={{ backgroundColor: bg }}>
      <View style={{ flexDirection: 'row', paddingHorizontal: 16, paddingTop: 16, gap: 12, alignItems: 'center' }}>
        <View style={{ width: 48, height: 48, borderRadius: 24, overflow: 'hidden' }}>
          {p?.avatar_url
            ? <ProfileImage imageUri={p.avatar_url} size={48} />
            : <View style={{ flex: 1, backgroundColor: isDark ? '#333' : '#ddd', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color, fontFamily: 'jakaraBold', fontSize: 18 }}>{p?.username?.[0]?.toUpperCase() ?? '?'}</Text>
              </View>
          }
        </View>
        <View>
          <Text style={{ color, fontFamily: 'jakaraBold', fontSize: 15 }}>{p?.display_name ?? p?.username}</Text>
          <Text style={{ color: 'grey', fontFamily: 'jakara', fontSize: 13 }}>@{p?.username}</Text>
        </View>
      </View>

      {comment.body ? (
        <Text style={{ color, fontFamily: 'jakara', fontSize: 17, lineHeight: 25, paddingHorizontal: 16, paddingTop: 12 }}>
          {comment.body}
        </Text>
      ) : null}

      {comment.image_url ? (
        <Pressable
          onPress={() => router.push({ pathname: '/(app)/image-viewer', params: { uri: comment.image_url } })}
          style={{ marginHorizontal: 16, marginTop: 12, borderRadius: 14, overflow: 'hidden', aspectRatio: 16 / 9 }}
        >
          <Image source={{ uri: comment.image_url }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
        </Pressable>
      ) : null}

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 0.5, borderColor: divider, marginTop: 10 }}>
        <Pressable onPress={() => handleReply({ id, username: p?.username ?? '' })}>
          <Text style={{ color: '#1d9bf0', fontFamily: 'jakaraBold', fontSize: 13 }}>Reply to this</Text>
        </Pressable>
      </View>

      {replies.length > 0 && (
        <Text style={{ color: 'grey', fontFamily: 'jakaraBold', fontSize: 13, paddingHorizontal: 16, paddingVertical: 10 }}>
          Replies
        </Text>
      )}
    </View>
  ) : null;

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: insets.top + 12, paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 0.5, borderColor: divider, backgroundColor: bg }}>
        <Pressable onPress={() => router.back()} style={{ marginRight: 16 }}>
          <BackIcon size={24} color={color} />
        </Pressable>
        <Text style={{ color, fontFamily: 'jakaraBold', fontSize: 18 }}>Thread</Text>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator color={color} />
        </View>
      ) : (
        <FlatList
          data={replies}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={CommentHeader}
          contentContainerStyle={{ paddingBottom: 80 }}
          ListEmptyComponent={
            !loading ? (
              <View style={{ alignItems: 'center', marginTop: 40 }}>
                <Text style={{ color: 'grey', fontFamily: 'mulish', fontSize: 14 }}>No replies yet.</Text>
              </View>
            ) : null
          }
          renderItem={({ item }) => (
            <ReplyCard
              item={item}
              color={color}
              isDark={isDark}
              divider={divider}
              currentUserId={currentUser?.id}
              onReply={handleReply}
              onImagePress={(uri) => router.push({ pathname: '/(app)/image-viewer', params: { uri } })}
              onDelete={handleDelete}
              onPress={(replyId) => router.push({ pathname: '/(app)/comment/[id]', params: { id: replyId } })}
            />
          )}
        />
      )}

      {replyingTo && (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 6, backgroundColor: isDark ? '#111' : '#f0f0f0' }}>
          <Text style={{ color: 'grey', fontFamily: 'jakara', fontSize: 12 }}>
            Replying to <Text style={{ color: isDark ? '#aaa' : '#555', fontFamily: 'jakaraBold' }}>@{replyingTo.username}</Text>
          </Text>
          <Pressable onPress={() => setReplyingTo(null)}>
            <Text style={{ color: 'grey', fontSize: 16 }}>✕</Text>
          </Pressable>
        </View>
      )}

      {pickedImage && (
        <View style={{ paddingHorizontal: 16, paddingVertical: 6, backgroundColor: bg }}>
          <View style={{ position: 'relative', alignSelf: 'flex-start' }}>
            <Image source={{ uri: pickedImage }} style={{ width: 72, height: 72, borderRadius: 10 }} contentFit="cover" />
            <Pressable
              onPress={() => setPickedImage(null)}
              style={{ position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: 10, backgroundColor: isDark ? '#333' : '#ccc', justifyContent: 'center', alignItems: 'center' }}
            >
              <Text style={{ color, fontSize: 10, fontFamily: 'jakaraBold' }}>✕</Text>
            </Pressable>
          </View>
        </View>
      )}

      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, paddingBottom: insets.bottom + 10, borderTopWidth: 0.5, borderColor: divider, backgroundColor: bg, gap: 8 }}>
        <Pressable onPress={pickImage} style={{ padding: 6 }}>
          <CameraIcon size={22} color={isDark ? '#555' : '#aaa'} />
        </Pressable>
        <TextInput
          ref={inputRef}
          value={text}
          onChangeText={setText}
          placeholder={replyingTo ? `Reply to @${replyingTo.username}…` : 'Post your reply…'}
          placeholderTextColor="grey"
          multiline
          style={{ flex: 1, color, fontFamily: 'jakara', fontSize: 14, backgroundColor: inputBg, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 10, maxHeight: 100 }}
        />
        <Pressable onPress={handleSend} disabled={sending} style={{ padding: 8 }}>
          <SendIcon size={22} color={sending ? 'grey' : color} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
