import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Pencil, ShieldCheck, FileText, Link2, AlertTriangle } from "lucide-react";
import { useStore } from "../../store/store";
import { api, isDisabled, type IcamDraft } from "../../lib/api";
import { AgentThinking } from "../../components/agent/AgentBits";
import { Card, SectionHeader, Chip, Button, StatusChip } from "../../components/ui/ui";
import { nowStamp } from "../../lib/util";

export function Investigation() {
  const location = useLocation() as { state?: { id?: string } };
  const work = useStore((s) => s.work);
  const transition = useStore((s) => s.transition);
  const pushToast = useStore((s) => s.pushToast);
  const user = useStore((s) => s.user)!;

  const incidentId = location.state?.id ?? "NM-2026-0337";
  const incident = work.find((w) => w.id === incidentId) ?? work.find((w) => w.type === "Near-Miss")!;

  const [draft, setDraft] = useState<IcamDraft | null>(null);
  const [loading, setLoading] = useState(true);
  const [edited, setEdited] = useState<Record<string, boolean>>({});
  const [signName, setSignName] = useState("");
  const [signError, setSignError] = useState("");
  const [signed, setSigned] = useState(false);

  useEffect(() => {
    setLoading(true);
    setSigned(false);
    setDraft(null);
    api
      .icam({ incidentId: incident.id, area: incident.area, type: incident.type, description: incident.description })
      .then((d) => {
        if (isDisabled(d)) {
          setDraft(null);
          pushToast({ title: "Incident Investigation agent disabled", detail: d.message, variant: "warn" });
        } else {
          setDraft(d);
        }
      })
      .catch(() => setDraft(null))
      .finally(() => setLoading(false));
  }, [incident.id]);

  const signOff = () => {
    if (!signName.trim()) {
      setSignError("Sign-off requires your HSE owner identity.");
      return;
    }
    setSignError("");
    transition(incident.id, "Approved", signName);
    setSigned(true);
    pushToast({ title: "Investigation signed off", detail: `${incident.id} approved · pushed to Incident Intelligence`, variant: "success" });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <SectionHeader
        title={`Incident Investigation · ${incident.id}`}
        subtitle="ICAM agent draft · human-in-the-loop sign-off"
        right={<Chip tone="blue"><Link2 size={12} /> Enablon-linked</Chip>}
      />

      {/* Human-in-the-loop banner */}
      <motion.div
        layout
        className={`mb-5 rounded-xl border p-3.5 flex items-center gap-3 ${signed ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}`}
      >
        {signed ? (
          <>
            <ShieldCheck className="text-safety-green" />
            <p className="text-sm font-semibold text-green-800">
              Signed off by {signName} · {nowStamp()} · logged to audit
            </p>
          </>
        ) : (
          <>
            <AlertTriangle className="text-safety-amber" />
            <p className="text-sm font-semibold text-amber-800">
              AI-drafted — requires HSE owner sign-off before finalising.
            </p>
            <span className="ml-auto"><StatusChip state={incident.status} /></span>
          </>
        )}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Facts */}
        <Card className="p-4 h-fit">
          <h3 className="font-bold text-navy-900 mb-3">Incident facts</h3>
          <dl className="space-y-2 text-sm">
            <Fact k="ID" v={incident.id} />
            <Fact k="Type" v={incident.type} />
            <Fact k="Area" v={incident.area} />
            <Fact k="Reported by" v={incident.reportedBy} />
            <Fact k="Severity" v={incident.severity ?? "—"} />
            <Fact k="Description" v={incident.description ?? "—"} />
          </dl>
          <div className="mt-4 rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-600 flex items-center gap-2">
            <FileText size={14} className="text-brand" /> Aligned to ICAM SOP-INV-002 v2.1
          </div>
        </Card>

        {/* AI draft */}
        <div className="lg:col-span-2 space-y-4">
          {loading && <AgentThinking label="Drafting investigation… (ICAM agent)" />}
          {draft && (
            <>
              {draft.mode && (
                <p className="text-[11px] text-slate-400">Generated via {draft.mode}</p>
              )}
              <Section title="Timeline" items={draft.timeline} id="timeline" edited={edited} setEdited={setEdited} />
              <Section title="Absent / failed defences" items={draft.absent_failed_defences} id="defences" edited={edited} setEdited={setEdited} />
              <Section title="Individual / team actions" items={draft.individual_team_actions} id="actions" edited={edited} setEdited={setEdited} />
              <Section title="Task / environmental conditions" items={draft.task_environmental_conditions} id="conditions" edited={edited} setEdited={setEdited} />
              <Section title="Organisational factors" items={draft.organisational_factors} id="org" edited={edited} setEdited={setEdited} />

              <Card className="p-4">
                <h4 className="font-bold text-navy-900 mb-2">Causal factors (ranked)</h4>
                <ol className="space-y-1.5">
                  {draft.causal_factors.map((c) => (
                    <li key={c.rank} className="flex items-center gap-2 text-sm text-navy-800">
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-navy-900 text-white text-[10px] font-bold">{c.rank}</span>
                      {c.factor}
                    </li>
                  ))}
                </ol>
              </Card>

              <Card className="p-4">
                <h4 className="font-bold text-navy-900 mb-2">Recommended corrective actions</h4>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-500 border-b border-slate-200">
                      <th className="py-2 font-semibold">Action</th>
                      <th className="py-2 font-semibold">Owner</th>
                      <th className="py-2 font-semibold">Due</th>
                      <th className="py-2 font-semibold">Priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    {draft.corrective_actions.map((a, i) => (
                      <tr key={i} className="border-b border-slate-100 group">
                        <td className="py-2 pr-2">
                          <span className="flex items-center gap-1.5">
                            {a.action}
                            {edited[`ca-${i}`] && <Chip tone="amber">edited</Chip>}
                            <button onClick={() => setEdited((e) => ({ ...e, [`ca-${i}`]: true }))} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-brand">
                              <Pencil size={12} />
                            </button>
                          </span>
                        </td>
                        <td className="py-2 pr-2">{a.owner}</td>
                        <td className="py-2 pr-2">{a.due}</td>
                        <td className="py-2"><Chip tone={a.priority === "High" ? "red" : a.priority === "Medium" ? "amber" : "slate"}>{a.priority}</Chip></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="mt-2 text-xs text-slate-400">{draft.alignment} · benchmarked against MHSA, ISO 45001, ICMM CCM.</p>
              </Card>

              {/* Sign-off gate */}
              {!signed && (
                <Card className="p-4 border-amber-200 bg-amber-50/40">
                  <h4 className="font-bold text-navy-900 mb-1">Human-in-the-loop sign-off</h4>
                  <p className="text-xs text-slate-500 mb-3">Approve button is disabled until your HSE owner identity is entered.</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      value={signName}
                      onChange={(e) => setSignName(e.target.value)}
                      placeholder="HSE owner name / PIN"
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm flex-1 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-brand/30"
                    />
                    <Button variant="secondary" onClick={() => pushToast({ title: "Change request sent to agent", variant: "info" })}>Request changes</Button>
                    <Button variant="success" disabled={!signName.trim()} onClick={signOff}>
                      <ShieldCheck size={16} /> Sign off & approve
                    </Button>
                  </div>
                  {signError && <p className="mt-2 text-xs text-safety-red">{signError}</p>}
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Fact({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-slate-500 shrink-0">{k}</dt>
      <dd className="text-navy-900 font-medium text-right">{v}</dd>
    </div>
  );
}

function Section({
  title,
  items,
  id,
  edited,
  setEdited,
}: {
  title: string;
  items: string[];
  id: string;
  edited: Record<string, boolean>;
  setEdited: (fn: (e: Record<string, boolean>) => Record<string, boolean>) => void;
}) {
  return (
    <Card className="p-4 group">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-bold text-navy-900">{title}</h4>
        <span className="flex items-center gap-1.5">
          {edited[id] && <Chip tone="amber">edited</Chip>}
          <button onClick={() => setEdited((e) => ({ ...e, [id]: true }))} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-brand">
            <Pencil size={13} />
          </button>
        </span>
      </div>
      <ul className="space-y-1.5">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-navy-800">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand-accent shrink-0" />
            <span contentEditable suppressContentEditableWarning onInput={() => setEdited((e) => ({ ...e, [id]: true }))} className="outline-none focus:bg-blue-50 rounded px-0.5">
              {it}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
