import React, { useMemo, useState } from "react";

/* ================= helpers ================= */
const title = (s = "") => s.replace(/\b\w/g, (m) => m.toUpperCase());
const fmtDT = (iso) => new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

const Badge = ({ children, tone = "slate" }) => (
  <span className={`px-2 py-0.5 rounded-md text-xs bg-${tone}-100 text-${tone}-700 border`}>{children}</span>
);

const Toggle = ({ checked, onChange, label }) => (
  <label className="inline-flex items-center gap-2 cursor-pointer select-none">
    <input type="checkbox" className="peer sr-only" checked={checked} onChange={(e) => onChange?.(e.target.checked)} />
    <span className="w-10 h-6 rounded-full bg-slate-300 peer-checked:bg-blue-600 relative transition">
      <span className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition peer-checked:left-4" />
    </span>
    {label && <span className="text-sm text-slate-700">{label}</span>}
  </label>
);

const Card = ({ title, actions, children }) => (
  <div className="rounded-xl border bg-white p-4">
    <div className="flex items-center justify-between">
      <div className="font-semibold">{title}</div>
      {actions}
    </div>
    <div className="mt-3">{children}</div>
  </div>
);

const Icon = {
  Save: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" className="text-white"><path fill="currentColor" d="M17 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14V7l-2-4zm-2 16H7v-6h8v6zm0-8H7V5h8v6z"/></svg>
  ),
  Block: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" className="text-red-600"><path fill="currentColor" d="M12 2a10 10 0 1010 10A10.011 10.011 0 0012 2zm5 10a5 5 0 01-1.02 3L9 8.02A5 5 0 0117 12zM7 12a5 5 0 011.02-3L15 15.98A5 5 0 017 12z"/></svg>
  ),
  Unblock: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" className="text-green-600"><path fill="currentColor" d="M12 2a10 10 0 1010 10A10.011 10.011 0 0012 2zm-1 15l-4-4 1.41-1.41L11 14.17l6.59-6.58L19 9z"/></svg>
  ),
  Logout: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" className="text-slate-700"><path fill="currentColor" d="M10 17l1.41-1.41L8.83 13H20v-2H8.83l2.58-2.59L10 7l-5 5 5 5zM4 5h6V3H4a2 2 0 00-2 2v14a2 2 0 002 2h6v-2H4z"/></svg>
  ),
  Plus: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" className="text-white"><path fill="currentColor" d="M19 11H13V5h-2v6H5v2h6v6h2v-6h6z"/></svg>
  ),
  Download: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" className="text-slate-700"><path fill="currentColor" d="M5 20h14v-2H5m14-9h-4V3H9v6H5l7 7 7-7z"/></svg>
  ),
};

/* ================= seed data ================= */
const ROLES = ["admin", "patient", "radiology", "pathology", "doctor", "pharmacy", "accountant"];
const LANGS = ["English", "Hindi", "Telugu"];
const MODULES = ["OPD", "IPD", "Pharmacy", "Pathology", "Radiology", "Billing", "Inventory", "Reports", "Admin"];
const PERMS = ["view", "create", "edit", "delete", "export", "approve"];

const defaultRolePerms = () => {
  const map = {};
  ROLES.forEach((r) => {
    map[r] = {};
    MODULES.forEach((m) => {
      map[r][m] = {
        view: true,
        create: r !== "patient" && m !== "Admin",
        edit: r !== "patient" && m !== "Admin",
        delete: r === "admin",
        export: r !== "patient",
        approve: r === "admin" || r === "accountant",
      };
    });
  });
  return map;
};

const seedUsers = [
  { id: "9001", name: "Manas", role: "admin", online: true,  blocked: false, loginAt: new Date(Date.now()-1000*60*10).toISOString(), lastActive: new Date().toISOString(), ip: "10.0.0.11" },
  { id: "9018", name: "Ganga Babu", role: "receptionist", online: true,  blocked: false, loginAt: new Date(Date.now()-1000*60*50).toISOString(), lastActive: new Date(Date.now()-1000*60*2).toISOString(), ip: "10.0.0.23" },
  { id: "9006", name: "Dr. Sridevi", role: "radiology", online: false, blocked: false, loginAt: new Date(Date.now()-1000*60*60*5).toISOString(), lastActive: new Date(Date.now()-1000*60*60*2).toISOString(), ip: "10.0.0.31" },
  { id: "9003", name: "Shivani", role: "accountant", online: true,  blocked: false, loginAt: new Date(Date.now()-1000*60*25).toISOString(), lastActive: new Date(Date.now()-1000*60*5).toISOString(), ip: "10.0.0.45" },
  { id: "9008", name: "Dr. Sneha", role: "doctor", online: false, blocked: true,  loginAt: new Date(Date.now()-1000*60*60*48).toISOString(), lastActive: new Date(Date.now()-1000*60*60*30).toISOString(), ip: "10.0.0.52" },
];

/* ================= main ================= */
const Settings = () => {
  const [tab, setTab] = useState("general");

  // General
  const [general, setGeneral] = useState({
    orgName: "CityCare Hospital",
    address: "Plot 12, MG Road, Bengaluru",
    timezone: "Asia/Kolkata",
    dateFormat: "dd-MM-yyyy",
    currency: "INR",
    logo: "",
  });

  // Notifications
  const [notify, setNotify] = useState({
    appointments: { email: true, sms: false, push: true },
    discharges: { email: true, sms: true, push: false },
    lowStock: { email: true, sms: false, push: true },
    tpa: { email: true, sms: false, push: false },
    payments: { email: true, sms: true, push: false },
  });

  // Roles & Permissions
  const [role, setRole] = useState("admin");
  const [rolePerms, setRolePerms] = useState(defaultRolePerms());

  // Languages
  const [langs, setLangs] = useState({ English: true, Hindi: false, Telugu: false });

  // Sessions / Users Online
  const [users, setUsers] = useState(seedUsers);
  const onlineCount = useMemo(() => users.filter((u) => u.online && !u.blocked).length, [users]);

  // Attendance (manual entry)
  const [attForm, setAttForm] = useState({ id: "", date: new Date().toISOString().slice(0,10), inTime: "", outTime: "" });
  const [attendance, setAttendance] = useState([
    { id: "9018", date: new Date().toISOString().slice(0,10), inTime: "09:00", outTime: "18:00" },
  ]);

  const duration = (a, b) => {
    if (!a || !b) return "—";
    const [ah, am] = a.split(":").map(Number);
    const [bh, bm] = b.split(":").map(Number);
    let mins = (bh*60+bm) - (ah*60+am);
    if (mins < 0) mins += 24*60; // cross midnight guard
    const h = Math.floor(mins/60), m = mins%60;
    return `${h}h ${m}m`;
  };

  /* ===== handlers ===== */
  const saveGeneral = () => alert("General settings saved (mock)");
  const saveNotify = () => alert("Notification preferences saved (mock)");
  const savePerms = () => alert("Role permissions saved (mock)");

  const setPerm = (module, perm, value) => {
    setRolePerms((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [module]: { ...prev[role][module], [perm]: value },
      },
    }));
  };

  const toggleLang = (L) => setLangs((p) => ({ ...p, [L]: !p[L] }));

  const blockUser = (id, block) => setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, blocked: block, online: block ? false : u.online } : u)));
  const revokeSession = (id) => setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, online: false } : u)));

  const addAttendance = (e) => {
    e.preventDefault();
    if (!attForm.id || !attForm.date || !attForm.inTime) return alert("ID, Date and In Time are required");
    setAttendance((prev) => [{ ...attForm }, ...prev]);
    setAttForm({ id: "", date: attForm.date, inTime: "", outTime: "" });
  };

  const exportCSV = (rows, name) => {
    const keys = Object.keys(rows[0] || {});
    const head = keys.join(",");
    const body = rows.map((r) => keys.map((k) => `"${String(r[k] ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([head + "\n" + body], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${name}_${Date.now()}.csv`; a.click(); URL.revokeObjectURL(url);
  };

  /* ===== subviews ===== */
  const GeneralView = (
    <Card
      title="General Details"
      actions={
        <button onClick={saveGeneral} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md">
          <Icon.Save /> Save
        </button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-slate-600">Organisation Name</label>
          <input value={general.orgName} onChange={(e)=>setGeneral((p)=>({...p,orgName:e.target.value}))} className="mt-1 w-full rounded-md border px-3 py-2" />
        </div>
        <div>
          <label className="text-sm text-slate-600">Currency</label>
          <select value={general.currency} onChange={(e)=>setGeneral((p)=>({...p,currency:e.target.value}))} className="mt-1 w-full rounded-md border px-3 py-2">
            <option value="INR">INR (₹)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="text-sm text-slate-600">Address</label>
          <input value={general.address} onChange={(e)=>setGeneral((p)=>({...p,address:e.target.value}))} className="mt-1 w-full rounded-md border px-3 py-2" />
        </div>
        <div>
          <label className="text-sm text-slate-600">Timezone</label>
          <select value={general.timezone} onChange={(e)=>setGeneral((p)=>({...p,timezone:e.target.value}))} className="mt-1 w-full rounded-md border px-3 py-2">
            <option>Asia/Kolkata</option>
            <option>Asia/Dubai</option>
            <option>Asia/Singapore</option>
            <option>UTC</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-slate-600">Date Format</label>
          <select value={general.dateFormat} onChange={(e)=>setGeneral((p)=>({...p,dateFormat:e.target.value}))} className="mt-1 w-full rounded-md border px-3 py-2">
            <option value="dd-MM-yyyy">dd-MM-yyyy</option>
            <option value="MM/dd/yyyy">MM/dd/yyyy</option>
            <option value="yyyy-MM-dd">yyyy-MM-dd</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="text-sm text-slate-600">Logo URL</label>
          <input value={general.logo} onChange={(e)=>setGeneral((p)=>({...p,logo:e.target.value}))} placeholder="https://..." className="mt-1 w-full rounded-md border px-3 py-2" />
        </div>
      </div>
    </Card>
  );

  const NotifyView = (
    <Card
      title="Notification Settings"
      actions={
        <button onClick={saveNotify} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md">
          <Icon.Save /> Save
        </button>
      }
    >
      {[
        { k: "appointments", label: "Appointments" },
        { k: "discharges", label: "IPD Discharge" },
        { k: "lowStock", label: "Low Stock" },
        { k: "tpa", label: "TPA Updates" },
        { k: "payments", label: "Payments" },
      ].map(({ k, label }) => (
        <div key={k} className="flex items-center justify-between border-b last:border-b-0 py-3">
          <div className="text-sm font-medium">{label}</div>
          <div className="flex items-center gap-4">
            <Toggle checked={notify[k].email} onChange={(v) => setNotify((p)=>({ ...p, [k]: { ...p[k], email: v } }))} label="Email" />
            <Toggle checked={notify[k].sms} onChange={(v) => setNotify((p)=>({ ...p, [k]: { ...p[k], sms: v } }))} label="SMS" />
            <Toggle checked={notify[k].push} onChange={(v) => setNotify((p)=>({ ...p, [k]: { ...p[k], push: v } }))} label="Push" />
          </div>
        </div>
      ))}
    </Card>
  );

  const RolesView = (
    <Card
      title="Roles & Permissions"
      actions={
        <button onClick={savePerms} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md">
          <Icon.Save /> Save
        </button>
      }
    >
      <div className="mb-3 flex items-center gap-2">
        <label className="text-sm text-slate-600">Role</label>
        <select value={role} onChange={(e)=>setRole(e.target.value)} className="rounded-md border px-3 py-2 text-sm">
          {ROLES.map((r)=> <option key={r} value={r}>{title(r)}</option>)}
        </select>
        <div className="ml-auto text-sm text-slate-600">Quick: 
          <button className="ml-2 px-2 py-1 border rounded" onClick={()=>{
            // grant view/create/edit/export for all modules
            const next = {...rolePerms};
            MODULES.forEach((m)=>{ next[role][m] = { ...next[role][m], view:true, create:true, edit:true, export:true }; });
            setRolePerms(next);
          }}>Grant Common</button>
          <button className="ml-2 px-2 py-1 border rounded" onClick={()=>{
            const next = {...rolePerms};
            MODULES.forEach((m)=>{ next[role][m] = { view:true, create:false, edit:false, delete:false, export:false, approve:false }; });
            setRolePerms(next);
          }}>Read Only</button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-[700px] w-full text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left">
              <th className="px-3 py-2">Module</th>
              {PERMS.map((p)=> <th key={p} className="px-3 py-2 capitalize">{p}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y">
            {MODULES.map((m)=>(
              <tr key={m} className="hover:bg-slate-50">
                <td className="px-3 py-2 font-medium">{m}</td>
                {PERMS.map((p)=> (
                  <td key={m+p} className="px-3 py-2">
                    <input type="checkbox" checked={!!rolePerms[role][m][p]} onChange={(e)=> setPerm(m, p, e.target.checked)} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );

  const LangView = (
    <Card title="Languages">
      <div className="flex flex-wrap gap-3">
        {LANGS.map((L)=> (
          <button key={L} onClick={()=>toggleLang(L)} className={`px-3 py-1.5 rounded-md border ${langs[L] ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-white"}`}>
            {L} {langs[L] && <span className="ml-1">✓</span>}
          </button>
        ))}
      </div>
      <div className="mt-3 text-xs text-slate-600">Primary UI language is applied to all users. Individual users can still choose their own language in profile.</div>
    </Card>
  );

  const SessionsView = (
    <Card
      title={<div className="flex items-center gap-2">User Sessions <Badge tone="blue">Active: {onlineCount}</Badge> <Badge tone="slate">Total: {users.length}</Badge></div>}
      actions={<button onClick={()=>exportCSV(users, 'user_sessions')} className="flex items-center gap-2 border px-3 py-1.5 rounded-md"><Icon.Download/> Export</button>}
    >
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-[900px] w-full text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left">
              <th className="px-3 py-2">User</th>
              <th className="px-3 py-2">Role</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Login</th>
              <th className="px-3 py-2">Last Active</th>
              <th className="px-3 py-2">IP</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((u)=> (
              <tr key={u.id} className="hover:bg-slate-50">
                <td className="px-3 py-2 font-medium">{u.name} <span className="text-xs text-slate-500 ml-1">({u.id})</span></td>
                <td className="px-3 py-2">{title(u.role)}</td>
                <td className="px-3 py-2">
                  {u.blocked ? <Badge tone="red">Blocked</Badge> : (u.online ? <Badge tone="green">Online</Badge> : <Badge>Offline</Badge>)}
                </td>
                <td className="px-3 py-2">{fmtDT(u.loginAt)}</td>
                <td className="px-3 py-2">{fmtDT(u.lastActive)}</td>
                <td className="px-3 py-2">{u.ip}</td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    {u.blocked ? (
                      <button onClick={()=>blockUser(u.id, false)} className="px-2 py-1 rounded border bg-white text-sm flex items-center gap-1"><Icon.Unblock/> Unblock</button>
                    ) : (
                      <button onClick={()=>blockUser(u.id, true)} className="px-2 py-1 rounded border bg-white text-sm flex items-center gap-1"><Icon.Block/> Block</button>
                    )}
                    <button disabled={!u.online} onClick={()=>revokeSession(u.id)} className={`px-2 py-1 rounded border text-sm flex items-center gap-1 ${u.online?"bg-white":"opacity-50 cursor-not-allowed"}`}><Icon.Logout/> Revoke</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );

  const AttendanceView = (
    <Card
      title="Attendance (Manual Entry)"
      actions={<button onClick={()=>exportCSV(attendance, 'attendance')} className="flex items-center gap-2 border px-3 py-1.5 rounded-md"><Icon.Download/> Export</button>}
    >
      <form onSubmit={addAttendance} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
        <div>
          <label className="text-sm text-slate-600">Staff/User ID *</label>
          <input value={attForm.id} onChange={(e)=>setAttForm((p)=>({...p,id:e.target.value}))} className="mt-1 w-full rounded-md border px-3 py-2" placeholder="e.g. 9018" />
        </div>
        <div>
          <label className="text-sm text-slate-600">Date *</label>
          <input type="date" value={attForm.date} onChange={(e)=>setAttForm((p)=>({...p,date:e.target.value}))} className="mt-1 w-full rounded-md border px-3 py-2" />
        </div>
        <div>
          <label className="text-sm text-slate-600">In Time *</label>
          <input type="time" value={attForm.inTime} onChange={(e)=>setAttForm((p)=>({...p,inTime:e.target.value}))} className="mt-1 w-full rounded-md border px-3 py-2" />
        </div>
        <div>
          <label className="text-sm text-slate-600">Out Time</label>
          <input type="time" value={attForm.outTime} onChange={(e)=>setAttForm((p)=>({...p,outTime:e.target.value}))} className="mt-1 w-full rounded-md border px-3 py-2" />
        </div>
        <div className="md:col-span-1 flex gap-2">
          <button type="submit" className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md"><Icon.Plus/> Add</button>
        </div>
      </form>

      <div className="mt-4 overflow-x-auto rounded-lg border">
        <table className="min-w-[700px] w-full text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left">
              <th className="px-3 py-2">ID</th>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">In</th>
              <th className="px-3 py-2">Out</th>
              <th className="px-3 py-2">Duration</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {attendance.map((a, idx)=> (
              <tr key={idx} className="hover:bg-slate-50">
                <td className="px-3 py-2 font-medium">{a.id}</td>
                <td className="px-3 py-2">{a.date}</td>
                <td className="px-3 py-2">{a.inTime || "—"}</td>
                <td className="px-3 py-2">{a.outTime || "—"}</td>
                <td className="px-3 py-2">{duration(a.inTime, a.outTime)}</td>
              </tr>
            ))}
            {attendance.length === 0 && (
              <tr><td colSpan={5} className="text-center py-6 text-slate-500">No entries</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-slate-100 p-4">
      <div className="rounded-lg border bg-white overflow-hidden">
        {/* header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="text-base font-semibold">Settings</div>
          <div className="text-xs text-slate-600">Admin Console</div>
        </div>

        {/* tabs */}
        <div className="px-4 border-b bg-slate-50">
          <div className="flex flex-wrap items-center gap-2">
            {[
              {k:"general",label:"General"},
              {k:"notify",label:"Notifications"},
              {k:"roles",label:"Roles & Permissions"},
              {k:"langs",label:"Languages"},
              {k:"sessions",label:"User Sessions"},
              {k:"attendance",label:"Attendance"},
            ].map((t)=> (
              <button key={t.k} onClick={()=>setTab(t.k)} className={`px-3 py-2 text-sm border-b-2 -mb-[1px] ${tab===t.k?"border-blue-600 text-blue-700":"border-transparent text-slate-600"}`}>{t.label}</button>
            ))}
          </div>
        </div>

        {/* body */}
        <div className="p-4 grid grid-cols-1 gap-4">
          {tab === "general" && GeneralView}
          {tab === "notify" && NotifyView}
          {tab === "roles" && RolesView}
          {tab === "langs" && LangView}
          {tab === "sessions" && SessionsView}
          {tab === "attendance" && AttendanceView}
        </div>
      </div>
    </div>
  );
};

export default Settings;
