# Morning

Morning is a personal research digest that turns a stream of technical sources into a daily, magazine-like briefing. The repository contains two connected pieces:

- A Vite + React single-page app that reads `public/reports.json` and presents the latest report, archive search, bookmarks, reading stats, and appearance settings.
- A Python agent that collects evidence from configured RSS feeds and optional Brave web search, asks Anthropic to write one structured daily report, validates the result against a JSON Schema, and publishes it back to `public/reports.json`.

The current default focus is robotics and AI research, especially arXiv feeds such as `cs.RO`, `cs.AI`, and `cs.LG`, but the feed list and prompt are configurable.

## What This Repository Is For

Most blog software starts with posts that a person has already written. Morning starts earlier in the workflow: it helps produce the report, validate its structure, keep an archive, and render the archive as a focused reader.

The site is built around one generated data bundle:

```text
public/reports.json
```

The frontend does not need a database or CMS. It fetches that JSON bundle at runtime, treats `reports[0]` as today's edition, and renders the rest as the archive. The agent is the publishing pipeline that keeps the bundle fresh.

## Features

- Daily report reader with TL;DR, sections, topics, read time, and sources.
- Archive grouped by month with search across titles, topics, and summaries.
- Local bookmarks stored in browser state for the current session.
- Reading stats derived from the reports bundle and optional user metadata.
- Light/dark theme toggle.
- Reader customization for accent palette, density, and home layout, saved in `localStorage`.
- Optional custom reports URL via `VITE_REPORTS_URL`.
- Python generation pipeline with RSS ingestion, optional Brave search snippets, Anthropic generation, schema validation, and atomic JSON publishing.
- GitHub Actions workflow that can regenerate `public/reports.json` and commit changes.

## Repository Layout

```text
personal-knowldge-website/
  src/                     React app source
    components/            Reader, archive, stats, sidebar, settings, etc.
    ReportsContext.jsx     Fetches and exposes the reports bundle
    data.js                UI defaults when reports.json omits user metadata
  public/
    reports.json           Generated report bundle consumed by the app
  agent/                   Python report-generation pipeline
    run_daily.py           Main CLI entrypoint
    config.example.yaml    Example agent configuration
    config.yaml            Local/current agent configuration
    prompts/research.md    Editorial instructions sent to the model
    schemas/               JSON Schema for reports.json
    ingestion/             RSS and Brave search ingestion
  .env.example             Environment variable template
  package.json             Frontend scripts and dependencies
```

Note: the project directory is currently named `personal-knowldge-website`.

## Requirements

- Node.js 18 or newer.
- npm.
- Python 3.11 or newer. Python 3.12 is used by the included GitHub Actions workflow.
- An Anthropic API key if you want to generate new reports with the agent.
- A Brave Search API key only if you enable `search.enabled: true`.

## Run the Website Locally

From the repository root:

```bash
cd personal-knowldge-website
npm install
npm run dev
```

Vite will print a local URL, usually:

```text
http://localhost:5173
```

The app will load the checked-in `public/reports.json`. That means you can try the reader immediately without running the Python agent.

To create a production build:

```bash
npm run build
npm run preview
```

## Generate a New Report Locally

Install the Python agent dependencies:

```bash
cd personal-knowldge-website
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r agent/requirements.txt
```

Create your local environment file:

```bash
cp .env.example .env
```

Edit `.env` and set:

```bash
ANTHROPIC_API_KEY=sk-ant-api03-...
```

Optional settings:

```bash
ANTHROPIC_MODEL=claude-sonnet-4-6
BRAVE_API_KEY=... # only needed if Brave search is enabled
VITE_REPORTS_URL=https://your-cdn.example.com/reports.json
```

If you do not already have an agent config:

```bash
cp agent/config.example.yaml agent/config.yaml
```

Then run:

```bash
python agent/run_daily.py --config agent/config.yaml
```

The agent will:

1. Load RSS feeds from `agent/config.yaml`.
2. Optionally collect Brave web search snippets.
3. Build a bounded evidence bundle.
4. Send the evidence plus `agent/prompts/research.md` to Anthropic.
5. Force the report date fields to match the configured timezone.
6. Validate the response against `agent/schemas/reports-bundle.schema.json`.
7. Merge the new edition with the existing archive.
8. Write `public/reports.json`.

To test generation and validation without writing the bundle:

```bash
python agent/run_daily.py --config agent/config.yaml --dry-run
```

For more logging:

```bash
python agent/run_daily.py --config agent/config.yaml --verbose
```

## Configure the Agent

The main configuration file is:

```text
agent/config.yaml
```

Important fields:

- `timezone`: controls the report edition date, for example `America/New_York`.
- `model`: default Anthropic model unless `ANTHROPIC_MODEL` is set.
- `max_output_tokens`: response budget for report generation.
- `context_max_chars`: maximum evidence characters sent to the model.
- `publish_path`: where the generated bundle is written; defaults to `public/reports.json`.
- `research_prompt_file`: editorial prompt path.
- `feeds`: RSS sources to ingest.
- `search.enabled`: enables Brave search snippets when `BRAVE_API_KEY` is available.
- `search.queries`: fixed search queries used when search is enabled.

The generation prompt lives at:

```text
agent/prompts/research.md
```

Edit that file to change the editorial style, subject focus, level of detail, source standards, or recurring sections.

## Reports Data Format

The frontend expects a top-level JSON object like:

```json
{
  "version": 1,
  "generatedAt": "2026-04-25T07:00:00Z",
  "reports": [
    {
      "id": "2026-04-24",
      "date": "Friday, April 24, 2026",
      "shortDate": "Apr 24",
      "title": "Robots That Learn, Adapt, and Explain Themselves",
      "topics": ["Robotics", "Embodied AI"],
      "readTime": 14,
      "tldr": "Short summary...",
      "sections": [
        {
          "heading": "Section title",
          "body": "Section body..."
        }
      ],
      "sources": [
        {
          "title": "Source title",
          "author": "arXiv cs.RO",
          "year": 2026
        }
      ]
    }
  ]
}
```

`reports` should be newest first. `id` should be the edition date in `YYYY-MM-DD` format. Optional `user` metadata can be included, but if it is omitted the React app uses defaults from `src/data.js`.

## Deploying

The frontend is a static Vite app, so it can be deployed to services such as Vercel, Netlify, GitHub Pages, Cloudflare Pages, or any static host that serves `dist/`.

Typical deployment build command:

```bash
npm run build
```

Build output:

```text
dist/
```

By default, the deployed app fetches:

```text
/reports.json
```

Set `VITE_REPORTS_URL` at build time if the report bundle is hosted somewhere else.

## GitHub Actions Automation

The repository includes a workflow at the git root:

```text
.github/workflows/morning-daily.yml
```

It installs the Python agent dependencies, runs `agent/run_daily.py` from `personal-knowldge-website`, and commits `public/reports.json` when it changes.

Required secret:

```text
ANTHROPIC_API_KEY
```

Optional secret:

```text
BRAVE_API_KEY
```

Optional variable:

```text
ANTHROPIC_MODEL
```

The workflow currently uses the GitHub Environment named `daily_summary`, so environment-scoped secrets must be available to that environment or moved to repository-level Actions secrets.

## Why This Is Different From a Normal Blog

Morning is not only a place to publish finished posts. It is an automated research-and-reading system.

- It is evidence-first. The agent only receives collected RSS/search evidence and is instructed to stay inside that evidence.
- It produces structured data, not loose prose. Reports are validated before publication, which keeps the frontend simple and prevents malformed editions from breaking the reader.
- It is archive-native. Every generated edition is merged into one searchable JSON bundle instead of being scattered across individual markdown files or database rows.
- It is personal by design. The feed list, prompt, timezone, model, UI defaults, and reader preferences are all tuned for one person's research diet.
- It has a focused reader rather than a generic blog theme. The UI emphasizes daily briefing, previous editions, topic scanning, bookmarks, and reading stats.
- It separates generation from presentation. The agent can evolve independently from the React app, and the app can render any valid `reports.json` bundle.
- It is lightweight to host. There is no backend server required for readers; the generation pipeline can run locally or on a scheduled workflow.

In short: this repository is closer to a personal research desk with an automated editorial assistant than a conventional blog engine.
