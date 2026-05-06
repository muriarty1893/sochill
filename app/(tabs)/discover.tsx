import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScrollStack } from '@/components/sochill/scroll-stack';
import { useToast } from '@/components/sochill/toast';
import { charities } from '@/data/mock';

export default function DiscoverScreen() {
  const { showToast } = useToast();

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.kicker}>discover</Text>
            <Text style={styles.title}>Causes getting attention</Text>
          </View>
          <Pressable style={styles.filterButton}>
            <MaterialIcons name="tune" size={22} color="#171A18" />
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={166}
          decelerationRate="fast"
          contentContainerStyle={styles.categories}>
          {['Food access', 'Environment', 'Education', 'Mutual aid'].map((category, index) => (
            <Pressable
              key={category}
              style={[
                styles.category,
                index === 0 ? styles.categoryActive : null,
              ]}>
              <Text
                style={[
                  styles.categoryText,
                  index === 0 ? styles.categoryTextActive : null,
                ]}>
                {category}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <ScrollStack />

        <View style={styles.spotlight}>
          <View style={styles.spotlightTop}>
            <View style={styles.sparkIcon}>
              <MaterialIcons name="auto-awesome" size={21} color="#C86B4A" />
            </View>
            <Text style={styles.spotlightLabel}>Partner spotlight</Text>
          </View>
          <Text style={styles.spotlightTitle}>Open Room Books is close to opening shelf number 12.</Text>
          <Pressable
            style={styles.followButton}
            onPress={() => {
              showToast({
                title: 'Following Open Room Books',
                subtitle: 'Spotlights will show up in Activity.',
                autodismiss: true,
                leading: () => <MaterialIcons name="auto-awesome" size={20} color="#C86B4A" />,
              });
            }}>
            <Text style={styles.followButtonText}>Follow</Text>
          </Pressable>
        </View>

        <View style={styles.list}>
          {charities.map((charity) => (
            <View key={charity.id} style={styles.charityCard}>
              <View style={styles.cardTop}>
                <View style={[styles.logo, { backgroundColor: charity.softAccent }]}>
                  <Text style={[styles.logoText, { color: charity.accent }]}>
                    {charity.name.slice(0, 2)}
                  </Text>
                </View>
                <View style={styles.cardTitleBlock}>
                  <Text style={styles.charityName}>{charity.name}</Text>
                  <Text style={styles.charityCategory}>{charity.category}</Text>
                </View>
                <Pressable
                  style={styles.cardFollowButton}
                  onPress={() => {
                    showToast({
                      title: `Following ${charity.name}`,
                      autodismiss: true,
                      leading: () => <MaterialIcons name="add" size={20} color={charity.accent} />,
                    });
                  }}>
                  <MaterialIcons name="add" size={20} color="#171A18" />
                </Pressable>
              </View>

              <Text style={styles.mission}>{charity.mission}</Text>

              <Text style={styles.supporters}>{charity.supporters} supporters</Text>
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
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  kicker: {
    color: '#C86B4A',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0,
  },
  title: {
    color: '#171A18',
    fontSize: 29,
    fontWeight: '800',
    letterSpacing: 0,
    lineHeight: 34,
    maxWidth: 280,
  },
  filterButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#ECE4D9',
    borderRadius: 22,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  categories: {
    gap: 8,
    paddingBottom: 14,
  },
  category: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#ECE4D9',
    borderRadius: 18,
    borderWidth: 1,
    height: 36,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  categoryActive: {
    backgroundColor: '#171A18',
    borderColor: '#171A18',
  },
  categoryText: {
    color: '#59605A',
    fontSize: 13,
    fontWeight: '800',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  spotlight: {
    backgroundColor: '#FFF2CF',
    borderRadius: 8,
    marginBottom: 14,
    padding: 16,
  },
  spotlightTop: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  sparkIcon: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  spotlightLabel: {
    color: '#8E6B18',
    fontSize: 13,
    fontWeight: '800',
  },
  spotlightTitle: {
    color: '#2E2718',
    fontSize: 21,
    fontWeight: '800',
    lineHeight: 27,
    marginTop: 14,
    marginBottom: 16,
  },
  followButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#171A18',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  followButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  list: {
    gap: 12,
  },
  charityCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#ECE4D9',
    borderRadius: 8,
    borderWidth: 1,
    padding: 14,
  },
  cardTop: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  logo: {
    alignItems: 'center',
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  logoText: {
    fontSize: 13,
    fontWeight: '900',
  },
  cardTitleBlock: {
    flex: 1,
  },
  charityName: {
    color: '#171A18',
    fontSize: 16,
    fontWeight: '800',
  },
  charityCategory: {
    color: '#7C827D',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  cardFollowButton: {
    alignItems: 'center',
    backgroundColor: '#F4F0E8',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  mission: {
    color: '#3F4540',
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 22,
    marginTop: 14,
  },
  supporters: {
    color: '#7C827D',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 10,
  },
});
