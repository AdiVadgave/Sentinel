import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { useStore } from "./store/store";
import { Shell } from "./components/layout/Shell";
import { PhoneFrame } from "./components/layout/PhoneFrame";
import { Login } from "./surfaces/Login";

// Point-of-Work pages
import { PowHome } from "./surfaces/pow/PowHome";
import { AskSentinel } from "./surfaces/pow/AskSentinel";
import { PreTask } from "./surfaces/pow/PreTask";
import { ReportNearMiss } from "./surfaces/pow/ReportNearMiss";
import { WorkerShift } from "./surfaces/pow/WorkerShift";

// Console pages
import { ConsoleHome } from "./surfaces/console/ConsoleHome";
import { Investigation } from "./surfaces/console/Investigation";
import { Approvals } from "./surfaces/console/Approvals";
import { Handover } from "./surfaces/console/Handover";
import { KnowledgeBase } from "./surfaces/console/KnowledgeBase";

// Analytics pages
import { Dashboard } from "./surfaces/analytics/Dashboard";
import { Patterns } from "./surfaces/analytics/Patterns";
import { Predictive } from "./surfaces/analytics/Predictive";
import { Reports } from "./surfaces/analytics/Reports";

// Shared pages
import { Integrations } from "./shared/Integrations";
import { AuditLog } from "./shared/AuditLog";
import { Architecture } from "./shared/Architecture";
import { Settings } from "./shared/Settings";

function RequireAuth() {
  const authed = useStore((s) => s.authed);
  const role = useStore((s) => s.role);
  if (!authed || !role) return <Navigate to="/login" replace />;
  return <Shell />;
}

// Wraps Point-of-Work pages in the phone frame.
function PowLayout() {
  return (
    <PhoneFrame>
      <Outlet />
    </PhoneFrame>
  );
}

export const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  {
    path: "/",
    element: <RequireAuth />,
    children: [
      { index: true, element: <Navigate to="/login" replace /> },
      {
        path: "pow",
        element: <PowLayout />,
        children: [
          { index: true, element: <PowHome /> },
          { path: "ask", element: <AskSentinel /> },
          { path: "checklist", element: <PreTask /> },
          { path: "report", element: <ReportNearMiss /> },
          { path: "handover", element: <WorkerShift /> },
        ],
      },
      {
        path: "console",
        children: [
          { index: true, element: <ConsoleHome /> },
          { path: "investigation", element: <Investigation /> },
          { path: "approvals", element: <Approvals /> },
          { path: "handover", element: <Handover /> },
          { path: "kb", element: <KnowledgeBase /> },
        ],
      },
      {
        path: "analytics",
        children: [
          { index: true, element: <Dashboard /> },
          { path: "patterns", element: <Patterns /> },
          { path: "predictive", element: <Predictive /> },
          { path: "reports", element: <Reports /> },
        ],
      },
      { path: "integrations", element: <Integrations /> },
      { path: "audit", element: <AuditLog /> },
      { path: "architecture", element: <Architecture /> },
      { path: "settings", element: <Settings /> },
    ],
  },
  { path: "*", element: <Navigate to="/login" replace /> },
]);
