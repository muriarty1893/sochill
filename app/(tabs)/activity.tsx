import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useToast } from '@/components/sochill/toast';
import { activity } from '@/data/mock';

export default function ActivityScreen() {
  const { showToast } = useToast();

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.kicker}>activity</Text>
            <Text style={styles.title}>People noticed</Text>
          </View>
          <Pressable
            style={styles.iconButton}
            onPress={() => {
              showToast({
                title: 'All caught up',
                subtitle: 'Swipe this toast left to dismiss it.',
                autodismiss: true,
                leading: () => <MaterialIcons name="done-all" size={20} color="#2E8B77" />,
              });
            }}>
            <MaterialIcons name="done-all" size={22} color="#2E8B77" />
          </Pressable>
        </View>

        <View style={styles.summary}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>126</Text>
            <Text style={styles.summaryLabel}>reactions</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>18</Text>
            <Text style={styles.summaryLabel}>boosts</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>4</Text>
            <Text style={styles.summaryLabel}>causes</Text>
          </View>
        </View>

        <View style={styles.toastPreview}>
          <View style={styles.toastIcon}>
            <MaterialIcons name="favorite" size={19} color="#C86B4A" />
          </View>
          <View style={styles.toastCopy}>
            <Text style={styles.toastTitle}>New boost from Can</Text>
            <Text style={styles.toastText}>Your beach cleanup post is picking up attention.</Text>
          </View>
        </View>

        <View style={styles.list}>
          {activity.map((item) => (
            <View key={item.id} style={styles.activityItem}>
              <View style={[styles.marker, { backgroundColor: item.accent }]} />
              <View style={styles.itemCopy}>
                <Text style={styles.itemTitle}>
                  <Text style={styles.actor}>{item.actor}</Text> {item.action}
                </Text>
                <Text style={styles.itemDetail}>{item.detail}</Text>
              </View>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
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
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  kicker: {
    color: '#3B82B8',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0,
  },
  title: {
    color: '#171A18',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 0,
  },
  iconButton: {
    alignItems: 'center',
    backgroundColor: '#EEF8F3',
    borderColor: '#D7EADF',
    borderRadius: 22,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  summary: {
    backgroundColor: '#FFFFFF',
    borderColor: '#ECE4D9',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 14,
    padding: 14,
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryNumber: {
    color: '#171A18',
    fontSize: 22,
    fontWeight: '900',
  },
  summaryLabel: {
    color: '#7C827D',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 3,
  },
  summaryDivider: {
    backgroundColor: '#EEE8DD',
    width: 1,
  },
  toastPreview: {
    alignItems: 'center',
    backgroundColor: '#171A18',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
    padding: 12,
  },
  toastIcon: {
    alignItems: 'center',
    backgroundColor: '#FFF2CF',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  toastCopy: {
    flex: 1,
  },
  toastTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  toastText: {
    color: '#D4D1C9',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  list: {
    gap: 10,
  },
  activityItem: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#ECE4D9',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 13,
  },
  marker: {
    borderRadius: 7,
    height: 14,
    width: 14,
  },
  itemCopy: {
    flex: 1,
  },
  itemTitle: {
    color: '#303531',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  actor: {
    color: '#171A18',
    fontWeight: '900',
  },
  itemDetail: {
    color: '#747A75',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    marginTop: 3,
  },
  time: {
    color: '#90968F',
    fontSize: 12,
    fontWeight: '800',
  },
});
