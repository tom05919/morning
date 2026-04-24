const { useState, useEffect, useMemo, useRef } = React;

/* ================= Icons ================= */
const Icon = ({ name, size = 16 }) => {
  const s = size;
  const common = { width: s, height: s, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "home": return <svg {...common}><path d="M3 12l9-8 9 8"/><path d="M5 10v10h14V10"/></svg>;
    case "archive": return <svg {...common}><rect x="3" y="5" width="18" height="4" rx="1"/><path d="M5 9v10h14V9"/><path d="M10 13h4"/></svg>;
    case "commission": return <svg {...common}><path d="M12 4v16M4 12h16"/></svg>;
    case "bookmark": return <svg {...common}><path d="M6 3h12v18l-6-4-6 4z"/></svg>;
    case "bookmark-fill": return <svg {...common} fill="currentColor"><path d="M6 3h12v18l-6-4-6 4z"/></svg>;
    case "stats": return <svg {...common}><path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/></svg>;
    case "search": return <svg {...common}><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>;
    case "arrow-right": return <svg {...common}><path d="M5 12h14M13 5l7 7-7 7"/></svg>;
    case "send": return <svg {...common}><path d="M4 12l16-8-6 16-2-6-8-2z"/></svg>;
    case "sun": return <svg {...common}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>;
    case "moon": return <svg {...common}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>;
    case "sparkle": return <svg {...common}><path d="M12 3l2 7 7 2-7 2-2 7-2-7-7-2 7-2z"/></svg>;
    case "clock": return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
    case "settings": return <svg {...common}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>;
    default: return null;
  }
};

/* ================= Sidebar ================= */
function Sidebar({ route, setRoute, theme, setTheme, bookmarks }) {
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
        {navItems.map(item => (
          <button
            key={item.id}
            className="nav-item"
            aria-current={route === item.id ? "page" : undefined}
            onClick={() => setRoute(item.id)}
          >
            <Icon name={item.icon} size={15} />
            <span>{item.label}</span>
            {item.id === "home" && <span style={{marginLeft: "auto", fontFamily: "var(--mono)", fontSize: 10, color: "var(--accent-ink)", textTransform: "uppercase", letterSpacing: "0.1em"}}>New</span>}
          </button>
        ))}
      </nav>

      <div>
        <div className="nav-section-label">Library</div>
        <nav className="nav">
          {secondaryItems.map(item => (
            <button
              key={item.id}
              className="nav-item"
              aria-current={route === item.id ? "page" : undefined}
              onClick={() => setRoute(item.id)}
            >
              <Icon name={item.icon} size={15} />
              <span>{item.label}</span>
              {item.id === "bookmarks" && bookmarks.length > 0 && (
                <span style={{marginLeft: "auto", fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink-3)"}}>{bookmarks.length}</span>
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="sidebar-footer">
        <div className="stats-mini">
          <div>
            <span className="stat-num">{USER.readThisWeek}</span>
            <span className="stat-label">This week</span>
          </div>
          <div>
            <span className="stat-num">{USER.readThisMonth}</span>
            <span className="stat-label">This month</span>
          </div>
        </div>

        <div className="theme-toggle" role="group" aria-label="Theme">
          <button data-active={theme === "light"} onClick={() => setTheme("light")} aria-label="Light"><Icon name="sun" size={14}/></button>
          <button data-active={theme === "dark"} onClick={() => setTheme("dark")} aria-label="Dark"><Icon name="moon" size={14}/></button>
        </div>
      </div>
    </aside>
  );
}

/* ================= Home (Today's Report) ================= */
function Home({ layout, bookmarks, toggleBookmark, setRoute }) {
  const today = REPORTS[0];
  const recent = REPORTS.slice(1, 6);
  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  }, []);
  const isBookmarked = bookmarks.includes(today.id);

  const todayReport = (
    <article className="today route-fade">
      <div className="today-meta">
        <span>{today.date}</span>
        <span className="dot"/>
        <span>{today.readTime} min read</span>
        <span className="dot"/>
        <span className="live"><span className="live-dot"/> Fresh today</span>
      </div>

      <h1 className="today-title">{today.title}</h1>

      <div className="report-topics" style={{marginBottom: 32}}>
        {today.topics.map(t => <span key={t} className="topic-chip">{t}</span>)}
      </div>

      <div className="tldr">
        <div className="tldr-label">TL;DR</div>
        <div className="tldr-body">{today.tldr}</div>
      </div>

      <div className="report-body">
        {today.sections.map((s, i) => (
          <section key={i}>
            <h2>{s.heading}</h2>
            <p>{s.body}</p>
          </section>
        ))}
      </div>

      <div className="report-footer">
        <div className="sources-title">Sources</div>
        {today.sources.map((s, i) => (
          <div className="source-item" key={i}>
            <span className="source-num">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <div className="source-title">{s.title}</div>
              <div className="source-meta">{s.author} · {s.year}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="report-actions">
        <button className={"btn" + (isBookmarked ? " active" : "")} onClick={() => toggleBookmark(today.id)}>
          <Icon name={isBookmarked ? "bookmark-fill" : "bookmark"} size={14}/>
          {isBookmarked ? "Bookmarked" : "Bookmark"}
        </button>
        <button className="btn" onClick={() => setRoute("commission")}>
          <Icon name="sparkle" size={14}/>
          Follow up with another report
        </button>
      </div>
    </article>
  );

  return (
    <div>
      <header className="page-header">
        <div>
          <div className="page-eyebrow">{today.date.split(",")[0]} · {today.date.split(",")[1]}</div>
          <h1 className="page-title">{greeting}, {USER.name}.</h1>
          <p className="page-subtitle">Your agents finished their overnight pass. One report is waiting.</p>
        </div>
      </header>

      {layout === "split" ? (
        <div className="home-grid" data-layout="split">
          {todayReport}
          <aside className="recent-sidebar">
            <div className="recent-label">Previously</div>
            {recent.map(r => (
              <a key={r.id} className="recent-item" href="#" onClick={(e) => {e.preventDefault(); setRoute("archive");}}>
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
            {recent.map(r => (
              <a key={r.id} className="recent-item" href="#" onClick={(e) => {e.preventDefault(); setRoute("archive");}}>
                <div className="recent-date">{r.shortDate} · {r.readTime} min</div>
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

/* ================= Archive ================= */
function Archive({ bookmarks, toggleBookmark, onOpen }) {
  const [query, setQuery] = useState("");
  const [topicFilter, setTopicFilter] = useState("All");

  const allTopics = useMemo(() => {
    const s = new Set();
    REPORTS.forEach(r => r.topics.forEach(t => s.add(t)));
    return ["All", ...Array.from(s)];
  }, []);

  const filtered = useMemo(() => {
    return REPORTS.filter(r => {
      if (topicFilter !== "All" && !r.topics.includes(topicFilter)) return false;
      if (query) {
        const q = query.toLowerCase();
        return r.title.toLowerCase().includes(q) || r.tldr.toLowerCase().includes(q) || r.topics.join(" ").toLowerCase().includes(q);
      }
      return true;
    });
  }, [query, topicFilter]);

  // group by month
  const grouped = useMemo(() => {
    const g = {};
    filtered.forEach(r => {
      const d = new Date(r.id);
      const key = d.toLocaleString("en-US", { month: "long", year: "numeric" });
      if (!g[key]) g[key] = [];
      g[key].push(r);
    });
    return g;
  }, [filtered]);

  return (
    <div className="route-fade">
      <header className="page-header">
        <div>
          <div className="page-eyebrow">Archive</div>
          <h1 className="page-title">Everything your agents have filed.</h1>
          <p className="page-subtitle">{REPORTS.length} reports going back to January. Search by topic, title, or what's inside.</p>
        </div>
      </header>

      <div className="archive-toolbar">
        <div className="search-wrap">
          <Icon name="search" size={15}/>
          <input
            className="search-input"
            placeholder="Search reports…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="filter-row">
        {allTopics.map(t => (
          <button key={t} className="filter-pill" data-active={t === topicFilter} onClick={() => setTopicFilter(t)}>
            {t}
          </button>
        ))}
      </div>

      <div className="archive-list">
        {Object.keys(grouped).length === 0 && (
          <div style={{padding: "40px 0", color: "var(--ink-3)", fontFamily: "var(--serif)", fontStyle: "italic"}}>
            No reports match that.
          </div>
        )}
        {Object.entries(grouped).map(([month, items]) => (
          <div key={month}>
            <div className="archive-year">{month}</div>
            {items.map(r => {
              const isBm = bookmarks.includes(r.id);
              return (
                <div key={r.id} className="archive-item" onClick={() => onOpen(r.id)}>
                  <div className="arch-date">{r.shortDate}</div>
                  <div>
                    <div className="arch-title">{r.title}</div>
                    <div className="arch-topics">
                      {r.topics.map(t => <span key={t} className="topic-chip">{t}</span>)}
                    </div>
                  </div>
                  <div className="arch-meta">
                    <span>{r.readTime} min</span>
                    <button
                      className="bookmark-btn"
                      data-on={isBm}
                      onClick={(e) => {e.stopPropagation(); toggleBookmark(r.id);}}
                      aria-label="Bookmark"
                    >
                      <Icon name={isBm ? "bookmark-fill" : "bookmark"} size={15}/>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= Commission ================= */
function Commission() {
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
    "Are there any new benchmarks for evaluating agent performance on long-horizon tasks?"
  ];

  const submit = () => {
    if (!prompt.trim()) return;
    setQueue(q => [{ id: Date.now(), title: prompt.slice(0, 80), eta: "Queued · ~18 min" }, ...q]);
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
          <p className="page-subtitle">Describe what you want to know. A full report lands in your inbox, usually within 20 minutes.</p>
        </div>
      </header>

      <div className="commission-wrap">
        <div className="commission-box">
          <textarea
            ref={textareaRef}
            className="commission-textarea"
            placeholder="e.g. Give me a close read of the three most interesting robotics papers from ICRA this week — what's actually new, what's recycled."
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={handleKey}
          />
          <div className="commission-bar">
            <div className="commission-hint">⌘ + ↵ to send · expect a full report</div>
            <button className="commission-submit" disabled={!prompt.trim()} onClick={submit}>
              {justSent ? "Queued ✓" : <>Commission<Icon name="send" size={13}/></>}
            </button>
          </div>
        </div>

        <div className="suggestions-label">Or start from a suggestion</div>
        <div className="suggestions">
          {suggestions.map((s, i) => (
            <button key={i} className="suggestion" onClick={() => { setPrompt(s); textareaRef.current?.focus(); }}>
              <span>{s}</span>
              <Icon name="arrow-right" size={14} />
            </button>
          ))}
        </div>

        {queue.length > 0 && (
          <>
            <div className="queue-label">In the queue</div>
            {queue.map(q => (
              <div key={q.id} className="queue-item">
                <span className="queue-status">Researching</span>
                <span className="queue-title">{q.title}</span>
                <span className="queue-eta"><Icon name="clock" size={11}/> {q.eta}</span>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

/* ================= Bookmarks ================= */
function Bookmarks({ bookmarks, toggleBookmark, onOpen }) {
  const items = REPORTS.filter(r => bookmarks.includes(r.id));
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
          <div style={{padding: "40px 0", color: "var(--ink-3)", fontFamily: "var(--serif)", fontStyle: "italic"}}>
            You haven't bookmarked anything yet.
          </div>
        )}
        {items.map(r => (
          <div key={r.id} className="archive-item" onClick={() => onOpen(r.id)}>
            <div className="arch-date">{r.shortDate}</div>
            <div>
              <div className="arch-title">{r.title}</div>
              <div className="arch-topics">{r.topics.map(t => <span key={t} className="topic-chip">{t}</span>)}</div>
            </div>
            <div className="arch-meta">
              <span>{r.readTime} min</span>
              <button className="bookmark-btn" data-on="true" onClick={(e) => {e.stopPropagation(); toggleBookmark(r.id);}}>
                <Icon name="bookmark-fill" size={15}/>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= Stats ================= */
function Stats() {
  const topicCounts = useMemo(() => {
    const c = {};
    REPORTS.forEach(r => r.topics.forEach(t => c[t] = (c[t] || 0) + 1));
    return Object.entries(c).sort((a,b) => b[1] - a[1]);
  }, []);
  const maxCount = Math.max(...topicCounts.map(([,n]) => n));

  const totalMinutes = REPORTS.reduce((s, r) => s + r.readTime, 0);

  return (
    <div className="route-fade">
      <header className="page-header">
        <div>
          <div className="page-eyebrow">Reading stats</div>
          <h1 className="page-title">What you've been reading.</h1>
          <p className="page-subtitle">A small portrait of your research diet.</p>
        </div>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-val">{USER.readThisWeek}<span className="stat-unit">reports</span></div>
          <div className="stat-desc">Read this week</div>
        </div>
        <div className="stat-card">
          <div className="stat-val">{USER.readThisMonth}<span className="stat-unit">reports</span></div>
          <div className="stat-desc">Read this month</div>
        </div>
        <div className="stat-card">
          <div className="stat-val">{Math.round(totalMinutes / 60)}<span className="stat-unit">hrs</span></div>
          <div className="stat-desc">Time in the archive</div>
        </div>
      </div>

      <h2 style={{fontFamily: "var(--serif)", fontWeight: 400, fontSize: 22, letterSpacing: "-0.01em", marginBottom: 20}}>Topics you've covered</h2>
      <div className="topic-bars">
        {topicCounts.map(([topic, count]) => (
          <div key={topic} className="topic-bar">
            <div className="topic-bar-label">{topic}</div>
            <div className="topic-bar-track">
              <div className="topic-bar-fill" style={{width: `${(count / maxCount) * 100}%`}}/>
            </div>
            <div className="topic-bar-count">{count}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= Tweaks ================= */
function TweaksUI({ tweaks, setTweak }) {
  if (!window.TweaksPanel) return null;
  const { TweaksPanel, TweakSection, TweakRadio } = window;

  return (
    <TweaksPanel>
      <TweakSection label="Palette"/>
      <TweakRadio
        label="Accent"
        value={tweaks.palette}
        onChange={v => setTweak("palette", v)}
        options={["peach", "sage", "sand", "lilac", "sky"]}
      />
      <TweakSection label="Density"/>
      <TweakRadio
        label="Spacing"
        value={tweaks.density}
        onChange={v => setTweak("density", v)}
        options={["airy", "compact"]}
      />
      <TweakSection label="Home layout"/>
      <TweakRadio
        label="Layout"
        value={tweaks.layout}
        onChange={v => setTweak("layout", v)}
        options={["focus", "split", "timeline"]}
      />
    </TweaksPanel>
  );
}

/* ================= App ================= */
const DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "sage",
  "density": "compact",
  "layout": "focus"
}/*EDITMODE-END*/;

function App() {
  const [route, setRoute] = useState("home");
  const [theme, setTheme] = useState("light");
  const [bookmarks, setBookmarks] = useState(USER.bookmarkedIds);
  const [tweaks, setTweak] = window.useTweaks(DEFAULTS);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("data-palette", tweaks.palette);
    document.documentElement.setAttribute("data-density", tweaks.density);
  }, [theme, tweaks.palette, tweaks.density]);

  const toggleBookmark = (id) => {
    setBookmarks(b => b.includes(id) ? b.filter(x => x !== id) : [...b, id]);
  };

  const openReport = (id) => {
    // For this design, clicking an archive item jumps back to home view of it
    // (in a real app we'd have a /report/:id route; kept minimal here)
    if (id === REPORTS[0].id) setRoute("home");
    else {
      // simulate: pop an alert via subtle shake — actually just go to home
      setRoute("home");
    }
  };

  let content;
  if (route === "home") content = <Home layout={tweaks.layout} bookmarks={bookmarks} toggleBookmark={toggleBookmark} setRoute={setRoute}/>;
  else if (route === "archive") content = <Archive bookmarks={bookmarks} toggleBookmark={toggleBookmark} onOpen={openReport}/>;
  else if (route === "commission") content = <Commission/>;
  else if (route === "bookmarks") content = <Bookmarks bookmarks={bookmarks} toggleBookmark={toggleBookmark} onOpen={openReport}/>;
  else if (route === "stats") content = <Stats/>;

  return (
    <div className="app">
      <Sidebar route={route} setRoute={setRoute} theme={theme} setTheme={setTheme} bookmarks={bookmarks}/>
      <main className="main" key={route}>
        {content}
      </main>
      <TweaksUI tweaks={tweaks} setTweak={setTweak}/>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
