from __future__ import annotations

import logging
import os
from dataclasses import dataclass

import httpx

LOG = logging.getLogger(__name__)


@dataclass
class SearchHit:
    query: str
    title: str
    url: str
    description: str

    def to_block(self) -> str:
        return (
            f"[web:{self.query}] {self.title}\n"
            f"URL: {self.url}\n"
            f"Snippet: {self.description[:1200]}\n"
        )


def brave_search_snippets(queries: list[str], count_per_query: int = 5) -> list[SearchHit]:
    key = os.environ.get("BRAVE_API_KEY", "").strip()
    if not key:
        LOG.info("BRAVE_API_KEY not set; skipping web search")
        return []
    hits: list[SearchHit] = []
    headers = {
        "Accept": "application/json",
        "X-Subscription-Token": key,
    }
    with httpx.Client(headers=headers, timeout=30.0) as client:
        for q in queries[:8]:
            try:
                r = client.get(
                    "https://api.search.brave.com/res/v1/web/search",
                    params={"q": q, "count": count_per_query},
                )
                r.raise_for_status()
                data = r.json()
            except Exception as e:
                LOG.warning("Brave search failed for %r: %s", q, e)
                continue
            for web in data.get("web", {}).get("results", []) or []:
                title = (web.get("title") or "").strip()
                url = (web.get("url") or "").strip()
                desc = (web.get("description") or "").strip()
                if title and url:
                    hits.append(SearchHit(query=q, title=title, url=url, description=desc))
    return hits
