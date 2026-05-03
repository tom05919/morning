import { Icon } from "./Icon.jsx";
import { useReports } from "../ReportsContext.jsx";

export function Sidebar({
  route,
  setRoute,
  theme,
  setTheme,
  bookmarks,
  dataSource,
  onOpenSettings,
}) {
  const { user, reports } = useReports();
  const navItems = [
    { id: "home", label: "Today", icon: "home" },
    { id: "archive", label: "Archive", icon: "archive" },
    { id: "commission", label: "Commission", icon: "commission" },
  ];
  const secondaryItems = [
    { id: "bookmarks", label: "Bookmarks", icon: "bookmark" },
    { id: "stats", label: "Reading stats", icon: "stats" },
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark" />
        <span>Morning.</span>
      </div>

      <nav className="nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className="nav-item"
            aria-current={route === item.id ? "page" : undefined}
            onClick={() => setRoute(item.id)}
          >
            <Icon name={item.icon} size={15} />
            <span>{item.label}</span>
            {item.id === "home" && reports.length > 0 && (
              <span
                style={{
                  marginLeft: "auto",
                  fontFamily: "var(--mono)",
                  fontSize: 10,
                  color: "var(--accent-ink)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                New
              </span>
            )}
          </button>
        ))}
      </nav>

      <div>
        <div className="nav-section-label">Library</div>
        <nav className="nav">
          {secondaryItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className="nav-item"
              aria-current={route === item.id ? "page" : undefined}
              onClick={() => setRoute(item.id)}
            >
              <Icon name={item.icon} size={15} />
              <span>{item.label}</span>
              {item.id === "bookmarks" && bookmarks.length > 0 && (
                <span
                  style={{
                    marginLeft: "auto",
                    fontFamily: "var(--mono)",
                    fontSize: 11,
                    color: "var(--ink-3)",
                  }}
                >
                  {bookmarks.length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="sidebar-footer">
        <div className="stats-mini">
          <div>
            <span className="stat-num">{user.readThisWeek}</span>
            <span className="stat-label">This week</span>
          </div>
          <div>
            <span className="stat-num">{user.readThisMonth}</span>
            <span className="stat-label">This month</span>
          </div>
        </div>

        <div
          className="sidebar-feed-line"
          data-live={dataSource === "live" ? "true" : "false"}
          data-state={dataSource}
        >
          {dataSource === "loading" && "Loading bundle…"}
          {dataSource === "live" && "Live bundle"}
          {dataSource === "empty" && "No reports in bundle"}
          {dataSource === "error" && "Bundle unavailable"}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <button
            type="button"
            className="nav-item"
            style={{ padding: "6px 10px", width: "auto" }}
            onClick={onOpenSettings}
            aria-label="Appearance and layout"
          >
            <Icon name="settings" size={15} />
            <span style={{ fontSize: 13 }}>Look & layout</span>
          </button>
          <div className="theme-toggle" role="group" aria-label="Theme">
            <button type="button" data-active={theme === "light"} onClick={() => setTheme("light")} aria-label="Light">
              <Icon name="sun" size={14} />
            </button>
            <button type="button" data-active={theme === "dark"} onClick={() => setTheme("dark")} aria-label="Dark">
              <Icon name="moon" size={14} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
