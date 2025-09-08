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

const categories = [
  "Antibiotics","Analgesics","Antipyretics","Cardiac","Diabetic",
  "Gastro","Respiratory","Vitamins & Minerals","OTC","Others",
];
const payers = ["Cash","TPA","Corporate","IPD Charge","Staff Credit"];

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
const PillIcon = (cls="text-fuchsia-700") => (
  <svg width="22" height="22" viewBox="0 0 24 24" className={cls} fill="currentColor">
    <path d="M4.222 4.222a6 6 0 018.485 0l7.071 7.071a6 6 0 11-8.485 8.485L4.222 12.707a6 6 0 010-8.485zm2.828 2.829a2 2 0 000 2.828l3.536 3.536 2.828-2.828-3.536-3.536a2 2 0 00-2.828 0z" />
  </svg>
);
const BillingIcon = (cls="text-emerald-700") => (
  <svg width="22" height="22" viewBox="0 0 24 24" className={cls} fill="currentColor">
    <path d="M4 4h16v14H5l-1 2V4zm5 6h6v2H9v-2zm0-4h10v2H9V6z" />
  </svg>
);
const CalendarIcon = (cls="text-indigo-700") => (
  <svg width="22" height="22" viewBox="0 0 24 24" className={cls} fill="currentColor">
    <path d="M7 2h2v2h6V2h2v2h3v18H4V4h3V2zm13 8H4v10h16V10z" />
  </svg>
);
const TruckIcon = (cls="text-teal-700") => (
  <svg width="22" height="22" viewBox="0 0 24 24" className={cls} fill="currentColor">
    <path d="M3 7h11v6h4l3 3v4h-2a2 2 0 11-4 0H9a2 2 0 11-4 0H3V7z" />
  </svg>
);
const BoxIcon = (cls="text-amber-600") => (
  <svg width="22" height="22" viewBox="0 0 24 24" className={cls} fill="currentColor">
    <path d="M3 7l9-4 9 4v10l-9 4-9-4V7zm9 2l7-3-7-3-7 3 7 3z" />
  </svg>
);
const ReturnIcon = (cls="text-rose-700") => (
  <svg width="22" height="22" viewBox="0 0 24 24" className={cls} fill="currentColor">
    <path d="M12 5V1L7 6l5 5V7c3.86 0 7 3.14 7 7 0 1.49-.46 2.87-1.24 4.01l1.49 1.49A8.97 8.97 0 0021 14c0-4.97-4.03-9-9-9z" />
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
const LineChart = ({ labels, seriesA, seriesB, labA = "Bills", labB = "Revenue" }) => {
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

  return (
    <div className="w-full overflow-x-auto">
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
          <rect x="60" width="10" height="10" fill="#10b981" rx="2" />
          <text x="76" y="9" className="fill-slate-600 text-xs">{labB}</text>
        </g>
      </svg>
    </div>
  );
};

const DonutChart = ({ data, centerLabel = "Total", onLegendClick }) => {
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
      <svg width={size} height={size} className="shrink-0 max-w-full">
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
            <title>{`${a.k}: ${NUM(a.val)}`}</title>
          </path>
        ))}
        <circle cx={cx} cy={cy} r={radius - thick} fill="white" />
        <text x={cx} y={cy - 2} textAnchor="middle" className="fill-slate-600 font-semibold">
          {NUM(total)}
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
   Fake dynamic data generator (Pharmacy)
------------------------------------------------------- */
function makePharmacyData(seedYear = new Date().getFullYear()) {
  let s = seedYear * 8467;
  const rand = (min, max) => {
    s = (s * 9301 + 49297) % 233280;
    const r = s / 233280;
    return Math.floor(min + r * (max - min + 1));
  };

  // Monthly bills & revenue
  const billsByMonth = Array.from({ length: 12 }, (_, i) => 3200 + rand(-600, 900) + i * 12);
  const revenueByMonth = billsByMonth.map(v => v * rand(180, 260)); // avg bill ~ ₹180–260

  // Category split (monthly)
  const byCategory = categories.reduce((acc, c) => {
    acc[c] = Array.from({ length: 12 }, () => rand(120, 1200));
    return acc;
  }, {});

  // Payer mix (month-agnostic demo)
  const payerMix = payers.reduce((acc, p) => {
    acc[p] = rand(100, 1600);
    return acc;
  }, {});

  // Billing summary
  const billing = {
    dues: rand(150000, 900000),
    collections: rand(2000000, 4800000),
    avgBasket: rand(2, 6), // items per bill
  };

  // Operational KPIs
  const kpi = {
    pendingIndents: rand(4, 28),
    expirySoon: rand(6, 45), // items expiring within 30 days
    returns: rand(8, 60),
    prescriptionsFulfilled: rand(75, 98), // %
  };

  // Transactions
  const tx = { Pharmacy: {}, Billing: {}, TPA: {}, Returns: {} };
  categories.forEach((c) => {
    tx.Pharmacy[c] = {};
    for (let mo = 0; mo < 12; mo++) {
      const cnt = rand(6, 22);
      tx.Pharmacy[c][mo] = Array.from({ length: cnt }, () => ({
        date: `${seedYear}-${String(mo + 1).padStart(2, "0")}-${String(rand(1, 28)).padStart(2, "0")}`,
        desc: `${c} sale / Rx #${rand(1000, 9999)}`,
        amount: rand(1, 8), // quantity
      }));
    }
  });
  for (let mo = 0; mo < 12; mo++) {
    const cntB = rand(10, 28);
    tx.Billing[mo] = Array.from({ length: cntB }, () => ({
      date: `${seedYear}-${String(mo + 1).padStart(2, "0")}-${String(rand(1, 28)).padStart(2, "0")}`,
      desc: `Pharmacy bill #${rand(10000, 99999)}`,
      amount: rand(150, 1800),
    }));
    const cntT = rand(6, 16);
    tx.TPA[mo] = Array.from({ length: cntT }, () => ({
      date: `${seedYear}-${String(mo + 1).padStart(2, "0")}-${String(rand(1, 28)).padStart(2, "0")}`,
      desc: `${payers[rand(0, payers.length - 1)]} claim`,
      amount: rand(800, 12000),
    }));
    const cntR = rand(4, 14);
    tx.Returns[mo] = Array.from({ length: cntR }, () => ({
      date: `${seedYear}-${String(mo + 1).padStart(2, "0")}-${String(rand(1, 28)).padStart(2, "0")}`,
      desc: `Return / Credit note #${rand(10000, 99999)}`,
      amount: rand(50, 1200),
    }));
  }

  // Annual calendar events
  const eventsByMonth = Array.from({ length: 12 }, () => []);
  const sampleEvents = [
    "Monthly Stock Audit",
    "Narcotics Register Review",
    "Supplier Reconciliation",
    "GST Filing Prep",
    "Cold Chain Validation",
    "TPA Settlement Batch",
    "Vendor Meet",
    "Expiry Pull-out & Disposal",
  ];
  eventsByMonth.forEach((arr) => {
    const c = rand(1, 5);
    for (let k = 0; k < c; k++) arr.push(sampleEvents[rand(0, sampleEvents.length - 1)]);
  });

  // Inventory with expiry days
  const inventory = [
    { name: "Paracetamol 650mg", stock: rand(80, 1200), min: 200, uom: "Tablets", expiryDays: rand(10, 365) },
    { name: "Amoxicillin 500mg", stock: rand(60, 800), min: 180, uom: "Capsules", expiryDays: rand(5, 300) },
    { name: "Metformin 500mg", stock: rand(120, 1400), min: 250, uom: "Tablets", expiryDays: rand(20, 450) },
    { name: "Atorvastatin 10mg", stock: rand(50, 700), min: 150, uom: "Tablets", expiryDays: rand(30, 500) },
    { name: "Omeprazole 20mg", stock: rand(40, 600), min: 120, uom: "Capsules", expiryDays: rand(7, 280) },
    { name: "Salbutamol Inhaler", stock: rand(20, 180), min: 60, uom: "Units", expiryDays: rand(14, 180) },
    { name: "Vitamin D3 60k", stock: rand(30, 400), min: 90, uom: "Capsules", expiryDays: rand(25, 365) },
  ];

  return {
    billsByMonth,
    revenueByMonth,
    byCategory,
    payerMix,
    billing,
    kpi,
    tx,
    eventsByMonth,
    inventory,
  };
}

/* -------------------------------------------------------
   Pharmacy Dashboard
------------------------------------------------------- */
const Pharmacydash = () => {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [loading, setLoading] = useState(true);
  const [db, setDb] = useState(() => makePharmacyData(now.getFullYear()));
  const [detail, setDetail] = useState({ open: false, title: "", rows: [], money: false });

  const refresh = () => {
    setLoading(true);
    setTimeout(() => {
      setDb(makePharmacyData(year));
      setLoading(false);
    }, 450);
  };

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    setDb(makePharmacyData(year));
  }, [year]);

  const monthlyBills = db.billsByMonth[month] || 0;
  const monthlyRevenue = db.revenueByMonth[month] || 0;

  const categoryData = useMemo(() => {
    const out = {};
    categories.forEach((c) => (out[c] = db.byCategory[c][month] || 0));
    return out;
  }, [db, month]);

  const payerData = useMemo(() => ({ ...db.payerMix }), [db, month]); // demo

  // Detail openers
  function openPharmacyDetails(cat = "All Categories") {
    let rows = [];
    if (cat === "All Categories") {
      categories.forEach((c) => {
        rows = rows.concat((db.tx.Pharmacy[c][month] || []).map(r => ({ ...r, desc: `${c}: ${r.desc}`, amount: r.amount })));
      });
      setDetail({ open: true, title: `Pharmacy — ${monthsFull[month]} ${year}`, rows, money: false });
    } else {
      rows = (db.tx.Pharmacy[cat] && db.tx.Pharmacy[cat][month]) || [];
      setDetail({ open: true, title: `${cat} — ${monthsFull[month]} ${year}`, rows, money: false });
    }
  }

  function openBillingDetails(type = "Billing") {
    const rows = (db.tx.Billing && db.tx.Billing[month]) || [];
    setDetail({ open: true, title: `${type} — ${monthsFull[month]} ${year}`, rows, money: true });
  }

  function openTPADetails() {
    const rows = (db.tx.TPA && db.tx.TPA[month]) || [];
    setDetail({ open: true, title: `Payer Mix — ${monthsFull[month]} ${year}`, rows, money: true });
  }

  function openReturnsDetails() {
    const rows = (db.tx.Returns && db.tx.Returns[month]) || [];
    setDetail({ open: true, title: `Returns — ${monthsFull[month]} ${year}`, rows, money: true });
  }

  function openOperationalDetail(kind, value) {
    const rows = [
      { date: `${year}-${String(month+1).padStart(2,"0")}-05`, desc: `${kind} snapshot`, amount: value },
      { date: `${year}-${String(month+1).padStart(2,"0")}-18`, desc: `${kind} snapshot`, amount: value },
    ];
    setDetail({ open: true, title: `${kind} — ${monthsFull[month]} ${year}`, rows, money: false });
  }

  // Inventory UI helpers
  const inventoryRows = db.inventory.map((i) => {
    const status =
      i.stock < i.min ? "Reorder" : (i.expiryDays <= 30 ? "Expiring" : "OK");
    return { ...i, status };
  });
  const lowStock = inventoryRows.filter((i) => i.status === "Reorder");
  const expiringSoon = inventoryRows.filter((i) => i.status === "Expiring");

  const stats = [
    { label: "Total Bills (Month)", value: monthlyBills, icon: PillIcon(), tone: "fuchsia", format: NUM, open: () => openPharmacyDetails("All Categories") },
    { label: "Revenue (Month)", value: monthlyRevenue, icon: BillingIcon(), tone: "emerald", format: INR, open: () => openBillingDetails() },
    { label: "Avg Basket (items)", value: db.billing.avgBasket, icon: BoxIcon(), tone: "amber", format: NUM, open: () => openOperationalDetail("Avg Basket", db.billing.avgBasket) },
    { label: "Expiry Alerts (≤30d)", value: expiringSoon.length, icon: CalendarIcon(), tone: "indigo", format: NUM, open: () => openOperationalDetail("Expiring Items", expiringSoon.length) },
    { label: "Pending Indents", value: db.kpi.pendingIndents, icon: TruckIcon(), tone: "teal", format: NUM, open: () => openOperationalDetail("Pending Indents", db.kpi.pendingIndents) },
    { label: "Returns (Month)", value: db.kpi.returns, icon: ReturnIcon(), tone: "rose", format: NUM, open: () => openReturnsDetails() },
    { label: "Collections (Est.)", value: db.billing.collections, icon: BillingIcon(), tone: "emerald", format: INR, open: () => openBillingDetails("Collections") },
    { label: "Dues (Outstanding)", value: db.billing.dues, icon: BillingIcon(), tone: "slate", format: INR, open: () => openBillingDetails("Dues") },
  ];

  const roles = [
    { name: "Pharmacist", count: 4 },
    { name: "Storekeeper", count: 2 },
    { name: "Cashier", count: 2 },
    { name: "Inventory Manager", count: 1 },
    { name: "Admin", count: 1 },
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* topbar */}
        <div className="mb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl md:text-2xl font-semibold leading-tight">
              Pharmacy Dashboard
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
              onClick={s.open}
            />
          ))}
        </div>

        {/* charts row */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5">
          <div className="lg:col-span-2 rounded-2xl border bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 p-4 pb-2">
              <div className="min-w-0">
                <div className="text-base sm:text-lg font-semibold">Yearly Bills &amp; Revenue</div>
                <div className="text-xs sm:text-sm text-slate-500">
                  {monthsFull[month]} {year}: Bills{" "}
                  <span className="font-semibold">{NUM(monthlyBills)}</span> • Revenue{" "}
                  <span className="font-semibold">{INR(monthlyRevenue)}</span>
                </div>
              </div>
            </div>
            <div className="px-2 pb-4">
              <LineChart
                labels={monthsFull.map((m) => m.slice(0, 3))}
                seriesA={db.billsByMonth}
                seriesB={db.revenueByMonth}
                labA="Bills"
                labB="Revenue"
              />
            </div>
          </div>

          <div className="rounded-2xl border bg-white shadow-sm p-4">
            <div className="text-base sm:text-lg font-semibold mb-2">Category Mix (Month)</div>
            <DonutChart
              data={categoryData}
              centerLabel="Units"
              onLegendClick={(k) => openPharmacyDetails(k)}
            />
          </div>
        </div>

        {/* Payer Mix & Inventory */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5">
          {/* Payer Mix / TPA */}
          <div className="rounded-2xl border bg-white p-4 shadow-sm lg:col-span-1">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {BillingIcon()}
                <div className="text-base sm:text-lg font-semibold">Payer Mix</div>
              </div>
              <button className="text-sm underline decoration-dotted" onClick={openTPADetails}>
                View details
              </button>
            </div>
            <DonutChart data={payerData} centerLabel="Bills" />
            <div className="mt-3 rounded-xl border p-3 bg-slate-50">
              <div className="text-sm text-slate-600">
                Bills this month: <span className="font-semibold">{NUM(Object.values(payerData).reduce((a,b)=>a+b,0))}</span>
              </div>
              <div className="text-xs text-slate-500">Click details to export payer-wise list.</div>
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
                Low stock: <span className="font-semibold">{lowStock.length}</span> • Expiring (≤30d): <span className="font-semibold">{expiringSoon.length}</span>
              </div>
            </div>

            {/* Table on md+ */}
            <div className="rounded-xl border overflow-x-auto hidden md:block">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-3 py-2 text-left">Item</th>
                    <th className="px-3 py-2 text-left whitespace-nowrap">Stock</th>
                    <th className="px-3 py-2 text-left whitespace-nowrap">Min</th>
                    <th className="px-3 py-2 text-left">UoM</th>
                    <th className="px-3 py-2 text-left whitespace-nowrap">Expiry (days)</th>
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
                      <td className="px-3 py-2">{NUM(r.expiryDays)}</td>
                      <td className="px-3 py-2">
                        <span
                          className={`px-2 py-1 rounded-lg text-xs ${
                            r.status === "Reorder"
                              ? "bg-rose-100 text-rose-700"
                              : r.status === "Expiring"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {inventoryRows.length === 0 && (
                    <tr>
                      <td className="px-3 py-6 text-center text-slate-500" colSpan={6}>No inventory items.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Cards on small screens */}
            <div className="md:hidden space-y-2">
              {inventoryRows.map((r, i) => (
                <div key={i} className="rounded-xl border p-3 bg-white shadow-sm">
                  <div className="font-medium">{r.name}</div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div className="text-slate-500">Stock</div>
                    <div className="text-right font-semibold">{NUM(r.stock)}</div>
                    <div className="text-slate-500">Min</div>
                    <div className="text-right font-semibold">{NUM(r.min)}</div>
                    <div className="text-slate-500">UoM</div>
                    <div className="text-right">{r.uom}</div>
                    <div className="text-slate-500">Expiry (days)</div>
                    <div className="text-right">{NUM(r.expiryDays)}</div>
                    <div className="text-slate-500">Status</div>
                    <div className="text-right">
                      <span
                        className={`px-2 py-1 rounded-lg text-xs ${
                          r.status === "Reorder"
                            ? "bg-rose-100 text-rose-700"
                            : r.status === "Expiring"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {r.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {inventoryRows.length === 0 && (
                <div className="text-center text-slate-500 py-4">No inventory items.</div>
              )}
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
          onClose={() => setDetail({ open: false, title: "", rows: [], money: false })}
          title={detail.title}
          rows={detail.rows}
          money={detail.money}
        />
      </div>
    </div>
  );
};

export default Pharmacydash;
