from __future__ import annotations

import json
from pathlib import Path
from typing import Any

import jsonschema
from jsonschema import Draft202012Validator


def _schema_path() -> Path:
    return Path(__file__).resolve().parent / "schemas" / "reports-bundle.schema.json"


def load_validator() -> Draft202012Validator:
    schema = json.loads(_schema_path().read_text(encoding="utf-8"))
    return Draft202012Validator(schema)


def validate_bundle(data: Any) -> None:
    v = load_validator()
    errors = sorted(v.iter_errors(data), key=lambda e: e.path)
    if errors:
        msg = "; ".join(f"{list(e.path)}: {e.message}" for e in errors[:12])
        raise ValueError(f"Bundle schema validation failed: {msg}")
