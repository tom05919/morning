#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import logging
import sys
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

from dotenv import load_dotenv

# Repo root = parent of `agent/`
_ROOT = Path(__file__).resolve().parent.parent
load_dotenv(_ROOT / ".env")
if str(_ROOT) not in sys.path:
    sys.path.insert(0, str(_ROOT))

from agent.config import AgentConfig  # noqa: E402
from agent.generate import run_generation  # noqa: E402
from agent.publish import atomic_write_json  # noqa: E402
from agent.validate import validate_bundle  # noqa: E402

LOG = logging.getLogger("morning.agent")


def _should_skip_for_hour(tz: str, target_hour: int) -> bool:
    now = datetime.now(ZoneInfo(tz))
    return now.hour != target_hour


def _merge_with_existing(bundle: dict, publish_path: Path) -> dict:
    if not publish_path.exists():
        return _strip_null_user(bundle)
    try:
        old = json.loads(publish_path.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError) as e:
        LOG.warning("Could not read existing bundle, overwriting: %s", e)
        return _strip_null_user(bundle)
    old_reports = list(old.get("reports") or [])
    new_reports = list(bundle.get("reports") or [])
    if not new_reports:
        return _strip_null_user(bundle)
    nid = new_reports[0].get("id")
    merged = new_reports + [r for r in old_reports if r.get("id") != nid]
    u = bundle.get("user")
    if u is None:
        u = old.get("user")
    out = {
        "version": int(old.get("version", 1)) + 1,
        "generatedAt": bundle.get("generatedAt"),
        "reports": merged[:120],
    }
    if u is not None:
        out["user"] = u
    try:
        validate_bundle(out)
    except ValueError as e:
        LOG.warning("Merged bundle failed validation, using fresh run only: %s", e)
        fresh = _strip_null_user(dict(bundle))
        validate_bundle(fresh)
        return fresh
    return out


def _strip_null_user(bundle: dict) -> dict:
    if bundle.get("user") is None and "user" in bundle:
        del bundle["user"]
    return bundle


def main() -> int:
    parser = argparse.ArgumentParser(description="Morning daily research agent")
    parser.add_argument(
        "--config",
        type=Path,
        default=_ROOT / "agent" / "config.yaml",
        help="Path to config YAML",
    )
    parser.add_argument(
        "--require-local-hour",
        type=int,
        default=None,
        metavar="H",
        help="If set, exit 0 without doing work unless local wall-clock hour matches (uses config timezone).",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Generate and validate but do not write publish_path",
    )
    parser.add_argument("-v", "--verbose", action="store_true")
    args = parser.parse_args()
    logging.basicConfig(
        level=logging.DEBUG if args.verbose else logging.INFO,
        format="%(levelname)s %(message)s",
    )

    if not args.config.is_file():
        LOG.error("Config not found: %s (copy agent/config.example.yaml)", args.config)
        return 2

    cfg = AgentConfig.load(args.config, repo_root=_ROOT)

    if args.require_local_hour is not None:
        if _should_skip_for_hour(cfg.timezone, args.require_local_hour):
            LOG.info(
                "Skipping: local hour is not %s in %s",
                args.require_local_hour,
                cfg.timezone,
            )
            return 0

    bundle = _strip_null_user(run_generation(cfg))
    bundle = _merge_with_existing(bundle, cfg.resolve_publish())

    if args.dry_run:
        LOG.info("Dry run OK; %d reports in merged bundle", len(bundle.get("reports", [])))
        return 0

    atomic_write_json(cfg.resolve_publish(), bundle)
    LOG.info("Wrote %s", cfg.resolve_publish())
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
