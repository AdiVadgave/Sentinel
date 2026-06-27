"""Scripted responses used when Azure OpenAI is not configured (offline demo mode).

These mirror what GPT-4o returns so the UI behaves identically with or without a key.
"""
from __future__ import annotations

import re

from .knowledge import SOPS_BY_ID


def classify(text: str) -> dict:
    t = text.lower()
    if re.search(r"weather|sport|football|joke|news|stock", t):
        return {"intent": "out-of-domain request", "confidence": 96,
                "route": "out-of-domain", "rationale": "Not related to VZI safety guidance."}
    if re.search(r"incident|near.?miss|report|dropped|injur", t):
        return {"intent": "incident reporting", "confidence": 92,
                "route": "incident-investigation", "rationale": "Worker is reporting an event."}
    if re.search(r"handover|hand over|shift", t):
        return {"intent": "shift handover", "confidence": 90,
                "route": "shift-handover", "rationale": "Shift documentation request."}
    if re.search(r"trend|pattern|recurr|analytics|how many", t):
        return {"intent": "incident intelligence", "confidence": 88,
                "route": "incident-intelligence", "rationale": "Cross-incident analysis."}
    return {"intent": "point-of-work guidance", "confidence": 98,
            "route": "knowledge-risk", "rationale": "Worker needs SOP / critical-control guidance."}


def _pick_sop(text: str) -> str:
    t = text.lower()
    if re.search(r"height|conveyor|gantr|fall", t):
        return "SOP-WAH-014"
    if re.search(r"loto|lockout|isolat|energy", t):
        return "SOP-LOTO-007"
    if re.search(r"confined|tank|silo|sump", t):
        return "SOP-CS-009"
    if re.search(r"drop|object|barricad", t):
        return "SOP-DOP-005"
    if re.search(r"shovel|truck|mobile|vehicle", t):
        return "SOP-ME-021"
    return "SOP-WAH-014"


def knowledge_answer(text: str) -> dict:
    sop = SOPS_BY_ID[_pick_sop(text)]
    return {
        "summary": (
            f"Yes — provided the {sop['title']} critical controls are verified first. {sop['body'][:200]}… "
            f"Apply the hierarchy of controls and confirm the controls are effective before you start."
        ),
        "critical_controls": sop["critical_controls"],
        "before_you_start": [
            "Confirm a valid permit is issued and signed.",
            "Inspect your PPE and that all tags are current.",
            "Verify barricading / exclusion zones are established.",
        ],
        "standards": [
            "MHSA 1996 s11 — risk assessment & control",
            "ISO 45001 — hierarchy of controls",
            "ICMM Critical Control Management — verify critical controls",
        ],
        "source": {"id": sop["id"], "title": sop["title"],
                   "version": sop["version"], "approved": sop["approved"]},
        "guardrail": ("Grounded in VZI SOPs and SA/international mining standards. Verified by HSE. "
                      "Human sign-off required for any deviation."),
    }


def knowledge_answer_text(text: str) -> str:
    """Plain-text rendering used for the fake streaming fallback."""
    a = knowledge_answer(text)
    controls = "\n".join(f"• {c}" for c in a["critical_controls"])
    standards = ", ".join(a["standards"])
    return (
        f"{a['summary']}\n\nCRITICAL CONTROLS\n{controls}\n\n"
        f"Standards: {standards}\n\n"
        f"Source: {a['source']['id']} · {a['source']['title']} · "
        f"{a['source']['version']} · approved {a['source']['approved']}\n\n{a['guardrail']}"
    )


OUT_OF_DOMAIN = ("I can only help with VZI safety guidance — SOPs, critical controls, permits, "
                 "incidents and shift documentation. Please ask your HSE officer for anything else.")


def classify_report(text: str, area: str = "") -> dict:
    t = (text + " " + area).lower()
    if re.search(r"drop|object|fell|spanner|tool", t):
        cat, ctrl = "Dropped object", "Re-establish barricading after maintenance and tether tools at height (SOP-DOP-005)."
    elif re.search(r"confined|sump|tank|silo", t):
        cat, ctrl = "Confined space", "Confined-space permit + continuous atmosphere monitoring + standby attendant (SOP-CS-009)."
    elif re.search(r"isolat|energy|loto|lockout", t):
        cat, ctrl = "Energy isolation", "Apply personal lock/tag and verify zero-energy state before work (SOP-LOTO-007)."
    elif re.search(r"truck|shovel|vehicle|mobile|proximity", t):
        cat, ctrl = "Mobile equipment", "Proximity detection / spotter for pedestrian interaction (SOP-ME-021)."
    elif re.search(r"slip|trip|fall|ground", t):
        cat, ctrl = "Slip/Trip", "Housekeeping and ground-condition inspection before access."
    elif re.search(r"dust|exposure", t):
        cat, ctrl = "Dust exposure", "Dust suppression and respiratory protection per occupational hygiene controls."
    else:
        cat, ctrl = "Other", "Raise to HSE officer for hazard assessment per MHSA 1996 s11."
    return {"category": cat, "control": ctrl, "severity": "High", "similar": 3}


def suggest_controls(task: str = "", hazards: str = "") -> dict:
    return {
        "controls": (
            "Confirm a valid permit is issued and signed; inspect PPE and that all tags are current; "
            "verify barricading and exclusion zones are established and re-established after any break; "
            "tether all tools at height. Apply the hierarchy of controls and confirm each critical "
            "control is effective before starting."
        ),
        "standards": ["SOP-WAH-014 v3.2", "MHSA 1996 s11", "ICMM Critical Control Management"],
    }


def report_doc(report_id: str = "monthly") -> dict:
    if report_id == "incident":
        return {
            "title": "Incident Pack", "period": "June 2026",
            "summary": ("Three investigations closed this period, all ICAM-aligned and HSE-signed-off. "
                        "The dominant theme remains dropped objects at the Gamsberg crusher."),
            "sections": [
                {"heading": "Open investigations", "body": "INC-2026-0204 (hand laceration) under review; NM-2026-0337 (dropped spanner) approved and pushed to Incident Intelligence."},
                {"heading": "Causal themes", "body": "Barricading not re-established after maintenance is the leading causal factor (ICAM organisational factor). Tools not tethered at height is a recurring individual/team action."},
                {"heading": "Corrective actions", "body": "CA-0912 (re-barricading verification in permit close-out) and CA-0913 (tethered-tool kits) are the priority preventive controls, per SOP-DOP-005 and ICMM Critical Control Management."},
            ],
        }
    if report_id == "compliance":
        return {
            "title": "Compliance Status", "period": "June 2026",
            "summary": ("SOP currency at 92%. A revised national fall-protection standard has flagged 3 SOPs for review. "
                        "No statutory non-conformances outstanding under MHSA 1996."),
            "sections": [
                {"heading": "SOP currency", "body": "92% of SOPs current. SOP-ME-021 is review-due; SOP-WAH-014 flagged against the updated fall-protection standard."},
                {"heading": "Standard alignment", "body": "Controls benchmarked against MHSA 1996, OHSA, ISO 45001 hierarchy of controls, and ICMM Critical Control Management."},
                {"heading": "Actions", "body": "Schedule the 3 flagged SOP reviews; confirm critical-control verification frequency as a leading indicator."},
            ],
        }
    return {
        "title": "Monthly HSE Summary", "period": "June 2026",
        "summary": ("Incidents down 18% MTD with a healthy 8.4:1 near-miss ratio. A recurring dropped-object pattern at "
                    "the Gamsberg crusher was detected and addressed with systemic re-barricading controls."),
        "sections": [
            {"heading": "Performance", "body": "12 incidents MTD (down 18%), near-miss ratio 8.4:1, 5 overdue corrective actions, SOP currency 92%, 37 point-of-work queries handled today."},
            {"heading": "Recurring patterns", "body": "Incident Intelligence flagged 4 dropped-object near-misses at the Gamsberg crusher in 90 days; common factor was barricading not re-established after maintenance."},
            {"heading": "Predictive", "body": "EX-204 hydraulic shovel flagged for inspection within 72h from a rising pre-use-checklist anomaly trend (indicative model)."},
            {"heading": "Standards", "body": "All guidance benchmarked against MHSA 1996, ISO 45001, and ICMM Critical Control Management, with a proactive, preventive emphasis."},
        ],
    }


def handover_summary(context: str = "") -> dict:
    return {
        "summary": (
            "Day shift completed conveyor inspection at Swartberg gantry (WAH-P-0418) with no exceptions. "
            "Crusher feed conveyor returned to service after a belt-scraper change; barricading was "
            "re-established and verified. EX-204 hydraulic shovel is flagged for inspection within 72h "
            "due to a rising hydraulic-leak note frequency. Two corrective actions carry over: the "
            "re-barricading check (CA-0912) and tethered-tool kits (CA-0913). No outstanding permits at "
            "risk; environmental readings within limits."
        )
    }


def icam_draft(incident: dict) -> dict:
    area = incident.get("area", "Gamsberg Concentrator")
    return {
        "timeline": [
            "Maintenance crew completed a belt-scraper change on the crusher feed conveyor.",
            "Barricading around the elevated walkway was removed for access and not re-established.",
            "A spanner left on the walkway grating was dislodged and fell ~6 m.",
            "Object landed within 1 m of a pedestrian; reported as a near-miss.",
        ],
        "absent_failed_defences": [
            "Barricading / exclusion zone not re-established after maintenance (SOP-DOP-005 critical control).",
            "Tool tethering not applied during the task.",
            "No post-task housekeeping inspection of the elevated platform.",
        ],
        "individual_team_actions": [
            "Crew prioritised production restart over re-barricading.",
            "Spanner was placed on grating rather than secured in a tool pouch.",
        ],
        "task_environmental_conditions": [
            "Elevated walkway above an active pedestrian route.",
            "Time pressure to return the conveyor to service.",
        ],
        "organisational_factors": [
            "Re-barricading step not enforced in the permit close-out checklist.",
            "Recurring pattern at this location not yet escalated to a systemic control.",
        ],
        "causal_factors": [
            {"factor": "Barricading not re-established after maintenance", "rank": 1},
            {"factor": "Tools not tethered at height", "rank": 2},
            {"factor": "Production pressure overriding housekeeping", "rank": 3},
        ],
        "corrective_actions": [
            {"action": "Add mandatory re-barricading verification to permit close-out.",
             "owner": "L. Mokoena", "due": "11 Jul 2026", "priority": "High"},
            {"action": "Issue tethered-tool kits to all crusher maintenance crews.",
             "owner": "S. Khumalo", "due": "18 Jul 2026", "priority": "High"},
            {"action": "Toolbox talk on dropped-object prevention at " + area + ".",
             "owner": "P. van Wyk", "due": "04 Jul 2026", "priority": "Medium"},
        ],
        "alignment": "Aligned to ICAM SOP-INV-002 v2.1",
    }
