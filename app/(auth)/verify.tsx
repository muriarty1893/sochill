import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function VerifyScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(60);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleVerify = async (token: string) => {
    if (token.length < 6) return;
    setError('');
    setLoading(true);
    const { error: authError } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });
    setLoading(false);
    if (authError) {
      setError('Invalid or expired code. Try again.');
      setCode('');
      return;
    }
    // Auth context picks up the new session and _layout.tsx redirects to (tabs)
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setResending(true);
    setError('');
    await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    setResending(false);
    setCountdown(60);
  };

  const handleCodeChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 6);
    setCode(cleaned);
    setError('');
    if (cleaned.length === 6) {
      handleVerify(cleaned);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.inner}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

        <Pressable style={styles.back} onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>

        <View style={styles.header}>
          <Text style={styles.title}>Check your email</Text>
          <Text style={styles.subtitle}>
            We sent a 6-digit code to{'\n'}
            <Text style={styles.emailHighlight}>{email}</Text>
          </Text>
        </View>

        <View style={styles.form}>
          <TextInput
            ref={inputRef}
            style={styles.codeInput}
            value={code}
            onChangeText={handleCodeChange}
            placeholder="000000"
            placeholderTextColor="#C8CCC9"
            keyboardType="number-pad"
            maxLength={6}
            autoFocus
            textAlign="center"
          />

          {loading && (
            <View style={styles.loadingRow}>
              <ActivityIndicator color="#2E8B77" size="small" />
              <Text style={styles.loadingText}>Verifying...</Text>
            </View>
          )}

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            style={[styles.resendButton, (countdown > 0 || resending) && styles.resendDisabled]}
            onPress={handleResend}
            disabled={countdown > 0 || resending}>
            <Text style={[styles.resendText, (countdown > 0 || resending) && styles.resendTextDisabled]}>
              {countdown > 0 ? `Resend in ${countdown}s` : resending ? 'Sending...' : 'Resend code'}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#FFFCF6',
    flex: 1,
  },
  inner: {
    flex: 1,
    padding: 28,
  },
  back: {
    marginBottom: 32,
    marginTop: 8,
  },
  backText: {
    color: '#7C827D',
    fontFamily: 'RobotoSlab_400Regular',
    fontSize: 14,
  },
  header: {
    marginBottom: 36,
  },
  title: {
    color: '#171A18',
    fontFamily: 'SofiaSansCondensed_800ExtraBold',
    fontSize: 34,
    marginBottom: 10,
  },
  subtitle: {
    color: '#7C827D',
    fontFamily: 'RobotoSlab_400Regular',
    fontSize: 14,
    lineHeight: 22,
  },
  emailHighlight: {
    color: '#2E8B77',
    fontFamily: 'SplineSansMono_400Regular',
    fontSize: 13,
  },
  form: {
    alignItems: 'center',
    gap: 14,
  },
  codeInput: {
    backgroundColor: '#FFFFFF',
    borderColor: '#ECE4D9',
    borderRadius: 12,
    borderWidth: 1,
    color: '#171A18',
    fontFamily: 'SplineSansMono_400Regular',
    fontSize: 32,
    letterSpacing: 12,
    paddingHorizontal: 20,
    paddingVertical: 18,
    width: '100%',
  },
  loadingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  loadingText: {
    color: '#7C827D',
    fontFamily: 'RobotoSlab_400Regular',
    fontSize: 13,
  },
  error: {
    color: '#C86B4A',
    fontFamily: 'RobotoSlab_400Regular',
    fontSize: 13,
    textAlign: 'center',
  },
  resendButton: {
    marginTop: 8,
    paddingVertical: 8,
  },
  resendDisabled: {
    opacity: 0.5,
  },
  resendText: {
    color: '#2E8B77',
    fontFamily: 'SofiaSansCondensed_800ExtraBold',
    fontSize: 17,
  },
  resendTextDisabled: {
    color: '#A0A59F',
  },
});
