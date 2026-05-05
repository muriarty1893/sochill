import { createContext, useCallback, useContext, useState } from 'react';
import type { ReactNode } from 'react';

const INITIAL_BALANCE = 100;
const DEFAULT_DONATE_AMOUNT = 15;

type SparksContextValue = {
  balance: number;
  donate: (amount?: number) => boolean;
  defaultAmount: number;
};

const SparksContext = createContext<SparksContextValue | null>(null);

export function SparksProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState(INITIAL_BALANCE);

  const donate = useCallback((amount = DEFAULT_DONATE_AMOUNT): boolean => {
    if (balance < amount) return false;
    setBalance((prev) => prev - amount);
    return true;
  }, [balance]);

  return (
    <SparksContext.Provider value={{ balance, donate, defaultAmount: DEFAULT_DONATE_AMOUNT }}>
      {children}
    </SparksContext.Provider>
  );
}

export function useSparks(): SparksContextValue {
  const ctx = useContext(SparksContext);
  if (!ctx) throw new Error('useSparks must be used inside SparksProvider');
  return ctx;
}
