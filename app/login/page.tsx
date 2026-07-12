"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { motion } from "motion/react";
import { Leaf, Eye, EyeOff } from "lucide-react";
import { useScroll, useTransform } from "motion/react";

function ParallaxImg({ src, alt, strength = 40, className }: {
  src: string; alt: string; strength?: number; className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-strength, strength]);
  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }} className="w-full h-full scale-110 will-change-transform">
        <img src={src} alt={alt} className="w-full h-full object-cover" loading="lazy" />
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push("/gamification");
    }
  }

  return (
    <div className="min-h-screen bg-[#0a1209] flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <ParallaxImg src="https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=1200&h=900&fit=crop&q=80" alt="Forest" strength={40}
          className="absolute inset-0 w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1209]/10 to-[#0a1209]/65" />
        <div className="relative z-10 p-16 flex flex-col justify-between w-full">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-primary/20 border border-primary/40 rounded-md flex items-center justify-center">
              <Leaf className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="font-display text-lg font-normal text-white">EcoSphere</span>
          </div>
          <div>
            <h2 className="font-display text-white leading-tight mb-4"
              style={{ fontSize: "clamp(2.5rem,5vw,3.5rem)", fontWeight: 300 }}>
              Manage your entire<br /><em className="italic text-primary">ESG program.</em>
            </h2>
            <p className="text-white/45 font-sans font-light text-sm leading-relaxed max-w-xs">
              Real-time tracking, AI insights, and automated reporting for the enterprises shaping a sustainable future.
            </p>
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <Leaf className="w-4 h-4 text-primary" />
            <span className="font-display text-lg text-white">EcoSphere</span>
          </div>
          <p className="text-[10px] font-sans text-primary tracking-[0.4em] uppercase mb-4">Welcome back</p>
          <h1 className="font-display text-white mb-8" style={{ fontSize: "clamp(2rem,5vw,2.75rem)", fontWeight: 300 }}>Sign in.</h1>

          <button className="w-full flex items-center justify-center gap-3 py-3.5 border border-white/12 text-sm font-sans font-light text-white/60 hover:border-white/25 hover:text-white transition-all mb-6 rounded-lg">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-white/[0.07]" /><span className="text-[10px] font-sans text-white/18 tracking-widest uppercase">or</span><div className="flex-1 h-px bg-white/[0.07]" />
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-sans">{error}</div>
            )}
            <div>
              <label className="text-[10px] font-sans text-white/28 uppercase tracking-[0.22em] block mb-2">Email</label>
              <input value={email} onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 text-sm font-sans bg-white/[0.04] border border-white/10 focus:outline-none focus:border-primary/40 text-white/80 placeholder:text-white/18 rounded-lg" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] font-sans text-white/28 uppercase tracking-[0.22em]">Password</label>
                <button type="button" className="text-[10px] font-sans text-primary/70 hover:text-primary transition-colors">Forgot?</button>
              </div>
              <div className="relative">
                <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 text-sm font-sans bg-white/[0.04] border border-white/10 focus:outline-none focus:border-primary/40 text-white/80 rounded-lg" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors">
                  {showPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
            <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full mt-7 py-3.5 bg-primary text-primary-foreground font-sans font-medium text-sm tracking-widest uppercase rounded-lg hover:bg-primary/90 transition-all shadow-xl shadow-primary/20">
              {loading ? "Signing in..." : "Sign in"}
            </motion.button>
          </form>
          <p className="text-center text-xs font-sans font-light text-white/28 mt-6">
            No account?{" "}<Link href="/signup" className="text-primary hover:text-primary/80 transition-colors">Create one</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
