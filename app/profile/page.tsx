"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "motion/react";
import { Lock } from "lucide-react";
import AppShell from "@/components/AppShell";
import { PageHdr } from "@/components/ui/page-header";
import { Panel } from "@/components/ui/panel";

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [notifState, setNotifState] = useState({ email: true, push: true, ai: true });
  const [twoF, setTwoF] = useState(false);

  useEffect(() => {
    if (!session) router.push("/login");
  }, [session, router]);

  if (!session) return null;

  function Toggle({ on, set }: { on: boolean; set: (v: boolean) => void }) {
    return (
      <motion.button onClick={() => set(!on)} whileTap={{ scale: 0.95 }}
        className={cn("w-10 h-5 rounded-full relative transition-colors duration-200 flex-shrink-0", on ? "bg-primary" : "bg-muted-foreground/20")}>
        <motion.span animate={{ x: on ? 20 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm" />
      </motion.button>
    );
  }

  return (
    <AppShell>
      <div className="max-w-lg space-y-7">
        <PageHdr tag="Account" title="Settings." />

        <Panel title="Profile">
          <div className="grid grid-cols-2 gap-4 mb-5">
            {[
              ["First Name", session.user?.name?.split(" ")[0] || ""],
              ["Last Name", session.user?.name?.split(" ").slice(1).join(" ") || ""],
              ["Email", session.user?.email || ""],
              ["Role", (session.user as any)?.role || "Employee"],
            ].map(([l, v]) => (
              <div key={l}>
                <label className="text-[10px] font-sans text-muted-foreground/55 uppercase tracking-[0.2em] block mb-2">{l}</label>
                <input defaultValue={v}
                  className="w-full px-3.5 py-2.5 text-sm font-sans bg-muted/50 border border-border focus:outline-none focus:border-primary/40 text-foreground rounded-md" />
              </div>
            ))}
          </div>
          <motion.button whileHover={{ scale: 1.02 }}
            className="px-5 py-2.5 bg-primary text-primary-foreground text-xs font-sans font-medium rounded-md hover:bg-primary/90 tracking-widest uppercase shadow-md shadow-primary/15">
            Save changes
          </motion.button>
        </Panel>

        <Panel title="Notifications">
          <div className="space-y-5">
            {[
              { k: "email" as const, l: "Email notifications", d: "Updates and alerts via email" },
              { k: "push" as const, l: "Push notifications", d: "Real-time browser alerts" },
              { k: "ai" as const, l: "AI insights", d: "ESG anomaly and opportunity alerts" },
            ].map(item => (
              <div key={item.k} className="flex items-center justify-between pb-5 border-b border-border/50 last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-sans font-medium text-foreground">{item.l}</p>
                  <p className="text-xs font-sans text-muted-foreground font-light mt-0.5">{item.d}</p>
                </div>
                <Toggle on={notifState[item.k]} set={v => setNotifState(n => ({ ...n, [item.k]: v }))} />
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Security">
          <div className="flex items-center justify-between mb-5 pb-5 border-b border-border/50">
            <div>
              <p className="text-sm font-sans font-medium text-foreground">Two-factor authentication</p>
              <p className="text-xs font-sans text-muted-foreground font-light mt-0.5">Extra layer of account security</p>
            </div>
            <Toggle on={twoF} set={setTwoF} />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-border text-xs font-sans text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all rounded-md">
            <Lock className="w-3.5 h-3.5" />Change password
          </button>
        </Panel>
      </div>
    </AppShell>
  );
}

function cn(...c: (string | boolean | undefined | null)[]) {
  return c.filter(Boolean).join(" ");
}
