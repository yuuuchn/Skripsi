import { useEffect, useRef } from 'react';

export default function DotField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId = null;
    const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    const mouse = { x: null, y: null, radius: 180 };
    const gridGap = isTouchDevice ? 48 : 36;

    function draw() {
      animId = null;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cols = Math.floor(canvas.width / gridGap) + 1;
      const rows = Math.floor(canvas.height / gridGap) + 1;

      // Draw dot grid
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * gridGap;
          const y = j * gridGap;

          let dotRadius = 2.0;
          let opacity = 0.28;
          let drawX = x;
          let drawY = y;

          // Mouse interaction (scale, glow, and distort dots near cursor)
          if (mouse.x !== null && mouse.y !== null) {
            const dx = x - mouse.x;
            const dy = y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < mouse.radius) {
              const force = (mouse.radius - dist) / mouse.radius;
              opacity = 0.28 + force * 0.52;
              dotRadius = 2.0 + force * 2.5;
              const angle = Math.atan2(dy, dx);
              drawX = x + Math.cos(angle) * force * 10;
              drawY = y + Math.sin(angle) * force * 10;
            }
          }

          ctx.beginPath();
          ctx.arc(drawX, drawY, dotRadius, 0, Math.PI * 2);
          ctx.fillStyle = '#6366f1';
          ctx.globalAlpha = opacity;
          ctx.fill();
        }
      }
    }

    function scheduleDraw() {
      if (animId === null) {
        animId = requestAnimationFrame(draw);
      }
    }

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      scheduleDraw();
    }

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      scheduleDraw();
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
      scheduleDraw();
    };

    resize();

    window.addEventListener('resize', resize, { passive: true });
    if (!isTouchDevice) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      window.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    }

    return () => {
      if (animId !== null) cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      if (!isTouchDevice) {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 1 }} // Set to full opacity so inner canvas colors render clearly
    />
  );
}
