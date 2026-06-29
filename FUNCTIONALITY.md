# Sentinel — Functionality Guide & Walkthrough

**Sentinel — VZI Safety Intelligence Platform**
Client: Black Mountain Mine · Vedanta Zinc International (VZI) · Vendor: Zensar Technologies

This document explains **what every part of Sentinel does**, **how each feature answers the
problem statement**, and **what each tab is for**. For concrete **"you type → the AI responds"**
walkthroughs you can run live, see **[EXAMPLES.md](EXAMPLES.md)**. For installation and how to start
the app, see [README.md](README.md).

---

## 1. The Problem Statement (and how Sentinel answers it)

Vedanta's Scope of Work describes four recurring **execution gaps** in mine safety. Sentinel was
built so that, end-to-end, it closes all four — with a supervisor that orchestrates four specialist
AI agents, and the HSE team always in control.

| # | Execution gap (from the SoW) | How Sentinel answers it | Where in the app |
|---|------------------------------|--------------------------|------------------|
| 1 | **Safety knowledge isn't available at the point of work** | A worker asks a plain-language question on a phone and gets a grounded answer with the exact SOP, version and approval date | Worker → **Ask Sentinel** |
| 2 | **Documentation is inconsistent / incomplete** | AI auto-fills pre-task checklists, drafts ICAM investigations, and drafts shift handovers — workers/officers review and approve | Worker → **Pre-Task**, Officer → **Investigation**, **Shift Handover** |
| 3 | **Incidents recur without systemic learning** | The intelligence agent surfaces recurring patterns across incidents and auto-writes a lesson-learned that gets published back to the knowledge base | Manager → **Recurring Patterns** |
| 4 | **Operational data sits unused** | A dashboard turns incident/near-miss/checklist data into KPIs, a hazard heat-map and predictive early-warnings | Manager → **Safety Intelligence**, **Predictive** |

**Three cross-cutting promises** run through every screen:

- **Supervisor / orchestration** — one "front door" classifies intent and routes to the right agent (you see this animate on every chat).
- **Human-in-the-loop** — nothing safety-critical is finalised without a human sign-off (the ICAM gate).
- **Trust & traceability** — every AI answer cites its **source + version**, is logged to an immutable **audit trail**, and is **POPIA-classified**.

### A deliberate constraint: proactive, standards-aware safety

The agents are **not** limited to VZI's internal SOPs. They are grounded in both:

1. **VZI internal SOPs** (Working at Heights, LOTO, Confined Space, Dropped-Object Prevention, Mobile Equipment, ICAM), each with a version + approval date; and
2. **International + South African mining safety standards** — **MHSA 1996** (Mine Health & Safety Act), **OHSA**, **ISO 45001**, **ICMM Critical Control Management**, **MHSC Zero Harm**, **ILO Convention 176**.

Every answer leads with **prevention and the hierarchy of controls** (eliminate → substitute →
engineering → administrative → PPE) — proactive over reactive.

---

## 2. How the AI actually works

```
React SPA  ──/api──►  FastAPI backend  ──►  Azure AI Foundry · Claude (Anthropic Messages API)
                          │
                          └── grounding corpus: VZI SOPs + SA/international standards
```

- The model is **Claude (`claude-sonnet-4-6`) deployed in Azure AI Foundry**, called through the native Anthropic Messages API.
- Each agent is the **same model with a different system prompt** (the "specialist agent" idea). The Supervisor classifies intent; the specialist answers.
- **Grounded answers only** — the Knowledge agent is instructed to answer *only* from the supplied SOPs + standards and to say so if something isn't covered.
- **Offline fallback** — if Azure can't be reached, the backend returns realistic scripted responses so a demo never hard-fails. The health endpoint (`/api/health`) shows which mode you're in: `live (Claude on Foundry)` or `offline (scripted fallback)`.

The agent endpoints (all behind `/api/agents/…`):

| Endpoint | Agent | Used by |
|----------|-------|---------|
| `classify` | Supervisor — intent routing | Ask Sentinel routing strip |
| `ask` / `ask/stream` | Knowledge & Risk — grounded, cited answer (streamed) | Ask Sentinel |
| `classify-report` | Incident intake classifier | Report Near-Miss |
| `suggest-controls` | Knowledge & Risk — pre-task controls | Pre-Task Checklist |
| `icam` | Incident Investigation — ICAM draft | Investigation |
| `handover-summary` | Shift Handover — draft summary | Shift Handover |
| `lesson` | Incident Intelligence — recurring-pattern analysis + lesson | Recurring Patterns |
| `report` | Reporting agent — board-ready reports | Reports |

### The demo is genuinely stateful (a persisted backend store)

Beyond the agents, the backend keeps **real, shared state** in a JSON store — so what one persona does
is seen by the others, and survives a page reload (it isn't just each browser's localStorage):

| Endpoint(s) | What it backs |
|-------------|---------------|
| `GET/POST /api/work`, `PATCH /api/work/{id}` | The cross-surface **work queue** (Worker reports → Console → Approvals → Dashboard) |
| `GET/POST /api/actions` | Corrective actions |
| `GET/POST /api/handover`, `POST /api/handover/ack` | The **shift handover** (HSE Officer sends → Worker receives & acknowledges) |
| `GET /api/analytics/kpis` | Dashboard KPIs **computed live** from the stored work queue/actions/audit |
| `/api/admin/*` | Agent enable/disable, confidence threshold, users, integrations, **audit trail** (with server-side POPIA classification) |

Agent toggles are **server-enforced**: turning an agent off in Admin actually disables that endpoint.

---

## 3. Personas & surfaces

You pick a persona at login; each lands on its own surface. Switch any time from the top-right avatar.

| Persona | Surface | What they do |
|---------|---------|--------------|
| **Worker** | Point-of-Work app (shown in a phone frame) | Ask safety questions, log pre-tasks, report near-misses, check shift/permits |
| **HSE Officer** | Supervisor Console | Triage the work queue, run ICAM investigations, approve work, build handovers, browse the knowledge base |
| **HSE Manager** | Analytics dashboard | KPIs, recurring-pattern intelligence, predictive early-warning, generate reports |
| **Admin** | Platform | Configure agents, view integrations, inspect the audit log |

---

## 4. Tab-by-tab functionality

### 🟦 Worker — Point-of-Work app

#### Home
- **Purpose:** the worker's launchpad "at the point of work" — proves safety is reachable on the ground.
- **What it shows:** a greeting (shift/area), a big **Ask Sentinel** button, quick tiles (Pre-Task, Report, Permits, Handover), open tasks, and a "4 agents online · grounded answers only" trust strip.
- **Problem solved:** #1 — knowledge at the point of work.

#### Ask Sentinel  ⭐ *(the signature screen)*
- **Purpose:** ask a plain-language safety question and get a grounded, cited, plain-language answer.
- **What happens:** you type or tap a suggested question → the **Supervisor strip** animates (Understanding → Intent 98% → Routing to Knowledge & Risk) → the answer **streams token-by-token** from Claude → it ends with **critical controls**, a **"before you start"** list, the applicable **standards**, a **source chip** (e.g. `SOP-WAH-014 · v3.2 · approved 12 Apr 2026`), and a **guardrail line**. Clicking the source chip opens a drawer with the SOP passage and version history.
- **Problem solved:** #1, plus the trust promise (source + version citation) and proactive framing.

#### Pre-Task Checklist
- **Purpose:** consistent, complete pre-task documentation, auto-populated from operational data.
- **What happens:** fields auto-fill with a shimmer (worker, crew, shift, area, task, equipment, permit). You tick the critical-control hazards, and **"AI suggest controls"** calls the model to write the controls-confirmation text grounded in the relevant SOP + hierarchy of controls. Submitting logs it and it appears live in the HSE Console queue (cross-surface wiring).
- **Problem solved:** #2 — documentation completeness & consistency.

#### Report Near-Miss / Incident
- **Purpose:** capture an event at the point of work; feed it into investigation + intelligence.
- **What happens:** you choose type/area/severity and describe what happened. On submit, the **intake classifier** (LLM) returns a **suggested category**, a **preventive critical control**, an adjusted **severity**, and a **"similar events in 90 days"** count (foreshadowing the recurring-pattern intelligence). The report lands in the Console queue.
- **Problem solved:** #2 and feeds #3.

#### My Shift
- **Purpose:** the worker's permits + the **shift handover they actually received**.
- **What happens:** on open it pulls the latest handover **the HSE Officer sent** from the backend and shows the real summary text, who it's from/to, the timestamp, and the flagged-equipment / outstanding-action counts. **Acknowledge handover** records who acknowledged and when, and the card flips to "Acknowledged by …". (This is the receiving end of the cross-surface handover flow — see the Officer's Shift Handover below.)
- **Problem solved:** #2 — closes the documentation loop between shifts.

---

### 🟧 HSE Officer — Supervisor Console

#### Console Home
- **Purpose:** the HSE command centre. A **Work Queue** table (live items created during the demo + seeded rows) with status chips (Submitted → Under Review → Approved → Closed), plus an activity feed and agent status.
- **Problem solved:** gives the officer one place to triage everything the agents and workers produce.

#### Investigation (ICAM)  ⭐ *(human-in-the-loop showcase)*
- **Purpose:** the **Incident Investigation agent** auto-drafts a full **ICAM** analysis; the officer edits and **signs off**.
- **What happens:** open an item → a 2s "Drafting investigation…" loader → Claude returns a structured ICAM draft: **timeline, absent/failed defences, individual/team actions, task/environmental conditions, organisational factors, ranked causal factors, and recommended corrective actions** (owner, due date, priority). Sections are editable (an "edited" badge appears). A prominent banner says *"AI-drafted — requires HSE owner sign-off."* The **Sign off & approve** button is disabled until you enter your name; on sign-off the state flips green, an audit entry is written, and the incident is pushed to Incident Intelligence.
- **Problem solved:** #2 (consistent investigations) + the human-in-the-loop promise.

#### Approvals
- **Purpose:** make the workflow engine *visible* as a four-column Kanban (Submitted → Under Review → Approved → Closed). Clicking a card advances it; state persists and writes to the audit log. Cards show the owning agent and an "AI-drafted / human-approved" tag.

#### Shift Handover
- **Purpose:** AI-assisted handover with a **completeness meter** (animates 62% → 94%) and auto-pulled operational context (open work orders, permits, flagged equipment, outstanding actions).
- **What happens:** **"AI draft summary"** calls the model to write the handover narrative for the incoming supervisor (editable). **"Send to next shift"** then **persists it to the backend** — and it appears on the Worker's **My Shift** screen for them to read and acknowledge. You can also generate a branded PDF preview.
- **Problem solved:** #2 — documentation quality, completeness, and a closed officer→worker loop.

#### Knowledge Base
- **Purpose:** the configured safety knowledge base (SOPs + standards) with version control and a **"Regulatory standard updated — 3 SOPs need review"** alert. Opening a document shows an AI summary, version history and a deep-link to ask about it.
- **Problem solved:** version-control & change-monitoring; supports #1.

---

### 🟪 HSE Manager — Analytics

#### Safety Intelligence (dashboard)  ⭐
- **Purpose:** turn unused data into insight (#4). Big-number KPI cards (incidents MTD, near-miss ratio, overdue actions, SOP currency, point-of-work queries), a **recurring-pattern heat-map** (Area × Hazard — the hot Gamsberg × dropped-object cell glows and is clickable), incident trend, incidents by category, corrective-action status, and per-agent activity.
- **Problem solved:** #4 — data underutilised.

#### Recurring Patterns & Lessons Learned  ⭐
- **Purpose:** systemic learning (#3). The pattern *data* is mock (4 dropped-object near-misses at the Gamsberg crusher in 90 days, with the related incident IDs), but the **common-factor analysis and the lesson-learned are generated live** by the Incident Intelligence agent — including a recommended higher-order control (the model often proposes an engineering-level DROPS scheme, not just "re-barricade") and the standards it benchmarked against. A **"Live"** chip confirms it came from the model; **"Publish to Knowledge Base"** shares it.
- **How it renders:** the seeded lesson shows instantly, then the live analysis swaps in a few seconds later (no blank loader).
- **Problem solved:** #3 — recurring incidents without learning.

#### Predictive Early-Warning
- **Purpose:** proactive maintenance. Per-asset risk cards (e.g. *EX-204 hydraulic shovel · failure probability 0.71 · inspect within 72h*) driven by a pre-use-checklist anomaly trend. "Raise maintenance action" creates a corrective action in the workflow. Carries an honest *"indicative model — IoT integrated in production"* footnote.
- **Problem solved:** the proactive/preventive promise.

#### Reports
- **Purpose:** board-ready, **AI-generated** reports. Three templates — **Monthly HSE Summary**, **Incident Pack**, **Compliance Status** — each generated live by the reporting agent from the KPI data and benchmarked against the standards, then shown as a branded, printable document.
- **Problem solved:** turns the data and the agents' work into something an executive can take to the board.

---

### ⚙️ Admin — Platform

#### Settings / Admin
- **Purpose:** Phase-1 functional-config story. Enable/disable agents, set a confidence threshold, view users & roles, and see the knowledge sources (VZI SharePoint + the SA/international standards corpus).

#### Integrations
- **Purpose:** make integration feel done. Cards for **Enablon**, **SharePoint**, **Plant Maintenance**, **Microsoft Entra ID** — each Connected, with last-sync time, record counts and a "Sync now" button.

#### Audit Log
- **Purpose:** the governance closer. Every AI answer and sign-off is logged with **user, agent, action, source + version, POPIA classification, outcome** — proving traceability.

---

## 5. Examples — "you type, the AI responds"

The full set of runnable, persona-by-persona interactions lives in **[EXAMPLES.md](EXAMPLES.md)** —
including working-at-heights and confined-space questions, the off-domain guardrail, near-miss
classification, AI-suggested pre-task controls, the ICAM draft + sign-off, the officer→worker handover
flow, live recurring-pattern analysis, AI-generated reports, the audit trail, and toggling an agent off.

---

## 6. The trust & governance layer (why a risk-averse buyer believes it)

| Feature | Where | What it proves |
|---------|-------|----------------|
| **Source + version chip** | every Ask Sentinel answer | the answer came from a specific SOP at a specific version — no hallucination |
| **Standards list** | every answer / draft | benchmarked against MHSA, ISO 45001, ICMM, etc. |
| **Guardrail line + off-domain refusal** | Ask Sentinel | the agent stays in the safety domain |
| **Human-in-the-loop gate** | Investigation | nothing is finalised without an HSE owner's sign-off |
| **Audit log** | Admin → Audit Log | every AI answer & sign-off logged with source, version, user, POPIA class |
| **POPIA classification** | Audit Log + generated reports / handover PDF | each record gets a server-side data-classification label (e.g. Internal C3 vs Confidential — personal C4) |
| **Server-enforced agent toggles** | Admin → Settings | disabling an agent actually disables its endpoint, not just the UI |

---

## 7. Quick reference — which tab for which job

| I want to… | Persona → Tab |
|------------|---------------|
| Ask a safety question and get a cited answer | Worker → Ask Sentinel |
| Log a pre-task with AI-suggested controls | Worker → Pre-Task Checklist |
| Report a near-miss and get it classified | Worker → Report Near-Miss |
| Triage everything coming in | HSE Officer → Console Home |
| Auto-draft an ICAM investigation and sign it off | HSE Officer → Investigation |
| Move work through the approval workflow | HSE Officer → Approvals |
| Draft a shift handover | HSE Officer → Shift Handover |
| Browse SOPs and standards / see change alerts | HSE Officer → Knowledge Base |
| See KPIs and the hazard heat-map | HSE Manager → Safety Intelligence |
| Find recurring patterns and publish a lesson | HSE Manager → Recurring Patterns |
| See predictive maintenance warnings | HSE Manager → Predictive |
| Generate a board report | HSE Manager → Reports |
| Configure agents / users | Admin → Settings |
| Check integrations and the audit trail | Admin → Integrations / Audit Log |

---

*Prepared as the functionality guide for the Sentinel PoC. For setup and run instructions see
[README.md](README.md); for the full design rationale see `Sentinel_PoC_Build_Bible.md`.*
