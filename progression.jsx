/* progression.jsx — Student Progression (Insights)
   Super-Admin lens on the whole base. Filter by State → School → Grade → Subject.
   Every learner is tracked across ALL THREE subjects at once — a child can be at
   Maths Level 1 / Week 2 while sitting at Tamil Level 1 / Week 4. The roster shows
   each child once with their Maths, English and Tamil progress side by side; the
   distribution clubs Subject + Grade against Level. Drills into the Student Dashboard. */
const { useState: useStateProg, useMemo: useMemoProg } = React;
const SUBJECT_ORDER = ["Maths", "English", "Tamil"];

function progHash(id, n) { let h = 0; for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0; return h % n; }
function levelNum(level) { return parseInt(String(level).replace(/\D/g, ""), 10) || 1; }
function ceilingFor(subject) { return (window.SUBJECT_LEVELS && window.SUBJECT_LEVELS[subject]) || 3; }

function buildStateMap() {
  const cityState = {}; (window.CITIES || []).forEach(c => { cityState[c.name] = c.state; });
  const map = {}; (window.SCHOOLS || []).forEach(s => { map[s.name] = cityState[s.city] || "—"; });
  return map;
}

const PROG_STATUS = {
  ahead:   { label: "Ahead",    fg: "var(--good)",      bg: "var(--st-approve-bg)" },
  ontrack: { label: "On track", fg: "var(--st-submit)", bg: "var(--st-submit-bg)" },
  risk:    { label: "At risk",  fg: "var(--bad)",       bg: "var(--st-revise-bg)" },
};

/* a learner's level in one subject — anchored to their seed subject, synthesised for the rest */
function subjLevel(st, subject) {
  const ceiling = ceilingFor(subject);
  if (subject === st.subject) return Math.min(ceiling, levelNum(st.level));
  const gradeNum = ((window.GRADES || []).indexOf(st.grade) + 1) || 1;
  const base = Math.min(ceiling, Math.max(1, Math.round(gradeNum * ceiling / 5)));
  return Math.min(ceiling, Math.max(1, base + (progHash(st.id + subject, 3) - 1)));
}

/* full per-subject progression record (deterministic from the student id) */
function subjProg(st, subject) {
  const lvl = subjLevel(st, subject);
  const level = "Level " + lvl;
  const j = (window.JOURNEYS || []).find(x => x.subject === subject && x.grade === level);
  const totalWeeks = (j && j.weeks) || 6;
  const journeyName = (j && j.name) || (subject + " Journey");
  const base = subject === st.subject ? st.completion : 30 + progHash(st.id + subject + "c", 60);
  const score = Math.max(15, Math.min(99, base + (progHash(st.id + subject + "s", 11) - 5)));
  const weekNum = Math.min(totalWeeks, Math.max(1, Math.round(base / 100 * totalWeeks) || 1));
  const sNum = progHash(st.id + subject + "x", 3) + 1;
  const sessionType = sNum === 3 ? "Revision" : "Teaching";
  const status = score >= 85 ? "ahead" : score < 55 ? "risk" : "ontrack";
  return { lvl, level, totalWeeks, journeyName, score, weekNum, sNum, sessionType, status };
}

function Filter({ label, value, onChange, options }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 130, flex: "1 1 130px" }}>
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--ink-4)" }}>{label}</span>
      <select className="sel" style={{ height: 34 }} value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="All">{"All " + label.toLowerCase()}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}

/* one subject's progress inside a roster row */
function SubjCell({ subject, pg }) {
  const color = window.SUBJECTS[subject].color;
  const ss = PROG_STATUS[pg.status];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <span style={{ fontSize: 10.5, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: color.replace(")", " / 0.12)"), color: color }}>{pg.level}</span>
        <span className="mono" style={{ fontSize: 11.5, fontWeight: 700, color: ss.fg }}>{pg.score}%</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span className="mono" style={{ fontSize: 10.5, color: "var(--ink-3)", fontWeight: 600 }}>W{pg.weekNum}·S{pg.sNum}</span>
        <span className="chip" style={{ height: 16, fontSize: 9, padding: "0 6px", background: pg.sessionType === "Revision" ? "var(--st-sched-bg)" : "var(--surface-2)", color: pg.sessionType === "Revision" ? "var(--st-sched)" : "var(--ink-3)" }}>{pg.sessionType}</span>
      </div>
      <div style={{ height: 4, borderRadius: 99, background: "var(--surface-3)", overflow: "hidden" }}>
        <div style={{ width: Math.round(pg.weekNum / pg.totalWeeks * 100) + "%", height: "100%", background: color, borderRadius: 99 }}></div>
      </div>
    </div>
  );
}

/* Distribution — clubs Subject + Grade against Level (counts every learner per subject) */
function DistClub({ students, gradeOrder, subjects }) {
  const maxLevel = Math.max(...SUBJECT_ORDER.map(ceilingFor));
  const levels = Array.from({ length: maxLevel }, (_, i) => i + 1);
  const subs = subjects.filter(s => students.length);
  let peak = 1;
  const data = subs.map(subj => {
    const ceiling = ceilingFor(subj);
    const grades = gradeOrder.filter(g => students.some(x => x.grade === g));
    const rows = grades.map(g => {
      const cells = levels.map(L => students.filter(x => x.grade === g && subjLevel(x, subj) === L).length);
      cells.forEach(c => { if (c > peak) peak = c; });
      return { grade: g, cells, total: cells.reduce((a, b) => a + b, 0) };
    });
    return { subj, ceiling, rows, total: rows.reduce((a, r) => a + r.total, 0) };
  });
  if (!subs.length || !students.length) return <div className="dim" style={{ fontSize: 12.5, padding: "10px 0" }}>No learners match these filters.</div>;
  const colTotals = levels.map((_, ci) => subs.reduce((a, subj) => a + students.filter(x => subjLevel(x, subj) === ci + 1).length, 0));

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
  const [riskOnly, setRiskOnly] = useStateProg(false);
  const [q, setQ] = useStateProg("");
  const [groupBy, setGroupBy] = useStateProg("grade"); // "grade" | "school"

  const stateOpts = useMemoProg(() => [...new Set(withState.map(s => s.state))].sort(), [withState]);
  const schoolOpts = useMemoProg(() => [...new Set(withState.filter(s => stateF === "All" || s.state === stateF).map(s => s.school))].sort(), [withState, stateF]);
  const gradeOpts = useMemoProg(() => gradeOrder.filter(g => withState.some(s => s.grade === g)), [withState]);

  const setState = (v) => { setStateF(v); setSchoolF("All"); };
  const displayedSubjects = subjectF === "All" ? SUBJECT_ORDER : [subjectF];

  // per-student progression across the displayed subjects
  const rows = useMemoProg(() => withState.map(st => {
    const prog = {}; displayedSubjects.forEach(su => { prog[su] = subjProg(st, su); });
    return { st, prog, anyRisk: displayedSubjects.some(su => prog[su].status === "risk") };
  }), [withState, subjectF]);

  const filtered = rows.filter(({ st, anyRisk }) =>
    (stateF === "All" || st.state === stateF) &&
    (schoolF === "All" || st.school === schoolF) &&
    (gradeF === "All" || st.grade === gradeF) &&
    (!riskOnly || anyRisk) &&
    (!q || st.name.toLowerCase().includes(q.toLowerCase()) || st.school.toLowerCase().includes(q.toLowerCase())));
  const fStudents = filtered.map(r => r.st);

  // KPIs over the displayed subjects
  const cells = filtered.flatMap(r => displayedSubjects.map(su => r.prog[su]));
  const avgLevel = (cells.reduce((a, c) => a + c.lvl, 0) / (cells.length || 1)).toFixed(1);
  const inRevision = cells.filter(c => c.sessionType === "Revision").length;
  const atRisk = filtered.filter(r => r.anyRisk).length;
  const hasFilters = stateF !== "All" || schoolF !== "All" || gradeF !== "All" || subjectF !== "All" || riskOnly || q;
  const clearAll = () => { setStateF("All"); setSchoolF("All"); setGradeF("All"); setSubjectF("All"); setRiskOnly(false); setQ(""); };

  // roster grouping
  const groups = useMemoProg(() => {
    const keyer = groupBy === "school" ? (r) => r.st.school : (r) => r.st.grade;
    const order = groupBy === "school" ? [...new Set(filtered.map(r => r.st.school))].sort() : gradeOrder;
    const buckets = {};
    filtered.forEach(r => { const k = keyer(r); (buckets[k] = buckets[k] || []).push(r); });
    Object.values(buckets).forEach(list => list.sort((a, b) => a.st.name.localeCompare(b.st.name)));
    return order.filter(k => buckets[k]).map(k => ({ key: k, items: buckets[k] }));
  }, [filtered, groupBy, gradeOrder]);

  const colW = displayedSubjects.length === 1 ? 260 : 150;

  return (
    <div className="page page-anim wide">
      <div className="page-head">
        <div><h1>Student Progression</h1><p>Every learner, tracked across all three subjects at once — their Level, the week &amp; session they're in, and their latest score in Maths, English and Tamil.</p></div>
      </div>

      {/* filter bar */}
      <div className="card card-pad" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
          <Filter label="State" value={stateF} onChange={setState} options={stateOpts} />
          <Filter label="School" value={schoolF} onChange={setSchoolF} options={schoolOpts} />
          <Filter label="Grade" value={gradeF} onChange={setGradeF} options={gradeOpts} />
          <Filter label="Subject" value={subjectF} onChange={setSubjectF} options={SUBJECT_ORDER} />
          <label style={{ display: "flex", flexDirection: "column", gap: 4, flex: "2 1 200px" }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--ink-4)" }}>Search</span>
            <div className="searchbox" style={{ height: 34, maxWidth: "none" }}><window.IcSearch style={{ width: 15, height: 15 }} /><input placeholder="Student or school…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
          </label>
          {hasFilters && <button className="btn btn-ghost btn-sm" style={{ height: 34 }} onClick={clearAll}><window.IcX style={{ width: 14, height: 14 }} />Clear</button>}
        </div>
      </div>

      <div className="kpi-row">
        <div className="kpi accent-pri"><div className="k-label"><window.IcUsers style={{ width: 14, height: 14 }} />Learners in view</div><div className="k-num mono">{filtered.length}</div><div className="k-sub">of {all.length} total</div></div>
        <div className="kpi accent-maths"><div className="k-label"><window.IcLayers style={{ width: 14, height: 14 }} />Avg level{subjectF !== "All" ? " · " + subjectF : ""}</div><div className="k-num mono">{avgLevel}</div><div className="k-sub">across {displayedSubjects.length === 1 ? subjectF : "all subjects"}</div></div>
        <div className="kpi accent-tamil"><div className="k-label"><window.IcRepo style={{ width: 14, height: 14 }} />In revision week</div><div className="k-num mono">{inRevision}</div><div className="k-sub">subject-tracks at Session 3</div></div>
        <div className="kpi accent-bad"><div className="k-label"><window.IcWorkflow style={{ width: 14, height: 14 }} />Need attention</div><div className="k-num mono" style={{ color: "var(--bad)" }}>{atRisk}</div><div className="k-sub">at risk in a subject</div></div>
      </div>

      {/* distribution: Subject × Grade × Level */}
      <div className="card card-pad" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
          <window.IcLayers style={{ width: 16, height: 16, color: "var(--pri)" }} />
          <div style={{ fontSize: 13.5, fontWeight: 720 }}>Level distribution — by Subject &amp; Grade</div>
        </div>
        <div className="dim" style={{ fontSize: 11.5, marginBottom: 14 }}>How many learners in each <b>Grade</b> sit at each <b>Level</b>, per <b>Subject</b>{hasFilters ? " (filtered)" : ""}. Darker = more learners; hatched cells = Level not offered for that subject.</div>
        <DistClub students={fStudents} gradeOrder={gradeOrder} subjects={displayedSubjects} />
      </div>

      {/* roster — one row per learner, all subjects side by side */}
      <div className="toolbar">
        <span className="dim" style={{ fontSize: 11.5, fontWeight: 600 }}>Group by</span>
        <div className="seg">
          {[["grade", "Grade"], ["school", "School"]].map(([k, l]) => <button key={k} className={groupBy === k ? "on" : ""} onClick={() => setGroupBy(k)}>{l}</button>)}
        </div>
        <div className="seg" style={{ marginLeft: 8 }}>
          <button className={!riskOnly ? "on" : ""} onClick={() => setRiskOnly(false)}>All</button>
          <button className={riskOnly ? "on" : ""} onClick={() => setRiskOnly(true)}>Needs attention</button>
        </div>
        <span className="dim" style={{ fontSize: 11.5, marginLeft: "auto" }}>{filtered.length} learner{filtered.length === 1 ? "" : "s"}</span>
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="prog-table">
            <thead>
              <tr>
                <th style={{ minWidth: 210 }}>Student</th>
                {displayedSubjects.map(su => (
                  <th key={su} style={{ minWidth: colW }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 8, height: 8, borderRadius: 99, background: window.SUBJECTS[su].color }}></span>{su}
                    </span>
                  </th>
                ))}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {groups.map(g => (
                <React.Fragment key={g.key}>
                  <tr className="prog-group">
                    <td colSpan={displayedSubjects.length + 2} style={{ borderLeft: "3px solid var(--pri)" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 9, flexWrap: "wrap" }}>
                        <span className="chip" style={{ height: 21, fontSize: 11, fontWeight: 700, background: "var(--pri-soft)", color: "var(--pri-ink)" }}>{g.key}</span>
                        <span className="mono" style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)" }}>{g.items.length} learner{g.items.length === 1 ? "" : "s"}</span>
                      </span>
                    </td>
                  </tr>
                  {g.items.map(({ st, prog }) => (
                    <tr key={st.id} onClick={() => onOpenStudent && onOpenStudent(st)} className="prog-row">
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                          <window.Avatar name={st.name} size={32} />
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 650 }}>{st.name}</div>
                            <div className="dim" style={{ fontSize: 10.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 180 }}>{st.grade} · {st.school}</div>
                            <div style={{ fontSize: 9.5, color: "var(--ink-4)", marginTop: 1 }}>{st.state}</div>
                          </div>
                        </div>
                      </td>
                      {displayedSubjects.map(su => <td key={su}><SubjCell subject={su} pg={prog[su]} /></td>)}
                      <td><window.IcChevR style={{ width: 15, height: 15, color: "var(--ink-4)" }} /></td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="dim" style={{ padding: 30, textAlign: "center", fontSize: 12.5 }}>No learners match these filters.</div>}
      </div>
      <div className="dim" style={{ fontSize: 11, marginTop: 10 }}>Showing {filtered.length} of {all.length} learners · click a row for the full student dashboard.</div>
    </div>
  );
}

window.StudentProgression = StudentProgression;
