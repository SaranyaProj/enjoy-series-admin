/* roles.jsx — role definitions, per-role navigation, identities, and the Admin dashboard */

const ROLES = {
  admin: {
    key: "admin", label: "Admin", pill: "Admin", pillBg: "var(--pri-soft)", pillColor: "var(--pri-ink)",
    user: { name: "Aravind Rao", email: "aravind@enjoyseries.org", bg: "var(--pri)" },
    subtitle: "Admin Console",
    nav: [
      { group: "Workspace", items: [{ id: "dashboard", label: "Dashboard", icon: "IcGrid" }] },
      { group: "Organization", items: [
        { id: "organization", label: "States & Schools", icon: "IcGrid", crumb: "Organization" },
        { id: "schoolsetup", label: "School Setup", icon: "IcSubject", crumb: "Organization" },
        { id: "users", label: "Users", icon: "IcUsers", crumb: "Organization", children: [
          { tab: "teachers", label: "Teachers", icon: "IcUsers" },
          { tab: "students", label: "Students", icon: "IcUsers" },
          { tab: "team", label: "Team Accounts", icon: "IcWorkflow" },
        ]},
        { id: "promotions", label: "Grade Promotion", icon: "IcArrowR", crumb: "Organization" },
      ]},
      { group: "Content (read-only)", items: [
        { id: "modules", label: "Lesson Modules", icon: "IcModule", crumb: "Content Studio" },
        { id: "repository", label: "Game Repository", icon: "IcRepo", crumb: "Content Studio" },
        { id: "questionbank", label: "Question Bank", icon: "IcQuiz", crumb: "Content Studio" },
        { id: "journeys", label: "Learning Journeys", icon: "IcJourney", crumb: "Curriculum" },
      ]},
      { group: "Insights", items: [
        { id: "progression", label: "Student Progression", icon: "IcUsers", crumb: "Insights" },
        { id: "analytics", label: "Analytics", icon: "IcChart", crumb: "Analytics" },
      ]},
      { group: "Engage", items: [
        { id: "communication", label: "Communication", icon: "IcMsg", crumb: "Engage" },
      ]},
      { group: "System", items: [
        { id: "settings", label: "Settings", icon: "IcSettings", crumb: "System" },
      ]},
    ],
  },
  program: {
    key: "program", label: "Program Team", pill: "Program", pillBg: "var(--st-sched-bg)", pillColor: "var(--st-sched)",
    user: { name: "Rajesh Pillai", email: "rajesh@enjoyseries.org", bg: "var(--st-sched)" },
    subtitle: "Program Console",
    nav: [
      { group: "Workspace", items: [{ id: "dashboard", label: "Dashboard", icon: "IcGrid" }] },
      { group: "Deployment", items: [
        { id: "curriculum", label: "Curriculum Assignment", icon: "IcLayers", crumb: "Deployment" },
        { id: "activation", label: "Activation Workflow", icon: "IcWorkflow", crumb: "Deployment" },
      ]},
      { group: "Content (read-only)", items: [
        { id: "modules", label: "Lesson Modules", icon: "IcModule", crumb: "Content Studio" },
        { id: "repository", label: "Game Repository", icon: "IcRepo", crumb: "Content Studio" },
      ]},
      { group: "Organization (read-only)", items: [
        { id: "schoolsetup", label: "Classes", icon: "IcSubject", crumb: "Organization" },
        { id: "users", label: "Users", icon: "IcUsers", crumb: "Organization", children: [
          { tab: "teachers", label: "Teachers", icon: "IcUsers" },
          { tab: "students", label: "Students", icon: "IcUsers" },
        ]},
      ]},
      { group: "Insights", items: [
        { id: "progression", label: "Student Progression", icon: "IcUsers", crumb: "Insights" },
        { id: "analytics", label: "Analytics", icon: "IcChart", crumb: "Analytics" },
      ]},
      { group: "Engage", items: [
        { id: "communication", label: "Communication", icon: "IcMsg", crumb: "Engage" },
      ]},
    ],
  },
  content: {
    key: "content", label: "Content Team", pill: "Content", pillBg: "var(--tamil-soft)", pillColor: "var(--tamil)",
    user: { name: "Priya Raman", email: "priya@enjoyseries.org", bg: "var(--pri)" },
    subtitle: "Content Studio",
    nav: [
      { group: "Workspace", items: [{ id: "dashboard", label: "Dashboard", icon: "IcGrid" }] },
      { group: "Content Studio", items: [
        { id: "cycle", label: "Instructional Cycle", icon: "IcLayers", crumb: "Content Studio" },
        { id: "modules", label: "Lesson Modules", icon: "IcModule", count: 5, crumb: "Content Studio" },
        { id: "repository", label: "Game Repository", icon: "IcRepo", count: 16, crumb: "Content Studio" },
        { id: "questionbank", label: "Question Bank", icon: "IcQuiz", count: 12, crumb: "Content Studio" },
      ]},
      { group: "Curriculum", items: [
        { id: "journeys", label: "Learning Journeys", icon: "IcJourney", count: 12, crumb: "Curriculum" },
        { id: "subjects", label: "Subjects & Courses", icon: "IcSubject", crumb: "Curriculum" },
      ]},
      { group: "Deployment", items: [
        { id: "activation", label: "Activation Workflow", icon: "IcWorkflow", crumb: "Workflow" },
      ]},
      { group: "Insights", items: [
        { id: "contentanalytics", label: "Content Usage", icon: "IcChart", crumb: "Analytics" },
      ]},
    ],
  },
};

/* ---------- Admin dashboard ---------- */
function AdminDashboard({ go }) {
  return (
    <div className="page page-anim">
      <div className="page-head">
        <div><h1>Platform overview</h1><p>Welcome back, Aravind. 158 schools across 4 states are active. 2 content items await review and 1 state has a pending calendar.</p></div>
        <div className="actions">
          <button className="btn" onClick={() => go("users")}><window.IcUsers style={{ width: 15, height: 15 }} />Add Team Member</button>
          <button className="btn btn-pri" onClick={() => go("organization")}><window.IcPlus style={{ width: 16, height: 16 }} />New School</button>
        </div>
      </div>
      <div className="kpi-row">
        <div className="kpi"><div className="k-label"><window.IcGrid style={{ width: 14, height: 14 }} />States</div><div className="k-num mono">4</div><div className="k-sub">21 cities</div></div>
        <div className="kpi"><div className="k-label"><window.IcSubject style={{ width: 14, height: 14 }} />Schools</div><div className="k-num mono">158</div><div className="k-sub"><span className="up">↑ 6</span> this term</div></div>
        <div className="kpi"><div className="k-label"><window.IcUsers style={{ width: 14, height: 14 }} />Students</div><div className="k-num mono">31.2k</div><div className="k-sub">2,064 teachers</div></div>
        <div className="kpi"><div className="k-label"><window.IcCheckCircle style={{ width: 14, height: 14 }} />Platform completion</div><div className="k-num mono">79%</div><div className="k-sub"><span className="up">↑ 6%</span></div></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 16 }}>
        <div className="card" style={{ overflow: "hidden" }}>
          <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--hair)", display: "flex", alignItems: "center" }}><b style={{ fontSize: 13.5, fontWeight: 700 }}>States at a glance</b><button className="btn btn-ghost btn-sm" style={{ marginLeft: "auto" }} onClick={() => go("organization")}>Manage<window.IcChevR style={{ width: 14, height: 14 }} /></button></div>
          {window.STATES.filter(s => s.status === "active").map(s => (
            <div key={s.id} onClick={() => go("organization")} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 16px", borderTop: "1px solid var(--hair)", cursor: "pointer" }} onMouseEnter={(e) => e.currentTarget.style.background = "var(--surface-2)"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: "var(--pri-soft)", color: "var(--pri-ink)", display: "grid", placeItems: "center" }} className="mono"><b style={{ fontSize: 11 }}>{s.code}</b></div>
              <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 640 }}>{s.name}</div><div className="dim" style={{ fontSize: 11.5 }}>{s.cities} cities · {s.schools} schools</div></div>
              <span className="mono" style={{ fontSize: 12.5, color: "var(--ink-2)" }}>{s.students.toLocaleString()}</span>
              <span className="dim" style={{ fontSize: 11 }}>students</span>
            </div>
          ))}
        </div>
        <div className="card card-pad">
          <div style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 13 }}>Alerts</div>
          {[["IcMsg","var(--st-revise)","var(--st-revise-bg)","Content awaiting review","2 modules submitted by Content Team","activation"],["IcClock","var(--st-review)","var(--st-review-bg)","Calendar pending","West Bengal academic calendar unset","organization"],["IcUsers","var(--st-sched)","var(--st-sched-bg)","Pending invite","Vikram Nair (Program) hasn't accepted","users"]].map(([ic, c, bg, t, d, dest], i) => (
            <div key={i} onClick={() => go(dest)} style={{ display: "flex", gap: 11, padding: "11px 12px", borderRadius: "var(--r-md)", background: bg, marginBottom: 10, cursor: "pointer" }}>
              {React.createElement(window[ic], { style: { width: 18, height: 18, color: c, flexShrink: 0, marginTop: 1 } })}
              <div><div style={{ fontSize: 12.5, fontWeight: 650, color: c }}>{t}</div><div style={{ fontSize: 11.5, color: "var(--ink-3)" }}>{d}</div></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

window.ROLES = ROLES;
window.AdminDashboard = AdminDashboard;
