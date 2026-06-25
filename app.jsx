/* app.jsx — Enjoy Series LMS Admin App shell: role switcher, tailored sidebars, routing, tweaks */
const { useState: useStateApp, useEffect: useEffectApp, useRef: useRefApp } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "density": "comfortable",
  "navStyle": "labels",
  "canvasStyle": "timeline",
  "accent": "#5848d6"
}/*EDITMODE-END*/;

/* ---------- Content Team dashboard ---------- */
function ContentDashboard({ go }) {
  const recent = window.MODULES.slice(0, 3);
  return (
    <div className="page page-anim">
      <div className="page-head">
        <div><h1>Good afternoon, Priya</h1><p>Here's your Content Studio at a glance. You have 2 items awaiting review and 1 needing revision.</p></div>
        <div className="actions">
          <button className="btn" onClick={() => go("repository")}><window.IcGame style={{ width: 15, height: 15 }} />New Game</button>
          <button className="btn btn-pri" onClick={() => go("modules", "build")}><window.IcPlus style={{ width: 16, height: 16 }} />New Lesson Module</button>
        </div>
      </div>
      <div className="kpi-row">
        <div className="kpi"><div className="k-label"><window.IcModule style={{ width: 14, height: 14 }} />Lesson Modules</div><div className="k-num mono">5</div><div className="k-sub">2 in review</div></div>
        <div className="kpi"><div className="k-label"><window.IcGame style={{ width: 14, height: 14 }} />Games</div><div className="k-num mono">16</div><div className="k-sub"><span className="up">11 live</span> · reusable</div></div>
        <div className="kpi"><div className="k-label"><window.IcJourney style={{ width: 14, height: 14 }} />Journeys</div><div className="k-num mono">12</div><div className="k-sub">+ 1 diagnostic</div></div>
        <div className="kpi"><div className="k-label"><window.IcEye style={{ width: 14, height: 14 }} />Plays this week</div><div className="k-num mono">42.8k</div><div className="k-sub"><span className="up">↑ 9%</span></div></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16 }}>
        <div className="card" style={{ overflow: "hidden" }}>
          <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--hair)", display: "flex", alignItems: "center" }}>
            <b style={{ fontSize: 13.5, fontWeight: 700 }}>Continue editing</b>
            <button className="btn btn-ghost btn-sm" style={{ marginLeft: "auto" }} onClick={() => go("modules")}>All modules<window.IcChevR style={{ width: 14, height: 14 }} /></button>
          </div>
          {recent.map(m => { const s = window.SUBJECTS[m.subject]; return (
            <div key={m.id} onClick={() => go("modules", "build")} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderTop: "1px solid var(--hair)", cursor: "pointer" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--surface-2)"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: s.color.replace(")"," / 0.10)"), color: s.color, display: "grid", placeItems: "center" }}><window.IcModule style={{ width: 18, height: 18 }} /></div>
              <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 640 }}>{m.title}</div><div className="dim" style={{ fontSize: 11.5 }}>{m.subject} · {m.grade} · {m.blocks} blocks · {m.mins}m</div></div>
              <window.StatusBadge status={m.status} />
              <span className="dim" style={{ fontSize: 11.5, width: 56, textAlign: "right" }}>{m.updated}</span>
            </div>
          ); })}
        </div>
        <div className="card card-pad">
          <div style={{ display: "flex", alignItems: "center", marginBottom: 14 }}><b style={{ fontSize: 13.5, fontWeight: 700 }}>Needs your attention</b></div>
          <div onClick={() => go("activation")} style={{ display: "flex", gap: 11, padding: "11px 12px", borderRadius: "var(--r-md)", background: "var(--st-revise-bg)", marginBottom: 10, cursor: "pointer" }}>
            <window.IcMsg style={{ width: 18, height: 18, color: "var(--st-revise)", flexShrink: 0, marginTop: 1 }} />
            <div><div style={{ fontSize: 12.5, fontWeight: 650, color: "var(--st-revise)" }}>Revision requested</div><div style={{ fontSize: 11.5, color: "var(--ink-3)" }}>Sentence Basics — "Add audio to options on L2"</div></div>
          </div>
          <div onClick={() => go("activation")} style={{ display: "flex", gap: 11, padding: "11px 12px", borderRadius: "var(--r-md)", background: "var(--st-review-bg)", marginBottom: 10, cursor: "pointer" }}>
            <window.IcClock style={{ width: 18, height: 18, color: "var(--st-review)", flexShrink: 0, marginTop: 1 }} />
            <div><div style={{ fontSize: 12.5, fontWeight: 650, color: "var(--st-review)" }}>2 items in review</div><div style={{ fontSize: 11.5, color: "var(--ink-3)" }}>Shapes & Numerals, Unscramble Animals</div></div>
          </div>
          <div onClick={() => go("contentanalytics")} style={{ display: "flex", gap: 11, padding: "11px 12px", borderRadius: "var(--r-md)", background: "var(--st-sched-bg)", cursor: "pointer" }}>
            <window.IcCheckCircle style={{ width: 18, height: 18, color: "var(--st-sched)", flexShrink: 0, marginTop: 1 }} />
            <div><div style={{ fontSize: 12.5, fontWeight: 650, color: "var(--st-sched)" }}>Scheduled to publish</div><div style={{ fontSize: 11.5, color: "var(--ink-3)" }}>Early Numeracy Foundations — Jun 3</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- role switcher (login simulator) ---------- */
function RoleSwitcher({ role, onSwitch, collapsed }) {
  const [open, setOpen] = useStateApp(false);
  const ref = useRefApp(null);
  useEffectApp(() => {
    if (!open) return;
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);
  const cur = window.ROLES[role];
  return (
    <div style={{ position: "relative", padding: collapsed ? "0 8px 8px" : "0 10px 8px" }} ref={ref}>
      <button onClick={() => setOpen(o => !o)} title="Switch login type"
        style={{ width: "100%", display: "flex", alignItems: "center", gap: 9, padding: collapsed ? "8px 0" : "8px 10px", borderRadius: "var(--r-sm)",
                 border: "1px solid var(--hair)", background: "var(--surface-2)", justifyContent: collapsed ? "center" : "flex-start" }}>
        <span style={{ width: 8, height: 8, borderRadius: 99, background: cur.pillColor, flexShrink: 0 }}></span>
        {!collapsed && <>
          <div style={{ textAlign: "left", lineHeight: 1.2, minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 9.5, color: "var(--ink-4)", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>Login type</div>
            <div style={{ fontSize: 12.5, fontWeight: 650 }}>{cur.label}</div>
          </div>
          <window.IcChevD style={{ width: 14, height: 14, color: "var(--ink-3)" }} />
        </>}
      </button>
      {open && (
        <div style={{ position: "absolute", left: collapsed ? 8 : 10, right: collapsed ? 8 : 10, top: "calc(100% - 2px)", zIndex: 50,
              background: "var(--surface)", border: "1px solid var(--hair)", borderRadius: "var(--r-md)", boxShadow: "var(--sh-pop)", padding: 5, animation: "popIn .14s both" }}>
          {Object.values(window.ROLES).map(r => (
            <button key={r.key} onClick={() => { onSwitch(r.key); setOpen(false); }}
              style={{ display: "flex", alignItems: "center", gap: 9, width: "100%", padding: "8px 9px", border: 0, background: role === r.key ? "var(--surface-2)" : "transparent", borderRadius: 6, textAlign: "left" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--surface-2)"} onMouseLeave={(e) => e.currentTarget.style.background = role === r.key ? "var(--surface-2)" : "transparent"}>
              <span style={{ width: 8, height: 8, borderRadius: 99, background: r.pillColor, flexShrink: 0 }}></span>
              <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 12.5, fontWeight: 650 }}>{r.label}</div><div className="dim" style={{ fontSize: 10.5 }}>{r.user.name}</div></div>
              {role === r.key && <window.IcCheck style={{ width: 14, height: 14, color: "var(--pri)" }} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [role, setRole] = useStateApp("admin");
  const [view, setView] = useStateApp("dashboard");
  const [mode, setMode] = useStateApp(null);
  const [payload, setPayload] = useStateApp(null);
  const [usersTab, setUsersTab] = useStateApp("teachers"); // active Users submenu
  const [openSub, setOpenSub] = useStateApp(null);          // expanded sidebar submenu id
  const [studentReturn, setStudentReturn] = useStateApp("users"); // where the student drill-down returns to

  useEffectApp(() => {
    const r = document.documentElement;
    r.setAttribute("data-density", t.density === "compact" ? "compact" : "comfortable");
    if (t.accent) {
      r.style.setProperty("--pri", t.accent);
      r.style.setProperty("--pri-hover", `color-mix(in oklab, ${t.accent}, #000 14%)`);
      r.style.setProperty("--pri-press", `color-mix(in oklab, ${t.accent}, #000 26%)`);
      r.style.setProperty("--pri-ink", `color-mix(in oklab, ${t.accent}, #000 18%)`);
      r.style.setProperty("--pri-soft", `color-mix(in oklab, ${t.accent}, #fff 90%)`);
      r.style.setProperty("--pri-soft-2", `color-mix(in oklab, ${t.accent}, #fff 80%)`);
    }
  }, [t.density, t.accent]);

  const roleCfg = window.ROLES[role];
  const navFlat = roleCfg.nav.flatMap(g => g.items);

  const switchRole = (r) => { setRole(r); setView("dashboard"); setMode(null); setPayload(null); setOpenSub(null); };
  const go = (v, m = null, p = null) => { setView(v); setMode(m); setPayload(p); setOpenSub(null); document.querySelector(".content")?.scrollTo(0, 0); };
  const goSub = (id, tab) => { setView(id); setMode(null); setPayload(null); setUsersTab(tab); setOpenSub(id); document.querySelector(".content")?.scrollTo(0, 0); };
  const cur = navFlat.find(n => n.id === view) || navFlat[0];
  const collapsed = t.navStyle === "icons";
  const inBuilder = mode === "build";
  const orgReadOnly = role === "program"; // org/users/classes: full for admin, read-only for program

  const renderView = () => {
    // content builders (full screen)
    if (mode === "build") {
      if (view === "modules" || view === "cycle") return <window.ModuleBuilder tweaks={t} prefill={payload} onExit={() => go(view)} />;
      if (view === "repository") return <window.GameBuilder onExit={() => go("repository")} />;
      if (view === "journeys") return <window.JourneyBuilder journey={payload || window.JOURNEYS[0]} onExit={() => go("journeys")} />;
      if (view === "questionbank") return <window.QuestionEditor question={payload} onExit={() => go("questionbank")} />;
      if (view === "diagnostic") return <window.DiagnosticBuilder subject={payload && payload.subject} onExit={() => go("journeys")} />;
    }
    if (view === "student" && payload) return <window.StudentDashboard st={payload} onBack={() => go(studentReturn)} />;

    switch (view) {
      case "dashboard":
        return role === "admin" ? <window.AdminDashboard go={go} /> : role === "program" ? <window.ProgramDashboard go={go} /> : <ContentDashboard go={go} />;
      // Admin / org
      case "organization": return <window.Organization readOnly={orgReadOnly} />;
      case "schoolsetup": return <window.SchoolSetup readOnly={orgReadOnly} />;
      case "users": return <window.Users readOnly={orgReadOnly} tab={usersTab} onTab={setUsersTab} onOpenStudent={(s) => { setStudentReturn("users"); go("student", null, s); }} onPromotions={() => go("promotions")} />;
      case "promotions": return <window.StudentPromotions onBack={() => go("users")} />;
      case "settings": return <window.Settings />;
      case "communication": return <window.Communication role={role} />;
      case "analytics": return <window.Analytics role={role} />;
      case "progression": return <window.StudentProgression onOpenStudent={(s) => { setStudentReturn("progression"); go("student", null, s); }} />;
      // Program
      case "curriculum": return <window.CurriculumAssignment />;
      // Content studio (shared; full for content, read for others)
      case "cycle": return <window.InstructionalCycle onBuildSession={(session, context) => go("cycle", "build", { session, context })} />;
      case "modules": return <window.ModuleList onNew={() => go("modules", "build")} onOpen={(m) => go("modules", "build", m)} />;
      case "repository": return <window.Repository onNewGame={() => go("repository", "build")} />;
      case "questionbank": return <window.QuestionBank onNew={() => go("questionbank", "build")} onOpen={(qq) => go("questionbank", "build", qq)} />;
      case "journeys": return <window.JourneyList onNew={() => go("journeys", "build", { ...window.JOURNEYS[0], stages: [] })} onOpen={(j) => go("journeys", "build", j)} onOpenDiagnostic={(subject) => go("diagnostic", "build", { subject })} />;
      case "subjects": return <window.Subjects />;
      case "activation": return <window.Activation />;
      case "contentanalytics": return <window.ContentAnalytics />;
      default: return <ContentDashboard go={go} />;
    }
  };

  return (
    <div className="app" style={{ gridTemplateColumns: collapsed ? "64px 1fr" : "var(--rail-w) 1fr" }}>
      {/* SIDEBAR */}
      <aside className="rail">
        <div className="rail-head" style={collapsed ? { justifyContent: "center", padding: "16px 0 10px" } : { paddingBottom: 10 }}>
          <div className="brand-mark"><window.IcLayers style={{ width: 17, height: 17 }} /></div>
          {!collapsed && <div className="brand-txt"><b>Enjoy Series</b><span>{roleCfg.subtitle}</span></div>}
        </div>
        <RoleSwitcher role={role} onSwitch={switchRole} collapsed={collapsed} />
        <div className="rail-scroll" style={{ paddingTop: 0 }}>
          {roleCfg.nav.map(g => (
            <div className="nav-group" key={g.group}>
              {!collapsed && <div className="nav-group-label">{g.group}</div>}
              {g.items.map(it => {
                const Ic = window[it.icon];
                const on = view === it.id || (view === "student" && it.id === studentReturn);
                const hasKids = Array.isArray(it.children) && it.children.length > 0;
                const expanded = hasKids && !collapsed && (openSub === it.id || on);
                return (
                  <React.Fragment key={it.id}>
                    <button className={"nav-item" + (on ? " on" : "")}
                      onClick={() => hasKids ? goSub(it.id, on ? usersTab : it.children[0].tab) : go(it.id)}
                      style={collapsed ? { justifyContent: "center", padding: "9px 0" } : null} title={collapsed ? it.label : null}>
                      <Ic />
                      {!collapsed && <>{it.label}
                        {it.count != null && <span className="nav-count">{it.count}</span>}
                        {hasKids && <window.IcChevD style={{ width: 13, height: 13, marginLeft: "auto", color: "var(--ink-4)", transform: expanded ? "none" : "rotate(-90deg)", transition: "transform .15s" }} />}
                      </>}
                    </button>
                    {expanded && it.children.map(c => {
                      const CIc = window[c.icon] || Ic;
                      const childOn = on && usersTab === c.tab;
                      return (
                        <button key={c.tab} className={"nav-item" + (childOn ? " on" : "")} onClick={() => goSub(it.id, c.tab)}
                          style={{ paddingLeft: 30, fontSize: 12.5 }}>
                          <CIc style={{ width: 15, height: 15 }} />{c.label}
                        </button>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </div>
          ))}
        </div>
        <div className="rail-foot">
          <div className="user-chip">
            <window.Avatar name={roleCfg.user.name} bg={roleCfg.user.bg} />
            {!collapsed && <><div className="user-meta"><b>{roleCfg.user.name}</b><span>{roleCfg.user.email}</span></div><span className="role-pill" style={{ background: roleCfg.pillBg, color: roleCfg.pillColor }}>{roleCfg.pill}</span></>}
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div className="main">
        {!inBuilder && (
          <div className="topbar">
            <div className="crumbs">
              {cur.crumb && <><span>{cur.crumb}</span><window.IcChevR className="sep" style={{ width: 14, height: 14 }} /></>}
              <b>{cur.label}</b>
            </div>
            <div className="topbar-spacer"></div>
            <div className="searchbox"><window.IcSearch style={{ width: 15, height: 15 }} /><input placeholder="Search…" /><kbd>⌘K</kbd></div>
            <button className="icon-btn"><window.IcBell style={{ width: 17, height: 17 }} /><span className="dot"></span></button>
          </div>
        )}
        <div className="content" style={inBuilder ? { overflow: "hidden" } : null}>
          {renderView()}
        </div>
      </div>

      {/* TWEAKS */}
      <TweaksPanel>
        <TweakSection label="Layout" />
        <TweakRadio label="Sidebar density" value={t.density} options={["compact", "comfortable"]} onChange={(v) => setTweak("density", v)} />
        <TweakRadio label="Nav style" value={t.navStyle} options={["labels", "icons"]} onChange={(v) => setTweak("navStyle", v)} />
        <TweakSection label="Lesson Module Builder" />
        <TweakRadio label="Canvas layout" value={t.canvasStyle} options={["timeline", "flow"]} onChange={(v) => setTweak("canvasStyle", v)} />
        <TweakSection label="Theme" />
        <TweakColor label="Accent" value={t.accent} options={["#5848d6", "#2563c9", "#0d8f6f", "#c2532b"]} onChange={(v) => setTweak("accent", v)} />
      </TweaksPanel>

      <window.ToastHost />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
