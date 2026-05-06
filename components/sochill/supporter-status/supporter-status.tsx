import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const AVATAR_SIZE = 34;
const AVATAR_STEP = 22;
const H_PAD = 12;
const V_PAD = 10;
const GROUP_GAP = 20;
const SPRING = { damping: 20, stiffness: 220 };

type SupporterUser = { id: string; initials: string; color: string };

const USERS: SupporterUser[] = [
  { id: 'u1', initials: 'MI', color: '#2E8B77' },
  { id: 'u2', initials: 'CA', color: '#3B82B8' },
  { id: 'u3', initials: 'LA', color: '#C86B4A' },
  { id: 'u4', initials: 'AY', color: '#8B5E2E' },
  { id: 'u5', initials: 'BE', color: '#6B4CA8' },
];

const INITIAL_ACTIVE = new Set(['u1', 'u2', 'u3']);

function pillWidth(n: number): number {
  if (n === 0) return H_PAD * 2;
  return H_PAD * 2 + (n - 1) * AVATAR_STEP + AVATAR_SIZE;
}

function computeLayout(activeIds: Set<string>) {
  const active = USERS.filter(u => activeIds.has(u.id));
  const recent = USERS.filter(u => !activeIds.has(u.id));
  const activePW = pillWidth(active.length);
  const recentX = activePW + GROUP_GAP;
  const positions: Record<string, number> = {};
  active.forEach((u, i) => { positions[u.id] = H_PAD + i * AVATAR_STEP; });
  recent.forEach((u, i) => { positions[u.id] = recentX + H_PAD + i * AVATAR_STEP; });
  return { activePW, recentX, recentPW: pillWidth(recent.length), positions };
}

const INIT = computeLayout(INITIAL_ACTIVE);

function AvatarDot({ user, xVal, isActive }: {
  user: SupporterUser;
  xVal: SharedValue<number>;
  isActive: boolean;
}) {
  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: xVal.value }],
  }));
  return (
    <Animated.View
      style={[
        styles.avatar,
        style,
        { backgroundColor: isActive ? user.color : '#C8CCC9' },
      ]}
    >
      <Text style={[styles.avatarText, { color: isActive ? '#FFFFFF' : '#6E7470' }]}>
        {user.initials}
      </Text>
    </Animated.View>
  );
}

export function SupporterStatus() {
  const [activeIds, setActiveIds] = useState(INITIAL_ACTIVE);

  const xU1 = useSharedValue(INIT.positions.u1);
  const xU2 = useSharedValue(INIT.positions.u2);
  const xU3 = useSharedValue(INIT.positions.u3);
  const xU4 = useSharedValue(INIT.positions.u4);
  const xU5 = useSharedValue(INIT.positions.u5);
  const xMapRef = useRef({ u1: xU1, u2: xU2, u3: xU3, u4: xU4, u5: xU5 });

  const activePillW = useSharedValue(INIT.activePW);
  const recentPillX = useSharedValue(INIT.recentX);
  const recentPillW = useSharedValue(INIT.recentPW);

  useEffect(() => {
    const layout = computeLayout(activeIds);
    activePillW.value = withSpring(layout.activePW, SPRING);
    recentPillX.value = withSpring(layout.recentX, SPRING);
    recentPillW.value = withSpring(layout.recentPW, SPRING);
    USERS.forEach(u => {
      xMapRef.current[u.id as keyof typeof xMapRef.current].value = withSpring(
        layout.positions[u.id],
        SPRING,
      );
    });
  }, [activeIds]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIds(prev => {
        const next = new Set(prev);
        const pick = USERS[Math.floor(Math.random() * USERS.length)];
        if (next.has(pick.id)) next.delete(pick.id);
        else next.add(pick.id);
        return next;
      });
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const activePillStyle = useAnimatedStyle(() => ({ width: activePillW.value }));
  const recentPillStyle = useAnimatedStyle(() => ({
    width: recentPillW.value,
    transform: [{ translateX: recentPillX.value }],
  }));
  const activeLabelStyle = useAnimatedStyle(() => ({ width: activePillW.value }));
  const recentLabelStyle = useAnimatedStyle(() => ({ width: recentPillW.value }));

  const activeCount = USERS.filter(u => activeIds.has(u.id)).length;
  const recentCount = USERS.length - activeCount;

  return (
    <View style={styles.container}>
      <Text style={styles.bandTitle}>Active supporters</Text>
      <View style={styles.groupsRow}>
        <Animated.View style={[styles.activePill, activePillStyle]} />
        <Animated.View style={[styles.recentPill, recentPillStyle]} />
        {USERS.map(u => (
          <AvatarDot
            key={u.id}
            user={u}
            xVal={xMapRef.current[u.id as keyof typeof xMapRef.current]}
            isActive={activeIds.has(u.id)}
          />
        ))}
      </View>
      {(activeCount > 0 || recentCount > 0) && (
        <View style={styles.labelsRow}>
          {activeCount > 0 && (
            <Animated.View style={activeLabelStyle}>
              <Text style={styles.groupLabel}>Active now</Text>
            </Animated.View>
          )}
          {activeCount > 0 && recentCount > 0 && <View style={{ width: GROUP_GAP }} />}
          {recentCount > 0 && (
            <Animated.View style={recentLabelStyle}>
              <Text style={styles.groupLabel}>Earlier</Text>
            </Animated.View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8E5DD',
    borderRadius: 8,
    marginBottom: 16,
    padding: 14,
  },
  bandTitle: {
    color: '#31241F',
    fontFamily: 'SofiaSansCondensed_800ExtraBold',
    fontSize: 18,
    marginBottom: 10,
  },
  groupsRow: {
    height: AVATAR_SIZE + V_PAD * 2,
    position: 'relative',
  },
  activePill: {
    backgroundColor: '#DDF2EB',
    borderRadius: (AVATAR_SIZE + V_PAD * 2) / 2,
    height: AVATAR_SIZE + V_PAD * 2,
    left: 0,
    position: 'absolute',
    top: 0,
  },
  recentPill: {
    backgroundColor: '#EDECEA',
    borderRadius: (AVATAR_SIZE + V_PAD * 2) / 2,
    height: AVATAR_SIZE + V_PAD * 2,
    left: 0,
    position: 'absolute',
    top: 0,
  },
  avatar: {
    alignItems: 'center',
    borderColor: '#F8E5DD',
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 2,
    height: AVATAR_SIZE,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    top: V_PAD,
    width: AVATAR_SIZE,
  },
  avatarText: {
    fontSize: 11,
    fontWeight: '800',
  },
  labelsRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  groupLabel: {
    color: '#7C827D',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
});
