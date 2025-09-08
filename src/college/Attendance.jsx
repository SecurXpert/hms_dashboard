import { useMemo, useState } from "react";
import {
  FiCalendar, FiCheckCircle, FiXCircle, FiFilter, FiSearch,
  FiUsers, FiLayers, FiGrid, FiClock, FiMapPin, FiChevronDown, FiRefreshCw
} from "react-icons/fi";

/* ---------------- Sample data (Indian names) ---------------- */
const STUDENTS = [
  // MBBS Sem 1
  { id: "MB23-001", name: "Aarav Gupta", program: "MBBS", semester: "Sem 1", department: "Anatomy", batch: "A" },
  { id: "MB23-002", name: "Ishita Rao", program: "MBBS", semester: "Sem 1", department: "Anatomy", batch: "A" },
  { id: "MB23-003", name: "Rohan Mehta", program: "MBBS", semester: "Sem 1", department: "Anatomy", batch: "B" },
  { id: "MB23-004", name: "Sneha Iyer", program: "MBBS", semester: "Sem 1", department: "Anatomy", batch: "B" },
  // MBBS Sem 3
  { id: "MB23-101", name: "Karthik Nair", program: "MBBS", semester: "Sem 3", department: "Pharmacology", batch: "A" },
  { id: "MB23-102", name: "Priya Sharma", program: "MBBS", semester: "Sem 3", department: "Microbiology", batch: "A" },
  { id: "MB23-103", name: "Aditya Verma", program: "MBBS", semester: "Sem 3", department: "Pathology", batch: "B" },
  // Nursing
  { id: "NU23-003", name: "Meera Reddy", program: "B.Sc Nursing", semester: "Sem 2", department: "Nursing", batch: "C" },
  { id: "NU23-009", name: "Divya Menon", program: "B.Sc Nursing", semester: "Sem 2", department: "Nursing", batch: "C" },
  // Allied Health (BPT)
  { id: "PT23-005", name: "Aman Yadav", program: "Allied Health (BPT)", semester: "Sem 1", department: "Physiotherapy", batch: "P1" },
  { id: "PT23-006", name: "Neha Kulkarni", program: "Allied Health (BPT)", semester: "Sem 1", department: "Physiotherapy", batch: "P1" },
];

const DEPARTMENTS = [
  "Anatomy", "Physiology", "Biochemistry", "Pathology",
  "Pharmacology", "Microbiology", "Community Medicine", "Nursing", "Physiotherapy"
];

// Lab / Practical sessions (map students by IDs)
const LAB_SESSIONS = [
  {
    id: "LAB-ANA-A1",
    title: "Anatomy Dissection — Batch A",
    department: "Anatomy",
    room: "Block A · Lab 2",
    slot: "09:00–11:00",
    instructor: "Dr. Kavita Sharma",
    students: ["MB23-001", "MB23-002"]
  },
  {
    id: "LAB-ANA-B1",
    title: "Anatomy Dissection — Batch B",
    department: "Anatomy",
    room: "Block A · Lab 3",
    slot: "11:30–13:00",
    instructor: "Dr. Reena Kapoor",
    students: ["MB23-003", "MB23-004"]
  },
  {
    id: "LAB-PHAR-A1",
    title: "Pharmacology Practical — Sem 3",
    department: "Pharmacology",
    room: "Block C · Lab 1",
    slot: "14:00–16:00",
    instructor: "Dr. Arvind Rao",
    students: ["MB23-101"]
  },
  {
    id: "LAB-NUR-C1",
    title: "Nursing Clinical Skills — Sem 2",
    department: "Nursing",
    room: "Skill Lab · Central",
    slot: "10:00–12:00",
    instructor: "Sr. Nisha Joseph",
    students: ["NU23-003", "NU23-009"]
  },
  {
    id: "LAB-BPT-P1",
    title: "Physiotherapy Biomechanics Demo",
    department: "Physiotherapy",
    room: "Block D · PT Lab",
    slot: "12:00–13:30",
    instructor: "Dr. Manish Patel",
    students: ["PT23-005", "PT23-006"]
  },
];

/* ---------------- Small helpers ---------------- */
const cls = (...a) => a.filter(Boolean).join(" ");
const getTodayISO = () => new Date().toISOString().slice(0, 10);

export default function Attendance() {
  const [date, setDate] = useState(getTodayISO());
  const [view, setView] = useState("program"); // 'program' | 'department' | 'lab'
  const [prog, setProg] = useState("All");
  const [sem, setSem] = useState("All");
  const [dept, setDept] = useState("All");
  const [sessionId, setSessionId] = useState(LAB_SESSIONS[0]?.id || "");
  const [q, setQ] = useState("");

  // Master marks store: key → 'P' | 'A'
  // Key format: `${date}|${scope}|${scopeId}|${studentId}`
  const [marks, setMarks] = useState({});

  /* ------------ Filters ------------- */
  const allPrograms = useMemo(
    () => ["All", ...Array.from(new Set(STUDENTS.map(s => s.program)))],
    []
  );
  const allSems = useMemo(() => {
    const base = STUDENTS.filter(s => prog === "All" || s.program === prog)
                         .map(s => s.semester);
    return ["All", ...Array.from(new Set(base))];
  }, [prog]);

  const deptOptions = useMemo(() => ["All", ...DEPARTMENTS], []);

  /* ------------ Data slices ------------- */
  const programRows = useMemo(() => {
    const list = STUDENTS.filter(s =>
      (prog === "All" || s.program === prog) &&
      (sem === "All" || s.semester === sem) &&
      (q.trim() === "" || `${s.id} ${s.name}`.toLowerCase().includes(q.toLowerCase()))
    );
    return list;
  }, [prog, sem, q]);

  const deptMap = useMemo(() => {
    const map = {};
    STUDENTS.forEach(s => {
      map[s.department] ||= [];
      map[s.department].push(s);
    });
    return map;
  }, []);

  const deptRows = useMemo(() => {
    const base = dept === "All" ? DEPARTMENTS : [dept];
    return base.map(d => ({ department: d, students: (deptMap[d] || []).filter(s =>
      q.trim() === "" || `${s.id} ${s.name}`.toLowerCase().includes(q.toLowerCase())
    ) }));
  }, [dept, q, deptMap]);

  const activeSession = useMemo(() => LAB_SESSIONS.find(s => s.id === sessionId), [sessionId]);
  const labRows = useMemo(() => {
    if (!activeSession) return [];
    const ids = new Set(activeSession.students);
    const list = STUDENTS.filter(s => ids.has(s.id))
      .filter(s => q.trim() === "" || `${s.id} ${s.name}`.toLowerCase().includes(q.toLowerCase()));
    return list;
  }, [activeSession, q]);

  /* ------------ Mark helpers ------------- */
  const makeKey = (scope, scopeId, sid) => `${date}|${scope}|${scopeId}|${sid}`;
  const getMark = (scope, scopeId, sid) => marks[makeKey(scope, scopeId, sid)];
  const setMark = (scope, scopeId, sid, val) =>
    setMarks(m => ({ ...m, [makeKey(scope, scopeId, sid)]: val }));

  const bulkMark = (students, scope, scopeId, val) => {
    setMarks(m => {
      const next = { ...m };
      students.forEach(s => next[makeKey(scope, scopeId, s.id)] = val);
      return next;
    });
  };

  const bulkClear = (students, scope, scopeId) => {
    setMarks(m => {
      const next = { ...m };
      students.forEach(s => delete next[makeKey(scope, scopeId, s.id)]);
      return next;
    });
  };

  /* ------------ Counters ------------- */
  const countFor = (students, scope, scopeId) => {
    let present = 0, absent = 0;
    students.forEach(s => {
      const v = getMark(scope, scopeId, s.id);
      if (v === "P") present++;
      else if (v === "A") absent++;
    });
    return { present, absent, total: students.length };
  };

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FiUsers /> Attendance
        </h1>
        <div className="flex items-center gap-2 text-sm">
          <FiCalendar />
          <input
            type="date"
            className="border rounded-lg px-3 py-1.5"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </div>
      </div>

      {/* Animations (local, safe to duplicate) */}
      <style>{`
        .card-in { animation: cardIn .3s ease both; }
        @keyframes cardIn { from { opacity:0; transform: translateY(6px) } to { opacity:1; transform:none } }
        .pill { transition: all .15s ease; }
        .fade { animation: fade .25s ease both; }
        @keyframes fade { from { opacity:0 } to { opacity:1 } }
      `}</style>

      {/* View switch */}
      <div className="card-in bg-white border rounded-xl p-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setView("program")}
              className={cls("pill px-3 py-1.5 rounded-full border text-sm",
                view === "program" ? "bg-blue-600 text-white border-blue-600" : "bg-white hover:bg-gray-50")}
            >
              Program-wise
            </button>
            <button
              onClick={() => setView("department")}
              className={cls("pill px-3 py-1.5 rounded-full border text-sm",
                view === "department" ? "bg-blue-600 text-white border-blue-600" : "bg-white hover:bg-gray-50")}
            >
              Department-wise
            </button>
            <button
              onClick={() => setView("lab")}
              className={cls("pill px-3 py-1.5 rounded-full border text-sm",
                view === "lab" ? "bg-blue-600 text-white border-blue-600" : "bg-white hover:bg-gray-50")}
            >
              Lab / Practical-wise
            </button>
          </div>

          {/* Quick search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              className="pl-9 pr-3 py-2 border rounded-lg text-sm w-72 max-w-full"
              placeholder="Search by ID or name…"
            />
          </div>
        </div>
      </div>

      {/* Views */}
      {view === "program" && (
        <section className="space-y-4 fade">
          {/* Filters */}
          <div className="card-in bg-white border rounded-xl p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 flex items-center"><FiLayers className="mr-2" /> Program:</span>
                <select className="border rounded-lg px-3 py-2 text-sm" value={prog} onChange={e => { setProg(e.target.value); setSem("All"); }}>
                  {allPrograms.map(p => <option key={p}>{p}</option>)}
                </select>
                <span className="text-sm text-gray-600 ml-2">Semester:</span>
                <select className="border rounded-lg px-3 py-2 text-sm" value={sem} onChange={e => setSem(e.target.value)}>
                  {allSems.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1.5 rounded-lg border hover:bg-gray-50 text-sm"
                  onClick={() => bulkMark(programRows, "prog", `${prog}|${sem}`, "P")}
                >
                  Mark all Present
                </button>
                <button
                  className="px-3 py-1.5 rounded-lg border hover:bg-gray-50 text-sm"
                  onClick={() => bulkMark(programRows, "prog", `${prog}|${sem}`, "A")}
                >
                  Mark all Absent
                </button>
                <button
                  className="px-3 py-1.5 rounded-lg border hover:bg-gray-50 text-sm"
                  onClick={() => bulkClear(programRows, "prog", `${prog}|${sem}`)}
                  title="Clear marks in current view"
                >
                  <FiRefreshCw className="inline mr-1" /> Clear
                </button>
              </div>
            </div>

            {/* Counters */}
            <Counters data={countFor(programRows, "prog", `${prog}|${sem}`)} />
          </div>

          {/* Table */}
          <div className="card-in bg-white border rounded-xl p-4 overflow-x-auto">
            <table className="min-w-[720px] w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="py-2">ID</th>
                  <th className="py-2">Name</th>
                  <th className="py-2">Program</th>
                  <th className="py-2">Semester</th>
                  <th className="py-2">Department</th>
                  <th className="py-2">Batch</th>
                  <th className="py-2">Mark</th>
                </tr>
              </thead>
              <tbody>
                {programRows.map(s => (
                  <RowMark
                    key={s.id}
                    student={s}
                    mark={getMark("prog", `${prog}|${sem}`, s.id)}
                    onPresent={() => setMark("prog", `${prog}|${sem}`, s.id, "P")}
                    onAbsent={() => setMark("prog", `${prog}|${sem}`, s.id, "A")}
                  />
                ))}
                {!programRows.length && <tr><td colSpan={7} className="py-6 text-center text-gray-500">No records</td></tr>}
              </tbody>
            </table>

            <div className="mt-4 text-right">
              <button className="px-3 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700">Save Attendance</button>
            </div>
          </div>
        </section>
      )}

      {view === "department" && (
        <section className="space-y-4 fade">
          {/* Filters */}
          <div className="card-in bg-white border rounded-xl p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 flex items-center"><FiGrid className="mr-2" /> Department:</span>
                <select className="border rounded-lg px-3 py-2 text-sm" value={dept} onChange={e => setDept(e.target.value)}>
                  {deptOptions.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="text-xs text-gray-500 flex items-center"><FiFilter className="mr-2" /> Search applies across expanded sections.</div>
            </div>
          </div>

          {/* Groups */}
          <div className="space-y-3">
            {deptRows.map(group => (
              <DeptBlock
                key={group.department}
                title={group.department}
                students={group.students}
                getMark={(sid) => getMark("dept", group.department, sid)}
                setP={(sid) => setMark("dept", group.department, sid, "P")}
                setA={(sid) => setMark("dept", group.department, sid, "A")}
                bulkPresent={() => bulkMark(group.students, "dept", group.department, "P")}
                bulkAbsent={() => bulkMark(group.students, "dept", group.department, "A")}
                bulkClear={() => bulkClear(group.students, "dept", group.department)}
                counters={countFor(group.students, "dept", group.department)}
              />
            ))}
          </div>
        </section>
      )}

      {view === "lab" && (
        <section className="space-y-4 fade">
          {/* Session select */}
          <div className="card-in bg-white border rounded-xl p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:items-center">
              <div className="flex items-center gap-2 md:col-span-2">
                <span className="text-sm text-gray-600 flex items-center"><FiClock className="mr-2" /> Session:</span>
                <select className="border rounded-lg px-3 py-2 text-sm w-full" value={sessionId} onChange={e => setSessionId(e.target.value)}>
                  {LAB_SESSIONS.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                </select>
              </div>
              {activeSession && (
                <div className="text-xs text-gray-600">
                  <div className="flex items-center"><FiMapPin className="mr-2" /> {activeSession.room}</div>
                  <div className="flex items-center"><FiClock className="mr-2" /> {activeSession.slot}</div>
                  <div className="mt-1">Instructor: <span className="font-medium">{activeSession.instructor}</span></div>
                </div>
              )}
            </div>

            {/* Counters + bulk */}
            {activeSession && (
              <div className="mt-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <Counters data={countFor(labRows, "lab", activeSession.id)} />
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 rounded-lg border hover:bg-gray-50 text-sm" onClick={() => bulkMark(labRows, "lab", activeSession.id, "P")}>Mark all Present</button>
                  <button className="px-3 py-1.5 rounded-lg border hover:bg-gray-50 text-sm" onClick={() => bulkMark(labRows, "lab", activeSession.id, "A")}>Mark all Absent</button>
                  <button className="px-3 py-1.5 rounded-lg border hover:bg-gray-50 text-sm" onClick={() => bulkClear(labRows, "lab", activeSession.id)}><FiRefreshCw className="inline mr-1" /> Clear</button>
                </div>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="card-in bg-white border rounded-xl p-4 overflow-x-auto">
            <table className="min-w-[720px] w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="py-2">ID</th>
                  <th className="py-2">Name</th>
                  <th className="py-2">Program</th>
                  <th className="py-2">Semester</th>
                  <th className="py-2">Department</th>
                  <th className="py-2">Batch</th>
                  <th className="py-2">Mark</th>
                </tr>
              </thead>
              <tbody>
                {labRows.map(s => (
                  <RowMark
                    key={s.id}
                    student={s}
                    mark={activeSession ? getMark("lab", activeSession.id, s.id) : undefined}
                    onPresent={() => activeSession && setMark("lab", activeSession.id, s.id, "P")}
                    onAbsent={() => activeSession && setMark("lab", activeSession.id, s.id, "A")}
                  />
                ))}
                {!labRows.length && <tr><td colSpan={7} className="py-6 text-center text-gray-500">No records</td></tr>}
              </tbody>
            </table>

            <div className="mt-4 text-right">
              <button className="px-3 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700">Save Attendance</button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

/* ---------- Reusable bits ---------- */

function RowMark({ student, mark, onPresent, onAbsent }) {
  return (
    <tr className="border-t">
      <td className="py-3">{student.id}</td>
      <td className="py-3">{student.name}</td>
      <td className="py-3">{student.program}</td>
      <td className="py-3">{student.semester}</td>
      <td className="py-3">{student.department}</td>
      <td className="py-3">{student.batch}</td>
      <td className="py-3">
        <div className="flex items-center gap-2">
          <button
            className={cls(
              "px-2 py-1 rounded-md border flex items-center",
              mark === "P" ? "bg-emerald-50 text-emerald-700" : "hover:bg-gray-50"
            )}
            onClick={onPresent}
          >
            <FiCheckCircle className="mr-1" /> Present
          </button>
          <button
            className={cls(
              "px-2 py-1 rounded-md border flex items-center",
              mark === "A" ? "bg-rose-50 text-rose-700" : "hover:bg-gray-50"
            )}
            onClick={onAbsent}
          >
            <FiXCircle className="mr-1" /> Absent
          </button>
        </div>
      </td>
    </tr>
  );
}

function Counters({ data }) {
  const chip = (bg, text, label, value) => (
    <span className={cls("inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs border", bg, text)}>
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "currentColor" }} />
      {label}: <span className="font-semibold">{value}</span>
    </span>
  );
  return (
    <div className="flex items-center gap-2 text-xs">
      {chip("bg-emerald-50 border-emerald-200", "text-emerald-700", "Present", data.present)}
      {chip("bg-rose-50 border-rose-200", "text-rose-700", "Absent", data.absent)}
      {chip("bg-slate-50 border-slate-200", "text-slate-700", "Total", data.total)}
    </div>
  );
}

function DeptBlock({
  title, students, getMark, setP, setA, bulkPresent, bulkAbsent, bulkClear, counters
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="card-in bg-white border rounded-xl">
      <button onClick={() => setOpen(o => !o)} className="w-full px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">{title}</span>
          <span className="text-xs px-2 py-1 rounded-md bg-blue-50 text-blue-700">{students.length} students</span>
        </div>
        <FiChevronDown className={cls("h-5 w-5 transition", open ? "rotate-180" : "")} />
      </button>

      {open && (
        <div className="px-4 pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <Counters data={counters} />
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 rounded-lg border hover:bg-gray-50 text-sm" onClick={bulkPresent}>Mark all Present</button>
              <button className="px-3 py-1.5 rounded-lg border hover:bg-gray-50 text-sm" onClick={bulkAbsent}>Mark all Absent</button>
              <button className="px-3 py-1.5 rounded-lg border hover:bg-gray-50 text-sm" onClick={bulkClear}><FiRefreshCw className="inline mr-1" /> Clear</button>
            </div>
          </div>

          <div className="mt-3 overflow-x-auto">
            <table className="min-w-[720px] w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="py-2">ID</th>
                  <th className="py-2">Name</th>
                  <th className="py-2">Program</th>
                  <th className="py-2">Semester</th>
                  <th className="py-2">Batch</th>
                  <th className="py-2">Mark</th>
                </tr>
              </thead>
              <tbody>
                {students.map(s => (
                  <tr key={s.id} className="border-t">
                    <td className="py-3">{s.id}</td>
                    <td className="py-3">{s.name}</td>
                    <td className="py-3">{s.program}</td>
                    <td className="py-3">{s.semester}</td>
                    <td className="py-3">{s.batch}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <button
                          className={cls("px-2 py-1 rounded-md border flex items-center",
                            getMark(s.id) === "P" ? "bg-emerald-50 text-emerald-700" : "hover:bg-gray-50")}
                          onClick={() => setP(s.id)}
                        >
                          <FiCheckCircle className="mr-1" /> Present
                        </button>
                        <button
                          className={cls("px-2 py-1 rounded-md border flex items-center",
                            getMark(s.id) === "A" ? "bg-rose-50 text-rose-700" : "hover:bg-gray-50")}
                          onClick={() => setA(s.id)}
                        >
                          <FiXCircle className="mr-1" /> Absent
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!students.length && <tr><td colSpan={6} className="py-6 text-center text-gray-500">No records</td></tr>}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-right">
            <button className="px-3 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700">Save Department</button>
          </div>
        </div>
      )}
    </div>
  );
}
