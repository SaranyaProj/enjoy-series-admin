/* diagnostic.jsx — Level Diagnostic Assessment builder (per subject).
   Steps: Select Questions → Assessment Flow → Preview & Test.
   The Assessment Flow step uses plain-language guided options (no technical rule
   jargon) — Level-Based, Adaptive or Fixed — each with a VISUAL flow builder. */
const { useState: useStateD } = React;

const DG_STEPS = ["Select Questions", "Assessment Flow", "Preview & Test"];

/* default level-based stages for a subject (one stage per subject Level) */
function defaultStages(subj) {
  const levels = window.levelsForSubject(subj);
  const counts = [10, 5, 5, 5, 5], thr = [8, 4, 4, 4, 4];
  return levels.map((lv, i) => ({ id: "st" + i, level: lv, count: counts[i] || 5, threshold: thr[i] || 4 }));
}
/* default adaptive branching tree */
function defaultTree(subj) {
  const lv = window.levelsForSubject(subj);
  return {
    id: "n1", title: "Starting question", diff: "Medium", qId: null,
    correct:   { id: "n2", title: "Harder question",      diff: "Hard", qId: null, place: lv[Math.min(2, lv.length - 1)] },
    incorrect: { id: "n3", title: "Easier / remedial",    diff: "Easy", qId: null, place: lv[0] },
  };
}

function DiagnosticBuilder({ subject, onExit }) {
  const subj = subject || "Maths";
  const s = window.SUBJECTS[subj] || { color: "var(--pri)" };
  const [step, setStep] = useStateD(1);

  // initial selection: diagnostic-tagged questions for this subject (fallback: any in subject)
  const pool = window.QUESTIONS.filter(qq => qq.subject === subj);
  const seed = pool.filter(qq => (qq.usage || []).includes("diagnostic"));
  const [selected, setSelected] = useStateD((seed.length ? seed : pool.slice(0, 3)).map(qq => ({ ...qq })));
  const selIds = new Set(selected.map(qq => qq.id));

  // assessment flow configuration
  const [flowType, setFlowType] = useStateD("level"); // "level" | "adaptive" | "fixed"
  const [stages, setStages] = useStateD(() => defaultStages(subj));
  const [tree, setTree] = useStateD(() => defaultTree(subj));
  const [bands, setBands] = useStateD(window.defaultBands(subj));
  const [mode, setMode] = useStateD("Percentage");

  const totalMarks = selected.reduce((a, qq) => a + window.questionMarks(qq), 0);

  const next = () => setStep(s => Math.min(3, s + 1));
  const prev = () => setStep(s => Math.max(1, s - 1));

  const addQ = (qq) => setSelected(arr => [...arr, { ...qq }]);
  const removeQ = (id) => setSelected(arr => arr.filter(x => x.id !== id));
  const move = (i, dir) => setSelected(arr => { const c = [...arr]; const j = i + dir; if (j < 0 || j >= c.length) return c; [c[i], c[j]] = [c[j], c[i]]; return c; });

  return (
    <div className="page-anim" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* header */}
      <div style={{ borderBottom: "1px solid var(--hair)", background: "var(--surface)", padding: "13px 28px", display: "flex", alignItems: "center", gap: 18 }}>
        <button className="btn btn-ghost btn-sm" onClick={onExit}><window.IcChevL style={{ width: 15, height: 15 }} />Journeys</button>
        <div style={{ width: 1, height: 22, background: "var(--hair)" }}></div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: s.color.replace(")", " / 0.12)"), color: s.color, display: "grid", placeItems: "center" }}><window.IcTarget style={{ width: 17, height: 17 }} /></div>
          <div><div style={{ fontSize: 14, fontWeight: 700 }}>Diagnostic Assessment — {subj}</div><div className="dim" style={{ fontSize: 11.5 }}>{selected.length} questions · {totalMarks} marks · places students on a Level</div></div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, margin: "0 auto" }}>
          {DG_STEPS.map((label, i) => (
            <React.Fragment key={i}>
              <button onClick={() => setStep(i + 1)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", borderRadius: 99, border: 0, background: step === i + 1 ? "var(--pri-soft)" : "transparent", color: step === i + 1 ? "var(--pri-ink)" : "var(--ink-3)", fontWeight: 650, fontSize: 12.5 }}>
                <span className="mono" style={{ width: 18, height: 18, borderRadius: 99, display: "grid", placeItems: "center", fontSize: 10.5, background: step > i + 1 ? "var(--good)" : step === i + 1 ? "var(--pri)" : "var(--surface-3)", color: step >= i + 1 ? "#fff" : "var(--ink-3)" }}>{step > i + 1 ? "✓" : i + 1}</span>
                <span style={{ display: window.innerWidth < 1100 ? "none" : "inline" }}>{label}</span>
              </button>
              {i < 2 && <div style={{ width: 16, height: 1.5, background: "var(--hair-2)" }}></div>}
            </React.Fragment>
          ))}
        </div>
        <button className="btn btn-pri btn-sm" onClick={() => { window.toast("Diagnostic published"); onExit(); }}><window.IcCheck style={{ width: 15, height: 15 }} />Publish</button>
      </div>

      <div style={{ flex: 1, overflow: "hidden", minHeight: 0 }}>
        {step === 1 && <DgSelect subj={subj} selected={selected} selIds={selIds} addQ={addQ} removeQ={removeQ} move={move} onNext={next} />}
        {step === 2 && <DgFlow subj={subj} s={s} selected={selected} flowType={flowType} setFlowType={setFlowType} stages={stages} setStages={setStages} tree={tree} setTree={setTree} bands={bands} setBands={setBands} mode={mode} setMode={setMode} onPrev={prev} onNext={next} />}
        {step === 3 && <DgPreview subj={subj} s={s} selected={selected} bands={bands} stages={stages} tree={tree} flowType={flowType} totalMarks={totalMarks} onPrev={prev} onPublish={() => { window.toast("Diagnostic published"); onExit(); }} />}
      </div>
    </div>
  );
}

/* ---------- Step 1: select questions ---------- */
function DgSelect({ subj, selected, selIds, addQ, removeQ, move, onNext }) {
  const [grade, setGrade] = useStateD("All");
  const [level, setLevel] = useStateD("All");
  const [diff, setDiff] = useStateD("All");
  const [qtype, setQtype] = useStateD("All");
  const [comp, setComp] = useStateD("All");
  const [lang, setLang] = useStateD("All");
  const [topic, setTopic] = useStateD("All");
  const [q, setQ] = useStateD("");
  const [detail, setDetail] = useStateD(null);

  // option lists scoped to this subject's questions
  const subjQ = window.QUESTIONS.filter(it => it.subject === subj);
  const compOpts = Array.from(new Set(subjQ.map(it => it.competency).filter(Boolean))).sort();
  const topicOpts = Array.from(new Set(subjQ.flatMap(it => it.tags || []))).sort();
  const qtypeName = (id) => (window.QTYPE_BY_ID[id] || {}).name || id;

  const bank = subjQ.filter(it =>
    (grade === "All" || it.grade === grade) && (level === "All" || it.level === level) &&
    (diff === "All" || it.difficulty === diff) && (qtype === "All" || it.type === qtype) &&
    (comp === "All" || it.competency === comp) && (lang === "All" || it.language === lang) &&
    (topic === "All" || (it.tags || []).includes(topic)) &&
    (q === "" || (it.title + " " + (it.content || "") + " " + (it.lo || "")).toLowerCase().includes(q.toLowerCase())));
  const activeCount = [grade, level, diff, qtype, comp, lang, topic].filter(v => v !== "All").length + (q ? 1 : 0);
  const clearAll = () => { setGrade("All"); setLevel("All"); setDiff("All"); setQtype("All"); setComp("All"); setLang("All"); setTopic("All"); setQ(""); };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.5fr) minmax(0,1fr)", height: "100%" }}>
      {/* bank */}
      <div style={{ overflowY: "auto", padding: "22px 26px" }}>
        <h2 style={{ fontSize: 17, fontWeight: 740, margin: "0 0 3px" }}>Pull questions from the bank</h2>
        <p className="dim" style={{ fontSize: 12.5, margin: "0 0 14px" }}>Filter, preview and add questions. Selected questions appear on the right where you can reorder them.</p>

        <div className="card" style={{ padding: "11px 13px", marginBottom: 14, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", gap: 9, alignItems: "center" }}>
            <div className="seg">{["All","Easy","Medium","Hard"].map(x => <button key={x} className={diff === x ? "on" : ""} onClick={() => setDiff(x)}>{x}</button>)}</div>
            <div className="searchbox" style={{ minWidth: 160, height: 32, marginLeft: "auto" }}><window.IcSearch style={{ width: 15, height: 15 }} /><input placeholder="Search outcome…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
          </div>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap", alignItems: "center" }}>
            <window.FilterSelect icon={window.IcUsers} label="Grade" value={grade} options={window.GRADES} onChange={setGrade} allLabel="All grades" />
            <window.FilterSelect icon={window.IcLayers} label="Level" value={level} options={window.levelsForSubject(subj)} onChange={setLevel} allLabel="All levels" />
            <window.FilterSelect icon={window.IcTarget} label="Competency" value={comp} options={compOpts} onChange={setComp} allLabel="All competencies" />
            <window.FilterSelect icon={window.IcQuiz} label="Type" value={qtype === "All" ? "All" : qtypeName(qtype)} options={window.QUESTION_TYPES.map(t => t.name)} onChange={(name) => setQtype(name === "All" ? "All" : (window.QUESTION_TYPES.find(t => t.name === name) || {}).id)} allLabel="All types" />
            <window.FilterSelect icon={window.IcReading} label="Language" value={lang} options={window.LANGUAGES} onChange={setLang} allLabel="All languages" />
            <window.FilterSelect icon={window.IcRepo} label="Topic" value={topic} options={topicOpts} onChange={setTopic} allLabel="All topics" />
            {activeCount > 0 && <button className="btn btn-ghost btn-sm" onClick={clearAll}><window.IcX style={{ width: 13, height: 13 }} />Clear ({activeCount})</button>}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {bank.map(it => {
            const on = selIds.has(it.id);
            return (
              <div key={it.id} className="card" style={{ display: "flex", alignItems: "center", gap: 11, padding: "11px 13px", borderColor: on ? "var(--pri)" : "var(--hair)", background: on ? "var(--pri-soft)" : "var(--surface)" }}>
                <button onClick={() => on ? removeQ(it.id) : addQ(it)} style={{ width: 24, height: 24, flexShrink: 0, borderRadius: 7, border: "1.5px solid " + (on ? "var(--pri)" : "var(--hair-2)"), background: on ? "var(--pri)" : "var(--surface)", display: "grid", placeItems: "center", cursor: "pointer" }}>{on && <window.IcCheck style={{ width: 13, height: 13, color: "#fff" }} />}</button>
                <div style={{ minWidth: 0, flex: 1, cursor: "pointer" }} onClick={() => setDetail(it)}>
                  <div style={{ fontSize: 13, fontWeight: 640, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it.title}</div>
                  <div className="dim" style={{ fontSize: 11, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it.content}</div>
                </div>
                <window.DiffPill d={it.difficulty} sm />
                <window.QTypeTag type={it.type} />
                <button className="icon-btn" style={{ width: 28, height: 28, border: 0, boxShadow: "none", background: "transparent" }} onClick={() => setDetail(it)} title="View details"><window.IcEye style={{ width: 15, height: 15 }} /></button>
              </div>
            );
          })}
          {bank.length === 0 && <div className="card card-pad" style={{ textAlign: "center", color: "var(--ink-3)", fontSize: 12.5 }}>No questions match.</div>}
        </div>
      </div>

      {/* selected / order */}
      <div style={{ borderLeft: "1px solid var(--hair)", background: "var(--surface-2)", display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={{ padding: "18px 20px 10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}><b style={{ fontSize: 13.5 }}>Assessment order</b><span className="chip mono">{selected.length}</span></div>
          <div className="dim" style={{ fontSize: 11.5, marginTop: 3 }}>Drag-free reorder with the arrows. This is the order students experience.</div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "0 20px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
          {selected.map((it, i) => (
            <div key={it.id} style={{ display: "flex", alignItems: "center", gap: 9, padding: "10px 11px", background: "var(--surface)", border: "1px solid var(--hair)", borderRadius: "var(--r-md)" }}>
              <span className="mono" style={{ width: 22, height: 22, borderRadius: 7, background: "var(--pri-soft)", color: "var(--pri-ink)", display: "grid", placeItems: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
              <div style={{ minWidth: 0, flex: 1 }}><div style={{ fontSize: 12.5, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it.title}</div><div className="dim" style={{ fontSize: 10.5 }}>{it.difficulty} · {(window.QTYPE_BY_ID[it.type] || {}).name}</div></div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <button className="icon-btn" style={{ width: 22, height: 18, border: 0, boxShadow: "none", background: "transparent", color: "var(--ink-4)" }} onClick={() => move(i, -1)}><window.IcChevD style={{ width: 13, height: 13, transform: "rotate(180deg)" }} /></button>
                <button className="icon-btn" style={{ width: 22, height: 18, border: 0, boxShadow: "none", background: "transparent", color: "var(--ink-4)" }} onClick={() => move(i, 1)}><window.IcChevD style={{ width: 13, height: 13 }} /></button>
              </div>
              <button className="icon-btn" style={{ width: 26, height: 26, border: 0, boxShadow: "none", background: "transparent", color: "var(--ink-4)" }} onClick={() => removeQ(it.id)}><window.IcX style={{ width: 14, height: 14 }} /></button>
            </div>
          ))}
          {selected.length === 0 && <div className="dim" style={{ fontSize: 12, textAlign: "center", padding: 24 }}>No questions yet — tick questions on the left.</div>}
        </div>
        <div style={{ borderTop: "1px solid var(--hair)", padding: "12px 20px", background: "var(--surface)" }}>
          <button className="btn btn-pri btn-lg" style={{ width: "100%" }} disabled={selected.length === 0} onClick={onNext}>Next: Assessment Flow<window.IcArrowR style={{ width: 16, height: 16 }} /></button>
        </div>
      </div>

      {detail && (
        <window.SlideOver title={detail.title} sub={(window.QTYPE_BY_ID[detail.type] || {}).name + " · " + detail.subject + " · " + detail.level} onClose={() => setDetail(null)}
          foot={<button className="btn btn-pri" onClick={() => { selIds.has(detail.id) ? removeQ(detail.id) : addQ(detail); setDetail(null); }}>{selIds.has(detail.id) ? "Remove from assessment" : "Add to assessment"}</button>}>
          <div className="card card-pad"><window.QuestionPreviewCard q={detail} showKey /></div>
        </window.SlideOver>
      )}
    </div>
  );
}

/* ---------- Step 2: Assessment Flow (guided, visual) ---------- */
const FLOW_TYPES = [
  { id: "level",    name: "Level-Based Assessment",  icon: "IcLayers",      color: "var(--maths)",   tag: "Most common",
    desc: "Students progress to the next level after achieving the required score.", flow: "Level 1 → score ≥ 8 → Level 2 → score ≥ 4 → Level 3" },
  { id: "adaptive", name: "Adaptive Assessment",     icon: "IcSparkle",     color: "var(--pri)",     tag: "Personalised",
    desc: "The next question is chosen automatically based on the student's answer.", flow: "Q1 → correct → harder · incorrect → easier" },
  { id: "fixed",    name: "Fixed Assessment",        icon: "IcGrid",        color: "var(--english)", tag: "Simplest",
    desc: "Every student receives the same set of questions; the total score places them.", flow: "Same questions for everyone → score → Level" },
];

function DgFlow({ subj, s, selected, flowType, setFlowType, stages, setStages, tree, setTree, bands, setBands, mode, setMode, onPrev, onNext }) {
  return (
    <div style={{ overflowY: "auto", height: "100%", padding: "24px 28px" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", flexDirection: "column", gap: 18 }}>
        <div>
          <h2 style={{ fontSize: 17, fontWeight: 740, margin: "0 0 3px" }}>How should this assessment work?</h2>
          <p className="dim" style={{ fontSize: 12.5, margin: 0 }}>Choose a format in plain language — we set up the underlying logic for you. You can preview it in the next step.</p>
        </div>

        {/* guided choice cards (#4) */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {FLOW_TYPES.map(ft => {
            const on = flowType === ft.id;
            return (
              <button key={ft.id} onClick={() => setFlowType(ft.id)} style={{ textAlign: "left", padding: 15, borderRadius: "var(--r-lg)", position: "relative", cursor: "pointer",
                border: on ? "1.5px solid " + ft.color : "1px solid var(--hair)", background: on ? ft.color.replace(")", " / 0.06)") : "var(--surface)", boxShadow: on ? "0 0 0 3px " + ft.color.replace(")", " / 0.12)") : "var(--sh-1)", transition: "all .15s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 9 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 11, background: ft.color.replace(")", " / 0.12)"), color: ft.color, display: "grid", placeItems: "center", flexShrink: 0 }}>{React.createElement(window[ft.icon], { style: { width: 20, height: 20 } })}</div>
                  <span className="chip" style={{ height: 19, fontSize: 9.5, background: ft.color.replace(")", " / 0.10)"), color: ft.color, fontWeight: 700 }}>{ft.tag}</span>
                  {on && <span style={{ marginLeft: "auto", width: 20, height: 20, borderRadius: 99, background: ft.color, display: "grid", placeItems: "center" }}><window.IcCheck style={{ width: 12, height: 12, color: "#fff" }} /></span>}
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 720, marginBottom: 4 }}>{ft.name}</div>
                <div className="dim" style={{ fontSize: 11.5, lineHeight: 1.45, minHeight: 50 }}>{ft.desc}</div>
                <div style={{ fontSize: 10.5, color: ft.color, fontWeight: 600, background: ft.color.replace(")", " / 0.08)"), borderRadius: "var(--r-sm)", padding: "6px 8px", marginTop: 4 }}>{ft.flow}</div>
              </button>
            );
          })}
        </div>

        {/* visual builder for the chosen flow (#5) */}
        {flowType === "level"    && <LevelFlow   subj={subj} s={s} stages={stages} setStages={setStages} />}
        {flowType === "adaptive" && <AdaptiveFlow subj={subj} s={s} selected={selected} tree={tree} setTree={setTree} />}
        {flowType === "fixed"    && <FixedFlow   subj={subj} s={s} selected={selected} bands={bands} setBands={setBands} mode={mode} setMode={setMode} />}

        <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 8 }}>
          <button className="btn btn-lg" onClick={onPrev}><window.IcChevL style={{ width: 16, height: 16 }} />Back</button>
          <button className="btn btn-pri btn-lg" onClick={onNext}>Next: Preview &amp; Test<window.IcArrowR style={{ width: 16, height: 16 }} /></button>
        </div>
      </div>
    </div>
  );
}

/* ---- Flow Type 1: Level-Based visual progression (#2) ---- */
function LevelFlow({ subj, s, stages, setStages }) {
  const levelOpts = window.levelsForSubject(subj);
  const setStage = (i, patch) => setStages(ss => ss.map((st, x) => x === i ? { ...st, ...patch } : st));
  const addStage = () => setStages(ss => [...ss, { id: "st" + Date.now(), level: levelOpts[Math.min(ss.length, levelOpts.length - 1)], count: 5, threshold: 4 }]);
  const removeStage = (i) => setStages(ss => ss.filter((_, x) => x !== i));
  return (
    <div className="card card-pad" style={{ background: "linear-gradient(160deg, var(--surface), var(--surface-2))" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <window.IcLayers style={{ width: 16, height: 16, color: s.color }} />
        <b style={{ fontSize: 14, fontWeight: 720 }}>Level progression</b>
      </div>
      <p className="dim" style={{ fontSize: 12, margin: "0 0 18px" }}>Students start at the first level. Meet the passing score to unlock the next. The highest level they pass becomes their placement.</p>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
        {stages.map((st, i) => (
          <React.Fragment key={st.id}>
            {/* stage card */}
            <div className="card" style={{ width: "100%", maxWidth: 520, padding: "13px 16px", display: "flex", alignItems: "center", gap: 13, borderLeft: "3px solid " + s.color }}>
              <div style={{ width: 40, height: 40, borderRadius: 11, background: s.color.replace(")", " / 0.12)"), color: s.color, display: "grid", placeItems: "center", flexShrink: 0, fontWeight: 760, fontSize: 13 }} className="mono">{i + 1}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <select className="sel" style={{ height: 30, width: 150, fontWeight: 650 }} value={st.level} onChange={(e) => setStage(i, { level: e.target.value })}>{levelOpts.map(l => <option key={l}>{l}</option>)}</select>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 7, fontSize: 12 }}>
                  <input className="inp mono" style={{ width: 52, height: 28 }} type="number" value={st.count} onChange={(e) => setStage(i, { count: Math.max(1, +e.target.value || 1) })} />
                  <span className="dim">questions in this level</span>
                </div>
              </div>
              {stages.length > 1 && <button className="icon-btn" style={{ width: 28, height: 28, border: 0, boxShadow: "none", background: "transparent", color: "var(--ink-4)", alignSelf: "flex-start" }} onClick={() => removeStage(i)}><window.IcTrash style={{ width: 14, height: 14 }} /></button>}
            </div>
            {/* gate to next level */}
            {i < stages.length - 1 ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "4px 0" }}>
                <div style={{ width: 2, height: 12, background: "var(--hair-2)" }}></div>
                <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "6px 12px", borderRadius: 99, background: "var(--st-approve-bg)", border: "1px solid var(--st-approve)", color: "var(--st-approve)", fontSize: 12, fontWeight: 650 }}>
                  <window.IcCheckCircle style={{ width: 14, height: 14 }} />Score ≥
                  <input className="inp mono" style={{ width: 44, height: 26, textAlign: "center" }} type="number" value={st.threshold} max={st.count} onChange={(e) => setStage(i, { threshold: Math.min(st.count, Math.max(0, +e.target.value || 0)) })} />
                  of {st.count} → unlock next
                </div>
                <window.IcChevD style={{ width: 16, height: 16, color: "var(--ink-4)", marginTop: 2 }} />
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "4px 0 0" }}>
                <div style={{ width: 2, height: 12, background: "var(--hair-2)" }}></div>
                <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 14px", borderRadius: 99, background: s.color, color: "#fff", fontSize: 12, fontWeight: 700 }}><window.IcJourney style={{ width: 14, height: 14 }} />Placed at highest level passed</div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
        <button className="btn btn-sm" onClick={addStage}><window.IcPlus style={{ width: 14, height: 14 }} />Add a level</button>
      </div>
    </div>
  );
}

/* ---- Flow Type 2: Adaptive branching path (#3) ---- */
function treeUpdate(node, id, patch) {
  if (!node) return node;
  if (node.id === id) return { ...node, ...patch };
  return { ...node, correct: treeUpdate(node.correct, id, patch), incorrect: treeUpdate(node.incorrect, id, patch) };
}
function treeAddBranches(node, id, subj) {
  if (!node) return node;
  if (node.id === id) {
    const lv = window.levelsForSubject(subj);
    return { ...node, place: undefined,
      correct:   node.correct   || { id: id + "c", title: "Harder follow-up", diff: "Hard", qId: null, place: lv[Math.min(2, lv.length - 1)] },
      incorrect: node.incorrect || { id: id + "i", title: "Easier follow-up", diff: "Easy", qId: null, place: lv[0] } };
  }
  return { ...node, correct: treeAddBranches(node.correct, id, subj), incorrect: treeAddBranches(node.incorrect, id, subj) };
}
function treeRemoveBranches(node, id, subj) {
  if (!node) return node;
  if (node.id === id) { const lv = window.levelsForSubject(subj); return { ...node, correct: null, incorrect: null, place: node.place || lv[Math.min(1, lv.length - 1)] }; }
  return { ...node, correct: treeRemoveBranches(node.correct, id, subj), incorrect: treeRemoveBranches(node.incorrect, id, subj) };
}

function AdaptiveNode({ node, subj, s, selected, depth, edge, onUpdate, onAdd, onRemove }) {
  const lv = window.levelsForSubject(subj);
  const isLeaf = !node.correct && !node.incorrect;
  const edgeColor = edge === "correct" ? "var(--st-approve)" : edge === "incorrect" ? "var(--st-revise)" : s.color;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 200 }}>
      <div className="card" style={{ width: 210, padding: "11px 12px", borderTop: "3px solid " + edgeColor }}>
        <input className="inp" style={{ height: 28, fontSize: 12, fontWeight: 600, marginBottom: 8 }} value={node.title} onChange={(e) => onUpdate(node.id, { title: e.target.value })} />
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          <span className="dim" style={{ fontSize: 10.5, fontWeight: 650 }}>Difficulty</span>
          <select className="sel" style={{ height: 28, flex: 1 }} value={node.diff} onChange={(e) => onUpdate(node.id, { diff: e.target.value })}>{["Easy","Medium","Hard"].map(d => <option key={d}>{d}</option>)}</select>
        </div>
        <select className="sel" style={{ height: 28, width: "100%", fontSize: 11.5 }} value={node.qId || ""} onChange={(e) => onUpdate(node.id, { qId: e.target.value || null })}>
          <option value="">Auto-pick by difficulty</option>
          {selected.map(q => <option key={q.id} value={q.id}>{q.title}</option>)}
        </select>
        {isLeaf ? (
          <div style={{ marginTop: 9, borderTop: "1px solid var(--hair)", paddingTop: 9 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <window.IcJourney style={{ width: 13, height: 13, color: s.color }} />
              <span className="dim" style={{ fontSize: 10.5, fontWeight: 650 }}>Places at</span>
              <select className="sel" style={{ height: 28, flex: 1, fontWeight: 650 }} value={node.place || lv[0]} onChange={(e) => onUpdate(node.id, { place: e.target.value })}>{lv.map(l => <option key={l}>{l}</option>)}</select>
            </div>
            {depth < 2 && <button className="btn btn-sm" style={{ marginTop: 8, width: "100%", height: 28 }} onClick={() => onAdd(node.id)}><window.IcWorkflow style={{ width: 13, height: 13 }} />Branch on answer</button>}
          </div>
        ) : (
          <button className="btn btn-ghost btn-sm" style={{ marginTop: 8, width: "100%", height: 26, color: "var(--ink-3)" }} onClick={() => onRemove(node.id)}><window.IcX style={{ width: 12, height: 12 }} />Remove branches</button>
        )}
      </div>

      {!isLeaf && (
        <>
          <div style={{ width: 2, height: 14, background: "var(--hair-2)" }}></div>
          <div style={{ display: "flex", gap: 28, alignItems: "flex-start" }}>
            {[["correct", node.correct, "Correct", "var(--st-approve)", "✓"], ["incorrect", node.incorrect, "Incorrect", "var(--st-revise)", "✗"]].map(([key, child, label, col, sym]) => (
              <div key={key} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 99, background: col.replace(")", " / 0.12)"), color: col, fontSize: 10.5, fontWeight: 700, marginBottom: 8 }}>{sym} {label}</div>
                <AdaptiveNode node={child} subj={subj} s={s} selected={selected} depth={depth + 1} edge={key} onUpdate={onUpdate} onAdd={onAdd} onRemove={onRemove} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function AdaptiveFlow({ subj, s, selected, tree, setTree }) {
  return (
    <div className="card card-pad" style={{ background: "linear-gradient(160deg, var(--surface), var(--surface-2))" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <window.IcSparkle style={{ width: 16, height: 16, color: s.color }} />
        <b style={{ fontSize: 14, fontWeight: 720 }}>Adaptive path</b>
      </div>
      <p className="dim" style={{ fontSize: 12, margin: "0 0 6px" }}>Every student starts at the same question. Their answer decides what comes next — a correct answer branches to a harder question, an incorrect one to an easier/remedial question. Where a path ends decides the placement.</p>
      <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 10.5, color: "var(--ink-3)", marginBottom: 16 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 9, height: 9, borderRadius: 3, background: "var(--st-approve)" }}></span>Correct path</span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 9, height: 9, borderRadius: 3, background: "var(--st-revise)" }}></span>Incorrect / remedial path</span>
      </div>
      <div style={{ overflowX: "auto", paddingBottom: 8 }}>
        <div style={{ display: "flex", justifyContent: "center", minWidth: "min-content", padding: "0 8px" }}>
          <AdaptiveNode node={tree} subj={subj} s={s} selected={selected} depth={0} edge="start"
            onUpdate={(id, patch) => setTree(t => treeUpdate(t, id, patch))}
            onAdd={(id) => setTree(t => treeAddBranches(t, id, subj))}
            onRemove={(id) => setTree(t => treeRemoveBranches(t, id, subj))} />
        </div>
      </div>
    </div>
  );
}

/* ---- Flow Type 3: Fixed assessment with score → Level bands ---- */
function FixedFlow({ subj, s, selected, bands, setBands, mode, setMode }) {
  const levelOpts = window.levelsForSubject(subj);
  const setBand = (i, patch) => setBands(bs => bs.map((b, x) => x === i ? { ...b, ...patch } : b));
  return (
    <div className="card card-pad" style={{ background: "linear-gradient(160deg, var(--surface), var(--surface-2))" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <window.IcGrid style={{ width: 16, height: 16, color: s.color }} />
        <b style={{ fontSize: 14, fontWeight: 720 }}>Fixed assessment</b>
        <div className="seg" style={{ marginLeft: "auto" }}>{["Percentage","Raw score"].map(m => <button key={m} className={mode === m ? "on" : ""} onClick={() => setMode(m)}>{m}</button>)}</div>
      </div>
      <p className="dim" style={{ fontSize: 12, margin: "0 0 16px" }}>Every student answers all {selected.length} questions in the same order. Their total score places them on a Level using the bands below.</p>

      {/* visual band bar */}
      <div style={{ display: "flex", height: 14, borderRadius: 99, overflow: "hidden", marginBottom: 6, border: "1px solid var(--hair)" }}>
        {bands.map((b, i) => <div key={i} title={b.level} style={{ flex: (b.max - b.min) || 1, background: s.color.replace(")", ` / ${0.25 + i * 0.15})`), display: "grid", placeItems: "center", color: "#fff", fontSize: 9.5, fontWeight: 700 }}>{b.level.replace("Level ", "L")}</div>)}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--ink-4)", marginBottom: 14 }}><span>0{mode === "Percentage" ? "%" : ""}</span><span>{mode === "Percentage" ? "100%" : "max"}</span></div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {bands.map((b, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 11px", border: "1px solid var(--hair)", borderRadius: "var(--r-sm)", background: "var(--surface)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5 }}>
              <input className="inp mono" style={{ width: 56, height: 30 }} type="number" value={b.min} onChange={(e) => setBand(i, { min: +e.target.value })} />
              <span className="dim">–</span>
              <input className="inp mono" style={{ width: 56, height: 30 }} type="number" value={b.max} onChange={(e) => setBand(i, { max: +e.target.value })} />
              <span className="dim">{mode === "Percentage" ? "%" : "pts"}</span>
            </span>
            <window.IcArrowR style={{ width: 15, height: 15, color: "var(--ink-4)" }} />
            <select className="sel" style={{ height: 30, width: 130 }} value={b.level} onChange={(e) => setBand(i, { level: e.target.value })}>{levelOpts.map(l => <option key={l}>{l}</option>)}</select>
            <span style={{ marginLeft: "auto" }}>
              {bands.length > 1 && <button className="icon-btn" style={{ width: 28, height: 28, border: 0, boxShadow: "none", background: "transparent", color: "var(--ink-4)" }} onClick={() => setBands(bs => bs.filter((_, x) => x !== i))}><window.IcTrash style={{ width: 14, height: 14 }} /></button>}
            </span>
          </div>
        ))}
      </div>
      <button className="btn btn-sm" style={{ marginTop: 10 }} onClick={() => setBands(bs => [...bs, { min: 0, max: 100, level: levelOpts[0] }])}><window.IcPlus style={{ width: 14, height: 14 }} />Add band</button>
    </div>
  );
}

/* ---------- Step 3: preview & test ---------- */
function DgPreview({ subj, s, selected, bands, stages, tree, flowType, totalMarks, onPrev, onPublish }) {
  const [idx, setIdx] = useStateD(0);
  const [picks, setPicks] = useStateD({});   // qid -> chosen option index
  const [done, setDone] = useStateD(false);

  const q = selected[idx];
  const choose = (oi) => setPicks(p => ({ ...p, [q.id]: oi }));
  const advance = () => { if (idx + 1 >= selected.length) setDone(true); else setIdx(idx + 1); };
  const restart = () => { setIdx(0); setPicks({}); setDone(false); };

  // mock scoring: option types graded on correctness, others counted answered
  const correctCount = selected.reduce((acc, qq) => {
    const pick = picks[qq.id];
    if (pick == null) return acc;
    if (qq.options && qq.options.length) return acc + (qq.options[pick] && qq.options[pick].correct ? 1 : 0);
    return acc + 1; // non-option types: count as answered for the demo
  }, 0);
  const pct = selected.length ? Math.round(correctCount / selected.length * 100) : 0;

  // placement depends on the chosen assessment flow
  const FLOW_LABEL = { level: "Level-Based", adaptive: "Adaptive", fixed: "Fixed" };
  const FLOW_METHOD = { level: "highest level passed", adaptive: "where the adaptive path ended", fixed: "total score band" };
  const placement = (() => {
    if (flowType === "fixed") return ((bands.find(b => pct >= b.min && pct <= b.max) || bands[bands.length - 1]) || {}).level;
    if (flowType === "level") {
      let placed = stages.length ? stages[0].level : null;
      for (let i = 0; i < stages.length; i++) {
        const need = Math.round((stages[i].threshold / stages[i].count) * 100);
        if (pct >= need) placed = (stages[i + 1] || stages[i]).level; else break;
      }
      return placed;
    }
    let n = tree; // adaptive: walk correct/incorrect branches by performance
    while (n && (n.correct || n.incorrect)) n = pct >= 50 ? n.correct : n.incorrect;
    return n ? (n.place || window.levelsForSubject(subj)[0]) : null;
  })();

  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.4fr) minmax(0,1fr)", height: "100%" }}>
      {/* student runner */}
      <div style={{ overflowY: "auto", padding: "24px 28px", background: s.color.replace(")", " / 0.04)") }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <div className="card" style={{ overflow: "hidden" }}>
            <div style={{ padding: "10px 16px", borderBottom: "1px solid var(--hair)", display: "flex", alignItems: "center", gap: 10, background: "var(--surface-2)" }}>
              <span className="dim" style={{ fontSize: 11.5, fontWeight: 600 }}>Test mode · {subj} diagnostic</span>
              {!done && <span className="chip mono" style={{ marginLeft: "auto", height: 20, fontSize: 10.5 }}>Q{idx + 1} / {selected.length}</span>}
            </div>
            <div style={{ padding: 22, minHeight: 300 }}>
              {!done ? (
                <>
                  {/* progress */}
                  <div style={{ display: "flex", gap: 4, marginBottom: 18 }}>
                    {selected.map((_, i) => <div key={i} style={{ flex: 1, height: 5, borderRadius: 99, background: i <= idx ? s.color : "var(--surface-3)" }}></div>)}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}><window.DiffPill d={q.difficulty} sm /><span className="dim" style={{ fontSize: 11 }}>{(window.QTYPE_BY_ID[q.type] || {}).name}</span></div>
                  <div style={{ fontSize: 16, fontWeight: 680, marginBottom: 16 }}>{q.content || q.title}</div>
                  {q.options && q.options.length ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                      {q.options.map((o, oi) => { const on = picks[q.id] === oi; return (
                        <button key={oi} onClick={() => choose(oi)} style={{ display: "flex", alignItems: "center", gap: 11, padding: "12px 14px", borderRadius: "var(--r-md)", textAlign: "left", border: on ? "1.5px solid " + s.color : "1px solid var(--hair)", background: on ? s.color.replace(")", " / 0.08)") : "var(--surface)" }}>
                          <span style={{ width: 20, height: 20, borderRadius: 99, border: "1.5px solid " + (on ? s.color : "var(--hair-2)"), flexShrink: 0, display: "grid", placeItems: "center" }}>{on && <span style={{ width: 10, height: 10, borderRadius: 99, background: s.color }}></span>}</span>
                          <span style={{ fontSize: 13.5, fontWeight: 550 }}>{o.text}</span>
                        </button>
                      ); })}
                    </div>
                  ) : <window.QuestionPreviewCard q={q} compact />}
                  <button className="btn btn-pri btn-lg" style={{ marginTop: 20, width: "100%" }} onClick={advance}>{idx + 1 >= selected.length ? "Finish & see placement" : "Next question"}<window.IcArrowR style={{ width: 16, height: 16 }} /></button>
                </>
              ) : (
                <div style={{ textAlign: "center", padding: "10px 0" }}>
                  <div style={{ width: 64, height: 64, borderRadius: 99, background: s.color.replace(")", " / 0.12)"), color: s.color, display: "grid", placeItems: "center", margin: "0 auto 14px" }}><window.IcTarget style={{ width: 30, height: 30 }} /></div>
                  <div style={{ fontSize: 13, color: "var(--ink-3)" }}>Result</div>
                  <div className="mono" style={{ fontSize: 40, fontWeight: 780, letterSpacing: "-0.02em" }}>{pct}%</div>
                  <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 4 }}>Places the student on <span style={{ fontSize: 11 }}>({FLOW_METHOD[flowType]})</span></div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 8, padding: "8px 16px", borderRadius: 99, background: s.color, color: "#fff", fontWeight: 700, fontSize: 15 }}><window.IcJourney style={{ width: 17, height: 17 }} />{placement || "—"} · {subj}</div>
                  <div><button className="btn" style={{ marginTop: 18 }} onClick={restart}>Run test again</button></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* validation + summary */}
      <div style={{ borderLeft: "1px solid var(--hair)", background: "var(--surface-2)", overflowY: "auto", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "22px 22px 14px", flex: 1 }}>
          <div className="dim" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.04em", marginBottom: 12, textTransform: "uppercase" }}>Assessment summary</div>
          <div className="card card-pad" style={{ background: "var(--surface)", marginBottom: 14 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 11px", borderRadius: 99, background: s.color.replace(")", " / 0.10)"), color: s.color, fontSize: 12, fontWeight: 700, marginBottom: 12 }}>
              {React.createElement(window[(FLOW_TYPES.find(f => f.id === flowType) || {}).icon || "IcTarget"], { style: { width: 14, height: 14 } })}{FLOW_LABEL[flowType]} assessment
            </div>
            <div style={{ display: "flex", gap: 18 }}>
              <div><div className="dim" style={{ fontSize: 11 }}>Questions</div><div className="mono" style={{ fontSize: 22, fontWeight: 740 }}>{selected.length}</div></div>
              <div><div className="dim" style={{ fontSize: 11 }}>Total marks</div><div className="mono" style={{ fontSize: 22, fontWeight: 740 }}>{totalMarks}</div></div>
              <div><div className="dim" style={{ fontSize: 11 }}>{flowType === "level" ? "Levels" : flowType === "adaptive" ? "Paths" : "Bands"}</div><div className="mono" style={{ fontSize: 22, fontWeight: 740 }}>{flowType === "level" ? stages.length : flowType === "fixed" ? bands.length : 2}</div></div>
            </div>
          </div>
          <div className="dim" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.04em", marginBottom: 10, textTransform: "uppercase" }}>Verify before publishing</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {(flowType === "level" ? ["Question selection", "Level thresholds", "Placement mapping", "Scoring calculation"]
              : flowType === "adaptive" ? ["Question selection", "Branch paths", "Remedial follow-ups", "Placement endpoints"]
              : ["Question selection", "Score bands", "Placement mapping", "Scoring calculation"]).map(c => (
              <label key={c} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 12.5, fontWeight: 550, padding: "9px 11px", background: "var(--surface)", border: "1px solid var(--hair)", borderRadius: "var(--r-sm)" }}><input type="checkbox" defaultChecked />{c} verified</label>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11.5, color: "var(--ink-3)", marginTop: 12 }}><window.IcSparkle style={{ width: 14, height: 14 }} />This {FLOW_LABEL[flowType].toLowerCase()} assessment places students by {FLOW_METHOD[flowType]}.</div>
        </div>
        <div style={{ borderTop: "1px solid var(--hair)", padding: "12px 20px", background: "var(--surface)", display: "flex", gap: 9 }}>
          <button className="btn btn-lg" onClick={onPrev}><window.IcChevL style={{ width: 16, height: 16 }} />Back</button>
          <button className="btn btn-pri btn-lg" style={{ flex: 1 }} onClick={onPublish}><window.IcCheck style={{ width: 16, height: 16 }} />Publish diagnostic</button>
        </div>
      </div>
    </div>
  );
}

window.DiagnosticBuilder = DiagnosticBuilder;
