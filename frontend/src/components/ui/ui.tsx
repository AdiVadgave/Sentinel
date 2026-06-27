import { type ReactNode, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cx } from "../../lib/util";
import type { WorkflowState } from "../../mock/seed";

/* ---------------- Button ---------------- */
export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  ...rest
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const variants = {
    primary: "bg-brand text-white hover:bg-brand-accent shadow-sm",
    secondary: "bg-white text-navy-800 border border-slate-300 hover:bg-slate-50",
    ghost: "text-navy-700 hover:bg-slate-100",
    danger: "bg-safety-red text-white hover:bg-red-700",
    success: "bg-safety-green text-white hover:bg-green-700",
  };
  const sizes = { sm: "px-2.5 py-1.5 text-xs", md: "px-3.5 py-2 text-sm", lg: "px-5 py-2.5 text-base" };
  return (
    <button
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

/* ---------------- Card ---------------- */
export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cx("rounded-xl bg-white shadow-card border border-slate-200/70", className)}>
      {children}
    </div>
  );
}

export function SectionHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h2 className="text-lg font-bold text-navy-900">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

/* ---------------- Chips ---------------- */
export function Chip({
  children,
  tone = "slate",
  className,
}: {
  children: ReactNode;
  tone?: "slate" | "blue" | "green" | "amber" | "red" | "purple";
  className?: string;
}) {
  const tones = {
    slate: "bg-slate-100 text-slate-700",
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-red-50 text-red-700",
    purple: "bg-purple-50 text-purple-700",
  };
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

const stateTone: Record<WorkflowState, "slate" | "amber" | "green"> = {
  Submitted: "slate",
  "Under Review": "amber",
  Approved: "green",
  Closed: "slate",
};
export function StatusChip({ state }: { state: WorkflowState }) {
  return <Chip tone={state === "Closed" ? "slate" : stateTone[state]}>{state}</Chip>;
}

/* ---------------- Dialog ---------------- */
export function Dialog({
  open,
  onClose,
  title,
  children,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "md" | "lg";
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={cx(
              "w-full rounded-2xl bg-white shadow-lift overflow-hidden",
              size === "lg" ? "max-w-3xl" : "max-w-lg"
            )}
            initial={{ scale: 0.95, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 12 }}
            onClick={(e) => e.stopPropagation()}
          >
            {title && (
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200">
                <h3 className="font-bold text-navy-900">{title}</h3>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
                  <X size={18} />
                </button>
              </div>
            )}
            <div className="max-h-[75vh] overflow-y-auto">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------------- Drawer (right) ---------------- */
export function Drawer({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex justify-end bg-navy-950/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="h-full w-full max-w-md bg-white shadow-lift overflow-y-auto"
            initial={{ x: 420 }}
            animate={{ x: 0 }}
            exit={{ x: 420 }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 sticky top-0 bg-white">
              <h3 className="font-bold text-navy-900">{title}</h3>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>
            <div className="p-5">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------------- Tabs ---------------- */
export function Tabs({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex gap-1 border-b border-slate-200">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={cx(
            "px-4 py-2 text-sm font-semibold border-b-2 -mb-px transition-colors",
            active === t.id
              ? "border-brand text-brand"
              : "border-transparent text-slate-500 hover:text-navy-800"
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

/* ---------------- DataTable ---------------- */
export function DataTable<T extends { id: string }>({
  columns,
  rows,
  onRowClick,
}: {
  columns: { key: keyof T | string; label: string; render?: (row: T) => ReactNode }[];
  rows: T[];
  onRowClick?: (row: T) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-500 border-b border-slate-200">
            {columns.map((c) => (
              <th key={String(c.key)} className="px-3 py-2.5 font-semibold whitespace-nowrap">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              onClick={() => onRowClick?.(row)}
              className={cx(
                "border-b border-slate-100",
                onRowClick && "cursor-pointer hover:bg-slate-50"
              )}
            >
              {columns.map((c) => (
                <td key={String(c.key)} className="px-3 py-2.5 text-navy-800 whitespace-nowrap">
                  {c.render ? c.render(row) : String((row as any)[c.key] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && (
        <div className="text-center text-slate-400 py-10 text-sm">No records.</div>
      )}
    </div>
  );
}

/* ---------------- Toasts ---------------- */
import { useStore } from "../../store/store";
import { CheckCircle2, Info, AlertTriangle, XCircle } from "lucide-react";

export function ToastHost() {
  const toasts = useStore((s) => s.toasts);
  const dismiss = useStore((s) => s.dismissToast);
  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col gap-2 w-80">
      <AnimatePresence>
        {toasts.map((t) => (
          <ToastCard key={t.id} id={t.id} onDone={() => dismiss(t.id)}>
            {t.variant === "success" && <CheckCircle2 size={18} className="text-safety-green" />}
            {t.variant === "info" && <Info size={18} className="text-brand-accent" />}
            {t.variant === "warn" && <AlertTriangle size={18} className="text-safety-amber" />}
            {t.variant === "error" && <XCircle size={18} className="text-safety-red" />}
            <div>
              <p className="font-semibold text-sm text-navy-900">{t.title}</p>
              {t.detail && <p className="text-xs text-slate-500 mt-0.5">{t.detail}</p>}
            </div>
          </ToastCard>
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastCard({ id, onDone, children }: { id: string; onDone: () => void; children: ReactNode }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3800);
    return () => clearTimeout(t);
  }, [id]);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 60 }}
      className="flex items-start gap-2.5 rounded-xl bg-white border border-slate-200 shadow-lift px-3.5 py-3"
    >
      {children}
    </motion.div>
  );
}
