import { useReports } from "../ReportsContext.jsx";
import { Icon } from "./Icon.jsx";
import { ReportArticle } from "./ReportArticle.jsx";

const returnLabels = {
  home: "Today",
  archive: "Archive",
  bookmarks: "Bookmarks",
};

export function ReportScreen({ reportId, bookmarks, toggleBookmark, setRoute, returnTo, onClose }) {
  const { reports } = useReports();
  const report = reports.find((r) => r.id === reportId);
  if (!report) {
    return (
      <div className="route-fade">
        <p style={{ color: "var(--ink-3)" }}>Report not found.</p>
        <button type="button" className="btn" onClick={() => onClose()}>
          Go back
        </button>
      </div>
    );
  }

  const label = returnLabels[returnTo] || "Today";

  return (
    <div className="route-fade">
      <button type="button" className="report-back" onClick={() => onClose()}>
        <Icon name="arrow-left" size={14} /> Back to {label}
      </button>
      <ReportArticle
        report={report}
        bookmarks={bookmarks}
        toggleBookmark={toggleBookmark}
        setRoute={setRoute}
        showFreshBadge={report.id === reports[0]?.id}
      />
    </div>
  );
}
