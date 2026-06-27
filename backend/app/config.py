"""Application configuration loaded from environment / .env file.

The Sentinel agents run on a **Claude** model deployed in **Azure AI Foundry**,
reached through the native Anthropic Messages API (the AnthropicFoundry client).
The env var names keep the AZURE_OPENAI_* prefix for backwards compatibility with
existing .env files, but they describe a Foundry/Anthropic deployment.
"""
from functools import lru_cache
from urllib.parse import urlparse

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # Azure AI Foundry endpoint, e.g. https://my-res.services.ai.azure.com/anthropic
    azure_openai_endpoint: str = ""
    # Foundry resource name (e.g. "my-res"). If blank, derived from the endpoint host.
    azure_foundry_resource: str = ""
    # API key from Azure AI Foundry.
    azure_openai_api_key: str = ""
    # The model / deployment name in Foundry (e.g. "claude-sonnet-4-6").
    azure_openai_deployment: str = "claude-sonnet-4-6"
    # Kept for compatibility; not used by the Anthropic client.
    azure_openai_api_version: str = "2024-08-01-preview"

    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"
    use_azure: bool = True

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def foundry_resource(self) -> str:
        """Resource name the AnthropicFoundry client needs.

        Explicit AZURE_FOUNDRY_RESOURCE wins; otherwise parse it from the endpoint
        host: https://<resource>.services.ai.azure.com/anthropic -> <resource>.
        """
        if self.azure_foundry_resource:
            return self.azure_foundry_resource
        if not self.azure_openai_endpoint:
            return ""
        host = urlparse(self.azure_openai_endpoint).hostname or ""
        # strip the well-known Foundry suffix to leave the resource name
        for suffix in (".services.ai.azure.com", ".openai.azure.com", ".cognitiveservices.azure.com"):
            if host.endswith(suffix):
                return host[: -len(suffix)]
        return host.split(".")[0] if host else ""

    @property
    def azure_ready(self) -> bool:
        """True when we have enough config to actually call Foundry."""
        return bool(self.use_azure and self.foundry_resource and self.azure_openai_api_key)


@lru_cache
def get_settings() -> Settings:
    return Settings()
