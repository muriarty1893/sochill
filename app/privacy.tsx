import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ToggleItem = {
  id: string;
  label: string;
  description: string;
  default: boolean;
};

const TOGGLES: ToggleItem[] = [
  {
    id: 'activity',
    label: 'Show my activity to friends',
    description: 'Friends can see when you react or support causes.',
    default: true,
  },
  {
    id: 'causes',
    label: 'Show causes I\'ve supported',
    description: 'Your supported charities appear on your profile.',
    default: true,
  },
  {
    id: 'tags',
    label: 'Allow friends to tag me',
    description: 'Friends can mention you in their posts.',
    default: false,
  },
  {
    id: 'notifications',
    label: 'Spark notifications',
    description: 'Get notified when your supported causes reach milestones.',
    default: true,
  },
];

export default function PrivacyScreen() {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, boolean>>(
    Object.fromEntries(TOGGLES.map(t => [t.id, t.default])),
  );

  const toggle = (id: string) => {
    setValues(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={22} color="#171A18" />
        </Pressable>
        <Text style={styles.title}>Privacy</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionNote}>
          These settings are stored locally for now and will sync to your account once you sign in.
        </Text>

        <View style={styles.card}>
          {TOGGLES.map((item, i) => (
            <View key={item.id}>
              {i > 0 && <View style={styles.divider} />}
              <View style={styles.row}>
                <View style={styles.rowCopy}>
                  <Text style={styles.rowLabel}>{item.label}</Text>
                  <Text style={styles.rowDescription}>{item.description}</Text>
                </View>
                <Switch
                  value={values[item.id]}
                  onValueChange={() => toggle(item.id)}
                  trackColor={{ false: '#E0DDD6', true: '#A8D8C8' }}
                  thumbColor={values[item.id] ? '#2E8B77' : '#FFFFFF'}
                />
              </View>
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
  header: {
    alignItems: 'center',
    borderBottomColor: '#ECE4D9',
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  backButton: {
    alignItems: 'center',
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  title: {
    color: '#171A18',
    fontFamily: 'SofiaSansCondensed_800ExtraBold',
    fontSize: 22,
  },
  content: {
    padding: 18,
    paddingBottom: 48,
  },
  sectionNote: {
    color: '#7C827D',
    fontFamily: 'RobotoSlab_400Regular',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#ECE4D9',
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowCopy: {
    flex: 1,
  },
  rowLabel: {
    color: '#171A18',
    fontFamily: 'RobotoSlab_500Medium',
    fontSize: 14,
    lineHeight: 20,
  },
  rowDescription: {
    color: '#7C827D',
    fontFamily: 'RobotoSlab_400Regular',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2,
  },
  divider: {
    backgroundColor: '#F4F0E8',
    height: 1,
    marginHorizontal: 16,
  },
});
