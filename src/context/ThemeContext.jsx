import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isAvroraTheme, setIsAvroraTheme] = useState(() => {
    return localStorage.getItem('avora_theme') === 'avrora';
  });

  useEffect(() => {
    if (isAvroraTheme) {
      document.documentElement.classList.add('theme-avrora');
      document.body.classList.add('theme-avrora');
      localStorage.setItem('avora_theme', 'avrora');
    } else {
      document.documentElement.classList.remove('theme-avrora');
      document.body.classList.remove('theme-avrora');
      localStorage.setItem('avora_theme', 'normal');
    }
  }, [isAvroraTheme]);

  const toggleAvroraTheme = () => {
    setIsAvroraTheme((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isAvroraTheme, toggleAvroraTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
