import { useMemo, useState } from "react";
import {
  FiUsers, FiLayers, FiGrid, FiClipboard, FiCalendar, FiRefreshCcw,
  FiClock, FiMapPin, FiChevronRight, FiActivity, FiBookOpen, FiAward
} from "react-icons/fi";

/* ------------------------------ helpers ------------------------------ */
const cls = (...a) => a.filter(Boolean).join(" ");
const fmtPct = (n) => `${n.toFixed(1)}%`;
const rand = (min, max) => Math.round(Math.random() * (max - min) + min);
const randFloat = (min, max) => Math.random() * (max - min) + min;
const sparkSeries = (arr) => (arr && arr.length ? arr : [3, 5, 4, 6, 7, 6, 8]); // ✅ define helper

function useNow() {
  const [now] = useState(() => new Date());
  return now;
}

/* ------------------------------ component ------------------------------ */
export default function DashboardCollege() {
  const now = useNow();

  const [metrics, setMetrics] = useState({
    students: 1280,
    courses: 86,
    depts: 20,
    attToday: 92.4,
  });

  const [attendance7d, setAttendance7d] = useState(() => {
    const base = 92;
    return Array.from({ length: 7 }, (_, i) =>
      Math.min(98, Math.max(82, base + Math.sin(i) * 3 + randFloat(-2, 2)))
    );
  });

  const [deptDist, setDeptDist] = useState(() => [
    { name: "Anatomy", students: 160 },
    { name: "Physiology", students: 150 },
    { name: "Biochemistry", students: 140 },
    { name: "Pharmacology", students: 115 },
    { name: "Pathology", students: 120 },
    { name: "Microbiology", students: 110 },
    { name: "Community Med.", students: 130 },
    { name: "Medicine", students: 180 },
    { name: "Surgery", students: 175 },
    { name: "OBG", students: 110 },
  ]);

  const schedule = [
    { time: "09:00", title: "Anatomy Lab — MBBS Sem 1", room: "Block A · Lab 2" },
    { time: "11:00", title: "Pharmacology Lecture", room: "Auditorium" },
    { time: "14:00", title: "Community Medicine Field Visit", room: "Urban Health Centre" },
    { time: "16:00", title: "OSCE Dry Run (Medicine)", room: "Simulation Center" },
  ];

  const announcements = [
    { tone: "emerald", text: "Internal assessments start next week (Sem 1 & 3)." },
    { tone: "amber", text: "Library maintenance on Sunday — limited seating 10:00–14:00." },
    { tone: "blue", text: "New simulation center slots now available for OSCE prep." },
  ];

  const totalDeptStudents = useMemo(
    () => deptDist.reduce((s, d) => s + d.students, 0),
    [deptDist]
  );

  const refresh = () => {
    const newAtt = Array.from({ length: 7 }, (_, i) =>
      Math.min(98, Math.max(80, metrics.attToday + Math.sin(i / 1.3) * 4 + randFloat(-3, 2)))
    );
    setAttendance7d(newAtt);

    setMetrics((m) => ({
      ...m,
      students: 1200 + rand(50, 200),
      courses: 80 + rand(1, 20),
      depts: 18 + rand(0, 3),
      attToday: Math.min(98, Math.max(80, 90 + randFloat(-4, 6))),
    }));

    setDeptDist((list) =>
      list.map((d) => ({ ...d, students: Math.max(60, d.students + rand(-15, 15)) }))
    );
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
          {now.toLocaleDateString()} • {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          <button
            onClick={refresh}
            className="ml-2 inline-flex items-center px-3 py-1.5 rounded-lg border bg-white hover:bg-gray-50"
            title="Simulate fresh data"
          >
            <FiRefreshCcw className="mr-2" /> Refresh Data
          </button>
        </div>
      </div>

      {/* animations */}
      <style>{`
        .card-in { animation: cardIn .28s ease both; }
        @keyframes cardIn { from { opacity:0; transform: translateY(6px) } to { opacity:1; transform:none } }
        .pulse { animation: pulse 1.8s ease-in-out infinite; }
        @keyframes pulse { 0%,100%{ box-shadow:0 0 0 0 rgba(59,130,246,.2)} 50%{ box-shadow:0 0 0 10px rgba(59,130,246,.06)}}
      `}</style>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPI
          title="Total Students"
          value={metrics.students.toLocaleString("en-IN")}
          icon={<Pill icon={<FiUsers />} />}
          color="blue"
          series={sparkSeries(attendance7d.map(v => v - 60))}
        />
        <KPI
          title="Total Courses"
          value={metrics.courses.toString()}
          icon={<Pill icon={<FiLayers />} tone="indigo" />}
          color="indigo"
          series={sparkSeries([3,5,4,6,7,6,8,10,9,11,10])}
        />
        <KPI
          title="Departments"
          value={metrics.depts.toString()}
          icon={<Pill icon={<FiGrid />} tone="violet" />}
          color="violet"
          series={sparkSeries([5,4,6,7,8,7,8,9])}
        />
        <KPI
          title="Attendance Today"
          value={fmtPct(metrics.attToday)}
          icon={<Pill icon={<FiClipboard />} tone="emerald" />}
          color="emerald"
          series={sparkSeries(attendance7d)}
        />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Left: Charts */}
        <section className="xl:col-span-2 card-in bg-white border rounded-xl p-5">
          <h2 className="text-lg font-semibold flex items-center">
            <FiActivity className="mr-2" /> Attendance — last 7 days
          </h2>
          <p className="text-sm text-gray-500">CBME cohorts · UG & PG combined</p>

          <div className="mt-4">
            <AreaChart data={attendance7d} min={80} max={100} height={180} />
          </div>

          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            <MiniStat label="Best Day" value={fmtPct(Math.max(...attendance7d))} />
            <MiniStat label="Low Day" value={fmtPct(Math.min(...attendance7d))} />
            <MiniStat label="Avg (7d)" value={fmtPct(attendance7d.reduce((a,b)=>a+b,0)/attendance7d.length)} />
            <MiniStat label="Today" value={fmtPct(metrics.attToday)} />
          </div>
        </section>

        {/* Right: Announcements */}
        <section className="card-in bg-white border rounded-xl p-5">
          <h2 className="text-lg font-semibold mb-3">Announcements</h2>
          <ul className="space-y-3 text-sm">
            {announcements.map((a, i) => (
              <li key={i} className={cls(
                "p-3 rounded-lg",
                a.tone === "emerald" && "bg-emerald-50 text-emerald-800",
                a.tone === "amber" && "bg-amber-50 text-amber-800",
                a.tone === "blue" && "bg-blue-50 text-blue-800",
              )}>{a.text}</li>
            ))}
          </ul>

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Quick Links</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <QuickLink icon={<FiBookOpen />} label="Curriculum" to="/college/curriculum" />
              <QuickLink icon={<FiClipboard />} label="Attendance" to="/college/attendance" />
              <QuickLink icon={<FiLayers />} label="Courses" to="/college/courses" />
              <QuickLink icon={<FiAward />} label="Awards" to="/college/awards" />
            </div>
          </div>
        </section>
      </div>

      {/* Lower grid: schedule + dept distribution */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Schedule */}
        <section className="xl:col-span-2 card-in bg-white border rounded-xl p-5">
          <h2 className="text-lg font-semibold mb-3 flex items-center">
            <FiCalendar className="mr-2" /> Today’s Schedule
          </h2>
          <div className="relative">
            <div className="absolute left-3 top-0 bottom-0 w-px bg-gray-200" />
            <div className="space-y-4">
              {schedule.map((s, i) => (
                <div key={i} className="relative pl-10">
                  <div className="absolute left-0 top-0.5 h-2.5 w-2.5 rounded-full bg-blue-500" />
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{s.title}</div>
                      <div className="text-xs text-gray-500 flex items-center">
                        <FiMapPin className="mr-1" /> {s.room}
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-blue-700">{s.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Department distribution */}
        <section className="card-in bg-white border rounded-xl p-5">
          <h2 className="text-lg font-semibold">Students by Department</h2>
          <p className="text-sm text-gray-500">UG & PG registrations</p>

          <div className="mt-4 space-y-3">
            {deptDist.map((d) => {
              const pct = (d.students / totalDeptStudents) * 100;
              return (
                <div key={d.name}>
                  <div className="flex items-center justify-between text-sm">
                    <div className="font-medium">{d.name}</div>
                    <div className="text-gray-600">{d.students}</div>
                  </div>
                  <div className="mt-1 h-2.5 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

/* ------------------------------ subcomponents ------------------------------ */

function Pill({ icon, tone = "blue" }) {
  const tones = {
    blue: "bg-blue-50 text-blue-700",
    indigo: "bg-indigo-50 text-indigo-700",
    violet: "bg-violet-50 text-violet-700",
    emerald: "bg-emerald-50 text-emerald-700",
  };
  return <div className={cls("p-3 rounded-lg", tones[tone])}>{icon}</div>;
}

function KPI({ title, value, icon, color = "blue", series }) {
  const colorMap = {
    blue: { stroke: "#2563eb", fill: "rgba(37,99,235,0.12)" },
    indigo: { stroke: "#4f46e5", fill: "rgba(79,70,229,0.12)" },
    violet: { stroke: "#7c3aed", fill: "rgba(124,58,237,0.12)" },
    emerald: { stroke: "#059669", fill: "rgba(5,150,105,0.12)" },
  };
  const c = colorMap[color];
  return (
    <div className="card-in bg-white border rounded-xl p-5 flex items-center gap-4">
      {icon}
      <div className="flex-1">
        <div className="text-sm text-gray-500">{title}</div>
        <div className="text-xl font-semibold">{value}</div>
      </div>
      <Sparkline data={series} stroke={c.stroke} fill={c.fill} />
    </div>
  );
}

function Sparkline({ data, stroke = "#2563eb", fill = "rgba(37,99,235,0.12)", width = 96, height = 36, pad = 6 }) {
  const { path } = useMemo(() => {
    const xs = data.map((_, i) => i);
    const ys = data;
    const min = Math.min(...ys);
    const max = Math.max(...ys);
    const xScale = (i) => pad + (i * (width - pad * 2)) / (xs.length - 1 || 1);
    const yScale = (v) => height - pad - ((v - min) * (height - pad * 2)) / (max - min || 1);
    const d = ys.map((v, i) => `${i === 0 ? "M" : "L"} ${xScale(i)} ${yScale(v)}`).join(" ");
    return { path: d };
  }, [data, width, height, pad]);

  const area = `${path} L ${width - pad} ${height - pad} L ${pad} ${height - pad} Z`;
  return (
    <svg width={width} height={height} className="hidden sm:block">
      <path d={area} fill={fill} />
      <path d={path} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function AreaChart({ data, min = 0, max = 100, height = 180, pad = 28 }) {
  const width = 720;
  const n = data.length;
  const xScale = (i) => pad + (i * (width - pad * 2)) / (n - 1 || 1);
  const yScale = (v) => height - pad - ((v - min) * (height - pad * 2)) / (max - min || 1);

  const path = data.map((v, i) => `${i === 0 ? "M" : "L"} ${xScale(i)} ${yScale(v)}`).join(" ");
  const area = `${path} L ${xScale(n - 1)} ${height - pad} L ${xScale(0)} ${height - pad} Z`;

  const ticksY = [min, (min+max)/2, max];
  const ticksX = ["D1", "D2", "D3", "D4", "D5", "D6", "Today"];

  return (
    <div className="w-full overflow-hidden">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        {ticksY.map((t, i) => (
          <g key={i}>
            <line x1={pad} x2={width - pad} y1={yScale(t)} y2={yScale(t)} stroke="#e5e7eb" strokeDasharray="4 4" />
            <text x={4} y={yScale(t) + 4} fontSize="10" fill="#6b7280">{Math.round(t)}%</text>
          </g>
        ))}
        {ticksX.map((t, i) => (
          <text key={i} x={xScale((n - 1) * (i / (ticksX.length - 1)))} y={height - 6} fontSize="10" textAnchor="middle" fill="#6b7280">
            {t}
          </text>
        ))}

        <defs>
          <linearGradient id="attFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(37,99,235,0.25)" />
            <stop offset="100%" stopColor="rgba(37,99,235,0.02)" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#attFill)" />
        <path d={path} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx={xScale(n-1)} cy={yScale(data[n-1])} r="4" fill="#2563eb" className="pulse" />
      </svg>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="p-3 rounded-lg border bg-gray-50">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}

function QuickLink({ icon, label, to }) {
  return (
    <a href={to} className="group p-3 rounded-lg border bg-white hover:bg-gray-50 flex items-center justify-between">
      <span className="inline-flex items-center">
        <span className="mr-2">{icon}</span> {label}
      </span>
      <FiChevronRight className="opacity-60 group-hover:translate-x-0.5 transition" />
    </a>
  );
}
