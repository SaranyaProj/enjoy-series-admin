/* module-builder.jsx — Lesson / Session Builder.
   Cycle-aware: Level · Week · Session metadata, anchor activities + games in the palette,
   per-block domain/strand + learning outcome + competency tags, live duration & competency meter.
   Prefills from an Instructional-Cycle session when one is passed in. */
const { useState: useStateM, useRef: useRefM } = React;

const STEPS = [{ n: 1, label: "Lesson / Session Setup" }, { n: 2, label: "Build Sequence" }, { n: 3, label: "Preview & Submit" }];

function uid() { return "b" + Math.random().toString(36).slice(2, 8); }
function minsFor(b) { if (b.t === "v") return ["story","read"].includes(b.a) ? 3 : 2; return 2; }

/* convert a cycle-session into editable builder blocks (or a sensible blank starter) */
function sessionToBlocks(session) {
  if (!session) return [
    { uid: uid(), kind: "v", anchor: "rhyme", type: "video", title: "Rhyme Time — Introduction", mins: 2, domain: "", lo: "", tags: [] },
    { uid: uid(), kind: "g", mech: "spotit", type: "spotit", title: "Spot It", mins: 2, domain: "", lo: "", tags: [] },
  ];
  return session.blocks.map(b => b.t === "v"
    ? { uid: uid(), kind: "v", anchor: b.a, type: "video", title: b.title, mins: minsFor(b), domain: b.d, lo: b.lo, tags: b.tags || [] }
    : { uid: uid(), kind: "g", mech: b.g, type: (window.MECH[b.g] || {}).type || "dragdrop", title: b.title, mins: minsFor(b), domain: b.d, lo: b.lo, tags: b.tags || [] });
}

function blkVisual(blk) {
  if (blk.kind === "v") { const a = window.ANCHORS[blk.anchor] || window.ANCHORS.recap; return { icon: window[a.icon], color: a.color, label: a.name, isGame: false }; }
  const m = window.MECH[blk.mech] || { name: "Game", type: "dragdrop" };
  return { color: "var(--pri)", label: m.name, type: m.type, isGame: true };
}

/* ---------- palette ---------- */
function PaletteEntry({ label, desc, icon, color, type, isGame, onDragStart, payload }) {
  return (
    <div draggable onDragStart={(e) => onDragStart(e, payload)}
      style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: "var(--r-sm)",
               border: "1px solid var(--hair)", background: "var(--surface)", cursor: "grab", transition: "border-color .12s, box-shadow .12s" }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--hair-2)"; e.currentTarget.style.boxShadow = "var(--sh-1)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--hair)"; e.currentTarget.style.boxShadow = "none"; }}>
      <div style={{ width: 28, height: 28, borderRadius: 7, display: "grid", placeItems: "center", flexShrink: 0,
                    background: isGame ? "var(--pri-soft)" : color.replace(")", " / 0.10)"), color: isGame ? "var(--pri)" : color }}>
        {isGame ? <window.GameGlyph typeId={type} size={15} color="var(--pri)" /> : React.createElement(icon, { style: { width: 15, height: 15 } })}
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontSize: 12.5, fontWeight: 620, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</div>
        {desc && <div className="dim" style={{ fontSize: 10.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{desc}</div>}
      </div>
      <window.IcDrag style={{ width: 14, height: 14, marginLeft: "auto", color: "var(--ink-4)", flexShrink: 0 }} />
    </div>
  );
}

/* ---------- a placed block ---------- */
function CanvasBlock({ blk, idx, onDragStart, onConfig, onRemove, dragging, horizontal, framework }) {
  const v = blkVisual(blk);
  return (
    <div draggable onDragStart={(e) => onDragStart(e, idx)}
      style={{ display: "flex", alignItems: "flex-start", gap: 11, padding: "11px 13px", borderRadius: "var(--r-md)",
               border: "1px solid var(--hair)", background: "var(--surface)", boxShadow: dragging ? "var(--sh-3)" : "var(--sh-1)",
               opacity: dragging ? 0.4 : 1, cursor: "grab", position: "relative", width: horizontal ? 248 : "auto", flexShrink: 0 }}>
      <window.IcDrag style={{ width: 15, height: 15, color: "var(--ink-4)", flexShrink: 0, marginTop: 8 }} />
      <div style={{ width: 34, height: 34, borderRadius: 9, display: "grid", placeItems: "center", flexShrink: 0, marginTop: 1,
                    background: v.isGame ? "var(--pri-soft)" : v.color.replace(")", " / 0.10)"), color: v.isGame ? "var(--pri)" : v.color }}>
        {v.isGame ? <window.GameGlyph typeId={v.type} size={18} color="var(--pri)" /> : React.createElement(v.icon, { style: { width: 18, height: 18 } })}
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span className="dim mono" style={{ fontSize: 10.5 }}>{String(idx + 1).padStart(2, "0")}</span>
          <span style={{ fontSize: 13, fontWeight: 650, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{blk.title}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3, flexWrap: "wrap" }}>
          <span className="chip" style={{ height: 18, fontSize: 10, background: v.isGame ? "var(--pri-soft)" : "var(--surface-3)", color: v.isGame ? "var(--pri-ink)" : "var(--ink-2)" }}>{v.isGame ? "🎮 " : "▶ "}{v.label}</span>
          {blk.domain && <span className="dim" style={{ fontSize: 10.5 }}>· {blk.domain}</span>}
        </div>
        {!horizontal && blk.lo && <div className="dim" style={{ fontSize: 11, marginTop: 5, lineHeight: 1.4 }}>{blk.lo}</div>}
        {blk.tags && blk.tags.length > 0 && (
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 6 }}>
            {blk.tags.map((t, i) => <span key={i} className="lvl" style={{ fontSize: 9.5, padding: "1px 5px", background: "var(--pri-soft)", color: "var(--pri-ink)", border: "1px solid var(--pri-soft-2)" }}>{t}</span>)}
          </div>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
        <span className="chip mono" style={{ height: 20, fontSize: 10.5 }}><window.IcClock style={{ width: 11, height: 11 }} />{blk.mins}m</span>
        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
          <button className="btn btn-sm" style={{ height: 28, padding: "0 11px", background: "var(--pri-soft)", color: "var(--pri-ink)", borderColor: "var(--pri-soft-2)" }} onClick={() => onConfig(idx)}><window.IcSliders style={{ width: 13, height: 13 }} />Configure</button>
          <button className="icon-btn" style={{ width: 26, height: 26, border: 0, boxShadow: "none", background: "transparent", color: "var(--ink-4)" }} onClick={() => onRemove(idx)} title="Remove"><window.IcX style={{ width: 14, height: 14 }} /></button>
        </div>
      </div>
    </div>
  );
}

/* ---------- right rail meter: duration + competency coverage ---------- */
function SessionMeter({ blocks, framework }) {
  const mins = blocks.reduce((a, b) => a + b.mins, 0);
  const max = 30, target = [20, 25];
  const pct = Math.min(mins / max * 100, 100);
  const over = mins > 25, under = mins < 20;
  const color = over ? "var(--warn)" : "var(--good)";

  const vids = blocks.filter(b => b.kind === "v").length;
  const games = blocks.filter(b => b.kind === "g").length;

  // competency coverage
  const cov = {};
  blocks.forEach(b => (b.tags || []).forEach(t => cov[t] = (cov[t] || 0) + 1));
  const fw = framework === "maths" ? window.MATHS_FW : window.LANG_FW.map(x => x.k);
  const fwName = framework === "maths" ? null : Object.fromEntries(window.LANG_FW.map(x => [x.k, x.n]));
  const covered = fw.filter(k => cov[k]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div className="card card-pad">
        <div style={{ fontSize: 11.5, fontWeight: 700, color: "var(--ink-2)", marginBottom: 11, letterSpacing: "0.01em", display: "flex", alignItems: "center", gap: 7 }}>
          <window.IcClock style={{ width: 15, height: 15, color: "var(--pri)" }} />SESSION METER
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span className="mono" style={{ fontSize: 28, fontWeight: 760, letterSpacing: "-0.02em", color }}>{mins}</span>
          <span className="dim" style={{ fontSize: 12.5, fontWeight: 600 }}>/ 20–25 min</span>
        </div>
        <div style={{ position: "relative", height: 9, background: "var(--surface-3)", borderRadius: 99, marginTop: 10, marginBottom: 6, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: (target[0]/max*100) + "%", width: ((target[1]-target[0])/max*100) + "%", top: 0, bottom: 0, background: "var(--good)", opacity: 0.16 }}></div>
          <div style={{ width: pct + "%", height: "100%", background: color, borderRadius: 99, transition: "width .3s cubic-bezier(.2,.7,.3,1)" }}></div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10 }} className="mono dim"><span>0</span><span>20</span><span>25</span><span>30</span></div>
        {over && <div style={{ marginTop: 10, padding: "7px 9px", borderRadius: 7, background: "var(--st-review-bg)", color: "var(--st-review)", fontSize: 11, fontWeight: 600 }}>Over 25 min — trim a block to fit one session.</div>}
        {under && <div style={{ marginTop: 10, padding: "7px 9px", borderRadius: 7, background: "var(--surface-2)", color: "var(--ink-3)", fontSize: 11, fontWeight: 550 }}>Add blocks to reach the 20-min minimum.</div>}
        <hr className="hairline" style={{ margin: "13px 0 11px" }} />
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1, textAlign: "center", padding: "8px 0", background: "var(--surface-2)", borderRadius: "var(--r-sm)", border: "1px solid var(--hair)" }}>
            <div className="mono" style={{ fontSize: 18, fontWeight: 740 }}>{vids}</div><div className="dim" style={{ fontSize: 10.5 }}>anchors</div>
          </div>
          <div style={{ flex: 1, textAlign: "center", padding: "8px 0", background: "var(--surface-2)", borderRadius: "var(--r-sm)", border: "1px solid var(--hair)" }}>
            <div className="mono" style={{ fontSize: 18, fontWeight: 740 }}>{games}</div><div className="dim" style={{ fontSize: 10.5 }}>games</div>
          </div>
        </div>
      </div>

      <div className="card card-pad">
        <div style={{ fontSize: 11.5, fontWeight: 700, color: "var(--ink-2)", marginBottom: 4, letterSpacing: "0.01em", display: "flex", alignItems: "center", gap: 7 }}>
          <window.IcTarget style={{ width: 15, height: 15, color: "var(--pri)" }} />COMPETENCY COVERAGE
        </div>
        <div className="dim" style={{ fontSize: 11, marginBottom: 11 }}>{covered.length} of {fw.length} {framework === "maths" ? "domains" : "strands"} touched</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {fw.map(k => {
            const n = cov[k] || 0; const on = n > 0;
            return (
              <div key={k} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="lvl" style={{ width: framework === "maths" ? "auto" : 26, fontSize: 10, padding: "1px 5px", textAlign: "center", background: on ? "var(--pri-soft)" : "var(--surface-3)", color: on ? "var(--pri-ink)" : "var(--ink-4)", border: on ? "1px solid var(--pri-soft-2)" : "1px solid var(--hair)", flexShrink: 0 }}>{k}</span>
                {fwName && <span className="dim" style={{ fontSize: 10.5, flexShrink: 0 }}>{fwName[k]}</span>}
                <div style={{ flex: 1, height: 5, background: "var(--surface-3)", borderRadius: 99 }}><div style={{ width: Math.min(n / 3 * 100, 100) + "%", height: "100%", background: on ? "var(--pri)" : "transparent", borderRadius: 99 }}></div></div>
                <span className="mono dim" style={{ fontSize: 10, width: 14, textAlign: "right" }}>{n || ""}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------- game picker ---------- */
function GamePicker({ onClose, onPick }) {
  const [q, setQ] = useStateM("");
  const games = window.GAMES.filter(g => g.status === "pub" && g.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <window.Modal title="Add a game from the Repository" sub="Games are referenced, not copied — updates flow everywhere." onClose={onClose} width={680}>
      <div className="searchbox" style={{ marginBottom: 14 }}><window.IcSearch style={{ width: 15, height: 15 }} /><input placeholder="Search published games…" value={q} onChange={(e) => setQ(e.target.value)} autoFocus /></div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, maxHeight: 360, overflowY: "auto" }}>
        {games.map(g => {
          const t = window.TYPE_BY_ID[g.type]; const s = window.SUBJECTS[g.subject];
          return (
            <button key={g.id} onClick={() => onPick(g)} style={{ display: "flex", alignItems: "center", gap: 11, padding: 11, borderRadius: "var(--r-md)", border: "1px solid var(--hair)", background: "var(--surface)", textAlign: "left", transition: "border-color .12s, box-shadow .12s" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--pri)"; e.currentTarget.style.boxShadow = "var(--sh-1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--hair)"; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ width: 38, height: 38, borderRadius: 9, background: s.color.replace(")", " / 0.10)"), display: "grid", placeItems: "center", flexShrink: 0 }}><window.GameGlyph typeId={g.type} size={21} color={s.color} /></div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 640, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{g.name}</div>
                <div className="dim" style={{ fontSize: 11, marginTop: 1 }}>{t.name} · {g.level} · {window.difficultySpan(g.levels)}</div>
              </div>
            </button>
          );
        })}
      </div>
    </window.Modal>
  );
}

/* adaptive path — redesigned to a simple, score-band model (#10).
   After the student plays the activity, their SCORE across all questions decides what
   happens next — one of three plain-language outcomes. Mirrors the lesson flow diagram:
   high score advances, mid score remediates (same content, more support), low score
   re-teaches the concept with a different video. */
const BAND_DEFS = [
  { key: "high", label: "Mastered",       tone: "good", icon: "✓", blurb: "Strong score — move the learner forward.",
    actions: ["Go to next activity", "Move up a difficulty level", "Finish lesson — mastered"] },
  { key: "mid",  label: "Needs practice", tone: "warn", icon: "↻", blurb: "Partly there — reinforce with the same module.",
    actions: ["Replay this activity", "Replay with hints enabled", "Give easier questions, same skill"] },
  { key: "low",  label: "Re-teach",       tone: "bad",  icon: "⟲", blurb: "Struggling — teach the concept a different way.",
    actions: ["Play an alternate explainer video", "Replay the original lesson video", "Restart the lesson from the top"] },
];
const newCFU = () => ({ min: 0, sec: 0, qType: "Text", q: "", optType: "Text", options: [{ text: "", correct: true }, { text: "", correct: false }] });
const newAdaptive = () => ({
  highMin: 75, midMin: 40,
  high: "Go to next activity",
  mid: "Replay with hints enabled",
  low: "Play an alternate explainer video",
  altVideo: "",
});
/* each question slot holds an Easy / Medium / Hard variant pulled from the repository —
   the in-game engine serves whichever difficulty the learner's last answer earns. */
const newQPick = () => ({ Easy: "", Medium: "", Hard: "" });
/* in-game progression rule: last answer outcome → difficulty of the NEXT question */
const newInGame = () => ({ correct: "Hard", hint: "Medium", wrong: "Easy" });
const DIFFS = ["Easy", "Medium", "Hard"];
const pad2 = (n) => String(n).padStart(2, "0");

/* tone → CSS colour pair used by the band rows */
const TONE = {
  good: { fg: "var(--good)", bg: "var(--st-approve-bg)" },
  warn: { fg: "var(--st-review)", bg: "var(--st-review-bg)" },
  bad:  { fg: "var(--bad)", bg: "var(--st-revise-bg)" },
};

const DIFF_TONE = { Easy: "var(--good)", Medium: "var(--st-review)", Hard: "var(--bad)" };

/* collapsible step — keeps the game-config form short and scannable */
function Accordion({ n, title, sub, open, onToggle, children }) {
  return (
    <div className="card" style={{ overflow: "hidden", marginBottom: 12 }}>
      <button type="button" onClick={onToggle} style={{ width: "100%", display: "flex", alignItems: "center", gap: 11, padding: "13px 15px", border: 0, background: open ? "var(--pri-soft)" : "var(--surface)", textAlign: "left", transition: "background .14s" }}>
        <span className="mono" style={{ width: 24, height: 24, flexShrink: 0, borderRadius: 99, background: "var(--pri)", color: "#fff", display: "grid", placeItems: "center", fontSize: 12, fontWeight: 700 }}>{n}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 720, letterSpacing: "-0.01em", color: open ? "var(--pri-ink)" : "var(--ink)" }}>{title}</div>
          {sub && <div className="dim" style={{ fontSize: 11.5, marginTop: 1 }}>{sub}</div>}
        </div>
        <window.IcChevD style={{ width: 17, height: 17, color: "var(--ink-3)", transform: open ? "none" : "rotate(-90deg)", transition: "transform .15s" }} />
      </button>
      {open && <div style={{ padding: 15, borderTop: "1px solid var(--hair)" }}>{children}</div>}
    </div>
  );
}

/* in-game progression rule editor (fold 1): last answer → next question's difficulty */
function InGameRule({ value, onChange }) {
  const rules = [
    { key: "correct", tone: "var(--good)", bg: "var(--st-approve-bg)", icon: "✓", label: "Answered correctly", hint: "first try, no help" },
    { key: "hint",    tone: "var(--st-review)", bg: "var(--st-review-bg)", icon: "?", label: "Correct with a hint", hint: "needed one nudge" },
    { key: "wrong",   tone: "var(--bad)", bg: "var(--st-revise-bg)", icon: "✗", label: "Answered incorrectly", hint: "or ran out of tries" },
  ];
  return (
    <div>
      <div className="dim" style={{ fontSize: 11.5, lineHeight: 1.5, marginBottom: 11 }}>
        Inside the game, the <b>next</b> question's difficulty adapts to how the learner did on the last one. This is why each question above has an Easy, Medium and Hard variant ready.
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {rules.map(r => (
          <div key={r.key} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 11px", borderRadius: "var(--r-sm)", background: r.bg, border: "1px solid " + r.tone.replace(")", " / 0.25)") }}>
            <span style={{ width: 22, height: 22, flexShrink: 0, borderRadius: 99, background: r.tone, color: "#fff", display: "grid", placeItems: "center", fontSize: 12, fontWeight: 700 }}>{r.icon}</span>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 650, color: r.tone }}>{r.label}</div>
              <div className="dim" style={{ fontSize: 10.5 }}>{r.hint}</div>
            </div>
            <window.IcArrowR style={{ width: 14, height: 14, color: "var(--ink-4)", flexShrink: 0 }} />
            <span className="dim" style={{ fontSize: 11, fontWeight: 600 }}>serve a</span>
            <select className="sel" style={{ height: 32, width: 104 }} value={value[r.key]} onChange={(e) => onChange({ ...value, [r.key]: e.target.value })}>
              {DIFFS.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Adaptive learning path: score-band outcome editor (one per game activity) ---------- */
function AdaptivePath({ value, onChange, videoOptions, totalQ }) {
  const a = value;
  const set = (patch) => onChange({ ...a, ...patch });
  // keep thresholds sane: 5 ≤ midMin < highMin ≤ 95
  const setHigh = (n) => { const v = Math.max(a.midMin + 5, Math.min(95, n || 0)); set({ highMin: v }); };
  const setMid  = (n) => { const v = Math.max(5, Math.min(a.highMin - 5, n || 0)); set({ midMin: v }); };
  const ranges = {
    high: `${a.highMin}–100%`,
    mid:  `${a.midMin}–${a.highMin - 1}%`,
    low:  `0–${a.midMin - 1}%`,
  };
  return (
    <div style={{ marginTop: 6, borderRadius: "var(--r-md)", border: "1px solid var(--hair)", overflow: "hidden", background: "var(--surface)" }}>
      <div style={{ padding: "11px 13px", borderBottom: "1px solid var(--hair)", background: "linear-gradient(180deg, var(--pri-soft), var(--surface))" }}>
        <div style={{ fontSize: 12.5, fontWeight: 720, display: "flex", alignItems: "center", gap: 7, color: "var(--pri-ink)" }}>
          <window.IcWorkflow style={{ width: 15, height: 15 }} />How the score is used
        </div>
        <div className="dim" style={{ fontSize: 11.5, marginTop: 4, lineHeight: 1.5 }}>
          We take the learner's <b>combined score</b> across {totalQ ? <b>all {totalQ} questions</b> : "all the questions above"} — points earned ÷ points possible, as a %.
          That single % falls into one of the three bands below. Set the two cut-offs, then choose the path for each band.
        </div>
      </div>

      {/* visual mini-flow */}
      <div style={{ display: "flex", alignItems: "stretch", gap: 10, padding: "13px 14px", background: "var(--surface-2)", borderBottom: "1px solid var(--hair)" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 5, padding: "0 4px" }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: "var(--pri-soft)", color: "var(--pri)", display: "grid", placeItems: "center" }}><window.IcGame style={{ width: 19, height: 19 }} /></div>
          <span style={{ fontSize: 10, fontWeight: 700, color: "var(--ink-3)" }}>Play &amp; score</span>
        </div>
        <div style={{ display: "grid", placeItems: "center", color: "var(--ink-4)" }}><window.IcArrowR style={{ width: 16, height: 16 }} /></div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
          {BAND_DEFS.map(b => { const t = TONE[b.tone]; return (
            <div key={b.key} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 99, background: t.bg, border: "1px solid " + t.fg.replace(")", " / 0.25)") }}>
              <span className="mono" style={{ fontSize: 11, fontWeight: 700, color: t.fg, width: 64 }}>{ranges[b.key]}</span>
              <window.IcArrowR style={{ width: 12, height: 12, color: t.fg, opacity: 0.6 }} />
              <span style={{ fontSize: 11.5, fontWeight: 650, color: t.fg, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a[b.key]}</span>
            </div>
          ); })}
        </div>
      </div>

      {/* band editors */}
      <div style={{ padding: 13, display: "flex", flexDirection: "column", gap: 9 }}>
        {BAND_DEFS.map((b) => {
          const t = TONE[b.tone];
          return (
            <div key={b.key} style={{ borderRadius: "var(--r-sm)", border: "1px solid var(--hair)", overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 11px", background: t.bg }}>
                <span style={{ width: 22, height: 22, borderRadius: 99, background: t.fg, color: "#fff", display: "grid", placeItems: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{b.icon}</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: t.fg }}>{b.label}</div>
                  <div style={{ fontSize: 10.5, color: "var(--ink-3)", lineHeight: 1.35 }}>{b.blurb}</div>
                </div>
                <span className="mono" style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, color: t.fg, background: "var(--surface)", padding: "3px 8px", borderRadius: 99, flexShrink: 0 }}>{ranges[b.key]}</span>
              </div>
              <div style={{ padding: "10px 11px", display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap" }}>
                {/* threshold control sits with the band that owns the lower edge */}
                {b.key === "high" && (
                  <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: "var(--ink-3)", fontWeight: 600 }}>
                    Score at or above
                    <input className="inp mono" style={{ width: 56, height: 30 }} type="number" min="10" max="95" value={a.highMin} onChange={(e) => setHigh(+e.target.value)} />%
                  </label>
                )}
                {b.key === "mid" && (
                  <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: "var(--ink-3)", fontWeight: 600 }}>
                    Score at or above
                    <input className="inp mono" style={{ width: 56, height: 30 }} type="number" min="5" max="90" value={a.midMin} onChange={(e) => setMid(+e.target.value)} />%
                  </label>
                )}
                {b.key === "low" && (
                  <span style={{ fontSize: 11.5, color: "var(--ink-3)", fontWeight: 600 }}>Below {a.midMin}%</span>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: "auto", flex: "1 1 220px", minWidth: 200 }}>
                  <window.IcArrowR style={{ width: 14, height: 14, color: "var(--ink-4)", flexShrink: 0 }} />
                  <select className="sel" style={{ flex: 1 }} value={a[b.key]} onChange={(e) => set({ [b.key]: e.target.value })}>
                    {b.actions.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              {/* alternate-video picker appears only when the low band re-teaches with another video */}
              {b.key === "low" && a.low === "Play an alternate explainer video" && (
                <div style={{ padding: "0 11px 11px", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 11, color: "var(--ink-3)", fontWeight: 600, paddingLeft: 20 }}>Alternate video</span>
                  <select className="sel" style={{ flex: 1, height: 32 }} value={a.altVideo} onChange={(e) => set({ altVideo: e.target.value })}>
                    <option value="">Choose a different explainer for the same concept…</option>
                    {(videoOptions || []).map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- block config (anchor video CFU · game configuration · adaptive paths) ---------- */
function BlockConfig({ blk, framework, meta, onClose, onSave }) {
  const v = blkVisual(blk);
  const isVideo = blk.kind === "v";
  const [d, setD] = useStateM(() => ({
    ...blk, tags: [...(blk.tags || [])],
    cfuOn: !!(blk.cfus && blk.cfus.length), cfus: blk.cfus || [],
    numQ: blk.numQ || 2,
    qpicks: blk.qpicks && blk.qpicks.length ? blk.qpicks : [newQPick(), newQPick()],
    inGame: blk.inGame || newInGame(),
    adaptive: blk.adaptive || newAdaptive(),
  }));
  const [openStep, setOpenStep] = useStateM("q"); // accordion: which step is expanded
  const toggleStep = (s) => setOpenStep(o => (o === s ? null : s));
  const toggleTag = (k) => setD(s => ({ ...s, tags: s.tags.includes(k) ? s.tags.filter(x => x !== k) : [...s.tags, k] }));
  const matchingGames = window.GAMES.filter(g => !meta || g.subject === meta.subject);
  /* learning outcomes for the dropdown — drawn from the subject's competency framework */
  const loOptions = framework === "maths" ? window.MATHS_FW : window.LANG_FW.map(x => x.n);
  /* alternate explainer videos a struggling learner can be re-taught with */
  const videoOptions = Object.values(window.ANCHORS).map(a => a.name).filter((n, i, arr) => arr.indexOf(n) === i);

  const setNumQ = (n) => setD(s => { const b = [...s.qpicks]; while (b.length < n) b.push(newQPick()); b.length = Math.max(0, n); return { ...s, numQ: n, qpicks: b }; });
  const setQpick = (i, diff, game) => setD(s => ({ ...s, qpicks: s.qpicks.map((b, x) => x === i ? { ...b, [diff]: game } : b) }));
  const setCFU = (i, patch) => setD(s => ({ ...s, cfus: s.cfus.map((c, x) => x === i ? { ...c, ...patch } : c) }));
  const setCFUOpt = (ci, oi, patch, single) => setD(s => ({ ...s, cfus: s.cfus.map((c, x) => x === ci ? { ...c, options: c.options.map((o, y) => y === oi ? { ...o, ...patch } : (single && patch.correct ? { ...o, correct: false } : o)) } : c) }));

  return (
    <window.SlideOver title={"Configure Activity"} sub={v.label} onClose={onClose}
      foot={<><button className="btn btn-pri" onClick={() => onSave(d)}>Save activity</button><button className="btn btn-ghost" onClick={onClose}>Cancel</button></>}>
      <div className="field"><label>Activity title</label><input className="inp" value={d.title} onChange={(e) => setD({ ...d, title: e.target.value })} /></div>
      <div className="row-2">
        <div className="field"><label>Est. minutes</label><input className="inp mono" type="number" value={d.mins} onChange={(e) => setD({ ...d, mins: +e.target.value || 0 })} /></div>
        <div className="field">
          <label>Learning outcome <span className="hint">what the child can do after this</span></label>
          <select className="sel" value={d.lo} onChange={(e) => setD({ ...d, lo: e.target.value })}>
            <option value="">Choose a learning outcome…</option>
            {loOptions.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      </div>

      <hr className="hairline" style={{ margin: "4px 0 16px" }} />

      {/* ---- VIDEO ACTIVITY: source + Check For Understanding (CFU) ---- */}
      {isVideo && <>
        <div className="field"><label>Video source</label><div style={{ display: "flex", gap: 8 }}><button className="btn" style={{ flex: 1 }}><window.IcUpload style={{ width: 15, height: 15 }} />Upload MP4/MOV</button><button className="btn" style={{ flex: 1 }}><window.IcLink style={{ width: 15, height: 15 }} />Embed URL</button></div></div>
        <div className="row-2">
          <div className="field"><label>Watch % to complete</label><input className="inp mono" defaultValue="80%" /></div>
          <div className="field"><label>Audio</label><select className="sel"><option>Narration + content</option><option>Content only</option></select></div>
        </div>

        <div style={{ marginTop: 6, padding: 14, borderRadius: "var(--r-md)", border: "1px solid var(--hair)", background: "var(--surface-2)" }}>
          <label style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13, fontWeight: 650 }}>
            <input type="checkbox" checked={d.cfuOn} onChange={(e) => setD(s => ({ ...s, cfuOn: e.target.checked, cfus: e.target.checked && s.cfus.length === 0 ? [newCFU()] : s.cfus }))} />
            <window.IcCheckCircle style={{ width: 16, height: 16, color: "var(--pri)" }} />Enable Check For Understanding (CFU)
          </label>
          <div className="dim" style={{ fontSize: 11.5, marginTop: 5 }}>Pause the video at set times to ask a quick question. A video can have multiple CFU checkpoints.</div>

          {d.cfuOn && <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
            {d.cfus.map((c, ci) => (
              <div key={ci} className="card card-pad" style={{ background: "var(--surface)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 11 }}>
                  <span className="chip" style={{ height: 22, fontSize: 11, background: "var(--pri-soft)", color: "var(--pri-ink)" }}>CFU {ci + 1}</span>
                  <span className="dim" style={{ fontSize: 11.5 }}>Show at</span>
                  <input className="inp mono" style={{ width: 50, height: 30 }} type="number" min="0" value={c.min} onChange={(e) => setCFU(ci, { min: +e.target.value || 0 })} /><span className="dim">:</span>
                  <input className="inp mono" style={{ width: 50, height: 30 }} type="number" min="0" max="59" value={c.sec} onChange={(e) => setCFU(ci, { sec: +e.target.value || 0 })} />
                  <span className="mono dim" style={{ fontSize: 11 }}>{pad2(c.min)}:{pad2(c.sec)}</span>
                  <button className="icon-btn" style={{ marginLeft: "auto", width: 26, height: 26, border: 0, boxShadow: "none", background: "transparent", color: "var(--ink-4)" }} onClick={() => setD(s => ({ ...s, cfus: s.cfus.filter((_, x) => x !== ci) }))}><window.IcTrash style={{ width: 14, height: 14 }} /></button>
                </div>
                <div className="row-2" style={{ marginBottom: 10 }}>
                  <div className="field" style={{ marginBottom: 0 }}><label>Question type</label><div className="seg" style={{ width: "fit-content" }}>{["Text","Image"].map(x => <button key={x} className={c.qType === x ? "on" : ""} onClick={() => setCFU(ci, { qType: x })}>{x}</button>)}</div></div>
                  <div className="field" style={{ marginBottom: 0 }}><label>Option type</label><div className="seg" style={{ width: "fit-content" }}>{["Text","Image"].map(x => <button key={x} className={c.optType === x ? "on" : ""} onClick={() => setCFU(ci, { optType: x })}>{x}</button>)}</div></div>
                </div>
                <div className="field" style={{ marginBottom: 10 }}>
                  <label>Question</label>
                  {c.qType === "Image" ? <button className="btn btn-sm"><window.IcModule style={{ width: 14, height: 14 }} />Upload question image</button>
                    : <input className="inp" placeholder="e.g. What did the kitten do?" value={c.q} onChange={(e) => setCFU(ci, { q: e.target.value })} />}
                </div>
                <label style={{ fontSize: 11.5, fontWeight: 600, color: "var(--ink-3)" }}>Answer options <span className="hint">tick the correct one</span></label>
                <div style={{ display: "flex", flexDirection: "column", gap: 7, marginTop: 7 }}>
                  {c.options.map((o, oi) => (
                    <div key={oi} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <button onClick={() => setCFUOpt(ci, oi, { correct: true }, true)} title="Mark correct" style={{ width: 24, height: 24, flexShrink: 0, borderRadius: 99, border: "1.5px solid " + (o.correct ? "var(--good)" : "var(--hair-2)"), background: o.correct ? "var(--st-approve-bg)" : "var(--surface)", display: "grid", placeItems: "center" }}>{o.correct && <window.IcCheck style={{ width: 12, height: 12, color: "var(--good)" }} />}</button>
                      {c.optType === "Image" ? <button className="btn btn-sm" style={{ flex: 1, justifyContent: "flex-start" }}><window.IcModule style={{ width: 13, height: 13 }} />Option image {oi + 1}</button>
                        : <input className="inp" style={{ flex: 1, height: 32 }} placeholder={"Option " + (oi + 1)} value={o.text} onChange={(e) => setCFUOpt(ci, oi, { text: e.target.value })} />}
                      {c.options.length > 2 && <button className="icon-btn" style={{ width: 26, height: 26, border: 0, boxShadow: "none", background: "transparent", color: "var(--ink-4)" }} onClick={() => setCFU(ci, { options: c.options.filter((_, y) => y !== oi) })}><window.IcX style={{ width: 13, height: 13 }} /></button>}
                    </div>
                  ))}
                </div>
                <button className="btn btn-sm" style={{ marginTop: 9 }} onClick={() => setCFU(ci, { options: [...c.options, { text: "", correct: false }] })}><window.IcPlus style={{ width: 13, height: 13 }} />Add option</button>
              </div>
            ))}
            <button className="btn btn-sm" style={{ justifyContent: "center", borderStyle: "dashed", background: "transparent" }} onClick={() => setD(s => ({ ...s, cfus: [...s.cfus, newCFU()] }))}><window.IcPlus style={{ width: 14, height: 14 }} />Add CFU checkpoint</button>
          </div>}
        </div>
      </>}

      {/* ---- GAME ACTIVITY: two collapsible steps — (1) pick questions, (2) adaptive path ---- */}
      {!isVideo && <>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 13px", borderRadius: "var(--r-md)", background: "var(--pri-soft)", marginBottom: 14 }}>
          <window.IcGame style={{ width: 18, height: 18, color: "var(--pri)", flexShrink: 0 }} />
          <div style={{ fontSize: 12, color: "var(--pri-ink)" }}>Set up <b>{v.label}</b> in two steps — choose the questions, then set how the game adapts.</div>
        </div>

        {/* STEP 1 — Select questions */}
        <Accordion n={1} title="Select questions" sub={d.numQ + " question" + (d.numQ > 1 ? "s" : "") + " · Easy / Medium / Hard each"} open={openStep === "q"} onToggle={() => toggleStep("q")}>
          <div className="field">
            <label>How many questions in this game? <span className="hint">up to 4</span></label>
            <div className="seg" style={{ width: "fit-content" }}>{[1, 2, 3, 4].map(n => <button key={n} className={d.numQ === n ? "on" : ""} onClick={() => setNumQ(n)}>{n}</button>)}</div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "9px 12px", borderRadius: "var(--r-sm)", background: "var(--surface-2)", border: "1px solid var(--hair)", margin: "2px 0 14px" }}>
            <window.IcSparkle style={{ width: 14, height: 14, color: "var(--pri)", flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontSize: 11.5, color: "var(--ink-3)", lineHeight: 1.45 }}>For each question, pick an <b style={{ color: "var(--good)" }}>Easy</b>, <b style={{ color: "var(--st-review)" }}>Medium</b> and <b style={{ color: "var(--bad)" }}>Hard</b> version from the repository. The game serves the right one to each child based on how they're doing — set the rule in Step&nbsp;2.</span>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center", margin: "0 0 14px" }}>
            <span className="dim" style={{ fontSize: 11, fontWeight: 600 }}>Repository auto-filtered by</span>
            {meta && <window.SubjectChip subject={meta.subject} sm />}
            {meta && <span className="chip" style={{ height: 20, fontSize: 10.5 }}>{meta.level}</span>}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {d.qpicks.map((b, i) => (
              <div key={i} className="card card-pad" style={{ background: "var(--surface-2)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 11 }}>
                  <span className="mono" style={{ width: 22, height: 22, borderRadius: 7, background: "var(--pri-soft)", color: "var(--pri-ink)", display: "grid", placeItems: "center", fontSize: 11, fontWeight: 700 }}>{i + 1}</span>
                  <b style={{ fontSize: 13 }}>Question {i + 1}</b>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                  {DIFFS.map(diff => (
                    <div key={diff} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <span style={{ width: 74, flexShrink: 0, fontSize: 11, fontWeight: 700, color: DIFF_TONE[diff], display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <span style={{ width: 7, height: 7, borderRadius: 99, background: DIFF_TONE[diff] }}></span>{diff}
                      </span>
                      <select className="sel" style={{ flex: 1 }} value={b[diff]} onChange={(e) => setQpick(i, diff, e.target.value)}>
                        <option value="">Select {diff.toLowerCase()} question from repository…</option>
                        {matchingGames.map(g => <option key={g.id} value={g.name}>{g.name}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Accordion>

        {/* STEP 2 — Adaptive learning path (two folds) */}
        <Accordion n={2} title="Adaptive learning path" sub="How the game adapts — between questions, and after the game" open={openStep === "path"} onToggle={() => toggleStep("path")}>
          {/* Fold 1 — within the game */}
          <div style={{ fontSize: 12.5, fontWeight: 720, display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
            <span className="chip mono" style={{ height: 19, fontSize: 10, background: "var(--pri-soft)", color: "var(--pri-ink)", fontWeight: 700 }}>2a</span>
            Between questions <span className="dim" style={{ fontWeight: 500, fontSize: 11.5 }}>· in-game difficulty</span>
          </div>
          <InGameRule value={d.inGame} onChange={(inGame) => setD(s => ({ ...s, inGame }))} />

          <hr className="hairline" style={{ margin: "18px 0 16px" }} />

          {/* Fold 2 — after the game */}
          <div style={{ fontSize: 12.5, fontWeight: 720, display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
            <span className="chip mono" style={{ height: 19, fontSize: 10, background: "var(--pri-soft)", color: "var(--pri-ink)", fontWeight: 700 }}>2b</span>
            After the game <span className="dim" style={{ fontWeight: 500, fontSize: 11.5 }}>· based on the total score</span>
          </div>
          <AdaptivePath value={d.adaptive} onChange={(adaptive) => setD(s => ({ ...s, adaptive }))} videoOptions={videoOptions} totalQ={d.numQ} />
        </Accordion>
      </>}
    </window.SlideOver>
  );
}

function ModuleBuilder({ tweaks, onExit, prefill }) {
  const ctx = (prefill && prefill.context) || (prefill && prefill.subject ? prefill : {}) || {};
  const session = prefill && prefill.session;
  const subj = ctx.subject || "Maths";
  const framework = (window.CYCLE[subj] || {}).framework || "maths";

  const [step, setStep] = useStateM(2);
  const [meta, setMeta] = useStateM({
    subject: subj,
    level: ctx.level || "Level 1",
    week: ctx.week || "",
    theme: ctx.theme || "",
    session: (session && session.session) || "Session 1",
    type: (session && session.type) || "Teaching",
    title: session ? `${ctx.week || "Week 1"} · ${session.session}` : (ctx.theme ? ctx.theme : "New Lesson / Session"),
  });
  const [blocks, setBlocks] = useStateM(sessionToBlocks(session));
  const [dragIdx, setDragIdx] = useStateM(null);
  const [dropIdx, setDropIdx] = useStateM(null);
  const [picker, setPicker] = useStateM(false);
  const [config, setConfig] = useStateM(null);
  const pendingPos = useRefM(null);
  const dragData = useRefM(null);

  const horizontal = tweaks.canvasStyle === "flow";
  const totalMins = blocks.reduce((a, b) => a + b.mins, 0);

  const onPaletteDragStart = (e, payload) => { dragData.current = { kind: "new", payload }; e.dataTransfer.effectAllowed = "copy"; };
  const onBlockDragStart = (e, idx) => { dragData.current = { kind: "move", idx }; setDragIdx(idx); e.dataTransfer.effectAllowed = "move"; };

  const computeDropIdx = (e) => {
    const cards = [...e.currentTarget.querySelectorAll("[data-blk]")];
    const pos = horizontal ? e.clientX : e.clientY;
    let di = cards.length;
    for (let i = 0; i < cards.length; i++) {
      const r = cards[i].getBoundingClientRect();
      const mid = horizontal ? r.left + r.width / 2 : r.top + r.height / 2;
      if (pos < mid) { di = i; break; }
    }
    return di;
  };
  const onZoneDragOver = (e) => { e.preventDefault(); setDropIdx(computeDropIdx(e)); };
  const onZoneDragLeave = (e) => { if (!e.currentTarget.contains(e.relatedTarget)) setDropIdx(null); };
  const onZoneDrop = (e) => {
    e.preventDefault();
    const di = computeDropIdx(e);
    const dd = dragData.current; if (!dd) return;
    if (dd.kind === "new") {
      const p = dd.payload;
      if (p.kind === "game-picker") { pendingPos.current = di; setPicker(true); }
      else if (p.kind === "anchor") {
        const a = window.ANCHORS[p.id];
        const nb = { uid: uid(), kind: "v", anchor: p.id, type: "video", title: a.name, mins: ["story","read"].includes(p.id) ? 3 : 2, domain: "", lo: "", tags: [] };
        setBlocks(bs => { const c = [...bs]; c.splice(di, 0, nb); return c; });
        window.toast(a.name + " added");
      } else if (p.kind === "mech") {
        const m = window.MECH[p.id];
        const nb = { uid: uid(), kind: "g", mech: p.id, type: m.type, title: m.name, mins: 2, domain: "", lo: "", tags: [] };
        setBlocks(bs => { const c = [...bs]; c.splice(di, 0, nb); return c; });
        window.toast(m.name + " added");
      }
    } else if (dd.kind === "move") {
      setBlocks(bs => { const c = [...bs]; const [m] = c.splice(dd.idx, 1); c.splice(di > dd.idx ? di - 1 : di, 0, m); return c; });
    }
    setDragIdx(null); setDropIdx(null); dragData.current = null;
  };

  const pickGame = (g) => {
    const m = window.TYPE_BY_ID[g.type];
    const nb = { uid: uid(), kind: "g", mech: g.type, type: g.type, title: g.name, mins: 2, gameId: g.id, domain: "", lo: "", tags: [] };
    const di = pendingPos.current ?? blocks.length;
    setBlocks(bs => { const c = [...bs]; c.splice(di, 0, nb); return c; });
    setPicker(false); window.toast("Game referenced into session");
  };

  const dropIndicator = (i) => dropIdx === i && (
    horizontal
      ? <div style={{ width: 3, alignSelf: "stretch", background: "var(--pri)", borderRadius: 99, boxShadow: "0 0 0 4px var(--pri-soft)" }}></div>
      : <div style={{ height: 3, background: "var(--pri)", borderRadius: 99, boxShadow: "0 0 0 4px var(--pri-soft)", margin: "1px 0" }}></div>
  );

  // palette anchor + game lists (anchors relevant to subject framework)
  const anchorList = Object.entries(window.ANCHORS);
  const mechList = Object.entries(window.MECH);

  return (
    <div className="page-anim" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* header */}
      <div style={{ borderBottom: "1px solid var(--hair)", background: "var(--surface)", padding: "12px 26px", display: "flex", alignItems: "center", gap: 16 }}>
        <button className="btn btn-ghost btn-sm" onClick={onExit}><window.IcChevL style={{ width: 15, height: 15 }} />Back</button>
        <div style={{ width: 1, height: 22, background: "var(--hair)" }}></div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>{meta.title || "Untitled Session"}</div>
          <div className="dim" style={{ fontSize: 11.5, display: "flex", alignItems: "center", gap: 6 }}>
            <window.SubjectChip subject={meta.subject} sm /> {meta.level}{meta.week ? " · " + meta.week : ""} · {meta.session}
            <span className="chip" style={{ height: 17, fontSize: 10, background: meta.type === "Revision" ? "var(--st-sched-bg)" : "var(--st-approve-bg)", color: meta.type === "Revision" ? "var(--st-sched)" : "var(--st-approve)" }}>{meta.type}</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, margin: "0 auto" }}>
          {STEPS.map((s, i) => (
            <React.Fragment key={s.n}>
              <button onClick={() => setStep(s.n)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", borderRadius: 99, border: 0,
                background: step === s.n ? "var(--pri-soft)" : "transparent", color: step === s.n ? "var(--pri-ink)" : "var(--ink-3)", fontWeight: 650, fontSize: 12.5 }}>
                <span className="mono" style={{ width: 18, height: 18, borderRadius: 99, display: "grid", placeItems: "center", fontSize: 10.5,
                  background: step > s.n ? "var(--good)" : step === s.n ? "var(--pri)" : "var(--surface-3)", color: step >= s.n ? "#fff" : "var(--ink-3)" }}>{step > s.n ? "✓" : s.n}</span>{s.label}
              </button>
              {i < STEPS.length - 1 && <div style={{ width: 20, height: 1.5, background: "var(--hair-2)" }}></div>}
            </React.Fragment>
          ))}
        </div>
        <button className="btn btn-pri btn-sm" onClick={() => window.toast("Saved as draft")}>Save draft</button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
        {/* STEP 1 — setup */}
        {step === 1 && (
          <div className="page" style={{ maxWidth: 720 }}>
            <h1 style={{ fontSize: 19, fontWeight: 740, marginBottom: 4 }}>Lesson / Session setup</h1>
            <p className="muted" style={{ fontSize: 13, marginBottom: 22 }}>One Lesson Module = one 20–25 minute daily session. Place it by Subject and Level — the Levels available change with the chosen subject.</p>
            <div className="card card-pad">
              <div className="field"><label>Lesson / Session Name</label><input className="inp" value={meta.title} onChange={(e) => setMeta({ ...meta, title: e.target.value })} placeholder="e.g. Numbers 1 to 10" /></div>
              <div className="row-2">
                <div className="field"><label>Subject</label><select className="sel" value={meta.subject} onChange={(e) => { const sub = e.target.value; const o = window.levelsForSubject(sub); setMeta(m => ({ ...m, subject: sub, level: o.includes(m.level) ? m.level : o[o.length - 1] })); }}><option>Maths</option><option>English</option><option>Tamil</option></select></div>
                <div className="field"><label>Level</label><select className="sel" value={meta.level} onChange={(e) => setMeta({ ...meta, level: e.target.value })}>{window.levelsForSubject(meta.subject).map(l => <option key={l}>{l}</option>)}</select></div>
              </div>
              <div className="row-2">
                <div className="field"><label>Lesson / Session</label><select className="sel" value={meta.session} onChange={(e) => setMeta({ ...meta, session: e.target.value })}><option>Session 1</option><option>Session 2</option><option>Session 3</option></select></div>
                <div className="field"><label>Lesson / Session type</label><select className="sel" value={meta.type} onChange={(e) => setMeta({ ...meta, type: e.target.value })}><option>Teaching</option><option>Revision</option></select></div>
              </div>
              <div className="row-2">
                <div className="field"><label>Topic / Week <span className="hint">optional</span></label><input className="inp" value={meta.week} onChange={(e) => setMeta({ ...meta, week: e.target.value })} placeholder="e.g. Week 1" /></div>
                <div className="field"><label>Theme <span className="hint">optional</span></label><input className="inp" value={meta.theme} onChange={(e) => setMeta({ ...meta, theme: e.target.value })} placeholder="e.g. Numbers 1–9" /></div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 18 }}><button className="btn btn-pri btn-lg" onClick={() => setStep(2)}>Next: Build Sequence<window.IcArrowR style={{ width: 16, height: 16 }} /></button></div>
          </div>
        )}

        {/* STEP 2 — canvas */}
        {step === 2 && (
          <div style={{ display: "grid", gridTemplateColumns: "248px 1fr 280px", height: "100%" }}>
            {/* palette */}
            <div style={{ borderRight: "1px solid var(--hair)", padding: "16px 14px", overflowY: "auto", background: "var(--surface-2)" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", letterSpacing: "0.03em", marginBottom: 9, display: "flex", alignItems: "center", gap: 6 }}><window.IcVideo style={{ width: 13, height: 13 }} />ANCHOR ACTIVITIES</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {anchorList.map(([id, a]) => <PaletteEntry key={id} label={a.name} icon={window[a.icon]} color={a.color} onDragStart={onPaletteDragStart} payload={{ kind: "anchor", id }} />)}
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", letterSpacing: "0.03em", margin: "18px 0 9px", display: "flex", alignItems: "center", gap: 6 }}><window.IcGame style={{ width: 13, height: 13 }} />GAMES</div>
              <div style={{ marginBottom: 8 }}>
                <PaletteEntry label="Browse Repository…" desc="reference a published game" icon={window.IcRepo} color="var(--pri)" onDragStart={onPaletteDragStart} payload={{ kind: "game-picker" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {mechList.map(([id, m]) => <PaletteEntry key={id} label={m.name} type={m.type} isGame onDragStart={onPaletteDragStart} payload={{ kind: "mech", id }} />)}
              </div>
            </div>

            {/* canvas */}
            <div style={{ overflowY: "auto", padding: "20px 26px", backgroundImage: "radial-gradient(var(--hair) 0.8px, transparent 0.8px)", backgroundSize: "16px 16px", backgroundColor: "var(--paper)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 15 }}>
                <h2 style={{ fontSize: 16, fontWeight: 720, margin: 0 }}>Sequence the session</h2>
                <span className="chip mono">{blocks.length} blocks</span>
                {meta.theme && <span className="chip" style={{ background: "var(--pri-soft)", color: "var(--pri-ink)" }}>{meta.theme}</span>}
                <span className="dim" style={{ fontSize: 12, marginLeft: "auto" }}>Drag to reorder · drop palette items to add</span>
              </div>
              <div onDragOver={onZoneDragOver} onDrop={onZoneDrop} onDragLeave={onZoneDragLeave}
                style={{ display: "flex", flexDirection: horizontal ? "row" : "column", flexWrap: horizontal ? "wrap" : "nowrap",
                         gap: horizontal ? 12 : 0, alignItems: horizontal ? "flex-start" : "stretch", minHeight: 220, borderRadius: "var(--r-lg)" }}>
                {blocks.length === 0 && (
                  <div style={{ flex: 1, border: "1.5px dashed var(--hair-2)", borderRadius: "var(--r-lg)", padding: "44px 20px", textAlign: "center", color: "var(--ink-3)" }}>
                    <window.IcLayers style={{ width: 28, height: 28, margin: "0 auto 10px", display: "block", color: "var(--ink-4)" }} />
                    <div style={{ fontSize: 13.5, fontWeight: 600 }}>Drag anchors & games here</div>
                    <div style={{ fontSize: 12, marginTop: 3 }}>Build a 20–25 min mix following the cycle: anchor → its games → next anchor.</div>
                  </div>
                )}
                {blocks.map((blk, i) => (
                  <React.Fragment key={blk.uid}>
                    {dropIndicator(i)}
                    <div data-blk style={{ display: horizontal ? "block" : "flex", flexDirection: "column", position: "relative" }}>
                      {!horizontal && i > 0 && <div style={{ width: 2, height: 12, background: "var(--hair-2)", marginLeft: 23 }}></div>}
                      <CanvasBlock blk={blk} idx={i} horizontal={horizontal} framework={framework} dragging={dragIdx === i}
                        onDragStart={onBlockDragStart} onConfig={(idx) => setConfig(idx)}
                        onRemove={(idx) => { setBlocks(bs => bs.filter((_, x) => x !== idx)); window.toast("Block removed"); }} />
                    </div>
                  </React.Fragment>
                ))}
                {dropIndicator(blocks.length)}
              </div>
            </div>

            {/* meter rail */}
            <div style={{ borderLeft: "1px solid var(--hair)", padding: "16px 14px", overflowY: "auto", background: "var(--surface-2)" }}>
              <SessionMeter blocks={blocks} framework={framework} />
              <div style={{ display: "flex", gap: 8, marginTop: 13 }}>
                <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => setStep(1)}><window.IcChevL style={{ width: 14, height: 14 }} />Setup</button>
                <button className="btn btn-pri btn-sm" style={{ flex: 1 }} onClick={() => setStep(3)}>Preview<window.IcArrowR style={{ width: 14, height: 14 }} /></button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 — preview */}
        {step === 3 && (
          <div className="page" style={{ maxWidth: 780 }}>
            <h1 style={{ fontSize: 19, fontWeight: 740, marginBottom: 4 }}>Preview &amp; submit</h1>
            <p className="muted" style={{ fontSize: 13, marginBottom: 20 }}>Review the learner's path and competency coverage, then submit to the Program Team.</p>
            <div className="card" style={{ overflow: "hidden", marginBottom: 18 }}>
              <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--hair)", display: "flex", alignItems: "center", gap: 12 }}>
                <div><div style={{ fontSize: 16, fontWeight: 720 }}>{meta.title}</div><div className="dim" style={{ fontSize: 12, marginTop: 2 }}>{meta.subject} · {meta.level}{meta.week ? " · " + meta.week : ""} · {meta.session} ({meta.type})</div></div>
                <div style={{ marginLeft: "auto", textAlign: "right", flexShrink: 0 }}><div className="mono" style={{ fontSize: 22, fontWeight: 740, color: totalMins > 25 ? "var(--warn)" : "var(--good)" }}>{totalMins}m</div><div className="dim" style={{ fontSize: 11 }}>{blocks.length} blocks</div></div>
              </div>
            </div>
            <div className="dim" style={{ fontSize: 11.5, fontWeight: 700, marginBottom: 10, letterSpacing: "0.02em" }}>LEARNER PATH</div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {blocks.map((blk, i) => { const v = blkVisual(blk); return (
                <div key={blk.uid}>
                  {i > 0 && <div style={{ width: 2, height: 12, background: "var(--hair-2)", marginLeft: 33 }}></div>}
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 13, padding: "11px 14px", background: "var(--surface)", border: "1px solid var(--hair)", borderRadius: "var(--r-md)" }}>
                    <span className="mono dim" style={{ width: 20, fontSize: 12, paddingTop: 8 }}>{String(i+1).padStart(2,"0")}</span>
                    <div style={{ width: 34, height: 34, borderRadius: 8, flexShrink: 0, background: v.isGame ? "var(--pri-soft)" : v.color.replace(")"," / 0.10)"), color: v.isGame ? "var(--pri)" : v.color, display: "grid", placeItems: "center" }}>{v.isGame ? <window.GameGlyph typeId={v.type} size={18} color="var(--pri)" /> : React.createElement(v.icon, { style: { width: 18, height: 18 } })}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 640 }}>{blk.title}</div>
                      <div className="dim" style={{ fontSize: 11.5 }}>{v.label}{blk.domain ? " · " + blk.domain : ""}{blk.lo ? " — " + blk.lo : ""}</div>
                      {blk.tags && blk.tags.length > 0 && <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 5 }}>{blk.tags.map((t, x) => <span key={x} className="lvl" style={{ fontSize: 9.5, padding: "1px 5px", background: "var(--pri-soft)", color: "var(--pri-ink)", border: "1px solid var(--pri-soft-2)" }}>{t}</span>)}</div>}
                    </div>
                    <span className="chip mono">{blk.mins}m</span>
                  </div>
                </div>
              ); })}
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "flex-end" }}>
              <button className="btn btn-lg" onClick={() => setStep(2)}><window.IcChevL style={{ width: 16, height: 16 }} />Back</button>
              <button className="btn btn-lg" onClick={() => window.toast("Saved as draft")}>Save draft</button>
              <button className="btn btn-pri btn-lg" onClick={() => { window.toast("Submitted to Program Team for review"); onExit(); }}><window.IcCheck style={{ width: 16, height: 16 }} />Submit for review</button>
            </div>
          </div>
        )}
      </div>

      {picker && <GamePicker onClose={() => setPicker(false)} onPick={pickGame} />}
      {config !== null && <BlockConfig blk={blocks[config]} framework={framework} meta={meta} onClose={() => setConfig(null)} onSave={(nb) => { setBlocks(bs => bs.map((b, i) => i === config ? nb : b)); setConfig(null); window.toast("Activity updated"); }} />}
    </div>
  );
}

window.ModuleBuilder = ModuleBuilder;
