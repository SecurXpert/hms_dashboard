// import React, { useEffect, useMemo, useRef, useState } from "react";

// /* =====================================
//    Attendance.jsx — standalone page
//    - Great UI with Tailwind (no external deps)
//    - Auto-attendance seeding for the selected month (Mon–Sat = P, Sun = H)
//    - Manual attendance editing (matrix + bulk/day editor)
//    - Leave management (range → marks L)
//    - Month export/import (CSV)
//    - Persists to localStorage so it reflects across the app
//    -------------------------------------
//    Storage keys (customize if needed):
//    - HR_STAFF: optional staff array [{id,name,role,...}]. If missing, seeds from a small default list.
//    - HR_ATTENDANCE_V1: { [staffId]: { [YYYY-MM]: { [day]: 'P'|'A'|'L'|'H' } } }
//    - HR_LEAVES_V1: Leave objects -> [{id, staffId, from, to, type, reason, status}]
//    ===================================== */

// /* ---------- helpers ---------- */
// const titleCase = (s = "") => s.replace(/\b\w/g, (m) => m.toUpperCase());
// const pad2 = (n) => String(n).padStart(2, "0");
// const pad4 = (n) => String(n).padStart(4, "0");
// const monthKey = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}`;
// const daysInMonth = (y, mIndex) => new Date(y, mIndex + 1, 0).getDate();
// const getMonthDates = (y, mIndex) => Array.from({ length: daysInMonth(y, mIndex) }, (_, i) => new Date(y, mIndex, i + 1));
// const isSunday = (d) => d.getDay() === 0;
// const ls = {
//   get: (k, fb) => {
//     try { const raw = localStorage.getItem(k); return raw ? JSON.parse(raw) : fb; } catch { return fb; }
//   },
//   set: (k, v) => localStorage.setItem(k, JSON.stringify(v)),
// };

// /* ---------- UI atoms ---------- */
// const ToolbarButton = ({ children, onClick, variant = "default", disabled }) => {
//   const styles =
//     variant === "primary"
//       ? "bg-blue-600 text-white hover:bg-blue-700"
//       : variant === "danger"
//       ? "bg-red-600 text-white hover:bg-red-700"
//       : variant === "success"
//       ? "bg-emerald-600 text-white hover:bg-emerald-700"
//       : "border bg-white hover:bg-slate-50";
//   return (
//     <button onClick={onClick} disabled={disabled} className={`rounded-md px-3 py-2 text-sm ${styles} disabled:opacity-60 disabled:cursor-not-allowed`}>
//       {children}
//     </button>
//   );
// };

// const LegendDot = ({ label, color }) => (
//   <span className="inline-flex items-center gap-1 text-xs text-slate-600">
//     <span className={`w-2 h-2 rounded-full ${color}`} /> {label}
//   </span>
// );

// const StatCard = ({ label, value, tone = "slate" }) => (
//   <div className={`rounded-xl border p-4 bg-${tone}-50`}> 
//     <div className="text-xs uppercase text-slate-500">{label}</div>
//     <div className="text-xl font-semibold">{value}</div>
//   </div>
// );

// const Badge = ({ children }) => (
//   <span className="px-2 py-0.5 rounded-md text-xs bg-slate-100 text-slate-700 border">{children}</span>
// );

// /* ---------- Modals ---------- */
// const Modal = ({ open, onClose, title, children, footer }) => {
//   if (!open) return null;
//   return (
//     <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
//       <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden">
//         <div className="px-4 py-3 border-b flex items-center justify-between">
//           <div className="font-semibold">{title}</div>
//           <button onClick={onClose} className="text-xl leading-none">×</button>
//         </div>
//         <div className="p-4">{children}</div>
//         {footer && <div className="px-4 py-3 border-t bg-slate-50">{footer}</div>}
//       </div>
//     </div>
//   );
// };

// /* ---------- CSV helpers ---------- */
// const toCsv = (rows) => rows.map((r) => r.map((c) => `${String(c).replace(/"/g, '""')}`)).map((r) => r.join(",")).join("\n");
// const fromCsv = async (file) => {
//   const text = await file.text();
//   // super-simple CSV split (no quoted commas in our export), first row is header
//   return text.trim().split(/\r?\n/).map((line) => line.split(","));
// };

// /* ---------- Attendance Page ---------- */
// const Attendance = () => {
//   // 1) Staff source — try to read from HR_STAFF to stay in sync with the rest of the app.
//   const seedStaff = [
//     { id: "9002", name: "DR.Srinivas", role: "doctor" },
//     { id: "9008", name: "DR.Sneha", role: "doctor" },
//     { id: "9011", name: "DR.Pavan", role: "doctor" },
//     { id: "9010", name: "Jahnavi", role: "nurse" },
//     { id: "9012", name: "Ashritha", role: "pharmacy" },
//     { id: "9017", name: "Tejaswini", role: "admin" },
//   ];
//   const staff = ls.get("HR_STAFF", seedStaff);

//   // 2) Core stores
//   const [attendance, setAttendance] = useState(() => ls.get("HR_ATTENDANCE_V1", {}));
//   const [leaves, setLeaves] = useState(() => ls.get("HR_LEAVES_V1", []));

//   useEffect(() => ls.set("HR_ATTENDANCE_V1", attendance), [attendance]);
//   useEffect(() => ls.set("HR_LEAVES_V1", leaves), [leaves]);

//   // 3) UI state
//   const today = new Date();
//   const [month, setMonth] = useState(monthKey(today));
//   const [roleFilter, setRoleFilter] = useState("");
//   const [kw, setKw] = useState("");
//   const [expanded, setExpanded] = useState({});

//   // 4) Derived
//   const [y, mIndex] = month.split("-").map(Number);
//   const year = y;
//   const monthIdx = mIndex - 1;
//   const dates = useMemo(() => getMonthDates(year, monthIdx), [year, monthIdx]);

//   const filteredStaff = useMemo(() => {
//     const q = kw.trim().toLowerCase();
//     return staff.filter((s) => {
//       const roleOk = roleFilter ? s.role === roleFilter : true;
//       const kwOk = !q || [s.name, s.id, s.role].join(" ").toLowerCase().includes(q);
//       return roleOk && kwOk;
//     });
//   }, [staff, roleFilter, kw]);

//   // 5) Auto-seed attendance on month load + apply leaves
//   useEffect(() => {
//     // ensure month buckets exist and default to P/H
//     setAttendance((prev) => {
//       const next = { ...prev };
//       filteredStaff.forEach((s) => {
//         next[s.id] = next[s.id] || {};
//         if (!next[s.id][month]) {
//           const rec = {};
//           dates.forEach((d, i) => {
//             rec[i + 1] = isSunday(d) ? "H" : "P";
//           });
//           next[s.id][month] = rec;
//         }
//       });
//       return next;
//     });
//   }, [filteredStaff, month, dates.length]);

//   // apply approved leaves to codes (L) for current month
//   useEffect(() => {
//     if (!leaves?.length) return;
//     setAttendance((prev) => {
//       const next = { ...prev };
//       leaves.forEach((lv) => {
//         if (lv.status !== "Approved") return;
//         const f = new Date(lv.from);
//         const t = new Date(lv.to);
//         const key = monthKey(f);
//         if (key !== month) return;
//         next[lv.staffId] = next[lv.staffId] || {};
//         next[lv.staffId][key] = { ...(next[lv.staffId][key] || {}) };
//         for (let d = new Date(f); d <= t; d.setDate(d.getDate() + 1)) {
//           if (monthKey(d) !== key) continue;
//           const day = d.getDate();
//           next[lv.staffId][key][day] = isSunday(d) ? "H" : "L";
//         }
//       });
//       return next;
//     });
//   }, [leaves, month]);

//   /* ----------- Summary ----------- */
//   const summary = useMemo(() => {
//     let present = 0, absent = 0, leave = 0, holiday = 0;
//     filteredStaff.forEach((s) => {
//       const rec = attendance[s.id]?.[month] || {};
//       dates.forEach((d, i) => {
//         const code = rec[i + 1] ?? (isSunday(d) ? "H" : "P");
//         if (code === "P") present++;
//         else if (code === "A") absent++;
//         else if (code === "L") leave++;
//         else if (code === "H") holiday++;
//       });
//     });
//     return { present, absent, leave, holiday };
//   }, [attendance, filteredStaff, month, dates.length]);

//   /* ----------- Mutations ----------- */
//   const setCode = (staffId, day, nextCode) => {
//     setAttendance((prev) => {
//       const clone = { ...prev };
//       clone[staffId] = clone[staffId] || {};
//       clone[staffId][month] = { ...(clone[staffId][month] || {}) };
//       clone[staffId][month][day] = nextCode;
//       return clone;
//     });
//   };

//   const cycleCode = (staffId, d) => {
//     const day = d.getDate();
//     const cur = attendance[staffId]?.[month]?.[day] ?? (isSunday(d) ? "H" : "P");
//     const next = cur === "P" ? "A" : cur === "A" ? "L" : cur === "L" ? (isSunday(d) ? "H" : "P") : "P";
//     setCode(staffId, day, next);
//   };

//   const markAllForDate = (d, code) => {
//     const day = d.getDate();
//     setAttendance((prev) => {
//       const next = { ...prev };
//       filteredStaff.forEach((s) => {
//         next[s.id] = next[s.id] || {};
//         next[s.id][month] = { ...(next[s.id][month] || {}) };
//         // Keep Sunday as H if code isn't H
//         const final = isSunday(d) ? "H" : code;
//         next[s.id][month][day] = final;
//       });
//       return next;
//     });
//   };

//   /* ----------- Leave modal ----------- */
//   const [leaveOpen, setLeaveOpen] = useState(false);
//   const [leaveForm, setLeaveForm] = useState({ staffId: "", from: "", to: "", type: "Paid", reason: "" });
//   const saveLeave = () => {
//     const { staffId, from, to } = leaveForm;
//     if (!staffId || !from || !to) return alert("Select staff and date range");
//     const id = `LV-${pad4(leaves.length + 1)}`;
//     const entry = { ...leaveForm, id, status: "Approved" };
//     setLeaves((p) => [...p, entry]);
//     // apply immediately
//     const f = new Date(entry.from); const t = new Date(entry.to);
//     setAttendance((prev) => {
//       const next = { ...prev };
//       const key = monthKey(f);
//       next[staffId] = next[staffId] || {};
//       next[staffId][key] = { ...(next[staffId][key] || {}) };
//       for (let d = new Date(f); d <= t; d.setDate(d.getDate() + 1)) {
//         if (monthKey(d) !== key) continue;
//         next[staffId][key][d.getDate()] = isSunday(d) ? "H" : "L";
//       }
//       return next;
//     });
//     setLeaveOpen(false);
//     setLeaveForm({ staffId: "", from: "", to: "", type: "Paid", reason: "" });
//   };

//   /* ----------- Day editor (bulk) ----------- */
//   const [dayEditor, setDayEditor] = useState({ open: false, date: null });

//   /* ----------- Export / Import ----------- */
//   const exportMonth = () => {
//     const header = ["Staff ID", "Name", ...dates.map((d) => `${pad2(d.getDate())}`)];
//     const rows = [header];
//     filteredStaff.forEach((s) => {
//       const rec = attendance[s.id]?.[month] || {};
//       const row = [s.id, s.name, ...dates.map((d, i) => rec[i + 1] ?? (isSunday(d) ? "H" : "P"))];
//       rows.push(row);
//     });
//     const blob = new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8;" });
//     const a = document.createElement("a");
//     a.href = URL.createObjectURL(blob);
//     a.download = `attendance_${month}.csv`;
//     a.click();
//   };

//   const importRef = useRef(null);
//   const importMonth = async (file) => {
//     const rows = await fromCsv(file);
//     // Expect header: Staff ID, Name, 01, 02, ...
//     const head = rows[0];
//     const dayCols = head.slice(2).map((h) => Number(h));
//     const updates = {};
//     rows.slice(1).forEach((r) => {
//       const staffId = r[0];
//       if (!staffId) return;
//       updates[staffId] = updates[staffId] || {};
//       updates[staffId][month] = updates[staffId][month] || {};
//       dayCols.forEach((d, idx) => {
//         const code = (r[idx + 2] || "").toUpperCase();
//         if (["P", "A", "L", "H"].includes(code)) updates[staffId][month][d] = code;
//       });
//     });
//     setAttendance((prev) => ({ ...prev, ...updates }));
//   };

//   /* ----------- UI ----------- */
//   const roleOptions = Array.from(new Set(staff.map((s) => s.role)));

//   return (
//     <div className="min-h-screen bg-slate-100 p-4">
//       <div className="rounded-2xl border bg-white overflow-hidden">
//         {/* Header */}
//         <div className="px-4 py-3 border-b flex flex-wrap items-center gap-3">
//           <div className="text-base font-semibold">Staff Attendance</div>
//           <div className="ml-auto flex items-end gap-3">
//             <div>
//               <div className="text-xs text-slate-600">Month</div>
//               <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="border rounded-md px-3 py-2 text-sm" />
//             </div>
//             <div>
//               <div className="text-xs text-slate-600">Role</div>
//               <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="border rounded-md px-3 py-2 text-sm min-w-[160px]">
//                 <option value="">All</option>
//                 {roleOptions.map((r) => (
//                   <option key={r} value={r}>{titleCase(r)}</option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <div className="text-xs text-slate-600">Search</div>
//               <input value={kw} onChange={(e) => setKw(e.target.value)} placeholder="Name / ID / Role" className="border rounded-md px-3 py-2 text-sm min-w-[200px]" />
//             </div>
//           </div>
//         </div>

//         {/* Top stats & actions */}
//         <div className="px-4 py-3 border-b flex flex-wrap items-center gap-3">
//           <div className="grid grid-cols-2 md:grid-cols-5 gap-3 flex-1">
//             <StatCard label="Present (P)" value={summary.present} />
//             <StatCard label="Absent (A)" value={summary.absent} />
//             <StatCard label="Leave (L)" value={summary.leave} />
//             <StatCard label="Holiday (H)" value={summary.holiday} />
//             <StatCard label="Staff" value={filteredStaff.length} />
//           </div>
//           <div className="flex flex-col gap-2">
//             <ToolbarButton onClick={() => setLeaveOpen(true)} variant="primary">+ Add Leave</ToolbarButton>
//             <div className="flex gap-2">
//               <ToolbarButton onClick={exportMonth}>Export CSV</ToolbarButton>
//               <input ref={importRef} type="file" accept=".csv" className="hidden" onChange={(e) => e.target.files?.[0] && importMonth(e.target.files[0])} />
//               <ToolbarButton onClick={() => importRef.current?.click()}>Import CSV</ToolbarButton>
//             </div>
//           </div>
//         </div>

//         {/* Legend & bulk day editor */}
//         <div className="px-4 py-2 flex flex-wrap items-center gap-4">
//           <LegendDot label="Present" color="bg-green-500" />
//           <LegendDot label="Absent" color="bg-red-500" />
//           <LegendDot label="Leave" color="bg-yellow-500" />
//           <LegendDot label="Holiday" color="bg-slate-400" />
//           <div className="ml-auto text-xs text-slate-500">Tip: Click a cell to cycle P → A → L → H → P</div>
//         </div>

//         {/* Matrix */}
//         <div className="overflow-auto border-t">
//           <table className="min-w-[1000px] w-full">
//             <thead className="sticky top-0 bg-slate-50 border-b text-xs uppercase text-slate-600">
//               <tr>
//                 <th className="px-3 py-2 text-left w-[280px]">Staff</th>
//                 {dates.map((d) => (
//                   <th key={d.toISOString()} className="px-2 py-2 text-center">
//                     <button
//                       className="px-2 py-1 rounded hover:bg-slate-100"
//                       title={d.toDateString()}
//                       onClick={() => setDayEditor({ open: true, date: d })}
//                     >
//                       {pad2(d.getDate())}
//                     </button>
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {filteredStaff.map((s) => {
//                 const rec = attendance[s.id]?.[month] || {};
//                 return (
//                   <tr key={s.id} className="odd:bg-white even:bg-slate-50 border-b">
//                     <td className="px-3 py-2 text-sm align-top">
//                       <div className="font-medium">{s.name} <span className="text-xs text-slate-500">({s.id})</span></div>
//                       <div className="text-xs text-slate-500">{titleCase(s.role)}</div>
//                     </td>
//                     {dates.map((d, i) => {
//                       const day = i + 1;
//                       const code = rec[day] ?? (isSunday(d) ? "H" : "P");
//                       const tone = code === "P" ? "bg-green-100 text-green-700" : code === "A" ? "bg-red-100 text-red-700" : code === "L" ? "bg-yellow-100 text-yellow-700" : "bg-slate-100 text-slate-600";
//                       return (
//                         <td key={d.toISOString()} className="px-1 py-1 text-center">
//                           <button
//                             onClick={() => cycleCode(s.id, d)}
//                             className={`w-8 h-7 rounded ${tone} text-xs font-medium hover:opacity-90`}
//                             title={`${d.toDateString()} — Click to cycle`}
//                           >
//                             {code}
//                           </button>
//                         </td>
//                       );
//                     })}
//                   </tr>
//                 );
//               })}
//               {filteredStaff.length === 0 && (
//                 <tr>
//                   <td colSpan={dates.length + 1} className="px-3 py-8 text-center text-sm text-slate-500">No staff match the current filters.</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Leave modal */}
//       <Modal
//         open={leaveOpen}
//         onClose={() => setLeaveOpen(false)}
//         title="Add Leave"
//         footer={
//           <div className="flex justify-end gap-2">
//             <ToolbarButton onClick={() => setLeaveOpen(false)}>Cancel</ToolbarButton>
//             <ToolbarButton onClick={saveLeave} variant="primary">Save</ToolbarButton>
//           </div>
//         }
//       >
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <label className="text-sm">
//             <span className="block text-slate-600 mb-1">Staff *</span>
//             <select value={leaveForm.staffId} onChange={(e) => setLeaveForm((c) => ({ ...c, staffId: e.target.value }))} className="w-full border rounded-md px-3 py-2">
//               <option value="">Select staff</option>
//               {staff.map((s) => (
//                 <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
//               ))}
//             </select>
//           </label>
//           <label className="text-sm">
//             <span className="block text-slate-600 mb-1">Type *</span>
//             <select value={leaveForm.type} onChange={(e) => setLeaveForm((c) => ({ ...c, type: e.target.value }))} className="w-full border rounded-md px-3 py-2">
//               <option>Paid</option>
//               <option>Unpaid</option>
//               <option>Sick</option>
//               <option>Casual</option>
//             </select>
//           </label>
//           <label className="text-sm">
//             <span className="block text-slate-600 mb-1">From *</span>
//             <input type="date" value={leaveForm.from} onChange={(e) => setLeaveForm((c) => ({ ...c, from: e.target.value }))} className="w-full border rounded-md px-3 py-2" />
//           </label>
//           <label className="text-sm">
//             <span className="block text-slate-600 mb-1">To *</span>
//             <input type="date" value={leaveForm.to} onChange={(e) => setLeaveForm((c) => ({ ...c, to: e.target.value }))} className="w-full border rounded-md px-3 py-2" />
//           </label>
//           <label className="text-sm md:col-span-2">
//             <span className="block text-slate-600 mb-1">Reason</span>
//             <textarea value={leaveForm.reason} onChange={(e) => setLeaveForm((c) => ({ ...c, reason: e.target.value }))} className="w-full border rounded-md px-3 py-2 min-h-[90px]" placeholder="Optional notes" />
//           </label>
//         </div>
//       </Modal>

//       {/* Day bulk editor */}
//       <Modal
//         open={dayEditor.open}
//         onClose={() => setDayEditor({ open: false, date: null })}
//         title={dayEditor.date ? `Bulk Edit — ${dayEditor.date.toDateString()}` : "Bulk Edit"}
//         footer={
//           <div className="flex flex-wrap justify-between items-center gap-2">
//             <div className="text-xs text-slate-600">This affects <b>{filteredStaff.length}</b> staff currently shown.</div>
//             <div className="flex gap-2">
//               <ToolbarButton onClick={() => { markAllForDate(dayEditor.date, 'P'); setDayEditor({ open: false, date: null }); }} variant="success">Mark All P</ToolbarButton>
//               <ToolbarButton onClick={() => { markAllForDate(dayEditor.date, 'A'); setDayEditor({ open: false, date: null }); }} variant="danger">Mark All A</ToolbarButton>
//               <ToolbarButton onClick={() => { markAllForDate(dayEditor.date, 'L'); setDayEditor({ open: false, date: null }); }}>Mark All L</ToolbarButton>
//               <ToolbarButton onClick={() => { markAllForDate(dayEditor.date, 'H'); setDayEditor({ open: false, date: null }); }}>Mark All H</ToolbarButton>
//             </div>
//           </div>
//         }
//       >
//         <div className="text-sm text-slate-700">
//           Choose a bulk action to apply to all visible staff for <b>{dayEditor.date ? dayEditor.date.toDateString() : '-'}</b>.
//           Sundays are always treated as <b>H</b>.
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default Attendance;
import React, { useEffect, useMemo, useRef, useState } from "react";

/* =====================================
   Attendance.jsx — standalone page (no backend)
   - Super Admin view for Staff Attendance & Leave Management
   - Great UI with Tailwind (no external deps)
   - Auto-seeding for a selected month (Mon–Sat = P, Sun = H)
   - Manual editing via quick cycle (click) + Detailed editor (double-click)
   - Day details: Shift, Check-In/Out, Work Hours (auto), Status (P/A/L/HD/H), Late flag, Overtime, Night Duty, On-Call, Remarks
   - Leave management with Type, Duration, Approval Status; applies automatically when Approved
   - Export: CSV (status-only) + JSON (full data); Import: CSV (status-only) + JSON (full data)
   - Persists to localStorage so it reflects across the app
   -------------------------------------
   Storage keys:
   - HR_STAFF: [{id, name, department, designation, role}]
   - HR_ATTENDANCE_V2: { [staffId]: { [YYYY-MM]: { [day]: DayRecord } } }
   - HR_LEAVES_V2: [{id, staffId, from, to, type, duration, reason, status}]
   ===================================== */

/* ---------- helpers ---------- */
const titleCase = (s = "") => s.replace(/\b\w/g, (m) => m.toUpperCase());
const pad2 = (n) => String(n).padStart(2, "0");
const pad3 = (n) => String(n).padStart(3, "0");
const pad4 = (n) => String(n).padStart(4, "0");
const monthKey = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}`;
const daysInMonth = (y, mIndex) => new Date(y, mIndex + 1, 0).getDate();
const getMonthDates = (y, mIndex) => Array.from({ length: daysInMonth(y, mIndex) }, (_, i) => new Date(y, mIndex, i + 1));
const isSunday = (d) => d.getDay() === 0;
const toISODate = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

const ls = {
  get: (k, fb) => {
    try {
      const raw = localStorage.getItem(k);
      return raw ? JSON.parse(raw) : fb;
    } catch {
      return fb;
    }
  },
  set: (k, v) => localStorage.setItem(k, JSON.stringify(v)),
};

/* Time helpers */
const parseHM = (s) => {
  if (!s || !/^[0-2]?\d:\d{2}$/.test(s)) return null;
  const [hh, mm] = s.split(":").map(Number);
  if (hh > 23 || mm > 59) return null;
  return hh * 60 + mm; // minutes since 00:00
};
const minutesToHM = (mins) => {
  if (mins == null) return "";
  const sign = mins < 0 ? "-" : "";
  const m = Math.abs(mins);
  const h = Math.floor(m / 60);
  const mm = pad2(m % 60);
  return `${sign}${h}:${mm}`;
};
const diffMinutes = (inMin, outMin) => {
  if (inMin == null || outMin == null) return null;
  // cross-midnight support: if out < in, assume next day
  return outMin >= inMin ? outMin - inMin : outMin + 24 * 60 - inMin;
};
const round2 = (n) => Math.round(n * 100) / 100;

/* Shift definitions (for smart calculations) */
const SHIFTS = {
  Morning: { start: parseHM("09:00"), end: parseHM("17:00"), hours: 8 },
  Evening: { start: parseHM("17:00"), end: parseHM("01:00"), hours: 8 },
  Night: { start: parseHM("01:00"), end: parseHM("09:00"), hours: 8 },
  General: { start: parseHM("09:00"), end: parseHM("17:00"), hours: 8 },
};

/* ---------- UI atoms ---------- */
const ToolbarButton = ({ children, onClick, variant = "default", disabled }) => {
  const styles =
    variant === "primary"
      ? "bg-blue-600 text-white hover:bg-blue-700"
      : variant === "danger"
      ? "bg-red-600 text-white hover:bg-red-700"
      : variant === "success"
      ? "bg-emerald-600 text-white hover:bg-emerald-700"
      : "border bg-white hover:bg-slate-50";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-md px-3 py-2 text-sm font-medium ${styles} disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-md`}
    >
      {children}
    </button>
  );
};

const LegendDot = ({ label, color }) => (
  <span className="inline-flex items-center gap-1 text-xs text-slate-600">
    <span className={`w-2 h-2 rounded-full ${color} transition-all duration-200`} /> {label}
  </span>
);

const StatCard = ({ label, value, tone = "slate" }) => (
  <div
    className={`rounded-xl border p-4 bg-${tone}-50 hover:shadow-md transition-all duration-200`}
  >
    <div className="text-xs uppercase text-slate-500">{label}</div>
    <div className="text-xl font-semibold">{value}</div>
  </div>
);

const Badge = ({ children }) => (
  <span className="px-2 py-0.5 rounded-md text-xs bg-slate-100 text-slate-700 border hover:bg-slate-200 transition-all duration-200">
    {children}
  </span>
);

/* ---------- Modals ---------- */
const Modal = ({ open, onClose, title, children, footer }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 transition-all duration-300">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 scale-100">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <div className="font-semibold text-lg">{title}</div>
          <button
            onClick={onClose}
            className="text-xl leading-none hover:text-red-500 transition-all duration-200"
          >
            ×
          </button>
        </div>
        <div className="p-4">{children}</div>
        {footer && <div className="px-4 py-3 border-t bg-slate-50">{footer}</div>}
      </div>
    </div>
  );
};

/* ---------- CSV/JSON helpers ---------- */
const toCsv = (rows) =>
  rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`)).map((r) => r.join(",")).join("\n");

const fromCsv = async (file) => {
  const text = await file.text();
  return text
    .trim()
    .split(/\r?\n/)
    .map((line) => line.split(",").map((c) => c.replace(/^"|"$/g, "").replace(/""/g, '"')));
};

const toJson = (data) => JSON.stringify(data, null, 2);

const fromJson = async (file) => {
  const text = await file.text();
  try {
    return JSON.parse(text);
  } catch {
    alert("Invalid JSON file");
    return null;
  }
};

/* ---------- Attendance Page ---------- */
const Attendance = () => {
  // 1) Staff source
  const seedStaff = [
    { id: "S001", name: "Dr. Srinivas", department: "Cardiology", designation: "Senior Consultant", role: "Doctor" },
    { id: "S002", name: "Dr. Sneha", department: "Radiology", designation: "Radiologist", role: "Doctor" },
    { id: "S003", name: "Dr. Pavan", department: "Pharmacy", designation: "Pharmacist", role: "Doctor" },
    { id: "S004", name: "Jahnavi", department: "Nursing", designation: "Head Nurse", role: "Nurse" },
    { id: "S005", name: "Ashritha", department: "Pharmacy", designation: "Pharmacy Technician", role: "Technician" },
    { id: "S006", name: "Tejaswini", department: "Admin", designation: "HR Manager", role: "Admin" },
  ];
  const [staff, setStaff] = useState(() => ls.get("HR_STAFF", seedStaff));

  // 2) Core stores
  const [attendance, setAttendance] = useState(() => ls.get("HR_ATTENDANCE_V2", {}));
  const [leaves, setLeaves] = useState(() => ls.get("HR_LEAVES_V2", []));

  useEffect(() => ls.set("HR_STAFF", staff), [staff]);
  useEffect(() => ls.set("HR_ATTENDANCE_V2", attendance), [attendance]);
  useEffect(() => ls.set("HR_LEAVES_V2", leaves), [leaves]);

  // 3) UI state
  const today = new Date();
  const [month, setMonth] = useState(monthKey(today));
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [kw, setKw] = useState("");
  const [staffModalOpen, setStaffModalOpen] = useState(false);
  const [staffForm, setStaffForm] = useState({ id: "", name: "", department: "", designation: "", role: "" });
  const [editStaffId, setEditStaffId] = useState(null);
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    staffId: "",
    from: "",
    to: "",
    type: "Sick Leave",
    duration: "Full day",
    reason: "",
    status: "Pending",
  });
  const [detailEditor, setDetailEditor] = useState({ open: false, staffId: null, date: null });
  const [detailForm, setDetailForm] = useState({
    status: "Present",
    shift: "General",
    checkIn: "",
    checkOut: "",
    overtime: 0,
    nightDuty: false,
    onCall: false,
    remarks: "",
    late: false,
  });
  const [bulkEditor, setBulkEditor] = useState({ open: false, date: null });

  // 4) Derived
  const [y, mIndex] = month.split("-").map(Number);
  const year = y;
  const monthIdx = mIndex - 1;
  const dates = useMemo(() => getMonthDates(year, monthIdx), [year, monthIdx]);

  const filteredStaff = useMemo(() => {
    const q = kw.trim().toLowerCase();
    return staff.filter((s) => {
      const deptOk = departmentFilter ? s.department === departmentFilter : true;
      const roleOk = roleFilter ? s.role === roleFilter : true;
      const kwOk = !q || [s.name, s.id, s.department, s.designation, s.role].join(" ").toLowerCase().includes(q);
      return deptOk && roleOk && kwOk;
    });
  }, [staff, departmentFilter, roleFilter, kw]);

  // 5) Auto-seed attendance on month load
  useEffect(() => {
    setAttendance((prev) => {
      const next = { ...prev };
      filteredStaff.forEach((s) => {
        next[s.id] = next[s.id] || {};
        if (!next[s.id][month]) {
          const rec = {};
          dates.forEach((d, i) => {
            rec[i + 1] = {
              status: isSunday(d) ? "Holiday" : "Present",
              shift: "General",
              checkIn: "",
              checkOut: "",
              overtime: 0,
              nightDuty: false,
              onCall: false,
              remarks: "",
              late: false,
            };
          });
          next[s.id][month] = rec;
        }
      });
      return next;
    });
  }, [filteredStaff, month, dates.length]);

  // Apply approved leaves
  useEffect(() => {
    if (!leaves?.length) return;
    setAttendance((prev) => {
      const next = { ...prev };
      leaves.forEach((lv) => {
        if (lv.status !== "Approved") return;
        const f = new Date(lv.from);
        const t = new Date(lv.to);
        const key = monthKey(f);
        if (key !== month) return;
        next[lv.staffId] = next[lv.staffId] || {};
        next[lv.staffId][key] = { ...(next[lv.staffId][key] || {}) };
        for (let d = new Date(f); d <= t; d.setDate(d.getDate() + 1)) {
          if (monthKey(d) !== key) continue;
          const day = d.getDate();
          const existing = next[lv.staffId][key][day] || {};
          next[lv.staffId][key][day] = {
            ...existing,
            status: isSunday(d) ? "Holiday" : lv.duration === "Half day" ? "Half Day" : "On Leave",
            remarks: lv.reason || existing.remarks,
            checkIn: "",
            checkOut: "",
            overtime: 0,
            nightDuty: false,
            onCall: false,
            late: false,
          };
        }
      });
      return next;
    });
  }, [leaves, month]);

  /* ----------- Summary ----------- */
  const summary = useMemo(() => {
    let present = 0,
      absent = 0,
      late = 0,
      halfDay = 0,
      onLeave = 0,
      holiday = 0,
      totalOvertime = 0;
    filteredStaff.forEach((s) => {
      const rec = attendance[s.id]?.[month] || {};
      dates.forEach((d, i) => {
        const entry = rec[i + 1] ?? { status: isSunday(d) ? "Holiday" : "Present", overtime: 0 };
        if (entry.status === "Present") present++;
        else if (entry.status === "Absent") absent++;
        else if (entry.status === "Late") late++;
        else if (entry.status === "Half Day") halfDay++;
        else if (entry.status === "On Leave") onLeave++;
        else if (entry.status === "Holiday") holiday++;
        totalOvertime += entry.overtime || 0;
      });
    });
    return { present, absent, late, halfDay, onLeave, holiday, totalOvertime };
  }, [attendance, filteredStaff, month, dates.length]);

  /* ----------- Mutations ----------- */
  const setEntry = (staffId, day, updates) => {
    setAttendance((prev) => {
      const clone = { ...prev };
      clone[staffId] = clone[staffId] || {};
      clone[staffId][month] = { ...(clone[staffId][month] || {}) };
      const existing = clone[staffId][month][day] || {};
      const newEntry = { ...existing, ...updates };
      // Auto-calculate late flag
      if (newEntry.checkIn && newEntry.shift in SHIFTS) {
        const checkInMin = parseHM(newEntry.checkIn);
        const shiftStart = SHIFTS[newEntry.shift].start;
        newEntry.late = checkInMin != null && shiftStart != null && checkInMin > shiftStart + 15; // 15-min grace
      } else {
        newEntry.late = false;
      }
      clone[staffId][month][day] = newEntry;
      return clone;
    });
  };

  const cycleStatus = (staffId, d) => {
    const day = d.getDate();
    const cur = attendance[staffId]?.[month]?.[day]?.status ?? (isSunday(d) ? "Holiday" : "Present");
    const statuses = ["Present", "Absent", "Late", "Half Day", "On Leave", "Holiday"];
    const nextIdx = (statuses.indexOf(cur) + 1) % statuses.length;
    setEntry(staffId, day, { status: statuses[nextIdx] });
  };

  const markAllForDate = (d, status) => {
    const day = d.getDate();
    setAttendance((prev) => {
      const next = { ...prev };
      filteredStaff.forEach((s) => {
        next[s.id] = next[s.id] || {};
        next[s.id][month] = { ...(next[s.id][month] || {}) };
        const existing = next[s.id][month][day] || {};
        next[s.id][month][day] = {
          ...existing,
          status: isSunday(d) && status !== "Holiday" ? "Holiday" : status,
        };
      });
      return next;
    });
  };

  /* ----------- Staff Management ----------- */
  const saveStaff = () => {
    const { id, name, department, designation, role } = staffForm;
    if (!id || !name || !department || !designation || !role) return alert("All fields required");
    if (editStaffId) {
      setStaff((prev) => prev.map((s) => (s.id === editStaffId ? { ...s, name, department, designation, role } : s)));
    } else {
      if (staff.some((s) => s.id === id)) return alert("Staff ID already exists");
      setStaff((prev) => [...prev, { id, name, department, designation, role }]);
    }
    setStaffModalOpen(false);
    setStaffForm({ id: "", name: "", department: "", designation: "", role: "" });
    setEditStaffId(null);
  };

  const editStaff = (s) => {
    setStaffForm(s);
    setEditStaffId(s.id);
    setStaffModalOpen(true);
  };

  /* ----------- Leave Management ----------- */
  const saveLeave = () => {
    const { staffId, from, to, type, duration, status } = leaveForm;
    if (!staffId || !from || !to || !type || !duration || !status) return alert("Please fill all required fields");
    const id = `LV-${pad4(leaves.length + 1)}`;
    const entry = { ...leaveForm, id };
    setLeaves((p) => [...p, entry]);
    setLeaveModalOpen(false);
    setLeaveForm({
      staffId: "",
      from: "",
      to: "",
      type: "Sick Leave",
      duration: "Full day",
      reason: "",
      status: "Pending",
    });
  };

  /* ----------- Detailed Editor ----------- */
  const openDetailEditor = (staffId, d) => {
    const day = d.getDate();
    const entry =
      attendance[staffId]?.[month]?.[day] || {
        status: isSunday(d) ? "Holiday" : "Present",
        shift: "General",
        checkIn: "",
        checkOut: "",
        overtime: 0,
        nightDuty: false,
        onCall: false,
        remarks: "",
        late: false,
      };
    setDetailForm(entry);
    setDetailEditor({ open: true, staffId, date: d });
  };

  const saveDetail = () => {
    const { staffId, date } = detailEditor;
    if (!staffId || !date) return;
    const day = date.getDate();
    setEntry(staffId, day, detailForm);
    setDetailEditor({ open: false, staffId: null, date: null });
  };

  /* ----------- Export / Import ----------- */
  const exportCsv = () => {
    const header = ["Staff ID", "Name", "Department", "Designation", ...dates.map((d) => pad2(d.getDate()))];
    const rows = [header];
    filteredStaff.forEach((s) => {
      const rec = attendance[s.id]?.[month] || {};
      const row = [
        s.id,
        s.name,
        s.department,
        s.designation,
        ...dates.map((d, i) => {
          const entry = rec[i + 1] ?? { status: isSunday(d) ? "Holiday" : "Present" };
          return entry.status[0]; // P, A, L, HD, OL, H
        }),
      ];
      rows.push(row);
    });
    const blob = new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `attendance_${month}_status.csv`;
    a.click();
  };

  const exportJson = () => {
    const data = filteredStaff.map((s) => ({
      id: s.id,
      name: s.name,
      department: s.department,
      designation: s.designation,
      role: s.role,
      attendance: attendance[s.id]?.[month] || {},
    }));
    const blob = new Blob([toJson(data)], { type: "application/json;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `attendance_${month}_full.json`;
    a.click();
  };

  const csvImportRef = useRef(null);
  const jsonImportRef = useRef(null);

  const importCsv = async (file) => {
    const rows = await fromCsv(file);
    const head = rows[0];
    const dayCols = head.slice(4).map((h) => Number(h));
    const updates = {};
    rows.slice(1).forEach((r) => {
      const staffId = r[0];
      if (!staffId || !staff.some((s) => s.id === staffId)) return;
      updates[staffId] = updates[staffId] || {};
      updates[staffId][month] = updates[staffId][month] || {};
      dayCols.forEach((d, idx) => {
        const code = (r[idx + 4] || "").toUpperCase();
        const statusMap = {
          P: "Present",
          A: "Absent",
          L: "Late",
          HD: "Half Day",
          OL: "On Leave",
          H: "Holiday",
        };
        const status = statusMap[code] || (isSunday(new Date(year, monthIdx, d)) ? "Holiday" : "Present");
        updates[staffId][month][d] = {
          ...(updates[staffId][month][d] || {}),
          status,
        };
      });
    });
    setAttendance((prev) => ({ ...prev, ...updates }));
  };

  const importJson = async (file) => {
    const data = await fromJson(file);
    if (!data) return;
    const updates = {};
    data.forEach((item) => {
      if (!staff.some((s) => s.id === item.id)) return;
      updates[item.id] = updates[item.id] || {};
      updates[item.id][month] = {};
      Object.entries(item.attendance).forEach(([day, record]) => {
        updates[item.id][month][day] = {
          status: record.status || (isSunday(new Date(year, monthIdx, Number(day))) ? "Holiday" : "Present"),
          shift: record.shift || "General",
          checkIn: record.checkIn || "",
          checkOut: record.checkOut || "",
          overtime: Number(record.overtime) || 0,
          nightDuty: !!record.nightDuty,
          onCall: !!record.onCall,
          remarks: record.remarks || "",
          late: !!record.late,
        };
      });
    });
    setAttendance((prev) => ({ ...prev, ...updates }));
  };

  /* ----------- UI ----------- */
  const departmentOptions = Array.from(new Set(staff.map((s) => s.department)));
  const roleOptions = Array.from(new Set(staff.map((s) => s.role)));

  return (
    <div className="min-h-screen bg-slate-100 p-4">
      <div className="rounded-2xl border bg-white overflow-hidden shadow-lg">
        {/* Header */}
        <div className="px-4 py-3 border-b flex flex-wrap items-center gap-3">
          <div className="text-base font-semibold">Super Admin - Staff Attendance</div>
          <div className="ml-auto flex items-end gap-3 flex-wrap">
            <div>
              <div className="text-xs text-slate-600">Month</div>
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="border rounded-md px-3 py-2 text-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div>
              <div className="text-xs text-slate-600">Department</div>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="border rounded-md px-3 py-2 text-sm min-w-[160px] transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option value="">All</option>
                {departmentOptions.map((d) => (
                  <option key={d} value={d}>
                    {titleCase(d)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <div className="text-xs text-slate-600">Role</div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="border rounded-md px-3 py-2 text-sm min-w-[160px] transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option value="">All</option>
                {roleOptions.map((r) => (
                  <option key={r} value={r}>
                    {titleCase(r)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <div className="text-xs text-slate-600">Search</div>
              <input
                value={kw}
                onChange={(e) => setKw(e.target.value)}
                placeholder="Name / ID / Dept / Role"
                className="border rounded-md px-3 py-2 text-sm min-w-[200px] transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>
        </div>

        {/* Top stats & actions */}
        <div className="px-4 py-3 border-b flex flex-wrap items-center gap-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-3 flex-1">
            <StatCard label="Present" value={summary.present} tone="green" />
            <StatCard label="Absent" value={summary.absent} tone="red" />
            <StatCard label="Late" value={summary.late} tone="yellow" />
            <StatCard label="Half Day" value={summary.halfDay} tone="amber" />
            <StatCard label="On Leave" value={summary.onLeave} tone="orange" />
            <StatCard label="Holiday" value={summary.holiday} tone="slate" />
            <StatCard label="Overtime (hrs)" value={round2(summary.totalOvertime)} tone="blue" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 flex-wrap">
              <ToolbarButton
                onClick={() => {
                  setStaffForm({ id: `S${pad3(staff.length + 1)}`, name: "", department: "", designation: "", role: "" });
                  setEditStaffId(null);
                  setStaffModalOpen(true);
                }}
                variant="primary"
              >
                + Add Staff
              </ToolbarButton>
              <ToolbarButton onClick={() => setLeaveModalOpen(true)} variant="primary">
                + Add Leave
              </ToolbarButton>
            </div>
            <div className="flex gap-2 flex-wrap">
              <ToolbarButton onClick={exportCsv}>Export CSV</ToolbarButton>
              <ToolbarButton onClick={exportJson}>Export JSON</ToolbarButton>
              <input
                ref={csvImportRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && importCsv(e.target.files[0])}
              />
              <input
                ref={jsonImportRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && importJson(e.target.files[0])}
              />
              <ToolbarButton onClick={() => csvImportRef.current?.click()}>Import CSV</ToolbarButton>
              <ToolbarButton onClick={() => jsonImportRef.current?.click()}>Import JSON</ToolbarButton>
            </div>
          </div>
        </div>

        {/* Legend & tip */}
        <div className="px-4 py-2 flex flex-wrap items-center gap-4">
          <LegendDot label="Present" color="bg-green-500" />
          <LegendDot label="Absent" color="bg-red-500" />
          <LegendDot label="Late" color="bg-yellow-500" />
          <LegendDot label="Half Day" color="bg-amber-500" />
          <LegendDot label="On Leave" color="bg-orange-500" />
          <LegendDot label="Holiday" color="bg-slate-400" />
          <div className="ml-auto text-xs text-slate-500">
            Tip: Click to cycle status, double-click for details
          </div>
        </div>

        {/* Matrix */}
        <div className="overflow-auto border-t">
          <table className="min-w-[1000px] w-full">
            <thead className="sticky top-0 bg-slate-50 border-b text-xs uppercase text-slate-600">
              <tr>
                <th className="px-3 py-2 text-left w-[300px]">Staff</th>
                {dates.map((d) => (
                  <th key={d.toISOString()} className="px-2 py-2 text-center">
                    <button
                      className="px-2 py-1 rounded hover:bg-slate-100 transition-all duration-200"
                      title={d.toDateString()}
                      onClick={() => setBulkEditor({ open: true, date: d })}
                    >
                      {pad2(d.getDate())}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map((s) => {
                const rec = attendance[s.id]?.[month] || {};
                return (
                  <tr
                    key={s.id}
                    className="odd:bg-white even:bg-slate-50 border-b hover:bg-slate-100 transition-all duration-200"
                  >
                    <td className="px-3 py-2 text-sm align-top">
                      <div className="font-medium flex items-center gap-2">
                        {s.name} <span className="text-xs text-slate-500">({s.id})</span>
                        <button
                          onClick={() => editStaff(s)}
                          className="text-blue-500 text-xs hover:underline transition-all duration-200"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="text-xs text-slate-500">
                        {titleCase(s.department)} - {titleCase(s.designation)} ({titleCase(s.role)})
                      </div>
                    </td>
                    {dates.map((d, i) => {
                      const day = i + 1;
                      const entry = rec[day] ?? { status: isSunday(d) ? "Holiday" : "Present" };
                      const status = entry.status;
                      const tone =
                        status === "Present"
                          ? "bg-green-100 text-green-700"
                          : status === "Absent"
                          ? "bg-red-100 text-red-700"
                          : status === "Late"
                          ? "bg-yellow-100 text-yellow-700"
                          : status === "Half Day"
                          ? "bg-amber-100 text-amber-700"
                          : status === "On Leave"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-slate-100 text-slate-600";
                      return (
                        <td key={d.toISOString()} className="px-1 py-1 text-center">
                          <button
                            onClick={() => cycleStatus(s.id, d)}
                            onDoubleClick={() => openDetailEditor(s.id, d)}
                            className={`w-8 h-7 rounded ${tone} text-xs font-medium hover:opacity-90 transition-all duration-200`}
                            title={`${d.toDateString()} — Click to cycle, double-click for details`}
                          >
                            {status[0]}{entry.late ? "*" : ""}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
              {filteredStaff.length === 0 && (
                <tr>
                  <td colSpan={dates.length + 1} className="px-3 py-8 text-center text-sm text-slate-500">
                    No staff match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Staff Modal */}
      <Modal
        open={staffModalOpen}
        onClose={() => {
          setStaffModalOpen(false);
          setEditStaffId(null);
          setStaffForm({ id: "", name: "", department: "", designation: "", role: "" });
        }}
        title={editStaffId ? "Edit Staff" : "Add Staff"}
        footer={
          <div className="flex justify-end gap-2">
            <ToolbarButton
              onClick={() => {
                setStaffModalOpen(false);
                setEditStaffId(null);
                setStaffForm({ id: "", name: "", department: "", designation: "", role: "" });
              }}
            >
              Cancel
            </ToolbarButton>
            <ToolbarButton onClick={saveStaff} variant="primary">
              Save
            </ToolbarButton>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="text-sm">
            <span className="block text-slate-600 mb-1">Staff ID *</span>
            <input
              value={staffForm.id}
              onChange={(e) => setStaffForm((c) => ({ ...c, id: e.target.value }))}
              className="w-full border rounded-md px-3 py-2 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              disabled={!!editStaffId}
              placeholder="e.g., S007"
            />
          </label>
          <label className="text-sm">
            <span className="block text-slate-600 mb-1">Name *</span>
            <input
              value={staffForm.name}
              onChange={(e) => setStaffForm((c) => ({ ...c, name: e.target.value }))}
              className="w-full border rounded-md px-3 py-2 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="e.g., Dr. John Doe"
            />
          </label>
          <label className="text-sm">
            <span className="block text-slate-600 mb-1">Department *</span>
            <input
              value={staffForm.department}
              onChange={(e) => setStaffForm((c) => ({ ...c, department: e.target.value }))}
              className="w-full border rounded-md px-3 py-2 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="e.g., Cardiology"
            />
          </label>
          <label className="text-sm">
            <span className="block text-slate-600 mb-1">Designation *</span>
            <input
              value={staffForm.designation}
              onChange={(e) => setStaffForm((c) => ({ ...c, designation: e.target.value }))}
              className="w-full border rounded-md px-3 py-2 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="e.g., Senior Consultant"
            />
          </label>
          <label className="text-sm">
            <span className="block text-slate-600 mb-1">Role *</span>
            <input
              value={staffForm.role}
              onChange={(e) => setStaffForm((c) => ({ ...c, role: e.target.value }))}
              className="w-full border rounded-md px-3 py-2 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="e.g., Doctor"
            />
          </label>
        </div>
      </Modal>

      {/* Leave Modal */}
      <Modal
        open={leaveModalOpen}
        onClose={() =>
          setLeaveModalOpen(false) ||
          setLeaveForm({
            staffId: "",
            from: "",
            to: "",
            type: "Sick Leave",
            duration: "Full day",
            reason: "",
            status: "Pending",
          })
        }
        title="Add Leave"
        footer={
          <div className="flex justify-end gap-2">
            <ToolbarButton
              onClick={() =>
                setLeaveModalOpen(false) ||
                setLeaveForm({
                  staffId: "",
                  from: "",
                  to: "",
                  type: "Sick Leave",
                  duration: "Full day",
                  reason: "",
                  status: "Pending",
                })
              }
            >
              Cancel
            </ToolbarButton>
            <ToolbarButton onClick={saveLeave} variant="primary">
              Save
            </ToolbarButton>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="text-sm">
            <span className="block text-slate-600 mb-1">Staff *</span>
            <select
              value={leaveForm.staffId}
              onChange={(e) => setLeaveForm((c) => ({ ...c, staffId: e.target.value }))}
              className="w-full border rounded-md px-3 py-2 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              <option value="">Select staff</option>
              {staff.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.id})
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="block text-slate-600 mb-1">Type *</span>
            <select
              value={leaveForm.type}
              onChange={(e) => setLeaveForm((c) => ({ ...c, type: e.target.value }))}
              className="w-full border rounded-md px-3 py-2 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              <option>Sick Leave</option>
              <option>Casual Leave</option>
              <option>Paid Leave</option>
              <option>Emergency Leave</option>
            </select>
          </label>
          <label className="text-sm">
            <span className="block text-slate-600 mb-1">Duration *</span>
            <select
              value={leaveForm.duration}
              onChange={(e) => setLeaveForm((c) => ({ ...c, duration: e.target.value }))}
              className="w-full border rounded-md px-3 py-2 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              <option>Full day</option>
              <option>Half day</option>
            </select>
          </label>
          <label className="text-sm">
            <span className="block text-slate-600 mb-1">Status *</span>
            <select
              value={leaveForm.status}
              onChange={(e) => setLeaveForm((c) => ({ ...c, status: e.target.value }))}
              className="w-full border rounded-md px-3 py-2 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              <option>Pending</option>
              <option>Approved</option>
              <option>Rejected</option>
            </select>
          </label>
          <label className="text-sm">
            <span className="block text-slate-600 mb-1">From *</span>
            <input
              type="date"
              value={leaveForm.from}
              onChange={(e) => setLeaveForm((c) => ({ ...c, from: e.target.value }))}
              className="w-full border rounded-md px-3 py-2 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </label>
          <label className="text-sm">
            <span className="block text-slate-600 mb-1">To *</span>
            <input
              type="date"
              value={leaveForm.to}
              onChange={(e) => setLeaveForm((c) => ({ ...c, to: e.target.value }))}
              className="w-full border rounded-md px-3 py-2 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </label>
          <label className="text-sm md:col-span-2">
            <span className="block text-slate-600 mb-1">Reason</span>
            <textarea
              value={leaveForm.reason}
              onChange={(e) => setLeaveForm((c) => ({ ...c, reason: e.target.value }))}
              className="w-full border rounded-md px-3 py-2 min-h-[90px] transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="Optional notes"
            />
          </label>
        </div>
      </Modal>

      {/* Bulk Editor Modal */}
      <Modal
        open={bulkEditor.open}
        onClose={() => setBulkEditor({ open: false, date: null })}
        title={bulkEditor.date ? `Bulk Edit — ${bulkEditor.date.toDateString()}` : "Bulk Edit"}
        footer={
          <div className="flex flex-wrap justify-between items-center gap-2">
            <div className="text-xs text-slate-600">
              This affects <b>{filteredStaff.length}</b> staff currently shown.
            </div>
            <div className="flex gap-2 flex-wrap">
              <ToolbarButton
                onClick={() => {
                  markAllForDate(bulkEditor.date, "Present");
                  setBulkEditor({ open: false, date: null });
                }}
                variant="success"
              >
                All Present
              </ToolbarButton>
              <ToolbarButton
                onClick={() => {
                  markAllForDate(bulkEditor.date, "Absent");
                  setBulkEditor({ open: false, date: null });
                }}
                variant="danger"
              >
                All Absent
              </ToolbarButton>
              <ToolbarButton
                onClick={() => {
                  markAllForDate(bulkEditor.date, "Late");
                  setBulkEditor({ open: false, date: null });
                }}
              >
                All Late
              </ToolbarButton>
              <ToolbarButton
                onClick={() => {
                  markAllForDate(bulkEditor.date, "Half Day");
                  setBulkEditor({ open: false, date: null });
                }}
              >
                All Half Day
              </ToolbarButton>
              <ToolbarButton
                onClick={() => {
                  markAllForDate(bulkEditor.date, "On Leave");
                  setBulkEditor({ open: false, date: null });
                }}
              >
                All On Leave
              </ToolbarButton>
              <ToolbarButton
                onClick={() => {
                  markAllForDate(bulkEditor.date, "Holiday");
                  setBulkEditor({ open: false, date: null });
                }}
              >
                All Holiday
              </ToolbarButton>
            </div>
          </div>
        }
      >
        <div className="text-sm text-slate-700">
          Choose a bulk status to apply to all visible staff for{" "}
          <b>{bulkEditor.date ? bulkEditor.date.toDateString() : "-"}</b>. Sundays are always treated as <b>Holiday</b> unless
          overridden.
        </div>
      </Modal>

      {/* Detailed Editor Modal */}
      <Modal
        open={detailEditor.open}
        onClose={() => setDetailEditor({ open: false, staffId: null, date: null })}
        title={
          detailEditor.date
            ? `Edit Details — ${detailEditor.date.toDateString()} (${
                staff.find((s) => s.id === detailEditor.staffId)?.name || "-"
              })`
            : "Edit Details"
        }
        footer={
          <div className="flex justify-end gap-2">
            <ToolbarButton onClick={() => setDetailEditor({ open: false, staffId: null, date: null })}>
              Cancel
            </ToolbarButton>
            <ToolbarButton onClick={saveDetail} variant="primary">
              Save
            </ToolbarButton>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="text-sm">
            <span className="block text-slate-600 mb-1">Status *</span>
            <select
              value={detailForm.status}
              onChange={(e) => setDetailForm((c) => ({ ...c, status: e.target.value }))}
              className="w-full border rounded-md px-3 py-2 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              <option>Present</option>
              <option>Absent</option>
              <option>Late</option>
              <option>Half Day</option>
              <option>On Leave</option>
              <option>Holiday</option>
            </select>
          </label>
          <label className="text-sm">
            <span className="block text-slate-600 mb-1">Shift *</span>
            <select
              value={detailForm.shift}
              onChange={(e) => setDetailForm((c) => ({ ...c, shift: e.target.value }))}
              className="w-full border rounded-md px-3 py-2 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              <option>Morning</option>
              <option>Evening</option>
              <option>Night</option>
              <option>General</option>
            </select>
          </label>
          <label className="text-sm">
            <span className="block text-slate-600 mb-1">Check-In Time</span>
            <input
              type="time"
              value={detailForm.checkIn}
              onChange={(e) => setDetailForm((c) => ({ ...c, checkIn: e.target.value }))}
              className="w-full border rounded-md px-3 py-2 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </label>
          <label className="text-sm">
            <span className="block text-slate-600 mb-1">Check-Out Time</span>
            <input
              type="time"
              value={detailForm.checkOut}
              onChange={(e) => setDetailForm((c) => ({ ...c, checkOut: e.target.value }))}
              className="w-full border rounded-md px-3 py-2 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </label>
          <label className="text-sm">
            <span className="block text-slate-600 mb-1">Overtime Hours</span>
            <input
              type="number"
              value={detailForm.overtime}
              onChange={(e) => setDetailForm((c) => ({ ...c, overtime: Number(e.target.value) }))}
              className="w-full border rounded-md px-3 py-2 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              min="0"
              step="0.5"
            />
          </label>
          <div className="text-sm flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={detailForm.nightDuty}
                onChange={(e) => setDetailForm((c) => ({ ...c, nightDuty: e.target.checked }))}
                className="rounded border transition-all duration-200"
              />
              Night Duty
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={detailForm.onCall}
                onChange={(e) => setDetailForm((c) => ({ ...c, onCall: e.target.checked }))}
                className="rounded border transition-all duration-200"
              />
              On-Call Duty
            </label>
          </div>
          <label className="text-sm md:col-span-2">
            <span className="block text-slate-600 mb-1">Remarks / Notes</span>
            <textarea
              value={detailForm.remarks}
              onChange={(e) => setDetailForm((c) => ({ ...c, remarks: e.target.value }))}
              className="w-full border rounded-md px-3 py-2 min-h-[90px] transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="Optional comments"
            />
          </label>
          <div className="text-sm text-slate-600 md:col-span-2">
            Work Hours:{" "}
            {(() => {
              const mins = diffMinutes(parseHM(detailForm.checkIn), parseHM(detailForm.checkOut));
              return mins != null ? round2(mins / 60) : "-";
            })()}{" "}
            hrs
            {detailForm.late && <span className="text-yellow-600 ml-2"> (Late)</span>}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Attendance;
