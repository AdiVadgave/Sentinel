"""Sentinel PoC — FastAPI backend entrypoint.

Run:  uvicorn app.main:app --reload --port 8000
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import store
from .config import get_settings
from .routers import admin, agents, workflow

settings = get_settings()

# Ensure the Admin JSON store exists (seeded) before serving requests.
store.init_store()

app = FastAPI(
    title="Sentinel — VZI Safety Intelligence (PoC backend)",
    description="FastAPI gateway to Claude on Azure AI Foundry for the Sentinel safety agents, "
                "with a JSON-backed Admin platform (config, integrations, audit trail).",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(agents.router)
app.include_router(admin.router)
app.include_router(workflow.router)


@app.get("/api/health")
def health() -> dict:
    return {
        "status": "ok",
        "service": "sentinel-backend",
        "azure_configured": settings.azure_ready,
        "provider": "Azure AI Foundry · Anthropic Messages API",
        "resource": settings.foundry_resource if settings.azure_ready else None,
        "model": settings.azure_openai_deployment if settings.azure_ready else None,
        "mode": "live (Claude on Foundry)" if settings.azure_ready else "offline (scripted fallback)",
    }
