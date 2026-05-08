import { useCallback, useEffect, useRef } from 'react';
import { AppState, Pressable, StyleSheet, View } from 'react-native';
import { useWindowDimensions } from 'react-native';
import { useGetMode } from '@/hooks/use-mode';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { SegmentedControl } from './segmented-control';
import { TAB_BAR_BOTTOM, TAB_BAR_HEIGHT } from '../floating-modal/constants';

import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import type { SegmentedItem } from './segmented-control';

const TABS: readonly SegmentedItem[] = [
  { name: 'Home' },
  { name: 'Discover' },
  { name: 'Spark' },
  { name: 'Messages' },
];

const ROUTE_TO_TAB: Record<string, SegmentedItem> = {
  index: TABS[0],
  discover: TABS[1],
  notifications: TABS[2],
  messages: TABS[3],
};

const HIDE_DELAY = 5000;

export function SochillTabBar({ state, navigation }: BottomTabBarProps) {
  const { width } = useWindowDimensions();
  const isDark = useGetMode();
  const controlWidth = width - 64;
  const selected = ROUTE_TO_TAB[state.routes[state.index]?.name] ?? TABS[0];

  const totalSlide = TAB_BAR_HEIGHT + TAB_BAR_BOTTOM + 16;
  const isVisible = useSharedValue(true);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleHide = useCallback(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      isVisible.value = false;
    }, HIDE_DELAY);
  }, [isVisible]);

  const showBar = useCallback(() => {
    isVisible.value = true;
    scheduleHide();
  }, [isVisible, scheduleHide]);

  useEffect(() => {
    scheduleHide();
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [scheduleHide]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') showBar();
    });
    return () => sub.remove();
  }, [showBar]);

  const handleTabPress = useCallback((item: SegmentedItem) => {
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
    scheduleHide();
  }, [state, navigation, scheduleHide]);

  const barStyle = useAnimatedStyle(() => ({
    transform: [{
      translateY: withSpring(isVisible.value ? 0 : totalSlide, {
        damping: 22,
        stiffness: 220,
        overshootClamping: true,
      }),
    }],
  }));

  const lineStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isVisible.value ? 0 : 1, {
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    }),
    transform: [{
      translateY: withTiming(isVisible.value ? 10 : 0, {
        duration: 280,
        easing: Easing.out(Easing.cubic),
      }),
    }],
  }));

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      {/* Sliding nav bar */}
      <Animated.View
        style={[styles.barContainer, barStyle]}
      >
        <SegmentedControl
          data={TABS}
          selected={selected}
          onPress={handleTabPress}
          width={controlWidth}
          height={56}
        />
      </Animated.View>

      {/* Home indicator line — tap to reveal bar */}
      <Animated.View
        style={[styles.lineWrapper, lineStyle]}
        pointerEvents="box-none"
      >
        <Pressable
          onPress={showBar}
          hitSlop={{ top: 18, bottom: 18, left: 80, right: 80 }}
        >
          <View style={[styles.line, { backgroundColor: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.32)' }]} />
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  barContainer: {
    alignItems: 'center',
    bottom: TAB_BAR_BOTTOM,
    left: 0,
    paddingTop: 10,
    paddingBottom: 10,
    position: 'absolute',
    right: 0,
  },
  lineWrapper: {
    alignItems: 'center',
    bottom: 8,
    left: 0,
    position: 'absolute',
    right: 0,
  },
  line: {
    borderRadius: 3,
    height: 5,
    width: 134,
  },
});
