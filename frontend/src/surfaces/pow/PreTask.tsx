import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, CheckCircle2 } from "lucide-react";
import { useStore } from "../../store/store";
import { Button } from "../../components/ui/ui";
import { nextId } from "../../lib/util";
import { api } from "../../lib/api";

const autoFields = [
  ["Worker", "Thabo Nkosi"],
  ["Crew", "C-Shift"],
  ["Shift", "Day Shift"],
  ["Area / Location", "Swartberg conveyor gantry"],
  ["Task", "Conveyor inspection at height"],
  ["Equipment", "Fall-arrest harness FA-2291"],
  ["Permit #", "WAH-P-0418"],
  ["Conditions", "Clear · wind 12 km/h"],
];

const hazards = [
  "Working at heights",
  "Energy isolation (LOTO)",
  "Ground / surface conditions",
  "Dropped objects",
];

export function PreTask() {
  const [filled, setFilled] = useState(false);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [controls, setControls] = useState("");
  const [error, setError] = useState("");
  const [suggesting, setSuggesting] = useState(false);
  const navigate = useNavigate();
  const addWork = useStore((s) => s.addWork);
  const pushToast = useStore((s) => s.pushToast);
  const logAudit = useStore((s) => s.logAudit);
  const user = useStore((s) => s.user)!;

  useEffect(() => {
    const t = setTimeout(() => setFilled(true), 1100);
    return () => clearTimeout(t);
  }, []);

  const suggest = async () => {
    setSuggesting(true);
    const checkedHazards = hazards.filter((h) => checked[h]).join(", ") || "working at heights, dropped objects";
    try {
      const r = await api.suggestControls({ task: "Conveyor inspection at height", hazards: checkedHazards });
      setControls(r.controls);
      pushToast({ title: "AI suggested controls inserted", detail: (r.standards ?? []).join(" · "), variant: "info" });
    } catch {
      setControls(
        "Harness inspected (tag current) and clipped to certified anchor; edge protection verified; " +
          "exclusion zone established below; tools tethered; WAH permit signed."
      );
      pushToast({ title: "AI suggested controls inserted", detail: "From SOP-WAH-014 v3.2", variant: "info" });
    }
    setSuggesting(false);
  };

  const submit = () => {
    if (!hazards.some((h) => checked[h])) {
      setError("Confirm at least one critical control for this task before starting.");
      return;
    }
    setError("");
    const id = nextId("PT");
    addWork({
      id,
      type: "Pre-Task",
      title: "Pre-task: conveyor inspection at height",
      area: "Swartberg",
      reportedBy: user.name,
      status: "Submitted",
      agent: "knowledge-risk",
      ageHrs: 0,
    });
    logAudit({ user: user.name, agent: "Shift Handover & Docs", action: `Pre-task ${id} submitted`, source: "SOP-WAH-014 v3.2", popia: "Internal (C3)", outcome: "Submitted" });
    pushToast({ title: "Pre-task logged · supervisor notified", detail: `${id} now in HSE console queue`, variant: "success" });
    navigate("/pow");
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <h1 className="font-extrabold text-navy-900">Pre-Task Checklist</h1>
        <p className="text-[11px] text-slate-500">Auto-filled from operational data · {filled ? "ready" : "syncing…"}</p>
      </div>

      <div className="rounded-xl bg-white border border-slate-200 divide-y divide-slate-100">
        {autoFields.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between px-3 py-2.5">
            <span className="text-xs text-slate-500">{label}</span>
            {filled ? (
              <span className="text-sm font-semibold text-navy-900">{value}</span>
            ) : (
              <span className="shimmer animate-shimmer h-3.5 w-28 rounded" />
            )}
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-white border border-slate-200 p-3">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Confirm critical controls</p>
        <div className="space-y-2">
          {hazards.map((h) => (
            <label key={h} className="flex items-center gap-2.5 text-sm text-navy-800">
              <input
                type="checkbox"
                checked={!!checked[h]}
                onChange={(e) => setChecked((c) => ({ ...c, [h]: e.target.checked }))}
                className="h-4 w-4 rounded accent-brand"
              />
              {h}
            </label>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-white border border-slate-200 p-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Controls confirmation</span>
          <Button size="sm" variant="secondary" onClick={suggest} disabled={suggesting}>
            <Sparkles size={13} /> {suggesting ? "Thinking…" : "AI suggest controls"}
          </Button>
        </div>
        <textarea
          value={controls}
          onChange={(e) => setControls(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
          placeholder="Describe the controls in place…"
        />
      </div>

      {error && <p className="text-xs text-safety-red">{error}</p>}

      <Button onClick={submit} size="lg" className="w-full">
        <CheckCircle2 size={18} /> Submit checklist
      </Button>
    </div>
  );
}
