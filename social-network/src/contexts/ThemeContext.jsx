import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'space';
  });

  const [customColor, setCustomColor] = useState(() => {
    return localStorage.getItem('customColor') || '';
  });

  const [animatedTheme, setAnimatedTheme] = useState(() => {
    return localStorage.getItem('animatedTheme') || 'none';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);

    // Remove all theme classes first
    document.documentElement.classList.remove('dark-theme', 'light-theme', 'space-theme');
    // Add current theme class
    document.documentElement.classList.add(`${theme}-theme`);

    // For backward compatibility if some styles use .dark-mode or .light-mode
    if (theme === 'dark' || theme === 'space') {
      document.documentElement.classList.add('dark-mode');
      document.documentElement.classList.remove('light-mode');
    } else {
      document.documentElement.classList.add('light-mode');
      document.documentElement.classList.remove('dark-mode');
    }
  }, [theme]);

  useEffect(() => {
    if (customColor) {
      localStorage.setItem('customColor', customColor);
      document.documentElement.style.setProperty('--body-bg', customColor);
      document.documentElement.classList.add('custom-bg-active');
    } else {
      localStorage.removeItem('customColor');
      document.documentElement.style.removeProperty('--body-bg');
      document.documentElement.classList.remove('custom-bg-active');
    }
  }, [customColor]);

  useEffect(() => {
    localStorage.setItem('animatedTheme', animatedTheme);
    if (animatedTheme && animatedTheme !== 'none') {
      document.documentElement.classList.add('animated-theme-active');
    } else {
      document.documentElement.classList.remove('animated-theme-active');
    }
  }, [animatedTheme]);

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    // Optional: Reset custom color when picking a preset, or keep it?
    // User request: "select any colour we can cose and backgorunfd colour need to be chnage"
    // Usually selecting a preset theme clears custom overrides.
    setCustomColor('');
  };

  const changeCustomColor = (color) => {
    setCustomColor(color);
  };

  const changeAnimatedTheme = (newAnimatedTheme) => {
    setAnimatedTheme(newAnimatedTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, changeTheme, customColor, changeCustomColor, animatedTheme, changeAnimatedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
