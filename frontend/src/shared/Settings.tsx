import { useEffect, useRef, useState } from "react";
import { Card, SectionHeader, Chip, DataTable } from "../components/ui/ui";
import { useStore } from "../store/store";
import { admin, type AgentConfig, type AdminUser } from "../lib/api";
import { agents as seedAgents, users as seedUsers } from "../mock/seed";

const seedAgentConfig: AgentConfig[] = seedAgents.map((a) => ({
  id: a.id, name: a.name, color: a.color, handledToday: a.handledToday, enabled: true,
}));
const seedUserRows: AdminUser[] = seedUsers.map((u) => ({
  id: u.id, name: u.name, role: u.role, title: u.title, area: u.area ?? "", initials: u.initials,
}));

export function Settings() {
  const [agents, setAgents] = useState<AgentConfig[]>(seedAgentConfig);
  const [users, setUsers] = useState<AdminUser[]>(seedUserRows);
  const [threshold, setThreshold] = useState(85);
  const [online, setOnline] = useState(false);
  const pushToast = useStore((s) => s.pushToast);
  const saveTimer = useRef<number | null>(null);

  // Load persisted Admin settings from the backend (falls back to seed data).
  useEffect(() => {
    admin
      .getSettings()
      .then((s) => {
        if (s?.agents?.length) setAgents(s.agents);
        if (s?.users?.length) setUsers(s.users);
        if (typeof s?.threshold === "number") setThreshold(s.threshold);
        setOnline(true);
      })
      .catch(() => setOnline(false));
  }, []);

  const toggleAgent = async (a: AgentConfig) => {
    const next = !a.enabled;
    setAgents((prev) => prev.map((x) => (x.id === a.id ? { ...x, enabled: next } : x))); // optimistic
    try {
      await admin.toggleAgent(a.id, next);
      pushToast({
        title: `${a.name} ${next ? "enabled" : "disabled"}`,
        detail: next ? "Agent is now serving requests" : "Requests to this agent will be refused",
        variant: next ? "success" : "warn",
      });
    } catch {
      setAgents((prev) => prev.map((x) => (x.id === a.id ? { ...x, enabled: a.enabled } : x))); // revert
      pushToast({ title: "Could not save", detail: "Backend offline", variant: "error" });
    }
  };

  const onThreshold = (value: number) => {
    setThreshold(value); // responsive UI
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      admin
        .setThreshold(value)
        .then((r) => pushToast({ title: `Auto-routing threshold set to ${r.threshold}%`, variant: "info" }))
        .catch(() => {/* backend offline — keep local value */});
    }, 400);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-5">
      <SectionHeader
        title="Settings / Admin"
        subtitle={`Agent configuration · users · knowledge sources${online ? " · saved to backend" : " · offline (local only)"}`}
      />

      <Card className="p-4">
        <h3 className="font-bold text-navy-900 mb-3">Agents</h3>
        <div className="space-y-2">
          {agents.map((a) => (
            <div key={a.id} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2.5">
              <span className="flex items-center gap-2 text-sm font-medium text-navy-900">
                <span className="h-2 w-2 rounded-full" style={{ background: a.color }} /> {a.name}
                {!a.enabled && <Chip tone="slate">disabled</Chip>}
              </span>
              <button
                aria-label={`Toggle ${a.name}`}
                onClick={() => toggleAgent(a)}
                className={`h-6 w-11 rounded-full transition-colors ${a.enabled ? "bg-safety-green" : "bg-slate-300"}`}
              >
                <span className={`block h-5 w-5 rounded-full bg-white shadow transition-transform mt-0.5 ${a.enabled ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <label className="text-sm font-semibold text-navy-900">Confidence threshold for auto-routing: {threshold}%</label>
          <input
            type="range" min={50} max={99} value={threshold}
            onChange={(e) => onThreshold(+e.target.value)}
            className="w-full mt-2 accent-brand"
          />
          <p className="mt-1 text-xs text-slate-500">
            The Supervisor auto-routes a query only when its intent confidence is at or above this threshold.
          </p>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-bold text-navy-900 mb-3">Users & roles</h3>
        <DataTable<AdminUser>
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
