/* journeys.jsx — Learning Journeys: subject-wise column layout (D) + vertical
   topic/lesson builder (E) with a reusable Lesson/Session Module library (F). */
const { useState: useStateJ } = React;

/* derive topic & lesson counts for a journey card (D2: Topics / Lessons, not Modules / Weeks) */
function journeyCounts(j) {
  const topics = j.weeks || 0;
  const lessons = j.lessons != null ? j.lessons : topics * 4; // ~3–4 lessons per topic
  return { topics, lessons };
}

/* ── A single Level journey — compact two-line row (no oversized cards) ──────── */
function Dot() { return <span style={{ color: "var(--ink-4)", margin: "0 2px" }}>•</span>; }
function JourneyCard({ j, onOpen }) {
  const s = window.SUBJECTS[j.subject] || { color: "var(--pri)", cls: "" };
  const { topics, lessons } = journeyCounts(j);
  return (
    <div className="card" style={{ cursor: "pointer", position: "relative", padding: "12px 13px 12px 16px", transition: "box-shadow .15s, border-color .15s, background .15s" }} onClick={() => onOpen(j)}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "var(--sh-2)"; e.currentTarget.style.borderColor = s.color.replace(")", " / 0.45)"); }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "var(--hair)"; }}>
      <div style={{ position: "absolute", left: 0, top: 8, bottom: 8, width: 3, borderRadius: 99, background: s.color }}></div>
      {/* status pinned top-right */}
      <div style={{ position: "absolute", top: 11, right: 11 }} onClick={(e) => e.stopPropagation()}><window.StatusBadge status={j.status} /></div>
      {/* Line 1 — Level • Subject (primary identifiers) */}
      <div style={{ display: "flex", alignItems: "center", fontSize: 13.5, paddingRight: 90 }}>
        <span style={{ fontWeight: 760, color: s.color, letterSpacing: "-0.01em" }}>{j.grade}</span>
        <Dot /><span style={{ fontWeight: 650, color: "var(--ink-2)" }}>{j.subject}</span>
      </div>
      {/* Line 2 — Lessons • Mastery (Topic count removed) */}
      <div style={{ display: "flex", alignItems: "center", marginTop: 6 }}>
        <div style={{ fontSize: 11.5, color: "var(--ink-3)" }}>
          <b className="mono" style={{ color: "var(--ink-2)" }}>{lessons}</b> Lessons<Dot /><b className="mono" style={{ color: s.color }}>{j.mastery}%</b> Mastery
        </div>
        <div style={{ marginLeft: "auto" }} onClick={(e) => e.stopPropagation()}><window.Menu items={[{ label: "Open builder", icon: window.IcEdit, onClick: () => onOpen(j) }, { label: "Duplicate", icon: window.IcCopy, onClick: () => window.toast("Journey duplicated") }, { sep: true }, { label: "Archive", icon: window.IcArchive, danger: true, onClick: () => window.toast("Archived") }]} /></div>
      </div>
    </div>
  );
}

/* ── Per-subject diagnostic entry card (D1) ──────────────────────────────────── */
function DiagnosticCard({ subject, onOpen }) {
  const s = window.SUBJECTS[subject] || { color: "var(--pri)" };
  return (
    <div className="card" style={{ overflow: "hidden", cursor: "pointer", borderColor: s.color.replace(")", " / 0.5)"), background: s.color.replace(")", " / 0.05)"), transition: "box-shadow .15s, transform .15s" }} onClick={() => onOpen(subject)}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "var(--sh-3)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}>
      <div style={{ padding: "13px 14px", display: "flex", alignItems: "center", gap: 11 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: s.color, color: "#fff", display: "grid", placeItems: "center", flexShrink: 0 }}><window.IcTarget style={{ width: 19, height: 19 }} /></div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700 }}>Level Diagnostic Assessment</div>
          <div className="dim" style={{ fontSize: 11.5 }}>{subject} · placement entry point</div>
        </div>
        <span className="chip" style={{ height: 20, fontSize: 10.5, flexShrink: 0 }}>Step 1</span>
      </div>
    </div>
  );
}

function JourneyList({ onOpen, onNew, onOpenDiagnostic }) {
  /* D1 column order: Tamil · English · Maths */
  const COLS = ["Tamil", "English", "Maths"];
  const [ay, setAy] = useStateJ((window.ACADEMIC_YEARS || ["2026–27"])[0]);
  const bySubject = (sub) => window.JOURNEYS
    .filter(j => !j.diagnostic && j.subject === sub)
    .sort((a, b) => (parseInt((a.grade || "").replace(/\D/g, ""), 10) || 0) - (parseInt((b.grade || "").replace(/\D/g, ""), 10) || 0));

  return (
    <div className="page page-anim">
      <div className="page-head">
        <div><h1>Learning Journeys</h1><p>Each subject has its own Level Diagnostic Assessment, then a journey per Level. Maths runs Levels 1–5; English &amp; Tamil run Levels 1–3. Pathways are assembled from existing Lesson Modules — no content re-creation.</p></div>
        <div className="actions">
          <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "0 4px 0 11px", height: 38, border: "1px solid var(--hair)", borderRadius: "var(--r-sm)", background: "var(--surface)" }}>
            <window.IcClock style={{ width: 15, height: 15, color: "var(--ink-4)" }} />
            <span className="dim" style={{ fontSize: 11.5, fontWeight: 600 }}>Academic Year</span>
            <select value={ay} onChange={(e) => setAy(e.target.value)} style={{ border: 0, background: "transparent", fontSize: 13, fontWeight: 650, color: "var(--ink)", outline: 0, height: 34 }}>
              {(window.ACADEMIC_YEARS || ["2026–27"]).map(y => <option key={y}>{y}</option>)}
            </select>
          </div>
          <button className="btn btn-pri" onClick={onNew}><window.IcPlus style={{ width: 16, height: 16 }} />New Journey</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16, alignItems: "start" }}>
        {COLS.map(sub => {
          const s = window.SUBJECTS[sub] || { color: "var(--pri)" };
          const journeys = bySubject(sub);
          return (
            <div key={sub} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "2px 2px 4px" }}>
                <span style={{ width: 12, height: 12, borderRadius: 99, background: s.color }}></span>
                <h2 style={{ fontSize: 15.5, fontWeight: 760, margin: 0 }}>{sub}</h2>
                <span className="dim" style={{ fontSize: 11.5, marginLeft: "auto" }}>{journeys.length} levels</span>
              </div>
              <DiagnosticCard subject={sub} onOpen={onOpenDiagnostic} />
              {journeys.map(j => <JourneyCard key={j.id} j={j} onOpen={onOpen} />)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Lesson/Session Module library picker (F) ────────────────────────────────── */
function ModuleLibraryPicker({ subject, onClose, onPick }) {
  const [q, setQ] = useStateJ("");
  const mods = window.MODULES.filter(m =>
    (!subject || m.subject === subject || subject === "All") &&
    m.title.toLowerCase().includes(q.toLowerCase())
  );
  return (
    <window.Modal title="Add Lesson / Session Module" sub="Reuse a previously created lesson module across journeys — no re-creation needed." onClose={onClose} width={640}>
      <div className="searchbox" style={{ marginBottom: 14 }}><window.IcSearch style={{ width: 15, height: 15 }} /><input placeholder="Search lesson modules…" value={q} onChange={(e) => setQ(e.target.value)} autoFocus /></div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 380, overflowY: "auto" }}>
        {mods.map(m => {
          const s = window.SUBJECTS[m.subject] || { color: "var(--pri)" };
          return (
            <button key={m.id} onClick={() => onPick(m)} style={{ display: "flex", alignItems: "center", gap: 11, padding: 11, borderRadius: "var(--r-md)", border: "1px solid var(--hair)", background: "var(--surface)", textAlign: "left", transition: "border-color .12s, box-shadow .12s" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--pri)"; e.currentTarget.style.boxShadow = "var(--sh-1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--hair)"; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: s.color.replace(")", " / 0.10)"), color: s.color, display: "grid", placeItems: "center", flexShrink: 0 }}><window.IcModule style={{ width: 18, height: 18 }} /></div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 640 }}>{m.title}</div>
                <div className="dim" style={{ fontSize: 11 }}>{m.subject} · {m.grade} · {m.blocks} blocks · {m.mins}m</div>
              </div>
              <window.StatusBadge status={m.status} />
            </button>
          );
        })}
        {mods.length === 0 && <div className="dim" style={{ fontSize: 12.5, textAlign: "center", padding: 20 }}>No matching lesson modules.</div>}
      </div>
    </window.Modal>
  );
}

/* ── Journey builder — vertical accordion of Topics → Lessons (E1/E2) ────────── */
function JourneyBuilder({ journey, onExit }) {
  const j = journey;
  const s = window.SUBJECTS[j.subject] || { color: "var(--pri)", cls: "" };
  /* seed topics from existing stages; each topic holds 3–4 lessons (was "modules") */
  const [topics, setTopics] = useStateJ(j.stages && j.stages.length ? j.stages.map(st => ({ name: st.name, lessons: st.modules || [], qualifier: st.qualifier || 70 })) : [
    { name: "Topic 1 — Counting & Cardinality", lessons: ["Numbers 1 to 10", "Numbers 11 to 20", "Compare Quantities"], qualifier: 70 },
    { name: "Topic 2 — Number Operations", lessons: ["Add within 10", "Subtract within 10"], qualifier: 70 },
  ]);
  const [open, setOpen] = useStateJ(0);
  const [picker, setPicker] = useStateJ(null); // topic index awaiting a module pick
  const totalLessons = topics.reduce((a, t) => a + t.lessons.length, 0);

  const addLesson = (m) => {
    setTopics(ts => ts.map((t, i) => i === picker ? { ...t, lessons: [...t.lessons, m.title] } : t));
    setPicker(null); window.toast("“" + m.title + "” added from the module library");
  };

  return (
    <div className="page-anim" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ borderBottom: "1px solid var(--hair)", background: "var(--surface)", padding: "13px 28px", display: "flex", alignItems: "center", gap: 16 }}>
        <button className="btn btn-ghost btn-sm" onClick={onExit}><window.IcChevL style={{ width: 15, height: 15 }} />Journeys</button>
        <div style={{ width: 1, height: 22, background: "var(--hair)" }}></div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: s.color.replace(")"," / 0.10)"), color: s.color, display: "grid", placeItems: "center" }}><window.IcJourney style={{ width: 17, height: 17 }} /></div>
          <div><div style={{ fontSize: 14, fontWeight: 700 }}>{j.name}</div><div className="dim" style={{ fontSize: 11.5 }}>{j.subject} · {j.grade} · {topics.length} topics · {totalLessons} lessons</div></div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 9 }}>
          <select className="sel" style={{ width: 130, height: 32 }}><option>Linear mode</option><option>Flexible mode</option></select>
          <button className="btn btn-sm"><window.IcEye style={{ width: 14, height: 14 }} />Journey map</button>
          <button className="btn btn-pri btn-sm" onClick={() => { window.toast("Submitted for review"); onExit(); }}>Submit for review</button>
        </div>
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: "24px 32px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14 }}>
            <h2 style={{ fontSize: 16, fontWeight: 720, margin: 0 }}>Topics &amp; lessons</h2>
            <span className="dim" style={{ fontSize: 12 }}>Expand a topic to manage its 3–4 lessons</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {topics.map((t, ti) => {
              const expanded = open === ti;
              return (
                <React.Fragment key={ti}>
                {ti > 0 && <div style={{ width: 2, height: 14, background: "var(--hair-2)", marginLeft: 33 }}></div>}
                <div className="card" style={{ overflow: "hidden", borderColor: expanded ? s.color.replace(")", " / 0.4)") : "var(--hair)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "13px 16px", background: expanded ? s.color.replace(")", " / 0.06)") : "transparent" }}>
                    <button onClick={() => setOpen(expanded ? -1 : ti)} style={{ display: "flex", alignItems: "center", gap: 11, flex: 1, minWidth: 0, border: 0, background: "transparent", textAlign: "left" }}>
                      <window.IcChevR style={{ width: 16, height: 16, color: "var(--ink-3)", transform: expanded ? "rotate(90deg)" : "none", transition: "transform .15s" }} />
                      <span style={{ width: 28, height: 28, borderRadius: 99, background: s.color, color: "#fff", display: "grid", placeItems: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }} className="mono">{ti + 1}</span>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 680, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.name}</div>
                        <div className="dim" style={{ fontSize: 11, display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}><window.IcLock style={{ width: 11, height: 11 }} /> Qualifier ≥ <b className="mono" style={{ color: "var(--ink-2)" }}>{t.qualifier}%</b></div>
                      </div>
                    </button>
                    <span className="chip mono" style={{ height: 22, fontSize: 11, flexShrink: 0 }}>{t.lessons.length} lessons</span>
                    <window.Menu items={[{ label: "Topic settings", icon: window.IcSliders, onClick: () => {} }, { label: "Delete topic", icon: window.IcTrash, danger: true, onClick: () => setTopics(ts => ts.filter((_, x) => x !== ti)) }]} />
                  </div>
                  {expanded && (
                    <div style={{ borderTop: "1px solid var(--hair)", background: "var(--surface-2)", padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                      {t.lessons.map((m, mi) => (
                        <div key={mi} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "var(--surface)", border: "1px solid var(--hair)", borderRadius: "var(--r-sm)" }}>
                          <window.IcDrag style={{ width: 14, height: 14, color: "var(--ink-4)" }} />
                          <span className="lvl" style={{ fontSize: 10 }}>L{mi + 1}</span>
                          <div style={{ width: 26, height: 26, borderRadius: 7, background: s.color.replace(")"," / 0.10)"), color: s.color, display: "grid", placeItems: "center", flexShrink: 0 }}><window.IcModule style={{ width: 14, height: 14 }} /></div>
                          <div style={{ minWidth: 0, flex: 1 }}><div style={{ fontSize: 12.5, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m}</div><div className="dim" style={{ fontSize: 10.5 }}>Lesson / Session Module</div></div>
                          <button className="icon-btn" style={{ width: 26, height: 26, border: 0, boxShadow: "none", background: "transparent", color: "var(--ink-4)" }} onClick={() => setTopics(ts => ts.map((x, ix) => ix === ti ? { ...x, lessons: x.lessons.filter((_, y) => y !== mi) } : x))}><window.IcX style={{ width: 14, height: 14 }} /></button>
                        </div>
                      ))}
                      <button className="btn btn-sm" style={{ justifyContent: "center", borderStyle: "dashed", background: "transparent", boxShadow: "none" }} onClick={() => setPicker(ti)}><window.IcPlus style={{ width: 14, height: 14 }} />Add Lesson/Session Module</button>
                    </div>
                  )}
                </div>
                </React.Fragment>
              );
            })}
            <button onClick={() => setTopics(ts => [...ts, { name: "Topic " + (ts.length + 1), lessons: [], qualifier: 70 }])}
              style={{ padding: "14px 16px", border: "1.5px dashed var(--hair-2)", borderRadius: "var(--r-lg)", background: "transparent", color: "var(--ink-3)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 13, fontWeight: 600 }}>
              <window.IcPlus style={{ width: 18, height: 18 }} />Add topic
            </button>
          </div>

          {/* mastery legend */}
          <div className="card card-pad" style={{ marginTop: 18 }}>
            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 11, display: "flex", alignItems: "center", gap: 7 }}><window.IcTarget style={{ width: 15, height: 15, color: "var(--pri)" }} />MASTERY LEVELS</div>
            <div style={{ display: "flex", gap: 10 }}>
              {[["Developing","< 60%","var(--st-revise)"],["Proficient","60–79%","var(--st-review)"],["Mastery","80%+","var(--st-approve)"]].map(([n, r, c]) => (
                <div key={n} style={{ flex: 1, padding: "10px 12px", borderRadius: "var(--r-sm)", background: c.replace(")"," / 0.07)"), border: "1px solid " + c.replace(")"," / 0.2)") }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: c }}>{n}</div><div className="mono" style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 2 }}>{r}</div>
                </div>
              ))}
            </div>
            <div className="dim" style={{ fontSize: 11.5, marginTop: 11, display: "flex", alignItems: "center", gap: 6 }}><window.IcCheckCircle style={{ width: 14, height: 14 }} />Certificate auto-generated on reaching Mastery.</div>
          </div>
        </div>
      </div>

      {picker !== null && <ModuleLibraryPicker subject={j.subject} onClose={() => setPicker(null)} onPick={addLesson} />}
    </div>
  );
}

window.JourneyList = JourneyList;
window.JourneyBuilder = JourneyBuilder;
