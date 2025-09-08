import React, { useMemo, useState } from "react";

/* ---------------- helpers ---------------- */
const inr = (n) =>
  (Number(n) || 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });

const cls = (...xs) => xs.filter(Boolean).join(" ");

const PayBadge = ({ value }) => {
  const map = {
    Paid: "bg-emerald-100 text-emerald-700 border-emerald-200",
    "Partially Paid": "bg-amber-100 text-amber-800 border-amber-200",
    Unpaid: "bg-rose-100 text-rose-700 border-rose-200",
  };
  return (
    <span
      className={cls(
        "px-2 py-1 rounded-md text-xs font-medium border",
        map[value] || "bg-slate-100 text-slate-700 border-slate-200"
      )}
    >
      {value}
    </span>
  );
};

const StatusBadge = ({ value }) => {
  const map = {
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Completed: "bg-blue-50 text-blue-700 border-blue-200",
    Reviewed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
  return (
    <span
      className={cls(
        "px-2 py-1 rounded-md text-xs font-medium border",
        map[value] || "bg-slate-50 text-slate-700 border-slate-200"
      )}
    >
      {value}
    </span>
  );
};

/* very lightweight CSV <-> array helpers (no quotes/commas-in-fields support) */
const parseCSV = (text) => {
  const [header, ...lines] = text.trim().split(/\r?\n/);
  const keys = header.split(",").map((h) => h.trim());
  return lines
    .map((line) => line.split(","))
    .filter((arr) => arr.some((v) => v && v.trim() !== ""))
    .map((arr) =>
      Object.fromEntries(keys.map((k, i) => [k, (arr[i] ?? "").trim()]))
    );
};

const toCSV = (rows, headers) => {
  const head = headers.join(",");
  const body = rows
    .map((r) =>
      headers.map((h) => (r[h] ?? "").toString().replace(/,/g, " ")).join(",")
    )
    .join("\n");
  return `${head}\n${body}`;
};

const download = (filename, content, mimetype = "text/csv;charset=utf-8;") => {
  const blob = new Blob([content], { type: mimetype });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
};

/* ---------------- sample data (Pathology) ---------------- */
const SAMPLE_TESTS = [
  {
    id: "PAT-2001",
    patientId: "P2101",
    patientName: "Arjun Mehta",
    testType: "CBC",
    sampleType: "Blood",
    collectionDate: "2025-08-20",
    referringDoctor: "Dr. Iyer",
    priority: "Normal",
    fasting: "No",
    tatHrs: 6,
    resultSummary: "Hb 13.5 g/dL, TLC 7.1K/µL, Platelets 2.5L/µL",
    abnormalFlags: "None",
    collectedBy: "Nurse R",
    reportStatus: "Completed",
    billAmount: 500,
    amountPaid: 500,
    paymentMode: "UPI",
  },
  {
    id: "PAT-2002",
    patientId: "P2102",
    patientName: "Sana Khan",
    testType: "LFT",
    sampleType: "Blood",
    collectionDate: "2025-08-19",
    referringDoctor: "Dr. Patel",
    priority: "Normal",
    fasting: "Yes",
    tatHrs: 8,
    resultSummary: "Mildly elevated ALT",
    abnormalFlags: "ALT↑",
    collectedBy: "Phleb K",
    reportStatus: "Reviewed",
    billAmount: 1200,
    amountPaid: 700,
    paymentMode: "Card",
  },
  {
    id: "PAT-2003",
    patientId: "P2103",
    patientName: "Vikram Singh",
    testType: "Urine Routine",
    sampleType: "Urine",
    collectionDate: "2025-08-18",
    referringDoctor: "Dr. Rao",
    priority: "Urgent",
    fasting: "No",
    tatHrs: 3,
    resultSummary: "Leukocytes trace",
    abnormalFlags: "LEU±",
    collectedBy: "Nurse J",
    reportStatus: "Pending",
    billAmount: 300,
    amountPaid: 0,
    paymentMode: "",
  },
  {
    id: "PAT-2004",
    patientId: "P2104",
    patientName: "Neha Sharma",
    testType: "Thyroid Panel",
    sampleType: "Blood",
    collectionDate: "2025-08-18",
    referringDoctor: "Dr. Menon",
    priority: "Normal",
    fasting: "No",
    tatHrs: 10,
    resultSummary: "TSH 6.2 µIU/ml",
    abnormalFlags: "TSH↑",
    collectedBy: "Phleb M",
    reportStatus: "Completed",
    billAmount: 900,
    amountPaid: 900,
    paymentMode: "Cash",
  },
];

const SAMPLE_REPORTS = [
  {
    reportId: "PRPT-9001",
    testId: "PAT-2001",
    patientId: "P2101",
    patientName: "Arjun Mehta",
    testType: "CBC",
    reportDate: "2025-08-20",
    reportStatus: "Completed",
    verifiedBy: "Dr. K. Nair",
    deliveryMode: "Portal",
    paid: "Yes",
  },
  {
    reportId: "PRPT-9002",
    testId: "PAT-2002",
    patientId: "P2102",
    patientName: "Sana Khan",
    testType: "LFT",
    reportDate: "2025-08-19",
    reportStatus: "Reviewed",
    verifiedBy: "Dr. A. Gupta",
    deliveryMode: "Email",
    paid: "Partial",
  },
  {
    reportId: "PRPT-9003",
    testId: "PAT-2003",
    patientId: "P2103",
    patientName: "Vikram Singh",
    testType: "Urine Routine",
    reportDate: "2025-08-18",
    reportStatus: "Pending",
    verifiedBy: "—",
    deliveryMode: "—",
    paid: "No",
  },
];

/* ---------------- main ---------------- */
const Pathology = () => {
  const [activeTab, setActiveTab] = useState("tests"); // 'tests' | 'reports'
  const [tests, setTests] = useState(SAMPLE_TESTS);
  const [reports, setReports] = useState(SAMPLE_REPORTS);
  const [search, setSearch] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    patientId: "",
    patientName: "",
    testType: "",
    sampleType: "",
    collectionDate: "",
    referringDoctor: "",
    priority: "",
    fasting: "",
    tatHrs: "",
    resultSummary: "",
    abnormalFlags: "",
    collectedBy: "",
    reportStatus: "",
    billAmount: "",
    amountPaid: "",
    paymentMode: "",
  });

  /* ---- derived ---- */
  const enhancedTests = useMemo(
    () =>
      tests.map((t) => {
        const bill = Number(t.billAmount) || 0;
        const paid = Number(t.amountPaid) || 0;
        const paymentStatus =
          paid <= 0 ? "Unpaid" : paid < bill ? "Partially Paid" : "Paid";
        const balance = bill - paid;
        return { ...t, paymentStatus, balance };
      }),
    [tests]
  );

  const filteredTests = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return enhancedTests;
    return enhancedTests.filter(
      (t) =>
        t.id.toLowerCase().includes(q) ||
        t.patientId.toLowerCase().includes(q) ||
        t.patientName.toLowerCase().includes(q) ||
        t.testType.toLowerCase().includes(q) ||
        (t.sampleType || "").toLowerCase().includes(q) ||
        (t.referringDoctor || "").toLowerCase().includes(q)
    );
  }, [search, enhancedTests]);

  const filteredReports = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return reports;
    return reports.filter(
      (r) =>
        r.reportId.toLowerCase().includes(q) ||
        r.testId.toLowerCase().includes(q) ||
        r.patientId.toLowerCase().includes(q) ||
        r.patientName.toLowerCase().includes(q) ||
        r.testType.toLowerCase().includes(q) ||
        (r.verifiedBy || "").toLowerCase().includes(q)
    );
  }, [search, reports]);

  const totals = useMemo(() => {
    const bill = enhancedTests.reduce(
      (a, b) => a + (Number(b.billAmount) || 0),
      0
    );
    const paid = enhancedTests.reduce(
      (a, b) => a + (Number(b.amountPaid) || 0),
      0
    );
    const pendingReports = reports.filter(
      (r) => r.reportStatus === "Pending"
    ).length;
    return {
      bill,
      paid,
      bal: bill - paid,
      pendingReports,
      countTests: tests.length,
    };
  }, [enhancedTests, reports, tests.length]);

  /* ---- handlers ---- */
  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((d) => ({ ...d, [name]: value }));
  };

  const resetForm = () =>
    setFormData({
      id: "",
      patientId: "",
      patientName: "",
      testType: "",
      sampleType: "",
      collectionDate: "",
      referringDoctor: "",
      priority: "",
      fasting: "",
      tatHrs: "",
      resultSummary: "",
      abnormalFlags: "",
      collectedBy: "",
      reportStatus: "",
      billAmount: "",
      amountPaid: "",
      paymentMode: "",
    });

  const submitTest = (e) => {
    e.preventDefault();
    const id = formData.id || `PAT-${2000 + tests.length + 1}`;
    const newItem = { ...formData, id };
    setTests((prev) => [newItem, ...prev]);
    setFormOpen(false);
    resetForm();
  };

  const markPaid = (row) => {
    setTests((prev) =>
      prev.map((t) =>
        t.id === row.id
          ? {
              ...t,
              amountPaid: t.billAmount,
              paymentMode: t.paymentMode || "Cash",
            }
          : t
      )
    );
  };

  /* ---- import/export ---- */
  const exportTests = () => {
    const headers = [
      "id",
      "patientId",
      "patientName",
      "testType",
      "sampleType",
      "collectionDate",
      "referringDoctor",
      "priority",
      "fasting",
      "tatHrs",
      "resultSummary",
      "abnormalFlags",
      "collectedBy",
      "reportStatus",
      "billAmount",
      "amountPaid",
      "paymentMode",
      "paymentStatus",
      "balance",
    ];
    const csv = toCSV(enhancedTests, headers);
    download(`pathology_tests_${Date.now()}.csv`, csv);
  };

  const exportReports = () => {
    const headers = [
      "reportId",
      "testId",
      "patientId",
      "patientName",
      "testType",
      "reportDate",
      "reportStatus",
      "verifiedBy",
      "deliveryMode",
      "paid",
    ];
    const csv = toCSV(filteredReports, headers);
    download(`pathology_reports_${Date.now()}.csv`, csv);
  };

  const importTests = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const rows = parseCSV(String(reader.result));
        const mapped = rows.map((r, idx) => ({
          id: r.id || `PAT-IMP-${Date.now()}-${idx + 1}`,
          patientId: r.patientId || "",
          patientName: r.patientName || "",
          testType: r.testType || "",
          sampleType: r.sampleType || "",
          collectionDate: r.collectionDate || "",
          referringDoctor: r.referringDoctor || "",
          priority: r.priority || "",
          fasting: r.fasting || "",
          tatHrs: Number(r.tatHrs || 0),
          resultSummary: r.resultSummary || "",
          abnormalFlags: r.abnormalFlags || "",
          collectedBy: r.collectedBy || "",
          reportStatus: r.reportStatus || "Pending",
          billAmount: Number(r.billAmount || 0),
          amountPaid: Number(r.amountPaid || 0),
          paymentMode: r.paymentMode || "",
        }));
        setTests((prev) => [...mapped, ...prev]);
        alert(`Imported ${mapped.length} test record(s).`);
      } catch (e) {
        alert("Import failed. Please check your CSV columns.");
      }
    };
    reader.readAsText(file);
  };

  const importReports = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const rows = parseCSV(String(reader.result));
        const mapped = rows.map((r, idx) => ({
          reportId: r.reportId || `PRPT-IMP-${Date.now()}-${idx + 1}`,
          testId: r.testId || "",
          patientId: r.patientId || "",
          patientName: r.patientName || "",
          testType: r.testType || "",
          reportDate: r.reportDate || "",
          reportStatus: r.reportStatus || "Pending",
          verifiedBy: r.verifiedBy || "",
          deliveryMode: r.deliveryMode || "",
          paid: r.paid || "No",
        }));
        setReports((prev) => [...mapped, ...prev]);
        alert(`Imported ${mapped.length} report(s).`);
      } catch (e) {
        alert("Import failed. Please check your CSV columns.");
      }
    };
    reader.readAsText(file);
  };

  /* ---- UI ---- */
  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      {/* animations */}
      <style>{`
        .fade-in-up { animation: fadeInUp .35s ease both; }
        @keyframes fadeInUp { from { opacity:.0; transform: translateY(6px) } to { opacity:1; transform: translateY(0) } }
        .pop { animation: pop .22s ease both; } @keyframes pop { from { transform: scale(.98) } to { transform: scale(1) } }
        .row-in { animation: rowIn .28s ease-out both; } @keyframes rowIn { from { opacity:.0; transform: translateY(3px) } to { opacity:1; transform: translateY(0) } }
      `}</style>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Pathology</h2>
          <p className="text-sm text-gray-600">
            Manage pathology tests, reports, and payments.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {activeTab === "tests" ? (
            <>
              <label className="inline-flex">
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(e) =>
                    e.target.files?.[0] && importTests(e.target.files[0])
                  }
                />
                <span className="cursor-pointer inline-flex items-center gap-2 bg-white border px-3 py-2 rounded-md text-sm hover:bg-gray-50">
                  📥 Import Tests (CSV)
                </span>
              </label>
              <button
                onClick={exportTests}
                className="inline-flex items-center gap-2 bg-slate-900 text-white px-3 py-2 rounded-md text-sm hover:bg-slate-800"
              >
                📤 Export Tests
              </button>
              <button
                onClick={() => setFormOpen(true)}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-700"
              >
                ➕ New Test
              </button>
            </>
          ) : (
            <>
              <label className="inline-flex">
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(e) =>
                    e.target.files?.[0] && importReports(e.target.files[0])
                  }
                />
                <span className="cursor-pointer inline-flex items-center gap-2 bg-white border px-3 py-2 rounded-md text-sm hover:bg-gray-50">
                  📥 Import Reports (CSV)
                </span>
              </label>
              <button
                onClick={exportReports}
                className="inline-flex items-center gap-2 bg-slate-900 text-white px-3 py-2 rounded-md text-sm hover:bg-slate-800"
              >
                📤 Export Reports
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div className="inline-flex bg-white border rounded-lg overflow-hidden">
          <button
            onClick={() => setActiveTab("tests")}
            className={cls(
              "px-3 sm:px-4 py-2 text-sm transition",
              activeTab === "tests"
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-50"
            )}
          >
            Tests
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={cls(
              "px-3 sm:px-4 py-2 text-sm transition",
              activeTab === "reports"
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-50"
            )}
          >
            Test Reports
          </button>
        </div>

        <div className="flex-1">
          <div className="relative">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by patient, ID, test, doctor, sample…"
              className="w-full sm:max-w-sm bg-white border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <span className="absolute right-3 top-2.5 text-gray-400">🔎</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <div className="bg-white border rounded-xl p-3 pop">
          <div className="text-xs text-slate-500">Total Tests</div>
          <div className="text-lg font-semibold">{totals.countTests}</div>
        </div>
        <div className="bg-white border rounded-xl p-3 pop">
          <div className="text-xs text-slate-500">Total Bill</div>
          <div className="text-lg font-semibold">{inr(totals.bill)}</div>
        </div>
        <div className="bg-white border rounded-xl p-3 pop">
          <div className="text-xs text-slate-500">Collected</div>
          <div className="text-lg font-semibold text-emerald-700">
            {inr(totals.paid)}
          </div>
        </div>
        <div className="bg-white border rounded-xl p-3 pop">
          <div className="text-xs text-slate-500">Pending Reports</div>
          <div className="text-lg font-semibold text-amber-700">
            {totals.pendingReports}
          </div>
        </div>
      </div>

      {/* Content */}
      {activeTab === "tests" ? (
        <div className="bg-white shadow-sm rounded-xl border overflow-hidden fade-in-up">
          <div className="overflow-x-auto">
            <table className="min-w-[1100px] w-full divide-y divide-gray-200">
              <thead className="bg-blue-50 text-slate-700 text-xs uppercase">
                <tr className="text-left">
                  <th className="px-4 py-3">Test ID</th>
                  <th className="px-4 py-3">Patient</th>
                  <th className="px-4 py-3">Test</th>
                  <th className="px-4 py-3">Sample</th>
                  <th className="px-4 py-3">Collected</th>
                  <th className="px-4 py-3 hidden lg:table-cell">Doctor</th>
                  <th className="px-4 py-3 hidden xl:table-cell">Priority</th>
                  <th className="px-4 py-3 hidden md:table-cell">Fasting</th>
                  <th className="px-4 py-3 hidden md:table-cell">TAT (hrs)</th>
                  <th className="px-4 py-3">Bill</th>
                  <th className="px-4 py-3">Paid</th>
                  <th className="px-4 py-3">Balance</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3 hidden md:table-cell">Report</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTests.length === 0 ? (
                  <tr>
                    <td
                      colSpan={15}
                      className="px-4 py-10 text-center text-sm text-slate-500"
                    >
                      No matching tests.
                    </td>
                  </tr>
                ) : (
                  filteredTests.map((t, i) => (
                    <tr
                      key={t.id}
                      className="row-in"
                      style={{ animationDelay: `${i * 30}ms` }}
                    >
                      <td className="px-4 py-3 text-sm font-medium">{t.id}</td>
                      <td className="px-4 py-3 text-sm">
                        {t.patientName}{" "}
                        <span className="text-slate-400">({t.patientId})</span>
                      </td>
                      <td className="px-4 py-3 text-sm">{t.testType}</td>
                      <td className="px-4 py-3 text-sm">{t.sampleType || "—"}</td>
                      <td className="px-4 py-3 text-sm">{t.collectionDate}</td>
                      <td className="px-4 py-3 text-sm hidden lg:table-cell">
                        {t.referringDoctor || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm hidden xl:table-cell">
                        {t.priority || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm hidden md:table-cell">
                        {t.fasting || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm hidden md:table-cell">
                        {t.tatHrs ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">
                        {inr(t.billAmount)}
                      </td>
                      <td className="px-4 py-3 text-sm text-emerald-700">
                        {inr(t.amountPaid)}
                      </td>
                      <td
                        className={cls(
                          "px-4 py-3 text-sm",
                          t.balance > 0 ? "text-rose-600" : "text-emerald-700"
                        )}
                      >
                        {inr(t.balance)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <PayBadge value={t.paymentStatus} />
                        {t.paymentMode ? (
                          <span className="ml-2 text-xs text-slate-500">
                            ({t.paymentMode})
                          </span>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 text-sm hidden md:table-cell">
                        <StatusBadge value={t.reportStatus || "Pending"} />
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          {t.paymentStatus !== "Paid" && (
                            <button
                              onClick={() => markPaid(t)}
                              className="rounded-md border px-2 py-1 text-xs hover:bg-gray-50"
                              title="Mark fully paid"
                            >
                              Mark Paid
                            </button>
                          )}
                          <button className="rounded-md border px-2 py-1 text-xs hover:bg-gray-50">
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 text-xs text-slate-500">
            * Import/Export supports CSV (simple, no quoted fields).
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-xl border overflow-hidden fade-in-up">
          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full divide-y divide-gray-200">
              <thead className="bg-blue-50 text-slate-700 text-xs uppercase">
                <tr className="text-left">
                  <th className="px-4 py-3">Report ID</th>
                  <th className="px-4 py-3">Test ID</th>
                  <th className="px-4 py-3">Patient</th>
                  <th className="px-4 py-3 hidden md:table-cell">Test</th>
                  <th className="px-4 py-3">Report Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 hidden lg:table-cell">Verified By</th>
                  <th className="px-4 py-3 hidden xl:table-cell">Delivery</th>
                  <th className="px-4 py-3">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredReports.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-4 py-10 text-center text-sm text-slate-500"
                    >
                      No matching reports.
                    </td>
                  </tr>
                ) : (
                  filteredReports.map((r, i) => (
                    <tr
                      key={r.reportId}
                      className="row-in"
                      style={{ animationDelay: `${i * 30}ms` }}
                    >
                      <td className="px-4 py-3 text-sm font-medium">
                        {r.reportId}
                      </td>
                      <td className="px-4 py-3 text-sm">{r.testId}</td>
                      <td className="px-4 py-3 text-sm">
                        {r.patientName}{" "}
                        <span className="text-slate-400">({r.patientId})</span>
                      </td>
                      <td className="px-4 py-3 text-sm hidden md:table-cell">
                        {r.testType}
                      </td>
                      <td className="px-4 py-3 text-sm">{r.reportDate}</td>
                      <td className="px-4 py-3 text-sm">
                        <StatusBadge value={r.reportStatus} />
                      </td>
                      <td className="px-4 py-3 text-sm hidden lg:table-cell">
                        {r.verifiedBy || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm hidden xl:table-cell">
                        {r.deliveryMode || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <PayBadge
                          value={
                            r.paid === "Yes"
                              ? "Paid"
                              : r.paid === "Partial"
                              ? "Partially Paid"
                              : "Unpaid"
                          }
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 text-xs text-slate-500">
            * Import/Export supports CSV (simple, no quoted fields).
          </div>
        </div>
      )}

      {/* New Test Modal */}
      {formOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white shadow-xl rounded-xl w-full max-w-5xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-blue-600 text-white">
              <div className="font-semibold">New Pathology Test</div>
              <button
                onClick={() => {
                  setFormOpen(false);
                  resetForm();
                }}
                className="rounded-md bg-white/10 px-2 py-1"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Content */}
            <form
              onSubmit={submitTest}
              className="p-8 space-y-6 overflow-y-auto flex-1"
            >
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold mb-3">Patient & Test</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700">
                      Patient ID *
                    </label>
                    <input
                      name="patientId"
                      value={formData.patientId}
                      onChange={onChange}
                      required
                      className="mt-1 w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Pxxxx"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700">
                      Patient Name *
                    </label>
                    <input
                      name="patientName"
                      value={formData.patientName}
                      onChange={onChange}
                      required
                      className="mt-1 w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700">
                      Collection Date *
                    </label>
                    <input
                      type="date"
                      name="collectionDate"
                      value={formData.collectionDate}
                      onChange={onChange}
                      required
                      className="mt-1 w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700">
                      Test Type *
                    </label>
                    <select
                      name="testType"
                      value={formData.testType}
                      onChange={onChange}
                      required
                      className="mt-1 w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="">Select</option>
                      <option value="CBC">CBC</option>
                      <option value="LFT">LFT</option>
                      <option value="KFT">KFT</option>
                      <option value="Lipid Profile">Lipid Profile</option>
                      <option value="Thyroid Panel">Thyroid Panel</option>
                      <option value="Urine Routine">Urine Routine</option>
                      <option value="COVID-19 PCR">COVID-19 PCR</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700">
                      Sample Type *
                    </label>
                    <select
                      name="sampleType"
                      value={formData.sampleType}
                      onChange={onChange}
                      required
                      className="mt-1 w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="">Select</option>
                      <option>Blood</option>
                      <option>Urine</option>
                      <option>Stool</option>
                      <option>Swab</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700">
                      Priority *
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={onChange}
                      required
                      className="mt-1 w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="">Select</option>
                      <option>Normal</option>
                      <option>Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700">
                      Fasting *
                    </label>
                    <select
                      name="fasting"
                      value={formData.fasting}
                      onChange={onChange}
                      required
                      className="mt-1 w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="">Select</option>
                      <option>No</option>
                      <option>Yes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700">
                      TAT (hours)
                    </label>
                    <input
                      type="number"
                      name="tatHrs"
                      min={0}
                      value={formData.tatHrs}
                      onChange={onChange}
                      className="mt-1 w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="e.g. 6"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700">
                      Referring Doctor
                    </label>
                    <input
                      name="referringDoctor"
                      value={formData.referringDoctor}
                      onChange={onChange}
                      className="mt-1 w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Dr. Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700">
                      Collected By
                    </label>
                    <input
                      name="collectedBy"
                      value={formData.collectedBy}
                      onChange={onChange}
                      className="mt-1 w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Staff"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700">
                      Report Status *
                    </label>
                    <select
                      name="reportStatus"
                      value={formData.reportStatus}
                      onChange={onChange}
                      required
                      className="mt-1 w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="">Select</option>
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                      <option value="Reviewed">Reviewed</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold mb-3">Billing</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700">
                      Bill Amount *
                    </label>
                    <input
                      type="number"
                      name="billAmount"
                      value={formData.billAmount}
                      onChange={onChange}
                      required
                      min={0}
                      className="mt-1 w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700">
                      Amount Paid
                    </label>
                    <input
                      type="number"
                      name="amountPaid"
                      value={formData.amountPaid}
                      onChange={onChange}
                      min={0}
                      className="mt-1 w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700">
                      Payment Mode
                    </label>
                    <select
                      name="paymentMode"
                      value={formData.paymentMode}
                      onChange={onChange}
                      className="mt-1 w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="">Select</option>
                      <option>Cash</option>
                      <option>Card</option>
                      <option>UPI</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold mb-3">
                  Result Summary & Flags
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700">
                      Result Summary
                    </label>
                    <textarea
                      rows={4}
                      name="resultSummary"
                      value={formData.resultSummary}
                      onChange={onChange}
                      className="mt-1 w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none resize-y"
                      placeholder="Key parameters and summary…"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700">
                      Abnormal Flags
                    </label>
                    <textarea
                      rows={4}
                      name="abnormalFlags"
                      value={formData.abnormalFlags}
                      onChange={onChange}
                      className="mt-1 w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none resize-y"
                      placeholder="e.g., ALT↑, TSH↑, LEU±"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setFormOpen(false);
                    resetForm();
                  }}
                  className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pathology;
