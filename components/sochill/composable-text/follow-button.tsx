import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { useAuth } from '@/contexts/auth-context';
import { ComposableText } from './composable-text';

type FollowButtonProps = {
  userId: string;
};

export function FollowButton({ userId }: FollowButtonProps) {
  const { user } = useAuth();
  const [following, setFollowing] = useState(false);

  if (user?.id === userId) return null;

  return (
    <Pressable
      onPress={() => setFollowing(prev => !prev)}
      style={[styles.button, following && styles.buttonActive]}
    >
      <ComposableText
        text={following ? 'Following' : 'Follow'}
        style={[styles.text, following && styles.textActive]}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderColor: '#2E8B77',
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 11,
    paddingVertical: 5,
  },
  buttonActive: {
    backgroundColor: '#2E8B77',
    borderColor: '#2E8B77',
  },
  text: {
    color: '#2E8B77',
    fontFamily: 'SplineSansMono_400Regular',
    fontSize: 11,
  },
  textActive: {
    color: '#FFFFFF',
  },
});
