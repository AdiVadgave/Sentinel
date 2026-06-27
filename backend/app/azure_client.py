"""Claude (Azure AI Foundry) client wrapper, via the native Anthropic Messages API.

The Foundry deployment exposes Claude through the Anthropic Messages API at
`https://<resource>.services.ai.azure.com/anthropic`, so we use the first-party
`AnthropicFoundry` client — NOT the OpenAI/AzureOpenAI client (which 404s here).

Falls back to scripted responses when Foundry credentials are not configured, so
the demo never hard-fails even with no network / no key.
"""
from __future__ import annotations

import json
from typing import Iterator

from anthropic import AnthropicFoundry

from .config import get_settings

_client: AnthropicFoundry | None = None


def get_client() -> AnthropicFoundry | None:
    global _client
    settings = get_settings()
    if not settings.azure_ready:
        return None
    if _client is None:
        _client = AnthropicFoundry(
            resource=settings.foundry_resource,
            api_key=settings.azure_openai_api_key,
        )
    return _client


def _split_system(messages: list[dict]) -> tuple[str, list[dict]]:
    """Anthropic puts the system prompt in its own param, not the messages list."""
    system_parts: list[str] = []
    convo: list[dict] = []
    for m in messages:
        if m["role"] == "system":
            system_parts.append(m["content"])
        else:
            convo.append({"role": m["role"], "content": m["content"]})
    if not convo:
        convo = [{"role": "user", "content": "(no input)"}]
    return "\n\n".join(system_parts), convo


def chat(messages: list[dict], temperature: float = 0.2, max_tokens: int = 1200) -> str:
    """Single-shot completion. Returns the assistant text."""
    client = get_client()
    settings = get_settings()
    if client is None:
        raise RuntimeError("Azure Foundry / Claude is not configured")
    system, convo = _split_system(messages)
    resp = client.messages.create(
        model=settings.azure_openai_deployment,
        max_tokens=max_tokens,
        system=system or None,
        messages=convo,
    )
    return "".join(b.text for b in resp.content if b.type == "text")


def chat_json(messages: list[dict], max_tokens: int = 1600) -> dict:
    """Completion constrained to a JSON object (prompt instructs STRICT JSON)."""
    content = chat(messages, max_tokens=max_tokens)
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        cleaned = content.strip()
        # strip markdown fences / leading prose if the model wrapped the JSON
        if "```" in cleaned:
            cleaned = cleaned.split("```", 2)[1] if cleaned.count("```") >= 2 else cleaned
            cleaned = cleaned.removeprefix("json").strip()
        start, end = cleaned.find("{"), cleaned.rfind("}")
        if start != -1 and end != -1:
            cleaned = cleaned[start : end + 1]
        return json.loads(cleaned)


def stream_chat(messages: list[dict], max_tokens: int = 1200) -> Iterator[str]:
    """Yields text deltas as they arrive from Claude."""
    client = get_client()
    settings = get_settings()
    if client is None:
        raise RuntimeError("Azure Foundry / Claude is not configured")
    system, convo = _split_system(messages)
    with client.messages.stream(
        model=settings.azure_openai_deployment,
        max_tokens=max_tokens,
        system=system or None,
        messages=convo,
    ) as stream:
        for text in stream.text_stream:
            yield text
