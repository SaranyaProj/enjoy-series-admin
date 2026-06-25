/* admin-org.jsx — Admin · Organization (States / Cities / Schools) + State drill-down
   + the universal bulk-upload validation pattern. */
const { useState: useStateO, useRef: useRefO, useEffect: useEffectO } = React;

/* ---------- universal bulk upload modal (download → fill → upload → validate → confirm) ---------- */
function BulkUploadModal({ entity, columns, onClose }) {
  const [stage, setStage] = useStateO(1); // 1 instructions, 2 validation preview, 3 done
  const rows = window.BULK_PREVIEW;
  const valid = rows.filter(r => r.ok).length;
  const bad = rows.length - valid;
  return (
    <window.Modal title={"Bulk upload " + entity} sub="Download the template, fill it, upload, then review the validation preview." onClose={onClose} width={640}
      foot={stage === 1
        ? <><button className="btn btn-pri" onClick={() => setStage(2)}><window.IcUpload style={{ width: 15, height: 15 }} />Upload &amp; validate</button><button className="btn btn-ghost" onClick={onClose}>Cancel</button></>
        : stage === 2
        ? <><button className="btn btn-pri" disabled={valid === 0} onClick={() => { setStage(3); window.toast(valid + " " + entity + " imported"); }}><window.IcCheck style={{ width: 15, height: 15 }} />Import {valid} valid rows</button>{bad > 0 && <button className="btn"><window.IcUpload style={{ width: 14, height: 14, transform: "rotate(180deg)" }} />Download {bad} error rows</button>}<button className="btn btn-ghost" style={{ marginLeft: "auto" }} onClick={onClose}>Cancel</button></>
        : <button className="btn btn-pri" onClick={onClose}>Done</button>}>
      {stage === 1 && (
        <div>
          <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
            {["Download template","Fill your data","Upload & validate","Confirm import"].map((s, i) => (
              <div key={i} style={{ flex: 1, textAlign: "center" }}>
                <div className="mono" style={{ width: 26, height: 26, borderRadius: 99, background: "var(--pri-soft)", color: "var(--pri-ink)", display: "grid", placeItems: "center", margin: "0 auto 6px", fontSize: 12, fontWeight: 700 }}>{i + 1}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--ink-2)" }}>{s}</div>
              </div>
            ))}
          </div>
          <button className="btn" style={{ width: "100%", justifyContent: "center", marginBottom: 14 }}><window.IcUpload style={{ width: 15, height: 15, transform: "rotate(180deg)" }} />Download {entity} template (.csv)</button>
          <div style={{ border: "1.5px dashed var(--hair-2)", borderRadius: "var(--r-md)", padding: 30, textAlign: "center", color: "var(--ink-3)" }}>
            <window.IcUpload style={{ width: 26, height: 26, margin: "0 auto 9px", display: "block" }} />
            <div style={{ fontSize: 13, fontWeight: 600 }}>Drop your filled CSV/Excel here</div>
            <div style={{ fontSize: 11.5, marginTop: 3 }}>Columns: {columns.join(" · ")}</div>
          </div>
        </div>
      )}
      {stage === 2 && (
        <div>
          <div style={{ display: "flex", gap: 9, marginBottom: 14 }}>
            <span className="status s-approve"><span className="dotc"></span>{valid} valid</span>
            <span className="status s-revise"><span className="dotc"></span>{bad} need fixing</span>
          </div>
          <div className="card" style={{ overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
              <thead><tr style={{ background: "var(--surface-2)", textAlign: "left", color: "var(--ink-3)", fontSize: 11 }}><th style={{ padding: "8px 12px" }}>Row</th><th style={{ padding: "8px 12px" }}>Name</th><th style={{ padding: "8px 12px" }}>Code</th><th style={{ padding: "8px 12px" }}>Parent</th><th style={{ padding: "8px 12px" }}>Status</th></tr></thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.row} style={{ borderTop: "1px solid var(--hair)", background: r.ok ? "transparent" : "var(--st-revise-bg)" }}>
                    <td className="mono" style={{ padding: "8px 12px", color: "var(--ink-4)" }}>{r.row}</td>
                    <td style={{ padding: "8px 12px", fontWeight: 600 }}>{r.name}</td>
                    <td className="mono" style={{ padding: "8px 12px" }}>{r.code || "—"}</td>
                    <td style={{ padding: "8px 12px" }}>{r.parent}</td>
                    <td style={{ padding: "8px 12px" }}>{r.ok ? <span style={{ color: "var(--good)", display: "inline-flex", alignItems: "center", gap: 5, fontWeight: 600 }}><window.IcCheck style={{ width: 13, height: 13 }} />Valid</span> : <span style={{ color: "var(--st-revise)", display: "inline-flex", alignItems: "center", gap: 5, fontWeight: 600 }}><window.IcX style={{ width: 13, height: 13 }} />{r.err}</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {stage === 3 && (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{ width: 52, height: 52, borderRadius: 99, background: "var(--st-approve-bg)", color: "var(--good)", display: "grid", placeItems: "center", margin: "0 auto 14px" }}><window.IcCheck style={{ width: 26, height: 26 }} /></div>
          <div style={{ fontSize: 16, fontWeight: 700 }}>{valid} {entity} imported</div>
          <div className="muted" style={{ fontSize: 12.5, marginTop: 4 }}>{bad > 0 ? bad + " error rows were skipped — download them to correct and re-upload." : "All rows imported successfully."}</div>
        </div>
      )}
    </window.Modal>
  );
}

/* ---------- new-entity slide-over (manual) ---------- */
/* searchable dropdown — filter options as you type, pick from a popup list */
function SearchSelect({ options, placeholder }) {
  const [q, setQ] = useStateO("");
  const [val, setVal] = useStateO("");
  const [open, setOpen] = useStateO(false);
  const ref = useRefO(null);
  useEffectO(() => {
    if (!open) return;
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);
  const matches = options.filter(o => o.toLowerCase().includes(q.toLowerCase()));
  return (
    <div style={{ position: "relative" }} ref={ref}>
      <div className="searchbox" style={{ height: 38 }} onClick={() => setOpen(true)}>
        <window.IcSearch style={{ width: 15, height: 15 }} />
        <input placeholder={placeholder || "Search…"} value={open ? q : (val || q)} onFocus={() => setOpen(true)} onChange={(e) => { setQ(e.target.value); setVal(""); setOpen(true); }} />
        {val && <window.IcCheck style={{ width: 15, height: 15, color: "var(--good)" }} />}
      </div>
      {open && (
        <div style={{ position: "absolute", left: 0, right: 0, top: "calc(100% + 4px)", zIndex: 50, maxHeight: 220, overflowY: "auto", background: "var(--surface)", border: "1px solid var(--hair)", borderRadius: "var(--r-md)", boxShadow: "var(--sh-pop)", padding: 5, animation: "popIn .14s both" }}>
          {matches.map(o => (
            <button key={o} onClick={() => { setVal(o); setQ(o); setOpen(false); }} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 9px", border: 0, background: val === o ? "var(--surface-2)" : "transparent", borderRadius: 6, fontSize: 12.5, fontWeight: 550, textAlign: "left", color: "var(--ink-2)" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--surface-2)"} onMouseLeave={(e) => e.currentTarget.style.background = val === o ? "var(--surface-2)" : "transparent"}>
              <window.IcSubject style={{ width: 14, height: 14, color: "var(--ink-4)" }} />{o}
            </button>
          ))}
          {matches.length === 0 && <div className="dim" style={{ fontSize: 12, padding: "8px 9px" }}>No matches</div>}
        </div>
      )}
    </div>
  );
}

function NewEntity({ entity, fields, onClose }) {
  return (
    <window.SlideOver title={"New " + entity} sub="Manual entry — or close and use Upload for bulk." onClose={onClose}
      foot={<><button className="btn btn-pri" onClick={() => { window.toast(entity + " created"); onClose(); }}>Save &amp; Create</button><button className="btn btn-ghost" onClick={onClose}>Cancel</button></>}>
      {fields.map((f, i) => (
        <div className="field" key={i}>
          <label>{f.label}{f.req && <span style={{ color: "var(--bad)", marginLeft: 3 }}>*</span>}{f.opt && <span className="hint">optional</span>}</label>
          {f.type === "search" ? <SearchSelect options={f.options} placeholder={f.ph || ("Search " + f.label.toLowerCase() + "…")} />
            : f.type === "select" ? <select className="sel">{f.options.map(o => <option key={o}>{o}</option>)}</select>
            : f.type === "textarea" ? <textarea className="inp" rows={2}></textarea>
            : <input className="inp" placeholder={f.ph || ""} />}
        </div>
      ))}
    </window.SlideOver>
  );
}

/* ---------- Organization screens ---------- */
function Organization({ readOnly }) {
  const [tab, setTab] = useStateO("states");
  const [showArchived, setShowArchived] = useStateO(false);
  const [bulk, setBulk] = useStateO(false);
  const [neu, setNeu] = useStateO(false);
  const [drill, setDrill] = useStateO(null); // state drill-down

  const tabs = [
    { k: "states", label: "States", n: window.STATES.length },
    { k: "cities", label: "Cities", n: window.CITIES.length },
    { k: "schools", label: "Schools", n: window.SCHOOLS.length },
  ];
  const entityName = tab === "states" ? "State" : tab === "cities" ? "City" : "School";
  const bulkCols = tab === "states" ? ["State Name","Code","Region","Description"] : tab === "cities" ? ["City Name","Code","State","District"] : ["School Name","Address","City","Phone","Email"];
  const newFields = tab === "states"
    ? [{ label: "State Name", ph: "e.g. Kerala" }, { label: "State Code", ph: "auto-generated", opt: true }, { label: "Region / Zone", type: "select", options: ["South","North","East","West","Central"] }, { label: "Academic calendar", type: "select", options: ["2026 Standard","Custom…"] }, { label: "Curriculum policy", type: "select", options: ["Approve from global library","Custom subjects"] }, { label: "Description", type: "textarea", opt: true }]
    : tab === "cities"
    ? [{ label: "City Name", ph: "e.g. Kochi" }, { label: "City Code", ph: "e.g. COK", opt: true }, { label: "Parent State", type: "select", options: window.STATES.map(s => s.name) }, { label: "District", ph: "" }, { label: "Curriculum overrides", type: "select", options: ["Inherit from state","Customize"] }]
    : [{ label: "School Name", ph: "" }, { label: "Parent City", type: "select", options: window.CITIES.map(c => c.name) }, { label: "Address", type: "textarea" }, { label: "Phone", ph: "" }, { label: "Email", ph: "" }, { label: "Timezone", type: "select", options: ["IST (UTC+5:30)"] }];

  if (drill) return <StateDashboard st={drill} onBack={() => setDrill(null)} />;

  return (
    <div className="page page-anim wide">
      <div className="page-head">
        <div>
          <h1>Organization</h1>
          <p>{readOnly ? "Read-only view of the organizational hierarchy." : "Manage the full hierarchy — states, cities and schools. Every list supports manual entry and CSV/Excel bulk upload."}</p>
        </div>
        {!readOnly && (
          <div className="actions">
            <button className="btn" onClick={() => setBulk(true)}><window.IcUpload style={{ width: 15, height: 15 }} />Upload</button>
            <button className="btn btn-pri" onClick={() => setNeu(true)}><window.IcPlus style={{ width: 16, height: 16 }} />New {entityName}</button>
          </div>
        )}
      </div>

      <div className="toolbar">
        <div className="seg">{tabs.map(t => <button key={t.k} className={tab === t.k ? "on" : ""} onClick={() => setTab(t.k)}>{t.label}<span className="mono" style={{ opacity: 0.55, marginLeft: 5, fontSize: 11 }}>{t.n}</span></button>)}</div>
        {tab === "states" && <button className={"filter-pill" + (showArchived ? " on" : "")} onClick={() => setShowArchived(s => !s)} style={showArchived ? { borderColor: "var(--pri)", color: "var(--pri-ink)", background: "var(--pri-soft)" } : null}><window.IcArchive style={{ width: 14, height: 14 }} />{showArchived ? "Showing archived" : "Show archived"}</button>}
        <div className="searchbox" style={{ minWidth: 200, height: 32, marginLeft: "auto" }}><window.IcSearch style={{ width: 15, height: 15 }} /><input placeholder={"Search " + tab + "…"} /></div>
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        {tab === "states" && (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead><tr style={{ background: "var(--surface-2)", textAlign: "left", color: "var(--ink-3)", fontSize: 11.5 }}>{["State","Code","Region","Cities","Schools","Students","Teachers","Status",""].map((h, i) => <th key={i} style={{ padding: "11px 16px", fontWeight: 650 }}>{h}</th>)}</tr></thead>
            <tbody>
              {window.STATES.filter(s => showArchived ? s.status === "archived" : s.status === "active").map(s => (
                <tr key={s.id} style={{ borderTop: "1px solid var(--hair)", cursor: "pointer" }} onClick={() => setDrill(s)}
                  onMouseEnter={(e) => e.currentTarget.style.background = "var(--surface-2)"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "12px 16px" }}><div style={{ display: "flex", alignItems: "center", gap: 10 }}><div style={{ width: 30, height: 30, borderRadius: 8, background: "var(--pri-soft)", color: "var(--pri-ink)", display: "grid", placeItems: "center" }} className="mono"><b style={{ fontSize: 11 }}>{s.code}</b></div><b style={{ fontWeight: 650 }}>{s.name}</b></div></td>
                  <td className="mono" style={{ padding: "12px 16px" }}>{s.code}</td>
                  <td style={{ padding: "12px 16px", color: "var(--ink-3)" }}>{s.region}</td>
                  <td className="mono" style={{ padding: "12px 16px" }}>{s.cities}</td>
                  <td className="mono" style={{ padding: "12px 16px" }}>{s.schools}</td>
                  <td className="mono" style={{ padding: "12px 16px" }}>{s.students.toLocaleString()}</td>
                  <td className="mono" style={{ padding: "12px 16px" }}>{s.teachers}</td>
                  <td style={{ padding: "12px 16px" }}><span className={"status " + (s.status === "active" ? "s-pub" : "s-draft")}><span className="dotc"></span>{s.status === "active" ? "Active" : "Archived"}</span></td>
                  <td style={{ padding: "12px 6px" }} onClick={(e) => e.stopPropagation()}>{!readOnly && <window.Menu items={[{ label: "Open dashboard", icon: window.IcChart, onClick: () => setDrill(s) }, { label: "Edit", icon: window.IcEdit, onClick: () => setNeu(true) }, { sep: true }, { label: "Archive", icon: window.IcArchive, danger: true, onClick: () => window.toast("State archived — children read-only") }]} />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {tab === "cities" && (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead><tr style={{ background: "var(--surface-2)", textAlign: "left", color: "var(--ink-3)", fontSize: 11.5 }}>{["City","Code","Parent State","District","Schools","Students","Status",""].map((h, i) => <th key={i} style={{ padding: "11px 16px", fontWeight: 650 }}>{h}</th>)}</tr></thead>
            <tbody>
              {window.CITIES.map(c => (
                <tr key={c.id} style={{ borderTop: "1px solid var(--hair)" }} onMouseEnter={(e) => e.currentTarget.style.background = "var(--surface-2)"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "12px 16px" }}><b style={{ fontWeight: 650 }}>{c.name}</b></td>
                  <td className="mono" style={{ padding: "12px 16px" }}>{c.code}</td>
                  <td style={{ padding: "12px 16px" }}><window.MiniPill>{c.state}</window.MiniPill></td>
                  <td style={{ padding: "12px 16px", color: "var(--ink-3)" }}>{c.district}</td>
                  <td className="mono" style={{ padding: "12px 16px" }}>{c.schools}</td>
                  <td className="mono" style={{ padding: "12px 16px" }}>{c.students.toLocaleString()}</td>
                  <td style={{ padding: "12px 16px" }}><span className="status s-pub"><span className="dotc"></span>Active</span></td>
                  <td style={{ padding: "12px 6px" }}>{!readOnly && <window.Menu items={[{ label: "Edit", icon: window.IcEdit, onClick: () => setNeu(true) }, { sep: true }, { label: "Archive", icon: window.IcArchive, danger: true, onClick: () => window.toast("Archived") }]} />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {tab === "schools" && (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead><tr style={{ background: "var(--surface-2)", textAlign: "left", color: "var(--ink-3)", fontSize: 11.5 }}>{["School","City","Classes","Students","Teachers","Calendar","Status",""].map((h, i) => <th key={i} style={{ padding: "11px 16px", fontWeight: 650 }}>{h}</th>)}</tr></thead>
            <tbody>
              {window.SCHOOLS.map(s => (
                <tr key={s.id} style={{ borderTop: "1px solid var(--hair)" }} onMouseEnter={(e) => e.currentTarget.style.background = "var(--surface-2)"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "12px 16px" }}><div style={{ display: "flex", alignItems: "center", gap: 10 }}><div style={{ width: 30, height: 30, borderRadius: 8, background: "var(--surface-3)", display: "grid", placeItems: "center" }}><window.IcSubject style={{ width: 16, height: 16, color: "var(--ink-3)" }} /></div><b style={{ fontWeight: 650 }}>{s.name}</b></div></td>
                  <td style={{ padding: "12px 16px" }}><window.MiniPill>{s.city}</window.MiniPill></td>
                  <td className="mono" style={{ padding: "12px 16px" }}>{s.classes}</td>
                  <td className="mono" style={{ padding: "12px 16px" }}>{s.students}</td>
                  <td className="mono" style={{ padding: "12px 16px" }}>{s.teachers}</td>
                  <td style={{ padding: "12px 16px", color: "var(--ink-3)" }}>{s.calendar}</td>
                  <td style={{ padding: "12px 16px" }}><span className="status s-pub"><span className="dotc"></span>Active</span></td>
                  <td style={{ padding: "12px 6px" }}>{!readOnly && <window.Menu items={[{ label: "Edit", icon: window.IcEdit, onClick: () => setNeu(true) }, { label: "School settings", icon: window.IcSettings, onClick: () => {} }, { sep: true }, { label: "Archive", icon: window.IcArchive, danger: true, onClick: () => window.toast("Archived") }]} />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {bulk && <BulkUploadModal entity={tab} columns={bulkCols} onClose={() => setBulk(false)} />}
      {neu && <NewEntity entity={entityName} fields={newFields} onClose={() => setNeu(false)} />}
    </div>
  );
}

/* ---------- State drill-down dashboard ---------- */
function StateDashboard({ st, onBack }) {
  const cities = window.CITIES.filter(c => c.state === st.name);
  return (
    <div className="page page-anim wide">
      <button className="btn btn-ghost btn-sm" style={{ marginBottom: 14 }} onClick={onBack}><window.IcChevL style={{ width: 15, height: 15 }} />Organization</button>
      <div className="card card-pad" style={{ marginBottom: 18, display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 56, height: 56, borderRadius: 14, background: "var(--pri)", color: "#fff", display: "grid", placeItems: "center", boxShadow: "var(--sh-1)" }} className="mono"><b style={{ fontSize: 18 }}>{st.code}</b></div>
        <div>
          <h1 style={{ fontSize: 21, margin: 0 }}>{st.name}</h1>
          <div className="muted" style={{ fontSize: 12.5, marginTop: 2 }}>{st.region} region · academic calendar 2026</div>
        </div>
        <div className="actions" style={{ marginLeft: "auto" }}>
          <button className="btn"><window.IcEdit style={{ width: 15, height: 15 }} />Edit</button>
          <button className="btn"><window.IcMsg style={{ width: 15, height: 15 }} />Announce</button>
        </div>
      </div>
      <div className="kpi-row">
        <div className="kpi"><div className="k-label">Cities</div><div className="k-num mono">{st.cities}</div><div className="k-sub">chapters</div></div>
        <div className="kpi"><div className="k-label">Schools</div><div className="k-num mono">{st.schools}</div><div className="k-sub">active</div></div>
        <div className="kpi"><div className="k-label">Students</div><div className="k-num mono">{(st.students/1000).toFixed(1)}k</div><div className="k-sub">enrolled</div></div>
        <div className="kpi"><div className="k-label">Teachers</div><div className="k-num mono">{st.teachers}</div><div className="k-sub">onboarded</div></div>
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, margin: "4px 0 11px" }}>City chapters</div>
      <div className="card" style={{ overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead><tr style={{ background: "var(--surface-2)", textAlign: "left", color: "var(--ink-3)", fontSize: 11.5 }}>{["City","Code","District","Schools","Students",""].map((h, i) => <th key={i} style={{ padding: "10px 16px", fontWeight: 650 }}>{h}</th>)}</tr></thead>
          <tbody>
            {cities.map(c => (
              <tr key={c.id} style={{ borderTop: "1px solid var(--hair)" }} onMouseEnter={(e) => e.currentTarget.style.background = "var(--surface-2)"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "11px 16px", fontWeight: 600 }}>{c.name}</td>
                <td className="mono" style={{ padding: "11px 16px" }}>{c.code}</td>
                <td style={{ padding: "11px 16px", color: "var(--ink-3)" }}>{c.district}</td>
                <td className="mono" style={{ padding: "11px 16px" }}>{c.schools}</td>
                <td className="mono" style={{ padding: "11px 16px" }}>{c.students.toLocaleString()}</td>
                <td style={{ padding: "11px 6px" }}><window.IcChevR style={{ width: 15, height: 15, color: "var(--ink-4)" }} /></td>
              </tr>
            ))}
            {cities.length === 0 && <tr><td colSpan={6} style={{ padding: "20px", textAlign: "center", color: "var(--ink-4)" }}>No cities yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

window.Organization = Organization;
window.BulkUploadModal = BulkUploadModal;
window.NewEntity = NewEntity;
