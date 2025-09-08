import React, { useMemo, useState, useEffect } from "react";
import img from "../assets/img/manas.jpg";
import img1 from "../assets/img/srinivas.jpeg";
import img2 from "../assets/img/sneha.jpeg";
import img3 from "../assets/img/mahalakshmi.jpg";
import img4 from "../assets/img/sridevi.jpg";
import img5 from "../assets/img/team-2.jpg";
import img6 from "../assets/img/team-7.jpg";
import img7 from "../assets/img/team-8.jpg";
import img8 from "../assets/img/team-10.jpg";
import img9 from "../assets/img/team101.jpg";
import img10 from "../assets/img/tejas1.jpg";
import img11 from "../assets/img/ganga babu.jpeg";

/* ---------------- helpers ---------------- */
const ROLES = [
  "super-admin",
  "admin",
  "doctor",
  "receptionist",
  "nurse",
  "pathology",
  "radiology",
  "pharmacy",
  "accountant",
];
const ROLE_SALARY = {
  "super-admin": 200000,
  admin: 55000,
  doctor: 150000,
  receptionist: 30000,
  nurse: 60000,
  pathology: 55000,
  radiology: 70000,
  pharmacy: 45000,
  accountant: 50000,
};
const titleCase = (s = "") => s.replace(/\b\w/g, (m) => m.toUpperCase());
const pad4 = (n) => String(n).padStart(4, "0");
const monthKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
const daysInMonth = (year, monthIndex) => new Date(year, monthIndex + 1, 0).getDate();
const getMonthDates = (y, mIndex) =>
  Array.from({ length: daysInMonth(y, mIndex) }, (_, i) => new Date(y, mIndex, i + 1));
const isSunday = (d) => d.getDay() === 0;

/* ---------------- simple UI atoms ---------------- */
const Badge = ({ children }) => (
  <span className="px-2 py-0.5 rounded-md text-xs bg-slate-100 text-slate-700 border">{children}</span>
);

const Avatar = ({ name, src, onClick }) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return src ? (
    <button className="h-16 w-16 rounded-md overflow-hidden border" onClick={onClick} title="Open profile">
      <img className="h-full w-full object-cover" src={src} alt={name} onError={(e)=>{e.currentTarget.style.display='none';}} />
    </button>
  ) : (
    <button
      onClick={onClick}
      className="h-16 w-16 rounded-md border bg-slate-200 grid place-items-center text-slate-700 font-semibold"
      title="Open profile"
    >
      {initials}
    </button>
  );
};

const ToolbarButton = ({ children, onClick, variant = "default" }) => {
  const styles =
    variant === "primary"
      ? "bg-blue-600 text-white hover:bg-blue-700"
      : variant === "danger"
      ? "bg-red-600 text-white hover:bg-red-700"
      : "border bg-white hover:bg-slate-50";
  return (
    <button onClick={onClick} className={`rounded-md px-3 py-2 text-sm ${styles}`}>
      {children}
    </button>
  );
};

/* ---------------- seed staff data ---------------- */
const seed = [
  {
    id: "9001",
    name: "Manas",
    role: "super-admin",
    phone: "9686576776",
    email: "sa@hospital.test",
    floor: "HQ",
    dept: "Administration",
    shift: "General",
    avatar: img,
    roleDetails: { permissions: ["All Modules", "RBAC", "Audit Logs"] },
  },
  {
    id: "9002",
    name: "DR.Srinivas",
    role: "doctor",
    phone: "96464644341",
    email: "sonia.bush@hospital.test",
    floor: "1st Floor",
    dept: "OT",
    shift: "Mon–Sat 10:00–16:00",
    avatar: img1,
    roleDetails: { speciality: "General Surgery", opdRoom: "OT-2", registration: "MCI/2020/GS/1122" },
  },
  {
    id: "9008",
    name: "DR.Sneha",
    role: "doctor",
    phone: "965456454",
    email: "sansa.gomez@hospital.test",
    floor: "3rd Floor",
    dept: "Gynecology",
    shift: "Tue–Sun 09:00–14:00",
    avatar: img2,
    roleDetails: { speciality: "Gynecology", opdRoom: "GYN-1", registration: "MCI/2017/GYN/4561" },
  },
  {
    id: "9005",
    name: "DR.Mahalaxmi",
    role: "pathology",
    phone: "6465465455",
    email: "belina.turner@hospital.test",
    floor: "2nd Floor",
    dept: "Pathology",
    shift: "Mon–Sat 08:00–16:00",
    avatar: img3,
    roleDetails: { panels: ["Hematology", "Biochemistry"], labId: "LAB-PT-09" },
  },
  {
    id: "9006",
    name: "DR.Sridevi",
    role: "radiology",
    phone: "9446444564",
    email: "john.hook@hospital.test",
    floor: "2nd Floor",
    dept: "Radiology",
    shift: "Mon–Sat 10:00–18:00",
    avatar: img4,
    roleDetails: { modalities: ["X-Ray", "CT"], license: "RAD/IND/2021/7782" },
  },
  {
    id: "9003",
    name: "Shivani",
    role: "accountant",
    phone: "5454464644",
    email: "brad.frost@hospital.test",
    floor: "Ground Floor",
    dept: "Finance",
    shift: "Mon–Fri 09:00–17:00",
    avatar: img5,
    roleDetails: { systems: ["Tally", "ERP"], approvalLimit: "₹1,00,000" },
  },
  {
    id: "9009",
    name: "DR.Mahesh",
    role: "doctor",
    phone: "904892392",
    email: "amit.singh@hospital.test",
    floor: "2nd Floor",
    dept: "Doctor Department",
    shift: "Mon–Sat 12:00–19:00",
    avatar: img6,
    roleDetails: { speciality: "Internal Medicine", opdRoom: "IM-3", registration: "MCI/2018/MD/9911" },
  },
  {
    id: "9011",
    name: "DR.Pavan",
    role: "doctor",
    phone: "852963741",
    email: "reyan.jain@hospital.test",
    floor: "2nd Floor",
    dept: "Doctor Department",
    shift: "Mon–Sat 09:00–17:00",
    avatar: img7,
    roleDetails: { speciality: "Cardiology", opdRoom: "CD-4", registration: "MCI/2019/CD/2210" },
  },
  {
    id: "9010",
    name: "Jahnavi",
    role: "nurse",
    phone: "676745667",
    email: "natasha.romanoff@hospital.test",
    floor: "2nd Floor",
    dept: "Nursing Department",
    shift: "Night 19:00–07:00",
    avatar: img8,
    roleDetails: { ward: "ICU-1", skills: ["IV", "Ventilator", "Triage"] },
  },
  {
    id: "9012",
    name: "Ashritha",
    role: "pharmacy",
    phone: "8529637410",
    email: "harry.grant@hospital.test",
    floor: "2nd floor",
    dept: "Pharmacy Department",
    shift: "Mon–Sat 10:00–18:00",
    avatar: img9,
    roleDetails: { counter: "PH-2", license: "DL-12345-Pharma" },
  },
  {
    id: "9017",
    name: "Tejaswini",
    role: "admin",
    phone: "4785963210",
    email: "jason.abbot@hospital.test",
    floor: "1st Floor",
    dept: "Admin",
    shift: "General",
    avatar: img10,
    roleDetails: { responsibilities: ["Onboarding", "Assets", "Vendors"] },
  },
  {
    id: "9018",
    name: "Ganga Babu",
    role: "receptionist",
    phone: "8529637410",
    email: "maria.ford@hospital.test",
    floor: "Ground",
    dept: "Reception",
    shift: "Night 20:00–06:00",
    avatar: img11,
    roleDetails: { desk: "Front-2", languages: ["English", "Hindi"] },
  },
];

/* ---------------- role-aware details renderer ---------------- */
const Field = ({ label, value }) => (
  <div>
    <div className="text-xs uppercase text-slate-500">{label}</div>
    <div className="text-sm">{value || "—"}</div>
  </div>
);

const RoleDetails = ({ role, roleDetails }) => {
  switch (role) {
    case "doctor":
      return (
        <div className="grid grid-cols-2 gap-2">
          <Field label="Speciality" value={roleDetails?.speciality} />
          <Field label="OPD Room" value={roleDetails?.opdRoom} />
          <Field label="Registration" value={roleDetails?.registration} />
        </div>
      );
    case "nurse":
      return (
        <div className="grid grid-cols-2 gap-2">
          <Field label="Ward" value={roleDetails?.ward} />
          <Field label="Key Skills" value={(roleDetails?.skills || []).join(", ")} />
        </div>
      );
    case "pathology":
      return (
        <div className="grid grid-cols-2 gap-2">
          <Field label="Panels" value={(roleDetails?.panels || []).join(", ")} />
          <Field label="Lab ID" value={roleDetails?.labId} />
        </div>
      );
    case "radiology":
      return (
        <div className="grid grid-cols-2 gap-2">
          <Field label="Modalities" value={(roleDetails?.modalities || []).join(", ")} />
          <Field label="License" value={roleDetails?.license} />
        </div>
      );
    case "pharmacy":
      return (
        <div className="grid grid-cols-2 gap-2">
          <Field label="Counter" value={roleDetails?.counter} />
          <Field label="License" value={roleDetails?.license} />
        </div>
      );
    case "accountant":
      return (
        <div className="grid grid-cols-2 gap-2">
          <Field label="Systems" value={(roleDetails?.systems || []).join(", ")} />
          <Field label="Approval Limit" value={roleDetails?.approvalLimit} />
        </div>
      );
    case "admin":
      return (
        <div className="grid grid-cols-2 gap-2">
          <Field label="Responsibilities" value={(roleDetails?.responsibilities || []).join(", ")} />
        </div>
      );
    case "receptionist":
      return (
        <div className="grid grid-cols-2 gap-2">
          <Field label="Desk" value={roleDetails?.desk} />
          <Field label="Languages" value={(roleDetails?.languages || []).join(", ")} />
        </div>
      );
    case "super-admin":
      return (
        <div className="grid grid-cols-2 gap-2">
          <Field label="Permissions" value={(roleDetails?.permissions || []).join(", ")} />
        </div>
      );
    default:
      return null;
  }
};

/* ---------------- drawer & add staff modal ---------------- */
const Drawer = ({ open, onClose, staff }) => {
  if (!open || !staff) return null;
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="w-full sm:w-[32rem] h-full bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="font-semibold">Staff Details</div>
          <button onClick={onClose} className="text-xl leading-none">
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div className="flex items-center gap-4">
            <Avatar name={staff.name} src={staff.avatar} onClick={() => {}} />
            <div>
              <div className="text-lg font-semibold">{staff.name}</div>
              <div className="text-sm text-slate-600">ID: {staff.id}</div>
              <div className="mt-1">
                <Badge>{titleCase(staff.role)}</Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Phone" value={staff.phone} />
            <Field label="Email" value={staff.email} />
            <Field label="Department" value={staff.dept} />
            <Field label="Floor / Location" value={staff.floor} />
            <Field label="Shift" value={staff.shift} />
          </div>

          <div>
            <div className="text-sm font-semibold mb-2">Role Details</div>
            <RoleDetails role={staff.role} roleDetails={staff.roleDetails} />
          </div>

          <div className="flex items-center gap-2">
            <ToolbarButton onClick={() => alert("Call action (stub)")}>📞 Call</ToolbarButton>
            <ToolbarButton onClick={() => alert("Email action (stub)")}>✉️ Email</ToolbarButton>
            <ToolbarButton onClick={() => alert("Message action (stub)")}>💬 Message</ToolbarButton>
          </div>
        </div>
      </div>
    </div>
  );
};

const AddStaffModal = ({ open, onClose, onAdd, nextId }) => {
  const [f, setF] = useState({
    name: "",
    role: "",
    phone: "",
    email: "",
    floor: "",
    dept: "",
    shift: "",
    avatar: "",
  });
  if (!open) return null;

  const change = (e) => setF((p) => ({ ...p, [e.target.name]: e.target.value }));
  const submit = (e) => {
    e.preventDefault();
    if (!f.name || !f.role) {
      alert("Name and Role are required.");
      return;
    }
    onAdd({
      ...f,
      id: nextId(), // auto-create staff id
      roleDetails: {},
    });
    setF({
      name: "",
      role: "",
      phone: "",
      email: "",
      floor: "",
      dept: "",
      shift: "",
      avatar: "",
    }); // Reset form
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 grid place-items-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="font-semibold">Add Staff</div>
          <button className="text-xl leading-none" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={submit} className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-slate-600">Name *</label>
            <input name="name" value={f.name} onChange={change} className="mt-1 w-full border rounded-md px-3 py-2" required />
          </div>
          <div>
            <label className="text-sm text-slate-600">Role *</label>
            <select name="role" value={f.role} onChange={change} className="mt-1 w-full border rounded-md px-3 py-2" required>
              <option value="">Select</option>
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {titleCase(r)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-600">Phone</label>
            <input name="phone" value={f.phone} onChange={change} className="mt-1 w-full border rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="text-sm text-slate-600">Email</label>
            <input name="email" value={f.email} onChange={change} className="mt-1 w-full border rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="text-sm text-slate-600">Department</label>
            <input name="dept" value={f.dept} onChange={change} className="mt-1 w-full border rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="text-sm text-slate-600">OP Fees</label>
            <input name="shift" value={f.shift} onChange={change} className="mt-1 w-full border rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="text-sm text-slate-600">Floor / Location</label>
            <input name="floor" value={f.floor} onChange={change} className="mt-1 w-full border rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="text-sm text-slate-600">Shift</label>
            <input name="shift" value={f.shift} onChange={change} className="mt-1 w-full border rounded-md px-3 py-2" />
          </div>
          <div className="md:col-span-3">
            <label className="text-sm text-slate-600">Avatar URL (optional)</label>
            <input
              name="avatar"
              value={f.avatar}
              onChange={change}
              className="mt-1 w-full border rounded-md px-3 py-2"
              placeholder="https://..."
            />
          </div>

          <div className="md:col-span-3 flex justify-end gap-2 pt-1">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded-md bg-blue-600 text-white">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ---------------- Attendance View ---------------- */
const LegendDot = ({ label, color }) => (
  <span className="inline-flex items-center gap-1 text-xs text-slate-600">
    <span className={`w-2 h-2 rounded-full ${color}`} /> {label}
  </span>
);

const AttendanceView = ({ staff, attendance, setAttendance, leaves, setLeaves }) => {
  const today = new Date();
  const [month, setMonth] = useState(monthKey(today)); // "YYYY-MM"
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    staffId: "",
    from: "",
    to: "",
    type: "Paid",
    reason: "",
  });

  const [expanded, setExpanded] = useState({}); // row expand for day matrix

  const y = Number(month.split("-")[0]);
  const mIndex = Number(month.split("-")[1]) - 1;
  const dates = getMonthDates(y, mIndex);

  // counters
  const summary = useMemo(() => {
    return staff.map((s) => {
      const rec = attendance[s.id]?.[month] || {};
      let p = 0,
        a = 0,
        l = 0,
        h = 0;
      dates.forEach((d, i) => {
        const code = rec[i + 1] || (isSunday(d) ? "H" : "P");
        if (code === "P") p++;
        else if (code === "A") a++;
        else if (code === "L") l++;
        else if (code === "H") h++;
      });
      return { id: s.id, name: s.name, role: s.role, p, a, l, h };
    });
  }, [attendance, staff, month]);

  const applyLeaveToAttendance = (staffId, from, to) => {
    const f = new Date(from);
    const t = new Date(to);
    if (isNaN(f) || isNaN(t) || f > t) return;
    const key = monthKey(f);
    setAttendance((prev) => {
      const next = { ...prev };
      next[staffId] = next[staffId] || {};
      next[staffId][key] = { ...(next[staffId][key] || {}) };
      const allDates = getMonthDates(f.getFullYear(), f.getMonth());
      for (let d = new Date(f); d <= t; d.setDate(d.getDate() + 1)) {
        if (monthKey(d) !== key) continue; // only current month
        const day = d.getDate();
        next[staffId][key][day] = "L";
      }
      return next;
    });
  };

  const submitLeave = () => {
    const { staffId, from, to, type, reason } = leaveForm;
    if (!staffId || !from || !to) {
      alert("Please select staff and date range.");
      return;
    }
    setLeaves((prev) => [
      ...prev,
      {
        id: `LV-${pad4(prev.length + 1)}`,
        staffId,
        from,
        to,
        type, // Paid | Unpaid | Sick | Casual
        reason,
        status: "Approved",
      },
    ]);
    applyLeaveToAttendance(staffId, from, to);
    setShowLeaveModal(false);
    setLeaveForm({ staffId: "", from: "", to: "", type: "Paid", reason: "" });
  };

  return (
    <div className="p-4">
      <div className="flex flex-wrap items-end gap-3 mb-4">
        <div>
          <div className="text-sm text-slate-600">Month</div>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border rounded-md px-3 py-2"
          />
        </div>
        <ToolbarButton onClick={() => setShowLeaveModal(true)} variant="primary">
          + Add Leave
        </ToolbarButton>
        <div className="ml-auto flex gap-4">
          <LegendDot label="Present" color="bg-green-500" />
          <LegendDot label="Absent" color="bg-red-500" />
          <LegendDot label="Leave" color="bg-yellow-500" />
          <LegendDot label="Holiday" color="bg-slate-400" />
        </div>
      </div>

      {/* summary table */}
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-[900px] w-full divide-y">
          <thead className="bg-slate-100 text-xs uppercase text-slate-600">
            <tr>
              <th className="px-3 py-2 text-left">Staff</th>
              <th className="px-3 py-2 text-left">Role</th>
              <th className="px-3 py-2 text-left">Present</th>
              <th className="px-3 py-2 text-left">Leave</th>
              <th className="px-3 py-2 text-left">Absent</th>
              <th className="px-3 py-2 text-left">Holiday</th>
              <th className="px-3 py-2 text-left">Matrix</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {summary.map((row) => (
              <React.Fragment key={row.id}>
                <tr className="hover:bg-slate-50">
                  <td className="px-3 py-2 text-sm font-medium">{row.name} <span className="text-xs text-slate-500">({row.id})</span></td>
                  <td className="px-3 py-2 text-sm">{titleCase(row.role)}</td>
                  <td className="px-3 py-2 text-sm text-green-700">{row.p}</td>
                  <td className="px-3 py-2 text-sm text-yellow-700">{row.l}</td>
                  <td className="px-3 py-2 text-sm text-red-700">{row.a}</td>
                  <td className="px-3 py-2 text-sm text-slate-600">{row.h}</td>
                  <td className="px-3 py-2 text-sm">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => setExpanded((e) => ({ ...e, [row.id]: !e[row.id] }))}
                    >
                      {expanded[row.id] ? "Hide" : "Show"}
                    </button>
                  </td>
                </tr>
                {expanded[row.id] && (
                  <tr>
                    <td colSpan={7} className="px-3 py-3">
                      <div className="flex flex-wrap gap-1">
                        {dates.map((d, idx) => {
                          const day = idx + 1;
                          const code =
                            attendance[row.id]?.[month]?.[day] || (isSunday(d) ? "H" : "P");
                          const color =
                            code === "P"
                              ? "bg-green-100 text-green-700"
                              : code === "A"
                              ? "bg-red-100 text-red-700"
                              : code === "L"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-slate-100 text-slate-700";
                          return (
                            <button
                              key={day}
                              className={`px-2 py-1 text-xs rounded ${color}`}
                              title={d.toDateString()}
                              onClick={() => {
                                // cycle P -> A -> L -> H (if Sunday) -> P ...
                                setAttendance((prev) => {
                                  const next = { ...prev };
                                  next[row.id] = next[row.id] || {};
                                  next[row.id][month] = { ...(next[row.id][month] || {}) };
                                  const cur =
                                    next[row.id][month][day] ||
                                    (isSunday(d) ? "H" : "P");
                                  let nx = "P";
                                  if (cur === "P") nx = "A";
                                  else if (cur === "A") nx = "L";
                                  else if (cur === "L") nx = isSunday(d) ? "H" : "P";
                                  else if (cur === "H") nx = "P";
                                  next[row.id][month][day] = nx;
                                  return next;
                                });
                              }}
                            >
                              {day}:{code}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Leave Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Add Leave</h3>
              <button onClick={() => setShowLeaveModal(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="text-sm">
                <span className="block text-gray-700 mb-1">Staff *</span>
                <select
                  value={leaveForm.staffId}
                  onChange={(e) => setLeaveForm((c) => ({ ...c, staffId: e.target.value }))}
                  className="w-full border rounded-md px-3 py-2"
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
                <span className="block text-gray-700 mb-1">Type *</span>
                <select
                  value={leaveForm.type}
                  onChange={(e) => setLeaveForm((c) => ({ ...c, type: e.target.value }))}
                  className="w-full border rounded-md px-3 py-2"
                >
                  <option>Paid</option>
                  <option>Unpaid</option>
                  <option>Sick</option>
                  <option>Casual</option>
                </select>
              </label>
              <label className="text-sm">
                <span className="block text-gray-700 mb-1">From *</span>
                <input
                  type="date"
                  value={leaveForm.from}
                  onChange={(e) => setLeaveForm((c) => ({ ...c, from: e.target.value }))}
                  className="w-full border rounded-md px-3 py-2"
                />
              </label>
              <label className="text-sm">
                <span className="block text-gray-700 mb-1">To *</span>
                <input
                  type="date"
                  value={leaveForm.to}
                  onChange={(e) => setLeaveForm((c) => ({ ...c, to: e.target.value }))}
                  className="w-full border rounded-md px-3 py-2"
                />
              </label>
              <label className="text-sm md:col-span-2">
                <span className="block text-gray-700 mb-1">Reason</span>
                <textarea
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm((c) => ({ ...c, reason: e.target.value }))}
                  className="w-full border rounded-md px-3 py-2 min-h-[100px]"
                  placeholder="Optional notes"
                />
              </label>
            </div>
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-2">
              <button onClick={() => setShowLeaveModal(false)} className="px-4 py-2 rounded-md border hover:bg-gray-100">
                Cancel
              </button>
              <button onClick={submitLeave} className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">
                Save Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ---------------- Payroll View ---------------- */
const countWorkingDays = (y, mIndex) => {
  // Mon-Sat working, Sunday holiday
  const dates = getMonthDates(y, mIndex);
  return dates.filter((d) => d.getDay() !== 0).length;
};

const PayrollView = ({ staff, attendance, leaves }) => {
  const today = new Date();
  const [month, setMonth] = useState(monthKey(today));
  const y = Number(month.split("-")[0]);
  const mIndex = Number(month.split("-")[1]) - 1;
  const dates = getMonthDates(y, mIndex);
  const workingDays = countWorkingDays(y, mIndex);

  const rows = useMemo(() => {
    return staff.map((s) => {
      const base = ROLE_SALARY[s.role] ?? 40000;
      const daily = Math.round(base / 26); // standard practice
      const rec = attendance[s.id]?.[month] || {};
      // tally
      let present = 0,
        leave = 0,
        absent = 0,
        holiday = 0;
      dates.forEach((d, i) => {
        const code = rec[i + 1] || (isSunday(d) ? "H" : "P");
        if (code === "P") present++;
        else if (code === "A") absent++;
        else if (code === "L") leave++;
        else if (code === "H") holiday++;
      });

      // unpaid leaves from leaves store for this month
      const unpaidLeaveDays = leaves
        .filter(
          (lv) =>
            lv.staffId === s.id &&
            lv.type === "Unpaid" &&
            monthKey(new Date(lv.from)) === month
        )
        .reduce((acc, lv) => {
          const f = new Date(lv.from);
          const t = new Date(lv.to);
          let c = 0;
          for (let d = new Date(f); d <= t; d.setDate(d.getDate() + 1)) {
            if (monthKey(d) !== month) continue;
            if (!isSunday(d)) c++;
          }
          return acc + c;
        }, 0);

      const deductions = unpaidLeaveDays * daily;
      const gross = base;
      const net = Math.max(gross - deductions, 0);
      return {
        id: s.id,
        name: s.name,
        role: s.role,
        base,
        daily,
        present,
        leave,
        absent,
        holiday,
        unpaidLeaveDays,
        deductions,
        net,
      };
    });
  }, [staff, attendance, month, leaves]);

  const totalNet = useMemo(() => rows.reduce((a, b) => a + b.net, 0), [rows]);

  return (
    <div className="p-4">
      <div className="flex flex-wrap items-end gap-3 mb-4">
        <div>
          <div className="text-sm text-slate-600">Month</div>
          <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="border rounded-md px-3 py-2" />
        </div>
        <div className="ml-auto text-sm text-slate-600">
          Working days (Mon–Sat): <b>{workingDays}</b>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-[1000px] w-full divide-y">
          <thead className="bg-slate-100 text-xs uppercase text-slate-600">
            <tr>
              <th className="px-3 py-2 text-left">Staff</th>
              <th className="px-3 py-2 text-left">Role</th>
              <th className="px-3 py-2 text-left">Base</th>
              <th className="px-3 py-2 text-left">Daily</th>
              <th className="px-3 py-2 text-left">Present</th>
              <th className="px-3 py-2 text-left">Leave</th>
              <th className="px-3 py-2 text-left">Unpaid Leave</th>
              <th className="px-3 py-2 text-left">Absent</th>
              <th className="px-3 py-2 text-left">Deductions</th>
              <th className="px-3 py-2 text-left">Net Pay</th>
              <th className="px-3 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50">
                <td className="px-3 py-2 text-sm font-medium">
                  {r.name} <span className="text-xs text-slate-500">({r.id})</span>
                </td>
                <td className="px-3 py-2 text-sm">{titleCase(r.role)}</td>
                <td className="px-3 py-2 text-sm">₹{r.base.toLocaleString("en-IN")}</td>
                <td className="px-3 py-2 text-sm">₹{r.daily.toLocaleString("en-IN")}</td>
                <td className="px-3 py-2 text-sm text-green-700">{r.present}</td>
                <td className="px-3 py-2 text-sm text-yellow-700">{r.leave}</td>
                <td className="px-3 py-2 text-sm text-orange-700">{r.unpaidLeaveDays}</td>
                <td className="px-3 py-2 text-sm text-red-700">{r.absent}</td>
                <td className="px-3 py-2 text-sm text-red-700">₹{r.deductions.toLocaleString("en-IN")}</td>
                <td className="px-3 py-2 text-sm font-semibold">₹{r.net.toLocaleString("en-IN")}</td>
                <td className="px-3 py-2 text-sm">
                  <ToolbarButton onClick={() => alert(`Marked ${r.name}'s salary as processed.`)}>Mark Paid</ToolbarButton>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={11} className="px-3 py-6 text-center text-sm text-slate-500">
                  No staff found for payroll.
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="bg-slate-50">
              <td colSpan={9} className="px-3 py-2 text-right text-sm font-semibold">
                Total Net
              </td>
              <td className="px-3 py-2 text-sm font-bold">₹{totalNet.toLocaleString("en-IN")}</td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

/* ---------------- main component ---------------- */
const HumanResources = () => {
  const [staff, setStaff] = useState(seed);
  const [directoryView, setDirectoryView] = useState("card"); // 'card' | 'list'
  const [section, setSection] = useState("directory"); // 'directory' | 'attendance' | 'payroll'
  const [roleFilter, setRoleFilter] = useState("");
  const [kw, setKw] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [addOpen, setAddOpen] = useState(false);

  // Attendance data shape: attendance[staffId][YYYY-MM][dayNumber] = 'P' | 'A' | 'L' | 'H'
  const [attendance, setAttendance] = useState({});
  // Leaves list
  const [leaves, setLeaves] = useState([
    // sample seeded leave
    { id: "LV-0001", staffId: "9010", from: "2025-08-12", to: "2025-08-13", type: "Paid", reason: "Family event", status: "Approved" },
    { id: "LV-0002", staffId: "9012", from: "2025-08-22", to: "2025-08-22", type: "Unpaid", reason: "Personal work", status: "Approved" },
  ]);

  // Generate next staff ID (increment max numeric id)
  const nextStaffId = () => {
    const maxNum = staff.reduce((max, s) => Math.max(max, parseInt(s.id, 10) || 0), 0);
    return String(maxNum + 1);
  };

  // Seed attendance for current month if empty
  useEffect(() => {
    const now = new Date();
    const key = monthKey(now);
    setAttendance((prev) => {
      const clone = { ...prev };
      staff.forEach((s) => {
        clone[s.id] = clone[s.id] || {};
        if (!clone[s.id][key]) {
          const rec = {};
          const dates = getMonthDates(now.getFullYear(), now.getMonth());
          dates.forEach((d, i) => {
            rec[i + 1] = isSunday(d) ? "H" : "P";
          });
          clone[s.id][key] = rec;
        }
      });
      return clone;
    });
  }, [staff]);

  // apply seeded leaves into attendance (only if same month)
  useEffect(() => {
    setAttendance((prev) => {
      const next = { ...prev };
      leaves.forEach((lv) => {
        const f = new Date(lv.from);
        const t = new Date(lv.to);
        const key = monthKey(f);
        next[lv.staffId] = next[lv.staffId] || {};
        next[lv.staffId][key] = { ...(next[lv.staffId][key] || {}) };
        for (let d = new Date(f); d <= t; d.setDate(d.getDate() + 1)) {
          if (monthKey(d) !== key) continue;
          const day = d.getDate();
          next[lv.staffId][key][day] = "L";
        }
      });
      return next;
    });
  }, []); // run once to apply initial leaves

  const filtered = useMemo(() => {
    const query = kw.trim().toLowerCase();
    return staff.filter((s) => {
      const matchesRole = roleFilter ? s.role === roleFilter : true;
      const matchesKw =
        !query ||
        [s.name, s.id, s.role, s.phone, s.email, s.dept, s.floor].join(" ").toLowerCase().includes(query);
      return matchesRole && matchesKw;
    });
  }, [staff, roleFilter, kw]);

  const openProfile = (s) => {
    setSelected(s);
    setDrawerOpen(true);
  };

  const addStaff = (s) => {
    setStaff((prev) => [s, ...prev]);
    setAddOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4">
      <div className="rounded-lg border bg-white">
        {/* header */}
        <div className="flex flex-wrap items-center justify-between px-4 py-3 border-b gap-2">
          <div className="text-base font-semibold">Human Resources</div>
          <div className="flex items-center gap-2">
            <ToolbarButton onClick={() => setSection("directory")}>Directory</ToolbarButton>
            <ToolbarButton onClick={() => setSection("attendance")}>Staff Attendance</ToolbarButton>
            <ToolbarButton onClick={() => setSection("payroll")}>Payroll</ToolbarButton>
            <ToolbarButton onClick={() => setAddOpen(true)} variant="primary">
              Add Staff ⌄
            </ToolbarButton>
          </div>
        </div>

        {section === "directory" && (
          <>
            {/* filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              <div>
                <label className="text-sm text-slate-600">Role *</label>
                <div className="flex gap-2">
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                  >
                    <option value="">Select</option>
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {titleCase(r)}
                      </option>
                    ))}
                  </select>
                  <ToolbarButton onClick={() => setRoleFilter("")}>Clear</ToolbarButton>
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-600">Search By Keyword</label>
                <div className="flex gap-2">
                  <input
                    value={kw}
                    onChange={(e) => setKw(e.target.value)}
                    placeholder="Search by Staff ID, Name, Role, etc…"
                    className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                  />
                  <ToolbarButton onClick={() => {}}>Search</ToolbarButton>
                </div>
              </div>
            </div>

            {/* view tabs */}
            <div className="px-4">
              <div className="flex items-center gap-3 border-b">
                <button
                  onClick={() => setDirectoryView("card")}
                  className={`px-3 py-2 text-sm border-b-2 -mb-[1px] ${
                    directoryView === "card" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-600"
                  }`}
                >
                  ▣ Card View
                </button>
                <button
                  onClick={() => setDirectoryView("list")}
                  className={`px-3 py-2 text-sm border-b-2 -mb-[1px] ${
                    directoryView === "list" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-600"
                  }`}
                >
                  ☰ List View
                </button>
                <div className="ml-auto text-sm text-slate-600 py-2">
                  Showing <b>{filtered.length}</b> staff
                </div>
              </div>
            </div>

            {/* content */}
            {directoryView === "card" ? (
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((s) => (
                  <div key={s.id} className="rounded-lg border bg-white p-3 flex gap-3 items-start">
                    <Avatar name={s.name} src={s.avatar} onClick={() => openProfile(s)} />
                    <div className="flex-1">
                      <div className="font-semibold">{s.name}</div>
                      <div className="text-xs text-slate-500">{s.id}</div>
                      <div className="mt-1 flex flex-wrap gap-1">
                        <Badge>{titleCase(s.role)}</Badge>
                        {s.dept && <Badge>{s.dept}</Badge>}
                      </div>
                      <div className="mt-2 text-sm text-slate-700 space-y-0.5">
                        <div>{s.phone}</div>
                        <div className="truncate">{s.floor}</div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <ToolbarButton onClick={() => openProfile(s)}>View</ToolbarButton>
                    </div>
                  </div>
                ))}
                {filtered.length === 0 && <div className="text-sm text-slate-500">No staff found.</div>}
              </div>
            ) : (
              <div className="overflow-x-auto p-4">
                <table className="min-w-[900px] w-full divide-y divide-gray-200">
                  <thead className="bg-slate-100 text-xs uppercase text-slate-600">
                    <tr className="text-left">
                      <th className="px-3 py-2">Staff</th>
                      <th className="px-3 py-2">Role</th>
                      <th className="px-3 py-2">Department</th>
                      <th className="px-3 py-2">Floor</th>
                      <th className="px-3 py-2">Phone</th>
                      <th className="px-3 py-2">Email</th>
                      <th className="px-3 py-2">Shift</th>
                      <th className="px-3 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filtered.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50">
                        <td className="px-3 py-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Avatar name={s.name} src={s.avatar} onClick={() => openProfile(s)} />
                            <div>
                              <div className="font-medium">{s.name}</div>
                              <div className="text-xs text-slate-500">ID: {s.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-2 text-sm">{titleCase(s.role)}</td>
                        <td className="px-3 py-2 text-sm">{s.dept}</td>
                        <td className="px-3 py-2 text-sm">{s.floor}</td>
                        <td className="px-3 py-2 text-sm">{s.phone}</td>
                        <td className="px-3 py-2 text-sm">{s.email}</td>
                        <td className="px-3 py-2 text-sm">{s.shift}</td>
                        <td className="px-3 py-2">
                          <ToolbarButton onClick={() => openProfile(s)}>View</ToolbarButton>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={8} className="px-3 py-6 text-center text-sm text-slate-500">
                          No staff found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {section === "attendance" && (
          <AttendanceView
            staff={staff}
            attendance={attendance}
            setAttendance={setAttendance}
            leaves={leaves}
            setLeaves={setLeaves}
          />
        )}

        {section === "payroll" && (
          <PayrollView staff={staff} attendance={attendance} leaves={leaves} />
        )}
      </div>

      {/* drawers / modals */}
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} staff={selected} />
      <AddStaffModal open={addOpen} onClose={() => setAddOpen(false)} onAdd={addStaff} nextId={nextStaffId} />
    </div>
  );
};

export default HumanResources;
