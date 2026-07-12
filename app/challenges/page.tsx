"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "motion/react";
import { Plus, Zap, Users, ArrowRight } from "lucide-react";
import AppShell from "@/components/AppShell";
import { GlassCard } from "@/components/ui/glass-card";
import { PageHdr } from "@/components/ui/page-header";
import { Chip } from "@/components/ui/chip";

const list = [
  { n: "Zero Waste Week", d: "Eliminate all single-use plastics for 7 days", xp: 500, p: 847, days: 4, type: "Environmental" },
  { n: "Carbon-Free Commute", d: "Walk, bike, or use transit for 2 weeks", xp: 750, p: 623, days: 11, type: "Environmental" },
  { n: "Paperless Office", d: "Go fully digital for an entire month", xp: 400, p: 1204, days: 18, type: "Operational" },
  { n: "Volunteer Day", d: "Spend 8 hours on a community service project", xp: 600, p: 389, days: 6, type: "Social" },
  { n: "Energy Audit", d: "Identify 5 energy waste spots in your workspace", xp: 350, p: 712, days: 25, type: "Environmental" },
  { n: "Sustainable Lunch", d: "Eat plant-based lunches for 5 consecutive days", xp: 300, p: 956, days: 3, type: "Social" },
];

export default function ChallengesPage() {
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
          <PageHdr tag="Engagement" title="Challenges." sub="Active sustainability challenges — earn XP and badges" />
          <motion.button whileHover={{ scale: 1.02 }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-xs font-sans font-medium rounded-md">
            Create <Plus className="w-3.5 h-3.5" />
          </motion.button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {list.map((c, i) => (
            <motion.div key={c.n} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <GlassCard dark hover className="p-6 border border-white/[0.07]">
                <div className="flex items-start justify-between mb-4">
                  <Chip tone={c.type === "Environmental" ? "green" : c.type === "Social" ? "blue" : "muted"}>{c.type}</Chip>
                  <div className="flex items-center gap-1.5 text-primary">
                    <Zap className="w-3.5 h-3.5" /><span className="text-xs font-sans font-medium">{c.xp} XP</span>
                  </div>
                </div>
                <h3 className="font-display text-xl font-normal text-foreground mb-2">{c.n}</h3>
                <p className="text-sm font-sans text-muted-foreground font-light leading-relaxed mb-5">{c.d}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-sans text-muted-foreground font-light">
                    <Users className="w-3.5 h-3.5" />{c.p.toLocaleString()}{c.days <= 5 && <span className="text-amber-400 ml-2">· {c.days}d left</span>}
                  </div>
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                    className="flex items-center gap-1.5 px-4 py-2 border border-primary/40 text-primary text-xs font-sans hover:bg-primary/10 transition-colors rounded-md">
                    Join <ArrowRight className="w-3 h-3" />
                  </motion.button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
