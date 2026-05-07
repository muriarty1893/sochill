import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import type { FriendSparkEntry, FriendUser } from '@/data/mock';

const AVATAR_SIZE = 30;
const AVATAR_STEP = 20;
const SPRING = { damping: 20, stiffness: 220 };
const VISIBLE = 4;
const SWAP_INTERVAL = 3000;
const OFF_SCREEN = -AVATAR_SIZE - 8;

function initX(friendIndex: number): number {
  return friendIndex < VISIBLE ? friendIndex * AVATAR_STEP : OFF_SCREEN;
}

function AvatarDot({
  user,
  xVal,
}: {
  user: FriendUser;
  xVal: SharedValue<number>;
}) {
  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: xVal.value }],
  }));

  return (
    <Animated.View style={[styles.avatarWrap, style]}>
      <View style={[styles.avatarCircle, { backgroundColor: user.hasPfp ? user.color : '#BCC3C0' }]}>
        <MaterialIcons name="person" size={15} color="#FFFFFF" />
      </View>
    </Animated.View>
  );
}

export function FriendSparkCard({ entry }: { entry: FriendSparkEntry }) {
  const { friends, charityName, charityAccent, totalCount, time } = entry;

  const f = friends;

  const x0 = useSharedValue(f[0] ? initX(0) : OFF_SCREEN);
  const x1 = useSharedValue(f[1] ? initX(1) : OFF_SCREEN);
  const x2 = useSharedValue(f[2] ? initX(2) : OFF_SCREEN);
  const x3 = useSharedValue(f[3] ? initX(3) : OFF_SCREEN);
  const x4 = useSharedValue(f[4] ? initX(4) : OFF_SCREEN);
  const x5 = useSharedValue(f[5] ? initX(5) : OFF_SCREEN);

  const xMap = useRef([x0, x1, x2, x3, x4, x5]);

  const [visibleIds, setVisibleIds] = useState<string[]>(
    friends.slice(0, VISIBLE).map(frd => frd.id),
  );

  useEffect(() => {
    if (friends.length <= VISIBLE) return;
    const timer = setInterval(() => {
      setVisibleIds(prev => {
        const prevSet = new Set(prev);
        const hidden = friends.filter(frd => !prevSet.has(frd.id));
        if (hidden.length === 0) return prev;
        const swapOutIndex = Math.floor(Math.random() * prev.length);
        const swapIn = hidden[Math.floor(Math.random() * hidden.length)];
        return prev.map((id, i) => (i === swapOutIndex ? swapIn.id : id));
      });
    }, SWAP_INTERVAL);
    return () => clearInterval(timer);
  }, [friends]);

  useEffect(() => {
    friends.forEach((frd, i) => {
      if (i >= 6) return;
      const slot = visibleIds.indexOf(frd.id);
      xMap.current[i].value = withSpring(
        slot >= 0 ? slot * AVATAR_STEP : OFF_SCREEN,
        SPRING,
      );
    });
  }, [visibleIds, friends]);

  const extraCount = totalCount - VISIBLE;

  return (
    <View style={styles.card}>
      <View style={styles.avatarRow}>
        {friends.slice(0, 6).map((frd, i) => (
          <AvatarDot key={frd.id} user={frd} xVal={xMap.current[i]} />
        ))}
        {extraCount > 0 && (
          <View style={[styles.countBubble, { left: VISIBLE * AVATAR_STEP }]}>
            <Text style={styles.countText}>+{extraCount}</Text>
          </View>
        )}
      </View>
      <View style={styles.copy}>
        <Text style={styles.label}>
          <Text style={styles.bold}>{totalCount} friends</Text>
          {' sparked '}
          <Text style={[styles.charityName, { color: charityAccent }]}>{charityName}</Text>
        </Text>
        <Text style={styles.time}>{time}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#ECE4D9',
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
    padding: 13,
  },
  avatarRow: {
    height: AVATAR_SIZE,
    overflow: 'hidden',
    position: 'relative',
    width: VISIBLE * AVATAR_STEP + AVATAR_SIZE,
  },
  avatarWrap: {
    left: 0,
    position: 'absolute',
    top: 0,
  },
  avatarCircle: {
    alignItems: 'center',
    borderColor: '#FFFFFF',
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 2,
    height: AVATAR_SIZE,
    justifyContent: 'center',
    width: AVATAR_SIZE,
  },
  countBubble: {
    alignItems: 'center',
    backgroundColor: '#EDECEA',
    borderColor: '#FFFFFF',
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 2,
    height: AVATAR_SIZE,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: AVATAR_SIZE,
  },
  countText: {
    color: '#7C827D',
    fontSize: 9,
    fontWeight: '700',
  },
  copy: {
    flex: 1,
  },
  label: {
    color: '#303531',
    fontSize: 13,
    lineHeight: 18,
  },
  bold: {
    color: '#171A18',
    fontFamily: 'SofiaSansCondensed_800ExtraBold',
    fontSize: 14,
  },
  charityName: {
    fontFamily: 'SofiaSansCondensed_800ExtraBold',
    fontSize: 14,
  },
  time: {
    color: '#90968F',
    fontFamily: 'SplineSansMono_400Regular',
    fontSize: 11,
    marginTop: 3,
  },
});
