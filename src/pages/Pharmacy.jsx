import React, { useMemo, useState, useEffect } from "react";

/* ---------------- helpers ---------------- */
const inr = (n) =>
  (Number(n) || 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });

const comma = (n) => (Number(n) || 0).toLocaleString("en-IN");
const cls = (...xs) => xs.filter(Boolean).join(" ");
const genId = (prefix = "ID") =>
  `${prefix}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

/* ---------------- badges ---------------- */
const PayBadge = ({ value }) => {
  const map = {
    Paid: "bg-green-100 text-green-800",
    "Partially Paid": "bg-yellow-100 text-yellow-800",
    Unpaid: "bg-red-100 text-red-800",
    Refunded: "bg-gray-100 text-gray-800",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
        map[value] || "bg-gray-100 text-gray-800"
      }`}
    >
      {value}
    </span>
  );
};

const StockBadge = ({ qty, reorder }) => {
  const status = qty === 0 ? "Out of Stock" : qty <= reorder ? "Low" : "In Stock";
  const map = {
    "Out of Stock": "bg-red-100 text-red-700",
    Low: "bg-amber-100 text-amber-800",
    "In Stock": "bg-emerald-100 text-emerald-700",
  };
  return (
    <span className={cls("px-2 py-0.5 rounded-full text-xs font-medium", map[status])}>
      {status}
    </span>
  );
};

/* ---------------- tiny icons (no deps) ---------------- */
const Icon = {
  Pill: () => (
    <svg viewBox="0 0 24 24" width="24" height="24" className="text-blue-500">
      <path
        fill="currentColor"
        d="M4.22 4.22a6 6 0 018 0l7.56 7.56a6 6 0 01-8 8l-7.56-7.56a6 6 0 010-8zm1.41 1.41a4 4 0 005.66 0l3.54 3.54a4 4 0 00-5.66 5.66l-3.54-3.54z"
      />
    </svg>
  ),
  Bottle: () => (
    <svg viewBox="0 0 24 24" width="24" height="24" className="text-green-500">
      <path
        fill="currentColor"
        d="M10 4h4v2h-4V4zm0 4h4v10a4 4 0 01-4 4H8a4 4 0 01-4-4V8h4v10h2V8z"
      />
    </svg>
  ),
  Syringe: () => (
    <svg viewBox="0 0 24 24" width="24" height="24" className="text-red-500">
      <path
        fill="currentColor"
        d="M6.41 2.59L8.83 5 6 7.83 3.59 5.41 2.17 6.83 5 9.66l-2.83 2.83 1.41 1.41L6.41 11l2.83 2.83 1.41-1.41L7.83 9.66l2.83-2.83 2.83 2.83 1.41-1.41L11.66 5.41l2.83-2.83-1.41-1.41zM17 16l-4 4h6v2H7v-2h6l4-4z"
      />
    </svg>
  ),
  Bandage: () => (
    <svg viewBox="0 0 24 24" width="24" height="24" className="text-purple-500">
      <path
        fill="currentColor"
        d="M12 2l9 5v10l-9 5-9-5V7l9-5zm0 2.83L6.83 8v8l5.17 2.83L17.17 16V8L12 4.83zM10 9h4v2h-4V9zm0 4h4v2h-4v-2z"
      />
    </svg>
  ),
  Inventory: () => (
    <svg viewBox="0 0 24 24" width="24" height="24" className="text-indigo-500">
      <path
        fill="currentColor"
        d="M5 7h14m-9 3h4m-9 3h14m-9 3h4M4 3h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1z"
      />
    </svg>
  ),
  Search: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" className="text-white">
      <path
        fill="currentColor"
        d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79L20 21.5 21.5 20 15.5 14zM9.5 14C7 14 5 12 5 9.5S7 5 9.5 5 14 7 14 9.5 12 14 9.5 14z"
      />
    </svg>
  ),
  Close: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" className="text-gray-400 hover:text-gray-600">
      <path
        fill="currentColor"
        d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
      />
    </svg>
  ),
  Filter: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" className="text-gray-600">
      <path fill="currentColor" d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />
    </svg>
  ),
  Sort: () => (
    <svg viewBox="0 0 24 24" width="16" height="16" className="text-gray-600">
      <path
        fill="currentColor"
        d="M12 5.83L15.17 9l1.41-1.41L12 3 7.41 7.59 8.83 9 12 5.83zm0 12.34L8.83 15l-1.41 1.41L12 21l4.59-4.59L15.17 15 12 18.17z"
      />
    </svg>
  ),
  Plus: () => (
    <svg viewBox="0 0 24 24" width="18" height="18">
      <path fill="currentColor" d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z" />
    </svg>
  ),
  Upload: () => (
    <svg viewBox="0 0 24 24" width="18" height="18">
      <path fill="currentColor" d="M5 20h14v-2H5m7-14l-5 5h3v4h4v-4h3l-5-5z" />
    </svg>
  ),
  PO: () => (
    <svg viewBox="0 0 24 24" width="18" height="18">
      <path fill="currentColor" d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2m8 1.5V8h4.5" />
    </svg>
  ),
  Bell: () => (
    <svg viewBox="0 0 24 24" width="18" height="18">
      <path
        fill="currentColor"
        d="M12 22a2 2 0 0 1-2-2h4a2 2 0 0 1-2 2m6-6v-5a6 6 0 0 0-5-5.91V4a1 1 0 0 0-2 0v1.09A6 6 0 0 0 6 11v5l-2 2v1h16v-1z"
      />
    </svg>
  ),
  Trash: () => (
    <svg viewBox="0 0 24 24" width="16" height="16">
      <path fill="currentColor" d="M9 3v1H4v2h16V4h-5V3H9m1 6v8h2V9h-2m-4 0v8h2V9H6m8 0v8h2V9h-2z" />
    </svg>
  ),
  Edit: () => (
    <svg viewBox="0 0 24 24" width="16" height="16">
      <path fill="currentColor" d="M5 18.08V21h2.92l8.6-8.6-2.92-2.92L5 18.09M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83Z" />
    </svg>
  ),
};

/* ---------------- animated helpers ---------------- */
const AnimatedCounter = ({ value, duration = 800 }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = Math.max(0, parseInt(value || 0, 10));
    if (end === 0) return setCount(0);
    const steps = Math.min(50, end);
    const stepVal = Math.ceil(end / steps);
    const tick = duration / steps;
    const t = setInterval(() => {
      start = Math.min(end, start + stepVal);
      setCount(start);
      if (start >= end) clearInterval(t);
    }, tick);
    return () => clearInterval(t);
  }, [value, duration]);
  return <span>{count.toLocaleString("en-IN")}</span>;
};

const AnimatedPill = ({ children, delay = 0 }) => (
  <span
    className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 opacity-0 animate-fadeIn"
    style={{ animationDelay: `${delay}ms` }}
  >
    {children}
  </span>
);

const AnimatedTableRow = ({ children, index }) => (
  <tr
    className="hover:bg-gray-50 transition-all duration-200 opacity-0 animate-fadeIn"
    style={{ animationDelay: `${index * 50}ms` }}
  >
    {children}
  </tr>
);

const ModuleTile = ({ icon, title, active, onClick, count, delay = 0 }) => (
  <button
    onClick={onClick}
    className={cls(
      "flex items-center gap-3 rounded-xl border p-4 w-full transition-all duration-300 hover:-translate-y-1 hover:shadow-md opacity-0 animate-fadeIn",
      active ? "border-blue-500 bg-blue-50 shadow-md" : "border-gray-200 bg-white"
    )}
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className={cls("p-2 rounded-lg", active ? "bg-blue-100" : "bg-gray-100")}>{icon}</div>
    <div className="flex-1 text-left">
      <span className="text-sm font-semibold text-gray-700 block">{title}</span>
      <span className="text-xs text-gray-500">
        <AnimatedCounter value={count} /> records
      </span>
    </div>
    {active && <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>}
  </button>
);

/* ---------------- filter popover ---------------- */
const FilterPopover = ({ isOpen, onClose, onApply }) => {
  const [filters, setFilters] = useState({
    status: "",
    dateRange: "",
  });
  if (!isOpen) return null;
  return (
    <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border z-10 opacity-0 animate-fadeIn">
      <div className="p-4 border-b flex items-center justify-between">
        <h4 className="font-semibold text-gray-800">Filter Records</h4>
        <button onClick={onClose}>
          <Icon.Close />
        </button>
      </div>
      <div className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
          <select
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Unpaid">Unpaid</option>
            <option value="Partially Paid">Partially Paid</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
          <select
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            value={filters.dateRange}
            onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
          >
            <option value="">All Dates</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
        <div className="flex gap-2 pt-2">
          <button className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition" onClick={onClose}>
            Cancel
          </button>
          <button
            className="flex-1 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            onClick={() => {
              onApply(filters);
              onClose();
            }}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------------- medicines (kept) ---------------- */
const MOCK_MEDICINES = [
  {
    id: genId("MED"),
    name: "Paracetamol 500mg",
    form: "Tablet",
    batch: "BCH1234",
    expiry: "2026-01-31",
    mrp: 15.0,
    buyPrice: 7.5,
    stock: 120,
    reorderLevel: 50,
    hsn: "300450",
    rack: "A1",
  },
  {
    id: genId("MED"),
    name: "Amoxicillin 250mg",
    form: "Capsule",
    batch: "BCH2234",
    expiry: "2025-12-31",
    mrp: 22.0,
    buyPrice: 11.0,
    stock: 18,
    reorderLevel: 30,
    hsn: "300420",
    rack: "A2",
  },
  {
    id: genId("MED"),
    name: "Cough Syrup 100ml",
    form: "Syrup",
    batch: "BCH3234",
    expiry: "2025-10-15",
    mrp: 60.0,
    buyPrice: 35.0,
    stock: 0,
    reorderLevel: 10,
    hsn: "300490",
    rack: "B1",
  },
  {
    id: genId("MED"),
    name: "Sterile Bandage 5cm",
    form: "Supply",
    batch: "BCH4234",
    expiry: "2027-03-31",
    mrp: 10.0,
    buyPrice: 4.0,
    stock: 75,
    reorderLevel: 40,
    hsn: "300510",
    rack: "S1",
  },
  {
    id: genId("MED"),
    name: "Insulin Vial 10ml",
    form: "Injection",
    batch: "BCH5234",
    expiry: "2025-09-10",
    mrp: 350.0,
    buyPrice: 280.0,
    stock: 12,
    reorderLevel: 20,
    hsn: "300431",
    rack: "C3",
  },
];

/* ---------------- Add / Import modals (kept) ---------------- */
const AddMedicineModal = ({ open, onClose, onAdd }) => {
  const [f, setF] = useState({
    name: "",
    form: "Tablet",
    batch: "",
    expiry: "",
    mrp: "",
    buyPrice: "",
    stock: "",
    reorderLevel: 10,
    hsn: "",
    rack: "",
  });
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">Add Medicine</h3>
          <button onClick={onClose}>
            <Icon.Close />
          </button>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            ["name", "Name"],
            ["form", "Form"],
            ["batch", "Batch"],
            ["expiry", "Expiry (YYYY-MM-DD)"],
            ["mrp", "MRP"],
            ["buyPrice", "Buy Price"],
            ["stock", "Opening Stock"],
            ["reorderLevel", "Reorder Level"],
            ["hsn", "HSN"],
            ["rack", "Rack"],
          ].map(([k, label]) => (
            <label key={k} className="text-sm">
              <span className="block text-gray-700 mb-1">{label}</span>
              <input
                className="w-full border rounded-lg px-3 py-2"
                value={f[k]}
                onChange={(e) => setF({ ...f, [k]: e.target.value })}
              />
            </label>
          ))}
        </div>
        <div className="px-6 py-4 border-t flex justify-end gap-2 bg-gray-50">
          <button className="px-4 py-2 rounded-lg border" onClick={onClose}>
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700"
            onClick={() => {
              onAdd({
                ...f,
                id: genId("MED"),
                mrp: Number(f.mrp),
                buyPrice: Number(f.buyPrice),
                stock: Number(f.stock),
                reorderLevel: Number(f.reorderLevel),
              });
              onClose();
            }}
          >
            <div className="inline-flex items-center gap-2">
              <Icon.Plus /> Add
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

const ImportModal = ({ open, onClose, onImport }) => {
  const [text, setText] = useState(
    "name,form,batch,expiry,mrp,buyPrice,stock,reorderLevel,hsn,rack\nIbuprofen 200mg,Tablet,BCH9999,2026-12-31,8,4,200,50,300450,B2"
  );
  if (!open) return null;
  const parseCSV = (t) => {
    const [hdr, ...rows] = t.trim().split(/\r?\n/);
    const H = hdr.split(",").map((h) => h.trim());
    return rows
      .filter(Boolean)
      .map((r) => {
        const V = r.split(",").map((x) => x.trim());
        const o = {};
        H.forEach((h, i) => (o[h] = V[i]));
        return {
          id: genId("MED"),
          ...o,
          mrp: Number(o.mrp || 0),
          buyPrice: Number(o.buyPrice || 0),
          stock: Number(o.stock || 0),
          reorderLevel: Number(o.reorderLevel || 10),
        };
      });
  };
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">Import Medicines (CSV)</h3>
          <button onClick={onClose}>
            <Icon.Close />
          </button>
        </div>
        <div className="p-6 space-y-3">
          <p className="text-sm text-gray-600">
            Paste CSV with header:{" "}
            <code className="bg-gray-100 px-2 py-1 rounded">
              name, form, batch, expiry, mrp, buyPrice, stock, reorderLevel, hsn, rack
            </code>
          </p>
          <textarea
            className="w-full min-h-[180px] border rounded-lg px-3 py-2 font-mono text-sm"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div className="px-6 py-4 border-t flex justify-end gap-2 bg-gray-50">
          <button className="px-4 py-2 rounded-lg border" onClick={onClose}>
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700"
            onClick={() => {
              onImport(parseCSV(text));
              onClose();
            }}
          >
            <div className="inline-flex items-center gap-2">
              <Icon.Upload /> Import
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------------- NEW: Edit Medicine modal (batch + expiry) ---------------- */
const EditMedicineModal = ({ open, onClose, medicine, onSave }) => {
  const [batch, setBatch] = useState(medicine?.batch || "");
  const [expiry, setExpiry] = useState(medicine?.expiry || "");
  const [rack, setRack] = useState(medicine?.rack || "");

  useEffect(() => {
    setBatch(medicine?.batch || "");
    setExpiry(medicine?.expiry || "");
    setRack(medicine?.rack || "");
  }, [medicine]);

  if (!open || !medicine) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 bg-blue-600 text-white">
            <h3 className="font-semibold text-base">Edit Medicine</h3>
            <button className="bg-white/10 rounded px-3 py-1" onClick={onClose}>Close</button>
          </div>
          <div className="p-5 space-y-4">
            <div className="text-sm">
              <div className="text-gray-500">Name</div>
              <div className="font-semibold">{medicine.name}</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label className="text-sm sm:col-span-2">
                <span className="block text-gray-700 mb-1">Batch</span>
                <input className="w-full border rounded-lg px-3 py-2" value={batch} onChange={(e) => setBatch(e.target.value)} />
              </label>
              <label className="text-sm">
                <span className="block text-gray-700 mb-1">Expiry</span>
                <input type="date" className="w-full border rounded-lg px-3 py-2" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
              </label>
              <label className="text-sm sm:col-span-3">
                <span className="block text-gray-700 mb-1">Rack (optional)</span>
                <input className="w-full border rounded-lg px-3 py-2" value={rack} onChange={(e) => setRack(e.target.value)} />
              </label>
            </div>
          </div>
          <div className="px-5 py-3 bg-gray-50 border-t flex items-center justify-end gap-2">
            <button className="px-3 py-2 rounded-lg border" onClick={onClose}>Cancel</button>
            <button
              className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => onSave({ ...medicine, batch, expiry, rack })}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------- UPDATED: Purchase Order modal (editable qty + extra fields) ---------------- */
const POModal = ({ open, onClose, items, onCreate }) => {
  const [supplier, setSupplier] = useState("");
  const [hsncode, setHsncode] = useState("");
  const [expectedDate, setExpectedDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
  });
  const [paymentTerms, setPaymentTerms] = useState("Due on Delivery");
  const [notes, setNotes] = useState("");
  const [rows, setRows] = useState([]);

  useEffect(() => {
    // initialize editable rows with qty fallback
    setRows(
      (items || []).map((it) => ({
        name: it.name,
        batch: it.batch || "",
        buyPrice: Number(it.buyPrice || 0),
        qty: Math.max(1, Number(it.qty || 1)),
      }))
    );
  }, [items, open]);

  const poNo = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10).split("-").join("");
    const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `PO-${today}-${rand}`;
  }, [open]);

  if (!open) return null;

  const total = rows.reduce((a, b) => a + Number(b.qty) * Number(b.buyPrice || 0), 0);

  const setQty = (idx, val) =>
    setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, qty: Math.max(1, Number(val || 1)) } : r)));

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">Create Purchase Order</h3>
          <button onClick={onClose}>
            <Icon.Close />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-gray-500">PO Number</div>
              <div className="font-semibold">{poNo}</div>
            </div>
            <label className="md:col-span-2 text-sm">
              <span className="block text-gray-700 mb-1">Supplier</span>
              <input
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Supplier name"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
              />
            </label>
            <label className="text-sm">
              <span className="block text-gray-700 mb-1">Expected Delivery</span>
              <input type="date" className="w-full border rounded-lg px-3 py-2" value={expectedDate} onChange={(e) => setExpectedDate(e.target.value)} />
            </label>
            <label className="md:col-span-2 text-sm">
              <span className="block text-gray-700 mb-1">HSN Code</span>
              <input
                className="w-full border rounded-lg px-3 py-2"
                placeholder="HSN Code"
                value={hsncode}
                onChange={(e) => setHsncode(e.target.value)}
              />
            </label>
            <label className="md:col-span-2 text-sm">
              <span className="block text-gray-700 mb-1">Payment Terms</span>
              <input className="w-full border rounded-lg px-3 py-2" value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)} />
            </label>
            <label className="md:col-span-3 text-sm">
              <span className="block text-gray-700 mb-1">Notes</span>
              <textarea className="w-full border rounded-lg px-3 py-2 min-h-[80px]" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </label>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left">Medicine</th>
                  <th className="px-3 py-2 text-left">Batch</th>
                  <th className="px-3 py-2 text-left">Buy Price</th>
                  <th className="px-3 py-2 text-left">Qty</th>
                  <th className="px-3 py-2 text-left">Amount</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((it, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-3 py-2">{it.name}</td>
                    <td className="px-3 py-2">{it.batch || "—"}</td>
                    <td className="px-3 py-2">{inr(it.buyPrice)}</td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        min={1}
                        className="w-24 border rounded-lg px-2 py-1"
                        value={it.qty}
                        onChange={(e) => setQty(i, e.target.value)}
                      />
                    </td>
                    <td className="px-3 py-2 font-medium">{inr((it.buyPrice || 0) * it.qty)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-right text-sm">
            <div className="text-gray-600">Total</div>
            <div className="text-lg font-bold">{inr(total)}</div>
          </div>
        </div>
        <div className="px-6 py-4 border-t flex justify-end gap-2 bg-gray-50">
          <button className="px-4 py-2 rounded-lg border" onClick={onClose}>
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700"
            onClick={() => {
              onCreate({ poNo, supplier, expectedDate, paymentTerms, notes, items: rows, total });
              onClose();
            }}
          >
            <div className="inline-flex items-center gap-2">
              <Icon.PO /> Create PO
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------------- NEW: Create Prescription Modal (kept) ---------------- */
const CreatePrescriptionModal = ({ open, onClose, onSave }) => {
  const [patientId, setPatientId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [items, setItems] = useState([
    { medicine: "", tabsPerSheet: 10, sheets: 1, qtyTabs: 10, pricePerSheet: 0, timings: "1-0-1" },
  ]);
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [txnId, setTxnId] = useState("");
  const [amountPaid, setAmountPaid] = useState(0);

  useEffect(() => {
    setItems((prev) =>
      prev.map((it) => ({
        ...it,
        qtyTabs: Math.max(0, Number(it.sheets) * Number(it.tabsPerSheet || 0)),
      }))
    );
  }, [items.length]);

  const update = (idx, patch) =>
    setItems((prev) =>
      prev.map((it, i) => (i === idx ? { ...it, ...patch } : it))
    );

  const pricePerTab = (it) =>
    Number(it.tabsPerSheet) > 0 ? Number(it.pricePerSheet || 0) / Number(it.tabsPerSheet) : 0;

  const lineTotal = (it) => Number(it.qtyTabs || 0) * pricePerTab(it);
  const billAmount = items.reduce((a, b) => a + lineTotal(b), 0);

  const paymentStatus =
    Number(amountPaid || 0) <= 0
      ? "Unpaid"
      : Number(amountPaid) < billAmount
      ? "Partially Paid"
      : "Paid";

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex items-center justify-between bg-blue-600 text-white px-5 py-3">
            <h3 className="font-semibold">New Prescription</h3>
            <button className="bg-white/10 rounded-lg px-3 py-1" onClick={onClose}>
              Close
            </button>
          </div>

          <div className="p-5 space-y-5">
            {/* Patient */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <label className="text-sm">
                <span className="block text-gray-700 mb-1">Patient ID</span>
                <input className="w-full border rounded-lg px-3 py-2" value={patientId} onChange={(e) => setPatientId(e.target.value)} />
              </label>
              <label className="text-sm md:col-span-2">
                <span className="block text-gray-700 mb-1">Patient Name</span>
                <input className="w-full border rounded-lg px-3 py-2" value={patientName} onChange={(e) => setPatientName(e.target.value)} />
              </label>
              <label className="text-sm">
                <span className="block text-gray-700 mb-1">Date</span>
                <input type="date" className="w-full border rounded-lg px-3 py-2" value={date} onChange={(e) => setDate(e.target.value)} />
              </label>
            </div>

            {/* Items */}
            <div className="rounded-xl border overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left">Medicine</th>
                    <th className="px-3 py-2 text-left">Tabs/Sheet</th>
                    <th className="px-3 py-2 text-left">Sheets</th>
                    <th className="px-3 py-2 text-left">Qty (Tabs)</th>
                    <th className="px-3 py-2 text-left">Price/Sheet</th>
                    <th className="px-3 py-2 text-left">Price/Tab</th>
                    <th className="px-3 py-2 text-left">Timings</th>
                    <th className="px-3 py-2 text-left">Amount</th>
                    <th className="px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="px-3 py-2">
                        <input
                          className="w-full border rounded-lg px-2 py-1"
                          placeholder="e.g., Paracetamol 500mg"
                          value={it.medicine}
                          onChange={(e) => update(idx, { medicine: e.target.value })}
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          min={1}
                          className="w-24 border rounded-lg px-2 py-1"
                          value={it.tabsPerSheet}
                          onChange={(e) => {
                            const tabsPerSheet = Math.max(1, Number(e.target.value || 0));
                            const qtyTabs = tabsPerSheet * Number(it.sheets || 0);
                            update(idx, { tabsPerSheet, qtyTabs });
                          }}
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          min={0}
                          className="w-20 border rounded-lg px-2 py-1"
                          value={it.sheets}
                          onChange={(e) => {
                            const sheets = Math.max(0, Number(e.target.value || 0));
                            const qtyTabs = sheets * Number(it.tabsPerSheet || 0);
                            update(idx, { sheets, qtyTabs });
                          }}
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          min={0}
                          className="w-24 border rounded-lg px-2 py-1"
                          value={it.qtyTabs}
                          onChange={(e) => update(idx, { qtyTabs: Math.max(0, Number(e.target.value || 0)) })}
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          min={0}
                          step="0.01"
                          className="w-28 border rounded-lg px-2 py-1"
                          value={it.pricePerSheet}
                          onChange={(e) => update(idx, { pricePerSheet: Number(e.target.value || 0) })}
                        />
                      </td>
                      <td className="px-3 py-2">{inr(pricePerTab(it))}</td>
                      <td className="px-3 py-2">
                        <input
                          className="w-28 border rounded-lg px-2 py-1"
                          placeholder="e.g., 1-0-1"
                          value={it.timings}
                          onChange={(e) => update(idx, { timings: e.target.value })}
                        />
                      </td>
                      <td className="px-3 py-2 font-semibold">{inr(lineTotal(it))}</td>
                      <td className="px-3 py-2">
                        <button
                          className="text-red-600 text-xs px-2 py-1 rounded border border-red-200 hover:bg-red-50"
                          onClick={() => setItems((prev) => prev.filter((_, i) => i !== idx))}
                          disabled={items.length === 1}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              className="px-3 py-2 rounded-lg border text-sm hover:bg-gray-50"
              onClick={() => setItems((p) => [...p, { medicine: "", tabsPerSheet: 10, sheets: 1, qtyTabs: 10, pricePerSheet: 0, timings: "1-0-1" }])}
            >
              + Add Item
            </button>

            {/* Payment */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="text-sm text-blue-700">Total</div>
                <div className="text-2xl font-bold text-blue-900">{inr(billAmount)}</div>
              </div>
              <label className="text-sm">
                <span className="block text-gray-700 mb-1">Payment Mode</span>
                <select className="w-full border rounded-lg px-3 py-2" value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}>
                  <option>Cash</option>
                  <option>UPI</option>
                  <option>Card</option>
                </select>
              </label>
              <label className="text-sm">
                <span className="block text-gray-700 mb-1">Amount Paid</span>
                <input
                  type="number"
                  min={0}
                  className="w-full border rounded-lg px-3 py-2"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(Number(e.target.value || 0))}
                />
              </label>
              {(paymentMode === "UPI" || paymentMode === "Card") && (
                <label className="text-sm md:col-span-3">
                  <span className="block text-gray-700 mb-1">{paymentMode === "UPI" ? "UTR/Ref No" : "Card Txn ID"}</span>
                  <input className="w-full border rounded-lg px-3 py-2" value={txnId} onChange={(e) => setTxnId(e.target.value)} />
                </label>
              )}
            </div>

            <div className="flex items-center justify-end gap-2">
              <button className="px-4 py-2 rounded-lg border" onClick={onClose}>Cancel</button>
              <button
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => {
                  const id = `P-${new Date().toISOString().slice(2,10).replaceAll("-","")}-${Math.random().toString(36).slice(2,6).toUpperCase()}`;
                  const medSummary = items[0]?.medicine ? `${items[0].medicine}${items.length > 1 ? ` +${items.length - 1}` : ""}` : "—";
                  onSave({
                    prescriptionId: id,
                    module: "Prescription",
                    patientId,
                    patientName,
                    date,
                    billAmount: billAmount,
                    amountPaid: Number(amountPaid || 0),
                    paymentStatus: Number(amountPaid || 0) <= 0 ? "Unpaid" : Number(amountPaid) < billAmount ? "Partially Paid" : "Paid",
                    paymentMode,
                    txnId,
                    medication: medSummary,
                    items,
                  });
                  onClose();
                }}
              >
                Save Prescription
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------- main component ---------------- */
const Pharmacy = () => {
  // dummy name to track dependency for scroll-to-top
  const [name] = useState("");

  // scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ✅ Added as requested: scroll to top whenever `name` changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [name]);

  // Medicines
  const [medicines, setMedicines] = useState(MOCK_MEDICINES);

  // Records
  const INITIAL_RECORDS = [
    {
      prescriptionId: "P-240801",
      module: "Prescription",
      patientId: "P2001",
      patientName: "Kiran Rao",
      date: "2025-08-20",
      billAmount: 500,
      amountPaid: 500,
      paymentStatus: "Paid",
      paymentMode: "UPI",
      txnId: "TXN-P1",
      medication: "Paracetamol 500mg",
    },
  ];
  const [records, setRecords] = useState(INITIAL_RECORDS);

  // Modules list (REMOVED Controlled)
  const modules = [
    { key: "All", icon: <Icon.Inventory />, count: records.length },
    { key: "Prescription", icon: <Icon.Pill />, count: records.filter((m) => m.module === "Prescription").length },
    { key: "Surgical Supplies", icon: <Icon.Bandage />, count: records.filter((m) => m.module === "Surgical Supplies").length },
    { key: "OTC", icon: <Icon.Bottle />, count: records.filter((m) => m.module === "OTC").length },
  ];

  // UI state
  const [activeModule, setActiveModule] = useState("All");
  const [prescriptionId, setPrescriptionId] = useState("");
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Medicines ops
  const [medSearch, setMedSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  // PO modal controls
  const [poOpen, setPoOpen] = useState(false);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [poSelection, setPoSelection] = useState([]);

  // Edit modal controls
  const [editOpen, setEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  // Create prescription modal
  const [createOpen, setCreateOpen] = useState(false);

  const filtered = useMemo(() => {
    let result = [...records];
    if (activeModule !== "All") result = result.filter((r) => r.module === activeModule);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      result = result.filter(
        (r) =>
          r.prescriptionId.toLowerCase().includes(q) ||
          r.patientName.toLowerCase().includes(q) ||
          (r.medication || "").toLowerCase().includes(q)
      );
    }
    if (activeFilters.status) result = result.filter((r) => r.paymentStatus === activeFilters.status);
    if (activeFilters.dateRange) {
      const today = new Date();
      result = result.filter((r) => {
        const recordDate = new Date(r.date);
        switch (activeFilters.dateRange) {
          case "today":
            return recordDate.toDateString() === today.toDateString();
          case "week": {
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - today.getDay());
            return recordDate >= weekStart;
          }
          case "month":
            return recordDate.getMonth() === today.getMonth() && recordDate.getFullYear() === today.getFullYear();
          default:
            return true;
        }
      });
    }
    if (sortConfig.key) {
      result.sort((a, b) =>
        a[sortConfig.key] < b[sortConfig.key]
          ? sortConfig.direction === "asc"
            ? -1
            : 1
          : a[sortConfig.key] > b[sortConfig.key]
          ? sortConfig.direction === "asc"
            ? 1
            : -1
          : 0
      );
    }
    return result.map((r) => ({ ...r, balance: (Number(r.billAmount) || 0) - (Number(r.amountPaid) || 0) }));
  }, [records, activeModule, query, activeFilters, sortConfig]);

  const totals = useMemo(() => {
    const tBill = filtered.reduce((a, b) => a + (Number(b.billAmount) || 0), 0);
    const tPaid = filtered.reduce((a, b) => a + (Number(b.amountPaid) || 0), 0);
    return { tBill, tPaid, tBal: tBill - tPaid };
  }, [filtered]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  const clearFilters = () => {
    setActiveFilters({});
    setQuery("");
    setPrescriptionId("");
  };

  // medicines derived
  const medFiltered = useMemo(() => {
    const q = medSearch.trim().toLowerCase();
    return medicines.filter(
      (m) =>
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.form.toLowerCase().includes(q) ||
        (m.hsn || "").toLowerCase().includes(q)
    );
  }, [medicines, medSearch]);

  const shortages = useMemo(() => medicines.filter((m) => m.stock <= m.reorderLevel), [medicines]);

  const shortageDefaultItems = shortages.map((m) => ({
    name: m.name,
    batch: m.batch,
    buyPrice: m.buyPrice,
    qty: Math.max(m.reorderLevel * 2 - m.stock, 1),
  }));

  const handleAddMedicine = (m) => setMedicines((prev) => [m, ...prev]);
  const handleImport = (items) => setMedicines((prev) => [...items, ...prev]);
  const handleCreatePO = (po) =>
    setPurchaseOrders((prev) => [{ id: genId("PO"), date: new Date().toISOString().slice(0, 10), ...po }, ...prev]);
  const handleDeleteMedicine = (id) => setMedicines((prev) => prev.filter((x) => x.id !== id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
        .animate-pulse { animation: pulse 2s infinite; }
      `}</style>

      <div className="max-w-7xl mx-auto">
        <div className="mb-8 opacity-0 animate-fadeIn">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Pharmacy Management</h2>
          <p className="text-gray-600">Manage prescriptions, medicines & stock, purchase orders, and patient billing</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* LEFT: Module Selection + Medicines mini-dashboard */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Pharmacy Modules</h3>
              <div className="flex flex-col gap-3">
                {modules.map((m, i) => (
                  <ModuleTile
                    key={m.key}
                    icon={m.icon}
                    title={m.key}
                    active={activeModule === m.key}
                    onClick={() => setActiveModule(m.key)}
                    count={m.count}
                    delay={i * 100}
                  />
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Total Records</span>
                  <span className="text-sm font-bold text-blue-600">
                    <AnimatedCounter value={records.length} />
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Filtered</span>
                  <span className="text-sm font-bold text-green-600">
                    <AnimatedCounter value={filtered.length} />
                  </span>
                </div>
              </div>
            </div>

            {/* Medicines quick panel (kept commented as in your code) */}
            {/* ... */}
          </div>

          {/* RIGHT: Records + Medicines tabs */}
          <div className="lg:col-span-3 space-y-6">
            {/* Shortage banner */}
            {shortages.length > 0 && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
                <div className="mt-0.5">
                  <Icon.Bell />
                </div>
                <div className="flex-1 text-sm">
                  <div className="font-semibold text-amber-900">Stock Shortage Alert</div>
                  <div className="text-amber-800">
                    {shortages.length} medicines are at or below reorder level. Consider creating a Purchase Order.
                  </div>
                </div>
                <button
                  className="px-3 py-2 rounded-lg bg-amber-700 text-white hover:bg-amber-800"
                  onClick={() => {
                    setPoSelection(shortageDefaultItems);
                    setPoOpen(true);
                  }}
                >
                  Create PO
                </button>
              </div>
            )}

            {/* Records Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {activeModule} Records
                  {filtered.length > 0 && (
                    <span className="text-sm font-normal text-gray-500 ml-2">({filtered.length} records)</span>
                  )}
                </h3>
                <div className="flex items-center gap-2 relative">
                  <button
                    className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => setCreateOpen(true)}
                  >
                    <div className="inline-flex items-center gap-2">
                      <Icon.Plus /> New Prescription
                    </div>
                  </button>
                  <button
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-50 transition"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Icon.Filter />
                    Filters
                    {Object.keys(activeFilters).length > 0 && <span className="w-2 h-2 rounded-full bg-blue-500"></span>}
                  </button>
                  {Object.keys(activeFilters).length > 0 && (
                    <button
                      className="px-3 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-50 transition"
                      onClick={clearFilters}
                    >
                      Clear
                    </button>
                  )}
                  <FilterPopover isOpen={showFilters} onClose={() => setShowFilters(false)} onApply={(filters) => setActiveFilters(filters)} />
                </div>
              </div>

              {/* Search Row */}
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Search Prescriptions</label>
                    <div className="flex rounded-lg overflow-hidden shadow-sm">
                      <input
                        value={prescriptionId}
                        onChange={(e) => setPrescriptionId(e.target.value)}
                        placeholder="Enter ID, Patient Name, or Medication"
                        className="flex-1 px-4 py-3 text-sm outline-none border-none"
                        onKeyDown={(e) => e.key === "Enter" && setQuery(prescriptionId)}
                      />
                      <button
                        onClick={() => setQuery(prescriptionId)}
                        className="px-6 bg-blue-600 text-white font-medium hover:bg-blue-700 transition flex items-center gap-2"
                      >
                        <Icon.Search /> Search
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Filters */}
              {Object.keys(activeFilters).length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6 opacity-0 animate-fadeIn">
                  {activeFilters.status && <AnimatedPill delay={0}>Status: {activeFilters.status}</AnimatedPill>}
                  {activeFilters.dateRange && <AnimatedPill delay={100}>Date: {activeFilters.dateRange}</AnimatedPill>}
                </div>
              )}

              {/* Totals Strip */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 shadow-sm">
                  <div className="text-sm text-blue-700 font-medium mb-1">Total Bill</div>
                  <div className="text-2xl font-bold text-blue-800">{inr(totals.tBill)}</div>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 shadow-sm">
                  <div className="text-sm text-green-700 font-medium mb-1">Amount Paid</div>
                  <div className="text-2xl font-bold text-green-800">{inr(totals.tPaid)}</div>
                </div>
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-4 shadow-sm">
                  <div className="text-sm text-orange-700 font-medium mb-1">Balance</div>
                  <div className="text-2xl font-bold text-orange-800">{inr(totals.tBal)}</div>
                </div>
              </div>

              {/* Results Table */}
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {[
                        { key: "prescriptionId", label: "Prescription ID" },
                        { key: "patientName", label: "Patient" },
                        { key: "date", label: "Date" },
                        { key: "module", label: "Module" },
                        { key: "medication", label: "Medication" },
                        { key: "billAmount", label: "Bill Amount" },
                        { key: "amountPaid", label: "Paid" },
                        { key: "balance", label: "Balance" },
                        { key: "paymentStatus", label: "Status" },
                        { key: "paymentMode", label: "Mode" },
                      ].map((header) => (
                        <th
                          key={header.key}
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition"
                          onClick={() => handleSort(header.key)}
                        >
                          <div className="flex items-center gap-1">
                            {header.label}
                            {sortConfig.key === header.key && <Icon.Sort />}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="px-4 py-8 text-center">
                          <div className="text-gray-500 text-sm">
                            {query || Object.keys(activeFilters).length > 0
                              ? "No records match your search criteria."
                              : "Search for prescriptions or select a module to view records."}
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filtered.map((r, i) => (
                        <AnimatedTableRow key={`${r.module}-${r.prescriptionId}`} index={i}>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{r.prescriptionId}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            <div>{r.patientName}</div>
                            <div className="text-gray-500 text-xs">{r.patientId}</div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">{r.date}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">{r.module}</span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">{r.medication}</td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{inr(r.billAmount)}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{inr(r.amountPaid)}</td>
                          <td className={cls("px-4 py-3 text-sm font-medium", r.balance > 0 ? "text-red-600" : "text-green-600")}>
                            {inr(r.balance)}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <PayBadge value={r.paymentStatus} />
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">{r.paymentMode || "—"}</td>
                        </AnimatedTableRow>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="mt-6 text-xs text-gray-500">* Demo data. Wire to your API for live records.</div>
            </div>

            {/* Medicines Manager */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Medicine List & Stock</h3>
                <div className="flex items-center gap-2">
                  <div className="flex rounded-lg overflow-hidden border">
                    <input
                      value={medSearch}
                      onChange={(e) => setMedSearch(e.target.value)}
                      placeholder="Search medicines..."
                      className="px-3 py-2 text-sm outline-none"
                    />
                    <span className="px-3 py-2 bg-gray-50 text-gray-600 text-xs">{medFiltered.length}</span>
                  </div>
                  <button className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700" onClick={() => setAddOpen(true)}>
                    <div className="inline-flex items-center gap-2">
                      <Icon.Plus /> Add Medicine
                    </div>
                  </button>
                  <button className="px-3 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700" onClick={() => setImportOpen(true)}>
                    <div className="inline-flex items-center gap-2">
                      <Icon.Upload /> Import
                    </div>
                  </button>
                  <button
                    className="px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
                    disabled={shortages.length === 0}
                    onClick={() => {
                      setPoSelection(shortageDefaultItems);
                      setPoOpen(true);
                    }}
                  >
                    <div className="inline-flex items-center gap-2">
                      <Icon.PO /> Purchase Order
                    </div>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {["Medicine", "Form", "Batch", "Expiry", "MRP", "Buy", "Stock", "Reorder", "Rack", "Status", "Actions"].map((h) => (
                        <th key={h} className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {medFiltered.map((m, i) => (
                      <AnimatedTableRow key={m.id} index={i}>
                        <td className="px-3 py-2 font-medium text-gray-900">{m.name}</td>
                        <td className="px-3 py-2">{m.form}</td>
                        <td className="px-3 py-2">{m.batch}</td>
                        <td className="px-3 py-2">{m.expiry}</td>
                        <td className="px-3 py-2">{inr(m.mrp)}</td>
                        <td className="px-3 py-2">{inr(m.buyPrice)}</td>
                        <td className="px-3 py-2 font-semibold">{comma(m.stock)}</td>
                        <td className="px-3 py-2">{comma(m.reorderLevel)}</td>
                        <td className="px-3 py-2">{m.rack}</td>
                        <td className="px-3 py-2">
                          <StockBadge qty={m.stock} reorder={m.reorderLevel} />
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              className="px-2 py-1 text-xs rounded border hover:bg-gray-50 inline-flex items-center gap-1"
                              onClick={() => {
                                const qty = parseInt(prompt(`Add stock for ${m.name}`, "10") || "0", 10);
                                if (!isNaN(qty) && qty > 0)
                                  setMedicines((prev) => prev.map((x) => (x.id === m.id ? { ...x, stock: x.stock + qty } : x)));
                              }}
                            >
                              + Stock
                            </button>
                            <button
                              className="px-2 py-1 text-xs rounded border hover:bg-gray-50 inline-flex items-center gap-1"
                              onClick={() => {
                                const qty = parseInt(prompt(`Reduce stock for ${m.name}`, "1") || "0", 10);
                                if (!isNaN(qty) && qty > 0)
                                  setMedicines((prev) =>
                                    prev.map((x) => (x.id === m.id ? { ...x, stock: Math.max(0, x.stock - qty) } : x))
                                  );
                              }}
                            >
                              - Stock
                            </button>
                            {/* NEW: Edit batch/expiry */}
                            <button
                              className="px-2 py-1 text-xs rounded border inline-flex items-center gap-1 hover:bg-gray-50"
                              onClick={() => {
                                setEditTarget(m);
                                setEditOpen(true);
                              }}
                              title="Edit batch & expiry"
                            >
                              <Icon.Edit /> Edit
                            </button>
                            {/* NEW: Row-level PO */}
                            <button
                              className="px-2 py-1 text-xs rounded border inline-flex items-center gap-1 hover:bg-indigo-50 text-indigo-700 border-indigo-200"
                              onClick={() => {
                                const qty = Math.max(m.reorderLevel * 2 - m.stock, 1);
                                setPoSelection([{ name: m.name, batch: m.batch, buyPrice: m.buyPrice, qty }]);
                                setPoOpen(true);
                              }}
                              title="Create PO for this item"
                            >
                              <Icon.PO /> PO
                            </button>
                            <button
                              className="px-2 py-1 text-xs rounded border hover:bg-red-50 text-red-700 border-red-200 inline-flex items-center gap-1"
                              onClick={() => handleDeleteMedicine(m.id)}
                            >
                              <Icon.Trash /> Remove
                            </button>
                          </div>
                        </td>
                      </AnimatedTableRow>
                    ))}
                    {medFiltered.length === 0 && (
                      <tr>
                        <td colSpan={11} className="px-3 py-8 text-center text-gray-500">
                          No medicines found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Purchase Orders history */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">Recent Purchase Orders</h4>
                  <span className="text-xs text-gray-500">{purchaseOrders.length} total</span>
                </div>
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        {["PO No", "Date", "Supplier", "Expected", "Items", "Amount"].map((h) => (
                          <th key={h} className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {purchaseOrders.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-3 py-8 text-center text-gray-500">
                            No purchase orders yet.
                          </td>
                        </tr>
                      ) : (
                        purchaseOrders.map((po) => (
                          <tr key={po.id} className="border-t">
                            <td className="px-3 py-2 font-medium">{po.poNo}</td>
                            <td className="px-3 py-2">{po.date}</td>
                            <td className="px-3 py-2">{po.supplier || "—"}</td>
                            <td className="px-3 py-2">{po.expectedDate || "—"}</td>
                            <td className="px-3 py-2">{po.items.length}</td>
                            <td className="px-3 py-2 font-semibold">{inr(po.total)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddMedicineModal open={addOpen} onClose={() => setAddOpen(false)} onAdd={handleAddMedicine} />
      <ImportModal open={importOpen} onClose={() => setImportOpen(false)} onImport={handleImport} />

      <POModal
        open={poOpen}
        onClose={() => setPoOpen(false)}
        items={poSelection}
        onCreate={handleCreatePO}
      />

      <EditMedicineModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        medicine={editTarget}
        onSave={(updated) => {
          setMedicines((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
          setEditOpen(false);
        }}
      />

      <CreatePrescriptionModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSave={(rec) => setRecords((prev) => [rec, ...prev])}
      />
    </div>
  );
};

export default Pharmacy;
