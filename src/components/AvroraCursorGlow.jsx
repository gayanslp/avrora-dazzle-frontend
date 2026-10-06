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
      {/* Primary Neon Green & Electric Cyan Ribbon Spotlight */}
      <div
        className="absolute w-[550px] h-[550px] rounded-full blur-[100px] opacity-60 transition-transform duration-150 ease-out"
        style={{
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.75) 0%, rgba(6, 182, 212, 0.6) 40%, rgba(168, 85, 247, 0.35) 70%, transparent 85%)',
          transform: `translate3d(${pos.x - 275}px, ${pos.y - 275}px, 0)`,
        }}
      />

      {/* Lagging Violet/Ice White Wave Trail */}
      <div
        className="absolute w-[700px] h-[700px] rounded-full blur-[130px] opacity-45 transition-transform duration-500 ease-out"
        style={{
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.55) 0%, rgba(56, 189, 248, 0.4) 50%, transparent 75%)',
          transform: `translate3d(${pos.x - 350}px, ${pos.y - 350}px, 0)`,
        }}
      />
    </div>
  );
};

export default AvroraCursorGlow;
