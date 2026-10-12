import React, { useEffect, useState } from 'react';

const AvroraCursorGlow = () => {
  const [pos, setPos] = useState({ x: -400, y: -400 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Primary Radiant Cyan / Turquoise Spotlight */}
      <div
        className="absolute w-[560px] h-[560px] rounded-full blur-[110px] opacity-65 transition-transform duration-150 ease-out"
        style={{
          background: 'radial-gradient(circle, rgba(0, 245, 212, 0.75) 0%, rgba(6, 182, 212, 0.55) 40%, rgba(59, 130, 246, 0.25) 70%, transparent 85%)',
          transform: `translate3d(${pos.x - 280}px, ${pos.y - 280}px, 0)`,
        }}
      />

      {/* Lagging Electric Magenta / Violet Spotlight */}
      <div
        className="absolute w-[680px] h-[680px] rounded-full blur-[130px] opacity-55 transition-transform duration-500 ease-out"
        style={{
          background: 'radial-gradient(circle, rgba(217, 70, 239, 0.65) 0%, rgba(236, 72, 153, 0.45) 40%, rgba(147, 51, 234, 0.25) 70%, transparent 80%)',
          transform: `translate3d(${pos.x - 340}px, ${pos.y - 340}px, 0)`,
        }}
      />
    </div>
  );
};

export default AvroraCursorGlow;
