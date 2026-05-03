import { useCallback, useEffect, useState } from "react";
import { DEFAULT_USER } from "./data.js";
import { useAppPreferences } from "./hooks/useAppPreferences.js";
import { useReports } from "./ReportsContext.jsx";
import { Archive } from "./components/Archive.jsx";
import { Bookmarks } from "./components/Bookmarks.jsx";
import { Commission } from "./components/Commission.jsx";
import { Home } from "./components/Home.jsx";
import { ReportScreen } from "./components/ReportScreen.jsx";
import { SettingsPanel } from "./components/SettingsPanel.jsx";
import { Sidebar } from "./components/Sidebar.jsx";
import { Stats } from "./components/Stats.jsx";

export default function App() {
  const { source } = useReports();
  const [route, setRoute] = useState("home");
  const [theme, setTheme] = useState("light");
  const [bookmarks, setBookmarks] = useState(() => [...DEFAULT_USER.bookmarkedIds]);
  const [tweaks, setTweak] = useAppPreferences();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [reportId, setReportId] = useState(null);
  const [returnRoute, setReturnRoute] = useState("home");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("data-palette", tweaks.palette);
    document.documentElement.setAttribute("data-density", tweaks.density);
  }, [theme, tweaks.palette, tweaks.density]);

  const toggleBookmark = useCallback((id) => {
    setBookmarks((b) => (b.includes(id) ? b.filter((x) => x !== id) : [...b, id]));
  }, []);

  const navigate = useCallback((next) => {
    if (next !== "report") setReportId(null);
    setRoute(next);
  }, []);

  const openReport = useCallback((id, returnTo = "archive") => {
    setReturnRoute(returnTo);
    setReportId(id);
    setRoute("report");
  }, []);

  const closeReport = useCallback(() => {
    navigate(returnRoute);
  }, [returnRoute, navigate]);

  let content;
  if (route === "home") {
    content = (
      <Home
        layout={tweaks.layout}
        bookmarks={bookmarks}
        toggleBookmark={toggleBookmark}
        setRoute={navigate}
        openReport={openReport}
      />
    );
  } else if (route === "archive") {
    content = <Archive bookmarks={bookmarks} toggleBookmark={toggleBookmark} onOpen={(id) => openReport(id, "archive")} />;
  } else if (route === "commission") {
    content = <Commission />;
  } else if (route === "bookmarks") {
    content = <Bookmarks bookmarks={bookmarks} toggleBookmark={toggleBookmark} onOpen={(id) => openReport(id, "bookmarks")} />;
  } else if (route === "stats") {
    content = <Stats />;
  } else if (route === "report" && reportId) {
    content = (
      <ReportScreen
        reportId={reportId}
        bookmarks={bookmarks}
        toggleBookmark={toggleBookmark}
        setRoute={navigate}
        returnTo={returnRoute}
        onClose={closeReport}
      />
    );
  } else {
    content = null;
  }

  return (
    <div className="app">
      <Sidebar
        route={route === "report" ? returnRoute : route}
        setRoute={(r) => {
          setSettingsOpen(false);
          navigate(r);
        }}
        theme={theme}
        setTheme={setTheme}
        bookmarks={bookmarks}
        dataSource={source}
        onOpenSettings={() => setSettingsOpen(true)}
      />
      <main className="main" key={route === "report" ? `report-${reportId}` : route}>
        {content}
      </main>
      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} tweaks={tweaks} setTweak={setTweak} />
    </div>
  );
}
