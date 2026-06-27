import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Send } from "lucide-react";
import { useStore } from "../../store/store";
import { AgentThinking } from "../../components/agent/AgentBits";
import { Button, Chip } from "../../components/ui/ui";
import { nextId } from "../../lib/util";
import { api, isDisabled } from "../../lib/api";

export function ReportNearMiss() {
  const [type, setType] = useState("Near-Miss");
  const [area, setArea] = useState("Gamsberg Concentrator");
  const [desc, setDesc] = useState("");
  const [severity, setSeverity] = useState("High");
  const [classifying, setClassifying] = useState(false);
  const [result, setResult] = useState<null | { category: string; control: string; similar: number }>(null);
  const navigate = useNavigate();
  const addWork = useStore((s) => s.addWork);
  const pushToast = useStore((s) => s.pushToast);
  const user = useStore((s) => s.user)!;

  const submit = async () => {
    setClassifying(true);
    setResult(null);
    let r: { category: string; control: string; similar: number } = {
      category: "Other",
      control: "Raise to HSE officer for hazard assessment.",
      similar: 0,
    };
    try {
      const c = await api.classifyReport({ type, area, description: desc });
      if (isDisabled(c)) {
        pushToast({ title: "Incident Investigation agent disabled", detail: c.message, variant: "warn" });
      } else {
        r = { category: c.category, control: c.control, similar: c.similar };
        if (c.severity) setSeverity(c.severity);
      }
    } catch {
      /* keep default on backend error */
    }
    setClassifying(false);
    setResult(r);
    const id = nextId("NM-2026");
    addWork({
      id,
      type: type as any,
      title: desc.slice(0, 48) || "Reported event at " + area,
      area,
      reportedBy: user.name,
      status: "Submitted",
      agent: "incident-investigation",
      ageHrs: 0,
      severity: severity as any,
      description: desc,
    });
    pushToast({ title: "Report submitted", detail: `${id} added to HSE console queue`, variant: "success" });
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <h1 className="font-extrabold text-navy-900">Report Near-Miss / Incident</h1>
        <p className="text-[11px] text-slate-500">Captured at the point of work · feeds investigation</p>
      </div>

      <Field label="Type">
        <div className="flex gap-2">
          {["Near-Miss", "Incident", "Hazard"].map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`flex-1 rounded-lg border px-2 py-1.5 text-xs font-semibold ${type === t ? "border-brand bg-blue-50 text-brand" : "border-slate-300 text-slate-600"}`}
            >
              {t}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Area">
        <select value={area} onChange={(e) => setArea(e.target.value)} className="input">
          {["Gamsberg Concentrator", "Swartberg", "Black Mountain Deeps", "Surface Workshops"].map((a) => (
            <option key={a}>{a}</option>
          ))}
        </select>
      </Field>

      <Field label="Description">
        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} className="input" placeholder="What happened?" />
      </Field>

      <Field label="Photo">
        <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 py-4 text-sm text-slate-500">
          <Camera size={18} /> Add photo (tap to attach)
        </button>
      </Field>

      <Field label="Severity">
        <div className="flex gap-2">
          {["Low", "Medium", "High"].map((s) => (
            <button
              key={s}
              onClick={() => setSeverity(s)}
              className={`flex-1 rounded-lg border px-2 py-1.5 text-xs font-semibold ${severity === s ? "border-brand bg-blue-50 text-brand" : "border-slate-300 text-slate-600"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </Field>

      <Button onClick={submit} size="lg" className="w-full" disabled={classifying}>
        <Send size={18} /> Submit report
      </Button>

      {classifying && <AgentThinking label="Sentinel is classifying this report…" />}

      {result && (
        <div className="rounded-xl bg-white border border-slate-200 p-3 space-y-2">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">AI assist</p>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-500">Suggested category:</span>
            <Chip tone="amber">{result.category}</Chip>
          </div>
          <p className="text-sm text-navy-800">
            <span className="text-slate-500">Suggested control:</span> {result.control}
          </p>
          <div className="rounded-lg bg-purple-50 border border-purple-100 px-3 py-2 text-xs text-purple-800">
            ⚠ Similar events: <strong>{result.similar} in the last 90 days</strong> at {area} — this may be a recurring pattern.
          </div>
          <Button size="sm" variant="secondary" onClick={() => navigate("/pow")}>Back to home</Button>
        </div>
      )}

      <style>{`.input{width:100%;border:1px solid #cbd5e1;border-radius:.5rem;padding:.5rem .625rem;font-size:.875rem}.input:focus{outline:none;box-shadow:0 0 0 2px rgba(37,99,235,.3)}`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-600 mb-1 block">{label}</label>
      {children}
    </div>
  );
}
