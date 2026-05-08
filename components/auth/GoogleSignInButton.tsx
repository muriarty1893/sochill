import { Pressable, Text, View, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useGoogleSignIn } from '@/hooks/use-google-signin';
import { useGetMode } from '@/hooks/use-mode';
import { useAppDispatch } from '@/redux/hooks';
import { openToast } from '@/redux/slices/toast';

export default function GoogleSignInButton({ label = 'Continue with Google' }: { label?: string }) {
  const isDark = useGetMode();
  const dispatch = useAppDispatch();
  const { signInWithGoogle } = useGoogleSignIn();
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (e: any) {
      if (e.code !== 'SIGN_IN_CANCELLED') {
        dispatch(openToast({ text: e.message ?? 'Google sign-in failed', type: 'Failed' }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={loading}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        width: '100%',
        height: 50,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: isDark ? '#333' : '#ddd',
        backgroundColor: isDark ? '#1a1a1a' : '#fff',
        marginTop: 12,
      }}
    >
      {loading ? (
        <ActivityIndicator size={18} color={isDark ? 'white' : 'black'} />
      ) : (
        <>
          {/* Google "G" logo */}
          <View style={{ width: 20, height: 20, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 16, fontFamily: 'jakaraBold', color: '#4285F4' }}>G</Text>
          </View>
          <Text style={{ color: isDark ? 'white' : 'black', fontFamily: 'jakaraBold', fontSize: 15 }}>
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
}
