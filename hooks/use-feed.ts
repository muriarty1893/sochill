import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth-context';

export type Post = {
  id: string;
  body: string;
  mood: string | null;
  created_at: string;
  user_id: string;
  profiles: {
    username: string;
    handle: string;
  };
};

export function useFeed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('posts')
      .select('id, body, mood, created_at, user_id, profiles ( username, handle )')
      .order('created_at', { ascending: false })
      .limit(50);

    if (data) setPosts(data as any);
    setLoading(false);
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const createPost = useCallback(async (body: string, mood?: string) => {
    if (!user) return false;
    const { data, error } = await supabase
      .from('posts')
      .insert({ body, mood: mood ?? null, user_id: user.id })
      .select('id, body, mood, created_at, user_id, profiles ( username, handle )')
      .single();
    if (!error && data) {
      const newPost: Post = {
        ...(data as any),
        profiles: Array.isArray((data as any).profiles) ? (data as any).profiles[0] : (data as any).profiles,
      };
      setPosts(prev => [newPost, ...prev]);
      return true;
    }
    return false;
  }, [user]);

  return { posts, loading, createPost, refresh: fetchPosts };
}
