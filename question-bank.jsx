/* question-bank.jsx — central repository of reusable questions.
   QuestionBank (browse/filter/manage) · QuestionEditor (create/edit, type-adaptive) ·
   QuestionPreviewCard (shared student-facing renderer, reused by the diagnostic builder). */
const { useState: useStateQ } = React;

/* ---------- small shared bits ---------- */
function DiffPill({ d, sm }) {
  const c = window.DIFF_COLOR[d] || "var(--ink-3)";
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 5, height: sm ? 19 : 22, padding: "0 9px", borderRadius: 99, fontSize: sm ? 10.5 : 11.5, fontWeight: 650, color: c, background: c.replace(")", " / 0.12)") }}><span style={{ width: 6, height: 6, borderRadius: 99, background: c }}></span>{d}</span>;
}
function QTypeTag({ type }) {
  const t = window.QTYPE_BY_ID[type] || { name: type, icon: "IcQuiz" };
  return <span className="chip" style={{ height: 20, fontSize: 10.5, gap: 5 }}>{React.createElement(window[t.icon], { style: { width: 12, height: 12 } })}{t.name}</span>;
}
function UsageDots({ usage }) {
  if (!usage || !usage.length) return null;
  return <span style={{ display: "inline-flex", gap: 3 }} title={usage.map(u => (window.USAGE_BY_ID[u] || {}).label).join(" · ")}>
    {usage.map(u => <span key={u} style={{ width: 7, height: 7, borderRadius: 99, background: (window.USAGE_BY_ID[u] || { color: "var(--ink-4)" }).color }}></span>)}
  </span>;
}

/* ---------- shared student-facing preview renderer ---------- */
function QuestionPreviewCard({ q, idx, showKey, compact }) {
  const opts = q.options || [];
  const body = () => {
    if (q.type === "text") return <input className="inp" placeholder="Type your answer…" style={{ maxWidth: 260 }} readOnly value={showKey ? (q.answer || "") : ""} />;
    if (q.type === "match") return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, maxWidth: 360 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>{(q.pairs || []).map((p, i) => <div key={i} className="card" style={{ padding: "9px 11px", fontSize: 13, fontWeight: 600 }}>{p.l}</div>)}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>{(q.pairs || []).map((p, i) => <div key={i} className="card" style={{ padding: "9px 11px", fontSize: 13 }}>{p.r}</div>)}</div>
      </div>
    );
    if (q.type === "reading") return (
      <div>
        <div style={{ padding: "12px 14px", background: "var(--surface-2)", border: "1px solid var(--hair)", borderRadius: "var(--r-md)", fontSize: 13, lineHeight: 1.6, marginBottom: 12 }}>{q.passage || "Passage text…"}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {(q.children || []).map((c, i) => <div key={c.id || i} style={{ paddingLeft: 12, borderLeft: "2px solid var(--pri-soft-2)" }}><QuestionPreviewCard q={c} idx={i + 1} showKey={showKey} compact /></div>)}
        </div>
      </div>
    );
    // single / multi / image / audio → option buttons
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 360 }}>
        {opts.map((o, i) => {
          const right = showKey && o.correct;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: "var(--r-md)", border: right ? "1.5px solid var(--good)" : "1px solid var(--hair)", background: right ? "var(--st-approve-bg)" : "var(--surface)" }}>
              <span style={{ width: 18, height: 18, borderRadius: q.type === "multi" ? 5 : 99, border: "1.5px solid " + (right ? "var(--good)" : "var(--hair-2)"), display: "grid", placeItems: "center", flexShrink: 0 }}>{right && <window.IcCheck style={{ width: 12, height: 12, color: "var(--good)" }} />}</span>
              <span style={{ fontSize: 13, fontWeight: 550 }}>{o.text}</span>
            </div>
          );
        })}
      </div>
    );
  };
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        {idx != null && <span className="mono" style={{ width: 22, height: 22, borderRadius: 7, background: "var(--pri-soft)", color: "var(--pri-ink)", display: "grid", placeItems: "center", fontSize: 11, fontWeight: 700 }}>{idx}</span>}
        {q.difficulty && <DiffPill d={q.difficulty} sm />}
        {!compact && q.marks ? <span className="dim" style={{ fontSize: 11, marginLeft: "auto" }}>{window.questionMarks(q)} {window.questionMarks(q) === 1 ? "mark" : "marks"}</span> : null}
      </div>
      <div style={{ fontSize: compact ? 13.5 : 15, fontWeight: 650, marginBottom: 12 }}>{q.content || q.title}</div>
      {q.media && q.media.image && <div style={{ height: 110, borderRadius: "var(--r-md)", background: "var(--surface-2)", border: "1px dashed var(--hair-2)", display: "grid", placeItems: "center", marginBottom: 12, color: "var(--ink-4)" }}><window.IcModule style={{ width: 26, height: 26 }} /></div>}
      {q.media && q.media.audio && <button className="btn btn-sm" style={{ marginBottom: 12 }}><window.IcAudio style={{ width: 14, height: 14 }} />Play audio prompt</button>}
      {body()}
      {showKey && q.feedback && <div style={{ marginTop: 12, padding: "9px 11px", borderRadius: "var(--r-sm)", background: "var(--pri-soft)", color: "var(--pri-ink)", fontSize: 11.5 }}><b>Feedback:</b> {q.feedback}</div>}
    </div>
  );
}

/* ---------- filter controls (reused look) ---------- */
function FilterChips({ label, options, value, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
      <span className="dim" style={{ fontSize: 11.5, fontWeight: 650, width: 64 }}>{label}</span>
      {options.map(o => {
        const on = value === o;
        return <button key={o} onClick={() => onChange(o)} className="chip" style={{ cursor: "pointer", height: 26, border: on ? "1px solid var(--pri)" : "1px solid var(--hair)", background: on ? "var(--pri-soft)" : "var(--surface)", color: on ? "var(--pri-ink)" : "var(--ink-2)" }}>{o}</button>;
      })}
    </div>
  );
}
/* compact labelled <select> for the dense filter bar */
function FilterSelect({ icon, label, value, options, onChange, allLabel }) {
  const active = value !== "All";
  return (
    <label style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 32, padding: "0 9px", borderRadius: "var(--r-sm)", border: "1px solid " + (active ? "var(--pri)" : "var(--hair)"), background: active ? "var(--pri-soft)" : "var(--surface)", cursor: "pointer" }}>
      {icon && React.createElement(icon, { style: { width: 13, height: 13, color: active ? "var(--pri)" : "var(--ink-4)" } })}
      <span style={{ fontSize: 11, fontWeight: 650, color: active ? "var(--pri-ink)" : "var(--ink-3)" }}>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={{ border: 0, background: "transparent", outline: 0, fontSize: 12, fontWeight: 600, color: active ? "var(--pri-ink)" : "var(--ink-2)", maxWidth: 130 }}>
        <option value="All">{allLabel || "All"}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}

/* ---------- Question Bank ---------- */
function QuestionBank({ onNew, onOpen }) {
  const [all, setAll] = useStateQ(window.QUESTIONS);
  const [subject, setSubject] = useStateQ("All");
  const [grade, setGrade] = useStateQ("All");
  const [level, setLevel] = useStateQ("All");
  const [diff, setDiff] = useStateQ("All");
  const [qtype, setQtype] = useStateQ("All");
  const [comp, setComp] = useStateQ("All");
  const [lang, setLang] = useStateQ("All");
  const [topic, setTopic] = useStateQ("All");
  const [q, setQ] = useStateQ("");
  const [preview, setPreview] = useStateQ(null);
  const [openReading, setOpenReading] = useStateQ(null);

  const dup = (it) => { const n = { ...it, id: "q" + (Date.now() % 100000), title: it.title + " (Copy)" }; setAll(a => [n, ...a]); window.toast("Question duplicated"); };
  const del = (it) => { setAll(a => a.filter(x => x.id !== it.id)); window.toast("Question deleted"); };

  // distinct option lists for the dropdowns
  const compOpts = window.questionFilterOptions("competency");
  const topicOpts = window.questionFilterOptions("tags");
  const qtypeName = (id) => (window.QTYPE_BY_ID[id] || {}).name || id;

  const list = all.filter(it =>
    (subject === "All" || it.subject === subject) &&
    (grade === "All" || it.grade === grade) &&
    (level === "All" || it.level === level) &&
    (diff === "All" || it.difficulty === diff) &&
    (qtype === "All" || it.type === qtype) &&
    (comp === "All" || it.competency === comp) &&
    (lang === "All" || it.language === lang) &&
    (topic === "All" || (it.tags || []).includes(topic)) &&
    (q === "" || (it.title + " " + (it.content || "") + " " + (it.lo || "")).toLowerCase().includes(q.toLowerCase()))
  );
  const activeCount = [subject, grade, level, diff, qtype, comp, lang, topic].filter(v => v !== "All").length + (q ? 1 : 0);
  const clearAll = () => { setSubject("All"); setGrade("All"); setLevel("All"); setDiff("All"); setQtype("All"); setComp("All"); setLang("All"); setTopic("All"); setQ(""); };

  return (
    <div className="page page-anim">
      <div className="page-head">
        <div><h1>Question Bank</h1><p>The central repository for every assessment and learning question. Build once, reuse across diagnostics, practice, in-app learning and assessments.</p></div>
        <div className="actions"><button className="btn btn-pri" onClick={onNew}><window.IcPlus style={{ width: 16, height: 16 }} />New Question</button></div>
      </div>

      {/* filter panel — subject tabs + search, then a dense row of curriculum filters */}
      <div className="card" style={{ padding: "13px 16px", marginBottom: 16, display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div className="seg">
            {["All","Maths","English","Tamil"].map(su => <button key={su} className={subject === su ? "on" : ""} onClick={() => setSubject(su)}>{su}</button>)}
          </div>
          <div className="searchbox" style={{ minWidth: 240, height: 32, marginLeft: "auto" }}>
            <window.IcSearch style={{ width: 15, height: 15 }} />
            <input placeholder="Search title, content or learning outcome…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </div>
        <hr className="hairline" style={{ margin: 0 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span className="dim" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.03em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 5 }}><window.IcFilter style={{ width: 13, height: 13 }} />Filters</span>
          <FilterSelect icon={window.IcUsers} label="Grade" value={grade} options={window.GRADES} onChange={setGrade} allLabel="All grades" />
          <FilterSelect icon={window.IcLayers} label="Level" value={level} options={["Level 1","Level 2","Level 3","Level 4","Level 5"]} onChange={setLevel} allLabel="All levels" />
          <FilterSelect icon={window.IcTarget} label="Competency" value={comp} options={compOpts} onChange={setComp} allLabel="All competencies" />
          <FilterSelect icon={window.IcQuiz} label="Type" value={qtype === "All" ? "All" : qtypeName(qtype)} options={window.QUESTION_TYPES.map(t => t.name)} onChange={(name) => setQtype(name === "All" ? "All" : (window.QUESTION_TYPES.find(t => t.name === name) || {}).id)} allLabel="All types" />
          <FilterSelect icon={window.IcReading} label="Language" value={lang} options={window.LANGUAGES} onChange={setLang} allLabel="All languages" />
          <FilterSelect icon={window.IcRepo} label="Topic" value={topic} options={topicOpts} onChange={setTopic} allLabel="All topics" />
          <div className="seg">{["All","Easy","Medium","Hard"].map(x => <button key={x} className={diff === x ? "on" : ""} onClick={() => setDiff(x)}>{x}</button>)}</div>
          {activeCount > 0 && <button className="btn btn-ghost btn-sm" onClick={clearAll}><window.IcX style={{ width: 13, height: 13 }} />Clear ({activeCount})</button>}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span className="dim" style={{ fontSize: 12 }}><b className="mono" style={{ color: "var(--ink)" }}>{list.length}</b> of {all.length} questions</span>
      </div>

      {/* question rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {list.map(it => {
          const s = window.SUBJECTS[it.subject] || { color: "var(--pri)" };
          const isReading = it.type === "reading";
          const ropen = openReading === it.id;
          return (
            <div key={it.id} className="card" style={{ overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 15px", cursor: "pointer" }} onClick={() => setPreview(it)}
                onMouseEnter={(e) => e.currentTarget.style.background = "var(--surface-2)"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: s.color.replace(")", " / 0.10)"), color: s.color, display: "grid", placeItems: "center", flexShrink: 0 }}>{React.createElement(window[(window.QTYPE_BY_ID[it.type] || {}).icon] || window.IcQuiz, { style: { width: 19, height: 19 } })}</div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 660 }}>{it.title}</span>
                    {isReading && <span className="chip" style={{ height: 19, fontSize: 10, background: "var(--pri-soft)", color: "var(--pri-ink)" }}>{it.children.length} sub-questions</span>}
                  </div>
                  <div className="dim" style={{ fontSize: 11.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 460 }}>{it.lo || it.content}</div>
                </div>
                <window.SubjectChip subject={it.subject} sm />
                {it.grade && <window.MiniPill>{it.grade.replace("Grade ", "G")}</window.MiniPill>}
                <span className="chip" style={{ height: 20, fontSize: 10.5 }}>{it.level}</span>
                <DiffPill d={it.difficulty} sm />
                <QTypeTag type={it.type} />
                <UsageDots usage={it.usage} />
                <span className="mono dim" style={{ fontSize: 11.5, width: 44, textAlign: "right" }}>{window.questionMarks(it)} mk</span>
                <div onClick={(e) => e.stopPropagation()} style={{ display: "flex", alignItems: "center" }}>
                  {isReading && <button className="icon-btn" style={{ width: 28, height: 28, border: 0, boxShadow: "none", background: "transparent" }} onClick={() => setOpenReading(ropen ? null : it.id)}><window.IcChevR style={{ width: 15, height: 15, transform: ropen ? "rotate(90deg)" : "none", transition: "transform .15s" }} /></button>}
                  <window.Menu items={[
                    { label: "Preview", icon: window.IcEye, onClick: () => setPreview(it) },
                    { label: "Edit", icon: window.IcEdit, onClick: () => onOpen(it) },
                    { label: "Duplicate", icon: window.IcCopy, onClick: () => dup(it) },
                    { sep: true },
                    { label: "Delete", icon: window.IcTrash, danger: true, onClick: () => del(it) },
                  ]} />
                </div>
              </div>
              {isReading && ropen && (
                <div style={{ borderTop: "1px solid var(--hair)", background: "var(--surface-2)", padding: "10px 15px 12px 64px", display: "flex", flexDirection: "column", gap: 6 }}>
                  {it.children.map((c, i) => (
                    <div key={c.id || i} style={{ display: "flex", alignItems: "center", gap: 9, padding: "7px 10px", background: "var(--surface)", border: "1px solid var(--hair)", borderRadius: "var(--r-sm)" }}>
                      <span className="mono dim" style={{ fontSize: 11 }}>{i + 1}</span>
                      <span style={{ fontSize: 12.5, fontWeight: 550, flex: 1 }}>{c.title}</span>
                      <DiffPill d={c.difficulty} sm /><QTypeTag type={c.type} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {list.length === 0 && <div className="card card-pad" style={{ textAlign: "center", color: "var(--ink-3)", fontSize: 12.5 }}>No questions match these filters.</div>}
      </div>

      {preview && (
        <window.SlideOver title={preview.title} sub={(window.QTYPE_BY_ID[preview.type] || {}).name + " · " + preview.subject + " · " + preview.level} onClose={() => setPreview(null)}
          foot={<><button className="btn btn-pri" onClick={() => { setPreview(null); onOpen(preview); }}><window.IcEdit style={{ width: 15, height: 15 }} />Edit</button><button className="btn" onClick={() => { dup(preview); setPreview(null); }}><window.IcCopy style={{ width: 15, height: 15 }} />Duplicate</button></>}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
            <window.SubjectChip subject={preview.subject} sm />
            {preview.grade && <span className="chip" style={{ height: 20, fontSize: 10.5, background: "var(--pri-soft)", color: "var(--pri-ink)", fontWeight: 700 }}>{preview.grade}</span>}
            <span className="chip" style={{ height: 20, fontSize: 10.5 }}>{preview.level}</span><DiffPill d={preview.difficulty} sm />
            {preview.language && <span className="chip" style={{ height: 20, fontSize: 10.5 }}>{preview.language}</span>}
            {(preview.usage || []).map(u => { const us = window.USAGE_BY_ID[u]; return <span key={u} className="chip" style={{ height: 20, fontSize: 10.5, color: us.color, background: us.color.replace(")", " / 0.10)") }}>{us.label}</span>; })}
          </div>
          {(preview.lo || preview.competency) && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
              {preview.lo && <div style={{ padding: "9px 11px", background: "var(--surface-2)", border: "1px solid var(--hair)", borderRadius: "var(--r-sm)" }}><div className="dim" style={{ fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.03em", marginBottom: 2 }}>Learning outcome</div><div style={{ fontSize: 12.5, fontWeight: 550 }}>{preview.lo}</div></div>}
              {preview.competency && <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}><window.IcTarget style={{ width: 14, height: 14, color: "var(--pri)" }} /><span className="dim">Competency:</span><b>{preview.competency}</b></div>}
            </div>
          )}
          <div className="card card-pad"><QuestionPreviewCard q={preview} showKey /></div>
          {preview.tags && preview.tags.length > 0 && <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 14 }}>{preview.tags.map(t => <span key={t} className="chip" style={{ height: 20, fontSize: 10.5 }}>#{t}</span>)}</div>}
          {preview.skip && <div style={{ marginTop: 14, padding: "10px 12px", background: "var(--surface-2)", border: "1px solid var(--hair)", borderRadius: "var(--r-sm)", fontSize: 11.5 }}><b style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}><window.IcWorkflow style={{ width: 13, height: 13 }} />Skip logic</b>On incorrect → <b>{preview.skip.onIncorrect}</b> · On correct → <b>{preview.skip.onCorrect}</b></div>}
        </window.SlideOver>
      )}
    </div>
  );
}

/* ---------- Question Editor (full-screen) ---------- */
function blankOption() { return { text: "", correct: false }; }
function QuestionEditor({ question, onExit }) {
  const seed = question || { id: null, title: "", content: "", type: "single", subject: "Maths", grade: "Grade 1", level: "Level 1", difficulty: "Easy", lo: "", competency: "", language: "English", marks: 1, feedback: "", tags: [], usage: [], options: [blankOption(), blankOption()], pairs: [{ l: "", r: "" }], answer: "", passage: "", children: [], media: {}, skip: null };
  const [d, setD] = useStateQ({ ...seed, options: seed.options && seed.options.length ? seed.options : [blankOption(), blankOption()] });
  const set = (k, v) => setD(s => ({ ...s, [k]: v }));
  const levelOpts = window.levelsForSubject(d.subject);
  const t = window.QTYPE_BY_ID[d.type] || {};
  const isOptionType = ["single", "multi", "image", "audio"].includes(d.type);

  const setOpt = (i, patch) => set("options", d.options.map((o, x) => x === i ? { ...o, ...patch } : o));
  const toggleCorrect = (i) => set("options", d.options.map((o, x) => x === i ? { ...o, correct: d.type === "single" ? true : !o.correct } : (d.type === "single" ? { ...o, correct: false } : o)));
  const toggleUsage = (u) => set("usage", d.usage.includes(u) ? d.usage.filter(x => x !== u) : [...d.usage, u]);
  const addTag = (v) => { const t = v.trim(); if (t && !d.tags.includes(t)) set("tags", [...d.tags, t]); };

  return (
    <div className="page-anim" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ borderBottom: "1px solid var(--hair)", background: "var(--surface)", padding: "13px 28px", display: "flex", alignItems: "center", gap: 16 }}>
        <button className="btn btn-ghost btn-sm" onClick={onExit}><window.IcChevL style={{ width: 15, height: 15 }} />Question Bank</button>
        <div style={{ width: 1, height: 22, background: "var(--hair)" }}></div>
        <div><div style={{ fontSize: 14, fontWeight: 700 }}>{d.title || (question ? "Edit question" : "New question")}</div><div className="dim" style={{ fontSize: 11.5 }}>{t.name} · {d.subject} · {d.level}</div></div>
        <button className="btn btn-pri btn-sm" style={{ marginLeft: "auto" }} onClick={() => { window.toast(question ? "Question updated" : "Question saved to bank"); onExit(); }}><window.IcCheck style={{ width: 15, height: 15 }} />Save question</button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", minHeight: 0, display: "grid", gridTemplateColumns: "minmax(0,1.45fr) minmax(0,1fr)" }}>
        {/* form */}
        <div style={{ padding: "24px 28px", overflowY: "auto" }}>
          <div style={{ maxWidth: 640, display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Basic info */}
            <div className="card card-pad">
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 13 }}>Basic information</div>
              <div className="field"><label>Question title</label><input className="inp" placeholder="Short internal name" value={d.title} onChange={(e) => set("title", e.target.value)} autoFocus /></div>
              <div className="field"><label>Question content <span className="hint">what the student sees</span></label><textarea className="inp" rows={2} value={d.content} onChange={(e) => set("content", e.target.value)} placeholder="e.g. How many apples are in the basket?"></textarea></div>
              <div className="field">
                <label>Question type</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px,1fr))", gap: 8 }}>
                  {window.QUESTION_TYPES.map(qt => { const on = d.type === qt.id; return (
                    <button key={qt.id} onClick={() => set("type", qt.id)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 11px", borderRadius: "var(--r-sm)", textAlign: "left", border: on ? "1.5px solid var(--pri)" : "1px solid var(--hair)", background: on ? "var(--pri-soft)" : "var(--surface)" }}>
                      {React.createElement(window[qt.icon], { style: { width: 16, height: 16, color: on ? "var(--pri)" : "var(--ink-3)" } })}
                      <span style={{ fontSize: 12, fontWeight: 640, color: on ? "var(--pri-ink)" : "var(--ink-2)" }}>{qt.name}</span>
                    </button>
                  ); })}
                </div>
              </div>
              <div className="row-2">
                <div className="field"><label>Subject</label><select className="sel" value={d.subject} onChange={(e) => { const sub = e.target.value; const o = window.levelsForSubject(sub); setD(s => ({ ...s, subject: sub, level: o.includes(s.level) ? s.level : o[o.length - 1], language: sub === "Tamil" ? "Tamil" : "English" })); }}>{["Maths","English","Tamil"].map(s => <option key={s}>{s}</option>)}</select></div>
                <div className="field"><label>Language</label><select className="sel" value={d.language} onChange={(e) => set("language", e.target.value)}>{window.LANGUAGES.map(l => <option key={l}>{l}</option>)}</select></div>
              </div>
              <div className="row-2">
                <div className="field"><label>Academic Grade</label><select className="sel" value={d.grade} onChange={(e) => set("grade", e.target.value)}>{window.GRADES.map(g => <option key={g}>{g}</option>)}</select></div>
                <div className="field"><label>Subject Level</label><select className="sel" value={d.level} onChange={(e) => set("level", e.target.value)}>{levelOpts.map(l => <option key={l}>{l}</option>)}</select></div>
              </div>
              <div className="field"><label>Learning outcome <span className="hint">what this question assesses</span></label><input className="inp" value={d.lo} onChange={(e) => set("lo", e.target.value)} placeholder="e.g. Compare numbers using >, < and =" /></div>
              <div className="row-2">
                <div className="field" style={{ marginBottom: 0 }}><label>Competency</label><input className="inp" value={d.competency} onChange={(e) => set("competency", e.target.value)} placeholder="e.g. Comparing" /></div>
                <div className="field" style={{ marginBottom: 0 }}><label>Difficulty</label>
                  <div className="seg" style={{ width: "fit-content" }}>{["Easy","Medium","Hard"].map(x => <button key={x} className={d.difficulty === x ? "on" : ""} onClick={() => set("difficulty", x)}>{x}</button>)}</div>
                </div>
              </div>
            </div>

            {/* Answer config */}
            <div className="card card-pad">
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>Answer configuration</div>
              <div className="dim" style={{ fontSize: 11.5, marginBottom: 13 }}>{t.desc}</div>

              {isOptionType && <>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {d.options.map((o, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <button onClick={() => toggleCorrect(i)} title="Mark correct" style={{ width: 26, height: 26, flexShrink: 0, borderRadius: d.type === "multi" ? 6 : 99, border: "1.5px solid " + (o.correct ? "var(--good)" : "var(--hair-2)"), background: o.correct ? "var(--st-approve-bg)" : "var(--surface)", display: "grid", placeItems: "center" }}>{o.correct && <window.IcCheck style={{ width: 13, height: 13, color: "var(--good)" }} />}</button>
                      <input className="inp" style={{ flex: 1 }} placeholder={"Option " + (i + 1)} value={o.text} onChange={(e) => setOpt(i, { text: e.target.value })} />
                      {d.options.length > 2 && <button className="icon-btn" style={{ width: 28, height: 28, border: 0, boxShadow: "none", background: "transparent", color: "var(--ink-4)" }} onClick={() => set("options", d.options.filter((_, x) => x !== i))}><window.IcTrash style={{ width: 14, height: 14 }} /></button>}
                    </div>
                  ))}
                </div>
                <button className="btn btn-sm" style={{ marginTop: 10 }} onClick={() => set("options", [...d.options, blankOption()])}><window.IcPlus style={{ width: 14, height: 14 }} />Add option</button>
                <div className="dim" style={{ fontSize: 11, marginTop: 8 }}>{d.type === "multi" ? "Tick every correct answer." : "Tick the single correct answer."}</div>
              </>}

              {d.type === "text" && <div className="field" style={{ marginBottom: 0 }}><label>Correct answer</label><input className="inp" value={d.answer} onChange={(e) => set("answer", e.target.value)} placeholder="Accepted answer" /></div>}

              {d.type === "match" && <>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {(d.pairs || []).map((p, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <input className="inp" placeholder="Left" value={p.l} onChange={(e) => set("pairs", d.pairs.map((x, j) => j === i ? { ...x, l: e.target.value } : x))} />
                      <window.IcLink style={{ width: 15, height: 15, color: "var(--ink-4)", flexShrink: 0 }} />
                      <input className="inp" placeholder="Right" value={p.r} onChange={(e) => set("pairs", d.pairs.map((x, j) => j === i ? { ...x, r: e.target.value } : x))} />
                      {d.pairs.length > 1 && <button className="icon-btn" style={{ width: 28, height: 28, border: 0, boxShadow: "none", background: "transparent", color: "var(--ink-4)" }} onClick={() => set("pairs", d.pairs.filter((_, x) => x !== i))}><window.IcTrash style={{ width: 14, height: 14 }} /></button>}
                    </div>
                  ))}
                </div>
                <button className="btn btn-sm" style={{ marginTop: 10 }} onClick={() => set("pairs", [...(d.pairs || []), { l: "", r: "" }])}><window.IcPlus style={{ width: 14, height: 14 }} />Add pair</button>
              </>}

              {d.type === "reading" && <>
                <div className="field"><label>Passage</label><textarea className="inp" rows={4} value={d.passage} onChange={(e) => set("passage", e.target.value)} placeholder="Reading passage…"></textarea></div>
                <div style={{ fontSize: 12, fontWeight: 700, margin: "4px 0 9px", display: "flex", alignItems: "center", gap: 7 }}><window.IcLayers style={{ width: 14, height: 14, color: "var(--pri)" }} />Sub-questions <span className="dim" style={{ fontWeight: 500 }}>· parent → child</span></div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {(d.children || []).map((c, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 11px", border: "1px solid var(--hair)", borderRadius: "var(--r-sm)", borderLeft: "3px solid var(--pri)" }}>
                      <span className="mono dim" style={{ fontSize: 11 }}>{i + 1}</span>
                      <input className="inp" style={{ flex: 1, height: 30 }} placeholder={"Sub-question " + (i + 1)} value={c.title} onChange={(e) => set("children", d.children.map((x, j) => j === i ? { ...x, title: e.target.value } : x))} />
                      <select className="sel" style={{ height: 30, width: 120 }} value={c.type} onChange={(e) => set("children", d.children.map((x, j) => j === i ? { ...x, type: e.target.value } : x))}>{window.QUESTION_TYPES.filter(q => q.id !== "reading").map(q => <option key={q.id} value={q.id}>{q.name}</option>)}</select>
                      <button className="icon-btn" style={{ width: 28, height: 28, border: 0, boxShadow: "none", background: "transparent", color: "var(--ink-4)" }} onClick={() => set("children", d.children.filter((_, x) => x !== i))}><window.IcTrash style={{ width: 14, height: 14 }} /></button>
                    </div>
                  ))}
                </div>
                <button className="btn btn-sm" style={{ marginTop: 10 }} onClick={() => set("children", [...(d.children || []), { id: "c" + (Date.now() % 100000), title: "", type: "single", difficulty: d.difficulty, marks: 1, options: [blankOption(), blankOption()] }])}><window.IcPlus style={{ width: 14, height: 14 }} />Add sub-question</button>
              </>}

              <hr className="hairline" style={{ margin: "14px 0" }} />
              <div className="row-2">
                <div className="field" style={{ marginBottom: 0 }}><label>Marks / score</label><input className="inp mono" type="number" value={d.marks} onChange={(e) => set("marks", +e.target.value || 0)} /></div>
                <div className="field" style={{ marginBottom: 0 }}><label>Feedback / explanation</label><input className="inp" value={d.feedback} onChange={(e) => set("feedback", e.target.value)} placeholder="Shown after answering" /></div>
              </div>
            </div>

            {/* Media */}
            <div className="card card-pad">
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Media &amp; formatting</div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button className="btn" onClick={() => set("media", { ...d.media, image: d.media.image ? null : "image.png" })} style={{ borderColor: d.media.image ? "var(--pri)" : "var(--hair)" }}><window.IcModule style={{ width: 15, height: 15 }} />{d.media.image ? "Image added ✓" : "Upload image"}</button>
                <button className="btn" onClick={() => set("media", { ...d.media, audio: d.media.audio ? null : "audio.mp3" })} style={{ borderColor: d.media.audio ? "var(--pri)" : "var(--hair)" }}><window.IcAudio style={{ width: 15, height: 15 }} />{d.media.audio ? "Audio added ✓" : "Upload audio"}</button>
                <button className="btn"><window.IcEdit style={{ width: 15, height: 15 }} />Rich text</button>
              </div>
            </div>

            {/* Tags & usage */}
            <div className="card card-pad">
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Tags &amp; usage</div>
              <div className="field">
                <label>Tags</label>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>{d.tags.map(tg => <span key={tg} className="chip" style={{ height: 24 }}>#{tg}<button onClick={() => set("tags", d.tags.filter(x => x !== tg))} style={{ border: 0, background: "transparent", cursor: "pointer", color: "var(--ink-4)", padding: 0, display: "grid" }}><window.IcX style={{ width: 12, height: 12 }} /></button></span>)}</div>
                <input className="inp" placeholder="Add a tag and press Enter" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(e.target.value); e.target.value = ""; } }} />
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Usage type <span className="hint">a question can belong to several</span></label>
                <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                  {window.USAGE_TYPES.map(u => { const on = d.usage.includes(u.id); return <button key={u.id} onClick={() => toggleUsage(u.id)} className="chip" style={{ cursor: "pointer", height: 28, border: on ? "1px solid " + u.color : "1px solid var(--hair)", background: on ? u.color.replace(")", " / 0.10)") : "var(--surface)", color: on ? u.color : "var(--ink-2)" }}>{on && <window.IcCheck style={{ width: 12, height: 12 }} />}{u.label}</button>; })}
                </div>
              </div>
            </div>

            {/* Skip logic */}
            <div className="card card-pad">
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4, display: "flex", alignItems: "center", gap: 7 }}><window.IcWorkflow style={{ width: 15, height: 15, color: "var(--pri)" }} />Skip logic <span className="dim" style={{ fontWeight: 500, fontSize: 11.5 }}>· optional</span></div>
              <div className="dim" style={{ fontSize: 11.5, marginBottom: 12 }}>Branch the flow based on this question's outcome — also editable per-assessment.</div>
              <label style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 12.5, fontWeight: 550, marginBottom: 12 }}><input type="checkbox" checked={!!d.skip} onChange={(e) => set("skip", e.target.checked ? { onCorrect: "continue", onIncorrect: "skip-next" } : null)} />Enable skip logic for this question</label>
              {d.skip && <div className="row-2">
                <div className="field" style={{ marginBottom: 0 }}><label>If correct →</label><select className="sel" value={d.skip.onCorrect} onChange={(e) => set("skip", { ...d.skip, onCorrect: e.target.value })}><option value="continue">Continue normally</option><option value="skip-next">Skip next question</option><option value="show-harder">Jump to harder question</option></select></div>
                <div className="field" style={{ marginBottom: 0 }}><label>If incorrect →</label><select className="sel" value={d.skip.onIncorrect} onChange={(e) => set("skip", { ...d.skip, onIncorrect: e.target.value })}><option value="skip-next">Skip next question</option><option value="continue">Continue normally</option><option value="show-easier">Show easier question</option></select></div>
              </div>}
            </div>
          </div>
        </div>

        {/* live preview */}
        <div style={{ borderLeft: "1px solid var(--hair)", background: "var(--surface-2)", padding: "24px 24px", overflowY: "auto" }}>
          <div style={{ position: "sticky", top: 0 }}>
            <div className="dim" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.04em", marginBottom: 11, textTransform: "uppercase" }}>Student preview</div>
            <div className="card card-pad" style={{ background: "var(--surface)" }}>
              <div style={{ display: "flex", gap: 6, marginBottom: 14 }}><window.SubjectChip subject={d.subject} sm /><span className="chip" style={{ height: 20, fontSize: 10.5 }}>{d.level}</span><DiffPill d={d.difficulty} sm /></div>
              <QuestionPreviewCard q={d} showKey />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.QuestionBank = QuestionBank;
window.QuestionEditor = QuestionEditor;
window.QuestionPreviewCard = QuestionPreviewCard;
window.DiffPill = DiffPill;
window.QTypeTag = QTypeTag;
window.UsageDots = UsageDots;
window.FilterSelect = FilterSelect;
