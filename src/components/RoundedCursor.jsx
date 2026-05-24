import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * Smooth circular cursor for mouse / trackpad users only.
 * Skips touch devices and prefers-reduced-motion.
 */
export default function RoundedCursor() {
  const [active, setActive] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springConfig = { stiffness: 520, damping: 32, mass: 0.35 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);
  const scale = useSpring(1, { stiffness: 600, damping: 28 });

  useEffect(() => {
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (coarse || reduce) return undefined;

    setActive(true);
    const root = document.documentElement;
    root.classList.add('cursor-none-root');

    const onMove = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const onDown = () => scale.set(0.82);
    const onUp = () => scale.set(1);

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);

    return () => {
      root.classList.remove('cursor-none-root');
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
    };
  }, [x, y, scale]);

  if (!active) return null;

  return (
    <>
      {/* Outer ring */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-[2.5px] border-gray-500/75 bg-transparent shadow-[0_0_12px_rgba(139,92,246,0.35)] dark:border-violet-300/80 dark:shadow-[0_0_14px_rgba(196,181,253,0.25)]"
        style={{ x: springX, y: springY, scale }}
      />
      {/* Inner dot */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-600/90 dark:bg-violet-200/90"
        style={{
          x: springX,
          y: springY,
          scale,
        }}
      />
    </>
  );
}
