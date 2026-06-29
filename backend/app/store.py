"""Lightweight JSON-file persistence for the Sentinel Admin platform.

The agent endpoints are stateless, but the **Admin** surface (agent
configuration, integrations, and the audit trail) is genuinely functional —
backed by this module. State lives in a single JSON file (no database, no
extra dependencies); it is created and seeded on first use (mirroring the
original frontend mock data) and every admin change — toggling an agent,
moving the confidence threshold, syncing an integration, writing an audit
entry — is persisted to disk and shared by every client.
"""
from __future__ import annotations

import json
import threading
from datetime import datetime, timezone
from pathlib import Path

# State file lives alongside the backend package root (backend/admin_store.json).
STORE_PATH = Path(__file__).resolve().parent.parent / "admin_store.json"

_lock = threading.Lock()

DEFAULT_THRESHOLD = 85

# --------------------------------------------------------------------------- #
# Seed data (mirrors the original frontend mock/seed.ts so the demo is stable) #
# --------------------------------------------------------------------------- #

def _seed() -> dict:
    return {
        "agents": [
            {"id": "supervisor", "name": "Supervisor / Orchestrator", "color": "#2563eb", "handledToday": 37, "enabled": True},
            {"id": "knowledge-risk", "name": "Knowledge & Risk", "color": "#0ea5e9", "handledToday": 21, "enabled": True},
            {"id": "incident-investigation", "name": "Incident Investigation", "color": "#f59e0b", "handledToday": 6, "enabled": True},
            {"id": "incident-intelligence", "name": "Incident Intelligence", "color": "#a855f7", "handledToday": 9, "enabled": True},
            {"id": "shift-handover", "name": "Shift Handover & Docs", "color": "#16a34a", "handledToday": 4, "enabled": True},
        ],
        "settings": {"confidence_threshold": DEFAULT_THRESHOLD},
        "users": [
            {"id": "u-thabo", "name": "Arjun Sharma", "role": "Worker", "title": "Rigger · C-Shift", "area": "Swartberg", "initials": "AS"},
            {"id": "u-lerato", "name": "Lakshmi Menon", "role": "HSE Officer", "title": "HSE Officer", "area": "Gamsberg", "initials": "LM"},
            {"id": "u-modau", "name": "Dr Aarti Mehta", "role": "HSE Manager", "title": "Chief HSE & ESG Manager", "area": "", "initials": "AM"},
            {"id": "u-admin", "name": "Sandeep Deshpande", "role": "Admin", "title": "IT / Platform Admin", "area": "", "initials": "SD"},
        ],
        "integrations": [
            {"id": "enablon", "name": "Enablon (Incidents / ICAM)", "connected": True, "lastSync": "2 min ago", "records": 1284},
            {"id": "sharepoint", "name": "SharePoint (SOP repository)", "connected": True, "lastSync": "5 min ago", "records": 412},
            {"id": "plantmaint", "name": "Plant Maintenance System", "connected": True, "lastSync": "11 min ago", "records": 876},
            {"id": "entra", "name": "Microsoft Entra ID (SSO)", "connected": True, "lastSync": "just now", "records": 40},
        ],
        "audit": [
            {"id": "A-1001", "seq": 1001, "ts": "27 Jun 2026 08:14", "user": "Arjun Sharma", "agent": "Knowledge & Risk", "action": "Asked: working at heights @ Swartberg", "source": "SOP-WAH-014 v3.2", "popia": "Internal (C3)", "outcome": "Answered + cited"},
            {"id": "A-1002", "seq": 1002, "ts": "27 Jun 2026 08:31", "user": "Lakshmi Menon", "agent": "Incident Investigation", "action": "ICAM draft generated for NM-2026-0337", "source": "SOP-INV-002 v2.1", "popia": "Internal (C3)", "outcome": "Draft pending sign-off"},
        ],
        "work": [
            {"id": "NM-2026-0337", "type": "Near-Miss", "title": "Dropped spanner near crusher walkway", "area": "Gamsberg Concentrator", "reportedBy": "Arjun Sharma", "status": "Submitted", "agent": "incident-investigation", "ageHrs": 3, "severity": "High", "description": "Spanner fell ~6m from elevated walkway after maintenance; barricading not re-established."},
            {"id": "NM-2026-0331", "type": "Near-Miss", "title": "Tool dropped from conveyor gantry", "area": "Gamsberg Concentrator", "reportedBy": "S. Kapoor", "status": "Closed", "agent": "incident-investigation", "ageHrs": 280, "severity": "Medium"},
            {"id": "INC-2026-0204", "type": "Incident", "title": "Hand laceration during belt change", "area": "Gamsberg Concentrator", "reportedBy": "L. Menon", "status": "Under Review", "agent": "incident-investigation", "ageHrs": 52, "severity": "Medium", "aiDrafted": True},
            {"id": "NM-2026-0318", "type": "Near-Miss", "title": "Mobile equipment proximity — pedestrian", "area": "Swartberg", "reportedBy": "P. Verma", "status": "Approved", "agent": "incident-investigation", "ageHrs": 120, "severity": "High"},
            {"id": "HAZ-2026-0090", "type": "Hazard", "title": "Inadequate lighting at decline portal", "area": "Black Mountain Deeps", "reportedBy": "Arjun Sharma", "status": "Submitted", "agent": "knowledge-risk", "ageHrs": 8, "severity": "Low"},
            {"id": "CA-0912", "type": "Corrective Action", "title": "Add re-barricading check to permit close-out", "area": "Gamsberg Concentrator", "reportedBy": "L. Menon", "status": "Under Review", "agent": "incident-intelligence", "ageHrs": 20, "aiDrafted": True},
        ],
        "actions": [
            {"id": "CA-0912", "action": "Add mandatory re-barricading verification to permit close-out", "owner": "L. Menon", "due": "11 Jul 2026", "priority": "High", "status": "Under Review"},
            {"id": "CA-0913", "action": "Issue tethered-tool kits to crusher maintenance crews", "owner": "S. Kapoor", "due": "18 Jul 2026", "priority": "High", "status": "Submitted"},
            {"id": "CA-0908", "action": "Re-train C-Shift on dropped-object prevention", "owner": "P. Verma", "due": "04 Jul 2026", "priority": "Medium", "status": "Approved"},
            {"id": "CA-0901", "action": "Install proximity-detection on EX-204 haul route", "owner": "S. Deshpande", "due": "29 Jun 2026", "priority": "High", "status": "Closed"},
            {"id": "CA-0915", "action": "Review lighting standard at decline portals", "owner": "L. Menon", "due": "22 Jul 2026", "priority": "Low", "status": "Submitted"},
        ],
        # Latest shift handover — written by the HSE Officer, read by the Worker.
        "handover": {
            "id": "HO-NS-0627",
            "outgoing": "Night Shift Supervisor",
            "incoming": "Day Shift · C-Shift",
            "area": "Black Mountain",
            "summary": ("Night shift completed with no incidents. Crusher feed conveyor returned to "
                        "service after a belt-scraper change; barricading re-established and verified. "
                        "EX-204 hydraulic shovel flagged for inspection within 72h."),
            "flagged": 2,
            "outstandingActions": 5,
            "ts": "29 Jun 2026 06:02",
            "sentBy": "Night Shift Supervisor",
            "acknowledged": False,
            "ackBy": "",
            "ackTs": "",
        },
    }


# --------------------------------------------------------------------------- #
# Load / save                                                                 #
# --------------------------------------------------------------------------- #

def _load() -> dict:
    if STORE_PATH.exists():
        try:
            with STORE_PATH.open("r", encoding="utf-8") as fh:
                data = json.load(fh)
            # Backfill any keys missing from older files.
            seed = _seed()
            for key in seed:
                data.setdefault(key, seed[key])
            return data
        except (json.JSONDecodeError, OSError):
            pass  # corrupt / unreadable → fall back to a fresh seed
    return _seed()


def _save(data: dict) -> None:
    tmp = STORE_PATH.with_suffix(".json.tmp")
    with tmp.open("w", encoding="utf-8") as fh:
        json.dump(data, fh, indent=2, ensure_ascii=False)
    tmp.replace(STORE_PATH)  # atomic on the same filesystem


def init_store() -> None:
    """Ensure the JSON file exists (seeded). Safe to call on every boot."""
    with _lock:
        if not STORE_PATH.exists():
            _save(_seed())


# --------------------------------------------------------------------------- #
# Agents + settings                                                           #
# --------------------------------------------------------------------------- #

def list_agents() -> list[dict]:
    return _load()["agents"]


def set_agent_enabled(agent_id: str, enabled: bool) -> bool:
    with _lock:
        data = _load()
        found = False
        for a in data["agents"]:
            if a["id"] == agent_id:
                a["enabled"] = bool(enabled)
                found = True
        if found:
            _save(data)
    return found


def agent_enabled(agent_id: str) -> bool:
    """True if the agent is enabled (or unknown — fail open so core flows work)."""
    for a in _load()["agents"]:
        if a["id"] == agent_id:
            return bool(a.get("enabled", True))
    return True


def get_threshold() -> int:
    try:
        return int(_load()["settings"].get("confidence_threshold", DEFAULT_THRESHOLD))
    except (TypeError, ValueError):
        return DEFAULT_THRESHOLD


def set_threshold(value: int) -> int:
    value = max(50, min(99, int(value)))
    with _lock:
        data = _load()
        data["settings"]["confidence_threshold"] = value
        _save(data)
    return value


# --------------------------------------------------------------------------- #
# Users                                                                       #
# --------------------------------------------------------------------------- #

def list_users() -> list[dict]:
    return _load()["users"]


def add_user(name: str, role: str, title: str = "", area: str = "") -> dict:
    initials = "".join(p[0] for p in name.split()[:2]).upper() or "?"
    with _lock:
        data = _load()
        existing = {u["id"] for u in data["users"]}
        base = "u-" + "".join(ch for ch in name.lower() if ch.isalnum())[:12] or "u-new"
        uid, n = base, 2
        while uid in existing:
            uid = f"{base}{n}"
            n += 1
        user = {"id": uid, "name": name, "role": role, "title": title, "area": area, "initials": initials}
        data["users"].append(user)
        _save(data)
    return user


# --------------------------------------------------------------------------- #
# Integrations                                                                #
# --------------------------------------------------------------------------- #

def list_integrations() -> list[dict]:
    return _load()["integrations"]


def sync_integration(integration_id: str, added: int) -> dict | None:
    """Record a sync: bump the record count and stamp lastSync = 'just now'.

    The count delta is supplied by the caller (the PoC has no live connector),
    but the result is persisted to disk — so it survives reloads and is the
    same for every client, which makes it functional rather than cosmetic.
    """
    with _lock:
        data = _load()
        target = None
        for it in data["integrations"]:
            if it["id"] == integration_id:
                it["records"] = it["records"] + max(0, int(added))
                it["lastSync"] = "just now"
                target = dict(it)
        if target:
            _save(data)
    return target


# --------------------------------------------------------------------------- #
# Audit trail + POPIA classification                                          #
# --------------------------------------------------------------------------- #

def classify_popia(action: str, source: str = "", outcome: str = "") -> str:
    """Lightweight POPIA (Protection of Personal Information Act) classifier.

    Heuristic, deterministic, server-side — enough to give every audit row a
    defensible data-classification label instead of a hard-coded constant.
    """
    text = f"{action} {source} {outcome}".lower()
    personal = ("injur", "medical", "laceration", "name", "id number", "person",
                "employee", "worker health", "fitness", "disciplin")
    restricted = ("report", "board", "compliance", "incident pack", "investigation",
                  "icam", "sign off", "sign-off", "lesson")
    if any(k in text for k in personal):
        return "Confidential — personal (C4)"
    if any(k in text for k in restricted):
        return "Restricted (C4)"
    return "Internal (C3)"


def _stamp() -> str:
    """Human-readable timestamp matching the frontend's nowStamp() shape."""
    return datetime.now(timezone.utc).strftime("%d %b %Y %H:%M")


def list_audit(limit: int = 500) -> list[dict]:
    rows = sorted(_load()["audit"], key=lambda r: r.get("seq", 0), reverse=True)[:limit]
    # Hide the internal seq from API consumers.
    return [{k: v for k, v in r.items() if k != "seq"} for r in rows]


def add_audit(
    user: str,
    agent: str,
    action: str,
    source: str = "—",
    outcome: str = "",
    popia: str | None = None,
    ts: str | None = None,
) -> dict:
    popia = popia or classify_popia(action, source, outcome)
    ts = ts or _stamp()
    with _lock:
        data = _load()
        seq = max((r.get("seq", 1000) for r in data["audit"]), default=1000) + 1
        entry = {
            "id": f"A-{seq}", "seq": seq, "ts": ts, "user": user, "agent": agent,
            "action": action, "source": source, "popia": popia, "outcome": outcome,
        }
        data["audit"].append(entry)
        _save(data)
    return {k: v for k, v in entry.items() if k != "seq"}


# --------------------------------------------------------------------------- #
# Work queue (incidents, near-misses, pre-tasks, investigations, actions)     #
# --------------------------------------------------------------------------- #

def list_work() -> list[dict]:
    return _load()["work"]


def add_work(item: dict) -> dict:
    with _lock:
        data = _load()
        # De-dupe by id (an optimistic client insert may re-POST the same id).
        if not any(w["id"] == item.get("id") for w in data["work"]):
            data["work"].insert(0, item)
            _save(data)
    return item


def transition_work(work_id: str, status: str) -> dict | None:
    with _lock:
        data = _load()
        target = None
        for w in data["work"]:
            if w["id"] == work_id:
                w["status"] = status
                target = dict(w)
        if target:
            _save(data)
    return target


def list_actions() -> list[dict]:
    return _load()["actions"]


def add_action(item: dict) -> dict:
    with _lock:
        data = _load()
        if not any(a["id"] == item.get("id") for a in data["actions"]):
            data["actions"].insert(0, item)
            _save(data)
    return item


# --------------------------------------------------------------------------- #
# Shift handover (HSE Officer writes → Worker reads)                           #
# --------------------------------------------------------------------------- #

def get_handover() -> dict:
    return _load().get("handover") or {}


def save_handover(payload: dict) -> dict:
    """Persist the handover the HSE Officer sends to the next shift."""
    with _lock:
        data = _load()
        current = data.get("handover") or {}
        handover = {
            "id": payload.get("id") or current.get("id") or "HO-NS-0627",
            "outgoing": payload.get("outgoing", current.get("outgoing", "")),
            "incoming": payload.get("incoming", current.get("incoming", "")),
            "area": payload.get("area", current.get("area", "Black Mountain")),
            "summary": payload.get("summary", ""),
            "flagged": int(payload.get("flagged", current.get("flagged", 0)) or 0),
            "outstandingActions": int(payload.get("outstandingActions", current.get("outstandingActions", 0)) or 0),
            "ts": _stamp(),
            "sentBy": payload.get("sentBy", payload.get("outgoing", "")),
            # A freshly sent handover starts unacknowledged.
            "acknowledged": False,
            "ackBy": "",
            "ackTs": "",
        }
        data["handover"] = handover
        _save(data)
    return handover


def acknowledge_handover(by: str) -> dict:
    with _lock:
        data = _load()
        handover = data.get("handover") or {}
        if handover:
            handover["acknowledged"] = True
            handover["ackBy"] = by
            handover["ackTs"] = _stamp()
            data["handover"] = handover
            _save(data)
    return handover
