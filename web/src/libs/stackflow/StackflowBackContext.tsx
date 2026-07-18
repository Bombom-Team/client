import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

const StackflowBackContext = createContext<(() => void) | null>(null);

interface StackflowBackProviderProps {
  children: ReactNode;
  onBack: () => void;
}

export const StackflowBackProvider = ({
  children,
  onBack,
}: StackflowBackProviderProps) => (
  <StackflowBackContext.Provider value={onBack}>
    {children}
  </StackflowBackContext.Provider>
);

export const useStackflowBack = () => useContext(StackflowBackContext);
