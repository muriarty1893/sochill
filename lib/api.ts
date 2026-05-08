import { supabase } from './supabase';
import * as ImagePicker from 'expo-image-picker';

// ─── Auth ─────────────────────────────────────────────────────────────────

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signUpWithEmail(email: string, password: string, username: string, displayName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username, display_name: displayName } },
  });
  if (error) throw error;
  return data;
}

// ─── Profile ──────────────────────────────────────────────────────────────

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
}

export async function getMyProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  return getProfile(user.id);
}

export async function updateProfile(updates: {
  username?: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function uploadAvatar(uri: string): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const response = await fetch(uri);
  const blob = await response.blob();
  const ext = uri.split('.').pop() ?? 'jpg';
  const path = `avatars/${user.id}.${ext}`;

  const { error } = await supabase.storage.from('media').upload(path, blob, { upsert: true });
  if (error) throw error;

  const { data } = supabase.storage.from('media').getPublicUrl(path);
  return data.publicUrl;
}

// ─── Posts ────────────────────────────────────────────────────────────────

export async function getPosts(take = 20, offset = 0) {
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles (id, username, handle, display_name, avatar_url, verified),
      post_likes (user_id),
      reposts (user_id),
      comments (id)
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + take - 1);

  if (error) throw error;

  return data.map((p: any) => ({
    ...p,
    likes_count: p.post_likes?.length ?? 0,
    comments_count: p.comments?.length ?? 0,
    reposts_count: p.reposts?.length ?? 0,
    is_liked: user ? p.post_likes?.some((l: any) => l.user_id === user.id) : false,
    is_reposted: user ? p.reposts?.some((r: any) => r.user_id === user.id) : false,
  }));
}

export async function getFollowedPosts(take = 20, offset = 0) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: followData } = await supabase
    .from('follows')
    .select('following_id')
    .eq('follower_id', user.id);

  const followingIds = followData?.map((f: any) => f.following_id) ?? [];

  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles (id, username, handle, display_name, avatar_url, verified),
      post_likes (user_id),
      reposts (user_id),
      comments (id)
    `)
    .in('user_id', followingIds)
    .order('created_at', { ascending: false })
    .range(offset, offset + take - 1);

  if (error) throw error;

  return data.map((p: any) => ({
    ...p,
    likes_count: p.post_likes?.length ?? 0,
    comments_count: p.comments?.length ?? 0,
    reposts_count: p.reposts?.length ?? 0,
    is_liked: p.post_likes?.some((l: any) => l.user_id === user.id) ?? false,
    is_reposted: p.reposts?.some((r: any) => r.user_id === user.id) ?? false,
  }));
}

export async function getUserPosts(userId: string) {
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles (id, username, handle, display_name, avatar_url, verified),
      post_likes (user_id),
      reposts (user_id),
      comments (id)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data.map((p: any) => ({
    ...p,
    likes_count: p.post_likes?.length ?? 0,
    comments_count: p.comments?.length ?? 0,
    reposts_count: p.reposts?.length ?? 0,
    is_liked: user ? p.post_likes?.some((l: any) => l.user_id === user.id) : false,
    is_reposted: user ? p.reposts?.some((r: any) => r.user_id === user.id) : false,
  }));
}

export async function createPost(body: string, imageData?: { uri: string; width: number; height: number }) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  let image_url: string | undefined;
  let image_width: number | undefined;
  let image_height: number | undefined;

  if (imageData) {
    const cleanUri = imageData.uri.split('?')[0];
    const rawExt = cleanUri.split('.').pop()?.toLowerCase() ?? 'jpg';
    const ext = rawExt === 'jpeg' ? 'jpg' : rawExt;
    const contentType = ext === 'jpg' ? 'image/jpeg' : `image/${ext}`;
    const path = `posts/${user.id}/${Date.now()}.${ext}`;
    const response = await fetch(imageData.uri);
    const arrayBuffer = await response.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(path, arrayBuffer, { contentType, upsert: false });
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from('media').getPublicUrl(path);
    image_url = data.publicUrl;
    image_width = imageData.width;
    image_height = imageData.height;
  }

  const { data, error } = await supabase
    .from('posts')
    .insert({ user_id: user.id, body, image_url, image_width, image_height })
    .select(`*, profiles (id, username, handle, display_name, avatar_url, verified)`)
    .single();

  if (error) throw error;
  return { ...data, likes_count: 0, comments_count: 0, reposts_count: 0, is_liked: false, is_reposted: false };
}

export async function deletePost(postId: string) {
  const { error } = await supabase.from('posts').delete().eq('id', postId);
  if (error) throw error;
}

export async function likePost(postId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: existing } = await supabase
    .from('post_likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (existing) {
    await supabase.from('post_likes').delete().eq('id', existing.id);
  } else {
    await supabase.from('post_likes').insert({ post_id: postId, user_id: user.id });
  }
}

export async function repost(postId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: existing } = await supabase
    .from('reposts')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (existing) {
    await supabase.from('reposts').delete().eq('id', existing.id);
  } else {
    await supabase.from('reposts').insert({ post_id: postId, user_id: user.id });
  }
}

// ─── Comments ─────────────────────────────────────────────────────────────

export async function getComments(postId: string) {
  const { data, error } = await supabase
    .from('comments')
    .select('*, profiles (id, username, handle, display_name, avatar_url)')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data;
}

export async function addComment(postId: string, body: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const { data, error } = await supabase
    .from('comments')
    .insert({ post_id: postId, user_id: user.id, body })
    .select('*, profiles (id, username, handle, display_name, avatar_url)')
    .single();
  if (error) throw error;
  return data;
}

// ─── Users & Follow ───────────────────────────────────────────────────────

export async function searchUsers(query: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .or(`username.ilike.%${query}%,display_name.ilike.%${query}%,handle.ilike.%${query}%`)
    .limit(20);
  if (error) throw error;
  return data;
}

export async function getFollowDetails(userId: string) {
  const [followersRes, followingRes] = await Promise.all([
    supabase.from('follows').select('follower_id, profiles!follows_follower_id_fkey(*)').eq('following_id', userId),
    supabase.from('follows').select('following_id, profiles!follows_following_id_fkey(*)').eq('follower_id', userId),
  ]);
  return {
    followers: followersRes.data ?? [],
    following: followingRes.data ?? [],
    followersCount: followersRes.data?.length ?? 0,
    followingCount: followingRes.data?.length ?? 0,
  };
}

export async function follow(targetUserId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const { error } = await supabase.from('follows').insert({ follower_id: user.id, following_id: targetUserId });
  if (error) throw error;
}

export async function unfollow(targetUserId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const { error } = await supabase.from('follows').delete().eq('follower_id', user.id).eq('following_id', targetUserId);
  if (error) throw error;
}

export async function isFollowing(targetUserId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data } = await supabase
    .from('follows')
    .select('follower_id')
    .eq('follower_id', user.id)
    .eq('following_id', targetUserId)
    .maybeSingle();
  return !!data;
}

// ─── Search posts ─────────────────────────────────────────────────────────

export async function searchPosts(query: string) {
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('posts')
    .select(`*, profiles (id, username, handle, display_name, avatar_url, verified), post_likes (user_id), reposts (user_id), comments (id)`)
    .ilike('body', `%${query}%`)
    .order('created_at', { ascending: false })
    .limit(30);
  if (error) throw error;
  return data.map((p: any) => ({
    ...p,
    likes_count: p.post_likes?.length ?? 0,
    comments_count: p.comments?.length ?? 0,
    reposts_count: p.reposts?.length ?? 0,
    is_liked: user ? p.post_likes?.some((l: any) => l.user_id === user.id) : false,
    is_reposted: user ? p.reposts?.some((r: any) => r.user_id === user.id) : false,
  }));
}

// ─── Charities & Sparks ───────────────────────────────────────────────────

export async function getCharityPosts() {
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('charity_posts')
    .select('*, charity_sparks(user_id)')
    .order('supporters_count', { ascending: false });
  if (error) throw error;
  return data.map((p: any) => ({
    ...p,
    is_sparked: user ? (p.charity_sparks ?? []).some((s: any) => s.user_id === user.id) : false,
  }));
}

export async function sparkCharityPost(postId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const { data: existing } = await supabase
    .from('charity_sparks')
    .select('id')
    .eq('charity_post_id', postId)
    .eq('user_id', user.id)
    .maybeSingle();
  if (existing) {
    await supabase.from('charity_sparks').delete().eq('id', existing.id);
    return false;
  }
  await supabase.from('charity_sparks').insert({ charity_post_id: postId, user_id: user.id });
  return true;
}

// ─── Notifications ────────────────────────────────────────────────────────

export async function getNotifications() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const { data, error } = await supabase
    .from('activity')
    .select('*, actor:profiles!activity_actor_id_fkey(id, username, handle, display_name, avatar_url)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) throw error;
  return data;
}

export async function markNotificationsRead() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from('activity').update({ read: true }).eq('user_id', user.id).eq('read', false);
}

// ─── Conversations & Messages ─────────────────────────────────────────────

export async function getConversations() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('conversations')
    .select(`
      *,
      participant1:profiles!conversations_participant1_id_fkey(id, username, display_name, avatar_url),
      participant2:profiles!conversations_participant2_id_fkey(id, username, display_name, avatar_url),
      messages (id, body, sender_id, created_at, read)
    `)
    .or(`participant1_id.eq.${user.id},participant2_id.eq.${user.id}`)
    .order('last_message_at', { ascending: false });

  if (error) throw error;

  return data.map((c: any) => {
    const other = c.participant1_id === user.id ? c.participant2 : c.participant1;
    const msgs = c.messages ?? [];
    const lastMsg = msgs[msgs.length - 1];
    const unread = msgs.filter((m: any) => !m.read && m.sender_id !== user.id).length;
    return { id: c.id, other_user: other, last_message: lastMsg?.body, last_message_at: lastMsg?.created_at, unread_count: unread };
  });
}

export async function getOrCreateConversation(otherUserId: string): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: existing } = await supabase
    .from('conversations')
    .select('id')
    .or(
      `and(participant1_id.eq.${user.id},participant2_id.eq.${otherUserId}),and(participant1_id.eq.${otherUserId},participant2_id.eq.${user.id})`
    )
    .maybeSingle();

  if (existing) return existing.id;

  const { data: created, error } = await supabase
    .from('conversations')
    .insert({ participant1_id: user.id, participant2_id: otherUserId })
    .select('id')
    .single();

  if (error) throw error;
  return created.id;
}

export async function getMessages(conversationId: string) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data;
}

export async function sendMessage(conversationId: string, body: string, imageUrl?: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const { data, error } = await supabase
    .from('messages')
    .insert({ conversation_id: conversationId, sender_id: user.id, body, image_url: imageUrl })
    .select()
    .single();
  if (error) throw error;
  await supabase
    .from('conversations')
    .update({ last_message_at: new Date().toISOString() })
    .eq('id', conversationId);
  return data;
}

export async function markMessagesRead(conversationId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase
    .from('messages')
    .update({ read: true })
    .eq('conversation_id', conversationId)
    .neq('sender_id', user.id);
}
