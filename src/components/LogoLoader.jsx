import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import './LogoLoader.css';

/**
 * Full-screen branded loader showing the Avrora Dazzle logo in the middle of the page.
 *
 * Usage:
 *   if (loading) return <LogoLoader />;           // simple, unmounts instantly
 *   <LogoLoader show={loading} />                 // stays mounted, fades out smoothly
 */
const FADE_MS = 500;

const LogoLoader = ({ show = true, label = 'Loading' }) => {
  const [mounted, setMounted] = useState(show);
  const [leaving, setLeaving] = useState(false);

  // Handle smooth fade-out when `show` flips to false
  useEffect(() => {
    if (show) {
      setMounted(true);
      setLeaving(false);
      return undefined;
    }
    setLeaving(true);
    const t = setTimeout(() => setMounted(false), FADE_MS);
    return () => clearTimeout(t);
  }, [show]);

  // Lock page scroll while the loader is covering the screen
  useEffect(() => {
    if (!mounted || leaving) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mounted, leaving]);

  if (!mounted || typeof document === 'undefined') return null;

  return createPortal(
    <div
      id="avrora-logo-loader"
      className={`ad-loader${leaving ? ' ad-loader--leaving' : ''}`}
      role="status"
      aria-live="polite"
      aria-busy={!leaving}
    >
      <div className="ad-loader__stage">
        <div className="ad-loader__glow" />
        <div className="ad-loader__ring ad-loader__ring--outer" />
        <div className="ad-loader__ring" />

        <span className="ad-loader__sparkle" />
        <span className="ad-loader__sparkle" />
        <span className="ad-loader__sparkle" />
        <span className="ad-loader__sparkle" />
        <span className="ad-loader__sparkle" />

        <div className="ad-loader__logo">
          <img src="/assets/avrora_logo.jpeg" alt="Avrora Dazzle Textiles" draggable="false" />
        </div>
      </div>

      <div className="ad-loader__brand" aria-hidden="true">
        <p className="ad-loader__title">Avrora Dazzle</p>
        <p className="ad-loader__subtitle">Textiles</p>
        <div className="ad-loader__bar" />
      </div>

      <span className="ad-loader__sr">{label}…</span>
    </div>,
    document.body
  );
};

export default LogoLoader;
