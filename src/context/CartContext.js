import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

const parsePrice = (priceText) => {
  const [firstPart] = priceText.split('/');
  const numericPrice = parseFloat(firstPart.replace(/[^\d.,]/g, '').replace(',', '.'));
  return Number.isNaN(numericPrice) ? 0 : numericPrice;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = useCallback((item, category) => {
    const itemId = item.id ?? `${category}-${item.name}`;
    const priceValue = parsePrice(item.price);

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
          name: item.name,
          priceLabel: item.price,
          priceValue,
          quantity: 1
        }
      ];
    });
  }, []);

  const increaseItem = useCallback((itemId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }, []);

  const decreaseItem = useCallback((itemId) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const removeItem = useCallback((itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
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

  const value = useMemo(
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

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider');
  }
  return ctx;
};
