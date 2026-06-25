/* ui.jsx — small shared presentational helpers */
const { useState, useEffect, useRef, useCallback } = React;

function SubjectChip({ subject, sm }) {
  const s = window.SUBJECTS[subject] || {};
  return <span className={"chip chip-subj " + s.cls} style={sm ? { height: 20, fontSize: 11 } : null}>
    <span className="dotc" style={{ background: s.color }}></span>{subject}
  </span>;
}

function StatusBadge({ status }) {
  const label = window.STATUS_LABEL[status] || status;
  const cls = window.STATUS_CLS[status] || "s-draft";
  return <span className={"status " + cls}><span className="dotc"></span>{label}</span>;
}

/* small neutral pill used across admin tables */
function MiniPill({ children }) { return <span className="lvl" style={{ fontSize: 10, background: "var(--surface-3)" }}>{children}</span>; }

/* resolve a game-type glyph component by type id, color-tinted by subject */
function GameGlyph({ typeId, size = 22, color }) {
  const t = window.TYPE_BY_ID[typeId];
  const Ic = t ? window[t.icon] : window.IcGame;
  return <Ic style={{ width: size, height: size, color: color || "var(--ink-2)" }} />;
}

function Avatar({ name, size = 30, bg }) {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const palette = ["oklch(0.55 0.13 245)","oklch(0.56 0.12 158)","oklch(0.58 0.13 28)","oklch(0.52 0.15 295)","oklch(0.6 0.12 60)","oklch(0.55 0.09 172)"];
  const idx = name.charCodeAt(0) % palette.length;
  return <div className="avatar" style={{ width: size, height: size, fontSize: size * 0.4, background: bg || palette[idx] }}>{initials}</div>;
}

/* Dropdown menu (three-dot) */
function Menu({ items, trigger }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);
  return (
    <div style={{ position: "relative" }} ref={ref}>
      <button className="icon-btn btn-sm" style={{ width: 28, height: 28, border: 0, background: "transparent", boxShadow: "none" }}
              onClick={(e) => { e.stopPropagation(); setOpen(o => !o); }}>
        {trigger || <window.IcDots style={{ width: 16, height: 16 }} />}
      </button>
      {open && (
        <div style={{
          position: "absolute", right: 0, top: "calc(100% + 4px)", zIndex: 40, minWidth: 168,
          background: "var(--surface)", border: "1px solid var(--hair)", borderRadius: "var(--r-md)",
          boxShadow: "var(--sh-pop)", padding: 5, animation: "popIn .14s both"
        }} onClick={(e) => e.stopPropagation()}>
          {items.map((it, i) => it.sep ? <hr key={i} className="hairline" style={{ margin: "5px 0" }} /> : (
            <button key={i} onClick={() => { setOpen(false); it.onClick && it.onClick(); }}
              style={{ display: "flex", alignItems: "center", gap: 9, width: "100%", padding: "7px 9px",
                border: 0, background: "transparent", borderRadius: 6, fontSize: 12.5, fontWeight: 550,
                color: it.danger ? "var(--bad)" : "var(--ink-2)", textAlign: "left" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--surface-2)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
              {it.icon && React.createElement(it.icon, { style: { width: 15, height: 15 } })}{it.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* Toast system via context-free simple store */
const toastStore = { listeners: new Set(), push(msg) { this.listeners.forEach(l => l(msg)); } };
function toast(msg) { toastStore.push(msg); }
function ToastHost() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    const l = (msg) => {
      const id = Math.random();
      setItems(s => [...s, { id, msg }]);
      setTimeout(() => setItems(s => s.filter(i => i.id !== id)), 2600);
    };
    toastStore.listeners.add(l);
    return () => toastStore.listeners.delete(l);
  }, []);
  return <div className="toast-wrap">{items.map(i => (
    <div className="toast" key={i.id}><span className="tick"><window.IcCheck style={{ width: 12, height: 12 }} /></span>{i.msg}</div>
  ))}</div>;
}

/* Modal shell */
function Modal({ title, sub, onClose, children, foot, width }) {
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);
  return (
    <div className="overlay" onMouseDown={onClose}>
      <div className="modal" style={width ? { width } : null} onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div><h3>{title}</h3>{sub && <p>{sub}</p>}</div>
          <button className="x-btn" onClick={onClose}><window.IcX style={{ width: 16, height: 16 }} /></button>
        </div>
        <div className="modal-body">{children}</div>
        {foot && <div className="modal-foot">{foot}</div>}
      </div>
    </div>
  );
}

/* Slide-over shell */
function SlideOver({ title, sub, onClose, children, foot }) {
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);
  return (
    <div className="overlay" onMouseDown={onClose}>
      <div className="slideover" onMouseDown={(e) => e.stopPropagation()}>
        <div className="so-head">
          <div><h3>{title}</h3>{sub && <p>{sub}</p>}</div>
          <button className="x-btn" onClick={onClose}><window.IcX style={{ width: 16, height: 16 }} /></button>
        </div>
        <div className="modal-body" style={{ flex: 1 }}>{children}</div>
        {foot && <div className="so-foot">{foot}</div>}
      </div>
    </div>
  );
}

Object.assign(window, { SubjectChip, StatusBadge, MiniPill, GameGlyph, Avatar, Menu, toast, ToastHost, Modal, SlideOver });
