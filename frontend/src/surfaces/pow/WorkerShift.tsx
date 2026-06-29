import { useEffect, useState } from "react";
import { FileBadge, Clock, CheckCircle2, Loader2, AlertTriangle, ListTodo } from "lucide-react";
import { Chip } from "../../components/ui/ui";
import { useStore } from "../../store/store";
import { workflow, type HandoverDTO } from "../../lib/api";

const permits = [
  { id: "WAH-P-0418", title: "Working at heights · Swartberg gantry", status: "Active" },
  { id: "CS-P-0211", title: "Confined space · sump 3", status: "Pending" },
  { id: "HW-P-0307", title: "Hot work · workshop bay 2", status: "Active" },
];

export function WorkerShift() {
  const user = useStore((s) => s.user)!;
  const pushToast = useStore((s) => s.pushToast);
  const [handover, setHandover] = useState<HandoverDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [acking, setAcking] = useState(false);

  // Pull the latest handover the HSE Officer sent (backend = source of truth).
  useEffect(() => {
    workflow
      .getHandover()
      .then((h) => setHandover(h && h.summary ? h : null))
      .catch(() => setHandover(null))
      .finally(() => setLoading(false));
  }, []);

  const acknowledge = async () => {
    if (!handover) return;
    setAcking(true);
    try {
      const updated = await workflow.ackHandover(user.name);
      setHandover(updated);
      pushToast({ title: "Handover acknowledged", detail: "Your supervisor has been notified.", variant: "success" });
    } catch {
      pushToast({ title: "Could not acknowledge", detail: "Is the backend running on :8000?", variant: "error" });
    }
    setAcking(false);
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <h1 className="font-extrabold text-navy-900">My Shift</h1>
        <p className="text-[11px] text-slate-500">Permits, handover and acknowledgements</p>
      </div>

      {/* Dynamic shift handover received from the HSE Officer */}
      {loading ? (
        <div className="flex items-center gap-2 rounded-xl bg-navy-900 text-white p-4 text-sm">
          <Loader2 size={16} className="animate-spin" /> Loading shift handover…
        </div>
      ) : handover ? (
        <div className="rounded-xl bg-navy-900 text-white p-4">
          <div className="flex items-center justify-between text-xs text-blue-300">
            <span className="flex items-center gap-2"><Clock size={14} /> Handover received · {handover.ts}</span>
            <span>{handover.id}</span>
          </div>
          <p className="mt-1 text-[11px] text-blue-200/80">
            From <strong>{handover.outgoing}</strong> → {handover.incoming}
          </p>

          <p className="mt-2.5 text-sm leading-relaxed">{handover.summary}</p>

          <div className="mt-3 flex gap-2">
            <span className="flex items-center gap-1 rounded-md bg-white/10 px-2 py-1 text-[11px]">
              <AlertTriangle size={12} className="text-amber-300" /> {handover.flagged} equipment flagged
            </span>
            <span className="flex items-center gap-1 rounded-md bg-white/10 px-2 py-1 text-[11px]">
              <ListTodo size={12} className="text-blue-300" /> {handover.outstandingActions} outstanding actions
            </span>
          </div>

          {handover.acknowledged ? (
            <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-green-500/20 text-green-300 px-3 py-1.5 text-xs font-semibold">
              <CheckCircle2 size={14} /> Acknowledged by {handover.ackBy} · {handover.ackTs}
            </div>
          ) : (
            <button
              onClick={acknowledge}
              disabled={acking}
              className="mt-3 inline-flex items-center gap-2 rounded-lg bg-white/15 px-3 py-1.5 text-xs font-semibold hover:bg-white/25 disabled:opacity-60"
            >
              {acking ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
              Acknowledge handover
            </button>
          )}
        </div>
      ) : (
        <div className="rounded-xl bg-slate-100 border border-slate-200 p-4 text-sm text-slate-500">
          No shift handover has been sent yet. Your supervisor will send one from the HSE Console.
        </div>
      )}

      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">My permits</p>
      <div className="space-y-2">
        {permits.map((p) => (
          <div key={p.id} className="flex items-center gap-3 rounded-xl bg-white border border-slate-200 p-3">
            <FileBadge size={18} className="text-brand" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-navy-900">{p.id}</p>
              <p className="text-xs text-slate-500">{p.title}</p>
            </div>
            <Chip tone={p.status === "Active" ? "green" : "amber"}>{p.status}</Chip>
          </div>
        ))}
      </div>
    </div>
  );
}
