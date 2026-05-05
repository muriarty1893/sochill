import { StyleSheet, Text, View } from 'react-native';

import { type FC, memo, type ReactNode } from 'react';

import { PressableScale } from 'pressto';
import Animated, {
  type SharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

import { FLOATING_BUTTON_SIZE } from './constants';

import type { StyleProp, ViewStyle } from 'react-native';

type ModalProps = {
  children?: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  isVisible: SharedValue<boolean>;
  title?: string;
  doneLabel?: string;
  onDone?: () => void;
};

export const ModalContent: FC<ModalProps> = memo(
  ({ children, isVisible, contentContainerStyle, title = 'New', doneLabel = 'Done', onDone }) => {
    const rAnimatedStyle = useAnimatedStyle(() => {
      return {
        opacity: withTiming(isVisible.value ? 1 : 0, {
          duration: 100,
        }),
      };
    }, [isVisible]);

    const rAnimatedProps = useAnimatedProps(() => {
      return {
        pointerEvents: isVisible.value ? 'auto' : 'none',
      } as never;
    }, [isVisible]);

    return (
      <Animated.View
        animatedProps={rAnimatedProps}
        style={[
          {
            ...StyleSheet.absoluteFillObject,
            alignItems: 'center',
          },
          rAnimatedStyle,
        ]}>
        <View style={styles.modalContainerTitle}>
          <Text style={styles.modalTitle}>{title}</Text>
        </View>

        <View style={[styles.content, contentContainerStyle]}>{children}</View>
        <View style={styles.buttonContainer}>
          <PressableScale style={styles.button} onPress={onDone}>
            <Text style={styles.buttonTitle}>{doneLabel}</Text>
          </PressableScale>
        </View>
      </Animated.View>
    );
  },
);

ModalContent.displayName = 'ModalContent';

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#111',
    borderRadius: 12,
    flex: 1,
    justifyContent: 'center',
    margin: 10,
  },
  buttonContainer: {
    height: 80,
    width: '100%',
  },
  buttonTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    width: '100%',
  },
  modalContainerTitle: {
    height: FLOATING_BUTTON_SIZE,
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
