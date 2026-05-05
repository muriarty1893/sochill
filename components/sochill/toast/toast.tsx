import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { useCallback, useEffect } from 'react';

import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { useInternalToast } from './hooks';

type ToastProps = {
  index: number;
  toastKey: string;
  onDismiss: (toastId: number) => void;
};

const ToastOffset = 20;
const ToastHeight = 70;
const HideToastOffset = ToastOffset + ToastHeight;
const BaseSafeArea = 50;

export const Toast: React.FC<ToastProps> = ({ toastKey, index, onDismiss }) => {
  const { width: windowWidth } = useWindowDimensions();
  const toast = useInternalToast(toastKey);
  const isActiveToast = toast?.id === 0;

  const initialBottomPosition = isActiveToast
    ? -HideToastOffset
    : BaseSafeArea + ((toast?.id ?? 0) - 1) * ToastOffset;

  const bottom = useSharedValue(initialBottomPosition);

  useEffect(() => {
    if (!toast) {
      return;
    }

    bottom.value = withSpring(BaseSafeArea + toast.id * ToastOffset);
  }, [bottom, toast]);

  const translateX = useSharedValue(0);
  const isSwiping = useSharedValue(false);

  const dismissItem = useCallback(() => {
    'worklet';
    if (!toast) {
      return;
    }

    translateX.value = withTiming(-windowWidth, undefined, (isFinished) => {
      if (isFinished) {
        runOnJS(onDismiss)(toast.id);
      }
    });
  }, [onDismiss, toast, translateX, windowWidth]);

  const gesture = Gesture.Pan()
    .enabled(isActiveToast)
    .onBegin(() => {
      isSwiping.value = true;
    })
    .onUpdate((event) => {
      if (event.translationX > 0) {
        return;
      }

      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      if (event.translationX < -50) {
        dismissItem();
      } else {
        translateX.value = withSpring(0);
      }
    })
    .onFinalize(() => {
      isSwiping.value = false;
    });

  useEffect(() => {
    if (!toast?.autodismiss || !isActiveToast) {
      return;
    }

    const timeout = setTimeout(() => {
      dismissItem();
    }, 2500);

    return () => {
      clearTimeout(timeout);
    };
  }, [dismissItem, isActiveToast, toast?.autodismiss]);

  const rToastStyle = useAnimatedStyle(() => {
    if (!toast) {
      return {};
    }

    const baseScale = 1 - toast.id * 0.05;
    const scale = isSwiping.value ? baseScale * 0.96 : baseScale;

    return {
      bottom: bottom.value,
      zIndex: 1000 - toast.id,
      transform: [
        {
          scale: withTiming(scale),
        },
        {
          translateX: translateX.value,
        },
      ],
    };
  }, [toast?.id]);

  const rVisibleContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming((toast?.id ?? 0) <= 1 ? 1 : 0),
    };
  }, [toast?.id]);

  if (!toast) {
    return null;
  }

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        key={index}
        style={[
          {
            width: windowWidth * 0.9,
            left: windowWidth * 0.05,
            zIndex: 100 - toast.id,
          },
          styles.container,
          rToastStyle,
        ]}>
        <Animated.View style={styles.textContainer}>
          <Animated.View style={[rVisibleContainerStyle, styles.rowCenter]}>
            {Boolean(toast.leading) && <>{toast.leading?.()}</>}
            <View
              style={[
                styles.columnCenter,
                {
                  marginLeft: toast.leading ? 10 : 0,
                },
              ]}>
              <Text style={styles.title}>{toast.title}</Text>
              {toast.subtitle && <Text style={styles.subtitle}>{toast.subtitle}</Text>}
            </View>
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  columnCenter: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 20,
    boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.2)',
    height: 70,
    paddingHorizontal: 25,
    position: 'absolute',
  },
  rowCenter: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  subtitle: {
    color: '#666',
    fontSize: 13,
  },
  textContainer: {
    alignItems: 'flex-start',
    flex: 1,
    justifyContent: 'center',
    rowGap: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
