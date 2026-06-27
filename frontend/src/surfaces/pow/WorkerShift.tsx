import { FileBadge, Clock, CheckCircle2 } from "lucide-react";
import { Chip } from "../../components/ui/ui";

const permits = [
  { id: "WAH-P-0418", title: "Working at heights · Swartberg gantry", status: "Active" },
  { id: "CS-P-0211", title: "Confined space · sump 3", status: "Pending" },
  { id: "HW-P-0307", title: "Hot work · workshop bay 2", status: "Active" },
];

export function WorkerShift() {
  return (
    <div className="p-4 space-y-4">
      <div>
        <h1 className="font-extrabold text-navy-900">My Shift</h1>
        <p className="text-[11px] text-slate-500">Permits, handover and acknowledgements</p>
      </div>

      <div className="rounded-xl bg-navy-900 text-white p-4">
        <div className="flex items-center gap-2 text-blue-300 text-xs"><Clock size={14} /> Night-shift handover received</div>
        <p className="mt-1.5 text-sm">2 equipment items flagged · 5 outstanding actions · barricading reinstated at crusher.</p>
        <button className="mt-3 inline-flex items-center gap-2 rounded-lg bg-white/15 px-3 py-1.5 text-xs font-semibold">
          <CheckCircle2 size={14} /> Acknowledge handover
        </button>
      </div>

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
