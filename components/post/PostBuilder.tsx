import { View, Text, Pressable } from 'react-native';
import Animated, { SlideOutRight } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useGetMode } from '@/hooks/use-mode';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { deletePost } from '@/lib/api';
import { removePost } from '@/redux/slices/posts';
import ProfileImage from './ProfileImage';
import NameAndTag from './NameAndTag';
import TextPost from './TextPost';
import PhotoPost from './PhotoPost';
import Engagements from './Engagements';
import { ProfileIcon, RepostIcon } from '../icons';
import { dateAgo } from '@/util/date';
import type { Post } from '@/redux/slices/posts';

export default function PostBuilder({ post }: { post: Post }) {
  const isDark = useGetMode();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((s) => s.user.data);
  const backgroundColor = isDark ? 'black' : 'white';
  const borderBottomColor = isDark ? '#252222' : '#CCC9C9';
  const color = isDark ? '#FFFFFF' : '#000000';
  const rColor = isDark ? '#00000014' : '#BBBBBB';

  const p = post.profiles as any;
  const isMyPost = currentUser?.id === post.user_id;

  const handleDelete = async () => {
    try {
      await deletePost(post.id);
      dispatch(removePost(post.id));
    } catch {}
  };

  const goToProfile = () => {
    if (!post.user_id) return;
    if (post.user_id === currentUser?.id) {
      router.push('/(app)/profile');
    } else {
      router.push({ pathname: '/(app)/user/[id]', params: { id: post.user_id } });
    }
  };

  return (
    <Animated.View exiting={SlideOutRight.springify()} style={{ borderBottomWidth: 0.5, borderBottomColor }}>
      {post.reposted_by && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 2 }}>
          <RepostIcon size={13} color={isDark ? '#555' : '#999'} />
          <Text style={{ color: isDark ? '#555' : '#999', fontFamily: 'jakara', fontSize: 12 }}>
            {post.reposted_by.display_name ?? post.reposted_by.username} reposted
          </Text>
        </View>
      )}
      <Pressable
        onPress={() => router.push({ pathname: '/(app)/post/[id]', params: { id: post.id } })}
        android_ripple={{ color: rColor, foreground: true }}
        style={{ paddingHorizontal: 10, paddingVertical: 10 }}
      >
        <View style={{ flexDirection: 'row', width: '100%', gap: 10, padding: 10, backgroundColor }}>
          {/* Avatar */}
          <View style={{ height: 50, width: 50, justifyContent: 'center', alignItems: 'center', borderRadius: 9999, overflow: 'hidden' }}>
            <Pressable
              onPress={goToProfile}
              android_ripple={{ color: rColor, foreground: true }}
              style={{ height: 50, width: 50, justifyContent: 'center', alignItems: 'center' }}
            >
              {p?.avatar_url ? (
                <ProfileImage imageUri={p.avatar_url} size={50} />
              ) : (
                <ProfileIcon color={color} size={58} />
              )}
            </Pressable>
          </View>

          {/* Content */}
          <View style={{ width: '85%', justifyContent: 'flex-start' }}>
            <NameAndTag
              name={p?.display_name ?? p?.username}
              userTag={p?.username}
              verified={p?.verified}
              id={post.id}
              myPost={isMyPost}
              deletePost={handleDelete}
              dateAgo={dateAgo(new Date(post.created_at))}
            />
            {post.body ? <TextPost body={post.body} /> : null}
            {post.image_url ? (
              <PhotoPost
                imageUrl={post.image_url}
                width={post.image_width}
                height={post.image_height}
                postId={post.id}
              />
            ) : null}
            <Engagements
              id={post.id}
              like={post.likes_count ?? 0}
              comments={post.comments_count}
              isLiked={post.is_liked ?? false}
              isReposted={post.is_reposted ?? false}
            />
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}
