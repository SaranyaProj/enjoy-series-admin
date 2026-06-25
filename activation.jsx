/* activation.jsx — Activation Workflow kanban board (Draft → … → Published) */
const { useState: useStateA } = React;

function WorkflowCard({ item, colCls, onAdvance }) {
  const s = window.SUBJECTS[item.subject];
  const kindIcon = item.kind === "Game" ? window.IcGame : item.kind === "Module" ? window.IcModule : window.IcJourney;
  return (
    <div className="card" style={{ padding: "11px 12px", boxShadow: "var(--sh-1)", cursor: "grab", transition: "box-shadow .12s, transform .1s" }} draggable
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = "var(--sh-2)"}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = "var(--sh-1)"}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <div style={{ width: 26, height: 26, borderRadius: 7, background: s.color.replace(")"," / 0.10)"), color: s.color, display: "grid", placeItems: "center", flexShrink: 0 }}>{React.createElement(kindIcon, { style: { width: 14, height: 14 } })}</div>
        <span style={{ fontSize: 10.5, fontWeight: 650, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.03em" }}>{item.kind}</span>
        <div style={{ marginLeft: "auto" }} onClick={(e) => e.stopPropagation()}><window.Menu items={[{ label: "Preview", icon: window.IcEye, onClick: () => {} }, { label: "Open", icon: window.IcEdit, onClick: () => {} }]} /></div>
      </div>
      <div style={{ fontSize: 13, fontWeight: 650, marginBottom: 8, letterSpacing: "-0.005em" }}>{item.title}</div>
      {item.note && <div style={{ fontSize: 11, color: "var(--st-revise)", background: "var(--st-revise-bg)", padding: "6px 8px", borderRadius: 6, marginBottom: 8, display: "flex", gap: 6 }}><window.IcMsg style={{ width: 13, height: 13, flexShrink: 0, marginTop: 1 }} />{item.note}</div>}
      {item.date && <div style={{ fontSize: 11, color: "var(--st-sched)", background: "var(--st-sched-bg)", padding: "5px 8px", borderRadius: 6, marginBottom: 8, display: "flex", gap: 6, alignItems: "center", fontWeight: 600 }}><window.IcClock style={{ width: 13, height: 13 }} />Publishes {item.date}</div>}
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <window.Avatar name={item.author} size={20} />
        <span className="dim" style={{ fontSize: 11 }}>{item.author}</span>
        <span className="dim" style={{ fontSize: 11, marginLeft: "auto" }}>{item.updated}</span>
      </div>
      {onAdvance && (
        <button className="btn btn-sm" style={{ width: "100%", justifyContent: "center", marginTop: 9, height: 28 }} onClick={onAdvance}>
          {onAdvance.label}<window.IcArrowR style={{ width: 13, height: 13 }} />
        </button>
      )}
    </div>
  );
}

function Activation() {
  const [board, setBoard] = useStateA(window.WORKFLOW);

  const advance = (fromKey, toKey, item, msg) => {
    setBoard(b => ({ ...b, [fromKey]: b[fromKey].filter(x => x.id !== item.id), [toKey]: [{ ...item }, ...b[toKey]] }));
    window.toast(msg);
  };
  const actionFor = (colKey, item) => {
    const map = {
      draft:  { to: "submit",  label: "Submit", msg: "Submitted for review" },
      submit: { to: "review",  label: "Start review", msg: "Now in review" },
      review: { to: "approve", label: "Approve", msg: "Approved — ready to publish" },
      revise: { to: "submit",  label: "Resubmit", msg: "Resubmitted" },
      approve:{ to: "sched",   label: "Schedule", msg: "Scheduled to publish" },
      sched:  { to: "pub",     label: "Publish now", msg: "Published — live for students" },
    };
    const m = map[colKey];
    if (!m) return null;
    const fn = () => advance(colKey, m.to, item, m.msg);
    fn.label = m.label;
    return fn;
  };

  return (
    <div className="page page-anim wide" style={{ padding: "26px 28px 40px" }}>
      <div className="page-head">
        <div><h1>Activation Workflow</h1><p>Content flows from the Content Team through Program Team review to scheduled publishing. Drag a card or use its action to advance it.</p></div>
        <div className="actions">
          <div className="seg"><button className="on">My submissions</button><button>All content</button></div>
          <button className="btn"><window.IcFilter style={{ width: 15, height: 15 }} />Filter</button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 12, minHeight: 0 }}>
        {window.WF_COLS.map(col => {
          const items = board[col.key] || [];
          return (
            <div key={col.key} style={{ width: 256, flexShrink: 0, display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 4px 11px" }}>
                <span className={"status " + col.cls}><span className="dotc"></span>{col.label}</span>
                <span className="mono dim" style={{ fontSize: 11.5, marginLeft: "auto" }}>{items.length}</span>
              </div>
              <div style={{ background: "var(--surface-2)", border: "1px solid var(--hair)", borderRadius: "var(--r-lg)", padding: 10, display: "flex", flexDirection: "column", gap: 9, flex: 1, minHeight: 120 }}>
                {items.map(item => <WorkflowCard key={item.id} item={item} colCls={col.cls} onAdvance={actionFor(col.key, item)} />)}
                {items.length === 0 && <div style={{ flex: 1, display: "grid", placeItems: "center", color: "var(--ink-4)", fontSize: 11.5, padding: "20px 0" }}>Empty</div>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="card card-pad" style={{ marginTop: 18, maxWidth: 760 }}>
        <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", gap: 7 }}><window.IcWorkflow style={{ width: 15, height: 15, color: "var(--pri)" }} />HOW STATES CHANGE</div>
        <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap", fontSize: 11.5, color: "var(--ink-3)" }}>
          {[["Draft","Content builds"],["Submitted","locked for author"],["In Review","Program comments"],["Approved","ready"],["Scheduled","date set"],["Published","auto, live"]].map(([a, b], i) => (
            <React.Fragment key={a}>
              <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 3 }}><b style={{ color: "var(--ink-2)", fontSize: 12 }}>{a}</b><span style={{ fontSize: 10.5 }}>{b}</span></span>
              {i < 5 && <window.IcArrowR style={{ width: 14, height: 14, color: "var(--ink-4)" }} />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

window.Activation = Activation;
