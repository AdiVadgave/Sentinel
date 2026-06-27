import { useEffect, useState } from "react";
import { Sparkles, FileDown, Send } from "lucide-react";
import { useStore } from "../../store/store";
import { Card, SectionHeader, Button, Dialog, Chip } from "../../components/ui/ui";
import { ProgressArc } from "../../components/charts/Charts";
import { api, isDisabled } from "../../lib/api";

const pulled = [
  { label: "Open work orders", value: "4" },
  { label: "Active permits", value: "3" },
  { label: "Equipment flagged", value: "2" },
  { label: "Outstanding actions", value: "5" },
  { label: "Environmental readings", value: "Within limits" },
];

export function Handover() {
  const [completeness, setCompleteness] = useState(62);
  const [summary, setSummary] = useState("");
  const [pdfOpen, setPdfOpen] = useState(false);
  const pushToast = useStore((s) => s.pushToast);

  useEffect(() => {
    // animate auto-pull → completeness climbs
    const t = setTimeout(() => setCompleteness(94), 900);
    return () => clearTimeout(t);
  }, []);

  const [drafting, setDrafting] = useState(false);
  const aiDraft = async () => {
    setDrafting(true);
    try {
      const r = await api.handoverSummary(
        "Open work orders: 4. Active permits: 3. Equipment flagged: 2 (EX-204 hydraulic leak trend). " +
          "Outstanding actions: 5 (CA-0912 re-barricading, CA-0913 tethered tools). Crusher conveyor " +
          "returned to service after belt-scraper change; barricading reinstated and verified at Swartberg."
      );
      if (isDisabled(r)) {
        setDrafting(false);
        pushToast({ title: "Shift Handover agent disabled", detail: r.message, variant: "warn" });
        return;
      }
      setSummary(r.summary);
    } catch {
      setSummary(
        "Day shift completed conveyor inspection at Swartberg gantry (WAH-P-0418) with no exceptions. " +
          "Crusher feed conveyor returned to service; barricading re-established. EX-204 flagged for inspection within 72h."
      );
    }
    setDrafting(false);
    pushToast({ title: "Summary drafted by Shift Handover agent", variant: "info" });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <SectionHeader title="Shift Handover" subtitle="Auto-pulled from operational data · AI-assisted completeness" />

      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="p-5 flex flex-col items-center justify-center">
          <p className="text-sm font-bold text-navy-900 mb-2">Completeness</p>
          <ProgressArc value={completeness} />
          <p className="mt-3 text-xs text-slate-500 text-center">
            {completeness < 90 ? "Syncing operational data…" : "AI filled the gaps — 62% → 94%"}
          </p>
        </Card>

        <Card className="p-4 lg:col-span-2">
          <h3 className="font-bold text-navy-900 mb-3">Auto-pulled context</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {pulled.map((p) => (
              <div key={p.label} className="rounded-lg bg-slate-50 border border-slate-200 p-3">
                <p className="text-2xl font-extrabold text-navy-900">{p.value}</p>
                <p className="text-xs text-slate-500">{p.label}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-4 mt-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <Labeled label="Outgoing supervisor"><Input defaultValue="Sipho Khumalo · Day Shift" /></Labeled>
          <Labeled label="Incoming supervisor"><Input defaultValue="Night Shift Supervisor" /></Labeled>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-600">Shift summary</label>
            <Button size="sm" variant="secondary" onClick={aiDraft} disabled={drafting}><Sparkles size={13} /> {drafting ? "Drafting…" : "AI draft summary"}</Button>
          </div>
          <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={5} className="w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30" placeholder="Summary of the shift…" />
        </div>

        <div className="mt-4 flex gap-2">
          <Button onClick={() => setPdfOpen(true)}><FileDown size={16} /> Generate handover PDF</Button>
          <Button variant="success" onClick={() => pushToast({ title: "Handover sent · Night Shift acknowledged", variant: "success" })}>
            <Send size={16} /> Send to next shift
          </Button>
        </div>
      </Card>

      <Dialog open={pdfOpen} onClose={() => setPdfOpen(false)} title="Shift Handover · HO-NS-0627" size="lg">
        <div className="p-6">
          <div className="rounded-xl border border-slate-300 p-6 bg-white" id="ho-doc">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <p className="font-extrabold text-navy-900 text-lg">Shift Handover Sheet</p>
                <p className="text-xs text-slate-500">HO-NS-0627 · Black Mountain · {new Date().toLocaleDateString("en-ZA")}</p>
              </div>
              <Chip tone="slate">POPIA · Internal (C3)</Chip>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-slate-500">Outgoing:</span> Sipho Khumalo</div>
              <div><span className="text-slate-500">Incoming:</span> Night Shift</div>
            </div>
            <p className="mt-4 text-sm text-navy-800 leading-relaxed">{summary || "No summary captured."}</p>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {pulled.slice(0, 3).map((p) => (
                <div key={p.label} className="rounded border border-slate-200 p-2 text-center">
                  <p className="font-bold text-navy-900">{p.value}</p>
                  <p className="text-[10px] text-slate-500">{p.label}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-[10px] text-slate-400 border-t border-slate-200 pt-2">
              Zensar × Vedanta Zinc International · Generated by Sentinel Shift Handover Agent
            </p>
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => window.print()}><FileDown size={16} /> Download / Print</Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

const Labeled = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="text-xs font-semibold text-slate-600 mb-1 block">{label}</label>
    {children}
  </div>
);
const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30" />
);
