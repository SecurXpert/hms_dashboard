

import React, { useMemo, useState } from "react";

/* --------------------------------------------------------- helpers -------------------------------- */
const inr = (n) =>
  (Number(n) || 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });

const SortIcon = ({ dir }) => (
  <span className="inline-block w-3 ml-1">
    {dir === "asc" ? "▲" : dir === "desc" ? "▼" : "⇵"}
  </span>
);

/* -------------------------------------------------------- seed data (dynamic mock) ---------------------------------------------- */
const initialRows = [
  {
    billNo: "ACB458",
    caseId: "115",
    patientName: "Olivier Thomas",
    generatedBy: "Super Admin (9001)",
    vehicleNumber: "MP20QW2343",
    vehicleModel: "HJG1650",
    driverName: "Oliver",
    driverContact: "7896541230",
    patientAddress: "482 Kingsway, Brooklyn West, CA",
    date: "2025-08-30T20:50:00",
    amount: 1500,
    discountPct: 10,
    taxPct: 15,
    paid: 1500,
  },
  {
    billNo: "ACB457",
    caseId: "7144",
    patientName: "Anushka Sanjeewani",
    generatedBy: "Super Admin (9001)",
    vehicleNumber: "MP20SD4321",
    vehicleModel: "BS23",
    driverName: "Jhon",
    driverContact: "8907657453",
    patientAddress: "Galle, Srilanka",
    date: "2025-08-25T15:50:00",
    amount: 1500,
    discountPct: 10,
    taxPct: 15,
    paid: 1500,
  },
  {
    billNo: "ACB456",
    caseId: "1100",
    patientName: "Elizabeth Hancock",
    generatedBy: "Super Admin (9001)",
    vehicleNumber: "MP20PL3265",
    vehicleModel: "MKL265",
    driverName: "Ankit",
    driverContact: "7879645645",
    patientAddress: "91 Trehafod Road BUERTON CW3 6GS",
    date: "2025-08-20T14:00:00",
    amount: 1700,
    discountPct: 0,
    taxPct: 15,
    paid: 1700,
  },
  {
    billNo: "ACB455",
    caseId: "6849",
    patientName: "Dhawan Kulkarni",
    generatedBy: "Super Admin (9001)",
    vehicleNumber: "MP20QW2343",
    vehicleModel: "HJG1650",
    driverName: "Oliver",
    driverContact: "8908067876",
    patientAddress: "DP Patil Road",
    date: "2025-08-15T15:49:00",
    amount: 1700,
    discountPct: 0,
    taxPct: 15,
    paid: 1700,
  },
  {
    billNo: "ACB454",
    caseId: "4479",
    patientName: "Martin Opega",
    generatedBy: "Super Admin (9001)",
    vehicleNumber: "MP20QW4562",
    vehicleModel: "BNS321",
    driverName: "Farhan",
    driverContact: "078270851",
    patientAddress: "50576 Marilynne Place Mukono, WI 4",
    date: "2025-08-10T14:30:00",
    amount: 1500,
    discountPct: 10,
    taxPct: 15,
    paid: 1500,
  },
  {
    billNo: "ACB453",
    caseId: "6849",
    patientName: "Jonathan Hibbins",
    generatedBy: "Super Admin (9001)",
    vehicleNumber: "MP20PL3265",
    vehicleModel: "MKL265",
    driverName: "Ankit",
    driverContact: "9086788567",
    patientAddress: "91 Trehafod Road BUERTON",
    date: "2025-08-05T12:30:00",
    amount: 1500,
    discountPct: 10,
    taxPct: 15,
    paid: 1500,
  },
  {
    billNo: "ACB452",
    caseId: "115",
    patientName: "Olivier Thomas",
    generatedBy: "Super Admin (9001)",
    vehicleNumber: "MP20DDHK2562",
    vehicleModel: "BS4FGD",
    driverName: "David Wood",
    driverContact: "7896541230",
    patientAddress: "482 Kingsway, Brooklyn West, CA",
    date: "2025-08-01T15:48:00",
    amount: 1500,
    discountPct: 10,
    taxPct: 15,
    paid: 1500,
  },
  {
    billNo: "ACB451",
    caseId: "7232",
    patientName: "Marcus Bethbell",
    generatedBy: "Super Admin (9001)",
    vehicleNumber: "MP20WS5674",
    vehicleModel: "DF342",
    driverName: "Arun",
    driverContact: "8906785463",
    patientAddress: "Port Elizabeth, Cape Province",
    date: "2025-07-04T10:10:00",
    amount: 1700,
    discountPct: 0,
    taxPct: 15,
    paid: 1700,
  },
];

const initialDrivers = [
  { id: "D001", name: "Oliver", age: 30, phone: "7896541230", vehicleNumber: "MP20QW2343", vehicleModel: "HJG1650" },
  { id: "D002", name: "Jhon", age: 28, phone: "8907657453", vehicleNumber: "MP20SD4321", vehicleModel: "BS23" },
  { id: "D003", name: "Ankit", age: 35, phone: "7879645645", vehicleNumber: "MP20PL3265", vehicleModel: "MKL265" },
];

/* ---------------- modal: add call ---------------- */
const AddCallModal = ({ onClose, onAdd }) => {
  const [f, setF] = useState({
    billNo: "",
    caseId: "",
    patientName: "",
    generatedBy: "Super Admin (9001)",
    vehicleNumber: "",
    vehicleModel: "",
    driverName: "",
    driverContact: "",
    patientAddress: "",
    date: new Date().toISOString().slice(0, 16),
    amount: "",
    discountPct: 0,
    taxPct: 18,
    paid: 0,
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setF((p) => ({ ...p, [name]: value }));
  };

  const submit = (e) => {
    e.preventDefault();
    onAdd({
      ...f,
      amount: Number(f.amount) || 0,
      discountPct: Number(f.discountPct) || 0,
      taxPct: Number(f.taxPct) || 0,
      paid: Number(f.paid) || 0,
      date: f.date ? new Date(f.date).toISOString() : new Date().toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="font-semibold">Add Ambulance Call</div>
          <button onClick={onClose} className="text-xl leading-none">×</button>
        </div>

        <form onSubmit={submit} className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-slate-600">Bill No *</label>
            <input name="billNo" value={f.billNo} onChange={onChange} required className="mt-1 w-full border rounded-md px-3 py-2"/>
          </div>
          <div>
            <label className="text-sm text-slate-600">Case ID *</label>
            <input name="caseId" value={f.caseId} onChange={onChange} required className="mt-1 w-full border rounded-md px-3 py-2"/>
          </div>
          <div>
            <label className="text-sm text-slate-600">Patient Name *</label>
            <input name="patientName" value={f.patientName} onChange={onChange} required className="mt-1 w-full border rounded-md px-3 py-2"/>
          </div>

          <div className="md:col-span-3">
            <label className="text-sm text-slate-600">Patient Address</label>
            <input name="patientAddress" value={f.patientAddress} onChange={onChange} className="mt-1 w-full border rounded-md px-3 py-2"/>
          </div>

          <div>
            <label className="text-sm text-slate-600">Vehicle Number</label>
            <input name="vehicleNumber" value={f.vehicleNumber} onChange={onChange} className="mt-1 w-full border rounded-md px-3 py-2"/>
          </div>
          <div>
            <label className="text-sm text-slate-600">Vehicle Model</label>
            <input name="vehicleModel" value={f.vehicleModel} onChange={onChange} className="mt-1 w-full border rounded-md px-3 py-2"/>
          </div>
          <div>
            <label className="text-sm text-slate-600">Date & Time *</label>
            <input type="datetime-local" name="date" value={f.date} onChange={onChange} required className="mt-1 w-full border rounded-md px-3 py-2"/>
          </div>

          <div>
            <label className="text-sm text-slate-600">Driver Name</label>
            <input name="driverName" value={f.driverName} onChange={onChange} className="mt-1 w-full border rounded-md px-3 py-2"/>
          </div>
          <div>
            <label className="text-sm text-slate-600">Driver Contact</label>
            <input name="driverContact" value={f.driverContact} onChange={onChange} className="mt-1 w-full border rounded-md px-3 py-2"/>
          </div>
          <div>
            <label className="text-sm text-slate-600">Generated By</label>
            <input name="generatedBy" value={f.generatedBy} onChange={onChange} className="mt-1 w-full border rounded-md px-3 py-2"/>
          </div>

          <div>
            <label className="text-sm text-slate-600">Amount (₹) *</label>
            <input type="number" min="0" name="amount" value={f.amount} onChange={onChange} required className="mt-1 w-full border rounded-md px-3 py-2"/>
          </div>
          <div>
            <label className="text-sm text-slate-600">Discount %</label>
            <input type="number" min="0" max="100" name="discountPct" value={f.discountPct} onChange={onChange} className="mt-1 w-full border rounded-md px-3 py-2"/>
          </div>
          <div>
            <label className="text-sm text-slate-600">Tax %</label>
            <input type="number" min="0" max="100" name="taxPct" value={f.taxPct} onChange={onChange} className="mt-1 w-full border rounded-md px-3 py-2"/>
          </div>

          <div>
            <label className="text-sm text-slate-600">Paid (₹)</label>
            <input type="number" min="0" name="paid" value={f.paid} onChange={onChange} className="mt-1 w-full border rounded-md px-3 py-2"/>
          </div>

          <div className="md:col-span-3 flex justify-end gap-2 pt-1">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border">Cancel</button>
            <button className="px-4 py-2 rounded-md bg-blue-600 text-white">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ---------------- modal: add driver ---------------- */
const AddDriverModal = ({ onClose, onAdd }) => {
  const [f, setF] = useState({
    name: "",
    age: "",
    phone: "",
    vehicleNumber: "",
    vehicleModel: "",
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setF((p) => ({ ...p, [name]: value }));
  };

  const submit = (e) => {
    e.preventDefault();
    onAdd({
      ...f,
      age: Number(f.age) || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="font-semibold">Add Driver</div>
          <button onClick={onClose} className="text-xl leading-none">×</button>
        </div>
        <form onSubmit={submit} className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-600">Name *</label>
            <input name="name" value={f.name} onChange={onChange} required className="mt-1 w-full border rounded-md px-3 py-2"/>
          </div>
          <div>
            <label className="text-sm text-slate-600">Age</label>
            <input type="number" min="18" name="age" value={f.age} onChange={onChange} className="mt-1 w-full border rounded-md px-3 py-2"/>
          </div>
          <div>
            <label className="text-sm text-slate-600">Phone Number</label>
            <input name="phone" value={f.phone} onChange={onChange} className="mt-1 w-full border rounded-md px-3 py-2"/>
          </div>
          <div>
            <label className="text-sm text-slate-600">Vehicle Number</label>
            <input name="vehicleNumber" value={f.vehicleNumber} onChange={onChange} className="mt-1 w-full border rounded-md px-3 py-2"/>
          </div>
          <div>
            <label className="text-sm text-slate-600">Vehicle Model</label>
            <input name="vehicleModel" value={f.vehicleModel} onChange={onChange} className="mt-1 w-full border rounded-md px-3 py-2"/>
          </div>
          <div className="md:col-span-2 flex justify-end gap-2 pt-1">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border">Cancel</button>
            <button className="px-4 py-2 rounded-md bg-blue-600 text-white">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ---------------- main component ---------------- */
const Ambulance = () => {
  const [rows, setRows] = useState(initialRows);
  const [drivers, setDrivers] = useState(initialDrivers);
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState("all"); // all, number, alphabet
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({ key: "date", dir: "desc" });
  const [openAdd, setOpenAdd] = useState(false);
  const [openAddDriver, setOpenAddDriver] = useState(false);
  const [viewMode, setViewMode] = useState("calls"); // calls or drivers

  const computed = useMemo(
    () =>
      rows.map((r) => {
        const discountAmt = (r.amount * (Number(r.discountPct) || 0)) / 100;
        const taxAmt = ((r.amount - discountAmt) * (Number(r.taxPct) || 0)) / 100;
        const net = r.amount - discountAmt + taxAmt;
        const balance = net - (Number(r.paid) || 0);
        return { ...r, net, balance, taxAmt, discountAmt };
      }),
    [rows]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let filteredRows = computed;

    if (filterType === "number") {
      filteredRows = computed.filter((r) =>
        [r.billNo, r.caseId, r.vehicleNumber, r.driverContact].some((field) =>
          field && field.match(/^\d+$/)
        )
      );
    } else if (filterType === "alphabet") {
      filteredRows = computed.filter((r) =>
        [r.patientName, r.generatedBy, r.driverName, r.patientAddress].some((field) =>
          field && field.match(/^[a-zA-Z\s]+$/)
        )
      );
    }

    if (!q) return filteredRows;
    return filteredRows.filter((r) =>
      [
        r.billNo,
        r.caseId,
        r.patientName,
        r.generatedBy,
        r.vehicleNumber,
        r.vehicleModel,
        r.driverName,
        r.driverContact,
        r.patientAddress,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [computed, query, filterType]);

  const sorted = useMemo(() => {
    const { key, dir } = sort;
    const s = [...filtered].sort((a, b) => {
      const av = key === "date" ? new Date(a[key]).getTime() : a[key];
      const bv = key === "date" ? new Date(b[key]).getTime() : b[key];
      if (av < bv) return dir === "asc" ? -1 : 1;
      if (av > bv) return dir === "asc" ? 1 : -1;
      return 0;
    });
    return s;
  }, [filtered, sort]);

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page, pageSize]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));

  const setSortKey = (key) => {
    setSort((s) =>
      s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }
    );
  };

  const addRow = (r) => {
    setRows((prev) => [{ ...r }, ...prev]);
    setOpenAdd(false);
  };

  const addDriver = (newDriver) => {
    const nextIdNum = drivers.length + 1;
    const id = `D${String(nextIdNum).padStart(3, "0")}`;
    setDrivers([...drivers, { id, ...newDriver }]);
    setOpenAddDriver(false);
  };

  const exportCsv = () => {
    const header = [
      "Bill No",
      "Case ID",
      "Patient Name",
      "Generated By",
      "Vehicle Number",
      "Vehicle Model",
      "Driver Name",
      "Driver Contact",
      "Patient Address",
      "Date",
      "Amount",
      "Discount(%)",
      "Tax(%)",
      "Net Amount",
      "Paid",
      "Balance",
    ];
    const lines = sorted.map((r) => [
      r.billNo,
      r.caseId,
      r.patientName,
      r.generatedBy,
      r.vehicleNumber,
      r.vehicleModel,
      r.driverName,
      r.driverContact,
      r.patientAddress,
      new Date(r.date).toLocaleString(),
      r.amount,
      r.discountPct,
      r.taxPct,
      r.net.toFixed(2),
      r.paid,
      r.balance.toFixed(2),
    ]);
    const csv =
      header.join(",") +
      "\n" +
      lines.map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ambulance_calls_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <h1 className="text-xl font-semibold">
          {viewMode === "calls" ? "Ambulance Call List" : "Ambulance Driver List"}
        </h1>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setOpenAdd(true)}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-white text-sm hover:bg-blue-700"
          >
            + Add Ambulance Call
          </button>
          <button
            onClick={() => setOpenAddDriver(true)}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-white text-sm hover:bg-blue-700"
          >
            + Add Driver
          </button>
          <button
            onClick={() => setViewMode(viewMode === "calls" ? "drivers" : "calls")}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-white text-sm hover:bg-blue-700"
          >
            {viewMode === "calls" ? "🚑 Show Driver List" : "🚑 Show Call List"}
          </button>
          <button onClick={exportCsv} className="rounded-md border bg-white px-3 py-2 text-sm">
            ⤓ Export CSV
          </button>
          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setPage(1);
            }}
            className="rounded-md border px-3 py-2 text-sm"
          >
            <option value="all">All</option>
            <option value="number">Numbers</option>
            <option value="alphabet">Alphabets</option>
          </select>
        </div>
      </div>

      {/* Controls */}
      <div className="rounded-lg border bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-3 py-3 border-b">
          <input
            placeholder="Search..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-80 rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="rounded-md border px-2 py-1 text-sm"
            >
              {[10, 25, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full w-full divide-y divide-gray-200">
            <thead className="bg-slate-100 text-slate-700">
              <tr className="text-left text-xs uppercase">
                {viewMode === "calls" ? (
                  <>
                    <th className="px-3 py-3 cursor-pointer" onClick={() => setSortKey("billNo")}>
                      Bill No <SortIcon dir={sort.key === "billNo" ? sort.dir : undefined} />
                    </th>
                    <th className="px-3 py-3 cursor-pointer" onClick={() => setSortKey("caseId")}>
                      Case ID <SortIcon dir={sort.key === "caseId" ? sort.dir : undefined} />
                    </th>
                    <th className="px-3 py-3">Patient Name</th>
                    <th className="px-3 py-3">Generated By</th>
                    <th className="px-3 py-3">Vehicle Number</th>
                    <th className="px-3 py-3">Vehicle Model</th>
                    <th className="px-3 py-3">Driver Name</th>
                    <th className="px-3 py-3">Driver Contact No</th>
                    <th className="px-3 py-3">Patient Address</th>
                    <th className="px-3 py-3 cursor-pointer" onClick={() => setSortKey("date")}>
                      Date <SortIcon dir={sort.key === "date" ? sort.dir : undefined} />
                    </th>
                    <th className="px-3 py-3 text-right">Amount (₹)</th>
                    <th className="px-3 py-3 text-right">Discount(%)</th>
                    <th className="px-3 py-3 text-right">Tax(%)</th>
                    <th className="px-3 py-3 text-right">Net Amount (₹)</th>
                    <th className="px-3 py-3 text-right">Paid (₹)</th>
                    <th className="px-3 py-3 text-right">Balance (₹)</th>
                  </>
                ) : (
                  <>
                    <th className="px-3 py-3 cursor-pointer" onClick={() => setSortKey("id")}>
                      ID <SortIcon dir={sort.key === "id" ? sort.dir : undefined} />
                    </th>
                    <th className="px-3 py-3 cursor-pointer" onClick={() => setSortKey("name")}>
                      Name <SortIcon dir={sort.key === "name" ? sort.dir : undefined} />
                    </th>
                    <th className="px-3 py-3 cursor-pointer" onClick={() => setSortKey("age")}>
                      Age <SortIcon dir={sort.key === "age" ? sort.dir : undefined} />
                    </th>
                    <th className="px-3 py-3 cursor-pointer" onClick={() => setSortKey("phone")}>
                      Phone <SortIcon dir={sort.key === "phone" ? sort.dir : undefined} />
                    </th>
                    <th className="px-3 py-3 cursor-pointer" onClick={() => setSortKey("vehicleNumber")}>
                      Vehicle Number <SortIcon dir={sort.key === "vehicleNumber" ? sort.dir : undefined} />
                    </th>
                    <th className="px-3 py-3 cursor-pointer" onClick={() => setSortKey("vehicleModel")}>
                      Vehicle Model <SortIcon dir={sort.key === "vehicleModel" ? sort.dir : undefined} />
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {viewMode === "calls" ? (
                paged.map((r) => (
                  <tr key={r.billNo} className="hover:bg-slate-50">
                    <td className="px-3 py-3 text-sm font-medium text-slate-800">{r.billNo}</td>
                    <td className="px-3 py-3 text-sm text-slate-700">{r.caseId}</td>
                    <td className="px-3 py-3 text-sm text-slate-700">{r.patientName}</td>
                    <td className="px-3 py-3 text-sm text-slate-700">{r.generatedBy}</td>
                    <td className="px-3 py-3 text-sm text-slate-700">{r.vehicleNumber}</td>
                    <td className="px-3 py-3 text-sm text-slate-700">{r.vehicleModel}</td>
                    <td className="px-3 py-3 text-sm text-slate-700">{r.driverName}</td>
                    <td className="px-3 py-3 text-sm text-slate-700">{r.driverContact}</td>
                    <td className="px-3 py-3 text-sm text-slate-700 max-w-[260px] truncate" title={r.patientAddress}>
                      {r.patientAddress}
                    </td>
                    <td className="px-3 py-3 text-sm text-slate-700">
                      {new Date(r.date).toLocaleString()}
                    </td>
                    <td className="px-3 py-3 text-sm text-right">{inr(r.amount)}</td>
                    <td className="px-3 py-3 text-sm text-right">
                      {r.discountPct.toFixed(2)}{" "}
                      <span className="text-slate-400">({inr(r.discountAmt)})</span>
                    </td>
                    <td className="px-3 py-3 text-sm text-right">
                      {r.taxPct.toFixed(2)}{" "}
                      <span className="text-slate-400">({inr(r.taxAmt)})</span>
                    </td>
                    <td className="px-3 py-3 text-sm text-right font-medium">{inr(r.net)}</td>
                    <td className="px-3 py-3 text-sm text-right">{inr(r.paid)}</td>
                    <td
                      className={`px-3 py-3 text-sm text-right ${
                        r.balance > 0 ? "text-rose-600" : "text-emerald-700"
                      }`}
                    >
                      {inr(r.balance)}
                    </td>
                  </tr>
                ))
              ) : (
                drivers.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50">
                    <td className="px-3 py-3 text-sm font-medium text-slate-800">{d.id}</td>
                    <td className="px-3 py-3 text-sm text-slate-700">{d.name}</td>
                    <td className="px-3 py-3 text-sm text-slate-700">{d.age || "—"}</td>
                    <td className="px-3 py-3 text-sm text-slate-700">{d.phone || "—"}</td>
                    <td className="px-3 py-3 text-sm text-slate-700">{d.vehicleNumber || "—"}</td>
                    <td className="px-3 py-3 text-sm text-slate-700">{d.vehicleModel || "—"}</td>
                  </tr>
                ))
              )}
              {viewMode === "calls" && paged.length === 0 && (
                <tr>
                  <td colSpan={16} className="px-3 py-8 text-center text-sm text-slate-500">
                    No results.
                  </td>
                </tr>
              )}
              {viewMode === "drivers" && drivers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 py-8 text-center text-sm text-slate-500">
                    No drivers.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3 py-3 border-t">
          <div className="text-sm text-slate-600">
            Showing{' '}
            {viewMode === "calls" ? (
              <>
                <b>{(page - 1) * pageSize + 1}</b>–
                <b>{Math.min(page * pageSize, sorted.length)}</b> of <b>{sorted.length}</b> calls
              </>
            ) : (
              <>
                <b>1</b>–<b>{drivers.length}</b> of <b>{drivers.length}</b> drivers
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            {viewMode === "calls" && (
              <>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-md border bg-white px-3 py-1 text-sm disabled:opacity-50"
                  disabled={page <= 1}
                >
                  Prev
                </button>
                <span className="text-sm">
                  Page <b>{page}</b> / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="rounded-md border bg-white px-3 py-1 text-sm disabled:opacity-50"
                  disabled={page >= totalPages}
                >
                  Next
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Add Modals */}
      {openAdd && <AddCallModal onClose={() => setOpenAdd(false)} onAdd={addRow} />}
      {openAddDriver && <AddDriverModal onClose={() => setOpenAddDriver(false)} onAdd={addDriver} />}
    </div>
  );
};

export default Ambulance;