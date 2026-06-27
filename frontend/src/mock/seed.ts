// Sentinel PoC — seed "database" (mining-accurate, consistent IDs across screens).
// Black Mountain Deeps · Swartberg · Gamsberg Concentrator (Northern Cape, ZA).

export type Role = "Worker" | "HSE Officer" | "HSE Manager" | "Executive" | "Admin";
export type WorkflowState = "Submitted" | "Under Review" | "Approved" | "Closed";

export interface User {
  id: string;
  name: string;
  role: Role;
  title: string;
  crew?: string;
  area?: string;
  initials: string;
}

export const users: User[] = [
  { id: "u-thabo", name: "Thabo Nkosi", role: "Worker", title: "Rigger · C-Shift", crew: "C-Shift", area: "Swartberg", initials: "TN" },
  { id: "u-lerato", name: "Lerato Mokoena", role: "HSE Officer", title: "HSE Officer", area: "Gamsberg", initials: "LM" },
  { id: "u-modau", name: "Dr Amukelani Modau", role: "HSE Manager", title: "Chief HSE & ESG Manager", initials: "AM" },
  { id: "u-exec", name: "Johan Pretorius", role: "Executive", title: "General Manager", initials: "JP" },
  { id: "u-admin", name: "Sanele Dube", role: "Admin", title: "IT / Platform Admin", initials: "SD" },
];

export const areas = ["Black Mountain Deeps", "Swartberg", "Gamsberg Concentrator", "Surface Workshops"];

export interface Agent {
  id: string;
  name: string;
  status: "online" | "degraded";
  handledToday: number;
  color: string;
}
export const agents: Agent[] = [
  { id: "supervisor", name: "Supervisor / Orchestrator", status: "online", handledToday: 37, color: "#2563eb" },
  { id: "knowledge-risk", name: "Knowledge & Risk", status: "online", handledToday: 21, color: "#0ea5e9" },
  { id: "incident-investigation", name: "Incident Investigation", status: "online", handledToday: 6, color: "#f59e0b" },
  { id: "incident-intelligence", name: "Incident Intelligence", status: "online", handledToday: 9, color: "#a855f7" },
  { id: "shift-handover", name: "Shift Handover & Docs", status: "online", handledToday: 4, color: "#16a34a" },
];

export interface Sop {
  id: string;
  title: string;
  type: "SOP" | "Risk Assessment" | "Control" | "Standard";
  version: string;
  owner: string;
  approved: string;
  status: "Current" | "Review due" | "Standard changed";
}
export const sops: Sop[] = [
  { id: "SOP-WAH-014", title: "Working at Heights", type: "SOP", version: "v3.2", owner: "Dr A. Modau", approved: "12 Apr 2026", status: "Standard changed" },
  { id: "SOP-LOTO-007", title: "Lockout / Tagout — Energy Isolation", type: "SOP", version: "v4.0", owner: "S. Khumalo", approved: "28 Feb 2026", status: "Current" },
  { id: "SOP-CS-009", title: "Confined Space Entry", type: "SOP", version: "v2.3", owner: "P. van Wyk", approved: "15 Mar 2026", status: "Current" },
  { id: "SOP-ME-021", title: "Mobile Equipment Operation", type: "SOP", version: "v1.8", owner: "S. Khumalo", approved: "11 Jan 2026", status: "Review due" },
  { id: "SOP-DOP-005", title: "Dropped-Object Prevention", type: "SOP", version: "v2.0", owner: "L. Mokoena", approved: "05 May 2026", status: "Current" },
  { id: "SOP-INV-002", title: "ICAM Incident Investigation", type: "SOP", version: "v2.1", owner: "Dr A. Modau", approved: "20 Feb 2026", status: "Current" },
  { id: "STD-MHSA-1996", title: "Mine Health & Safety Act 29 of 1996", type: "Standard", version: "2024 rev", owner: "DMRE", approved: "Statutory", status: "Standard changed" },
  { id: "STD-ISO-45001", title: "ISO 45001 OH&S Management Systems", type: "Standard", version: "2018", owner: "ISO", approved: "01 Mar 2018", status: "Current" },
];

export interface WorkItem {
  id: string;
  type: "Near-Miss" | "Incident" | "Hazard" | "Pre-Task" | "Investigation" | "Corrective Action" | "Lesson";
  title: string;
  area: string;
  reportedBy: string;
  status: WorkflowState;
  agent: string;
  ageHrs: number;
  severity?: "Low" | "Medium" | "High";
  aiDrafted?: boolean;
  description?: string;
}

export const workItems: WorkItem[] = [
  { id: "NM-2026-0337", type: "Near-Miss", title: "Dropped spanner near crusher walkway", area: "Gamsberg Concentrator", reportedBy: "Thabo Nkosi", status: "Submitted", agent: "incident-investigation", ageHrs: 3, severity: "High", description: "Spanner fell ~6m from elevated walkway after maintenance; barricading not re-established." },
  { id: "NM-2026-0331", type: "Near-Miss", title: "Tool dropped from conveyor gantry", area: "Gamsberg Concentrator", reportedBy: "S. Khumalo", status: "Closed", agent: "incident-investigation", ageHrs: 280, severity: "Medium" },
  { id: "INC-2026-0204", type: "Incident", title: "Hand laceration during belt change", area: "Gamsberg Concentrator", reportedBy: "L. Mokoena", status: "Under Review", agent: "incident-investigation", ageHrs: 52, severity: "Medium", aiDrafted: true },
  { id: "NM-2026-0318", type: "Near-Miss", title: "Mobile equipment proximity — pedestrian", area: "Swartberg", reportedBy: "P. van Wyk", status: "Approved", agent: "incident-investigation", ageHrs: 120, severity: "High" },
  { id: "HAZ-2026-0090", type: "Hazard", title: "Inadequate lighting at decline portal", area: "Black Mountain Deeps", reportedBy: "Thabo Nkosi", status: "Submitted", agent: "knowledge-risk", ageHrs: 8, severity: "Low" },
  { id: "CA-0912", type: "Corrective Action", title: "Add re-barricading check to permit close-out", area: "Gamsberg Concentrator", reportedBy: "L. Mokoena", status: "Under Review", agent: "incident-intelligence", ageHrs: 20, aiDrafted: true },
];

export interface CorrectiveAction {
  id: string;
  action: string;
  owner: string;
  due: string;
  priority: "High" | "Medium" | "Low";
  status: WorkflowState;
}
export const correctiveActions: CorrectiveAction[] = [
  { id: "CA-0912", action: "Add mandatory re-barricading verification to permit close-out", owner: "L. Mokoena", due: "11 Jul 2026", priority: "High", status: "Under Review" },
  { id: "CA-0913", action: "Issue tethered-tool kits to crusher maintenance crews", owner: "S. Khumalo", due: "18 Jul 2026", priority: "High", status: "Submitted" },
  { id: "CA-0908", action: "Re-train C-Shift on dropped-object prevention", owner: "P. van Wyk", due: "04 Jul 2026", priority: "Medium", status: "Approved" },
  { id: "CA-0901", action: "Install proximity-detection on EX-204 haul route", owner: "S. Dube", due: "29 Jun 2026", priority: "High", status: "Closed" },
  { id: "CA-0915", action: "Review lighting standard at decline portals", owner: "L. Mokoena", due: "22 Jul 2026", priority: "Low", status: "Submitted" },
];

export const kpis = {
  incidentsMTD: { value: 12, delta: -18 },
  nearMissRatio: { value: "8.4 : 1", delta: 6 },
  overdueActions: { value: 5, delta: 2 },
  sopCurrency: { value: 92, delta: 3 },
  powQueriesToday: { value: 37, delta: 12 },
  incidentTrend: [
    { month: "Jul", incidents: 19, nearMiss: 120 },
    { month: "Aug", incidents: 17, nearMiss: 132 },
    { month: "Sep", incidents: 21, nearMiss: 128 },
    { month: "Oct", incidents: 16, nearMiss: 140 },
    { month: "Nov", incidents: 15, nearMiss: 151 },
    { month: "Dec", incidents: 18, nearMiss: 145 },
    { month: "Jan", incidents: 14, nearMiss: 160 },
    { month: "Feb", incidents: 16, nearMiss: 158 },
    { month: "Mar", incidents: 13, nearMiss: 171 },
    { month: "Apr", incidents: 15, nearMiss: 169 },
    { month: "May", incidents: 12, nearMiss: 180 },
    { month: "Jun", incidents: 12, nearMiss: 188 },
  ],
  byCategory: [
    { category: "Dropped object", count: 14 },
    { category: "Slip / trip", count: 9 },
    { category: "Energy isolation", count: 6 },
    { category: "Mobile equipment", count: 8 },
    { category: "Dust exposure", count: 5 },
  ],
  agentActivity: [
    { month: "Mar", knowledge: 180, investigation: 22, intelligence: 14, handover: 30 },
    { month: "Apr", knowledge: 210, investigation: 26, intelligence: 18, handover: 33 },
    { month: "May", knowledge: 240, investigation: 24, intelligence: 21, handover: 35 },
    { month: "Jun", knowledge: 268, investigation: 28, intelligence: 27, handover: 38 },
  ],
};

// Recurring-pattern heatmap: Area × Hazard. The hot cell is the demo's hero.
export const hazardTypes = ["Dropped object", "Slip / trip", "Energy isolation", "Mobile equip.", "Dust"];
export const patternMatrix: Record<string, number[]> = {
  "Black Mountain Deeps": [1, 2, 3, 1, 2],
  Swartberg: [2, 1, 1, 4, 0],
  "Gamsberg Concentrator": [9, 2, 1, 1, 3],
  "Surface Workshops": [0, 3, 2, 0, 1],
};

export const patterns = [
  {
    id: "PAT-001",
    title: "4 dropped-object near-misses at Gamsberg crusher in 90 days",
    area: "Gamsberg Concentrator",
    hazard: "Dropped object",
    count: 4,
    window: "90 days",
    commonFactor: "Barricading not re-established after maintenance.",
    related: ["NM-2026-0337", "NM-2026-0331", "NM-2026-0318", "INC-2026-0204"],
  },
];

export const lessons = [
  {
    id: "LL-014",
    title: "Re-establish barricading immediately after maintenance",
    summary:
      "Four dropped-object events at the Gamsberg crusher shared one cause: barricading and exclusion zones were not re-established after maintenance breaks. Make re-barricading a verified step in permit close-out and tether all tools at height.",
    control: "Permit close-out must verify re-barricading; tethered-tool kits mandatory at height.",
    standards: ["ICMM Critical Control Management", "ISO 45001 hierarchy of controls"],
    published: false,
  },
];

export interface Asset {
  id: string;
  name: string;
  area: string;
  failureProb: number;
  recommend: string;
  trend: { week: string; anomalies: number }[];
}
export const assets: Asset[] = [
  {
    id: "EX-204",
    name: "Hydraulic Shovel EX-204",
    area: "Black Mountain Deeps",
    failureProb: 0.71,
    recommend: "Inspect hydraulics within 72h",
    trend: [
      { week: "W-6", anomalies: 1 },
      { week: "W-5", anomalies: 1 },
      { week: "W-4", anomalies: 2 },
      { week: "W-3", anomalies: 3 },
      { week: "W-2", anomalies: 4 },
      { week: "W-1", anomalies: 6 },
    ],
  },
  {
    id: "DT-118",
    name: "Dump Truck DT-118",
    area: "Swartberg",
    failureProb: 0.34,
    recommend: "Monitor brake-wear trend",
    trend: [
      { week: "W-6", anomalies: 0 },
      { week: "W-5", anomalies: 1 },
      { week: "W-4", anomalies: 1 },
      { week: "W-3", anomalies: 1 },
      { week: "W-2", anomalies: 2 },
      { week: "W-1", anomalies: 2 },
    ],
  },
  {
    id: "CV-09",
    name: "Conveyor CV-09",
    area: "Gamsberg Concentrator",
    failureProb: 0.22,
    recommend: "Within normal range",
    trend: [
      { week: "W-6", anomalies: 0 },
      { week: "W-5", anomalies: 0 },
      { week: "W-4", anomalies: 1 },
      { week: "W-3", anomalies: 0 },
      { week: "W-2", anomalies: 1 },
      { week: "W-1", anomalies: 1 },
    ],
  },
];

export interface Integration {
  id: string;
  name: string;
  connected: boolean;
  lastSync: string;
  records: number;
}
export const integrations: Integration[] = [
  { id: "enablon", name: "Enablon (Incidents / ICAM)", connected: true, lastSync: "2 min ago", records: 1284 },
  { id: "sharepoint", name: "SharePoint (SOP repository)", connected: true, lastSync: "5 min ago", records: 412 },
  { id: "plantmaint", name: "Plant Maintenance System", connected: true, lastSync: "11 min ago", records: 876 },
  { id: "entra", name: "Microsoft Entra ID (SSO)", connected: true, lastSync: "just now", records: 40 },
];

export interface AuditEntry {
  id: string;
  ts: string;
  user: string;
  agent: string;
  action: string;
  source: string;
  popia: string;
  outcome: string;
}
export const auditLog: AuditEntry[] = [
  { id: "A-1001", ts: "27 Jun 2026 08:14", user: "Thabo Nkosi", agent: "Knowledge & Risk", action: "Asked: working at heights @ Swartberg", source: "SOP-WAH-014 v3.2", popia: "Internal (C3)", outcome: "Answered + cited" },
  { id: "A-1002", ts: "27 Jun 2026 08:31", user: "Lerato Mokoena", agent: "Incident Investigation", action: "ICAM draft generated for NM-2026-0337", source: "SOP-INV-002 v2.1", popia: "Internal (C3)", outcome: "Draft pending sign-off" },
];

export interface Notification {
  id: string;
  channel: "Teams" | "Email" | "SMS" | "Push" | "WhatsApp";
  text: string;
  ts: string;
  read: boolean;
}
export const notifications: Notification[] = [
  { id: "N-1", channel: "Teams", text: "INV-204 awaiting your sign-off — Incident Investigation Agent.", ts: "2 min ago", read: false },
  { id: "N-2", channel: "Email", text: "Monthly HSE report ready to download.", ts: "1 h ago", read: false },
  { id: "N-3", channel: "SMS", text: "C-Shift pre-task checklist overdue at Swartberg.", ts: "2 h ago", read: true },
  { id: "N-4", channel: "Push", text: "New lesson-learned published: Gamsberg dropped objects.", ts: "3 h ago", read: true },
  { id: "N-5", channel: "WhatsApp", text: "Permit P-0912 approved for night shift.", ts: "5 h ago", read: true },
];

export const activityFeed = [
  { id: "f1", text: "Knowledge & Risk answered 4 queries", ago: "2 min ago" },
  { id: "f2", text: "Shift Handover generated for Night Shift", ago: "18 min ago" },
  { id: "f3", text: "Incident Intelligence flagged a recurring pattern at Gamsberg", ago: "34 min ago" },
  { id: "f4", text: "Pre-task checklist logged · C-Shift · Swartberg", ago: "1 h ago" },
];

export const suggestedPrompts = [
  "Can I work at heights near the Swartberg conveyor today?",
  "What are the critical controls for LOTO?",
  "Show me the confined-space SOP.",
];
