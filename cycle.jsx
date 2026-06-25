/* cycle.jsx — Instructional Cycle browser: Subject → Level → Week → Session → blocks.
   Faithful to the research skeletons; every block shows anchor/mechanic, domain, LO, competencies. */
const { useState: useStateC } = React;

function blockMeta(b) {
  if (b.t === "v") { const a = window.ANCHORS[b.a] || window.ANCHORS.recap; return { kind: "Video", label: a.name, icon: window[a.icon], color: a.color, isGame: false }; }
  const m = window.MECH[b.g] || { name: "Game", type: "dragdrop" };
  return { kind: "Game", label: m.name, type: m.type, color: "var(--pri)", isGame: true };
}

function CompTags({ tags, framework }) {
  if (!tags || !tags.length) return null;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
      {tags.map((t, i) => (
        <span key={i} className="lvl" style={{ fontSize: 10, padding: "1px 5px", background: "var(--pri-soft)", color: "var(--pri-ink)", border: "1px solid var(--pri-soft-2)" }}>{t}</span>
      ))}
    </div>
  );
}

function BlockRow({ b, idx, framework, subjColor }) {
  const m = blockMeta(b);
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 11, padding: "10px 12px", borderRadius: "var(--r-sm)", background: "var(--surface)", border: "1px solid var(--hair)" }}>
      <span className="mono dim" style={{ fontSize: 10.5, width: 18, flexShrink: 0, paddingTop: 8 }}>{String(idx + 1).padStart(2, "0")}</span>
      <div style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0, display: "grid", placeItems: "center",
                    background: m.isGame ? "var(--pri-soft)" : m.color.replace(")", " / 0.10)"), color: m.isGame ? "var(--pri)" : m.color }}>
        {m.isGame ? <window.GameGlyph typeId={m.type} size={17} color="var(--pri)" /> : React.createElement(m.icon, { style: { width: 17, height: 17 } })}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 13, fontWeight: 640 }}>{b.title}</span>
          <span className="chip" style={{ height: 19, fontSize: 10.5, background: m.isGame ? "var(--pri-soft)" : "var(--surface-3)", color: m.isGame ? "var(--pri-ink)" : "var(--ink-2)" }}>{m.isGame ? "🎮 " : "▶ "}{m.label}</span>
          {b.d && <span className="dim" style={{ fontSize: 11 }}>· {b.d}</span>}
        </div>
        {b.lo && <div className="dim" style={{ fontSize: 11.5, marginTop: 3, lineHeight: 1.4 }}>{b.lo}</div>}
        {b.tags && b.tags.length > 0 && <div style={{ marginTop: 6 }}><CompTags tags={b.tags} framework={framework} /></div>}
      </div>
    </div>
  );
}

function SessionCard({ s, framework, subjColor, defaultOpen, onBuild }) {
  const [open, setOpen] = useStateC(defaultOpen);
  const isRev = s.type === "Revision";
  const games = s.blocks.filter(b => b.t === "g").length;
  const vids = s.blocks.filter(b => b.t === "v").length;
  return (
    <div className="card" style={{ overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "12px 15px", cursor: "pointer", background: isRev ? "var(--surface-2)" : "transparent" }} onClick={() => setOpen(o => !o)}>
        <window.IcChevR style={{ width: 16, height: 16, color: "var(--ink-3)", transform: open ? "rotate(90deg)" : "none", transition: "transform .15s", flexShrink: 0 }} />
        <span className="mono" style={{ width: 30, height: 30, borderRadius: 8, display: "grid", placeItems: "center", flexShrink: 0,
              background: subjColor.replace(")", " / 0.10)"), color: subjColor, fontSize: 11, fontWeight: 700 }}>{s.session.replace("Session ", "S")}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 680 }}>{s.session}</span>
            <span className="chip" style={{ height: 19, fontSize: 10.5, background: isRev ? "var(--st-sched-bg)" : "var(--st-approve-bg)", color: isRev ? "var(--st-sched)" : "var(--st-approve)" }}>{s.type}</span>
          </div>
          <div className="dim" style={{ fontSize: 11.5, marginTop: 1 }}>{s.blocks.length} blocks · {vids} videos · {games} games</div>
        </div>
        <button className="btn btn-sm" onClick={(e) => { e.stopPropagation(); onBuild(s); }}><window.IcEdit style={{ width: 14, height: 14 }} />Open in builder</button>
      </div>
      {open && (
        <div style={{ borderTop: "1px solid var(--hair)", padding: 12, background: "var(--surface-2)", display: "flex", flexDirection: "column", gap: 7 }}>
          {s.blocks.map((b, i) => <BlockRow key={i} b={b} idx={i} framework={framework} subjColor={subjColor} />)}
        </div>
      )}
    </div>
  );
}

function InstructionalCycle({ onBuildSession }) {
  const [subject, setSubject] = useStateC("Maths");
  const [levelIdx, setLevelIdx] = useStateC(0);

  const cfg = window.CYCLE[subject];
  const subjColor = window.SUBJECTS[subject].color;
  const level = cfg.levels[Math.min(levelIdx, cfg.levels.length - 1)];

  // totals
  const totalSessions = level.weeks.reduce((a, w) => a + w.sessions.length, 0);
  const totalBlocks = level.weeks.reduce((a, w) => a + w.sessions.reduce((x, s) => x + s.blocks.length, 0), 0);
  const totalGames = level.weeks.reduce((a, w) => a + w.sessions.reduce((x, s) => x + s.blocks.filter(b => b.t === "g").length, 0), 0);

  return (
    <div className="page page-anim">
      <div className="page-head">
        <div>
          <h1>Instructional Cycle</h1>
          <p>The pedagogical skeleton straight from the research: each <b>Level</b> holds themed <b>Weeks</b>, each week runs Teaching sessions plus a Revision session (S3), and every session is an ordered sequence of anchor videos and their adaptive games.</p>
        </div>
        <div className="actions">
          <button className="btn"><window.IcUpload style={{ width: 15, height: 15 }} />Import cycle CSV</button>
          <button className="btn btn-pri" onClick={() => onBuildSession(null, { subject, level: level.level, grade: level.grade })}><window.IcPlus style={{ width: 16, height: 16 }} />New Session</button>
        </div>
      </div>

      {/* subject + level pickers */}
      <div className="toolbar">
        <div className="seg">{["Maths","English","Tamil"].map(s => <button key={s} className={subject === s ? "on" : ""} onClick={() => { setSubject(s); setLevelIdx(0); }}>{s}</button>)}</div>
        <div style={{ width: 1, height: 22, background: "var(--hair)", margin: "0 4px" }}></div>
        <div className="seg">{cfg.levels.map((lv, i) => <button key={i} className={levelIdx === i ? "on" : ""} onClick={() => setLevelIdx(i)}>{lv.level}<span className="mono" style={{ opacity: 0.55, marginLeft: 5, fontSize: 11 }}>{lv.grade.replace("Grade ", "G")}</span></button>)}</div>
      </div>

      {/* level summary */}
      <div className="kpi-row" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        <div className="kpi"><div className="k-label"><window.IcLayers style={{ width: 14, height: 14 }} />Weeks defined</div><div className="k-num mono">{level.weeks.length}</div><div className="k-sub">{level.grade}</div></div>
        <div className="kpi"><div className="k-label"><window.IcModule style={{ width: 14, height: 14 }} />Sessions</div><div className="k-num mono">{totalSessions}</div><div className="k-sub">incl. revision (S3)</div></div>
        <div className="kpi"><div className="k-label"><window.IcGame style={{ width: 14, height: 14 }} />Games</div><div className="k-num mono">{totalGames}</div><div className="k-sub">of {totalBlocks} blocks</div></div>
        <div className="kpi"><div className="k-label"><window.IcTarget style={{ width: 14, height: 14 }} />Framework</div><div className="k-num" style={{ fontSize: 19, marginTop: 8 }}>{cfg.framework === "maths" ? "Number domains" : "L·LC·S·R·Rc·W·G"}</div><div className="k-sub">competency tags</div></div>
      </div>

      {/* weeks */}
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        {level.weeks.map((w, wi) => (
          <div key={wi}>
            <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 12 }}>
              <span style={{ width: 4, height: 28, borderRadius: 99, background: subjColor }}></span>
              <div>
                <div style={{ fontSize: 16, fontWeight: 740, letterSpacing: "-0.01em" }}>{w.week}</div>
                <div className="dim" style={{ fontSize: 12 }}>{w.theme}</div>
              </div>
              <span className="chip mono" style={{ marginLeft: "auto" }}>{w.sessions.length} sessions</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {w.sessions.map((s, si) => (
                <SessionCard key={si} s={s} framework={cfg.framework} subjColor={subjColor} defaultOpen={wi === 0 && si === 0}
                  onBuild={(sess) => onBuildSession(sess, { subject, level: level.level, grade: level.grade, week: w.week, theme: w.theme })} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

window.InstructionalCycle = InstructionalCycle;
window.cycleBlockMeta = blockMeta;
