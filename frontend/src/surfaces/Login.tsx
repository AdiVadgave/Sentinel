import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, Loader2, UserCircle2 } from "lucide-react";
import { useStore } from "../store/store";
import { Button } from "../components/ui/ui";
import type { Role } from "../mock/seed";

const personas: { role: Role; desc: string }[] = [
  { role: "Worker", desc: "Point-of-Work app · ask Sentinel, log pre-tasks, report" },
  { role: "HSE Officer", desc: "Console · investigate incidents, approvals, handover" },
  { role: "HSE Manager", desc: "Analytics · intelligence, patterns, predictive, reports" },
  { role: "Admin", desc: "Platform · agents, integrations, audit" },
];

const landingFor: Record<Role, string> = {
  Worker: "/pow",
  "HSE Officer": "/console",
  "HSE Manager": "/analytics",
  Admin: "/settings",
};

export function Login() {
  const [stage, setStage] = useState<"login" | "auth" | "persona">("login");
  const [email, setEmail] = useState("a.mehta@vedanta.co.za");
  const [error, setError] = useState("");
  const signIn = useStore((s) => s.signIn);
  const setPersona = useStore((s) => s.setPersona);
  const pushToast = useStore((s) => s.pushToast);
  const navigate = useNavigate();

  const doSignIn = () => {
    if (!email.trim()) {
      setError("Enter your VZI credentials.");
      return;
    }
    setError("");
    setStage("auth");
    setTimeout(() => {
      signIn();
      pushToast({ title: "Signed in — POPIA session active.", variant: "success" });
      setStage("persona");
    }, 900);
  };

  const pick = (role: Role) => {
    setPersona(role);
    navigate(landingFor[role]);
  };

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      {/* Hero */}
      <div className="relative hidden md:flex flex-col justify-between bg-navy-950 p-10 text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(900px 500px at 20% 10%, #1e3a8a 0%, transparent 60%), radial-gradient(700px 500px at 90% 90%, #2563eb 0%, transparent 55%)",
          }}
        />
        <div className="relative flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-accent">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="text-xl font-extrabold">Sentinel</p>
            <p className="text-xs text-blue-300 uppercase tracking-widest">VZI Safety Intelligence</p>
          </div>
        </div>
        <div className="relative">
          <h1 className="text-3xl font-extrabold leading-tight">
            The right safety information,<br /> at the point of work.
          </h1>
          <p className="mt-3 text-blue-200/80 max-w-md">
            Four AI safety agents and one supervisor — grounded in your SOPs and international &amp;
            South African mining standards, with your HSE team always in control.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-xs">
            {["Knowledge & Risk", "Incident Investigation", "Incident Intelligence", "Shift Handover"].map((a) => (
              <span key={a} className="rounded-full bg-white/10 px-3 py-1">{a}</span>
            ))}
          </div>
        </div>
        <div className="relative text-xs text-blue-300/70">
          Zensar Technologies · POPIA Internal (C3)
        </div>
      </div>

      {/* Card */}
      <div className="flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-sm">
          {stage !== "persona" ? (
            <>
              <h2 className="text-2xl font-extrabold text-navy-900">Sign in</h2>
              <p className="text-sm text-slate-500 mt-1">Use your VZI enterprise account.</p>

              <div className="mt-6 space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600">Email</label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Password</label>
                  <input
                    type="password"
                    defaultValue="••••••••••"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
                  />
                </div>
                {error && <p className="text-xs text-safety-red">{error}</p>}

                <Button onClick={doSignIn} size="lg" className="w-full" disabled={stage === "auth"}>
                  {stage === "auth" ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Authenticating with Entra ID…
                    </>
                  ) : (
                    <>
                      <MsGlyph /> Sign in with Microsoft Entra ID
                    </>
                  )}
                </Button>
                <Button onClick={doSignIn} variant="secondary" size="lg" className="w-full">
                  Sign in
                </Button>
              </div>
              <p className="mt-6 text-center text-xs text-slate-400">
                Single sign-on simulated for the PoC — production uses your Entra ID SSO.
              </p>
            </>
          ) : (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-2xl font-extrabold text-navy-900">Choose a persona</h2>
              <p className="text-sm text-slate-500 mt-1">Each role lands on its own surface.</p>
              <div className="mt-5 space-y-2.5">
                {personas.map((p) => (
                  <button
                    key={p.role}
                    onClick={() => pick(p.role)}
                    className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-3 text-left hover:border-brand hover:bg-blue-50/50 transition-colors"
                  >
                    <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand/10 text-brand">
                      <UserCircle2 size={22} />
                    </span>
                    <span>
                      <span className="block font-bold text-navy-900">{p.role}</span>
                      <span className="block text-xs text-slate-500">{p.desc}</span>
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

function MsGlyph() {
  return (
    <span className="grid grid-cols-2 gap-0.5">
      <span className="h-2 w-2 bg-[#f25022]" />
      <span className="h-2 w-2 bg-[#7fba00]" />
      <span className="h-2 w-2 bg-[#00a4ef]" />
      <span className="h-2 w-2 bg-[#ffb900]" />
    </span>
  );
}
