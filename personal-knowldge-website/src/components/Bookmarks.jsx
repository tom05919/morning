import { useReports } from "../ReportsContext.jsx";
import { Icon } from "./Icon.jsx";

export function Bookmarks({ bookmarks, toggleBookmark, onOpen }) {
  const { reports } = useReports();
  const items = reports.filter((r) => bookmarks.includes(r.id));
  return (
    <div className="route-fade">
      <header className="page-header">
        <div>
          <div className="page-eyebrow">Bookmarks</div>
          <h1 className="page-title">Reports you starred.</h1>
          <p className="page-subtitle">{items.length} saved.</p>
        </div>
      </header>
      <div className="archive-list">
        {items.length === 0 && (
          <div
            style={{
              padding: "40px 0",
              color: "var(--ink-3)",
              fontFamily: "var(--serif)",
              fontStyle: "italic",
            }}
          >
            You haven&apos;t bookmarked anything yet.
          </div>
        )}
        {items.map((r) => (
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
                data-on="true"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleBookmark(r.id);
                }}
                aria-label="Remove bookmark"
              >
                <Icon name="bookmark-fill" size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
