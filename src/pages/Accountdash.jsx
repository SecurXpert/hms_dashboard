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
const modules = ["OPD","IPD","Pharmacy","Pathology","Radiology","Ambulance","General"];
const expenseCats = ["Salaries","Consumables","Rent","Utilities","Maintenance","Admin"];

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
const MoneyUp = (cls="text-emerald-700") => (
  <svg width="22" height="22" viewBox="0 0 24 24" className={cls} fill="currentColor">
    <path d="M3 17h18v2H3v-2zm7-4l3-3 2 2 4-4v3h2V5h-6v2h3l-3 3-2-2-5 5 2 2z"/>
  </svg>
);
const MoneyDown = (cls="text-rose-700") => (
  <svg width="22" height="22" viewBox="0 0 24 24" className={cls} fill="currentColor">
    <path d="M3 5h18v2H3V5zm7 4l2 2 5-5 2 2-7 7-4-4 2-2zm11 8H3v2h18v-2z"/>
  </svg>
);
const ProfitIcon = (cls="text-indigo-700") => (
  <svg width="22" height="22" viewBox="0 0 24 24" className={cls} fill="currentColor">
    <path d="M11 3h2v18h-2zM5 13h2v8H5zm12-6h2v14h-2z"/>
  </svg>
);
const CashIcon = (cls="text-emerald-700") => (
  <svg width="22" height="22" viewBox="0 0 24 24" className={cls} fill="currentColor">
    <path d="M2 6h20v12H2zM4 8v8h16V8H4zm6 6a2 2 0 110-4 2 2 0 010 4z" />
  </svg>
);
const CalendarIcon = (cls="text-indigo-700") => (
  <svg width="22" height="22" viewBox="0 0 24 24" className={cls} fill="currentColor">
    <path d="M7 2h2v2h6V2h2v2h3v18H4V4h3V2zm13 8H4v10h16V10z" />
  </svg>
);
const FileDoc = (cls="text-slate-700") => (
  <svg width="22" height="22" viewBox="0 0 24 24" className={cls} fill="currentColor">
    <path d="M6 2h9l5 5v13a2 2 0 01-2 2H6V2zm8 1.5V8h4.5L14 3.5zM8 12h8v2H8v-2zm0 4h8v2H8v-2z" />
  </svg>
);
const VendorIcon = (cls="text-teal-700") => (
  <svg width="22" height="22" viewBox="0 0 24 24" className={cls} fill="currentColor">
    <path d="M3 7l9-4 9 4v10l-9 4-9-4V7zm9 2l7-3-7-3-7 3 7 3z" />
  </svg>
);
const WarningIcon = (cls="text-amber-600") => (
  <svg width="22" height="22" viewBox="0 0 24 24" className={cls} fill="currentColor">
    <path d="M1 21h22L12 2 1 21zm12-3h-2v2h2v-2zm0-8h-2v6h2v-6z" />
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
const LineChart = ({ labels, seriesA, seriesB, labA = "Revenue", labB = "Expenses" }) => {
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
      }).join(" ");

  return (<div className="w-full">
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
      <path className="dashAnim" d={pathFrom(aN)} fill="none" stroke="#10b981" strokeWidth="3" />
      <path className="dashAnim" d={pathFrom(bN)} fill="none" stroke="#ef4444" strokeWidth="3" />
      {labels.map((m, i) => {
        const x = pad + (i * (w - 2 * pad)) / (n - 1 || 1);
        return <text key={m} x={x} y={h - 8} textAnchor="middle" className="fill-slate-500 text-[9px] sm:text-[10px]">{m}</text>;
      })}
      <g transform={`translate(${pad + 6},${pad})`}>
        <rect width="10" height="10" fill="#10b981" rx="2" />
        <text x="16" y="9" className="fill-slate-600 text-xs">{labA}</text>
        <rect x="76" width="10" height="10" fill="#ef4444" rx="2" />
        <text x="92" y="9" className="fill-slate-600 text-xs">{labB}</text>
      </g>
    </svg>
  </div>);
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
          <button key={k} onClick={() => onLegendClick?.(k)} className="flex items-center gap-2 group text-left" title={`View ${k} details`}>
            <span className="inline-block w-3 h-3 rounded group-hover:scale-125 transition"
                  style={{ background: ["#8b5cf6","#f59e0b","#10b981","#06b6d4","#3b82f6","#ef4444","#14b8a6","#64748b"][i % 8] }} />
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
  <button onClick={onClick} className="flex items-center gap-3 rounded-2xl border p-4 shadow-sm bg-white transition hover:-translate-y-0.5 hover:shadow-md w-full" title={`Open ${label} details`}>
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
   Fake dynamic data generator (Accounts)
------------------------------------------------------- */
function makeAccountData(seedYear = new Date().getFullYear()) {
  let s = seedYear * 9721;
  const rand = (min, max) => {
    s = (s * 9301 + 49297) % 233280;
    const r = s / 233280;
    return Math.floor(min + r * (max - min + 1));
  };

  // Monthly series
  const revenueByMonth = Array.from({ length: 12 }, (_, i) => 1800000 + rand(-180000, 260000) + i * 12000);
  const expenseByMonth = Array.from({ length: 12 }, () => 1400000 + rand(-160000, 240000));

  // Dept revenue and expense categories (per month)
  const byDept = modules.reduce((acc, m) => {
    acc[m] = Array.from({ length: 12 }, () => rand(120000, 420000));
    return acc;
  }, {});
  const byCat = expenseCats.reduce((acc, c) => {
    acc[c] = Array.from({ length: 12 }, () => rand(80000, 350000));
    return acc;
  }, {});

  // KPIs
  const kpi = {
    cashOnHand: rand(2500000, 9000000),
    dso: rand(22, 68), // days sales outstanding
    collectionEff: rand(88, 98), // %
    complianceDue: rand(0, 1) ? "GST-3B" : "TDS 26Q",
  };

  // AR / AP samples
  const debtors = ["Alpha Diagnostics","BlueCross Health","Sunrise Corp","MediAssist","Paramount","ICICI Lombard","Govt Scheme"];
  const vendors = ["Siemens Service","Medline Supplies","City Utilities","Realty Lease","TechSoft (PACS)","CleanCo","TransCare"];
  const arList = Array.from({ length: 10 }, () => ({
    name: debtors[rand(0, debtors.length - 1)],
    invoice: `INV-${rand(10000, 99999)}`,
    due: `${seedYear}-${String(rand(1,12)).padStart(2,"0")}-${String(rand(1,28)).padStart(2,"0")}`,
    amount: rand(15000, 350000),
    days: rand(5, 120),
  }));
  const apList = Array.from({ length: 10 }, () => ({
    name: vendors[rand(0, vendors.length - 1)],
    bill: `BILL-${rand(10000, 99999)}`,
    due: `${seedYear}-${String(rand(1,12)).padStart(2,"0")}-${String(rand(1,28)).padStart(2,"0")}`,
    amount: rand(12000, 280000),
    days: rand(3, 90),
  }));

  // Transactions for details
  const tx = { Revenue: {}, Expenses: {}, Receipts: {}, Payments: {}, Dept: {}, Cat: {} };
  for (let mo = 0; mo < 12; mo++) {
    const cR = rand(10, 22);
    tx.Revenue[mo] = Array.from({ length: cR }, () => ({
      date: `${seedYear}-${String(mo + 1).padStart(2,"0")}-${String(rand(1,28)).padStart(2,"0")}`,
      desc: `Revenue entry #${rand(10000,99999)}`,
      amount: rand(8000, 180000),
    }));
    const cE = rand(10, 22);
    tx.Expenses[mo] = Array.from({ length: cE }, () => ({
      date: `${seedYear}-${String(mo + 1).padStart(2,"0")}-${String(rand(1,28)).padStart(2,"0")}`,
      desc: `Expense voucher #${rand(10000,99999)}`,
      amount: rand(6000, 150000),
    }));
    const cRc = rand(8, 18);
    tx.Receipts[mo] = Array.from({ length: cRc }, () => ({
      date: `${seedYear}-${String(mo + 1).padStart(2,"0")}-${String(rand(1,28)).padStart(2,"0")}`,
      desc: `Receipt #${rand(10000,99999)}`,
      amount: rand(5000, 140000),
    }));
    const cP = rand(8, 18);
    tx.Payments[mo] = Array.from({ length: cP }, () => ({
      date: `${seedYear}-${String(mo + 1).padStart(2,"0")}-${String(rand(1,28)).padStart(2,"0")}`,
      desc: `Payment #${rand(10000,99999)}`,
      amount: rand(4000, 120000),
    }));
    tx.Dept[mo] = modules.map((m) => ({
      date: `${seedYear}-${String(mo + 1).padStart(2,"0")}-01`,
      desc: `${m} revenue`,
      amount: byDept[m][mo],
    }));
    tx.Cat[mo] = expenseCats.map((c) => ({
      date: `${seedYear}-${String(mo + 1).padStart(2,"0")}-01`,
      desc: `${c} expense`,
      amount: byCat[c][mo],
    }));
  }

  // Annual calendar events
  const eventsByMonth = Array.from({ length: 12 }, () => []);
  const sampleEvents = [
    "GST-3B Filing",
    "GSTR-1 Upload",
    "TDS Payment (26Q)",
    "Statutory Audit",
    "Payroll Processing",
    "Budget Review",
    "AR/AP Reconciliation",
    "Vendor Settlement Run",
  ];
  eventsByMonth.forEach((arr) => {
    const c = rand(1, 5);
    for (let k = 0; k < c; k++) arr.push(sampleEvents[rand(0, sampleEvents.length - 1)]);
  });

  return {
    revenueByMonth,
    expenseByMonth,
    byDept,
    byCat,
    kpi,
    arList,
    apList,
    tx,
    eventsByMonth,
  };
}

/* -------------------------------------------------------
   Account Dashboard
------------------------------------------------------- */
const Accountdash = () => {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [loading, setLoading] = useState(true);
  const [db, setDb] = useState(() => makeAccountData(now.getFullYear()));
  const [detail, setDetail] = useState({ open: false, title: "", rows: [], money: true });

  const refresh = () => {
    setLoading(true);
    setTimeout(() => {
      setDb(makeAccountData(year));
      setLoading(false);
    }, 450);
  };

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    setDb(makeAccountData(year));
  }, [year]);

  const monthlyRevenue = db.revenueByMonth[month] || 0;
  const monthlyExpenses = db.expenseByMonth[month] || 0;
  const monthlyProfit = monthlyRevenue - monthlyExpenses;

  const deptRevenue = useMemo(() => {
    const out = {};
    modules.forEach((m) => (out[m] = db.byDept[m][month] || 0));
    return out;
  }, [db, month]);

  const catExpense = useMemo(() => {
    const out = {};
    expenseCats.forEach((c) => (out[c] = db.byCat[c][month] || 0));
    return out;
  }, [db, month]);

  // Detail openers
  const openRevenueDetails = () => {
    const rows = (db.tx.Revenue && db.tx.Revenue[month]) || [];
    setDetail({ open: true, title: `Revenue — ${monthsFull[month]} ${year}`, rows, money: true });
  };
  const openExpenseDetails = () => {
    const rows = (db.tx.Expenses && db.tx.Expenses[month]) || [];
    setDetail({ open: true, title: `Expenses — ${monthsFull[month]} ${year}`, rows, money: true });
  };
  const openReceipts = () => {
    const rows = (db.tx.Receipts && db.tx.Receipts[month]) || [];
    setDetail({ open: true, title: `Receipts — ${monthsFull[month]} ${year}`, rows, money: true });
  };
  const openPayments = () => {
    const rows = (db.tx.Payments && db.tx.Payments[month]) || [];
    setDetail({ open: true, title: `Payments — ${monthsFull[month]} ${year}`, rows, money: true });
  };
  const openDept = (k = "Department Revenue") => {
    const rows = (db.tx.Dept && db.tx.Dept[month]) || [];
    setDetail({ open: true, title: `${k} — ${monthsFull[month]} ${year}`, rows, money: true });
  };
  const openCat = (k = "Expense Category") => {
    const rows = (db.tx.Cat && db.tx.Cat[month]) || [];
    setDetail({ open: true, title: `${k} — ${monthsFull[month]} ${year}`, rows, money: true });
  };
  const openCompliance = () => {
    const rows = [
      { date: `${year}-${String(month+1).padStart(2,"0")}-10`, desc: "GST-3B preparation", amount: 0 },
      { date: `${year}-${String(month+1).padStart(2,"0")}-20`, desc: "TDS challan verification", amount: 0 },
    ];
    setDetail({ open: true, title: `Compliance — ${monthsFull[month]} ${year}`, rows, money: false });
  };

  const stats = [
    { label: "Revenue (Month)", value: monthlyRevenue, icon: MoneyUp(), tone: "emerald", format: INR, onClick: openRevenueDetails },
    { label: "Expenses (Month)", value: monthlyExpenses, icon: MoneyDown(), tone: "rose", format: INR, onClick: openExpenseDetails },
    { label: "Profit (Month)", value: monthlyProfit, icon: ProfitIcon(), tone: "indigo", format: INR, onClick: () => {} },
    { label: "Cash on Hand", value: db.kpi.cashOnHand, icon: CashIcon(), tone: "emerald", format: INR, onClick: openReceipts },
    { label: "DSO (days)", value: db.kpi.dso, icon: FileDoc("text-amber-700"), tone: "amber", format: NUM, onClick: openRevenueDetails },
    { label: "Collection Eff. (%)", value: db.kpi.collectionEff, icon: MoneyUp(), tone: "teal", format: (x)=>`${Math.round(x)}%`, onClick: openReceipts },
    { label: "Receipts (Month)", value: (db.tx.Receipts[month]||[]).reduce((a,b)=>a+b.amount,0), icon: MoneyUp(), tone: "emerald", format: INR, onClick: openReceipts },
    { label: "Payments (Month)", value: (db.tx.Payments[month]||[]).reduce((a,b)=>a+b.amount,0), icon: MoneyDown(), tone: "slate", format: INR, onClick: openPayments },
  ];

  const roles = [
    { name: "Finance Manager", count: 1 },
    { name: "Accountant", count: 2 },
    { name: "Cashier", count: 2 },
    { name: "Billing", count: 3 },
    { name: "Auditor (ext.)", count: 1 },
  ];

  // Receivables / Payables badge color
  const ageBadge = (d) =>
    d > 90 ? "bg-rose-100 text-rose-700" :
    d > 60 ? "bg-amber-100 text-amber-700" :
    d > 30 ? "bg-cyan-100 text-cyan-700" : "bg-emerald-100 text-emerald-700";

  const arTotal = db.arList.reduce((a,b)=>a+b.amount,0);
  const apTotal = db.apList.reduce((a,b)=>a+b.amount,0);

  return (
    <div className="min-h-screen bg-slate-100 p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* topbar */}
        <div className="mb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl md:text-2xl font-semibold leading-tight">
              Accounts Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Smart Hospital &amp; Research Center — Live (demo data)
            </p>
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
                <div className="text-base sm:text-lg font-semibold">Yearly Revenue &amp; Expenses</div>
                <div className="text-xs sm:text-sm text-slate-500">
                  {monthsFull[month]} {year}: Revenue{" "}
                  <span className="font-semibold">{INR(monthlyRevenue)}</span> • Expenses{" "}
                  <span className="font-semibold">{INR(monthlyExpenses)}</span> • Profit{" "}
                  <span className="font-semibold">{INR(monthlyProfit)}</span>
                </div>
              </div>
              <button className="text-sm underline decoration-dotted" onClick={openRevenueDetails}>
                Revenue details
              </button>
            </div>
            <div className="px-2 pb-4">
              <LineChart
                labels={monthsFull.map((m) => m.slice(0, 3))}
                seriesA={db.revenueByMonth}
                seriesB={db.expenseByMonth}
                labA="Revenue"
                labB="Expenses"
              />
            </div>
          </div>

          <div className="rounded-2xl border bg-white shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-base sm:text-lg font-semibold">Revenue by Department</div>
              <button className="text-sm underline decoration-dotted" onClick={()=>openDept("Department Revenue")}>Details</button>
            </div>
            <DonutChart
              data={deptRevenue}
              centerLabel="Revenue"
              money
              onLegendClick={(k) => openDept(k)}
            />
          </div>
        </div>

        {/* expenses & AR/AP */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5">
          {/* Expense Categories */}
          <div className="rounded-2xl border bg-white p-4 shadow-sm lg:col-span-1">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {MoneyDown()}
                <div className="text-base sm:text-lg font-semibold">Expense Categories</div>
              </div>
              <button className="text-sm underline decoration-dotted" onClick={()=>openCat("Expense Category")}>
                View details
              </button>
            </div>
            <DonutChart data={catExpense} centerLabel="Expenses" money onLegendClick={(k)=>openCat(k)} />
            <div className="mt-3 rounded-xl border p-3 bg-slate-50">
              <div className="text-sm text-slate-600">
                Total this month: <span className="font-semibold">{INR(Object.values(catExpense).reduce((a,b)=>a+b,0))}</span>
              </div>
              <div className="text-xs text-slate-500">Click a category to drill into transactions.</div>
            </div>
          </div>

          {/* Receivables & Payables */}
          <div className="rounded-2xl border bg-white p-4 shadow-sm lg:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                {FileDoc()}
                <div className="text-base sm:text-lg font-semibold">Receivables &amp; Payables</div>
              </div>
              <div className="text-xs sm:text-sm text-slate-500">
                AR: <span className="font-semibold">{INR(arTotal)}</span> • AP: <span className="font-semibold">{INR(apTotal)}</span>
              </div>
            </div>

            {/* Tables on md+ */}
            <div className="hidden md:grid grid-cols-2 gap-3">
              {/* AR table */}
              <div className="rounded-xl border overflow-x-auto">
                <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border-b">
                  <div className="font-medium">Top Receivables</div>
                  <span className="text-xs text-slate-500">Total {INR(arTotal)}</span>
                </div>
                <table className="min-w-full text-sm">
                  <thead>
                    <tr>
                      <th className="px-3 py-2 text-left">Debtor</th>
                      <th className="px-3 py-2 text-left">Invoice</th>
                      <th className="px-3 py-2 text-left">Due</th>
                      <th className="px-3 py-2 text-left">Days</th>
                      <th className="px-3 py-2 text-left">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {db.arList.map((r, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="px-3 py-2">{r.name}</td>
                        <td className="px-3 py-2">{r.invoice}</td>
                        <td className="px-3 py-2">{r.due}</td>
                        <td className="px-3 py-2">
                          <span className={`px-2 py-1 rounded-lg text-xs ${ageBadge(r.days)}`}>{r.days}</span>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">{INR(r.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* AP table */}
              <div className="rounded-xl border overflow-x-auto">
                <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border-b">
                  <div className="font-medium">Top Payables</div>
                  <span className="text-xs text-slate-500">Total {INR(apTotal)}</span>
                </div>
                <table className="min-w-full text-sm">
                  <thead>
                    <tr>
                      <th className="px-3 py-2 text-left">Vendor</th>
                      <th className="px-3 py-2 text-left">Bill</th>
                      <th className="px-3 py-2 text-left">Due</th>
                      <th className="px-3 py-2 text-left">Days</th>
                      <th className="px-3 py-2 text-left">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {db.apList.map((r, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="px-3 py-2">{r.name}</td>
                        <td className="px-3 py-2">{r.bill}</td>
                        <td className="px-3 py-2">{r.due}</td>
                        <td className="px-3 py-2">
                          <span className={`px-2 py-1 rounded-lg text-xs ${ageBadge(r.days)}`}>{r.days}</span>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">{INR(r.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Cards on small screens */}
            <div className="md:hidden space-y-3">
              <div className="rounded-xl border">
                <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border-b">
                  <div className="font-medium">Top Receivables</div>
                  <span className="text-xs text-slate-500">Total {INR(arTotal)}</span>
                </div>
                <div className="p-3 space-y-2">
                  {db.arList.map((r, i) => (
                    <div key={i} className="rounded-lg border p-3">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{r.name}</div>
                        <span className={`px-2 py-1 rounded-lg text-xs ${ageBadge(r.days)}`}>{r.days}d</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                        <div className="text-slate-500">Invoice</div><div className="text-right">{r.invoice}</div>
                        <div className="text-slate-500">Due</div><div className="text-right">{r.due}</div>
                        <div className="text-slate-500">Amount</div><div className="text-right font-semibold">{INR(r.amount)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border">
                <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border-b">
                  <div className="font-medium">Top Payables</div>
                  <span className="text-xs text-slate-500">Total {INR(apTotal)}</span>
                </div>
                <div className="p-3 space-y-2">
                  {db.apList.map((r, i) => (
                    <div key={i} className="rounded-lg border p-3">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{r.name}</div>
                        <span className={`px-2 py-1 rounded-lg text-xs ${ageBadge(r.days)}`}>{r.days}d</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                        <div className="text-slate-500">Bill</div><div className="text-right">{r.bill}</div>
                        <div className="text-slate-500">Due</div><div className="text-right">{r.due}</div>
                        <div className="text-slate-500">Amount</div><div className="text-right font-semibold">{INR(r.amount)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Compliance hint */}
            <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
              {WarningIcon()} Next due: <span className="font-semibold ml-1">{db.kpi.complianceDue}</span>
              <button onClick={openCompliance} className="ml-auto text-sm underline decoration-dotted">Compliance tasks</button>
            </div>
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
          onClose={() => setDetail({ open: false, title: "", rows: [], money: true })}
          title={detail.title}
          rows={detail.rows}
          money={detail.money}
        />
      </div>
    </div>
  );
};

export default Accountdash;
