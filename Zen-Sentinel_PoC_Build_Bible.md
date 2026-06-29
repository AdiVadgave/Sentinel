# Zen-Sentinel — AI-Enabled Safety Agents
## 2-Day Clickable PoC: Complete Implementation Plan & Build Bible

**Client:** Black Mountain Mine — Vedanta Zinc International (VZI)
**Vendor:** Zensar Technologies
**Demo product name:** *Zen-Sentinel* — VZI Safety Intelligence Platform
**Team:** 3 Full-Stack Developers · **Time:** 2 days (16 working hours)
**Purpose of this document:** the single source of truth your three developers build from. Every screen, every mock, every hour is specified so nobody has to invent anything during the sprint.

> **The one sentence that governs every decision in this document:**
> We are not building the building — we are building the movie set. Everything must *look* and *feel* production-grade and end-to-end, while running entirely on mock JSON, fake services, simulated AI, and hardcoded workflows. When two options exist, we pick the one that produces the strongest customer perception for the least engineering effort.

---

## 0. The Demo Thesis — what Vedanta must feel

Vedanta's SoW is a cry about **execution gaps**: safety knowledge exists but isn't at the point of work; documentation is inconsistent; incidents recur without systemic learning; data sits unused. Our deck answered with **four agents + a supervisor + human-in-the-loop**.

The PoC must make Dr Modau (Chief HSE & ESG) and her team think, in order:

1. *"That looks exactly like the platform we saw in the proposal."* (visual fidelity to the deck)
2. *"A worker on the ground could actually use this."* (the Point-of-Work app)
3. *"It doesn't just answer — it tells me where the answer came from and which version."* (source + version traceability — the trust moment)
4. *"It drafts the investigation for me but I stay in control."* (human-in-the-loop sign-off)
5. *"It found the pattern across incidents that we kept missing."* (incident intelligence)
6. *"This already talks to Enablon and SharePoint."* (fake integrations that look wired)

If they feel those six things, we win the demo. Every feature below is justified against that list.

---

## 1. Functional Requirement Matrix

Every requirement extracted from the SoW, mapped to module, importance, whether the proposal PPT covered it, whether it belongs in the 2-day PoC, and demo priority.

**Legend — Demo priority:** P0 = on the critical demo path (must work flawlessly) · P1 = shown but secondary · P2 = visible/clickable but lightly built · P3 = deferred, explained verbally.

| # | SoW source | Module / Agent | Feature | Importance | In PPT? | In PoC? | Demo priority |
|---|-----------|----------------|---------|-----------|---------|---------|--------------|
| O1 | Objectives | Knowledge & Risk | SOP / risk / critical-control access at point of work | Critical | Yes | **Yes** | P0 |
| O2 | Objectives | Shift Handover & Docs | Quality & consistency of safety documentation | Critical | Yes | **Yes** | P0 |
| O3 | Objectives | Incident Intelligence | Data-driven prevention of recurring incidents | Critical | Yes | **Yes** | P0 |
| O4 | Objectives | Incident Intelligence | Convert unused data into actionable insight | High | Yes | **Yes** | P1 |
| O5 | Objectives | Platform | Proactive, digitally-enabled safety management | High | Yes | **Yes** (theme) | P1 |
| P1.1 | Phase 1 | Discovery view | Stakeholder assessment (HSE/GM/Ops/Eng/IT/CBP) | Medium | Yes | Simulated | P2 |
| P1.2 | Phase 1 | Discovery view | Map workflows & data sources | Medium | Yes | Simulated | P2 |
| P1.3 | Phase 1 | Admin / Agent config | Functional requirements per agent | Medium | Yes | Simulated | P2 |
| P1.4 | Phase 1 | Architecture view | Roadmap & architecture | Medium | Yes | Static diagram | P2 |
| P2.1 | Phase 2 | Knowledge & Risk | AI search & retrieval (SOPs, RAs, controls) | Critical | Yes | **Yes** | P0 |
| P2.2 | Phase 2 | Knowledge & Risk | Plain-language guidance at point of work | Critical | Yes | **Yes** | P0 |
| P2.3 | Phase 2 | Knowledge & Risk | Version control + legal/standard change monitoring | High | Yes | **Yes** (badge + alert) | P1 |
| P2.4 | Phase 2 | Incident Investigation | ICAM-aligned investigation assistant | Critical | Yes | **Yes** | P0 |
| P2.5 | Phase 2 | Incident Intelligence | Recurring-pattern analytics (incidents + near miss) | Critical | Yes | **Yes** | P0 |
| P2.6 | Phase 2 | Incident Intelligence | Automated lessons-learned + knowledge sharing | High | Yes | **Yes** | P1 |
| P2.7 | Phase 2 | Shift Handover & Docs | AI shift handover + pre-task documentation | Critical | Yes | **Yes** | P0 |
| P2.8 | Phase 2 | Shift Handover & Docs | Auto-populate forms from operational data | High | Yes | **Yes** (auto-fill anim) | P1 |
| P2.9 | Phase 2 | Shift Handover & Docs | Improve completeness/quality of documentation | High | Yes | **Yes** (quality score) | P1 |
| P2.10 | Phase 2 | Predictive | Analyse pre-use checklist & inspection data | Medium | Partial | **Yes** (chart) | P1 |
| P2.11 | Phase 2 | Predictive | Predictive equipment-failure models | Medium | Yes (PPT) / excluded in assumptions | **Yes** (simulated) | P1 |
| P2.12 | Phase 2 | Predictive | Early-warning maintenance alerts | Medium | Yes | **Yes** (alert card) | P1 |
| P2.13 | Phase 2 | Integrations | Integrate Enablon / SharePoint / Plant Maint. | High | Yes | Faked (status panel + "synced" toasts) | P1 |
| P2.14 | Phase 2 | — | UAT | Low (demo) | No | Deferred | P3 |
| P2.15 | Phase 2 | — | Validate accuracy/usability/reliability | Low (demo) | No | Deferred | P3 |
| P2.16 | Phase 2 | Guardrails/Audit | Data quality & POPIA governance checks | Medium | Yes | **Yes** (audit log + POPIA badge) | P1 |
| D1 | Deliverables | All four agents | Functional AI Safety Agents | Critical | Yes | **Yes** | P0 |
| D2 | Deliverables | Architecture view | Architecture & integration design | High | Yes | Static diagram | P2 |
| D3 | Deliverables | Knowledge base | Configured safety knowledge base | High | Yes | **Yes** (browsable KB) | P1 |
| D4 | Deliverables | Analytics | Incident dashboards & reports | Critical | Yes | **Yes** | P0 |
| D5 | Deliverables | Shift Handover & Docs | Handover & documentation tools | Critical | Yes | **Yes** | P0 |
| D6 | Deliverables | Help / onboarding | Training materials & user manuals | Low | No | Stub (Help page) | P3 |
| D7 | Deliverables | Reports | Final implementation & performance report | Low | No | Stub (exportable PDF) | P2 |
| X1 | PPT slide 4/5 | Orchestrator | Supervisor agent intent classification + routing | Critical | Yes | **Yes** (signature feature) | P0 |
| X2 | PPT slide 4 | Orchestrator | Human-in-the-loop sign-off gates | Critical | Yes | **Yes** (signature feature) | P0 |
| X3 | PPT slide 4/5 | Guardrails | Source + version citation on every answer | Critical | Yes | **Yes** (trust moment) | P0 |
| X4 | PPT slide 5 | Auth | Entra ID authentication | Medium | Yes | Fake login screen | P2 |

**Coverage statement (required by the brief):** every SoW line item is now classified as **Demonstrated** (built and on the demo path), **Simulated** (looks real, runs on mocks), or **Deferred** (explained verbally with rationale — items P2.14, P2.15, D6 only). Nothing is silently dropped.

---

## 2. Demo Stories (Customer Journeys)

We design the PoC around journeys, not modules. These are the click-paths the demo follows and that the UI must support end-to-end.

**Journey 1 — Worker at the point of work (Track A, self-serve).**
Worker opens the mobile Point-of-Work app → asks in plain language *"Can I work at heights near the Swartberg conveyor today?"* → Supervisor agent shows an *"Understanding your request… routing to Knowledge & Risk Agent"* animation → streamed plain-language answer appears with **critical controls**, a **safety warning**, and a **source card (SOP-WAH-014 v3.2, approved 12 Apr 2026)** → worker taps *"Start pre-task checklist"* → digitised checklist auto-fills crew/shift/location → worker submits → toast: *"Pre-task logged. Supervisor notified."*

**Journey 2 — Recurring-incident learning (Track B → intelligence).**
A near-miss is reported on the Point-of-Work app → appears in Supervisor Console queue → HSE officer opens it → **Incident Investigation Agent** auto-drafts an ICAM analysis (timeline, absent/failed defences, causal factors, corrective actions) → officer **edits one field**, then **signs off** (human-in-the-loop gate flips state Submitted → Under Review → Approved) → the approved incident feeds the **Incident Intelligence Agent**, which surfaces *"This is the 4th dropped-object near-miss at Gamsberg crusher in 90 days"* and generates a **lessons-learned** card shared to the knowledge base.

**Journey 3 — Shift handover (documentation quality).**
Outgoing shift supervisor opens **Shift Handover Agent** → agent auto-pulls open work orders, active permits, equipment status, outstanding actions → shows a **completeness score (62% → 94% after AI fill)** → supervisor reviews, adds a voice-style note → generates a clean **handover PDF** → next shift acknowledges.

**Journey 4 — Predictive early warning (proactive).**
Analytics Dashboard shows a **predictive early-warning card**: *"Hydraulic shovel EX-204 — failure probability rising, recommend inspection within 72h"* based on pre-use checklist trend → HSE clicks → sees the trend chart and the checklist anomalies that triggered it → raises a maintenance action.

**Journey 5 — Executive oversight (insight from unused data).**
Executive opens the Analytics Dashboard → KPI cards (incidents MTD, near-miss ratio, overdue actions, SOP currency) → recurring-pattern heatmap by area × hazard → compliance trend → "open actions by agent" → clicks export → branded PDF report.

**Journey 6 — Trust & governance (the closer).**
At any answer, click the **source chip** → drawer shows the exact SOP passage, version, approval date, and *"grounded — no hallucination"* guardrail badge → open the **Audit Log** → every AI recommendation logged with source, version, user, timestamp, POPIA classification.

---

## 3. Prioritisation — Must / Nice / Skip (with rationale)

### MUST HAVE (the demo collapses without these — all P0)
| Feature | Why it's mandatory |
|---|---|
| Supervisor/Orchestrator chat with intent-routing animation | It's the spine of the proposal (slide 4). It makes four agents feel like *one intelligent system*. |
| Knowledge & Risk plain-language answer + **source/version citation** | This is the literal answer to "information not accessible at point of work" + the trust differentiator. |
| Point-of-Work mobile app shell | Without a worker-facing surface, the "point of work" promise is abstract. |
| ICAM Incident Investigation auto-draft + **human-in-the-loop sign-off** | Directly answers "documentation inconsistent" + "human in the loop" is our core safety story. |
| Incident Intelligence recurring-pattern insight + lessons-learned | Directly answers "recurring incidents persist without systemic learning." |
| Shift Handover auto-fill + completeness score | Directly answers "documentation inconsistently completed." |
| Analytics Dashboard with KPI cards + heatmap | Answers "data underutilised" and gives the executive their money-shot. |
| Login screen (fake Entra) + role switch | Sets enterprise tone in 5 seconds; lets us demo worker/HSE/exec personas. |

### NICE TO HAVE (build only if time remains — P1/P2)
| Feature | Why secondary |
|---|---|
| Predictive equipment early-warning card | High wow, but the SoW assumptions exclude IoT — we simulate it as "indicative." Strong if present, safe to narrate if not. |
| Integrations status panel (Enablon/SharePoint/Plant Maint.) | Reinforces "it's wired in," but a single "Synced ✓" toast achieves 80% of the effect. |
| Knowledge base browse view | Nice depth, but the agent answer already proves retrieval. |
| Exportable PDF report / handover PDF | Great tactile moment; can fall back to a styled print view. |
| Audit log full view | Powerful for governance buyers; a badge + small panel suffices if rushed. |

### SKIP / DEFER (explain verbally — P3)
| Feature | Why we skip & how we cover it |
|---|---|
| Real authentication / Entra | Fake the login. Say: *"production uses your Entra ID SSO."* |
| Real AI / RAG / vector search | Simulate with scripted streaming. Say: *"grounded retrieval over your SOPs via pgvector in production."* |
| Real integrations / APIs | Fake with status panel + toasts. Say: *"MCP tool servers to Enablon, SharePoint, Plant Maintenance."* |
| UAT, accuracy validation, data-quality pipeline | Out of scope for a 2-day set. Mentioned on the roadmap slide. |
| Training materials / user manuals | A "Help" stub page. Deferred to Phase 2 delivery. |
| Multi-language, offline mode | Assumptions say English + connectivity TBD. Narrate only. |

---

## 4–5. Prototype Structure & Screen-by-Screen Breakdown

Three "surfaces" mirroring the proposal architecture (slide 5), plus shared shell. One React SPA; the surface switches by role.

```
Zen-Sentinel SPA
├── Auth / Login (fake Entra)
├── Persona switcher (Worker · HSE Officer · HSE Manager · Executive · Admin)
│
├── SURFACE 1 — Point-of-Work App   (mobile/PWA frame, Worker)
│     ├── Home (agent launcher + my tasks)
│     ├── Ask Zen-Sentinel (Supervisor chat → Knowledge & Risk)
│     ├── Pre-Task Checklist (digitised, auto-filled)
│     ├── Report Near-Miss / Incident
│     └── My Shift / Handover (worker view)
│
├── SURFACE 2 — Supervisor Console   (HSE Officer / Manager)
│     ├── Console Home (work queue + activity feed)
│     ├── Incident Investigation (ICAM wizard + AI draft + sign-off)
│     ├── Approvals (human-in-the-loop workflow board)
│     ├── Shift Handover (build + review + PDF)
│     └── Knowledge Base (browse SOPs/controls + change alerts)
│
├── SURFACE 3 — Analytics Dashboard   (HSE Manager / Executive)
│     ├── Safety Intelligence (KPIs, heatmap, trends)
│     ├── Recurring Patterns & Lessons Learned
│     ├── Predictive Early-Warning
│     └── Reports (export PDF)
│
└── SHARED
      ├── Top bar (logo, search, notifications bell, persona, POPIA badge)
      ├── Agent status rail ("4 agents online", guardrails active)
      ├── Notification centre + toasts
      ├── Architecture & Roadmap (static, from PPT slide 5)
      ├── Integrations panel
      ├── Audit Log
      └── Settings / Admin (agent config, users)
```

Below: every screen with purpose, fields, buttons, tables, charts, dummy data, popups, navigation, success/error states, and clickable actions.

---

### 5.1 Login (fake Entra ID)
- **Purpose:** instant enterprise credibility; persona entry point.
- **Layout:** split screen — left = mining hero image (reuse the deck's dark-navy + photo treatment), Zensar × VZI lockup; right = card.
- **Fields:** Email (pre-filled `a.modau@vedanta.co.za`), Password (dots). **Buttons:** "Sign in with Microsoft Entra ID" (primary, with MS logo glyph), "Sign in" (secondary).
- **Clickable:** any click → 800ms spinner *"Authenticating with Entra ID…"* → route to persona picker.
- **Success:** toast *"Signed in — POPIA session active."* **Error:** (only if blank) inline *"Enter your VZI credentials."*
- **Persona picker modal:** five role cards (Worker, HSE Officer, HSE Manager, Executive, Admin) → sets role in store, lands on that role's home surface.

### 5.2 Point-of-Work — Home (Worker)
- **Purpose:** the worker's launchpad at the point of work; proves "access at point of work."
- **Frame:** rendered inside a phone mock (rounded device frame, status bar with time/signal/battery) so it unmistakably reads as a field app even on a laptop screen.
- **Content:** greeting *"Hi Thabo · Day Shift · Black Mountain Deeps"*; big **"Ask Zen-Sentinel"** button; quick tiles: *Pre-Task Checklist*, *Report Near-Miss*, *My Permits*, *Shift Handover*. "My open tasks" list (3 items). Bottom: *4 agents online · grounded answers only* trust strip.
- **Dummy data:** worker = Thabo Nkosi, crew C-Shift, area Swartberg.
- **Clickable:** "Ask Zen-Sentinel" → 5.3; tiles → respective screens.

### 5.3 Ask Zen-Sentinel — Supervisor chat → Knowledge & Risk *(THE signature screen, P0)*
- **Purpose:** demonstrate intent classification → routing → grounded plain-language answer with source+version. This is the most-rehearsed screen.
- **Layout:** chat thread. Suggested prompt chips above the input: *"Can I work at heights near the Swartberg conveyor today?"*, *"What are the critical controls for LOTO?"*, *"Show me the confined-space SOP."*
- **The scripted sequence (all front-end, ~4.5s total):**
  1. User sends a (chip or typed) message.
  2. **Orchestrator strip** animates: `Understanding your request…` → `Intent: point-of-work guidance (98%)` → `Routing to → Knowledge & Risk Agent`. (Three pills light up in sequence; this visualises slide 4's "Capture → Understand → Route".)
  3. Typing indicator, then **token-by-token streamed** answer (fake streaming via interval over a hardcoded string).
  4. Answer renders as structured blocks: a plain-language summary, a **red "Critical controls" callout**, a **"Before you start" checklist**, and a **source chip**: `📄 SOP-WAH-014 · Working at Heights · v3.2 · approved 12 Apr 2026`.
  5. Below: guardrail line *"Grounded in VZI documentation. Verified by HSE. Human sign-off required for any deviation."*
- **Buttons:** "Start pre-task checklist" (→ 5.4, pre-loaded with this hazard), "View full SOP" (→ source drawer), "Not helpful" (toast: feedback logged).
- **Source drawer (popup):** shows the SOP passage, version history (v3.0→v3.2), approval chain, and a **"Standard updated"** flag on one related control (ties to P2.3).
- **Error state (optional, impressive):** if user types something off-domain (*"what's the weather"*), agent replies *"I can only help with VZI safety guidance"* — shows guardrails are real.

### 5.4 Pre-Task Checklist (digitised, auto-filled)
- **Purpose:** "documentation completed consistently" + auto-population from operational data.
- **Fields (auto-filled, shown filling in with a shimmer):** Worker, Crew, Shift, Area/Location, Task, Equipment, Permit #, Weather/conditions. **Manual:** hazard checkboxes (working at heights ✓, energy isolation ✓, ground conditions ✓…), free-text controls confirmation, signature pad.
- **Buttons:** "AI suggest controls" (inserts hazard-specific controls), "Submit checklist."
- **Success:** state → Submitted; toast *"Pre-task logged · supervisor notified"*; appears in Supervisor Console queue (cross-surface wiring — big wow if shown).
- **Error:** submitting with an unchecked mandatory hazard → inline *"Confirm all critical controls before starting."*

### 5.5 Report Near-Miss / Incident (Worker)
- **Purpose:** capture at point of work; feeds investigation + intelligence.
- **Fields:** Type (near-miss / incident / hazard), Area, Date/time (default now), Description (textarea), Photo upload (fake, shows thumbnail), Severity (low/med/high). **Button:** "Submit report."
- **AI assist:** on submit, *"Zen-Sentinel is classifying this report…"* → returns suggested category (*Dropped object*), suggested critical control, and *"Similar events: 3 in last 90 days"* preview (foreshadows intelligence).
- **Success:** toast + new card in Supervisor Console queue with status **Submitted**.

### 5.6 Supervisor Console — Home (HSE Officer/Manager)
- **Purpose:** the HSE command centre; Track B entry.
- **Layout:** left = **Work Queue** table; right = **Activity Feed** + agent status.
- **Table (Work Queue):** columns — ID, Type, Area, Reported by, Status (chip), Assigned agent, Age, Action. Rows include the items created live during the demo (the near-miss from 5.5, the pre-task from 5.4) plus seeded rows.
- **Status chips:** Submitted (grey) · Under Review (amber) · Approved (green) · Closed (slate). 
- **Buttons per row:** "Open" → investigation (5.7). **Filters:** by status, area, agent, date.
- **Activity feed:** live-style entries (*"Knowledge & Risk answered 4 queries · 2 min ago"*, *"Shift Handover generated for Night Shift"*).

### 5.7 Incident Investigation — ICAM Agent *(P0, the human-in-the-loop showcase)*
- **Purpose:** AI drafts an ICAM investigation; HSE edits and signs off. Answers "documentation inconsistent" + "human in the loop."
- **Layout:** two-pane — left = incident facts; right = **AI-drafted ICAM** sections.
- **AI draft (generated with a 2s "Drafting investigation…" loader):**
  - **Timeline** (auto-built event sequence)
  - **Absent/failed defences** (ICAM)
  - **Individual/team actions**
  - **Task/environmental conditions**
  - **Organisational factors**
  - **Causal factors** (ranked)
  - **Recommended corrective actions** (table: action, owner, due date, priority)
- **Editable:** every section is an editable field (demonstrate editing one corrective action → "edited" badge appears).
- **Human-in-the-loop gate:** a prominent banner *"AI-drafted — requires HSE owner sign-off before finalising."* **Buttons:** "Request changes", "Sign off & approve" (requires a name/PIN field — fake). On sign-off → status flips **Under Review → Approved**, banner turns green *"Signed off by A. Modau · 27 Jun 2026 14:32 · logged to audit"*, and the approved incident is pushed to Incident Intelligence.
- **Source/traceability:** *"Aligned to ICAM SOP-INV-002 v2.1"* chip.
- **Success/Error:** sign-off without name → *"Sign-off requires your HSE owner identity."*

### 5.8 Approvals — Human-in-the-Loop Board (Kanban)
- **Purpose:** make the workflow engine *visible*. 
- **Layout:** four columns (Submitted → Under Review → Approved → Closed) with draggable cards (investigations, risk assessments, corrective actions, lessons-learned).
- **Clickable:** drag a card across columns → state persists (localStorage) → toast + audit entry. Each card shows the owning agent and an "AI-drafted / human-approved" tag.
- **Why:** satisfies the brief's workflow-simulation requirement and is a strong visual "this is a real system" beat.

### 5.9 Shift Handover Agent *(P0)*
- **Purpose:** AI-assisted handover; documentation completeness; auto-fill from operational data.
- **Layout:** form + live **Completeness meter**.
- **Auto-pull (animated):** Open work orders (4), Active permits (3), Equipment status (2 flagged), Outstanding actions (5), Environmental readings. Meter animates **62% → 94%** as AI fills gaps.
- **Fields:** Outgoing/incoming supervisor, shift, area, summary (AI-drafted, editable), risks carried over, "voice note" (fake — shows a waveform + transcribed text). **Buttons:** "AI draft summary", "Generate handover PDF", "Send to next shift."
- **Success:** PDF preview modal (styled, branded) + toast *"Handover sent · Night Shift acknowledged."*

### 5.10 Knowledge Base (browse + change monitoring)
- **Purpose:** show the "configured knowledge base" deliverable (D3) and version control (P2.3).
- **Table:** Document, Type (SOP/RA/Control/Standard), Version, Owner, Approved date, **Status** (Current / **Review due** / **Standard changed**). Search + filter.
- **Clickable:** open a doc → version history timeline + "AI summary" + "Ask about this document" (deep-links to chat). One row carries a red **"Regulatory standard updated — 3 SOPs need review"** alert (ties P2.3).

### 5.11 Analytics — Safety Intelligence Dashboard *(P0, executive money-shot)*
- **Purpose:** turn unused data into insight; the executive view.
- **KPI cards (big numbers):** Incidents MTD (12, ↓18%), Near-miss ratio (8.4:1, healthy), Overdue corrective actions (5), SOP currency (92%), Open at point-of-work queries today (37).
- **Charts:** 
  - **Recurring-pattern heatmap** (Area × Hazard type) — the hot cell *Gamsberg crusher × dropped object* glows.
  - **Incident trend** (line, 12 months).
  - **Incidents by category** (bar).
  - **Corrective-action status** (donut).
  - **Agent activity** (stacked area — queries handled per agent).
- **Clickable:** click the hot heatmap cell → drills to 5.12.

### 5.12 Recurring Patterns & Lessons Learned
- **Purpose:** systemic learning (O3, P2.5, P2.6).
- **Content:** **Insight card** *"4 dropped-object near-misses at Gamsberg crusher in 90 days — common factor: barricading not re-established after maintenance."* → AI-generated **Lessons-Learned** card with recommended control + "Publish to Knowledge Base" button (→ appears in 5.10). Related-incident list.

### 5.13 Predictive Early-Warning (simulated, P1)
- **Purpose:** proactive maintenance (P2.10–P2.12).
- **Content:** alert cards per asset — *"EX-204 Hydraulic Shovel · failure probability 0.71 · inspect within 72h."* Click → trend chart of pre-use checklist anomalies (rising "hydraulic leak noted" frequency) + "Raise maintenance action" button → creates a corrective action in the workflow.
- **Honesty hook:** small footnote *"Indicative model — IoT/condition-monitoring data integrated in production (Phase 2)."* (matches PPT assumptions, builds trust).

### 5.14 Reports (export)
- **Purpose:** deliverable D7; tactile "I can take this to the board."
- **Content:** report templates (Monthly HSE summary, Incident pack, Compliance status). "Generate" → 1.5s loader → branded PDF preview modal → "Download." (Use a pre-rendered styled HTML→print or a static PDF asset.)

### 5.15 Architecture & Roadmap (static)
- **Purpose:** D2 + Phase 1 deliverables; reassures technical buyers.
- **Content:** recreate slide 5's multi-agent architecture as a clean interactive diagram (hover a node → tooltip) + the slide 7 timeline. Pure static — zero logic.

### 5.16 Integrations Panel
- **Purpose:** P2.13 — make integration feel done.
- **Content:** cards for **Enablon**, **SharePoint**, **Plant Maintenance System**, **Microsoft Entra ID**, each with a status dot (Connected ✓), last-sync timestamp, record count, and a "Sync now" button → spinner → *"Synced 1,284 records"* toast. Pure theatre.

### 5.17 Audit Log + POPIA
- **Purpose:** P2.16 governance; the trust closer.
- **Table:** Timestamp, User, Agent, Action, Source doc + version, **POPIA class** (Internal C3), Outcome. Filter by agent/user. Every AI answer and sign-off from the live demo appears here.

### 5.18 Settings / Admin
- **Purpose:** Phase 1 functional-config story (P1.3); completeness.
- **Content:** Agents list (4) with enable toggles, model/guardrail settings (fake), confidence threshold slider, user & role table, knowledge-base sources. All non-functional toggles that *look* configurable.

### 5.19 Notification Centre
- **Purpose:** requirement #10 (notifications).
- **Content:** bell with badge; dropdown with mixed-channel items (Email, Teams, SMS, Push, WhatsApp icons) e.g. *"[Teams] Investigation INV-204 awaiting your sign-off"*, *"[SMS] Pre-task overdue — C-Shift."* Toasts fire on key actions.

---

## 6. Fake Backend Specification

No server. A `/src/mock` layer plus an in-memory store (Zustand) with optional `localStorage` persistence so state survives a refresh mid-demo.

### 6.1 Mock data files (`/src/mock/data/*.json`)
`users.json`, `agents.json`, `sops.json`, `incidents.json`, `nearMisses.json`, `checklists.json`, `handovers.json`, `correctiveActions.json`, `kpis.json`, `patterns.json`, `lessons.json`, `assets.json`, `integrations.json`, `auditLog.json`, `notifications.json`, `chatScripts.json`.

### 6.2 Mock service modules (`/src/mock/services/*.ts`)
Each returns a Promise with a realistic delay (`await delay(600–2000ms)`):
```ts
// agentService.ts
classifyIntent(text): { intent, confidence, route }   // keyword-matched, scripted
askKnowledgeAgent(text): AsyncGenerator<string>        // yields tokens for fake streaming
draftIcamInvestigation(incidentId): IcamDraft          // returns hardcoded ICAM object
getPatterns(): Pattern[]                                // recurring-pattern insights
getPredictions(): AssetRisk[]                           // simulated failure probabilities
// workflowService.ts
transition(itemId, toState): WorkflowItem               // updates store + writes audit
// integrationService.ts
sync(systemId): { recordCount, ts }                     // fake "Synced N records"
// notifyService.ts
push(channel, message)                                  // adds to centre + toast
```

### 6.3 Workflow state machine (shared)
```
Submitted → Under Review → Approved → Closed
                 ↘ Request Changes → Submitted
```
Every transition writes `{ id, item, from, to, user, ts, agent, source, popiaClass }` to `auditLog`.

### 6.4 Sample identifiers (consistent everywhere)
- Incidents: `INC-2026-0204`; Near-miss: `NM-2026-0337`; Investigation: `INV-204`; SOP: `SOP-WAH-014 v3.2`; Corrective action: `CA-0912`; Handover: `HO-NS-0627`; Asset: `EX-204`.

### 6.5 Optional realism (only if Dev C has slack)
Wire **Mock Service Worker (MSW)** so the browser Network tab shows `GET /api/agents`, `POST /api/investigations/204/draft` etc. returning the JSON. This makes "is this really mocked?" inspection backfire in our favour. **Nice-to-have, not on the critical path.**

---

## 7. AI Simulation Spec

Never call a real model. Three reusable AI illusions:

**A. Intent routing strip** (used in 5.3): a `<RoutingStrip>` component that sequences three pills with 500ms gaps: *Understanding → Intent (label + %)→ Routing to <Agent>*. Drives the "supervisor agent" story.

**B. Token streaming** (used in chat, ICAM draft, handover summary): a `useFakeStream(text, speed)` hook that reveals a hardcoded answer token-by-token via `setInterval`, with a blinking cursor. Looks exactly like a live LLM.

**C. "Analysing…" loaders** (uploads, drafts, predictions): a `<AgentThinking label="Analysing checklist data…"/>` component — animated dots + agent avatar — resolves to a hardcoded structured result.

**Golden rule for scripts:** every AI output ends with a **source/version citation** and, where safety-critical, a **human-sign-off requirement**. That single pattern is what makes it feel trustworthy rather than gimmicky. All answer text lives in `chatScripts.json` keyed by prompt, with a sensible default fallback so a typed question never breaks.

---

## 8. Workflow Simulation Spec

- **Buttons change state, not data on a server.** Each workflow item carries a `status`; buttons call `workflowService.transition()`; chips re-colour; the Kanban board (5.8) and Console queue (5.6) read the same store, so a sign-off in one place updates everywhere — a powerful "it's one connected system" beat.
- **Human-in-the-loop gate:** Approve buttons are disabled until a sign-off identity is entered. This is the visual proof of the proposal's central safety promise.
- **Persistence:** store mirrors to `localStorage` so an accidental refresh during the demo doesn't reset progress.

---

## 9. Charts (all from mock data, Recharts)

| Chart | Type | Where | Mock source |
|---|---|---|---|
| Recurring-pattern heatmap | Custom grid (div-based) | 5.11 | `patterns.json` |
| Incident trend (12 mo) | Line | 5.11 | `kpis.json` |
| Incidents by category | Bar | 5.11 | `kpis.json` |
| Corrective-action status | Donut | 5.11 | `correctiveActions.json` |
| Agent activity | Stacked area | 5.11 | `kpis.json` |
| KPI cards | Big-number stat cards | 5.11 | `kpis.json` |
| Checklist-anomaly trend | Line | 5.13 | `assets.json` |
| Asset risk gauge | Radial/gauge | 5.13 | `assets.json` |
| Completeness meter | Progress arc | 5.9 | computed |
| SOP currency | Progress/compliance bar | 5.10/5.11 | `sops.json` |

Heatmap is the hero — keep it crisp; it carries Journey 2 and 5.

---

## 10. Notifications (samples)

Stored in `notifications.json`, surfaced in the bell + as toasts:
- **Teams:** *"INV-204 awaiting your sign-off — Incident Investigation Agent."*
- **Email:** *"Monthly HSE report ready to download."*
- **SMS:** *"C-Shift pre-task checklist overdue at Swartberg."*
- **Push:** *"New lesson-learned published: Gamsberg dropped objects."*
- **WhatsApp:** *"Permit P-0912 approved for night shift."*
- **Toast (in-app):** success/info/warn variants fired on submit/sign-off/sync.
- **Activity feed:** rolling agent activity entries.

Channel icons make multi-channel reach obvious without any real sending.

---

## 11. Documents (fake artefacts)

Generate visually-convincing artefacts (styled HTML rendered to a print/PDF preview modal, or pre-baked PDF assets in `/public`):
- **ICAM investigation report** (INV-204) — branded, with sign-off block.
- **Shift handover sheet** (HO-NS-0627).
- **Pre-task checklist** (completed, signed).
- **Monthly HSE summary report** (charts + tables).
- **Lessons-learned bulletin.**
- **Maintenance work order** (from predictive alert).
All carry the Zensar × VZI footer, POPIA "Internal (C3)" classification, and a document ID + version — matching the SoW's own footer convention for uncanny familiarity.

---

## 12. Demo Data Specification (realistic, mining-accurate)

Seed data grounded in VZI's real context (Black Mountain Deeps, Swartberg, Gamsberg — Northern Cape zinc-lead operations).

- **Users (8):** Thabo Nkosi (Worker, C-Shift), Lerato Mokoena (HSE Officer), Dr Amukelani Modau (Chief HSE & ESG Manager), Pieter van Wyk (Ventilation), Naledi Dlamini (Environmental), Sipho Khumalo (Shift Supervisor), Admin (IT), Exec (GM).
- **Plants/areas (4):** Black Mountain Deeps, Swartberg, Gamsberg Concentrator, Surface Workshops.
- **SOPs/controls (12):** Working at Heights (SOP-WAH-014 v3.2), Lockout/Tagout — energy isolation (SOP-LOTO-007 v4.0), Confined Space (SOP-CS-009 v2.3), Mobile Equipment (SOP-ME-021 v1.8), Underground Ventilation (SOP-VENT-011 v3.1), Dropped-Object Prevention (SOP-DOP-005 v2.0), Barricading (SOP-BAR-003 v1.5), ICAM Investigation (SOP-INV-002 v2.1) … each with version history + approval dates.
- **Incidents/near-misses (15):** mix of dropped object, slip/trip, energy isolation, mobile-equipment proximity, dust exposure — clustered to make the Gamsberg dropped-object pattern emerge.
- **Checklists/handovers (10):** pre-task + shift handovers across shifts.
- **Corrective actions (12):** owners, due dates, statuses.
- **Assets (6):** EX-204 Hydraulic Shovel, DT-118 Dump Truck, CV-09 Conveyor, etc., with pre-use checklist trends.
- **Integrations (4):** Enablon, SharePoint, Plant Maintenance, Entra — with sync stats.
- **KPIs/patterns/lessons/audit/notifications** as specified above.

A single `seed.ts` builds the store from these JSONs on first load. Keep names/IDs consistent across files — the cross-references are what make it feel real.

---

## 13. Architecture (PoC)

```
React (Vite + TS) SPA
   │
   ├── React Router  ─────────────► role-based surfaces
   ├── Zustand store ─────────────► in-memory state + localStorage mirror
   ├── /mock/services ────────────► fake async APIs (delays, generators)
   ├── /mock/data (JSON) ─────────► seed "database"
   ├── Recharts ──────────────────► all visualisations
   ├── Framer Motion ─────────────► routing strip, streaming, transitions
   └── (optional) MSW ────────────► network-tab realism
```
**Why this and not a backend:** with 2 days and 3 devs, any real server, DB, auth, or API steals time from the only thing the customer sees — the experience. A client-only SPA with a disciplined mock layer gives 100% of the demo value at ~10% of the effort, and the mock-service boundary mirrors where the real API will slot in later (so the PoC is also an architecture sketch).

---

## 14. Folder Structure

```
zen-sentinel-poc/
├── public/                 # logos, hero images, pre-baked PDFs, favicon
├── src/
│   ├── main.tsx, App.tsx, router.tsx
│   ├── theme/              # tokens, tailwind config, global.css
│   ├── components/         # shared (see §16)
│   │   ├── ui/             # Button, Card, Dialog, Table, Chip, Toast…
│   │   ├── charts/         # Heatmap, TrendLine, Donut, StatCard…
│   │   ├── agent/          # RoutingStrip, AgentThinking, StreamedAnswer, SourceChip
│   │   └── layout/         # TopBar, AgentRail, PhoneFrame, SurfaceShell
│   ├── surfaces/
│   │   ├── pow/            # Point-of-Work screens (5.2–5.5)
│   │   ├── console/        # Supervisor Console (5.6–5.10)
│   │   └── analytics/      # Dashboard (5.11–5.14)
│   ├── shared/             # Architecture, Integrations, Audit, Settings, Notifications
│   ├── store/              # zustand slices: auth, workflow, notifications, agents
│   ├── mock/
│   │   ├── data/*.json
│   │   └── services/*.ts
│   ├── hooks/              # useFakeStream, useAgentRoute, usePersona
│   └── lib/                # delay(), ids(), pdf preview helper
├── index.html
├── tailwind.config.js
├── package.json
└── README.md               # how to run + demo path
```

---

## 15. Tech Stack (and why each — chosen for speed)

| Choice | Why (in a 2-day context) |
|---|---|
| **Vite + React + TypeScript** | Instant HMR, near-zero config, fastest path to a SPA. Next.js/SSR adds setup and routing complexity we don't need with no backend. TS catches cross-component prop errors while three people move fast. |
| **Tailwind CSS** | Enterprise-grade layout without writing CSS files; the whole team styles consistently and fast. |
| **shadcn/ui (optional) or a tiny hand-rolled `ui/` kit** | Pre-built accessible primitives (Dialog, Tabs, Table) save hours. If install risk, fall back to ~10 small Tailwind components. |
| **React Router** | Simple client routing for the surfaces; no learning curve. |
| **Zustand** | Minimal global state with localStorage persistence in ~20 lines — far faster than Redux, cleaner than prop-drilling. The cross-surface "one system" effect depends on shared state. |
| **Recharts** | Declarative charts from JSON in minutes; covers every chart in §9 except the heatmap (a simple div grid). |
| **Framer Motion** | The wow layer: routing strip, streaming cursor, card transitions, meter animation. High polish per line of code. |
| **lucide-react** | Clean enterprise icon set (channels, agents, status). |
| **MSW** (optional) | Network-tab realism if time remains; isolated so it can be dropped. |

Lock versions on hour 0 and commit `package-lock.json` so all three machines are identical.

---

## 16. Reusable Components (build once, use everywhere)

Dev A builds these in the first 2 hours; B and C consume them.

- **`<StatCard>`** — big number, label, delta arrow (KPIs).
- **`<DataTable>`** — sortable/filterable table (queue, KB, audit, actions).
- **`<StatusChip>`** — workflow state colour chip.
- **`<SourceChip>` + `<SourceDrawer>`** — the traceability moment.
- **`<RoutingStrip>`** — supervisor intent-routing animation.
- **`<AgentThinking>`** — analysing loader.
- **`<StreamedAnswer>`** — token-streamed answer block with cursor.
- **`<Dialog>` / `<Drawer>`** — popups, source view, PDF preview.
- **`<Toast>` + `useToast()`** — global notifications.
- **`<Card>`, `<SectionHeader>`, `<Button>`, `<Tabs>`, `<Filter>`** — primitives.
- **`<PhoneFrame>`** — wraps the Point-of-Work app to read as mobile.
- **`<Heatmap>`, `<TrendLine>`, `<Donut>`, `<StackedArea>`, `<ProgressArc>`** — chart wrappers.
- **`<KanbanBoard>`** — the approvals workflow.

---

## 17 & 18. Parallelisation + Hour-by-Hour Plan (3 devs × 16h)

**Ownership split (low-conflict — each dev owns a surface + a slice of shared work):**
- **Dev A — Shell, Design System & Point-of-Work (Track A: Agents 1 & 4).** Owns theme, `components/ui` + `components/agent`, login, persona switch, PhoneFrame, Point-of-Work screens, Knowledge & Risk chat, Pre-Task, Shift Handover worker view.
- **Dev B — Supervisor Console & Workflow (Track B: Agent 2).** Owns Console home/queue, ICAM Investigation, Approvals Kanban, Shift Handover build/PDF, Knowledge Base, Notifications, document artefacts.
- **Dev C — Analytics, Intelligence, Data & Integrations (Agent 3 + predictive).** Owns the mock data factory + services (built first, unblocks everyone), all charts, Analytics Dashboard, Recurring Patterns/Lessons, Predictive, Integrations panel, Audit Log, Settings, Architecture/Roadmap.

> Critical sequencing: **Dev A ships the design-system kit and Dev C ships the seed data + service stubs by end of Day-1 morning.** Everything else depends on those two.

### DAY 1 (8h)

| Hour | Dev A (Shell + PoW) | Dev B (Console + Workflow) | Dev C (Data + Analytics) |
|---|---|---|---|
| **H1** | Repo init, Vite+TS, Tailwind, router skeleton, lock deps | Pull repo; scaffold Console routes; sketch ICAM data shape with C | Build `mock/data/*.json` seed (users, sops, incidents, kpis, patterns) |
| **H2** | Design tokens + `ui/` kit (Button, Card, Chip, Dialog, Toast) | Define workflow state machine + `workflowService` | `mock/services` stubs + Zustand store + `delay()`/`ids()` |
| **H3** | TopBar, SurfaceShell, AgentRail, persona switch, Login | Console Home + Work Queue (DataTable) reading store | StatCard + Recharts wrappers; KPI cards on Dashboard |
| **H4** | PhoneFrame + PoW Home + nav | Incident Investigation layout + ICAM draft (static) | Heatmap + Trend + Donut wired to JSON |
| **H5** | `RoutingStrip` + `StreamedAnswer` + `useFakeStream` | ICAM editable sections + sign-off gate (state flip) | Recurring Patterns + Lessons-Learned screen |
| **H6** | **Ask Zen-Sentinel** chat end-to-end (chips→route→answer→source) | Approvals Kanban (drag → transition → audit) | Predictive Early-Warning cards + anomaly chart |
| **H7** | Pre-Task Checklist (auto-fill anim) + cross-wire to Console queue | SourceDrawer + Knowledge Base table + change alert | Integrations panel (sync toasts) + Audit Log table |
| **H8** | **Day-1 integration merge** + smoke test of Journey 1 | Merge; verify Journey 2 (report→investigate→approve) | Merge; verify Journey 5 (dashboard→pattern) |

**End of Day 1 target:** all three surfaces navigable; Journeys 1, 2 and 5 demoable end-to-end even if rough.

### DAY 2 (8h)

| Hour | Dev A | Dev B | Dev C |
|---|---|---|---|
| **H9** | Report Near-Miss (AI classify) + wire to queue | Shift Handover build + completeness meter + AI summary | Settings/Admin + Architecture & Roadmap (static) |
| **H10** | Polish chat: guardrail line, off-domain refusal, suggested chips | Handover PDF preview modal + document artefacts | Notifications centre + multi-channel samples + toasts |
| **H11** | Framer Motion polish: transitions, streaming cursor, meter | ICAM "edited" badges + corrective-action table | Predictive → "raise maintenance action" → workflow wire |
| **H12** | **Full Journey 1, 3 dry-run**; fix worker-app spacing | **Full Journey 2, 6 dry-run**; audit-log population | **Full Journey 4, 5 dry-run**; chart polish |
| **H13** | Cross-surface consistency pass (names, IDs, colours) | Empty/error/success states everywhere | Reports export + branded PDF |
| **H14** | **Bug bash #1** — whole team clicks every path; log defects | | |
| **H15** | **Fix critical defects** (P0 paths only); freeze features | | |
| **H16** | **Demo rehearsal ×2** against the script (§20); assign narration; back-up build | | |

**Buffers built in:** H14–H16 are deliberately reserved for hardening and rehearsal. If H8 slips, sacrifice P2 items (Integrations depth, KB browse, Reports) — never the P0 journeys.

---

## 19. Fake Integrations — exactly how

| System (SoW/PPT) | What we show | How we fake it |
|---|---|---|
| **Enablon** (ICAM/incidents) | ICAM investigation "synced from Enablon", record counts | `integrationService.sync('enablon')` → delay → toast *"Synced 1,284 incident records"*; ICAM screen shows an "Enablon-linked" chip |
| **SharePoint** (SOP repository) | SOPs/knowledge base "sourced from SharePoint" | Source drawer shows `SharePoint › HSE › SOPs › SOP-WAH-014.pdf`; sync card with last-sync time |
| **Plant Maintenance System** | Equipment data behind predictive alerts | Predictive cards labelled *"data: Plant Maintenance"*; sync toast with asset counts |
| **Microsoft Entra ID** | SSO login | Login button + 800ms "Authenticating with Entra ID" spinner |
| **Email / SMS / Teams / WhatsApp / Push** | Multi-channel notifications | Channel-tagged items in the notification centre; toasts on action |
| **SAP/Oracle/ERP** (if asked) | Work orders / asset master | Narrate as "ERP via MCP tool server"; show work-order artefact |
| **IoT / sensors** | Predictive inputs | Explicitly labelled *"indicative — IoT integrated in production"* (matches PPT assumption that IoT is excluded now) |

The pattern: a **status panel** (everything "Connected ✓"), **sync buttons** that produce realistic counts, and **provenance chips** on data that name the source system. That trio sells "it's wired in" without a single real call.

---

## 20. 15-Minute Demo Script (with narration)

**Setup:** start on Login as Dr Modau. Have the build pre-loaded; turn off notifications on the demo machine; use the rehearsed prompts only.

**[0:00–1:30] The problem (Login + framing).**
*"Your SoW named four execution gaps — knowledge not at the point of work, inconsistent documentation, recurring incidents, unused data. We built Zen-Sentinel to close all four with four AI agents and one supervisor, with your HSE team always in control."* Sign in → *"Single sign-on through your Entra ID."* Land on persona picker.

**[1:30–4:30] Point of work — Worker (Journey 1).** Pick **Worker**. Phone frame appears. *"This is what a supervisor sees on the ground."* Tap **Ask Zen-Sentinel** → use the working-at-heights chip. Let the **routing strip** play. *"The supervisor agent classifies the intent and routes to the Knowledge & Risk agent."* Answer streams. *"Plain language — and crucially, here's the source: SOP-WAH-014, version 3.2, approved in April. No guessing, fully traceable."* Click the source chip → drawer. Tap **Start pre-task checklist** → watch auto-fill → submit → *"That just went to the HSE console."*

**[4:30–8:00] HSE Console + ICAM + human-in-the-loop (Journey 2).** Switch to **HSE Officer**. Show the queue — *"there's the pre-task, and a near-miss reported this morning."* Open the near-miss → **Incident Investigation agent drafts the ICAM** (loader → sections stream). *"It drafts the timeline, failed defences, causal factors and corrective actions — aligned to your ICAM SOP."* Edit one corrective action → *"I stay in control."* Click **Sign off & approve** → state flips green. *"Nothing is finalised without an HSE owner's sign-off, and every step is logged."*

**[8:00–10:30] Intelligence — the recurring pattern (Journey 5→2).** Switch to **HSE Manager** → Analytics. *"This is the data you already have, finally working for you."* KPI cards, then the **heatmap** — click the glowing Gamsberg cell. *"Zen-Sentinel spotted the 4th dropped-object near-miss in 90 days — common cause, barricading not re-established."* Show the auto-generated **lessons-learned** → **Publish to knowledge base.**

**[10:30–12:00] Shift handover + predictive (Journeys 3 & 4).** Open **Shift Handover** → completeness meter climbs 62%→94% → **Generate PDF** (preview). Then **Predictive Early-Warning** → EX-204 card → *"indicative today; with your Plant Maintenance and sensor data in production, this gets sharper."*

**[12:00–13:30] Governance closer (Journey 6).** Open **Integrations** (all Connected ✓) and the **Audit Log** — *"every recommendation, its source and version, POPIA-classified, fully auditable."*

**[13:30–15:00] Roadmap.** Open **Architecture & Roadmap** (your slide 5 + 7, alive). *"Everything you saw runs on a demo harness today. This is the same architecture we'll build in Phase 1 and 2 — discovery, then the four agents on one platform, in about six months."* Close on the value sentence: *"Right safety information, at the point of work, with your team in control."*

---

## 21. 10 Customer WOW Moments

1. **Routing strip** animating *Understand → Intent 98% → Knowledge & Risk* — the four agents become one mind.
2. **Token-streamed** plain-language answer with a live cursor — feels like a real LLM.
3. **Source + version chip** + drawer — the trust differentiator; nobody expects citation rigour.
4. **Cross-surface magic:** a worker's checklist appears in the HSE console live.
5. **ICAM auto-draft** filling six investigation sections in seconds.
6. **Human-in-the-loop sign-off** flipping the card green with an audit stamp.
7. **Heatmap hot-cell** revealing the recurring Gamsberg pattern — "it saw what we missed."
8. **Completeness meter** animating 62%→94% on the handover.
9. **Predictive alert** with the honest "indicative" footnote — credibility through restraint.
10. **Audit log + POPIA badge** — the governance mic-drop for a risk-averse buyer.

---

## 22. Risk Reduction — what NOT to build, and how to fake it convincingly

| Don't build | Fake it with | Why it's safe |
|---|---|---|
| Real LLM / RAG | Scripted streaming + keyword routing + source chips | The *behaviour* (route, answer, cite) is what convinces; the model is invisible. |
| Auth/SSO | 800ms Entra spinner | Auth is assumed, not interrogated, in a demo. |
| Backend/DB/APIs | Zustand + JSON + mock services (+ optional MSW) | The network boundary is mocked exactly where the real API will sit. |
| Integrations | Status panel + sync toasts + provenance chips | Buyers check "is it connected?", not packet traces. |
| PDF generation | Styled HTML print preview or pre-baked PDFs | A polished preview reads as "generated." |
| Predictive ML | Hardcoded probabilities + "indicative" label | Honesty about IoT matches the PPT and builds trust. |
| Mobile build/PWA | `<PhoneFrame>` wrapper in the browser | Reads unmistakably as a field app without a device. |

**Top demo risks & mitigations:** (1) *live network call fails* → everything is local, no network needed; (2) *accidental refresh* → localStorage persistence; (3) *off-script prompt* → default fallback answer + suggested chips steer the operator; (4) *merge chaos* → strict surface ownership + two merge windows (H8, H12); (5) *time overrun* → P2 items are the sacrifice list, P0 journeys are protected by the H14–H16 buffer.

---

## 23. If Time Remains (enhancements, in priority order)

1. MSW for network-tab realism.
2. A second worked example in the chat (LOTO / confined space) to handle a curveball question.
3. Dark-mode executive dashboard variant for the "boardroom" feel.
4. A short auto-playing "attract loop" on the login screen.
5. Voice-note transcription animation on the handover.
6. A second language toggle (visual only) to nod at workforce diversity.
7. Subtle sound cue on sign-off / pattern detection.

---

## 24. Final Output Summary

- **Implementation roadmap:** §13–§18 (architecture, stack, folders, parallelised 16-hour plan).
- **Developer task allocation:** §17 (three owners, hour-by-hour, dependency-sequenced).
- **Clickable prototype design:** §4–§5 (three surfaces, 19 screens fully specified).
- **Navigation map:** §4 tree + §20 demo path.
- **Component list:** §16.
- **Mock data specification:** §6 + §12.
- **API simulation:** §6.2.
- **AI simulation:** §7.
- **Workflow simulation:** §8.
- **Testing checklist:** below.
- **Demo script:** §20.
- **Future production roadmap:** below.

### Testing checklist (run during H14 bug bash)
- [ ] Login → each of the 5 personas lands on the correct surface.
- [ ] Journey 1: chip → routing → streamed answer → source drawer → pre-task → appears in Console queue.
- [ ] Journey 2: report near-miss → ICAM draft → edit → sign-off blocked without identity → approve → green + audit entry.
- [ ] Journey 3: handover auto-fill → meter animates → PDF preview → "sent."
- [ ] Journey 4: predictive card → anomaly chart → raise action → appears in workflow.
- [ ] Journey 5: dashboard KPIs render → heatmap hot cell → drill to pattern → publish lesson → appears in KB.
- [ ] Journey 6: integrations all "Connected" → sync toast → audit log shows source+version+POPIA.
- [ ] Every primary button has success + error/empty states.
- [ ] Refresh mid-flow does not wipe workflow state (localStorage).
- [ ] No console errors on the demo path; off-domain prompt returns the guardrail refusal.
- [ ] Visual consistency: navy/red palette, Zensar×VZI footer, consistent IDs across screens.
- [ ] Back-up build exported and tested on the actual demo machine/browser.

### Future production roadmap — how this PoC evolves into the enterprise solution
| PoC element (movie set) | Production element (real building) | Phase |
|---|---|---|
| Fake login spinner | Microsoft Entra ID SSO + RBAC | P2 |
| `mock/services` boundary | FastAPI gateway (REST + SSE/WebSocket) | P2 |
| `chatScripts.json` + fake streaming | Supervisor/orchestrator + specialist agents on the GenAI stack | P2 |
| `sops.json` + source chips | pgvector + Postgres knowledge base; grounded RAG with citations | P1→P2 |
| Hardcoded ICAM draft | Investigation agent integrated to **Enablon** (ICAM) | P2 |
| `patterns.json` insight | Real recurring-pattern analytics over incident history | P2 |
| Predictive "indicative" card | Predictive models once IoT/condition-monitoring data is in scope | P2→P3 |
| Sync toasts | MCP tool servers to Enablon, SharePoint, Plant Maintenance | P2 |
| Static audit log | Guardrails + immutable audit + POPIA data governance | P2 |
| This PoC | Discovery validates workflows/architecture (Phase 1) → build & deploy four agents for ~40 HSE users (Phase 2) → operate & extend (Phase 3) | All |

**Bridge line for Vedanta:** *"What you clicked today is the experience and the architecture. Phase 1 confirms it against your real workflows; Phase 2 makes every mock real — same screens, live agents."*

---

*Prepared as the internal build bible for the Zensar delivery team. Optimised for maximum demo impact, minimum engineering effort, and a clean evolution path to the production platform proposed to Vedanta Zinc International.*
