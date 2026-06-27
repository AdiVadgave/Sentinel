import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";
import { useStore } from "../../store/store";
import { navByRole } from "./nav";
import type { Role } from "../../mock/seed";
import { Chip } from "../ui/ui";
import { cx } from "../../lib/util";

const Icon = ({ name, size = 18 }: { name: string; size?: number }) => {
  const C = (Icons as any)[name] ?? Icons.Circle;
  return <C size={size} />;
};

const roles: Role[] = ["Worker", "HSE Officer", "HSE Manager", "Admin"];

export function Shell() {
  const role = useStore((s) => s.role);
  const user = useStore((s) => s.user);
  const loadWork = useStore((s) => s.loadWork);
  const loadActions = useStore((s) => s.loadActions);

  // Hydrate the shared work queue + actions from the backend (source of truth)
  // once per session, so every surface sees the same persisted state.
  useEffect(() => {
    loadWork();
    loadActions();
  }, [loadWork, loadActions]);

  if (!role || !user) return null;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 overflow-y-auto bg-[#f1f4f9]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function Sidebar() {
  const role = useStore((s) => s.role)!;
  const items = navByRole[role];
  return (
    <aside className="w-60 shrink-0 bg-navy-900 text-white flex flex-col">
      <div className="px-5 py-4 flex items-center gap-2.5 border-b border-white/10">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-brand-accent">
          <Icons.ShieldCheck size={20} />
        </div>
        <div>
          <p className="font-extrabold leading-tight">Sentinel</p>
          <p className="text-[10px] text-blue-300 uppercase tracking-wide">VZI Safety Intelligence</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2">
        <p className="px-3 py-1 text-[10px] uppercase tracking-wide text-blue-300/70 font-bold">
          {role}
        </p>
        {items.map((it) => (
          <NavItemLink key={it.to} to={it.to} label={it.label} icon={it.icon} />
        ))}
      </nav>
    </aside>
  );
}

function NavItemLink({ to, label, icon }: { to: string; label: string; icon: string }) {
  return (
    <NavLink
      to={to}
      end={to === "/pow" || to === "/console" || to === "/analytics"}
      className={({ isActive }) =>
        cx(
          "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          isActive ? "bg-brand-accent text-white" : "text-blue-100/80 hover:bg-white/10"
        )
      }
    >
      <Icon name={icon} />
      {label}
    </NavLink>
  );
}

function TopBar() {
  const user = useStore((s) => s.user)!;
  const role = useStore((s) => s.role)!;
  const setPersona = useStore((s) => s.setPersona);
  const signOut = useStore((s) => s.signOut);
  const navigate = useNavigate();
  const [personaOpen, setPersonaOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const notifs = useStore((s) => s.notifications);
  const markAllRead = useStore((s) => s.markAllRead);
  const unread = notifs.filter((n) => !n.read).length;

  const landingFor: Record<Role, string> = {
    Worker: "/pow",
    "HSE Officer": "/console",
    "HSE Manager": "/analytics",
    Admin: "/settings",
  };

  return (
    <header className="h-14 shrink-0 bg-white border-b border-slate-200 flex items-center gap-3 px-4">
      <div className="relative flex-1 max-w-md">
        <Icons.Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          placeholder="Search SOPs, incidents, assets…"
          className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
        />
      </div>
      <div className="ml-auto flex items-center gap-3">
        {/* Notification bell */}
        <div className="relative">
          <button
            onClick={() => {
              setBellOpen((v) => !v);
              if (!bellOpen) markAllRead();
            }}
            className="relative grid h-9 w-9 place-items-center rounded-lg hover:bg-slate-100"
          >
            <Icons.Bell size={18} className="text-navy-800" />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 grid h-4 w-4 place-items-center rounded-full bg-safety-red text-[10px] font-bold text-white">
                {unread}
              </span>
            )}
          </button>
          <AnimatePresence>
            {bellOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="absolute right-0 mt-2 w-80 rounded-xl bg-white border border-slate-200 shadow-lift z-50 overflow-hidden"
              >
                <div className="px-4 py-2.5 border-b border-slate-100 font-bold text-sm text-navy-900">
                  Notifications
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifs.map((n) => (
                    <div key={n.id} className="flex items-start gap-2.5 px-4 py-2.5 border-b border-slate-50 hover:bg-slate-50">
                      <Chip tone={channelTone(n.channel)}>{n.channel}</Chip>
                      <div className="min-w-0">
                        <p className="text-xs text-navy-800">{n.text}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{n.ts}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Persona switcher */}
        <div className="relative">
          <button
            onClick={() => setPersonaOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg border border-slate-200 px-2 py-1.5 hover:bg-slate-50"
          >
            <span className="grid h-7 w-7 place-items-center rounded-full bg-brand text-white text-xs font-bold">
              {user.initials}
            </span>
            <span className="text-left hidden sm:block">
              <span className="block text-xs font-bold text-navy-900 leading-tight">{user.name}</span>
              <span className="block text-[10px] text-slate-500">{role}</span>
            </span>
            <Icons.ChevronDown size={14} className="text-slate-400" />
          </button>
          <AnimatePresence>
            {personaOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-slate-200 shadow-lift z-50 overflow-hidden"
              >
                <p className="px-4 py-2 text-[10px] uppercase tracking-wide text-slate-400 font-bold">
                  Switch persona
                </p>
                {roles.map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setPersona(r);
                      setPersonaOpen(false);
                      navigate(landingFor[r]);
                    }}
                    className={cx(
                      "flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50",
                      r === role ? "text-brand font-semibold" : "text-navy-800"
                    )}
                  >
                    <Icons.UserCircle2 size={16} /> {r}
                  </button>
                ))}
                <button
                  onClick={signOut}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-safety-red hover:bg-red-50 border-t border-slate-100"
                >
                  <Icons.LogOut size={16} /> Sign out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

function channelTone(c: string): "blue" | "green" | "amber" | "purple" | "slate" {
  return c === "Teams" ? "purple" : c === "Email" ? "blue" : c === "WhatsApp" ? "green" : c === "SMS" ? "amber" : "slate";
}
