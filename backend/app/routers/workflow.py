"""Work-queue, corrective-action, and analytics endpoints.

Backs the cross-surface work queue (Worker → Console → Approvals → Dashboard)
and the HSE Manager KPIs with persisted state, so the same data is shared across
clients and survives a reload — not just held in each browser's localStorage.
"""
from __future__ import annotations

from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from .. import store
from ..knowledge import sop_currency

router = APIRouter(prefix="/api", tags=["workflow"])


# --------------------------------------------------------------------------- #
# Work queue                                                                  #
# --------------------------------------------------------------------------- #

class WorkItemBody(BaseModel):
    id: str
    type: str
    title: str
    area: str = ""
    reportedBy: str = ""
    status: str = "Submitted"
    agent: str = ""
    ageHrs: int = 0
    severity: str | None = None
    aiDrafted: bool | None = None
    description: str | None = None


class TransitionBody(BaseModel):
    status: str


class ActionBody(BaseModel):
    id: str
    action: str
    owner: str = ""
    due: str = ""
    priority: str = "Medium"
    status: str = "Submitted"


@router.get("/work")
def get_work() -> list[dict]:
    return store.list_work()


@router.post("/work")
def post_work(body: WorkItemBody) -> dict:
    return store.add_work({k: v for k, v in body.model_dump().items() if v is not None})


@router.patch("/work/{work_id}")
def patch_work(work_id: str, body: TransitionBody) -> dict:
    updated = store.transition_work(work_id, body.status)
    if updated is None:
        raise HTTPException(status_code=404, detail=f"Unknown work item '{work_id}'")
    return updated


@router.get("/actions")
def get_actions() -> list[dict]:
    return store.list_actions()


@router.post("/actions")
def post_action(body: ActionBody) -> dict:
    return store.add_action(body.model_dump())


# --------------------------------------------------------------------------- #
# Analytics — KPIs computed from the persisted work queue / actions / audit   #
# --------------------------------------------------------------------------- #

# Series that can't be derived from current PoC data (12-month history, per-agent
# activity, hazard heat-map) stay as curated constants — but the headline KPI
# *values* below are computed live from stored data.
_INCIDENT_TREND = [
    {"month": "Jul", "incidents": 19, "nearMiss": 120}, {"month": "Aug", "incidents": 17, "nearMiss": 132},
    {"month": "Sep", "incidents": 21, "nearMiss": 128}, {"month": "Oct", "incidents": 16, "nearMiss": 140},
    {"month": "Nov", "incidents": 15, "nearMiss": 151}, {"month": "Dec", "incidents": 18, "nearMiss": 145},
    {"month": "Jan", "incidents": 14, "nearMiss": 160}, {"month": "Feb", "incidents": 16, "nearMiss": 158},
    {"month": "Mar", "incidents": 13, "nearMiss": 171}, {"month": "Apr", "incidents": 15, "nearMiss": 169},
    {"month": "May", "incidents": 12, "nearMiss": 180}, {"month": "Jun", "incidents": 12, "nearMiss": 188},
]
_AGENT_ACTIVITY = [
    {"month": "Mar", "knowledge": 180, "investigation": 22, "intelligence": 14, "handover": 30},
    {"month": "Apr", "knowledge": 210, "investigation": 26, "intelligence": 18, "handover": 33},
    {"month": "May", "knowledge": 240, "investigation": 24, "intelligence": 21, "handover": 35},
    {"month": "Jun", "knowledge": 268, "investigation": 28, "intelligence": 27, "handover": 38},
]


def _is_overdue(due: str) -> bool:
    """True if a due date string like '11 Jul 2026' is in the past."""
    try:
        d = datetime.strptime(due.strip(), "%d %b %Y").replace(tzinfo=timezone.utc)
    except ValueError:
        return False  # unparseable (e.g. 'within 72h') → not counted
    return d < datetime.now(timezone.utc)


@router.get("/analytics/kpis")
def analytics_kpis() -> dict:
    work = store.list_work()
    actions = store.list_actions()
    audit = store.list_audit(1000)

    incidents = sum(1 for w in work if w["type"] == "Incident")
    near_misses = sum(1 for w in work if w["type"] == "Near-Miss")
    overdue = sum(1 for a in actions if a.get("status") != "Closed" and _is_overdue(a.get("due", "")))
    pow_queries = sum(1 for e in audit if "asked" in e.get("action", "").lower())

    if incidents:
        ratio = f"{round(near_misses / incidents, 1)} : 1"
    else:
        ratio = f"{near_misses} : 0"

    # delta = month-over-month change (not derivable from PoC data) — indicative.
    return {
        "incidentsMTD": {"value": incidents, "delta": -18},
        "nearMissRatio": {"value": ratio, "delta": 6},
        "overdueActions": {"value": overdue, "delta": 2},
        "sopCurrency": {"value": sop_currency(), "delta": 3},
        "powQueriesToday": {"value": pow_queries, "delta": 12},
        "incidentTrend": _INCIDENT_TREND,
        "byCategory": [
            {"category": "Dropped object", "count": 14},
            {"category": "Slip / trip", "count": 9},
            {"category": "Energy isolation", "count": 6},
            {"category": "Mobile equipment", "count": 8},
            {"category": "Dust exposure", "count": 5},
        ],
        "agentActivity": _AGENT_ACTIVITY,
        "computed": True,
    }
