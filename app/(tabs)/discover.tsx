import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScrollStack } from '@/components/sochill/scroll-stack';
import { useCharityPosts } from '@/hooks/use-charity-posts';

export default function DiscoverScreen() {
  const { posts, supportedIds, loading, spark } = useCharityPosts();

  return (
    <SafeAreaView style={styles.screen}>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color="#2E8B77" />
        </View>
      ) : (
        <ScrollStack posts={posts} supportedIds={supportedIds} onSpark={spark} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFCF6' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
