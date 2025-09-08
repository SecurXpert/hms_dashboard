import React, { useMemo, useState } from "react";

/* ---------------- helpers ---------------- */
const inr = (n) =>
  (Number(n) || 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });

const SortIcon = ({ dir }) => (
  <span className="inline-block w-3 ml-1">{dir === "asc" ? "▲" : dir === "desc" ? "▼" : "⇵"}</span>
);

/* ---------------- seed data ---------------- */
const seedItems = [
  {
    id: "it-1",
    name: "Automatic Blood Pressure",
    category: "Automatic Blood Pressure Cuff",
    supplier: "Quick Service",
    store: "Vinay Pharmacy",
    date: "2025-08-30",
    description:
      "High Quality Medical Equipment, Surgical Equipment & Instruments, Pharmaceutical Testing Machines.",
    totalQty: 100,
    generatedBy: "Super Admin (9001)",
    price: 120,
  },
  {
    id: "it-2",
    name: "Medical shoe and boot covers",
    category: "Apparel",
    supplier: "VK Supplier",
    store: "Vardaan",
    date: "2025-08-25",
    description: "Disposable covers for sterile zones.",
    totalQty: 10,
    generatedBy: "Super Admin (9001)",
    price: 100,
  },
  {
    id: "it-3",
    name: "Bed Sheet",
    category: "Bed Sheets",
    supplier: "VK Supplier",
    store: "SK Pharma",
    date: "2025-08-20",
    description:
      "Hospital-grade bed sheets for single and double occupancy; easy wash & dry.",
    totalQty: 100,
    generatedBy: "Super Admin (9001)",
    price: 120,
  },
  {
    id: "it-4",
    name: "Uniform (Patient-Staff)",
    category: "Uniforms",
    supplier: "VK Supplier",
    store: "Vinay Pharmacy",
    date: "2025-08-15",
    description:
      "Helps identify employees and avoid mistakes; comfortable fabric.",
    totalQty: 12,
    generatedBy: "Super Admin (9001)",
    price: 150,
  },
  {
    id: "it-5",
    name: "Personal Protective Equipment Kit",
    category: "Medical Equipment",
    supplier: "VK Supplier",
    store: "Vardaan",
    date: "2025-08-10",
    description: "Complete PPE kit for high-risk areas.",
    totalQty: 20,
    generatedBy: "Super Admin (9001)",
    price: 100,
  },
];

/* ---------------- atoms ---------------- */
const ToolbarBtn = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="rounded-md border bg-white px-3 py-2 text-sm hover:bg-slate-50 active:scale-[.98] transition"
  >
    {children}
  </button>
);

const IconBtn = ({ label, onClick }) => (
  <button
    title={label}
    onClick={onClick}
    className="p-2 rounded-md hover:bg-slate-100 active:scale-95 transition"
  >
    {label}
  </button>
);

/* ---------------- modals ---------------- */
const AddEditModal = ({ open, onClose, onSave, initial }) => {
  const [f, setF] = useState(
    initial || {
      name: "",
      category: "",
      supplier: "",
      store: "",
      date: new Date().toISOString().slice(0, 10),
      description: "",
      totalQty: 0,
      generatedBy: "Super Admin (9001)",
      price: 0,
    }
  );
  React.useEffect(() => {
    if (initial) setF(initial);
  }, [initial]);
  if (!open) return null;

  const change = (e) => {
    const { name, value } = e.target;
    setF((p) => ({ ...p, [name]: value }));
  };
  const submit = (e) => {
    e.preventDefault();
    onSave({ ...f, id: f.id || `it-${Date.now()}`, totalQty: Number(f.totalQty) || 0, price: Number(f.price) || 0 });
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl border animate-[pop_.18s_ease-out_forwards] opacity-0 scale-95">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="font-semibold">{initial ? "Edit Item" : "Add Item Stock"}</div>
          <button onClick={onClose} className="text-xl leading-none">×</button>
        </div>

        <form onSubmit={submit} className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-slate-600">Name *</label>
            <input name="name" value={f.name} onChange={change} required className="mt-1 w-full border rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="text-sm text-slate-600">Category *</label>
            <input name="category" value={f.category} onChange={change} required className="mt-1 w-full border rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="text-sm text-slate-600">Supplier</label>
            <input name="supplier" value={f.supplier} onChange={change} className="mt-1 w-full border rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="text-sm text-slate-600">Store</label>
            <input name="store" value={f.store} onChange={change} className="mt-1 w-full border rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="text-sm text-slate-600">Date *</label>
            <input type="date" name="date" value={f.date} onChange={change} required className="mt-1 w-full border rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="text-sm text-slate-600">Total Quantity *</label>
            <input type="number" min="0" name="totalQty" value={f.totalQty} onChange={change} required className="mt-1 w-full border rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="text-sm text-slate-600">Purchase Price (₹) *</label>
            <input type="number" min="0" step="0.01" name="price" value={f.price} onChange={change} required className="mt-1 w-full border rounded-md px-3 py-2" />
          </div>
          <div className="md:col-span-3">
            <label className="text-sm text-slate-600">Description</label>
            <textarea name="description" value={f.description} onChange={change} rows={3} className="mt-1 w-full border rounded-md px-3 py-2 resize-y" />
          </div>
          <div>
            <label className="text-sm text-slate-600">Generated By</label>
            <input name="generatedBy" value={f.generatedBy} onChange={change} className="mt-1 w-full border rounded-md px-3 py-2" />
          </div>

          <div className="md:col-span-3 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="border rounded-md px-4 py-2">Cancel</button>
            <button className="rounded-md bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 active:scale-95 transition">Save</button>
          </div>
        </form>
      </div>

      <style>{`@keyframes pop{to{opacity:1;transform:scale(1)}}`}</style>
    </div>
  );
};

const IssueModal = ({ open, item, onClose, onIssue }) => {
  const [f, setF] = useState({
    qty: 1,
    issuedTo: "",
    remarks: "",
    date: new Date().toISOString().slice(0, 10),
  });
  React.useEffect(() => {
    setF({ qty: 1, issuedTo: "", remarks: "", date: new Date().toISOString().slice(0, 10) });
  }, [item]);
  if (!open || !item) return null;

  const change = (e) => setF((p) => ({ ...p, [e.target.name]: e.target.value }));
  const submit = (e) => {
    e.preventDefault();
    const qty = Number(f.qty) || 0;
    if (qty <= 0) return alert("Quantity must be greater than zero.");
    if (qty > item.totalQty) return alert("Not enough stock.");
    onIssue({ ...f, qty });
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl border animate-[pop_.18s_ease-out_forwards] opacity-0 scale-95">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="font-semibold">Issue Item • {item.name}</div>
          <button onClick={onClose} className="text-xl leading-none">×</button>
        </div>
        <form onSubmit={submit} className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-600">Quantity *</label>
            <input type="number" min="1" max={item.totalQty} name="qty" value={f.qty} onChange={change} required className="mt-1 w-full border rounded-md px-3 py-2" />
            <div className="text-xs text-slate-500 mt-1">Available: {item.totalQty}</div>
          </div>
          <div>
            <label className="text-sm text-slate-600">Issued To *</label>
            <input name="issuedTo" value={f.issuedTo} onChange={change} required className="mt-1 w-full border rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="text-sm text-slate-600">Date *</label>
            <input type="date" name="date" value={f.date} onChange={change} required className="mt-1 w-full border rounded-md px-3 py-2" />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-slate-600">Remarks</label>
            <textarea name="remarks" value={f.remarks} onChange={change} rows={3} className="mt-1 w-full border rounded-md px-3 py-2 resize-y" />
          </div>
          <div className="md:col-span-2 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="border rounded-md px-4 py-2">Cancel</button>
            <button className="rounded-md bg-emerald-600 text-white px-4 py-2 hover:bg-emerald-700 active:scale-95 transition">Issue</button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ---------------- main ---------------- */
const Inventory = () => {
  const [rows, setRows] = useState(seedItems);
  const [query, setQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({ key: "date", dir: "desc" });

  const [openAdd, setOpenAdd] = useState(false);
  const [editing, setEditing] = useState(null);

  const [issuing, setIssuing] = useState(null); // item
  const [historyOpen, setHistoryOpen] = useState(false);

  const historyKey = "__inv_issue_history__";
  const getHistory = () => JSON.parse(sessionStorage.getItem(historyKey) || "[]");
  const pushHistory = (entry) => {
    const next = [entry, ...getHistory()];
    sessionStorage.setItem(historyKey, JSON.stringify(next));
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [r.name, r.category, r.supplier, r.store, r.description, r.generatedBy]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [rows, query]);

  const sorted = useMemo(() => {
    const { key, dir } = sort;
    return [...filtered].sort((a, b) => {
      let av = a[key], bv = b[key];
      if (key === "date") {
        av = new Date(a.date).getTime();
        bv = new Date(b.date).getTime();
      }
      if (typeof av === "string") av = av.toLowerCase();
      if (typeof bv === "string") bv = bv.toLowerCase();
      if (av < bv) return dir === "asc" ? -1 : 1;
      if (av > bv) return dir === "asc" ? 1 : -1;
      return 0;
    });
  }, [filtered, sort]);

  const start = (page - 1) * pageSize;
  const paged = sorted.slice(start, start + pageSize);
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));

  const setSortKey = (key) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));

  const saveItem = (item) => {
    setRows((prev) => {
      const idx = prev.findIndex((r) => r.id === item.id);
      if (idx >= 0) {
        const cp = [...prev];
        cp[idx] = item;
        return cp;
      }
      return [item, ...prev];
    });
    setOpenAdd(false);
    setEditing(null);
  };

  const removeItem = (id) => {
    if (!window.confirm("Delete this item?")) return;
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const issueItem = (payload) => {
    const { qty, issuedTo, remarks, date } = payload;
    setRows((prev) =>
      prev.map((r) =>
        r.id === issuing.id ? { ...r, totalQty: r.totalQty - qty } : r
      )
    );
    pushHistory({
      id: Date.now(),
      name: issuing.name,
      qty,
      issuedTo,
      remarks,
      date,
      store: issuing.store,
      supplier: issuing.supplier,
    });
    setIssuing(null);
  };

  const exportCsv = () => {
    const header = [
      "Name",
      "Category",
      "Supplier",
      "Store",
      "Date",
      "Description",
      "Total Quantity",
      "Generated By",
      "Purchase Price (₹)",
    ];
    const lines = sorted.map((r) => [
      r.name,
      r.category,
      r.supplier,
      r.store,
      r.date,
      r.description,
      r.totalQty,
      r.generatedBy,
      r.price,
    ]);
    const csv =
      header.join(",") +
      "\n" +
      lines.map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inventory_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printTable = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    const rowsHtml = sorted
      .map(
        (r) => `<tr>
          <td style="padding:6px;border:1px solid #e5e7eb">${r.name}</td>
          <td style="padding:6px;border:1px solid #e5e7eb">${r.category}</td>
          <td style="padding:6px;border:1px solid #e5e7eb">${r.supplier}</td>
          <td style="padding:6px;border:1px solid #e5e7eb">${r.store}</td>
          <td style="padding:6px;border:1px solid #e5e7eb">${r.date}</td>
          <td style="padding:6px;border:1px solid #e5e7eb">${r.description}</td>
          <td style="padding:6px;border:1px solid #e5e7eb">${r.totalQty}</td>
          <td style="padding:6px;border:1px solid #e5e7eb">${r.generatedBy}</td>
          <td style="padding:6px;border:1px solid #e5e7eb">${inr(r.price)}</td>
        </tr>`
      )
      .join("");
    w.document.write(`
      <title>Inventory</title>
      <body>
        <h3 style="font-family:sans-serif">Item Stock List</h3>
        <table style="border-collapse:collapse;font-family:sans-serif;font-size:12px">
          <thead>
            <tr>
              <th style="padding:6px;border:1px solid #e5e7eb;text-align:left">Name</th>
              <th style="padding:6px;border:1px solid #e5e7eb;text-align:left">Category</th>
              <th style="padding:6px;border:1px solid #e5e7eb;text-align:left">Supplier</th>
              <th style="padding:6px;border:1px solid #e5e7eb;text-align:left">Store</th>
              <th style="padding:6px;border:1px solid #e5e7eb;text-align:left">Date</th>
              <th style="padding:6px;border:1px solid #e5e7eb;text-align:left">Description</th>
              <th style="padding:6px;border:1px solid #e5e7eb;text-align:left">Total Qty</th>
              <th style="padding:6px;border:1px solid #e5e7eb;text-align:left">Generated By</th>
              <th style="padding:6px;border:1px solid #e5e7eb;text-align:left">Purchase Price</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </body>`);
    w.print();
    w.close();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 p-4">
      <div className="rounded-xl border bg-white overflow-hidden shadow-sm">
        {/* header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-slate-50">
          <h1 className="text-base font-semibold flex items-center gap-2">
            📦 Item Stock List
            <span className="text-xs text-slate-500 font-normal">({rows.length} items)</span>
          </h1>
          <div className="flex items-center gap-2">
            <ToolbarBtn onClick={() => setOpenAdd(true)}>➕ Add Item Stock</ToolbarBtn>
            <ToolbarBtn onClick={() => setHistoryOpen(true)}>🧾 Issue History</ToolbarBtn>
            <ToolbarBtn onClick={exportCsv}>⤓ Export CSV</ToolbarBtn>
            <ToolbarBtn onClick={printTable}>🖨️ Print</ToolbarBtn>
          </div>
        </div>

        {/* controls */}
        <div className="flex flex-col gap-3 px-3 py-3 border-b sm:flex-row sm:items-center sm:justify-between">
          <input
            placeholder="Search…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-96 rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
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

        {/* table */}
        <div className="overflow-x-auto">
          <table className="min-w-[1200px] w-full divide-y divide-gray-200">
            <thead className="bg-slate-100 text-xs uppercase text-slate-700">
              <tr className="text-left">
                <th className="px-4 py-3 cursor-pointer" onClick={() => setSortKey("name")}>
                  Name <SortIcon dir={sort.key === "name" ? sort.dir : undefined} />
                </th>
                <th className="px-4 py-3 cursor-pointer" onClick={() => setSortKey("category")}>
                  Category <SortIcon dir={sort.key === "category" ? sort.dir : undefined} />
                </th>
                <th className="px-4 py-3">Supplier</th>
                <th className="px-4 py-3">Store</th>
                <th className="px-4 py-3 cursor-pointer" onClick={() => setSortKey("date")}>
                  Date <SortIcon dir={sort.key === "date" ? sort.dir : undefined} />
                </th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3 cursor-pointer text-right" onClick={() => setSortKey("totalQty")}>
                  Total Quantity <SortIcon dir={sort.key === "totalQty" ? sort.dir : undefined} />
                </th>
                <th className="px-4 py-3">Generated By</th>
                <th className="px-4 py-3 cursor-pointer text-right" onClick={() => setSortKey("price")}>
                  Purchase Price (₹) <SortIcon dir={sort.key === "price" ? sort.dir : undefined} />
                </th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paged.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors animate-[rowin_.22s_ease-out]">
                  <td className="px-4 py-3 text-sm font-medium text-blue-700 hover:underline cursor-pointer">
                    {r.name}
                  </td>
                  <td className="px-4 py-3 text-sm">{r.category}</td>
                  <td className="px-4 py-3 text-sm">{r.supplier}</td>
                  <td className="px-4 py-3 text-sm">{r.store}</td>
                  <td className="px-4 py-3 text-sm">{new Date(r.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm text-slate-700 max-w-[650px]">
                    <span className="line-clamp-2">{r.description}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right">{r.totalQty}</td>
                  <td className="px-4 py-3 text-sm">{r.generatedBy}</td>
                  <td className="px-4 py-3 text-sm text-right font-medium">{inr(r.price)}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-1">
                      <IconBtn label="✏️" onClick={() => { setEditing(r); setOpenAdd(true); }} />
                      <IconBtn label="📤" onClick={() => setIssuing(r)} />
                      <IconBtn label="🗑️" onClick={() => removeItem(r.id)} />
                    </div>
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-sm text-slate-500">
                    No items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* footer */}
        <div className="flex flex-col gap-2 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-600">
            Showing <b>{sorted.length ? start + 1 : 0}</b>–
            <b>{Math.min(start + pageSize, sorted.length)}</b> of <b>{sorted.length}</b>
          </div>
          <div className="flex items-center gap-2">
            <ToolbarBtn onClick={() => setPage((p) => Math.max(1, p - 1))}>‹ Prev</ToolbarBtn>
            <span className="text-sm">
              Page <b>{page}</b> / {totalPages}
            </span>
            <ToolbarBtn onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next ›</ToolbarBtn>
          </div>
        </div>
      </div>

      {/* modals */}
      <AddEditModal
        open={openAdd}
        initial={editing}
        onClose={() => { setOpenAdd(false); setEditing(null); }}
        onSave={saveItem}
      />
      <IssueModal
        open={!!issuing}
        item={issuing}
        onClose={() => setIssuing(null)}
        onIssue={issueItem}
      />

      {/* Issue history drawer */}
      {historyOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={() => setHistoryOpen(false)} />
          <div className="w-full sm:w-[32rem] h-full bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="font-semibold">Issue History</div>
              <button onClick={() => setHistoryOpen(false)} className="text-xl leading-none">×</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <table className="w-full text-sm">
                <thead className="text-xs uppercase text-slate-600 border-b">
                  <tr className="text-left">
                    <th className="py-2">Date</th>
                    <th className="py-2">Item</th>
                    <th className="py-2">Qty</th>
                    <th className="py-2">Issued To</th>
                    <th className="py-2">Store</th>
                    <th className="py-2">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {getHistory().map((h) => (
                    <tr key={h.id} className="border-b last:border-b-0">
                      <td className="py-2">{new Date(h.date).toLocaleDateString()}</td>
                      <td className="py-2">{h.name}</td>
                      <td className="py-2">{h.qty}</td>
                      <td className="py-2">{h.issuedTo}</td>
                      <td className="py-2">{h.store}</td>
                      <td className="py-2">{h.remarks || "—"}</td>
                    </tr>
                  ))}
                  {getHistory().length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-slate-500">No issues recorded yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* row animation keyframe */}
      <style>{`@keyframes rowin{from{opacity:.0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
};

export default Inventory;
