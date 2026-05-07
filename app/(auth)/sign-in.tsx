import { useState } from 'react';
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
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendCode = async () => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes('@')) {
      setError('Enter a valid email address.');
      return;
    }
    setError('');
    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: { shouldCreateUser: true },
    });
    setLoading(false);
    if (authError) {
      setError(authError.message);
      return;
    }
    router.push({ pathname: '/(auth)/verify', params: { email: trimmed } });
  };

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.inner}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

        <View style={styles.header}>
          <Text style={styles.logo}>✦ sparkle</Text>
          <Text style={styles.subtitle}>support what matters, together.</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Your email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={(t) => { setEmail(t); setError(''); }}
            placeholder="you@example.com"
            placeholderTextColor="#A0A59F"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleSendCode}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Pressable
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSendCode}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Send code</Text>
            )}
          </Pressable>
          <Text style={styles.hint}>We'll send a 6-digit code to your email. No password needed.</Text>
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
    justifyContent: 'center',
    padding: 28,
  },
  header: {
    marginBottom: 48,
  },
  logo: {
    color: '#171A18',
    fontFamily: 'SofiaSansCondensed_800ExtraBold',
    fontSize: 40,
  },
  subtitle: {
    color: '#7C827D',
    fontFamily: 'RobotoSlab_400Regular',
    fontSize: 14,
    marginTop: 6,
  },
  form: {
    gap: 10,
  },
  label: {
    color: '#303531',
    fontFamily: 'SofiaSansCondensed_800ExtraBold',
    fontSize: 18,
    marginBottom: 2,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderColor: '#ECE4D9',
    borderRadius: 10,
    borderWidth: 1,
    color: '#171A18',
    fontFamily: 'RobotoSlab_400Regular',
    fontSize: 16,
    padding: 15,
  },
  error: {
    color: '#C86B4A',
    fontFamily: 'RobotoSlab_400Regular',
    fontSize: 13,
    marginTop: 2,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#2E8B77',
    borderRadius: 12,
    marginTop: 6,
    padding: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: 'SofiaSansCondensed_800ExtraBold',
    fontSize: 20,
  },
  hint: {
    color: '#A0A59F',
    fontFamily: 'RobotoSlab_400Regular',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
    textAlign: 'center',
  },
});
