import { View, Text, Pressable } from 'react-native';
import { useState } from 'react';
import { useGetMode } from '@/hooks/use-mode';
import LikeButton from './LikeButton';
import RepostButton from './RepostButton';
import { ShareUnfocused, CommentIcon } from '../icons';
import { likePost, repost } from '@/lib/api';
import { useAppDispatch } from '@/redux/hooks';
import { toggleLike } from '@/redux/slices/posts';

export default function Engagements({
  id,
  like,
  comments,
  isLiked,
  isReposted,
}: {
  id: string;
  like: number;
  comments?: number;
  isLiked: boolean;
  isReposted: boolean;
}) {
  const isDark = useGetMode();
  const dispatch = useAppDispatch();
  const shareColor = isDark ? '#91EC09' : '#639E0B';
  const mutedColor = isDark ? '#666' : '#999';

  const [likeAmount, setLikeAmount] = useState(like);
  const [clicked, setClicked] = useState(isLiked);
  const [reposted, setReposted] = useState(isReposted);

  const handleLike = (v: boolean) => {
    setClicked(v);
    setLikeAmount((prev) => prev + (v ? 1 : -1));
    dispatch(toggleLike(id));
    likePost(id).catch(() => {
      setClicked(!v);
      setLikeAmount((prev) => prev + (v ? -1 : 1));
      dispatch(toggleLike(id));
    });
  };

  const handleRepost = (v: boolean) => {
    setReposted(v);
    repost(id).catch(() => setReposted(!v));
  };

  return (
    <View style={{ flexDirection: 'row', paddingHorizontal: 4, alignItems: 'center', gap: 6, justifyContent: 'space-between' }}>
      <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
        <LikeButton
          isLiked={isLiked}
          text={likeAmount.toString()}
          clicked={clicked}
          setClicked={handleLike}
        />
        <RepostButton
          isPosted={isReposted}
          clicked={reposted}
          setReposted={handleRepost}
        />
        {comments !== undefined && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <CommentIcon size={18} color={mutedColor} />
            <Text style={{ color: mutedColor, fontFamily: 'jakara', fontSize: 13 }}>{comments}</Text>
          </View>
        )}
      </View>
      <Pressable>
        <ShareUnfocused size={20} color={shareColor} />
      </Pressable>
    </View>
  );
}
