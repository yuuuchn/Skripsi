import { useRef, useEffect } from 'react';

export default function BorderGlow({
  children,
  className = '',
  innerClassName = 'bg-[var(--color-card)]',
  animated = true,
  spotlightSize = 320,
}) {
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
      {/* Continuously-rotating conic gradient border (ReactBits animated intro) */}
      {animated && (
        <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center">
          <div
            className="aspect-square w-[140%] animate-spin-slow"
            style={{
              background: `conic-gradient(from 0deg,
                transparent 0deg,
                #6366f1 60deg,
                #a855f7 120deg,
                #ec4899 160deg,
                transparent 220deg,
                transparent 360deg
              )`,
              opacity: 0.55,
            }}
          />
        </div>
      )}

      {/* Spotlight glowing border gradient following mouse pointer (bigger on hover) */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(
            ${spotlightSize}px circle at var(--mouse-x) var(--mouse-y),
            #6366f1 0%,
            #a855f7 45%,
            transparent 80%
          )`
        }}
      />

      {/* Inner content container - background configurable via props */}
      <div className={`relative z-10 w-full h-full rounded-[22.5px] overflow-hidden ${innerClassName}`}>
        {children}
      </div>
    </div>
  );
}
