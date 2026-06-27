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
  knowledge: () => fetch("/api/agents/knowledge").then((r) => r.json() as Promise<KnowledgeDoc[]>),
};

// --- Knowledge Base corpus (served from the backend grounding corpus) ------ //

export interface KnowledgeDoc {
  id: string;
  title: string;
  type: "SOP" | "Standard";
  version: string;
  owner: string;
  approved: string;
  status: "Current" | "Review due" | "Standard changed";
  source: string;
  body: string;
  critical_controls: string[];
  history: { version: string; date: string; note: string }[];
}

// --- Work queue + corrective actions (persisted, cross-surface) ------------ //

export interface WorkItemDTO {
  id: string;
  type: string;
  title: string;
  area: string;
  reportedBy: string;
  status: string;
  agent: string;
  ageHrs: number;
  severity?: string;
  aiDrafted?: boolean;
  description?: string;
}
export interface CorrectiveActionDTO {
  id: string;
  action: string;
  owner: string;
  due: string;
  priority: string;
  status: string;
}

export const workflow = {
  listWork: () => fetch("/api/work").then((r) => r.json() as Promise<WorkItemDTO[]>),
  addWork: (item: WorkItemDTO) => send<WorkItemDTO>("/api/work", "POST", item),
  transitionWork: (id: string, status: string) =>
    send<WorkItemDTO>(`/api/work/${id}`, "PATCH", { status }),
  listActions: () => fetch("/api/actions").then((r) => r.json() as Promise<CorrectiveActionDTO[]>),
  addAction: (item: CorrectiveActionDTO) => send<CorrectiveActionDTO>("/api/actions", "POST", item),
};

// --- Analytics KPIs (computed server-side from the stored work queue) ------ //

export interface Kpis {
  incidentsMTD: { value: number; delta: number };
  nearMissRatio: { value: string; delta: number };
  overdueActions: { value: number; delta: number };
  sopCurrency: { value: number; delta: number };
  powQueriesToday: { value: number; delta: number };
  incidentTrend: { month: string; incidents: number; nearMiss: number }[];
  byCategory: { category: string; count: number }[];
  agentActivity: { month: string; knowledge: number; investigation: number; intelligence: number; handover: number }[];
  computed?: boolean;
}

export const analytics = {
  kpis: () => fetch("/api/analytics/kpis").then((r) => r.json() as Promise<Kpis>),
};

// --- Admin platform (real, JSON-persisted backend state) ------------------- //

export interface AgentConfig {
  id: string;
  name: string;
  color: string;
  handledToday: number;
  enabled: boolean;
}
export interface AdminUser {
  id: string;
  name: string;
  role: string;
  title: string;
  area: string;
  initials: string;
}
export interface AdminSettings {
  agents: AgentConfig[];
  threshold: number;
  users: AdminUser[];
}
export interface IntegrationState {
  id: string;
  name: string;
  connected: boolean;
  lastSync: string;
  records: number;
}
export interface AuditRow {
  id: string;
  ts: string;
  user: string;
  agent: string;
  action: string;
  source: string;
  popia: string;
  outcome: string;
}

async function send<T>(path: string, method: string, body?: unknown): Promise<T> {
  const res = await fetch(path, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

// An agent can be switched off by an Admin in Settings; endpoints then return this.
export interface DisabledResponse {
  disabled: true;
  message: string;
  mode?: string;
}
export function isDisabled(r: unknown): r is DisabledResponse {
  return !!r && typeof r === "object" && (r as { disabled?: unknown }).disabled === true;
}

export const admin = {
  getSettings: () => fetch("/api/admin/settings").then((r) => r.json() as Promise<AdminSettings>),
  toggleAgent: (id: string, enabled: boolean) =>
    send<{ id: string; enabled: boolean; agents: AgentConfig[] }>(`/api/admin/agents/${id}`, "PATCH", { enabled }),
  setThreshold: (threshold: number) =>
    send<{ threshold: number }>("/api/admin/settings/threshold", "PUT", { threshold }),
  addUser: (u: { name: string; role?: string; title?: string; area?: string }) =>
    send<AdminUser>("/api/admin/users", "POST", u),
  getIntegrations: () =>
    fetch("/api/admin/integrations").then((r) => r.json() as Promise<IntegrationState[]>),
  syncIntegration: (id: string) =>
    send<IntegrationState & { added: number }>(`/api/admin/integrations/${id}/sync`, "POST"),
  getAudit: () => fetch("/api/audit").then((r) => r.json() as Promise<AuditRow[]>),
  postAudit: (e: {
    user: string; agent: string; action: string;
    source?: string; outcome?: string; popia?: string;
  }) => send<AuditRow>("/api/audit", "POST", e),
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
