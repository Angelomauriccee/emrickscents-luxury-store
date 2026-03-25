import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { CartItem, BoxProduct, Product } from '../types';

interface CartNotification {
  visible: boolean;
  item: CartItem | null;
}

interface CartContextValue {
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  notification: CartNotification;
  addToCart: (product: Product, size?: string) => void;
  addBoxToCart: (products: BoxProduct[], ribbon: { name: string; color: string } | null, giftMessage: string) => void;
  addCustomItem: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = 'emrickscents-cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [notification, setNotification] = useState<CartNotification>({ visible: false, item: null });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const addToCart = useCallback((product: Product, size?: string) => {
    const cartSize = size || product.size;
    const itemId = `${product.id}-${cartSize}`;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        return prev.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      const newItem: CartItem = {
        id: itemId,
        productId: product.id,
        name: product.name,
        brand: product.brand ?? '',
        type: product.type,
        size: cartSize,
        price: product.price,
        image: product.image,
        quantity: 1,
      };
      return [...prev, newItem];
    });

    setNotification({
      visible: true,
      item: {
        id: itemId,
        productId: product.id,
        name: product.name,
        brand: product.brand ?? '',
        type: product.type,
        size: cartSize,
        price: product.price,
        image: product.image,
        quantity: 1,
      },
    });

    setTimeout(() => setNotification({ visible: false, item: null }), 3500);
  }, []);

  const addCustomItem = useCallback((item: CartItem) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, item];
    });

    setNotification({ visible: true, item });
    setTimeout(() => {
      setNotification({ visible: false, item: null });
    }, 3000);
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  }, []);

  const addBoxToCart = useCallback((
    products: BoxProduct[],
    ribbon: { name: string; color: string } | null,
    giftMessage: string
  ) => {
    const totalPrice = products.reduce((sum, p) => sum + p.price, 0);
    const categories = products.map(p => p.category || 'unisex');
    const menCount = categories.filter(c => c === 'men').length;
    const womenCount = categories.filter(c => c === 'women').length;
    const boxCategory: 'men' | 'women' | 'unisex' = menCount > womenCount ? 'men'
      : womenCount > menCount ? 'women'
      : 'unisex';

    const boxItem: CartItem = {
      id: `box-${Date.now()}`,
      name: `Fragrance Box (${products.length} items)`,
      brand: 'EMRICKSCENTS',
      price: totalPrice,
      image: products[0]?.image || '',
      size: `${products.length} fragrances`,
      type: boxCategory === 'men' ? "Men's Box"
        : boxCategory === 'women' ? "Women's Box"
        : 'Curated Box',
      quantity: 1,
      isBox: true,
      boxProducts: products,
      boxRibbon: ribbon,
      boxGiftMessage: giftMessage,
      boxCategory,
    };

    setCartItems(prev => [...prev, boxItem]);
    setNotification({ visible: true, item: boxItem });
    setTimeout(() => setNotification({ visible: false, item: null }), 3000);
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <CartContext.Provider
      value={{ cartItems, cartCount, cartTotal, notification, addToCart, addBoxToCart, addCustomItem, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
