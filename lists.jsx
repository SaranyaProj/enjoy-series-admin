/* lists.jsx — Lesson Modules list, Subjects & Courses, lightweight Content Analytics */
const { useState: useStateL } = React;

function ModuleList({ onNew, onOpen }) {
  const [subject, setSubject] = useStateL("All");
  const mods = window.MODULES.filter(m => subject === "All" || m.subject === subject);
  return (
    <div className="page page-anim">
      <div className="page-head">
        <div><h1>Lesson Module Repository</h1><p>A Lesson Module is a single teaching-learning session (20–25 minutes) — the core building block of every Learning Journey. One Lesson Module = one daily session, sequenced by the Content Team from videos, rhyme time, story time, read-with-me, writing practice, games, quizzes and assessments.</p></div>
        <div className="actions">
          <button className="btn"><window.IcUpload style={{ width: 15, height: 15 }} />Bulk upload</button>
          <button className="btn btn-pri" onClick={onNew}><window.IcPlus style={{ width: 16, height: 16 }} />New Lesson Module</button>
        </div>
      </div>
      <div className="kpi-row">
        <div className="kpi"><div className="k-label"><window.IcModule style={{ width: 14, height: 14 }} />Lesson Modules</div><div className="k-num mono">{window.MODULES.length}</div><div className="k-sub">across 3 subjects</div></div>
        <div className="kpi"><div className="k-label"><window.IcCheckCircle style={{ width: 14, height: 14 }} />Published</div><div className="k-num mono">{window.MODULES.filter(m => m.status === "pub").length}</div><div className="k-sub">live for students</div></div>
        <div className="kpi"><div className="k-label"><window.IcClock style={{ width: 14, height: 14 }} />Avg duration</div><div className="k-num mono">23<span style={{ fontSize: 15 }}>m</span></div><div className="k-sub">within target band</div></div>
        <div className="kpi"><div className="k-label"><window.IcWorkflow style={{ width: 14, height: 14 }} />In review</div><div className="k-num mono">{window.MODULES.filter(m => ["review","submit"].includes(m.status)).length}</div><div className="k-sub">awaiting Program Team</div></div>
      </div>
      <div className="toolbar">
        <div className="seg">{["All","Maths","English","Tamil"].map(x => <button key={x} className={subject === x ? "on" : ""} onClick={() => setSubject(x)}>{x}</button>)}</div>
        <div className="searchbox" style={{ minWidth: 200, height: 32, marginLeft: "auto" }}><window.IcSearch style={{ width: 15, height: 15 }} /><input placeholder="Search lesson modules…" /></div>
      </div>
      <div className="card" style={{ overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead><tr style={{ background: "var(--surface-2)", textAlign: "left", color: "var(--ink-3)", fontSize: 11.5 }}>
            {["Lesson Module","Subject","Level","Blocks","Duration","Status","Updated",""].map((h, i) => <th key={i} style={{ padding: "11px 16px", fontWeight: 650 }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {mods.map(m => {
              const s = window.SUBJECTS[m.subject];
              return (
                <tr key={m.id} style={{ borderTop: "1px solid var(--hair)", cursor: "pointer" }} onClick={() => onOpen(m)}
                  onMouseEnter={(e) => e.currentTarget.style.background = "var(--surface-2)"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "12px 16px" }}><div style={{ display: "flex", alignItems: "center", gap: 11 }}><div style={{ width: 32, height: 32, borderRadius: 8, background: s.color.replace(")"," / 0.10)"), color: s.color, display: "grid", placeItems: "center" }}><window.IcModule style={{ width: 17, height: 17 }} /></div><div><b style={{ fontWeight: 650 }}>{m.title}</b><div className="dim" style={{ fontSize: 11 }}>by {m.author}</div></div></div></td>
                  <td style={{ padding: "12px 16px" }}><window.SubjectChip subject={m.subject} sm /></td>
                  <td style={{ padding: "12px 16px", color: "var(--ink-3)" }}>{m.grade}</td>
                  <td style={{ padding: "12px 16px" }} className="mono">{m.blocks}</td>
                  <td style={{ padding: "12px 16px" }}><span className="mono" style={{ color: m.mins > 25 ? "var(--warn)" : "var(--ink-2)" }}>{m.mins}m</span></td>
                  <td style={{ padding: "12px 16px" }}><window.StatusBadge status={m.status} /></td>
                  <td style={{ padding: "12px 16px", color: "var(--ink-4)", fontSize: 12 }}>{m.updated}</td>
                  <td style={{ padding: "12px 6px" }} onClick={(e) => e.stopPropagation()}><window.Menu items={[{ label: "Edit lesson module", icon: window.IcEdit, onClick: () => onOpen(m) }, { label: "Duplicate", icon: window.IcCopy, onClick: () => window.toast("Duplicated") }, { label: "Submit for review", icon: window.IcArrowR, onClick: () => window.toast("Submitted") }, { sep: true }, { label: "Archive", icon: window.IcArchive, danger: true, onClick: () => window.toast("Archived") }]} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Subjects() {
  const subs = [
    { name: "Mathematics", code: "MATH", subject: "Maths", grades: "KG–G5", courses: 4, modules: 38, objectives: 26 },
    { name: "English", code: "ENG", subject: "English", grades: "G1–G5", courses: 3, modules: 31, objectives: 22 },
    { name: "Tamil", code: "TAM", subject: "Tamil", grades: "G1–G5", courses: 3, modules: 24, objectives: 19 },
  ];
  return (
    <div className="page page-anim">
      <div className="page-head">
        <div><h1>Subjects &amp; Courses</h1><p>The top of the content architecture. Subjects hold Courses → Units → Lesson Modules. Defined by the Content Team.</p></div>
        <div className="actions"><button className="btn"><window.IcPlus style={{ width: 15, height: 15 }} />New Subject</button><button className="btn btn-pri"><window.IcPlus style={{ width: 16, height: 16 }} />New Course</button></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
        {subs.map(sb => {
          const s = window.SUBJECTS[sb.subject];
          return (
            <div key={sb.code} className="card card-pad">
              <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 14 }}>
                <div style={{ width: 42, height: 42, borderRadius: 11, background: s.color.replace(")"," / 0.10)"), color: s.color, display: "grid", placeItems: "center" }}><window.IcSubject style={{ width: 22, height: 22 }} /></div>
                <div><div style={{ fontSize: 15, fontWeight: 700 }}>{sb.name}</div><div className="dim mono" style={{ fontSize: 11.5 }}>{sb.code} · {sb.grades}</div></div>
                <span className="status s-pub" style={{ marginLeft: "auto" }}><span className="dotc"></span>Active</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {[["Courses", sb.courses], ["Lesson Modules", sb.modules], ["Objectives", sb.objectives]].map(([k, v]) => (
                  <div key={k} style={{ background: "var(--surface-2)", border: "1px solid var(--hair)", borderRadius: "var(--r-sm)", padding: "9px 10px", textAlign: "center" }}>
                    <div className="mono" style={{ fontSize: 19, fontWeight: 740 }}>{v}</div><div className="dim" style={{ fontSize: 10.5 }}>{k}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ContentAnalytics() {
  const top = window.GAMES.filter(g => g.plays > 0).sort((a, b) => b.plays - a.plays).slice(0, 6);
  const maxPlays = Math.max(...top.map(g => g.plays));
  return (
    <div className="page page-anim">
      <div className="page-head">
        <div><h1>Content Usage Analytics</h1><p>Content-centric metrics to inform improvement — how many classes use each asset, completion rates, and average game level reached.</p></div>
        <div className="actions"><button className="btn"><window.IcUpload style={{ width: 15, height: 15 }} />Export</button></div>
      </div>
      <div className="kpi-row">
        <div className="kpi"><div className="k-label"><window.IcEye style={{ width: 14, height: 14 }} />Total plays</div><div className="k-num mono">42.8k</div><div className="k-sub"><span className="up">↑ 9%</span> vs last week</div></div>
        <div className="kpi"><div className="k-label"><window.IcCheckCircle style={{ width: 14, height: 14 }} />Avg completion</div><div className="k-num mono">87<span style={{ fontSize: 15 }}>%</span></div><div className="k-sub">across published modules</div></div>
        <div className="kpi"><div className="k-label"><window.IcLayers style={{ width: 14, height: 14 }} />Avg level reached</div><div className="k-num mono">2.4</div><div className="k-sub">of 3 levels</div></div>
        <div className="kpi"><div className="k-label"><window.IcUsers style={{ width: 14, height: 14 }} />Classes engaged</div><div className="k-num mono">128</div><div className="k-sub">this term</div></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 14 }}>
        <div className="card card-pad">
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16 }}>Most-played games</div>
          {top.map(g => { const s = window.SUBJECTS[g.subject]; return (
            <div key={g.id} style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 13 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: s.color.replace(")"," / 0.10)"), display: "grid", placeItems: "center", flexShrink: 0 }}><window.GameGlyph typeId={g.type} size={16} color={s.color} /></div>
              <div style={{ minWidth: 130, flexShrink: 0 }}><div style={{ fontSize: 12.5, fontWeight: 600 }}>{g.name}</div><div className="dim" style={{ fontSize: 10.5 }}>{g.subject}</div></div>
              <div style={{ flex: 1, height: 8, background: "var(--surface-3)", borderRadius: 99 }}><div style={{ width: (g.plays / maxPlays * 100) + "%", height: "100%", background: s.color, borderRadius: 99 }}></div></div>
              <span className="mono dim" style={{ fontSize: 11.5, width: 44, textAlign: "right" }}>{(g.plays / 1000).toFixed(1)}k</span>
            </div>
          ); })}
        </div>
        <div className="card card-pad">
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16 }}>Most-missed items</div>
          {[["Place value: 3-digit","Maths","48%"],["Synonym: 'rapid'","Tamil","44%"],["Spell: 'beautiful'","English","41%"],["Compare: 89 vs 98","Maths","37%"],["Blend: 5 phonemes","Tamil","33%"]].map(([t, sub, pct], i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 13 }}>
              <window.SubjectChip subject={sub} sm />
              <span style={{ fontSize: 12.5, fontWeight: 550 }}>{t}</span>
              <span className="mono" style={{ marginLeft: "auto", fontSize: 12.5, fontWeight: 650, color: "var(--bad)" }}>{pct}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

window.ModuleList = ModuleList;
window.Subjects = Subjects;
window.ContentAnalytics = ContentAnalytics;
