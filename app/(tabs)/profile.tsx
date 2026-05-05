import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSparks } from '@/contexts/sparks-context';

export default function ProfileScreen() {
  const { balance, defaultAmount } = useSparks();

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.kicker}>profile</Text>
            <Text style={styles.title}>Your corner</Text>
          </View>
          <Pressable style={styles.iconButton}>
            <MaterialIcons name="settings" size={22} color="#171A18" />
          </Pressable>
        </View>

        <View style={styles.profileBlock}>
          <View style={styles.bigAvatar}>
            <Text style={styles.bigAvatarText}>SC</Text>
          </View>
          <View style={styles.profileCopy}>
            <Text style={styles.name}>sochill user</Text>
            <Text style={styles.handle}>@newhere</Text>
          </View>
          <Pressable style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit</Text>
          </Pressable>
        </View>

        <View style={styles.authBox}>
          <View style={styles.authIcon}>
            <MaterialIcons name="lock-open" size={21} color="#2E8B77" />
          </View>
          <View style={styles.authCopy}>
            <Text style={styles.authTitle}>Auth will live here</Text>
            <Text style={styles.authText}>For now this is a friendly placeholder while we shape the app.</Text>
          </View>
        </View>

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>posts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>348</Text>
            <Text style={styles.statLabel}>followers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>7</Text>
            <Text style={styles.statLabel}>causes</Text>
          </View>
        </View>

        <View style={styles.sparksCard}>
          <View style={styles.sparksLeft}>
            <Text style={styles.sparksLabel}>✦ Sparks balance</Text>
            <Text style={styles.sparksBalance}>{balance}</Text>
            <Text style={styles.sparksSub}>Default donation: {defaultAmount} sparks per tap</Text>
          </View>
          <Pressable style={styles.sparksButton}>
            <MaterialIcons name="add" size={18} color="#2E8B77" />
            <Text style={styles.sparksButtonText}>Get more</Text>
          </Pressable>
        </View>

        <View style={styles.impactCard}>
          <Text style={styles.sectionLabel}>Impact this month</Text>
          <Text style={styles.impactTitle}>You helped send attention to three community campaigns.</Text>
          <View style={styles.impactRow}>
            <View style={styles.impactDot} />
            <Text style={styles.impactText}>Food access, books, and shoreline cleanup</Text>
          </View>
        </View>

        <View style={styles.settingsList}>
          {[
            { icon: 'person-add', title: 'Invite friends' },
            { icon: 'volunteer-activism', title: 'Saved charities' },
            { icon: 'privacy-tip', title: 'Privacy' },
          ].map((item) => (
            <Pressable key={item.title} style={styles.settingRow}>
              <MaterialIcons name={item.icon as keyof typeof MaterialIcons.glyphMap} size={21} color="#4E554F" />
              <Text style={styles.settingText}>{item.title}</Text>
              <MaterialIcons name="chevron-right" size={22} color="#A0A59F" />
            </Pressable>
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
    color: '#2E8B77',
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
    backgroundColor: '#FFFFFF',
    borderColor: '#ECE4D9',
    borderRadius: 22,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  profileBlock: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#ECE4D9',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    padding: 14,
  },
  bigAvatar: {
    alignItems: 'center',
    backgroundColor: '#DDF2EB',
    borderRadius: 29,
    height: 58,
    justifyContent: 'center',
    width: 58,
  },
  bigAvatarText: {
    color: '#2E8B77',
    fontSize: 18,
    fontWeight: '900',
  },
  profileCopy: {
    flex: 1,
  },
  name: {
    color: '#171A18',
    fontSize: 18,
    fontWeight: '900',
  },
  handle: {
    color: '#7C827D',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  editButton: {
    alignItems: 'center',
    backgroundColor: '#F4F0E8',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  editButtonText: {
    color: '#171A18',
    fontSize: 13,
    fontWeight: '800',
  },
  authBox: {
    alignItems: 'center',
    backgroundColor: '#EEF8F3',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 11,
    marginBottom: 12,
    padding: 14,
  },
  authIcon: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 19,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  authCopy: {
    flex: 1,
  },
  authTitle: {
    color: '#21473E',
    fontSize: 15,
    fontWeight: '900',
  },
  authText: {
    color: '#537269',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    marginTop: 2,
  },
  stats: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#ECE4D9',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    padding: 13,
  },
  statNumber: {
    color: '#171A18',
    fontSize: 21,
    fontWeight: '900',
  },
  statLabel: {
    color: '#7C827D',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 3,
  },
  sparksCard: {
    alignItems: 'center',
    backgroundColor: '#EEF8F3',
    borderColor: '#C8E8DC',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    padding: 15,
  },
  sparksLeft: {
    flex: 1,
  },
  sparksLabel: {
    color: '#2E8B77',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  sparksBalance: {
    color: '#171A18',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -1,
    lineHeight: 38,
  },
  sparksSub: {
    color: '#537269',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  sparksButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#C8E8DC',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  sparksButtonText: {
    color: '#2E8B77',
    fontSize: 13,
    fontWeight: '800',
  },
  impactCard: {
    backgroundColor: '#F8E5DD',
    borderRadius: 8,
    marginBottom: 12,
    padding: 15,
  },
  sectionLabel: {
    color: '#9F563E',
    fontSize: 12,
    fontWeight: '900',
  },
  impactTitle: {
    color: '#31241F',
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 26,
    marginTop: 8,
  },
  impactRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  impactDot: {
    backgroundColor: '#C86B4A',
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  impactText: {
    color: '#6F493B',
    flex: 1,
    fontSize: 13,
    fontWeight: '800',
  },
  settingsList: {
    gap: 10,
  },
  settingRow: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#ECE4D9',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    minHeight: 54,
    paddingHorizontal: 14,
  },
  settingText: {
    color: '#303531',
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
  },
});
