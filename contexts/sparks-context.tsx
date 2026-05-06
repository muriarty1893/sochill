import { createContext, useCallback, useContext, useState } from 'react';
import type { ReactNode } from 'react';

const INITIAL_BALANCE = 100;
const DEFAULT_DONATE_AMOUNT = 15;

type SparksContextValue = {
  balance: number;
  donate: (amount?: number) => boolean;
  defaultAmount: number;
  support: (charityPostId: string) => boolean;
  supportedIds: string[];
};

const SparksContext = createContext<SparksContextValue | null>(null);

export function SparksProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [supportedIds, setSupportedIds] = useState<string[]>([]);

  const donate = useCallback((amount = DEFAULT_DONATE_AMOUNT): boolean => {
    if (balance < amount) return false;
    setBalance((prev) => prev - amount);
    return true;
  }, [balance]);

  const support = useCallback((charityPostId: string): boolean => {
    if (supportedIds.includes(charityPostId)) return false;
    setSupportedIds((prev) => [...prev, charityPostId]);
    return true;
  }, [supportedIds]);

  return (
    <SparksContext.Provider value={{ balance, donate, defaultAmount: DEFAULT_DONATE_AMOUNT, support, supportedIds }}>
      {children}
    </SparksContext.Provider>
  );
}

export function useSparks(): SparksContextValue {
  const ctx = useContext(SparksContext);
  if (!ctx) throw new Error('useSparks must be used inside SparksProvider');
  return ctx;
}
