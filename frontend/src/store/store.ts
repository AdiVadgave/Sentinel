import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  auditLog as seedAudit,
  correctiveActions as seedActions,
  lessons as seedLessons,
  notifications as seedNotifications,
  users,
  workItems as seedWork,
  type AuditEntry,
  type CorrectiveAction,
  type Notification,
  type Role,
  type User,
  type WorkflowState,
  type WorkItem,
} from "../mock/seed";
import { nowStamp } from "../lib/util";
import { admin } from "../lib/api";

export interface Toast {
  id: string;
  title: string;
  detail?: string;
  variant: "success" | "info" | "warn" | "error";
}

let toastSeq = 0;

interface SentinelState {
  // auth / persona
  authed: boolean;
  role: Role | null;
  user: User | null;
  signIn: () => void;
  signOut: () => void;
  setPersona: (role: Role) => void;

  // workflow items (shared across surfaces — the "one system" effect)
  work: WorkItem[];
  addWork: (item: WorkItem) => void;
  transition: (id: string, to: WorkflowState, by: string) => void;

  actions: CorrectiveAction[];
  addAction: (a: CorrectiveAction) => void;

  lessons: typeof seedLessons;
  publishLesson: (id: string) => void;

  // audit (persisted to the backend; local copy is an optimistic cache)
  audit: AuditEntry[];
  logAudit: (e: Omit<AuditEntry, "id" | "ts">) => void;
  loadAudit: () => Promise<void>;

  // notifications + toasts
  notifications: Notification[];
  markAllRead: () => void;
  toasts: Toast[];
  pushToast: (t: Omit<Toast, "id">) => void;
  dismissToast: (id: string) => void;
}

const personaUser = (role: Role): User =>
  users.find((u) => u.role === role) ?? users[0];

export const useStore = create<SentinelState>()(
  persist(
    (set, get) => ({
      authed: false,
      role: null,
      user: null,
      signIn: () => set({ authed: true }),
      signOut: () => set({ authed: false, role: null, user: null }),
      setPersona: (role) => set({ role, user: personaUser(role) }),

      work: seedWork,
      addWork: (item) =>
        set((s) => ({ work: [item, ...s.work] })),
      transition: (id, to, by) => {
        const item = get().work.find((w) => w.id === id);
        set((s) => ({
          work: s.work.map((w) => (w.id === id ? { ...w, status: to } : w)),
        }));
        if (item) {
          get().logAudit({
            user: by,
            agent: item.agent,
            action: `${item.id} → ${to}`,
            source: item.type === "Investigation" ? "SOP-INV-002 v2.1" : "—",
            popia: "Internal (C3)",
            outcome: to,
          });
        }
      },

      actions: seedActions,
      addAction: (a) => set((s) => ({ actions: [a, ...s.actions] })),

      lessons: seedLessons,
      publishLesson: (id) =>
        set((s) => ({
          lessons: s.lessons.map((l) => (l.id === id ? { ...l, published: true } : l)),
        })),

      audit: seedAudit,
      logAudit: (e) => {
        // Optimistic local insert so the UI updates instantly (and still works
        // offline), then persist to the backend and refresh from the source of truth.
        set((s) => ({
          audit: [{ id: `A-${1100 + s.audit.length}`, ts: nowStamp(), ...e }, ...s.audit],
        }));
        admin
          .postAudit({
            user: e.user,
            agent: e.agent,
            action: e.action,
            source: e.source,
            outcome: e.outcome,
            // omit popia → let the backend classify it server-side
          })
          .then(() => get().loadAudit())
          .catch(() => {/* backend unreachable — keep the optimistic local entry */});
      },
      loadAudit: async () => {
        try {
          const rows = await admin.getAudit();
          if (Array.isArray(rows)) set({ audit: rows as AuditEntry[] });
        } catch {
          /* backend unreachable — keep the local/seed audit trail */
        }
      },

      notifications: seedNotifications,
      markAllRead: () =>
        set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),

      toasts: [],
      pushToast: (t) =>
        set((s) => ({ toasts: [...s.toasts, { id: `t-${++toastSeq}`, ...t }] })),
      dismissToast: (id) =>
        set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),
    }),
    {
      name: "sentinel-poc",
      // Persist demo-critical state; toasts are ephemeral.
      partialize: (s) => ({
        authed: s.authed,
        role: s.role,
        user: s.user,
        work: s.work,
        actions: s.actions,
        lessons: s.lessons,
        audit: s.audit,
        notifications: s.notifications,
      }),
    }
  )
);
