import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { supabase } from '@/lib/supabase';
import { useAppDispatch } from '@/redux/hooks';
import { setUser } from '@/redux/slices/user';
import { openToast } from '@/redux/slices/toast';

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  scopes: ['profile', 'email'],
});

export function useGoogleSignIn() {
  const dispatch = useAppDispatch();

  const signInWithGoogle = async () => {
    await GoogleSignin.hasPlayServices();
    const { data } = await GoogleSignin.signIn();
    if (!data?.idToken) throw new Error('No ID token returned from Google');

    const { data: authData, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: data.idToken,
    });
    if (error) throw error;

    if (authData.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();
      if (profile) {
        dispatch(setUser({
          id: profile.id,
          email: authData.user.email,
          username: profile.username,
          handle: profile.handle,
          display_name: profile.display_name,
          bio: profile.bio,
          avatar_url: profile.avatar_url,
          verified: profile.verified,
        }));
      }
    }
    dispatch(openToast({ text: 'Signed in with Google', type: 'Success' }));
  };

  return { signInWithGoogle };
}
