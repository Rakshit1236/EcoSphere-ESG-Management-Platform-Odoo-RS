"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { Leaf } from "lucide-react";
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

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [departmentCode, setDepartmentCode] = useState("");
  const [departments, setDepartments] = useState<{ id: string; name: string; code: string }[]>([]);

  useEffect(() => {
    fetch("/api/departments").then(r => r.json()).then(d => {
      const deps = d.departments || [];
      setDepartments(deps);
      if (deps.length > 0) setDepartmentCode(deps[0].code);
    });
  }, []);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, departmentCode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Signup failed");
        setLoading(false);
        return;
      }
      router.push("/login?signup=success");
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a1209] flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <ParallaxImg src="https://images.unsplash.com/photo-1760368799310-8f2c7120ed59?w=1920&h=1080&fit=crop&q=85" alt="Mountains" strength={40}
          className="absolute inset-0 w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1209]/10 to-[#0a1209]/70" />
        <div className="relative z-10 p-16 flex flex-col justify-end w-full">
          <h2 className="font-display text-white leading-tight mb-4"
            style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 300 }}>
            Join 400+ enterprises<br /><em className="italic text-primary">leading on ESG.</em>
          </h2>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <div className="flex items-center gap-2.5 mb-10">
            <Leaf className="w-4 h-4 text-primary" />
            <span className="font-display text-lg text-white">EcoSphere</span>
          </div>
          <p className="text-[10px] font-sans text-primary tracking-[0.4em] uppercase mb-4">New account</p>
          <h1 className="font-display text-white mb-2" style={{ fontSize: "clamp(2rem,5vw,2.75rem)", fontWeight: 300 }}>Get started.</h1>
          <p className="text-xs font-sans font-light text-white/28 mb-8">14-day free trial · No credit card required</p>

          <form onSubmit={handleSignup} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-sans">{error}</div>
            )}
            <div>
              <label className="text-[10px] font-sans text-white/28 uppercase tracking-[0.22em] block mb-2">Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Sarah Chen"
                className="w-full px-4 py-3 text-sm font-sans bg-white/[0.04] border border-white/10 focus:outline-none focus:border-primary/40 text-white/80 placeholder:text-white/18 rounded-lg" required />
            </div>
            <div>
              <label className="text-[10px] font-sans text-white/28 uppercase tracking-[0.22em] block mb-2">Work Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="sarah@company.com"
                className="w-full px-4 py-3 text-sm font-sans bg-white/[0.04] border border-white/10 focus:outline-none focus:border-primary/40 text-white/80 placeholder:text-white/18 rounded-lg" required />
            </div>
            <div>
              <label className="text-[10px] font-sans text-white/28 uppercase tracking-[0.22em] block mb-2">Department</label>
              <select value={departmentCode} onChange={e => setDepartmentCode(e.target.value)}
                className="w-full px-4 py-3 text-sm font-sans bg-white/[0.04] border border-white/10 focus:outline-none focus:border-primary/40 text-white/80 rounded-lg">
                {departments.map(d => (
                  <option key={d.code} value={d.code} className="bg-[#0a1209]">{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-sans text-white/28 uppercase tracking-[0.22em] block mb-2">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters"
                className="w-full px-4 py-3 text-sm font-sans bg-white/[0.04] border border-white/10 focus:outline-none focus:border-primary/40 text-white/80 placeholder:text-white/18 rounded-lg" required minLength={6} />
            </div>
            <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full mt-7 py-3.5 bg-primary text-primary-foreground font-sans font-medium text-sm tracking-widest uppercase rounded-lg hover:bg-primary/90 transition-all shadow-xl shadow-primary/20">
              {loading ? "Creating account..." : "Create account"}
            </motion.button>
          </form>
          <p className="text-center text-xs font-sans font-light text-white/28 mt-6">
            Already a member?{" "}<Link href="/login" className="text-primary hover:text-primary/80 transition-colors">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
