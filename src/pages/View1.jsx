
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiEdit,
  FiX,
  FiPlusCircle,
  FiChevronLeft,
  FiActivity,
  FiUser,
  FiCalendar,
  FiClock,
  FiCreditCard,
  FiHeart,
  FiThermometer,
  FiTrendingUp,
  FiFileText,
  FiBookmark,
  FiCheckCircle,
  FiDownload,
} from "react-icons/fi";
import { mockAppointments } from "../components/CreateAppointmentModal";

/* ====== NEW: Light deps (lazy) ====== */
let jsPDFRef = null;
const lazyLoadJsPDF = async () => {
  if (!jsPDFRef) {
    const mod = await import("jspdf");
    jsPDFRef = mod.jsPDF || mod.default.jsPDF || mod.default;
  }
  return jsPDFRef;
};

/* Dummy Hospital Info (static) */
const HOSPITAL = {
  name: "Sunrise Multispeciality Hospital",
  tagline: "Compassion • Care • Excellence",
  address: "Plot 12, Tech Park Road, Gachibowli, Hyderabad, 500032",
  phone: "+91 40 4000 1234",
  email: "billing@sunrisehosp.in",
  gstin: "36ABCDE1234F1Z5",
};

const inputBase =
  "mt-1 block w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200";
const btnBase =
  "inline-flex items-center justify-center rounded-xl px-3.5 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2";
const btnBlue = `${btnBase} bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500`;
const btnGray = `${btnBase} bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-400`;
const btnGreen = `${btnBase} bg-green-600 text-white hover:bg-green-700 focus:ring-green-500`;
const btnRed = `${btnBase} bg-red-600 text-white hover:bg-red-700 focus:ring-red-500`;

/* ---------------- Small UI helpers (no deps) ---------------- */
const cls = (...xs) => xs.filter(Boolean).join(" ");

const Badge = ({ children, tone = "slate" }) => {
  const toneMap = {
    slate: "bg-slate-100 text-slate-700",
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
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

const StatCard = ({ icon, label, value, hint, tone = "blue" }) => {
  const toneMap = {
    blue: "from-blue-50 to-blue-100 text-blue-800",
    green: "from-emerald-50 to-emerald-100 text-emerald-800",
    amber: "from-amber-50 to-amber-100 text-amber-800",
  };
  return (
    <div className={cls("rounded-2xl p-4 bg-gradient-to-br shadow-sm animate-fadeUp", toneMap[tone])}>
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-white shadow-sm">{icon}</div>
        <div className="flex-1 min-w-0">
          <div className="text-xs opacity-80">{label}</div>
          <div className="text-xl font-bold truncate">{value}</div>
          {hint && <div className="text-[11px] opacity-70">{hint}</div>}
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

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="mt-0.5 text-gray-500">{icon}</div>
    <div className="flex-1">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-sm font-medium text-gray-900">{value ?? "-"}</div>
    </div>
  </div>
);

/* ---------------- Skeleton (loading) ---------------- */
const Skeleton = () => (
  <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
    <div className="max-w-6xl mx-auto">
      <div className="rounded-2xl bg-white p-6 shadow-xl">
        <div className="h-6 w-40 rounded-lg bg-gray-200 animate-shimmer mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-gray-100 animate-shimmer" />
          ))}
        </div>
        <div className="h-6 w-32 rounded-lg bg-gray-200 animate-shimmer my-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-gray-100 animate-shimmer" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

/* ---------------- Helpers ---------------- */
const currency = (n) =>
  (Number(n) || 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });

/* ---------------- Main ---------------- */
export default function View1 () {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [vitals, setVitals] = useState({
    bloodPressure: "",
    heartRate: "",
    temperature: "",
    weight: "",
  });
  const [caseStudies, setCaseStudies] = useState([""]);
  const [prescriptions, setPrescriptions] = useState([""]);
  const [diagnosis, setDiagnosis] = useState([""]);

  // NEW: Police Case
  const [policeCase, setPoliceCase] = useState({
    enabled: false,
    reason: "",
    incidentType: "",
    firNumber: "",
    station: "",
    officer: "",
    notes: "",
    attachments: [], // [{name, size, url}]
  });

  // NEW: IPD details
  const [ipd, setIpd] = useState({
    ward: "",
    bed: "",
    daily: [],
  });

  // NEW: Billing & Payments (+ confirm)
  const [billing, setBilling] = useState({
    pharmacy: [],
    labs: [],
    others: [],
    paymentMode: "Cash", // Cash | Card | TPA | Split
    tpaProvider: "",
    split: [{ mode: "Cash", amount: "" }], // for Split
    cleared: false,
    confirmed: false, // NEW: lock before downloads
  });

  // NEW: Discharge Summary
  const [discharge, setDischarge] = useState({
    diagnosisSummary: "",
    clinicalFindings: "",
    courseInHospital: "",
    treatmentGiven: "",
    adviceOnDischarge: "",
    followUpDate: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  /* animations keyframes (scoped) */
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      .animate-fadeUp { animation: fadeUp .5s ease-out both; }
      @keyframes shimmer { 0% { background-position: -500px 0 } 100% { background-position: 500px 0 } }
      .animate-shimmer { background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 37%, #f1f5f9 63%); background-size: 1000px 100%; animation: shimmer 1.25s infinite linear; }
      .blur-enter { animation: blurIn .35s ease-out both; }
      @keyframes blurIn { from { opacity: 0; filter: blur(6px); transform: translateY(6px); } to { opacity: 1; filter: blur(0); transform: translateY(0); } }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    try {
      const data = mockAppointments.find((appt) => appt.id === parseInt(id));
      if (!data) throw new Error("Appointment not found");
      setAppointment(data);
      setVitals({
        bloodPressure: data.vitals?.bloodPressure || "",
        heartRate: data.vitals?.heartRate || "",
        temperature: data.vitals?.temperature || "",
        weight: data.vitals?.weight || "",
      });
      setCaseStudies(data.caseStudies?.length > 0 ? data.caseStudies : [""]);
      setPrescriptions(data.prescriptions?.length > 0 ? data.prescriptions : [""]);
      setDiagnosis(data.diagnosis?.length > 0 ? data.diagnosis : [""]);

      // hydrate new sections
      setPoliceCase({
        enabled: !!data.policeCase?.enabled,
        reason: data.policeCase?.reason || "",
        incidentType: data.policeCase?.incidentType || "",
        firNumber: data.policeCase?.firNumber || "",
        station: data.policeCase?.station || "",
        officer: data.policeCase?.officer || "",
        notes: data.policeCase?.notes || "",
        attachments: data.policeCase?.attachments || [],
      });

      setIpd({
        ward: data.ipd?.ward || "",
        bed: data.ipd?.bed || "",
        daily: data.ipd?.daily?.length
          ? data.ipd.daily
          : [{ date: "", prescription: "", treatment: "", notes: "" }],
      });

      setBilling({
        pharmacy: data.billing?.pharmacy || [],
        labs: data.billing?.labs || [],
        others: data.billing?.others || [],
        paymentMode: data.billing?.paymentMode || "Cash",
        tpaProvider: data.billing?.tpaProvider || "",
        split:
          data.billing?.split?.length
            ? data.billing.split
            : [{ mode: "Cash", amount: "" }],
        cleared: !!data.billing?.cleared,
        confirmed: !!data.billing?.confirmed, // NEW
      });

      setDischarge({
        diagnosisSummary: data.discharge?.diagnosisSummary || "",
        clinicalFindings: data.discharge?.clinicalFindings || "",
        courseInHospital: data.discharge?.courseInHospital || "",
        treatmentGiven: data.discharge?.treatmentGiven || "",
        adviceOnDischarge: data.discharge?.adviceOnDischarge || "",
        followUpDate: data.discharge?.followUpDate || "",
      });

      setLoading(false);
    } catch (e) {
      setError("Failed to load appointment: " + e.message);
      setLoading(false);
    }
  }, [id]);

  const handleVitalsChange = (field, value) =>
    setVitals((prev) => ({ ...prev, [field]: value }));
  const handleCaseStudyChange = (index, value) =>
    setCaseStudies((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  const addCaseStudy = () => setCaseStudies((prev) => [...prev, ""]);
  const handlePrescriptionChange = (index, value) =>
    setPrescriptions((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  const handleDiagnosisChange = (index, value) =>
    setDiagnosis((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  const addPrescription = () => setPrescriptions((prev) => [...prev, ""]);
  const addDiagnosis = () => setDiagnosis((prev) => [...prev, ""]);

  // Police handlers
  const handlePoliceField = (k, v) => setPoliceCase((p) => ({ ...p, [k]: v }));
  const handlePoliceToggle = (v) => setPoliceCase((p) => ({ ...p, enabled: v }));
  const handlePoliceFiles = (files) => {
    const arr = Array.from(files || []).map((f) => ({
      name: f.name,
      size: f.size,
      url: URL.createObjectURL(f),
    }));
    setPoliceCase((p) => ({ ...p, attachments: [...(p.attachments || []), ...arr] }));
  };
  const removePoliceAttachment = (idx) =>
    setPoliceCase((p) => {
      const next = [...(p.attachments || [])];
      try {
        URL.revokeObjectURL(next[idx]?.url);
      } catch {}
      next.splice(idx, 1);
      return { ...p, attachments: next };
    });

  // IPD handlers
  const handleIpdField = (k, v) => setIpd((p) => ({ ...p, [k]: v }));
  const handleDailyChange = (idx, k, v) =>
    setIpd((p) => {
      const next = [...p.daily];
      next[idx] = { ...next[idx], [k]: v };
      return { ...p, daily: next };
    });
  const addDailyRow = () =>
    setIpd((p) => ({
      ...p,
      daily: [...p.daily, { date: "", prescription: "", treatment: "", notes: "" }],
    }));
  const removeDailyRow = (idx) =>
    setIpd((p) => {
      const next = [...p.daily];
      if (next.length > 1) next.splice(idx, 1);
      return { ...p, daily: next };
    });

  // Billing handlers
  const addPharmacy = () =>
    setBilling((b) => ({
      ...b,
      pharmacy: [...b.pharmacy, { item: "", qty: "", amount: "" }],
    }));
  const updatePharmacy = (i, k, v) =>
    setBilling((b) => {
      const arr = [...b.pharmacy];
      arr[i] = { ...arr[i], [k]: v };
      return { ...b, pharmacy: arr };
    });
  const removePharmacy = (i) =>
    setBilling((b) => {
      const arr = [...b.pharmacy];
      arr.splice(i, 1);
      return { ...b, pharmacy: arr };
    });

  const addLab = () =>
    setBilling((b) => ({ ...b, labs: [...b.labs, { test: "", amount: "" }] }));
  const updateLab = (i, k, v) =>
    setBilling((b) => {
      const arr = [...b.labs];
      arr[i] = { ...arr[i], [k]: v };
      return { ...b, labs: arr };
    });
  const removeLab = (i) =>
    setBilling((b) => {
      const arr = [...b.labs];
      arr.splice(i, 1);
      return { ...b, labs: arr };
    });

  const addOther = () =>
    setBilling((b) => ({ ...b, others: [...b.others, { item: "", amount: "" }] }));
  const updateOther = (i, k, v) =>
    setBilling((b) => {
      const arr = [...b.others];
      arr[i] = { ...arr[i], [k]: v };
      return { ...b, others: arr };
    });
  const removeOther = (i) =>
    setBilling((b) => {
      const arr = [...b.others];
      arr.splice(i, 1);
      return { ...b, others: arr };
    });

  const setPaymentMode = (mode) => setBilling((b) => ({ ...b, paymentMode: mode }));
  const setCleared = (v) => setBilling((b) => ({ ...b, cleared: v }));
  const setConfirmed = (v) => setBilling((b) => ({ ...b, confirmed: v }));

  const setTpaProvider = (v) => setBilling((b) => ({ ...b, tpaProvider: v }));
  const addSplit = () =>
    setBilling((b) => ({ ...b, split: [...b.split, { mode: "Cash", amount: "" }] }));
  const updateSplit = (i, k, v) =>
    setBilling((b) => {
      const arr = [...b.split];
      arr[i] = { ...arr[i], [k]: v };
      return { ...b, split: arr };
    });
  const removeSplit = (i) =>
    setBilling((b) => {
      const arr = [...b.split];
      if (arr.length > 1) arr.splice(i, 1);
      return { ...b, split: arr };
    });

  // Totals
  const totalPharmacy = billing.pharmacy.reduce((s, r) => s + (Number(r.amount) || 0), 0);
  const totalLabs = billing.labs.reduce((s, r) => s + (Number(r.amount) || 0), 0);
  const totalOthers = billing.others.reduce((s, r) => s + (Number(r.amount) || 0), 0);
  const grandTotal = totalPharmacy + totalLabs + totalOthers;

  const splitTotal = billing.split.reduce((s, r) => s + (Number(r.amount) || 0), 0);
  const splitMismatch = billing.paymentMode === "Split" && splitTotal !== grandTotal;

  // Patient vs TPA view (for split)
  const patientPaid = billing.paymentMode === "Split"
    ? billing.split.filter((x) => x.mode !== "TPA").reduce((s, r) => s + (Number(r.amount) || 0), 0)
    : (billing.paymentMode === "Cash" || billing.paymentMode === "Card") ? grandTotal : 0;

  const tpaPortion = billing.paymentMode === "TPA"
    ? grandTotal
    : billing.paymentMode === "Split"
      ? billing.split.filter((x) => x.mode === "TPA").reduce((s, r) => s + (Number(r.amount) || 0), 0)
      : 0;

  const outstanding = Math.max(0, grandTotal - (patientPaid + tpaPortion));

  const handleEdit = () => {
    try {
      const updatedAppointment = {
        ...appointment,
        vitals,
        caseStudies: caseStudies.filter((cs) => cs.trim() !== ""),
        prescriptions: prescriptions.filter((p) => p.trim() !== ""),
        diagnosis: diagnosis.filter((p) => p.trim() !== ""),
        policeCase,
        ipd,
        billing: {
          ...billing,
          ...(billing.paymentMode !== "Split"
            ? { split: [{ mode: billing.paymentMode, amount: String(grandTotal) }] }
            : {}),
        },
        discharge,
      };

      const index = mockAppointments.findIndex((appt) => appt.id === parseInt(id));
      if (index !== -1) mockAppointments[index] = updatedAppointment;
      setAppointment(updatedAppointment);
      setIsEditing(false);
      alert("Vitals and records updated successfully");
    } catch (e) {
      setError("Failed to update appointment: " + e.message);
    }
  };

  const handleClose = () => navigate("/admin/appointments");

  // quick “Save & Next” scroller
  const saveAndGo = (anchorId) => {
    handleEdit();
    setTimeout(() => {
      const el = document.getElementById(anchorId);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // PRESET: Partially paid Cash + TPA (cashless)
  const applySampleSplit = () => {
    const cashSample = Math.round(grandTotal * 0.35); // 35% by patient
    const tpaSample = grandTotal - cashSample;        // rest by TPA
    setBilling((b) => ({
      ...b,
      paymentMode: "Split",
      tpaProvider: b.tpaProvider || "MediAssist",
      split: [
        { mode: "Cash", amount: String(cashSample) },
        { mode: "TPA", amount: String(tpaSample) },
      ],
      cleared: false,
    }));
  };

  // Download: Discharge Summary (TXT remains) + NEW: Word-friendly .doc
  const downloadDischarge = () => {
    const text = `DISCHARGE SUMMARY
-------------------
Hospital: ${HOSPITAL.name}
Address: ${HOSPITAL.address}
Phone: ${HOSPITAL.phone} | Email: ${HOSPITAL.email}
GSTIN: ${HOSPITAL.gstin}

Patient: ${appointment?.patient_name || "-"} (${appointment?.patient_id || "-"})
Doctor: ${appointment?.doctor_name || "-"} (${appointment?.doctor_id || "-"})
Department: ${appointment?.department || "-"}

Admission Ward/Bed: ${ipd.ward || "-"} / ${ipd.bed || "-"}

Diagnosis Summary:
${discharge.diagnosisSummary || "-"}

Clinical Findings:
${discharge.clinicalFindings || "-"}

Course in Hospital:
${discharge.courseInHospital || "-"}

Treatment Given:
${discharge.treatmentGiven || "-"}

Advice on Discharge:
${discharge.adviceOnDischarge || "-"}

Follow-up Date: ${discharge.followUpDate || "-"}

Billing Summary:
Pharmacy: ${currency(totalPharmacy)}
Labs:     ${currency(totalLabs)}
Others:   ${currency(totalOthers)}
TOTAL:    ${currency(grandTotal)}
Payment Mode: ${billing.paymentMode}${
      billing.paymentMode === "TPA" ? ` (Provider: ${billing.tpaProvider || "-"})` : ""
    }${
      billing.paymentMode === "Split"
        ? `\nSplit:\n${billing.split.map((r) => ` - ${r.mode}: ${currency(r.amount || 0)}`).join("\n")}`
        : ""
    }
Payment Status: ${billing.cleared ? "Cleared" : "Pending"}
Outstanding (if any): ${currency(outstanding)}
`;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${appointment?.patient_id || "patient"}_discharge_summary.txt`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  // NEW: Download a Word-openable .DOC with hospital header
  const downloadDischargeDoc = () => {
    const html = `
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
        <p><b>Patient:</b> ${appointment?.patient_name || "-"} (${appointment?.patient_id || "-"})</p>
        <p><b>Doctor:</b> ${appointment?.doctor_name || "-"} (${appointment?.doctor_id || "-"})</p>
        <p><b>Department:</b> ${appointment?.department || "-"}</p>
        <p><b>Ward/Bed:</b> ${ipd.ward || "-"} / ${ipd.bed || "-"}</p>
        <h4>Diagnosis Summary</h4><p>${(discharge.diagnosisSummary || "-").replace(/\n/g,"<br/>")}</p>
        <h4>Clinical Findings</h4><p>${(discharge.clinicalFindings || "-").replace(/\n/g,"<br/>")}</p>
        <h4>Course in Hospital</h4><p>${(discharge.courseInHospital || "-").replace(/\n/g,"<br/>")}</p>
        <h4>Treatment Given</h4><p>${(discharge.treatmentGiven || "-").replace(/\n/g,"<br/>")}</p>
        <h4>Advice on Discharge</h4><p>${(discharge.adviceOnDischarge || "-").replace(/\n/g,"<br/>")}</p>
        <p><b>Follow-up Date:</b> ${discharge.followUpDate || "-"}</p>
        <h4>Billing Summary</h4>
        <p>Pharmacy: ${currency(totalPharmacy)}<br/>
           Labs: ${currency(totalLabs)}<br/>
           Others: ${currency(totalOthers)}<br/>
           <b>TOTAL:</b> ${currency(grandTotal)}</p>
        <p><b>Payment Mode:</b> ${billing.paymentMode}${
          billing.paymentMode === "TPA" ? ` (Provider: ${billing.tpaProvider || "-"})` : ""
        }${
          billing.paymentMode === "Split"
            ? `<br/><b>Split:</b><br/>${billing.split
                .map((r) => ` - ${r.mode}: ${currency(r.amount || 0)}`)
                .join("<br/>")}`
            : ""
        }
        <br/><b>Payment Status:</b> ${billing.cleared ? "Cleared" : "Pending"}
        <br/><b>Outstanding (if any):</b> ${currency(outstanding)}</p>
        <br/><br/>
        <div style="font-size:12px;">This is a computer-generated document and does not require a signature.</div>
      </body></html>`;
    const blob = new Blob([html], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${appointment?.patient_id || "patient"}_discharge_summary.doc`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  // NEW: Invoice PDF download with Cash + TPA sections
  const downloadInvoicePDF = async () => {
    if (!billing.confirmed) {
      alert("Please confirm billing details before downloading the invoice.");
      return;
    }
    const jsPDF = await lazyLoadJsPDF();
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const marginX = 40;
    let y = 50;

    const addLine = (text, opts = {}) => {
      const { size = 11, bold = false } = opts;
      doc.setFont("helvetica", bold ? "bold" : "normal");
      doc.setFontSize(size);
      doc.text(String(text), marginX, y);
      y += size + 6;
    };

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(HOSPITAL.name, marginX, y);
    y += 18;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    addLine(HOSPITAL.tagline);
    addLine(HOSPITAL.address);
    addLine(`Phone: ${HOSPITAL.phone}   Email: ${HOSPITAL.email}`);
    addLine(`GSTIN: ${HOSPITAL.gstin}`);
    y += 6;
    doc.line(marginX, y, 555, y);
    y += 16;

    // Invoice heading
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Hospital Invoice", marginX, y);
    y += 20;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    addLine(`Invoice Date: ${new Date().toLocaleDateString()}`);
    addLine(`Appointment No: ${appointment?.appointment_no || "-"}`);
    addLine(`Patient: ${appointment?.patient_name || "-"} (${appointment?.patient_id || "-"})`);
    addLine(`Doctor: ${appointment?.doctor_name || "-"} (${appointment?.doctor_id || "-"})`);
    addLine(`Department: ${appointment?.department || "-"}`);
    y += 8;

    // Charges
    doc.setFont("helvetica", "bold");
    doc.text("Charges", marginX, y);
    y += 16;
    doc.setFont("helvetica", "normal");
    addLine(`Pharmacy: ${currency(totalPharmacy)}`);
    addLine(`Labs: ${currency(totalLabs)}`);
    addLine(`Others: ${currency(totalOthers)}`);
    doc.setFont("helvetica", "bold");
    addLine(`Grand Total: ${currency(grandTotal)}`, { bold: true });

    y += 8;
    doc.line(marginX, y, 555, y);
    y += 16;

    // Payment Breakdown
    doc.setFont("helvetica", "bold");
    doc.text("Payment Details", marginX, y);
    y += 16;
    doc.setFont("helvetica", "normal");
    addLine(`Payment Mode: ${billing.paymentMode}`);
    if (billing.paymentMode === "TPA") addLine(`TPA Provider: ${billing.tpaProvider || "-"}`);

    if (billing.paymentMode === "Split") {
      addLine("Split Payments:");
      billing.split.forEach((s) => addLine(` - ${s.mode}: ${currency(s.amount || 0)}`));
      addLine(`(Split Total: ${currency(splitTotal)})`);
    }

    // Patient vs TPA summary
    y += 8;
    doc.setFont("helvetica", "bold");
    addLine(`Paid by Patient: ${currency(patientPaid)}`, { bold: true });
    addLine(`To be Settled by TPA: ${currency(tpaPortion)}`, { bold: true });
    addLine(`Outstanding: ${currency(outstanding)}`, { bold: true });

    y += 8;
    doc.line(marginX, y, 555, y);
    y += 16;

    addLine(`Payment Status: ${billing.cleared ? "Cleared" : "Pending"}`);
    y += 12;
    doc.setFontSize(9);
    doc.text(
      "Note: This is a computer-generated invoice. For queries, contact billing@sunrisehosp.in",
      marginX,
      y
    );

    doc.save(`${appointment?.patient_id || "patient"}_invoice.pdf`);
  };

  if (loading) return <Skeleton />;
  if (error) return <div className="p-6 text-center text-red-700">{error}</div>;
  if (!appointment) return <div className="p-6 text-center text-gray-500">No appointment found</div>;

  const fee = appointment.doctor_fee ?? appointment.amount_payable ?? 0;
  const disc = appointment.discount_pct ?? 0;
  const finalFee = Math.max(0, Number((fee - (fee * disc) / 100).toFixed(2)));

  const statusTone =
    appointment.status === "confirmed"
      ? "green"
      : appointment.status === "cancelled"
      ? "red"
      : "slate";

  return (
    <div className="p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Sticky bar */}
        <div className="sticky -top-1 z-20 mb-4">
          <div className="flex items-center justify-between rounded-2xl bg-white/80 backdrop-blur-md border border-gray-200 px-3 py-2 shadow-sm">
            <div className="flex items-center gap-2">
              <button
                className="p-2 rounded-lg hover:bg-gray-100"
                onClick={() => navigate(-1)}
                aria-label="Go back"
                title="Back"
              >
                <FiChevronLeft />
              </button>
              <Badge tone="indigo">
                <FiBookmark /> {appointment.appointment_no}
              </Badge>
              <Badge tone={statusTone}>{appointment.status ?? "—"}</Badge>
            </div>
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <>
                  <button className={btnGray} onClick={handleClose}>Close</button>
                  <button className={btnBlue} onClick={() => setIsEditing(true)}>
                    <FiEdit className="mr-2" /> Edit
                  </button>
                </>
              ) : (
                <>
                  <button className={btnGray} onClick={() => setIsEditing(false)}>Cancel</button>
                  <button
                    className={cls(btnBlue, splitMismatch && "opacity-60 pointer-events-none")}
                    title={splitMismatch ? "Split amount must equal Grand Total" : "Save"}
                    onClick={handleEdit}
                  >
                    Save
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Header card */}
        <div className="rounded-3xl bg-white shadow-xl border border-gray-200 overflow-hidden animate-fadeUp">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-white/15">
                  <FiUser size={20} />
                </div>
                <div>
                  <div className="text-sm text-white/80">Patient</div>
                  <div className="text-xl font-semibold">
                    {appointment.patient_name}{" "}
                    <span className="text-white/80 text-sm">({appointment.patient_id ?? "—"})</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge tone="blue">
                  <FiCalendar />{" "}
                  {appointment.scheduled_for
                    ? new Date(appointment.scheduled_for).toLocaleDateString([], {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                      })
                    : "—"}
                </Badge>
                <Badge tone="blue">
                  <FiClock />
                  {appointment.scheduled_for
                    ? new Date(appointment.scheduled_for).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                    : "—"}
                </Badge>
                {appointment.slot_label && <Badge tone="violet">{appointment.slot_label}</Badge>}
                <Badge tone="amber">{appointment.priority}</Badge>
              </div>
            </div>
          </div>

          {/* Quick facts */}
          <div className="px-6 pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={<FiActivity />}
                label="Doctor"
                value={`${appointment.doctor_name}`}
                hint={appointment.department || "—"}
                tone="blue"
              />
              <StatCard
                icon={<FiCreditCard />}
                label="Fees"
                value={`₹ ${fee.toFixed(2)}`}
                hint={`Discount ${disc}%`}
                tone="green"
              />
              <StatCard
                icon={<FiTrendingUp />}
                label="Final Payable"
                value={`₹ ${finalFee.toFixed(2)}`}
                hint={`Mode: ${appointment.payment_mode}`}
                tone="amber"
              />
              <StatCard
                icon={<FiFileText />}
                label="Reason / Notes"
                value={appointment.reason || appointment.notes || "—"}
                tone="blue"
              />
            </div>
          </div>

          {/* Details grid */}
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="rounded-2xl border bg-white p-5 shadow-sm animate-fadeUp">
                <SectionHeader icon={<FiUser />} title="Patient & Doctor" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoRow icon={<FiUser />} label="Patient ID" value={appointment.patient_id ?? "—"} />
                  <InfoRow icon={<FiUser />} label="Doctor ID" value={appointment.doctor_id ?? "—"} />
                  <InfoRow icon={<FiActivity />} label="Doctor" value={appointment.doctor_name} />
                  <InfoRow icon={<FiBookmark />} label="Department" value={appointment.department || "—"} />
                </div>
              </div>

              <div className="rounded-2xl border bg-white p-5 shadow-sm animate-fadeUp">
                <SectionHeader icon={<FiCreditCard />} title="Payment & Discount" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoRow icon={<FiCreditCard />} label="Payment Mode" value={appointment.payment_mode} />
                  <InfoRow icon={<FiTrendingUp />} label="Discount %" value={appointment.discount_pct ?? 0} />
                  <InfoRow icon={<FiActivity />} label="Status" value={<Badge tone={statusTone}>{appointment.status ?? "—"}</Badge>} />
                </div>
              </div>
            </div>
          </div>

          {/* Vitals */}
          <div className="px-6 pb-6">
            <div className={cls("rounded-2xl border bg-white p-5 shadow-sm", isEditing && "ring-2 ring-blue-200")}>
              <SectionHeader icon={<FiHeart />} title="Vitals" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-700">Blood Pressure (mmHg)</label>
                  {isEditing ? (
                    <input
                      type="text"
                      className={inputBase}
                      value={vitals.bloodPressure}
                      onChange={(e) => handleVitalsChange("bloodPressure", e.target.value)}
                      placeholder="e.g., 120/80"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{vitals.bloodPressure || "—"}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-gray-700">Heart Rate (bpm)</label>
                  {isEditing ? (
                    <input
                      type="text"
                      className={inputBase}
                      value={vitals.heartRate}
                      onChange={(e) => handleVitalsChange("heartRate", e.target.value)}
                      placeholder="e.g., 72"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{vitals.heartRate || "—"}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-gray-700">Temperature (°C)</label>
                  {isEditing ? (
                    <input
                      type="text"
                      className={inputBase}
                      value={vitals.temperature}
                      onChange={(e) => handleVitalsChange("temperature", e.target.value)}
                      placeholder="e.g., 36.6"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{vitals.temperature || "—"}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-gray-700">Weight (kg)</label>
                  {isEditing ? (
                    <input
                      type="text"
                      className={inputBase}
                      value={vitals.weight}
                      onChange={(e) => handleVitalsChange("weight", e.target.value)}
                      placeholder="e.g., 70"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{vitals.weight || "—"}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Case Studies */}
          <div className="px-6 pb-6" id="case-studies">
            <div className={cls("rounded-2xl border bg-white p-5 shadow-sm", isEditing && "ring-2 ring-blue-200")}>
              <SectionHeader
                icon={<FiFileText />}
                title="Case Studies"
                actions={
                  isEditing && (
                    <div className="flex gap-2">
                      <button className={btnGreen} onClick={addCaseStudy}>
                        <FiPlusCircle className="mr-2" /> Add Case Study
                      </button>
                      <button className={btnBlue} onClick={() => saveAndGo("prescriptions")}>Save & Next</button>
                    </div>
                  )
                }
              />
              <div className="space-y-4">
                {caseStudies.map((caseStudy, index) => (
                  <div key={index} className="animate-fadeUp">
                    <label className="text-sm text-gray-700">Case Study {index + 1}</label>
                    {isEditing ? (
                      <textarea
                        className={inputBase}
                        value={caseStudy}
                        onChange={(e) => handleCaseStudyChange(index, e.target.value)}
                        placeholder="Enter case study details"
                        rows={4}
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{caseStudy || "—"}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Prescriptions */}
          <div className="px-6 pb-8" id="prescriptions">
            <div className={cls("rounded-2xl border bg-white p-5 shadow-sm", isEditing && "ring-2 ring-blue-200")}>
              <SectionHeader
                icon={<FiActivity />}
                title="Prescriptions"
                actions={
                  isEditing && (
                    <div className="flex gap-2">
                      <button className={btnGreen} onClick={addPrescription}>
                        <FiPlusCircle className="mr-2" /> Add Prescription
                      </button>
                      <button className={btnBlue} onClick={() => saveAndGo("diagnosis")}>Save & Next</button>
                    </div>
                  )
                }
              />
              <div className="space-y-4">
                {prescriptions.map((prescription, index) => (
                  <div key={index} className="animate-fadeUp">
                    <label className="text-sm text-gray-700">Prescription {index + 1}</label>
                    {isEditing ? (
                      <textarea
                        className={inputBase}
                        value={prescription}
                        onChange={(e) => handlePrescriptionChange(index, e.target.value)}
                        placeholder="Enter prescription details"
                        rows={4}
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{prescription || "—"}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Diagnosis */}
          <div className="px-6 pb-8" id="diagnosis">
            <div className={cls("rounded-2xl border bg-white p-5 shadow-sm", isEditing && "ring-2 ring-blue-200")}>
              <SectionHeader
                icon={<FiActivity />}
                title="Diagnosis"
                actions={
                  isEditing && (
                    <button className={btnBlue} onClick={() => saveAndGo("police-case")}>Save & Next</button>
                  )
                }
              />
              <div className="space-y-4">
                {diagnosis.map((dx, index) => (
                  <div key={index} className="animate-fadeUp">
                    <label className="text-sm text-gray-700">Diagnosis {index + 1}</label>
                    {isEditing ? (
                      <textarea
                        className={inputBase}
                        value={dx}
                        onChange={(e) => handleDiagnosisChange(index, e.target.value)}
                        placeholder="Enter Diagnosis details"
                        rows={3}
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{dx || "—"}</p>
                    )}
                  </div>
                ))}
                {isEditing && (
                  <button className={btnGreen} onClick={addDiagnosis}>
                    <FiPlusCircle className="mr-2" /> Add Diagnosis
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* NEW: Police Case */}
          <div className="px-6 pb-8" id="police-case">
            <div className={cls("rounded-2xl border bg-white p-5 shadow-sm", isEditing && "ring-2 ring-blue-200")}>
              <SectionHeader
                icon={<FiFileText />}
                title="Police Case"
                actions={
                  isEditing && (
                    <button className={btnBlue} onClick={() => saveAndGo("ipd")}>Save & Next</button>
                  )
                }
              />
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <label className="text-sm text-gray-700">Mark as Police Case?</label>
                  {isEditing ? (
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={policeCase.enabled}
                      onChange={(e) => handlePoliceToggle(e.target.checked)}
                    />
                  ) : (
                    <Badge tone={policeCase.enabled ? "red" : "slate"}>{policeCase.enabled ? "YES" : "NO"}</Badge>
                  )}
                </div>

                {policeCase.enabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-700">Reason</label>
                      {isEditing ? (
                        <input
                          className={inputBase}
                          value={policeCase.reason}
                          onChange={(e) => handlePoliceField("reason", e.target.value)}
                          placeholder="Reason for police case"
                        />
                      ) : (
                        <p className="mt-1 text-sm">{policeCase.reason || "—"}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm text-gray-700">Incident Type</label>
                      {isEditing ? (
                        <select
                          className={inputBase}
                          value={policeCase.incidentType}
                          onChange={(e) => handlePoliceField("incidentType", e.target.value)}
                        >
                          <option value="">Select</option>
                          <option value="Road Accident">Road Accident</option>
                          <option value="Workplace">Workplace</option>
                          <option value="Assault">Assault</option>
                          <option value="Other">Other</option>
                        </select>
                      ) : (
                        <p className="mt-1 text-sm">{policeCase.incidentType || "—"}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm text-gray-700">FIR Number</label>
                      {isEditing ? (
                        <input
                          className={inputBase}
                          value={policeCase.firNumber}
                          onChange={(e) => handlePoliceField("firNumber", e.target.value)}
                          placeholder="e.g., FIR/2025/XXXX"
                        />
                      ) : (
                        <p className="mt-1 text-sm">{policeCase.firNumber || "—"}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm text-gray-700">Police Station</label>
                      {isEditing ? (
                        <input
                          className={inputBase}
                          value={policeCase.station}
                          onChange={(e) => handlePoliceField("station", e.target.value)}
                          placeholder="Station name"
                        />
                      ) : (
                        <p className="mt-1 text-sm">{policeCase.station || "—"}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm text-gray-700">Officer Name</label>
                      {isEditing ? (
                        <input
                          className={inputBase}
                          value={policeCase.officer}
                          onChange={(e) => handlePoliceField("officer", e.target.value)}
                          placeholder="Officer in charge"
                        />
                      ) : (
                        <p className="mt-1 text-sm">{policeCase.officer || "—"}</p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm text-gray-700">Notes</label>
                      {isEditing ? (
                        <textarea
                          className={inputBase}
                          rows={3}
                          value={policeCase.notes}
                          onChange={(e) => handlePoliceField("notes", e.target.value)}
                          placeholder="Any additional notes"
                        />
                      ) : (
                        <p className="mt-1 text-sm whitespace-pre-wrap">{policeCase.notes || "—"}</p>
                      )}
                    </div>

                    {/* Upload / Download */}
                    <div className="md:col-span-2">
                      <label className="text-sm text-gray-700">Attachments (FIR, Reports, Photos)</label>
                      {isEditing ? (
                        <input
                          type="file"
                          multiple
                          className={inputBase}
                          onChange={(e) => handlePoliceFiles(e.target.files)}
                        />
                      ) : null}
                      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {(policeCase.attachments || []).length === 0 && <p className="text-sm text-gray-500">No files</p>}
                        {(policeCase.attachments || []).map((f, i) => (
                          <div key={i} className="flex items-center justify-between rounded-lg border p-2">
                            <div className="text-sm">
                              <div className="font-medium truncate max-w-[180px]" title={f.name}>{f.name}</div>
                              <div className="text-xs text-gray-500">{(Number(f.size) / 1024).toFixed(1)} KB</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <a href={f.url} download className={btnGray}>Download</a>
                              {isEditing && (
                                <button className={btnRed} onClick={() => removePoliceAttachment(i)}>Remove</button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* NEW: IPD (Ward/Bed + Day-wise Treatments) */}
          <div className="px-6 pb-8" id="ipd">
            <div className={cls("rounded-2xl border bg-white p-5 shadow-sm", isEditing && "ring-2 ring-blue-200")}>
              <SectionHeader
                icon={<FiFileText />}
                title="In-Patient Details"
                actions={
                  isEditing && (
                    <button className={btnBlue} onClick={() => saveAndGo("billing")}>Save & Next</button>
                  )
                }
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-700">Ward</label>
                  {isEditing ? (
                    <input
                      className={inputBase}
                      value={ipd.ward}
                      onChange={(e) => handleIpdField("ward", e.target.value)}
                      placeholder="e.g., General / ICU / Private"
                    />
                  ) : (
                    <p className="mt-1 text-sm">{ipd.ward || "—"}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-gray-700">Bed</label>
                  {isEditing ? (
                    <input
                      className={inputBase}
                      value={ipd.bed}
                      onChange={(e) => handleIpdField("bed", e.target.value)}
                      placeholder="e.g., B-12"
                    />
                  ) : (
                    <p className="mt-1 text-sm">{ipd.bed || "—"}</p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Day-wise Prescriptions & Treatments</h4>
                  {isEditing && (
                    <button className={btnGreen} onClick={addDailyRow}>
                      <FiPlusCircle className="mr-2" /> Add Day
                    </button>
                  )}
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm border rounded-xl overflow-hidden">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-2 border">Date</th>
                        <th className="text-left p-2 border">Prescription</th>
                        <th className="text-left p-2 border">Treatment</th>
                        <th className="text-left p-2 border">Notes</th>
                        {isEditing && <th className="p-2 border text-right">Action</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {ipd.daily.map((row, i) => (
                        <tr key={i} className="odd:bg-white even:bg-gray-50">
                          <td className="p-2 border">
                            {isEditing ? (
                              <input
                                type="date"
                                className={inputBase}
                                value={row.date}
                                onChange={(e) => handleDailyChange(i, "date", e.target.value)}
                              />
                            ) : (
                              row.date || "—"
                            )}
                          </td>
                          <td className="p-2 border">
                            {isEditing ? (
                              <textarea
                                className={inputBase}
                                rows={2}
                                value={row.prescription}
                                onChange={(e) => handleDailyChange(i, "prescription", e.target.value)}
                              />
                            ) : (
                              <span className="whitespace-pre-wrap">{row.prescription || "—"}</span>
                            )}
                          </td>
                          <td className="p-2 border">
                            {isEditing ? (
                              <textarea
                                className={inputBase}
                                rows={2}
                                value={row.treatment}
                                onChange={(e) => handleDailyChange(i, "treatment", e.target.value)}
                              />
                            ) : (
                              <span className="whitespace-pre-wrap">{row.treatment || "—"}</span>
                            )}
                          </td>
                          <td className="p-2 border">
                            {isEditing ? (
                              <input
                                className={inputBase}
                                value={row.notes}
                                onChange={(e) => handleDailyChange(i, "notes", e.target.value)}
                              />
                            ) : (
                              row.notes || "—"
                            )}
                          </td>
                          {isEditing && (
                            <td className="p-2 border text-right">
                              <button className={btnRed} onClick={() => removeDailyRow(i)}>Remove</button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* NEW: Billing & Payments */}
          <div className="px-6 pb-8" id="billing">
            <div className={cls("rounded-2xl border bg-white p-5 shadow-sm", isEditing && "ring-2 ring-blue-200")}>
              <SectionHeader
                icon={<FiCreditCard />}
                title="Billing & Payments"
                actions={
                  <div className="flex gap-2">
                    {isEditing && (
                      <>
                        <button className={btnGreen} onClick={applySampleSplit} title="Preset: Cash + TPA (Cashless)">
                          <FiPlusCircle className="mr-2" /> Cash + TPA (sample)
                        </button>
                        <button className={btnBlue} onClick={() => saveAndGo("discharge")}>Save & Next</button>
                      </>
                    )}
                  </div>
                }
              />

              {/* Pharmacy */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Pharmacy</h4>
                  {isEditing && (
                    <button className={btnGreen} onClick={addPharmacy}>
                      <FiPlusCircle className="mr-2" /> Add Item
                    </button>
                  )}
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm border rounded-xl overflow-hidden">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-2 border">Item</th>
                        <th className="text-left p-2 border">Qty</th>
                        <th className="text-right p-2 border">Amount</th>
                        {isEditing && <th className="p-2 border text-right">Action</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {billing.pharmacy.map((r, i) => (
                        <tr key={i} className="odd:bg-white even:bg-gray-50">
                          <td className="p-2 border">
                            {isEditing ? (
                              <input className={inputBase} value={r.item} onChange={(e) => updatePharmacy(i, "item", e.target.value)} />
                            ) : (
                              r.item || "—"
                            )}
                          </td>
                          <td className="p-2 border">
                            {isEditing ? (
                              <input className={inputBase} value={r.qty} onChange={(e) => updatePharmacy(i, "qty", e.target.value)} />
                            ) : (
                              r.qty || "—"
                            )}
                          </td>
                          <td className="p-2 border text-right">
                            {isEditing ? (
                              <input className={inputBase} value={r.amount} onChange={(e) => updatePharmacy(i, "amount", e.target.value)} />
                            ) : (
                              currency(r.amount || 0)
                            )}
                          </td>
                          {isEditing && (
                            <td className="p-2 border text-right">
                              <button className={btnRed} onClick={() => removePharmacy(i)}>Remove</button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td className="p-2 border font-medium" colSpan={2}>Total</td>
                        <td className="p-2 border text-right font-semibold">{currency(totalPharmacy)}</td>
                        {isEditing && <td className="p-2 border" />}
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Labs */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Labs</h4>
                  {isEditing && (
                    <button className={btnGreen} onClick={addLab}>
                      <FiPlusCircle className="mr-2" /> Add Test
                    </button>
                  )}
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm border rounded-xl overflow-hidden">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-2 border">Test</th>
                        <th className="text-right p-2 border">Amount</th>
                        {isEditing && <th className="p-2 border text-right">Action</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {billing.labs.map((r, i) => (
                        <tr key={i} className="odd:bg-white even:bg-gray-50">
                          <td className="p-2 border">
                            {isEditing ? (
                              <input className={inputBase} value={r.test} onChange={(e) => updateLab(i, "test", e.target.value)} />
                            ) : (
                              r.test || "—"
                            )}
                          </td>
                          <td className="p-2 border text-right">
                            {isEditing ? (
                              <input className={inputBase} value={r.amount} onChange={(e) => updateLab(i, "amount", e.target.value)} />
                            ) : (
                              currency(r.amount || 0)
                            )}
                          </td>
                          {isEditing && (
                            <td className="p-2 border text-right">
                              <button className={btnRed} onClick={() => removeLab(i)}>Remove</button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td className="p-2 border font-medium">Total</td>
                        <td className="p-2 border text-right font-semibold">{currency(totalLabs)}</td>
                        {isEditing && <td className="p-2 border" />}
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Others */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Other Charges</h4>
                  {isEditing && (
                    <button className={btnGreen} onClick={addOther}>
                      <FiPlusCircle className="mr-2" /> Add Charge
                    </button>
                  )}
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm border rounded-xl overflow-hidden">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-2 border">Item</th>
                        <th className="text-right p-2 border">Amount</th>
                        {isEditing && <th className="p-2 border text-right">Action</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {billing.others.map((r, i) => (
                        <tr key={i} className="odd:bg-white even:bg-gray-50">
                          <td className="p-2 border">
                            {isEditing ? (
                              <input className={inputBase} value={r.item} onChange={(e) => updateOther(i, "item", e.target.value)} />
                            ) : (
                              r.item || "—"
                            )}
                          </td>
                          <td className="p-2 border text-right">
                            {isEditing ? (
                              <input className={inputBase} value={r.amount} onChange={(e) => updateOther(i, "amount", e.target.value)} />
                            ) : (
                              currency(r.amount || 0)
                            )}
                          </td>
                          {isEditing && (
                            <td className="p-2 border text-right">
                              <button className={btnRed} onClick={() => removeOther(i)}>Remove</button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td className="p-2 border font-medium">Total</td>
                        <td className="p-2 border text-right font-semibold">{currency(totalOthers)}</td>
                        {isEditing && <td className="p-2 border" />}
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Summary + Payment */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold">Grand Total</div>
                    <div className="text-lg font-bold">{currency(grandTotal)}</div>
                  </div>
                  <div className="text-xs text-gray-500">
                    Pharmacy: {currency(totalPharmacy)} • Labs: {currency(totalLabs)} • Others: {currency(totalOthers)}
                  </div>
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div className="rounded-lg border p-2">
                      <div className="text-gray-600">Paid by Patient</div>
                      <div className="font-semibold">{currency(patientPaid)}</div>
                    </div>
                    <div className="rounded-lg border p-2">
                      <div className="text-gray-600">To be Settled by TPA</div>
                      <div className="font-semibold">{currency(tpaPortion)}</div>
                    </div>
                    <div className="rounded-lg border p-2 sm:col-span-2">
                      <div className="text-gray-600">Outstanding</div>
                      <div className={cls("font-semibold", outstanding > 0 ? "text-red-600" : "text-emerald-700")}>
                        {currency(outstanding)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border p-4">
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="text-sm text-gray-700">Payment Mode</label>
                      {isEditing ? (
                        <select
                          className={inputBase}
                          value={billing.paymentMode}
                          onChange={(e) => setPaymentMode(e.target.value)}
                        >
                          <option>Cash</option>
                          <option>Card</option>
                          <option>TPA</option>
                          <option>Split</option>
                        </select>
                      ) : (
                        <p className="mt-1 text-sm">{billing.paymentMode}</p>
                      )}
                    </div>

                    {billing.paymentMode === "TPA" && (
                      <div>
                        <label className="text-sm text-gray-700">TPA Provider</label>
                        {isEditing ? (
                          <input
                            className={inputBase}
                            value={billing.tpaProvider}
                            onChange={(e) => setTpaProvider(e.target.value)}
                            placeholder="e.g., MediAssist"
                          />
                        ) : (
                          <p className="mt-1 text-sm">{billing.tpaProvider || "—"}</p>
                        )}
                      </div>
                    )}

                    {billing.paymentMode === "Split" && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm text-gray-700">Split Payments</label>
                          {isEditing && (
                            <button className={btnGreen} onClick={addSplit}>
                              <FiPlusCircle className="mr-2" /> Add Split
                            </button>
                          )}
                        </div>
                        <div className="space-y-2">
                          {billing.split.map((s, i) => (
                            <div key={i} className="grid grid-cols-12 gap-2">
                              <div className="col-span-5">
                                {isEditing ? (
                                  <select
                                    className={inputBase}
                                    value={s.mode}
                                    onChange={(e) => updateSplit(i, "mode", e.target.value)}
                                  >
                                    <option>Cash</option>
                                    <option>Card</option>
                                    <option>TPA</option>
                                  </select>
                                ) : (
                                  <div className="text-sm">{s.mode}</div>
                                )}
                              </div>
                              <div className="col-span-5">
                                {isEditing ? (
                                  <input
                                    className={inputBase}
                                    value={s.amount}
                                    onChange={(e) => updateSplit(i, "amount", e.target.value)}
                                    placeholder="Amount"
                                  />
                                ) : (
                                  <div className="text-sm text-right">{currency(s.amount || 0)}</div>
                                )}
                              </div>
                              {isEditing && (
                                <div className="col-span-2 text-right">
                                  <button className={btnRed} onClick={() => removeSplit(i)}>Remove</button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        {billing.paymentMode === "Split" && (
                          <div className={cls("mt-1 text-xs", splitMismatch ? "text-red-600" : "text-emerald-700")}>
                            Split Total: {currency(splitTotal)} {splitMismatch ? "≠" : "="} Grand Total: {currency(grandTotal)}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <label className="text-sm text-gray-700">Payment Cleared?</label>
                      {isEditing ? (
                        <input type="checkbox" className="h-4 w-4" checked={billing.cleared} onChange={(e) => setCleared(e.target.checked)} />
                      ) : (
                        <Badge tone={billing.cleared ? "green" : "amber"}>{billing.cleared ? "Cleared" : "Pending"}</Badge>
                      )}
                    </div>

                    {/* NEW: Final confirmation */}
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-gray-700">Confirm Billing Details</label>
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        checked={billing.confirmed}
                        onChange={(e) => setConfirmed(e.target.checked)}
                      />
                      {billing.confirmed && <FiCheckCircle className="text-emerald-600" />}
                    </div>

                    {/* NEW: Download buttons */}
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button className={cls(btnBlue, "w-full")} onClick={downloadInvoicePDF} title="Invoice (PDF)">
                        <FiDownload className="mr-2" /> Download Invoice (PDF)
                      </button>
                      <button className={cls(btnGray, "w-full")} onClick={downloadDischargeDoc} title="Discharge (.doc)">
                        <FiDownload className="mr-2" /> Discharge Summary (Word)
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* NEW: Discharge Summary (with sample template + download) */}
            <div className="px-6 pb-10" id="discharge">
            <div className={cls("rounded-2xl border bg-white p-5 shadow-sm", isEditing && "ring-2 ring-blue-200")}>
              <SectionHeader
                icon={<FiFileText />}
                title="Discharge Summary"
                actions={
                  <div className="flex gap-2">
                    <button className={cls(btnGray, "w-full")} onClick={downloadDischargeDoc} title="Discharge (.doc)">
                        <FiDownload className="mr-2" /> Discharge Summary (Word)
                      </button>
                    {isEditing && <button className={btnBlue} onClick={handleEdit}>Save</button>}
                  </div>
                }
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-700">Diagnosis Summary</label>
                  {isEditing ? (
                    <textarea
                      className={inputBase}
                      rows={3}
                      value={discharge.diagnosisSummary}
                      onChange={(e) => setDischarge((d) => ({ ...d, diagnosisSummary: e.target.value }))}
                      placeholder="Final diagnosis summary"
                    />
                  ) : (
                    <p className="mt-1 text-sm whitespace-pre-wrap">{discharge.diagnosisSummary || "—"}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-gray-700">Clinical Findings</label>
                  {isEditing ? (
                    <textarea
                      className={inputBase}
                      rows={3}
                      value={discharge.clinicalFindings}
                      onChange={(e) => setDischarge((d) => ({ ...d, clinicalFindings: e.target.value }))}
                      placeholder="Key findings"
                    />
                  ) : (
                    <p className="mt-1 text-sm whitespace-pre-wrap">{discharge.clinicalFindings || "—"}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-gray-700">Course in Hospital</label>
                  {isEditing ? (
                    <textarea
                      className={inputBase}
                      rows={3}
                      value={discharge.courseInHospital}
                      onChange={(e) => setDischarge((d) => ({ ...d, courseInHospital: e.target.value }))}
                      placeholder="Progress notes, response to treatment"
                    />
                  ) : (
                    <p className="mt-1 text-sm whitespace-pre-wrap">{discharge.courseInHospital || "—"}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-gray-700">Treatment Given</label>
                  {isEditing ? (
                    <textarea
                      className={inputBase}
                      rows={3}
                      value={discharge.treatmentGiven}
                      onChange={(e) => setDischarge((d) => ({ ...d, treatmentGiven: e.target.value }))}
                      placeholder="Medications, procedures, etc."
                    />
                  ) : (
                    <p className="mt-1 text-sm whitespace-pre-wrap">{discharge.treatmentGiven || "—"}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-gray-700">Advice on Discharge</label>
                  {isEditing ? (
                    <textarea
                      className={inputBase}
                      rows={3}
                      value={discharge.adviceOnDischarge}
                      onChange={(e) => setDischarge((d) => ({ ...d, adviceOnDischarge: e.target.value }))}
                      placeholder="Lifestyle, medications, precautions"
                    />
                  ) : (
                    <p className="mt-1 text-sm whitespace-pre-wrap">{discharge.adviceOnDischarge || "—"}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm text-gray-700">Follow-up Date</label>
                  {isEditing ? (
                    <input
                      type="date"
                      className={inputBase}
                      value={discharge.followUpDate}
                      onChange={(e) => setDischarge((d) => ({ ...d, followUpDate: e.target.value }))}
                    />
                  ) : (
                    <p className="mt-1 text-sm">{discharge.followUpDate || "—"}</p>
                  )}
                </div>
              </div>

              {/* At-a-glance panel */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard icon={<FiCreditCard />} label="Grand Total" value={currency(grandTotal)} hint="All charges combined" tone="amber" />
                <StatCard icon={<FiTrendingUp />} label="Payment Mode" value={billing.paymentMode} hint={billing.paymentMode === "TPA" ? billing.tpaProvider || "—" : "—"} tone="blue" />
                <StatCard icon={<FiActivity />} label="Payment Status" value={billing.cleared ? "Cleared" : "Pending"} tone={billing.cleared ? "green" : "amber"} />
              </div>
            </div>
          </div>
        </div>

        {/* Floating close on mobile */}
        <button
          onClick={handleClose}
          className="fixed bottom-4 right-4 sm:hidden inline-flex items-center gap-2 rounded-2xl bg-white border border-gray-200 shadow-lg px-4 py-2"
        >
          <FiX /> Close
        </button>
      </div>
    </div>
  );
}
