import React, { useEffect, useMemo, useRef, useState } from "react";

/* -------------------------------------------------------
   Helpers
------------------------------------------------------- */
const INR = (n) =>
  (Number(n) || 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const monthsFull = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const modules = [
  "OPD","IPD","Pharmacy","Pathology","Radiology","Blood Bank","Ambulance","General",
];

const toneBG = {
  emerald: "bg-emerald-100",
  indigo: "bg-indigo-100",
  amber: "bg-amber-100",
  cyan: "bg-cyan-100",
  fuchsia: "bg-fuchsia-100",
  rose: "bg-rose-100",
  teal: "bg-teal-100",
  red: "bg-red-100",
};
const btn = "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2";

/* -------------------------------------------------------
   Tiny icons (no deps)
------------------------------------------------------- */
const MoneyBag = (cls="text-emerald-600") => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className={cls}>
    <path d="M7 7c0-1.657 1.79-3 4-3s4 1.343 4 3h3a1 1 0 110 2h-1.11A7.002 7.002 0 0121 16c0 3.866-3.582 7-8 7s-8-3.134-8-7a7.002 7.002 0 014.11-7H7a1 1 0 110-2h0zM9 5.5c.463-.314 1.24-.5 2-.5s1.537.186 2 .5c-.463.314-1.24.5-2 .5s-1.537-.186-2-.5z" />
  </svg>
);
const Hospital = (cls="text-indigo-600") => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className={cls}>
    <path d="M3 21V5a2 2 0 012-2h4v4h2V3h4a2 2 0 012 2v16h2v2H1v-2h2zm6-6h2v-2h2v-2h-2V9H9v2H7v2h2v2z" />
  </svg>
);
const Flask = (cls="text-amber-600") => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className={cls}>
    <path d="M9 3h6v2h-1v3.535l4.95 8.568A3 3 0 0116.382 21H7.618a3 3 0 01-2.568-3.897L10 8.535V5H9V3z" />
  </svg>
);
const TestTube = (cls="text-cyan-600") => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className={cls}>
    <path d="M7 2h10v2h-3v5.586l4.707 4.707a4 4 0 11-5.657 5.657L8.343 15.24A4.98 4.98 0 017 11.707V4H7V2z" />
  </svg>
);
const Radio = (cls="text-fuchsia-700") => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className={cls}>
    <path d="M12 3a9 9 0 019 9h-2a7 7 0 10-7 7v2a9 9 0 010-18zm0 5a4 4 0 110 8 4 4 0 010-8z" />
  </svg>
);
const Drop = (cls="text-rose-600") => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className={cls}>
    <path d="M12 2s6 7 6 11a6 6 0 11-12 0c0-4 6-11 6-11z" />
  </svg>
);
const Ambulance = (cls="text-teal-600") => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className={cls}>
    <path d="M3 7h9l3 3h3a3 3 0 013 3v6h-2a2 2 0 11-4 0H9a2 2 0 11-4 0H3V7zm6 2H7v2H5v2h2v2h2v-2h2v-2H9V9z" />
  </svg>
);
const ExpenseIcon = (cls="text-red-600") => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className={cls}>
    <path d="M12 3l4 4h-3v6h-2V7H8l4-4zm-7 9h2v7h12v-7h2v9H5v-9z" />
  </svg>
);

/* -------------------------------------------------------
   Counter (animated number)
------------------------------------------------------- */
const Counter = ({ value, format = INR, duration = 700 }) => {
  const [v, setV] = useState(0);
  const raf = useRef();

  useEffect(() => {
    const start = performance.now();
    const from = 0;
    const to = Number(value) || 0;
    const tick = (now) => {
      const t = clamp((now - start) / duration, 0, 1);
      const cur = from + (to - from) * t;
      setV(cur);
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [value, duration]);

  return <>{format(v)}</>;
};

/* -------------------------------------------------------
   Charts (pure SVG)
------------------------------------------------------- */
const LineChart = ({ labels, income, expenses }) => {
  const w = 860, h = 260, pad = 30;
  const n = labels.length;

  const norm = (arr) => {
    const m = Math.max(...arr, 1);
    return arr.map((v) => v / m);
  };
  const incN = norm(income);
  const expN = norm(expenses);

  const pathFrom = (normArr) =>
    normArr
      .map((v, i) => {
        const x = pad + (i * (w - 2 * pad)) / (n - 1 || 1);
        const y = h - pad - v * (h - 2 * pad);
        return `${i === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full h-48 sm:h-56 md:h-64"
        preserveAspectRatio="xMidYMid meet"
      >
        <style>{`
          .dashAnim { stroke-dasharray: 1000; stroke-dashoffset: 1000; animation: dash 1.2s ease forwards; }
          @media (prefers-reduced-motion: reduce) { .dashAnim { animation: none; stroke-dashoffset: 0; } }
          @keyframes dash { to { stroke-dashoffset: 0; } }
        `}</style>
        <rect x="0" y="0" width={w} height={h} rx="16" fill="#ffffff" />
        {[...Array(5)].map((_, i) => {
          const y = pad + (i * (h - 2 * pad)) / 4;
          return <line key={i} x1={pad} y1={y} x2={w - pad} y2={y} stroke="#e5e7eb" strokeWidth="1" />;
        })}
        <line x1={pad} y1={pad} x2={pad} y2={h - pad} stroke="#cbd5e1" />
        <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke="#cbd5e1" />
        <path className="dashAnim" d={pathFrom(incN)} fill="none" stroke="#10b981" strokeWidth="3" />
        <path className="dashAnim" d={pathFrom(expN)} fill="none" stroke="#ef4444" strokeWidth="3" />
        {labels.map((m, i) => {
          const x = pad + (i * (w - 2 * pad)) / (n - 1 || 1);
          return (
            <text key={m} x={x} y={h - 8} textAnchor="middle" className="fill-slate-500 text-[9px] sm:text-[10px]">
              {m}
            </text>
          );
        })}
        <g transform={`translate(${pad + 6},${pad})`}>
          <rect width="10" height="10" fill="#10b981" rx="2" />
          <text x="16" y="9" className="fill-slate-600 text-xs">Income</text>
          <rect x="70" width="10" height="10" fill="#ef4444" rx="2" />
          <text x="86" y="9" className="fill-slate-600 text-xs">Expenses</text>
        </g>
      </svg>
    </div>
  );
};

const DonutChart = ({ data, onLegendClick }) => {
  const size = 260, radius = 100, thick = 40, cx = size / 2, cy = size / 2;
  const keys = Object.keys(data);
  const total = keys.reduce((a, k) => a + data[k], 0) || 1;
  const palette = ["#8b5cf6","#f59e0b","#10b981","#06b6d4","#3b82f6","#ef4444","#14b8a6","#64748b"];

  let start = 0;
  const arcs = keys.map((k, i) => {
    const val = data[k];
    const angle = (val / total) * Math.PI * 2;
    const end = start + angle;
    const large = angle > Math.PI ? 1 : 0;
    const sx = cx + radius * Math.cos(start);
    const sy = cy + radius * Math.sin(start);
    const ex = cx + radius * Math.cos(end);
    const ey = cy + radius * Math.sin(end);
    const path = `M ${sx} ${sy} A ${radius} ${radius} 0 ${large} 1 ${ex} ${ey}`;
    start = end;
    return { k, path, color: palette[i % palette.length], val, i };
  });

  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center md:items-start">
      <svg width={size} height={size} className="shrink-0">
        <style>{`
          .arcDash { stroke-dasharray: 600; stroke-dashoffset: 600; animation: draw 1.2s ease forwards; }
          @media (prefers-reduced-motion: reduce) { .arcDash { animation: none; stroke-dashoffset: 0; } }
          @keyframes draw { to { stroke-dashoffset: 0; } }
        `}</style>
        <circle cx={cx} cy={cy} r={radius} stroke="#e5e7eb" strokeWidth={thick} fill="none" />
        {arcs.map((a) => (
          <path
            key={a.i}
            d={a.path}
            className="arcDash cursor-pointer"
            stroke={a.color}
            strokeWidth={thick}
            fill="none"
            strokeLinecap="butt"
          >
            <title>{`${a.k}: ${INR(a.val)}`}</title>
          </path>
        ))}
        <circle cx={cx} cy={cy} r={radius - thick} fill="white" />
        <text x={cx} y={cy - 2} textAnchor="middle" className="fill-slate-600 font-semibold">
          {INR(total)}
        </text>
        <text x={cx} y={cy + 16} textAnchor="middle" className="fill-slate-400 text-xs">Total</text>
      </svg>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 w-full">
        {keys.map((k, i) => (
          <button
            key={k}
            onClick={() => onLegendClick?.(k)}
            className="flex items-center gap-2 group text-left"
            title={`View ${k} details`}
          >
            <span
              className="inline-block w-3 h-3 rounded group-hover:scale-125 transition"
              style={{ background: palette[i % palette.length] }}
            />
            <span className="text-sm text-slate-600 group-hover:text-slate-900 truncate">{k}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

/* -------------------------------------------------------
   UI tiny blocks
------------------------------------------------------- */
const StatCard = ({ icon, label, value, tone = "emerald", onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 rounded-2xl border p-4 shadow-sm bg-white transition hover:-translate-y-0.5 hover:shadow-md w-full"
  >
    <div className={`p-3 rounded-xl ${toneBG[tone] || "bg-slate-100"}`}>{icon}</div>
    <div className="flex flex-col items-start min-w-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-base sm:text-lg font-semibold truncate">
        <Counter value={value} />
      </span>
    </div>
  </button>
);

const CalendarWeek = ({ weekLabel, items }) => (
  <div className="rounded-2xl border bg-white p-4 shadow-sm">
    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
      <div className="text-lg font-semibold">Calendar</div>
      <div className="flex items-center gap-2">
        <button className="px-2 py-1 rounded border text-sm">Month</button>
        <button className="px-2 py-1 rounded border bg-slate-900 text-white text-sm">Week</button>
        <button className="px-2 py-1 rounded border text-sm">Day</button>
      </div>
    </div>
    <div className="text-sm text-slate-500 mb-2">{weekLabel}</div>

    {/* Responsive columns: 2 → 3 → 4 → 7 */}
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
      {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
        <div key={d} className="text-xs text-slate-500 text-center hidden lg:block">{d}</div>
      ))}
      {items.map((col, i) => (
        <div key={i} className="min-h-28 rounded-xl border bg-slate-50 p-2">
          {col.map((chip, j) => (
            <div key={j} className="text-[11px] mb-1 rounded-lg px-2 py-1 bg-slate-900 text-white truncate" title={chip}>
              {chip}
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

/* -------------------------------------------------------
   Detail modal (module breakdown)
------------------------------------------------------- */
const ModuleDetailModal = ({ open, onClose, title, rows = [] }) => {
  if (!open) return null;

  const exportCsv = () => {
    const header = ["Date","Description","Amount (₹)"];
    const data = rows.map((r) => [r.date, r.desc, r.amount]);
    const csv = [header, ...data].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${title.replace(/\s+/g, "_").toLowerCase()}_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-4">
        <div className="w-full max-w-full md:max-w-2xl rounded-2xl border bg-white shadow-xl overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900 text-white px-4 sm:px-5 py-3">
            <h3 className="font-semibold truncate">{title} — Details</h3>
            <div className="flex gap-2">
              <button className={`${btn} bg-white/10 text-white`} onClick={exportCsv}>Export CSV</button>
              <button className={`${btn} bg-white/10 text-white`} onClick={onClose}>Close</button>
            </div>
          </div>
          <div className="p-3 sm:p-4">
            <div className="rounded-xl border overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-3 py-2 text-left whitespace-nowrap">Date</th>
                    <th className="px-3 py-2 text-left">Description</th>
                    <th className="px-3 py-2 text-left whitespace-nowrap">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {rows.map((r, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="px-3 py-2 whitespace-nowrap">{r.date}</td>
                      <td className="px-3 py-2">{r.desc}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{INR(r.amount)}</td>
                    </tr>
                  ))}
                  {!rows.length && (
                    <tr>
                      <td className="px-3 py-8 text-center text-slate-500" colSpan={3}>
                        No transactions.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-3 text-right text-sm text-slate-600">
              Total: <span className="font-semibold">{INR(rows.reduce((a, b) => a + b.amount, 0))}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------
   Fake dynamic data generator
------------------------------------------------------- */
function makeData(seedYear = new Date().getFullYear()) {
  let s = seedYear * 9973;
  const rand = (min, max) => {
    s = (s * 9301 + 49297) % 233280;
    const r = s / 233280;
    return Math.floor(min + r * (max - min + 1));
  };

  const incomeByMonth = Array.from({ length: 12 }, (_, i) => 150000 + rand(-25000, 45000) + i * 3000);
  const expensesByMonth = Array.from({ length: 12 }, () => 160000 + rand(-20000, 50000));

  const byCategory = modules.reduce((acc, m) => {
    acc[m] = Array.from({ length: 12 }, () => rand(25000, 120000) / 2);
    return acc;
  }, {});

  const tx = {};
  modules.forEach((m) => {
    tx[m] = {};
    for (let mo = 0; mo < 12; mo++) {
      const cnt = rand(4, 12);
      tx[m][mo] = Array.from({ length: cnt }, () => ({
        date: `${seedYear}-${String(mo + 1).padStart(2, "0")}-${String(rand(1, 28)).padStart(2, "0")}`,
        desc: `${m} service / bill #${rand(1000, 9999)}`,
        amount: rand(800, 24000),
      }));
    }
  });

  /* ADDED: TPA & Reference monthly amounts */
  const tpaByMonth = Array.from({ length: 12 }, () => rand(10000, 60000));
  const referenceByMonth = Array.from({ length: 12 }, () => rand(5000, 30000));

  return { incomeByMonth, expensesByMonth, byCategory, tx, tpaByMonth, referenceByMonth };
}

/* -------------------------------------------------------
   Dashboard
------------------------------------------------------- */
const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [db, setDb] = useState(() => makeData(now.getFullYear()));
  const [detail, setDetail] = useState({ open: false, title: "", rows: [] });

  const refresh = () => {
    setLoading(true);
    setTimeout(() => {
      setDb(makeData(year));
      setLoading(false);
    }, 450);
  };

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    setDb(makeData(year));
  }, [year]);

  const labels = useMemo(() => monthsFull.map((m) => m.slice(0, 3)), []);
  const monthlyIncome = db.incomeByMonth[month] || 0;
  const monthlyExpenses = db.expensesByMonth[month] || 0;

  const donutData = useMemo(() => {
    const out = {};
    modules.forEach((m) => (out[m] = db.byCategory[m][month] || 0));
    return out;
  }, [db, month]);

  /* ADDED: read monthly TPA & Reference values */
  const monthlyTPA = db.tpaByMonth?.[month] || 0;
  const monthlyReference = db.referenceByMonth?.[month] || 0;

  const stats = [
    { label: "OPD Income", value: donutData["OPD"], icon: Hospital("text-emerald-600"), tone: "emerald" },
    { label: "IPD Income", value: donutData["IPD"], icon: Hospital("text-indigo-600"), tone: "indigo" },
    { label: "Pharmacy Income", value: donutData["Pharmacy"], icon: Flask("text-amber-600"), tone: "amber" },
    { label: "Pathology Income", value: donutData["Pathology"], icon: TestTube("text-cyan-600"), tone: "cyan" },
    { label: "Radiology Income", value: donutData["Radiology"], icon: Radio("text-fuchsia-700"), tone: "fuchsia" },
    { label: "Blood Bank Income", value: donutData["Blood Bank"], icon: Drop("text-rose-600"), tone: "rose" },
    { label: "Ambulance Income", value: donutData["Ambulance"], icon: Ambulance("text-teal-600"), tone: "teal" },
    { label: "General Income", value: donutData["General"], icon: MoneyBag("text-emerald-600"), tone: "emerald" },

    /* ADDED: TPA & Reference cards */
    { label: "TPA Amount", value: monthlyTPA, icon: MoneyBag("text-teal-600"), tone: "teal" },
    { label: "Reference Amount", value: monthlyReference, icon: MoneyBag("text-indigo-600"), tone: "indigo" },

    { label: "Expenses", value: monthlyExpenses, icon: ExpenseIcon("text-red-600"), tone: "red" },
  ];

  const roles = [
    { name: "Super Admin", count: 1 },
    { name: "Admin", count: 1 },
    { name: "Accountant", count: 1 },
    { name: "Doctor", count: 4 },
    { name: "Pharmacist", count: 2 },
    { name: "Pathology", count: 2 },
    { name: "Radiology", count: 2 },
  ];

  const calendarWeek = [
    ["OPD – The Blood", "IPD – Ward Round"],
    ["Radiology – CT Scan"],
    ["Pathology – CBC"],
    ["OPD – Follow-up", "Pharmacy – Stock Audit"],
    ["Ambulance – Maintenance"],
    ["Doctor Meet", "Admin Review"],
    ["Pharmacy – Expiry Check"],
  ];

  const openModule = (moduleName) => {
    const rows = (db.tx[moduleName] && db.tx[moduleName][month]) || [];
    setDetail({ open: true, title: `${moduleName} (${monthsFull[month]} ${year})`, rows });
  };

  return (
    <div className="min-h-screen bg-slate-100 p-3 sm:p-4 md:p-6">
      {/* topbar */}
      <div className="mb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold leading-tight">
            Smart Hospital &amp; Research Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">Live, dynamic dashboard (demo data)</p>
        </div>

        {/* controls wrap on small screens */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <select
            className="rounded-xl border bg-white px-3 py-2 text-sm outline-none w-full xs:w-auto"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            {monthsFull.map((m, i) => (
              <option key={m} value={i}>{m}</option>
            ))}
          </select>
          <select
            className="rounded-xl border bg-white px-3 py-2 text-sm outline-none w-full xs:w-auto"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            {[year - 1, year, year + 1].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <button className={`${btn} bg-slate-900 text-white w-full sm:w-auto`} onClick={refresh}>
            Refresh
          </button>
          
        </div>
      </div>

      {/* stats */}
      <div className={`grid gap-3 sm:gap-4 md:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${loading ? "animate-pulse" : ""}`}>
        {stats.map((s, i) => (
          <StatCard key={i} {...s} onClick={() => openModule(s.label.replace(" Income",""))} />
        ))}
      </div>

      {/* charts row */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5">
        <div className="lg:col-span-2 rounded-2xl border bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 p-4 pb-2">
            <div className="min-w-0">
              <div className="text-base sm:text-lg font-semibold">Yearly Income &amp; Expense</div>
              <div className="text-xs sm:text-sm text-slate-500">
                {monthsFull[month]} {year}: Income <span className="font-semibold">{INR(monthlyIncome)}</span> • Expenses <span className="font-semibold">{INR(monthlyExpenses)}</span>
              </div>
            </div>
          </div>
          <div className="px-2 pb-4">
            <LineChart labels={monthsFull.map((m) => m.slice(0,3))} income={db.incomeByMonth} expenses={db.expensesByMonth} />
          </div>
        </div>

        <div className="rounded-2xl border bg-white shadow-sm p-4">
          <div className="text-base sm:text-lg font-semibold mb-2">Monthly Income Overview</div>
          <DonutChart
            data={donutData}
            onLegendClick={(k) => openModule(k)}
          />
        </div>
      </div>

      {/* bottom row: calendar + roles */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5">
        <div className="lg:col-span-2">
          <CalendarWeek weekLabel={`${monthsFull[month]} (Week view)`} items={calendarWeek} />
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="text-base sm:text-lg font-semibold mb-3">Role-based Access</div>
            <div className="space-y-2">
              {roles.map((r) => (
                <div key={r.name} className="flex items-center justify-between rounded-xl border p-3 hover:bg-slate-50 transition">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-white text-sm shrink-0">
                      {r.name[0]}
                    </span>
                    <span className="text-sm truncate">{r.name}</span>
                  </div>
                  <span className="text-sm font-semibold">{r.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* details modal */}
      <ModuleDetailModal
        open={detail.open}
        onClose={() => setDetail({ open: false, title: "", rows: [] })}
        title={detail.title}
        rows={detail.rows}
      />
    </div>
  );
};

export default Dashboard;
