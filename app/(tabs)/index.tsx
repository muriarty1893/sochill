import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { withSequence, withTiming, useSharedValue } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FollowButton } from '@/components/sochill/composable-text';
import { FloatingModal } from '@/components/sochill/floating-modal';
import { ReloadButton } from '@/components/sochill/reload-button';
import { useToast } from '@/components/sochill/toast';
import { useFeed } from '@/hooks/use-feed';

function formatPostDate(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export default function HomeScreen() {
  const reloadProgress = useSharedValue(1);
  const { showToast } = useToast();
  const { posts, loading, createPost, refresh } = useFeed();
  const [draftText, setDraftText] = useState('');

  const handlePost = useCallback(async () => {
    if (!draftText.trim()) {
      showToast({
        title: 'Write something first',
        autodismiss: true,
        leading: () => <MaterialIcons name="edit" size={20} color="#C86B4A" />,
      });
      return;
    }
    const ok = await createPost(draftText.trim());
    if (ok) {
      setDraftText('');
      showToast({
        title: 'Posted!',
        subtitle: 'Your post is live in the feed.',
        autodismiss: true,
        leading: () => <MaterialIcons name="check-circle" size={20} color="#2E8B77" />,
      });
    }
  }, [draftText, createPost, showToast]);

  const onReload = useCallback(() => {
    reloadProgress.value = withSequence(
      withTiming(0.15, { duration: 120 }),
      withTiming(1, { duration: 520 }),
    );
    refresh();
    showToast({
      title: 'Feed refreshed',
      autodismiss: true,
      leading: () => <MaterialIcons name="refresh" size={20} color="#2E8B77" />,
    });
  }, [reloadProgress, refresh, showToast]);

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <ReloadButton
            width={80} height={36} progress={reloadProgress}
            strokeWidth={1} borderRadius={18} color="#2E8B77" fontSize={13}
            onPress={onReload}
          />
        </View>

        {loading ? (
          <ActivityIndicator color="#2E8B77" style={{ marginTop: 40 }} />
        ) : (
          <View style={styles.feed}>
            {posts.map((post) => {
              const profile = post.profiles as any;
              return (
                <View key={post.id} style={styles.post}>
                  <View style={styles.postHeader}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>
                        {profile?.username?.[0]?.toUpperCase() ?? '?'}
                      </Text>
                    </View>
                    <View style={styles.authorBlock}>
                      <Text style={styles.author}>{profile?.username ?? 'Unknown'}</Text>
                      <Text style={styles.meta}>
                        {profile?.handle ?? ''} · {formatPostDate(post.created_at)}
                      </Text>
                    </View>
                    <FollowButton userId={post.user_id} />
                  </View>
                  <Text style={styles.body}>{post.body}</Text>
                </View>
              );
            })}
            {posts.length === 0 && (
              <Text style={styles.emptyText}>No posts yet. Be the first!</Text>
            )}
          </View>
        )}
      </ScrollView>

      <FloatingModal title="New post" doneLabel="Post" onDone={handlePost}>
        <View style={styles.modalInner}>
          <Text style={styles.modalLabel}>Share something public</Text>
          <TextInput
            style={styles.textInput}
            multiline
            placeholder="Today I want people to notice..."
            placeholderTextColor="#8A8F8D"
            value={draftText}
            onChangeText={setDraftText}
            textAlignVertical="top"
          />
        </View>
      </FloatingModal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFCF6' },
  content: { padding: 18, paddingBottom: 96 },
  topBar: { alignItems: 'flex-end', marginBottom: 14 },
  feed: { gap: 12 },
  emptyText: {
    color: '#A0A59F',
    fontFamily: 'RobotoSlab_400Regular',
    fontSize: 14,
    marginTop: 40,
    textAlign: 'center',
  },
  post: {
    backgroundColor: '#FFFFFF',
    borderColor: '#ECE4D9',
    borderRadius: 8,
    borderWidth: 1,
    padding: 14,
  },
  postHeader: { alignItems: 'center', flexDirection: 'row', gap: 10 },
  authorBlock: { flex: 1 },
  avatar: {
    alignItems: 'center',
    backgroundColor: '#F5E9DD',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  avatarText: { color: '#5E4435', fontSize: 14, fontWeight: '800' },
  author: { color: '#171A18', fontFamily: 'SofiaSansCondensed_800ExtraBold', fontSize: 18 },
  meta: { color: '#7C827D', fontFamily: 'SplineSansMono_400Regular', fontSize: 11, marginTop: 1 },
  body: { color: '#242724', fontFamily: 'RobotoSlab_400Regular', fontSize: 15, lineHeight: 23, marginTop: 14 },
  modalInner: { flex: 1, padding: 16, paddingTop: 6 },
  modalLabel: { color: '#171A18', fontFamily: 'SofiaSansCondensed_800ExtraBold', fontSize: 20, marginBottom: 12 },
  textInput: {
    backgroundColor: '#FAF7F0',
    borderColor: '#ECE4D9',
    borderRadius: 8,
    borderWidth: 1,
    color: '#171A18',
    fontFamily: 'RobotoSlab_400Regular',
    fontSize: 15,
    lineHeight: 23,
    minHeight: 128,
    padding: 14,
  },
});
