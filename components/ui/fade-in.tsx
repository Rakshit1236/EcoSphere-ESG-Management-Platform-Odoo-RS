"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";

function cn(...c: (string | boolean | undefined | null)[]) {
  return c.filter(Boolean).join(" ");
}

export function FadeIn({ children, delay = 0, dir = "up", className }: {
  children: React.ReactNode; delay?: number;
  dir?: "up" | "down" | "left" | "right" | "none"; className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-8%" });
  const offsets: Record<string, { y: number; x: number }> = {
    up: { y: 40, x: 0 }, down: { y: -40, x: 0 }, left: { y: 0, x: -40 }, right: { y: 0, x: 40 }, none: { y: 0, x: 0 },
  };
  const { y, x } = offsets[dir];
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y, x }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.85, delay, ease: [0.22, 0.61, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}
