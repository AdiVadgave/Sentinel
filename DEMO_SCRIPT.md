# Zen-Sentinel — 15-Minute Demo Script

Spoken narration, aligned to the live build and to [EXAMPLES.md](EXAMPLES.md).
Before you start: confirm `http://localhost:8000/api/health` shows `"mode": "live (Claude on Foundry)"`.

---

## Opening (~45 seconds)

Good morning, everyone. Let me show you **Zen-Sentinel**, our safety intelligence platform for Black
Mountain Mine. Today, mine safety has four problems: the knowledge exists, but not where the worker is
standing; paperwork is filled differently by everyone; the same incidents keep coming back; and all the
safety data just sits there, unused. Zen-Sentinel solves all four — with **four AI agents working under one
supervisor**, and your **HSE team always in control**.

I'll sign in with **Microsoft Entra ID** — the same company login you already use. Notice the
confirmation: the session is **POPIA-protected**, and from this point on every action is recorded.
Now it asks me which role to enter as.

---

## The Worker (~2 minutes)

Let me start as a **worker on the ground**. This is their phone, right at the point of work. I'll tap
**"Ask Zen-Sentinel"** and ask a real question — *"Can I work at heights near the Swartberg conveyor
today?"*

Watch the top of the screen. The **Supervisor understands the question and routes it to the right
agent** — four agents, one supervisor, working together like one brain. The answer comes back in plain
language, the way a worker actually speaks, and it **leads with the safety controls to check before
starting**.

Now here is the most important part. See this tag at the bottom? **SOP-WAH-014, version 3.2, approved
this April.** Every answer tells you exactly where it came from and which version — no guessing, no
made-up answers. And if I ask it something off-topic, it politely refuses — it stays in its lane,
safety only.

From this answer, the worker taps **"Start pre-task checklist,"** and the form fills itself — worker,
crew, shift, area, permit — all pulled automatically. Less typing means fewer mistakes. I'll **confirm
the critical control that applies — working at heights** — and I can even tap **"AI suggest controls,"**
and Zen-Sentinel writes the exact controls to confirm, grounded in the SOP. I'll submit it.

And now the magic: **that checklist instantly appears in the HSE officer's console.** What happens on
the ground is visible to the whole team in real time.

---

## The HSE Officer (~2 minutes)

Let me switch to the **HSE Officer**. This is the command centre — **one centralised view, so nothing
is missed and everything is tracked in a single place.** Here is the pre-task we just sent, and here is
a **near-miss reported this morning — a dropped spanner near the crusher.** I'll open it.

In just a few seconds, the **Incident Investigation agent** writes the whole investigation for me — the
**timeline**, **what safety defences failed**, the **ranked root causes**, and the **corrective actions
with owners and due dates** — all aligned to the **ICAM method** your investigators already use. This
used to take hours. And I can edit anything — let me change one line, and you see it marks it as
**edited**.

But nothing becomes final until a human signs off. This **approve button stays locked until I enter my
name.** Once I do and click **"Sign off and approve,"** it turns green and is written to the **audit
trail.** So the AI does the heavy lifting, but the **person always stays in control.**

Quickly, the **handover** screen does the same for shift changes. It pulls all the open work and drafts
the summary, and **completeness jumps from 62 percent to 94 percent.** I click **"Send to next
shift"** — and that handover lands straight on the **incoming worker's phone**, where they read it and
**acknowledge** it. One connected system, end to end. I can also print a clean PDF for the records.

---

## The HSE Manager (~1.5 minutes)

Now the **leadership view.** Again, one centralised view — nothing is missed, everything tracked in a
single place. We have the real numbers up top — **incidents this month, near-miss ratio, overdue
actions, and how current our procedures are.**

But look at this **red cell on the map** — it's glowing because **Zen-Sentinel spotted a pattern people
kept missing: four dropped-object near-misses at the same crusher in 90 days, all with the same root
cause.** And the intelligence agent has **just written the lesson learned** — including a concrete,
higher-order fix to stop it recurring. With **one click I publish it to everyone.** That's how we stop
the same incident from repeating.

Zen-Sentinel also **warns us before things break.** This shovel, **EX-204, needs inspection within 72
hours**, and one click turns that warning into a **tracked maintenance action.** And when I need to
report up, I **generate a board-ready report in seconds** — fully sourced and POPIA-classified.

---

## The Close (~45 seconds)

Finally, as an **admin**, everything connects to your real systems — **Enablon, SharePoint, Plant
Maintenance, and Entra ID.** These agents can be **configured and governed centrally** — you decide
which are switched on. And the **audit log records every single AI answer and every sign-off**: who did
it, what they did, and which **document and version** it used. **Fully traceable.**

So that is **Zen-Sentinel** — four agents, one supervisor, your team always in control. The **right safety
information at the point of work**, and **one centralised view where nothing is missed and everything is
tracked in a single place.** And everything you saw today runs on the **real architecture** — in
production, the same screens simply connect to your live systems.

---

### Pre-flight checklist (do this before the room walks in)
- Backend up and **live**: `http://localhost:8000/api/health` → `"mode": "live (Claude on Foundry)"`.
- Frontend running; you're signed out (start clean on the login screen).
- Rehearse the two LLM waits: the **ICAM draft** (~a few seconds) and the **Recurring Patterns** live
  analysis (~10 seconds — it shows content immediately, then the live "Live" version swaps in).
- Order matters for the handover loop: **send** it as the Officer first, then it's there for the Worker.
- Have the exact prompts ready to type/tap: *"Can I work at heights near the Swartberg conveyor today?"*
  and an off-topic one (e.g. *"Who won the cricket last night?"*) for the guardrail moment.
