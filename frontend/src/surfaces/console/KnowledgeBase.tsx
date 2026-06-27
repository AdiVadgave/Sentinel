import { useState } from "react";
import { AlertTriangle, BookOpen, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, SectionHeader, DataTable, Chip, Dialog, Button } from "../../components/ui/ui";
import { sops, type Sop } from "../../mock/seed";

const statusTone = (s: Sop["status"]) =>
  s === "Current" ? "green" : s === "Review due" ? "amber" : "red";

export function KnowledgeBase() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<Sop | null>(null);
  const navigate = useNavigate();

  const rows = sops.filter((s) => (s.title + s.id).toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <SectionHeader title="Knowledge Base" subtitle="Configured safety knowledge · version control + standard-change monitoring" />

      <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-3.5 flex items-center gap-3">
        <AlertTriangle className="text-safety-red" />
        <p className="text-sm text-red-800 font-semibold">
          Regulatory standard updated — revised national fall-protection standard. <strong>3 SOPs need review.</strong>
        </p>
      </div>

      <Card className="p-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search documents…"
          className="mb-3 w-full max-w-sm rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
        />
        <DataTable<Sop>
          rows={rows}
          onRowClick={(r) => setOpen(r)}
          columns={[
            { key: "id", label: "Document", render: (r) => <span className="font-semibold flex items-center gap-1.5"><BookOpen size={14} className="text-brand" />{r.id}</span> },
            { key: "title", label: "Title" },
            { key: "type", label: "Type", render: (r) => <Chip tone="blue">{r.type}</Chip> },
            { key: "version", label: "Version" },
            { key: "owner", label: "Owner" },
            { key: "approved", label: "Approved" },
            { key: "status", label: "Status", render: (r) => <Chip tone={statusTone(r.status)}>{r.status}</Chip> },
          ]}
        />
      </Card>

      <Dialog open={!!open} onClose={() => setOpen(null)} title={open ? `${open.id} · ${open.title}` : ""} size="lg">
        {open && (
          <div className="p-5 space-y-4">
            <div className="flex flex-wrap gap-2">
              <Chip tone="blue">{open.version}</Chip>
              <Chip tone="green">Approved {open.approved}</Chip>
              <Chip tone="slate">Owner {open.owner}</Chip>
              <Chip tone={statusTone(open.status)}>{open.status}</Chip>
            </div>
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">AI summary</p>
              <p className="text-sm text-navy-800">
                {open.title} defines the critical controls and safe-work requirements for this hazard,
                benchmarked against MHSA 1996, ISO 45001 and ICMM Critical Control Management. Controls
                are framed preventively using the hierarchy of controls.
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Version history</p>
              <ol className="relative border-l border-slate-200 ml-1.5 space-y-2">
                {["v(prev) — initial controls", `${open.version} — ${open.approved} · current`].map((v, i) => (
                  <li key={i} className="ml-4 text-sm text-navy-800">
                    <span className="absolute -left-1.5 h-3 w-3 rounded-full bg-brand" />{v}
                  </li>
                ))}
              </ol>
            </div>
            <Button onClick={() => navigate("/pow/ask")}><MessageSquare size={15} /> Ask about this document</Button>
          </div>
        )}
      </Dialog>
    </div>
  );
}
