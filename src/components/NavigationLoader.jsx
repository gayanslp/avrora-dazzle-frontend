'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import LogoLoader from './LogoLoader';

/**
 * Global navigation & page transition loader.
 * Appears when:
 * 1. Initial page refresh or opening any site URL
 * 2. Navigating from one page to another across the website
 */
const NavigationLoader = () => {
  const pathname = usePathname();
  const [show, setShow] = useState(true);
  const isFirstLoad = useRef(true);
  const prevPathRef = useRef(pathname);

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

    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;
      setShow(true);
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }

      const timer = setTimeout(() => {
        setShow(false);
      }, 480);

      return () => clearTimeout(timer);
    }
  }, [pathname]);

  return <LogoLoader show={show} label="Avrora Dazzle" />;
};

export default NavigationLoader;
