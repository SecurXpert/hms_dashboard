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

const channels = ["Walk-in","Online","Phone","Doctor Referral"];
const payers = ["Cash","TPA","Corporate","Govt Scheme"];

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
const HeadsetIcon = (cls="text-cyan-700") => (
  <svg width="22" height="22" viewBox="0 0 24 24" className={cls} fill="currentColor">
    <path d="M12 2a9 9 0 00-9 9v4a3 3 0 003 3h2v-6H5v-1a7 7 0 0114 0v1h-3v6h2a3 3 0 003-3v-4a9 9 0 00-9-9z" />
  </svg>
);
const CalendarIcon = (cls="text-indigo-700") => (
  <svg width="22" height="22" viewBox="0 0 24 24" className={cls} fill="currentColor">
    <path d="M7 2h2v2h6V2h2v2h3v18H4V4h3V2zm13 8H4v10h16V10z" />
  </svg>
);
const PeopleIcon = (cls="text-fuchsia-700") => (
  <svg width="22" height="22" viewBox="0 0 24 24" className={cls} fill="currentColor">
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zM8 11c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.67 0-8 1.34-8 4v3h10v-3c0-2.66-5.33-4-8-4zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V20h7v-3c0-2.66-5.33-4-8-4z" />
  </svg>
);
const CashIcon = (cls="text-emerald-700") => (
  <svg width="22" height="22" viewBox="0 0 24 24" className={cls} fill="currentColor">
    <path d="M2 6h20v12H2zM4 8v8h16V8H4zm6 6a2 2 0 110-4 2 2 0 010 4z" />
  </svg>
);
const ClockIcon = (cls="text-amber-600") => (
  <svg width="22" height="22" viewBox="0 0 24 24" className={cls} fill="currentColor">
    <path d="M12 1a11 11 0 1011 11A11.013 11.013 0 0012 1zm1 11H7V10h5V5h2z" />
  </svg>
);
const NoShowIcon = (cls="text-rose-700") => (
  <svg width="22" height="22" viewBox="0 0 24 24" className={cls} fill="currentColor">
    <path d="M12 12a5 5 0 10-5-5 5 5 0 005 5zm0 2c-4 0-9 2-9 6v2h18v-2c0-4-5-6-9-6zM3 3l18 18-1.5 1.5L1.5 4.5 3 3z" />
  </svg>
);
const StarIcon = (cls="text-amber-500") => (
  <svg width="22" height="22" viewBox="0 0 24 24" className={cls} fill="currentColor">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
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
const LineChart = ({ labels, seriesA, seriesB, labA = "Appointments", labB = "Visits" }) => {
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
          <rect x="92" width="10" height="10" fill="#10b981" rx="2" />
          <text x="108" y="9" className="fill-slate-600 text-xs">{labB}</text>
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

  // Common button style
  const btn = "px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-white/20 transition";

  // CSV Export function
  const exportCsv = () => {
    const header = ["Date", "Description", "Amount"];
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
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-4">
        <div className="w-full max-w-full md:max-w-2xl rounded-2xl border bg-white shadow-xl overflow-hidden">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900 text-white px-4 sm:px-5 py-3">
            <h3 className="font-semibold truncate">{title} — Details</h3>
            <div className="flex gap-2">
              <button className={`${btn} bg-white/10 text-white`} onClick={exportCsv}>
                Export CSV
              </button>
              <button className={`${btn} bg-white/10 text-white`} onClick={onClose}>
                Close
              </button>
            </div>
          </div>

          {/* Body */}
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
                      <td className="px-3 py-2 whitespace-nowrap">
                        {money ? INR(r.amount) : NUM(r.amount)}
                      </td>
                    </tr>
                  ))}
                  {!rows.length && (
                    <tr>
                      <td
                        className="px-3 py-8 text-center text-slate-500"
                        colSpan={3}
                      >
                        No records.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer Total */}
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
   Fake dynamic data generator (Reception)
------------------------------------------------------- */
function makeReceptionData(seedYear = new Date().getFullYear()) {
  let s = seedYear * 8887;
  const rand = (min, max) => {
    s = (s * 9301 + 49297) % 233280;
    const r = s / 233280;
    return Math.floor(min + r * (max - min + 1));
  };

  // Monthly series
  const apptByMonth = Array.from({ length: 12 }, (_, i) => 2400 + rand(-400, 600) + i * 10);
  const visitByMonth = apptByMonth.map((v) => Math.floor(v * rand(78, 95) / 100)); // showup ratio
  const noShowByMonth = apptByMonth.map((v, i) => v - visitByMonth[i]);
  const collectionsByMonth = visitByMonth.map((v) => v * rand(80, 140)); // OPD reg/desk collections (indicative)

  // Mixes (month-agnostic demo)
  const channelMix = channels.reduce((acc, c) => { acc[c] = rand(200, 1600); return acc; }, {});
  const payerMix = payers.reduce((acc, p) => { acc[p] = rand(100, 1200); return acc; }, {});

  // KPIs
  const kpi = {
    avgWaitMins: rand(6, 28),
    callsHandled: rand(400, 1400),
    nps: rand(30, 88),
    newPatientPct: rand(22, 55),
  };

  // Transactions
  const tx = { Appointments: {}, Visits: {}, Billing: {}, Calls: {}, NoShows: {}, Payers: {}, Channels: {} };
  for (let mo = 0; mo < 12; mo++) {
    const cA = rand(10, 26);
    tx.Appointments[mo] = Array.from({ length: cA }, () => ({
      date: `${seedYear}-${String(mo + 1).padStart(2, "0")}-${String(rand(1, 28)).padStart(2, "0")}`,
      desc: `Appointment #${rand(10000, 99999)} • ${["Walk-in","Online","Phone"][rand(0,2)]}`,
      amount: 1,
    }));
    const cV = rand(10, 26);
    tx.Visits[mo] = Array.from({ length: cV }, () => ({
      date: `${seedYear}-${String(mo + 1).padStart(2, "0")}-${String(rand(1, 28)).padStart(2, "0")}`,
      desc: `Visit ticket #${rand(10000, 99999)}`,
      amount: 1,
    }));
    const cB = rand(10, 26);
    tx.Billing[mo] = Array.from({ length: cB }, () => ({
      date: `${seedYear}-${String(mo + 1).padStart(2, "0")}-${String(rand(1, 28)).padStart(2, "0")}`,
      desc: `Front-desk receipt #${rand(10000, 99999)}`,
      amount: rand(60, 600),
    }));
    const cC = rand(8, 18);
    tx.Calls[mo] = Array.from({ length: cC }, () => ({
      date: `${seedYear}-${String(mo + 1).padStart(2, "0")}-${String(rand(1, 28)).padStart(2, "0")}`,
      desc: `Call log ID ${rand(1000, 9999)}`,
      amount: 1,
    }));
    const cN = rand(6, 16);
    tx.NoShows[mo] = Array.from({ length: cN }, () => ({
      date: `${seedYear}-${String(mo + 1).padStart(2, "0")}-${String(rand(1, 28)).padStart(2, "0")}`,
      desc: `No-show ticket #${rand(10000, 99999)}`,
      amount: 1,
    }));
    tx.Payers[mo] = payers.map(p => ({
      date: `${seedYear}-${String(mo + 1).padStart(2, "0")}-01`,
      desc: `Payer: ${p}`,
      amount: rand(60, 1200),
    }));
    tx.Channels[mo] = channels.map(c => ({
      date: `${seedYear}-${String(mo + 1).padStart(2, "0")}-01`,
      desc: `Channel: ${c}`,
      amount: rand(80, 1600),
    }));
  }

  // Annual calendar events
  const eventsByMonth = Array.from({ length: 12 }, () => []);
  const sampleEvents = [
    "Front Desk Audit",
    "Staff Training: Empathy & Triage",
    "Queue System Maintenance",
    "Insurance Desk Review",
    "CSR Health Camp",
    "OPD Token System Upgrade",
    "Feedback/NPS Survey",
    "Doctor Roster Sync",
  ];
  eventsByMonth.forEach((arr) => {
    const c = rand(1, 5);
    for (let k = 0; k < c; k++) arr.push(sampleEvents[rand(0, sampleEvents.length - 1)]);
  });

  // Today's queue (demo)
  const depts = ["OPD-General","Pediatrics","Orthopedics","ENT","Dermatology","Cardiology"];
  const statuses = ["Waiting","In Progress","Completed","No-show"];
  const queueToday = Array.from({ length: 9 }, (_, i) => ({
    token: `T${String(101 + i)}`,
    patient: ["Amit","Priya","Karan","Neha","Arjun","Meera","Vikram","Sara","Rohit"][i],
    time: `${String(9 + Math.floor(i/2)).padStart(2,"0")}:${i%2 ? "30" : "00"}`,
    dept: depts[rand(0, depts.length - 1)],
    status: statuses[rand(0, statuses.length - 1)],
  }));

  return {
    apptByMonth,
    visitByMonth,
    noShowByMonth,
    collectionsByMonth,
    channelMix,
    payerMix,
    kpi,
    tx,
    eventsByMonth,
    queueToday,
  };
}

/* -------------------------------------------------------
   Reception Dashboard
------------------------------------------------------- */
const Receptiondash = () => {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [loading, setLoading] = useState(true);
  const [db, setDb] = useState(() => makeReceptionData(now.getFullYear()));
  const [detail, setDetail] = useState({ open: false, title: "", rows: [], money: false });

  const refresh = () => {
    setLoading(true);
    setTimeout(() => {
      setDb(makeReceptionData(year));
      setLoading(false);
    }, 450);
  };

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    setDb(makeReceptionData(year));
  }, [year]);

  const monthlyAppts = db.apptByMonth[month] || 0;
  const monthlyVisits = db.visitByMonth[month] || 0;
  const monthlyNoShows = db.noShowByMonth[month] || 0;
  const monthlyCollections = db.collectionsByMonth[month] || 0;

  const channelData = useMemo(() => ({ ...db.channelMix }), [db, month]); // demo constant
  const payerData = useMemo(() => ({ ...db.payerMix }), [db, month]); // demo constant

  // Detail openers
  function openAppointmentsDetails() {
    const rows = (db.tx.Appointments && db.tx.Appointments[month]) || [];
    setDetail({ open: true, title: `Appointments — ${monthsFull[month]} ${year}`, rows, money: false });
  }
  function openVisitsDetails() {
    const rows = (db.tx.Visits && db.tx.Visits[month]) || [];
    setDetail({ open: true, title: `Visits — ${monthsFull[month]} ${year}`, rows, money: false });
  }
  function openBillingDetails(type = "Billing") {
    const rows = (db.tx.Billing && db.tx.Billing[month]) || [];
    setDetail({ open: true, title: `${type} — ${monthsFull[month]} ${year}`, rows, money: true });
  }
  function openCallsDetails() {
    const rows = (db.tx.Calls && db.tx.Calls[month]) || [];
    setDetail({ open: true, title: `Calls — ${monthsFull[month]} ${year}`, rows, money: false });
  }
  function openNoShowsDetails() {
    const rows = (db.tx.NoShows && db.tx.NoShows[month]) || [];
    setDetail({ open: true, title: `No-shows — ${monthsFull[month]} ${year}`, rows, money: false });
  }
  function openPayerDetails() {
    const rows = (db.tx.Payers && db.tx.Payers[month]) || [];
    setDetail({ open: true, title: `Payers — ${monthsFull[month]} ${year}`, rows, money: true });
  }
  function openChannelDetails() {
    const rows = (db.tx.Channels && db.tx.Channels[month]) || [];
    setDetail({ open: true, title: `Channels — ${monthsFull[month]} ${year}`, rows, money: false });
  }
  function openKpiDetail(kind, val) {
    const rows = [
      { date: `${year}-${String(month+1).padStart(2,"0")}-08`, desc: `${kind} snapshot`, amount: val },
      { date: `${year}-${String(month+1).padStart(2,"0")}-19`, desc: `${kind} snapshot`, amount: val },
    ];
    setDetail({ open: true, title: `${kind} — ${monthsFull[month]} ${year}`, rows, money: false });
  }

  const stats = [
    { label: "Appointments (Month)", value: monthlyAppts, icon: CalendarIcon(), tone: "indigo", format: NUM, onClick: openAppointmentsDetails },
    { label: "Visits (Month)", value: monthlyVisits, icon: PeopleIcon(), tone: "fuchsia", format: NUM, onClick: openVisitsDetails },
    { label: "No-shows (Month)", value: monthlyNoShows, icon: NoShowIcon(), tone: "rose", format: NUM, onClick: openNoShowsDetails },
    { label: "Avg Wait (mins)", value: db.kpi.avgWaitMins, icon: ClockIcon(), tone: "amber", format: NUM, onClick: () => openKpiDetail("Average Wait (mins)", db.kpi.avgWaitMins) },
    { label: "Calls Handled", value: db.kpi.callsHandled, icon: HeadsetIcon(), tone: "cyan", format: NUM, onClick: openCallsDetails },
    { label: "New Patients (%)", value: db.kpi.newPatientPct, icon: PeopleIcon("text-emerald-700"), tone: "emerald", format: (x)=>`${Math.round(x)}%`, onClick: () => openKpiDetail("New Patient %", db.kpi.newPatientPct) },
    { label: "Collections (Month)", value: monthlyCollections, icon: CashIcon(), tone: "emerald", format: INR, onClick: () => openBillingDetails("Collections") },
    { label: "NPS Score", value: db.kpi.nps, icon: StarIcon(), tone: "slate", format: NUM, onClick: () => openKpiDetail("NPS Score", db.kpi.nps) },
  ];

  const roles = [
    { name: "Receptionist", count: 5 },
    { name: "Cashier", count: 2 },
    { name: "Insurance Desk", count: 2 },
    { name: "Helpdesk", count: 2 },
    { name: "Admin", count: 1 },
  ];

  // Queue helpers for UI badges
  const badgeCls = (status) =>
    status === "Waiting" ? "bg-amber-100 text-amber-700" :
    status === "In Progress" ? "bg-blue-100 text-blue-700" :
    status === "Completed" ? "bg-emerald-100 text-emerald-700" :
    "bg-rose-100 text-rose-700";

  return (
    <div className="min-h-screen bg-slate-100 p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* topbar */}
        <div className="mb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl md:text-2xl font-semibold leading-tight">
              Reception Dashboard
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
                <div className="text-base sm:text-lg font-semibold">Yearly Appointments &amp; Visits</div>
                <div className="text-xs sm:text-sm text-slate-500">
                  {monthsFull[month]} {year}: Appointments{" "}
                  <span className="font-semibold">{NUM(monthlyAppts)}</span> • Visits{" "}
                  <span className="font-semibold">{NUM(monthlyVisits)}</span>
                </div>
              </div>
            </div>
            <div className="px-2 pb-4">
              <LineChart
                labels={monthsFull.map((m) => m.slice(0, 3))}
                seriesA={db.apptByMonth}
                seriesB={db.visitByMonth}
                labA="Appointments"
                labB="Visits"
              />
            </div>
          </div>

          <div className="rounded-2xl border bg-white shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-base sm:text-lg font-semibold">Channel Mix</div>
              <button className="text-sm underline decoration-dotted" onClick={openChannelDetails}>Details</button>
            </div>
            <DonutChart
              data={channelData}
              centerLabel="Appts"
              onLegendClick={() => openChannelDetails()}
            />
          </div>
        </div>

        {/* Payers & Queue */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5">
          {/* Payers */}
          <div className="rounded-2xl border bg-white p-4 shadow-sm lg:col-span-1">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {CashIcon()}
                <div className="text-base sm:text-lg font-semibold">Payer Mix</div>
              </div>
              <button className="text-sm underline decoration-dotted" onClick={openPayerDetails}>
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

          {/* Queue Today */}
          <div className="rounded-2xl border bg-white p-4 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {PeopleIcon()}
                <div className="text-base sm:text-lg font-semibold">Today's Queue</div>
              </div>
              <div className="text-xs sm:text-sm text-slate-500">
                Total: <span className="font-semibold">{db.queueToday.length}</span>
              </div>
            </div>

            {/* Table on md+ */}
            <div className="rounded-xl border overflow-x-auto hidden md:block">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-3 py-2 text-left whitespace-nowrap">Token</th>
                    <th className="px-3 py-2 text-left">Patient</th>
                    <th className="px-3 py-2 text-left">Time</th>
                    <th className="px-3 py-2 text-left">Department</th>
                    <th className="px-3 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {db.queueToday.map((q, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="px-3 py-2">{q.token}</td>
                      <td className="px-3 py-2">{q.patient}</td>
                      <td className="px-3 py-2">{q.time}</td>
                      <td className="px-3 py-2">{q.dept}</td>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-1 rounded-lg text-xs ${badgeCls(q.status)}`}>{q.status}</span>
                      </td>
                    </tr>
                  ))}
                  {db.queueToday.length === 0 && (
                    <tr>
                      <td className="px-3 py-6 text-center text-slate-500" colSpan={5}>No patients in queue.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Cards on small screens */}
            <div className="md:hidden space-y-2">
              {db.queueToday.map((q, i) => (
                <div key={i} className="rounded-xl border p-3 bg-white shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{q.patient}</div>
                    <span className={`px-2 py-1 rounded-lg text-xs ${badgeCls(q.status)}`}>{q.status}</span>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div className="text-slate-500">Token</div>
                    <div className="text-right font-semibold">{q.token}</div>
                    <div className="text-slate-500">Time</div>
                    <div className="text-right">{q.time}</div>
                    <div className="text-slate-500">Department</div>
                    <div className="text-right">{q.dept}</div>
                  </div>
                </div>
              ))}
              {db.queueToday.length === 0 && (
                <div className="text-center text-slate-500 py-4">No patients in queue.</div>
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

export default Receptiondash;
