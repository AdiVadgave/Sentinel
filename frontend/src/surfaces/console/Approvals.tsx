import { motion } from "framer-motion";
import { useStore } from "../../store/store";
import { SectionHeader, Chip } from "../../components/ui/ui";
import { agents, type WorkflowState, type WorkItem } from "../../mock/seed";

const columns: WorkflowState[] = ["Submitted", "Under Review", "Approved", "Closed"];
const colTone: Record<WorkflowState, string> = {
  Submitted: "border-slate-300",
  "Under Review": "border-amber-300",
  Approved: "border-green-300",
  Closed: "border-slate-300",
};
const next: Record<WorkflowState, WorkflowState | null> = {
  Submitted: "Under Review",
  "Under Review": "Approved",
  Approved: "Closed",
  Closed: null,
};

const agentLabel = (id: string) => agents.find((a) => a.id === id)?.name ?? id;

export function Approvals() {
  const work = useStore((s) => s.work);
  const transition = useStore((s) => s.transition);
  const pushToast = useStore((s) => s.pushToast);
  const user = useStore((s) => s.user)!;

  const advance = (item: WorkItem) => {
    const to = next[item.status];
    if (!to) return;
    transition(item.id, to, user.name);
    pushToast({ title: `${item.id} → ${to}`, detail: "Workflow updated · audit entry written", variant: "success" });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <SectionHeader
        title="Approvals — Human-in-the-Loop Board"
        subtitle="Click a card to advance it. State persists and writes to the audit log."
      />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {columns.map((col) => {
          const items = work.filter((w) => w.status === col);
          return (
            <div key={col} className={`rounded-xl bg-slate-100/70 border-t-4 ${colTone[col]} p-3`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-navy-900 text-sm">{col}</h3>
                <span className="text-xs text-slate-400">{items.length}</span>
              </div>
              <div className="space-y-2.5 min-h-[120px]">
                {items.map((item) => (
                  <motion.button
                    layout
                    key={item.id}
                    onClick={() => advance(item)}
                    className="w-full text-left rounded-lg bg-white border border-slate-200 p-3 shadow-card hover:shadow-lift transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-navy-900">{item.id}</span>
                      <Chip tone="slate">{item.type}</Chip>
                    </div>
                    <p className="mt-1 text-sm text-navy-800 leading-snug">{item.title}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">{agentLabel(item.agent)}</span>
                      {item.aiDrafted && <Chip tone="purple">AI-drafted / human-approved</Chip>}
                    </div>
                    {next[item.status] && (
                      <p className="mt-2 text-[10px] font-semibold text-brand">→ click to move to {next[item.status]}</p>
                    )}
                  </motion.button>
                ))}
                {items.length === 0 && <p className="text-center text-xs text-slate-400 py-6">Empty</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
