/* analytics.jsx — Analytics & Reporting (Admin / Program full access)
   Student Dashboard · Class Overview · School & Platform Reports + Report Builder */
const { useState: useStateAn } = React;

function Donut({ pct, size = 80, color = "var(--pri)", label, sub }) {
  const r = (size - 10) / 2, c = 2 * Math.PI * r;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--surface-3)" strokeWidth="8" />
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct/100)} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}><span className="mono" style={{ fontSize: size * 0.26, fontWeight: 740 }}>{pct}<span style={{ fontSize: size * 0.14 }}>%</span></span></div>
      </div>
      {label && <div style={{ textAlign: "center" }}><div style={{ fontSize: 12, fontWeight: 600 }}>{label}</div>{sub && <div className="dim" style={{ fontSize: 10.5 }}>{sub}</div>}</div>}
    </div>
  );
}

function Bars({ data, color = "var(--pri)", h = 120 }) {
  const max = Math.max(...data.map(d => d.v));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: h }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%", justifyContent: "flex-end" }}>
          <div style={{ width: "100%", maxWidth: 38, height: (d.v/max*100) + "%", background: d.c || color, borderRadius: "5px 5px 0 0", minHeight: 4, transition: "height .3s" }}></div>
          <span className="dim" style={{ fontSize: 10.5 }}>{d.l}</span>
        </div>
      ))}
    </div>
  );
}

/* ---------- Student dashboard (drill-down) ---------- */
function StudentDashboard({ st, onBack }) {
  return (
    <div className="page page-anim">
      <button className="btn btn-ghost btn-sm" style={{ marginBottom: 14 }} onClick={onBack}><window.IcChevL style={{ width: 15, height: 15 }} />Back to Students</button>
      <div className="card card-pad" style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18 }}>
        <window.Avatar name={st.name} size={52} />
        <div>
          <h1 style={{ fontSize: 21, margin: 0 }}>{st.name}</h1>
          <div className="muted" style={{ fontSize: 12.5, marginTop: 2 }}>{st.school || st.cls} · Parent: {st.parent}</div>
          <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
            {st.grade && <span className="chip" style={{ height: 20, fontSize: 10.5, background: "var(--pri-soft)", color: "var(--pri-ink)", fontWeight: 700 }}>{st.grade}</span>}
            {st.ay && <span className="chip mono" style={{ height: 20, fontSize: 10.5 }}>{st.ay}</span>}
            {st.subject && <window.SubjectChip subject={st.subject} sm />}
            {st.level && <span className="chip" style={{ height: 20, fontSize: 10.5 }}>{st.level}</span>}
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 26 }}>
          <Donut pct={st.completion} label="Completion" />
          <div style={{ textAlign: "center", alignSelf: "center" }}><div className="mono" style={{ fontSize: 26, fontWeight: 740 }}>{st.percentile}<span style={{ fontSize: 14 }}>th</span></div><div className="dim" style={{ fontSize: 11 }}>class percentile</div></div>
          <div style={{ textAlign: "center", alignSelf: "center" }}><div className="mono" style={{ fontSize: 26, fontWeight: 740, color: st.risk ? "var(--bad)" : "var(--good)" }}>{st.avgLevel}</div><div className="dim" style={{ fontSize: 11 }}>avg game level</div></div>
        </div>
      </div>

      {/* Promotion history (audit trail) */}
      {(() => {
        const hist = (window.PROMOTION_HISTORY || []).filter(h => h.student === st.name);
        return (
          <div className="card card-pad" style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <window.IcArrowR style={{ width: 15, height: 15, color: "var(--pri)" }} />
              <div style={{ fontSize: 13, fontWeight: 700 }}>Promotion history</div>
              <span className="chip mono" style={{ height: 19, fontSize: 10.5 }}>{hist.length}</span>
            </div>
            {hist.length === 0 ? <div className="dim" style={{ fontSize: 12 }}>No promotions recorded yet for {st.name}.</div> : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {hist.map(h => (
                  <div key={h.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 11px", border: "1px solid var(--hair)", borderRadius: "var(--r-sm)", background: "var(--surface-2)" }}>
                    <span className="chip" style={{ height: 19, fontSize: 10.5, background: "var(--pri-soft)", color: "var(--pri-ink)", fontWeight: 700 }}>{h.toGrade || h.grade}</span>
                    <span className="mono" style={{ fontSize: 11.5 }}>{h.fromAY}</span><window.IcArrowR style={{ width: 12, height: 12, color: "var(--ink-4)" }} /><span className="mono" style={{ fontSize: 11.5 }}>{h.toAY}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, marginLeft: 6 }}>{(h.fromGrade || h.fromLevel)} → {(h.toGrade || h.toLevel)}</span>
                    {h.note && <span className="dim" style={{ fontSize: 11 }}>· {h.note}</span>}
                    <span className="dim" style={{ fontSize: 11, marginLeft: "auto" }}>{h.date} · by {h.by}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })()}

      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 14 }}>
        <div className="card card-pad">
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>Journey progress</div>
          {[["Early Numeracy Foundations","Maths",st.completion],["Phonics & First Words","English",Math.max(0, st.completion - 22)]].map(([n, sub, p], i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}><window.SubjectChip subject={sub} sm /><span style={{ fontSize: 12.5, fontWeight: 600 }}>{n}</span><span className="mono dim" style={{ marginLeft: "auto", fontSize: 12 }}>{p}%</span></div>
              <div style={{ display: "flex", gap: 4 }}>{Array.from({ length: 9 }).map((_, x) => <div key={x} style={{ flex: 1, height: 7, borderRadius: 3, background: x < Math.round(p/100*9) ? window.SUBJECTS[sub].color : "var(--surface-3)" }}></div>)}</div>
            </div>
          ))}
          <hr className="hairline" style={{ margin: "4px 0 14px" }} />
          <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 11 }}>Adaptive path — last game</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", fontSize: 11.5, color: "var(--ink-2)" }}>
            <span className="lvl">L1</span><window.IcArrowR style={{ width: 12, height: 12, color: "var(--ink-4)" }} /><span style={{ color: "var(--good)" }}>4/5 ✓</span><window.IcArrowR style={{ width: 12, height: 12, color: "var(--ink-4)" }} /><span className="lvl">L2</span><window.IcArrowR style={{ width: 12, height: 12, color: "var(--ink-4)" }} /><span style={{ color: "var(--bad)" }}>2/5 ✗</span><window.IcArrowR style={{ width: 12, height: 12, color: "var(--ink-4)" }} /><span className="lvl">L1</span><window.IcArrowR style={{ width: 12, height: 12, color: "var(--ink-4)" }} /><span style={{ color: "var(--good)" }}>5/5 ✓</span><window.IcArrowR style={{ width: 12, height: 12, color: "var(--ink-4)" }} /><span className="lvl">L2</span>
          </div>
        </div>
        <div className="card card-pad">
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>Quiz &amp; game scores</div>
          <Bars data={[{ l: "W1", v: 72 }, { l: "W2", v: 80 }, { l: "W3", v: 65 }, { l: "W4", v: 88 }, { l: "W5", v: 91 }]} color={st.risk ? "var(--warn)" : "var(--pri)"} />
          <hr className="hairline" style={{ margin: "16px 0 12px" }} />
          <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 10 }}>Per-level accuracy</div>
          {[["L1", 92], ["L2", 74], ["L3", 51]].map(([lv, p]) => (
            <div key={lv} style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 7 }}><span className="lvl" style={{ width: 26 }}>{lv}</span><div style={{ flex: 1, height: 6, background: "var(--surface-3)", borderRadius: 99 }}><div style={{ width: p + "%", height: "100%", background: "var(--pri)", borderRadius: 99 }}></div></div><span className="mono dim" style={{ fontSize: 11, width: 32, textAlign: "right" }}>{p}%</span></div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Analytics hub ---------- */
function Analytics({ role }) {
  const [tab, setTab] = useStateAn("class");
  const [builder, setBuilder] = useStateAn(false);
  return (
    <div className="page page-anim wide">
      <div className="page-head">
        <div><h1>Analytics &amp; Reporting</h1><p>Full analytics across students, classes, schools and the platform. Build and schedule custom reports.</p></div>
        <div className="actions"><button className="btn" onClick={() => setBuilder(true)}><window.IcChart style={{ width: 15, height: 15 }} />Report Builder</button></div>
      </div>
      <div className="toolbar">
        <div className="seg">
          <button className={tab === "class" ? "on" : ""} onClick={() => setTab("class")}>Class Overview</button>
          <button className={tab === "school" ? "on" : ""} onClick={() => setTab("school")}>School &amp; Platform</button>
        </div>
        <select className="filter-pill" style={{ height: 32, marginLeft: "auto" }}><option>This term</option><option>This month</option><option>This week</option></select>
      </div>

      {tab === "class" && (
        <>
          <div className="kpi-row">
            <div className="kpi"><div className="k-label"><window.IcCheckCircle style={{ width: 14, height: 14 }} />Avg completion</div><div className="k-num mono">81%</div><div className="k-sub"><span className="up">↑ 4%</span> vs last term</div></div>
            <div className="kpi"><div className="k-label"><window.IcLayers style={{ width: 14, height: 14 }} />Avg game level</div><div className="k-num mono">2.4</div><div className="k-sub">of 3 levels</div></div>
            <div className="kpi"><div className="k-label"><window.IcArrowR style={{ width: 14, height: 14 }} />Promotion rate</div><div className="k-num mono">68%</div><div className="k-sub">demotion 14%</div></div>
            <div className="kpi"><div className="k-label"><window.IcUsers style={{ width: 14, height: 14 }} />At-risk students</div><div className="k-num mono" style={{ color: "var(--bad)" }}>12</div><div className="k-sub">need attention</div></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div className="card card-pad">
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>Completion by class</div>
              <Bars data={[{ l: "1-A", v: 86 }, { l: "1-B", v: 78 }, { l: "2-A", v: 91 }, { l: "3-A", v: 64 }, { l: "2-C", v: 73 }, { l: "4-A", v: 82 }]} />
            </div>
            <div className="card card-pad">
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>Quiz heat map · most-missed items</div>
              {[["Place value: 3-digit","Maths","48%"],["Synonym: 'rapid'","Tamil","44%"],["Spell: 'beautiful'","English","41%"],["Compare: 89 vs 98","Maths","37%"]].map(([t, s, p], i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}><window.SubjectChip subject={s} sm /><span style={{ fontSize: 12.5, fontWeight: 550 }}>{t}</span><span className="mono" style={{ marginLeft: "auto", fontSize: 12.5, fontWeight: 650, color: "var(--bad)" }}>{p} miss</span></div>
              ))}
            </div>
          </div>
        </>
      )}

      {tab === "school" && (
        <>
          <div className="kpi-row">
            <div className="kpi"><div className="k-label"><window.IcUsers style={{ width: 14, height: 14 }} />Enrollment</div><div className="k-num mono">31.2k</div><div className="k-sub">across 158 schools</div></div>
            <div className="kpi"><div className="k-label"><window.IcCheckCircle style={{ width: 14, height: 14 }} />Platform completion</div><div className="k-num mono">79%</div><div className="k-sub"><span className="up">↑ 6%</span></div></div>
            <div className="kpi"><div className="k-label"><window.IcSubject style={{ width: 14, height: 14 }} />Teacher activity</div><div className="k-num mono">92%</div><div className="k-sub">weekly active</div></div>
            <div className="kpi"><div className="k-label"><window.IcGrid style={{ width: 14, height: 14 }} />Active states</div><div className="k-num mono">4</div><div className="k-sub">21 cities</div></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14 }}>
            <div className="card card-pad">
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>Performance by state <span className="dim" style={{ fontWeight: 500 }}>· avg completion</span></div>
              {window.STATES.filter(s => s.status === "active").map(s => (
                <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <span className="mono lvl" style={{ width: 30 }}>{s.code}</span>
                  <span style={{ fontSize: 12.5, fontWeight: 550, minWidth: 96 }}>{s.name}</span>
                  <div style={{ flex: 1, height: 7, background: "var(--surface-3)", borderRadius: 99 }}><div style={{ width: (60 + s.id.charCodeAt(1) % 30) + "%", height: "100%", background: "var(--pri)", borderRadius: 99 }}></div></div>
                  <span className="mono dim" style={{ fontSize: 11, width: 64, textAlign: "right" }}>{s.schools} schools</span>
                </div>
              ))}
            </div>
            <div className="card card-pad">
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>Performance by subject</div>
              <div style={{ display: "flex", justifyContent: "space-around", marginBottom: 8 }}>
                <Donut pct={84} size={88} color="var(--maths)" label="Maths" />
                <Donut pct={78} size={88} color="var(--english)" label="English" />
                <Donut pct={81} size={88} color="var(--tamil)" label="Tamil" />
              </div>
            </div>
          </div>
        </>
      )}

      {builder && <ReportBuilder onClose={() => setBuilder(false)} />}
    </div>
  );
}

function ReportBuilder({ onClose }) {
  const [step, setStep] = useStateAn(1);
  return (
    <window.Modal title="Report Builder" sub="Select type and filters, preview, then export or schedule delivery." onClose={onClose} width={620}
      foot={step === 1
        ? <><button className="btn btn-pri" onClick={() => setStep(2)}>Preview report<window.IcArrowR style={{ width: 15, height: 15 }} /></button><button className="btn btn-ghost" onClick={onClose}>Cancel</button></>
        : <><button className="btn btn-pri" onClick={() => { window.toast("Report exported"); onClose(); }}><window.IcUpload style={{ width: 15, height: 15, transform: "rotate(180deg)" }} />Export PDF</button><button className="btn"><window.IcUpload style={{ width: 14, height: 14, transform: "rotate(180deg)" }} />CSV</button><button className="btn"><window.IcClock style={{ width: 14, height: 14 }} />Schedule</button><button className="btn"><window.IcLink style={{ width: 14, height: 14 }} />Share link</button><button className="btn btn-ghost" style={{ marginLeft: "auto" }} onClick={() => setStep(1)}>Back</button></>}>
      {step === 1 ? (
        <>
          <div className="field"><label>Report type</label><select className="sel"><option>Class performance</option><option>School comparison</option><option>Student progress</option><option>Content usage</option><option>Teacher activity</option></select></div>
          <div className="row-2">
            <div className="field"><label>Scope</label><select className="sel"><option>Platform</option><option>State</option><option>City</option><option>School</option><option>Class</option></select></div>
            <div className="field"><label>Date range</label><select className="sel"><option>This term</option><option>This month</option><option>Custom…</option></select></div>
          </div>
          <div className="field" style={{ marginBottom: 0 }}><label>Include metrics</label><div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{["Completion","Quiz scores","Game levels","Promotion rate","Most-missed","At-risk","Teacher activity"].map(m => <span key={m} className="chip" style={{ cursor: "pointer", background: "var(--pri-soft)", color: "var(--pri-ink)" }}><window.IcCheck style={{ width: 12, height: 12 }} />{m}</span>)}</div></div>
        </>
      ) : (
        <div className="card card-pad" style={{ background: "var(--surface-2)" }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 3 }}>Class Performance — Term 1</div>
          <div className="dim" style={{ fontSize: 11.5, marginBottom: 14 }}>Platform scope · generated just now</div>
          <Bars data={[{ l: "1-A", v: 86 }, { l: "1-B", v: 78 }, { l: "2-A", v: 91 }, { l: "3-A", v: 64 }, { l: "2-C", v: 73 }]} h={100} />
          <hr className="hairline" style={{ margin: "14px 0" }} />
          <div style={{ display: "flex", gap: 18 }}><div><div className="mono" style={{ fontSize: 20, fontWeight: 740 }}>81%</div><div className="dim" style={{ fontSize: 11 }}>avg completion</div></div><div><div className="mono" style={{ fontSize: 20, fontWeight: 740 }}>2.4</div><div className="dim" style={{ fontSize: 11 }}>avg level</div></div><div><div className="mono" style={{ fontSize: 20, fontWeight: 740, color: "var(--bad)" }}>12</div><div className="dim" style={{ fontSize: 11 }}>at-risk</div></div></div>
        </div>
      )}
    </window.Modal>
  );
}

window.Analytics = Analytics;
window.StudentDashboard = StudentDashboard;
