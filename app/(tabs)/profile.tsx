import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useToast } from '@/components/sochill/toast';
import { useSparks } from '@/contexts/sparks-context';

export default function ProfileScreen() {
  const { balance, defaultAmount } = useSparks();
  const { showToast } = useToast();

  const showComingSoon = () => {
    showToast({ title: 'Coming soon', autodismiss: true });
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        <View style={styles.profileBlock}>
          <View style={styles.bigAvatar}>
            <Text style={styles.bigAvatarText}>SC</Text>
          </View>
          <View style={styles.profileCopy}>
            <Text style={styles.name}>sochill user</Text>
            <Text style={styles.handle}>@newhere</Text>
          </View>
          <Pressable style={styles.editButton} onPress={() => showToast({ title: 'Edit profile coming soon', autodismiss: true })}>
            <Text style={styles.editButtonText}>Edit</Text>
          </Pressable>
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
          <Pressable
            style={styles.sparksButton}
            onPress={() =>
              showToast({
                title: 'How sparks work',
                subtitle: 'Sparks go to charities when you support their posts — your balance stays yours.',
                autodismiss: true,
                leading: () => <MaterialIcons name="auto-awesome" size={20} color="#C86B4A" />,
              })
            }>
            <MaterialIcons name="info-outline" size={18} color="#2E8B77" />
            <Text style={styles.sparksButtonText}>How it works</Text>
          </Pressable>
        </View>

        <View style={styles.impactCard}>
          <Text style={styles.impactSectionLabel}>Impact this month</Text>
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
            { icon: 'settings', title: 'Settings' },
          ].map((item) => (
            <Pressable key={item.title} style={styles.settingRow} onPress={showComingSoon}>
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
    fontFamily: 'SofiaSansCondensed_800ExtraBold',
    fontSize: 20,
  },
  profileCopy: {
    flex: 1,
  },
  name: {
    color: '#171A18',
    fontFamily: 'SofiaSansCondensed_800ExtraBold',
    fontSize: 20,
  },
  handle: {
    color: '#7C827D',
    fontFamily: 'SplineSansMono_400Regular',
    fontSize: 12,
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
    fontFamily: 'SplineSansMono_400Regular',
    fontSize: 22,
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
    fontFamily: 'SplineSansMono_600SemiBold',
    fontSize: 11,
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  sparksBalance: {
    color: '#171A18',
    fontFamily: 'SplineSansMono_400Regular',
    fontSize: 36,
    lineHeight: 40,
  },
  sparksSub: {
    color: '#537269',
    fontFamily: 'RobotoSlab_400Regular',
    fontSize: 11,
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
  impactSectionLabel: {
    color: '#9F563E',
    fontFamily: 'SplineSansMono_600SemiBold',
    fontSize: 11,
  },
  impactTitle: {
    color: '#31241F',
    fontFamily: 'SofiaSansCondensed_800ExtraBold',
    fontSize: 22,
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
    fontFamily: 'RobotoSlab_400Regular',
    flex: 1,
    fontSize: 13,
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
    fontFamily: 'RobotoSlab_500Medium',
    fontSize: 15,
  },
});
