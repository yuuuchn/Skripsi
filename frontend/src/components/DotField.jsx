import { useEffect, useRef } from 'react';

export default function DotField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    const mouse = { x: null, y: null, radius: 160 };
    const gridGap = 32; // Spacing between dots in the grid

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cols = Math.floor(canvas.width / gridGap) + 1;
      const rows = Math.floor(canvas.height / gridGap) + 1;

      // Draw dot grid
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * gridGap;
          const y = j * gridGap;

          let dotRadius = 1.2;
          let opacity = 0.12;
          let drawX = x;
          let drawY = y;

          // Mouse interaction (distort, scale, and glow dots near cursor)
          if (mouse.x !== null && mouse.y !== null) {
            const dx = x - mouse.x;
            const dy = y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < mouse.radius) {
              const force = (mouse.radius - dist) / mouse.radius;
              
              // 1. Glow effect (increase opacity)
              opacity = 0.12 + force * 0.48;
              
              // 2. Magnify effect (increase dot radius)
              dotRadius = 1.2 + force * 2.2;

              // 3. 3D holographic distortion displacement
              const angle = Math.atan2(dy, dx);
              drawX = x + Math.cos(angle) * force * 8;
              drawY = y + Math.sin(angle) * force * 8;
            }
          }

          // Draw the individual dot
          ctx.beginPath();
          ctx.arc(drawX, drawY, dotRadius, 0, Math.PI * 2);
          ctx.fillStyle = '#6366f1'; // Indigo color
          ctx.globalAlpha = opacity;
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(draw);
    }

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    resize();
    draw();

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.65 }}
    />
  );
}
