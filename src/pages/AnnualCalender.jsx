import React, { useEffect, useMemo, useState } from "react";

/* ---------------- helpers ---------------- */
const TYPES = ["Holiday", "Activity", "Vacation"];
const ROLES = ["All", "Admin", "Accountant", "Doctor", "Pharmacist", "Pathology", "Radiologist", "Reception", "Nurse", "Patient"];
const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" }) : "";
const fmtRange = (start, end) => (end && end !== start ? `${fmtDate(start)} To ${fmtDate(end)}` : fmtDate(start));
const fmtTime = () => {
  const now = new Date();
  return now.toLocaleTimeString("en-US", { hour12: true, hour: "2-digit", minute: "2-digit", second: "2-digit" });
};

/* seed data */
const seed = [
  {
    id: "1",
    type: "Holiday",
    title: "Dasara / Dussehra",
    description:
      "Dasara, also known as Dussehra or Vijayadashami, is a Hindu festival that celebrates the victory of good over evil.",
    dateStart: "2024-10-12",
    dateEnd: "2024-10-12",
    createdBy: "Super Admin (9001)",
    frontSite: true,
    roles: ["All", "Admin", "Doctor", "Nurse", "Patient"],
  },
  {
    id: "2",
    type: "Activity",
    title: "EYES Program (Behavioral Treatment)",
    description:
      "EYES stands for Empowered Youth Experience Success. Short-term behavioral treatment program for youth with delinquent behavior.",
    dateStart: "2024-10-27",
    dateEnd: "2024-10-27",
    createdBy: "Super Admin (9001)",
    frontSite: true,
    roles: ["Doctor", "Nurse", "Pathology", "Radiologist"],
  },
  {
    id: "3",
    type: "Vacation",
    title: "Diwali Celebration",
    description:
      "Diwali celebration on campus. Dress code: traditional wear. Bring small kandil/rangoli/diya to decorate classroom.",
    dateStart: "2024-10-29",
    dateEnd: "2024-10-31",
    createdBy: "Super Admin (9001)",
    frontSite: true,
    roles: ["All", "Admin", "Accountant", "Reception"],
  },
  {
    id: "4",
    type: "Activity",
    title: "EYES Program (Follow-up)",
    description:
      "Calhoun County's EYES Program is a progressive, short-term behavioral treatment program for youth with delinquent behavior.",
    dateStart: "2024-11-12",
    dateEnd: "2024-11-12",
    createdBy: "Super Admin (9001)",
    frontSite: true,
    roles: ["Doctor", "Pharmacist", "Pathology"],
  },
  {
    id: "5",
    type: "Holiday",
    title: "Christmas",
    description:
      "Thank you for the outstanding care that you give your patients. All hospital staff are heroes! Merry Christmas.",
    dateStart: "2024-12-25",
    dateEnd: "2024-12-25",
    createdBy: "Super Admin (9001)",
    frontSite: true,
    roles: ["All", "Patient", "Nurse", "Reception"],
  },
  {
    id: "6",
    type: "Activity",
    title: "Patient Regular Health Check-up",
    description: "Annual patient check-up drive with free vitals and counselling.",
    dateStart: "2025-01-10",
    dateEnd: "2025-01-10",
    createdBy: "Super Admin (9001)",
    frontSite: true,
    roles: ["Doctor", "Nurse", "Patient", "Radiologist"],
  },
];

/* ---------------- small UI atoms ---------------- */
const Pill = ({ yes }) => (
  <span
    className={`inline-block px-2 py-0.5 rounded-full text-xs ${
      yes ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"
    }`}
  >
    {yes ? "Yes" : "No"}
  </span>
);

const IconBtn = ({ title, onClick, children }) => (
  <button
    title={title}
    onClick={onClick}
    className="p-2 rounded-md hover:bg-slate-100 active:scale-[.98] transition"
  >
    {children}
  </button>
);

/* ---------------- Digital Clock Component ---------------- */
const DigitalClock = () => {
  const [time, setTime] = useState(fmtTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(fmtTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const [hours, minutes, seconds, period] = time.split(/[: ]/);

  return (
    <div className="flex items-center gap-2 text-4xl font-mono text-slate-800">
      <span className="bg-slate-100 px-3 py-1 rounded-md">{hours}</span>:
      <span className="bg-slate-100 px-3 py-1 rounded-md">{minutes}</span>:
      <span className="bg-slate-100 px-3 py-1 rounded-md animate-[flip_0.3s_ease-out]">{seconds}</span>
      <span className="text-lg">{period}</span>
    </div>
  );
};

/* ---------------- Add/Edit Modal (animated) ---------------- */
const UpsertModal = ({ open, onClose, onSave, initial }) => {
  const [f, setF] = useState(
    initial || {
      type: "",
      title: "",
      description: "",
      dateStart: "",
      dateEnd: "",
      createdBy: "Super Admin (9001)",
      frontSite: true,
      roles: ["All"],
    }
  );

  useEffect(() => {
    if (initial) setF(initial);
  }, [initial]);

  if (!open) return null;

  const change = (e) => {
    const { name, value, type, checked } = e.target;
    setF((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const toggleRole = (role) => {
    setF((p) => {
      const roles = [...p.roles];
      const idx = roles.indexOf(role);
      if (idx >= 0) roles.splice(idx, 1);
      else roles.push(role);
      return { ...p, roles };
    });
  };

  const submit = (e) => {
    e.preventDefault();
    const data = { ...f };
    if (!data.id) data.id = String(Date.now());
    onSave(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 opacity-0 animate-[fade_180ms_ease-out_forwards]"
        onClick={onClose}
      />
      <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl border overflow-hidden scale-95 opacity-0 animate-[pop_200ms_ease-out_forwards]">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="font-semibold">{initial ? "Edit Entry" : "Add Entry"}</div>
          <button onClick={onClose} className="text-xl leading-none">×</button>
        </div>
        <form onSubmit={submit} className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-600">Type *</label>
            <select
              name="type"
              value={f.type}
              onChange={change}
              required
              className="mt-1 w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select</option>
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-600">Title *</label>
            <input
              name="title"
              value={f.title}
              onChange={change}
              required
              className="mt-1 w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Diwali Celebration"
            />
          </div>
          <div>
            <label className="text-sm text-slate-600">Start Date *</label>
            <input
              type="date"
              name="dateStart"
              value={f.dateStart}
              onChange={change}
              required
              className="mt-1 w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-sm text-slate-600">End Date</label>
            <input
              type="date"
              name="dateEnd"
              value={f.dateEnd || f.dateStart}
              onChange={change}
              className="mt-1 w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-slate-600">Description</label>
            <textarea
              name="description"
              value={f.description}
              onChange={change}
              rows={4}
              className="mt-1 w-full rounded-md border px-3 py-2 resize-y focus:ring-2 focus:ring-blue-500"
              placeholder="Write a short note…"
            />
          </div>
          <div>
            <label className="text-sm text-slate-600">Created By</label>
            <input
              name="createdBy"
              value={f.createdBy}
              onChange={change}
              className="mt-1 w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2 pt-6">
            <input
              id="frontSite"
              type="checkbox"
              name="frontSite"
              checked={!!f.frontSite}
              onChange={change}
              className="h-4 w-4 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="frontSite" className="text-sm text-slate-700">
              Show on Front Site
            </label>
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-slate-600">Visible to Roles *</label>
            <div className="mt-1 flex flex-wrap gap-2">
              {ROLES.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => toggleRole(role)}
                  className={`px-3 py-1 rounded-full text-xs transition ${
                    f.roles.includes(role)
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
          <div className="md:col-span-2 flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border hover:bg-slate-50">
              Cancel
            </button>
            <button className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 active:scale-[.98] transition">
              Save
            </button>
          </div>
        </form>
      </div>
      <style>{`
        @keyframes fade { to { opacity: 1 } }
        @keyframes pop { to { opacity: 1; transform: scale(1) } }
      `}</style>
    </div>
  );
};

/* ---------------- Notification Modal (animated) ---------------- */
const NotificationModal = ({ open, onClose, notifications }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 opacity-0 animate-[fade_180ms_ease-out_forwards]"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl border overflow-hidden scale-95 opacity-0 animate-[pop_200ms_ease-out_forwards]">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="font-semibold">Notifications</div>
          <button onClick={onClose} className="text-xl leading-none">×</button>
        </div>
        <div className="p-4 max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-center text-sm text-slate-500">No upcoming notifications.</div>
          ) : (
            notifications.map((n, i) => (
              <div
                key={n.id}
                className="p-3 border-b last:border-0 hover:bg-slate-50 transition opacity-0 animate-[fadeIn_300ms_ease-out_forwards]"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="font-medium text-sm">{n.title}</div>
                <div className="text-xs text-slate-600">{fmtRange(n.dateStart, n.dateEnd)}</div>
                <div className="text-xs text-slate-700 mt-1 line-clamp-2">{n.description}</div>
              </div>
            ))
          )}
        </div>
      </div>
      <style>{`
        @keyframes fade { to { opacity: 1 } }
        @keyframes pop { to { opacity: 1; transform: scale(1) } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

/* ---------------- main ---------------- */
const AnnualCalendar = () => {
  const currentDate = new Date("2025-08-25");
  const [rows, setRows] = useState(seed);
  const [typeFilter, setTypeFilter] = useState("");
  const [kw, setKw] = useState("");
  const [currentRole, setCurrentRole] = useState("All");
  const [viewMode, setViewMode] = useState("table"); // table, tiles, or digital
  const [upsertOpen, setUpsertOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [notifOpen, setNotifOpen] = useState(false);

  // Sort newest first by start date
  const sorted = useMemo(
    () => [...rows].sort((a, b) => new Date(b.dateStart) - new Date(a.dateStart)),
    [rows]
  );

  const filtered = useMemo(() => {
    const q = kw.trim().toLowerCase();
    return sorted.filter((r) => {
      const roleMatch = currentRole === "All" || r.roles.includes(currentRole) || r.roles.includes("All");
      const typeMatch = typeFilter ? r.type === typeFilter : true;
      const text =
        (r.title + " " + r.description + " " + r.createdBy)
          .toLowerCase()
          .includes(q);
      return roleMatch && typeMatch && (!q || text);
    });
  }, [sorted, currentRole, typeFilter, kw]);

  const notifications = useMemo(() => {
    return filtered
      .filter((r) => new Date(r.dateStart) >= currentDate)
      .sort((a, b) => new Date(a.dateStart) - new Date(b.dateStart))
      .slice(0, 10);
  }, [filtered]);

  const saveItem = (item) => {
    setRows((prev) => {
      const idx = prev.findIndex((r) => r.id === item.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = item;
        return copy;
      }
      return [item, ...prev];
    });
    setEditing(null);
    setUpsertOpen(false);
  };

  const delItem = (id) => {
    if (!window.confirm("Delete this entry?")) return;
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const toggleFront = (id) =>
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, frontSite: !r.frontSite } : r))
    );

  const exportCsv = () => {
    const header = ["Date", "Type", "Title", "Description", "Created By", "Front Site", "Roles"];
    const lines = filtered.map((r) => [
      fmtRange(r.dateStart, r.dateEnd),
      r.type,
      r.title,
      r.description,
      r.createdBy,
      r.frontSite ? "Yes" : "No",
      r.roles.join(", "),
    ]);
    const csv =
      header.join(",") +
      "\n" +
      lines.map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `annual_calendar_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printTable = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    const rowsHtml = filtered
      .map(
        (r) => `<tr>
          <td style="padding:6px;border:1px solid #e5e7eb">${fmtRange(r.dateStart, r.dateEnd)}</td>
          <td style="padding:6px;border:1px solid #e5e7eb">${r.type}</td>
          <td style="padding:6px;border:1px solid #e5e7eb">${r.title}</td>
          <td style="padding:6px;border:1px solid #e5e7eb">${r.description}</td>
          <td style="padding:6px;border:1px solid #e5e7eb">${r.createdBy}</td>
          <td style="padding:6px;border:1px solid #e5e7eb">${r.frontSite ? "Yes" : "No"}</td>
          <td style="padding:6px;border:1px solid #e5e7eb">${r.roles.join(", ")}</td>
        </tr>`
      )
      .join("");
    w.document.write(`
      <title>Annual Calendar</title>
      <body>
        <h3 style="font-family:sans-serif">Annual Calendar</h3>
        <table style="border-collapse:collapse;font-family:sans-serif;font-size:12px">
          <thead>
            <tr>
              <th style="padding:6px;border:1px solid #e5e7eb;text-align:left">Date</th>
              <th style="padding:6px;border:1px solid #e5e7eb;text-align:left">Type</th>
              <th style="padding:6px;border:1px solid #e5e7eb;text-align:left">Title</th>
              <th style="padding:6px;border:1px solid #e5e7eb;text-align:left">Description</th>
              <th style="padding:6px;border:1px solid #e5e7eb;text-align:left">Created By</th>
              <th style="padding:6px;border:1px solid #e5e7eb;text-align:left">Front Site</th>
              <th style="padding:6px;border:1px solid #e5e7eb;text-align:left">Roles</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </body>`);
    w.print();
    w.close();
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4">
      <div className="rounded-lg border bg-white overflow-hidden">
        {/* header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="text-base font-semibold">Annual Calendar</div>
          <div className="flex items-center gap-2">
            <select
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value)}
              className="rounded-md border px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  View as: {r}
                </option>
              ))}
            </select>
            <IconBtn title="Notifications" onClick={() => setNotifOpen(true)}>
              🔔 {notifications.length > 0 && <span className="text-red-500 text-xs">({notifications.length})</span>}
            </IconBtn>
            <button
              onClick={() => {
                setEditing(null);
                setUpsertOpen(true);
              }}
              className="rounded-md bg-blue-600 text-white px-3 py-2 text-sm hover:bg-blue-700 active:scale-[.98] transition"
            >
              + Add
            </button>
          </div>
        </div>

        {/* filters row */}
        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="text-sm text-slate-600">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-slate-600">Search</label>
            <div className="flex gap-2">
              <input
                value={kw}
                onChange={(e) => setKw(e.target.value)}
                placeholder="Search… (title, description, created by)"
                className="mt-1 w-full rounded-md border px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => {}}
                className="mt-1 rounded-md border bg-white px-3 py-2 text-sm hover:bg-slate-50"
              >
                🔍 Search
              </button>
            </div>
          </div>
        </div>

        {/* list header + actions */}
        <div className="flex items-center justify-between px-4 py-2 border-y bg-slate-50">
          <div className="font-medium">Holiday List {currentRole !== "All" && `(for ${currentRole})`}</div>
          <div className="flex items-center gap-1">
            <IconBtn title="Table View" onClick={() => setViewMode("table")}>📋</IconBtn>
            <IconBtn title="Tile View" onClick={() => setViewMode("tiles")}>🀄</IconBtn>
            <IconBtn title="Digital View" onClick={() => setViewMode("digital")}>🕒</IconBtn>
            <IconBtn title="Export CSV" onClick={exportCsv}>📄</IconBtn>
            <IconBtn title="Print" onClick={printTable}>🖨️</IconBtn>
          </div>
        </div>

        {/* content */}
        {viewMode === "table" ? (
          /* table view */
          <div className="overflow-x-auto">
            <table className="min-w-[1000px] w-full divide-y divide-gray-200">
              <thead className="bg-slate-100 text-xs uppercase text-slate-600">
                <tr className="text-left">
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Created By</th>
                  <th className="px-4 py-3">Front Site</th>
                  <th className="px-4 py-3">Roles</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((r) => (
                  <tr
                    key={r.id}
                    className="hover:bg-slate-50 transition-colors animate-[rowin_0.22s_ease-out]"
                  >
                    <td className="px-4 py-3 text-sm text-slate-800">
                      {fmtRange(r.dateStart, r.dateEnd)}
                    </td>
                    <td className="px-4 py-3 text-sm">{r.type}</td>
                    <td className="px-4 py-3 text-sm font-medium">{r.title}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      <span className="line-clamp-2">{r.description}</span>
                    </td>
                    <td className="px-4 py-3 text-sm">{r.createdBy}</td>
                    <td className="px-4 py-3 text-sm">
                      <button onClick={() => toggleFront(r.id)} className="active:scale-95 transition">
                        <Pill yes={r.frontSite} />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="line-clamp-1">{r.roles.join(", ")}</span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-1">
                        <IconBtn
                          title="Edit"
                          onClick={() => {
                            setEditing(r);
                            setUpsertOpen(true);
                          }}
                        >
                          ✏️
                        </IconBtn>
                        <IconBtn title="Delete" onClick={() => delItem(r.id)}>
                          🗑️
                        </IconBtn>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-sm text-slate-500">
                      No entries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : viewMode === "tiles" ? (
          /* tile view */
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((r, i) => (
              <div
                key={r.id}
                className="bg-white rounded-lg border p-4 shadow-sm hover:shadow-md transition-shadow opacity-0 animate-[tileIn_300ms_ease-out_forwards]"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{r.title}</div>
                    <div className="text-xs text-slate-600">{fmtRange(r.dateStart, r.dateEnd)}</div>
                  </div>
                  <div className="text-xs bg-slate-100 px-2 py-1 rounded-full">{r.type}</div>
                </div>
                <div className="text-sm text-slate-700 mt-2 line-clamp-3">{r.description}</div>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <span>{r.createdBy}</span>
                  <span>Roles: {r.roles.join(", ")}</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <button onClick={() => toggleFront(r.id)} className="active:scale-95 transition">
                    <Pill yes={r.frontSite} />
                  </button>
                  <div className="flex gap-1">
                    <IconBtn
                      title="Edit"
                      onClick={() => {
                        setEditing(r);
                        setUpsertOpen(true);
                      }}
                    >
                      ✏️
                    </IconBtn>
                    <IconBtn title="Delete" onClick={() => delItem(r.id)}>
                      🗑️
                    </IconBtn>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-3 text-center text-sm text-slate-500 py-8">
                No entries found.
              </div>
            )}
          </div>
        ) : (
          /* digital view */
          <div className="p-6">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl p-6 shadow-lg mb-6 animate-[fadeIn_500ms_ease-out]">
              <div className="text-lg font-semibold">Current Time & Date</div>
              <DigitalClock />
              <div className="text-sm mt-2">{fmtDate(currentDate)}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((r, i) => (
                <div
                  key={r.id}
                  className="bg-white rounded-lg border p-4 shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 opacity-0 animate-[slideIn_400ms_ease-out_forwards]"
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-lg">{r.title}</div>
                      <div className="text-sm text-slate-600">{fmtRange(r.dateStart, r.dateEnd)}</div>
                    </div>
                    <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{r.type}</div>
                  </div>
                  <div className="text-sm text-slate-700 mt-2 line-clamp-3">{r.description}</div>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                    <span>{r.createdBy}</span>
                    <span>Roles: {r.roles.join(", ")}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <button onClick={() => toggleFront(r.id)} className="active:scale-95 transition">
                      <Pill yes={r.frontSite} />
                    </button>
                    <div className="flex gap-1">
                      <IconBtn
                        title="Edit"
                        onClick={() => {
                          setEditing(r);
                          setUpsertOpen(true);
                        }}
                      >
                        ✏️
                      </IconBtn>
                      <IconBtn title="Delete" onClick={() => delItem(r.id)}>
                        🗑️
                      </IconBtn>
                    </div>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="col-span-3 text-center text-sm text-slate-500 py-8">
                  No entries found.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* modal */}
      <UpsertModal
        open={upsertOpen}
        initial={editing}
        onClose={() => {
          setUpsertOpen(false);
          setEditing(null);
        }}
        onSave={saveItem}
      />

      {/* notification modal */}
      <NotificationModal
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        notifications={notifications}
      />

      {/* keyframes */}
      <style>{`
        @keyframes rowin { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes tileIn { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes flip { 
          0% { transform: rotateX(90deg); opacity: 0; } 
          50% { transform: rotateX(0deg); opacity: 1; } 
          100% { transform: rotateX(0deg); opacity: 1; } 
        }
      `}</style>
    </div>
  );
};

export default AnnualCalendar;