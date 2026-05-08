import { useEffect, useState } from 'react';
import { Keyboard, StyleSheet, useWindowDimensions } from 'react-native';
import { type FC, memo, type ReactNode } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { AddCloseIcon } from './add-close-icon';
import { AnimatedBackdrop } from './animated-backdrop';
import { FLOATING_BUTTON_SIZE, TAB_BAR_BOTTOM, TAB_BAR_HEIGHT } from './constants';
import { ModalContent } from './modal-content';

type FloatingModalProps = {
  children?: ReactNode;
  title?: string;
  doneLabel?: string;
  isDark?: boolean;
  // Return false to keep modal open (e.g. validation failed). Any other return closes it.
  onDone?: () => Promise<boolean | void> | boolean | void;
};

export const FloatingModal: FC<FloatingModalProps> = memo(
  ({ children, title, doneLabel, isDark, onDone }) => {
    const isOpened = useSharedValue(false);
    const keyboardOffset = useSharedValue(0);
    const [doneLoading, setDoneLoading] = useState(false);

    useEffect(() => {
      const show = Keyboard.addListener('keyboardDidShow', (e) => {
        keyboardOffset.value = withTiming(e.endCoordinates.height, { duration: 250 });
      });
      const hide = Keyboard.addListener('keyboardDidHide', () => {
        keyboardOffset.value = withTiming(0, { duration: 200 });
      });
      return () => { show.remove(); hide.remove(); };
    }, [keyboardOffset]);

    const progress = useDerivedValue<number>(() => withTiming(isOpened.value ? 1 : 0), []);

    const { width: screenWidth, height: screenHeight } = useWindowDimensions();
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const maxDistance = Math.sqrt(screenWidth ** 2 + screenHeight ** 2);
    const scale = useDerivedValue(() => {
      const dist = Math.sqrt(translateX.value ** 2 + translateY.value ** 2);
      return 1 - dist / maxDistance;
    }, [maxDistance]);

    const panGesture = Gesture.Pan()
      .onUpdate(({ translationX, translationY }) => {
        if (!isOpened.value) return;
        translateX.value = translationX;
        translateY.value = translationY;
      })
      .onFinalize((e) => {
        if (!isOpened.value) return;
        if (e.translationY > 0 && scale.value < 0.95) isOpened.value = false;
        translateX.value = withSpring(0, { overshootClamping: true });
        translateY.value = withSpring(0, { overshootClamping: true });
      });

    const rOpenedModalStyle = useAnimatedStyle(() => {
      const size = interpolate(progress.value, [0, 1], [FLOATING_BUTTON_SIZE, screenWidth * 0.9], Extrapolation.CLAMP);
      const right = interpolate(progress.value, [0, 1], [FLOATING_BUTTON_SIZE / 2, screenWidth * 0.05], Extrapolation.CLAMP);
      const centeredBottom = screenHeight / 2 - size / 2;
      const restingBottom = TAB_BAR_BOTTOM + TAB_BAR_HEIGHT + 12;
      const bottom = interpolate(
        progress.value,
        [0, 1],
        [restingBottom, centeredBottom + keyboardOffset.value * 0.6],
        Extrapolation.CLAMP,
      );
      return {
        width: size,
        height: size,
        bottom,
        right,
        borderRadius: interpolate(progress.value, [0, 1], [32, 15], Extrapolation.CLAMP),
        transform: [{ scale: scale.value }, { translateX: translateX.value }, { translateY: translateY.value }],
      };
    }, [screenWidth, screenHeight]);

    const isModalVisible = useDerivedValue(() => progress.value === 1, []);

    const handleDone = async () => {
      setDoneLoading(true);
      try {
        const result = await onDone?.();
        if (result !== false) {
          Keyboard.dismiss();
          isOpened.value = false;
        }
      } finally {
        setDoneLoading(false);
      }
    };

    const bg = isDark ? '#111' : 'white';

    return (
      <>
        <AnimatedBackdrop isVisible={isModalVisible} onBackdropPress={() => { isOpened.value = false; }} />
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.floatingModal, { backgroundColor: bg }, rOpenedModalStyle]}>
            <ModalContent
              isVisible={isModalVisible}
              isDark={isDark}
              title={title}
              doneLabel={doneLabel}
              loading={doneLoading}
              onDone={handleDone}
            >
              {children}
            </ModalContent>
            <AddCloseIcon
              progress={progress}
              isDark={isDark}
              onPress={() => { isOpened.value = !isOpened.value; }}
            />
          </Animated.View>
        </GestureDetector>
      </>
    );
  },
);

FloatingModal.displayName = 'FloatingModal';

const styles = StyleSheet.create({
  floatingModal: {
    boxShadow: '0px 12px 12px rgba(0, 0, 0, 0.25)',
    position: 'absolute',
  },
});
