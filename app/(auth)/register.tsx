import * as React from 'react';
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
import ReAnimated, { FadeIn, FadeOut, useAnimatedKeyboard, useAnimatedStyle } from 'react-native-reanimated';
import { supabase } from '@/lib/supabase';
import { useGetMode } from '@/hooks/use-mode';
import { useAppDispatch } from '@/redux/hooks';
import { openToast } from '@/redux/slices/toast';
import Button from '@/components/global/Button';
import InputText from '@/components/auth/InputText';
import InputPassword from '@/components/auth/InputPassword';
import AnimatedScreen from '@/components/global/AnimatedScreen';

const { width } = Dimensions.get('window');

export default function RegisterScreen() {
  const isDark = useGetMode();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const color = isDark ? 'white' : 'black';
  const buttonColor = !isDark ? 'white' : 'black';
  const borderColor = isDark ? 'white' : 'black';
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: { email: '', name: '', username: '', password: '', verifyPassword: '' },
  });

  const verifyPassword = watch('password', '');
  const scrollViewRef = useRef<ScrollView | null>(null);

  const animEmail = useRef(new Animated.Value(0));
  const animName = useRef(new Animated.Value(0));
  const animUser = useRef(new Animated.Value(0));
  const animPass = useRef(new Animated.Value(0));
  const animVPass = useRef(new Animated.Value(0));

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
    if (errors.name) vibrateAnimation(animName);
    if (errors.username) vibrateAnimation(animUser);
    if (errors.password) vibrateAnimation(animPass);
    if (errors.verifyPassword) vibrateAnimation(animVPass);
  }, [errors.email, errors.name, errors.username, errors.password, errors.verifyPassword]);

  const onSubmit = async (data: { email: string; name: string; username: string; password: string; verifyPassword: string }) => {
    setLoading(true);
    Keyboard.dismiss();
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email.trim().toLowerCase(),
        password: data.password,
        options: { data: { username: data.username.trim(), display_name: data.name.trim() } },
      });
      if (error) throw error;
      Vibration.vibrate(5);
      dispatch(openToast({ type: 'Success', text: 'Successfully Created' }));
      router.replace('/(auth)/sign-in');
    } catch (e: any) {
      Vibration.vibrate(5);
      dispatch(openToast({ type: 'Failed', text: e.message ?? 'Registration failed' }));
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
            <View style={{ alignItems: 'center', marginTop: 50 }}>
              <Text style={{ color, fontFamily: 'mulishBold', fontSize: 24 }}>Sign up</Text>
              <Text style={{ color, fontFamily: 'mulish', fontSize: 14 }}>
                register to gain access to a whole new world
              </Text>

              <View style={{ marginTop: 70, width: '100%' }}>
                {/* Email */}
                <Animated.View style={{ transform: [{ translateX: animEmail.current }], marginBottom: 10 }}>
                  <ReAnimated.View entering={FadeIn.springify()} style={{ marginVertical: 5 }} exiting={FadeOut.springify()}>
                    <Text style={{ color: 'grey' }}>Enter Email</Text>
                  </ReAnimated.View>
                  <Controller
                    control={control}
                    rules={{ required: 'Email is required', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email' } }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <InputText
                        style={{ borderColor: errors.email ? 'red' : '', borderWidth: errors.email ? 1 : 0 }}
                        props={{ value, onBlur, onChangeText: onChange, placeholder: 'Enter Email', keyboardType: 'email-address' }}
                      />
                    )}
                    name="email"
                  />
                </Animated.View>

                {/* Name */}
                <Animated.View style={{ transform: [{ translateX: animName.current }], marginBottom: 10 }}>
                  <ReAnimated.View entering={FadeIn.springify()} style={{ marginVertical: 5 }} exiting={FadeOut.springify()}>
                    <Text style={{ color: 'grey' }}>Enter Your name</Text>
                  </ReAnimated.View>
                  <Controller
                    control={control}
                    rules={{ required: 'Name is required' }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <InputText
                        style={{ borderColor: errors.name ? 'red' : '', borderWidth: errors.name ? 1 : 0 }}
                        props={{ value, onBlur, onChangeText: onChange, placeholder: 'Enter Your Name' }}
                      />
                    )}
                    name="name"
                  />
                </Animated.View>

                {/* Username */}
                <Animated.View style={{ transform: [{ translateX: animUser.current }], marginBottom: 10 }}>
                  <ReAnimated.View entering={FadeIn.springify()} style={{ marginVertical: 5 }} exiting={FadeOut.springify()}>
                    <Text style={{ color: errors.username ? 'red' : 'grey' }}>Enter Username</Text>
                  </ReAnimated.View>
                  <Controller
                    control={control}
                    rules={{ required: true, minLength: 1, pattern: /^\S*$/ }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <InputText
                        style={{ borderColor: errors.username ? 'red' : '', borderWidth: errors.username ? 1 : 0 }}
                        props={{ value, onBlur, onChangeText: onChange, placeholder: 'Enter Username' }}
                      />
                    )}
                    name="username"
                  />
                </Animated.View>

                {/* Password */}
                <Animated.View style={{ transform: [{ translateX: animPass.current }], marginBottom: 10 }}>
                  <ReAnimated.View entering={FadeIn.springify()} style={{ marginVertical: 5 }} exiting={FadeOut.springify()}>
                    <Text style={{ color: 'grey' }}>Strong password</Text>
                  </ReAnimated.View>
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

                {/* Verify Password */}
                <Animated.View style={{ transform: [{ translateX: animVPass.current }] }}>
                  <ReAnimated.View entering={FadeIn.springify()} style={{ marginVertical: 5 }} exiting={FadeOut.springify()}>
                    <Text style={{ color: errors.verifyPassword ? 'red' : 'grey' }}>
                      {errors.verifyPassword?.message || 'Passwords should match'}
                    </Text>
                  </ReAnimated.View>
                  <Controller
                    control={control}
                    rules={{ validate: (value) => value === verifyPassword || 'Passwords do not match' }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <InputPassword
                        style={{ borderColor: errors.verifyPassword ? 'red' : '', borderWidth: errors.verifyPassword ? 1 : 0 }}
                        props={{ value, onChangeText: onChange, onBlur, placeholder: 'Verify Password' }}
                      />
                    )}
                    name="verifyPassword"
                  />
                </Animated.View>
              </View>
            </View>

            <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', paddingTop: 40 }}>
              <Button loading={loading} onPress={() => { Keyboard.dismiss(); handleSubmit(onSubmit)(); }}>
                <Text style={{ fontFamily: 'jakaraBold', fontSize: 15, color: buttonColor }}>Register</Text>
              </Button>
              <View style={{ flexDirection: 'row', width: '100%', height: 50, justifyContent: 'center', alignItems: 'center' }}>
                <Pressable
                  style={{
                    width: '100%', marginTop: 20, height: '100%', flexDirection: 'row', gap: 4,
                    borderStyle: 'dashed', justifyContent: 'center', borderWidth: 1, borderColor,
                    borderRadius: 10, alignItems: 'center',
                  }}
                  onPress={() => router.replace('/(auth)/sign-in')}
                >
                  <Text style={{ color, includeFontPadding: false }}>Have an account?</Text>
                  <Text style={{ color, fontFamily: 'jakaraBold', includeFontPadding: false }}>Login</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </ReAnimated.View>
      </TouchableWithoutFeedback>
    </AnimatedScreen>
  );
}
