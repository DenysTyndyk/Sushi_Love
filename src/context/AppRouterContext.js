import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';

const AppRouterContext = createContext(null);

const normalizePath = (pathname) => (pathname === '/koszyk' ? '/koszyk' : '/');

export const AppRouterProvider = ({ children }) => {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname));

  useEffect(() => {
    const onPopState = () => {
      setPath(normalizePath(window.location.pathname));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = useCallback((to) => {
    const next = normalizePath(to);
    window.history.pushState({}, '', next === '/' ? '/' : next);
    setPath(next);
  }, []);

  const value = useMemo(() => ({ path, navigate }), [path, navigate]);

  return (
    <AppRouterContext.Provider value={value}>{children}</AppRouterContext.Provider>
  );
};

export const useAppRouter = () => {
  const ctx = useContext(AppRouterContext);
  if (!ctx) {
    throw new Error('useAppRouter must be used within AppRouterProvider');
  }
  return ctx;
};
