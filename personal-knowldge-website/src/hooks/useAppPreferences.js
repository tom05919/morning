import { useCallback, useState } from "react";

const STORAGE_KEY = "morning.preferences";

const DEFAULTS = {
  palette: "sage",
  density: "compact",
  layout: "focus",
};

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULTS };
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULTS };
  }
}

export function useAppPreferences() {
  const [tweaks, setValues] = useState(load);

  const setTweak = useCallback((key, val) => {
    setValues((prev) => {
      const next = { ...prev, [key]: val };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore quota */
      }
      return next;
    });
  }, []);

  return [tweaks, setTweak];
}
