# Morning daily agent

Python pipeline that ingests **RSS feeds** (and optionally **Brave web search**), calls the **Anthropic Messages API** with your instructions in [`prompts/research.md`](prompts/research.md), validates output against [`schemas/reports-bundle.schema.json`](schemas/reports-bundle.schema.json), and writes [`../public/reports.json`](../public/reports.json) for the Vite app to load.

## Setup

```bash
cd personal-knowldge-website   # the Vite + agent project folder (agent/ and public/ live here)
python3 -m venv .venv && source .venv/bin/activate   # optional
# Install with the SAME interpreter you use to run the agent (Miniforge `python` vs system `python3` differ).
python -m pip install -r agent/requirements.txt
cp agent/config.example.yaml agent/config.yaml   # if you do not already have config.yaml
# Edit `.env` in the project root (gitignored) and set ANTHROPIC_API_KEY, or copy from `.env.example`.
# `run_daily.py` loads `.env` automatically via python-dotenv. Shell `export` still works if set.
```

## Run locally

```bash
# Always run (ignores local hour window)
python agent/run_daily.py --config agent/config.yaml

# Validate without writing
python agent/run_daily.py --config agent/config.yaml --dry-run
```

## Scheduled run (GitHub Actions)

Workflow [`.github/workflows/morning-daily.yml`](../../.github/workflows/morning-daily.yml) at the **git root** runs **hourly** on a cron. **Scheduled** runs use `--require-local-hour 8` so real work only happens in the **8:00** hour for `timezone` in `agent/config.yaml`. **Manual** “Run workflow” runs omit that flag so you can test anytime. If this site folder is the **only** git root, copy that YAML into `.github/workflows/` here, remove `defaults.run.working-directory`, and fix paths.

Repository secrets:

| Secret | Required |
|--------|----------|
| `ANTHROPIC_API_KEY` | Yes |
| `BRAVE_API_KEY` | Only if `search.enabled: true` in config |

The workflow commits `public/reports.json` when it changes; enable **Actions read/write** permissions or use a PAT with `contents: write` if your org restricts the default `GITHUB_TOKEN`.

## Field rules

- **`reports`**: newest first. Each run prepends **one** new report and drops older duplicates by `id`.
- **`id`**: `YYYY-MM-DD` for that edition (forced by the runner to match the configured timezone’s calendar date).
- **`user`**: optional; `null` or omitted keeps the SPA’s bundled defaults.

## Customizing research

Edit [`prompts/research.md`](prompts/research.md) (or point `research_prompt_file` in `config.yaml` elsewhere). Keep ingestion honest: the model only sees RSS/search text you collected—no silent browsing.
