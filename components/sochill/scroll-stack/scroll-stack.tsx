import { StyleSheet, Text, View } from 'react-native';

import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';

import { CARD_HEIGHT, CARD_WIDTH, ScrollCard } from './scroll-card';

import type { ScrollCardData } from './scroll-card';

const CARDS: ScrollCardData[] = [
  { color: '#F1EEE0', accent: '#E8DFD0', label: 'Food Access', sub: 'Weekly groceries for 200 families', emoji: '🥗' },
  { color: '#EAF4EF', accent: '#D5ECE2', label: 'Environment', sub: 'Beach cleanups · 400 kg removed', emoji: '🌿' },
  { color: '#FFF2CF', accent: '#F5E8B8', label: 'Education', sub: 'Free reading room for local kids', emoji: '📚' },
  { color: '#F6DFEB', accent: '#EDCFE1', label: 'Mutual Aid', sub: 'Neighbor-to-neighbor support network', emoji: '🤝' },
  { color: '#E3DFFF', accent: '#D4CFFA', label: 'Housing', sub: 'Transitional shelter for 40 people', emoji: '🏠' },
  { color: '#AFCBFF', accent: '#9DBFF5', label: 'Health', sub: 'Free clinic Saturdays in the park', emoji: '💚' },
  { color: '#F4ACB7', accent: '#EE99A6', label: 'Arts', sub: 'Community murals · open to all', emoji: '🎨' },
  { color: '#C7E3D4', accent: '#B0D8C3', label: 'Urban Trees', sub: '2,000 native trees by spring', emoji: '🌳' },
  { color: '#F3D9BC', accent: '#EAC9A5', label: 'Animals', sub: 'Stray rescue · 60 rehomed this year', emoji: '🐾' },
  { color: '#FFD1DC', accent: '#F5BECB', label: 'Community', sub: 'Town hall events every first Sunday', emoji: '🏘️' },
];

const VERTICAL_PADDING = 25;

export const ScrollStack = () => {
  const scrollOffset = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollOffset.value = event.contentOffset.x;
    },
  });

  return (
    <View style={styles.wrapper}>
      <Text style={styles.sectionLabel}>Browse causes</Text>
      <View style={styles.container}>
        <View style={{ marginBottom: CARD_HEIGHT }}>
          <Animated.FlatList
            horizontal
            snapToInterval={CARD_WIDTH}
            disableIntervalMomentum
            onScroll={onScroll}
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            style={styles.scrollView}
            data={CARDS}
            inverted
            contentContainerStyle={styles.scrollViewContent}
            renderItem={() => (
              <View style={{ height: CARD_HEIGHT, width: CARD_WIDTH }} />
            )}
            keyExtractor={(_, i) => String(i)}
          />
          <Animated.View
            style={{
              position: 'absolute',
              top: VERTICAL_PADDING,
              bottom: VERTICAL_PADDING,
              left: 0,
              right: 0,
              pointerEvents: 'none',
            }}>
            {CARDS.map((item, i) => (
              <ScrollCard
                key={i}
                scrollOffset={scrollOffset}
                index={CARDS.length - 1 - i}
                data={item}
              />
            ))}
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  sectionLabel: {
    color: '#171A18',
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 12,
  },
  container: {
    backgroundColor: '#F4F0E8',
    borderRadius: 12,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  scrollView: {
    maxHeight: CARD_HEIGHT + VERTICAL_PADDING * 2,
    position: 'absolute',
  },
  scrollViewContent: {
    alignItems: 'center',
    height: CARD_HEIGHT + VERTICAL_PADDING * 2,
    justifyContent: 'center',
    paddingHorizontal: CARD_WIDTH,
  },
});
