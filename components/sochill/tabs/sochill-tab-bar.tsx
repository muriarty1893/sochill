import { StyleSheet, View } from 'react-native';

import { AnimatedTabs } from './tabs';

import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import type { AntDesign } from '@expo/vector-icons';

const ICONS: Record<string, keyof typeof AntDesign.glyphMap> = {
  index: 'home',
  discover: 'search',
  activity: 'bell',
  profile: 'user',
};

export function SochillTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const tabs = state.routes.map((route) => {
    const options = descriptors[route.key]?.options;

    return {
      label: String(options?.title ?? route.name),
      icon: ICONS[route.name] ?? 'appstore-o',
    };
  });

  return (
    <View style={styles.container}>
      <AnimatedTabs
        tabs={tabs}
        activeTabIndex={state.index}
        setActiveTabIndex={(index) => {
          const route = state.routes[index];
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFCF6',
    borderTopColor: '#E8E1D6',
    borderTopWidth: 1,
    height: 76,
    justifyContent: 'center',
    paddingBottom: 10,
  },
});
