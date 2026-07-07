import { useState, useRef, useEffect } from 'react';

export default function usePipWindow() {
  const [position, setPosition] = useState({ x: 24, y: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    setPosition({ x: 24, y: window.innerHeight - 172 - 24 });
  }, []);

  const clamp = (x, y) => ({
    x: Math.max(8, Math.min(window.innerWidth - 192 - 8, x)),
    y: Math.max(8, Math.min(window.innerHeight - 172 - 8, y)),
  });

  const handleMouseDown = (e) => {
    const header = e.target.closest('.drag-header');
    if (!header) return;
    isDragging.current = true;
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    e.preventDefault();
  };

  const handleTouchStart = (e) => {
    const header = e.target.closest('.drag-header');
    if (!header) return;
    isDragging.current = true;
    const touch = e.touches[0];
    dragStart.current = { x: touch.clientX - position.x, y: touch.clientY - position.y };
  };

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!isDragging.current) return;
      setPosition(clamp(e.clientX - dragStart.current.x, e.clientY - dragStart.current.y));
    };
    const onMouseUp = () => { isDragging.current = false; };
    const onTouchMove = (e) => {
      if (!isDragging.current) return;
      const touch = e.touches[0];
      setPosition(clamp(touch.clientX - dragStart.current.x, touch.clientY - dragStart.current.y));
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onMouseUp);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onMouseUp);
    };
  }, [position]);

  return { position, handleMouseDown, handleTouchStart };
}
