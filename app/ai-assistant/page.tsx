"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "motion/react";
import { Brain, Send } from "lucide-react";
import AppShell from "@/components/AppShell";
import { GlassCard } from "@/components/ui/glass-card";
import { Panel } from "@/components/ui/panel";

function cn(...c: (string | boolean | undefined | null)[]) {
  return c.filter(Boolean).join(" ");
}

const prompts = [
  "What's driving our Scope 3 increase?",
  "Which departments have the lowest scores?",
  "Generate a 2025 carbon reduction roadmap",
  "Compare our ESG to industry benchmarks",
  "What are our top 3 governance risks?",
];

export default function AIAssistantPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [msgs, setMsgs] = useState<{ r: "a" | "u"; t: string }[]>([
    { r: "a", t: "Hello. I'm EcoSphere AI — I analyse your ESG data, forecast emissions, surface opportunities, and generate compliance reports. How can I help today?" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!session) router.push("/login");
  }, [session, router]);

  const send = (content: string) => {
    if (!content.trim()) return;
    setMsgs(p => [...p, { r: "u", t: content }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs(p => [...p, {
        r: "a",
        t: "Based on current data, carbon emissions are down 18.4% year-over-year. However, Scope 3 supply chain emissions represent 49% of total footprint and slipped 8% above Q4 target. I recommend prioritising three electronics suppliers who account for 31% of Scope 3. Would you like a detailed reduction roadmap or supplier audit templates?",
      }]);
    }, 1800);
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, typing]);

  if (!session) return null;

  const initials = session.user?.name?.split(" ").map(n => n[0]).join("") || "U";

  return (
    <AppShell>
      <div className="flex flex-col" style={{ height: "calc(100vh - 5rem)" }}>
        <div className="flex items-end justify-between mb-6 flex-shrink-0 pt-1">
          <div>
            <p className="text-[10px] font-sans text-primary tracking-[0.35em] uppercase mb-2">Intelligence</p>
            <h1 className="font-display font-normal text-foreground" style={{ fontSize: "clamp(1.75rem,4vw,2.5rem)" }}>AI Assistant.</h1>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-sans text-primary tracking-widest">
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />Online
          </div>
        </div>

        <div className="flex gap-5 flex-1 min-h-0">
          <GlassCard dark hover={false} className="flex-1 flex flex-col overflow-hidden border border-white/[0.07]">
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {msgs.map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className={cn("flex gap-3.5", m.r === "u" ? "flex-row-reverse" : "")}>
                  <div className={cn("w-7 h-7 rounded-full border flex items-center justify-center text-[9px] font-sans flex-shrink-0 mt-1",
                    m.r === "a" ? "bg-primary/15 border-primary/30 text-primary" : "bg-white/10 border-white/10 text-white/40")}>
                    {m.r === "a" ? <Brain className="w-3.5 h-3.5" /> : initials}
                  </div>
                  <div className={cn("max-w-[72%] px-4 py-3 text-sm font-sans font-light leading-relaxed rounded-xl",
                    m.r === "a" ? "bg-white/[0.05] text-foreground/80" : "bg-primary/10 text-foreground border border-primary/20")}>
                    {m.t}
                  </div>
                </motion.div>
              ))}
              {typing && (
                <div className="flex gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center">
                    <Brain className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div className="bg-white/[0.05] px-4 py-3 rounded-xl flex items-center gap-1.5">
                    {[0, 1, 2].map(i => (
                      <motion.span key={i} className="w-1.5 h-1.5 bg-muted-foreground rounded-full"
                        animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                        transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.2 }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>
            <div className="p-4 border-t border-border/50 flex gap-3">
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send(input)}
                placeholder="Ask about ESG data, carbon, compliance..."
                className="flex-1 px-4 py-2.5 text-sm font-sans bg-transparent border border-border focus:outline-none focus:border-primary/40 text-foreground placeholder:text-muted-foreground/35 rounded-lg" />
              <motion.button onClick={() => send(input)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="w-10 h-10 bg-primary text-primary-foreground rounded-lg flex items-center justify-center hover:bg-primary/90 transition-colors shadow-md shadow-primary/20">
                <Send className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </GlassCard>

          <div className="w-56 flex-shrink-0">
            <Panel title="Suggested" sub="">
              <div className="space-y-0">
                {prompts.map((p, i) => (
                  <button key={i} onClick={() => send(p)}
                    className="w-full text-left text-[11px] font-sans font-light text-muted-foreground hover:text-foreground transition-colors border-b border-border/50 py-3 last:border-0 leading-relaxed">
                    {p}
                  </button>
                ))}
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
