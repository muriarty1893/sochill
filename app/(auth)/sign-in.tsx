import {
  View,
  Text,
  ScrollView,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  Vibration,
  Pressable,
} from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import ReAnimated, { useAnimatedKeyboard, useAnimatedStyle } from 'react-native-reanimated';
import { Image } from 'expo-image';
import { supabase } from '@/lib/supabase';
import { useGetMode } from '@/hooks/use-mode';
import { useAppDispatch } from '@/redux/hooks';
import { openToast } from '@/redux/slices/toast';
import { setUser } from '@/redux/slices/user';
import Button from '@/components/global/Button';
import InputText from '@/components/auth/InputText';
import InputPassword from '@/components/auth/InputPassword';
import AnimatedScreen from '@/components/global/AnimatedScreen';
import { ForgotPasswordModal } from '@/components/auth/ForgotPasswordModal';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';

const { width } = Dimensions.get('window');

export default function SignInScreen() {
  const isDark = useGetMode();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const color = isDark ? 'white' : 'black';
  const buttonColor = !isDark ? 'white' : 'black';
  const borderColor = isDark ? 'white' : 'black';
  const [loading, setLoading] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const { control, handleSubmit, formState: { errors }, getValues } = useForm({
    defaultValues: { email: '', password: '' },
  });

  const animEmail = useRef(new Animated.Value(0));
  const animPass = useRef(new Animated.Value(0));
  const scrollViewRef = useRef<ScrollView | null>(null);

  const vibrateAnimation = (anim: React.MutableRefObject<Animated.Value>) => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim.current, { useNativeDriver: true, toValue: -2, duration: 50 }),
        Animated.timing(anim.current, { useNativeDriver: true, toValue: 2, duration: 50 }),
        Animated.timing(anim.current, { useNativeDriver: true, toValue: 0, duration: 50 }),
      ]),
      { iterations: 2 }
    ).start();
  };

  useEffect(() => {
    if (errors.email) vibrateAnimation(animEmail);
    if (errors.password) vibrateAnimation(animPass);
  }, [errors.email, errors.password]);

  const onSubmit = async ({ email, password }: { email: string; password: string }) => {
    setLoading(true);
    Keyboard.dismiss();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
      if (error) throw error;
      if (data.user) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
        if (profile) {
          dispatch(setUser({ id: profile.id, email: data.user.email, username: profile.username, handle: profile.handle, display_name: profile.display_name, bio: profile.bio, avatar_url: profile.avatar_url, verified: profile.verified }));
        }
        Vibration.vibrate(5);
        dispatch(openToast({ text: 'Successful Login', type: 'Success' }));
      }
    } catch (e: any) {
      Vibration.vibrate(5);
      dispatch(openToast({ text: e.message ?? 'Login failed', type: 'Failed' }));
    } finally {
      setLoading(false);
    }
  };

  const keyboard = useAnimatedKeyboard({ isStatusBarTranslucentAndroid: true });
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateY: -keyboard.height.value }],
    paddingTop: keyboard.height.value,
  }));

  return (
    <AnimatedScreen>
      <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <ReAnimated.View style={[{ flex: 1, marginTop: 40 }, animatedStyles]}>
          <ScrollView
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ alignItems: 'center', paddingHorizontal: 25, paddingBottom: 50 }}
          >
            <View style={{ alignItems: 'center' }}>
              <Image
                source={require('../../assets/images/splash-icon.png')}
                contentFit="contain"
                style={{ height: 200, width }}
              />
              <Text style={{ color, fontFamily: 'mulishBold', fontSize: 24 }}>Welcome Back</Text>
              <Text style={{ color, fontFamily: 'mulish', fontSize: 14 }}>
                sign in to access your account
              </Text>

              <View style={{ gap: 30, marginTop: 70, alignSelf: 'stretch' }}>
                <Animated.View style={{ transform: [{ translateX: animEmail.current }] }}>
                  <Controller
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <InputText
                        style={{ borderColor: errors.email ? 'red' : '', borderWidth: errors.email ? 1 : 0 }}
                        props={{ value, onBlur, onChangeText: onChange, placeholder: 'Email address', keyboardType: 'email-address' }}
                      />
                    )}
                    name="email"
                  />
                </Animated.View>

                <Animated.View style={{ transform: [{ translateX: animPass.current }] }}>
                  <Controller
                    control={control}
                    rules={{ required: true, minLength: 6 }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <InputPassword
                        style={{ borderColor: errors.password ? 'red' : '', borderWidth: errors.password ? 1 : 0 }}
                        props={{ value, onChangeText: onChange, onBlur }}
                      />
                    )}
                    name="password"
                  />
                </Animated.View>

                <Pressable onPress={() => setShowResetModal(true)} style={{ alignSelf: 'flex-end', marginTop: 8 }}>
                  <Text style={{ color: isDark ? '#aaa' : '#555', fontFamily: 'jakara', fontSize: 13 }}>
                    Forgot password?
                  </Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>

          <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', paddingBottom: 40, paddingHorizontal: 25 }}>
            <Button loading={loading} onPress={() => { Keyboard.dismiss(); handleSubmit(onSubmit)(); }}>
              <Text style={{ fontFamily: 'jakaraBold', fontSize: 15, color: buttonColor }}>Login</Text>
            </Button>
            <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', gap: 10, marginTop: 16 }}>
              <View style={{ flex: 1, height: 1, backgroundColor: isDark ? '#333' : '#ddd' }} />
              <Text style={{ color: isDark ? '#666' : '#aaa', fontFamily: 'jakara', fontSize: 13 }}>or</Text>
              <View style={{ flex: 1, height: 1, backgroundColor: isDark ? '#333' : '#ddd' }} />
            </View>
            <GoogleSignInButton />
            <View style={{ flexDirection: 'row', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>
              <Pressable
                style={{
                  width: '100%', marginTop: 20, height: '100%', flexDirection: 'row', gap: 4,
                  borderStyle: 'dashed', justifyContent: 'center', borderWidth: 1, borderColor,
                  borderRadius: 10, alignItems: 'center',
                }}
                onPress={() => router.push('/(auth)/register')}
              >
                <Text style={{ color, includeFontPadding: false }}>Don't have an account?</Text>
                <Text style={{ color, fontFamily: 'jakaraBold', includeFontPadding: false }}>Register</Text>
              </Pressable>
            </View>
          </View>
        </ReAnimated.View>
      </TouchableWithoutFeedback>
      <ForgotPasswordModal
        visible={showResetModal}
        initialEmail={getValues('email')}
        onClose={() => setShowResetModal(false)}
      />
    </AnimatedScreen>
  );
}
