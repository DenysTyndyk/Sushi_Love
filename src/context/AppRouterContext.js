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

const parseTo = (to) => {
  const raw = String(to || '/');
  const hashIndex = raw.indexOf('#');
  if (hashIndex === -1) {
    return { path: raw, hash: '' };
  }
  return {
    path: raw.slice(0, hashIndex) || '/',
    hash: raw.slice(hashIndex + 1)
  };
};

const scrollToSection = (hash, attempt = 0) => {
  if (!hash) return;
  const el = document.getElementById(hash);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  if (attempt < 12) {
    requestAnimationFrame(() => scrollToSection(hash, attempt + 1));
  }
};

export const AppRouterProvider = ({ children }) => {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname));

  useEffect(() => {
    const onPopState = () => {
      setPath(normalizePath(window.location.pathname));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    if (path !== '/') return;
    const hash = window.location.hash.replace(/^#/, '');
    if (hash) scrollToSection(hash);
  }, [path]);

  const navigate = useCallback((to) => {
    const { path: rawPath, hash } = parseTo(to);
    const next = normalizePath(rawPath);
    const href = next === '/' ? (hash ? `/#${hash}` : '/') : next;
    window.history.pushState({}, '', href);
    setPath(next);
    if (hash && next === '/') {
      scrollToSection(hash);
    }
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
