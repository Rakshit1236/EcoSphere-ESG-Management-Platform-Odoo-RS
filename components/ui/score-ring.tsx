"use client";

import { motion } from "motion/react";

export function ScoreRing({ score, size = 120, color = "#56b874" }: { score: number; size?: number; color?: string }) {
  const r = size / 2 - 10;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/10" />
        <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="2"
          strokeLinecap="round" strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (score / 100) * c }}
          transition={{ duration: 2, ease: "easeOut" }} />
      </svg>
      <div className="absolute text-center">
        <p className="font-display text-3xl font-normal text-white">{score}</p>
        <p className="text-[9px] font-sans text-white/40 tracking-widest uppercase mt-0.5">ESG</p>
      </div>
    </div>
  );
}
