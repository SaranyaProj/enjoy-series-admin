/* game-builder.jsx — "Add Question / Content" wizard.
   You are NOT building a new game engine — you pick an existing game type and add a
   new question/content item to it.
   Steps: Select Game Type → Question Details → Content & Difficulty Levels
   → Media & Game Settings → Preview & Publish.
   (Adaptive difficulty is a lesson/module-level setting and is configured there,
    not at the question level.) */
const { useState: useStateG } = React;

const GB_STEPS = ["Select Game Type", "Question Details", "Content & Difficulty", "Media & Settings", "Preview & Publish"];
/* content-level difficulty terminology — L1/L2/L3 surfaced as Easy/Medium/Hard (B5) */
const DIFF_LABELS = window.DIFFICULTY || ["Easy", "Medium", "Hard", "Harder", "Hardest"];

function TypeCard({ t, selected, onSelect }) {
  const vcount = window.variantSpec(t.id).variants.length;
  return (
    <button onClick={() => onSelect(t)} style={{ textAlign: "left", padding: 14, borderRadius: "var(--r-md)", background: "var(--surface)",
      border: selected ? "1.5px solid var(--pri)" : "1px solid var(--hair)", boxShadow: selected ? "0 0 0 3px var(--pri-soft)" : "var(--sh-1)",
      transition: "border-color .12s, box-shadow .12s, transform .1s", position: "relative" }}
      onMouseEnter={(e) => { if (!selected) e.currentTarget.style.borderColor = "var(--hair-2)"; }}
      onMouseLeave={(e) => { if (!selected) e.currentTarget.style.borderColor = "var(--hair)"; }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 9 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--surface-2)", border: "1px solid var(--hair)", display: "grid", placeItems: "center" }}>
          {React.createElement(window[t.icon], { style: { width: 22, height: 22, color: selected ? "var(--pri)" : "var(--ink-2)" } })}
        </div>
        <span className="mono dim" style={{ fontSize: 11, marginLeft: "auto" }}>{t.n}</span>
        {selected && <span style={{ position: "absolute", top: 12, right: 12, width: 18, height: 18, borderRadius: 99, background: "var(--pri)", display: "grid", placeItems: "center" }}><window.IcCheck style={{ width: 11, height: 11, color: "#fff" }} /></span>}
      </div>
      <div style={{ fontSize: 13.5, fontWeight: 680, letterSpacing: "-0.01em", marginBottom: 4 }}>{t.name}</div>
      <div className="dim" style={{ fontSize: 11.5, lineHeight: 1.4, marginBottom: 10, minHeight: 32 }}>{t.mech}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, alignItems: "center" }}>
        {t.subjects.map(s => <window.SubjectChip key={s} subject={s} sm />)}
        <span className="lvl" style={{ marginLeft: "auto" }}>{vcount} variants</span>
      </div>
    </button>
  );
}

/* render a sample authoring input for a variant field, based on its `kind` (Step 3). */
function FieldCell({ f }) {
  if (f.kind === "image")  return <button className="btn btn-sm" style={{ height: 30, boxShadow: "none" }}><window.IcModule style={{ width: 13, height: 13 }} />Pick image</button>;
  if (f.kind === "audio")  return <button className="btn btn-sm" style={{ height: 30, boxShadow: "none" }}><window.IcAudio style={{ width: 13, height: 13 }} />Add audio</button>;
  if (f.kind === "bool")   return <input type="checkbox" defaultChecked={false} />;
  if (f.kind === "choice") return <select className="sel" style={{ height: 30, minWidth: 84 }}>{(f.opts || []).map(o => <option key={o}>{o}</option>)}</select>;
  if (f.kind === "number") return <input className="inp mono" style={{ height: 30, width: 76 }} placeholder="0" />;
  return <input className="inp" style={{ height: 30 }} placeholder="Type…" />;
}

function GameBuilder({ onExit }) {
  const [step, setStep] = useStateG(1);
  const [type, setType] = useStateG(null);
  const [filter, setFilter] = useStateG("All");
  const [meta, setMeta] = useStateG({ name: "", level: "Level 1", subject: "", variant: null, size: null });
  const spec = type ? window.variantSpec(type.id) : null;
  const variant = spec ? (spec.variants.find(v => v.id === meta.variant) || spec.variants[0]) : null;
  const [levels, setLevels] = useStateG([{ diff: "Easy", min: 10, count: 8 }, { diff: "Medium", min: 10, count: 6 }, { diff: "Hard", min: 10, count: 4 }]);
  const [openLvl, setOpenLvl] = useStateG(0);

  const types = window.GAME_TYPES.filter(t => filter === "All" || t.subjects.includes(filter));
  const levelOpts = window.levelsForSubject(meta.subject || "Maths");

  const next = () => setStep(s => Math.min(GB_STEPS.length, s + 1));
  const prev = () => setStep(s => Math.max(1, s - 1));

  return (
    <div className="page-anim" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* header */}
      <div style={{ borderBottom: "1px solid var(--hair)", background: "var(--surface)", padding: "13px 28px", display: "flex", alignItems: "center", gap: 18 }}>
        <button className="btn btn-ghost btn-sm" onClick={onExit}><window.IcChevL style={{ width: 15, height: 15 }} />Repository</button>
        <div style={{ width: 1, height: 22, background: "var(--hair)" }}></div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {type && <div style={{ width: 30, height: 30, borderRadius: 8, background: "var(--pri-soft)", display: "grid", placeItems: "center" }}>{React.createElement(window[type.icon], { style: { width: 17, height: 17, color: "var(--pri)" } })}</div>}
          <div><div style={{ fontSize: 14, fontWeight: 700 }}>{meta.name || "New Game"}</div><div className="dim" style={{ fontSize: 11.5 }}>{type ? (type.name + (variant ? " · " + variant.name : "") + (meta.size ? " · " + meta.size + " " + spec.unit + "/round" : "")) : "Choose a game type"}</div></div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, margin: "0 auto" }}>
          {GB_STEPS.map((label, i) => (
            <React.Fragment key={i}>
              <button onClick={() => (type || i === 0) && setStep(i + 1)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", borderRadius: 99, border: 0,
                background: step === i + 1 ? "var(--pri-soft)" : "transparent", color: step === i + 1 ? "var(--pri-ink)" : "var(--ink-3)", fontWeight: 650, fontSize: 12 }}>
                <span className="mono" style={{ width: 18, height: 18, borderRadius: 99, display: "grid", placeItems: "center", fontSize: 10.5,
                  background: step > i + 1 ? "var(--good)" : step === i + 1 ? "var(--pri)" : "var(--surface-3)", color: step >= i + 1 ? "#fff" : "var(--ink-3)" }}>{step > i + 1 ? "✓" : i + 1}</span>
                <span style={{ display: window.innerWidth < 1280 ? "none" : "inline" }}>{label}</span>
              </button>
              {i < GB_STEPS.length - 1 && <div style={{ width: 14, height: 1.5, background: "var(--hair-2)" }}></div>}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
        {/* STEP 1 — Choose Game Type */}
        {step === 1 && (
          <div className="page" style={{ maxWidth: 1000 }}>
            <div className="page-head" style={{ marginBottom: 12 }}>
              <div><h1 style={{ fontSize: 19 }}>Select a game type</h1><p>Pick the existing game type you want to add a new question to. You're adding content to a proven interaction — not building a new game engine. The type sets the content-entry template.</p></div>
              <div className="actions"><div className="seg">{["All","Maths","English","Tamil"].map(s => <button key={s} className={filter === s ? "on" : ""} onClick={() => setFilter(s)}>{s}</button>)}</div></div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: "var(--r-md)", background: "var(--pri-soft)", marginBottom: 16 }}>
              <window.IcSparkle style={{ width: 16, height: 16, color: "var(--pri)", flexShrink: 0 }} />
              <div style={{ fontSize: 12, color: "var(--pri-ink)" }}>Flow: <b>Game Type → Question Details → Content → Media → Publish.</b> Each game type can hold many questions; you're adding one here.</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(232px, 1fr))", gap: 12 }}>
              {types.map(t => <TypeCard key={t.id} t={t} selected={type && type.id === t.id} onSelect={(tt) => { const sp = window.variantSpec(tt.id); setType(tt); setMeta(m => ({ ...m, subject: tt.subjects[0], level: "Level 1", variant: sp.variants[0].id, size: sp.defaultSize })); }} />)}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
              <button className="btn btn-pri btn-lg" disabled={!type} onClick={next}>Next: Question Details<window.IcArrowR style={{ width: 16, height: 16 }} /></button>
            </div>
          </div>
        )}

        {/* STEP 2 — Game Metadata */}
        {step === 2 && type && (
          <div className="page" style={{ maxWidth: 680 }}>
            <div className="page-head" style={{ marginBottom: 16 }}>
              <div><h1 style={{ fontSize: 19 }}>Question details</h1><p>Name this question and place it in the curriculum. Subject decides the available Levels (Maths 1–5, English &amp; Tamil 1–3), and the variant decides what content the question uses.</p></div>
            </div>
            <div className="card card-pad">
              <div className="field"><label>Question / content title</label><input className="inp" placeholder={"e.g. Count the Mangoes"} value={meta.name} onChange={(e) => setMeta({ ...meta, name: e.target.value })} autoFocus /></div>
              <div className="row-2">
                <div className="field"><label>Subject</label><select className="sel" value={meta.subject} onChange={(e) => { const sub = e.target.value; const opts = window.levelsForSubject(sub); setMeta(m => ({ ...m, subject: sub, level: opts.includes(m.level) ? m.level : opts[opts.length - 1] })); }}>{type.subjects.map(s => <option key={s}>{s}</option>)}</select></div>
                <div className="field"><label>Level</label><select className="sel" value={meta.level} onChange={(e) => setMeta({ ...meta, level: e.target.value })}>{levelOpts.map(l => <option key={l}>{l}</option>)}</select></div>
              </div>

              {/* variant selector — drives the content form */}
              <div className="field">
                <label>Variant <span className="hint">optional — only if this game type offers more than one content style</span></label>
                <div style={{ display: "flex", gap: 8, padding: "8px 11px", borderRadius: "var(--r-sm)", background: "var(--surface-2)", border: "1px solid var(--hair)", fontSize: 11.5, color: "var(--ink-3)", marginBottom: 9, lineHeight: 1.45 }}>
                  <window.IcSparkle style={{ width: 14, height: 14, color: "var(--pri)", flexShrink: 0, marginTop: 1 }} />
                  <span>A <b>variant</b> is the same game played with different content — e.g. <i>Image → Text</i> vs <i>Audio → Image</i>. It changes what you upload and how the content form below looks. Pick the one that matches the content you have.</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 8 }}>
                  {spec.variants.map(v => {
                    const on = variant.id === v.id;
                    return (
                      <button key={v.id} onClick={() => setMeta(m => ({ ...m, variant: v.id }))} style={{ textAlign: "left", padding: "9px 11px", borderRadius: "var(--r-sm)", border: on ? "1.5px solid var(--pri)" : "1px solid var(--hair)", background: on ? "var(--pri-soft)" : "var(--surface)", boxShadow: on ? "0 0 0 3px var(--pri-soft)" : "none" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 12.5, fontWeight: 680, color: on ? "var(--pri-ink)" : "var(--ink)" }}>{v.name}</span>
                          {on && <window.IcCheck style={{ width: 13, height: 13, color: "var(--pri)", marginLeft: "auto" }} />}
                        </div>
                        <div className="dim" style={{ fontSize: 10.5, marginTop: 2, lineHeight: 1.3 }}>{v.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* questions per round (B4 — was "Interaction size") */}
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Questions per round <span className="hint">how many {spec.unit} appear in each round of play</span></label>
                <div className="seg" style={{ width: "fit-content" }}>
                  {spec.sizes.map(sz => <button key={sz} className={meta.size === sz ? "on" : ""} onClick={() => setMeta(m => ({ ...m, size: sz }))}>{sz} {spec.unit}</button>)}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
              <button className="btn btn-lg" onClick={prev}><window.IcChevL style={{ width: 16, height: 16 }} />Back</button>
              <button className="btn btn-pri btn-lg" disabled={!meta.name} onClick={next}>Next: Content &amp; Difficulty<window.IcArrowR style={{ width: 16, height: 16 }} /></button>
            </div>
          </div>
        )}

        {/* STEP 3 — Content Levels (Difficulty Easy/Medium/Hard) */}
        {step === 3 && (
          <div className="page" style={{ maxWidth: 880 }}>
            <div className="page-head" style={{ marginBottom: 12 }}>
              <div><h1 style={{ fontSize: 19 }}>Content &amp; difficulty levels</h1><p>Add the actual question content, grouped into Easy / Medium / Hard difficulty levels.</p></div>
              <div className="actions"><button className="btn" onClick={() => setLevels(ls => [...ls, { diff: DIFF_LABELS[Math.min(ls.length, DIFF_LABELS.length - 1)], min: 10, count: 0 }])}><window.IcPlus style={{ width: 15, height: 15 }} />Add difficulty</button></div>
            </div>

            {/* B5 — explain WHY Easy/Medium/Hard exist, WHAT to add, HOW they're used */}
            <div className="card" style={{ padding: "13px 15px", marginBottom: 14, background: "var(--surface)", borderColor: "var(--hair)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <window.IcLayers style={{ width: 15, height: 15, color: "var(--pri)" }} />
                <b style={{ fontSize: 13, fontWeight: 700 }}>Why Easy / Medium / Hard?</b>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                {[
                  ["Why they exist", "One game must suit a wide range of abilities. Difficulty levels let a single game stretch from a beginner to a confident learner without building three separate games."],
                  ["What you add", "The same kind of content at increasing challenge — e.g. counts 1–5 (Easy), 6–10 (Medium), 11–20 (Hard). Aim for the minimum items shown in each level for enough variety."],
                  ["How they're used", "During play the adaptive engine starts a child at Easy and moves them up or down based on performance — so each learner sees the right level. The promotion/demotion rules live in the lesson module, not here."],
                ].map(([h, b]) => (
                  <div key={h} style={{ padding: "10px 12px", borderRadius: "var(--r-sm)", background: "var(--surface-2)", border: "1px solid var(--hair)" }}>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: "var(--pri-ink)", marginBottom: 4 }}>{h}</div>
                    <div style={{ fontSize: 11.5, color: "var(--ink-3)", lineHeight: 1.5 }}>{b}</div>
                  </div>
                ))}
              </div>
            </div>
            {variant && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: "var(--r-md)", background: "var(--pri-soft)", marginBottom: 12 }}>
                <window.IcSparkle style={{ width: 16, height: 16, color: "var(--pri)", flexShrink: 0 }} />
                <div style={{ fontSize: 12, color: "var(--pri-ink)" }}>
                  Form adapts to <b>{variant.name}</b> — {variant.desc.toLowerCase()}. Each round shows <b>{meta.size} {spec.unit}</b>. The columns below come from this variant.
                </div>
                <div style={{ marginLeft: "auto", display: "flex", gap: 5 }}>{variant.fields.map(f => <span key={f.k} className="chip" style={{ height: 22, fontSize: 10.5 }}>{f.label}</span>)}</div>
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {levels.map((lv, i) => {
                const fields = variant ? variant.fields : window.variantSpec("dragdrop").variants[0].fields;
                const sampleRows = Math.max(2, meta.size || 2);
                const open = openLvl === i;
                const ok = lv.count >= lv.min;
                return (
                  <div key={i} className="card" style={{ overflow: "hidden" }}>
                    <button onClick={() => setOpenLvl(open ? -1 : i)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", border: 0, background: "transparent", textAlign: "left" }}>
                      <window.IcChevR style={{ width: 16, height: 16, color: "var(--ink-3)", transform: open ? "rotate(90deg)" : "none", transition: "transform .15s" }} />
                      <span className="lvl" style={{ fontSize: 11.5, padding: "3px 9px" }}>{lv.diff}</span>
                      <div><div style={{ fontSize: 14, fontWeight: 660 }}>Difficulty Level: {lv.diff}</div></div>
                      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
                        <span className="chip mono" style={{ background: ok ? "var(--st-approve-bg)" : "var(--st-review-bg)", color: ok ? "var(--st-approve)" : "var(--st-review)" }}>{lv.count} / {lv.min} items</span>
                      </div>
                    </button>
                    {open && (
                      <div style={{ borderTop: "1px solid var(--hair)", padding: 16, background: "var(--surface-2)" }}>
                        {!ok && <div style={{ marginBottom: 12, padding: "8px 11px", borderRadius: 8, background: "var(--st-review-bg)", color: "var(--st-review)", fontSize: 11.5, fontWeight: 600 }}>Below the minimum of {lv.min} items — add more for variety.</div>}
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5, background: "var(--surface)", borderRadius: "var(--r-sm)", overflow: "hidden", border: "1px solid var(--hair)" }}>
                          <thead><tr style={{ textAlign: "left", color: "var(--ink-3)", fontSize: 11 }}>{fields.map((f, x) => <th key={x} style={{ padding: "9px 12px", fontWeight: 650, background: "var(--surface-2)" }}>{f.label}</th>)}<th style={{ width: 40, background: "var(--surface-2)" }}></th></tr></thead>
                          <tbody>
                            {Array.from({ length: sampleRows }).map((_, x) => (
                              <tr key={x} style={{ borderTop: "1px solid var(--hair)" }}>
                                {fields.map((f, y) => <td key={y} style={{ padding: "7px 12px" }}><FieldCell f={f} /></td>)}
                                <td style={{ padding: "4px 8px" }}><button className="icon-btn" style={{ width: 26, height: 26, border: 0, background: "transparent", boxShadow: "none", color: "var(--ink-4)" }}><window.IcTrash style={{ width: 14, height: 14 }} /></button></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                          <button className="btn btn-sm" onClick={() => setLevels(ls => ls.map((l, ix) => ix === i ? { ...l, count: l.count + 1 } : l))}><window.IcPlus style={{ width: 14, height: 14 }} />Add item</button>
                          <button className="btn btn-sm"><window.IcUpload style={{ width: 14, height: 14 }} />Bulk upload</button>
                          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 7 }}>
                            <span className="dim" style={{ fontSize: 11.5 }}>Min items</span>
                            <input className="inp mono" style={{ width: 56, height: 30 }} value={lv.min} onChange={(e) => setLevels(ls => ls.map((l, ix) => ix === i ? { ...l, min: +e.target.value || 0 } : l))} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
              <button className="btn btn-lg" onClick={prev}><window.IcChevL style={{ width: 16, height: 16 }} />Back</button>
              <button className="btn btn-pri btn-lg" onClick={next}>Next: Media &amp; Settings<window.IcArrowR style={{ width: 16, height: 16 }} /></button>
            </div>
          </div>
        )}

        {/* STEP 4 — Media & Game Settings */}
        {step === 4 && <Appearance levels={levels} onPrev={prev} onNext={next} />}

        {/* STEP 5 — Preview & Publish */}
        {step === 5 && <PreviewGame meta={meta} type={type} variant={variant} spec={spec} levels={levels} onPrev={prev} onSave={() => { window.toast("Question published to Repository"); onExit(); }} />}
      </div>
    </div>
  );
}

function Appearance({ levels, onPrev, onNext }) {
  const [theme, setTheme] = useStateG("Meadow");
  const themes = [["Meadow", "var(--tamil)"], ["Ocean", "var(--maths)"], ["Sunset", "var(--english)"], ["Berry", "var(--st-sched)"]];
  return (
    <div className="page" style={{ maxWidth: 760 }}>
      <div className="page-head" style={{ marginBottom: 12 }}>
        <div><h1 style={{ fontSize: 19 }}>Media &amp; game settings</h1><p>Game-specific polish — theme, points, hints and the audio that makes this content come alive.</p></div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: "var(--r-md)", background: "var(--st-review-bg)", marginBottom: 14 }}>
        <window.IcSliders style={{ width: 16, height: 16, color: "var(--st-review)", flexShrink: 0 }} />
        <div style={{ fontSize: 12, color: "var(--st-review)" }}>Looking for the <b>adaptive difficulty engine</b>? That's a lesson-level setting — configure promotion/demotion rules when you build a Lesson Module or Learning Journey, not per question.</div>
      </div>
      <div className="card card-pad" style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}><window.IcPalette style={{ width: 16, height: 16, color: "var(--pri)" }} />Visual theme</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
          {themes.map(([name, c]) => (
            <button key={name} onClick={() => setTheme(name)} style={{ border: theme === name ? "1.5px solid var(--pri)" : "1px solid var(--hair)", borderRadius: "var(--r-md)", overflow: "hidden", background: "var(--surface)", boxShadow: theme === name ? "0 0 0 3px var(--pri-soft)" : "none" }}>
              <div style={{ height: 56, background: `linear-gradient(135deg, ${c.replace(")"," / 0.18)")}, ${c.replace(")"," / 0.04)")})`, display: "grid", placeItems: "center" }}><div style={{ width: 24, height: 24, borderRadius: 99, background: c }}></div></div>
              <div style={{ padding: "7px 0", fontSize: 12, fontWeight: 600 }}>{name}</div>
            </button>
          ))}
        </div>
      </div>
      <div className="card card-pad" style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}><window.IcTarget style={{ width: 16, height: 16, color: "var(--pri)" }} />Scoring — points per correct answer</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {levels.map((lv, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 11px", border: "1px solid var(--hair)", borderRadius: "var(--r-sm)", background: "var(--surface-2)" }}>
              <span className="lvl">{lv.diff}</span><input className="inp mono" style={{ width: 50, height: 30 }} defaultValue={i + 1} /><span className="dim" style={{ fontSize: 11.5 }}>pts</span>
            </div>
          ))}
          <div style={{ display: "flex", gap: 14, alignItems: "center", marginLeft: "auto" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, fontWeight: 550 }}><input type="checkbox" defaultChecked />Time bonus</label>
            <label style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, fontWeight: 550 }}><input type="checkbox" defaultChecked />Streak bonus</label>
          </div>
        </div>
      </div>
      <div className="row-2">
        <div className="card card-pad">
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Hints</div>
          <div className="field"><label>Wrong attempts before hint</label><input className="inp mono" defaultValue="2" /></div>
          <div className="field" style={{ marginBottom: 0 }}><label>Max hints per session</label><input className="inp mono" defaultValue="3" /></div>
        </div>
        <div className="card card-pad">
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}><window.IcAudio style={{ width: 16, height: 16, color: "var(--pri)" }} />Audio</div>
          {["Instructional (on load)","Content (on tap)","Celebration sounds"].map(a => (
            <label key={a} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 12.5, fontWeight: 550, padding: "6px 0" }}><input type="checkbox" defaultChecked />{a}</label>
          ))}
          <button className="btn btn-sm" style={{ marginTop: 8 }}><window.IcSparkle style={{ width: 14, height: 14 }} />Auto-generate audio</button>
        </div>
      </div>
      <div className="card card-pad" style={{ marginTop: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Data capture <span className="dim" style={{ fontWeight: 500, fontSize: 12 }}>· all on by default</span></div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>{["Score","Highest difficulty","Per-difficulty stats","Time per item","Adaptive path"].map(d => <span key={d} className="chip" style={{ background: "var(--pri-soft)", color: "var(--pri-ink)" }}><window.IcCheck style={{ width: 12, height: 12 }} />{d}</span>)}</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
        <button className="btn btn-lg" onClick={onPrev}><window.IcChevL style={{ width: 16, height: 16 }} />Back</button>
        <button className="btn btn-pri btn-lg" onClick={onNext}>Next: Preview &amp; Publish<window.IcArrowR style={{ width: 16, height: 16 }} /></button>
      </div>
    </div>
  );
}

/* STEP 6 — student-facing preview before saving (B6). Lets the admin validate
   layout, content, audio, scoring and difficulty progression. */
function PreviewGame({ meta, type, variant, spec, levels, onPrev, onSave }) {
  const [diffIdx, setDiffIdx] = useStateG(0);
  const s = window.SUBJECTS[meta.subject] || { color: "var(--pri)" };
  const cur = levels[Math.min(diffIdx, levels.length - 1)] || { diff: "Easy" };
  const round = meta.size || (spec ? spec.defaultSize : 4);
  const checks = ["Layout", "Content", "Audio", "Scoring behaviour", "Difficulty progression"];

  return (
    <div className="page" style={{ maxWidth: 880 }}>
      <div className="page-head" style={{ marginBottom: 16 }}>
        <div><h1 style={{ fontSize: 19 }}>Preview &amp; publish</h1><p>A realistic student-facing view of this question. Validate layout, content, audio, scoring and difficulty progression before publishing it to the repository.</p></div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 16, alignItems: "start" }}>
        {/* student device frame */}
        <div className="card" style={{ overflow: "hidden" }}>
          <div style={{ padding: "9px 14px", borderBottom: "1px solid var(--hair)", display: "flex", alignItems: "center", gap: 8, background: "var(--surface-2)" }}>
            <span style={{ display: "flex", gap: 5 }}><span style={{ width: 9, height: 9, borderRadius: 99, background: "var(--st-revise)" }}></span><span style={{ width: 9, height: 9, borderRadius: 99, background: "var(--st-review)" }}></span><span style={{ width: 9, height: 9, borderRadius: 99, background: "var(--st-approve)" }}></span></span>
            <span className="dim" style={{ fontSize: 11.5, fontWeight: 600, marginLeft: 4 }}>Student view · {meta.subject} · {meta.level}</span>
            <span className="chip mono" style={{ marginLeft: "auto", height: 20, fontSize: 10.5 }}>{cur.diff}</span>
          </div>
          <div style={{ padding: 22, background: `linear-gradient(135deg, ${s.color.replace(")", " / 0.10)")}, ${s.color.replace(")", " / 0.02)")})`, minHeight: 340 }}>
            {/* HUD */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}><window.IcTarget style={{ width: 16, height: 16, color: s.color }} /><b className="mono" style={{ fontSize: 15 }}>120</b><span className="dim" style={{ fontSize: 11 }}>pts</span></div>
              <div style={{ display: "flex", gap: 4, marginLeft: 4 }}>{[1,2,3].map(i => <window.IcCheckCircle key={i} style={{ width: 16, height: 16, color: i <= 2 ? s.color : "var(--hair-2)" }} />)}</div>
              <button className="btn btn-sm" style={{ marginLeft: "auto", background: "var(--surface)" }}><window.IcAudio style={{ width: 14, height: 14 }} />Play prompt</button>
            </div>
            <div style={{ textAlign: "center", fontSize: 15, fontWeight: 700, marginBottom: 18, color: "var(--ink)" }}>
              {type ? type.name : "Game"}{variant ? " — " + variant.name : ""}
            </div>
            {/* mock interaction tiles, count = questions per round */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
              {Array.from({ length: Math.min(round, 8) }).map((_, i) => (
                <div key={i} style={{ width: 78, height: 78, borderRadius: 16, background: "var(--surface)", border: "1.5px solid var(--hair)", display: "grid", placeItems: "center", boxShadow: "var(--sh-1)" }}>
                  {type ? <window.GameGlyph typeId={type.id} size={30} color={s.color} /> : <window.IcGame style={{ width: 30, height: 30, color: s.color }} />}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "center", marginTop: 22 }}>
              <button className="btn btn-pri">Check answer<window.IcCheck style={{ width: 15, height: 15 }} /></button>
            </div>
          </div>
        </div>

        {/* validation rail */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="card card-pad">
            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 11, letterSpacing: "0.01em" }}>DIFFICULTY PROGRESSION</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {levels.map((lv, i) => (
                <button key={i} onClick={() => setDiffIdx(i)} style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 10px", borderRadius: "var(--r-sm)", textAlign: "left",
                  border: diffIdx === i ? "1.5px solid var(--pri)" : "1px solid var(--hair)", background: diffIdx === i ? "var(--pri-soft)" : "var(--surface)" }}>
                  <span className="lvl">{lv.diff}</span>
                  <span style={{ fontSize: 12.5, fontWeight: 600 }}>Difficulty Level: {lv.diff}</span>
                  <span className="mono dim" style={{ fontSize: 11, marginLeft: "auto" }}>{lv.count} items</span>
                </button>
              ))}
            </div>
            <div className="dim" style={{ fontSize: 11, marginTop: 9 }}>Tap a difficulty to preview how that level looks to a student.</div>
          </div>
          <div className="card card-pad">
            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 11, letterSpacing: "0.01em" }}>VALIDATE BEFORE SAVING</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {checks.map(c => (
                <label key={c} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 12.5, fontWeight: 550 }}><input type="checkbox" defaultChecked />{c}</label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
        <button className="btn btn-lg" onClick={onPrev}><window.IcChevL style={{ width: 16, height: 16 }} />Back</button>
        <button className="btn btn-pri btn-lg" onClick={onSave}><window.IcCheck style={{ width: 16, height: 16 }} />Publish to Repository</button>
      </div>
    </div>
  );
}

window.GameBuilder = GameBuilder;
