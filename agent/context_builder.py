from __future__ import annotations

from agent.ingestion.rss import RssItem
from agent.ingestion.search import SearchHit


def build_evidence_bundle(
    rss_items: list[RssItem],
    search_hits: list[SearchHit],
    max_chars: int,
) -> str:
    parts: list[str] = []
    parts.append("=== RSS / FEEDS ===\n")
    for it in rss_items:
        block = it.to_block()
        if sum(len(p) for p in parts) + len(block) > max_chars:
            break
        parts.append(block + "\n")
    if search_hits:
        parts.append("\n=== WEB SEARCH SNIPPETS ===\n")
        for h in search_hits:
            block = h.to_block()
            if sum(len(p) for p in parts) + len(block) > max_chars:
                break
            parts.append(block + "\n")
    text = "".join(parts).strip()
    if len(text) > max_chars:
        text = text[:max_chars] + "\n…[truncated]"
    return text or "(No evidence retrieved; say so in the report.)"
