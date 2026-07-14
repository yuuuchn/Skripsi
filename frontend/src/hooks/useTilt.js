// 3D tilt-follow handlers for cards. Share across mapped lists via e.currentTarget.
// Usage: const tilt = useTilt(); <div {...tilt}>
export default function useTilt(max = 18) {
  const onMouseMove = (e) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rotY = (px - 0.5) * 2 * max;
    const rotX = -(py - 0.5) * 2 * max;
    el.style.transition = 'transform 0s';
    el.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-5px) scale(1.03)`;
  };

  const onMouseLeave = (e) => {
    const el = e.currentTarget;
    el.style.transition = '';
    el.style.transform = '';
  };

  return { onMouseMove, onMouseLeave };
}
