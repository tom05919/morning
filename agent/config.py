from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

import yaml


@dataclass
class FeedConfig:
    url: str
    label: str


@dataclass
class SearchConfig:
    enabled: bool = False
    queries: list[str] = field(default_factory=list)


@dataclass
class AgentConfig:
    timezone: str
    run_local_hour: int
    model: str
    max_output_tokens: int
    context_max_chars: int
    publish_path: str
    research_prompt_file: str
    feeds: list[FeedConfig]
    search: SearchConfig
    repo_root: Path

    @classmethod
    def load(cls, path: Path, repo_root: Path | None = None) -> AgentConfig:
        raw = yaml.safe_load(path.read_text(encoding="utf-8")) or {}
        root = repo_root or path.resolve().parent.parent
        feeds = [
            FeedConfig(url=str(f["url"]), label=str(f.get("label", f["url"])))
            for f in raw.get("feeds") or []
        ]
        s = raw.get("search") or {}
        search = SearchConfig(
            enabled=bool(s.get("enabled", False)),
            queries=[str(q) for q in s.get("queries") or []],
        )
        return cls(
            timezone=str(raw.get("timezone", "America/Los_Angeles")),
            run_local_hour=int(raw.get("run_local_hour", 8)),
            model=str(raw.get("model", "claude-sonnet-4-6")),
            max_output_tokens=int(raw.get("max_output_tokens", 8192)),
            context_max_chars=int(raw.get("context_max_chars", 72000)),
            publish_path=str(raw.get("publish_path", "public/reports.json")),
            research_prompt_file=str(
                raw.get("research_prompt_file", "agent/prompts/research.md")
            ),
            feeds=feeds,
            search=search,
            repo_root=root,
        )

    def resolve_publish(self) -> Path:
        return (self.repo_root / self.publish_path).resolve()

    def resolve_prompt_path(self) -> Path:
        return (self.repo_root / self.research_prompt_file).resolve()
