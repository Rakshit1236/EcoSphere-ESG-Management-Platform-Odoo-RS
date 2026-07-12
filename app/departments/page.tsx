"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "motion/react";
import { Plus } from "lucide-react";
import AppShell from "@/components/AppShell";
import { GlassCard } from "@/components/ui/glass-card";
import { PageHdr } from "@/components/ui/page-header";
import { ProgressBar } from "@/components/ui/progress-bar";

const deptData = [
  { dept: "HR", esg: 91, env: 85, social: 96, gov: 92 },
  { dept: "Product", esg: 88, env: 86, social: 90, gov: 88 },
  { dept: "Engineering", esg: 87, env: 82, social: 91, gov: 88 },
  { dept: "Finance", esg: 84, env: 80, social: 83, gov: 89 },
  { dept: "Sales", esg: 82, env: 79, social: 88, gov: 79 },
  { dept: "Operations", esg: 76, env: 71, social: 79, gov: 78 },
];

export default function DepartmentsPage() {
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
          <PageHdr tag="People" title="Departments." />
          <motion.button whileHover={{ scale: 1.02 }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-xs font-sans font-medium rounded-md">
            Add <Plus className="w-3.5 h-3.5" />
          </motion.button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {deptData.map(d => (
            <GlassCard key={d.dept} dark hover className="p-6 border border-white/[0.07]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="font-display text-xl font-normal text-foreground">{d.dept}</p>
                  <p className="text-[10px] font-sans text-muted-foreground mt-0.5">Composite ESG</p>
                </div>
                <span className="font-display font-light text-primary" style={{ fontSize: "2.5rem" }}>{d.esg}</span>
              </div>
              <div className="space-y-4">
                <ProgressBar label="Environmental" value={d.env} color="bg-primary" />
                <ProgressBar label="Social" value={d.social} color="bg-[#8ab5a0]" />
                <ProgressBar label="Governance" value={d.gov} color="bg-[#c8a96e]" />
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
