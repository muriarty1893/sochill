import { StyleSheet, View } from 'react-native';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SegmentedControl } from './segmented-control';

import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import type { SegmentedItem } from './segmented-control';

const TABS: readonly SegmentedItem[] = [
  { name: 'Home' },
  { name: 'Discover' },
  { name: 'Activity' },
  { name: 'Profile' },
];

const ROUTE_TO_TAB: Record<string, SegmentedItem> = {
  index: TABS[0],
  discover: TABS[1],
  activity: TABS[2],
  profile: TABS[3],
};

export function SochillTabBar({ state, navigation }: BottomTabBarProps) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const controlWidth = width - 64;
  const selected = ROUTE_TO_TAB[state.routes[state.index]?.name] ?? TABS[0];

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 10 }]}>
      <SegmentedControl
        data={TABS}
        selected={selected}
        onPress={(item) => {
          const routeName = Object.keys(ROUTE_TO_TAB).find(
            k => ROUTE_TO_TAB[k]?.name === item.name,
          );
          if (!routeName) return;
          const route = state.routes.find(r => r.name === routeName);
          if (!route) return;
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!event.defaultPrevented) {
            navigation.navigate(routeName);
          }
        }}
        width={controlWidth}
        height={56}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    bottom: 0,
    left: 0,
    paddingTop: 10,
    position: 'absolute',
    right: 0,
  },
});
