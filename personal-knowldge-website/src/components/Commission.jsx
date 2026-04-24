import { useRef, useState } from "react";
import { Icon } from "./Icon.jsx";

export function Commission() {
  const [prompt, setPrompt] = useState("");
  const [queue, setQueue] = useState([
    { id: 1, title: "Survey of recent vision-language-action models", eta: "Ready in ~14 min" },
  ]);
  const [justSent, setJustSent] = useState(false);
  const textareaRef = useRef(null);

  const suggestions = [
    "Summarize this week's papers on reinforcement learning from human feedback.",
    "What are Figure, 1X, and Tesla actually shipping in humanoid robotics right now?",
    "Find me the three most cited diffusion policy papers from the last quarter.",
    "Are there any new benchmarks for evaluating agent performance on long-horizon tasks?",
  ];

  const submit = () => {
    if (!prompt.trim()) return;
    setQueue((q) => [{ id: Date.now(), title: prompt.slice(0, 80), eta: "Queued · ~18 min" }, ...q]);
    setPrompt("");
    setJustSent(true);
    setTimeout(() => setJustSent(false), 2400);
  };

  const handleKey = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") submit();
  };

  return (
    <div className="route-fade">
      <header className="page-header">
        <div>
          <div className="page-eyebrow">Commission</div>
          <h1 className="page-title">What should the agents dig into?</h1>
          <p className="page-subtitle">
            Describe what you want to know. A full report lands in your inbox, usually within 20 minutes.
          </p>
        </div>
      </header>

      <div className="commission-wrap">
        <div className="commission-box">
          <textarea
            ref={textareaRef}
            className="commission-textarea"
            placeholder="e.g. Give me a close read of the three most interesting robotics papers from ICRA this week — what's actually new, what's recycled."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKey}
          />
          <div className="commission-bar">
            <div className="commission-hint">⌘ + ↵ to send · expect a full report</div>
            <button type="button" className="commission-submit" disabled={!prompt.trim()} onClick={submit}>
              {justSent ? "Queued ✓" : (
                <>
                  Commission
                  <Icon name="send" size={13} />
                </>
              )}
            </button>
          </div>
        </div>

        <div className="suggestions-label">Or start from a suggestion</div>
        <div className="suggestions">
          {suggestions.map((s, i) => (
            <button
              key={i}
              type="button"
              className="suggestion"
              onClick={() => {
                setPrompt(s);
                textareaRef.current?.focus();
              }}
            >
              <span>{s}</span>
              <Icon name="arrow-right" size={14} />
            </button>
          ))}
        </div>

        {queue.length > 0 && (
          <>
            <div className="queue-label">In the queue</div>
            {queue.map((q) => (
              <div key={q.id} className="queue-item">
                <span className="queue-status">Researching</span>
                <span className="queue-title">{q.title}</span>
                <span className="queue-eta">
                  <Icon name="clock" size={11} /> {q.eta}
                </span>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
