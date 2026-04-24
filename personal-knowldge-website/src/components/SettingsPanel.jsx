import { useEffect } from "react";

export function SettingsPanel({ open, onClose, tweaks, setTweak }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const stop = (e) => e.stopPropagation();

  return (
    <div
      className="settings-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div className="settings-modal-wrap settings-modal" onClick={stop}>
        <button type="button" className="settings-close" onClick={onClose} aria-label="Close settings">
          ✕
        </button>
        <h2 id="settings-title">{"Look & layout"}</h2>
        <p className="settings-sub">Tune the reader. Preferences are saved in this browser.</p>

        <div className="settings-group-label">Accent</div>
        <div className="settings-row">
          {["peach", "sage", "sand", "lilac", "sky"].map((p) => (
            <button
              key={p}
              type="button"
              className="filter-pill"
              data-active={tweaks.palette === p}
              onClick={() => setTweak("palette", p)}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="settings-group-label">Density</div>
        <div className="settings-row">
          {["airy", "compact"].map((d) => (
            <button
              key={d}
              type="button"
              className="filter-pill"
              data-active={tweaks.density === d}
              onClick={() => setTweak("density", d)}
            >
              {d}
            </button>
          ))}
        </div>

        <div className="settings-group-label">Home layout</div>
        <div className="settings-row">
          {["focus", "split", "timeline"].map((l) => (
            <button
              key={l}
              type="button"
              className="filter-pill"
              data-active={tweaks.layout === l}
              onClick={() => setTweak("layout", l)}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
