# Sentinel — Functionality Guide & Walkthrough

**Sentinel — VZI Safety Intelligence Platform**
Client: Black Mountain Mine · Vedanta Zinc International (VZI) · Vendor: Zensar Technologies

This document explains **what every part of Sentinel does**, **how each feature answers the
problem statement**, **what each tab is for**, and gives **concrete "you type → the AI responds"
examples** you can run live in the demo. For installation and how to start the app, see
[README.md](README.md).

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
| `report` | Reporting agent — board-ready reports | Reports |

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
- **Purpose:** the worker's permits + handover acknowledgement view. (Static/clickable; not an AI screen.)

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
- **Purpose:** AI-assisted handover with a **completeness meter** (animates 62% → 94%) and auto-pulled operational context (open work orders, permits, flagged equipment, outstanding actions). **"AI draft summary"** calls the model to write the handover narrative for the incoming supervisor; you can generate a branded PDF preview.
- **Problem solved:** #2 — documentation quality and completeness.

#### Knowledge Base
- **Purpose:** the configured safety knowledge base (SOPs + standards) with version control and a **"Regulatory standard updated — 3 SOPs need review"** alert. Opening a document shows an AI summary, version history and a deep-link to ask about it.
- **Problem solved:** version-control & change-monitoring; supports #1.

---

### 🟪 HSE Manager — Analytics

#### Safety Intelligence (dashboard)  ⭐
- **Purpose:** turn unused data into insight (#4). Big-number KPI cards (incidents MTD, near-miss ratio, overdue actions, SOP currency, point-of-work queries), a **recurring-pattern heat-map** (Area × Hazard — the hot Gamsberg × dropped-object cell glows and is clickable), incident trend, incidents by category, corrective-action status, and per-agent activity.
- **Problem solved:** #4 — data underutilised.

#### Recurring Patterns & Lessons Learned  ⭐
- **Purpose:** systemic learning (#3). An insight card — *"4 dropped-object near-misses at the Gamsberg crusher in 90 days — common factor: barricading not re-established after maintenance"* — plus an **AI-generated lesson-learned** with a recommended control and a **"Publish to Knowledge Base"** button.
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

These are real interactions. Sign in, pick the persona shown, and try them. (Exact wording from Claude
will vary; the **shape** — grounding, citation, standards, guardrail — is consistent.)

> **Tip:** the **source/version chip**, the **standards list**, and the **guardrail line** are the
> features to point at in a demo. They're what make the answer trustworthy rather than a chatbot guess.

---

### Example 1 — Ask Sentinel (Worker): working at heights
**Persona:** Worker → **Ask Sentinel**
**You type / tap:**
> *"Can I work at heights near the Swartberg conveyor today?"*

**Sentinel responds (streamed):**
- Supervisor strip: `Understanding… → Intent: point-of-work guidance (98%) → Routing to Knowledge & Risk`
- A plain-language answer: *yes, provided the working-at-heights critical controls are verified first…*
- **Critical controls:** fall-arrest harness clipped to a certified anchor; edge protection/barricading; WAH permit signed; exclusion zone below; weather check (work suspended >40 km/h wind).
- **Standards:** MHSA 1996 s11 (risk assessment), ISO 45001 (hierarchy of controls), ICMM Critical Control Management.
- **Source chip:** `SOP-WAH-014 · Working at Heights · v3.2 · approved 12 Apr 2026`
- **Guardrail:** *"Grounded in VZI SOPs + SA/international standards. Human sign-off required for any deviation."*

---

### Example 2 — Ask Sentinel (Worker): a question you typed by hand
**Persona:** Worker → **Ask Sentinel**
**You type:**
> *"Is it safe to enter the sump for cleaning during night shift?"*

**Sentinel responds:**
- Recognises this as **confined-space entry** (one of the highest-risk tasks) and notes the night shift doesn't change the requirements.
- Critical controls: confined-space permit; continuous atmosphere testing (O₂, LEL, CO, H₂S); forced ventilation; standby attendant; rescue plan — and isolate the sump pumps via LOTO first.
- **Source:** `SOP-CS-009 · Confined Space Entry · v2.3`, cross-referencing `SOP-LOTO-007`.
- **Standards:** MHSA 1996 s23 (right to refuse dangerous work), ISO 45001, ICMM CCM.

*(This is the key proof that it's a real model: a free-text question it has never seen gets a reasoned,
correctly-routed, cited answer — not a canned reply.)*

---

### Example 3 — Ask Sentinel (Worker): mobile equipment
**Persona:** Worker → **Ask Sentinel**
**You type:**
> *"Do I need a spotter when reversing the dump truck near the workshop?"*

**Sentinel responds:** *Yes — a spotter (banksman) is required for pedestrian-vehicle interaction in
workshop areas; be in direct communication before reversing…* — cited to `SOP-ME-021 · Mobile Equipment`.

---

### Example 4 — Guardrail (Worker): off-domain question
**Persona:** Worker → **Ask Sentinel**
**You type:**
> *"Who won the cricket last night?"*

**Sentinel responds:**
> *"I can only help with VZI safety guidance — SOPs, critical controls, permits, incidents and shift
> documentation. Please ask your HSE officer for anything else."*

*(Proves the guardrails are real, not decorative.)*

---

### Example 5 — Report a near-miss (Worker): AI classification
**Persona:** Worker → **Report Near-Miss**
**You enter:** Type = *Near-Miss*, Area = *Black Mountain Deeps*, Description =
> *"A worker slipped on spilled hydraulic oil near the decline portal, no injury."*

**Sentinel responds (on submit):**
- **Category:** Slip/Trip
- **Suggested control:** immediate spill containment + absorbent application, and a hydraulic
  hose/fitting inspection regime on mobile equipment transiting the portal to find the leak source.
- **Severity:** Medium · **Similar events (90 days):** 3
- The report appears in the HSE Console queue as **Submitted**.

---

### Example 6 — Pre-Task controls (Worker): AI suggest
**Persona:** Worker → **Pre-Task Checklist**
**You do:** tick the hazards (e.g. *working at heights*, *dropped objects*) → click **AI suggest controls**.

**Sentinel responds:** a concise controls-confirmation paragraph grounded in `SOP-WAH-014` and the
hierarchy of controls (inspect harness/tags, verify barricading and re-establish after breaks, tether
tools, confirm permit) plus the standards it relied on.

---

### Example 7 — ICAM investigation (HSE Officer): AI draft + sign-off
**Persona:** HSE Officer → **Console Home** → open the **dropped-object near-miss (NM-2026-0337)** → **Investigation**
**You do:** wait for the draft, edit a corrective action if you like, enter your name, click **Sign off & approve**.

**Sentinel responds:** a full ICAM draft —
- **Timeline** of the event, **absent/failed defences** (barricading not re-established; tools not tethered),
- **causal factors** ranked, and **corrective actions** (e.g. *add re-barricading verification to permit close-out — owner L. Mokoena, High*).
- On sign-off: banner turns green *"Signed off by <you> · <timestamp> · logged to audit"*, an audit entry is written, and the incident is pushed to Incident Intelligence.

---

### Example 8 — Shift handover (HSE Officer): AI draft summary
**Persona:** HSE Officer → **Shift Handover**
**You do:** click **AI draft summary**.

**Sentinel responds:** a professional handover narrative for the incoming supervisor — what was
completed, equipment flagged (EX-204), carried-over corrective actions (CA-0912, CA-0913), and pending
permits — with the completeness meter at 94%. Generate a branded PDF to "send to next shift."

---

### Example 9 — Reports (HSE Manager): board-ready, AI-generated
**Persona:** HSE Manager → **Reports** → click **Generate** on any of the three templates.

**Sentinel responds:** a live-generated report (title, period, executive summary, 3–4 sections) tailored
to the type:
- **Monthly HSE Summary** — performance KPIs, the recurring Gamsberg pattern, the predictive flag, standards alignment.
- **Incident Pack** — open investigations, ICAM causal themes, priority corrective actions.
- **Compliance Status** — SOP currency, the flagged fall-protection-standard reviews, MHSA/ISO/ICMM alignment.

Each renders as a branded, printable document with an "AI-generated" chip and the POPIA classification.

---

## 6. The trust & governance layer (why a risk-averse buyer believes it)

| Feature | Where | What it proves |
|---------|-------|----------------|
| **Source + version chip** | every Ask Sentinel answer | the answer came from a specific SOP at a specific version — no hallucination |
| **Standards list** | every answer / draft | benchmarked against MHSA, ISO 45001, ICMM, etc. |
| **Guardrail line + off-domain refusal** | Ask Sentinel | the agent stays in the safety domain |
| **Human-in-the-loop gate** | Investigation | nothing is finalised without an HSE owner's sign-off |
| **Audit log** | Admin → Audit Log | every AI answer & sign-off logged with source, version, user, POPIA class |
| **POPIA badge** | top bar + documents | data-governance posture is visible everywhere |

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
