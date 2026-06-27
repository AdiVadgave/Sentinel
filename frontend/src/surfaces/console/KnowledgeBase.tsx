import { useEffect, useState } from "react";
import { AlertTriangle, BookOpen, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, SectionHeader, DataTable, Chip, Dialog, Button } from "../../components/ui/ui";
import { api, type KnowledgeDoc } from "../../lib/api";
import { sops as seedSops } from "../../mock/seed";

// Seed fallback mapped into the backend KnowledgeDoc shape (used only if offline).
const seedDocs: KnowledgeDoc[] = seedSops.map((s) => ({
  id: s.id, title: s.title, type: s.type === "Standard" ? "Standard" : "SOP",
  version: s.version, owner: s.owner, approved: s.approved,
  status: s.status, source: "", body: "", critical_controls: [], history: [],
}));

const statusTone = (s: KnowledgeDoc["status"]) =>
  s === "Current" ? "green" : s === "Review due" ? "amber" : "red";

export function KnowledgeBase() {
  const [docs, setDocs] = useState<KnowledgeDoc[]>(seedDocs);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<KnowledgeDoc | null>(null);
  const navigate = useNavigate();

  // Load the real corpus (SOPs + standards) from the backend grounding store.
  useEffect(() => {
    api
      .knowledge()
      .then((rows) => Array.isArray(rows) && rows.length && setDocs(rows))
      .catch(() => {/* backend unreachable — keep seed list */});
  }, []);

  const needReview = docs.filter((d) => d.status !== "Current").length;
  const rows = docs.filter((s) => (s.title + s.id).toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <SectionHeader title="Knowledge Base" subtitle="Configured safety knowledge · served from the live grounding corpus · version control + change monitoring" />

      <div className="mb-4 rounded-xl bg-red-50 border border-red-200 p-3.5 flex items-center gap-3">
        <AlertTriangle className="text-safety-red" />
        <p className="text-sm text-red-800 font-semibold">
          Regulatory standard updated — revised national fall-protection standard. <strong>{needReview} document{needReview === 1 ? "" : "s"} need review.</strong>
        </p>
      </div>

      <Card className="p-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search documents…"
          className="mb-3 w-full max-w-sm rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
        />
        <DataTable<KnowledgeDoc>
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
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Summary</p>
              <p className="text-sm text-navy-800">
                {open.body || `${open.title} defines the critical controls and safe-work requirements for this hazard, benchmarked against MHSA 1996, ISO 45001 and ICMM Critical Control Management.`}
              </p>
            </div>

            {open.critical_controls.length > 0 && (
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
                  {open.type === "Standard" ? "Key points" : "Critical controls"}
                </p>
                <ul className="space-y-1.5">
                  {open.critical_controls.map((c, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-navy-800">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand-accent shrink-0" />{c}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="rounded-lg border border-slate-200 p-3">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Version history</p>
              {open.history.length > 0 ? (
                <ol className="relative border-l border-slate-200 ml-1.5 space-y-2">
                  {open.history.map((h, i) => (
                    <li key={i} className="ml-4 text-sm text-navy-800">
                      <span className="absolute -left-1.5 h-3 w-3 rounded-full bg-brand" />
                      <strong>{h.version}</strong> — {h.date} · {h.note}
                      {open.version === h.version && <Chip tone="green">current</Chip>}
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-sm text-slate-500">No prior versions recorded.</p>
              )}
            </div>

            <Button onClick={() => navigate("/pow/ask")}><MessageSquare size={15} /> Ask about this document</Button>
          </div>
        )}
      </Dialog>
    </div>
  );
}
