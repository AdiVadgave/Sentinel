import { useState } from "react";
import { Network, Cpu, Database, ShieldCheck, Plug } from "lucide-react";
import { Card, SectionHeader, Chip } from "../components/ui/ui";

const nodes = [
  { id: "supervisor", label: "Supervisor / Orchestrator", icon: Cpu, tip: "Intent classification + routing across the four specialist agents." },
  { id: "knowledge", label: "Knowledge & Risk", icon: Database, tip: "Grounded RAG over SOPs + SA/international standards with citations." },
  { id: "investigation", label: "Incident Investigation", icon: ShieldCheck, tip: "ICAM drafting, integrated to Enablon, with human sign-off." },
  { id: "intelligence", label: "Incident Intelligence", icon: Network, tip: "Recurring-pattern analytics + automated lessons learned." },
  { id: "handover", label: "Shift Handover & Docs", icon: Plug, tip: "Auto-fills documentation from operational data." },
];

const roadmap = [
  { phase: "Phase 1 · Discovery", detail: "Validate workflows & architecture against real operations." },
  { phase: "Phase 2 · Build", detail: "Four agents + supervisor on the GenAI stack for ~40 HSE users." },
  { phase: "Phase 3 · Operate & extend", detail: "Predictive models, more integrations, continuous improvement." },
];

export function Architecture() {
  const [tip, setTip] = useState<string | null>(null);
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <SectionHeader title="Architecture & Roadmap" subtitle="Multi-agent platform · same architecture from PoC to production" />

      <Card className="p-6 mb-5">
        <div className="flex flex-col items-center gap-4">
          <Node node={nodes[0]} highlight onHover={setTip} />
          <div className="h-6 w-px bg-slate-300" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            {nodes.slice(1).map((n) => <Node key={n.id} node={n} onHover={setTip} />)}
          </div>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            <Chip tone="green"><ShieldCheck size={12} /> Guardrails + grounding</Chip>
            <Chip tone="blue">FastAPI gateway → Azure OpenAI GPT-4o</Chip>
            <Chip tone="slate">pgvector knowledge base (prod)</Chip>
            <Chip tone="purple">MCP tool servers · Enablon / SharePoint / Plant Maint.</Chip>
          </div>
          {tip && <p className="text-sm text-slate-500 mt-2 text-center max-w-md">{tip}</p>}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-bold text-navy-900 mb-4">Delivery roadmap</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {roadmap.map((r, i) => (
            <div key={r.phase} className="relative rounded-xl border border-slate-200 p-4">
              <span className="absolute -top-3 left-4 grid h-6 w-6 place-items-center rounded-full bg-brand text-white text-xs font-bold">{i + 1}</span>
              <p className="font-bold text-navy-900 mt-1">{r.phase}</p>
              <p className="text-sm text-slate-600 mt-1">{r.detail}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Node({ node, highlight, onHover }: { node: typeof nodes[0]; highlight?: boolean; onHover: (t: string | null) => void }) {
  const Icon = node.icon;
  return (
    <div
      onMouseEnter={() => onHover(node.tip)}
      onMouseLeave={() => onHover(null)}
      className={`flex flex-col items-center gap-2 rounded-xl border p-3 cursor-default transition-colors ${highlight ? "border-brand bg-brand/5 w-64" : "border-slate-200 hover:border-brand"}`}
    >
      <span className={`grid h-10 w-10 place-items-center rounded-lg ${highlight ? "bg-brand text-white" : "bg-slate-100 text-brand"}`}><Icon size={18} /></span>
      <p className="text-xs font-bold text-navy-900 text-center leading-tight">{node.label}</p>
    </div>
  );
}
