import { StyleSheet, useWindowDimensions } from 'react-native';

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
import { FLOATING_BUTTON_SIZE } from './constants';
import { ModalContent } from './modal-content';

type FloatingModalProps = {
  children?: ReactNode;
  title?: string;
  doneLabel?: string;
  onDone?: () => void;
};

export const FloatingModal: FC<FloatingModalProps> = memo(
  ({ children, title, doneLabel, onDone }) => {
    const isOpened = useSharedValue(false);

    const progress = useDerivedValue<number>(() => {
      return withTiming(isOpened.value ? 1 : 0);
    }, []);

    const { width: screenWidth, height: screenHeight } = useWindowDimensions();
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const maxDistance = Math.sqrt(screenWidth ** 2 + screenHeight ** 2);
    const scale = useDerivedValue(() => {
      const distance = Math.sqrt(translateX.value ** 2 + translateY.value ** 2);
      const normalizedDistance = distance / maxDistance;
      return 1 - normalizedDistance;
    }, [maxDistance]);

    const panGesture = Gesture.Pan()
      .onUpdate(({ translationX, translationY }) => {
        if (!isOpened.value) {
          return;
        }

        translateX.value = translationX;
        translateY.value = translationY;
      })
      .onFinalize((event) => {
        if (!isOpened.value) {
          return;
        }

        const isDraggingDown = event.translationY > 0;
        const isDraggingDownEnoughToClose = isDraggingDown && scale.value < 0.95;

        if (isDraggingDownEnoughToClose) {
          isOpened.value = false;
        }

        translateX.value = withSpring(0, {
          overshootClamping: true,
        });
        translateY.value = withSpring(0, {
          overshootClamping: true,
        });
      });

    const rOpenedModalStyle = useAnimatedStyle(() => {
      const size = interpolate(
        progress.value,
        [0, 1],
        [FLOATING_BUTTON_SIZE, screenWidth * 0.9],
        Extrapolation.CLAMP,
      );
      const rightDistance = interpolate(
        progress.value,
        [0, 1],
        [FLOATING_BUTTON_SIZE / 2, screenWidth * 0.05],
        Extrapolation.CLAMP,
      );
      const bottomDistance = interpolate(
        progress.value,
        [0, 1],
        [FLOATING_BUTTON_SIZE / 2, screenHeight / 2 - size / 2],
        Extrapolation.CLAMP,
      );
      const borderRadius = interpolate(progress.value, [0, 1], [32, 15], Extrapolation.CLAMP);

      return {
        width: size,
        height: size,
        bottom: bottomDistance,
        right: rightDistance,
        borderRadius,
        transform: [
          {
            scale: scale.value,
          },
          {
            translateX: translateX.value,
          },
          {
            translateY: translateY.value,
          },
        ],
      };
    }, [screenWidth, screenHeight]);

    const isModalVisible = useDerivedValue(() => {
      return progress.value === 1;
    }, []);

    return (
      <>
        <AnimatedBackdrop
          isVisible={isModalVisible}
          onBackdropPress={() => {
            isOpened.value = !isOpened.value;
          }}
        />
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.floatingModal, rOpenedModalStyle]}>
            <ModalContent
              isVisible={isModalVisible}
              title={title}
              doneLabel={doneLabel}
              onDone={() => {
                onDone?.();
                isOpened.value = false;
              }}>
              {children}
            </ModalContent>
            <AddCloseIcon
              progress={progress}
              onPress={() => {
                isOpened.value = !isOpened.value;
              }}
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
    backgroundColor: 'white',
    boxShadow: '0px 12px 12px rgba(0, 0, 0, 0.2)',
    position: 'absolute',
  },
});
