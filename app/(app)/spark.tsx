import { View, Text, FlatList, Pressable } from 'react-native';
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { ActivityIndicator } from 'react-native-paper';
import { useGetMode } from '@/hooks/use-mode';
import { useAppDispatch } from '@/redux/hooks';
import { openToast } from '@/redux/slices/toast';
import { getCharityPosts, sparkCharityPost } from '@/lib/api';
import { SparkIcon, SparkIconUnfocused } from '@/components/icons';
import AnimatedScreen from '@/components/global/AnimatedScreen';

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function SparkButton({ postId, isSparked, count, accent, onToggle }: {
  postId: string;
  isSparked: boolean;
  count: number;
  accent: string;
  onToggle: (postId: string) => void;
}) {
  const isDark = useGetMode();
  const scale = useSharedValue(1);

  const rStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(scale.value, [0, 1], [0.7, 1], Extrapolation.CLAMP) }],
  }));

  const handlePress = () => {
    scale.value = 0;
    scale.value = withSpring(1, { damping: 6, stiffness: 280 });
    onToggle(postId);
  };

  return (
    <Pressable onPress={handlePress} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
      <Animated.View style={rStyle}>
        {isSparked
          ? <SparkIcon size={20} color={accent} />
          : <SparkIconUnfocused size={20} color={isDark ? '#aaa' : '#888'} />
        }
      </Animated.View>
      <Text style={{ fontFamily: 'mulishMedium', fontSize: 13, color: isSparked ? accent : (isDark ? '#aaa' : '#888') }}>
        {formatCount(count)}
      </Text>
    </Pressable>
  );
}

function CharityCard({ item, onToggle }: { item: any; onToggle: (id: string) => void }) {
  const isDark = useGetMode();
  const bg = isDark ? '#111' : '#fff';
  const color = isDark ? '#fff' : '#111';
  const accent: string = item.accent ?? '#555';
  const softAccent: string = item.soft_accent ?? '#eee';

  return (
    <View style={{
      backgroundColor: bg,
      borderRadius: 18,
      marginHorizontal: 16,
      marginBottom: 14,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: isDark ? '#222' : '#eee',
    }}>
      {/* Accent header band */}
      <View style={{ backgroundColor: softAccent, paddingHorizontal: 16, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Text style={{ fontSize: 22 }}>{item.emoji}</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: 'jakaraBold', fontSize: 13, color: accent }}>{item.charity_name}</Text>
          <View style={{ backgroundColor: accent, borderRadius: 99, paddingHorizontal: 8, paddingVertical: 2, alignSelf: 'flex-start', marginTop: 2 }}>
            <Text style={{ fontFamily: 'mulishMedium', fontSize: 10, color: '#fff' }}>{item.category}</Text>
          </View>
        </View>
      </View>

      {/* Body */}
      <View style={{ padding: 16 }}>
        <Text style={{ color, fontFamily: 'jakaraBold', fontSize: 15, marginBottom: 6 }}>{item.title}</Text>
        <Text style={{ color: isDark ? '#aaa' : '#555', fontFamily: 'mulish', fontSize: 13, lineHeight: 20 }}>{item.body}</Text>
      </View>

      {/* Footer */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 14 }}>
        <SparkButton
          postId={item.id}
          isSparked={item.is_sparked}
          count={item.supporters_count}
          accent={accent}
          onToggle={onToggle}
        />
      </View>
    </View>
  );
}

export default function SparkScreen() {
  const isDark = useGetMode();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const color = isDark ? 'white' : 'black';
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCharityPosts();
      setPosts(data);
    } catch {
      dispatch(openToast({ text: 'Could not load causes', type: 'Failed' }));
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const handleToggle = useCallback(async (postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, is_sparked: !p.is_sparked, supporters_count: p.supporters_count + (p.is_sparked ? -1 : 1) }
          : p
      )
    );
    try {
      await sparkCharityPost(postId);
    } catch {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, is_sparked: !p.is_sparked, supporters_count: p.supporters_count + (p.is_sparked ? -1 : 1) }
            : p
        )
      );
    }
  }, []);

  return (
    <AnimatedScreen>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: insets.top + 80, paddingBottom: 100 }}
        ListHeaderComponent={
          <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
            <Text style={{ color, fontFamily: 'uberBold', fontSize: 26 }}>Spark ⚡</Text>
            <Text style={{ color: isDark ? '#aaa' : '#666', fontFamily: 'mulish', fontSize: 13, marginTop: 4 }}>
              Support causes that matter — one spark at a time.
            </Text>
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <View style={{ alignItems: 'center', marginTop: 60 }}>
              <ActivityIndicator color={color} />
            </View>
          ) : (
            <View style={{ alignItems: 'center', marginTop: 60 }}>
              <Text style={{ color: 'grey', fontFamily: 'mulish' }}>No causes found</Text>
            </View>
          )
        }
        renderItem={({ item }) => <CharityCard item={item} onToggle={handleToggle} />}
      />
    </AnimatedScreen>
  );
}
