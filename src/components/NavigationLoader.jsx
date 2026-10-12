import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import LogoLoader from './LogoLoader';

/**
 * Global navigation & page transition loader.
 * Appears when:
 * 1. Initial page refresh or opening any site URL
 * 2. Navigating from one page to another across the website
 */
const NavigationLoader = () => {
  const location = useLocation();
  const [show, setShow] = useState(true);
  const isFirstLoad = useRef(true);
  const prevPathRef = useRef(location.pathname);

  // 1. Initial page load / refresh
  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      isFirstLoad.current = false;
    }, 650);

    return () => clearTimeout(timer);
  }, []);

  // 2. On route change between pages
  useEffect(() => {
    if (isFirstLoad.current) return;

    if (prevPathRef.current !== location.pathname) {
      prevPathRef.current = location.pathname;
      setShow(true);
      window.scrollTo({ top: 0, behavior: 'instant' });

      const timer = setTimeout(() => {
        setShow(false);
      }, 480);

      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  return <LogoLoader show={show} label="Avrora Dazzle" />;
};

export default NavigationLoader;
