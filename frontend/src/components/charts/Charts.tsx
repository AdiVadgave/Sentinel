import { type ReactNode } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card } from "../ui/ui";
import { cx } from "../../lib/util";

const PALETTE = ["#2563eb", "#0ea5e9", "#f59e0b", "#a855f7", "#16a34a", "#dc2626"];

export function StatCard({
  label,
  value,
  delta,
  deltaGood,
  suffix,
}: {
  label: string;
  value: ReactNode;
  delta?: number;
  deltaGood?: boolean;
  suffix?: string;
}) {
  const positive = (delta ?? 0) >= 0;
  const good = deltaGood ?? !positive;
  return (
    <Card className="p-4">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <div className="mt-1 flex items-end justify-between">
        <p className="text-3xl font-extrabold text-navy-900">
          {value}
          {suffix && <span className="text-lg text-slate-400">{suffix}</span>}
        </p>
        {delta !== undefined && (
          <span
            className={cx(
              "inline-flex items-center gap-0.5 text-xs font-bold",
              good ? "text-safety-green" : "text-safety-red"
            )}
          >
            {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {Math.abs(delta)}%
          </span>
        )}
      </div>
    </Card>
  );
}

export function TrendLine({ data }: { data: { month: string; incidents: number; nearMiss: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eef1f7" />
        <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#94a3b8" />
        <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
        <Tooltip />
        <Line type="monotone" dataKey="incidents" stroke="#dc2626" strokeWidth={2.5} dot={false} name="Incidents" />
        <Line type="monotone" dataKey="nearMiss" stroke="#2563eb" strokeWidth={2} dot={false} name="Near-miss" />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function CategoryBar({ data }: { data: { category: string; count: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eef1f7" />
        <XAxis dataKey="category" tick={{ fontSize: 10 }} stroke="#94a3b8" interval={0} angle={-12} textAnchor="end" height={50} />
        <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
        <Tooltip />
        <Bar dataKey="count" radius={[5, 5, 0, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function Donut({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
          {data.map((_, i) => (
            <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function StackedAgentArea({
  data,
}: {
  data: { month: string; knowledge: number; investigation: number; intelligence: number; handover: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eef1f7" />
        <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#94a3b8" />
        <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
        <Tooltip />
        <Area type="monotone" dataKey="knowledge" stackId="1" stroke="#2563eb" fill="#2563eb" name="Knowledge" />
        <Area type="monotone" dataKey="investigation" stackId="1" stroke="#f59e0b" fill="#f59e0b" name="Investigation" />
        <Area type="monotone" dataKey="intelligence" stackId="1" stroke="#a855f7" fill="#a855f7" name="Intelligence" />
        <Area type="monotone" dataKey="handover" stackId="1" stroke="#16a34a" fill="#16a34a" name="Handover" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function AnomalyTrend({ data }: { data: { week: string; anomalies: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id="anom" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#dc2626" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#dc2626" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#eef1f7" />
        <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="#94a3b8" />
        <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
        <Tooltip />
        <Area type="monotone" dataKey="anomalies" stroke="#dc2626" strokeWidth={2} fill="url(#anom)" name="Anomalies" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// Recurring-pattern heatmap — the hero. Hot cell glows.
export function Heatmap({
  rows,
  cols,
  matrix,
  onCell,
}: {
  rows: string[];
  cols: string[];
  matrix: Record<string, number[]>;
  onCell?: (row: string, colIdx: number, value: number) => void;
}) {
  const max = Math.max(...Object.values(matrix).flat());
  const color = (v: number) => {
    if (v === 0) return "#f1f4f9";
    const t = v / max;
    if (t > 0.7) return "#dc2626";
    if (t > 0.45) return "#f59e0b";
    if (t > 0.2) return "#fbbf24";
    return "#bfdbfe";
  };
  return (
    <div className="overflow-x-auto">
      <table className="border-separate border-spacing-1">
        <thead>
          <tr>
            <th />
            {cols.map((c) => (
              <th key={c} className="px-1 pb-1 text-[10px] font-semibold text-slate-500 align-bottom">
                <div className="w-16 leading-tight">{c}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r}>
              <td className="pr-2 text-xs font-semibold text-navy-800 whitespace-nowrap text-right">{r}</td>
              {matrix[r].map((v, i) => {
                const hot = v / max > 0.7;
                return (
                  <td key={i}>
                    <button
                      onClick={() => onCell?.(r, i, v)}
                      className={cx(
                        "h-12 w-16 rounded-lg text-sm font-bold text-white grid place-items-center transition-transform hover:scale-105",
                        hot && "ring-2 ring-red-300 animate-pulse"
                      )}
                      style={{ background: color(v), color: v === 0 ? "#cbd5e1" : "#fff" }}
                      title={`${r} × ${cols[i]}: ${v}`}
                    >
                      {v || "·"}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ProgressArc({ value }: { value: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const off = c - (value / 100) * c;
  const col = value >= 90 ? "#16a34a" : value >= 70 ? "#f59e0b" : "#dc2626";
  return (
    <div className="relative grid place-items-center">
      <svg width={140} height={140} className="-rotate-90">
        <circle cx={70} cy={70} r={r} stroke="#eef1f7" strokeWidth={12} fill="none" />
        <circle
          cx={70}
          cy={70}
          r={r}
          stroke={col}
          strokeWidth={12}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={off}
          style={{ transition: "stroke-dashoffset 1.2s ease" }}
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-3xl font-extrabold text-navy-900">{value}%</p>
        <p className="text-[10px] uppercase text-slate-400 font-bold">Complete</p>
      </div>
    </div>
  );
}
