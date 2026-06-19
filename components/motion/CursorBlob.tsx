"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export function CursorBlob() {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 80, damping: 18, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 80, damping: 18, mass: 0.6 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onMove(e: MouseEvent) {
      x.set(e.clientX - 200);
      y.set(e.clientY - 200);
      if (!visible) setVisible(true);
    }
    function onLeave() {
      setVisible(false);
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [visible, x, y]);

  return (
    <motion.div
      aria-hidden
      style={{
        x: sx,
        y: sy,
        opacity: visible ? 1 : 0,
        background:
          "radial-gradient(circle at center, rgba(212,255,0,0.18), rgba(212,255,0,0.06) 35%, transparent 60%)",
      }}
      className="pointer-events-none fixed left-0 top-0 z-30 h-[400px] w-[400px] rounded-full blur-2xl mix-blend-screen transition-opacity duration-300"
    />
  );
}
