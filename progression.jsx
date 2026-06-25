/* progression.jsx — Student Progression (Insights)
   Super-Admin lens on the whole base. Filter by State → School → Grade → Subject.
   Distribution clubs Subject + Grade against Level (how many learners in each Grade
   sit at each Level, per Subject). Roster is grouped (by Grade or Subject) so it
   reads top-to-bottom instead of as a flat list. Drills into the Student Dashboard. */
const { useState: useStateProg, useMemo: useMemoProg } = React;

function progHash(id, n) { let h = 0; for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0; return h % n; }
function levelNum(level) { return parseInt(String(level).replace(/\D/g, ""), 10) || 1; }

function buildStateMap() {
  const cityState = {}; (window.CITIES || []).forEach(c => { cityState[c.name] = c.state; });
  const map = {}; (window.SCHOOLS || []).forEach(s => { map[s.name] = cityState[s.city] || "—"; });
  return map;
}

const PROG_ACTIVITIES = {
  Maths:   [["video", "Rhyme Time"], ["game", "Count & Fill"], ["game", "Number Line"], ["video", "Let us Learn"], ["game", "Pop the Balloon"], ["game", "Sort It"]],
  English: [["video", "Story Time"], ["game", "Blending Game"], ["game", "Reorder Letters"], ["video", "Read With Me"], ["game", "Tap & Speak"], ["game", "Match It"]],
  Tamil:   [["video", "Letter–Sound"], ["game", "Sort It"], ["game", "Trace It"], ["video", "Read With Me"], ["game", "Reorder Sentence"], ["game", "Sign Drop"]],
};

function progressionFor(st) {
  const j = (window.JOURNEYS || []).find(x => x.subject === st.subject && x.grade === st.level);
  const totalWeeks = (j && j.weeks) || 6;
  const journeyName = (j && j.name) || (st.subject + " Journey");
  const weekNum = Math.min(totalWeeks, Math.max(1, Math.round((st.completion / 100) * totalWeeks) || 1));
  const sNum = progHash(st.id, 3) + 1;
  const sessionType = sNum === 3 ? "Revision" : "Teaching";
  const pool = PROG_ACTIVITIES[st.subject] || PROG_ACTIVITIES.Maths;
  const [actKind, actName] = pool[progHash(st.id + "a", pool.length)];
  const latest = Math.max(18, Math.min(99, st.completion + (st.risk ? -14 : 6) - (progHash(st.id + "s", 9) - 4)));
  const status = st.risk ? "risk" : st.completion >= 85 ? "ahead" : "ontrack";
  return { journeyName, totalWeeks, weekNum, sNum, sessionType, actKind, actName, latest, status };
}

const PROG_STATUS = {
  ahead:   { label: "Ahead",    fg: "var(--good)",      bg: "var(--st-approve-bg)" },
  ontrack: { label: "On track", fg: "var(--st-submit)", bg: "var(--st-submit-bg)" },
  risk:    { label: "At risk",  fg: "var(--bad)",       bg: "var(--st-revise-bg)" },
};
const SUBJECT_ORDER = ["Maths", "English", "Tamil"];

function MiniRing({ pct, color, size = 36 }) {
  const r = (size - 6) / 2, c = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-3)" strokeWidth="4" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}><span className="mono" style={{ fontSize: 10.5, fontWeight: 700 }}>{pct}</span></div>
    </div>
  );
}

function Filter({ label, value, onChange, options, allLabel }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 130, flex: "1 1 130px" }}>
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--ink-4)" }}>{label}</span>
      <select className="sel" style={{ height: 34 }} value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="All">{allLabel || ("All " + label.toLowerCase())}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}

/* Distribution — clubs Subject + Grade against Level.
   Reads as: "in <Subject>, <Grade> has N learners at <Level>." */
function DistClub({ students, gradeOrder }) {
  const maxLevel = Math.max(...SUBJECT_ORDER.map(s => (window.SUBJECT_LEVELS && window.SUBJECT_LEVELS[s]) || 3));
  const levels = Array.from({ length: maxLevel }, (_, i) => i + 1);
  const subjects = SUBJECT_ORDER.filter(s => students.some(x => x.subject === s));
  let peak = 1;
  const data = subjects.map(subj => {
    const ceiling = (window.SUBJECT_LEVELS && window.SUBJECT_LEVELS[subj]) || 3;
    const grades = gradeOrder.filter(g => students.some(x => x.subject === subj && x.grade === g));
    const rows = grades.map(g => {
      const cells = levels.map(L => students.filter(x => x.subject === subj && x.grade === g && levelNum(x.level) === L).length);
      cells.forEach(c => { if (c > peak) peak = c; });
      return { grade: g, cells, total: cells.reduce((a, b) => a + b, 0) };
    });
    return { subj, ceiling, rows, total: rows.reduce((a, r) => a + r.total, 0) };
  });
  if (!subjects.length) return <div className="dim" style={{ fontSize: 12.5, padding: "10px 0" }}>No learners match these filters.</div>;
  const colTotals = levels.map((_, ci) => students.filter(x => levelNum(x.level) === ci + 1).length);

  return (
    <div style={{ overflowX: "auto" }}>
      <table className="dist-table dist-club">
        <thead>
          <tr>
            <th style={{ textAlign: "left", minWidth: 96 }}>Subject</th>
            <th style={{ textAlign: "left", minWidth: 96 }}>Grade</th>
            {levels.map(L => <th key={L}>Level {L}</th>)}
            <th style={{ borderLeft: "1px solid var(--hair)" }}>Total</th>
          </tr>
        </thead>
        {data.map(d => {
          const c = window.SUBJECTS[d.subj].color;
          return (
            <tbody key={d.subj} className="dist-group">
              {d.rows.map((r, ri) => (
                <tr key={r.grade}>
                  {ri === 0 && (
                    <td rowSpan={d.rows.length} className="dist-subj" style={{ background: `color-mix(in oklab, ${c}, var(--surface) 90%)`, borderLeft: "3px solid " + c }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-start" }}>
                        <window.SubjectChip subject={d.subj} sm />
                        <span className="mono dim" style={{ fontSize: 10.5 }}>{d.total} learners</span>
                      </div>
                    </td>
                  )}
                  <td style={{ textAlign: "left", fontWeight: 600 }}>{r.grade}</td>
                  {r.cells.map((n, ci) => {
                    const na = ci + 1 > d.ceiling;
                    return (
                      <td key={ci} style={{
                        background: na ? "repeating-linear-gradient(45deg, var(--surface), var(--surface) 4px, var(--surface-2) 4px, var(--surface-2) 8px)"
                          : n ? `color-mix(in oklab, ${c}, var(--surface) ${100 - Math.round(20 + 55 * n / peak)}%)` : "var(--surface)",
                        color: na ? "var(--ink-4)" : n ? (n / peak > 0.55 ? "#fff" : "var(--ink)") : "var(--ink-4)",
                        fontWeight: n && !na ? 700 : 400 }} className="mono">{na ? "" : (n || "·")}</td>
                    );
                  })}
                  <td className="mono" style={{ fontWeight: 700, borderLeft: "1px solid var(--hair)" }}>{r.total}</td>
                </tr>
              ))}
            </tbody>
          );
        })}
        <tfoot>
          <tr>
            <td colSpan={2} style={{ textAlign: "left", fontWeight: 700, color: "var(--ink-3)" }}>All learners</td>
            {colTotals.map((n, ci) => <td key={ci} className="mono" style={{ fontWeight: 700, color: "var(--ink-3)" }}>{n || "·"}</td>)}
            <td className="mono" style={{ fontWeight: 800, borderLeft: "1px solid var(--hair)" }}>{colTotals.reduce((a, b) => a + b, 0)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

function StudentProgression({ onOpenStudent }) {
  const all = window.STUDENTS || [];
  const stateMap = useMemoProg(buildStateMap, []);
  const withState = useMemoProg(() => all.map(s => ({ ...s, state: stateMap[s.school] || "—" })), [all, stateMap]);
  const gradeOrder = window.GRADES || [];

  const [stateF, setStateF] = useStateProg("All");
  const [schoolF, setSchoolF] = useStateProg("All");
  const [gradeF, setGradeF] = useStateProg("All");
  const [subjectF, setSubjectF] = useStateProg("All");
  const [statusF, setStatusF] = useStateProg("All");
  const [q, setQ] = useStateProg("");
  const [groupBy, setGroupBy] = useStateProg("grade"); // roster grouping: "grade" | "subject"

  const stateOpts = useMemoProg(() => [...new Set(withState.map(s => s.state))].sort(), [withState]);
  const schoolOpts = useMemoProg(() => [...new Set(withState.filter(s => stateF === "All" || s.state === stateF).map(s => s.school))].sort(), [withState, stateF]);
  const gradeOpts = useMemoProg(() => gradeOrder.filter(g => withState.some(s => s.grade === g)), [withState]);
  const subjectOpts = SUBJECT_ORDER;
  const setState = (v) => { setStateF(v); setSchoolF("All"); };

  const rows = useMemoProg(() => withState.map(st => ({ st, p: progressionFor(st) })), [withState]);
  const filtered = rows.filter(({ st, p }) =>
    (stateF === "All" || st.state === stateF) &&
    (schoolF === "All" || st.school === schoolF) &&
    (gradeF === "All" || st.grade === gradeF) &&
    (subjectF === "All" || st.subject === subjectF) &&
    (statusF === "All" || p.status === statusF) &&
    (!q || st.name.toLowerCase().includes(q.toLowerCase()) || st.school.toLowerCase().includes(q.toLowerCase())));
  const fStudents = filtered.map(r => r.st);

  const inRevision = filtered.filter(r => r.p.sessionType === "Revision").length;
  const atRisk = filtered.filter(r => r.p.status === "risk").length;
  const avgLevel = (fStudents.reduce((a, s) => a + levelNum(s.level), 0) / (fStudents.length || 1)).toFixed(1);
  const hasFilters = stateF !== "All" || schoolF !== "All" || gradeF !== "All" || subjectF !== "All" || statusF !== "All" || q;
  const clearAll = () => { setStateF("All"); setSchoolF("All"); setGradeF("All"); setSubjectF("All"); setStatusF("All"); setQ(""); };

  // group roster rows so the list reads in order rather than as a flat dump
  const groups = useMemoProg(() => {
    const keyer = groupBy === "subject" ? (r) => r.st.subject : (r) => r.st.grade;
    const order = groupBy === "subject" ? SUBJECT_ORDER : gradeOrder;
    const buckets = {};
    filtered.forEach(r => { const k = keyer(r); (buckets[k] = buckets[k] || []).push(r); });
    const within = groupBy === "subject"
      ? (a, b) => (gradeOrder.indexOf(a.st.grade) - gradeOrder.indexOf(b.st.grade)) || a.st.name.localeCompare(b.st.name)
      : (a, b) => (SUBJECT_ORDER.indexOf(a.st.subject) - SUBJECT_ORDER.indexOf(b.st.subject)) || a.st.name.localeCompare(b.st.name);
    return order.filter(k => buckets[k]).map(k => ({ key: k, items: buckets[k].sort(within) }));
  }, [filtered, groupBy, gradeOrder]);

  return (
    <div className="page page-anim wide">
      <div className="page-head">
        <div><h1>Student Progression</h1><p>Filter across the whole base, see how learners spread across Levels by Subject &amp; Grade, then track exactly where each one is right now.</p></div>
      </div>

      {/* filter bar */}
      <div className="card card-pad" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
          <Filter label="State" value={stateF} onChange={setState} options={stateOpts} />
          <Filter label="School" value={schoolF} onChange={setSchoolF} options={schoolOpts} />
          <Filter label="Grade" value={gradeF} onChange={setGradeF} options={gradeOpts} />
          <Filter label="Subject" value={subjectF} onChange={setSubjectF} options={subjectOpts} />
          <label style={{ display: "flex", flexDirection: "column", gap: 4, flex: "2 1 200px" }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--ink-4)" }}>Search</span>
            <div className="searchbox" style={{ height: 34, maxWidth: "none" }}><window.IcSearch style={{ width: 15, height: 15 }} /><input placeholder="Student or school…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
          </label>
          {hasFilters && <button className="btn btn-ghost btn-sm" style={{ height: 34 }} onClick={clearAll}><window.IcX style={{ width: 14, height: 14 }} />Clear</button>}
        </div>
      </div>

      <div className="kpi-row">
        <div className="kpi accent-pri"><div className="k-label"><window.IcUsers style={{ width: 14, height: 14 }} />Learners in view</div><div className="k-num mono">{filtered.length}</div><div className="k-sub">of {all.length} total</div></div>
        <div className="kpi accent-maths"><div className="k-label"><window.IcLayers style={{ width: 14, height: 14 }} />Avg subject level</div><div className="k-num mono">{avgLevel}</div><div className="k-sub">placement depth</div></div>
        <div className="kpi accent-tamil"><div className="k-label"><window.IcRepo style={{ width: 14, height: 14 }} />In revision week</div><div className="k-num mono">{inRevision}</div><div className="k-sub">Session 3 learners</div></div>
        <div className="kpi accent-bad"><div className="k-label"><window.IcWorkflow style={{ width: 14, height: 14 }} />Need attention</div><div className="k-num mono" style={{ color: "var(--bad)" }}>{atRisk}</div><div className="k-sub">at-risk learners</div></div>
      </div>

      {/* distribution: Subject × Grade × Level */}
      <div className="card card-pad" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
          <window.IcLayers style={{ width: 16, height: 16, color: "var(--pri)" }} />
          <div style={{ fontSize: 13.5, fontWeight: 720 }}>Level distribution — by Subject &amp; Grade</div>
        </div>
        <div className="dim" style={{ fontSize: 11.5, marginBottom: 14 }}>How many learners in each <b>Grade</b> sit at each <b>Level</b>, per <b>Subject</b>{hasFilters ? " (filtered)" : ""}. Darker = more learners; hatched cells = Level not offered for that subject.</div>
        <DistClub students={fStudents} gradeOrder={gradeOrder} />
      </div>

      {/* roster — grouped */}
      <div className="toolbar">
        <span className="dim" style={{ fontSize: 11.5, fontWeight: 600 }}>Group by</span>
        <div className="seg">
          {[["grade", "Grade"], ["subject", "Subject"]].map(([k, l]) => <button key={k} className={groupBy === k ? "on" : ""} onClick={() => setGroupBy(k)}>{l}</button>)}
        </div>
        <div className="seg" style={{ marginLeft: 8 }}>
          {[["All", "All"], ["ahead", "Ahead"], ["ontrack", "On track"], ["risk", "At risk"]].map(([k, l]) => <button key={k} className={statusF === k ? "on" : ""} onClick={() => setStatusF(k)}>{l}</button>)}
        </div>
        <span className="dim" style={{ fontSize: 11.5, marginLeft: "auto" }}>{filtered.length} learner{filtered.length === 1 ? "" : "s"}</span>
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="prog-table">
            <thead>
              <tr>
                <th style={{ minWidth: 220 }}>Student</th>
                <th>Subject · Level</th>
                <th style={{ minWidth: 210 }}>Phase — Journey · Week · Session</th>
                <th>Currently taking</th>
                <th style={{ textAlign: "center" }}>Score</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {groups.map(g => {
                const isSubj = groupBy === "subject";
                const headColor = isSubj ? window.SUBJECTS[g.key].color : "var(--pri)";
                const grpRisk = g.items.filter(r => r.p.status === "risk").length;
                return (
                  <React.Fragment key={g.key}>
                    <tr className="prog-group">
                      <td colSpan={7} style={{ borderLeft: "3px solid " + headColor }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 9, flexWrap: "wrap" }}>
                          {isSubj ? <window.SubjectChip subject={g.key} sm /> : <span className="chip" style={{ height: 21, fontSize: 11, fontWeight: 700, background: "var(--pri-soft)", color: "var(--pri-ink)" }}>{g.key}</span>}
                          <span className="mono" style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)" }}>{g.items.length} learner{g.items.length === 1 ? "" : "s"}</span>
                          {grpRisk > 0 && <span style={{ fontSize: 10.5, fontWeight: 700, color: "var(--bad)", display: "inline-flex", alignItems: "center", gap: 4 }}><span style={{ width: 6, height: 6, borderRadius: 99, background: "var(--bad)" }}></span>{grpRisk} at risk</span>}
                        </span>
                      </td>
                    </tr>
                    {g.items.map(({ st, p }) => {
                      const subjColor = window.SUBJECTS[st.subject].color;
                      const ss = PROG_STATUS[p.status];
                      return (
                        <tr key={st.id} onClick={() => onOpenStudent && onOpenStudent(st)} className="prog-row">
                          <td style={{ boxShadow: "inset 3px 0 0 " + subjColor.replace(")", " / 0.55)") }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                              <span style={{ padding: 2, borderRadius: 99, background: subjColor.replace(")", " / 0.15)"), flexShrink: 0, display: "grid" }}><window.Avatar name={st.name} size={32} /></span>
                              <div style={{ minWidth: 0 }}>
                                <div style={{ fontSize: 13, fontWeight: 650 }}>{st.name}</div>
                                <div className="dim" style={{ fontSize: 10.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 190 }}>{st.school} · {st.state}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                              <window.SubjectChip subject={st.subject} sm />
                              <span style={{ fontSize: 10.5, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: subjColor.replace(")", " / 0.12)"), color: subjColor }}>{st.level}</span>
                            </div>
                          </td>
                          <td>
                            <div style={{ fontSize: 12, fontWeight: 560 }}>{p.journeyName}</div>
                            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 5 }}>
                              {Array.from({ length: p.totalWeeks }).map((_, i) => (
                                <span key={i} title={"Week " + (i + 1)} style={{ width: 13, height: 5, borderRadius: 3,
                                  background: i + 1 <= p.weekNum ? subjColor : "var(--surface-3)",
                                  outline: i + 1 === p.weekNum ? "2px solid " + subjColor.replace(")", " / 0.30)") : "none" }}></span>
                              ))}
                              <span className="mono dim" style={{ fontSize: 10.5, marginLeft: 4 }}>W{p.weekNum}·S{p.sNum}</span>
                              <span className="chip" style={{ height: 17, fontSize: 9.5, padding: "0 6px", background: p.sessionType === "Revision" ? "var(--st-sched-bg)" : "var(--surface-2)", color: p.sessionType === "Revision" ? "var(--st-sched)" : "var(--ink-3)" }}>{p.sessionType}</span>
                            </div>
                          </td>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{ width: 26, height: 26, borderRadius: 7, display: "grid", placeItems: "center", flexShrink: 0,
                                background: p.actKind === "game" ? "var(--pri-soft)" : subjColor.replace(")", " / 0.12)"), color: p.actKind === "game" ? "var(--pri)" : subjColor }}>
                                {p.actKind === "game" ? <window.IcGame style={{ width: 14, height: 14 }} /> : <window.IcVideo style={{ width: 14, height: 14 }} />}
                              </span>
                              <div>
                                <div style={{ fontSize: 12, fontWeight: 560 }}>{p.actName}</div>
                                <div className="dim" style={{ fontSize: 10 }}>{p.actKind === "game" ? "Game" : "Anchor video"}</div>
                              </div>
                            </div>
                          </td>
                          <td><div style={{ display: "grid", placeItems: "center" }}><MiniRing pct={p.latest} color={ss.fg} /></div></td>
                          <td><span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, fontWeight: 700, color: ss.fg }}><span style={{ width: 7, height: 7, borderRadius: 99, background: ss.fg }}></span>{ss.label}</span></td>
                          <td><window.IcChevR style={{ width: 15, height: 15, color: "var(--ink-4)" }} /></td>
                        </tr>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="dim" style={{ padding: 30, textAlign: "center", fontSize: 12.5 }}>No learners match these filters.</div>}
      </div>
      <div className="dim" style={{ fontSize: 11, marginTop: 10 }}>Showing {filtered.length} of {all.length} learners, grouped by {groupBy} · click a row for the full student dashboard.</div>
    </div>
  );
}

window.StudentProgression = StudentProgression;
