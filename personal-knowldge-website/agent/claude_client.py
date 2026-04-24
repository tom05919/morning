from __future__ import annotations

import json
import logging
import os
import re
from typing import Any

from anthropic import Anthropic

LOG = logging.getLogger(__name__)


def _effective_model(default: str) -> str:
    """Use ANTHROPIC_MODEL when set and non-empty; otherwise default (e.g. from config.yaml).

    GitHub Actions often sets ANTHROPIC_MODEL from vars.* which expands to an empty string
    when unset — that still populates os.environ, so os.environ.get(..., default) would
    wrongly pass "" to the API.
    """
    override = os.environ.get("ANTHROPIC_MODEL")
    if override is not None and override.strip():
        return override.strip()
    return default


SYSTEM = """You are a careful editorial assistant for a personal research digest called Morning.
Only state facts supported by the evidence provided. If evidence is insufficient, say so clearly in the TL;DR.
Output must be valid JSON only — no markdown, no code fences, no commentary outside the JSON object."""


def _extract_json_object(text: str) -> dict[str, Any]:
    text = text.strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass
    m = re.search(r"\{[\s\S]*\}\s*$", text)
    if m:
        try:
            return json.loads(m.group(0))
        except json.JSONDecodeError:
            pass
    fence = re.search(r"```(?:json)?\s*([\s\S]*?)```", text)
    if fence:
        try:
            return json.loads(fence.group(1).strip())
        except json.JSONDecodeError:
            pass
    raise ValueError("Could not parse JSON from model response")


def generate_bundle_json(
    *,
    model: str,
    max_output_tokens: int,
    research_prompt: str,
    user_block: str,
) -> dict[str, Any]:
    api_key = os.environ.get("ANTHROPIC_API_KEY", "").strip()
    if not api_key:
        hint = ""
        if os.environ.get("GITHUB_ACTIONS", "").lower() == "true":
            hint = (
                " In GitHub Actions, add repository secret ANTHROPIC_API_KEY under "
                "Settings → Secrets and variables → Actions (exact name). "
                "Organization secrets must be allowed for this repository."
            )
        raise RuntimeError("ANTHROPIC_API_KEY is not set." + hint)

    client = Anthropic(api_key=api_key)
    user_content = (
        f"{research_prompt.strip()}\n\n---\n\n"
        "Return a single JSON object with this exact top-level shape:\n"
        '{"version": 1, "generatedAt": "<ISO-8601 Z>", "reports": [ <one report> ], "user": null }\n'
        "- Put exactly one object in `reports` (today's edition).\n"
        "- Set `user` to null (the website supplies defaults).\n"
        "- Each report must include: id, date, shortDate, title, topics, readTime, tldr, sections, sources.\n"
        "- `sections` is an array of {heading, body}; use [] if appropriate.\n"
        "- `sources` is an array of {title, author, year} with integer year.\n\n"
        "---\n\n"
        f"{user_block}"
    )

    msg = client.messages.create(
        model=_effective_model(model),
        max_tokens=max_output_tokens,
        system=SYSTEM,
        messages=[{"role": "user", "content": user_content}],
    )
    text_parts: list[str] = []
    for block in msg.content:
        if block.type == "text":
            text_parts.append(block.text)
    raw = "".join(text_parts)
    LOG.debug("Raw response length: %s", len(raw))
    return _extract_json_object(raw)
