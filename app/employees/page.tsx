"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
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

  useEffect(() => {
    if (!session) router.push("/login");
  }, [session, router]);

  if (!session) return null;

  return (
    <AppShell>
      <div className="space-y-7">
        <div className="flex items-end justify-between pt-1">
          <PageHdr tag="People" title="Employees." />
          <motion.button whileHover={{ scale: 1.02 }}
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
    </AppShell>
  );
}
