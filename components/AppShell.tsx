"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/theme-provider";
import {
  Leaf, Home, BarChart2, Users, Shield, Trophy, Target, Building, UserCheck,
  Brain, FileText, Bell, Search, Sun, Moon, LogOut, ChevronLeft, ChevronRight,
  Settings, X, Menu,
} from "lucide-react";

const NAV_GROUPS = [
  { label: "Overview", items: [
    { id: "/dashboard", label: "Dashboard", Icon: Home },
    { id: "/analytics", label: "Analytics", Icon: BarChart2 },
  ]},
  { label: "ESG Pillars", items: [
    { id: "/environmental", label: "Environmental", Icon: Leaf },
    { id: "/social", label: "Social", Icon: Users },
    { id: "/governance", label: "Governance", Icon: Shield },
  ]},
  { label: "Engagement", items: [
    { id: "/gamification", label: "Gamification", Icon: Trophy },
    { id: "/challenges", label: "Challenges", Icon: Target },
  ]},
  { label: "People", items: [
    { id: "/departments", label: "Departments", Icon: Building },
    { id: "/employees", label: "Employees", Icon: UserCheck },
  ]},
  { label: "Intelligence", items: [
    { id: "/ai-assistant", label: "AI Assistant", Icon: Brain },
    { id: "/reports", label: "Reports", Icon: FileText },
  ]},
];

const notifs = [
  { id: 1, title: "Carbon Budget Alert", body: "Scope 3 emissions 8% above Q4 target", time: "5m", read: false, type: "warning" },
  { id: 2, title: "Audit Complete", body: "ISO 14001 compliance audit passed — 94/100", time: "1h", read: false, type: "success" },
  { id: 3, title: "New Challenge", body: "Zero Waste Week starts Monday — earn 500 XP", time: "2h", read: false, type: "info" },
  { id: 4, title: "AI Insight", body: "LED upgrade in Building C saves ~42 tCO₂/yr", time: "4h", read: true, type: "ai" },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const { theme, toggle } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [nOpen, setNOpen] = useState(false);
  const [pOpen, setPOpen] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const left = collapsed ? 56 : 220;

  const crumbs: Record<string, string[]> = {
    "/dashboard": ["Overview", "Dashboard"],
    "/analytics": ["Overview", "Analytics"],
    "/environmental": ["ESG", "Environmental"],
    "/social": ["ESG", "Social"],
    "/governance": ["ESG", "Governance"],
    "/gamification": ["Engagement", "Gamification"],
    "/challenges": ["Engagement", "Challenges"],
    "/departments": ["People", "Departments"],
    "/employees": ["People", "Employees"],
    "/ai-assistant": ["Intelligence", "AI Assistant"],
    "/reports": ["Intelligence", "Reports"],
    "/profile": ["Account", "Profile"],
    "/settings": ["Account", "Settings"],
  };
  const trail = crumbs[pathname] || ["EcoSphere", pathname.slice(1)];
  const unread = notifs.filter(n => !n.read).length;
  const initials = session?.user?.name?.split(" ").map(n => n[0]).join("") || "?";

  return (
    <div className="min-h-screen bg-background">
      <motion.aside animate={{ width: collapsed ? 56 : 220 }} transition={{ duration: 0.2, ease: "easeInOut" }}
        className="fixed left-0 top-0 h-full bg-sidebar border-r border-sidebar-border flex flex-col z-30 overflow-hidden">
        <div className="h-16 flex items-center px-4 border-b border-sidebar-border flex-shrink-0">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="w-6 h-6 bg-primary/15 border border-primary/30 rounded-md flex items-center justify-center flex-shrink-0">
              <Leaf className="w-3 h-3 text-primary" />
            </div>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}
                className="font-display text-sm font-normal text-sidebar-foreground whitespace-nowrap tracking-wide">
                EcoSphere
              </motion.span>
            )}
          </div>
          <button onClick={() => setCollapsed(!collapsed)} className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0">
            {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          {NAV_GROUPS.map(g => (
            <div key={g.label} className="mb-4">
              {!collapsed && (
                <p className="px-4 text-[9px] font-sans font-medium text-muted-foreground/40 uppercase tracking-[0.22em] mb-1">{g.label}</p>
              )}
              {g.items.map(({ id, label, Icon }) => {
                const active = pathname === id;
                return (
                  <Link key={id} href={id}
                    className={cn("w-full flex items-center gap-3 px-4 py-2.5 transition-all duration-150 relative group",
                      active ? "text-primary bg-primary/[0.08]" : "text-muted-foreground hover:text-sidebar-foreground hover:bg-muted/40")}>
                    {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r" />}
                    <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                    {!collapsed && (
                      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="text-sm font-sans font-light whitespace-nowrap tracking-wide">{label}
                      </motion.span>
                    )}
                    {collapsed && (
                      <div className="absolute left-full ml-3 px-3 py-1.5 bg-card border border-border text-xs text-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 rounded-md shadow-lg font-sans">
                        {label}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="border-t border-sidebar-border px-4 py-3 flex-shrink-0">
          <Link href="/profile" className="flex items-center gap-2.5 overflow-hidden hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 bg-primary/15 border border-primary/30 rounded-full flex items-center justify-center text-primary text-[10px] font-sans font-medium flex-shrink-0">{initials}</div>
            {!collapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-w-0">
                <p className="text-xs font-sans text-sidebar-foreground truncate">{session?.user?.name}</p>
                <p className="text-[10px] font-sans text-muted-foreground truncate">{(session?.user as any)?.role || "Employee"}</p>
              </motion.div>
            )}
          </Link>
        </div>
      </motion.aside>

      <header className="fixed top-0 right-0 h-16 bg-background/90 backdrop-blur-xl border-b border-border flex items-center px-6 gap-5 z-20 transition-all duration-200"
        style={{ left }}>
        <div className="flex items-center gap-2 text-xs font-sans font-light tracking-widest flex-1 min-w-0">
          {trail.map((c, i) => (
            <span key={c} className="flex items-center gap-2">
              {i > 0 && <ChevronRight className="w-3 h-3 text-muted-foreground/25 flex-shrink-0" />}
              <span className={i === trail.length - 1 ? "text-foreground" : "text-muted-foreground"}>{c}</span>
            </span>
          ))}
        </div>
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground/35" />
          <input value={searchQ} onChange={e => setSearchQ(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && searchQ.trim()) router.push("/ai-assistant"); }} placeholder="Search…"
            className="w-48 pl-8 pr-3 py-1.5 text-xs font-sans bg-muted/50 border border-border/50 focus:outline-none focus:border-primary/30 text-foreground placeholder:text-muted-foreground/35 rounded-md tracking-wide" />
        </div>
        <button onClick={toggle} className="text-muted-foreground hover:text-foreground transition-colors">
          {theme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </button>
        <div className="relative">
          <button onClick={() => { setNOpen(!nOpen); setPOpen(false); }} className="relative text-muted-foreground hover:text-foreground transition-colors">
            <Bell className="w-3.5 h-3.5" />
            {unread > 0 && <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-primary rounded-full" />}
          </button>
          <AnimatePresence>
            {nOpen && (
              <motion.div initial={{ opacity: 0, y: 6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.97 }} transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-3 w-80 bg-card/96 backdrop-blur-2xl border border-border shadow-2xl rounded-xl overflow-hidden z-50">
                <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                  <p className="font-sans text-sm font-medium text-foreground">Notifications</p>
                  <span className="text-[10px] font-sans text-primary">{unread} new</span>
                </div>
                {notifs.map(n => (
                  <div key={n.id} className={cn("px-5 py-4 border-b border-border hover:bg-muted/30 transition-colors last:border-0", !n.read && "bg-primary/[0.05]")}>
                    <div className="flex items-start gap-3">
                      <div className={cn("w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0",
                        n.type === "success" ? "bg-primary" : n.type === "warning" ? "bg-amber-400" : n.type === "ai" ? "bg-[#8ab5a0]" : "bg-[#5b8a9a]")} />
                      <div>
                        <p className="text-xs font-sans font-medium text-foreground">{n.title}</p>
                        <p className="text-[11px] font-sans text-muted-foreground mt-0.5 leading-relaxed font-light">{n.body}</p>
                        <p className="text-[10px] font-sans text-muted-foreground/35 mt-1">{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="relative">
          <button onClick={() => { setPOpen(!pOpen); setNOpen(false); }}
            className="w-7 h-7 bg-primary/15 border border-primary/30 rounded-full flex items-center justify-center text-primary text-[10px] font-sans hover:bg-primary/25 transition-colors">
            {initials}
          </button>
          <AnimatePresence>
            {pOpen && (
              <motion.div initial={{ opacity: 0, y: 6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.97 }} transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-3 w-44 bg-card/96 backdrop-blur-2xl border border-border shadow-2xl rounded-xl overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-xs font-sans font-medium text-foreground">{session?.user?.name}</p>
                  <p className="text-[10px] font-sans text-muted-foreground font-light">{(session?.user as any)?.role || "Employee"}</p>
                </div>
                <Link href="/profile" className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-sans text-muted-foreground hover:text-foreground hover:bg-muted transition-colors tracking-wide"
                  onClick={() => setPOpen(false)}>
                  <Settings className="w-3 h-3" /> Profile
                </Link>
                <div className="border-t border-border">
                  <button onClick={() => signOut({ callbackUrl: "/login" })}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-sans text-red-400 hover:bg-muted transition-colors">
                    <LogOut className="w-3 h-3" /> Sign out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <main className="transition-all duration-200 pt-16 min-h-screen" style={{ paddingLeft: left }}>
        <div className="px-8 py-8 max-w-[1440px]">
          <AnimatePresence mode="wait">
            <motion.div key={pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <Link href="/ai-assistant"
        className="fixed bottom-8 right-8 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center z-40 shadow-2xl shadow-primary/30 hover:bg-primary/90 transition-colors">
        <Brain className="w-5 h-5" />
      </Link>
    </div>
  );
}
