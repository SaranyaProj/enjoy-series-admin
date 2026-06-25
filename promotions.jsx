/* promotions.jsx — Grade Promotion workflow (end-of-academic-year grade transition).
   Promotes a whole academic grade to the next grade (Grade 1 → Grade 2, …). Every
   student in the grade is selected by default; admins simply uncheck anyone who
   should be held back. The highest grade graduates/archives. This is a school-grade
   transition and is deliberately decoupled from subject learning Levels. */
const { useState: useStateP } = React;

function today() { try { return new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }); } catch (e) { return "today"; } }

function StatPill({ icon, label, value, color, soft }) {
  return (
    <div style={{ flex: 1, minWidth: 140, padding: "13px 15px", borderRadius: "var(--r-lg)", background: soft || "var(--surface)", border: "1px solid var(--hair)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, fontWeight: 650, color: "var(--ink-3)" }}>{icon && React.createElement(icon, { style: { width: 14, height: 14 } })}{label}</div>
      <div className="mono" style={{ fontSize: 25, fontWeight: 760, letterSpacing: "-0.02em", marginTop: 5, color: color || "var(--ink)" }}>{value}</div>
    </div>
  );
}

function StudentPromotions({ onBack }) {
  const years = window.ACADEMIC_YEARS;
  const grades = window.GRADES;
  const topGrade = window.TOP_GRADE;
  const [curAY, setCurAY] = useStateP(years[0]);
  const targetAY = years[Math.min(years.indexOf(curAY) + 1, years.length - 1)];

  // build a working roster from students in the current academic year
  const seed = () => window.STUDENTS.filter(s => s.ay === curAY).map(s => ({
    id: s.id, name: s.name, school: s.school, grade: s.grade, subject: s.subject, level: s.level, action: null, newGrade: null,
  }));
  const [rows, setRows] = useStateP(seed);
  const [log, setLog] = useStateP(() => [...(window.PROMOTION_HISTORY || [])]);
  React.useEffect(() => { setRows(seed()); setActive(null); }, [curAY]);

  const [active, setActive] = useStateP(null);   // grade currently being worked on
  const [sel, setSel] = useStateP({});           // id -> included? (default true)
  const [history, setHistory] = useStateP(false);
  const [confirm, setConfirm] = useStateP(false);

  const byGrade = (g) => rows.filter(r => r.grade === g);
  const pendingIn = (g) => byGrade(g).filter(r => !r.action);
  const isTop = (g) => g === topGrade;
  const targetOf = (g) => window.nextGrade(g);

  const totals = {
    promoted: rows.filter(r => r.action === "Promoted").length,
    graduated: rows.filter(r => r.action === "Graduated").length,
    held: rows.filter(r => r.action === "Held").length,
    pending: rows.filter(r => !r.action).length,
  };

  const openGrade = (g) => {
    if (pendingIn(g).length === 0) return;
    setActive(g);
    const s = {}; pendingIn(g).forEach(r => s[r.id] = true); setSel(s);
  };
  const closeGrade = () => { setActive(null); setConfirm(false); };

  const cohort = active ? pendingIn(active) : [];
  const includedIds = cohort.filter(r => sel[r.id]).map(r => r.id);
  const allOn = cohort.length > 0 && includedIds.length === cohort.length;
  const toggleAll = () => { const v = !allOn; const s = {}; cohort.forEach(r => s[r.id] = v); setSel(s); };
  const toggleOne = (id) => setSel(s => ({ ...s, [id]: !s[id] }));

  const record = (r, action, toGrade) => ({
    id: "ph" + Math.round(Math.random() * 1e6), student: r.name, fromAY: curAY, toAY: targetAY,
    fromGrade: r.grade, toGrade: toGrade || r.grade, date: today(), by: "Aravind Rao",
    note: action === "Graduated" ? "Graduated" : action === "Held" ? "Held back — repeating grade" : null,
  });

  const applyGrade = () => {
    const g = active, t = targetOf(g), grad = isTop(g);
    const entries = [];
    setRows(rs => rs.map(r => {
      if (r.grade !== g || r.action) return r;
      if (sel[r.id]) {
        const action = grad ? "Graduated" : "Promoted";
        entries.push(record(r, action, grad ? null : t));
        return { ...r, action, newGrade: grad ? null : t };
      }
      entries.push(record(r, "Held"));
      return { ...r, action: "Held" };
    }));
    setLog(l => [...entries, ...l]);
    const n = includedIds.length;
    window.toast(grad ? (n + " students graduated from " + g) : (n + " students promoted " + g + " → " + t));
    closeGrade();
  };

  // recommended end-of-year sequence (high grade first, then admit new G1)
  const steps = [
    { key: topGrade, label: "Graduate / archive " + topGrade, kind: "grad" },
    ...[...grades].slice(0, -1).reverse().map(g => ({ key: g, label: "Promote " + g + " → " + targetOf(g), kind: "promo" })),
    { key: "admit", label: "Admit new Grade 1 students", kind: "admit" },
  ];
  const stepDone = (st) => st.kind === "admit" ? false : pendingIn(st.key).length === 0;
  const nextStep = steps.find(st => st.kind !== "admit" && !stepDone(st));

  const ACT_STYLE = { Promoted: ["s-pub", "Promoted"], Graduated: ["s-sched", "Graduated"], Held: ["s-revise", "Held back"] };

  return (
    <div className="page page-anim wide">
      <button className="btn btn-ghost btn-sm" style={{ marginBottom: 12 }} onClick={onBack}><window.IcChevL style={{ width: 15, height: 15 }} />Students</button>
      <div className="page-head">
        <div><h1>Grade Promotion</h1><p>End-of-academic-year grade transition — advance an entire grade to the next grade in one step. Every student is selected by default; just uncheck anyone who should be held back. This is a school-grade move and is independent of subject learning Levels.</p></div>
        <div className="actions"><button className="btn" onClick={() => setHistory(true)}><window.IcClock style={{ width: 15, height: 15 }} />Promotion history</button></div>
      </div>

      {/* AY transition */}
      <div className="card card-pad" style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16, background: "var(--pri-soft)", borderColor: "var(--pri-soft-2)" }}>
        <div>
          <div className="dim" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.03em", textTransform: "uppercase", marginBottom: 4 }}>Promote from</div>
          <select className="sel" style={{ width: 150 }} value={curAY} onChange={(e) => setCurAY(e.target.value)}>{years.slice(0, -1).map(y => <option key={y}>{y}</option>)}</select>
        </div>
        <window.IcArrowR style={{ width: 24, height: 24, color: "var(--pri)", marginTop: 18 }} />
        <div>
          <div className="dim" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.03em", textTransform: "uppercase", marginBottom: 4 }}>Into academic year</div>
          <div style={{ height: 38, display: "flex", alignItems: "center", padding: "0 14px", borderRadius: "var(--r-sm)", background: "var(--pri)", color: "#fff", fontWeight: 700, fontSize: 14 }}>{targetAY}</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{ width: 230 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}><span className="dim">Students processed</span><span className="mono" style={{ fontWeight: 700 }}>{rows.length - totals.pending}/{rows.length}</span></div>
            <div style={{ height: 8, background: "var(--surface-3)", borderRadius: 99, overflow: "hidden" }}><div style={{ width: (rows.length ? (rows.length - totals.pending) / rows.length * 100 : 0) + "%", height: "100%", background: "var(--pri)", borderRadius: 99, transition: "width .3s" }}></div></div>
          </div>
        </div>
      </div>

      {/* dashboard stats */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 18 }}>
        <StatPill icon={window.IcUsers} label="Students in cohort" value={rows.length} />
        <StatPill icon={window.IcCheckCircle} label="Promoted" value={totals.promoted} color="var(--st-pub)" soft="var(--st-pub-bg)" />
        <StatPill icon={window.IcArchive} label="Graduated" value={totals.graduated} color="var(--st-sched)" soft="var(--st-sched-bg)" />
        <StatPill icon={window.IcChevL} label="Held back" value={totals.held} color="var(--st-revise)" soft="var(--st-revise-bg)" />
        <StatPill icon={window.IcClock} label="Pending" value={totals.pending} color="var(--warn)" soft="var(--st-review-bg)" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr", gap: 16, alignItems: "start" }}>
        {/* LEFT — grade ladder / active cohort */}
        <div>
          {!active ? (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 11 }}>
                <b style={{ fontSize: 13.5, fontWeight: 700 }}>Choose a grade to promote</b>
                <span className="dim" style={{ fontSize: 12 }}>Follow the recommended order on the right →</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {grades.map(g => {
                  const all = byGrade(g), pend = pendingIn(g), done = all.length > 0 && pend.length === 0;
                  const t = targetOf(g), grad = isTop(g);
                  const recommended = nextStep && nextStep.key === g;
                  return (
                    <div key={g} className="card" style={{ padding: "13px 16px", display: "flex", alignItems: "center", gap: 14,
                      borderColor: recommended ? "var(--pri)" : "var(--hair)", boxShadow: recommended ? "0 0 0 3px var(--pri-soft)" : "none", transition: "box-shadow .15s, border-color .15s" }}>
                      <div style={{ width: 42, height: 42, borderRadius: 12, background: grad ? "var(--st-sched-bg)" : "var(--pri-soft)", color: grad ? "var(--st-sched)" : "var(--pri)", display: "grid", placeItems: "center", flexShrink: 0, fontWeight: 760 }} className="mono">{g.replace("Grade ", "G")}</div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <b style={{ fontSize: 14.5, fontWeight: 720 }}>{g}</b>
                          {grad ? <span className="chip" style={{ height: 20, fontSize: 10.5, background: "var(--st-sched-bg)", color: "var(--st-sched)" }}>Graduating cohort</span>
                                : <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--ink-3)" }}><window.IcArrowR style={{ width: 13, height: 13, color: "var(--ink-4)" }} /><b style={{ color: "var(--pri)" }}>{t}</b></span>}
                          {recommended && <span className="chip" style={{ height: 20, fontSize: 10, background: "var(--pri-soft)", color: "var(--pri-ink)", fontWeight: 700 }}><window.IcSparkle style={{ width: 11, height: 11 }} />Recommended next</span>}
                        </div>
                        <div className="dim" style={{ fontSize: 11.5, marginTop: 2 }}>
                          {all.length} students · {pend.length} pending{all.length - pend.length > 0 ? " · " + (all.length - pend.length) + " processed" : ""}
                        </div>
                      </div>
                      {done ? <span className="status s-pub"><window.IcCheck style={{ width: 12, height: 12 }} />Done</span>
                        : all.length === 0 ? <span className="dim" style={{ fontSize: 11.5 }}>No students</span>
                        : <button className={"btn btn-sm " + (grad ? "" : "btn-pri")} onClick={() => openGrade(g)}>{grad ? <><window.IcArchive style={{ width: 14, height: 14 }} />Graduate grade</> : <><window.IcArrowR style={{ width: 14, height: 14 }} />Promote grade</>}</button>}
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="card" style={{ overflow: "hidden" }}>
              {/* cohort header */}
              <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--hair)", display: "flex", alignItems: "center", gap: 12, background: "var(--surface-2)" }}>
                <button className="btn btn-ghost btn-sm" onClick={closeGrade}><window.IcChevL style={{ width: 15, height: 15 }} />All grades</button>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <span className="chip" style={{ height: 24, fontSize: 12, fontWeight: 700, background: "var(--surface-3)" }}>{active}</span>
                  <window.IcArrowR style={{ width: 16, height: 16, color: "var(--pri)" }} />
                  {isTop(active) ? <span className="chip" style={{ height: 24, fontSize: 12, fontWeight: 700, background: "var(--st-sched-bg)", color: "var(--st-sched)" }}><window.IcArchive style={{ width: 13, height: 13 }} />Graduate</span>
                    : <span className="chip" style={{ height: 24, fontSize: 12, fontWeight: 700, background: "var(--pri-soft)", color: "var(--pri-ink)" }}>{targetOf(active)}</span>}
                </div>
                <span className="dim" style={{ fontSize: 12, marginLeft: "auto" }}><b className="mono" style={{ color: "var(--pri)" }}>{includedIds.length}</b> of {cohort.length} selected</span>
              </div>
              {/* select-all bar */}
              <div style={{ padding: "9px 16px", borderBottom: "1px solid var(--hair)", display: "flex", alignItems: "center", gap: 10 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 12.5, fontWeight: 650, cursor: "pointer" }}>
                  <input type="checkbox" checked={allOn} onChange={toggleAll} />
                  Select all in {active}
                </label>
                <span className="dim" style={{ fontSize: 11.5 }}>Uncheck students who should be held back</span>
              </div>
              {/* roster */}
              <div style={{ maxHeight: 420, overflowY: "auto" }}>
                {cohort.map(r => {
                  const on = !!sel[r.id];
                  return (
                    <label key={r.id} style={{ display: "flex", alignItems: "center", gap: 11, padding: "10px 16px", borderTop: "1px solid var(--hair)", cursor: "pointer", background: on ? "transparent" : "var(--surface-2)" }}>
                      <input type="checkbox" checked={on} onChange={() => toggleOne(r.id)} />
                      <window.Avatar name={r.name} size={28} />
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <b style={{ fontWeight: 640, fontSize: 13, color: on ? "var(--ink)" : "var(--ink-3)" }}>{r.name}</b>
                        <div className="dim" style={{ fontSize: 11 }}>{r.school}</div>
                      </div>
                      <window.SubjectChip subject={r.subject} sm />
                      <span className="chip" style={{ height: 20, fontSize: 10.5 }}>{r.level}</span>
                      {!on && <span className="chip" style={{ height: 20, fontSize: 10, background: "var(--st-revise-bg)", color: "var(--st-revise)" }}>Held back</span>}
                    </label>
                  );
                })}
              </div>
              {/* footer action */}
              <div style={{ padding: "13px 16px", borderTop: "1px solid var(--hair)", background: "var(--surface-2)", display: "flex", alignItems: "center", gap: 10 }}>
                <span className="dim" style={{ fontSize: 12 }}>{cohort.length - includedIds.length > 0 ? (cohort.length - includedIds.length) + " will be held back in " + active : "All students will move forward"}</span>
                <button className={"btn " + (isTop(active) ? "" : "btn-pri")} style={{ marginLeft: "auto" }} disabled={includedIds.length === 0} onClick={() => setConfirm(true)}>
                  {isTop(active) ? <><window.IcArchive style={{ width: 15, height: 15 }} />Graduate {includedIds.length} students</> : <><window.IcCheck style={{ width: 15, height: 15 }} />Promote {includedIds.length} to {targetOf(active)}</>}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT — promotion guidelines */}
        <div className="card card-pad" style={{ background: "var(--surface)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <window.IcSparkle style={{ width: 16, height: 16, color: "var(--pri)" }} />
            <b style={{ fontSize: 13.5, fontWeight: 720 }}>Promotion guidelines</b>
          </div>
          <p className="dim" style={{ fontSize: 12, margin: "0 0 14px", lineHeight: 1.5 }}>Promote from the highest grade downward so no two grades ever overlap, then admit the new intake.</p>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {steps.map((st, i) => {
              const done = stepDone(st);
              const isNext = nextStep && nextStep.key === st.key && st.kind !== "admit";
              const admit = st.kind === "admit";
              return (
                <div key={st.key} style={{ display: "flex", gap: 11, paddingBottom: i < steps.length - 1 ? 14 : 0, position: "relative" }}>
                  {i < steps.length - 1 && <div style={{ position: "absolute", left: 12, top: 26, bottom: 0, width: 2, background: done ? "var(--st-pub)" : "var(--hair)" }}></div>}
                  <div style={{ width: 25, height: 25, borderRadius: 99, flexShrink: 0, display: "grid", placeItems: "center", zIndex: 1, fontSize: 11, fontWeight: 700,
                    background: done ? "var(--st-pub)" : isNext ? "var(--pri)" : admit ? "var(--surface)" : "var(--surface-3)",
                    color: done || isNext ? "#fff" : "var(--ink-3)", border: admit && !done ? "1.5px dashed var(--hair-2)" : "none" }} className="mono">
                    {done ? <window.IcCheck style={{ width: 13, height: 13 }} /> : i + 1}
                  </div>
                  <div style={{ paddingTop: 2 }}>
                    <div style={{ fontSize: 12.5, fontWeight: isNext ? 700 : 600, color: done ? "var(--ink-3)" : "var(--ink)", textDecoration: done ? "line-through" : "none" }}>{st.label}</div>
                    {isNext && <div style={{ fontSize: 11, color: "var(--pri-ink)", fontWeight: 650, marginTop: 1 }}>Do this next</div>}
                    {admit && <button className="btn btn-sm" style={{ marginTop: 6 }} onClick={() => { window.toast("Opening student enrolment…"); onBack(); }}><window.IcPlus style={{ width: 13, height: 13 }} />Enroll new students</button>}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 16, padding: "10px 12px", borderRadius: "var(--r-md)", background: "var(--st-review-bg)", color: "var(--st-review)", fontSize: 11.5, display: "flex", gap: 8 }}>
            <window.IcClock style={{ width: 15, height: 15, flexShrink: 0, marginTop: 1 }} />
            <span>Grade Promotion only changes a student's academic grade. Subject learning Levels are re-assessed separately via the Level Diagnostic.</span>
          </div>
        </div>
      </div>

      {/* confirm */}
      {confirm && active && (
        <window.Modal title={isTop(active) ? ("Graduate " + active) : ("Promote " + active + " → " + targetOf(active))}
          sub={(isTop(active) ? "Graduate " : "Promote ") + includedIds.length + " students from " + curAY + " into " + targetAY + "." + (cohort.length - includedIds.length > 0 ? " " + (cohort.length - includedIds.length) + " will be held back." : "")}
          onClose={() => setConfirm(false)} width={560}
          foot={<><button className={"btn " + (isTop(active) ? "" : "btn-pri")} onClick={applyGrade}><window.IcCheck style={{ width: 15, height: 15 }} />{isTop(active) ? "Graduate " + includedIds.length + " students" : "Promote " + includedIds.length + " students"}</button><button className="btn btn-ghost" onClick={() => setConfirm(false)}>Cancel</button></>}>
          <div style={{ maxHeight: 300, overflowY: "auto", display: "flex", flexDirection: "column", gap: 7 }}>
            {cohort.filter(r => sel[r.id]).map(r => (
              <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 11px", border: "1px solid var(--hair)", borderRadius: "var(--r-sm)" }}>
                <window.Avatar name={r.name} size={24} /><span style={{ fontSize: 12.5, fontWeight: 600 }}>{r.name}</span>
                <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>{active}<window.IcArrowR style={{ width: 12, height: 12, color: "var(--ink-4)" }} /><b style={{ color: isTop(active) ? "var(--st-sched)" : "var(--pri)" }}>{isTop(active) ? "Graduated" : targetOf(active)}</b></span>
              </div>
            ))}
          </div>
        </window.Modal>
      )}

      {/* history (audit trail) */}
      {history && (
        <window.SlideOver title="Promotion history" sub="Complete audit trail — every grade promotion, graduation and hold-back is logged." onClose={() => setHistory(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {log.length === 0 && <div className="dim" style={{ fontSize: 12.5, textAlign: "center", padding: 20 }}>No promotions recorded yet.</div>}
            {log.map(h => (
              <div key={h.id} className="card card-pad" style={{ padding: "11px 13px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <b style={{ fontSize: 13 }}>{h.student}</b>
                  {h.note && <span className="chip" style={{ height: 18, fontSize: 9.5, background: "var(--st-revise-bg)", color: "var(--st-revise)" }}>{h.note}</span>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--ink-2)" }}>
                  <span className="mono">{h.fromAY}</span><window.IcArrowR style={{ width: 12, height: 12, color: "var(--ink-4)" }} /><span className="mono">{h.toAY}</span>
                  <span style={{ marginLeft: 4, fontWeight: 600 }}>{(h.fromGrade || h.fromLevel)} → {(h.toGrade || h.toLevel)}</span>
                </div>
                <div className="dim" style={{ fontSize: 11, marginTop: 5 }}>{h.date} · by {h.by}</div>
              </div>
            ))}
          </div>
        </window.SlideOver>
      )}
    </div>
  );
}

window.StudentPromotions = StudentPromotions;
