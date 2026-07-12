"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "motion/react";
import { Leaf, Brain, Globe, Zap, Trophy, Shield, Users, ArrowRight, Check, Star, Play, Sun, Moon, X, Menu } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { Chip } from "@/components/ui/chip";

function cn(...c: (string | boolean | undefined | null)[]) {
  return c.filter(Boolean).join(" ");
}

const P = {
  hero: "https://images.unsplash.com/photo-1511207538754-e8555f2bc187?w=1920&h=1080&fit=crop&q=85",
  wide: "https://images.unsplash.com/photo-1510694853838-e4a8c978f518?w=1920&h=900&fit=crop&q=80",
  env: "https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=1200&h=900&fit=crop&q=80",
  social: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=1200&h=900&fit=crop&q=80",
  gov: "https://images.unsplash.com/photo-1556983852-43bf21186b2a?w=1200&h=900&fit=crop&q=80",
  cta: "https://images.unsplash.com/photo-1760368799310-8f2c7120ed59?w=1920&h=1080&fit=crop&q=85",
  mist: "https://images.unsplash.com/photo-1783465824077-252403edf454?w=1920&h=900&fit=crop&q=80",
};

function ParallaxImg({ src, alt, strength = 80, className }: {
  src: string; alt: string; strength?: number; className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-strength, strength]);
  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <motion.div style={{ y }} className="w-full h-full scale-110 will-change-transform">
        <img src={src} alt={alt} className="w-full h-full object-cover" loading="lazy" />
      </motion.div>
    </div>
  );
}

function Marquee({ items }: { items: string[] }) {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden flex">
      <motion.div className="flex gap-8 shrink-0 items-center"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}>
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-8">
            <span className="text-[11px] font-sans font-light text-white/25 uppercase tracking-[0.22em] whitespace-nowrap">{item}</span>
            <span className="text-primary/30 text-xs flex-shrink-0">◆</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function ProgressBar({ value, label, note, color = "bg-primary" }: {
  value: number; label?: string; note?: string; color?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref}>
      {label && (
        <div className="flex justify-between text-xs font-sans mb-1.5">
          <span className="text-muted-foreground font-light">{label}{note ? ` · ${note}` : ""}</span>
          <span className="text-foreground">{value}%</span>
        </div>
      )}
      <div className="h-0.5 bg-border overflow-hidden rounded-full">
        <motion.div initial={{ width: 0 }} animate={inView ? { width: `${value}%` } : {}}
          transition={{ duration: 1.4, ease: [0.22, 0.61, 0.36, 1] }}
          className={cn("h-full rounded-full", color)} />
      </div>
    </div>
  );
}

function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mob, setMob] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMob(false);
  };

  return (
    <motion.header className={cn(
      "fixed top-0 inset-x-0 z-50 transition-all duration-500",
      scrolled ? "bg-[#060e07]/95 backdrop-blur-xl border-b border-white/5 py-4" : "bg-transparent py-7"
    )}>
      <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 bg-primary/20 border border-primary/40 rounded-md flex items-center justify-center">
            <Leaf className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="font-display text-lg font-normal text-white tracking-wide">EcoSphere</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {[{l:"Platform",t:"features"},{l:"Features",t:"features"},{l:"Pricing",t:"pricing"},{l:"About",t:"about"}].map(({l,t}) => (
            <button key={l} onClick={() => scrollTo(t)} className="text-[11px] font-sans font-light text-white/45 hover:text-white/90 transition-colors tracking-widest uppercase">{l}</button>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-5">
          <Link href="/login" className="text-[11px] font-sans font-light text-white/45 hover:text-white/90 transition-colors tracking-widest uppercase">Sign in</Link>
          <Link href="/signup">
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="px-5 py-2.5 bg-primary text-primary-foreground text-[11px] font-sans font-medium tracking-widest uppercase rounded-md hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
              Get started
            </motion.button>
          </Link>
        </div>
        <button className="md:hidden text-white/60" onClick={() => setMob(!mob)}>
          {mob ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      <AnimatePresence>
        {mob && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#060e07]/98 border-t border-white/5 px-8 pb-6 overflow-hidden">
            <div className="flex flex-col gap-4 pt-5">
              {[{l:"Platform",t:"features"},{l:"Features",t:"features"},{l:"Pricing",t:"pricing"},{l:"About",t:"about"}].map(({l,t}) => (
                <button key={l} onClick={() => scrollTo(t)} className="text-sm font-sans text-white/45 hover:text-white text-left uppercase tracking-widest">{l}</button>
              ))}
              <div className="flex gap-4 pt-2">
                <Link href="/login" className="text-sm font-sans text-white/45 uppercase tracking-widest">Sign in</Link>
                <Link href="/signup"><button className="px-5 py-2 bg-primary text-primary-foreground text-xs font-sans font-medium uppercase tracking-widest rounded-md">Get started</button></Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function HeroSection() {
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 700], [0, 200]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  const textY = useTransform(scrollY, [0, 500], [0, 100]);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#040b04]">
      <motion.div style={{ y: bgY }} className="absolute inset-0 scale-110 will-change-transform">
        <img src={P.hero} alt="Forest" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#040b04]/55 via-[#040b04]/35 to-[#040b04]" />
      </motion.div>
      <div className="absolute inset-0 opacity-[0.025] mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
      <motion.div style={{ y: textY, opacity }} className="relative z-10 text-center px-6 max-w-6xl mx-auto w-full">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.9 }}
          className="flex items-center justify-center gap-3 mb-12">
          <div className="h-px w-14 bg-primary/50" />
          <span className="text-[10px] font-sans font-light text-primary/90 tracking-[0.45em] uppercase">AI-Powered ESG Management</span>
          <div className="h-px w-14 bg-primary/50" />
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 1.1, ease: [0.22, 0.61, 0.36, 1] }}
          className="font-display text-white leading-[0.88] tracking-tight mb-10"
          style={{ fontSize: "clamp(4rem,13vw,10.5rem)", fontWeight: 300 }}>
          Where<br /><em className="italic">Intelligence</em><br />Meets Nature.
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85, duration: 0.9 }}
          className="text-white/45 font-sans font-light text-lg max-w-lg mx-auto mb-14 leading-relaxed">
          The enterprise ESG platform that transforms sustainability data into competitive advantage.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.05, duration: 0.9 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5">
          <Link href="/signup">
            <motion.button whileHover={{ scale: 1.04, y: -3 }} whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2.5 px-9 py-4 bg-primary text-primary-foreground font-sans font-medium text-sm tracking-widest uppercase rounded-lg hover:bg-primary/90 shadow-2xl shadow-primary/25 transition-colors">
              Start free trial <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
          <motion.button onClick={() => document.getElementById("ai")?.scrollIntoView({ behavior: "smooth" })} whileHover={{ scale: 1.03 }}
            className="flex items-center gap-2.5 px-9 py-4 border border-white/20 text-white/65 hover:text-white hover:border-white/40 font-sans font-light text-sm tracking-widest uppercase rounded-lg transition-all">
            <Play className="w-3.5 h-3.5" /> View demo
          </motion.button>
        </motion.div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5 pointer-events-none">
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
          className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent" />
        <span className="text-[9px] font-sans text-white/25 tracking-[0.35em] uppercase">Explore</span>
      </motion.div>
    </section>
  );
}

function TickerBar() {
  return (
    <div className="py-5 bg-[#0c1609] border-y border-white/[0.05]">
      <Marquee items={["Carbon Tracking", "GRI Standards", "TCFD Aligned", "ISO 14001", "Scope 1 · 2 · 3", "AI-Powered Insights", "DEI Analytics", "Supply Chain ESG", "Board Governance", "CDP Reporting", "Net Zero Roadmaps", "Employee Wellbeing"]} />
    </div>
  );
}

function FeaturesSection() {
  const features = [
    { Icon: Brain, title: "AI-Powered Insights", desc: "Predictive analytics that surface opportunities and anomalies before they become problems.", color: "text-primary" },
    { Icon: Globe, title: "Framework Alignment", desc: "GRI, TCFD, CDP, SASB, UN SDGs — all covered with automated framework mapping.", color: "text-[#8ab5a0]" },
    { Icon: Zap, title: "Real-Time Carbon", desc: "Live Scope 1–3 emissions data with AI-powered forecasting and scenario modelling.", color: "text-[#c8a96e]" },
    { Icon: Trophy, title: "Gamification Engine", desc: "Challenges, badges, leaderboards and XP that make sustainability engaging company-wide.", color: "text-[#9b8bb4]" },
    { Icon: Shield, title: "Governance Automation", desc: "Policy management, compliance automation, and audit-readiness — always current.", color: "text-[#5b8a9a]" },
    { Icon: Users, title: "People & DEI Analytics", desc: "Pay equity analysis, board diversity tracking, and employee wellbeing dashboards.", color: "text-[#8ab5a0]" },
  ];
  return (
    <section id="features" className="bg-[#f2ede3] py-32 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-end mb-20">
          <FadeIn>
            <p className="text-[10px] font-sans text-[#1c5c34] tracking-[0.45em] uppercase mb-6">The platform</p>
            <h2 className="font-display text-[#0e1a10] leading-tight"
              style={{ fontSize: "clamp(2.5rem,6vw,4.5rem)", fontWeight: 300 }}>
              A complete ESG system,<br /><em className="italic">built for enterprise.</em>
            </h2>
          </FadeIn>
          <FadeIn delay={0.15} dir="left">
            <p className="text-[#586358] font-sans font-light text-lg leading-relaxed mb-8">
              Every tool your sustainability team needs, unified in one intelligent platform. From carbon accounting to board governance — nothing falls through the cracks.
            </p>
            <Link href="/signup" className="flex items-center gap-2 text-sm font-sans font-medium text-[#1c5c34] hover:gap-4 transition-all duration-200 tracking-widest uppercase">
              Explore the platform <ArrowRight className="w-4 h-4" />
            </Link>
          </FadeIn>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <FadeIn key={f.title} delay={i * 0.08}>
              <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.22 }}
                className="bg-white/70 backdrop-blur-sm border border-[#0e1a10]/[0.06] p-8 rounded-xl hover:shadow-2xl hover:shadow-[#1c5c34]/[0.08] transition-shadow cursor-default">
                <div className={cn("mb-6 w-10 h-10 rounded-lg bg-current/10 flex items-center justify-center", f.color)}>
                  <f.Icon className="w-5 h-5" />
                </div>
                <h3 className="font-sans font-medium text-[#0e1a10] text-sm mb-3 tracking-wide">{f.title}</h3>
                <p className="text-sm font-sans text-[#586358] font-light leading-relaxed">{f.desc}</p>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function PillarsSection() {
  const pillars = [
    {
      tag: "Environmental", tagTone: "green" as const,
      title: "Measure every\nimpact.",
      desc: "Real-time Scope 1–3 carbon tracking, renewable energy monitoring, water and waste analytics — powered by AI forecasting that tells you where to act first.",
      img: P.env, stat: "18.4%", statLabel: "avg. carbon reduction Year 1",
      accentColor: "#56b874",
      features: ["Scope 1, 2 & 3 emissions", "AI carbon forecasting", "Renewable energy tracking", "ISO 14001 aligned"],
    },
    {
      tag: "Social", tagTone: "sage" as const,
      title: "People are\nthe measure.",
      desc: "CSR program management, employee wellness tracking, DEI analytics, volunteer hours, and community investment — all unified into a single social impact score.",
      img: P.social, stat: "3×", statLabel: "CSR participation with gamification",
      accentColor: "#8ab5a0",
      features: ["DEI metrics & equity", "Employee wellness programs", "CSR challenge engine", "Community impact reporting"],
    },
    {
      tag: "Governance", tagTone: "gold" as const,
      title: "Integrity at\nevery layer.",
      desc: "Policy library, audit scheduling, compliance dashboards, risk matrices, and board diversity analytics — aligned to GRI, TCFD, CDP, and all major global frameworks.",
      img: P.gov, stat: "94%", statLabel: "average compliance rate",
      accentColor: "#c8a96e",
      features: ["Policy management", "Compliance automation", "Risk register", "Board diversity charter"],
    },
  ];

  return (
    <div className="bg-[#0a1209]">
      {pillars.map((p, idx) => (
        <section key={p.tag} className="relative min-h-screen flex items-center overflow-hidden">
          <div className="absolute inset-0">
            <ParallaxImg src={p.img} alt={p.tag} strength={55} className="absolute inset-0 w-full h-full" />
            <div className={cn("absolute inset-0", idx % 2 === 0
              ? "bg-gradient-to-r from-[#0a1209] via-[#0a1209]/85 to-[#0a1209]/20"
              : "bg-gradient-to-l from-[#0a1209] via-[#0a1209]/85 to-[#0a1209]/20")} />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-8 w-full py-28">
            <div className={cn("flex", idx % 2 === 0 ? "justify-start" : "justify-end")}>
              <div className="max-w-xl">
                <FadeIn delay={0.1}><Chip tone={p.tagTone}>{p.tag}</Chip></FadeIn>
                <FadeIn delay={0.2}>
                  <h2 className="font-display text-white leading-[0.92] mt-6 mb-6 whitespace-pre-line"
                    style={{ fontSize: "clamp(3rem,7vw,5.5rem)", fontWeight: 300 }}>
                    {p.title}
                  </h2>
                </FadeIn>
                <FadeIn delay={0.3}>
                  <p className="text-white/50 font-sans font-light text-lg leading-relaxed mb-8">{p.desc}</p>
                </FadeIn>
                <FadeIn delay={0.35}>
                  <div className="flex items-baseline gap-3 mb-8 pb-8 border-b border-white/10">
                    <span className="font-display leading-none" style={{ fontSize: "clamp(3rem,6vw,5rem)", fontWeight: 300, color: p.accentColor }}>{p.stat}</span>
                    <span className="text-sm font-sans text-white/40 font-light max-w-[180px] leading-snug">{p.statLabel}</span>
                  </div>
                </FadeIn>
                <div className="grid grid-cols-2 gap-3.5">
                  {p.features.map((f, fi) => (
                    <FadeIn key={f} delay={0.4 + fi * 0.07}>
                      <div className="flex items-center gap-2.5">
                        <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: p.accentColor }} />
                        <span className="text-sm font-sans text-white/60 font-light">{f}</span>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className={cn("absolute bottom-8 text-[10px] font-sans text-white/15 tracking-[0.35em] uppercase",
            idx % 2 === 0 ? "right-8" : "left-8")}>
            {String(idx + 1).padStart(2, "0")} / 03
          </div>
        </section>
      ))}
    </div>
  );
}

function StatsSection() {
  const stats = [
    { v: "400+", l: "Enterprise clients", s: "across 38 countries" },
    { v: "87.4", l: "Avg. ESG score", s: "top 12% of industry" },
    { v: "18.4%", l: "Carbon reduction", s: "average in Year 1" },
    { v: "3×", l: "CSR participation", s: "vs. industry baseline" },
  ];
  return (
    <section className="relative bg-[#060e06] py-32 px-8 overflow-hidden">
      <div className="absolute inset-0 opacity-15">
        <ParallaxImg src={P.mist} alt="" strength={35} className="w-full h-full" />
        <div className="absolute inset-0 bg-[#060e06]/70" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto">
        <FadeIn>
          <p className="text-[10px] font-sans font-light text-primary tracking-[0.45em] uppercase mb-16 text-center">By the numbers</p>
        </FadeIn>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.04]">
          {stats.map((s, i) => (
            <FadeIn key={s.l} delay={i * 0.1}>
              <div className="bg-[#060e06] p-10 text-center hover:bg-white/[0.025] transition-colors group">
                <p className="font-display text-white leading-none mb-3 group-hover:text-primary transition-colors duration-300"
                  style={{ fontSize: "clamp(3rem,6vw,5rem)", fontWeight: 300 }}>{s.v}</p>
                <p className="text-sm font-sans font-medium text-white/60 mb-1">{s.l}</p>
                <p className="text-xs font-sans text-white/25 font-light">{s.s}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function AiSection() {
  const convo = [
    { r: "u", t: "What's driving our Scope 3 increase this quarter?" },
    { r: "a", t: "Your Scope 3 rose 8.3% above Q4 target. Three suppliers — Apex, DataCore, and NovaTech — account for 31% of Scope 3 footprint. I can generate supplier audit templates right now." },
    { r: "u", t: "Yes, generate the audits." },
    { r: "a", t: "Done. Three audit templates are ready in Reports, pre-filled with Q4 baseline data. Also: switching Building C to LED saves ~42 tCO₂/yr with a 14-month payback." },
  ];
  return (
    <section id="ai" className="relative py-32 px-8 bg-[#0a1209] overflow-hidden">
      <div className="absolute inset-0 opacity-8">
        <ParallaxImg src={P.wide} alt="" strength={25} className="w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1209] via-[#0a1209]/60 to-[#0a1209]" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <FadeIn>
            <p className="text-[10px] font-sans font-light text-primary tracking-[0.45em] uppercase mb-6">Intelligence</p>
            <h2 className="font-display text-white leading-tight mb-6"
              style={{ fontSize: "clamp(2.5rem,6vw,4.5rem)", fontWeight: 300 }}>
              The AI that acts,<br /><em className="italic" style={{ color: "#56b874" }}>not just reports.</em>
            </h2>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="text-white/45 font-sans font-light text-lg leading-relaxed mb-8">
              EcoSphere AI identifies anomalies, generates audit templates, forecasts trajectories, and builds roadmaps — automatically, without needing to be asked.
            </p>
          </FadeIn>
          <div className="space-y-0 mb-10">
            {[
              { l: "Anomaly detection", s: "Flag risks before they escalate" },
              { l: "Predictive forecasting", s: "12-month carbon trajectory models" },
              { l: "Auto-generated reports", s: "GRI, TCFD, CDP — one click" },
              { l: "Natural language queries", s: "Ask anything about your ESG data" },
            ].map((item, i) => (
              <FadeIn key={item.l} delay={0.2 + i * 0.08}>
                <div className="flex items-start gap-4 py-4 border-b border-white/[0.06]">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-sans font-medium text-white/80">{item.l}</p>
                    <p className="text-xs font-sans text-white/30 font-light mt-0.5">{item.s}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.5}>
            <Link href="/signup" className="flex items-center gap-2.5 text-sm font-sans font-medium text-primary hover:gap-5 transition-all duration-200 tracking-widest uppercase">
              Try AI Assistant <ArrowRight className="w-4 h-4" />
            </Link>
          </FadeIn>
        </div>
        <FadeIn delay={0.2} dir="left">
          <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/[0.07] rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-primary/20 border border-primary/40 rounded-lg flex items-center justify-center">
                  <Brain className="w-3.5 h-3.5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-sans font-medium text-white">EcoSphere AI</p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                    <p className="text-[10px] font-sans text-white/30">Online</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-5 space-y-4 min-h-[300px]">
              {convo.map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.5 }}
                  className={cn("flex gap-3", m.r === "u" ? "flex-row-reverse" : "")}>
                  <div className={cn("w-6 h-6 rounded-md border flex items-center justify-center text-[9px] flex-shrink-0 mt-0.5 font-sans",
                    m.r === "a" ? "bg-primary/20 border-primary/30 text-primary" : "bg-white/10 border-white/10 text-white/40")}>
                    {m.r === "a" ? "AI" : "U"}
                  </div>
                  <div className={cn("text-[12px] font-sans font-light leading-relaxed px-3.5 py-2.5 rounded-lg max-w-[80%]",
                    m.r === "a" ? "bg-white/[0.05] text-white/70" : "bg-primary/10 text-white/80 border border-primary/20")}>
                    {m.t}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const ts = [
    { q: "EcoSphere transformed how we communicate sustainability. Our ESG score improved 14 points in one year and board confidence has never been higher.", name: "Alexandra Müller", title: "Chief Sustainability Officer", co: "Bosch AG" },
    { q: "The AI assistant alone saves our team 20+ hours per month. It surfaces insights we'd have missed entirely and drafts reports in minutes.", name: "David Park", title: "ESG Lead", co: "Samsung SDI" },
    { q: "Gamification drove 3× CSR participation across 18,000 employees. Making sustainability genuinely engaging was the missing piece.", name: "Chiara Ricci", title: "Head of ESG", co: "UniCredit" },
  ];
  return (
    <section id="about" className="bg-[#f2ede3] py-32 px-8">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <div className="flex items-center gap-6 mb-20">
            <p className="text-[10px] font-sans text-[#1c5c34] tracking-[0.45em] uppercase whitespace-nowrap">What they say</p>
            <div className="flex-1 h-px bg-[#0e1a10]/10" />
          </div>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ts.map((t, i) => (
            <FadeIn key={t.name} delay={i * 0.12}>
              <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.25 }}
                className="bg-white/65 backdrop-blur-sm border border-[#0e1a10]/[0.06] rounded-2xl p-8 shadow-sm hover:shadow-2xl hover:shadow-[#1c5c34]/[0.08] transition-shadow h-full flex flex-col">
                <div className="flex gap-0.5 mb-6">
                  {[0, 1, 2, 3, 4].map(s => <Star key={s} className="w-3.5 h-3.5 fill-[#1c5c34] text-[#1c5c34]" />)}
                </div>
                <p className="font-display text-[#0e1a10]/90 text-xl leading-relaxed mb-8 italic flex-1" style={{ fontWeight: 300 }}>
                  &ldquo;{t.q}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-6 border-t border-[#0e1a10]/[0.07]">
                  <div className="w-9 h-9 bg-[#1c5c34]/10 border border-[#1c5c34]/20 rounded-full flex items-center justify-center text-[10px] font-sans font-medium text-[#1c5c34]">
                    {t.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-xs font-sans font-medium text-[#0e1a10]">{t.name}</p>
                    <p className="text-[10px] font-sans text-[#586358] font-light">{t.title} · {t.co}</p>
                  </div>
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  const plans = [
    { name: "Starter", price: "$299", per: "/mo", desc: "For growing teams beginning their ESG journey.",
      features: ["Up to 250 employees", "Carbon tracking", "ESG dashboard", "2 ESG modules", "Standard reports"],
      cta: "Get started", featured: false },
    { name: "Professional", price: "$899", per: "/mo", desc: "For mid-size companies with active ESG programs.",
      features: ["Up to 2,500 employees", "All ESG modules", "AI Assistant", "Gamification engine", "GRI & TCFD reports"],
      cta: "Start free trial", featured: true },
    { name: "Enterprise", price: "Custom", per: "", desc: "For large organisations with complex requirements.",
      features: ["Unlimited employees", "Custom integrations", "Dedicated CSM", "White-label options", "SLA guarantee"],
      cta: "Contact sales", featured: false },
  ];
  return (
    <section id="pricing" className="bg-[#050c05] py-32 px-8 overflow-hidden relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-primary/[0.06] rounded-full blur-3xl pointer-events-none" />
      <div className="relative z-10 max-w-7xl mx-auto">
        <FadeIn>
          <p className="text-[10px] font-sans font-light text-primary tracking-[0.45em] uppercase mb-4 text-center">Plans</p>
          <h2 className="font-display text-white text-center leading-tight mb-4"
            style={{ fontSize: "clamp(2.5rem,6vw,4rem)", fontWeight: 300 }}>
            Simple, transparent pricing.
          </h2>
          <p className="text-white/35 font-sans font-light text-center mb-16 text-sm">14-day free trial on all plans. No credit card required.</p>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((p, i) => (
            <FadeIn key={p.name} delay={i * 0.1}>
              <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.22 }}
                className={cn("relative rounded-2xl p-8 border h-full flex flex-col",
                  p.featured
                    ? "bg-primary/10 border-primary/30 shadow-2xl shadow-primary/10"
                    : "bg-white/[0.03] border-white/[0.07] hover:bg-white/[0.05] transition-colors")}>
                {p.featured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-[10px] font-sans font-medium px-4 py-1.5 rounded-full tracking-widest uppercase shadow-lg shadow-primary/30">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <p className="font-sans font-medium text-white/80 mb-1.5 tracking-wide">{p.name}</p>
                  <p className="text-xs font-sans text-white/30 font-light">{p.desc}</p>
                </div>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="font-display text-white leading-none"
                    style={{ fontSize: "clamp(2.5rem,5vw,3.5rem)", fontWeight: 300 }}>{p.price}</span>
                  {p.per && <span className="text-sm font-sans text-white/30">{p.per}</span>}
                </div>
                <div className="space-y-3.5 mb-8 flex-1">
                  {p.features.map(f => (
                    <div key={f} className="flex items-center gap-3">
                      <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      <span className="text-sm font-sans font-light text-white/55">{f}</span>
                    </div>
                  ))}
                </div>
                <Link href="/signup">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className={cn("w-full py-3.5 font-sans font-medium text-sm tracking-widest uppercase rounded-lg transition-all",
                      p.featured
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl shadow-primary/20"
                        : "border border-white/20 text-white/65 hover:text-white hover:border-white/40")}>
                    {p.cta}
                  </motion.button>
                </Link>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);
  const faqs = [
    { q: "What ESG frameworks does EcoSphere support?", a: "GRI Standards, TCFD, CDP, SASB, UN SDGs, and ISO 14001. Custom framework mapping available for EU CSRD and SEC climate disclosure rules." },
    { q: "How does the AI carbon forecasting work?", a: "Our models train on your historical emissions data combined with industry benchmarks and real-time external datasets, predicting 12-month trajectories and ROI-ranked reduction opportunities." },
    { q: "Can EcoSphere integrate with our existing systems?", a: "Native integrations with Workday, SAP, Salesforce, Oracle, NetSuite, and 50+ enterprise systems via REST API. Custom connectors available on Enterprise plans." },
    { q: "Is ESG data secure and compliant?", a: "SOC 2 Type II certified, GDPR and CCPA compliant, AES-256 encryption at rest, TLS 1.3 in transit. EU, US, and APAC data residency options." },
    { q: "How quickly will we see ESG improvement?", a: "Most customers see measurable improvement within 6–12 months. Average ESG score improvement in Year 1 is 11.4 points across our customer base." },
  ];
  return (
    <section className="bg-[#f2ede3] py-32 px-8">
      <div className="max-w-3xl mx-auto">
        <FadeIn>
          <p className="text-[10px] font-sans text-[#1c5c34] tracking-[0.45em] uppercase mb-5">Answers</p>
          <h2 className="font-display text-[#0e1a10] leading-tight mb-16"
            style={{ fontSize: "clamp(2.5rem,5vw,3.5rem)", fontWeight: 300 }}>
            Common questions.
          </h2>
        </FadeIn>
        {faqs.map((f, i) => (
          <FadeIn key={i} delay={i * 0.06}>
            <div className="border-b border-[#0e1a10]/[0.08]">
              <button onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between py-6 text-left group">
                <span className="font-sans font-light text-[#0e1a10] text-base pr-8 group-hover:text-[#1c5c34] transition-colors">{f.q}</span>
                <motion.span animate={{ rotate: open === i ? 45 : 0 }} transition={{ duration: 0.2 }}
                  className="text-[#1c5c34] text-2xl flex-shrink-0 leading-none font-light">+</motion.span>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="overflow-hidden">
                    <p className="pb-6 text-sm font-sans font-light text-[#586358] leading-relaxed">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

function CtaSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-60, 60]);
  const [email, setEmail] = useState("");

  return (
    <section ref={ref} className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#040b04]">
      <motion.div style={{ y }} className="absolute inset-0 scale-110 will-change-transform">
        <img src={P.cta} alt="Mountain peaks" className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#040b04] via-[#040b04]/75 to-[#040b04]/45" />
      </motion.div>
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <FadeIn>
          <p className="text-[10px] font-sans font-light text-primary tracking-[0.45em] uppercase mb-8">Get started</p>
          <h2 className="font-display text-white leading-[0.88] mb-6"
            style={{ fontSize: "clamp(3.5rem,10vw,8rem)", fontWeight: 300 }}>
            Begin your<br /><em className="italic text-primary">ESG journey.</em>
          </h2>
          <p className="text-white/40 font-sans font-light text-base mb-12">
            No credit card required · Cancel at any time<br />Trusted by 400+ enterprises worldwide.
          </p>
        </FadeIn>
        <FadeIn delay={0.2}>
          <Link href="/signup">
            <motion.button whileHover={{ scale: 1.04, y: -3 }} whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2.5 px-10 py-4 bg-primary text-primary-foreground font-sans font-medium text-sm tracking-widest uppercase rounded-xl hover:bg-primary/90 shadow-2xl shadow-primary/30 mx-auto mb-16 transition-colors">
              Start free trial <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
          <div className="max-w-sm mx-auto">
            <p className="text-[10px] font-sans text-white/20 tracking-[0.25em] uppercase mb-4">Weekly ESG insights, straight to your inbox</p>
            <div className="flex border border-white/12 rounded-lg overflow-hidden bg-white/[0.04] backdrop-blur-sm">
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="your@company.com"
                className="flex-1 px-4 py-3 text-xs font-sans bg-transparent text-white placeholder:text-white/20 focus:outline-none" />
              <button onClick={() => { if (email) { setEmail(""); alert("Thank you! You've been subscribed."); } }} className="px-5 border-l border-white/10 text-xs font-sans text-primary hover:bg-primary/10 transition-colors tracking-widest uppercase">Subscribe</button>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

const FOOTER_ROUTES: Record<string, string> = {
  Dashboard: "/dashboard", Environmental: "/environmental", Social: "/social",
  Governance: "/governance", Analytics: "/analytics", Documentation: "/reports",
  "API Reference": "/ai-assistant", Blog: "/reports", Webinars: "/ai-assistant",
  About: "#about", Careers: "/employees", Press: "/reports", Contact: "/login",
};
function Footer() {
  return (
    <footer className="bg-[#040b04] border-t border-white/[0.05] px-8 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start justify-between gap-12 mb-14">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 bg-primary/20 border border-primary/40 rounded-md flex items-center justify-center">
                <Leaf className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="font-display text-lg text-white">EcoSphere</span>
            </div>
            <p className="text-xs font-sans font-light text-white/25 leading-relaxed">
              The AI-powered ESG management platform for enterprise sustainability leaders.
            </p>
          </div>
          {[
            { title: "Platform", links: ["Dashboard", "Environmental", "Social", "Governance", "Analytics"] },
            { title: "Resources", links: ["Documentation", "API Reference", "Blog", "Webinars"] },
            { title: "Company", links: ["About", "Careers", "Press", "Contact"] },
          ].map(col => (
            <div key={col.title}>
              <p className="text-[9px] font-sans text-white/20 uppercase tracking-[0.3em] mb-4">{col.title}</p>
              <div className="space-y-2.5">
                {col.links.map(l => {
                  const route = FOOTER_ROUTES[l];
                  return route?.startsWith("#") ? (
                    <button key={l} onClick={() => document.getElementById(route.slice(1))?.scrollIntoView({ behavior: "smooth" })}
                      className="block text-xs font-sans font-light text-white/30 hover:text-white/65 transition-colors">{l}</button>
                  ) : (
                    <Link key={l} href={route || "/login"}
                      className="block text-xs font-sans font-light text-white/30 hover:text-white/65 transition-colors">{l}</Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-white/[0.05] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-sans text-white/18">© 2025 EcoSphere Technologies, Inc.</p>
          <div className="flex items-center gap-6">
            {["Privacy", "Terms", "Security"].map(l => (
              <Link key={l} href="/login" className="text-[10px] font-sans text-white/18 hover:text-white/40 transition-colors">{l}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <LandingNav />
      <HeroSection />
      <TickerBar />
      <FeaturesSection />
      <PillarsSection />
      <StatsSection />
      <AiSection />
      <TestimonialsSection />
      <PricingSection />
      <FaqSection />
      <CtaSection />
      <Footer />
    </div>
  );
}
