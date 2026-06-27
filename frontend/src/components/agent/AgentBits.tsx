import { useEffect, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Cpu, ArrowRight, FileText, ShieldCheck, History, CheckCircle2 } from "lucide-react";
import { Chip, Drawer } from "../ui/ui";
import type { ClassifyResult, KnowledgeSource } from "../../lib/api";
import { agents } from "../../mock/seed";

const agentName = (route: string) =>
  agents.find((a) => a.id === route)?.name ?? "Knowledge & Risk";

/* ---- RoutingStrip: Understand → Intent (%) → Route to <Agent> ---- */
export function RoutingStrip({ result }: { result: ClassifyResult | null }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    setStep(0);
    if (!result) return;
    const t1 = setTimeout(() => setStep(1), 500);
    const t2 = setTimeout(() => setStep(2), 1000);
    const t3 = setTimeout(() => setStep(3), 1500);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, [result]);

  if (!result) return null;
  const pills = [
    { icon: <Brain size={14} />, label: "Understanding your request…" },
    { icon: <Cpu size={14} />, label: `Intent: ${result.intent} (${result.confidence}%)` },
    {
      icon: <ArrowRight size={14} />,
      label:
        result.route === "out-of-domain"
          ? "Guardrail: out of safety domain"
          : `Routing to → ${agentName(result.route)}`,
    },
  ];
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl bg-navy-900 px-3 py-2.5">
      <span className="text-[11px] uppercase tracking-wide text-blue-300 font-bold">Supervisor</span>
      {pills.map((p, i) => (
        <AnimatePresence key={i}>
          {step > i && (
            <motion.span
              initial={{ opacity: 0, y: 6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 text-white px-2.5 py-1 text-xs font-medium"
            >
              {p.icon}
              {p.label}
            </motion.span>
          )}
        </AnimatePresence>
      ))}
      {result.mode && (
        <span className="ml-auto text-[10px] text-blue-300/70">via {result.mode}</span>
      )}
    </div>
  );
}

/* ---- AgentThinking: animated dots loader ---- */
export function AgentThinking({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-blue-50 border border-blue-100 px-4 py-3">
      <div className="grid h-8 w-8 place-items-center rounded-full bg-brand text-white">
        <Cpu size={16} />
      </div>
      <span className="text-sm font-medium text-navy-800">{label}</span>
      <span className="flex gap-1 ml-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-brand"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </span>
    </div>
  );
}

/* ---- StreamedAnswer: token text with a blinking cursor ---- */
export function StreamedAnswer({ text, streaming }: { text: string; streaming: boolean }) {
  return (
    <p className="whitespace-pre-wrap text-sm leading-relaxed text-navy-800">
      {text}
      {streaming && <span className="inline-block w-1.5 h-4 ml-0.5 align-middle bg-brand animate-blink" />}
    </p>
  );
}

/* ---- SourceChip + SourceDrawer ---- */
export function SourceChip({ source, onOpen }: { source: KnowledgeSource; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-navy-800 hover:bg-slate-100"
    >
      <FileText size={14} className="text-brand" />
      {source.id} · {source.title} · {source.version} · approved {source.approved}
    </button>
  );
}

export function GuardrailLine({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-lg bg-green-50 border border-green-100 px-3 py-2 text-xs text-green-800">
      <ShieldCheck size={15} className="mt-0.5 shrink-0" />
      <span>{children}</span>
    </div>
  );
}

const versionHistory = [
  { version: "v3.0", date: "03 Aug 2025", note: "Anchor-point certification interval tightened." },
  { version: "v3.1", date: "19 Jan 2026", note: "Added wind-speed suspension threshold." },
  { version: "v3.2", date: "12 Apr 2026", note: "Aligned to revised national fall-protection standard." },
];

export function SourceDrawer({
  open,
  onClose,
  source,
}: {
  open: boolean;
  onClose: () => void;
  source: KnowledgeSource | null;
}) {
  if (!source) return null;
  return (
    <Drawer open={open} onClose={onClose} title="Source & traceability">
      <div className="space-y-4">
        <div className="rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 text-brand font-bold">
            <FileText size={18} /> {source.id}
          </div>
          <p className="mt-1 font-semibold text-navy-900">{source.title}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Chip tone="blue">{source.version}</Chip>
            <Chip tone="green">Approved {source.approved}</Chip>
            <Chip tone="slate">SharePoint › HSE › SOPs</Chip>
          </div>
        </div>

        <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
          <strong>Standard updated.</strong> Revised national fall-protection standard published — 3 SOPs
          flagged for review (ties to version-control monitoring).
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2 flex items-center gap-1">
            <History size={14} /> Version history
          </p>
          <ol className="relative border-l border-slate-200 ml-1.5 space-y-3">
            {versionHistory.map((v) => (
              <li key={v.version} className="ml-4">
                <span className="absolute -left-1.5 h-3 w-3 rounded-full bg-brand" />
                <p className="text-sm font-semibold text-navy-900">{v.version} · {v.date}</p>
                <p className="text-xs text-slate-500">{v.note}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-800 flex items-center gap-2">
          <CheckCircle2 size={16} /> Grounded — no hallucination. Answer cites this exact version.
        </div>
      </div>
    </Drawer>
  );
}
