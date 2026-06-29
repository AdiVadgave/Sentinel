import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Send, ListChecks, FileText, ThumbsDown, AlertOctagon } from "lucide-react";
import { motion } from "framer-motion";
import { useStore } from "../../store/store";
import { api, askStream, type ClassifyResult, type KnowledgeSource } from "../../lib/api";
import { suggestedPrompts } from "../../mock/seed";
import { RoutingStrip, StreamedAnswer, SourceChip, SourceDrawer, GuardrailLine } from "../../components/agent/AgentBits";
import { Button } from "../../components/ui/ui";

interface Turn {
  id: number;
  role: "user" | "agent";
  text: string;
  routing?: ClassifyResult | null;
  source?: KnowledgeSource | null;
  streaming?: boolean;
  refused?: boolean;
}

export function AskZenSentinel() {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [drawerSrc, setDrawerSrc] = useState<KnowledgeSource | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const seq = useRef(0);
  const navigate = useNavigate();
  const pushToast = useStore((s) => s.pushToast);
  const logAudit = useStore((s) => s.logAudit);
  const user = useStore((s) => s.user)!;

  const send = async (text: string) => {
    if (!text.trim() || busy) return;
    setInput("");
    setBusy(true);
    const userTurn: Turn = { id: ++seq.current, role: "user", text };
    const agentId = ++seq.current;
    setTurns((t) => [...t, userTurn, { id: agentId, role: "agent", text: "", routing: null, streaming: true }]);

    // 1) Supervisor classifies + routes (drives the routing strip).
    let routing: ClassifyResult | null = null;
    try {
      routing = await api.classify(text);
    } catch {
      routing = { intent: "point-of-work guidance", confidence: 98, route: "knowledge-risk", mode: "offline" };
    }
    setTurns((t) => t.map((x) => (x.id === agentId ? { ...x, routing } : x)));

    // small delay so the routing animation plays before the answer streams
    await new Promise((r) => setTimeout(r, 1700));

    // 2) Knowledge & Risk streams the grounded answer (honouring the Supervisor's route).
    let refused = false;
    await askStream(text, {
      onToken: (tok) =>
        setTurns((t) => t.map((x) => (x.id === agentId ? { ...x, text: x.text + tok } : x))),
      onSource: (src) =>
        setTurns((t) => t.map((x) => (x.id === agentId ? { ...x, source: src } : x))),
      onRefused: () => {
        refused = true;
        setTurns((t) => t.map((x) => (x.id === agentId ? { ...x, refused: true } : x)));
      },
      onDone: () => {
        setTurns((t) => t.map((x) => (x.id === agentId ? { ...x, streaming: false } : x)));
        setBusy(false);
        const offDomain = refused || routing?.route === "out-of-domain";
        logAudit({
          user: user.name,
          agent: offDomain ? "Supervisor" : "Knowledge & Risk",
          action: `Asked: ${text.slice(0, 48)}`,
          source: offDomain ? "—" : "VZI SOP corpus",
          popia: "Internal (C3)",
          outcome: offDomain ? "Refused — out of safety domain" : "Answered + cited",
        });
      },
      onError: () => {
        setTurns((t) =>
          t.map((x) => (x.id === agentId ? { ...x, streaming: false, text: x.text || "Connection error — is the backend running on :8000?" } : x))
        );
        setBusy(false);
      },
    }, routing?.route);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="px-4 py-3 border-b border-slate-200 bg-white">
        <h1 className="font-extrabold text-navy-900">Ask Zen-Sentinel</h1>
        <p className="text-[11px] text-slate-500">Supervisor → Knowledge & Risk · grounded answers only</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {turns.length === 0 && (
          <div className="text-center text-slate-400 text-sm mt-8">
            Ask about SOPs, permits, critical controls or "can I…" questions.
          </div>
        )}
        {turns.map((t) =>
          t.role === "user" ? (
            <div key={t.id} className="flex justify-end">
              <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-brand text-white px-3.5 py-2 text-sm">
                {t.text}
              </div>
            </div>
          ) : (
            <motion.div key={t.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
              <RoutingStrip result={t.routing ?? null} />
              {(t.text || t.streaming) && (
                <div className="rounded-2xl rounded-tl-sm bg-white border border-slate-200 p-3.5 space-y-3">
                  {t.refused ? (
                    <div className="flex items-start gap-2 text-sm text-amber-700">
                      <AlertOctagon size={16} className="mt-0.5 shrink-0" />
                      <StreamedAnswer text={t.text} streaming={!!t.streaming} />
                    </div>
                  ) : (
                    <StreamedAnswer text={t.text} streaming={!!t.streaming} />
                  )}

                  {t.source && !t.streaming && !t.refused && (
                    <SourceChip source={t.source} onOpen={() => { setDrawerSrc(t.source!); setDrawerOpen(true); }} />
                  )}

                  {!t.streaming && !t.refused && (
                    <>
                      <GuardrailLine>
                        Grounded in VZI SOPs + SA/international mining standards. Verified by HSE. Human
                        sign-off required for any deviation.
                      </GuardrailLine>
                      <div className="flex flex-wrap gap-2 pt-1">
                        <Button size="sm" onClick={() => navigate("/pow/checklist")}>
                          <ListChecks size={14} /> Start pre-task checklist
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => { setDrawerSrc(t.source ?? null); setDrawerOpen(true); }}>
                          <FileText size={14} /> View full SOP
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => pushToast({ title: "Feedback logged", detail: "Thanks — routed to HSE for review.", variant: "info" })}>
                          <ThumbsDown size={14} /> Not helpful
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </motion.div>
          )
        )}
      </div>

      {/* suggested chips + input */}
      <div className="border-t border-slate-200 bg-white p-3">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {suggestedPrompts.map((p) => (
            <button
              key={p}
              onClick={() => send(p)}
              disabled={busy}
              className="shrink-0 rounded-full border border-slate-300 bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-navy-800 hover:bg-slate-100 disabled:opacity-50"
            >
              {p}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send(input)}
            placeholder="Ask a safety question…"
            className="flex-1 rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
          <Button onClick={() => send(input)} disabled={busy} className="!px-3">
            <Send size={18} />
          </Button>
        </div>
      </div>

      <SourceDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} source={drawerSrc} />
    </div>
  );
}
