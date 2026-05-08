import { StyleSheet, Text, useWindowDimensions } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { closeToast } from '@/redux/slices/toast';
import { useGetMode } from '@/hooks/use-mode';
import { ForbiddenIcon, InfoIcon, VerifyIcon } from '../icons';

type ToastVariant = 'Success' | 'Failed' | 'Info' | 'Message';

type ToastItem = {
  key: string;
  id: number;
  text: string;
  type: ToastVariant;
  imageUri?: string;
};

const TOAST_OFFSET = 12;
const TOAST_HEIGHT = 68;
const BASE_BOTTOM = 40;
const AUTO_DISMISS_MS = 3000;

function ToastPill({
  toast,
  index,
  onDismiss,
  isDark,
}: {
  toast: ToastItem;
  index: number;
  onDismiss: (key: string) => void;
  isDark: boolean;
}) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isActive = index === 0;

  const targetBottom = BASE_BOTTOM + insets.bottom + index * TOAST_OFFSET;
  const bottom = useSharedValue(isActive ? -(TOAST_HEIGHT + TOAST_OFFSET + 20 + insets.bottom) : targetBottom);
  const translateX = useSharedValue(0);
  const isSwiping = useSharedValue(false);

  useEffect(() => {
    bottom.value = withSpring(targetBottom, { damping: 20, stiffness: 200 });
  }, [targetBottom]);

  const dismiss = useCallback(() => {
    translateX.value = withTiming(-(width * 1.1), { duration: 280 }, (done) => {
      'worklet';
      if (done) runOnJS(onDismiss)(toast.key);
    });
  }, [onDismiss, toast.key, translateX, width]);

  useEffect(() => {
    if (!isActive) return;
    const t = setTimeout(dismiss, AUTO_DISMISS_MS);
    return () => clearTimeout(t);
  }, [dismiss, isActive]);

  const gesture = Gesture.Pan()
    .enabled(isActive)
    .onBegin(() => { isSwiping.value = true; })
    .onUpdate((e) => {
      if (e.translationX > 0) return;
      translateX.value = e.translationX;
    })
    .onEnd((e) => {
      if (e.translationX < -60) runOnJS(dismiss)();
      else translateX.value = withSpring(0);
    })
    .onFinalize(() => { isSwiping.value = false; });

  const rStyle = useAnimatedStyle(() => ({
    bottom: bottom.value,
    zIndex: 1000 - index,
    transform: [
      { scale: withTiming(1 - index * 0.04, { duration: 200 }) },
      { translateX: translateX.value },
    ],
  }));

  const rContentStyle = useAnimatedStyle(() => ({
    opacity: withTiming(index <= 1 ? 1 : 0, { duration: 200 }),
  }));

  const bgColor = isDark ? '#1C1F1D' : '#FFFFFF';
  const textColor = isDark ? '#FFFCF6' : '#171A18';

  const icon = (() => {
    if (toast.type === 'Failed') return <ForbiddenIcon size={20} color={isDark ? '#FF6B6B' : '#CC0000'} />;
    if (toast.type === 'Success') return <VerifyIcon size={20} color="#4CAF50" />;
    if (toast.type === 'Info') return <InfoIcon size={20} color={textColor} />;
    if (toast.type === 'Message' && toast.imageUri)
      return <Image style={{ height: 20, width: 20, borderRadius: 999 }} source={{ uri: toast.imageUri }} />;
    return null;
  })();

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          styles.pill,
          {
            width: width * 0.9,
            left: width * 0.05,
            backgroundColor: bgColor,
            shadowOpacity: isDark ? 0.5 : 0.15,
          },
          rStyle,
        ]}
      >
        <Animated.View style={[styles.row, rContentStyle]}>
          {icon}
          <Text
            style={[styles.text, { color: textColor, marginLeft: icon ? 12 : 0 }]}
            numberOfLines={1}
          >
            {toast.text}
          </Text>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}

export default function CustomToast() {
  const isDark = useGetMode();
  const dispatch = useAppDispatch();
  const toastState = useAppSelector((state) => state.toast);
  const [queue, setQueue] = useState<ToastItem[]>([]);

  useEffect(() => {
    if (!toastState.open) return;
    const key = `toast-${Date.now()}-${Math.random()}`;
    setQueue((prev) => {
      if (prev.length >= 5) return prev;
      return [
        { key, id: 0, text: toastState.text, type: toastState.type, imageUri: toastState.imageUri },
        ...prev.map((t) => ({ ...t, id: t.id + 1 })),
      ];
    });
    dispatch(closeToast());
  }, [toastState.open, toastState.text, toastState.type, toastState.imageUri, dispatch]);

  const onDismiss = useCallback((key: string) => {
    setQueue((prev) => prev.filter((t) => t.key !== key));
  }, []);

  if (queue.length === 0) return null;

  return (
    <>
      {queue.map((toast, index) => (
        <ToastPill
          key={toast.key}
          toast={toast}
          index={index}
          onDismiss={onDismiss}
          isDark={isDark}
        />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  pill: {
    borderRadius: 20,
    elevation: 8,
    height: TOAST_HEIGHT,
    paddingHorizontal: 20,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
  },
  row: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  text: {
    flex: 1,
    fontFamily: 'mulishMedium',
    fontSize: 15,
  },
});
