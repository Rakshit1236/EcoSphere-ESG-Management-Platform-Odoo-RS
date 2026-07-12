"use client";

import { useTheme } from "@/lib/theme-provider";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className={`inline-flex items-center justify-center w-9 h-9 rounded-lg border transition-all duration-200 cursor-pointer ${
        theme === "dark"
          ? "border-slate-700 bg-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-500/30"
          : "border-slate-200 bg-white text-slate-500 hover:text-amber-500 hover:border-amber-300"
      } ${className}`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}
