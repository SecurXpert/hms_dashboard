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

const NUM = (n) => (Number(n) || 0).toLocaleString("en-IN");
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const monthsFull = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const labDepts = [
  "Hematology",
  "Biochemistry",
  "Microbiology",
  "Serology",
  "Histopathology",
  "Immunology",
  "Cytology",
];

const referralSources = ["OPD", "IPD", "External"];

/* tones + buttons */
const toneBG = {
  emerald: "bg-emerald-100",
  indigo: "bg-indigo-100",
  amber: "bg-amber-100",
  cyan: "bg-cyan-100",
  fuchsia: "bg-fuchsia-100",
  rose: "bg-rose-100",
  teal: "bg-teal-100",
  slate: "bg-slate-100",
  red: "bg-red-100",
};
const btn = "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2";

/* -------------------------------------------------------
   Tiny icons (no deps)
------------------------------------------------------- */
const TestTube = (cls="text-cyan-700") => (
  <svg width="22" height="22" viewBox="0 0 24 24" className={cls} fill="currentColor">
    <path d="M7 2h10v2h-3v5.586l4.707 4.707a4 4 0 11-5.657 5.657L8.343 15.24A4.98 4.98 0 017 11.707V4H7V2z" />
  </svg>
);
const Microscope = (cls="text-fuchsia-700") => (
  <svg width="22" height="22" viewBox="0 0 24 24" className={cls} fill="currentColor">
    <path d="M6 20h12v2H6v-2zm3.5-6.5l1.5 1.5 2-2 1 1 1.5-1.5-3-3-3 3zm7.5-7h-2V3h2v3zM5 18a7 7 0 1114 0H5z" />
  </svg>
);
const Drop = (cls="text-rose-700") => (
  <svg width="22" height="22" viewBox="0 0 24 24" className={cls} fill="currentColor">
    <path d="M12 2s6 7 6 11a6 6 0 11-12 0c0-4 6-11 6-11z" />
  </svg>
);
const BillingIcon = (cls="text-emerald-700") => (
  <svg width="22" height="22" viewBox="0 0 24 24" className={cls} fill="currentColor">
    <path d="M4 4h16v14H5l-1 2V4zm5 6h6v2H9v-2zm0-4h10v2H9V6z" />
  </svg>
);
const Clipboard = (cls="text-indigo-700") => (
  <svg width="22" height="22" viewBox="0 0 24 24" className={cls} fill="currentColor">
    <path d="M9 2h6v2h3a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h3V2zm8 6H7v2h10V8zm0 4H7v2h10v-2zm0 4H7v2h10v-2z" />
  </svg>
);
const BoxIcon = (cls="text-teal-700") => (
  <svg width="22" height="22" viewBox="0 0 24 24" className={cls} fill="currentColor">
    <path d="M3 7l9-4 9 4v10l-9 4-9-4V7zm9 2l7-3-7-3-7 3 7 3z" />
  </svg>
);
const CalendarIcon = (cls="text-slate-700") => (
  <svg width="22" height="22" viewBox="0 0 24 24" className={cls} fill="currentColor">
    <path d="M7 2h2v2h6V2h2v2h3v18H4V4h3V2zm13 8H4v10h16V10z" />
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
const LineChart = ({ labels, seriesA, seriesB, labA = "Tests", labB = "Revenue" }) => {
  const w = 860, h = 260, pad = 30;
  const n = labels.length;

  const norm = (arr) => {
    const m = Math.max(...arr, 1);
    return arr.map((v) => v / m);
  };
  const aN = norm(seriesA);
  const bN = norm(seriesB);

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
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-48 sm:h-56 md:h-64" preserveAspectRatio="xMidYMid meet">
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
        <path className="dashAnim" d={pathFrom(aN)} fill="none" stroke="#3b82f6" strokeWidth="3" />
        <path className="dashAnim" d={pathFrom(bN)} fill="none" stroke="#10b981" strokeWidth="3" />
        {labels.map((m, i) => {
          const x = pad + (i * (w - 2 * pad)) / (n - 1 || 1);
          return (
            <text key={m} x={x} y={h - 8} textAnchor="middle" className="fill-slate-500 text-[9px] sm:text-[10px]">
              {m}
            </text>
          );
        })}
        <g transform={`translate(${pad + 6},${pad})`}>
          <rect width="10" height="10" fill="#3b82f6" rx="2" />
          <text x="16" y="9" className="fill-slate-600 text-xs">{labA}</text>
          <rect x="76" width="10" height="10" fill="#10b981" rx="2" />
          <text x="92" y="9" className="fill-slate-600 text-xs">{labB}</text>
        </g>
      </svg>
    </div>
  );
};

const DonutChart = ({ data, centerLabel = "Total", money = false, onLegendClick }) => {
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
          <path key={a.i} d={a.path} className="arcDash cursor-pointer" stroke={a.color} strokeWidth={thick} fill="none" strokeLinecap="butt">
            <title>{`${a.k}: ${money ? INR(a.val) : NUM(a.val)}`}</title>
          </path>
        ))}
        <circle cx={cx} cy={cy} r={radius - thick} fill="white" />
        <text x={cx} y={cy - 2} textAnchor="middle" className="fill-slate-600 font-semibold">
          {money ? INR(total) : NUM(total)}
        </text>
        <text x={cx} y={cy + 16} textAnchor="middle" className="fill-slate-400 text-xs">{centerLabel}</text>
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
              style={{ background: ["#8b5cf6","#f59e0b","#10b981","#06b6d4","#3b82f6","#ef4444","#14b8a6","#64748b"][i % 8] }}
            />
            <span className="text-sm text-slate-600 group-hover:text-slate-900 truncate">{k}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

/* -------------------------------------------------------
   UI blocks
------------------------------------------------------- */
const StatCard = ({ icon, label, value, tone = "emerald", format = INR, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 rounded-2xl border p-4 shadow-sm bg-white transition hover:-translate-y-0.5 hover:shadow-md w-full"
    title={`Open ${label} details`}
  >
    <div className={`p-3 rounded-xl ${toneBG[tone] || "bg-slate-100"}`}>{icon}</div>
    <div className="flex flex-col items-start min-w-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-base sm:text-lg font-semibold truncate">
        <Counter value={value} format={format} />
      </span>
    </div>
  </button>
);

/* -------------------------------------------------------
   Detail modal (CSV export)
------------------------------------------------------- */
const ModuleDetailModal = ({ open, onClose, title, rows = [], money = false }) => {
  if (!open) return null;

  const exportCsv = () => {
    const header = ["Date","Description","Amount"];
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
          <div className="p-3 sm:p-4 max-h-[90vh] overflow-y-auto">
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
                      <td className="px-3 py-2 whitespace-nowrap">{money ? INR(r.amount) : NUM(r.amount)}</td>
                    </tr>
                  ))}
                  {!rows.length && (
                    <tr>
                      <td className="px-3 py-8 text-center text-slate-500" colSpan={3}>
                        No records.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-3 text-right text-sm text-slate-600">
              Total:{" "}
              <span className="font-semibold">
                {money
                  ? INR(rows.reduce((a, b) => a + b.amount, 0))
                  : NUM(rows.reduce((a, b) => a + b.amount, 0))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------
   Annual Calendar (compact)
------------------------------------------------------- */
const AnnualCalendar = ({ year, eventsByMonth }) => {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="text-base sm:text-lg font-semibold">Annual Calendar</div>
        <div className="text-xs sm:text-sm text-slate-500">{year}</div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {monthsFull.map((m, i) => {
          const ev = eventsByMonth[i] || [];
          return (
            <div key={m} className="rounded-xl border p-3">
              <div className="flex items-center justify-between">
                <div className="font-medium">{m}</div>
                <span className="text-xs text-slate-500">{ev.length} events</span>
              </div>
              <div className="mt-2 space-y-1">
                {ev.slice(0, 4).map((e, idx) => (
                  <div key={idx} className="text-xs rounded-lg bg-slate-900 text-white px-2 py-1 truncate" title={e}>
                    {e}
                  </div>
                ))}
                {ev.length === 0 && (
                  <div className="text-xs text-slate-400 italic">No entries</div>
                )}
                {ev.length > 4 && (
                  <div className="text-xs text-slate-500">+{ev.length - 4} more…</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* -------------------------------------------------------
   Fake dynamic data generator (Pathology)
------------------------------------------------------- */
function makePathoData(seedYear = new Date().getFullYear()) {
  let s = seedYear * 8161;
  const rand = (min, max) => {
    s = (s * 9301 + 49297) % 233280;
    const r = s / 233280;
    return Math.floor(min + r * (max - min + 1));
  };

  // Monthly volumes & revenue
  const testsByMonth = Array.from({ length: 12 }, (_, i) => 4500 + rand(-600, 900) + i * 25);
  const revenueByMonth = testsByMonth.map(v => v * rand(160, 280)); // avg ticket

  // Department split (per month)
  const byDept = labDepts.reduce((acc, d) => {
    acc[d] = Array.from({ length: 12 }, () => rand(300, 1200));
    return acc;
  }, {});

  // Referral mix (counts per month)
  const referralMix = referralSources.reduce((acc, k) => {
    acc[k] = rand(400, 1800);
    return acc;
  }, {});

  // Billing info
  const billing = {
    dues: rand(120000, 650000),
    collections: rand(800000, 2200000),
    avgTicket: rand(220, 420),
  };

  // KPIs
  const kpi = {
    avgTAT: rand(90, 210),      // minutes
    rejectionRate: rand(1, 6),  // percent
    pendingReports: rand(10, 85),
    qcPass: rand(92, 99),       // %
  };

  // Transactions for details (per month)
  const tx = { Pathology: {}, Billing: {}, Referrals: {} };
  labDepts.forEach((d) => {
    tx.Pathology[d] = {};
    for (let mo = 0; mo < 12; mo++) {
      const cnt = rand(8, 22);
      tx.Pathology[d][mo] = Array.from({ length: cnt }, () => ({
        date: `${seedYear}-${String(mo + 1).padStart(2, "0")}-${String(rand(1, 28)).padStart(2, "0")}`,
        desc: `${d} test / sample #${rand(1000, 9999)}`,
        amount: rand(1, 3), // count placeholder
      }));
    }
  });
  for (let mo = 0; mo < 12; mo++) {
    const cntB = rand(10, 24);
    tx.Billing[mo] = Array.from({ length: cntB }, () => ({
      date: `${seedYear}-${String(mo + 1).padStart(2, "0")}-${String(rand(1, 28)).padStart(2, "0")}`,
      desc: `Billing receipt #${rand(10000, 99999)}`,
      amount: rand(150, 2000),
    }));
    const cntR = rand(8, 18);
    tx.Referrals[mo] = Array.from({ length: cntR }, () => ({
      date: `${seedYear}-${String(mo + 1).padStart(2, "0")}-${String(rand(1, 28)).padStart(2, "0")}`,
      desc: `${referralSources[rand(0, referralSources.length - 1)]} referral`,
      amount: rand(1, 3),
    }));
  }

  // Annual calendar events
  const eventsByMonth = Array.from({ length: 12 }, () => []);
  const sampleEvents = [
    "Internal QC (IQC)",
    "External EQAS Round",
    "Analyzer Calibration",
    "NABL Audit Prep",
    "Biohazard Training",
    "Inventory Audit (Reagents)",
    "Phlebotomy Workshop",
    "Turn-around Review",
  ];
  eventsByMonth.forEach((arr) => {
    const c = rand(1, 5);
    for (let k = 0; k < c; k++) arr.push(sampleEvents[rand(0, sampleEvents.length - 1)]);
  });

  // Inventory list
  const inventory = [
    { name: "EDTA Tubes", stock: rand(200, 1200), min: 400, uom: "Pieces" },
    { name: "Citrate Tubes", stock: rand(120, 800), min: 250, uom: "Pieces" },
    { name: "Serum Separator Tubes", stock: rand(180, 900), min: 300, uom: "Pieces" },
    { name: "Urine Cups", stock: rand(150, 700), min: 250, uom: "Pieces" },
    { name: "Biochemistry Reagent Kit", stock: rand(6, 28), min: 10, uom: "Kits" },
    { name: "Rapid Test Cards", stock: rand(50, 400), min: 120, uom: "Cards" },
  ];

  return {
    testsByMonth,
    revenueByMonth,
    byDept,
    referralMix,
    billing,
    kpi,
    tx,
    eventsByMonth,
    inventory,
  };
}

/* -------------------------------------------------------
   Pathology Dashboard
------------------------------------------------------- */
const Pathodash = () => {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [loading, setLoading] = useState(true);
  const [db, setDb] = useState(() => makePathoData(now.getFullYear()));
  const [detail, setDetail] = useState({ open: false, title: "", rows: [], money: false });

  const refresh = () => {
    setLoading(true);
    setTimeout(() => {
      setDb(makePathoData(year));
      setLoading(false);
    }, 450);
  };

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    setDb(makePathoData(year));
  }, [year]);

  const monthlyTests = db.testsByMonth[month] || 0;
  const monthlyRevenue = db.revenueByMonth[month] || 0;

  const deptData = useMemo(() => {
    const out = {};
    labDepts.forEach((d) => (out[d] = db.byDept[d][month] || 0));
    return out;
  }, [db, month]);

  const referralData = useMemo(() => ({ ...db.referralMix }), [db, month]);

  /* openers */
  function openDeptDetails(dept = "All Departments") {
    let rows = [];
    if (dept === "All Departments") {
      labDepts.forEach((d) => {
        rows = rows.concat((db.tx.Pathology[d][month] || []).map(r => ({ ...r, desc: `${d}: ${r.desc}`, amount: 1 })));
      });
      setDetail({ open: true, title: `Pathology — ${monthsFull[month]} ${year}`, rows, money: false });
    } else {
      rows = (db.tx.Pathology[dept] && db.tx.Pathology[dept][month]) || [];
      setDetail({ open: true, title: `${dept} — ${monthsFull[month]} ${year}`, rows, money: false });
    }
  }
  function openBillingDetails(type = "Billing") {
    const rows = (db.tx.Billing && db.tx.Billing[month]) || [];
    setDetail({ open: true, title: `${type} — ${monthsFull[month]} ${year}`, rows, money: true });
  }
  function openReferralDetails() {
    const rows = (db.tx.Referrals && db.tx.Referrals[month]) || [];
    setDetail({ open: true, title: `Referrals — ${monthsFull[month]} ${year}`, rows, money: false });
  }
  function openOperationalDetail(kind) {
    const rows = [
      { date: `${year}-${String(month+1).padStart(2,"0")}-07`, desc: `${kind} snapshot`, amount: kind === "Avg TAT (mins)" ? db.kpi.avgTAT : kind === "Rejection Rate (%)" ? db.kpi.rejectionRate : kind === "QC Pass (%)" ? db.kpi.qcPass : db.kpi.pendingReports },
      { date: `${year}-${String(month+1).padStart(2,"0")}-18`, desc: `${kind} snapshot`, amount: kind === "Avg TAT (mins)" ? Math.round(db.kpi.avgTAT*0.95) : kind === "Rejection Rate (%)" ? Math.max(0, db.kpi.rejectionRate-1) : kind === "QC Pass (%)" ? Math.min(100, db.kpi.qcPass+1) : Math.max(0, db.kpi.pendingReports-5) },
    ];
    setDetail({ open: true, title: `${kind} — ${monthsFull[month]} ${year}`, rows, money: false });
  }

  /* inventory helpers */
  const inventoryRows = db.inventory.map((i) => ({ ...i, status: i.stock < i.min ? "Reorder" : "OK" }));
  const lowStock = inventoryRows.filter((i) => i.status === "Reorder");

  /* stats */
  const stats = [
    { label: "Total Tests (Month)", value: monthlyTests, icon: TestTube(), tone: "cyan", format: NUM, onClick: () => openDeptDetails("All Departments") },
    { label: "Revenue (Month)", value: monthlyRevenue, icon: BillingIcon(), tone: "emerald", format: INR, onClick: () => openBillingDetails() },
    { label: "Avg TAT (mins)", value: db.kpi.avgTAT, icon: Clipboard("text-indigo-700"), tone: "indigo", format: NUM, onClick: () => openOperationalDetail("Avg TAT (mins)") },
    { label: "Rejection Rate (%)", value: db.kpi.rejectionRate, icon: Drop(), tone: "rose", format: (x)=>`${Math.round(x)}%`, onClick: () => openOperationalDetail("Rejection Rate (%)") },
    { label: "Pending Reports", value: db.kpi.pendingReports, icon: Microscope(), tone: "fuchsia", format: NUM, onClick: () => openOperationalDetail("Pending Reports") },
    { label: "QC Pass (%)", value: db.kpi.qcPass, icon: Clipboard("text-indigo-700"), tone: "amber", format: (x)=>`${Math.round(x)}%`, onClick: () => openOperationalDetail("QC Pass (%)") },
    { label: "Collections (Est.)", value: db.billing.collections, icon: BillingIcon(), tone: "emerald", format: INR, onClick: () => openBillingDetails("Collections") },
    { label: "Dues (Outstanding)", value: db.billing.dues, icon: BillingIcon(), tone: "slate", format: INR, onClick: () => openBillingDetails("Dues") },
  ];

  /* team roles */
  const roles = [
    { name: "Pathologist", count: 2 },
    { name: "Lab Technician", count: 8 },
    { name: "Phlebotomist", count: 5 },
    { name: "Reception", count: 2 },
    { name: "Billing", count: 2 },
    { name: "Admin", count: 1 },
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* topbar */}
        <div className="mb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl md:text-2xl font-semibold leading-tight">
              Pathology Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">Smart Hospital &amp; Research Center — Live (demo data)</p>
          </div>

          {/* controls */}
          <div className="flex w-full md:w-auto flex-wrap items-center gap-2 sm:gap-3">
            <select
              className="rounded-xl border bg-white px-3 py-2 text-sm outline-none w-full sm:w-auto"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
            >
              {monthsFull.map((m, i) => (
                <option key={m} value={i}>{m}</option>
              ))}
            </select>
            <select
              className="rounded-xl border bg-white px-3 py-2 text-sm outline-none w-full sm:w-auto"
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
            <StatCard
              key={i}
              icon={s.icon}
              label={s.label}
              value={s.value}
              format={s.format}
              tone={s.tone}
              onClick={s.onClick}
            />
          ))}
        </div>

        {/* charts row */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5">
          <div className="lg:col-span-2 rounded-2xl border bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 p-4 pb-2">
              <div className="min-w-0">
                <div className="text-base sm:text-lg font-semibold">Yearly Tests &amp; Revenue</div>
                <div className="text-xs sm:text-sm text-slate-500">
                  {monthsFull[month]} {year}: Tests{" "}
                  <span className="font-semibold">{NUM(monthlyTests)}</span> • Revenue{" "}
                  <span className="font-semibold">{INR(monthlyRevenue)}</span>
                </div>
              </div>
              <button className="text-sm underline decoration-dotted" onClick={()=>openDeptDetails("All Departments")}>
                Test details
              </button>
            </div>
            <div className="px-2 pb-4">
              <LineChart
                labels={monthsFull.map((m) => m.slice(0, 3))}
                seriesA={db.testsByMonth}
                seriesB={db.revenueByMonth}
                labA="Tests"
                labB="Revenue"
              />
            </div>
          </div>

          <div className="rounded-2xl border bg-white shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-base sm:text-lg font-semibold">Department Mix (Month)</div>
              <button className="text-sm underline decoration-dotted" onClick={()=>openDeptDetails("All Departments")}>Details</button>
            </div>
            <DonutChart
              data={deptData}
              centerLabel="Tests"
              onLegendClick={(k) => openDeptDetails(k)}
            />
          </div>
        </div>

        {/* Referrals & Inventory */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5">
          {/* Referrals */}
          <div className="rounded-2xl border bg-white p-4 shadow-sm lg:col-span-1">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {Clipboard()}
                <div className="text-base sm:text-lg font-semibold">Referrals</div>
              </div>
              <button className="text-sm underline decoration-dotted" onClick={openReferralDetails}>
                View details
              </button>
            </div>
            <DonutChart data={referralData} centerLabel="Referrals" />
            <div className="mt-3 rounded-xl border p-3 bg-slate-50">
              <div className="text-sm text-slate-600">
                Total this month:{" "}
                <span className="font-semibold">
                  {NUM(Object.values(referralData).reduce((a,b)=>a+b,0))}
                </span>
              </div>
              <div className="text-xs text-slate-500">Click a source to drill into entries.</div>
            </div>
          </div>

          {/* Inventory */}
          <div className="rounded-2xl border bg-white p-4 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {BoxIcon()}
                <div className="text-base sm:text-lg font-semibold">Inventory</div>
              </div>
              <div className="text-xs sm:text-sm text-slate-500">
                Low stock: <span className="font-semibold">{lowStock.length}</span>
              </div>
            </div>

            {/* Table on md+ */}
            <div className="hidden md:block rounded-xl border overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-3 py-2 text-left">Item</th>
                    <th className="px-3 py-2 text-left whitespace-nowrap">Stock</th>
                    <th className="px-3 py-2 text-left whitespace-nowrap">Min</th>
                    <th className="px-3 py-2 text-left">UoM</th>
                    <th className="px-3 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {inventoryRows.map((r, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="px-3 py-2">{r.name}</td>
                      <td className="px-3 py-2">{NUM(r.stock)}</td>
                      <td className="px-3 py-2">{NUM(r.min)}</td>
                      <td className="px-3 py-2">{r.uom}</td>
                      <td className="px-3 py-2">
                        <span
                          className={`px-2 py-1 rounded-lg text-xs ${
                            r.status === "Reorder" ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {inventoryRows.length === 0 && (
                    <tr>
                      <td className="px-3 py-6 text-center text-slate-500" colSpan={5}>
                        No inventory items.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Cards on small screens */}
            <div className="md:hidden space-y-2">
              {inventoryRows.map((r, i) => (
                <div key={i} className="rounded-xl border p-3">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{r.name}</div>
                    <span
                      className={`px-2 py-1 rounded-lg text-xs ${
                        r.status === "Reorder" ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {r.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                    <div className="text-slate-500">Stock</div><div className="text-right">{NUM(r.stock)}</div>
                    <div className="text-slate-500">Min</div><div className="text-right">{NUM(r.min)}</div>
                    <div className="text-slate-500">UoM</div><div className="text-right">{r.uom}</div>
                  </div>
                </div>
              ))}
              {inventoryRows.length === 0 && (
                <div className="rounded-xl border p-6 text-center text-slate-500">No inventory items.</div>
              )}
            </div>

            {lowStock.length > 0 && (
              <div className="mt-3 text-xs sm:text-sm text-rose-700">
                ⚠️ Reorder suggested for:{" "}
                <span className="font-medium">
                  {lowStock.map((i) => i.name).join(", ")}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Annual Calendar + Roles */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5">
          <div className="lg:col-span-2">
            <AnnualCalendar year={year} eventsByMonth={db.eventsByMonth} />
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                {CalendarIcon()}
                <div className="text-base sm:text-lg font-semibold">Team / Roles</div>
              </div>
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
          onClose={() => setDetail({ open: false, title: "", rows: [], money: false })}
          title={detail.title}
          rows={detail.rows}
          money={detail.money}
        />
      </div>
    </div>
  );
};

export default Pathodash;



































