import { useState } from "react";
import { Plug, RefreshCw, CheckCircle2, Loader2 } from "lucide-react";
import { useStore } from "../store/store";
import { Card, SectionHeader, Chip, Button } from "../components/ui/ui";
import { integrations as seed, type Integration } from "../mock/seed";

export function Integrations() {
  const [items, setItems] = useState<Integration[]>(seed);
  const [syncing, setSyncing] = useState<string | null>(null);
  const pushToast = useStore((s) => s.pushToast);

  const sync = (it: Integration) => {
    setSyncing(it.id);
    setTimeout(() => {
      const newCount = it.records + Math.floor(Math.random() * 40);
      setItems((prev) => prev.map((x) => (x.id === it.id ? { ...x, records: newCount, lastSync: "just now" } : x)));
      setSyncing(null);
      pushToast({ title: `Synced ${newCount.toLocaleString()} records`, detail: it.name, variant: "success" });
    }, 1200);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <SectionHeader title="Integrations" subtitle="Connected enterprise systems · MCP tool servers in production" />
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
