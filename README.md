# Zen-Sentinel — VZI Safety Intelligence Platform (PoC)

AI-enabled safety agents for **Black Mountain Mine · Vedanta Zinc International**, built by
**Zensar**. A clickable, demo-grade platform with four safety agents + a supervisor and
human-in-the-loop sign-off.

This implementation follows `Zen-Sentinel_PoC_Build_Bible.md` with one deliberate upgrade: instead of
faking the AI, it runs a **real FastAPI backend** that calls your **Azure AI Foundry** Claude
deployment (`claude-sonnet-4-6`) over the **native Anthropic Messages API** (the `AnthropicFoundry`
client — the Foundry endpoint serves Claude at `/anthropic`, not the OpenAI route). The agents are
grounded in VZI SOPs **and** international + South African mining
H&S standards (MHSA 1996, OHSA, ISO 45001, ICMM Critical Control Management, MHSC Zero Harm, ILO
C176), with a **proactive / preventive** bias. If Azure isn't configured, the backend falls back to
scripted responses so the demo never breaks.

> 📘 **For a full feature-by-feature walkthrough** — what every tab does and how it maps to the
> problem statement — see **[FUNCTIONALITY.md](FUNCTIONALITY.md)**.
> For runnable **"you type → the AI responds"** examples, see **[EXAMPLES.md](EXAMPLES.md)**.

```
Zen-Sentinel/
├── backend/    # FastAPI gateway → Azure AI Foundry · Claude  (Python)
└── frontend/   # Vite + React + TS + Tailwind SPA            (the 3 surfaces)
```

## Architecture

```
React SPA (Vite+TS+Tailwind+Zustand+Recharts+Framer Motion)
   │  /api  (Vite proxy)
   ▼
FastAPI  ──►  Azure AI Foundry · Claude (Anthropic Messages API)
   ├── /api/agents/classify          Supervisor intent routing
   ├── /api/agents/ask[/stream]      Knowledge & Risk (grounded, cited, SSE streaming)
   ├── /api/agents/icam              Incident Investigation (ICAM draft)
   ├── /api/agents/classify-report   Near-miss/incident intake classifier
   ├── /api/agents/suggest-controls  Pre-task controls suggestion
   └── /api/agents/handover-summary  Shift handover draft
Knowledge: VZI SOPs + SA/international standards corpus (PoC stand-in for pgvector RAG)
```

## 1. Run the backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env        # then edit .env with your Azure details (see below)
uvicorn app.main:app --reload --port 8000
```

Edit `backend/.env`:

| Variable | Value |
|---|---|
| `AZURE_OPENAI_ENDPOINT` | your Foundry endpoint incl. path, e.g. `https://your-resource.services.ai.azure.com/anthropic` |
| `AZURE_OPENAI_API_KEY` | your Azure AI Foundry key |
| `AZURE_OPENAI_DEPLOYMENT` | your Foundry model/deployment name, e.g. `claude-sonnet-4-6` |
| `AZURE_FOUNDRY_RESOURCE` | *(optional)* resource name; auto-derived from the endpoint if blank |

The resource name is parsed from the endpoint host automatically (the subdomain before
`.services.ai.azure.com`). Check it's live + which mode it's in: http://localhost:8000/api/health
(`"mode": "live (Claude on Foundry)"` once your key is in; `"offline (scripted fallback)"` until then.)

## 2. Run the frontend

```powershell
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. The Vite dev server proxies `/api` → `localhost:8000`, so no CORS setup
is needed. **You can demo the whole app even before adding Azure keys** — it uses the scripted
fallback; once keys are in, the same screens use live GPT-4o.

## Demo path (15 min — see bible §20)

1. **Login** as Dr Modau → "Sign in with Entra ID" → pick **Worker**.
2. **Ask Zen-Sentinel** → tap the *working-at-heights* chip → watch Supervisor route → GPT-4o streams a
   grounded answer → click the **source chip** (SOP-WAH-014 v3.2) → **Start pre-task checklist** →
   submit (it appears in the HSE console — cross-surface wiring).
3. Switch persona → **HSE Officer** → open the near-miss → **ICAM agent drafts** the investigation →
   edit a field → enter your name → **Sign off & approve** (state flips green, audit entry written).
4. **HSE Manager** → **Safety Intelligence** → click the glowing **Gamsberg × dropped-object** heatmap
   cell → **Recurring Patterns** → **Publish lesson to Knowledge Base**.
5. **Shift Handover** (62% → 94% meter, generate PDF) · **Predictive** (EX-204, raise action).
6. **Integrations** (all Connected) · **Audit Log** (source + version + POPIA) · **Architecture**.

## Personas → surfaces

| Persona | Lands on |
|---|---|
| Worker | Point-of-Work app (phone frame) |
| HSE Officer | Supervisor Console |
| HSE Manager / Executive | Analytics dashboard |
| Admin | Settings / platform |

Switch persona anytime from the top-right avatar menu.

## Notes

- **State persists** to `localStorage` (`zen-sentinel-poc` key) — a mid-demo refresh won't reset the
  workflow. Clear it from DevTools to reset the seed data.
- **Offline rehearsal:** set `USE_AZURE=false` in `.env` to force scripted mode for a guaranteed-stable run.
- Production evolution path (pgvector RAG, MCP tool servers, Entra SSO, immutable audit) is in the
  build bible §24 — this PoC's `/api` boundary is exactly where the production gateway slots in.
