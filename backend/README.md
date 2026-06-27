# Sentinel — Backend (FastAPI + Azure OpenAI GPT-4o)

FastAPI gateway that powers the Sentinel safety agents. It calls your **Azure AI
Foundry / Azure OpenAI GPT-4o** deployment for intent routing, grounded
knowledge answers (with source + version citations) and ICAM investigation
drafts. If Azure isn't configured it transparently falls back to scripted
responses so the demo never breaks.

## Setup

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env      # then edit .env with your Azure details
```

Fill in `.env`:

| Variable | What to put |
|---|---|
| `AZURE_OPENAI_ENDPOINT` | e.g. `https://my-resource.openai.azure.com` |
| `AZURE_OPENAI_API_KEY` | resource key from Azure AI Foundry |
| `AZURE_OPENAI_DEPLOYMENT` | your GPT-4o **deployment name** (not model name) |
| `AZURE_OPENAI_API_VERSION` | `2024-08-01-preview` (or newer) |

## Run

```powershell
uvicorn app.main:app --reload --port 8000
```

- Health / mode check: http://localhost:8000/api/health
- Interactive API docs: http://localhost:8000/docs

## Endpoints

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/agents/classify` | Supervisor intent classification + routing |
| POST | `/api/agents/ask` | Knowledge & Risk grounded answer (JSON) |
| POST | `/api/agents/ask/stream` | Knowledge & Risk token stream (SSE) |
| POST | `/api/agents/icam` | ICAM investigation draft |
| GET | `/api/agents/sops` | SOP knowledge base |
| GET | `/api/health` | Status + whether Azure is wired |
