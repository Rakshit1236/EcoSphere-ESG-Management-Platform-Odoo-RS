"use client";

import { motion } from "motion/react";

function cn(...c: (string | boolean | undefined | null)[]) {
  return c.filter(Boolean).join(" ");
}

export function GlassCard({ children, className, hover = true, dark = false, onClick }: {
  children: React.ReactNode; className?: string; hover?: boolean; dark?: boolean; onClick?: () => void;
}) {
  return (
    <motion.div onClick={onClick}
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "relative overflow-hidden rounded-lg",
        dark
          ? "bg-white/[0.035] backdrop-blur-xl border border-white/[0.07] shadow-2xl"
          : "bg-white/65 backdrop-blur-xl border border-white/60 shadow-xl",
        className
      )}>
      {children}
    </motion.div>
  );
}
