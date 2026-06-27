import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store/store";
import { Card, DataTable, SectionHeader, StatusChip, Chip, Button } from "../../components/ui/ui";
import { activityFeed, agents } from "../../mock/seed";
import type { WorkItem } from "../../mock/seed";

const agentLabel = (id: string) => agents.find((a) => a.id === id)?.name ?? id;

export function ConsoleHome() {
  const work = useStore((s) => s.work);
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();

  const states = ["All", "Submitted", "Under Review", "Approved", "Closed"];
  const rows = filter === "All" ? work : work.filter((w) => w.status === filter);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <SectionHeader
        title="Supervisor Console"
        subtitle="HSE command centre · work queue and live agent activity"
      />

      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-navy-900">Work Queue</h3>
            <div className="flex gap-1">
              {states.map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${filter === s ? "bg-brand text-white" : "bg-slate-100 text-slate-600"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <DataTable<WorkItem>
            rows={rows}
            onRowClick={(r) => navigate("/console/investigation", { state: { id: r.id } })}
            columns={[
              { key: "id", label: "ID", render: (r) => <span className="font-semibold">{r.id}</span> },
              { key: "type", label: "Type" },
              { key: "area", label: "Area" },
              { key: "reportedBy", label: "Reported by" },
              { key: "status", label: "Status", render: (r) => <StatusChip state={r.status} /> },
              { key: "agent", label: "Agent", render: (r) => <Chip tone="blue">{agentLabel(r.agent)}</Chip> },
              { key: "age", label: "Age", render: (r) => `${r.ageHrs}h` },
              { key: "action", label: "", render: () => <Button size="sm" variant="secondary">Open</Button> },
            ]}
          />
        </Card>

        <div className="space-y-5">
          <Card className="p-4">
            <h3 className="font-bold text-navy-900 mb-3">Agent activity</h3>
            <div className="space-y-2.5">
              {activityFeed.map((f) => (
                <div key={f.id} className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand-accent shrink-0" />
                  <div>
                    <p className="text-sm text-navy-800">{f.text}</p>
                    <p className="text-[10px] text-slate-400">{f.ago}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-4">
            <h3 className="font-bold text-navy-900 mb-3">Agents online</h3>
            <div className="space-y-2">
              {agents.map((a) => (
                <div key={a.id} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ background: a.color }} />
                    {a.name}
                  </span>
                  <span className="text-xs text-slate-400">{a.handledToday} today</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
