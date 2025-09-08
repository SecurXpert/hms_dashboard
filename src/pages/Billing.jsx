import React, { useMemo, useState, useEffect, useRef } from "react";

/* ---------------- helpers ---------------- */
const inr = (n) =>
  (Number(n) || 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });

const parseISO = (s) => (s ? new Date(`${s}T00:00:00`) : null);
const fmtISO = (d) => (d ? d.toISOString().slice(0, 10) : "");
const withinRange = (dateStr, from, to) => {
  if (!from && !to) return true;
  const d = parseISO(dateStr);
  if (!d) return false;
  if (from && d < parseISO(from)) return false;
  if (to && d > parseISO(to)) return false;
  return true;
};

const monthBounds = (ym /* "YYYY-MM" */) => {
  if (!ym) return { start: "", end: "" };
  const [y, m] = ym.split("-").map((x) => Number(x));
  const start = new Date(y, m - 1, 1);
  const end = new Date(y, m, 0);
  return { start: fmtISO(start), end: fmtISO(end) };
};

const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

/* payment utils */
const sumPayments = (payments = []) =>
  payments.reduce((s, p) => s + (Number(p.amount) || 0), 0);

const summarizePayment = (payments = [], fallbackMode) => {
  if (!payments || payments.length === 0) return fallbackMode || "—";
  const label = (p) => {
    if (p.type === "TPA") {
      return `TPA ${p.tpaName ? `(${p.tpaName})` : ""} ${p.tpaAuth ? `· ${p.tpaAuth}` : ""} ${inr(p.amount)}`;
    }
    if (p.type === "Card") {
      return `Card ${p.last4 ? `•••• ${p.last4}` : ""} ${inr(p.amount)}`;
    }
    return `${p.type} ${inr(p.amount)}`;
  };
  if (payments.length === 1) return label(payments[0]);
  return `Mixed: ${payments.map((p) => label(p)).join(" + ")}`;
};

const rowMatchesPaymentFilter = (row, filter) => {
  if (!filter) return true;
  const types = (row.payments || []).map((p) => p.type);
  if (filter === "Mixed") return (new Set(types)).size > 1;
  return types.includes(filter);
};

/* ---------------- counters & badges ---------------- */
const Counter = ({ value, duration = 500 }) => {
  const [v, setV] = useState(0);
  const raf = useRef();
  useEffect(() => {
    const start = performance.now();
    const from = 0;
    const to = Number(value) || 0;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      setV(from + (to - from) * t);
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [value, duration]);
  return <>{inr(v)}</>;
};

const PayBadge = ({ value }) => {
  const map = {
    Paid: "bg-emerald-100 text-emerald-700",
    "Partially Paid": "bg-amber-100 text-amber-800",
    Unpaid: "bg-rose-100 text-rose-700",
    Refunded: "bg-slate-100 text-slate-700",
  };
  return (
    <span
      className={`px-2 py-1 rounded-md text-xs font-medium ${
        map[value] || "bg-slate-100 text-slate-700"
      }`}
    >
      {value}
    </span>
  );
};

/* ---------------- tiny icons (no deps) ---------------- */
const Icon = {
  Calendar: () => (
    <svg viewBox="0 0 24 24" width="36" height="36" className="text-slate-700">
      <path
        fill="currentColor"
        d="M7 2h2v2h6V2h2v2h3a2 2 0 012 2v13a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2h3V2zm13 7H4v10h16V9z"
      />
    </svg>
  ),
  CalendarSm: () => (
    <svg viewBox="0 0 24 24" width="18" height="18" className="text-slate-600">
      <path
        fill="currentColor"
        d="M7 2h2v2h6V2h2v2h3a2 2 0 012 2v13a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2h3V2zm13 7H4v10h16V9z"
      />
    </svg>
  ),
  Steth: () => (
    <svg viewBox="0 0 24 24" width="36" height="36" className="text-slate-700">
      <path
        fill="currentColor"
        d="M6 2v6a4 4 0 108 0V2h2v6a6 6 0 11-12 0V2h2zm13 8a3 3 0 00-3 3v3a5 5 0 01-5 5h-1v-2h1a3 3 0 003-3v-3a5 5 0 1110 0v2h-2v-2a3 3 0 00-3-3z"
      />
    </svg>
  ),
  Bed: () => (
    <svg viewBox="0 0 24 24" width="36" height="36" className="text-slate-700">
      <path
        fill="currentColor"
        d="M3 7h9a5 5 0 015 5v3h3v2H2v-2h1V7zm1 2v6h12v-1a3 3 0 00-3-3H4z"
      />
    </svg>
  ),
  Flask: () => (
    <svg viewBox="0 0 24 24" width="36" height="36" className="text-slate-700">
      <path
        fill="currentColor"
        d="M9 2h6v2h-1v4.1l4.9 8.48A3 3 0 0116.38 22H7.62a3 3 0 01-2.52-5.42L10 8.1V4H9V2z"
      />
    </svg>
  ),
  Microscope: () => (
    <svg viewBox="0 0 24 24" width="36" height="36" className="text-slate-700">
      <path
        fill="currentColor"
        d="M6 22v-2h7a5 5 0 004.58-3H21v-2h-2.1a5 5 0 00-.9-1.62l1.42-1.42-1.41-1.41-1.42 1.41A5 5 0 0012 9.1V7h1V5H7v2h1v2.1a7 7 0 00-2.83 11.2L6 22z"
      />
    </svg>
  ),
  Drop: () => (
    <svg viewBox="0 0 24 24" width="36" height="36" className="text-slate-700">
      <path fill="currentColor" d="M12 2s6 7 6 11a6 6 0 11-12 0c0-4 6-11 6-11z" />
    </svg>
  ),
  Component: () => (
    <svg viewBox="0 0 24 24" width="36" height="36" className="text-slate-700">
      <path
        fill="currentColor"
        d="M12 2l9 5v10l-9 5-9-5V7l9-5zm0 2.2L5 8v8l7 3.8L19 16V8l-7-3.8zM8 10h8v2H8v-2zm0 4h6v2H8v-2z"
      />
    </svg>
  ),
  Pill: () => (
    <svg viewBox="0 0 24 24" width="36" height="36" className="text-slate-700">
      <path
        fill="currentColor"
        d="M4.2 4.2a6 6 0 018.5 0l7.1 7.1a6 6 0 01-8.5 8.5L4.2 12.7a6 6 0 010-8.5zm1.4 1.4a4 4 0 000 5.7l3.5 3.5 5.7-5.7-3.5-3.5a4 4 0 00-5.7 0z"
      />
    </svg>
  ),
  Ambulance: () => (
    <svg viewBox="0 0 24 24" width="36" height="36" className="text-slate-700">
      <path
        fill="currentColor"
        d="M3 6h10l3 3h5v7h-2a3 3 0 11-6 0H9a3 3 0 11-6 0H1V8a2 2 0 012-2zm1 2v6h8V8H4zm14 0l-2-2v4h6V8h-4zM11 9H9V7H7v2H5v2h2v2h2v-2h2V9z"
      />
    </svg>
  ),
  Search: () => (
    <svg viewBox="0 0 24 24" width="18" height="18" className="text-white">
      <path
        fill="currentColor"
        d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79L20 21.5 21.5 20 15.5 14zM9.5 14C7 14 5 12 5 9.5S7 5 9.5 5 14 7 14 9.5 12 14 9.5 14z"
      />
    </svg>
  ),
  Close: () => (
    <svg viewBox="0 0 24 24" width="18" height="18" className="text-slate-600">
      <path
        fill="currentColor"
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  Export: () => (
    <svg viewBox="0 0 24 24" width="18" height="18" className="text-white">
      <path
        fill="currentColor"
        d="M12 3l4 4h-3v6h-2V7H8l4-4zm-7 9h2v7h12v-7h2v9H5v-9z"
      />
    </svg>
  ),
  Download: () => (
    <svg viewBox="0 0 24 24" width="18" height="18" className="text-white">
      <path
        fill="currentColor"
        d="M12 3v10.586l3.293-3.293 1.414 1.414L12 17.414l-4.707-4.707 1.414-1.414L11 13.586V3h1zM5 19h14v2H5v-2z"
      />
    </svg>
  ),
};

/* ---------------- mock dataset with PAYMENT BREAKDOWN + REFERRAL ---------------- */
const MOCK = [
  // Appointment
  {
    caseId: "A-240801",
    module: "Appointment",
    patientId: "P2001",
    patientName: "Kiran Rao",
    date: "2025-08-20",
    billAmount: 300,
    payments: [{ type: "UPI", amount: 300, upiRef: "UPI-9001" }],
    paymentStatus: "Paid",
    paymentMode: "UPI",
    txnId: "TXN-A1",
    reference: { name: "Self", amount: 0 },
  },
  {
    caseId: "A-240802",
    module: "Appointment",
    patientId: "P2002",
    patientName: "Meera Joshi",
    date: "2025-08-21",
    billAmount: 300,
    payments: [],
    paymentStatus: "Unpaid",
    paymentMode: "",
    txnId: "",
    reference: { name: "Walk-in", amount: 0 },
  },

  // OPD
  {
    caseId: "OPD-1001",
    module: "OPD",
    patientId: "P1001",
    patientName: "Rahul Verma",
    date: "2025-08-20",
    billAmount: 650,
    payments: [{ type: "Card", amount: 650, last4: "4321" }],
    paymentStatus: "Paid",
    paymentMode: "Card",
    txnId: "OPD-11",
    details: { Doctor: "Dr. Mehta", Procedures: "—" },
    reference: { name: "Clinic Referral", amount: 50 },
  },
  {
    caseId: "OPD-1002",
    module: "OPD",
    patientId: "P1010",
    patientName: "Haritha",
    date: "2025-08-19",
    billAmount: 3200,
    // Partial: Cash + TPA
    payments: [
      { type: "Cash", amount: 1200 },
      { type: "TPA", amount: 1800, tpaName: "MediAssist", tpaAuth: "MA-4582" },
    ],
    paymentStatus: "Partially Paid",
    paymentMode: "Mixed",
    txnId: "OPD-77",
    details: { Doctor: "Dr. Kapoor", Procedures: "Dressing" },
    reference: { name: "Dr. Shah (Referral)", amount: 200 },
  },

  // IPD
  {
    caseId: "IPD-2201",
    module: "IPD",
    patientId: "P1601",
    patientName: "Mahesh Patil",
    date: "2025-08-18",
    billAmount: 48500,
    // Cash + TPA cashless
    payments: [
      { type: "Cash", amount: 5000 },
      { type: "TPA", amount: 25000, tpaName: "Star Health", tpaAuth: "STAR-CLM-7782" },
    ],
    paymentStatus: "Partially Paid",
    paymentMode: "Mixed",
    txnId: "IPD-2201",
    details: { Room: "Semi-Private", Days: 5, "Room Charges": inr(2200 * 5), Nursing: inr(1500), Misc: inr(500) },
    reference: { name: "Corporate Tie-up", amount: 1000 },
  },
  {
    caseId: "IPD-2202",
    module: "IPD",
    patientId: "P1620",
    patientName: "Deepa Shah",
    date: "2025-08-16",
    billAmount: 38400,
    payments: [{ type: "Card", amount: 38400, last4: "1109" }],
    paymentStatus: "Paid",
    paymentMode: "Card",
    txnId: "IPD-2202",
    details: { Room: "Private", Days: 3, "Room Charges": inr(3500 * 3), Nursing: inr(1200), Misc: inr(800) },
    reference: { name: "Self", amount: 0 },
  },

  // Pharmacy
  {
    caseId: "PH-9001",
    module: "Pharmacy",
    patientId: "P3001",
    patientName: "Suhasini Iyer",
    date: "2025-08-19",
    billAmount: 1180,
    payments: [{ type: "UPI", amount: 1180, upiRef: "UPI-9911" }],
    paymentStatus: "Paid",
    paymentMode: "UPI",
    txnId: "PH-9001",
    items: [
      { name: "Paracetamol 500mg", qty: 10, price: 15 },
      { name: "Cough Syrup 100ml", qty: 1, price: 60 },
      { name: "Bandage 5cm", qty: 5, price: 10 },
    ],
    reference: { name: "Pharmacy Walk-in", amount: 0 },
  },
  {
    caseId: "PH-9002",
    module: "Pharmacy",
    patientId: "P3002",
    patientName: "Amit T",
    date: "2025-08-18",
    billAmount: 420,
    payments: [{ type: "Cash", amount: 200 }],
    paymentStatus: "Partially Paid",
    paymentMode: "Cash",
    txnId: "PH-9002",
    items: [{ name: "Amoxicillin 250mg", qty: 10, price: 22 }],
    reference: { name: "Dr. Patel (Referral)", amount: 30 },
  },

  // Pathology
  {
    caseId: "PA-240802",
    module: "Pathology",
    patientId: "P1002",
    patientName: "Suhasini Iyer",
    date: "2025-08-19",
    billAmount: 1200,
    payments: [{ type: "Card", amount: 600, last4: "2222" }],
    paymentStatus: "Partially Paid",
    paymentMode: "Card",
    txnId: "TXN1B2C3",
    reference: { name: "Camp Referral", amount: 80 },
  },

  // Radiology
  {
    caseId: "RA-5501",
    module: "Radiology",
    patientId: "P1302",
    patientName: "Amit T",
    date: "2025-08-18",
    billAmount: 1800,
    payments: [{ type: "UPI", amount: 1800, upiRef: "UPI-5533" }],
    paymentStatus: "Paid",
    paymentMode: "UPI",
    txnId: "RAD-9",
    reference: { name: "Self", amount: 0 },
  },

  // Blood Issue
  {
    caseId: "B-9910",
    module: "Blood Issue",
    patientId: "P1701",
    patientName: "Ravi Prasad",
    date: "2025-08-17",
    billAmount: 2500,
    payments: [{ type: "Cash", amount: 2000 }],
    paymentStatus: "Partially Paid",
    paymentMode: "Cash",
    txnId: "BLD-2",
    reference: { name: "Doctor Referral", amount: 150 },
  },

  // Blood Component Issue
  {
    caseId: "BC-3240",
    module: "Blood Component Issue",
    patientId: "P1711",
    patientName: "Neelima",
    date: "2025-08-17",
    billAmount: 4200,
    payments: [],
    paymentStatus: "Unpaid",
    paymentMode: "",
    txnId: "",
    reference: { name: "Walk-in", amount: 0 },
  },

  // Ambulance
  {
    caseId: "AMB-7001",
    module: "Ambulance",
    patientId: "P4101",
    patientName: "Sanjay Kulkarni",
    date: "2025-08-19",
    billAmount: 1800,
    payments: [
      { type: "UPI", amount: 1000, upiRef: "UPI-AMB-01" },
      { type: "TPA", amount: 500, tpaName: "MediAssist", tpaAuth: "MA-AMB-1201" },
    ],
    paymentStatus: "Partially Paid",
    paymentMode: "Mixed",
    txnId: "AMB-TXN-01",
    details: {
      Trip: "Emergency",
      From: "City Center",
      To: "General Hospital",
      DistanceKm: 12,
      "Base Fare": inr(800),
      "Per Km": inr(20),
      "Km Charge": inr(12 * 20),
      Oxygen: inr(200),
    },
    reference: { name: "Police Control Room", amount: 0 },
  },
  {
    caseId: "AMB-7002",
    module: "Ambulance",
    patientId: "P4102",
    patientName: "Leela N",
    date: "2025-08-20",
    billAmount: 1200,
    payments: [{ type: "Cash", amount: 1200 }],
    paymentStatus: "Paid",
    paymentMode: "Cash",
    txnId: "AMB-TXN-02",
    details: {
      Trip: "Scheduled Transfer",
      From: "Clinic A",
      To: "Clinic B",
      DistanceKm: 8,
      "Base Fare": inr(700),
      "Per Km": inr(20),
      "Km Charge": inr(8 * 20),
    },
    reference: { name: "Self", amount: 0 },
  },
];

/* ---------------- tiles ---------------- */
const ModuleTile = ({ icon, title, active, onClick, count, amount }) => (
  <button
    onClick={onClick}
    className={`relative flex flex-col items-center justify-center gap-3 rounded-xl border shadow-sm p-6 w-full bg-white hover:shadow-md transition transform hover:-translate-y-0.5 hover:scale-[1.01] ${
      active ? "ring-2 ring-blue-500" : ""
    } pop`}
  >
    {icon}
    <div className="text-sm font-semibold text-slate-800">{title}</div>
    <div className="text-[11px] text-slate-500">{count} bills</div>
    <div className="absolute top-2 right-2 text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">
      {inr(amount)}
    </div>
  </button>
);

/* ---------------- row slide-over ---------------- */
const SlideOver = ({ open, onClose, record }) => {
  if (!open) return null;

  const paid = sumPayments(record.payments);
  const bal = (Number(record.billAmount) || 0) - paid;

  const exportCsv = () => {
    const header =
      "Case ID,Module,Patient,Patient ID,Date,Bill,Paid,Balance,Status,Payment Breakdown,Txn ID,Ref Name,Ref Amount\n";
    const breakdown = (record.payments || [])
      .map((p) => {
        if (p.type === "TPA")
          return `TPA(${p.tpaName || ""}${p.tpaAuth ? `/${p.tpaAuth}` : ""}) ${p.amount}`;
        if (p.type === "Card")
          return `Card(${p.last4 || ""}) ${p.amount}`;
        if (p.type === "UPI")
          return `UPI(${p.upiRef || ""}) ${p.amount}`;
        return `${p.type} ${p.amount}`;
      })
      .join(" + ");

    const row = [
      record.caseId,
      record.module,
      record.patientName,
      record.patientId,
      record.date,
      record.billAmount,
      paid,
      bal,
      record.paymentStatus,
      `"${breakdown || record.paymentMode || "-"}"`,
      record.txnId || "-",
      (record.reference && record.reference.name) || "",
      (record.reference && record.reference.amount) || 0,
    ].join(",");

    const blob = new Blob([header + row], {
      type: "text/csv;charset=utf-8;",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${record.caseId}.csv`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute inset-y-0 right-0 w-full sm:w-[520px] bg-white shadow-2xl border-l rounded-l-2xl overflow-hidden slide-in">
        <div className="flex items-center justify-between px-4 py-3 border-b bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="font-semibold">Bill Details</div>
          <button onClick={onClose} className="rounded-md bg-white/10 px-2 py-1">
            <Icon.Close />
          </button>
        </div>

        <div className="p-4 space-y-3 text-sm">
          <div className="rounded-xl border bg-slate-50 p-3">
            <div className="flex justify-between">
              <span className="text-slate-500">Case ID</span>
              <b>{record.caseId}</b>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Module</span>
              <b>{record.module}</b>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Patient</span>
              <b>
                {record.patientName}{" "}
                <span className="text-slate-400">({record.patientId})</span>
              </b>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Date</span>
              <b>{record.date}</b>
            </div>
          </div>

          {record.details && (
            <div className="rounded-xl border p-3">
              <div className="text-slate-500 text-xs mb-2">Details</div>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(record.details).map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-slate-500">{k}</span>
                    <b>{v}</b>
                  </div>
                ))}
              </div>
            </div>
          )}

          {Array.isArray(record.items) && record.items.length > 0 && (
            <div className="rounded-xl border p-3">
              <div className="text-slate-500 text-xs mb-2">Items</div>
              <div className="max-h-56 overflow-auto rounded-lg border">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50">
                    <tr className="text-left">
                      <th className="px-2 py-2">Item</th>
                      <th className="px-2 py-2">Qty</th>
                      <th className="px-2 py-2">Price</th>
                      <th className="px-2 py-2">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {record.items.map((it, i) => (
                      <tr key={i} className="border-t">
                        <td className="px-2 py-1.5">{it.name}</td>
                        <td className="px-2 py-1.5">{it.qty}</td>
                        <td className="px-2 py-1.5">{inr(it.price)}</td>
                        <td className="px-2 py-1.5 font-medium">
                          {inr(it.qty * it.price)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Totals */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border p-3 text-center">
              <div className="text-slate-500 text-xs mb-1">Bill</div>
              <div className="font-semibold">{inr(record.billAmount)}</div>
            </div>
            <div className="rounded-xl border p-3 text-center">
              <div className="text-slate-500 text-xs mb-1">Paid</div>
              <div className="font-semibold text-emerald-700">
                {inr(paid)}
              </div>
            </div>
            <div className="rounded-xl border p-3 text-center">
              <div className="text-slate-500 text-xs mb-1">Balance</div>
              <div
                className={`font-semibold ${
                  bal > 0 ? "text-rose-600" : "text-emerald-700"
                }`}
              >
                {inr(bal)}
              </div>
            </div>
          </div>

          {/* Payment Breakdown */}
          <div className="rounded-xl border p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-slate-700 font-medium">Payment Breakdown</div>
              <PayBadge value={record.paymentStatus} />
            </div>

            <div className="space-y-2">
              {(record.payments || []).length === 0 && (
                <div className="text-xs text-slate-500">No payments recorded.</div>
              )}
              {(record.payments || []).map((p, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg bg-slate-50 px-2 py-1.5">
                  <div className="text-xs text-slate-600">
                    {p.type === "TPA" && (
                      <>
                        <span className="inline-block px-2 py-0.5 mr-1 rounded-full bg-indigo-100 text-indigo-700 text-[11px]">TPA</span>
                        {p.tpaName || "—"} {p.tpaAuth ? `· ${p.tpaAuth}` : ""}
                      </>
                    )}
                    {p.type === "Card" && (
                      <>
                        <span className="inline-block px-2 py-0.5 mr-1 rounded-full bg-emerald-100 text-emerald-700 text-[11px]">Card</span>
                        {p.last4 ? `•••• ${p.last4}` : ""}
                      </>
                    )}
                    {p.type === "UPI" && (
                      <>
                        <span className="inline-block px-2 py-0.5 mr-1 rounded-full bg-blue-100 text-blue-700 text-[11px]">UPI</span>
                        {p.upiRef || ""}
                      </>
                    )}
                    {p.type === "Cash" && (
                      <span className="inline-block px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px]">
                        Cash
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-semibold">{inr(p.amount)}</div>
                </div>
              ))}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="flex justify-between">
                <span className="text-slate-500">Mode</span>
                <b>{summarizePayment(record.payments, record.paymentMode)}</b>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Txn ID</span>
                <b>{record.txnId || "—"}</b>
              </div>
            </div>
          </div>

          {/* Referral / Commission */}
          <div className="rounded-xl border p-3">
            <div className="text-slate-700 font-medium mb-1">Referral</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex justify-between">
                <span className="text-slate-500">Reference Name</span>
                <b>{record.reference?.name || "—"}</b>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Reference Amount</span>
                <b>{inr(record.reference?.amount || 0)}</b>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={exportCsv}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-white text-sm hover:bg-slate-800"
            >
              <Icon.Export /> Export CSV
            </button>
            <div className="flex gap-2">
              <button
                disabled={bal <= 0}
                className={`rounded-lg px-3 py-2 text-sm border ${
                  bal > 0
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}
              >
                Collect Balance
              </button>
              <button className="rounded-lg px-3 py-2 text-sm border bg-amber-50 text-amber-700 hover:bg-amber-100">
                Refund
              </button>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .slide-in { animation: slideIn .28s ease-out both; }
        @keyframes slideIn { from { transform: translateX(100%); opacity:.4 } to { transform: translateX(0); opacity:1 } }
      `}</style>
    </div>
  );
};

/* ---------------- main ---------------- */
const Billing = () => {
  const userRole = localStorage.getItem("userRole") || "admin";

  const moduleKeys =
    userRole === "radiologist" || userRole === "pathologist"
      ? ["Radiology", "Pathology"]
      : userRole === "pharmacist"
      ? ["Pharmacy"]
      : [
          "Appointment",
          "OPD",
          "IPD",
          "Pharmacy",
          "Pathology",
          "Radiology",
          "Blood Issue",
          "Blood Component Issue",
          "Ambulance",
        ];

  const iconFor = (key) =>
    ({
      Appointment: <Icon.Calendar />,
      OPD: <Icon.Steth />,
      IPD: <Icon.Bed />,
      Pharmacy: <Icon.Pill />,
      Pathology: <Icon.Flask />,
      Radiology: <Icon.Microscope />,
      "Blood Issue": <Icon.Drop />,
      "Blood Component Issue": <Icon.Component />,
      Ambulance: <Icon.Ambulance />,
    }[key]);

  const rollups = useMemo(() => {
    const init = Object.fromEntries(
      moduleKeys.map((k) => [k, { count: 0, amount: 0 }])
    );
    MOCK.forEach((r) => {
      if (init[r.module]) {
        init[r.module].count += 1;
        init[r.module].amount += Number(r.billAmount) || 0;
      }
    });
    return init;
  }, [moduleKeys]);

  const [activeModule, setActiveModule] = useState(moduleKeys[0]);
  const [caseId, setCaseId] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState(""); // NEW
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState(null);

  // date filters
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [monthPick, setMonthPick] = useState("");

  const todayISO = fmtISO(new Date());

  const setQuickRange = (label) => {
    const today = new Date();
    if (label === "Today") {
      const t = fmtISO(today);
      setFromDate(t);
      setToDate(t);
      setMonthPick("");
    } else if (label === "Last 7 days") {
      const start = fmtISO(addDays(today, -6));
      const end = fmtISO(today);
      setFromDate(start);
      setToDate(end);
      setMonthPick("");
    } else if (label === "Last 30 days") {
      const start = fmtISO(addDays(today, -29));
      const end = fmtISO(today);
      setFromDate(start);
      setToDate(end);
      setMonthPick("");
    } else if (label === "This Month") {
      const ym = `${today.getFullYear()}-${String(
        today.getMonth() + 1
      ).padStart(2, "0")}`;
      setMonthPick(ym);
      const { start, end } = monthBounds(ym);
      setFromDate(start);
      setToDate(end);
    }
  };

  const onPickMonth = (ym) => {
    setMonthPick(ym);
    const { start, end } = monthBounds(ym);
    setFromDate(start);
    setToDate(end);
  };

  const enriched = useMemo(
    () =>
      MOCK.map((r) => {
        const paid = sumPayments(r.payments || []);
        const balance = (Number(r.billAmount) || 0) - paid;
        return {
          ...r,
          amountPaid: paid, // override display with breakdown sum
          balance,
          paidBySummary: summarizePayment(r.payments, r.paymentMode),
        };
      }),
    []
  );

  const filtered = useMemo(() => {
    const q = (query || "").trim().toLowerCase();
    return enriched
      .filter((r) => r.module === activeModule)
      .filter((r) => withinRange(r.date, fromDate, toDate))
      .filter((r) => (q === "" ? true : r.caseId.toLowerCase().includes(q)))
      .filter((r) => (!statusFilter ? true : r.paymentStatus === statusFilter))
      .filter((r) => rowMatchesPaymentFilter(r, paymentMethodFilter));
  }, [enriched, activeModule, query, statusFilter, paymentMethodFilter, fromDate, toDate]);

  const totals = useMemo(() => {
    const tBill = filtered.reduce((a, b) => a + (Number(b.billAmount) || 0), 0);
    const tPaid = filtered.reduce((a, b) => a + (Number(b.amountPaid) || 0), 0);
    const tRef = filtered.reduce((a, b) => a + (Number(b.reference?.amount) || 0), 0);
    return { tBill, tPaid, tBal: tBill - tPaid, tRef };
  }, [filtered]);

  const doSearch = () => {
    setSearching(true);
    setTimeout(() => {
      setQuery(caseId);
      setSearching(false);
    }, 420);
  };

  const exportList = () => {
    const header =
      "Case ID,Module,Patient,Patient ID,Date,Bill,Paid,Balance,Status,Payment Breakdown,Txn ID,Ref Name,Ref Amount\n";
    const rows = filtered
      .map((r) => {
        const breakdown = (r.payments || [])
          .map((p) => {
            if (p.type === "TPA")
              return `TPA(${p.tpaName || ""}${p.tpaAuth ? `/${p.tpaAuth}` : ""}) ${p.amount}`;
            if (p.type === "Card")
              return `Card(${p.last4 || ""}) ${p.amount}`;
            if (p.type === "UPI")
              return `UPI(${p.upiRef || ""}) ${p.amount}`;
            return `${p.type} ${p.amount}`;
          })
          .join(" + ");
        return [
          r.caseId,
          r.module,
          r.patientName,
          r.patientId,
          r.date,
          r.billAmount,
          r.amountPaid,
          r.balance,
          r.paymentStatus,
          `"${breakdown || r.paymentMode || "-"}"`,
          r.txnId || "-",
          (r.reference && r.reference.name) || "",
          (r.reference && r.reference.amount) || 0,
        ].join(",");
      })
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    const rangeTag =
      (fromDate || toDate) &&
      `_${fromDate || "start"}_${toDate || "end"}`.replace(/-/g, "");
    a.download = `${activeModule
      .replace(/\s+/g, "_")
      .toLowerCase()}${rangeTag || ""}_${Date.now()}.csv`;
    a.click();
  };

  const exportCalendarSummary = () => {
    const map = new Map();
    filtered.forEach((r) => {
      const key = r.date;
      const cur = map.get(key) || { bill: 0, paid: 0, count: 0, ref: 0 };
      cur.bill += Number(r.billAmount) || 0;
      cur.paid += Number(r.amountPaid) || 0;
      cur.ref += Number(r.reference?.amount) || 0;
      cur.count += 1;
      map.set(key, cur);
    });

    const header = "Date,Count,Total Bill,Total Paid,Balance,Referral Total\n";
    const rows = Array.from(map.entries())
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
      .map(([date, { bill, paid, count, ref }]) =>
        [date, count, bill, paid, bill - paid, ref].join(",")
      )
      .join("\n");

    const blob = new Blob([header + rows], {
      type: "text/csv;charset=utf-8;",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    const rangeTag =
      (fromDate || toDate) &&
      `_${fromDate || "start"}_${toDate || "end"}`.replace(/-/g, "");
    a.download = `${activeModule
      .replace(/\s+/g, "_")
      .toLowerCase()}_calendar_summary${rangeTag || ""}_${Date.now()}.csv`;
    a.click();
  };

  const clearDates = () => {
    setFromDate("");
    setToDate("");
    setMonthPick("");
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4">
      {/* page header */}
      <div className="mb-4 rounded-2xl border bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-slate-900">
              Billing
            </h1>
            <p className="text-sm text-slate-600">
              Search bills, filter by dates/status/payment mode, view payment
              breakdowns (Cash/Card/UPI/TPA), and export.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="rounded-xl border bg-white px-3 py-2 text-xs text-slate-600">
              Total Bill: <b><Counter value={totals.tBill} /></b>
            </div>
            <div className="rounded-xl border bg-white px-3 py-2 text-xs text-slate-600">
              Paid: <b className="text-emerald-700"><Counter value={totals.tPaid} /></b>
            </div>
            <div className="rounded-xl border bg-white px-3 py-2 text-xs text-slate-600">
              Balance:{" "}
              <b className={totals.tBal > 0 ? "text-rose-600" : "text-emerald-700"}>
                <Counter value={totals.tBal} />
              </b>
            </div>
            <div className="rounded-xl border bg-white px-3 py-2 text-xs text-slate-600">
              Ref Total: <b className="text-indigo-700">{inr(totals.tRef)}</b>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .fade-in-up { animation: fadeInUp .45s ease both; }
        @keyframes fadeInUp { from { opacity:.0; transform: translateY(6px) } to { opacity:1; transform: translateY(0) } }
        .pop { animation: pop .25s ease both; }
        @keyframes pop { from { transform: scale(.98) } to { transform: scale(1) } }
        .glow:focus { box-shadow: 0 0 0 3px rgba(59,130,246,.35); }
      `}</style>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* LEFT: Modules */}
        <div className="rounded-2xl border bg-white fade-in-up">
          <div className="border-b px-4 py-3 text-base font-semibold">
            Modules
          </div>
          <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {moduleKeys.map((key) => (
              <ModuleTile
                key={key}
                icon={iconFor(key)}
                title={key}
                active={activeModule === key}
                onClick={() => {
                  setActiveModule(key);
                  setQuery("");
                  setCaseId("");
                  setStatusFilter("");
                  setPaymentMethodFilter("");
                }}
                count={rollups[key].count}
                amount={rollups[key].amount}
              />
            ))}
          </div>
        </div>

        {/* RIGHT: Search + Filters */}
        <div className="rounded-2xl border bg-white fade-in-up">
          <div className="border-b px-4 py-3 text-base font-semibold flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <span>{activeModule} Billing</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={exportList}
                className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-white text-xs hover:bg-slate-800"
                title="Download filtered rows"
              >
                <Icon.Download /> Download Filtered
              </button>
              <button
                onClick={exportCalendarSummary}
                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-white text-xs hover:bg-blue-700"
                title="Download daily totals in range"
              >
                <Icon.Export /> Calendar Summary
              </button>
            </div>
          </div>

          {/* search & filters */}
          <div className="px-4 py-4 space-y-4">
            {/* Search + Status + Payment Mode */}
            <div className="flex flex-col xl:flex-row gap-3 xl:items-center">
              <div className="flex-1 flex gap-2">
                <label className="text-sm text-slate-600 w-20 md:w-auto md:mr-2 md:pt-2">
                  Case ID<span className="text-rose-600">*</span>
                </label>
                <input
                  value={caseId}
                  onChange={(e) => setCaseId(e.target.value)}
                  placeholder="Enter Case ID"
                  className="w-full md:w-72 rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 glow"
                />
                <button
                  onClick={doSearch}
                  className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-white text-sm transition ${
                    searching
                      ? "bg-blue-400 cursor-wait"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                  disabled={searching}
                >
                  <Icon.Search /> {searching ? "Searching..." : "Search"}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">Status</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-md border px-3 py-2 text-sm"
                >
                  <option value="">All</option>
                  <option>Paid</option>
                  <option>Partially Paid</option>
                  <option>Unpaid</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">Payment</span>
                <select
                  value={paymentMethodFilter}
                  onChange={(e) => setPaymentMethodFilter(e.target.value)}
                  className="rounded-md border px-3 py-2 text-sm"
                >
                  <option value="">All</option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="UPI">UPI</option>
                  <option value="TPA">TPA</option>
                  <option value="Mixed">Mixed</option>
                </select>
              </div>
            </div>

            {/* Date Range + Quick picks */}
            <div className="rounded-xl border bg-slate-50 p-3">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 items-end">
                {/* From */}
                <div className="space-y-1">
                  <label className="block text-xs text-slate-600">From Date</label>
                  <div className="relative">
                    <span className="absolute left-2 top-2.5 text-slate-500">
                      <Icon.CalendarSm />
                    </span>
                    <input
                      type="date"
                      value={fromDate}
                      max={toDate || todayISO}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="h-10 w-full rounded-md border px-9 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  </div>
                </div>

                {/* To */}
                <div className="space-y-1">
                  <label className="block text-xs text-slate-600">To Date</label>
                  <div className="relative">
                    <span className="absolute left-2 top-2.5 text-slate-500">
                      <Icon.CalendarSm />
                    </span>
                    <input
                      type="date"
                      value={toDate}
                      min={fromDate || ""}
                      max={todayISO}
                      onChange={(e) => setToDate(e.target.value)}
                      className="h-10 w-full rounded-md border px-9 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  </div>
                </div>

                {/* Quick Range */}
                <div className="space-y-1 xl:col-span-2">
                  <label className="block text-xs text-slate-600">Quick Range</label>
                  <div className="flex flex-wrap gap-2">
                    {["Today", "Last 7 days", "Last 30 days", "This Month"].map((lbl) => (
                      <button
                        key={lbl}
                        onClick={() => setQuickRange(lbl)}
                        className="h-10 rounded-md border px-3 text-xs bg-white hover:bg-blue-50 hover:border-blue-300"
                      >
                        {lbl}
                      </button>
                    ))}
                    <button
                      onClick={clearDates}
                      className="h-10 rounded-md border px-3 text-xs bg-white text-slate-600 hover:bg-slate-100"
                      title="Clear date filters"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>

              {(fromDate || toDate) && (
                <div className="mt-3 text-xs text-slate-600">
                  Showing results{" "}
                  <span className="font-medium">
                    {fromDate ? `from ${fromDate}` : "from start"}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {toDate ? toDate : "today"}
                  </span>
                  .
                </div>
              )}
            </div>
          </div>

          {/* totals strip */}
          <div className="px-4 pb-3 flex flex-wrap gap-3">
            <div className="px-3 py-2 rounded-lg border bg-slate-50 text-sm">
              <span className="text-slate-500 mr-2">Total Bill</span>
              <b><Counter value={totals.tBill} /></b>
            </div>
            <div className="px-3 py-2 rounded-lg border bg-slate-50 text-sm">
              <span className="text-slate-500 mr-2">Paid</span>
              <b className="text-emerald-700"><Counter value={totals.tPaid} /></b>
            </div>
            <div className="px-3 py-2 rounded-lg border bg-slate-50 text-sm">
              <span className="text-slate-500 mr-2">Balance</span>
              <b className={totals.tBal > 0 ? "text-rose-600" : "text-emerald-700"}>
                <Counter value={totals.tBal} />
              </b>
            </div>
            <div className="px-3 py-2 rounded-lg border bg-slate-50 text-sm">
              <span className="text-slate-500 mr-2">Referral</span>
              <b className="text-indigo-700">{inr(totals.tRef)}</b>
            </div>
          </div>

          {/* results table */}
          <div className="overflow-x-auto">
            <table className="min-w-[1080px] w-full divide-y divide-gray-200">
              <thead className="bg-slate-100 text-slate-700 text-xs uppercase">
                <tr className="text-left">
                  <th className="px-4 py-3">Case ID</th>
                  <th className="px-4 py-3">Patient</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Module</th>
                  <th className="px-4 py-3">Bill</th>
                  <th className="px-4 py-3">Paid</th>
                  <th className="px-4 py-3">Balance</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Paid By</th>
                  <th className="px-4 py-3">Ref (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {searching ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      {[...Array(10)].map((__, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="h-3 w-24 bg-slate-200 rounded" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={10}
                      className="px-4 py-8 text-center text-sm text-slate-500"
                    >
                      {query || statusFilter || paymentMethodFilter || fromDate || toDate
                        ? `No records for ${activeModule}${
                            query ? ` with Case ID "${query}"` : ""
                          }${
                            statusFilter ? ` and status "${statusFilter}"` : ""
                          }${
                            paymentMethodFilter ? ` and payment "${paymentMethodFilter}"` : ""
                          }${
                            fromDate || toDate
                              ? ` in date range ${fromDate || "start"} - ${toDate || "today"}`
                              : ""
                          }.` 
                        : `Search a Case ID or use filters.`}
                    </td>
                  </tr>
                ) : (
                  filtered.map((r, idx) => (
                    <tr
                      key={`${r.module}-${r.caseId}`}
                      className="hover:bg-slate-50 cursor-pointer fade-in-up"
                      style={{ animationDelay: `${idx * 40}ms` }}
                      onClick={() => setSelected(r)}
                      title="Click for details"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-slate-800">
                        {r.caseId}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700">
                        {r.patientName}{" "}
                        <span className="text-slate-400">({r.patientId})</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700">
                        {r.date}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-700">
                        {r.module}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">
                        {inr(r.billAmount)}
                      </td>
                      <td className="px-4 py-3 text-sm">{inr(r.amountPaid)}</td>
                      <td
                        className={`px-4 py-3 text-sm ${
                          r.balance > 0 ? "text-rose-600" : "text-emerald-700"
                        }`}
                      >
                        {inr(r.balance)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="inline-flex items-center gap-2">
                          <span
                            className={`inline-block h-2 w-2 rounded-full ${
                              r.paymentStatus === "Paid"
                                ? "bg-emerald-500"
                                : r.paymentStatus === "Partially Paid"
                                ? "bg-amber-500 animate-pulse"
                                : r.paymentStatus === "Unpaid"
                                ? "bg-rose-500 animate-pulse"
                                : "bg-slate-400"
                            }`}
                          />
                          <PayBadge value={r.paymentStatus} />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-700 max-w-[280px] truncate" title={r.paidBySummary}>
                        {r.paidBySummary}
                      </td>
                      <td className="px-4 py-3 text-sm text-indigo-700">
                        {inr(r.reference?.amount || 0)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 text-xs text-slate-500">
            * Demo data uses realistic payment mixes (Cash / Card / UPI / TPA cashless)
            and referral commissions. Replace with API responses in production.
          </div>
        </div>
      </div>

      <SlideOver
        open={!!selected}
        onClose={() => setSelected(null)}
        record={selected || {}}
      />
    </div>
  );
};

export default Billing;
