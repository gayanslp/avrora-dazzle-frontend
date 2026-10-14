'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollRevealProvider() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Activate the class on body to enable scroll-reveal transitions
    document.body.classList.add('has-scroll-reveal');

    let observer = null;

    if (typeof IntersectionObserver !== 'undefined') {
      const observerCallback = (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            obs.unobserve(entry.target);
          }
        });
      };

      observer = new IntersectionObserver(observerCallback, {
        root: null,
        rootMargin: '0px 0px -25px 0px',
        threshold: [0, 0.05],
      });

      const observeNewElements = () => {
        const elements = document.querySelectorAll('.reveal-on-scroll:not(.is-revealed)');
        elements.forEach((el) => {
          // If already in or above viewport, reveal immediately
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight - 20) {
            el.classList.add('is-revealed');
          } else {
            observer.observe(el);
          }
        });
      };

      // Initial scan
      observeNewElements();

      // Secondary check for asynchronous and animated renders
      const timer = setTimeout(() => {
        observeNewElements();
      }, 250);

      // Mutation observer to observe dynamically loaded products from backend API
      const mutationObserver = new MutationObserver(() => {
        observeNewElements();
      });

      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });

      const handleResize = () => {
        if (window.innerWidth >= 768) {
          document.querySelectorAll('.reveal-on-scroll:not(.is-revealed)').forEach((el) => {
            el.classList.add('is-revealed');
          });
        }
      };
      window.addEventListener('resize', handleResize, { passive: true });

      return () => {
        clearTimeout(timer);
        if (observer) observer.disconnect();
        mutationObserver.disconnect();
        window.removeEventListener('resize', handleResize);
      };
    } else {
      // Fallback for browsers without IntersectionObserver: mark all as revealed
      document.querySelectorAll('.reveal-on-scroll').forEach((el) => {
        el.classList.add('is-revealed');
      });
    }
  }, [pathname]);

  return null;
}
