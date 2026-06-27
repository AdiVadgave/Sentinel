// API client for the FastAPI backend (Azure GPT-4o gateway).
// All calls go through Vite's /api proxy → http://localhost:8000.

export interface ClassifyResult {
  intent: string;
  confidence: number;
  route: string;
  rationale?: string;
  mode?: string;
}

export interface KnowledgeSource {
  id: string;
  title: string;
  version: string;
  approved: string;
}

export interface KnowledgeAnswer {
  summary: string;
  critical_controls: string[];
  before_you_start: string[];
  standards?: string[];
  source: KnowledgeSource;
  guardrail: string;
  refused?: boolean;
  message?: string;
  mode?: string;
}

export interface IcamDraft {
  timeline: string[];
  absent_failed_defences: string[];
  individual_team_actions: string[];
  task_environmental_conditions: string[];
  organisational_factors: string[];
  causal_factors: { factor: string; rank: number }[];
  corrective_actions: { action: string; owner: string; due: string; priority: string }[];
  alignment: string;
  mode?: string;
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

export interface ReportClassification {
  category: string;
  control: string;
  severity?: string;
  similar: number;
  mode?: string;
}
export interface ControlsSuggestion {
  controls: string;
  standards?: string[];
  mode?: string;
}
export interface HandoverSummary {
  summary: string;
  mode?: string;
}
export interface GeneratedReport {
  title: string;
  period: string;
  summary: string;
  sections: { heading: string; body: string }[];
  mode?: string;
}
export interface GeneratedLesson {
  insight: string;
  title: string;
  summary: string;
  control: string;
  standards?: string[];
  mode?: string;
}

export const api = {
  health: () => fetch("/api/health").then((r) => r.json()),
  classify: (message: string) => postJson<ClassifyResult>("/api/agents/classify", { message }),
  ask: (message: string) => postJson<KnowledgeAnswer>("/api/agents/ask", { message }),
  icam: (incident: Record<string, unknown>) => postJson<IcamDraft>("/api/agents/icam", incident),
  classifyReport: (r: { type?: string; area?: string; description: string }) =>
    postJson<ReportClassification>("/api/agents/classify-report", r),
  suggestControls: (r: { task?: string; hazards?: string }) =>
    postJson<ControlsSuggestion>("/api/agents/suggest-controls", r),
  handoverSummary: (context?: string) =>
    postJson<HandoverSummary>("/api/agents/handover-summary", { context: context ?? "" }),
  report: (reportId: string) => postJson<GeneratedReport>("/api/agents/report", { reportId }),
  lesson: (p: { area: string; hazard: string; count: number; window: string; related: string[] }) =>
    postJson<GeneratedLesson>("/api/agents/lesson", p),
  sops: () => fetch("/api/agents/sops").then((r) => r.json()),
};

export interface StreamHandlers {
  onToken: (text: string) => void;
  onSource?: (src: KnowledgeSource) => void;
  onNotice?: (text: string) => void;
  onRefused?: () => void;
  onDone?: (mode?: string) => void;
  onError?: (err: unknown) => void;
}

// Reads the SSE stream from /api/agents/ask/stream and dispatches events.
export async function askStream(message: string, h: StreamHandlers): Promise<void> {
  try {
    const res = await fetch("/api/agents/ask/stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    if (!res.body) throw new Error("No stream body");
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split("\n\n");
      buffer = parts.pop() ?? "";
      for (const part of parts) {
        const line = part.trim();
        if (!line.startsWith("data:")) continue;
        const json = line.slice(5).trim();
        if (!json) continue;
        let evt: any;
        try {
          evt = JSON.parse(json);
        } catch {
          continue;
        }
        switch (evt.type) {
          case "token":
            h.onToken(evt.text);
            break;
          case "source":
            h.onSource?.(evt.source);
            break;
          case "notice":
            h.onNotice?.(evt.text);
            break;
          case "refused":
            h.onRefused?.();
            break;
          case "done":
            h.onDone?.(evt.mode);
            break;
        }
      }
    }
    h.onDone?.();
  } catch (err) {
    h.onError?.(err);
  }
}
