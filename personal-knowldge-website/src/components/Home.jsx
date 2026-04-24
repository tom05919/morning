import { useMemo } from "react";
import { useReports } from "../ReportsContext.jsx";
import { ReportArticle } from "./ReportArticle.jsx";

export function Home({ layout, bookmarks, toggleBookmark, setRoute, openReport }) {
  const { reports, user, source: bundleState, loading } = useReports();
  const today = reports[0];
  const recent = reports.slice(1, 6);
  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  if (loading) {
    return (
      <div className="route-fade">
        <header className="page-header">
          <div>
            <div className="page-eyebrow">Today</div>
            <h1 className="page-title">Loading…</h1>
            <p className="page-subtitle">Fetching your reports bundle.</p>
          </div>
        </header>
      </div>
    );
  }

  if (!today) {
    return (
      <div className="route-fade">
        <header className="page-header">
          <div>
            <div className="page-eyebrow">Today</div>
            <h1 className="page-title">
              {greeting}, {user.name}.
            </h1>
            <p className="page-subtitle">
              {bundleState === "error"
                ? "Could not load reports.json. Run the agent locally or deploy a bundle to public/reports.json."
                : "No edition yet. Run python agent/run_daily.py — then refresh this page."}
            </p>
          </div>
        </header>
      </div>
    );
  }

  const todayReport = (
    <ReportArticle
      report={today}
      bookmarks={bookmarks}
      toggleBookmark={toggleBookmark}
      setRoute={setRoute}
      showFreshBadge
    />
  );

  return (
    <div>
      <header className="page-header">
        <div>
          <div className="page-eyebrow">
            {today.date.split(",")[0]} · {today.date.split(",")[1]}
          </div>
          <h1 className="page-title">
            {greeting}, {user.name}.
          </h1>
          <p className="page-subtitle">Your agents finished their overnight pass. One report is waiting.</p>
        </div>
      </header>

      {layout === "split" ? (
        <div className="home-grid" data-layout="split">
          {todayReport}
          <aside className="recent-sidebar">
            <div className="recent-label">Previously</div>
            {recent.map((r) => (
              <a
                key={r.id}
                className="recent-item"
                href="#archive"
                onClick={(e) => {
                  e.preventDefault();
                  openReport(r.id, "home");
                }}
              >
                <div className="recent-date">{r.shortDate}</div>
                <div className="recent-title">{r.title}</div>
              </a>
            ))}
          </aside>
        </div>
      ) : layout === "timeline" ? (
        <div>
          {todayReport}
          <div className="timeline-prev">
            <div className="recent-label">Earlier this week</div>
            {recent.map((r) => (
              <a
                key={r.id}
                className="recent-item"
                href="#archive"
                onClick={(e) => {
                  e.preventDefault();
                  openReport(r.id, "home");
                }}
              >
                <div className="recent-date">
                  {r.shortDate} · {r.readTime} min
                </div>
                <div className="recent-title">{r.title}</div>
              </a>
            ))}
          </div>
        </div>
      ) : (
        todayReport
      )}
    </div>
  );
}
