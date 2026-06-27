"""Admin platform endpoints — agent config, integrations, and the audit trail.

These back the Admin persona's three screens (Settings, Integrations, Audit
Log) with real, persisted state (see ``app.store``) instead of cosmetic
client-only state.
"""
from __future__ import annotations

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from .. import store

router = APIRouter(prefix="/api", tags=["admin"])


# --------------------------------------------------------------------------- #
# Settings: agents + confidence threshold + users                            #
# --------------------------------------------------------------------------- #

class AgentToggle(BaseModel):
    enabled: bool


class ThresholdBody(BaseModel):
    threshold: int


class NewUser(BaseModel):
    name: str
    role: str = "Worker"
    title: str = ""
    area: str = ""


@router.get("/admin/settings")
def get_settings_state() -> dict:
    """Everything the Settings screen needs in one call."""
    return {
        "agents": store.list_agents(),
        "threshold": store.get_threshold(),
        "users": store.list_users(),
    }


@router.patch("/admin/agents/{agent_id}")
def toggle_agent(agent_id: str, body: AgentToggle) -> dict:
    if not store.set_agent_enabled(agent_id, body.enabled):
        raise HTTPException(status_code=404, detail=f"Unknown agent '{agent_id}'")
    return {"id": agent_id, "enabled": body.enabled, "agents": store.list_agents()}


@router.put("/admin/settings/threshold")
def update_threshold(body: ThresholdBody) -> dict:
    return {"threshold": store.set_threshold(body.threshold)}


@router.get("/admin/users")
def get_users() -> list[dict]:
    return store.list_users()


@router.post("/admin/users")
def create_user(body: NewUser) -> dict:
    if not body.name.strip():
        raise HTTPException(status_code=422, detail="Name is required")
    return store.add_user(body.name.strip(), body.role, body.title, body.area)


# --------------------------------------------------------------------------- #
# Integrations                                                                #
# --------------------------------------------------------------------------- #

@router.get("/admin/integrations")
def get_integrations() -> list[dict]:
    return store.list_integrations()


@router.post("/admin/integrations/{integration_id}/sync")
def sync_integration(integration_id: str) -> dict:
    # No live connector in the PoC — record a small, plausible delta and persist it.
    # Deterministic-ish: derived from the id length so it isn't random per call.
    added = 7 + (sum(ord(c) for c in integration_id) % 34)
    result = store.sync_integration(integration_id, added)
    if result is None:
        raise HTTPException(status_code=404, detail=f"Unknown integration '{integration_id}'")
    result["added"] = added
    return result


# --------------------------------------------------------------------------- #
# Audit trail                                                                 #
# --------------------------------------------------------------------------- #

class AuditBody(BaseModel):
    user: str = ""
    agent: str = ""
    action: str = ""
    source: str = "—"
    outcome: str = ""
    popia: str | None = None  # if omitted, classified server-side


@router.get("/audit")
def get_audit(limit: int = 500) -> list[dict]:
    return store.list_audit(limit)


@router.post("/audit")
def post_audit(body: AuditBody) -> dict:
    return store.add_audit(
        user=body.user,
        agent=body.agent,
        action=body.action,
        source=body.source,
        outcome=body.outcome,
        popia=body.popia,
    )
