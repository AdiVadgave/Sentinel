"""Grounding corpus for the Knowledge & Risk agent.

This is the PoC stand-in for the production pgvector/RAG store. Each SOP carries
the version + approval metadata that powers the "source + version citation"
trust moment. The agent is instructed to answer ONLY from this corpus.
"""
from __future__ import annotations

SOPS: list[dict] = [
    {
        "id": "SOP-WAH-014",
        "title": "Working at Heights",
        "version": "v3.2",
        "approved": "12 Apr 2026",
        "owner": "Dr A. Mehta",
        "source": "SharePoint › HSE › SOPs › SOP-WAH-014.pdf",
        "critical_controls": [
            "Fall-arrest harness inspected and clipped to a certified anchor at all times above 1.8 m.",
            "Edge protection / barricading in place and verified before access.",
            "Working-at-heights permit issued and signed by the area supervisor.",
            "Exclusion zone established below the work area; no personnel beneath.",
            "Weather check — work suspended in wind > 40 km/h or lightning risk.",
        ],
        "body": (
            "Working at Heights applies to any task with a fall risk above 1.8 metres, including "
            "work on or adjacent to the Swartberg conveyor gantries. A valid working-at-heights "
            "permit must be raised and authorised by the area supervisor before access. A double-lanyard "
            "fall-arrest harness must be inspected (tag current) and clipped to a certified anchor "
            "point rated for fall arrest. Edge protection or barricading must be confirmed and an "
            "exclusion zone established below. Work is suspended in winds above 40 km/h, during "
            "electrical storms, or when visibility is impaired. Any deviation requires HSE owner sign-off."
        ),
        "history": [
            {"version": "v3.0", "date": "03 Aug 2025", "note": "Anchor-point certification interval tightened."},
            {"version": "v3.1", "date": "19 Jan 2026", "note": "Added wind-speed suspension threshold."},
            {"version": "v3.2", "date": "12 Apr 2026", "note": "Aligned to revised national fall-protection standard."},
        ],
    },
    {
        "id": "SOP-LOTO-007",
        "title": "Lockout / Tagout — Energy Isolation",
        "version": "v4.0",
        "approved": "28 Feb 2026",
        "owner": "P. van Wyk",
        "source": "SharePoint › HSE › SOPs › SOP-LOTO-007.pdf",
        "critical_controls": [
            "Identify and isolate ALL energy sources (electrical, hydraulic, pneumatic, gravitational).",
            "Apply personal lock and danger tag to each isolation point.",
            "Dissipate stored energy and verify zero-energy state before work.",
            "Try-test the start control to confirm isolation.",
            "Only the person who applied a lock may remove it.",
        ],
        "body": (
            "Lockout/Tagout governs the isolation of hazardous energy before maintenance or "
            "intervention on mobile and fixed plant. All energy sources must be identified and "
            "isolated, each isolation point locked and tagged with the worker's personal lock and "
            "danger tag. Stored energy (hydraulic accumulators, suspended loads, capacitors) must be "
            "dissipated and a zero-energy state verified by try-testing the start control. Locks are "
            "personal — only the applier removes them. Group isolations use a lock box."
        ),
        "history": [
            {"version": "v3.5", "date": "10 Sep 2025", "note": "Added group lock-box procedure."},
            {"version": "v4.0", "date": "28 Feb 2026", "note": "Mandatory try-test step added."},
        ],
    },
    {
        "id": "SOP-CS-009",
        "title": "Confined Space Entry",
        "version": "v2.3",
        "approved": "15 Mar 2026",
        "owner": "N. Dlamini",
        "source": "SharePoint › HSE › SOPs › SOP-CS-009.pdf",
        "critical_controls": [
            "Confined-space entry permit issued; atmosphere tested (O2, LEL, CO, H2S) before and during entry.",
            "Continuous forced ventilation maintained.",
            "Standby attendant stationed at entry with communications.",
            "Rescue plan and retrieval equipment in place before entry.",
        ],
        "body": (
            "Confined Space Entry covers tanks, silos, sumps and underground voids. A confined-space "
            "permit is mandatory. The atmosphere must be tested for oxygen, flammable gas (LEL), carbon "
            "monoxide and hydrogen sulphide before entry and monitored continuously. Forced ventilation "
            "is maintained throughout. A trained standby attendant remains at the entry point with a "
            "means of communication, and a rescue plan with retrieval equipment must be in place before "
            "any person enters."
        ),
        "history": [
            {"version": "v2.2", "date": "22 Nov 2025", "note": "H2S added to mandatory gas test."},
            {"version": "v2.3", "date": "15 Mar 2026", "note": "Continuous monitoring made mandatory."},
        ],
    },
    {
        "id": "SOP-DOP-005",
        "title": "Dropped-Object Prevention",
        "version": "v2.0",
        "approved": "05 May 2026",
        "owner": "L. Mokoena",
        "source": "SharePoint › HSE › SOPs › SOP-DOP-005.pdf",
        "critical_controls": [
            "Tool tethering for all work at height.",
            "Barricading and exclusion zones re-established after any maintenance break.",
            "Toe-boards and netting on elevated platforms.",
            "Pre-task inspection of fixtures and fittings above walkways.",
        ],
        "body": (
            "Dropped-Object Prevention reduces the risk of falling tools, components and materials, "
            "particularly around the Gamsberg crusher and conveyor structures. All tools used at height "
            "must be tethered. Barricading and exclusion zones MUST be re-established immediately after "
            "any maintenance activity or break — failure to do so is the leading cause of dropped-object "
            "near-misses on site. Elevated platforms require toe-boards and netting."
        ),
        "history": [
            {"version": "v1.5", "date": "30 Jun 2025", "note": "Tool-tethering made mandatory."},
            {"version": "v2.0", "date": "05 May 2026", "note": "Re-barricading-after-maintenance control elevated to critical."},
        ],
    },
    {
        "id": "SOP-ME-021",
        "title": "Mobile Equipment Operation",
        "version": "v1.8",
        "approved": "11 Jan 2026",
        "owner": "P. van Wyk",
        "source": "SharePoint › HSE › SOPs › SOP-ME-021.pdf",
        "critical_controls": [
            "Pre-use inspection completed and logged before operation.",
            "Proximity-detection / spotter for pedestrian interaction.",
            "Seatbelt worn; cab doors closed.",
            "Defined haul-road speed limits observed.",
        ],
        "body": (
            "Mobile Equipment Operation covers shovels, dump trucks and loaders. A pre-use inspection "
            "must be completed and logged before each shift. Pedestrian-vehicle interaction is "
            "controlled through proximity detection and spotters. Operators wear seatbelts and observe "
            "haul-road speed limits and right-of-way rules."
        ),
        "history": [
            {"version": "v1.7", "date": "08 Oct 2025", "note": "Proximity-detection requirement added."},
            {"version": "v1.8", "date": "11 Jan 2026", "note": "Pre-use checklist digitised."},
        ],
    },
    {
        "id": "SOP-INV-002",
        "title": "ICAM Incident Investigation",
        "version": "v2.1",
        "approved": "20 Feb 2026",
        "owner": "Dr A. Mehta",
        "source": "SharePoint › HSE › SOPs › SOP-INV-002.pdf",
        "critical_controls": [
            "Investigate using the ICAM model: absent/failed defences, individual/team actions, "
            "task/environmental conditions, organisational factors.",
            "Corrective actions assigned with owner, due date and priority.",
            "HSE owner sign-off required before an investigation is finalised.",
        ],
        "body": (
            "Incident investigations follow the ICAM (Incident Cause Analysis Method) framework. The "
            "investigation builds a factual timeline, then analyses absent or failed defences, "
            "individual and team actions, task and environmental conditions, and underlying "
            "organisational factors. Causal factors are ranked and corrective actions are assigned with "
            "an owner, due date and priority. No investigation is finalised without HSE owner sign-off."
        ),
        "history": [
            {"version": "v2.0", "date": "14 Dec 2025", "note": "Aligned to Enablon incident schema."},
            {"version": "v2.1", "date": "20 Feb 2026", "note": "Mandatory sign-off gate added."},
        ],
    },
]

SOPS_BY_ID = {s["id"]: s for s in SOPS}


# ------------------------------------------------------------------
# International + South African / African mining H&S standards corpus.
# The agent grounds guidance in BOTH the VZI SOPs above AND these standards,
# so advice is benchmarked against external/regulatory best practice — and is
# framed proactively (leading indicators, critical-control management,
# hierarchy of controls) rather than only reactively.
# ------------------------------------------------------------------
STANDARDS: list[dict] = [
    {
        "id": "MHSA-1996",
        "title": "Mine Health and Safety Act 29 of 1996 (South Africa)",
        "authority": "DMRE — Department of Mineral Resources and Energy",
        "scope": "Statutory duty of care for SA mines",
        "key_points": [
            "Employer must provide and maintain a safe, healthy working environment (s2).",
            "Risk-based approach: identify hazards, assess and record risk, then control (s11).",
            "Mandatory codes of practice, training, and employee right to refuse dangerous work (s23).",
            "Tripartite safety culture: employer, employee reps (s25–s31), and the inspectorate.",
        ],
    },
    {
        "id": "OHSA-1993",
        "title": "Occupational Health and Safety Act 85 of 1993 (South Africa)",
        "authority": "Department of Employment and Labour",
        "scope": "General OHS duties for surface workshops / non-mining areas",
        "key_points": [
            "General duty to ensure health and safety of employees and the public.",
            "Hazardous Chemical Substances and Noise-Induced Hearing Loss regulations.",
        ],
    },
    {
        "id": "ISO-45001",
        "title": "ISO 45001:2018 — Occupational Health & Safety Management Systems",
        "authority": "International Organization for Standardization",
        "scope": "Management-system framework",
        "key_points": [
            "Plan-Do-Check-Act with strong worker participation and consultation.",
            "Proactive risk and opportunity management; emphasis on LEADING indicators.",
            "Hierarchy of controls: eliminate > substitute > engineering > administrative > PPE.",
        ],
    },
    {
        "id": "ICMM-CCM",
        "title": "ICMM Critical Control Management — Good Practice Guide",
        "authority": "International Council on Mining and Metals",
        "scope": "Preventing fatalities via critical controls",
        "key_points": [
            "Focus on Material Unwanted Events (MUEs) — fatality-potential hazards.",
            "Identify CRITICAL controls per MUE; verify they are present and effective in the field.",
            "Monitor control effectiveness as a leading indicator (verification frequency, % effective).",
            "Bowtie analysis links preventive and mitigating controls to top events.",
        ],
    },
    {
        "id": "MHSC-ZERO-HARM",
        "title": "MHSC Culture Transformation Framework / Zero Harm Milestones",
        "authority": "Mine Health and Safety Council (South Africa)",
        "scope": "Industry milestones (dust, noise, falls of ground, transport, energy)",
        "key_points": [
            "National milestones targeting elimination of occupational disease and fatalities.",
            "Leading-practice adoption and a 'Zero Harm' culture (Khumbul'ekhaya — bringing everyone home).",
        ],
    },
    {
        "id": "ILO-C176",
        "title": "ILO Convention 176 — Safety and Health in Mines",
        "authority": "International Labour Organization",
        "scope": "International baseline for mine safety",
        "key_points": [
            "Employers must assess risks and act on the precautionary/preventive principle.",
            "Workers' rights to information, training, and to remove themselves from danger.",
        ],
    },
]

STANDARDS_BY_ID = {s["id"]: s for s in STANDARDS}


def _sop_blocks() -> str:
    blocks = []
    for s in SOPS:
        controls = "\n".join(f"   - {c}" for c in s["critical_controls"])
        blocks.append(
            f"[{s['id']} · {s['title']} · {s['version']} · approved {s['approved']} · "
            f"source: {s['source']}]\n{s['body']}\n  Critical controls:\n{controls}"
        )
    return "\n\n".join(blocks)


def _standards_blocks() -> str:
    blocks = []
    for s in STANDARDS:
        pts = "\n".join(f"   - {p}" for p in s["key_points"])
        blocks.append(f"[{s['id']} · {s['title']} · {s['authority']}]\n  {s['scope']}\n{pts}")
    return "\n\n".join(blocks)


# Document status for the Knowledge Base UI (version-control / change-monitoring
# story). Anything not listed is "Current". Kept here so the corpus stays the
# single source of truth for both the LLM grounding and the KB screen.
_DOC_STATUS = {
    "SOP-WAH-014": "Standard changed",  # revised national fall-protection standard
    "SOP-ME-021": "Review due",
    "MHSA-1996": "Standard changed",
}


def knowledge_docs() -> list[dict]:
    """Unified, UI-ready list of SOPs + standards for the Knowledge Base screen.

    Built from the same corpus the agents are grounded in, so the KB reflects
    the real documents (with version history), not a separate hardcoded list.
    """
    docs: list[dict] = []
    for s in SOPS:
        docs.append({
            "id": s["id"],
            "title": s["title"],
            "type": "SOP",
            "version": s["version"],
            "owner": s["owner"],
            "approved": s["approved"],
            "status": _DOC_STATUS.get(s["id"], "Current"),
            "source": s["source"],
            "body": s["body"],
            "critical_controls": s["critical_controls"],
            "history": s.get("history", []),
        })
    for s in STANDARDS:
        docs.append({
            "id": s["id"],
            "title": s["title"],
            "type": "Standard",
            "version": "current",
            "owner": s["authority"],
            "approved": "Statutory / published",
            "status": _DOC_STATUS.get(s["id"], "Current"),
            "source": s["authority"],
            "body": s["scope"],
            "critical_controls": s["key_points"],
            "history": [],
        })
    return docs


def sop_currency() -> int:
    """Percentage of internal SOPs whose status is 'Current' (a real KPI)."""
    sops = [d for d in knowledge_docs() if d["type"] == "SOP"]
    if not sops:
        return 100
    current = sum(1 for d in sops if d["status"] == "Current")
    return round(100 * current / len(sops))


def corpus_text() -> str:
    """Render VZI SOPs + external standards as context for the system prompt."""
    return (
        "=== VZI INTERNAL SOPs (Black Mountain) ===\n"
        f"{_sop_blocks()}\n\n"
        "=== APPLICABLE EXTERNAL STANDARDS (international + South African) ===\n"
        f"{_standards_blocks()}"
    )
