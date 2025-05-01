import { createContext, useContext, useState, useEffect, useMemo } from "react";

const ThemeContext = createContext();

// Экспортируем контекст отдельно для возможного использования напрямую
export const themeContext = ThemeContext;

// Компонент ThemeProvider
export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      document.documentElement.style.setProperty('color-scheme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      document.documentElement.style.setProperty('color-scheme', 'light');
    }
  }, [isDarkMode]);

  const toggle_theme = () => setIsDarkMode((prev) => !prev);

  const value = useMemo(() => ({
    isDarkMode,
    toggle_theme,
  }), [isDarkMode]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Хук useTheme
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}