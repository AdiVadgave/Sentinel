import { useState } from "react";
import { Card, SectionHeader, Chip, DataTable } from "../components/ui/ui";
import { agents, users, type User } from "../mock/seed";

export function Settings() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(agents.map((a) => [a.id, true]))
  );
  const [threshold, setThreshold] = useState(85);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-5">
      <SectionHeader title="Settings / Admin" subtitle="Agent configuration · users · knowledge sources" />

      <Card className="p-4">
        <h3 className="font-bold text-navy-900 mb-3">Agents</h3>
        <div className="space-y-2">
          {agents.map((a) => (
            <div key={a.id} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2.5">
              <span className="flex items-center gap-2 text-sm font-medium text-navy-900">
                <span className="h-2 w-2 rounded-full" style={{ background: a.color }} /> {a.name}
              </span>
              <button
                onClick={() => setEnabled((e) => ({ ...e, [a.id]: !e[a.id] }))}
                className={`h-6 w-11 rounded-full transition-colors ${enabled[a.id] ? "bg-safety-green" : "bg-slate-300"}`}
              >
                <span className={`block h-5 w-5 rounded-full bg-white shadow transition-transform mt-0.5 ${enabled[a.id] ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <label className="text-sm font-semibold text-navy-900">Confidence threshold for auto-routing: {threshold}%</label>
          <input type="range" min={50} max={99} value={threshold} onChange={(e) => setThreshold(+e.target.value)} className="w-full mt-2 accent-brand" />
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-bold text-navy-900 mb-3">Users & roles</h3>
        <DataTable<User>
          rows={users}
          columns={[
            { key: "name", label: "Name" },
            { key: "title", label: "Title" },
            { key: "role", label: "Role", render: (r) => <Chip tone="blue">{r.role}</Chip> },
          ]}
        />
      </Card>

      <Card className="p-4">
        <h3 className="font-bold text-navy-900 mb-2">Knowledge sources</h3>
        <div className="flex flex-wrap gap-2">
          <Chip tone="green">SharePoint › HSE › SOPs (Connected)</Chip>
          <Chip tone="green">Enablon incidents (Connected)</Chip>
          <Chip tone="blue">MHSA 1996 · OHSA · ISO 45001 · ICMM · MHSC · ILO C176</Chip>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Agents ground answers in VZI SOPs <strong>and</strong> international / South African mining standards, with a proactive, preventive bias.
        </p>
      </Card>
    </div>
  );
}
