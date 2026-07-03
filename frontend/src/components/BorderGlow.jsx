import { useRef, useEffect } from 'react';

export default function BorderGlow({ children, className = '' }) {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    };

    card.addEventListener('mousemove', handleMouseMove);
    return () => card.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={cardRef}
      className={`relative p-[1.5px] rounded-[24px] overflow-hidden group ${className}`}
      style={{
        '--mouse-x': '0px',
        '--mouse-y': '0px'
      }}
    >
      {/* Spotlight glowing border gradient following mouse pointer */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(
            180px circle at var(--mouse-x) var(--mouse-y),
            #6366f1 0%,
            #a855f7 50%,
            transparent 100%
          )`
        }}
      />

      {/* Inner content container */}
      <div className="relative z-10 w-full h-full bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 rounded-[22.5px] overflow-hidden">
        {children}
      </div>
    </div>
  );
}
