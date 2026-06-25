/* admin-users.jsx — Admin · School Setup (Classes) + Users (Teachers / Students / Team Accounts) */
const { useState: useStateU } = React;

/* ---------- School Setup → Classes ---------- */
function SchoolSetup({ readOnly }) {
  const [tab, setTab] = useStateU("active");
  const [bulk, setBulk] = useStateU(false);
  const [neu, setNeu] = useStateU(false);
  const [sel, setSel] = useStateU([]);
  const rows = window.CLASSES.filter(c => tab === "archived" ? c.status === "archived" : c.status === "active");
  const toggle = (id) => setSel(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  return (
    <div className="page page-anim wide">
      <div className="page-head">
        <div><h1>School Setup</h1><p>{readOnly ? "Read-only view of classes and academic calendars." : "Manage classes, rosters and the academic calendar. Duplicate a class for next term with an empty roster."}</p></div>
        {!readOnly && <div className="actions">
          <button className="btn"><window.IcClock style={{ width: 15, height: 15 }} />Calendar</button>
          <button className="btn" onClick={() => setBulk(true)}><window.IcUpload style={{ width: 15, height: 15 }} />Upload</button>
          <button className="btn btn-pri" onClick={() => setNeu(true)}><window.IcPlus style={{ width: 16, height: 16 }} />New Class</button>
        </div>}
      </div>

      <div className="toolbar">
        <div className="seg"><button className={tab === "active" ? "on" : ""} onClick={() => setTab("active")}>Classes</button><button className={tab === "archived" ? "on" : ""} onClick={() => setTab("archived")}>Archived</button></div>
        {sel.length > 0 && !readOnly && (
          <div style={{ display: "flex", gap: 8, marginLeft: 4 }}>
            <button className="btn btn-sm" onClick={() => { window.toast(sel.length + " classes archived"); setSel([]); }}><window.IcArchive style={{ width: 14, height: 14 }} />Archive selected ({sel.length})</button>
            <button className="btn btn-sm" onClick={() => { window.toast("Duplicated for next term — empty rosters"); setSel([]); }}><window.IcCopy style={{ width: 14, height: 14 }} />Duplicate for next term</button>
          </div>
        )}
        <div className="searchbox" style={{ minWidth: 200, height: 32, marginLeft: "auto" }}><window.IcSearch style={{ width: 15, height: 15 }} /><input placeholder="Search classes…" /></div>
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead><tr style={{ background: "var(--surface-2)", textAlign: "left", color: "var(--ink-3)", fontSize: 11.5 }}>
            {!readOnly && <th style={{ padding: "11px 8px 11px 16px", width: 20 }}></th>}
            {["Class","Grade","Term","School","Enrollment","Primary Teacher",""].map((h, i) => <th key={i} style={{ padding: "11px 16px", fontWeight: 650 }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {rows.map(c => {
              const full = c.students / c.capacity;
              return (
                <tr key={c.id} style={{ borderTop: "1px solid var(--hair)" }} onMouseEnter={(e) => e.currentTarget.style.background = "var(--surface-2)"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                  {!readOnly && <td style={{ padding: "11px 8px 11px 16px" }}><input type="checkbox" checked={sel.includes(c.id)} onChange={() => toggle(c.id)} /></td>}
                  <td style={{ padding: "12px 16px", fontWeight: 650 }}>{c.name}</td>
                  <td style={{ padding: "12px 16px" }}><window.MiniPill>{c.grade}</window.MiniPill></td>
                  <td style={{ padding: "12px 16px", color: "var(--ink-3)" }}>{c.term}</td>
                  <td style={{ padding: "12px 16px", color: "var(--ink-3)" }}>{c.school}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 54, height: 6, background: "var(--surface-3)", borderRadius: 99 }}><div style={{ width: (full * 100) + "%", height: "100%", background: full > 0.9 ? "var(--warn)" : "var(--good)", borderRadius: 99 }}></div></div>
                      <span className="mono" style={{ fontSize: 11.5, color: "var(--ink-3)" }}>{c.students}/{c.capacity}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px" }}>{c.teacher === "—" ? <span className="dim">—</span> : <div style={{ display: "flex", alignItems: "center", gap: 7 }}><window.Avatar name={c.teacher} size={22} /><span style={{ fontSize: 12.5 }}>{c.teacher}</span></div>}</td>
                  <td style={{ padding: "12px 6px" }}>{!readOnly && <window.Menu items={[{ label: "Edit class", icon: window.IcEdit, onClick: () => setNeu(true) }, { label: "Manage roster", icon: window.IcUsers, onClick: () => {} }, { label: "Duplicate for next term", icon: window.IcCopy, onClick: () => window.toast("Duplicated") }, { sep: true }, { label: "Archive", icon: window.IcArchive, danger: true, onClick: () => window.toast("Archived") }]} />}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {bulk && <window.BulkUploadModal entity="classes" columns={["Class Name","Grade","Subject","Term","Capacity","Teacher Email"]} onClose={() => setBulk(false)} />}
      {neu && <window.NewEntity entity="Class" fields={[{ label: "Class Name", ph: "e.g. Grade 1 — D" }, { label: "Grade", type: "select", options: ["Grade 1","Grade 2","Grade 3","Grade 4","Grade 5"] }, { label: "Subject", type: "select", options: ["All","Maths","English","Tamil"] }, { label: "Term", type: "select", options: ["Term 1","Term 2","Term 3"] }, { label: "Capacity", ph: "35" }, { label: "Primary Teacher", type: "select", options: window.TEACHERS.map(t => t.name) }, { label: "Co-Teachers", type: "select", options: ["None", ...window.TEACHERS.map(t => t.name)], opt: true }]} onClose={() => setNeu(false)} />}
    </div>
  );
}

/* ---------- Add Team Member slide-over (Program / Content with scoping) ---------- */
function AddTeamMember({ onClose }) {
  const [login, setLogin] = useStateU("Program Team");
  const scopeOptions = login === "Program Team" ? window.STATES.map(s => s.name) : ["Maths","English","Tamil"];
  const [scope, setScope] = useStateU([]);
  const toggle = (o) => setScope(s => s.includes(o) ? s.filter(x => x !== o) : [...s, o]);
  return (
    <window.SlideOver title="Add Team Member" sub="Create a Program Team or Content Team account." onClose={onClose}
      foot={<><button className="btn btn-pri" onClick={() => { window.toast("Invitation sent to new " + login + " member"); onClose(); }}><window.IcMsg style={{ width: 15, height: 15 }} />Send Invitation</button><button className="btn btn-ghost" onClick={onClose}>Cancel</button></>}>
      <div className="field"><label>Full name</label><input className="inp" placeholder="e.g. Anjali Mehta" /></div>
      <div className="row-2">
        <div className="field"><label>Email</label><input className="inp" placeholder="name@enjoyseries.org" /></div>
        <div className="field"><label>Phone</label><input className="inp" placeholder="+91 …" /></div>
      </div>
      <div className="field">
        <label>Login type <span className="hint">determines which sidebar modules are accessible</span></label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
          {[["Program Team","Deployment, review, analytics","IcWorkflow"],["Content Team","Builds modules, games, journeys","IcModule"]].map(([l, d, ic]) => (
            <button key={l} onClick={() => { setLogin(l); setScope([]); }} style={{ textAlign: "left", padding: 12, borderRadius: "var(--r-md)", border: login === l ? "1.5px solid var(--pri)" : "1px solid var(--hair)", background: login === l ? "var(--pri-soft)" : "var(--surface)", boxShadow: login === l ? "0 0 0 3px var(--pri-soft)" : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>{React.createElement(window[ic], { style: { width: 17, height: 17, color: login === l ? "var(--pri)" : "var(--ink-2)" } })}{login === l && <window.IcCheck style={{ width: 15, height: 15, color: "var(--pri)", marginLeft: "auto" }} />}</div>
              <div style={{ fontSize: 12.5, fontWeight: 680, color: login === l ? "var(--pri-ink)" : "var(--ink)" }}>{l}</div>
              <div className="dim" style={{ fontSize: 10.5, marginTop: 2, lineHeight: 1.35 }}>{d}</div>
            </button>
          ))}
        </div>
      </div>
      <div className="field" style={{ marginBottom: 0 }}>
        <label>{login === "Program Team" ? "Scope access (states / cities / schools)" : "Scope to subjects / grades"} <span className="hint">leave empty = All ({login === "Program Team" ? "platform-wide" : "full library"})</span></label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 2 }}>
          {scopeOptions.map(o => {
            const on = scope.includes(o);
            return <button key={o} onClick={() => toggle(o)} className="chip" style={{ cursor: "pointer", height: 28, border: on ? "1px solid var(--pri)" : "1px solid var(--hair)", background: on ? "var(--pri-soft)" : "var(--surface)", color: on ? "var(--pri-ink)" : "var(--ink-2)" }}>{on && <window.IcCheck style={{ width: 12, height: 12 }} />}{o}</button>;
          })}
        </div>
        <div style={{ marginTop: 10, padding: "8px 11px", borderRadius: 8, background: "var(--surface-2)", fontSize: 11.5, color: "var(--ink-3)" }}>
          {scope.length === 0 ? (login === "Program Team" ? "All chapters — platform-wide access." : "All subjects & grades.") : "Scoped to: " + scope.join(", ")}
        </div>
      </div>
    </window.SlideOver>
  );
}

/* ---------- Users ---------- */
function Users({ readOnly, onOpenStudent, onPromotions, tab: tabProp, onTab }) {
  const [tabState, setTabState] = useStateU("teachers");
  const tab = tabProp || tabState;          // controlled by sidebar submenu when provided
  const setTab = onTab || setTabState;
  const [bulk, setBulk] = useStateU(false);
  const [neu, setNeu] = useStateU(false);
  const [addTeam, setAddTeam] = useStateU(false);
  const [ay, setAy] = useStateU(window.ACADEMIC_YEARS[0]);
  const students = window.STUDENTS.filter(s => s.ay === ay);

  const tabs = [
    { k: "teachers", label: "Teachers", n: window.TEACHERS.length },
    { k: "students", label: "Students", n: window.STUDENTS.length },
    { k: "team", label: "Team Accounts", n: window.TEAM.length },
  ].filter(t => !(readOnly && t.k === "team")); // Program Team manages teachers/students only

  const primaryAction = () => {
    if (tab === "team") setAddTeam(true);
    else setNeu(true);
  };

  return (
    <div className="page page-anim wide">
      <div className="page-head">
        <div><h1>Users</h1><p>{readOnly ? "Read-only directory of teachers and students." : "Onboard teachers and students (manual or bulk), and create Program / Content Team accounts with scoped access."}</p></div>
        {!readOnly && <div className="actions">
          {tab !== "team" && <button className="btn" onClick={() => setBulk(true)}><window.IcUpload style={{ width: 15, height: 15 }} />Upload</button>}
          <button className="btn btn-pri" onClick={primaryAction}><window.IcPlus style={{ width: 16, height: 16 }} />{tab === "teachers" ? "Add Teacher" : tab === "students" ? "Enroll Student" : "Add Team Member"}</button>
        </div>}
      </div>

      <div className="toolbar">
        <div className="seg">{tabs.map(t => <button key={t.k} className={tab === t.k ? "on" : ""} onClick={() => setTab(t.k)}>{t.label}<span className="mono" style={{ opacity: 0.55, marginLeft: 5, fontSize: 11 }}>{t.n}</span></button>)}</div>
        {tab === "students" && (
          <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "0 4px 0 11px", height: 32, border: "1px solid var(--hair)", borderRadius: "var(--r-sm)", background: "var(--surface)" }}>
            <span className="dim" style={{ fontSize: 11.5, fontWeight: 600 }}>Academic Year</span>
            <select value={ay} onChange={(e) => setAy(e.target.value)} style={{ border: 0, background: "transparent", fontSize: 12.5, fontWeight: 650, color: "var(--ink)", outline: 0, height: 30 }}>{window.ACADEMIC_YEARS.map(y => <option key={y}>{y}</option>)}</select>
          </div>
        )}
        {tab === "students" && !readOnly && <button className="btn" onClick={() => onPromotions && onPromotions()}><window.IcArrowR style={{ width: 15, height: 15 }} />Grade Promotion</button>}
        <div className="searchbox" style={{ minWidth: 200, height: 32, marginLeft: "auto" }}><window.IcSearch style={{ width: 15, height: 15 }} /><input placeholder={"Search " + tab + "…"} /></div>
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        {tab === "teachers" && (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead><tr style={{ background: "var(--surface-2)", textAlign: "left", color: "var(--ink-3)", fontSize: 11.5 }}>{["Teacher","Email","Subjects","Classes","Role","Status",""].map((h, i) => <th key={i} style={{ padding: "11px 16px", fontWeight: 650 }}>{h}</th>)}</tr></thead>
            <tbody>
              {window.TEACHERS.map(t => (
                <tr key={t.id} style={{ borderTop: "1px solid var(--hair)" }} onMouseEnter={(e) => e.currentTarget.style.background = "var(--surface-2)"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "11px 16px" }}><div style={{ display: "flex", alignItems: "center", gap: 9 }}><window.Avatar name={t.name} size={28} /><b style={{ fontWeight: 640 }}>{t.name}</b></div></td>
                  <td className="mono" style={{ padding: "11px 16px", color: "var(--ink-3)", fontSize: 11.5 }}>{t.email}</td>
                  <td style={{ padding: "11px 16px" }}><div style={{ display: "flex", gap: 4 }}>{t.subjects.map(s => <window.SubjectChip key={s} subject={s} sm />)}</div></td>
                  <td className="mono" style={{ padding: "11px 16px" }}>{t.classes}</td>
                  <td style={{ padding: "11px 16px" }}><window.MiniPill>{t.role}</window.MiniPill></td>
                  <td style={{ padding: "11px 16px" }}><span className={"status " + (t.status === "active" ? "s-pub" : "s-review")}><span className="dotc"></span>{t.status === "active" ? "Active" : "Pending"}</span></td>
                  <td style={{ padding: "11px 6px" }}>{!readOnly && <window.Menu items={[{ label: "Edit assignments", icon: window.IcEdit, onClick: () => setNeu(true) }, { label: "Assign substitute", icon: window.IcUsers, onClick: () => window.toast("Substitution flow") }, { sep: true }, { label: "Deactivate", icon: window.IcArchive, danger: true, onClick: () => window.toast("Deactivated") }]} />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {tab === "students" && (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead><tr style={{ background: "var(--surface-2)", textAlign: "left", color: "var(--ink-3)", fontSize: 11.5 }}>{["Student","School","Grade","Academic Year","Subject Level","Completion","Status",""].map((h, i) => <th key={i} style={{ padding: "11px 16px", fontWeight: 650 }}>{h}</th>)}</tr></thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id} style={{ borderTop: "1px solid var(--hair)", cursor: "pointer" }} onClick={() => onOpenStudent && onOpenStudent(s)} onMouseEnter={(e) => e.currentTarget.style.background = "var(--surface-2)"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "11px 16px" }}><div style={{ display: "flex", alignItems: "center", gap: 9 }}><window.Avatar name={s.name} size={28} />{s.risk && <span className="dotc" style={{ width: 7, height: 7, borderRadius: 99, background: "var(--bad)" }} title="At risk"></span>}<b style={{ fontWeight: 640 }}>{s.name}</b></div></td>
                  <td style={{ padding: "11px 16px", color: "var(--ink-3)" }}>{s.school}</td>
                  <td style={{ padding: "11px 16px" }}><window.MiniPill>{s.grade}</window.MiniPill></td>
                  <td style={{ padding: "11px 16px" }}><span className="chip mono" style={{ height: 20, fontSize: 10.5 }}>{s.ay}</span></td>
                  <td style={{ padding: "11px 16px" }}><div style={{ display: "flex", alignItems: "center", gap: 6 }}><window.SubjectChip subject={s.subject} sm /><span className="chip" style={{ height: 20, fontSize: 10.5 }}>{s.level}</span></div></td>
                  <td style={{ padding: "11px 16px" }}><div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 50, height: 6, background: "var(--surface-3)", borderRadius: 99 }}><div style={{ width: s.completion + "%", height: "100%", background: s.completion < 50 ? "var(--bad)" : "var(--good)", borderRadius: 99 }}></div></div><span className="mono" style={{ fontSize: 11.5 }}>{s.completion}%</span></div></td>
                  <td style={{ padding: "11px 16px" }}>{s.risk ? <span className="status s-revise"><span className="dotc"></span>At risk</span> : <span className="status s-pub"><span className="dotc"></span>On track</span>}</td>
                  <td style={{ padding: "11px 6px" }} onClick={(e) => e.stopPropagation()}><window.Menu items={[{ label: "View profile", icon: window.IcChart, onClick: () => onOpenStudent && onOpenStudent(s) }, { label: "Edit / move class", icon: window.IcEdit, onClick: () => {} }, { label: "Promote", icon: window.IcArrowR, onClick: () => onPromotions && onPromotions() }]} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {tab === "team" && (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead><tr style={{ background: "var(--surface-2)", textAlign: "left", color: "var(--ink-3)", fontSize: 11.5 }}>{["Member","Email","Login Type","Scope","Last active","Status",""].map((h, i) => <th key={i} style={{ padding: "11px 16px", fontWeight: 650 }}>{h}</th>)}</tr></thead>
            <tbody>
              {window.TEAM.map(m => (
                <tr key={m.id} style={{ borderTop: "1px solid var(--hair)" }} onMouseEnter={(e) => e.currentTarget.style.background = "var(--surface-2)"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "11px 16px" }}><div style={{ display: "flex", alignItems: "center", gap: 9 }}><window.Avatar name={m.name} size={28} /><b style={{ fontWeight: 640 }}>{m.name}</b></div></td>
                  <td className="mono" style={{ padding: "11px 16px", color: "var(--ink-3)", fontSize: 11.5 }}>{m.email}</td>
                  <td style={{ padding: "11px 16px" }}><span className="chip" style={{ background: m.login === "Program Team" ? "var(--st-sched-bg)" : "var(--tamil-soft)", color: m.login === "Program Team" ? "var(--st-sched)" : "var(--tamil)" }}>{m.login}</span></td>
                  <td style={{ padding: "11px 16px", color: "var(--ink-3)", fontSize: 12 }}>{m.scope}</td>
                  <td style={{ padding: "11px 16px", color: "var(--ink-4)", fontSize: 12 }}>{m.last}</td>
                  <td style={{ padding: "11px 16px" }}><span className={"status " + (m.status === "active" ? "s-pub" : "s-review")}><span className="dotc"></span>{m.status === "active" ? "Active" : "Pending"}</span></td>
                  <td style={{ padding: "11px 6px" }}>{!readOnly && <window.Menu items={[{ label: "Edit scope", icon: window.IcEdit, onClick: () => setAddTeam(true) }, { label: "Resend invite", icon: window.IcMsg, onClick: () => window.toast("Invite resent") }, { sep: true }, { label: "Revoke access", icon: window.IcLock, danger: true, onClick: () => window.toast("Access revoked") }]} />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {bulk && <window.BulkUploadModal entity={tab} columns={tab === "teachers" ? ["Name","Email","Phone","School","Subjects","Classes"] : ["Name","School","Academic Grade","Academic Year","Subject","Subject Level","Parent Name","Parent Email"]} onClose={() => setBulk(false)} />}
      {neu && tab === "teachers" && <window.NewEntity entity="Teacher" fields={[{ label: "Full name" }, { label: "Email" }, { label: "Phone" }, { label: "School", type: "search", req: true, options: window.SCHOOLS.map(s => s.name) }, { label: "Gender", type: "select", options: ["Male","Female","Other"] }, { label: "Subjects", type: "select", options: ["Maths","English","Tamil"] }, { label: "Qualifications", opt: true }, { label: "Assign to class", type: "select", options: window.CLASSES.map(c => c.name) }, { label: "Role", type: "select", options: ["Primary","Co-Teacher"] }]} onClose={() => setNeu(false)} />}
      {neu && tab === "students" && <window.NewEntity entity="Student" fields={[{ label: "Student name" }, { label: "School", type: "search", req: true, options: window.SCHOOLS.map(s => s.name) }, { label: "Gender", type: "select", options: ["Male","Female","Other"] }, { label: "Academic Grade", type: "select", req: true, options: window.GRADES }, { label: "Academic Year", type: "select", req: true, options: window.ACADEMIC_YEARS }, { label: "Subject", type: "select", options: ["Tamil","English","Maths"] }, { label: "Subject Level", type: "select", options: ["Level 1","Level 2","Level 3","Level 4","Level 5"] }, { label: "Parent name" }, { label: "Parent email" }, { label: "Parent phone" }]} onClose={() => setNeu(false)} />}
      {addTeam && <AddTeamMember onClose={() => setAddTeam(false)} />}
    </div>
  );
}

window.SchoolSetup = SchoolSetup;
window.Users = Users;
window.AddTeamMember = AddTeamMember;
