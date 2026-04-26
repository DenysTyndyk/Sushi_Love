import React from 'react';
import './App.css';
import { AppRouterProvider, useAppRouter } from './context/AppRouterContext';
import { CartProvider } from './context/CartContext';
import { LanguageProvider } from './context/LanguageContext';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';

const RoutesView = () => {
  const { path } = useAppRouter();
  if (path === '/koszyk') {
    return <CartPage />;
  }
  return <HomePage />;
};

const App = () => (
  <LanguageProvider>
    <CartProvider>
      <AppRouterProvider>
        <RoutesView />
      </AppRouterProvider>
    </CartProvider>
  </LanguageProvider>
);

export default App;
