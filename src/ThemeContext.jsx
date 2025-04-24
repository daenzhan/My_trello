import { createContext, useContext, useState, useMemo } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggle_theme = () => setIsDarkMode((prev) => !prev);

  const theme = useMemo(() => ({
    isDarkMode,
    toggle_theme,
  }), [isDarkMode]);

  return (
    <ThemeContext.Provider value={theme}>
      <div className={`app ${isDarkMode ? 'dark-mode' : ''}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);