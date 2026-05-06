import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScrollStack } from '@/components/sochill/scroll-stack';
import { charityPosts } from '@/data/mock';

export default function DiscoverScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollStack posts={charityPosts} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFCF6',
  },
});
