import { View, Text, TextInput, FlatList, Pressable, Dimensions, Platform } from 'react-native';
import { useState, useCallback, useEffect, useRef } from 'react';
import { TabView, TabBar } from 'react-native-tab-view';
import { BlurView } from 'expo-blur';
import { ActivityIndicator } from 'react-native-paper';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useGetMode } from '@/hooks/use-mode';
import { searchUsers, searchPosts } from '@/lib/api';
import AnimatedScreen from '@/components/global/AnimatedScreen';
import ProfileImage from '@/components/post/ProfileImage';
import PostBuilder from '@/components/post/PostBuilder';
import type { Post } from '@/redux/slices/posts';

const { width } = Dimensions.get('window');
const DEBOUNCE_MS = 400;

function UsersScene({ query }: { query: string }) {
  const isDark = useGetMode();
  const router = useRouter();
  const color = isDark ? 'white' : 'black';
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    setLoading(true);
    searchUsers(query)
      .then((data) => setResults(data ?? []))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <FlatList
      data={results}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ paddingTop: 20, paddingHorizontal: 16, gap: 12 }}
      ListEmptyComponent={
        loading ? (
          <ActivityIndicator color={color} style={{ marginTop: 40 }} />
        ) : (
          <Text style={{ color: 'grey', fontFamily: 'mulish', textAlign: 'center', marginTop: 40 }}>
            {query ? 'No users found' : 'Search for people'}
          </Text>
        )
      }
      renderItem={({ item }) => (
        <Pressable
          onPress={() => router.push({ pathname: '/(app)/user/[id]', params: { id: item.id } })}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}
        >
          <ProfileImage imageUri={item.avatar_url} size={48} />
          <View>
            <Text style={{ color, fontFamily: 'jakaraBold', fontSize: 15 }}>{item.display_name ?? item.username}</Text>
            <Text style={{ color: 'grey', fontFamily: 'jakara', fontSize: 12 }}>{item.handle}</Text>
          </View>
        </Pressable>
      )}
    />
  );
}

function PostsScene({ query }: { query: string }) {
  const isDark = useGetMode();
  const color = isDark ? 'white' : 'black';
  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    setLoading(true);
    searchPosts(query)
      .then((data) => setResults(data as Post[]))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <FlatList
      data={results}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={
        loading ? (
          <ActivityIndicator color={color} style={{ marginTop: 40 }} />
        ) : (
          <Text style={{ color: 'grey', fontFamily: 'mulish', textAlign: 'center', marginTop: 40 }}>
            {query ? 'No posts found' : 'Search for posts'}
          </Text>
        )
      }
      renderItem={({ item }) => <PostBuilder post={item} />}
    />
  );
}

export default function DiscoverScreen() {
  const isDark = useGetMode();
  const { width: screenWidth } = useWindowDimensions();
  const { top } = useSafeAreaInsets();
  const tint = isDark ? 'dark' : 'light';
  const color = isDark ? 'white' : 'black';
  const borderColor = isDark ? '#FFFFFF7D' : '#4545452D';
  const backgroundColor = isDark ? '#292828' : '#f1f1f1';

  const [inputValue, setInputValue] = useState('');
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'users', title: 'Users' },
    { key: 'posts', title: 'Posts' },
  ]);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = (text: string) => {
    setInputValue(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setQuery(text), DEBOUNCE_MS);
  };

  const renderScene = useCallback(({ route }: { route: { key: string } }) => {
    if (route.key === 'users') return <UsersScene query={query} />;
    if (route.key === 'posts') return <PostsScene query={query} />;
    return null;
  }, [query]);

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: color }}
      android_ripple={{ color: 'transparent' }}
      style={{ backgroundColor: 'transparent', elevation: 0, marginTop: Platform.select({ ios: top / 2 + 60, android: 80 }) }}
      labelStyle={{ color, fontFamily: 'mulishRegular', textTransform: 'none' }}
      inactiveColor="grey"
    />
  );

  return (
    <AnimatedScreen>
      <BlurView
        tint={tint}
        experimentalBlurMethod="dimezisBlurView"
        intensity={100}
        style={{
          position: 'absolute',
          height: Platform.select({ ios: 129 + top / 2, android: 129 }),
          width,
          borderBottomWidth: 0.5,
          borderColor,
          zIndex: 10,
        }}
      />
      <View style={{
        position: 'absolute',
        top: Platform.select({ ios: top + 14, android: 42 }),
        left: 16,
        right: 16,
        zIndex: 20,
        height: 44,
        backgroundColor,
        borderRadius: 22,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        gap: 8,
      }}>
        <TextInput
          value={inputValue}
          onChangeText={handleChange}
          onSubmitEditing={() => setQuery(inputValue)}
          placeholder="Search users or posts…"
          placeholderTextColor="grey"
          style={{ flex: 1, color, fontFamily: 'jakara', fontSize: 14 }}
          returnKeyType="search"
          autoCapitalize="none"
        />
      </View>

      <TabView
        style={{ paddingTop: Platform.select({ ios: top / 2, android: 0 }) }}
        renderTabBar={renderTabBar}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        lazy
        onIndexChange={setIndex}
        initialLayout={{ width: screenWidth }}
      />
    </AnimatedScreen>
  );
}
