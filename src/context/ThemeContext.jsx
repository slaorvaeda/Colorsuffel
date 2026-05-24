import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from 'react';

const STORAGE_KEY = 'theme';

function getDocumentClassDark() {
  return document.documentElement.classList.contains('dark');
}

function getServerSnapshot() {
  return false;
}

function subscribeToDom(callback) {
  const observer = new MutationObserver(() => {
    callback();
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });
  return () => observer.disconnect();
}

const ThemeContext = createContext(null);

// eslint-disable-next-line react/prop-types -- root provider; children is arbitrary React nodes
export function ThemeProvider({ children }) {
  const isDark = useSyncExternalStore(subscribeToDom, getDocumentClassDark, getServerSnapshot);

  const setTheme = useCallback((mode) => {
    const next = mode === 'dark' ? 'dark' : 'light';
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
    document.documentElement.classList.toggle('dark', next === 'dark');
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(isDark ? 'light' : 'dark');
  }, [isDark, setTheme]);

  const value = useMemo(
    () => ({
      theme: isDark ? 'dark' : 'light',
      setTheme,
      toggleTheme,
    }),
    [isDark, setTheme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// Hook is intentionally co-located with provider for a tiny theme module.
// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}
