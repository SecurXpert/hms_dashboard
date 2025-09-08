import React, { useMemo, useState } from "react";

/* ---------------- helpers ---------------- */
const INR = (n) =>
  (Number(n) || 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });

const within = (d, start, end) => {
  const x = new Date(d).setHours(0, 0, 0, 0);
  return x >= new Date(start).setHours(0, 0, 0, 0) && x <= new Date(end).setHours(0, 0, 0, 0);
};

const matchesKw = (obj, kw) =>
  kw === "" ||
  Object.values(obj)
    .join(" ")
    .toLowerCase()
    .includes(kw.toLowerCase());

/* ---------------- sample dynamic data ---------------- */
const today = new Date();
const d = (off) =>
  new Date(today.getFullYear(), today.getMonth(), today.getDate() - off)
    .toISOString()
    .slice(0, 10);

const financeTx = [
  { id: "F1", date: d(1), type: "income", group: "OPD", amount: 3500, desc: "OPD Dr. Mehta" },
  { id: "F2", date: d(2), type: "income", group: "Pharmacy", amount: 11250, desc: "Retail sale" },
  { id: "F3", date: d(2), type: "expense", group: "Supplies", amount: 4200, desc: "Cotton packs" },
  { id: "F4", date: d(3), type: "income", group: "Pathology", amount: 6400, desc: "CBC + LFT" },
  { id: "F5", date: d(5), type: "expense", group: "Maintenance", amount: 2500, desc: "AC service" },
];

const appointments = [
  { id: "A1", date: d(0), patient: "Rahul Verma", doctor: "Dr. Mehta", fee: 300 },
  { id: "A2", date: d(1), patient: "Imran Khan", doctor: "Dr. Kapoor", fee: 300 },
  { id: "A3", date: d(2), patient: "Suhasini Iyer", doctor: "Dr. Nair", fee: 300 },
];

const opd = [
  { id: "O1", date: d(0), patient: "Rahul Verma", doctor: "Dr. Mehta", consult: 500, procedure: 0 },
  { id: "O2", date: d(1), patient: "Imran Khan", doctor: "Dr. Nair", consult: 500, procedure: 250 },
  { id: "O3", date: d(3), patient: "Suhasini Iyer", doctor: "Dr. Kapoor", consult: 500, procedure: 0 },
];

const ipd = [
  {
    id: "I1",
    admitDate: d(5),
    dischargeDate: d(3),
    patient: "Deepa Shah",
    room: "Private",
    roomRate: 3500,
    days: 3,
    nursing: 1200,
    misc: 800,
  },
  {
    id: "I2",
    admitDate: d(4),
    dischargeDate: d(0),
    patient: "Mahesh Patil",
    room: "Semi-Private",
    roomRate: 2200,
    days: 5,
    nursing: 1500,
    misc: 500,
  },
];

const pharmacy = [
  { id: "P1", date: d(0), items: 5, amount: 1800, counter: "PH-1" },
  { id: "P2", date: d(1), items: 2, amount: 420, counter: "PH-2" },
  { id: "P3", date: d(3), items: 9, amount: 3225, counter: "PH-1" },
];

const pathology = [
  { id: "PA1", date: d(0), patient: "Rahul Verma", test: "CBC", amount: 300 },
  { id: "PA2", date: d(1), patient: "Imran Khan", test: "LFT", amount: 800 },
  { id: "PA3", date: d(2), patient: "Suhasini Iyer", test: "Urine R/M", amount: 250 },
];

const radiology = [
  { id: "R1", date: d(1), patient: "Imran Khan", test: "X-Ray Chest", amount: 600 },
  { id: "R2", date: d(2), patient: "Suhasini Iyer", test: "USG Abdomen", amount: 1500 },
];

const bloodBank = [
  { id: "B1", date: d(1), component: "PRBC", units: 1, amount: 1200, patient: "R. Gupta" },
  { id: "B2", date: d(2), component: "FFP", units: 2, amount: 1800, patient: "R. Gupta" },
];

const ambulance = [
  { id: "AM1", date: d(0), distanceKm: 12, base: 1000, amount: 1550, patient: "A. Bhatt" },
  { id: "AM2", date: d(3), distanceKm: 6, base: 1000, amount: 1200, patient: "S. Ghosh" },
];

const births = [{ id: "BR1", date: d(2), baby: "Baby of Aisha", fee: 0 }];
const deaths = [{ id: "DE1", date: d(5), name: "M. Rao", fee: 0 }];

const tpa = [
  { id: "T1", date: d(3), insurer: "Health Life Insurance", claimed: 55000, approved: 52000 },
  { id: "T2", date: d(1), insurer: "Star Health", claimed: 28000, approved: 27000 },
];

const inventory = [
  { id: "INV1", date: d(0), item: "PPE Kit", qty: 20, amount: 20000, supplier: "VK Supplier" },
  { id: "INV2", date: d(4), item: "Cotton Packs", qty: 100, amount: 4500, supplier: "Quick Service" },
];

const patients = [
  { id: "PT1", name: "Deepa Shah", outstanding: 1250 },
  { id: "PT2", name: "Mahesh Patil", outstanding: 0 },
  { id: "PT3", name: "Rahul Verma", outstanding: 300 },
];

const ot = [
  { id: "OT1", date: d(1), patient: "Deepa Shah", procedure: "Lap Appendectomy", charges: 32000 },
  { id: "OT2", date: d(5), patient: "Mahesh Patil", procedure: "Hernia Repair", charges: 28000 },
];

const logs = [
  { id: "LG1", date: d(0), user: "Super Admin", module: "Inventory", action: "Issued PPE 5" },
  { id: "LG2", date: d(1), user: "Accountant", module: "Finance", action: "Booked expense" },
  { id: "LG3", date: d(3), user: "Reception", module: "OPD", action: "Closed OPD bill" },
];

/* ---------------- details drawer with day/month filters ---------------- */
const Drawer = ({ open, onClose, title, columns, rows, dateKey }) => {
  const [q, setQ] = useState("");
  const [day, setDay] = useState(""); // YYYY-MM-DD
  const [month, setMonth] = useState(""); // YYYY-MM

  const getDateString = (r) => {
    if (!dateKey) return null;
    const v = r[dateKey];
    if (!v) return null;
    // assume ISO-like yyyy-mm-dd or yyyy-mm
    return String(v);
  };

  const filtered = useMemo(() => {
    let x = rows || [];
    // keyword search
    if (q.trim()) {
      x = x.filter((r) => matchesKw(r, q));
    }
    // day filter takes priority
    if (dateKey && day) {
      x = x.filter((r) => {
        const ds = getDateString(r);
        return ds && ds.slice(0, 10) === day;
      });
    } else if (dateKey && month) {
      x = x.filter((r) => {
        const ds = getDateString(r);
        return ds && ds.slice(0, 7) === month;
      });
    }
    return x;
  }, [rows, q, day, month, dateKey]);

  const exportCsv = () => {
    const header = columns.map((c) => c.label);
    const flat = filtered.map((r) =>
      columns
        .map((c) => {
          const v = typeof c.render === "function" ? c.render(r) : r[c.key];
          return `"${String(v ?? "").replace(/"/g, '""')}"`;
        })
        .join(",")
    );
    const blob = new Blob([header.join(",") + "\n" + flat.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "_").toLowerCase()}_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(filtered, null, 2)], {
      type: "application/json;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "_").toLowerCase()}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printView = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    const head = `<tr>${columns
      .map(
        (c) =>
          `<th style="padding:6px;border:1px solid #e5e7eb;text-align:left;font-family:sans-serif;">${c.label}</th>`
      )
      .join("")}</tr>`;
    const body = filtered
      .map(
        (r) =>
          `<tr>${columns
            .map((c) => {
              const v = typeof c.render === "function" ? c.render(r) : r[c.key];
              return `<td style="padding:6px;border:1px solid #e5e7eb;font-family:sans-serif;">${v ?? ""}</td>`;
            })
            .join("")}</tr>`
      )
      .join("");
    w.document.write(
      `<title>${title}</title><table style="border-collapse:collapse">${head}${body}</table>`
    );
    w.print();
    w.close();
  };

  if (!open) return null;

  // compute small quick stats if numeric columns like amount/fee/etc exist
  const sumKeys = ["amount", "fee", "consult", "procedure", "charges", "approved", "claimed", "outstanding"];
  const totals = sumKeys
    .map((k) => ({ k, v: filtered.reduce((a, r) => a + (Number(r[k]) || 0), 0) }))
    .filter((x) => x.v > 0);

  const hasDate = Boolean(dateKey);

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="w-full sm:w-[48rem] h-full bg-white shadow-2xl flex flex-col animate-[slide_.2s_ease-out_forwards] translate-x-4 opacity-0">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="font-semibold">{title}</div>
          <div className="flex items-center gap-2">
            <button onClick={exportCsv} className="rounded-md border px-3 py-1.5 text-sm hover:bg-slate-50">
              ⤓ CSV
            </button>
            <button onClick={exportJson} className="rounded-md border px-3 py-1.5 text-sm hover:bg-slate-50">
              ⤓ JSON
            </button>
            <button onClick={printView} className="rounded-md border px-3 py-1.5 text-sm hover:bg-slate-50">
              🖨️ Print
            </button>
            <button onClick={onClose} className="text-xl leading-none">
              ×
            </button>
          </div>
        </div>

        {/* Filters row */}
        <div className="px-4 py-3 border-b">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search within results…"
              className="rounded-md border px-3 py-2 text-sm"
            />
            {hasDate && (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 shrink-0">Day</span>
                  <input
                    type="date"
                    value={day}
                    onChange={(e) => {
                      setDay(e.target.value);
                      setMonth(""); // day takes priority
                    }}
                    className="w-full rounded-md border px-2 py-1.5 text-sm"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 shrink-0">Month</span>
                  <input
                    type="month"
                    value={month}
                    onChange={(e) => {
                      setMonth(e.target.value);
                      setDay(""); // clear day when month set
                    }}
                    className="w-full rounded-md border px-2 py-1.5 text-sm"
                  />
                </div>
                <button
                  className="rounded-md border px-3 py-1.5 text-sm hover:bg-slate-50"
                  onClick={() => {
                    setQ("");
                    setDay("");
                    setMonth("");
                  }}
                >
                  Clear
                </button>
              </>
            )}
          </div>

          {/* Totals chips */}
          {totals.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {totals.map((t) => (
                <span key={t.k} className="px-2 py-1 text-xs rounded bg-slate-100">
                  {t.k}: <b>{INR(t.v)}</b>
                </span>
              ))}
              <span className="px-2 py-1 text-xs rounded bg-blue-50 text-blue-700">
                Rows: <b>{filtered.length}</b>
              </span>
            </div>
          )}
        </div>

        {/* Body table */}
        <div className="flex-1 overflow-auto p-4">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-slate-600 border-b">
              <tr className="text-left">
                {columns.map((c) => (
                  <th key={c.key || c.label} className="py-2 pr-4">
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b last:border-b-0">
                  {columns.map((c) => (
                    <td key={(c.key || c.label) + r.id} className="py-2 pr-4">
                      {typeof c.render === "function" ? c.render(r) : r[c.key]}
                    </td>
                  ))}
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={columns.length} className="text-center py-6 text-slate-500">
                    No rows.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        @keyframes slide { to { opacity: 1; transform: translateX(0) } }
      `}</style>
    </div>
  );
};

/* ---------------- KPI card ---------------- */
const Card = ({ icon, title, kpi1, kpi2, onOpen }) => (
  <div className="rounded-xl border bg-white p-4 hover:shadow-md transition animate-[pop_.18s_ease-out_forwards] opacity-0 scale-[.98]">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="text-2xl">{icon}</div>
        <div className="font-semibold">{title}</div>
      </div>
      <button
        onClick={onOpen}
        className="rounded-md border bg-white px-3 py-1.5 text-sm hover:bg-slate-50 active:scale-[.98] transition"
      >
        Details
      </button>
    </div>
    <div className="mt-4 grid grid-cols-2 gap-3">
      <div className="rounded-lg bg-slate-50 p-3">
        <div className="text-xs text-slate-500">{kpi1.label}</div>
        <div className="text-lg font-semibold">{kpi1.value}</div>
      </div>
      <div className="rounded-lg bg-slate-50 p-3">
        <div className="text-xs text-slate-500">{kpi2.label}</div>
        <div className="text-lg font-semibold">{kpi2.value}</div>
      </div>
    </div>
  </div>
);

/* ---------------- main ---------------- */
const Reports = () => {
  const [dateFrom, setDateFrom] = useState(d(7));
  const [dateTo, setDateTo] = useState(d(0));
  const [kw, setKw] = useState("");

  // state for drawers
  const [drawer, setDrawer] = useState({ open: false, title: "", columns: [], rows: [], dateKey: null });

  const filterRows = (rows, dateKey = "date") =>
    rows.filter((r) => within(r[dateKey], dateFrom, dateTo) && matchesKw(r, kw));

  /* --- FINANCE --- */
  const financeRows = useMemo(() => filterRows(financeTx), [dateFrom, dateTo, kw]);
  const financeIncome = financeRows.filter((t) => t.type === "income").reduce((a, b) => a + b.amount, 0);
  const financeExp = financeRows.filter((t) => t.type === "expense").reduce((a, b) => a + b.amount, 0);

  /* --- APPOINTMENTS --- */
  const apptRows = useMemo(() => filterRows(appointments), [dateFrom, dateTo, kw]);
  const apptTotal = apptRows.reduce((a, b) => a + b.fee, 0);

  /* --- OPD --- */
  const opdRows = useMemo(() => filterRows(opd), [dateFrom, dateTo, kw]);
  const opdTotal = opdRows.reduce((a, b) => a + b.consult + b.procedure, 0);

  /* --- IPD --- */
  const ipdRows = useMemo(
    () =>
      ipd
        .filter(
          (r) =>
            within(r.admitDate, dateFrom, dateTo) ||
            within(r.dischargeDate, dateFrom, dateTo) ||
            within(d(0), r.admitDate, r.dischargeDate) // active
        )
        .filter((r) => matchesKw(r, kw)),
    [dateFrom, dateTo, kw]
  );
  const ipdTotal = ipdRows.reduce((a, b) => a + b.roomRate * b.days + b.nursing + b.misc, 0);

  /* --- Pharmacy, Path, Radio --- */
  const phRows = useMemo(() => filterRows(pharmacy), [dateFrom, dateTo, kw]);
  const phTotal = phRows.reduce((a, b) => a + b.amount, 0);

  const paRows = useMemo(() => filterRows(pathology), [dateFrom, dateTo, kw]);
  const paTotal = paRows.reduce((a, b) => a + b.amount, 0);

  const raRows = useMemo(() => filterRows(radiology), [dateFrom, dateTo, kw]);
  const raTotal = raRows.reduce((a, b) => a + b.amount, 0);

  /* --- Blood bank --- */
  const bbRows = useMemo(() => filterRows(bloodBank), [dateFrom, dateTo, kw]);
  const bbTotal = bbRows.reduce((a, b) => a + b.amount, 0);

  /* --- Ambulance --- */
  const amRows = useMemo(() => filterRows(ambulance), [dateFrom, dateTo, kw]);
  const amTotal = amRows.reduce((a, b) => a + b.amount, 0);

  /* --- Birth & Death --- */
  const birthsRows = useMemo(() => filterRows(births), [dateFrom, dateTo, kw]);
  const deathsRows = useMemo(() => filterRows(deaths), [dateFrom, dateTo, kw]);

  /* --- TPA --- */
  const tpaRows = useMemo(() => filterRows(tpa), [dateFrom, dateTo, kw]);
  const tpaClaimed = tpaRows.reduce((a, b) => a + b.claimed, 0);
  const tpaApproved = tpaRows.reduce((a, b) => a + b.approved, 0);

  /* --- Inventory --- */
  const invRows = useMemo(() => filterRows(inventory), [dateFrom, dateTo, kw]);
  const invPurchase = invRows.reduce((a, b) => a + b.amount, 0);

  /* --- Patients --- */
  const patientRows = useMemo(() => patients.filter((p) => matchesKw(p, kw)), [kw]);
  const totalOutstanding = patientRows.reduce((a, b) => a + b.outstanding, 0);

  /* --- OT --- */
  const otRows = useMemo(() => filterRows(ot), [dateFrom, dateTo, kw]);
  const otTotal = otRows.reduce((a, b) => a + b.charges, 0);

  /* --- Logs --- */
  const logRows = useMemo(() => filterRows(logs), [dateFrom, dateTo, kw]);

  // Drawer opener utility (now includes dateKey so drawer can filter by day/month)
  const openDrawer = (title, columns, rows, dateKey = "date") =>
    setDrawer({ open: true, title, columns, rows, dateKey });

  return (
    <div className="min-h-screen bg-slate-100 p-4">
      <div className="rounded-lg border bg-white overflow-hidden">
        {/* header */}
        <div className="flex flex-col gap-3 px-4 py-3 border-b md:flex-row md:items-center md:justify-between">
          <div className="text-base font-semibold">Financial Reports</div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm text-slate-600">From</span>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="rounded-md border px-2 py-1 text-sm"
              />
              <span className="text-sm text-slate-600">To</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="rounded-md border px-2 py-1 text-sm"
              />
            </div>
            <input
              value={kw}
              onChange={(e) => setKw(e.target.value)}
              placeholder="Search across reports…"
              className="w-full md:w-64 rounded-md border px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* grid */}
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <Card
            icon="💰"
            title="Finance"
            kpi1={{ label: "Income", value: INR(financeIncome) }}
            kpi2={{ label: "Expense", value: INR(financeExp) }}
            onOpen={() =>
              openDrawer(
                "Finance Transactions",
                [
                  { label: "Date", key: "date" },
                  { label: "Type", key: "type" },
                  { label: "Group", key: "group" },
                  { label: "Description", key: "desc" },
                  { label: "Amount", render: (r) => INR(r.amount) },
                ],
                financeRows,
                "date"
              )
            }
          />

          <Card
            icon="📅"
            title="Appointments"
            kpi1={{ label: "Appointments", value: apptRows.length }}
            kpi2={{ label: "Fees", value: INR(apptTotal) }}
            onOpen={() =>
              openDrawer(
                "Appointment Report",
                [
                  { label: "Date", key: "date" },
                  { label: "Patient", key: "patient" },
                  { label: "Doctor", key: "doctor" },
                  { label: "Fee", render: (r) => INR(r.fee) },
                ],
                apptRows,
                "date"
              )
            }
          />

          <Card
            icon="🩺"
            title="OPD"
            kpi1={{ label: "Visits", value: opdRows.length }}
            kpi2={{ label: "Charges", value: INR(opdTotal) }}
            onOpen={() =>
              openDrawer(
                "OPD Report",
                [
                  { label: "Date", key: "date" },
                  { label: "Patient", key: "patient" },
                  { label: "Doctor", key: "doctor" },
                  { label: "Consult", render: (r) => INR(r.consult) },
                  { label: "Procedure", render: (r) => INR(r.procedure) },
                  { label: "Total", render: (r) => INR(r.consult + r.procedure) },
                ],
                opdRows,
                "date"
              )
            }
          />

          <Card
            icon="🏥"
            title="IPD"
            kpi1={{ label: "Admissions", value: ipdRows.length }}
            kpi2={{
              label: "Bill Amount",
              value: INR(ipdTotal),
            }}
            onOpen={() =>
              openDrawer(
                "IPD Report",
                [
                  { label: "Admit", key: "admitDate" },
                  { label: "Discharge", key: "dischargeDate" },
                  { label: "Patient", key: "patient" },
                  { label: "Room", key: "room" },
                  { label: "Days", key: "days" },
                  { label: "Room Charges", render: (r) => INR(r.roomRate * r.days) },
                  { label: "Nursing", render: (r) => INR(r.nursing) },
                  { label: "Misc", render: (r) => INR(r.misc) },
                  { label: "Total", render: (r) => INR(r.roomRate * r.days + r.nursing + r.misc) },
                ],
                ipdRows,
                "admitDate" // filter by admission day/month
              )
            }
          />

          <Card
            icon="💊"
            title="Pharmacy"
            kpi1={{ label: "Bills", value: phRows.length }}
            kpi2={{ label: "Sales", value: INR(phTotal) }}
            onOpen={() =>
              openDrawer(
                "Pharmacy Sales",
                [
                  { label: "Date", key: "date" },
                  { label: "Counter", key: "counter" },
                  { label: "Items", key: "items" },
                  { label: "Amount", render: (r) => INR(r.amount) },
                ],
                phRows,
                "date"
              )
            }
          />

          <Card
            icon="🧪"
            title="Pathology"
            kpi1={{ label: "Tests", value: paRows.length }}
            kpi2={{ label: "Revenue", value: INR(paTotal) }}
            onOpen={() =>
              openDrawer(
                "Pathology Tests",
                [
                  { label: "Date", key: "date" },
                  { label: "Patient", key: "patient" },
                  { label: "Test", key: "test" },
                  { label: "Amount", render: (r) => INR(r.amount) },
                ],
                paRows,
                "date"
              )
            }
          />

          <Card
            icon="🩻"
            title="Radiology"
            kpi1={{ label: "Studies", value: raRows.length }}
            kpi2={{ label: "Revenue", value: INR(raTotal) }}
            onOpen={() =>
              openDrawer(
                "Radiology Tests",
                [
                  { label: "Date", key: "date" },
                  { label: "Patient", key: "patient" },
                  { label: "Test", key: "test" },
                  { label: "Amount", render: (r) => INR(r.amount) },
                ],
                raRows,
                "date"
              )
            }
          />

          <Card
            icon="🩸"
            title="Blood Bank"
            kpi1={{ label: "Issues", value: bbRows.length }}
            kpi2={{ label: "Revenue", value: INR(bbTotal) }}
            onOpen={() =>
              openDrawer(
                "Blood Bank Issues",
                [
                  { label: "Date", key: "date" },
                  { label: "Patient", key: "patient" },
                  { label: "Component", key: "component" },
                  { label: "Units", key: "units" },
                  { label: "Amount", render: (r) => INR(r.amount) },
                ],
                bbRows,
                "date"
              )
            }
          />

          <Card
            icon="🚑"
            title="Ambulance"
            kpi1={{ label: "Calls", value: amRows.length }}
            kpi2={{ label: "Revenue", value: INR(amTotal) }}
            onOpen={() =>
              openDrawer(
                "Ambulance Calls",
                [
                  { label: "Date", key: "date" },
                  { label: "Patient", key: "patient" },
                  { label: "Distance (km)", key: "distanceKm" },
                  { label: "Amount", render: (r) => INR(r.amount) },
                ],
                amRows,
                "date"
              )
            }
          />

          <Card
            icon="👶⚰️"
            title="Birth & Death"
            kpi1={{ label: "Births", value: birthsRows.length }}
            kpi2={{ label: "Deaths", value: deathsRows.length }}
            onOpen={() =>
              openDrawer(
                "Births & Deaths",
                [
                  { label: "Type", render: (r) => (r.baby ? "Birth" : "Death") },
                  { label: "Date", key: "date" },
                  { label: "Name", render: (r) => r.baby || r.name },
                  { label: "Fee", render: (r) => (r.fee ? INR(r.fee) : "—") },
                ],
                [...birthsRows, ...deathsRows],
                "date"
              )
            }
          />

          <Card
            icon="🤝"
            title="TPA"
            kpi1={{ label: "Claims", value: tpaRows.length }}
            kpi2={{ label: "Approved", value: INR(tpaApproved) }}
            onOpen={() =>
              openDrawer(
                "TPA Claims",
                [
                  { label: "Date", key: "date" },
                  { label: "Insurer", key: "insurer" },
                  { label: "Claimed", render: (r) => INR(r.claimed) },
                  { label: "Approved", render: (r) => INR(r.approved) },
                ],
                tpaRows,
                "date"
              )
            }
          />

          <Card
            icon="📦"
            title="Inventory"
            kpi1={{ label: "Purchases", value: invRows.length }}
            kpi2={{ label: "Spend", value: INR(invPurchase) }}
            onOpen={() =>
              openDrawer(
                "Inventory Purchases",
                [
                  { label: "Date", key: "date" },
                  { label: "Item", key: "item" },
                  { label: "Qty", key: "qty" },
                  { label: "Supplier", key: "supplier" },
                  { label: "Amount", render: (r) => INR(r.amount) },
                ],
                invRows,
                "date"
              )
            }
          />

          <Card
            icon="🧑‍🤝‍🧑"
            title="Patients"
            kpi1={{ label: "Patients", value: patientRows.length }}
            kpi2={{ label: "Outstanding", value: INR(totalOutstanding) }}
            onOpen={() =>
              openDrawer(
                "Patient Outstanding",
                [
                  { label: "Patient", key: "name" },
                  { label: "Outstanding", render: (r) => INR(r.outstanding) },
                ],
                patientRows,
                null // no day/month filters for this card
              )
            }
          />

          <Card
            icon="🛠️"
            title="OT"
            kpi1={{ label: "Surgeries", value: otRows.length }}
            kpi2={{ label: "Charges", value: INR(otTotal) }}
            onOpen={() =>
              openDrawer(
                "OT Report",
                [
                  { label: "Date", key: "date" },
                  { label: "Patient", key: "patient" },
                  { label: "Procedure", key: "procedure" },
                  { label: "Charges", render: (r) => INR(r.charges) },
                ],
                otRows,
                "date"
              )
            }
          />

          <Card
            icon="📜"
            title="Logs"
            kpi1={{ label: "Entries", value: logRows.length }}
            kpi2={{ label: "Modules", value: [...new Set(logRows.map((l) => l.module))].length }}
            onOpen={() =>
              openDrawer(
                "System Logs",
                [
                  { label: "Date", key: "date" },
                  { label: "User", key: "user" },
                  { label: "Module", key: "module" },
                  { label: "Action", key: "action" },
                ],
                logRows,
                "date"
              )
            }
          />
        </div>
      </div>

      {/* Details Drawer */}
      <Drawer
        open={drawer.open}
        onClose={() => setDrawer((p) => ({ ...p, open: false }))}
        title={drawer.title}
        columns={drawer.columns}
        rows={drawer.rows}
        dateKey={drawer.dateKey}
      />

      {/* little animations */}
      <style>{`
        @keyframes pop { to { opacity: 1; transform: scale(1)} }
      `}</style>
    </div>
  );
};

export default Reports;
