import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { useAppSelector } from '@/redux/hooks';

export function useGetMode(): boolean {
  const scheme = useColorScheme();
  const [dark, setDark] = useState(false);
  const mode = useAppSelector((state) => state.prefs.mode);

  useEffect(() => {
    if (mode === 'system') {
      setDark(scheme === 'dark');
    } else {
      setDark(mode === 'dark');
    }
  }, [mode, scheme]);

  return dark;
}
