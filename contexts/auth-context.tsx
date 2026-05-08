import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { store } from '@/redux/store';
import { setUser, clearUser } from '@/redux/slices/user';

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function syncUserProfile(userId: string) {
  try {
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single();
    const { data: { user } } = await supabase.auth.getUser();
    if (profile) {
      store.dispatch(setUser({
        id: profile.id,
        email: user?.email,
        username: profile.username,
        handle: profile.handle,
        display_name: profile.display_name,
        bio: profile.bio,
        avatar_url: profile.avatar_url,
        verified: profile.verified,
      }));
    }
  } catch {}
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session?.user) {
        syncUserProfile(data.session.user.id);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        syncUserProfile(newSession.user.id);
      } else {
        store.dispatch(clearUser());
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
