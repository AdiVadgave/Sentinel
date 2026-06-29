# Sentinel — Examples: "you type → the AI responds"

Concrete, runnable interactions for the demo. Sign in, pick the persona shown, and try them.
Exact wording from Claude will vary run-to-run; the **shape** — grounding, source/version citation,
standards, guardrail, human sign-off — is what stays consistent and is what makes it trustworthy.

For what each tab does and how it maps to the problem statement, see
[FUNCTIONALITY.md](FUNCTIONALITY.md). For setup, see [README.md](README.md).

> **Live vs offline:** every example below runs on **live Claude** when the backend reaches Azure AI
> Foundry. Confirm with `http://localhost:8000/api/health` → `"mode": "live (Claude on Foundry)"`.
> If Azure is unreachable it transparently falls back to scripted text so the demo never breaks.

> **What to point at in a demo:** the **source/version chip**, the **standards list**, the **guardrail
> line**, and the **human sign-off gate**. Those are the trust signals — they're what separate this
> from a generic chatbot.

---

## Knowledge & Risk (Worker → Ask Sentinel)

### Example 1 — Working at heights
**You type / tap the chip:**
> *"Can I work at heights near the Swartberg conveyor today?"*

**Sentinel responds (streamed):**
- Supervisor strip animates: `Understanding… → Intent: point-of-work guidance (98%) → Routing to Knowledge & Risk`
- Plain-language answer: *yes, provided the working-at-heights critical controls are verified first…*
- **Critical controls:** fall-arrest harness clipped to a certified anchor; edge protection / barricading; WAH permit signed; exclusion zone below; weather check (work suspended in wind > 40 km/h).
- **Standards:** MHSA 1996 s11 (risk assessment), ISO 45001 (hierarchy of controls), ICMM Critical Control Management.
- **Source chip:** `SOP-WAH-014 · Working at Heights · v3.2 · approved 12 Apr 2026` → click it for the SOP passage + version history.
- **Guardrail:** *"Grounded in VZI SOPs + SA/international standards. Human sign-off required for any deviation."*

### Example 2 — A free-text question it has never seen
**You type:**
> *"Is it safe to enter the sump for cleaning during night shift?"*

**Sentinel responds:**
- Recognises this as **confined-space entry** (one of the highest-risk tasks) and notes the night shift does **not** change the requirements.
- Critical controls: confined-space permit; continuous atmosphere testing (O₂, LEL, CO, H₂S); forced ventilation; standby attendant; rescue plan — and isolate the sump pumps via LOTO first.
- **Source:** `SOP-CS-009 · Confined Space Entry · v2.3`, cross-referencing `SOP-LOTO-007`.
- **Standards:** MHSA 1996 s23 (right to refuse dangerous work), ISO 45001, ICMM CCM.

*This is the key proof it's a real model: a hand-typed question gets a reasoned, correctly-routed,
cited answer — not a canned reply.*

### Example 3 — Mobile equipment
**You type:**
> *"Do I need a spotter when reversing the dump truck near the workshop?"*

**Sentinel responds:** *Yes — a spotter (banksman) is required for pedestrian-vehicle interaction in
workshop areas; be in direct communication before reversing…* — cited to `SOP-ME-021 · Mobile Equipment`.

### Example 4 — Guardrail (off-domain refusal)
**You type:**
> *"Who won the cricket last night?"*

**Sentinel responds:**
> *"I can only help with VZI safety guidance — SOPs, critical controls, permits, incidents and shift
> documentation. Please ask your HSE officer for anything else."*

*Proves the guardrails are real, not decorative.*

---

## Incident intake (Worker → Report Near-Miss)

### Example 5 — AI classifies a reported event
**You enter:** Type = *Near-Miss*, Area = *Black Mountain Deeps*, Description =
> *"A worker slipped on spilled hydraulic oil near the decline portal, no injury."*

**Sentinel responds (on submit):**
- **Category:** Slip/Trip
- **Suggested control:** immediate spill containment + absorbent application, and a hydraulic hose/fitting inspection regime on mobile equipment transiting the portal to find the leak source.
- **Severity:** Medium · **Similar events (90 days):** 3
- The report is **persisted** and appears in the HSE Console work queue as **Submitted** (cross-surface — switch to HSE Officer to see it).

---

## Pre-task controls (Worker → Pre-Task Checklist)

### Example 6 — AI suggest controls
**You do:** tick the relevant hazard(s) (e.g. *Working at heights*) → click **AI suggest controls**.

**Sentinel responds:** a concise controls-confirmation paragraph written from your selected hazards and
grounded in the relevant SOP + hierarchy of controls (inspect harness/tags, verify barricading and
re-establish after breaks, tether tools, confirm permit, suspend in high wind / wet conditions), plus
the standards it relied on shown in the toast. You only need to confirm the controls relevant to your
task (at least one) before submitting.

---

## ICAM investigation (HSE Officer → Investigation)

### Example 7 — AI draft + human sign-off
**You do:** HSE Officer → **Console Home** → open the dropped-object near-miss **NM-2026-0337** →
it opens **Investigation** → wait for the draft → optionally edit a corrective action → enter your name
→ click **Sign off & approve**.

**Sentinel responds:** a full **ICAM** draft —
- **Timeline** of the event, **absent / failed defences** (barricading not re-established; tools not tethered), individual/team actions, task/environmental conditions, organisational factors,
- ranked **causal factors**, and **corrective actions** (e.g. *add re-barricading verification to permit close-out — owner L. Menon, High*).
- On sign-off: the banner turns green *"Signed off by <you> · <timestamp> · logged to audit"*, an audit entry is written, and the incident is pushed to Incident Intelligence.

*ICAM = **Incident Cause Analysis Method** — the structured, layered investigation framework the agent is aligned to (SOP-INV-002 v2.1).*

---

## Shift handover (HSE Officer → Worker, cross-surface)

### Example 8 — Draft, send, and receive a handover
**As HSE Officer → Shift Handover:**
1. Click **AI draft summary** → Sentinel writes a professional handover narrative for the incoming shift (work completed, equipment flagged like EX-204, carried-over actions CA-0912 / CA-0913, pending permits), and the completeness meter animates 62% → 94%.
2. Click **Send to next shift** → the handover is **persisted to the backend**.

**Now switch to the Worker persona → My Shift:**
- The worker sees **exactly that handover** — the real summary text, who it's from/to, the timestamp, the flagged-equipment and outstanding-action counts.
- Click **Acknowledge handover** → it records who acknowledged and when, and the card flips to *"Acknowledged by <name> · <time>"*.

*This is the "one connected system" beat: what the officer sends is what the worker receives, live.*

---

## Incident Intelligence (HSE Manager → Recurring Patterns)

### Example 9 — Live recurring-pattern analysis + lesson
**You do:** open **HSE Manager → Recurring Patterns**.

**Sentinel responds:** the pattern card shows the mock event data (4 dropped-object near-misses at the
Gamsberg crusher in 90 days, with the related incident IDs). The **analysis and lesson-learned are
generated live** by the Incident Intelligence agent:
- a one-line **common-factor insight** (e.g. *systemic failure in overhead-work controls — inadequate tool tethering and exclusion-zone enforcement*),
- a **lesson** with a recommended **higher-order control** (the model often proposes an engineering-level DROPS — Dropped-Object Prevention Scheme — not just "re-barricade"),
- the **standards** it benchmarked against (MHSA, ISO 45001 hierarchy of controls, ICMM CCM).
- A **"Live"** chip confirms it came from the model. Click **Publish to Knowledge Base** to share it.

*The page shows the seeded lesson instantly, then swaps in the live analysis a few seconds later — so it's never stuck on a loader.*

---

## Reporting (HSE Manager → Reports)

### Example 10 — Board-ready, AI-generated reports
**You do:** HSE Manager → **Reports** → click **Generate** on any of the three templates.

**Sentinel responds:** a live-generated report (title, period, executive summary, 3–4 sections) tailored to the type:
- **Monthly HSE Summary** — performance KPIs, the recurring Gamsberg pattern, the predictive flag, standards alignment.
- **Incident Pack** — open investigations, ICAM causal themes, priority corrective actions.
- **Compliance Status** — SOP currency, the flagged fall-protection-standard reviews, MHSA / ISO / ICMM alignment.

Each renders as a branded, printable document with an **"AI-generated"** chip and a POPIA classification.

---

## Governance (Admin → Audit Log)

### Example 11 — See the AI's work logged
**You do:** run a few of the examples above, then switch to **Admin → Audit Log**.

**Sentinel shows:** every AI answer and human sign-off captured with **user, agent, action,
source + version, POPIA classification, and outcome** — the traceability record. (POPIA classes are
assigned server-side by a heuristic classifier, e.g. *Internal (C3)* vs *Confidential — personal (C4)*
when an entry involves injury/medical detail.)

### Example 12 — Turn an agent off and watch the app respond
**You do:** Admin → **Settings** → toggle the **Incident Intelligence** agent off → go to HSE Manager → Recurring Patterns.

**Sentinel responds:** the live analysis is skipped (the agent is disabled) and the page falls back to
the seeded lesson — demonstrating that the agent toggles are real and server-enforced, not cosmetic.
