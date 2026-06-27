import { useEffect, useState } from "react";
import { Plug, RefreshCw, CheckCircle2, Loader2 } from "lucide-react";
import { useStore } from "../store/store";
import { Card, SectionHeader, Chip, Button } from "../components/ui/ui";
import { admin, type IntegrationState } from "../lib/api";
import { integrations as seed } from "../mock/seed";

export function Integrations() {
  const [items, setItems] = useState<IntegrationState[]>(seed);
  const [syncing, setSyncing] = useState<string | null>(null);
  const pushToast = useStore((s) => s.pushToast);

  // Load persisted integration state from the backend (falls back to seed).
  useEffect(() => {
    admin
      .getIntegrations()
      .then((rows) => Array.isArray(rows) && rows.length && setItems(rows))
      .catch(() => {/* backend unreachable — keep seed data */});
  }, []);

  const sync = async (it: IntegrationState) => {
    setSyncing(it.id);
    try {
      const updated = await admin.syncIntegration(it.id);
      setItems((prev) => prev.map((x) => (x.id === it.id ? updated : x)));
      pushToast({ title: `Synced ${updated.records.toLocaleString()} records`, detail: it.name, variant: "success" });
    } catch {
      // Backend unreachable — degrade gracefully without persisting.
      pushToast({ title: "Sync unavailable", detail: `${it.name} — backend offline`, variant: "warn" });
    } finally {
      setSyncing(null);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <SectionHeader title="Integrations" subtitle="Connected enterprise systems · sync state persisted server-side" />
      <div className="grid sm:grid-cols-2 gap-4">
        {items.map((it) => (
          <Card key={it.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand/10 text-brand"><Plug size={18} /></span>
                <div>
                  <p className="font-bold text-navy-900">{it.name}</p>
                  <p className="text-xs text-slate-400">Last sync {it.lastSync} · {it.records.toLocaleString()} records</p>
                </div>
              </div>
              <Chip tone="green"><CheckCircle2 size={12} /> Connected</Chip>
            </div>
            <Button size="sm" variant="secondary" className="mt-3" onClick={() => sync(it)} disabled={syncing === it.id}>
              {syncing === it.id ? <><Loader2 size={13} className="animate-spin" /> Syncing…</> : <><RefreshCw size={13} /> Sync now</>}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
