import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { withSequence, withTiming, useSharedValue } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FloatingModal } from '@/components/sochill/floating-modal';
import { CircularButton } from '@/components/sochill/particles-button';
import { ReloadButton } from '@/components/sochill/reload-button';
import { useToast } from '@/components/sochill/toast';
import { useSparks } from '@/contexts/sparks-context';
import { posts } from '@/data/mock';

export default function HomeScreen() {
  const reloadProgress = useSharedValue(1);
  const { showToast } = useToast();
  const { donate, balance, defaultAmount } = useSparks();
  const [reactedTo, setReactedTo] = useState<Set<string>>(new Set());

  const toggleReaction = useCallback((postId: string, label: string) => {
    const key = `${postId}-${label}`;
    setReactedTo((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const handleDonate = useCallback((causeName: string) => {
    const success = donate();
    if (success) {
      showToast({
        title: `✦ ${defaultAmount} sparks donated`,
        subtitle: `Supporting "${causeName}". Balance: ${balance - defaultAmount}`,
        autodismiss: true,
        leading: () => <MaterialIcons name="volunteer-activism" size={20} color="#2E8B77" />,
      });
    } else {
      showToast({
        title: 'Not enough sparks',
        subtitle: 'Top up from your profile tab.',
        autodismiss: true,
        leading: () => <MaterialIcons name="info-outline" size={20} color="#C86B4A" />,
      });
    }
  }, [donate, balance, defaultAmount, showToast]);

  const showSavedToast = useCallback(() => {
    showToast({
      title: 'Draft saved',
      subtitle: 'Your post is waiting in the fake-data universe.',
      autodismiss: true,
      leading: () => <MaterialIcons name="check-circle" size={20} color="#2E8B77" />,
    });
  }, [showToast]);

  const onReload = useCallback(() => {
    reloadProgress.value = withSequence(
      withTiming(0.15, { duration: 120 }),
      withTiming(1, { duration: 520 }),
    );
    showToast({
      title: 'Feed refreshed',
      subtitle: 'New posts incoming.',
      autodismiss: true,
      leading: () => <MaterialIcons name="refresh" size={20} color="#2E8B77" />,
    });
  }, [reloadProgress, showToast]);

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        <View style={styles.composerRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>ME</Text>
          </View>
          <Text style={styles.composerText}>What feels worth sharing?</Text>
          <ReloadButton
            width={80}
            height={36}
            progress={reloadProgress}
            strokeWidth={1}
            borderRadius={18}
            color="#2E8B77"
            fontSize={13}
            onPress={onReload}
          />
          <CircularButton
            size={40}
            blastRadius={42}
            backgroundColor="#2E8B77"
            baseIcon={<MaterialIcons name="add" size={22} color="#FFFCF6" />}
            activeIcon={<MaterialIcons name="check" size={20} color="#FFFCF6" />}
            onPress={() => {
              showToast({
                title: 'Spark',
                subtitle: 'Particle button is alive.',
                autodismiss: true,
                leading: () => <MaterialIcons name="auto-awesome" size={20} color="#C86B4A" />,
              });
            }}
          />
        </View>

        <View style={styles.impactBand}>
          <View>
            <Text style={styles.bandLabel}>Spotlight nearby</Text>
            <Text style={styles.bandTitle}>14 people boosted food access today</Text>
          </View>
        </View>

        <View style={styles.feed}>
          {posts.map((post) => (
            <View key={post.id} style={styles.post}>
              <View style={styles.postHeader}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{post.avatar}</Text>
                </View>
                <View style={styles.authorBlock}>
                  <Text style={styles.author}>{post.author}</Text>
                  <Text style={styles.meta}>
                    {post.handle} · {post.time}
                  </Text>
                </View>
                <View style={styles.moodPill}>
                  <Text style={styles.moodText}>{post.mood}</Text>
                </View>
              </View>

              <Text style={styles.body}>{post.body}</Text>

              {post.cause ? (
                <View style={styles.causeRow}>
                  <View
                    style={[
                      styles.causeDot,
                      { backgroundColor: post.causeAccent ?? '#2E8B77' },
                    ]}
                  />
                  <Text style={styles.causeText}>{post.cause}</Text>
                  <Pressable
                    style={styles.causeButton}
                    onPress={() => handleDonate(post.cause ?? '')}>
                    <Text style={styles.causeButtonText}>✦ {defaultAmount}</Text>
                  </Pressable>
                </View>
              ) : null}

              <View style={styles.actions}>
                {post.reactions.map((reaction) => {
                  const key = `${post.id}-${reaction.label}`;
                  const reacted = reactedTo.has(key);
                  return (
                    <Pressable
                      key={reaction.label}
                      style={[styles.reaction, reacted && styles.reactionActive]}
                      onPress={() => toggleReaction(post.id, reaction.label)}>
                      <Text style={[styles.reactionText, reacted && styles.reactionTextActive]}>
                        {reaction.label} {reaction.count + (reacted ? 1 : 0)}
                      </Text>
                    </Pressable>
                  );
                })}
                <View style={styles.replyCount}>
                  <MaterialIcons name="chat-bubble-outline" size={16} color="#717771" />
                  <Text style={styles.replyText}>{post.replies}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <FloatingModal title="New post" doneLabel="Post" onDone={showSavedToast}>
        <View style={styles.modalInner}>
          <Text style={styles.modalLabel}>Share something public</Text>
          <View style={styles.fakeInput}>
            <Text style={styles.fakeInputText}>Today I want people to notice...</Text>
          </View>
          <View style={styles.modalPillRow}>
            {['text', 'photo', 'cause'].map((item) => (
              <View key={item} style={styles.modalPill}>
                <Text style={styles.modalPillText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>
      </FloatingModal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFCF6',
  },
  content: {
    padding: 18,
    paddingBottom: 28,
  },
  composerRow: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#ECE4D9',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
    padding: 12,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: '#F5E9DD',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  avatarText: {
    color: '#5E4435',
    fontSize: 12,
    fontWeight: '800',
  },
  composerText: {
    color: '#747A75',
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  impactBand: {
    backgroundColor: '#F8E5DD',
    borderRadius: 8,
    marginBottom: 16,
    padding: 14,
  },
  bandLabel: {
    color: '#9F563E',
    fontSize: 12,
    fontWeight: '800',
  },
  bandTitle: {
    color: '#31241F',
    fontFamily: 'SofiaSansCondensed_800ExtraBold',
    fontSize: 18,
    marginTop: 3,
  },
  feed: {
    gap: 12,
  },
  post: {
    backgroundColor: '#FFFFFF',
    borderColor: '#ECE4D9',
    borderRadius: 8,
    borderWidth: 1,
    padding: 14,
  },
  postHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  authorBlock: {
    flex: 1,
  },
  author: {
    color: '#171A18',
    fontFamily: 'SofiaSansCondensed_800ExtraBold',
    fontSize: 18,
  },
  meta: {
    color: '#7C827D',
    fontFamily: 'SplineSansMono_400Regular',
    fontSize: 11,
    marginTop: 1,
  },
  moodPill: {
    backgroundColor: '#EEF8F3',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  moodText: {
    color: '#2E8B77',
    fontSize: 12,
    fontWeight: '800',
  },
  body: {
    color: '#242724',
    fontFamily: 'RobotoSlab_400Regular',
    fontSize: 15,
    lineHeight: 23,
    marginTop: 14,
  },
  causeRow: {
    alignItems: 'center',
    backgroundColor: '#FAF7F0',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
    padding: 10,
  },
  causeDot: {
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  causeText: {
    color: '#39413D',
    flex: 1,
    fontSize: 13,
    fontWeight: '800',
  },
  causeButton: {
    backgroundColor: '#171A18',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  causeButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  actions: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
  },
  reaction: {
    backgroundColor: '#F4F0E8',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  reactionActive: {
    backgroundColor: '#171A18',
  },
  reactionText: {
    color: '#4E554F',
    fontFamily: 'SplineSansMono_400Regular',
    fontSize: 12,
  },
  reactionTextActive: {
    color: '#FFFFFF',
  },
  replyCount: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    marginLeft: 'auto',
  },
  replyText: {
    color: '#717771',
    fontFamily: 'SplineSansMono_400Regular',
    fontSize: 12,
  },
  modalInner: {
    flex: 1,
    padding: 16,
    paddingTop: 6,
  },
  modalLabel: {
    color: '#171A18',
    fontFamily: 'SofiaSansCondensed_800ExtraBold',
    fontSize: 20,
    marginBottom: 12,
  },
  fakeInput: {
    backgroundColor: '#FAF7F0',
    borderColor: '#ECE4D9',
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 128,
    padding: 14,
  },
  fakeInputText: {
    color: '#8A8F8D',
    fontFamily: 'RobotoSlab_400Regular',
    fontSize: 15,
    lineHeight: 23,
  },
  modalPillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
  },
  modalPill: {
    backgroundColor: '#EEF8F3',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  modalPillText: {
    color: '#2E8B77',
    fontSize: 13,
    fontWeight: '900',
  },
});
