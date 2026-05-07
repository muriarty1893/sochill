import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth-context';
import type { FriendSparkEntry } from '@/data/mock';

const COLORS = ['#2E8B77', '#3B82B8', '#C86B4A', '#8B5E2E', '#6B4CA8', '#2E7D4F', '#3D7A3A'];

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'now';
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

export function useActivity() {
  const { user } = useAuth();
  const [friendSparks, setFriendSparks] = useState<FriendSparkEntry[]>([]);
  const [causesCount, setCausesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchActivity = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const { data: mySparks } = await supabase
      .from('charity_sparks')
      .select('id')
      .eq('user_id', user.id);
    setCausesCount(mySparks?.length ?? 0);

    const { data: follows } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', user.id);

    const followingIds = (follows ?? []).map((f: any) => f.following_id);

    if (followingIds.length > 0) {
      const { data: sparks } = await supabase
        .from('charity_sparks')
        .select(`
          id, created_at, user_id,
          profiles ( id, username ),
          charity_posts ( id, charity_name, accent )
        `)
        .in('user_id', followingIds)
        .order('created_at', { ascending: false })
        .limit(50);

      const grouped: Record<string, {
        charityName: string;
        charityAccent: string;
        friends: { id: string; name: string; color: string; hasPfp: boolean }[];
        latestTime: string;
      }> = {};

      (sparks ?? []).forEach((s: any) => {
        const post = Array.isArray(s.charity_posts) ? s.charity_posts[0] : s.charity_posts;
        const profile = Array.isArray(s.profiles) ? s.profiles[0] : s.profiles;
        if (!post) return;
        const key = post.id;
        if (!grouped[key]) {
          grouped[key] = { charityName: post.charity_name, charityAccent: post.accent ?? '#2E8B77', friends: [], latestTime: s.created_at };
        }
        grouped[key].friends.push({
          id: profile?.id ?? s.user_id,
          name: profile?.username ?? 'Friend',
          color: COLORS[grouped[key].friends.length % COLORS.length],
          hasPfp: false,
        });
        if (s.created_at > grouped[key].latestTime) grouped[key].latestTime = s.created_at;
      });

      setFriendSparks(
        Object.entries(grouped).map(([postId, g]) => ({
          id: postId,
          charityName: g.charityName,
          charityAccent: g.charityAccent,
          friends: g.friends,
          totalCount: g.friends.length,
          time: relativeTime(g.latestTime),
        }))
      );
    } else {
      setFriendSparks([]);
    }

    setLoading(false);
  }, [user]);

  useEffect(() => { fetchActivity(); }, [fetchActivity]);

  return { friendSparks, causesCount, loading, refresh: fetchActivity };
}
