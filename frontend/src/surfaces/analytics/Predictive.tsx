import { useState } from "react";
import { Gauge, Wrench, Info } from "lucide-react";
import { useStore } from "../../store/store";
import { Card, SectionHeader, Chip, Button } from "../../components/ui/ui";
import { AnomalyTrend } from "../../components/charts/Charts";
import { assets, type Asset } from "../../mock/seed";
import { nextId } from "../../lib/util";

const riskTone = (p: number) => (p > 0.6 ? "red" : p > 0.35 ? "amber" : "green");

export function Predictive() {
  const [selected, setSelected] = useState<Asset>(assets[0]);
  const addAction = useStore((s) => s.addAction);
  const addWork = useStore((s) => s.addWork);
  const pushToast = useStore((s) => s.pushToast);
  const user = useStore((s) => s.user)!;

  const raise = () => {
    const id = nextId("CA");
    addAction({ id, action: `Inspect ${selected.name} — predictive early-warning`, owner: "S. Kapoor", due: "within 72h", priority: "High", status: "Submitted" });
    addWork({ id, type: "Corrective Action", title: `Inspect ${selected.id} (predictive alert)`, area: selected.area, reportedBy: user.name, status: "Submitted", agent: "incident-intelligence", ageHrs: 0, aiDrafted: true });
    pushToast({ title: "Maintenance action raised", detail: `${id} added to workflow`, variant: "success" });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <SectionHeader title="Predictive Early-Warning" subtitle="Proactive maintenance from pre-use checklist trends" />

      <div className="grid lg:grid-cols-3 gap-4 mb-5">
        {assets.map((a) => (
          <button key={a.id} onClick={() => setSelected(a)} className="text-left">
            <Card className={`p-4 ${selected.id === a.id ? "ring-2 ring-brand" : ""}`}>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-bold text-navy-900"><Gauge size={18} className="text-brand" />{a.id}</span>
                <Chip tone={riskTone(a.failureProb)}>p = {a.failureProb.toFixed(2)}</Chip>
              </div>
              <p className="mt-1 text-sm text-slate-600">{a.name}</p>
              <p className="text-xs text-slate-400">{a.area} · data: Plant Maintenance</p>
              <p className="mt-2 text-sm font-semibold text-navy-800">{a.recommend}</p>
            </Card>
          </button>
        ))}
      </div>

      <Card className="p-4">
        <h3 className="font-bold text-navy-900 mb-1">{selected.id} · pre-use checklist anomaly trend</h3>
        <p className="text-xs text-slate-500 mb-3">Rising "hydraulic leak noted" frequency drives the failure-probability estimate.</p>
        <AnomalyTrend data={selected.trend} />
        <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-start gap-2 rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-600 max-w-md">
            <Info size={14} className="mt-0.5 shrink-0 text-slate-400" />
            Indicative model — IoT / condition-monitoring data integrated in production (Phase 2). Matches PPT assumptions.
          </div>
          <Button onClick={raise}><Wrench size={15} /> Raise maintenance action</Button>
        </div>
      </Card>
    </div>
  );
}
