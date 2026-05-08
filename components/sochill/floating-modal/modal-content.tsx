import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { type FC, memo, type ReactNode } from 'react';
import Animated, { type SharedValue, useAnimatedProps, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { FLOATING_BUTTON_SIZE } from './constants';
import type { StyleProp, ViewStyle } from 'react-native';

type ModalProps = {
  children?: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  isVisible: SharedValue<boolean>;
  isDark?: boolean;
  title?: string;
  doneLabel?: string;
  loading?: boolean;
  onDone?: () => void;
};

export const ModalContent: FC<ModalProps> = memo(
  ({ children, isVisible, contentContainerStyle, isDark, title = 'New Post', doneLabel = 'Post', loading, onDone }) => {
    const color = isDark ? 'white' : 'black';
    const btnBg = isDark ? 'white' : '#111';
    const btnText = isDark ? '#111' : 'white';

    const rAnimatedStyle = useAnimatedStyle(() => ({
      opacity: withTiming(isVisible.value ? 1 : 0, { duration: 100 }),
    }), [isVisible]);

    const rAnimatedProps = useAnimatedProps(() => ({
      pointerEvents: isVisible.value ? 'auto' : 'none',
    } as never), [isVisible]);

    return (
      <Animated.View animatedProps={rAnimatedProps} style={[StyleSheet.absoluteFillObject, { alignItems: 'center' }, rAnimatedStyle]}>
        <View style={[styles.titleContainer]}>
          <Text style={[styles.title, { color }]}>{title}</Text>
        </View>

        <View style={[styles.content, contentContainerStyle]}>{children}</View>

        <View style={styles.buttonContainer}>
          <Pressable
            onPress={onDone}
            disabled={loading}
            style={[styles.button, { backgroundColor: btnBg, opacity: loading ? 0.6 : 1 }]}
          >
            {loading
              ? <ActivityIndicator color={btnText} />
              : <Text style={[styles.buttonTitle, { color: btnText }]}>{doneLabel}</Text>
            }
          </Pressable>
        </View>
      </Animated.View>
    );
  },
);

ModalContent.displayName = 'ModalContent';

const styles = StyleSheet.create({
  titleContainer: {
    height: FLOATING_BUTTON_SIZE,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: 'jakaraBold',
  },
  content: {
    flex: 1,
    width: '100%',
  },
  buttonContainer: {
    height: 72,
    width: '100%',
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  buttonTitle: {
    fontSize: 18,
    fontFamily: 'jakaraBold',
  },
});
