// PatientRecords.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  FiSearch,
  FiFilter,
  FiUsers,
  FiUser,
  FiCalendar,
  FiChevronRight,
  FiDownload,
  FiUpload,
  FiFileText,
  FiCreditCard,
  FiTrendingUp,
  FiBriefcase,
  FiActivity,
  FiCheckCircle,
  FiAlertCircle,
  FiPlusCircle,
  FiTrash2,
  FiFolder,
  FiPackage,
  FiThermometer,
} from "react-icons/fi";

/* ======================================================
   Lightweight (lazy) dependency: jsPDF
====================================================== */
let jsPDFRef = null;
const lazyLoadJsPDF = async () => {
  if (!jsPDFRef) {
    const mod = await import("jspdf");
    jsPDFRef = mod.jsPDF || mod.default?.jsPDF || mod.default;
  }
  return jsPDFRef;
};

/* ======================================================
   Tiny helpers
====================================================== */
const HOSPITAL = {
  name: "Sunrise Multispeciality Hospital",
  tagline: "Compassion • Care • Excellence",
  address: "Plot 12, Tech Park Road, Gachibowli, Hyderabad, 500032",
  phone: "+91 40 4000 1234",
  email: "billing@sunrisehosp.in",
  gstin: "36ABCDE1234F1Z5",
};

const cls = (...xs) => xs.filter(Boolean).join(" ");
const inputBase =
  "mt-1 block w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200";
const btnBase =
  "inline-flex items-center justify-center rounded-xl px-3.5 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2";
const btnBlue = `${btnBase} bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500`;
const btnGray = `${btnBase} bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-400`;
const btnGreen = `${btnBase} bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500`;
const btnRed = `${btnBase} bg-red-600 text-white hover:bg-red-700 focus:ring-red-500`;

const currency = (n) =>
  (Number(n) || 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });

const Badge = ({ children, tone = "slate" }) => {
  const toneMap = {
    slate: "bg-slate-100 text-slate-700",
    blue: "bg-blue-100 text-blue-700",
    green: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-800",
    red: "bg-red-100 text-red-700",
    violet: "bg-violet-100 text-violet-700",
    indigo: "bg-indigo-100 text-indigo-700",
  };
  return (
    <span className={cls("inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium", toneMap[tone])}>
      {children}
    </span>
  );
};

const Stat = ({ icon, label, value, hint, tone = "blue" }) => {
  const toneMap = {
    blue: "from-blue-50 to-blue-100 text-blue-900",
    green: "from-emerald-50 to-emerald-100 text-emerald-900",
    amber: "from-amber-50 to-amber-100 text-amber-900",
    slate: "from-slate-50 to-slate-100 text-slate-900",
  };
  return (
    <div className={cls("rounded-2xl p-4 bg-gradient-to-br shadow-sm", toneMap[tone])}>
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-white shadow-sm">{icon}</div>
        <div className="min-w-0">
          <div className="text-xs opacity-70">{label}</div>
          <div className="text-lg font-bold truncate">{value}</div>
          {hint && <div className="text-[11px] opacity-60">{hint}</div>}
        </div>
      </div>
    </div>
  );
};

const SectionHeader = ({ icon, title, actions }) => (
  <div className="flex items-center justify-between mb-3">
    <div className="flex items-center gap-2">
      <div className="p-2 rounded-lg bg-gray-100 text-gray-700">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    </div>
    <div className="flex items-center gap-2">{actions}</div>
  </div>
);

/* ======================================================
   Static data (FULL HISTORY for 3 patients)
   - Each appointment includes pharmacy, labs, others, IPD, police case, discharge, billing
====================================================== */

const mockAppointments = [
  /* -------------------- Patient 1: Aman Verma -------------------- */
  {
    id: 101,
    appointment_no: "APT-2025-0001",
    scheduled_for: "2025-02-05T10:30:00+05:30",
    status: "confirmed",
    priority: "Normal",
    slot_label: "Morning",
    patient_id: "P001",
    patient_name: "Aman Verma",
    patient_phone: "98XXXX1122",
    patient_age: 34,
    department: "General Medicine",
    doctor_id: "D-102",
    doctor_name: "Dr. Kavya Rao",
    payment_mode: "Cash",
    doctor_fee: 600,
    discount_pct: 0,
    vitals: { bloodPressure: "118/78", heartRate: "72", temperature: "36.7", weight: "74" },
    caseStudies: ["Cough and mild fever. No prior comorbidities. Vaccination status up to date."],
    prescriptions: ["Tab Azithromycin 500mg OD x3 days", "Syrup CoughGuard 10ml TID x5 days"],
    diagnosis: ["Upper Respiratory Tract Infection"],
    policeCase: { enabled: false },
    ipd: { ward: "", bed: "", daily: [] },
    discharge: {
      diagnosisSummary: "URTI managed in OPD.",
      clinicalFindings: "Mild throat erythema, lungs clear.",
      courseInHospital: "OPD evaluation only.",
      treatmentGiven: "Antibiotics, antitussives.",
      adviceOnDischarge: "Hydration, steam inhalation, review if fever persists.",
      followUpDate: "2025-02-12",
    },
    billing: {
      pharmacy: [
        { item: "Azithromycin 500mg", qty: 3, amount: 180 },
        { item: "CoughGuard Syrup", qty: 1, amount: 120 },
      ],
      labs: [{ test: "CBC", amount: 500 }],
      others: [{ item: "Consultation Fee", amount: 600 }],
      paymentMode: "Cash",
      tpaProvider: "",
      split: [{ mode: "Cash", amount: 1400 }],
      cleared: true,
      confirmed: true,
    },
  },
  {
    id: 102,
    appointment_no: "APT-2025-0039",
    scheduled_for: "2025-03-12T09:15:00+05:30",
    status: "confirmed",
    priority: "High",
    slot_label: "Morning",
    patient_id: "P001",
    patient_name: "Aman Verma",
    patient_phone: "98XXXX1122",
    patient_age: 34,
    department: "General Surgery",
    doctor_id: "D-201",
    doctor_name: "Dr. Arjun Menon",
    payment_mode: "Split",
    doctor_fee: 1200,
    discount_pct: 5,
    vitals: { bloodPressure: "120/80", heartRate: "76", temperature: "36.6", weight: "73" },
    caseStudies: ["Appendicitis suspected. Advised admission for observation and surgery."],
    prescriptions: ["IV fluids", "Inj Ceftriaxone 1g BD"],
    diagnosis: ["Acute Appendicitis"],
    policeCase: { enabled: false },
    ipd: {
      ward: "Surgery",
      bed: "B-12",
      daily: [
        { date: "2025-03-12", prescription: "NPO, IV fluids, antibiotics", treatment: "Observation", notes: "Pain controlled" },
        { date: "2025-03-13", prescription: "Continue antibiotics", treatment: "Laparoscopic Appendectomy", notes: "Uneventful" },
        { date: "2025-03-14", prescription: "Oral diet advance", treatment: "Post-op care", notes: "Mobilised" },
      ],
    },
    discharge: {
      diagnosisSummary: "Acute appendicitis – Laparoscopic appendectomy.",
      clinicalFindings: "Localized tenderness, ultrasound suggestive.",
      courseInHospital: "Admitted 2 days, surgery successful.",
      treatmentGiven: "Appendectomy, IV antibiotics, analgesics.",
      adviceOnDischarge: "Wound care, avoid heavy lifting, review after 1 week.",
      followUpDate: "2025-03-21",
    },
    billing: {
      pharmacy: [
        { item: "Inj Ceftriaxone 1g", qty: 4, amount: 1200 },
        { item: "Analgesics (post-op)", qty: 6, amount: 900 },
      ],
      labs: [
        { test: "Ultrasound Abdomen", amount: 1500 },
        { test: "LFT", amount: 700 },
      ],
      others: [
        { item: "Surgery Charges", amount: 22000 },
        { item: "OT Charges", amount: 6000 },
        { item: "Room Rent (2 days)", amount: 8000 },
        { item: "Nursing", amount: 1500 },
      ],
      paymentMode: "Split",
      tpaProvider: "MediAssist",
      split: [
        { mode: "Cash", amount: 12000 },
        { mode: "TPA", amount: 22000 },
      ],
      cleared: false,
      confirmed: true,
    },
  },
  {
    id: 103,
    appointment_no: "APT-2025-0104",
    scheduled_for: "2025-04-20T16:10:00+05:30",
    status: "confirmed",
    priority: "Normal",
    slot_label: "Evening",
    patient_id: "P001",
    patient_name: "Aman Verma",
    patient_phone: "98XXXX1122",
    patient_age: 34,
    department: "Radiology",
    doctor_id: "D-305",
    doctor_name: "Dr. Neha Kulkarni",
    payment_mode: "Card",
    doctor_fee: 0,
    discount_pct: 0,
    vitals: { bloodPressure: "116/77", heartRate: "70", temperature: "36.6", weight: "73" },
    caseStudies: ["Post-op review. Rule out complications."],
    prescriptions: ["Pain control PRN"],
    diagnosis: ["Post-operative review"],
    policeCase: { enabled: false },
    ipd: { ward: "", bed: "", daily: [] },
    discharge: {
      diagnosisSummary: "Post-op follow up. Stable.",
      clinicalFindings: "Wound healthy.",
      courseInHospital: "Day care CT scan.",
      treatmentGiven: "Analgesics PRN.",
      adviceOnDischarge: "Regular activity after 2 weeks.",
      followUpDate: "2025-05-02",
    },
    billing: {
      pharmacy: [{ item: "Dressing pack", qty: 1, amount: 200 }],
      labs: [{ test: "CT Abdomen", amount: 4500 }],
      others: [{ item: "Radiologist Consultation", amount: 800 }],
      paymentMode: "Card",
      tpaProvider: "",
      split: [{ mode: "Card", amount: 5500 }],
      cleared: true,
      confirmed: true,
    },
  },

  /* -------------------- Patient 2: Nisha Rao -------------------- */
  {
    id: 201,
    appointment_no: "APT-2025-0022",
    scheduled_for: "2025-01-18T11:00:00+05:30",
    status: "confirmed",
    priority: "Normal",
    slot_label: "Morning",
    patient_id: "P002",
    patient_name: "Nisha Rao",
    patient_phone: "97XXXX7788",
    patient_age: 28,
    department: "Obstetrics & Gynaecology",
    doctor_id: "D-410",
    doctor_name: "Dr. Meera Iyer",
    payment_mode: "TPA",
    doctor_fee: 700,
    discount_pct: 0,
    vitals: { bloodPressure: "110/70", heartRate: "78", temperature: "36.6", weight: "62" },
    caseStudies: ["First trimester check-up. Mild nausea."],
    prescriptions: ["Folic Acid 5mg OD", "Doxylamine 10mg HS"],
    diagnosis: ["Antenatal (1st Trimester)"],
    policeCase: { enabled: false },
    ipd: { ward: "", bed: "", daily: [] },
    discharge: {
      diagnosisSummary: "Routine antenatal check-up.",
      clinicalFindings: "Vitals normal.",
      courseInHospital: "OPD visit.",
      treatmentGiven: "Supplements prescribed.",
      adviceOnDischarge: "Dietary advice, follow-up in 4 weeks.",
      followUpDate: "2025-02-15",
    },
    billing: {
      pharmacy: [
        { item: "Folic Acid", qty: 30, amount: 150 },
        { item: "Doxylamine", qty: 10, amount: 120 },
      ],
      labs: [{ test: "Early Pregnancy Scan", amount: 1200 }],
      others: [{ item: "Consultation Fee", amount: 700 }],
      paymentMode: "TPA",
      tpaProvider: "Star Health",
      split: [{ mode: "TPA", amount: 2170 }],
      cleared: false,
      confirmed: true,
    },
  },
  {
    id: 202,
    appointment_no: "APT-2025-0076",
    scheduled_for: "2025-03-02T20:40:00+05:30",
    status: "confirmed",
    priority: "High",
    slot_label: "Night",
    patient_id: "P002",
    patient_name: "Nisha Rao",
    patient_phone: "97XXXX7788",
    patient_age: 28,
    department: "Emergency",
    doctor_id: "D-999",
    doctor_name: "Dr. Emergency Team",
    payment_mode: "TPA",
    doctor_fee: 0,
    discount_pct: 0,
    vitals: { bloodPressure: "112/72", heartRate: "84", temperature: "37.0", weight: "62" },
    caseStudies: ["Minor road traffic accident. Superficial lacerations."],
    prescriptions: ["Tetanus toxoid", "Analgesics"],
    diagnosis: ["Superficial lacerations (RTA)"],
    policeCase: {
      enabled: true,
      reason: "RTA - mandatory intimation",
      incidentType: "Road Accident",
      firNumber: "FIR/2025/1764",
      station: "Gachibowli PS",
      officer: "SI P. Kumar",
      notes: "Patient accompanied by spouse.",
      attachments: [],
    },
    ipd: {
      ward: "Emergency Observation",
      bed: "ER-07",
      daily: [
        { date: "2025-03-02", prescription: "Dressings, TT injection", treatment: "Observation 6 hrs", notes: "Stable" },
      ],
    },
    discharge: {
      diagnosisSummary: "Superficial lacerations; no head injury.",
      clinicalFindings: "Neuro intact; no fractures.",
      courseInHospital: "Observed; discharged the same day.",
      treatmentGiven: "Wound dressing; TT; analgesics.",
      adviceOnDischarge: "Wound care; red flags explained.",
      followUpDate: "2025-03-05",
    },
    billing: {
      pharmacy: [
        { item: "TT Injection", qty: 1, amount: 250 },
        { item: "Dressing Material", qty: 2, amount: 300 },
      ],
      labs: [{ test: "X-Ray Forearm", amount: 800 }],
      others: [{ item: "ER Observation", amount: 1500 }],
      paymentMode: "TPA",
      tpaProvider: "Star Health",
      split: [{ mode: "TPA", amount: 2850 }],
      cleared: true,
      confirmed: true,
    },
  },

  /* -------------------- Patient 3: Rakesh Singh -------------------- */
  {
    id: 301,
    appointment_no: "APT-2025-0044",
    scheduled_for: "2025-02-22T15:20:00+05:30",
    status: "pending",
    priority: "Normal",
    slot_label: "Afternoon",
    patient_id: "P003",
    patient_name: "Rakesh Singh",
    patient_phone: "96XXXX3344",
    patient_age: 56,
    department: "Cardiology",
    doctor_id: "D-520",
    doctor_name: "Dr. Aditi Nair",
    payment_mode: "Split",
    doctor_fee: 1000,
    discount_pct: 0,
    vitals: { bloodPressure: "138/86", heartRate: "82", temperature: "36.8", weight: "80" },
    caseStudies: ["Chest discomfort on exertion; h/o HTN."],
    prescriptions: ["Tab Aspirin 75mg OD", "Tab Atorvastatin 20mg HS"],
    diagnosis: ["Stable angina - evaluation"],
    policeCase: { enabled: false },
    ipd: {
      ward: "CCU",
      bed: "CC-04",
      daily: [
        { date: "2025-02-22", prescription: "Aspirin, statin", treatment: "ECG, Serial Trop", notes: "Admitted for obs." },
        { date: "2025-02-23", prescription: "Continue meds", treatment: "TMT", notes: "TMT borderline" },
      ],
    },
    discharge: {
      diagnosisSummary: "Stable angina; advised medical management & lifestyle.",
      clinicalFindings: "BP mildly elevated; ECG non-specific changes.",
      courseInHospital: "24h observation; TMT borderline.",
      treatmentGiven: "Aspirin, statin started.",
      adviceOnDischarge: "Low-fat diet; brisk walk; follow up in 2 weeks.",
      followUpDate: "2025-03-08",
    },
    billing: {
      pharmacy: [
        { item: "Aspirin 75mg", qty: 30, amount: 180 },
        { item: "Atorvastatin 20mg", qty: 30, amount: 260 },
      ],
      labs: [
        { test: "ECG", amount: 400 },
        { test: "Troponin-I (serial)", amount: 900 },
        { test: "TMT", amount: 2500 },
      ],
      others: [
        { item: "Cardiologist Consultation", amount: 1000 },
        { item: "CCU Bed (1 day)", amount: 3500 },
      ],
      paymentMode: "Split",
      tpaProvider: "MediBuddy",
      split: [
        { mode: "Cash", amount: 2000 },
        { mode: "TPA", amount: 5740 },
      ],
      cleared: false,
      confirmed: true,
    },
  },
];

/* ======================================================
   Storage helpers (attachments & operations per patient)
====================================================== */
const FILES_KEY = "__patient_files__";
const OPS_KEY = "__patient_ops__";

const readLS = (key, def = {}) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : def;
  } catch {
    return def;
  }
};
const writeLS = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

// seed sample downloadable data URLs
const asDataUrl = (filename, text) =>
  `data:text/plain;charset=utf-8,${encodeURIComponent(`File: ${filename}\n\n${text}`)}`;

// Default sample files per patient
const DEFAULT_FILES = {
  P001: [
    { name: "P001_ct_report.txt", size: 2048, type: "text/plain", uploadedAt: "2025-04-20T17:05:00+05:30", url: asDataUrl("P001_ct_report.txt", "CT Abdomen: Normal post-op changes.") },
    { name: "P001_discharge_note.txt", size: 1536, type: "text/plain", uploadedAt: "2025-03-14T18:10:00+05:30", url: asDataUrl("P001_discharge_note.txt", "Appendectomy discharge summary snapshot.") },
  ],
  P002: [
    { name: "P002_rta_police_intimation.txt", size: 1792, type: "text/plain", uploadedAt: "2025-03-02T22:10:00+05:30", url: asDataUrl("P002_rta_police_intimation.txt", "Intimation sent to police station.") },
  ],
  P003: [
    { name: "P003_tmt_summary.txt", size: 1200, type: "text/plain", uploadedAt: "2025-02-23T14:00:00+05:30", url: asDataUrl("P003_tmt_summary.txt", "TMT borderline. Advise conservative management.") },
  ],
};

// Default operations per patient
const DEFAULT_OPS = {
  P001: [
    { id: 9001, date: "2025-03-13", type: "Laparoscopic Appendectomy", surgeon: "Dr. Arjun Menon", notes: "Uneventful; minimal blood loss.", cost: "28000" },
  ],
  P002: [],
  P003: [],
};

/* ======================================================
   Transform Appointments -> Patients
====================================================== */
function buildPatients(appointments) {
  const byId = new Map();
  for (const a of appointments) {
    const pid = a.patient_id || `P-${(a.patient_name || "Unknown").replace(/\s+/g, "_")}`;
    const rec = byId.get(pid) || {
      patient_id: pid,
      patient_name: a.patient_name || "Unknown",
      patient_phone: a.patient_phone || a.phone || "",
      patient_age: a.patient_age || "",
      appointments: [],
    };
    rec.appointments.push(a);
    byId.set(pid, rec);
  }
  const list = Array.from(byId.values());

  // compute rollups
  for (const p of list) {
    let pharmacy = 0, labs = 0, others = 0, grand = 0, patientPaid = 0, tpa = 0, outstanding = 0;
    let clearedCount = 0;
    for (const a of p.appointments) {
      const b = a.billing || {};
      const totP = (b.pharmacy || []).reduce((s, r) => s + (Number(r.amount) || 0), 0);
      const totL = (b.labs || []).reduce((s, r) => s + (Number(r.amount) || 0), 0);
      const totO = (b.others || []).reduce((s, r) => s + (Number(r.amount) || 0), 0);
      const g = totP + totL + totO;

      const mode = b.paymentMode || a.payment_mode || "Cash";
      const split = b.split || [];
      const patientPart =
        mode === "Split"
          ? split.filter((x) => x.mode !== "TPA").reduce((s, r) => s + (Number(r.amount) || 0), 0)
          : mode === "Cash" || mode === "Card"
          ? g
          : 0;
      const tpaPart =
        mode === "TPA"
          ? g
          : mode === "Split"
          ? split.filter((x) => x.mode === "TPA").reduce((s, r) => s + (Number(r.amount) || 0), 0)
          : 0;

      const out = Math.max(0, g - (patientPart + tpaPart));

      pharmacy += totP;
      labs += totL;
      others += totO;
      grand += g;
      patientPaid += patientPart;
      tpa += tpaPart;
      outstanding += out;
      if (b.cleared) clearedCount++;
    }

    p.rollup = {
      totalAppointments: p.appointments.length,
      pharmacy, labs, others, grand, patientPaid, tpa, outstanding,
      clearedCount,
    };
  }
  return list.sort((a, b) => (a.patient_name || "").localeCompare(b.patient_name || ""));
}

/* ======================================================
   Export helpers
====================================================== */
const exportPatientsCSV = (patients) => {
  const header = [
    "Patient ID","Name","Phone","Appointments","Pharmacy","Labs","Others","Grand Total","Paid by Patient","TPA Portion","Outstanding",
  ];
  const rows = patients.map((p) => [
    p.patient_id,
    p.patient_name,
    p.patient_phone || "",
    p.rollup.totalAppointments,
    p.rollup.pharmacy,
    p.rollup.labs,
    p.rollup.others,
    p.rollup.grand,
    p.rollup.patientPaid,
    p.rollup.tpa,
    p.rollup.outstanding,
  ]);
  const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `patients_${Date.now()}.csv`;
  a.click();
};

const exportPatientDetailCSV = (patient) => {
  const header = [
    "Appt No","Date","Department","Doctor","Pharmacy","Labs","Others","Grand Total","Payment Mode","TPA Provider","Cleared",
  ];
  const rows = patient.appointments.map((a) => {
    const b = a.billing || {};
    const totP = (b.pharmacy || []).reduce((s, r) => s + (Number(r.amount) || 0), 0);
    const totL = (b.labs || []).reduce((s, r) => s + (Number(r.amount) || 0), 0);
    const totO = (b.others || []).reduce((s, r) => s + (Number(r.amount) || 0), 0);
    const g = totP + totL + totO;
    return [
      a.appointment_no || "",
      a.scheduled_for ? new Date(a.scheduled_for).toLocaleString() : "",
      a.department || "",
      a.doctor_name || "",
      totP,
      totL,
      totO,
      g,
      b.paymentMode || a.payment_mode || "Cash",
      b.tpaProvider || "",
      b.cleared ? "Yes" : "No",
    ];
  });
  const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${patient.patient_id}_details_${Date.now()}.csv`;
  a.click();
};

/* ======================================================
   Per-appointment document generators (reused)
====================================================== */
const dischargeHTML = (appt, ipd = {}, discharge = {}, totals) => {
  const patient = `${appt?.patient_name || "-"} (${appt?.patient_id || "-"})`;
  const doctor = `${appt?.doctor_name || "-"} (${appt?.doctor_id || "-"})`;
  const department = appt?.department || "-";
  const wardBed = `${ipd?.ward || "-"} / ${ipd?.bed || "-"}`;

  return `
  <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset="utf-8"><title>Discharge Summary</title></head>
    <body>
      <h2 style="margin:0;">${HOSPITAL.name}</h2>
      <div style="font-size:12px;margin-bottom:8px;">${HOSPITAL.tagline}</div>
      <div style="font-size:12px;">${HOSPITAL.address}</div>
      <div style="font-size:12px;">Phone: ${HOSPITAL.phone} | Email: ${HOSPITAL.email}</div>
      <div style="font-size:12px;margin-bottom:12px;">GSTIN: ${HOSPITAL.gstin}</div>
      <hr/>
      <h3>Discharge Summary</h3>
      <p><b>Patient:</b> ${patient}</p>
      <p><b>Doctor:</b> ${doctor}</p>
      <p><b>Department:</b> ${department}</p>
      <p><b>Ward/Bed:</b> ${wardBed}</p>

      <h4>Diagnosis Summary</h4><p>${(discharge.diagnosisSummary || "-").replace(/\n/g,"<br/>")}</p>
      <h4>Clinical Findings</h4><p>${(discharge.clinicalFindings || "-").replace(/\n/g,"<br/>")}</p>
      <h4>Course in Hospital</h4><p>${(discharge.courseInHospital || "-").replace(/\n/g,"<br/>")}</p>
      <h4>Treatment Given</h4><p>${(discharge.treatmentGiven || "-").replace(/\n/g,"<br/>")}</p>
      <h4>Advice on Discharge</h4><p>${(discharge.adviceOnDischarge || "-").replace(/\n/g,"<br/>")}</p>
      <p><b>Follow-up Date:</b> ${discharge.followUpDate || "-"}</p>

      <h4>Billing Summary</h4>
      <p>Pharmacy: ${currency(totals.totP)}<br/>
         Labs: ${currency(totals.totL)}<br/>
         Others: ${currency(totals.totO)}<br/>
         <b>TOTAL:</b> ${currency(totals.g)}</p>

      <br/><br/>
      <div style="font-size:12px;">This is a computer-generated document and does not require a signature.</div>
    </body>
  </html>`;
};

const downloadDischargeDocForAppointment = (appt) => {
  const b = appt.billing || {};
  const totals = {
    totP: (b.pharmacy || []).reduce((s, r) => s + (Number(r.amount) || 0), 0),
    totL: (b.labs || []).reduce((s, r) => s + (Number(r.amount) || 0), 0),
    totO: (b.others || []).reduce((s, r) => s + (Number(r.amount) || 0), 0),
  };
  totals.g = totals.totP + totals.totL + totals.totO;

  const html = dischargeHTML(appt, appt.ipd || {}, appt.discharge || {}, totals);
  const blob = new Blob([html], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${appt?.patient_id || "patient"}_${appt?.appointment_no || "appt"}_discharge.doc`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
};

const downloadInvoicePDFFromAppointment = async (appt) => {
  const b = appt.billing || {};
  const totP = (b.pharmacy || []).reduce((s, r) => s + (Number(r.amount) || 0), 0);
  const totL = (b.labs || []).reduce((s, r) => s + (Number(r.amount) || 0), 0);
  const totO = (b.others || []).reduce((s, r) => s + (Number(r.amount) || 0), 0);
  const g = totP + totL + totO;

  const mode = b.paymentMode || appt.payment_mode || "Cash";
  const split = b.split || [];
  const patientPart =
    mode === "Split"
      ? split.filter((x) => x.mode !== "TPA").reduce((s, r) => s + (Number(r.amount) || 0), 0)
      : mode === "Cash" || mode === "Card"
      ? g
      : 0;
  const tpaPart =
    mode === "TPA"
      ? g
      : mode === "Split"
      ? split.filter((x) => x.mode === "TPA").reduce((s, r) => s + (Number(r.amount) || 0), 0)
      : 0;
  const outstanding = Math.max(0, g - (patientPart + tpaPart));

  const jsPDF = await lazyLoadJsPDF();
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const marginX = 40;
  let y = 50;

  const add = (text, size = 11, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    doc.text(String(text), marginX, y);
    y += size + 6;
  };

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(HOSPITAL.name, marginX, y);
  y += 18;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  add(HOSPITAL.tagline);
  add(HOSPITAL.address);
  add(`Phone: ${HOSPITAL.phone}   Email: ${HOSPITAL.email}`);
  add(`GSTIN: ${HOSPITAL.gstin}`);
  y += 6; doc.line(marginX, y, 555, y); y += 16;

  doc.setFont("helvetica", "bold"); doc.setFontSize(14);
  doc.text("Hospital Invoice", marginX, y); y += 20;
  doc.setFont("helvetica", "normal"); doc.setFontSize(11);
  add(`Invoice Date: ${new Date().toLocaleDateString()}`);
  add(`Appointment No: ${appt?.appointment_no || "-"}`);
  add(`Patient: ${appt?.patient_name || "-"} (${appt?.patient_id || "-"})`);
  add(`Doctor: ${appt?.doctor_name || "-"} (${appt?.doctor_id || "-"})`);
  add(`Department: ${appt?.department || "-"}`);
  y += 8;

  doc.setFont("helvetica", "bold");
  doc.text("Charges", marginX, y); y += 16;
  doc.setFont("helvetica", "normal");
  add(`Pharmacy: ${currency(totP)}`);
  add(`Labs: ${currency(totL)}`);
  add(`Others: ${currency(totO)}`);
  doc.setFont("helvetica", "bold");
  add(`Grand Total: ${currency(g)}`, 12, true);

  y += 8; doc.line(marginX, y, 555, y); y += 16;
  doc.setFont("helvetica", "bold"); doc.text("Payment Details", marginX, y); y += 16;

  doc.setFont("helvetica", "normal");
  add(`Payment Mode: ${mode}`);
  if (mode === "TPA") add(`TPA Provider: ${b.tpaProvider || "-"}`);
  if (mode === "Split") {
    add("Split Payments:");
    split.forEach((s) => add(` - ${s.mode}: ${currency(s.amount || 0)}`));
  }

  y += 8; doc.setFont("helvetica", "bold");
  add(`Paid by Patient: ${currency(patientPart)}`, 12, true);
  add(`To be Settled by TPA: ${currency(tpaPart)}`, 12, true);
  add(`Outstanding: ${currency(outstanding)}`, 12, true);

  y += 8; doc.line(marginX, y, 555, y); y += 16;
  add(`Payment Status: ${b.cleared ? "Cleared" : "Pending"}`);
  y += 12; doc.setFontSize(9);
  doc.text("Note: This is a computer-generated invoice. For queries, contact billing@sunrisehosp.in", marginX, y);

  doc.save(`${appt?.patient_id || "patient"}_${appt?.appointment_no || "invoice"}.pdf`);
};

/* ======================================================
   Drawer (patient detail)
====================================================== */
const Drawer = ({ open, onClose, children, title, actions }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="w-full max-w-4xl h-full bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="font-semibold truncate">{title}</div>
          <div className="flex items-center gap-2">
            {actions}
            <button onClick={onClose} className="text-xl leading-none">×</button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  );
};

/* ======================================================
   Main Component
====================================================== */
export default function PatientRecords() {
  const [filesByPatient, setFilesByPatient] = useState(() => readLS(FILES_KEY, DEFAULT_FILES));
  const [opsByPatient, setOpsByPatient] = useState(() => readLS(OPS_KEY, DEFAULT_OPS));

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modeFilter, setModeFilter] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selected, setSelected] = useState(null); // patient record
  const [tab, setTab] = useState("overview"); // overview | history | pharmacy | labs | ipd | operations | discharge | files

  const patientsRaw = useMemo(() => buildPatients(mockAppointments || []), []);
  const patients = useMemo(() => {
    const f = patientsRaw.filter((p) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        p.patient_id.toLowerCase().includes(q) ||
        (p.patient_name || "").toLowerCase().includes(q) ||
        (p.patient_phone || "").toLowerCase().includes(q);

      if (!matchesSearch) return false;

      const matchStatus =
        statusFilter === "All" ||
        p.appointments.some((a) => (a.status || "").toLowerCase() === statusFilter.toLowerCase());
      if (!matchStatus) return false;

      const matchMode =
        modeFilter === "All" ||
        p.appointments.some((a) => {
          const m = a.billing?.paymentMode || a.payment_mode || "Cash";
          return m === modeFilter;
        });
      if (!matchMode) return false;

      const start = fromDate ? new Date(fromDate).getTime() : null;
      const end = toDate ? new Date(toDate).getTime() : null;
      if (start || end) {
        const anyInRange = p.appointments.some((a) => {
          const t = a.scheduled_for ? new Date(a.scheduled_for).getTime() : null;
          if (!t) return false;
          if (start && t < start) return false;
          if (end && t > end + 24 * 3600 * 1000 - 1) return false;
          return true;
        });
        if (!anyInRange) return false;
      }
      return true;
    });
    return f;
  }, [patientsRaw, search, statusFilter, modeFilter, fromDate, toDate]);

  const totals = useMemo(() => {
    const t = { patients: patients.length, appts: 0, grand: 0, patientPaid: 0, tpa: 0, outstanding: 0 };
    patients.forEach((p) => {
      t.appts += p.rollup.totalAppointments;
      t.grand += p.rollup.grand;
      t.patientPaid += p.rollup.patientPaid;
      t.tpa += p.rollup.tpa;
      t.outstanding += p.rollup.outstanding;
    });
    return t;
  }, [patients]);

  useEffect(() => writeLS(FILES_KEY, filesByPatient), [filesByPatient]);
  useEffect(() => writeLS(OPS_KEY, opsByPatient), [opsByPatient]);

  const handleUploadFiles = (patient_id, fileList) => {
    const arr = Array.from(fileList || []).map((f) => ({
      name: f.name,
      size: f.size,
      type: f.type,
      uploadedAt: new Date().toISOString(),
      url: URL.createObjectURL(f),
    }));
    setFilesByPatient((m) => ({
      ...m,
      [patient_id]: [...(m[patient_id] || []), ...arr],
    }));
  };
  const removeFile = (patient_id, idx) => {
    setFilesByPatient((m) => {
      const next = { ...m };
      const files = [...(next[patient_id] || [])];
      const f = files[idx];
      try { if (f?.url) URL.revokeObjectURL(f.url); } catch {}
      files.splice(idx, 1);
      next[patient_id] = files;
      return next;
    });
  };

  const addOperation = (patient_id) => {
    const op = {
      id: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      type: "",
      surgeon: "",
      notes: "",
      cost: "",
    };
    setOpsByPatient((m) => ({ ...m, [patient_id]: [op, ...(m[patient_id] || [])] }));
  };
  const updateOperation = (patient_id, idx, k, v) => {
    setOpsByPatient((m) => {
      const arr = [...(m[patient_id] || [])];
      arr[idx] = { ...arr[idx], [k]: v };
      return { ...m, [patient_id]: arr };
    });
  };
  const removeOperation = (patient_id, idx) => {
    setOpsByPatient((m) => {
      const arr = [...(m[patient_id] || [])];
      arr.splice(idx, 1);
      return { ...m, [patient_id]: arr };
    });
  };

  const active = selected
    ? patients.find((p) => p.patient_id === selected.patient_id) || selected
    : null;

  return (
    <div className="min-h-screen bg-slate-50 p-3 sm:p-4 md:p-6">
      {/* Top bar */}
      <div className="mb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold leading-tight">
            Patient Records &amp; History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Consolidated records (pharmacy, labs, IPD, operations, discharge & invoices)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button className={btnGray} onClick={() => exportPatientsCSV(patients)}>
            <FiDownload className="mr-2" /> Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border bg-white shadow-sm p-4 mb-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          <div className="lg:col-span-4">
            <label className="text-sm text-slate-600">Search (ID / Name / Phone)</label>
            <div className="relative mt-1">
              <FiSearch className="absolute left-3 top-3 text-slate-400" />
              <input
                className={cls(inputBase, "pl-9")}
                placeholder="e.g., P001 / Aman / 98xxxxx"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="lg:col-span-2">
            <label className="text-sm text-slate-600">Status</label>
            <select className={inputBase} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option>All</option>
              <option>confirmed</option>
              <option>cancelled</option>
              <option>pending</option>
            </select>
          </div>

          <div className="lg:col-span-2">
            <label className="text-sm text-slate-600">Payment Mode</label>
            <select className={inputBase} value={modeFilter} onChange={(e) => setModeFilter(e.target.value)}>
              <option>All</option>
              <option>Cash</option>
              <option>Card</option>
              <option>TPA</option>
              <option>Split</option>
            </select>
          </div>

          <div className="lg:col-span-2">
            <label className="text-sm text-slate-600">From</label>
            <input type="date" className={inputBase} value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </div>
          <div className="lg:col-span-2">
            <label className="text-sm text-slate-600">To</label>
            <input type="date" className={inputBase} value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </div>
        </div>

        <div className="mt-3 text-xs text-slate-500 flex items-center gap-2">
          <FiFilter /> Showing <b>{patients.length}</b> patients (
          <b>{patients.reduce((n, p) => n + p.rollup.totalAppointments, 0)}</b> appointments)
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
        <Stat icon={<FiUsers />} label="Patients" value={patients.length} hint="Filtered" tone="blue" />
        <Stat icon={<FiFileText />} label="Appointments" value={patients.reduce((n, p) => n + p.rollup.totalAppointments, 0)} tone="slate" />
        <Stat icon={<FiCreditCard />} label="Grand Total" value={currency(patients.reduce((s, p) => s + p.rollup.grand, 0))} hint="All charges" tone="amber" />
        <Stat
          icon={<FiTrendingUp />}
          label="Collected (Patient + TPA)"
          value={currency(
            patients.reduce((s, p) => s + p.rollup.patientPaid + p.rollup.tpa, 0)
          )}
          hint={`Outstanding ${currency(patients.reduce((s, p) => s + p.rollup.outstanding, 0))}`}
          tone="green"
        />
      </div>

      {/* Patient list */}
      <div className="mt-5 rounded-2xl border bg-white shadow-sm overflow-x-auto">
        <table className="min-w-[880px] w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr className="text-left">
              <th className="px-4 py-3">Patient</th>
              <th className="px-4 py-3">Appointments</th>
              <th className="px-4 py-3">Pharmacy</th>
              <th className="px-4 py-3">Labs</th>
              <th className="px-4 py-3">Others</th>
              <th className="px-4 py-3">Grand</th>
              <th className="px-4 py-3">Paid</th>
              <th className="px-4 py-3">TPA</th>
              <th className="px-4 py-3">Outstanding</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {patients.map((p) => (
              <tr key={p.patient_id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="font-medium">{p.patient_name}</div>
                  <div className="text-xs text-slate-500">
                    {p.patient_id} {p.patient_phone ? `• ${p.patient_phone}` : ""}
                  </div>
                </td>
                <td className="px-4 py-3">{p.rollup.totalAppointments}</td>
                <td className="px-4 py-3">{currency(p.rollup.pharmacy)}</td>
                <td className="px-4 py-3">{currency(p.rollup.labs)}</td>
                <td className="px-4 py-3">{currency(p.rollup.others)}</td>
                <td className="px-4 py-3 font-semibold">{currency(p.rollup.grand)}</td>
                <td className="px-4 py-3">{currency(p.rollup.patientPaid)}</td>
                <td className="px-4 py-3">{currency(p.rollup.tpa)}</td>
                <td className="px-4 py-3">
                  <span className={cls("font-semibold", p.rollup.outstanding > 0 ? "text-red-600" : "text-emerald-700")}>
                    {currency(p.rollup.outstanding)}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button className={btnGray} onClick={() => exportPatientDetailCSV(p)}>
                      <FiDownload className="mr-2" /> CSV
                    </button>
                    <button className={btnBlue} onClick={() => { setSelected(p); setTab("overview"); }}>
                      View <FiChevronRight className="ml-1" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {patients.length === 0 && (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-slate-500">
                  No patients found for the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Drawer: Patient detail */}
      <Drawer
        open={!!active}
        onClose={() => setSelected(null)}
        title={
          active ? (
            <div className="flex items-center gap-2">
              <FiUser />
              <span className="truncate">{active.patient_name}</span>
              <Badge tone="indigo">{active.patient_id}</Badge>
              {active.patient_phone && <Badge tone="slate">{active.patient_phone}</Badge>}
            </div>
          ) : (
            "Patient"
          )
        }
        actions={
          active && (
            <div className="hidden sm:flex items-center gap-2">
              <button className={btnGray} onClick={() => exportPatientDetailCSV(active)}>
                <FiDownload className="mr-2" /> Export CSV
              </button>
            </div>
          )
        }
      >
        {active && (
          <>
            {/* Tabs */}
            <div className="mb-4 flex flex-wrap gap-2">
              {[
                ["overview", "Overview", <FiUsers key="i" />],
                ["history", "Appointments", <FiCalendar key="i" />],
                ["pharmacy", "Pharmacy", <FiPackage key="i" />],
                ["labs", "Labs", <FiActivity key="i" />],
                ["ipd", "IPD", <FiThermometer key="i" />],
                ["operations", "Operations", <FiBriefcase key="i" />],
                ["discharge", "Discharge", <FiFileText key="i" />],
                ["files", "Files", <FiFolder key="i" />],
              ].map(([k, label, icon]) => (
                <button
                  key={k}
                  className={cls(
                    "rounded-xl px-3 py-1.5 text-sm border",
                    tab === k ? "bg-slate-900 text-white border-slate-900" : "bg-white hover:bg-slate-50"
                  )}
                  onClick={() => setTab(k)}
                >
                  <span className="inline-flex items-center gap-2">{icon}{label}</span>
                </button>
              ))}
            </div>

            {/* Tab content */}
            {tab === "overview" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Stat icon={<FiFileText />} label="Appointments" value={active.rollup.totalAppointments} tone="slate" />
                <Stat icon={<FiCreditCard />} label="Grand Total" value={currency(active.rollup.grand)} tone="amber" />
                <Stat icon={<FiTrendingUp />} label="Collected" value={currency(active.rollup.patientPaid + active.rollup.tpa)} hint={`Outstanding ${currency(active.rollup.outstanding)}`} tone="green" />

                <div className="md:col-span-3 rounded-2xl border bg-white p-4">
                  <SectionHeader icon={<FiUsers />} title="Patient Info" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                    <div><span className="text-slate-500">Name</span><div className="font-medium">{active.patient_name}</div></div>
                    <div><span className="text-slate-500">Patient ID</span><div className="font-medium">{active.patient_id}</div></div>
                    <div><span className="text-slate-500">Phone</span><div className="font-medium">{active.patient_phone || "—"}</div></div>
                  </div>
                </div>
              </div>
            )}

            {tab === "history" && (
              <div className="rounded-2xl border bg-white overflow-x-auto">
                <table className="min-w-[820px] w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr className="text-left">
                      <th className="px-3 py-2">Appt</th>
                      <th className="px-3 py-2">Date & Time</th>
                      <th className="px-3 py-2">Department / Doctor</th>
                      <th className="px-3 py-2">Charges</th>
                      <th className="px-3 py-2">Mode / TPA</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2 text-right">Downloads</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {active.appointments.map((a) => {
                      const b = a.billing || {};
                      const totP = (b.pharmacy || []).reduce((s, r) => s + (Number(r.amount) || 0), 0);
                      const totL = (b.labs || []).reduce((s, r) => s + (Number(r.amount) || 0), 0);
                      const totO = (b.others || []).reduce((s, r) => s + (Number(r.amount) || 0), 0);
                      const g = totP + totL + totO;
                      const mode = b.paymentMode || a.payment_mode || "Cash";
                      return (
                        <tr key={a.appointment_no} className="hover:bg-slate-50">
                          <td className="px-3 py-2">
                            <div className="font-medium">{a.appointment_no}</div>
                            <div className="text-xs text-slate-500">{a.priority || ""}</div>
                          </td>
                          <td className="px-3 py-2">
                            <div>{a.scheduled_for ? new Date(a.scheduled_for).toLocaleDateString() : "—"}</div>
                            <div className="text-xs text-slate-500">{a.scheduled_for ? new Date(a.scheduled_for).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}</div>
                          </td>
                          <td className="px-3 py-2">
                            <div>{a.department || "—"}</div>
                            <div className="text-xs text-slate-500">{a.doctor_name || "—"}</div>
                          </td>
                          <td className="px-3 py-2">
                            <div>Pharmacy: <b>{currency(totP)}</b></div>
                            <div>Labs: <b>{currency(totL)}</b></div>
                            <div>Others: <b>{currency(totO)}</b></div>
                            <div className="font-semibold mt-1">Grand: {currency(g)}</div>
                          </td>
                          <td className="px-3 py-2">
                            <div className="font-medium">{mode}</div>
                            <div className="text-xs text-slate-500">{mode === "TPA" ? (b.tpaProvider || "—") : mode === "Split" ? "Split" : "—"}</div>
                          </td>
                          <td className="px-3 py-2">
                            <Badge tone={a.status === "confirmed" ? "green" : a.status === "cancelled" ? "red" : "amber"}>
                              {a.status || "—"}
                            </Badge>
                            <div className="mt-1 text-xs">
                              {b.cleared ? <span className="inline-flex items-center gap-1 text-emerald-700"><FiCheckCircle />Cleared</span> : <span className="inline-flex items-center gap-1 text-amber-700"><FiAlertCircle />Pending</span>}
                            </div>
                          </td>
                          <td className="px-3 py-2 text-right">
                            <div className="flex justify-end gap-2">
                              <button className={btnGray} title="Discharge (Word)" onClick={() => downloadDischargeDocForAppointment(a)}>
                                <FiDownload className="mr-2" /> Discharge
                              </button>
                              <button className={btnBlue} title="Invoice (PDF)" onClick={() => downloadInvoicePDFFromAppointment(a)}>
                                <FiDownload className="mr-2" /> Invoice
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {tab === "pharmacy" && (
              <div className="rounded-2xl border bg-white overflow-x-auto">
                <table className="min-w-[720px] w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr className="text-left">
                      <th className="px-3 py-2">Appt</th>
                      <th className="px-3 py-2">Date</th>
                      <th className="px-3 py-2">Item</th>
                      <th className="px-3 py-2">Qty</th>
                      <th className="px-3 py-2">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {active.appointments.flatMap((a) =>
                      (a.billing?.pharmacy || []).map((r, i) => (
                        <tr key={`${a.appointment_no}-ph-${i}`} className="hover:bg-slate-50">
                          <td className="px-3 py-2">{a.appointment_no}</td>
                          <td className="px-3 py-2">{a.scheduled_for ? new Date(a.scheduled_for).toLocaleDateString() : "—"}</td>
                          <td className="px-3 py-2">{r.item || "—"}</td>
                          <td className="px-3 py-2">{r.qty || "—"}</td>
                          <td className="px-3 py-2">{currency(r.amount || 0)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {tab === "labs" && (
              <div className="rounded-2xl border bg-white overflow-x-auto">
                <table className="min-w-[680px] w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr className="text-left">
                      <th className="px-3 py-2">Appt</th>
                      <th className="px-3 py-2">Date</th>
                      <th className="px-3 py-2">Test</th>
                      <th className="px-3 py-2">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {active.appointments.flatMap((a) =>
                      (a.billing?.labs || []).map((r, i) => (
                        <tr key={`${a.appointment_no}-lab-${i}`} className="hover:bg-slate-50">
                          <td className="px-3 py-2">{a.appointment_no}</td>
                          <td className="px-3 py-2">{a.scheduled_for ? new Date(a.scheduled_for).toLocaleDateString() : "—"}</td>
                          <td className="px-3 py-2">{r.test || "—"}</td>
                          <td className="px-3 py-2">{currency(r.amount || 0)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {tab === "ipd" && (
              <div className="rounded-2xl border bg-white overflow-x-auto">
                <table className="min-w-[820px] w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr className="text-left">
                      <th className="px-3 py-2">Appt</th>
                      <th className="px-3 py-2">Ward / Bed</th>
                      <th className="px-3 py-2">Date</th>
                      <th className="px-3 py-2">Prescription</th>
                      <th className="px-3 py-2">Treatment</th>
                      <th className="px-3 py-2">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {active.appointments.flatMap((a) => {
                      const ipd = a.ipd || {};
                      const daily = ipd.daily && ipd.daily.length ? ipd.daily : [];
                      return daily.length
                        ? daily.map((d, i) => (
                            <tr key={`${a.appointment_no}-ipd-${i}`} className="hover:bg-slate-50">
                              <td className="px-3 py-2">{a.appointment_no}</td>
                              <td className="px-3 py-2">{(ipd.ward || "—") + " / " + (ipd.bed || "—")}</td>
                              <td className="px-3 py-2">{d.date || "—"}</td>
                              <td className="px-3 py-2 whitespace-pre-wrap">{d.prescription || "—"}</td>
                              <td className="px-3 py-2 whitespace-pre-wrap">{d.treatment || "—"}</td>
                              <td className="px-3 py-2">{d.notes || "—"}</td>
                            </tr>
                          ))
                        : [
                            <tr key={`${a.appointment_no}-ipd-empty`} className="hover:bg-slate-50">
                              <td className="px-3 py-2">{a.appointment_no}</td>
                              <td className="px-3 py-2">{(ipd.ward || "—") + " / " + (ipd.bed || "—")}</td>
                              <td className="px-3 py-2" colSpan={3}>
                                <span className="text-slate-500">No daily records.</span>
                              </td>
                            </tr>,
                          ];
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {tab === "operations" && (
              <div className="rounded-2xl border bg-white p-4">
                <SectionHeader
                  icon={<FiBriefcase />}
                  title="Operations / Procedures"
                  actions={
                    <button className={btnGreen} onClick={() => addOperation(active.patient_id)}>
                      <FiPlusCircle className="mr-2" /> Add Operation
                    </button>
                  }
                />
                <div className="overflow-x-auto">
                  <table className="min-w-[820px] w-full text-sm">
                    <thead className="bg-slate-50">
                      <tr className="text-left">
                        <th className="px-3 py-2">Date</th>
                        <th className="px-3 py-2">Type</th>
                        <th className="px-3 py-2">Surgeon</th>
                        <th className="px-3 py-2">Notes</th>
                        <th className="px-3 py-2">Cost</th>
                        <th className="px-3 py-2 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {(opsByPatient[active.patient_id] || []).map((op, i) => (
                        <tr key={op.id} className="hover:bg-slate-50">
                          <td className="px-3 py-2">
                            <input
                              type="date"
                              className={inputBase}
                              value={op.date}
                              onChange={(e) => updateOperation(active.patient_id, i, "date", e.target.value)}
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              className={inputBase}
                              placeholder="e.g., Appendectomy"
                              value={op.type}
                              onChange={(e) => updateOperation(active.patient_id, i, "type", e.target.value)}
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              className={inputBase}
                              placeholder="Lead surgeon"
                              value={op.surgeon}
                              onChange={(e) => updateOperation(active.patient_id, i, "surgeon", e.target.value)}
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              className={inputBase}
                              placeholder="Notes"
                              value={op.notes}
                              onChange={(e) => updateOperation(active.patient_id, i, "notes", e.target.value)}
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              className={inputBase}
                              placeholder="₹"
                              value={op.cost}
                              onChange={(e) => updateOperation(active.patient_id, i, "cost", e.target.value)}
                            />
                          </td>
                          <td className="px-3 py-2 text-right">
                            <button className={btnRed} onClick={() => removeOperation(active.patient_id, i)}>
                              <FiTrash2 className="mr-2" /> Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                      {(opsByPatient[active.patient_id] || []).length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-3 py-6 text-center text-slate-500">
                            No operations recorded.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {tab === "discharge" && (
              <div className="rounded-2xl border bg-white overflow-x-auto">
                <table className="min-w-[820px] w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr className="text-left">
                      <th className="px-3 py-2">Appt</th>
                      <th className="px-3 py-2">Date</th>
                      <th className="px-3 py-2">Diagnosis Summary</th>
                      <th className="px-3 py-2">Follow-up</th>
                      <th className="px-3 py-2 text-right">Download</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {active.appointments.map((a) => (
                      <tr key={`${a.appointment_no}-dcg`} className="hover:bg-slate-50">
                        <td className="px-3 py-2">{a.appointment_no}</td>
                        <td className="px-3 py-2">{a.scheduled_for ? new Date(a.scheduled_for).toLocaleDateString() : "—"}</td>
                        <td className="px-3 py-2">
                          <div className="line-clamp-2">{a.discharge?.diagnosisSummary || "—"}</div>
                        </td>
                        <td className="px-3 py-2">{a.discharge?.followUpDate || "—"}</td>
                        <td className="px-3 py-2 text-right">
                          <button className={btnGray} onClick={() => downloadDischargeDocForAppointment(a)}>
                            <FiDownload className="mr-2" /> Word
                          </button>
                        </td>
                      </tr>
                    ))}
                    {active.appointments.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-3 py-6 text-center text-slate-500">
                          No discharge summaries.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {tab === "files" && (
              <div className="rounded-2xl border bg-white p-4">
                <SectionHeader
                  icon={<FiFolder />}
                  title="Patient Files (Uploads)"
                  actions={
                    <label className={cls(btnBlue, "cursor-pointer")}>
                      <FiUpload className="mr-2" /> Upload Files
                      <input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) => handleUploadFiles(active.patient_id, e.target.files)}
                      />
                    </label>
                  }
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {(filesByPatient[active.patient_id] || []).map((f, i) => (
                    <div key={`${f.name}-${i}`} className="rounded-xl border p-3 flex items-start justify-between">
                      <div className="min-w-0">
                        <div className="font-medium truncate max-w-[220px]" title={f.name}>{f.name}</div>
                        <div className="text-xs text-slate-500">
                          {(f.size / 1024).toFixed(1)} KB • {new Date(f.uploadedAt).toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {f.url && (
                          <a className={btnGray} href={f.url} download title="Download">
                            <FiDownload />
                          </a>
                        )}
                        <button className={btnRed} title="Remove" onClick={() => removeFile(active.patient_id, i)}>
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {(filesByPatient[active.patient_id] || []).length === 0 && (
                  <div className="text-sm text-slate-500">No files uploaded yet.</div>
                )}
              </div>
            )}
          </>
        )}
      </Drawer>
    </div>
  );
}
