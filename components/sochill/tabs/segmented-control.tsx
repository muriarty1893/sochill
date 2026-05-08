import { useEffect } from 'react';
import { Image, ImageSourcePropType, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const PADDING = 5;
const ICON_SIZE = 22;

const ICON_SOURCES: Record<string, ImageSourcePropType> = {
  Home: require('@/icons/home.png'),
  Discover: require('@/icons/discover.png'),
  Spark: require('@/icons/activity.png'),
  Messages: require('@/icons/profile.png'),
};

export type SegmentedItem = {
  name: string;
};

type SegmentedControlProps = {
  data: readonly SegmentedItem[];
  selected: SegmentedItem;
  onPress: (item: SegmentedItem) => void;
  width: number;
  height: number;
};

export function SegmentedControl({ data, selected, onPress, width, height }: SegmentedControlProps) {
  const itemWidth = (width - PADDING * 2) / data.length;
  const selectedIndex = data.findIndex(d => d.name === selected.name);
  const indicatorHeight = height - PADDING * 2;

  const translateX = useSharedValue(selectedIndex * itemWidth);

  useEffect(() => {
    translateX.value = withTiming(selectedIndex * itemWidth, {
      duration: 260,
      easing: Easing.out(Easing.cubic),
    });
  }, [selectedIndex, itemWidth]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={[styles.container, { width, height, borderRadius: height / 2 }]}>
      <Animated.View
        style={[
          styles.indicator,
          { width: itemWidth, height: indicatorHeight, borderRadius: indicatorHeight / 2 },
          indicatorStyle,
        ]}
      />
      {data.map((item) => {
        const isActive = item.name === selected.name;
        return (
          <Pressable
            key={item.name}
            onPress={() => onPress(item)}
            style={[styles.item, { width: itemWidth }]}
          >
            <Image
              source={ICON_SOURCES[item.name]}
              style={[styles.icon, { tintColor: isActive ? '#FFFCF6' : '#7C827D' }]}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(237, 236, 234, 0.96)',
    flexDirection: 'row',
    padding: PADDING,
  },
  indicator: {
    backgroundColor: '#171A18',
    left: PADDING,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    top: PADDING,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  icon: {
    height: ICON_SIZE,
    resizeMode: 'contain',
    width: ICON_SIZE,
  },
});
