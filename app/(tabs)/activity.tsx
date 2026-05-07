import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FriendSparkCard } from '@/components/sochill/friend-spark';
import { useActivity } from '@/hooks/use-activity';

export default function ActivityScreen() {
  const { friendSparks, causesCount, loading } = useActivity();
  const [readAll, setReadAll] = useState(false);

  if (loading) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.center}>
          <ActivityIndicator color="#2E8B77" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        <View style={styles.summary}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{causesCount}</Text>
            <Text style={styles.summaryLabel}>causes sparked</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{friendSparks.length}</Text>
            <Text style={styles.summaryLabel}>friend sparks</Text>
          </View>
          <View style={styles.summaryDivider} />
          <Pressable style={styles.doneAllButton} onPress={() => setReadAll(true)}>
            <MaterialIcons name="done-all" size={18} color={readAll ? '#90968F' : '#2E8B77'} />
          </Pressable>
        </View>

        {friendSparks.length > 0 ? (
          <>
            <Text style={styles.sectionLabel}>Friends activity</Text>
            {friendSparks.map(entry => (
              <FriendSparkCard key={entry.id} entry={entry} />
            ))}
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No activity yet</Text>
            <Text style={styles.emptyText}>When friends start sparking causes, their activity will show up here. Follow people to see what they support.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFCF6',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 18,
    paddingBottom: 96,
  },
  summary: {
    backgroundColor: '#FFFFFF',
    borderColor: '#ECE4D9',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 14,
    padding: 14,
    alignItems: 'center',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryNumber: {
    color: '#171A18',
    fontFamily: 'SplineSansMono_400Regular',
    fontSize: 22,
  },
  summaryLabel: {
    color: '#7C827D',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 3,
    textAlign: 'center',
  },
  summaryDivider: {
    backgroundColor: '#EEE8DD',
    width: 1,
    height: 32,
  },
  doneAllButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  sectionLabel: {
    color: '#7C827D',
    fontFamily: 'SofiaSansCondensed_800ExtraBold',
    fontSize: 13,
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  emptyState: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingTop: 40,
  },
  emptyTitle: {
    color: '#171A18',
    fontFamily: 'SofiaSansCondensed_800ExtraBold',
    fontSize: 24,
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyText: {
    color: '#7C827D',
    fontFamily: 'RobotoSlab_400Regular',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
  },
});
