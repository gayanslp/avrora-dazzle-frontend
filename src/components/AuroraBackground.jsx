'use client';

import React, { useEffect, useRef } from 'react';
import './AuroraBackground.css';

/**
 * AuroraBackground — High-performance cosmic Northern Lights animation
 * matching the user's reference image:
 * Deep celestial indigo canvas, electric magenta / neon violet curtain,
 * radiant turquoise / cyan ribbons, and subtle twinkling stardust.
 */
const AuroraBackground = () => {
  const canvasRef = useRef(null);

  // Subtle twinkling stardust generator on a lightweight canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Generate ~60 subtle stars
    const stars = Array.from({ length: 70 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.2 + 0.3,
      alpha: Math.random() * 0.7 + 0.2,
      speed: Math.random() * 0.02 + 0.005,
      phase: Math.random() * Math.PI * 2,
    }));

    let t = 0;
    const render = () => {
      t += 0.015;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const s of stars) {
        const currentAlpha = Math.max(0.08, Math.min(0.9, s.alpha + Math.sin(t + s.phase) * 0.35));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(224, 242, 254, ${currentAlpha})`;
        ctx.shadowBlur = 4;
        ctx.shadowColor = 'rgba(217, 70, 239, 0.8)';
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="aurora-ambient-container" aria-hidden="true">
      {/* 1. Deep Cosmic Base Background */}
      <div className="aurora-base-sky" />

      {/* 2. Twinkling Cosmic Stardust Canvas */}
      <canvas ref={canvasRef} className="aurora-stars-canvas" />

      {/* 3. Primary Electric Magenta / Violet Aurora Wave (Right & Top) */}
      <div className="aurora-curtain aurora-curtain--magenta" />

      {/* 4. Radiant Neon Cyan & Turquoise Aurora Wave (Left & Diagonals) */}
      <div className="aurora-curtain aurora-curtain--cyan" />

      {/* 5. Central Ethereal Core Beam (Brilliant Light Streak) */}
      <div className="aurora-curtain aurora-curtain--core" />

      {/* 6. Soft Velvet Ambient Mist for Depth */}
      <div className="aurora-curtain aurora-curtain--mist" />

      {/* 7. Subtle Vignette Overlay to ensure perfect text contrast */}
      <div className="aurora-vignette" />
    </div>
  );
};

export default AuroraBackground;
