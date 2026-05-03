import { Icon } from "./Icon.jsx";

export function ReportArticle({
  report,
  bookmarks,
  toggleBookmark,
  setRoute,
  className = "",
  showCommissionCta = true,
  showFreshBadge = false,
}) {
  const isBookmarked = bookmarks.includes(report.id);

  return (
    <article className={`today route-fade ${className}`.trim()}>
      <div className="today-meta">
        <span>{report.date}</span>
        <span className="dot" />
        <span>{report.readTime} min read</span>
        {showFreshBadge && (
          <>
            <span className="dot" />
            <span className="live">
              <span className="live-dot" /> Fresh today
            </span>
          </>
        )}
      </div>

      <h1 className="today-title">{report.title}</h1>

      <div className="report-topics" style={{ marginBottom: 32 }}>
        {report.topics.map((t) => (
          <span key={t} className="topic-chip">
            {t}
          </span>
        ))}
      </div>

      <div className="tldr">
        <div className="tldr-label">TL;DR</div>
        <div className="tldr-body">{report.tldr}</div>
      </div>

      {report.sections?.length > 0 && (
        <div className="report-body">
          {report.sections.map((s, i) => (
            <section key={i}>
              <h2>{s.heading}</h2>
              <p>{s.body}</p>
            </section>
          ))}
        </div>
      )}

      {report.sources?.length > 0 && (
        <div className="report-footer">
          <div className="sources-title">Sources</div>
          {report.sources.map((s, i) => (
            <div className="source-item" key={i}>
              <span className="source-num">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <div className="source-title">{s.title}</div>
                <div className="source-meta">
                  {s.author} · {s.year}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="report-actions">
        <button
          type="button"
          className={"btn" + (isBookmarked ? " active" : "")}
          onClick={() => toggleBookmark(report.id)}
        >
          <Icon name={isBookmarked ? "bookmark-fill" : "bookmark"} size={14} />
          {isBookmarked ? "Bookmarked" : "Bookmark"}
        </button>
        {showCommissionCta && (
          <button type="button" className="btn" onClick={() => setRoute("commission")}>
            <Icon name="sparkle" size={14} />
            Follow up with another report
          </button>
        )}
      </div>
    </article>
  );
}
