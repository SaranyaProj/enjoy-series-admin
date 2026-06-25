/* repository.jsx — Game Repository: browse by Game Type or by Lesson, manage the
   14-type catalog of adaptive games. */
const { useState: useStateR } = React;

function GameCard({ g, onOpen }) {
  const t = window.TYPE_BY_ID[g.type];
  const s = window.SUBJECTS[g.subject];
  return (
    <div className="card" style={{ overflow: "hidden", cursor: "pointer", transition: "box-shadow .15s, transform .15s, border-color .15s" }}
         onClick={() => onOpen(g)}
         onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "var(--sh-3)"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = "var(--hair-2)"; }}
         onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = "var(--hair)"; }}>
      {/* glyph header tinted by subject */}
      <div style={{ height: 92, position: "relative", background: `linear-gradient(135deg, ${s.color.replace(')', ' / 0.07)')}, ${s.color.replace(')', ' / 0.02)')})`,
                    borderBottom: "1px solid var(--hair)", display: "grid", placeItems: "center",
                    backgroundImage: "radial-gradient(var(--hair) 0.8px, transparent 0.8px)", backgroundSize: "11px 11px" }}>
        <div style={{ width: 54, height: 54, borderRadius: 14, background: "var(--surface)", border: "1px solid var(--hair)",
                      display: "grid", placeItems: "center", boxShadow: "var(--sh-1)" }}>
          <window.GameGlyph typeId={g.type} size={28} color={s.color} />
        </div>
        <span className="mono" style={{ position: "absolute", top: 9, left: 11, fontSize: 10.5, color: "var(--ink-4)", fontWeight: 600 }}>{t.n}</span>
        <div style={{ position: "absolute", top: 8, right: 8 }} onClick={(e) => e.stopPropagation()}>
          <window.Menu items={[
            { label: "View details", icon: window.IcEye, onClick: () => onOpen(g) },
            { label: "Edit game", icon: window.IcEdit, onClick: () => window.toast("Opening Game Builder…") },
            { label: "Copy / duplicate", icon: window.IcCopy, onClick: () => window.toast("Duplicated — editable variant created") },
            { sep: true },
            { label: "Delete", icon: window.IcTrash, danger: true, onClick: () => window.toast("Game deleted") },
          ]} />
        </div>
      </div>
      <div style={{ padding: "12px 13px 13px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 7 }}>
          <window.StatusBadge status={g.status} />
          <span className="dim" style={{ fontSize: 11, marginLeft: "auto" }}>{g.updated}</span>
        </div>
        <div style={{ fontWeight: 680, fontSize: 14, letterSpacing: "-0.01em", marginBottom: 3 }}>{g.name}</div>
        <div className="dim" style={{ fontSize: 11.5, marginBottom: 11 }}>{t.name}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          <window.SubjectChip subject={g.subject} sm />
          <span className="chip" style={{ height: 20, fontSize: 11 }}>{g.level}</span>
          <span className="lvl">{window.difficultySpan(g.levels)}</span>
        </div>
        <hr className="hairline" style={{ margin: "11px 0 10px" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 11.5, color: "var(--ink-3)" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}><window.IcLayers style={{ width: 13, height: 13 }} /><b className="mono" style={{ color: "var(--ink-2)" }}>{g.items}</b> items</span>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}><window.IcLink style={{ width: 13, height: 13 }} /><b className="mono" style={{ color: "var(--ink-2)" }}>{g.uses}</b> modules</span>
          {g.plays > 0 && <span style={{ display: "flex", alignItems: "center", gap: 5, marginLeft: "auto" }}><window.IcEye style={{ width: 13, height: 13 }} /><b className="mono" style={{ color: "var(--ink-2)" }}>{(g.plays/1000).toFixed(1)}k</b></span>}
        </div>
      </div>
    </div>
  );
}

function GameDetail({ g, onClose, onEdit, onCopy, onDelete }) {
  const t = window.TYPE_BY_ID[g.type];
  const s = window.SUBJECTS[g.subject];
  return (
    <window.SlideOver title={g.name} sub={t.name + " · " + g.subject} onClose={onClose}
      foot={<>
        <button className="btn btn-pri" onClick={() => { onEdit && onEdit(g); }}><window.IcEdit style={{ width: 15, height: 15 }} />Edit game</button>
        <button className="btn" onClick={() => { onCopy && onCopy(g); onClose(); }}><window.IcCopy style={{ width: 15, height: 15 }} />Copy / duplicate</button>
        <button className="btn btn-ghost" style={{ marginLeft: "auto", color: "var(--bad)" }} onClick={() => { onDelete && onDelete(g); onClose(); }}><window.IcTrash style={{ width: 15, height: 15 }} />Delete</button>
      </>}>
      {/* preview player */}
      <div style={{ borderRadius: "var(--r-lg)", border: "1px solid var(--hair)", overflow: "hidden", marginBottom: 18 }}>
        <div style={{ height: 188, display: "grid", placeItems: "center", position: "relative",
                      background: `linear-gradient(135deg, ${s.color.replace(')', ' / 0.10)')}, ${s.color.replace(')', ' / 0.03)')})`,
                      backgroundImage: "radial-gradient(var(--hair) 0.9px, transparent 0.9px)", backgroundSize: "13px 13px" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 72, height: 72, borderRadius: 20, background: "var(--surface)", border: "1px solid var(--hair)", display: "grid", placeItems: "center", margin: "0 auto 12px", boxShadow: "var(--sh-2)" }}>
              <window.GameGlyph typeId={g.type} size={38} color={s.color} />
            </div>
            <button className="btn btn-sm" style={{ background: "var(--surface)" }}><window.IcEye style={{ width: 14, height: 14 }} />Launch interactive preview</button>
          </div>
          <span className="chip mono" style={{ position: "absolute", top: 11, left: 12, fontSize: 10.5 }}>{t.mech}</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        {[["Subject", g.subject], ["Level", g.level], ["Lesson", g.lesson], ["Difficulty", window.difficultySpan(g.levels)], ["Total items", g.items + " items"], ["Author", g.author]].map(([k, v]) => (
          <div key={k} style={{ background: "var(--surface-2)", border: "1px solid var(--hair)", borderRadius: "var(--r-sm)", padding: "9px 11px" }}>
            <div className="dim" style={{ fontSize: 11, fontWeight: 600 }}>{k}</div>
            <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "var(--surface-2)", border: "1px solid var(--hair)", borderRadius: "var(--r-sm)", padding: "10px 12px", marginBottom: 18 }}>
        <div className="dim" style={{ fontSize: 11, fontWeight: 600 }}>Learning outcome</div>
        <div style={{ fontSize: 13, fontWeight: 550, marginTop: 3 }}>{g.lo}</div>
        {g.tags && g.tags.length > 0 && <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 9 }}>{g.tags.map(tg => <span key={tg} className="chip" style={{ height: 20, fontSize: 10.5 }}>{tg}</span>)}</div>}
      </div>

      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-2)", marginBottom: 9, letterSpacing: "0.01em" }}>VARIANTS & QUESTIONS PER ROUND</div>
      <div className="card card-pad" style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
          {window.variantSpec(g.type).variants.map(v => <span key={v.id} className="chip" style={{ height: 24, fontSize: 11 }} title={v.desc}>{v.name}</span>)}
        </div>
        <div className="dim" style={{ fontSize: 11.5 }}>Questions per round: <b className="mono" style={{ color: "var(--ink-2)" }}>{window.variantSpec(g.type).sizes.join(" · ")}</b> {window.variantSpec(g.type).unit}</div>
      </div>

      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-2)", marginBottom: 9, letterSpacing: "0.01em" }}>USAGE & PERFORMANCE</div>
      {g.plays > 0 ? (
        <div className="card card-pad" style={{ marginBottom: 8 }}>
          <div style={{ display: "flex", gap: 22 }}>
            <div><div className="dim" style={{ fontSize: 11 }}>Total plays</div><div style={{ fontSize: 22, fontWeight: 740, letterSpacing: "-0.02em" }} className="mono">{g.plays.toLocaleString()}</div></div>
            <div><div className="dim" style={{ fontSize: 11 }}>Avg difficulty reached</div><div style={{ fontSize: 22, fontWeight: 740, letterSpacing: "-0.02em" }} className="mono">{g.avgLevel.toFixed(1)}</div></div>
            <div><div className="dim" style={{ fontSize: 11 }}>In modules</div><div style={{ fontSize: 22, fontWeight: 740, letterSpacing: "-0.02em" }} className="mono">{g.uses}</div></div>
          </div>
          <hr className="hairline" style={{ margin: "14px 0 12px" }} />
          <div className="dim" style={{ fontSize: 11.5, marginBottom: 8 }}>Adaptive difficulty distribution</div>
          {[["Easy", 28], ["Medium", 46], ["Hard", 26]].map(([lv, pct]) => (
            <div key={lv} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 7 }}>
              <span className="lvl" style={{ width: 58 }}>{lv}</span>
              <div style={{ flex: 1, height: 7, background: "var(--surface-3)", borderRadius: 99 }}>
                <div style={{ width: pct + "%", height: "100%", background: s.color, borderRadius: 99 }}></div>
              </div>
              <span className="mono dim" style={{ fontSize: 11, width: 32, textAlign: "right" }}>{pct}%</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="card card-pad" style={{ textAlign: "center", color: "var(--ink-3)", fontSize: 12.5 }}>
          No play data yet — this game is {window.STATUS_LABEL[g.status].toLowerCase()}.
        </div>
      )}
    </window.SlideOver>
  );
}

/* ── Reusable games table — used by Game Type detail & Lesson detail ───────────
   Columns: Game · Subject · Level · Lesson · Difficulty · Learning outcome · tags
   Per-row actions: View Details · Edit · Copy/Duplicate · Delete. */
function GamesTable({ games, onView, onEdit, onCopy, onDelete }) {
  if (games.length === 0) return <div className="card card-pad" style={{ textAlign: "center", color: "var(--ink-3)", fontSize: 12.5 }}>No questions yet — use “Add Question” to create one.</div>;
  return (
    <div className="card" style={{ overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
        <thead>
          <tr style={{ background: "var(--surface-2)", textAlign: "left", color: "var(--ink-3)", fontSize: 11 }}>
            {["Game","Subject","Level","Lesson","Difficulty","Learning outcome","Status",""].map((h, i) => <th key={i} style={{ padding: "10px 14px", fontWeight: 650 }}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {games.map(g => {
            const t = window.TYPE_BY_ID[g.type]; const s = window.SUBJECTS[g.subject];
            return (
              <tr key={g.id} style={{ borderTop: "1px solid var(--hair)", cursor: "pointer" }} onClick={() => onView(g)}
                  onMouseEnter={(e) => e.currentTarget.style.background = "var(--surface-2)"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "10px 14px" }}><div style={{ display: "flex", alignItems: "center", gap: 10 }}><div style={{ width: 30, height: 30, borderRadius: 8, background: "var(--surface-2)", border: "1px solid var(--hair)", display: "grid", placeItems: "center", flexShrink: 0 }}><window.GameGlyph typeId={g.type} size={17} color={s.color} /></div><div><b style={{ fontWeight: 640 }}>{g.name}</b><div className="dim" style={{ fontSize: 10.5 }}>{t.name}</div></div></div></td>
                <td style={{ padding: "10px 14px" }}><window.SubjectChip subject={g.subject} sm /></td>
                <td style={{ padding: "10px 14px" }}><span className="chip" style={{ height: 20, fontSize: 11 }}>{g.level}</span></td>
                <td style={{ padding: "10px 14px", color: "var(--ink-3)" }}>{g.lesson}</td>
                <td style={{ padding: "10px 14px" }}><span className="lvl">{window.difficultySpan(g.levels)}</span></td>
                <td style={{ padding: "10px 14px", color: "var(--ink-3)", maxWidth: 240 }}>
                  <div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{g.lo}</div>
                  {g.tags && g.tags.length > 0 && <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 4 }}>{g.tags.map(tg => <span key={tg} className="chip" style={{ height: 17, fontSize: 9.5 }}>{tg}</span>)}</div>}
                </td>
                <td style={{ padding: "10px 14px" }}><window.StatusBadge status={g.status} /></td>
                <td style={{ padding: "10px 6px" }} onClick={(e) => e.stopPropagation()}>
                  <window.Menu items={[
                    { label: "View details", icon: window.IcEye, onClick: () => onView(g) },
                    { label: "Edit", icon: window.IcEdit, onClick: () => onEdit(g) },
                    { label: "Copy / duplicate", icon: window.IcCopy, onClick: () => onCopy(g) },
                    { sep: true },
                    { label: "Delete", icon: window.IcTrash, danger: true, onClick: () => onDelete(g) },
                  ]} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ── Game Type catalog card (A1/A3 — click to drill into the type's games) ──── */
function GameTypeCard({ t, count, onOpen }) {
  const pc = (window.SUBJECTS[t.subjects[0]] || { color: "var(--pri)" }).color; // primary-subject tint
  const vcount = window.variantSpec(t.id).variants.length;
  return (
    <button onClick={() => onOpen(t)} className="card" style={{ textAlign: "left", padding: 0, cursor: "pointer", overflow: "hidden", background: "var(--surface)", transition: "box-shadow .15s, transform .15s, border-color .15s" }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "var(--sh-3)"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = pc.replace(")", " / 0.4)"); }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = "var(--hair)"; }}>
      <div style={{ padding: "14px 15px 13px", display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: pc.replace(")", " / 0.10)"), display: "grid", placeItems: "center", flexShrink: 0 }}>
          {React.createElement(window[t.icon], { style: { width: 24, height: 24, color: pc } })}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 7 }}>
            <span style={{ fontSize: 14.5, fontWeight: 720, letterSpacing: "-0.01em" }}>{t.name}</span>
            <span className="mono dim" style={{ fontSize: 10, marginLeft: "auto", flexShrink: 0 }}>{t.n}</span>
          </div>
          <div className="dim" style={{ fontSize: 11.5, lineHeight: 1.4, marginTop: 3 }}>{t.mech}</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 15px", borderTop: "1px solid var(--hair)", background: "var(--surface-2)" }}>
        <div style={{ display: "flex", gap: 4 }} title={t.subjects.join(" · ")}>
          {t.subjects.map(s => <span key={s} style={{ width: 9, height: 9, borderRadius: 99, background: (window.SUBJECTS[s] || {}).color }}></span>)}
        </div>
        <span className="dim" style={{ fontSize: 11 }}>{vcount} variants</span>
        <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 700, color: count ? "var(--ink)" : "var(--ink-4)" }}>
          <b className="mono" style={{ fontSize: 13.5, color: count ? pc : "var(--ink-4)" }}>{count}</b>{count === 1 ? "game" : "games"}<window.IcChevR style={{ width: 14, height: 14, color: "var(--ink-4)" }} />
        </span>
      </div>
    </button>
  );
}

/* ── Game Type detail (A3) — type summary + all games of this type ──────────── */
function GameTypeDetail({ t, games, onBack, onNewGame, onView, onEdit, onCopy, onDelete }) {
  const spec = window.variantSpec(t.id);
  return (
    <div className="page-anim">
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <button className="btn btn-ghost btn-sm" onClick={onBack}><window.IcChevL style={{ width: 15, height: 15 }} />All game types</button>
      </div>
      <div className="card card-pad" style={{ marginBottom: 18, display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 56, height: 56, borderRadius: 14, background: "var(--pri-soft)", display: "grid", placeItems: "center", flexShrink: 0 }}>
          {React.createElement(window[t.icon], { style: { width: 30, height: 30, color: "var(--pri)" } })}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <h1 style={{ fontSize: 20, fontWeight: 740, margin: 0 }}>{t.name}</h1>
            <span className="mono dim" style={{ fontSize: 12 }}>Type {t.n}</span>
          </div>
          <p className="dim" style={{ fontSize: 12.5, margin: "4px 0 0" }}>{t.mech} · {spec.variants.length} variants · {spec.sizes.join("/")} {spec.unit} per round</p>
        </div>
        <button className="btn btn-pri" onClick={() => onNewGame(t)}><window.IcPlus style={{ width: 16, height: 16 }} />Add Question</button>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 11 }}>
        <b style={{ fontSize: 13.5, fontWeight: 700 }}>Questions in this game type</b>
        <span className="chip mono">{games.length}</span>
      </div>
      <GamesTable games={games} onView={onView} onEdit={onEdit} onCopy={onCopy} onDelete={onDelete} />
    </div>
  );
}

/* ── Add New Game Type form (A2) — same fields used to present each game type ── */
function GameTypeForm({ onClose, onSave }) {
  const [name, setName] = useStateR("");
  const [subjects, setSubjects] = useStateR(["Maths"]);
  const [mech, setMech] = useStateR("");
  const [ages, setAges] = useStateR("6–11");
  const [levels, setLevels] = useStateR("All");
  const [icon, setIcon] = useStateR("GgDragDrop");
  const iconOpts = window.GAME_TYPES.map(t => t.icon);
  const toggleSubj = (s) => setSubjects(arr => arr.includes(s) ? arr.filter(x => x !== s) : [...arr, s]);

  return (
    <window.Modal title="Add New Game Type" sub="Define a reusable interaction type — uses the same fields shown for every game type." onClose={onClose} width={620}
      foot={<>
        <button className="btn btn-pri" disabled={!name || subjects.length === 0} onClick={() => onSave({ name, subjects, mech, ages, levels, icon })}><window.IcCheck style={{ width: 15, height: 15 }} />Create game type</button>
        <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
      </>}>
      <div className="field"><label>Game type name</label><input className="inp" placeholder="e.g. Memory Flip" value={name} onChange={(e) => setName(e.target.value)} autoFocus /></div>
      <div className="field"><label>Mechanic <span className="hint">how the child interacts</span></label><input className="inp" placeholder="e.g. Flip cards to find matching pairs" value={mech} onChange={(e) => setMech(e.target.value)} /></div>
      <div className="field">
        <label>Subjects</label>
        <div style={{ display: "flex", gap: 8 }}>
          {["Maths","English","Tamil"].map(s => {
            const on = subjects.includes(s);
            return <button key={s} onClick={() => toggleSubj(s)} className="chip" style={{ cursor: "pointer", height: 30, padding: "0 13px", border: on ? "1px solid var(--pri)" : "1px solid var(--hair)", background: on ? "var(--pri-soft)" : "var(--surface)", color: on ? "var(--pri-ink)" : "var(--ink-2)" }}>{on && <window.IcCheck style={{ width: 12, height: 12 }} />}{s}</button>;
          })}
        </div>
      </div>
      <div className="row-2">
        <div className="field"><label>Age range</label><input className="inp" value={ages} onChange={(e) => setAges(e.target.value)} /></div>
        <div className="field"><label>Levels</label><input className="inp" placeholder="e.g. L1–L3 or All" value={levels} onChange={(e) => setLevels(e.target.value)} /></div>
      </div>
      <div className="field" style={{ marginBottom: 0 }}>
        <label>Icon</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {iconOpts.map(ic => {
            const on = icon === ic;
            return <button key={ic} onClick={() => setIcon(ic)} style={{ width: 40, height: 40, borderRadius: 10, display: "grid", placeItems: "center", border: on ? "1.5px solid var(--pri)" : "1px solid var(--hair)", background: on ? "var(--pri-soft)" : "var(--surface)", boxShadow: on ? "0 0 0 3px var(--pri-soft)" : "none" }}>{React.createElement(window[ic], { style: { width: 21, height: 21, color: on ? "var(--pri)" : "var(--ink-2)" } })}</button>;
          })}
        </div>
      </div>
    </window.Modal>
  );
}

/* ── Lesson View (C) — Curriculum mapping (Moodle-style activity mapping) ────────
   Plan the curriculum from the lesson's point of view: each lesson is a slot, and
   activities (games) are MAPPED into it and associated with learning outcomes and
   competencies. Hierarchy: Subject → Level → Topic (Week) → Lesson (Session) →
   mapped Activities. Built on window.CYCLE.
   Filters: Subject · Level · Activity type · Competency + learning-outcome search. */
function LessonRow({ b, s }) {
  const isGame = b.t === "g";
  const m = isGame ? (window.MECH[b.g] || { name: "Game", type: "dragdrop" }) : null;
  const a = !isGame ? (window.ANCHORS[b.a] || window.ANCHORS.recap) : null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 10px", background: "var(--surface)", border: "1px solid var(--hair)", borderRadius: "var(--r-sm)" }}>
      <div style={{ width: 26, height: 26, borderRadius: 7, background: (isGame ? s.color : a.color).replace(")", " / 0.10)"), display: "grid", placeItems: "center", flexShrink: 0 }}>
        {isGame ? <window.GameGlyph typeId={m.type} size={15} color={s.color} /> : React.createElement(window[a.icon], { style: { width: 15, height: 15, color: a.color } })}
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b.title}</div>
        <div className="dim" style={{ fontSize: 10.5 }}>{isGame ? ("Activity · " + m.name) : ("Instruction · " + a.name)}</div>
      </div>
      {isGame && (
        <div onClick={(e) => e.stopPropagation()}>
          <window.Menu items={[
            { label: "Edit game", icon: window.IcEdit, onClick: () => window.toast("Opening Game Builder…") },
            { label: "Copy game", icon: window.IcCopy, onClick: () => window.toast("Game copied") },
            { sep: true },
            { label: "Delete game", icon: window.IcTrash, danger: true, onClick: () => window.toast("Game removed from lesson") },
          ]} />
        </div>
      )}
      <span className="chip" style={{ height: 19, fontSize: 10, flexShrink: 0 }}>{isGame ? "Game" : "Video"}</span>
    </div>
  );
}

function RepoLessonView({ onNewGame }) {
  const subjects = Object.keys(window.CYCLE);
  const [subject, setSubject] = useStateR(subjects[0]);
  const sd = window.CYCLE[subject];
  const [levelIdx, setLevelIdx] = useStateR(0);
  const li = Math.min(levelIdx, sd.levels.length - 1);
  const level = sd.levels[li];
  const [openWeek, setOpenWeek] = useStateR(0);
  const [openLesson, setOpenLesson] = useStateR(null);
  const [typeFilter, setTypeFilter] = useStateR("All");
  const [compFilter, setCompFilter] = useStateR("All");
  const [outcomeQ, setOutcomeQ] = useStateR("");
  const [mapInto, setMapInto] = useStateR(null);   // lesson label currently mapping an activity into
  const s = window.SUBJECTS[subject];

  const pickSubject = (su) => { setSubject(su); setLevelIdx(0); setOpenWeek(0); setOpenLesson(null); setTypeFilter("All"); setCompFilter("All"); };
  const pickLevel = (i) => { setLevelIdx(i); setOpenWeek(0); setOpenLesson(null); setTypeFilter("All"); setCompFilter("All"); };

  /* activity-type & competency options present in this level (for the filter chips) */
  const allGameBlocks = level.weeks.flatMap(wk => wk.sessions.flatMap(ss => ss.blocks.filter(b => b.t === "g")));
  const typesHere = Array.from(new Set(allGameBlocks.map(b => (window.MECH[b.g] || {}).type).filter(Boolean)));
  const compsHere = Array.from(new Set(allGameBlocks.flatMap(b => b.tags || []))).sort();
  const blockMatches = (b) => {
    if (b.t !== "g") return typeFilter === "All" && compFilter === "All" && outcomeQ === "";
    if (typeFilter !== "All" && (window.MECH[b.g] || {}).type !== typeFilter) return false;
    if (compFilter !== "All" && !(b.tags || []).includes(compFilter)) return false;
    if (outcomeQ !== "" && !((b.lo || "") + " " + (b.title || "")).toLowerCase().includes(outcomeQ.toLowerCase())) return false;
    return true;
  };

  return (
    <div className="page-anim">
      {/* Curriculum-mapping explainer — the lesson view is a planning surface (C) */}
      <div className="card" style={{ padding: "14px 16px", marginBottom: 16, background: "linear-gradient(120deg, var(--pri-soft), var(--surface))", borderColor: "var(--pri-soft-2)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <window.IcLayers style={{ width: 16, height: 16, color: "var(--pri)" }} />
          <b style={{ fontSize: 13.5, fontWeight: 720 }}>Curriculum mapping</b>
          <span className="dim" style={{ fontSize: 12 }}>Plan and manage activities from each lesson's point of view.</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          {[
            ["1", "Create an activity", window.IcGame],
            ["2", "Map it to a lesson", window.IcLink],
            ["3", "Associate outcomes & competencies", window.IcTarget],
            ["4", "Manage from the lesson", window.IcModule],
          ].map(([n, label, Ic], i, arr) => (
            <React.Fragment key={n}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "6px 11px", borderRadius: 99, background: "var(--surface)", border: "1px solid var(--hair)" }}>
                <span className="mono" style={{ width: 17, height: 17, borderRadius: 99, background: "var(--pri)", color: "#fff", display: "grid", placeItems: "center", fontSize: 10, fontWeight: 700 }}>{n}</span>
                <Ic style={{ width: 14, height: 14, color: "var(--pri)" }} />
                <span style={{ fontSize: 12, fontWeight: 600 }}>{label}</span>
              </div>
              {i < arr.length - 1 && <window.IcChevR style={{ width: 14, height: 14, color: "var(--ink-4)" }} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Subject + Level — prominent segmented controls (C2/C3) */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 18, alignItems: "flex-end", marginBottom: 16 }}>
        <div>
          <div className="dim" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.03em", marginBottom: 6, textTransform: "uppercase" }}>Subject</div>
          <div style={{ display: "flex", gap: 8 }}>
            {subjects.map(su => {
              const ss = window.SUBJECTS[su]; const on = subject === su;
              return (
                <button key={su} onClick={() => pickSubject(su)} style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 14px", borderRadius: "var(--r-md)", fontSize: 13, fontWeight: 650,
                  border: on ? "1.5px solid " + ss.color : "1px solid var(--hair)", background: on ? ss.color.replace(")", " / 0.10)") : "var(--surface)", color: on ? ss.color : "var(--ink-2)", boxShadow: on ? "0 0 0 3px " + ss.color.replace(")", " / 0.10)") : "none" }}>
                  <span style={{ width: 9, height: 9, borderRadius: 99, background: ss.color }}></span>{su}
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <div className="dim" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.03em", marginBottom: 6, textTransform: "uppercase" }}>Level <span style={{ fontWeight: 500, textTransform: "none" }}>· {subject} runs {sd.levels.length} levels</span></div>
          <div className="seg" style={{ padding: 3 }}>
            {sd.levels.map((lv, i) => <button key={i} className={li === i ? "on" : ""} style={{ padding: "6px 13px", fontSize: 12.5 }} onClick={() => pickLevel(i)}>{lv.level}</button>)}
          </div>
        </div>
      </div>

      {/* secondary filters: Activity type · Competency · Learning outcome (C1) */}
      <div className="card card-pad" style={{ padding: "11px 14px", marginBottom: 14, display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span className="dim" style={{ fontSize: 11.5, fontWeight: 650 }}>Activity type</span>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            <button onClick={() => setTypeFilter("All")} className="chip" style={{ cursor: "pointer", height: 24, border: typeFilter === "All" ? "1px solid var(--pri)" : "1px solid var(--hair)", background: typeFilter === "All" ? "var(--pri-soft)" : "var(--surface)", color: typeFilter === "All" ? "var(--pri-ink)" : "var(--ink-2)" }}>All</button>
            {typesHere.map(tp => { const tt = window.TYPE_BY_ID[tp]; const on = typeFilter === tp; return <button key={tp} onClick={() => setTypeFilter(tp)} className="chip" style={{ cursor: "pointer", height: 24, border: on ? "1px solid var(--pri)" : "1px solid var(--hair)", background: on ? "var(--pri-soft)" : "var(--surface)", color: on ? "var(--pri-ink)" : "var(--ink-2)" }}>{tt ? tt.name : tp}</button>; })}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span className="dim" style={{ fontSize: 11.5, fontWeight: 650 }}>Competency</span>
          <select className="sel" style={{ height: 30, width: "auto", minWidth: 150 }} value={compFilter} onChange={(e) => setCompFilter(e.target.value)}>
            <option value="All">All competencies</option>
            {compsHere.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="searchbox" style={{ minWidth: 200, height: 30, marginLeft: "auto" }}>
          <window.IcSearch style={{ width: 15, height: 15 }} />
          <input placeholder="Search learning outcome…" value={outcomeQ} onChange={(e) => setOutcomeQ(e.target.value)} />
        </div>
        {(typeFilter !== "All" || compFilter !== "All" || outcomeQ !== "") && (
          <button className="btn btn-ghost btn-sm" onClick={() => { setTypeFilter("All"); setCompFilter("All"); setOutcomeQ(""); }}><window.IcX style={{ width: 13, height: 13 }} />Clear</button>
        )}
      </div>

      {/* breadcrumb — Topic / Lesson flow terminology (C4) */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: "var(--ink-3)", margin: "0 2px 12px", flexWrap: "wrap" }}>
        <window.SubjectChip subject={subject} sm /><window.IcChevR style={{ width: 13, height: 13 }} /><b style={{ color: "var(--ink-2)" }}>{level.level}</b><window.IcChevR style={{ width: 13, height: 13 }} />Topic<window.IcChevR style={{ width: 13, height: 13 }} />Lesson<window.IcChevR style={{ width: 13, height: 13 }} />Activities / Assessment
        <span style={{ marginLeft: "auto" }}>{level.weeks.length} topics</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {level.weeks.map((wk, wi) => {
          const lessons = wk.sessions;
          const acts = lessons.reduce((acc, ss) => acc + ss.blocks.filter(b => b.t === "g").length, 0);
          const topicComps = Array.from(new Set(lessons.flatMap(l => l.blocks.filter(b => b.t === "g").flatMap(b => b.tags || []))));
          const wopen = openWeek === wi;
          return (
            <div key={wi} className="card" style={{ overflow: "hidden" }}>
              <button onClick={() => setOpenWeek(wopen ? -1 : wi)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", border: 0, background: "transparent", textAlign: "left" }}>
                <window.IcChevR style={{ width: 16, height: 16, color: "var(--ink-3)", transform: wopen ? "rotate(90deg)" : "none", transition: "transform .15s" }} />
                <div style={{ width: 30, height: 30, borderRadius: 8, background: s.color.replace(")", " / 0.10)"), color: s.color, display: "grid", placeItems: "center", flexShrink: 0 }}><window.IcModule style={{ width: 16, height: 16 }} /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 680 }}>{wk.week} <span className="dim" style={{ fontWeight: 500 }}>· Topic {wi + 1}</span></div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginTop: 2 }}>
                    <span className="dim" style={{ fontSize: 11.5 }}>{wk.theme}</span>
                    {topicComps.slice(0, 3).map(c => <span key={c} className="chip" style={{ height: 17, fontSize: 9.5, background: s.color.replace(")", " / 0.10)"), color: s.color }}>{c}</span>)}
                    {topicComps.length > 3 && <span className="dim" style={{ fontSize: 10 }}>+{topicComps.length - 3}</span>}
                  </div>
                </div>
                <span className="chip" style={{ height: 22, fontSize: 11 }}>{lessons.length} lessons</span>
                <span className="chip" style={{ height: 22, fontSize: 11 }}>{acts} activities</span>
                <button className="btn btn-sm" onClick={(e) => { e.stopPropagation(); onNewGame && onNewGame(); }}><window.IcPlus style={{ width: 14, height: 14 }} />Add activity</button>
              </button>
              {wopen && (
                <div style={{ borderTop: "1px solid var(--hair)", background: "var(--surface-2)", padding: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                  {lessons.map((ss, si) => {
                    const key = wi + "-" + si;
                    const lopen = openLesson === key;
                    const games = ss.blocks.filter(b => b.t === "g");
                    const shownGames = games.filter(blockMatches);
                    const isRev = ss.type === "Revision";
                    const lessonNo = ss.session.replace("Session ", "");
                    return (
                      <div key={si} className="card" style={{ overflow: "hidden" }}>
                        <button onClick={() => setOpenLesson(lopen ? null : key)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 11, padding: "11px 14px", border: 0, background: "transparent", textAlign: "left" }}>
                          <window.IcChevR style={{ width: 15, height: 15, color: "var(--ink-3)", transform: lopen ? "rotate(90deg)" : "none", transition: "transform .15s" }} />
                          <span className="lvl" style={{ fontSize: 11 }}>L{lessonNo}</span>
                          <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13, fontWeight: 640 }}>Lesson {lessonNo}</div></div>
                          <span className={"status " + (isRev ? "s-revise" : "s-pub")}><span className="dotc"></span>{isRev ? "Revision" : "Teaching"}</span>
                          <span className="chip mono" style={{ height: 21, fontSize: 10.5 }}>{ss.blocks.length} activities · {games.length} games</span>
                        </button>
                        {lopen && (() => {
                          const lessonComps = Array.from(new Set(games.flatMap(b => b.tags || [])));
                          const videos = ss.blocks.filter(b => b.t !== "g");
                          return (
                          <div style={{ borderTop: "1px solid var(--hair)", padding: 14 }}>
                            {/* lesson mapping toolbar (C5) */}
                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 12, padding: "9px 11px", background: "var(--surface-2)", borderRadius: "var(--r-sm)", border: "1px solid var(--hair)" }}>
                              <span className="dim" style={{ fontSize: 11.5, fontWeight: 650 }}>Lesson plan</span>
                              <span className="chip" style={{ height: 20, fontSize: 10.5 }}>{level.level}</span>
                              <span className="chip" style={{ height: 20, fontSize: 10.5 }}>{games.length} activities</span>
                              <span className="chip" style={{ height: 20, fontSize: 10.5 }}>{videos.length} instruction</span>
                              <span className="chip" style={{ height: 20, fontSize: 10.5 }}>{lessonComps.length} competencies</span>
                              <div style={{ marginLeft: "auto", display: "flex", gap: 7 }}>
                                <button className="btn btn-sm" onClick={() => setMapInto(level.level + " · " + wk.week + " · Lesson " + lessonNo)}><window.IcLink style={{ width: 14, height: 14 }} />Map existing activity</button>
                                <button className="btn btn-pri btn-sm" onClick={() => onNewGame && onNewGame()}><window.IcPlus style={{ width: 14, height: 14 }} />New activity</button>
                              </div>
                            </div>

                            {/* competency coverage for the lesson */}
                            {lessonComps.length > 0 && (
                              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", letterSpacing: "0.02em" }}>COMPETENCIES COVERED</span>
                                {lessonComps.map(c => <span key={c} className="chip" style={{ height: 20, fontSize: 10.5, background: s.color.replace(")", " / 0.10)"), color: s.color }}><window.IcTarget style={{ width: 11, height: 11 }} />{c}</span>)}
                              </div>
                            )}

                            {/* Activity ↔ Learning outcome ↔ Competency mapping table */}
                            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", marginBottom: 8, letterSpacing: "0.02em" }}>ACTIVITY MAPPING ({shownGames.length}{shownGames.length !== games.length ? " of " + games.length : ""})</div>
                            <div className="card" style={{ overflow: "hidden", marginBottom: videos.length ? 12 : 0 }}>
                              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                                <thead><tr style={{ background: "var(--surface-2)", textAlign: "left", color: "var(--ink-3)", fontSize: 10.5 }}>
                                  {["Activity", "Learning outcome", "Competency", ""].map((h, i) => <th key={i} style={{ padding: "8px 12px", fontWeight: 650 }}>{h}</th>)}
                                </tr></thead>
                                <tbody>
                                  {games.filter(b => shownGames.includes(b)).map((b, bi) => {
                                    const m = window.MECH[b.g] || { name: "Game", type: "dragdrop" };
                                    return (
                                      <tr key={bi} style={{ borderTop: "1px solid var(--hair)" }}>
                                        <td style={{ padding: "9px 12px" }}>
                                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                            <div style={{ width: 26, height: 26, borderRadius: 7, background: s.color.replace(")", " / 0.10)"), display: "grid", placeItems: "center", flexShrink: 0 }}><window.GameGlyph typeId={m.type} size={15} color={s.color} /></div>
                                            <div style={{ minWidth: 0 }}><b style={{ fontWeight: 640, fontSize: 12 }}>{b.title}</b><div className="dim" style={{ fontSize: 10 }}>{m.name}</div></div>
                                          </div>
                                        </td>
                                        <td style={{ padding: "9px 12px", color: "var(--ink-2)", maxWidth: 280 }}>{b.lo || <span className="dim">—</span>}</td>
                                        <td style={{ padding: "9px 12px" }}>{(b.tags || []).length ? <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>{b.tags.map((tg, x) => <span key={x} className="chip" style={{ height: 18, fontSize: 9.5 }}>{tg}</span>)}</div> : <span className="dim">—</span>}</td>
                                        <td style={{ padding: "6px 6px" }} onClick={(e) => e.stopPropagation()}>
                                          <window.Menu items={[
                                            { label: "Edit activity", icon: window.IcEdit, onClick: () => window.toast("Opening Game Builder…") },
                                            { label: "Edit outcome & competency", icon: window.IcTarget, onClick: () => window.toast("Edit learning-outcome mapping") },
                                            { label: "Replace activity", icon: window.IcCopy, onClick: () => setMapInto(level.level + " · " + wk.week + " · Lesson " + lessonNo) },
                                            { sep: true },
                                            { label: "Unmap from lesson", icon: window.IcX, danger: true, onClick: () => window.toast("Activity unmapped from lesson") },
                                          ]} />
                                        </td>
                                      </tr>
                                    );
                                  })}
                                  {shownGames.length === 0 && (
                                    <tr><td colSpan={4} style={{ padding: "14px 12px", textAlign: "center", color: "var(--ink-3)", fontSize: 11.5 }}>
                                      {games.length > 0 ? "No activities match the active filters." : isRev ? "Revision lesson — consolidated assessment across the topic." : "No activities mapped yet — map an existing activity or create one."}
                                    </td></tr>
                                  )}
                                </tbody>
                              </table>
                            </div>

                            {/* instructional / video blocks supporting the lesson */}
                            {videos.length > 0 && (
                              <>
                                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", marginBottom: 8, letterSpacing: "0.02em" }}>SUPPORTING INSTRUCTION ({videos.length})</div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                                  {videos.map((b, bi) => <LessonRow key={bi} b={b} s={s} />)}
                                </div>
                              </>
                            )}
                          </div>
                          );
                        })()}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Map an existing repository activity into a lesson (curriculum mapping) */}
      {mapInto && (
        <window.Modal title="Map an activity to this lesson" sub={mapInto} onClose={() => setMapInto(null)} width={620}
          foot={<button className="btn btn-ghost" onClick={() => setMapInto(null)}>Done</button>}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 11px", borderRadius: "var(--r-sm)", background: "var(--pri-soft)", marginBottom: 12, fontSize: 11.5, color: "var(--pri-ink)" }}>
            <window.IcLink style={{ width: 14, height: 14, flexShrink: 0 }} />Pick an existing {subject} activity from the repository to map into this lesson. Mapping reuses the activity — it stays linked to its single source.
          </div>
          <div style={{ maxHeight: 320, overflowY: "auto", display: "flex", flexDirection: "column", gap: 7 }}>
            {window.GAMES.filter(g => g.subject === subject).map(g => {
              const tt = window.TYPE_BY_ID[g.type];
              return (
                <div key={g.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 11px", border: "1px solid var(--hair)", borderRadius: "var(--r-sm)" }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: s.color.replace(")", " / 0.10)"), display: "grid", placeItems: "center", flexShrink: 0 }}><window.GameGlyph typeId={g.type} size={16} color={s.color} /></div>
                  <div style={{ minWidth: 0, flex: 1 }}><b style={{ fontWeight: 640, fontSize: 12.5 }}>{g.name}</b><div className="dim" style={{ fontSize: 10.5 }}>{tt ? tt.name : g.type} · {g.lo}</div></div>
                  <span className="chip" style={{ height: 20, fontSize: 10.5 }}>{g.level}</span>
                  <button className="btn btn-pri btn-sm" onClick={() => { window.toast("“" + g.name + "” mapped to lesson"); setMapInto(null); }}><window.IcPlus style={{ width: 13, height: 13 }} />Map</button>
                </div>
              );
            })}
          </div>
        </window.Modal>
      )}
    </div>
  );
}

function Repository({ onNewGame }) {
  const [allGames, setAllGames] = useStateR(window.GAMES);
  const [subject, setSubject] = useStateR("All");
  const [status, setStatus] = useStateR("All");
  const [view, setView] = useStateR("grid");
  const [browse, setBrowse] = useStateR("type"); // "type" = View by Game Type · "lesson" = View by Lesson
  const [q, setQ] = useStateR("");
  const [open, setOpen] = useStateR(null);
  const [typeOpen, setTypeOpen] = useStateR(null);   // active Game Type detail (A3)
  const [showTypeForm, setShowTypeForm] = useStateR(false); // Add New Game Type (A2)
  const [types, setTypes] = useStateR(window.GAME_TYPES);

  const gamesFor = (filterFn) => allGames.filter(g =>
    (subject === "All" || g.subject === subject) &&
    (status === "All" || g.status === status) &&
    (q === "" || g.name.toLowerCase().includes(q.toLowerCase())) &&
    (!filterFn || filterFn(g))
  );

  /* per-game actions (shared by table/cards/detail) */
  const editGame = (g) => { window.toast("Opening Game Builder for “" + g.name + "”…"); onNewGame(); };
  const copyGame = (g) => { const ng = { ...g, id: "g" + (Date.now() % 100000), name: g.name + " (Copy)", status: "draft", plays: 0, avgLevel: 0, uses: 0, updated: "just now" }; setAllGames(gs => [ng, ...gs]); window.toast("Duplicated — editable variant created"); };
  const deleteGame = (g) => { setAllGames(gs => gs.filter(x => x.id !== g.id)); window.toast("“" + g.name + "” deleted"); };

  const counts = { All: allGames.length };
  ["Maths","English","Tamil"].forEach(sub => counts[sub] = allGames.filter(g => g.subject === sub).length);

  const filteredTypes = types.filter(t => subject === "All" || t.subjects.includes(subject));

  return (
    <div className="page page-anim">
      <div className="page-head">
        <div>
          <h1>Game Repository</h1>
          <p>A library of questions and content built on {window.GAME_TYPES.length} proven game types. Add a question to an existing type, then map it into any lesson — content built once is referenced everywhere.</p>
        </div>
        <div className="actions">
          <button className="btn btn-ghost" title="Advanced — defines a brand-new interaction engine" onClick={() => setShowTypeForm(true)}><window.IcLayers style={{ width: 16, height: 16 }} />New game type</button>
          <button className="btn btn-pri" onClick={onNewGame}><window.IcPlus style={{ width: 16, height: 16 }} />Add Question</button>
        </div>
      </div>

      {/* A1 — distinct, prominent browse-mode tabs */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", marginBottom: 18 }}>
        <div style={{ display: "inline-flex", gap: 4, padding: 4, background: "var(--surface-2)", border: "1px solid var(--hair)", borderRadius: "var(--r-md)" }}>
          {[
            { key: "type",   icon: window.IcGrid,   label: "View by Game Type" },
            { key: "lesson", icon: window.IcLayers, label: "View by Lesson" },
          ].map(m => {
            const on = browse === m.key;
            return (
              <button key={m.key} onClick={() => { setBrowse(m.key); setTypeOpen(null); }} style={{ display: "flex", alignItems: "center", gap: 8, height: 38, padding: "0 18px", borderRadius: "var(--r-sm)", border: 0, cursor: "pointer", fontSize: 13, fontWeight: 680,
                background: on ? "var(--pri)" : "transparent", color: on ? "#fff" : "var(--ink-3)", boxShadow: on ? "var(--sh-1)" : "none", transition: "all .15s" }}>
                {React.createElement(m.icon, { style: { width: 16, height: 16 } })}{m.label}
              </button>
            );
          })}
        </div>
        <span className="dim" style={{ fontSize: 12 }}>{browse === "type" ? "Browse the catalog and drill into each type's games" : "Browse by Subject → Level → Topic → Lesson"}</span>
      </div>

      {browse === "lesson" ? <RepoLessonView onNewGame={onNewGame} /> : (
        typeOpen ? (
          <GameTypeDetail t={typeOpen} games={gamesFor(g => g.type === typeOpen.id)}
            onBack={() => setTypeOpen(null)} onNewGame={onNewGame}
            onView={setOpen} onEdit={editGame} onCopy={copyGame} onDelete={deleteGame} />
        ) : (
        <>
          <div className="toolbar" style={{ marginBottom: 14 }}>
            <div className="seg">
              {["All","Maths","English","Tamil"].map(sub => (
                <button key={sub} className={subject === sub ? "on" : ""} onClick={() => setSubject(sub)}>{sub}<span className="mono" style={{ opacity: 0.55, marginLeft: 5, fontSize: 11 }}>{counts[sub]}</span></button>
              ))}
            </div>
            <div className="searchbox" style={{ minWidth: 200, height: 32 }}>
              <window.IcSearch style={{ width: 15, height: 15 }} />
              <input placeholder="Search game types…" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            <select className="sel" style={{ height: 32, width: "auto" }} value={status} onChange={(e) => setStatus(e.target.value)} title="Filter by publishing status">
              <option value="All">All statuses</option>
              {["pub","review","draft"].map(k => <option key={k} value={k}>{window.STATUS_LABEL[k]}</option>)}
            </select>
            {/* slim summary — replaces the heavy 4-box KPI row */}
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 14, fontSize: 12, color: "var(--ink-3)" }}>
              <span><b className="mono" style={{ color: "var(--ink)" }}>{types.length}</b> types</span>
              <span><b className="mono" style={{ color: "var(--ink)" }}>{allGames.length}</b> games</span>
              <span><b className="mono" style={{ color: "var(--good)" }}>{allGames.filter(g => g.status === "pub").length}</b> published</span>
              <span><b className="mono" style={{ color: "var(--ink)" }}>42.8k</b> plays</span>
            </div>
          </div>

          {/* Game Type catalog — click a type to see its games (A3) */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(264px, 1fr))", gap: 14 }}>
            {filteredTypes
              .filter(t => q === "" || t.name.toLowerCase().includes(q.toLowerCase()))
              .map(t => <GameTypeCard key={t.id} t={t} count={gamesFor(g => g.type === t.id).length} onOpen={setTypeOpen} />)}
          </div>
        </>
        )
      )}

      {open && <GameDetail g={open} onClose={() => setOpen(null)} onEdit={editGame} onCopy={copyGame} onDelete={deleteGame} />}
      {showTypeForm && <GameTypeForm onClose={() => setShowTypeForm(false)} onSave={(nt) => {
        const n = String(types.length + 1).padStart(2, "0");
        setTypes(ts => [...ts, { n, id: "custom" + (Date.now() % 100000), name: nt.name, subjects: nt.subjects, ages: nt.ages, levels: nt.levels, mech: nt.mech, icon: nt.icon }]);
        setShowTypeForm(false); window.toast("Game type “" + nt.name + "” created");
      }} />}
    </div>
  );
}

window.Repository = Repository;
