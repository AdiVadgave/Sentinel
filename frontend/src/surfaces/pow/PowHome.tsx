import { useNavigate } from "react-router-dom";
import { MessageSquare, ListChecks, AlertTriangle, FileBadge, Clock, ChevronRight, ShieldCheck } from "lucide-react";
import { useStore } from "../../store/store";

const tiles = [
  { to: "/pow/ask", label: "Ask Zen-Sentinel", icon: MessageSquare, hero: true },
  { to: "/pow/checklist", label: "Pre-Task Checklist", icon: ListChecks },
  { to: "/pow/report", label: "Report Near-Miss", icon: AlertTriangle },
  { to: "/pow/handover", label: "My Permits", icon: FileBadge },
  { to: "/pow/handover", label: "Shift Handover", icon: Clock },
];

const tasks = [
  { id: "PT-01", text: "Pre-task: conveyor inspection · Swartberg", due: "Due 09:00" },
  { id: "PT-02", text: "Acknowledge night-shift handover", due: "Due now" },
  { id: "PT-03", text: "Confined-space refresher · overdue", due: "Overdue" },
];

export function PowHome() {
  const navigate = useNavigate();
  const user = useStore((s) => s.user)!;
  return (
    <div className="pb-6">
      <div className="bg-navy-900 text-white px-5 pt-5 pb-8 rounded-b-3xl">
        <p className="text-xs text-blue-300">Day Shift · Black Mountain Deeps</p>
        <h1 className="text-2xl font-extrabold mt-1">Hi {user.name.split(" ")[0]} 👋</h1>
        <p className="text-sm text-blue-200/80 mt-1">{user.title} · area {user.area}</p>
      </div>

      <div className="px-4 -mt-4">
        <button
          onClick={() => navigate("/pow/ask")}
          className="w-full flex items-center gap-3 rounded-2xl bg-brand text-white p-4 shadow-lift"
        >
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/20">
            <MessageSquare size={22} />
          </span>
          <span className="text-left">
            <span className="block font-bold text-lg leading-tight">Ask Zen-Sentinel</span>
            <span className="block text-xs text-blue-100">Plain-language safety guidance</span>
          </span>
          <ChevronRight className="ml-auto" />
        </button>

        <div className="grid grid-cols-2 gap-3 mt-4">
          {tiles.slice(1).map((t) => (
            <button
              key={t.label}
              onClick={() => navigate(t.to)}
              className="rounded-2xl bg-white border border-slate-200 p-4 text-left shadow-card hover:border-brand"
            >
              <t.icon size={22} className="text-brand" />
              <p className="mt-2 text-sm font-bold text-navy-900 leading-tight">{t.label}</p>
            </button>
          ))}
        </div>

        <p className="mt-6 mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">My open tasks</p>
        <div className="space-y-2">
          {tasks.map((t) => (
            <div key={t.id} className="flex items-center gap-3 rounded-xl bg-white border border-slate-200 p-3">
              <span className="h-2 w-2 rounded-full bg-safety-amber" />
              <p className="text-sm text-navy-800 flex-1">{t.text}</p>
              <span className="text-[10px] font-semibold text-slate-400">{t.due}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-green-50 border border-green-100 py-2.5 text-xs font-semibold text-green-700">
          <ShieldCheck size={15} /> 4 agents online · grounded answers only
        </div>
      </div>
    </div>
  );
}
