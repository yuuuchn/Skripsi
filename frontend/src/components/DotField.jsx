import { useEffect, useRef } from 'react';

export default function DotField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    const mouse = { x: null, y: null, radius: 180 };
    const gridGap = 36; // Slightly larger gap for a cleaner grid distribution

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

          // Increased base radius and opacity for clear visibility on light theme
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
              
              // 1. Glow effect (increase opacity up to 0.8)
              opacity = 0.28 + force * 0.52;
              
              // 2. Magnify effect (increase dot radius up to 4.5px)
              dotRadius = 2.0 + force * 2.5;

              // 3. 3D holographic distortion displacement
              const angle = Math.atan2(dy, dx);
              drawX = x + Math.cos(angle) * force * 10;
              drawY = y + Math.sin(angle) * force * 10;
            }
          }

          // Draw the individual dot
          ctx.beginPath();
          ctx.arc(drawX, drawY, dotRadius, 0, Math.PI * 2);
          ctx.fillStyle = '#6366f1'; // Rich Indigo
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
      style={{ opacity: 1 }} // Set to full opacity so inner canvas colors render clearly
    />
  );
}
