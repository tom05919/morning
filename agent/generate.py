from __future__ import annotations

from datetime import datetime
from zoneinfo import ZoneInfo

from agent.claude_client import generate_bundle_json
from agent.config import AgentConfig
from agent.context_builder import build_evidence_bundle
from agent.ingestion.rss import fetch_all_feeds
from agent.ingestion.search import brave_search_snippets
from agent.validate import validate_bundle


def _edition_strings(tz: str) -> tuple[str, str, str]:
    now = datetime.now(ZoneInfo(tz))
    y, m, d = now.year, now.month, now.day
    dt = datetime(y, m, d, tzinfo=ZoneInfo(tz))
    edition_id = dt.strftime("%Y-%m-%d")
    weekday = dt.strftime("%A")
    month_name = dt.strftime("%B")
    day = dt.day
    year = dt.year
    date_long = f"{weekday}, {month_name} {day}, {year}"
    short = dt.strftime("%b ") + str(day)
    return edition_id, date_long, short


def run_generation(cfg: AgentConfig) -> dict:
    edition_id, date_long, short = _edition_strings(cfg.timezone)
    rss = fetch_all_feeds(cfg.feeds)
    search_hits: list = []
    if cfg.search.enabled and cfg.search.queries:
        search_hits = brave_search_snippets(cfg.search.queries)
    evidence = build_evidence_bundle(rss, search_hits, cfg.context_max_chars)

    prompt_path = cfg.resolve_prompt_path()
    if not prompt_path.is_file():
        raise FileNotFoundError(f"Research prompt not found: {prompt_path}")
    research_prompt = prompt_path.read_text(encoding="utf-8")
    if not research_prompt.strip():
        research_prompt = "Summarize the evidence into one Morning report."

    user_block = (
        f"Edition metadata (the report MUST use these exact strings):\n"
        f'- id: "{edition_id}"\n'
        f'- date: "{date_long}"\n'
        f'- shortDate: "{short}"\n\n'
        f"Evidence:\n\n{evidence}"
    )

    bundle = generate_bundle_json(
        model=cfg.model,
        max_output_tokens=cfg.max_output_tokens,
        research_prompt=research_prompt,
        user_block=user_block,
    )

    # Force edition fields to match pipeline clock (avoid model drift).
    reports = bundle.get("reports") or []
    if not reports:
        raise ValueError("Model returned no reports")
    reports[0]["id"] = edition_id
    reports[0]["date"] = date_long
    reports[0]["shortDate"] = short
    bundle["reports"] = reports
    bundle.setdefault("version", 1)
    if not bundle.get("generatedAt"):
        bundle["generatedAt"] = datetime.now(ZoneInfo("UTC")).isoformat(
            timespec="seconds"
        ).replace("+00:00", "Z")
    bundle["user"] = None

    validate_bundle(bundle)
    return bundle
