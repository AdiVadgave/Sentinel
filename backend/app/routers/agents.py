"""Agent endpoints — Supervisor routing, Knowledge & Risk, ICAM investigation."""
from __future__ import annotations

import json
import time

from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from .. import azure_client, fallback
from ..config import get_settings
from ..knowledge import SOPS, SOPS_BY_ID
from ..prompts import (
    HANDOVER_SUMMARY_SYSTEM,
    ICAM_SYSTEM,
    LESSON_SYSTEM,
    REPORT_CLASSIFY_SYSTEM,
    REPORT_SYSTEM,
    SUGGEST_CONTROLS_SYSTEM,
    SUPERVISOR_CLASSIFY,
    knowledge_system,
)

router = APIRouter(prefix="/api/agents", tags=["agents"])


class AskRequest(BaseModel):
    message: str


class IcamRequest(BaseModel):
    incidentId: str | None = None
    area: str | None = None
    type: str | None = None
    description: str | None = None


class ReportRequest(BaseModel):
    type: str | None = None
    area: str | None = None
    description: str = ""


class SuggestRequest(BaseModel):
    task: str = ""
    hazards: str = ""


class HandoverRequest(BaseModel):
    context: str = ""


class ReportRequestBody(BaseModel):
    reportId: str = "monthly"
    context: str = ""


class LessonRequest(BaseModel):
    area: str = ""
    hazard: str = ""
    count: int = 4
    window: str = "90 days"
    related: list[str] = []


def _json_agent(system: str, user: str, fallback_fn, max_tokens: int = 600) -> dict:
    """Run a structured-JSON agent call with graceful offline fallback."""
    settings = get_settings()
    if settings.azure_ready:
        try:
            out = azure_client.chat_json(
                [{"role": "system", "content": system}, {"role": "user", "content": user}],
                max_tokens=max_tokens,
            )
            out["mode"] = "azure"
            return out
        except Exception as exc:  # noqa: BLE001
            out = fallback_fn()
            out["mode"] = f"fallback ({type(exc).__name__})"
            return out
    out = fallback_fn()
    out["mode"] = "offline"
    return out


@router.post("/classify")
def classify(req: AskRequest) -> dict:
    """Supervisor agent: intent classification + routing (drives the routing strip)."""
    settings = get_settings()
    if settings.azure_ready:
        try:
            result = azure_client.chat_json([
                {"role": "system", "content": SUPERVISOR_CLASSIFY},
                {"role": "user", "content": req.message},
            ], max_tokens=200)
            result.setdefault("route", "knowledge-risk")
            result["mode"] = "azure"
            return result
        except Exception as exc:  # noqa: BLE001 — demo must not hard-fail
            data = fallback.classify(req.message)
            data["mode"] = f"fallback ({type(exc).__name__})"
            return data
    data = fallback.classify(req.message)
    data["mode"] = "offline"
    return data


@router.get("/sops")
def list_sops() -> list[dict]:
    return SOPS


@router.get("/sops/{sop_id}")
def get_sop(sop_id: str) -> dict:
    return SOPS_BY_ID.get(sop_id, {})


@router.post("/ask")
def ask(req: AskRequest) -> dict:
    """Knowledge & Risk agent: grounded structured answer (non-streaming JSON)."""
    settings = get_settings()
    route = fallback.classify(req.message)["route"]
    if route == "out-of-domain":
        return {"refused": True, "message": fallback.OUT_OF_DOMAIN}
    if settings.azure_ready:
        try:
            answer = azure_client.chat_json([
                {"role": "system", "content": knowledge_system()},
                {"role": "user", "content": req.message},
            ])
            answer["mode"] = "azure"
            return answer
        except Exception as exc:  # noqa: BLE001
            answer = fallback.knowledge_answer(req.message)
            answer["mode"] = f"fallback ({type(exc).__name__})"
            return answer
    answer = fallback.knowledge_answer(req.message)
    answer["mode"] = "offline"
    return answer


@router.post("/ask/stream")
def ask_stream(req: AskRequest) -> StreamingResponse:
    """Knowledge & Risk agent: token-by-token SSE stream (the live-LLM feel)."""
    settings = get_settings()
    route = fallback.classify(req.message)["route"]

    def event(payload: dict) -> str:
        return f"data: {json.dumps(payload)}\n\n"

    def generate():
        if route == "out-of-domain":
            for word in fallback.OUT_OF_DOMAIN.split(" "):
                yield event({"type": "token", "text": word + " "})
                time.sleep(0.03)
            yield event({"type": "refused"})
            yield event({"type": "done"})
            return

        if settings.azure_ready:
            try:
                system = (knowledge_system()
                          + "\n\nFor THIS request, respond in plain readable text (not JSON): "
                            "a short summary, then a 'CRITICAL CONTROLS' list, then a 'BEFORE YOU START' "
                            "list, then a 'STANDARDS' line naming the applicable SA/international standards, "
                            "then a 'Source:' line with the SOP id/title/version/approval, then the "
                            "guardrail sentence.")
                for delta in azure_client.stream_chat([
                    {"role": "system", "content": system},
                    {"role": "user", "content": req.message},
                ]):
                    yield event({"type": "token", "text": delta})
                # Attach a structured source chip alongside the streamed text.
                src = fallback.knowledge_answer(req.message)["source"]
                yield event({"type": "source", "source": src})
                yield event({"type": "done", "mode": "azure"})
                return
            except Exception as exc:  # noqa: BLE001
                yield event({"type": "notice", "text": f"(offline fallback: {type(exc).__name__})"})

        # Offline / fallback scripted streaming
        ans = fallback.knowledge_answer(req.message)
        text = fallback.knowledge_answer_text(req.message)
        for tok in _tokenise(text):
            yield event({"type": "token", "text": tok})
            time.sleep(0.02)
        yield event({"type": "source", "source": ans["source"]})
        yield event({"type": "done", "mode": "offline"})

    return StreamingResponse(generate(), media_type="text/event-stream",
                             headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})


@router.post("/icam")
def icam(req: IcamRequest) -> dict:
    """Incident Investigation agent: ICAM draft (human sign-off required downstream)."""
    settings = get_settings()
    incident = req.model_dump()
    if settings.azure_ready:
        try:
            facts = (f"Incident {req.incidentId or 'NM-2026-0337'} | type: {req.type or 'near-miss'} | "
                     f"area: {req.area or 'Gamsberg Concentrator'} | "
                     f"description: {req.description or 'Dropped object near the crusher conveyor walkway.'}")
            draft = azure_client.chat_json([
                {"role": "system", "content": ICAM_SYSTEM},
                {"role": "user", "content": facts},
            ])
            draft["mode"] = "azure"
            return draft
        except Exception as exc:  # noqa: BLE001
            draft = fallback.icam_draft(incident)
            draft["mode"] = f"fallback ({type(exc).__name__})"
            return draft
    draft = fallback.icam_draft(incident)
    draft["mode"] = "offline"
    return draft


@router.post("/classify-report")
def classify_report(req: ReportRequest) -> dict:
    """Intake classifier for a reported near-miss / incident / hazard."""
    user = f"Type: {req.type or 'near-miss'} | Area: {req.area or 'unknown'} | Description: {req.description}"
    return _json_agent(REPORT_CLASSIFY_SYSTEM, user, lambda: fallback.classify_report(req.description, req.area or ""))


@router.post("/suggest-controls")
def suggest_controls(req: SuggestRequest) -> dict:
    """AI-suggested pre-task controls confirmation."""
    user = f"Task: {req.task or 'work at height'} | Hazards: {req.hazards or 'working at heights, dropped objects'}"
    return _json_agent(SUGGEST_CONTROLS_SYSTEM, user, lambda: fallback.suggest_controls(req.task, req.hazards))


@router.post("/report")
def report(req: ReportRequestBody) -> dict:
    """Generate a board-ready HSE report (monthly | incident | compliance)."""
    names = {"monthly": "Monthly HSE Summary", "incident": "Incident Pack", "compliance": "Compliance Status"}
    rid = req.reportId if req.reportId in names else "monthly"
    user = (
        f"Report type: {names[rid]}.\n"
        "Operational data: Incidents MTD 12 (down 18%); near-miss ratio 8.4:1; 5 overdue corrective "
        "actions; SOP currency 92%; 37 point-of-work queries today. Recurring pattern: 4 dropped-object "
        "near-misses at the Gamsberg crusher in 90 days (cause: barricading not re-established after "
        "maintenance). Predictive: EX-204 hydraulic shovel flagged for inspection within 72h. "
        "A revised national fall-protection standard flagged 3 SOPs for review. "
        f"{req.context}"
    )
    return _json_agent(REPORT_SYSTEM, user, lambda: fallback.report_doc(rid), max_tokens=2500)


@router.post("/lesson")
def lesson(req: LessonRequest) -> dict:
    """Incident Intelligence: analyse a recurring pattern and draft a lesson-learned."""
    user = (
        f"Recurring pattern: {req.count} {req.hazard or 'dropped-object'} events at "
        f"{req.area or 'Gamsberg Concentrator'} over {req.window}. "
        f"Related event IDs: {', '.join(req.related) or 'NM-2026-0337, NM-2026-0331, NM-2026-0318, INC-2026-0204'}."
    )
    return _json_agent(
        LESSON_SYSTEM, user,
        lambda: fallback.lesson_learned(req.area, req.hazard, req.count),
        max_tokens=700,
    )


@router.post("/handover-summary")
def handover_summary(req: HandoverRequest) -> dict:
    """AI-drafted shift handover summary."""
    ctx = req.context or (
        "Open work orders: 4. Active permits: 3. Equipment flagged: 2 (EX-204 hydraulic leak trend). "
        "Outstanding actions: 5 (incl. CA-0912 re-barricading, CA-0913 tethered tools). "
        "Crusher conveyor returned to service after belt-scraper change; barricading reinstated."
    )
    return _json_agent(HANDOVER_SUMMARY_SYSTEM, ctx, lambda: fallback.handover_summary(ctx), max_tokens=500)


def _tokenise(text: str):
    """Split into word-ish chunks for a natural streaming cadence."""
    out, buf = [], ""
    for ch in text:
        buf += ch
        if ch in " \n":
            out.append(buf)
            buf = ""
    if buf:
        out.append(buf)
    return out
