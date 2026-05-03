import { useMemo, useState } from "react";
import { useReports } from "../ReportsContext.jsx";
import { Icon } from "./Icon.jsx";

export function Archive({ bookmarks, toggleBookmark, onOpen }) {
  const { reports } = useReports();
  const [query, setQuery] = useState("");
  const [topicFilter, setTopicFilter] = useState("All");

  const filtered = useMemo(() => {
    return reports.filter((r) => {
      if (topicFilter !== "All" && !r.topics.includes(topicFilter)) return false;
      if (query) {
        const q = query.toLowerCase();
        return (
          r.title.toLowerCase().includes(q) ||
          r.tldr.toLowerCase().includes(q) ||
          r.topics.join(" ").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [query, topicFilter, reports]);

  const grouped = useMemo(() => {
    const g = {};
    filtered.forEach((r) => {
      const d = new Date(r.id);
      const key = d.toLocaleString("en-US", { month: "long", year: "numeric" });
      if (!g[key]) g[key] = [];
      g[key].push(r);
    });
    return g;
  }, [filtered]);

  const allTopics = useMemo(() => {
    const s = new Set();
    reports.forEach((r) => r.topics.forEach((t) => s.add(t)));
    return ["All", ...Array.from(s)];
  }, [reports]);

  return (
    <div className="route-fade">
      <header className="page-header">
        <div>
          <div className="page-eyebrow">Archive</div>
          <h1 className="page-title">Everything your agents have filed.</h1>
          <p className="page-subtitle">
            {reports.length === 0
              ? "No reports yet. Run the daily agent to populate public/reports.json."
              : `${reports.length} report${reports.length === 1 ? "" : "s"}. Search by topic, title, or what&apos;s inside.`}
          </p>
        </div>
      </header>

      <div className="archive-toolbar">
        <div className="search-wrap">
          <Icon name="search" size={15} />
          <input
            className="search-input"
            placeholder="Search reports…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search reports"
          />
        </div>
      </div>

      <div className="filter-row">
        {allTopics.map((t) => (
          <button
            key={t}
            type="button"
            className="filter-pill"
            data-active={t === topicFilter}
            onClick={() => setTopicFilter(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="archive-list">
        {Object.keys(grouped).length === 0 && (
          <div
            style={{
              padding: "40px 0",
              color: "var(--ink-3)",
              fontFamily: "var(--serif)",
              fontStyle: "italic",
            }}
          >
            No reports match that.
          </div>
        )}
        {Object.entries(grouped).map(([month, items]) => (
          <div key={month}>
            <div className="archive-year">{month}</div>
            {items.map((r) => {
              const isBm = bookmarks.includes(r.id);
              return (
                <div
                  key={r.id}
                  className="archive-item"
                  onClick={() => onOpen(r.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onOpen(r.id);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div className="arch-date">{r.shortDate}</div>
                  <div>
                    <div className="arch-title">{r.title}</div>
                    <div className="arch-topics">
                      {r.topics.map((t) => (
                        <span key={t} className="topic-chip">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="arch-meta">
                    <span>{r.readTime} min</span>
                    <button
                      type="button"
                      className="bookmark-btn"
                      data-on={isBm}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(r.id);
                      }}
                      aria-label={isBm ? "Remove bookmark" : "Bookmark"}
                    >
                      <Icon name={isBm ? "bookmark-fill" : "bookmark"} size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
