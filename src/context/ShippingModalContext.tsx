import { createContext, useContext, useState, ReactNode } from 'react';

interface ShippingModalContextValue {
  isOpen: boolean;
  openShippingModal: () => void;
  closeShippingModal: () => void;
}

const ShippingModalContext = createContext<ShippingModalContextValue | null>(null);

export function ShippingModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ShippingModalContext.Provider value={{
      isOpen,
      openShippingModal: () => setIsOpen(true),
      closeShippingModal: () => setIsOpen(false),
    }}>
      {children}
    </ShippingModalContext.Provider>
  );
}

export function useShippingModal() {
  const ctx = useContext(ShippingModalContext);
  if (!ctx) throw new Error('useShippingModal must be used inside ShippingModalProvider');
  return ctx;
}
