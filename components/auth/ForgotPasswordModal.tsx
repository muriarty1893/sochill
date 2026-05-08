import { View, Text, TextInput, Pressable, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator } from 'react-native-paper';
import { supabase } from '@/lib/supabase';
import { useGetMode } from '@/hooks/use-mode';
import { useAppDispatch } from '@/redux/hooks';
import { openToast } from '@/redux/slices/toast';
import { setUser } from '@/redux/slices/user';

type Step = 'email' | 'code' | 'password';

function OtpBox({
  index,
  value,
  refs,
  onChangeAt,
  color,
  bg,
  border,
}: {
  index: number;
  value: string;
  refs: React.MutableRefObject<(TextInput | null)[]>;
  onChangeAt: (i: number, text: string) => void;
  color: string;
  bg: string;
  border: string;
}) {
  return (
    <TextInput
      ref={el => { refs.current[index] = el; }}
      value={value}
      onChangeText={text => onChangeAt(index, text)}
      onKeyPress={({ nativeEvent }) => {
        if (nativeEvent.key === 'Backspace' && !value && index > 0) {
          refs.current[index - 1]?.focus();
        }
      }}
      keyboardType="number-pad"
      maxLength={1}
      selectTextOnFocus
      style={{
        width: 44, height: 52, borderRadius: 10,
        backgroundColor: bg, borderWidth: 1.5, borderColor: border,
        textAlign: 'center', fontSize: 22, fontFamily: 'jakaraBold', color,
      }}
    />
  );
}

export function ForgotPasswordModal({
  visible,
  initialEmail,
  onClose,
}: {
  visible: boolean;
  initialEmail: string;
  onClose: () => void;
}) {
  const isDark = useGetMode();
  const dispatch = useAppDispatch();

  const color = isDark ? 'white' : 'black';
  const bg = isDark ? '#111' : 'white';
  const cardBg = isDark ? '#1a1a1a' : '#f9f9f9';
  const inputBg = isDark ? '#252525' : '#f0f0f0';
  const border = isDark ? '#333' : '#ddd';
  const activeBorder = '#1d9bf0';

  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const codeRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (visible) {
      setStep('email');
      setEmail(initialEmail);
      setDigits(['', '', '', '', '', '']);
      setNewPassword('');
      setConfirmPassword('');
    }
  }, [visible, initialEmail]);

  const handleDigitChange = (i: number, text: string) => {
    const next = [...digits];
    next[i] = text.slice(-1);
    setDigits(next);
    if (text && i < 5) codeRefs.current[i + 1]?.focus();
  };

  const code = digits.join('');

  const handleSendCode = async () => {
    if (!email.trim()) {
      dispatch(openToast({ text: 'Enter your email', type: 'Info' }));
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: { shouldCreateUser: false },
      });
      if (error) throw error;
      setStep('code');
      dispatch(openToast({ text: '6-digit code sent — check your email', type: 'Success' }));
      setTimeout(() => codeRefs.current[0]?.focus(), 400);
    } catch (e: any) {
      dispatch(openToast({ text: e.message ?? 'Failed to send code', type: 'Failed' }));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (code.length !== 6) {
      dispatch(openToast({ text: 'Enter all 6 digits', type: 'Info' }));
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: code,
        type: 'email',
      });
      if (error) throw error;
      setStep('password');
    } catch (e: any) {
      dispatch(openToast({ text: e.message ?? 'Wrong code — try again', type: 'Failed' }));
      setDigits(['', '', '', '', '', '']);
      setTimeout(() => codeRefs.current[0]?.focus(), 100);
    } finally {
      setLoading(false);
    }
  };

  const handleSetPassword = async () => {
    if (newPassword.length < 6) {
      dispatch(openToast({ text: 'Password must be at least 6 characters', type: 'Info' }));
      return;
    }
    if (newPassword !== confirmPassword) {
      dispatch(openToast({ text: "Passwords don't match", type: 'Info' }));
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles').select('*').eq('id', user.id).single();
        if (profile) {
          dispatch(setUser({
            id: profile.id, email: user.email, username: profile.username,
            handle: profile.handle, display_name: profile.display_name,
            bio: profile.bio, avatar_url: profile.avatar_url, verified: profile.verified,
          }));
        }
      }
      dispatch(openToast({ text: 'Password updated! Signed in.', type: 'Success' }));
      onClose();
    } catch (e: any) {
      dispatch(openToast({ text: e.message ?? 'Failed to update password', type: 'Failed' }));
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    backgroundColor: inputBg, borderRadius: 10, padding: 14,
    color, fontFamily: 'jakara' as const, fontSize: 15,
    borderWidth: 1, borderColor: border,
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Pressable
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' }}
          onPress={onClose}
        >
          <Pressable
            onPress={() => {}}
            style={{ backgroundColor: bg, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 }}
          >
            {/* Step indicator */}
            <View style={{ flexDirection: 'row', gap: 6, justifyContent: 'center', marginBottom: 24 }}>
              {(['email', 'code', 'password'] as Step[]).map((s, i) => (
                <View
                  key={s}
                  style={{
                    height: 4, borderRadius: 2, flex: 1,
                    backgroundColor: step === s ? '#1d9bf0'
                      : (['email', 'code', 'password'].indexOf(step) > i ? '#1d9bf0' : border),
                  }}
                />
              ))}
            </View>

            {step === 'email' && (
              <>
                <Text style={{ color, fontFamily: 'jakaraBold', fontSize: 20, marginBottom: 6 }}>
                  Reset password
                </Text>
                <Text style={{ color: 'grey', fontFamily: 'jakara', fontSize: 14, marginBottom: 20 }}>
                  We'll send a 6-digit code to your email.
                </Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email address"
                  placeholderTextColor="grey"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={inputStyle}
                />
                <Pressable
                  onPress={handleSendCode}
                  disabled={loading}
                  style={{ marginTop: 16, backgroundColor: '#1d9bf0', borderRadius: 12, padding: 14, alignItems: 'center' }}
                >
                  {loading
                    ? <ActivityIndicator size={18} color="white" />
                    : <Text style={{ color: 'white', fontFamily: 'jakaraBold', fontSize: 15 }}>Send code</Text>
                  }
                </Pressable>
              </>
            )}

            {step === 'code' && (
              <>
                <Text style={{ color, fontFamily: 'jakaraBold', fontSize: 20, marginBottom: 6 }}>
                  Enter code
                </Text>
                <Text style={{ color: 'grey', fontFamily: 'jakara', fontSize: 14, marginBottom: 24 }}>
                  Check <Text style={{ color }}>{email}</Text>
                </Text>
                <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center', marginBottom: 8 }}>
                  {digits.map((d, i) => (
                    <OtpBox
                      key={i}
                      index={i}
                      value={d}
                      refs={codeRefs}
                      onChangeAt={handleDigitChange}
                      color={color}
                      bg={inputBg}
                      border={d ? activeBorder : border}
                    />
                  ))}
                </View>
                <Pressable onPress={() => { setStep('email'); setDigits(['','','','','','']); }} style={{ alignSelf: 'center', paddingVertical: 8 }}>
                  <Text style={{ color: 'grey', fontFamily: 'jakara', fontSize: 13 }}>Didn't get it? Go back</Text>
                </Pressable>
                <Pressable
                  onPress={handleVerifyCode}
                  disabled={loading || code.length !== 6}
                  style={{ marginTop: 8, backgroundColor: code.length === 6 ? '#1d9bf0' : (isDark ? '#222' : '#ddd'), borderRadius: 12, padding: 14, alignItems: 'center' }}
                >
                  {loading
                    ? <ActivityIndicator size={18} color="white" />
                    : <Text style={{ color: code.length === 6 ? 'white' : 'grey', fontFamily: 'jakaraBold', fontSize: 15 }}>Verify</Text>
                  }
                </Pressable>
              </>
            )}

            {step === 'password' && (
              <>
                <Text style={{ color, fontFamily: 'jakaraBold', fontSize: 20, marginBottom: 6 }}>
                  New password
                </Text>
                <Text style={{ color: 'grey', fontFamily: 'jakara', fontSize: 14, marginBottom: 20 }}>
                  Choose a strong password (min. 6 characters).
                </Text>
                <TextInput
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="New password"
                  placeholderTextColor="grey"
                  secureTextEntry
                  style={inputStyle}
                />
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm password"
                  placeholderTextColor="grey"
                  secureTextEntry
                  style={[inputStyle, { marginTop: 12 }]}
                />
                <Pressable
                  onPress={handleSetPassword}
                  disabled={loading}
                  style={{ marginTop: 16, backgroundColor: '#1d9bf0', borderRadius: 12, padding: 14, alignItems: 'center' }}
                >
                  {loading
                    ? <ActivityIndicator size={18} color="white" />
                    : <Text style={{ color: 'white', fontFamily: 'jakaraBold', fontSize: 15 }}>Save password</Text>
                  }
                </Pressable>
              </>
            )}
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}
