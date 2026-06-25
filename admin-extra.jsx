/* admin-extra.jsx — Admin · Settings + Communication, and Program · Curriculum deployment */
const { useState: useStateX } = React;

/* ============ SETTINGS (Admin only) ============ */
function Settings() {
  const [tab, setTab] = useStateX("roles");
  return (
    <div className="page page-anim wide">
      <div className="page-head"><div><h1>Settings &amp; Platform Configuration</h1><p>Admin-only controls — roles &amp; permissions, branding, and notification policy. Changes apply platform-wide immediately.</p></div></div>
      <div className="toolbar"><div className="seg">
        <button className={tab === "roles" ? "on" : ""} onClick={() => setTab("roles")}>Roles &amp; Permissions</button>
        <button className={tab === "branding" ? "on" : ""} onClick={() => setTab("branding")}>Branding</button>
        <button className={tab === "notif" ? "on" : ""} onClick={() => setTab("notif")}>Notifications</button>
      </div></div>

      {tab === "roles" && (
        <div className="card" style={{ overflow: "hidden" }}>
          <div style={{ padding: "13px 16px", borderBottom: "1px solid var(--hair)", display: "flex", alignItems: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>Permission matrix</div>
            <span className="dim" style={{ fontSize: 11.5, marginLeft: 10 }}>Toggle per-module access for each login type.</span>
            <button className="btn btn-pri btn-sm" style={{ marginLeft: "auto" }} onClick={() => window.toast("Permissions saved platform-wide")}>Save changes</button>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
            <thead><tr style={{ background: "var(--surface-2)", textAlign: "left", color: "var(--ink-3)", fontSize: 11.5 }}>
              <th style={{ padding: "10px 16px", fontWeight: 650 }}>Capability</th>
              <th style={{ padding: "10px 16px", fontWeight: 650, textAlign: "center" }}>Admin</th>
              <th style={{ padding: "10px 16px", fontWeight: 650, textAlign: "center" }}>Program Team</th>
              <th style={{ padding: "10px 16px", fontWeight: 650, textAlign: "center" }}>Content Team</th>
            </tr></thead>
            <tbody>
              {window.PERMISSIONS.map((p, i) => (
                <tr key={i} style={{ borderTop: "1px solid var(--hair)" }}>
                  <td style={{ padding: "11px 16px", fontWeight: 600 }}>{p.cap}</td>
                  {[p.admin, p.program, p.content].map((v, x) => (
                    <td key={x} style={{ padding: "11px 16px", textAlign: "center" }}>
                      <PermCell value={v} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "branding" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div className="card card-pad">
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>Brand identity</div>
            <div className="field"><label>Logo</label><div style={{ display: "flex", alignItems: "center", gap: 12 }}><div className="brand-mark" style={{ width: 44, height: 44 }}><window.IcLayers style={{ width: 24, height: 24 }} /></div><button className="btn btn-sm"><window.IcUpload style={{ width: 14, height: 14 }} />Upload logo</button></div></div>
            <div className="field"><label>Primary color</label><div style={{ display: "flex", gap: 8 }}>{["#5848d6","#2563c9","#0d8f6f","#c2532b"].map(c => <div key={c} style={{ width: 34, height: 34, borderRadius: 8, background: c, border: c === "#5848d6" ? "2px solid var(--ink)" : "1px solid var(--hair)", cursor: "pointer" }}></div>)}</div></div>
            <div className="field" style={{ marginBottom: 0 }}><label>Apply to scope</label><select className="sel"><option>Platform-wide</option><option>Tamil Nadu only</option><option>Specific schools…</option></select></div>
          </div>
          <div className="card card-pad">
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>Login page preview</div>
            <div style={{ borderRadius: "var(--r-md)", border: "1px solid var(--hair)", overflow: "hidden", height: 240, background: "linear-gradient(160deg, var(--pri-soft), var(--surface))", display: "grid", placeItems: "center" }}>
              <div style={{ textAlign: "center" }}>
                <div className="brand-mark" style={{ width: 52, height: 52, margin: "0 auto 14px" }}><window.IcLayers style={{ width: 28, height: 28 }} /></div>
                <div style={{ fontSize: 17, fontWeight: 750 }}>Enjoy Series</div>
                <div className="dim" style={{ fontSize: 12, marginBottom: 16 }}>Learning Management System</div>
                <div style={{ width: 180, height: 32, borderRadius: 7, background: "var(--surface)", border: "1px solid var(--hair)", margin: "0 auto 8px" }}></div>
                <div style={{ width: 180, height: 32, borderRadius: 7, background: "var(--pri)" }}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "notif" && (
        <div className="card" style={{ overflow: "hidden" }}>
          <div style={{ padding: "13px 16px", borderBottom: "1px solid var(--hair)", fontSize: 13, fontWeight: 700 }}>Notification policy <span className="dim" style={{ fontWeight: 500, fontSize: 11.5 }}>· per event: recipients, channels &amp; frequency</span></div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
            <thead><tr style={{ background: "var(--surface-2)", textAlign: "left", color: "var(--ink-3)", fontSize: 11.5 }}>{["Event","Recipients","Channels","Frequency"].map((h, i) => <th key={i} style={{ padding: "10px 16px", fontWeight: 650 }}>{h}</th>)}</tr></thead>
            <tbody>
              {[["Content submitted for review","Program Team",["In-app","Email"],"Instant"],["Module published","Teachers, Parents",["In-app","Push"],"Instant"],["Student at-risk flag","Teacher",["Email"],"Daily"],["Weekly progress digest","Parents",["Email"],"Weekly"],["New announcement","Scope members",["In-app","Push"],"Instant"]].map((r, i) => (
                <tr key={i} style={{ borderTop: "1px solid var(--hair)" }}>
                  <td style={{ padding: "11px 16px", fontWeight: 600 }}>{r[0]}</td>
                  <td style={{ padding: "11px 16px", color: "var(--ink-3)" }}>{r[1]}</td>
                  <td style={{ padding: "11px 16px" }}><div style={{ display: "flex", gap: 5 }}>{r[2].map(c => <span key={c} className="chip" style={{ height: 19, fontSize: 10.5 }}>{c}</span>)}</div></td>
                  <td style={{ padding: "11px 16px" }}><select className="sel" style={{ height: 30, width: 110 }} defaultValue={r[3]}><option>Instant</option><option>Daily</option><option>Weekly</option></select></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function PermCell({ value }) {
  const no = value.toLowerCase().includes("no");
  const full = value.toLowerCase().includes("full") || value === "Yes" || value.toLowerCase().includes("all");
  const color = no ? "var(--ink-4)" : full ? "var(--good)" : "var(--warn)";
  const bg = no ? "var(--surface-3)" : full ? "var(--st-approve-bg)" : "var(--st-review-bg)";
  return <span className="chip" style={{ background: bg, color, height: 22, fontSize: 11 }}>{no ? <window.IcX style={{ width: 11, height: 11 }} /> : full ? <window.IcCheck style={{ width: 11, height: 11 }} /> : <window.IcEye style={{ width: 11, height: 11 }} />}{value}</span>;
}

/* ============ COMMUNICATION ============ */
function Communication({ role }) {
  const [tab, setTab] = useStateX("announce");
  const [compose, setCompose] = useStateX(false);
  const isAdmin = role === "admin";
  return (
    <div className="page page-anim wide">
      <div className="page-head">
        <div><h1>Communication &amp; Engagement</h1><p>{isAdmin ? "Send announcements at any scope and configure badges & leaderboards." : "Send announcements scoped to your schools and classes."}</p></div>
        <div className="actions"><button className="btn btn-pri" onClick={() => setCompose(true)}><window.IcPlus style={{ width: 16, height: 16 }} />New Announcement</button></div>
      </div>
      <div className="toolbar"><div className="seg">
        <button className={tab === "announce" ? "on" : ""} onClick={() => setTab("announce")}>Announcements</button>
        {isAdmin && <button className={tab === "badges" ? "on" : ""} onClick={() => setTab("badges")}>Badges &amp; Gamification</button>}
      </div></div>

      {tab === "announce" && (
        <div className="card" style={{ overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead><tr style={{ background: "var(--surface-2)", textAlign: "left", color: "var(--ink-3)", fontSize: 11.5 }}>{["Announcement","Scope","Channels","Sent by","Reach","When"].map((h, i) => <th key={i} style={{ padding: "11px 16px", fontWeight: 650 }}>{h}</th>)}</tr></thead>
            <tbody>
              {window.ANNOUNCEMENTS.map(a => (
                <tr key={a.id} style={{ borderTop: "1px solid var(--hair)" }} onMouseEnter={(e) => e.currentTarget.style.background = "var(--surface-2)"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "12px 16px", fontWeight: 600 }}><div style={{ display: "flex", alignItems: "center", gap: 9 }}><window.IcMsg style={{ width: 16, height: 16, color: "var(--pri)" }} />{a.title}</div></td>
                  <td style={{ padding: "12px 16px" }}><window.MiniPill>{a.scope}</window.MiniPill></td>
                  <td style={{ padding: "12px 16px" }}><div style={{ display: "flex", gap: 5 }}>{a.channels.map(c => <span key={c} className="chip" style={{ height: 19, fontSize: 10.5 }}>{c}</span>)}</div></td>
                  <td style={{ padding: "12px 16px", color: "var(--ink-3)" }}>{a.by}</td>
                  <td className="mono" style={{ padding: "12px 16px" }}>{a.reach.toLocaleString()}</td>
                  <td style={{ padding: "12px 16px", color: "var(--ink-4)", fontSize: 12 }}>{a.when}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "badges" && isAdmin && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(248px, 1fr))", gap: 14 }}>
          {window.BADGES.map(b => (
            <div key={b.id} className="card card-pad">
              <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: b.color.replace(")", " / 0.12)"), color: b.color, display: "grid", placeItems: "center" }}>{React.createElement(window[b.icon], { style: { width: 24, height: 24 } })}</div>
                <div><div style={{ fontSize: 14, fontWeight: 700 }}>{b.name}</div><div className="dim" style={{ fontSize: 11 }}>{b.rarity} · {b.xp} XP</div></div>
              </div>
              <div style={{ fontSize: 11.5, color: "var(--ink-2)", background: "var(--surface-2)", padding: "7px 10px", borderRadius: 7, marginBottom: 10 }}><b>Trigger:</b> {b.trigger}</div>
              <div className="dim" style={{ fontSize: 11.5 }}>Awarded <b className="mono" style={{ color: "var(--ink-2)" }}>{b.awarded.toLocaleString()}</b> times</div>
            </div>
          ))}
          <button className="card card-pad" onClick={() => window.toast("New badge")} style={{ border: "1.5px dashed var(--hair-2)", background: "transparent", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, color: "var(--ink-3)", minHeight: 150, cursor: "pointer" }}>
            <window.IcPlus style={{ width: 22, height: 22 }} /><span style={{ fontSize: 12.5, fontWeight: 600 }}>Create badge</span>
          </button>
        </div>
      )}

      {compose && (
        <window.Modal title="Compose announcement" sub="Rich text + attachment, scope, and delivery channels." onClose={() => setCompose(false)} width={580}
          foot={<><button className="btn btn-pri" onClick={() => { window.toast("Announcement scheduled"); setCompose(false); }}><window.IcMsg style={{ width: 15, height: 15 }} />Send / Schedule</button><button className="btn btn-ghost" onClick={() => setCompose(false)}>Cancel</button></>}>
          <div className="field"><label>Title</label><input className="inp" placeholder="e.g. Term 1 assessment window" /></div>
          <div className="field"><label>Scope</label><select className="sel">{isAdmin ? <><option>Platform</option><option>State…</option><option>City…</option><option>School…</option><option>Class…</option></> : <><option>School…</option><option>Class…</option></>}</select></div>
          <div className="field"><label>Message</label><textarea className="inp" rows={4} placeholder="Write your message…"></textarea></div>
          <div className="row-2">
            <div className="field" style={{ marginBottom: 0 }}><label>Channels</label><div style={{ display: "flex", gap: 6 }}>{["In-app","Email","Push"].map(c => <span key={c} className="chip" style={{ cursor: "pointer", background: "var(--pri-soft)", color: "var(--pri-ink)" }}>{c}</span>)}</div></div>
            <div className="field" style={{ marginBottom: 0 }}><label>Schedule</label><select className="sel"><option>Send now</option><option>Schedule…</option></select></div>
          </div>
        </window.Modal>
      )}
    </div>
  );
}

window.Settings = Settings;
window.Communication = Communication;
