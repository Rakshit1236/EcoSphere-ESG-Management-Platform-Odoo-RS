"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, X, Shield } from "lucide-react";
import AppShell from "@/components/AppShell";
import { GlassCard } from "@/components/ui/glass-card";
import { PageHdr } from "@/components/ui/page-header";
import { Chip } from "@/components/ui/chip";

const leaderboard = [
  { rank: 1, name: "Sarah Chen", dept: "HR", xp: 4820, badges: 12 },
  { rank: 2, name: "Marcus Webb", dept: "Engineering", xp: 4640, badges: 11 },
  { rank: 3, name: "Priya Nair", dept: "Product", xp: 4510, badges: 10 },
  { rank: 4, name: "James Okafor", dept: "Sales", xp: 4290, badges: 9 },
  { rank: 5, name: "Aisha Tanaka", dept: "Finance", xp: 4180, badges: 9 },
  { rank: 6, name: "Liam Torres", dept: "Operations", xp: 3960, badges: 8 },
  { rank: 7, name: "Elena Volkov", dept: "Engineering", xp: 3820, badges: 8 },
  { rank: 8, name: "Noah Baptiste", dept: "Product", xp: 3710, badges: 7 },
];

export default function EmployeesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");

  useEffect(() => {
    if (!session) router.push("/login");
  }, [session, router]);

  if (!session) return null;

  const role = (session?.user as any)?.role;
  const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";

  if (!isAdmin) {
    return (
      <AppShell>
        <div className="min-h-[70vh] flex items-center justify-center px-6">
          <div className="max-w-md mx-auto text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
              <Shield className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="font-display text-2xl font-normal text-foreground mb-3">Access Restricted</h2>
            <p className="text-sm font-sans text-muted-foreground mb-8 leading-relaxed">
              Employees is only available to Admin users. Your current role does not have access.
            </p>
            <div className="flex gap-3 justify-center">
              <motion.button onClick={() => router.push("/challenges")} whileHover={{ scale: 1.02 }}
                className="px-5 py-2.5 bg-primary text-primary-foreground text-xs font-sans font-medium rounded-md hover:bg-primary/90">
                View Challenges
              </motion.button>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    setShowInvite(false); setInviteEmail("");
  };

  return (
    <AppShell>
      <div className="space-y-7">
        <div className="flex items-end justify-between pt-1">
          <PageHdr tag="People" title="Employees." />
          <motion.button onClick={() => setShowInvite(true)} whileHover={{ scale: 1.02 }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-xs font-sans font-medium rounded-md">
            Invite <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>
        </div>

        <GlassCard dark hover={false} className="overflow-hidden border border-white/[0.07]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                {["Employee", "Department", "XP", "Badges", "ESG Score", "Status"].map(h => (
                  <th key={h} className="px-5 pb-4 pt-5 text-left text-[10px] font-sans text-muted-foreground uppercase tracking-[0.18em] font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leaderboard.map(u => (
                <tr key={u.rank} className="border-b border-border/30 hover:bg-muted/10 transition-colors last:border-0">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 bg-muted/50 border border-border rounded-full flex items-center justify-center text-[10px] font-sans text-muted-foreground flex-shrink-0">
                        {u.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <span className="text-sm font-sans font-light text-foreground">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm font-sans text-muted-foreground font-light">{u.dept}</td>
                  <td className="px-5 py-4 text-sm font-sans text-foreground">{u.xp.toLocaleString()}</td>
                  <td className="px-5 py-4 text-sm font-sans text-foreground">{u.badges}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1 bg-border rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${72 + u.rank * 2}%` }} />
                      </div>
                      <span className="text-xs font-sans text-foreground">{72 + u.rank * 2}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-4"><Chip tone="green">Active</Chip></td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      </div>

      <AnimatePresence>
        {showInvite && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowInvite(false)}>
            <motion.div initial={{ scale: 0.96, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 10 }}
              onClick={e => e.stopPropagation()}
              className="bg-card border border-border rounded-xl p-6 w-full max-w-sm shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-sans font-medium text-foreground text-sm">Invite Employee</h3>
                <button onClick={() => setShowInvite(false)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
              </div>
              <label className="text-[10px] font-sans text-muted-foreground/55 uppercase tracking-[0.2em] block mb-2">Email Address</label>
              <input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="colleague@company.com" type="email"
                className="w-full px-3.5 py-2.5 text-sm font-sans bg-muted/50 border border-border focus:outline-none focus:border-primary/40 text-foreground rounded-md mb-5" />
              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowInvite(false)} className="px-4 py-2 text-xs font-sans text-muted-foreground border border-border rounded-md hover:text-foreground">Cancel</button>
                <button onClick={handleInvite} className="px-4 py-2 text-xs font-sans bg-primary text-primary-foreground rounded-md hover:bg-primary/90">Send Invite</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
