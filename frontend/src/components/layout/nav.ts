import type { Role } from "../../mock/seed";

export interface NavItem {
  to: string;
  label: string;
  icon: string; // lucide icon name
}

// Role → which nav items / surface they land on.
export const navByRole: Record<Role, NavItem[]> = {
  Worker: [
    { to: "/pow", label: "Home", icon: "Home" },
    { to: "/pow/ask", label: "Ask Sentinel", icon: "MessageSquare" },
    { to: "/pow/checklist", label: "Pre-Task Checklist", icon: "ListChecks" },
    { to: "/pow/report", label: "Report Near-Miss", icon: "AlertTriangle" },
    { to: "/pow/handover", label: "My Shift", icon: "Clock" },
  ],
  "HSE Officer": [
    { to: "/console", label: "Console Home", icon: "LayoutDashboard" },
    { to: "/console/investigation", label: "Investigation (ICAM)", icon: "Microscope" },
    { to: "/console/approvals", label: "Approvals", icon: "GitBranch" },
    { to: "/console/handover", label: "Shift Handover", icon: "Clock" },
    { to: "/console/kb", label: "Knowledge Base", icon: "BookOpen" },
  ],
  "HSE Manager": [
    { to: "/analytics", label: "Safety Intelligence", icon: "BarChart3" },
    { to: "/analytics/patterns", label: "Recurring Patterns", icon: "Activity" },
    { to: "/analytics/predictive", label: "Predictive", icon: "Gauge" },
    { to: "/analytics/reports", label: "Reports", icon: "FileText" },
    { to: "/console", label: "Console", icon: "LayoutDashboard" },
  ],
  Executive: [
    { to: "/analytics", label: "Safety Intelligence", icon: "BarChart3" },
    { to: "/analytics/patterns", label: "Recurring Patterns", icon: "Activity" },
    { to: "/analytics/reports", label: "Reports", icon: "FileText" },
    { to: "/architecture", label: "Architecture & Roadmap", icon: "Network" },
  ],
  Admin: [
    { to: "/settings", label: "Settings / Admin", icon: "Settings" },
    { to: "/integrations", label: "Integrations", icon: "Plug" },
    { to: "/audit", label: "Audit Log", icon: "ScrollText" },
    { to: "/architecture", label: "Architecture", icon: "Network" },
  ],
};

// Shared items everyone can reach.
export const sharedNav: NavItem[] = [
  { to: "/integrations", label: "Integrations", icon: "Plug" },
  { to: "/audit", label: "Audit Log", icon: "ScrollText" },
  { to: "/architecture", label: "Architecture", icon: "Network" },
  { to: "/settings", label: "Settings", icon: "Settings" },
];
