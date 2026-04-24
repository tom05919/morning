import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_USER } from "./data.js";

const ReportsContext = createContext(null);

const bundleUrl = import.meta.env.VITE_REPORTS_URL || "/reports.json";

/** loading | live | empty | error */
export function ReportsProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [user, setUser] = useState(DEFAULT_USER);
  const [source, setSource] = useState("loading");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(bundleUrl, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const bundle = await res.json();
        if (cancelled) return;
        const remote = Array.isArray(bundle.reports) ? bundle.reports : [];
        const remoteUser =
          bundle.user && typeof bundle.user === "object" && bundle.user !== null ? bundle.user : null;
        setReports(remote);
        setUser(remoteUser || DEFAULT_USER);
        setSource(remote.length > 0 ? "live" : "empty");
      } catch {
        if (!cancelled) {
          setReports([]);
          setUser(DEFAULT_USER);
          setSource("error");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({ reports, user, source, loading }),
    [reports, user, source, loading]
  );

  return <ReportsContext.Provider value={value}>{children}</ReportsContext.Provider>;
}

export function useReports() {
  const ctx = useContext(ReportsContext);
  if (!ctx) throw new Error("useReports must be used within ReportsProvider");
  return ctx;
}
