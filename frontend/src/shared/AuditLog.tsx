import { useStore } from "../store/store";
import { Card, SectionHeader, DataTable, Chip } from "../components/ui/ui";
import type { AuditEntry } from "../mock/seed";

export function AuditLog() {
  const audit = useStore((s) => s.audit);
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <SectionHeader title="Audit Log" subtitle="Every AI recommendation & sign-off · source, version, POPIA classification" />
      <Card className="p-4">
        <DataTable<AuditEntry>
          rows={audit}
          columns={[
            { key: "ts", label: "Timestamp" },
            { key: "user", label: "User" },
            { key: "agent", label: "Agent", render: (r) => <Chip tone="blue">{r.agent}</Chip> },
            { key: "action", label: "Action" },
            { key: "source", label: "Source + version", render: (r) => <span className="font-mono text-xs">{r.source}</span> },
            { key: "popia", label: "POPIA", render: (r) => <Chip tone="slate">{r.popia}</Chip> },
            { key: "outcome", label: "Outcome" },
          ]}
        />
      </Card>
    </div>
  );
}
