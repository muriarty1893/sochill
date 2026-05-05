import { Dimensions, StyleSheet, Text, View } from 'react-native';

import { useCallback, useEffect, useState } from 'react';

import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { QueueCard, type CardData } from './card';

const { width: WINDOW_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = WINDOW_WIDTH * 0.78;
const CARD_HEIGHT = CARD_WIDTH * 1.28;
const VISIBLE_STACK = 3;
const STACK_OFFSET_Y = 18;
const SWIPE_THRESHOLD = CARD_WIDTH * 0.33;

const QUEUE_DATA: CardData[] = [
  {
    id: '1',
    name: 'Mina',
    handle: '@minabean',
    avatar: 'MI',
    imageColor: '#9A8174',
    subtitle: '2 shared causes · active 8 min ago',
    type: 'friend',
    icon: 'person',
  },
  {
    id: '2',
    name: 'Pantry Fund',
    avatar: 'PF',
    imageColor: '#4A3C34',
    subtitle: 'Emergency food access for 200 families this month',
    description: 'Providing weekly grocery bundles to families facing food insecurity in the metro area.',
    category: 'Food Access',
    progress: 0.72,
    supporters: 184,
    type: 'cause',
    icon: 'restaurant',
  },
  {
    id: '3',
    name: 'Can',
    handle: '@canwashere',
    avatar: 'CA',
    imageColor: '#2E403A',
    subtitle: 'Active nearby · posted 21 min ago',
    type: 'friend',
    icon: 'person',
  },
  {
    id: '4',
    name: 'Blue Shore',
    avatar: 'BS',
    imageColor: '#2C3A46',
    subtitle: 'Beach cleanup campaign · coastal restoration',
    description: 'Organizing monthly cleanups along 12 km of coastline. Every session removes ~400 kg of plastic.',
    category: 'Environment',
    progress: 0.49,
    supporters: 67,
    type: 'cause',
    icon: 'waves',
  },
  {
    id: '5',
    name: 'Lara',
    handle: '@laralately',
    avatar: 'LA',
    imageColor: '#3E2E38',
    subtitle: 'Following 3 causes · 46 min ago',
    type: 'friend',
    icon: 'person',
  },
  {
    id: '6',
    name: 'Open Books',
    avatar: 'OB',
    imageColor: '#383828',
    subtitle: 'Community reading room · literacy',
    description: 'Building a free reading room and lending library for kids in underserved neighborhoods.',
    category: 'Education',
    progress: 0.61,
    supporters: 112,
    type: 'cause',
    icon: 'library-books',
  },
  {
    id: '7',
    name: 'Yusuf',
    handle: '@yusufwrites',
    avatar: 'YU',
    imageColor: '#2A382E',
    subtitle: 'Recently joined · 2 hours ago',
    type: 'friend',
    icon: 'person',
  },
  {
    id: '8',
    name: 'Tree Vault',
    avatar: 'TV',
    imageColor: '#2C3424',
    subtitle: 'Urban reforestation · new milestone reached',
    description: 'Planting native trees across 5 city districts. Current goal: 2,000 trees by spring.',
    category: 'Environment',
    progress: 0.85,
    supporters: 293,
    type: 'cause',
    icon: 'eco',
  },
];

type IMessageStackProps = {
  cards?: CardData[];
  onInterested?: (card: CardData) => void;
  onSkip?: (card: CardData) => void;
};

export const IMessageStack = ({ cards = QUEUE_DATA, onInterested, onSkip }: IMessageStackProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const translateX = useSharedValue(0);

  // Advance to next card without resetting translateX synchronously —
  // the useEffect below resets it after the React state commit so the
  // new front card is already off-screen when it snaps to center, preventing
  // the one-frame flash of the old card re-appearing at translateX=0.
  const advance = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % cards.length);
  }, [cards.length]);

  useEffect(() => {
    translateX.value = 0;
  }, [activeIndex, translateX]);

  const gesture = Gesture.Pan()
    .activeOffsetX([-12, 12])
    .failOffsetY([-10, 10])
    .onUpdate((e) => {
      translateX.value = e.translationX;
    })
    .onEnd((e) => {
      const shouldSwipe =
        Math.abs(e.translationX) > SWIPE_THRESHOLD ||
        Math.abs(e.velocityX) > 700;

      if (shouldSwipe) {
        const dir = e.translationX > 0 ? 1 : -1;
        if (dir > 0 && onInterested) runOnJS(onInterested)(cards[0]);
        if (dir < 0 && onSkip) runOnJS(onSkip)(cards[0]);
        translateX.value = withTiming(
          dir * WINDOW_WIDTH * 1.5,
          { duration: 240 },
          () => {
            runOnJS(advance)();
          },
        );
      } else {
        translateX.value = withSpring(0, { stiffness: 280, damping: 26 });
      }
    });

  const stackAreaHeight = CARD_HEIGHT + VISIBLE_STACK * STACK_OFFSET_Y + 8;

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>Your People Queue</Text>
        <Text style={styles.hint}>← skip · like →</Text>
      </View>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.stackArea, { height: stackAreaHeight }]}>
          {Array.from({ length: VISIBLE_STACK }, (_, stackPos) => {
            const dataIndex = (activeIndex + stackPos) % cards.length;
            return (
              <QueueCard
                key={stackPos}
                data={cards[dataIndex]}
                stackPosition={stackPos}
                translateX={translateX}
                total={VISIBLE_STACK}
                cardWidth={CARD_WIDTH}
                cardHeight={CARD_HEIGHT}
                swipeThreshold={SWIPE_THRESHOLD}
              />
            );
          }).reverse()}
        </Animated.View>
      </GestureDetector>
      <View style={styles.dots}>
        {cards.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === activeIndex % cards.length && styles.dotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 16,
    marginHorizontal: -18,
    paddingHorizontal: 18,
  },
  header: {
    alignItems: 'baseline',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    color: '#171A18',
    fontSize: 15,
    fontWeight: '900',
  },
  hint: {
    color: '#9A8174',
    fontSize: 12,
    fontWeight: '600',
  },
  stackArea: {
    marginHorizontal: -18,
    position: 'relative',
  },
  dots: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
    justifyContent: 'center',
    marginTop: 16,
  },
  dot: {
    backgroundColor: '#D0CCC8',
    borderRadius: 3,
    height: 5,
    width: 5,
  },
  dotActive: {
    backgroundColor: '#9A8174',
    width: 16,
  },
});
