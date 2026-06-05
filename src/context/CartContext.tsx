import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from 'react';
import type {
  AddToCartOptions,
  CartContextValue,
  CartLine,
  MenuItem
} from '../types';

const CartContext = createContext<CartContextValue | null>(null);

const CART_STORAGE_KEY =
  process.env.REACT_APP_CART_STORAGE_KEY || 'sushi-love-cart';

const parsePrice = (priceText: string): number => {
  const [firstPart] = priceText.split('/');
  const numericPrice = parseFloat(
    firstPart.replace(/[^\d.,]/g, '').replace(',', '.')
  );
  return Number.isNaN(numericPrice) ? 0 : numericPrice;
};

function readStoredCart(): CartLine[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data
      .filter(
        (it): it is CartLine =>
          !!it &&
          (it as CartLine).id != null &&
          typeof (it as CartLine).name === 'string' &&
          typeof (it as CartLine).priceValue === 'number' &&
          !Number.isNaN((it as CartLine).priceValue) &&
          typeof (it as CartLine).quantity === 'number' &&
          (it as CartLine).quantity > 0
      )
      .map((it) => ({
        id: String(it.id),
        name: it.name,
        priceLabel:
          typeof it.priceLabel === 'string' ? it.priceLabel : String(it.priceValue),
        priceValue: it.priceValue,
        quantity: Math.max(1, Math.floor(it.quantity))
      }));
  } catch {
    return [];
  }
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartLine[]>(() => readStoredCart());

  useEffect(() => {
    try {
      if (cart.length === 0) {
        localStorage.removeItem(CART_STORAGE_KEY);
      } else {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      }
    } catch {
    }
  }, [cart]);

  const addToCart = useCallback(
    (item: MenuItem, category: string, opts: AddToCartOptions = {}) => {
      const variantKey = opts.variantKey;
      let itemId = String(item.id ?? `${category}-${item.name}`);
      let priceStr = item.price;
      let lineName = item.name;

      if (item.variantOptions?.length) {
        const key = variantKey || item.variantOptions[0]?.key;
        const opt = item.variantOptions.find((o) => o.key === key);
        if (!opt) return;
        itemId = `${item.id}__${opt.key}`;
        priceStr = opt.price;
        lineName = `${item.name} — ${opt.label}`;
      }

      const priceValue = parsePrice(priceStr);

      setCart((prevCart) => {
        const existingItem = prevCart.find((cartItem) => cartItem.id === itemId);

        if (existingItem) {
          return prevCart.map((cartItem) =>
            cartItem.id === itemId
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          );
        }

        return [
          ...prevCart,
          {
            id: itemId,
            name: lineName,
            priceLabel: priceStr,
            priceValue,
            quantity: 1
          }
        ];
      });
    },
    []
  );

  const increaseItem = useCallback((itemId: string) => {
    const id = String(itemId);
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }, []);

  const decreaseItem = useCallback((itemId: string) => {
    const id = String(itemId);
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const removeItem = useCallback((itemId: string) => {
    const id = String(itemId);
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const cartItemsCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.priceValue * item.quantity, 0),
    [cart]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      cartItemsCount,
      cartTotal,
      addToCart,
      increaseItem,
      decreaseItem,
      removeItem,
      clearCart
    }),
    [
      cart,
      cartItemsCount,
      cartTotal,
      addToCart,
      increaseItem,
      decreaseItem,
      removeItem,
      clearCart
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider');
  }
  return ctx;
};
