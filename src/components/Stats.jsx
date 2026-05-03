import { useMemo } from "react";
import { useReports } from "../ReportsContext.jsx";

export function Stats() {
  const { reports, user } = useReports();
  const topicCounts = useMemo(() => {
    const c = {};
    reports.forEach((r) => r.topics.forEach((t) => (c[t] = (c[t] || 0) + 1)));
    return Object.entries(c).sort((a, b) => b[1] - a[1]);
  }, [reports]);
  const maxCount = Math.max(...topicCounts.map(([, n]) => n), 1);

  const totalMinutes = reports.reduce((s, r) => s + r.readTime, 0);

  return (
    <div className="route-fade">
      <header className="page-header">
        <div>
          <div className="page-eyebrow">Reading stats</div>
          <h1 className="page-title">What you&apos;ve been reading.</h1>
          <p className="page-subtitle">A small portrait of your research diet.</p>
        </div>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-val">
            {user.readThisWeek}
            <span className="stat-unit">reports</span>
          </div>
          <div className="stat-desc">Read this week</div>
        </div>
        <div className="stat-card">
          <div className="stat-val">
            {user.readThisMonth}
            <span className="stat-unit">reports</span>
          </div>
          <div className="stat-desc">Read this month</div>
        </div>
        <div className="stat-card">
          <div className="stat-val">
            {Math.round(totalMinutes / 60)}
            <span className="stat-unit">hrs</span>
          </div>
          <div className="stat-desc">Time in the archive</div>
        </div>
      </div>

      <h2
        style={{
          fontFamily: "var(--serif)",
          fontWeight: 400,
          fontSize: 22,
          letterSpacing: "-0.01em",
          marginBottom: 20,
        }}
      >
        Topics you&apos;ve covered
      </h2>
      <div className="topic-bars">
        {topicCounts.map(([topic, count]) => (
          <div key={topic} className="topic-bar">
            <div className="topic-bar-label">{topic}</div>
            <div className="topic-bar-track">
              <div className="topic-bar-fill" style={{ width: `${(count / maxCount) * 100}%` }} />
            </div>
            <div className="topic-bar-count">{count}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
