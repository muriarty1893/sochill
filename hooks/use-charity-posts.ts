import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth-context';
import type { CharityPost } from '@/data/mock';

export function useCharityPosts() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<CharityPost[]>([]);
  const [supportedIds, setSupportedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from('charity_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        setPosts(data.map((p: any) => ({
          id: p.id,
          charityId: p.charity_id,
          charityName: p.charity_name,
          category: p.category,
          accent: p.accent,
          softAccent: p.soft_accent,
          emoji: p.emoji,
          title: p.title,
          body: p.body,
          supporters: p.supporters_count >= 1000
            ? `${(p.supporters_count / 1000).toFixed(1)}k`
            : String(p.supporters_count),
        })));
      }

      if (user) {
        const { data: sparks } = await supabase
          .from('charity_sparks')
          .select('charity_post_id')
          .eq('user_id', user.id);
        if (sparks) setSupportedIds(sparks.map((s: any) => s.charity_post_id));
      }

      setLoading(false);
    };

    fetchPosts();
  }, [user]);

  const spark = useCallback(async (charityPostId: string): Promise<boolean> => {
    if (!user || supportedIds.includes(charityPostId)) return false;
    const { error } = await supabase
      .from('charity_sparks')
      .insert({ charity_post_id: charityPostId, user_id: user.id });
    if (!error) {
      setSupportedIds(prev => [...prev, charityPostId]);
      return true;
    }
    return false;
  }, [user, supportedIds]);

  return { posts, supportedIds, loading, spark };
}
