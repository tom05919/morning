from __future__ import annotations

import logging
from dataclasses import dataclass
from typing import Any

import feedparser
import httpx

from agent.config import FeedConfig

LOG = logging.getLogger(__name__)


@dataclass
class RssItem:
    title: str
    link: str
    published: str | None
    summary: str
    feed_label: str

    def to_block(self) -> str:
        lines = [
            f"[{self.feed_label}] {self.title}",
            f"URL: {self.link}",
        ]
        if self.published:
            lines.append(f"Published: {self.published}")
        if self.summary:
            lines.append(f"Summary: {self.summary[:2000]}")
        return "\n".join(lines) + "\n"


def _parse_entry(entry: Any, feed_label: str) -> RssItem | None:
    def get(key: str, default: str = "") -> str:
        if hasattr(entry, "get"):
            v = entry.get(key, default)
        else:
            v = getattr(entry, key, default)
        return str(v or "").strip()

    title = get("title")
    link = get("link") or get("id")
    if not title or not link:
        return None
    published = get("published") or get("updated") or None
    if not published:
        published = None
    summary = get("summary") or get("description")
    # strip basic HTML noise
    summary = summary.replace("<", " <")
    return RssItem(
        title=title,
        link=link,
        published=published,
        summary=summary[:4000],
        feed_label=feed_label,
    )


def fetch_feed(client: httpx.Client, feed: FeedConfig, timeout: float = 30.0) -> list[RssItem]:
    try:
        r = client.get(feed.url, timeout=timeout, follow_redirects=True)
        r.raise_for_status()
    except Exception as e:
        LOG.warning("RSS fetch failed %s: %s", feed.url, e)
        return []
    parsed = feedparser.parse(r.content)
    out: list[RssItem] = []
    for entry in parsed.entries[:40]:
        item = _parse_entry(entry, feed.label)
        if item:
            out.append(item)
    return out


def fetch_all_feeds(feeds: list[FeedConfig]) -> list[RssItem]:
    items: list[RssItem] = []
    with httpx.Client(headers={"User-Agent": "MorningAgent/1.0 (+https://example.local)"}) as client:
        for feed in feeds:
            items.extend(fetch_feed(client, feed))
    # Dedupe by link
    seen: set[str] = set()
    unique: list[RssItem] = []
    for it in items:
        if it.link in seen:
            continue
        seen.add(it.link)
        unique.append(it)
    return unique
