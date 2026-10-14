'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isAvroraTheme, setIsAvroraTheme] = useState(false);

  useEffect(() => {
    const syncThemeForViewport = () => {
      try {
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
        if (isMobile) {
          // On mobile responsiveness, site is strictly kept in Normal Mode
          setIsAvroraTheme(false);
          document.documentElement.classList.remove('theme-avrora');
          document.body.classList.remove('theme-avrora');
          return;
        }

        const saved = localStorage.getItem('avora_theme');
        if (saved === 'avrora') {
          setIsAvroraTheme(true);
          document.documentElement.classList.add('theme-avrora');
          document.body.classList.add('theme-avrora');
        } else {
          setIsAvroraTheme(false);
          document.documentElement.classList.remove('theme-avrora');
          document.body.classList.remove('theme-avrora');
        }
      } catch (e) {
        // ignore
      }
    };

    syncThemeForViewport();
    window.addEventListener('resize', syncThemeForViewport);
    return () => window.removeEventListener('resize', syncThemeForViewport);
  }, []);

  const toggleAvroraTheme = () => {
    // Prevent switching to Avrora mode on mobile screens
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return;
    }

    setIsAvroraTheme((prev) => {
      const next = !prev;
      try {
        if (next) {
          document.documentElement.classList.add('theme-avrora');
          document.body.classList.add('theme-avrora');
          localStorage.setItem('avora_theme', 'avrora');
        } else {
          document.documentElement.classList.remove('theme-avrora');
          document.body.classList.remove('theme-avrora');
          localStorage.setItem('avora_theme', 'normal');
        }
      } catch (e) {
        // ignore
      }
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ isAvroraTheme, toggleAvroraTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
