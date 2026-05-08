import { View, Text, FlatList, TextInput, Pressable, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Menu } from 'react-native-paper';
import { BlurView } from 'expo-blur';
import Entypo from '@expo/vector-icons/Entypo';
import { useGetMode } from '@/hooks/use-mode';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { upsertPost, removePost } from '@/redux/slices/posts';
import { getPostById, getComments, addComment, incrementPostView, likeComment, deleteComment, deletePost } from '@/lib/api';
import ProfileImage from '@/components/post/ProfileImage';
import Engagements from '@/components/post/Engagements';
import { BackIcon, SendIcon, CameraIcon, SparkIconUnfocused, SparkIcon, TrashIcon, CloseCircleIcon } from '@/components/icons';

function formatFullDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, month: 'short', day: 'numeric', year: 'numeric' });
}

type CommentNode = {
  id: string;
  user_id: string;
  body: string;
  image_url?: string;
  created_at: string;
  parent_id: string | null;
  likes_count: number;
  is_liked: boolean;
  profiles: { id: string; username: string; display_name?: string; avatar_url?: string } | null;
  replies: CommentNode[];
};

function buildTree(flat: any[]): CommentNode[] {
  const map: Record<string, CommentNode> = {};
  flat.forEach((c) => { map[c.id] = { ...c, replies: [] }; });
  const roots: CommentNode[] = [];
  flat.forEach((c) => {
    if (c.parent_id && map[c.parent_id]) {
      map[c.parent_id].replies.push(map[c.id]);
    } else {
      roots.push(map[c.id]);
    }
  });
  return roots;
}

type ReplyingTo = { id: string; username: string } | null;

function CommentItem({
  node,
  color,
  isDark,
  divider,
  depth,
  currentUserId,
  onReply,
  onImagePress,
  onDelete,
  onCommentPress,
}: {
  node: CommentNode;
  color: string;
  isDark: boolean;
  divider: string;
  depth: number;
  currentUserId?: string;
  onReply: (target: ReplyingTo) => void;
  onImagePress: (uri: string) => void;
  onDelete: (id: string) => void;
  onCommentPress: (id: string) => void;
}) {
  const p = node.profiles;
  const indent = depth * 12;
  const [liked, setLiked] = useState(node.is_liked);
  const [likeCount, setLikeCount] = useState(node.likes_count);
  const [menuVisible, setMenuVisible] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const isOwn = currentUserId === node.user_id;
  const style = isDark ? 'dark' : 'light';

  const handleLike = () => {
    const next = !liked;
    setLiked(next);
    setLikeCount((n) => n + (next ? 1 : -1));
    likeComment(node.id).catch(() => {
      setLiked(!next);
      setLikeCount((n) => n + (next ? -1 : 1));
    });
  };

  const handleDelete = async () => {
    setMenuVisible(false);
    try {
      await deleteComment(node.id);
      onDelete(node.id);
    } catch {}
  };

  return (
    <View>
      <Pressable onPress={() => onCommentPress(node.id)}>
        <View style={{ flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 0.5, borderColor: divider, paddingLeft: 16 + indent, paddingRight: 16 }}>
          {depth > 0 && (
            <View style={{ width: 2, backgroundColor: isDark ? '#333' : '#ddd', borderRadius: 1, marginRight: 10, alignSelf: 'stretch' }} />
          )}

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
                  <BlurView experimentalBlurMethod="dimezisBlurView" tint={style} style={{ height: '130%', width: '300%', position: 'absolute' }} />
                  <Menu.Item titleStyle={{ fontFamily: 'jakara', color: 'red' }} onPress={handleDelete} trailingIcon={() => <TrashIcon size={18} color="red" />} title="Delete" />
                  <Menu.Item titleStyle={{ fontFamily: 'jakara', color }} onPress={() => setMenuVisible(false)} trailingIcon={() => <CloseCircleIcon size={18} color={color} />} title="Cancel" />
                </Menu>
              )}
            </View>

            {node.body ? (
              <Text style={{ color, fontFamily: 'jakara', fontSize: 14, marginTop: 3, lineHeight: 20 }}>{node.body}</Text>
            ) : null}

            {node.image_url ? (
              <Pressable onPress={() => onImagePress(node.image_url!)} style={{ marginTop: 8, borderRadius: 12, overflow: 'hidden', height: 160 }}>
                <Image source={{ uri: node.image_url }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
              </Pressable>
            ) : null}

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 8 }}>
              <Pressable onPress={() => onReply({ id: node.id, username: p?.username ?? '' })}>
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

      {node.replies.length > 0 && (
        <Pressable
          onPress={() => setShowReplies((v) => !v)}
          style={{ paddingLeft: 16 + indent + 46, paddingVertical: 6, borderBottomWidth: 0.5, borderColor: divider }}
        >
          <Text style={{ color: '#1d9bf0', fontFamily: 'jakaraBold', fontSize: 13 }}>
            {showReplies
              ? 'Hide replies'
              : `View ${node.replies.length} ${node.replies.length === 1 ? 'reply' : 'replies'}`}
          </Text>
        </Pressable>
      )}

      {showReplies && node.replies.map((child) => (
        <CommentItem
          key={child.id}
          node={child}
          color={color}
          isDark={isDark}
          divider={divider}
          depth={depth + 1}
          currentUserId={currentUserId}
          onReply={onReply}
          onImagePress={onImagePress}
          onDelete={onDelete}
          onCommentPress={onCommentPress}
        />
      ))}
    </View>
  );
}

export default function PostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isDark = useGetMode();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const currentUser = useAppSelector((s) => s.user.data);
  const reduxPost = useAppSelector((s) => s.posts.data.find((p) => p.id === id));
  const inputRef = useRef<TextInput>(null);

  const color = isDark ? 'white' : 'black';
  const bg = isDark ? 'black' : 'white';
  const divider = isDark ? '#1f1f1f' : '#efefef';
  const inputBg = isDark ? '#1a1a1a' : '#f5f5f5';

  const [dbPost, setDbPost] = useState<any>(null);
  const [flatComments, setFlatComments] = useState<any[]>([]);
  const [replyingTo, setReplyingTo] = useState<ReplyingTo>(null);
  const [text, setText] = useState('');
  const [pickedImage, setPickedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [postMenuVisible, setPostMenuVisible] = useState(false);

  useEffect(() => {
    Promise.all([getPostById(id), getComments(id)])
      .then(([p, c]) => {
        setDbPost(p);
        setFlatComments(c);
        dispatch(upsertPost(p));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
    incrementPostView(id);
  }, [id]);

  const post = useMemo(() => {
    if (!dbPost) return null;
    return {
      ...dbPost,
      ...(reduxPost ? {
        likes_count: reduxPost.likes_count,
        is_liked: reduxPost.is_liked,
        reposts_count: reduxPost.reposts_count,
        is_reposted: reduxPost.is_reposted,
      } : {}),
    };
  }, [dbPost, reduxPost]);

  const handleDeletePost = async () => {
    setPostMenuVisible(false);
    try {
      await deletePost(id);
      dispatch(removePost(id));
      router.back();
    } catch {}
  };

  const handleDeleteComment = (commentId: string) => {
    setFlatComments((prev) => prev.filter((c) => c.id !== commentId));
    if (dbPost) setDbPost((p: any) => ({ ...p, comments_count: Math.max(0, (p.comments_count ?? 1) - 1) }));
  };

  const handleReply = (target: ReplyingTo) => {
    setReplyingTo(target);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8, allowsEditing: true });
    if (!result.canceled && result.assets[0]) {
      setPickedImage(result.assets[0].uri);
    }
  };

  const handleSend = async () => {
    if (!text.trim() && !pickedImage) return;
    setSending(true);
    try {
      const c = await addComment(id, text.trim(), replyingTo?.id, pickedImage ?? undefined);
      setFlatComments((prev) => [...prev, c]);
      setText('');
      setPickedImage(null);
      setReplyingTo(null);
      if (dbPost) setDbPost((p: any) => ({ ...p, comments_count: (p.comments_count ?? 0) + 1 }));
    } catch {}
    setSending(false);
  };

  const goToProfile = () => {
    if (!post?.user_id) return;
    if (post.user_id === currentUser?.id) {
      router.push('/(app)/profile');
    } else {
      router.push({ pathname: '/(app)/user/[id]', params: { id: post.user_id } });
    }
  };

  const tree = buildTree(flatComments);
  const p = post?.profiles as any;

  const isOwnPost = post?.user_id === currentUser?.id;
  const style = isDark ? 'dark' : 'light';

  const PostHeader = post ? (
    <View style={{ backgroundColor: bg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, gap: 12 }}>
        <Pressable onPress={goToProfile} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
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
        </Pressable>
        {isOwnPost && (
          <Menu
            contentStyle={{ backgroundColor: 'transparent', elevation: 0, shadowColor: 'transparent', borderWidth: 1, borderColor: '#B4B4B488', borderRadius: 10, overflow: 'hidden' }}
            visible={postMenuVisible}
            onDismiss={() => setPostMenuVisible(false)}
            anchor={<Pressable onPress={() => setPostMenuVisible(true)}><Entypo name="dots-three-horizontal" size={20} color={color} /></Pressable>}
          >
            <BlurView experimentalBlurMethod="dimezisBlurView" tint={style} style={{ height: '130%', width: '300%', position: 'absolute' }} />
            <Menu.Item titleStyle={{ fontFamily: 'jakara', color: 'red' }} onPress={handleDeletePost} trailingIcon={() => <TrashIcon size={18} color="red" />} title="Delete post" />
            <Menu.Item titleStyle={{ fontFamily: 'jakara', color }} onPress={() => setPostMenuVisible(false)} trailingIcon={() => <CloseCircleIcon size={18} color={color} />} title="Cancel" />
          </Menu>
        )}
      </View>

      {post.body ? (
        <Text style={{ color, fontFamily: 'jakara', fontSize: 18, lineHeight: 26, paddingHorizontal: 16, paddingTop: 14 }}>
          {post.body}
        </Text>
      ) : null}

      {post.image_url ? (
        <Pressable
          onPress={() => router.push({ pathname: '/(app)/image-viewer', params: { uri: post.image_url } })}
          style={{ marginHorizontal: 16, marginTop: 12, borderRadius: 14, overflow: 'hidden', aspectRatio: 16 / 9 }}
        >
          <Image source={{ uri: post.image_url }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
        </Pressable>
      ) : null}

      <Text style={{ color: 'grey', fontFamily: 'jakara', fontSize: 13, paddingHorizontal: 16, paddingTop: 12 }}>
        {formatFullDate(post.created_at)}
      </Text>

      <View style={{ flexDirection: 'row', gap: 20, paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 0.5, borderBottomWidth: 0.5, borderColor: divider, marginTop: 10 }}>
        {[
          { val: post.comments_count ?? 0, label: 'Replies' },
          { val: post.reposts_count ?? 0, label: 'Reposts' },
          { val: post.likes_count ?? 0, label: 'Sparkles' },
          { val: post.views_count ?? 0, label: 'Views' },
        ].map(({ val, label }) => (
          <View key={label} style={{ flexDirection: 'row', gap: 4 }}>
            <Text style={{ color, fontFamily: 'jakaraBold', fontSize: 14 }}>{val}</Text>
            <Text style={{ color: 'grey', fontFamily: 'jakara', fontSize: 14 }}>{label}</Text>
          </View>
        ))}
      </View>

      <View style={{ paddingVertical: 4, paddingHorizontal: 12, borderBottomWidth: 0.5, borderColor: divider }}>
        <Engagements
          id={post.id}
          like={post.likes_count ?? 0}
          comments={post.comments_count}
          isLiked={post.is_liked ?? false}
          isReposted={post.is_reposted ?? false}
        />
      </View>

      <Text style={{ color: 'grey', fontFamily: 'jakaraBold', fontSize: 13, paddingHorizontal: 16, paddingVertical: 12 }}>
        Replies
      </Text>
    </View>
  ) : null;

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: insets.top + 12, paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 0.5, borderColor: divider, backgroundColor: bg }}>
        <Pressable onPress={() => router.back()} style={{ marginRight: 16 }}>
          <BackIcon size={24} color={color} />
        </Pressable>
        <Text style={{ color, fontFamily: 'jakaraBold', fontSize: 18 }}>Post</Text>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator color={color} />
        </View>
      ) : (
        <FlatList
          data={tree}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={PostHeader}
          contentContainerStyle={{ paddingBottom: 80 }}
          ListEmptyComponent={
            <View style={{ alignItems: 'center', marginTop: 40 }}>
              <Text style={{ color: 'grey', fontFamily: 'mulish', fontSize: 14 }}>No replies yet. Be first!</Text>
            </View>
          }
          renderItem={({ item }) => (
            <CommentItem
              node={item}
              color={color}
              isDark={isDark}
              divider={divider}
              depth={0}
              currentUserId={currentUser?.id}
              onReply={handleReply}
              onImagePress={(uri) => router.push({ pathname: '/(app)/image-viewer', params: { uri } })}
              onDelete={handleDeleteComment}
              onCommentPress={(commentId) => router.push({ pathname: '/(app)/comment/[id]', params: { id: commentId } })}
            />
          )}
        />
      )}

      {/* Replying-to indicator */}
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

      {/* Image preview */}
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

      {/* Input row */}
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
          <SendIcon size={22} color={sending ? 'grey' : isDark ? 'white' : 'black'} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
