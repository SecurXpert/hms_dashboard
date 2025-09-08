import React, { useMemo, useState } from "react";

/* ---------------- seed data ---------------- */
const initialTPAs = [
  {
    id: "tpa-1",
    name: "Health Life Insurance",
    code: "2013",
    phone: "9848940151",
    address: "Delhi",
    contactName: "Arvind Singh",
    contactPhone: "8445661051",
  },
  {
    id: "tpa-2",
    name: "Star Health Insurance",
    code: "111",
    phone: "7864456525",
    address: "AB road, Indore",
    contactName: "Mr Vineet Sharma",
    contactPhone: "8787852121",
  },
  {
    id: "tpa-3",
    name: "IDBI Federal",
    code: "154",
    phone: "9874523647",
    address: "Main Branch, Indore",
    contactName: "Menis Albert",
    contactPhone: "9871453652",
  },
  {
    id: "tpa-4",
    name: "CGHS",
    code: "6549464",
    phone: "9564564745",
    address: "789, Paradise Complex, CA",
    contactName: "Monica Gibbs",
    contactPhone: "689464645",
  },
];

/* ---------------- small UI bits ---------------- */
const SortIcon = ({ dir }) => (
  <span className="ml-1 inline-block w-3">{dir === "asc" ? "▲" : dir === "desc" ? "▼" : "⇵"}</span>
);

const ToolbarBtn = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="rounded-md border bg-white px-3 py-2 text-sm hover:bg-slate-50 active:scale-[.98] transition"
  >
    {children}
  </button>
);

/* ---------------- Add/Edit Modal ---------------- */
const UpsertModal = ({ open, onClose, onSave, initial }) => {
  const [f, setF] = useState(
    initial || {
      name: "",
      code: "",
      phone: "",
      address: "",
      contactName: "",
      contactPhone: "",
    }
  );
  React.useEffect(() => {
    if (initial) setF(initial);
  }, [initial]);

  if (!open) return null;

  const change = (e) => setF((p) => ({ ...p, [e.target.name]: e.target.value }));
  const submit = (e) => {
    e.preventDefault();
    const data = { ...f, id: f.id || `tpa-${Date.now()}` };
    onSave(data);
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-3xl rounded-xl border bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="font-semibold">{initial ? "Edit TPA" : "Add TPA"}</div>
          <button onClick={onClose} className="text-xl leading-none">×</button>
        </div>

        <form onSubmit={submit} className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
          <div>
            <label className="text-sm text-slate-600">Name *</label>
            <input
              name="name"
              value={f.name}
              onChange={change}
              required
              className="mt-1 w-full rounded-md border px-3 py-2"
              placeholder="Insurer / TPA Name"
            />
          </div>
          <div>
            <label className="text-sm text-slate-600">Code *</label>
            <input
              name="code"
              value={f.code}
              onChange={change}
              required
              className="mt-1 w-full rounded-md border px-3 py-2"
              placeholder="Internal Code"
            />
          </div>
          <div>
            <label className="text-sm text-slate-600">Phone</label>
            <input
              name="phone"
              value={f.phone}
              onChange={change}
              className="mt-1 w-full rounded-md border px-3 py-2"
              placeholder="+91…"
            />
          </div>
          <div>
            <label className="text-sm text-slate-600">Contact Person</label>
            <input
              name="contactName"
              value={f.contactName}
              onChange={change}
              className="mt-1 w-full rounded-md border px-3 py-2"
              placeholder="Name"
            />
          </div>
          <div>
            <label className="text-sm text-slate-600">Contact Phone</label>
            <input
              name="contactPhone"
              value={f.contactPhone}
              onChange={change}
              className="mt-1 w-full rounded-md border px-3 py-2"
              placeholder="+91…"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-slate-600">Address</label>
            <input
              name="address"
              value={f.address}
              onChange={change}
              className="mt-1 w-full rounded-md border px-3 py-2"
              placeholder="Street, City, State"
            />
          </div>

          <div className="md:col-span-2 flex justify-end gap-2 pt-1">
            <button type="button" onClick={onClose} className="rounded-md border px-4 py-2">
              Cancel
            </button>
            <button className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ---------------- main component ---------------- */
const TPA = () => {
  const [rows, setRows] = useState(initialTPAs);
  const [query, setQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({ key: "name", dir: "asc" });
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [r.name, r.code, r.phone, r.address, r.contactName, r.contactPhone]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [rows, query]);

  const sorted = useMemo(() => {
    const { key, dir } = sort;
    const s = [...filtered].sort((a, b) => {
      const av = (a[key] || "").toString().toLowerCase();
      const bv = (b[key] || "").toString().toLowerCase();
      if (av < bv) return dir === "asc" ? -1 : 1;
      if (av > bv) return dir === "asc" ? 1 : -1;
      return 0;
    });
    return s;
  }, [filtered, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const start = (page - 1) * pageSize;
  const paged = sorted.slice(start, start + pageSize);

  const setSortKey = (key) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));

  const save = (item) => {
    setRows((prev) => {
      const idx = prev.findIndex((r) => r.id === item.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = item;
        return copy;
      }
      return [item, ...prev];
    });
    setOpen(false);
    setEditing(null);
  };

  const remove = (id) => {
    if (!window.confirm("Delete this TPA?")) return;
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const exportCsv = () => {
    const header = [
      "Name",
      "Code",
      "Phone",
      "Address",
      "Contact Person Name",
      "Contact Person Phone",
    ];
    const lines = sorted.map((r) => [
      r.name,
      r.code,
      r.phone,
      r.address,
      r.contactName,
      r.contactPhone,
    ]);
    const csv =
      header.join(",") +
      "\n" +
      lines.map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tpa_list_${Date.now()}.csv`;
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
          <td style="padding:6px;border:1px solid #e5e7eb">${r.code}</td>
          <td style="padding:6px;border:1px solid #e5e7eb">${r.phone}</td>
          <td style="padding:6px;border:1px solid #e5e7eb">${r.address}</td>
          <td style="padding:6px;border:1px solid #e5e7eb">${r.contactName}</td>
          <td style="padding:6px;border:1px solid #e5e7eb">${r.contactPhone}</td>
        </tr>`
      )
      .join("");
    w.document.write(`
      <title>TPA Management</title>
      <body>
        <h3 style="font-family:sans-serif">TPA Management</h3>
        <table style="border-collapse:collapse;font-family:sans-serif;font-size:12px">
          <thead>
            <tr>
              <th style="padding:6px;border:1px solid #e5e7eb;text-align:left">Name</th>
              <th style="padding:6px;border:1px solid #e5e7eb;text-align:left">Code</th>
              <th style="padding:6px;border:1px solid #e5e7eb;text-align:left">Phone</th>
              <th style="padding:6px;border:1px solid #e5e7eb;text-align:left">Address</th>
              <th style="padding:6px;border:1px solid #e5e7eb;text-align:left">Contact Person Name</th>
              <th style="padding:6px;border:1px solid #e5e7eb;text-align:left">Contact Person Phone</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </body>`);
    w.print();
    w.close();
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4">
      <div className="rounded-lg border bg-white overflow-hidden">
        {/* header */}
        <div className="flex flex-col gap-3 border-b px-4 py-3 md:flex-row md:items-center md:justify-between">
          <h1 className="text-base font-semibold">TPA Management</h1>
          <div className="flex items-center gap-2">
            <ToolbarBtn onClick={() => setOpen(true)}>+ Add TPA</ToolbarBtn>
            <ToolbarBtn onClick={exportCsv}>⤓ Export CSV</ToolbarBtn>
            <ToolbarBtn onClick={printTable}>🖨️ Print</ToolbarBtn>
          </div>
        </div>

        {/* controls */}
        <div className="flex flex-col gap-3 border-b px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
          <input
            placeholder="Search..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 sm:w-80"
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
          <table className="min-w-[900px] w-full divide-y divide-gray-200">
            <thead className="bg-slate-100 text-xs uppercase text-slate-700">
              <tr className="text-left">
                <th className="px-4 py-3 cursor-pointer" onClick={() => setSortKey("name")}>
                  Name <SortIcon dir={sort.key === "name" ? sort.dir : undefined} />
                </th>
                <th className="px-4 py-3 cursor-pointer" onClick={() => setSortKey("code")}>
                  Code <SortIcon dir={sort.key === "code" ? sort.dir : undefined} />
                </th>
                <th className="px-4 py-3 cursor-pointer" onClick={() => setSortKey("phone")}>
                  Phone <SortIcon dir={sort.key === "phone" ? sort.dir : undefined} />
                </th>
                <th className="px-4 py-3">Address</th>
                <th className="px-4 py-3 cursor-pointer" onClick={() => setSortKey("contactName")}>
                  Contact Person Name <SortIcon dir={sort.key === "contactName" ? sort.dir : undefined} />
                </th>
                <th className="px-4 py-3">Contact Person Phone</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paged.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm font-medium text-slate-800">{r.name}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{r.code}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{r.phone}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{r.address}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{r.contactName}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{r.contactPhone}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditing(r);
                          setOpen(true);
                        }}
                        className="rounded-md border bg-white px-2 py-1 text-xs hover:bg-slate-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => remove(r.id)}
                        className="rounded-md border bg-white px-2 py-1 text-xs hover:bg-rose-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-500">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* footer / pagination */}
        <div className="flex flex-col gap-2 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-600">
            Records: <b>{sorted.length === 0 ? 0 : start + 1}</b> to{" "}
            <b>{Math.min(start + pageSize, sorted.length)}</b> of <b>{sorted.length}</b>
          </div>
          <div className="flex items-center gap-2">
            <ToolbarBtn onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
              ‹ Prev
            </ToolbarBtn>
            <span className="text-sm">
              Page <b>{page}</b> / {totalPages}
            </span>
            <ToolbarBtn onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>
              Next ›
            </ToolbarBtn>
          </div>
        </div>
      </div>

      {/* modal */}
      <UpsertModal
        open={open}
        initial={editing}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
        onSave={save}
      />
    </div>
  );
};

export default TPA;
