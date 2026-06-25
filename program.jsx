/* program.jsx — Program Team · Dashboard + Curriculum Assignment + Journey Assignment */
const { useState: useStateP } = React;

function ProgramDashboard({ go }) {
  return (
    <div className="page page-anim">
      <div className="page-head">
        <div><h1>Good afternoon, Rajesh</h1><p>Operational overview for your chapters. 2 items await review and 2 curriculum assignments go live this week.</p></div>
        <div className="actions">
          <button className="btn" onClick={() => go("activation")}><window.IcWorkflow style={{ width: 15, height: 15 }} />Review queue</button>
          <button className="btn btn-pri" onClick={() => go("curriculum")}><window.IcPlus style={{ width: 16, height: 16 }} />Assign Curriculum</button>
        </div>
      </div>
      <div className="kpi-row">
        <div className="kpi"><div className="k-label"><window.IcWorkflow style={{ width: 14, height: 14 }} />Awaiting review</div><div className="k-num mono">2</div><div className="k-sub">submitted by Content</div></div>
        <div className="kpi"><div className="k-label"><window.IcClock style={{ width: 14, height: 14 }} />Scheduled</div><div className="k-num mono">2</div><div className="k-sub">publish this week</div></div>
        <div className="kpi"><div className="k-label"><window.IcModule style={{ width: 14, height: 14 }} />Live assignments</div><div className="k-num mono">3</div><div className="k-sub">across 6 classes</div></div>
        <div className="kpi"><div className="k-label"><window.IcUsers style={{ width: 14, height: 14 }} />At-risk students</div><div className="k-num mono" style={{ color: "var(--bad)" }}>12</div><div className="k-sub">flagged this week</div></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 16 }}>
        <div className="card" style={{ overflow: "hidden" }}>
          <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--hair)", display: "flex", alignItems: "center" }}><b style={{ fontSize: 13.5, fontWeight: 700 }}>Review queue</b><button className="btn btn-ghost btn-sm" style={{ marginLeft: "auto" }} onClick={() => go("activation")}>Open workflow<window.IcChevR style={{ width: 14, height: 14 }} /></button></div>
          {window.WORKFLOW.review.concat(window.WORKFLOW.submit).map(it => { const s = window.SUBJECTS[it.subject]; const KindIcon = it.kind === "Game" ? window.IcGame : it.kind === "Module" ? window.IcModule : window.IcJourney; return (
            <div key={it.id} onClick={() => go("activation")} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderTop: "1px solid var(--hair)", cursor: "pointer" }} onMouseEnter={(e) => e.currentTarget.style.background = "var(--surface-2)"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: s.color.replace(")"," / 0.10)"), color: s.color, display: "grid", placeItems: "center" }}><KindIcon style={{ width: 17, height: 17 }} /></div>
              <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 640 }}>{it.title}</div><div className="dim" style={{ fontSize: 11.5 }}>{it.kind} · {it.subject} · by {it.author}</div></div>
              <window.StatusBadge status={window.WORKFLOW.review.includes(it) ? "review" : "submit"} />
              <button className="btn btn-sm" onClick={(e) => { e.stopPropagation(); go("activation"); }}>Review</button>
            </div>
          ); })}
        </div>
        <div className="card card-pad">
          <div style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 13 }}>Going live soon</div>
          {window.ASSIGNMENTS.filter(a => a.status === "scheduled").map(a => (
            <div key={a.id} style={{ display: "flex", gap: 11, padding: "11px 12px", borderRadius: "var(--r-md)", background: "var(--st-sched-bg)", marginBottom: 10 }}>
              <window.IcClock style={{ width: 18, height: 18, color: "var(--st-sched)", flexShrink: 0, marginTop: 1 }} />
              <div><div style={{ fontSize: 12.5, fontWeight: 650, color: "var(--st-sched)" }}>{a.item}</div><div style={{ fontSize: 11.5, color: "var(--ink-3)" }}>{a.cls} · {a.school} · {a.start}</div></div>
            </div>
          ))}
          <button className="btn btn-sm" style={{ width: "100%", justifyContent: "center", marginTop: 4 }} onClick={() => go("curriculum")}>Manage assignments</button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Curriculum Assignment ---------- */
function CurriculumAssignment() {
  const [assign, setAssign] = useStateP(false);
  return (
    <div className="page page-anim wide">
      <div className="page-head">
        <div><h1>Curriculum Assignment</h1><p>Deploy Journeys, Courses or standalone Lesson Modules to classes, set activation dates and scope. Content the Content Team built — you decide where and when it goes live.</p></div>
        <div className="actions"><button className="btn btn-pri" onClick={() => setAssign(true)}><window.IcPlus style={{ width: 16, height: 16 }} />Assign to Classes</button></div>
      </div>
      <div className="kpi-row">
        <div className="kpi"><div className="k-label"><window.IcModule style={{ width: 14, height: 14 }} />Live</div><div className="k-num mono">{window.ASSIGNMENTS.filter(a => a.status === "live").length}</div><div className="k-sub">assignments</div></div>
        <div className="kpi"><div className="k-label"><window.IcClock style={{ width: 14, height: 14 }} />Scheduled</div><div className="k-num mono">{window.ASSIGNMENTS.filter(a => a.status === "scheduled").length}</div><div className="k-sub">upcoming</div></div>
        <div className="kpi"><div className="k-label"><window.IcJourney style={{ width: 14, height: 14 }} />Journeys deployed</div><div className="k-num mono">4</div><div className="k-sub">across chapters</div></div>
        <div className="kpi"><div className="k-label"><window.IcCheckCircle style={{ width: 14, height: 14 }} />Avg progress</div><div className="k-num mono">54%</div><div className="k-sub">live cohorts</div></div>
      </div>
      <div className="card" style={{ overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead><tr style={{ background: "var(--surface-2)", textAlign: "left", color: "var(--ink-3)", fontSize: 11.5 }}>{["Curriculum","Type","Class","School","Activation","Progress","Status",""].map((h, i) => <th key={i} style={{ padding: "11px 16px", fontWeight: 650 }}>{h}</th>)}</tr></thead>
          <tbody>
            {window.ASSIGNMENTS.map(a => (
              <tr key={a.id} style={{ borderTop: "1px solid var(--hair)" }} onMouseEnter={(e) => e.currentTarget.style.background = "var(--surface-2)"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "12px 16px", fontWeight: 640 }}>{a.item}</td>
                <td style={{ padding: "12px 16px" }}><span className="chip" style={{ background: a.kind === "Journey" ? "var(--pri-soft)" : "var(--surface-3)", color: a.kind === "Journey" ? "var(--pri-ink)" : "var(--ink-2)" }}>{a.kind}</span></td>
                <td style={{ padding: "12px 16px" }}><window.MiniPill>{a.cls}</window.MiniPill></td>
                <td style={{ padding: "12px 16px", color: "var(--ink-3)" }}>{a.school}</td>
                <td className="mono" style={{ padding: "12px 16px" }}>{a.start}</td>
                <td style={{ padding: "12px 16px" }}>{a.status === "live" ? <div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 50, height: 6, background: "var(--surface-3)", borderRadius: 99 }}><div style={{ width: a.progress + "%", height: "100%", background: "var(--good)", borderRadius: 99 }}></div></div><span className="mono" style={{ fontSize: 11.5 }}>{a.progress}%</span></div> : <span className="dim">—</span>}</td>
                <td style={{ padding: "12px 16px" }}><window.StatusBadge status={a.status === "live" ? "pub" : "sched"} /></td>
                <td style={{ padding: "12px 6px" }}><window.Menu items={[{ label: "Edit assignment", icon: window.IcEdit, onClick: () => setAssign(true) }, { label: "View class analytics", icon: window.IcChart, onClick: () => {} }, { sep: true }, { label: "Unassign", icon: window.IcTrash, danger: true, onClick: () => window.toast("Unassigned") }]} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {assign && <AssignModal onClose={() => setAssign(false)} />}
    </div>
  );
}

function AssignModal({ onClose }) {
  const [kind, setKind] = useStateP("Journey");
  const [classes, setClasses] = useStateP([]);
  const toggle = (id) => setClasses(c => c.includes(id) ? c.filter(x => x !== id) : [...c, id]);
  const items = kind === "Journey" ? window.JOURNEYS.map(j => j.name) : window.MODULES.map(m => m.title);
  return (
    <window.Modal title="Assign curriculum to classes" sub="Pick what to deploy, the target classes, and the activation date." onClose={onClose} width={620}
      foot={<><button className="btn btn-pri" disabled={classes.length === 0} onClick={() => { window.toast("Assigned to " + classes.length + " classes — activation scheduled"); onClose(); }}><window.IcCheck style={{ width: 15, height: 15 }} />Assign to {classes.length} {classes.length === 1 ? "class" : "classes"}</button><button className="btn btn-ghost" onClick={onClose}>Cancel</button></>}>
      <div className="field"><label>What to assign</label>
        <div className="seg" style={{ marginBottom: 10 }}>{["Journey","Course","Lesson Module"].map(k => <button key={k} className={kind === k ? "on" : ""} onClick={() => setKind(k)}>{k}</button>)}</div>
        <select className="sel">{items.map(i => <option key={i}>{i}</option>)}</select>
      </div>
      <div className="row-2">
        <div className="field"><label>Activation date</label><input className="inp" defaultValue="Jun 03, 2026" /></div>
        <div className="field"><label>Excluded modules</label><select className="sel"><option>None</option><option>Select…</option></select></div>
      </div>
      <div className="field" style={{ marginBottom: 0 }}>
        <label>Target classes <span className="hint">{classes.length} selected</span></label>
        <div style={{ display: "flex", flexDirection: "column", gap: 7, maxHeight: 220, overflowY: "auto" }}>
          {window.CLASSES.filter(c => c.status === "active").map(c => {
            const on = classes.includes(c.id);
            return (
              <button key={c.id} onClick={() => toggle(c.id)} style={{ display: "flex", alignItems: "center", gap: 11, padding: "9px 11px", borderRadius: "var(--r-sm)", border: on ? "1.5px solid var(--pri)" : "1px solid var(--hair)", background: on ? "var(--pri-soft)" : "var(--surface)", textAlign: "left" }}>
                <span style={{ width: 18, height: 18, borderRadius: 5, border: on ? "0" : "1.5px solid var(--hair-2)", background: on ? "var(--pri)" : "transparent", display: "grid", placeItems: "center", flexShrink: 0 }}>{on && <window.IcCheck style={{ width: 12, height: 12, color: "#fff" }} />}</span>
                <div style={{ flex: 1 }}><div style={{ fontSize: 12.5, fontWeight: 640 }}>{c.name}</div><div className="dim" style={{ fontSize: 11 }}>{c.school} · {c.students} students</div></div>
                <window.MiniPill>{c.grade}</window.MiniPill>
              </button>
            );
          })}
        </div>
      </div>
    </window.Modal>
  );
}

window.ProgramDashboard = ProgramDashboard;
window.CurriculumAssignment = CurriculumAssignment;
