import React, { useMemo, useRef, useState } from "react";

/* ----------------------- helpers ----------------------- */
const groups = ["B+", "A+", "AB-", "AB+", "O-", "A-", "B-", "O+"];

const Chip = ({ children, tone = "slate" }) => (
  <span className={`px-2 py-1 rounded-md text-xs bg-${tone}-100 text-${tone}-700`}>
    {children}
  </span>
);

const Drawer = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex">
    <div className="flex-1 bg-black/40" onClick={onClose} />
    <div className="w-full sm:w-[28rem] h-full bg-white shadow-2xl flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="font-semibold">{title}</div>
        <button onClick={onClose} className="text-xl leading-none">×</button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">{children}</div>
    </div>
  </div>
);

const PlusBtn = ({ onClick }) => (
  <button onClick={onClick} className="ml-2 rounded-md border px-2 py-1 text-xs bg-white hover:bg-slate-50" title="Add">
    +
  </button>
);

const IssueBtn = ({ onClick }) => (
  <button
    onClick={onClick}
    className="rounded-md bg-blue-600 text-white px-3 py-1 text-xs hover:bg-blue-700"
  >
    Issue
  </button>
);

/* ---------------------- CSV helpers ---------------------- */
function downloadCSV(filename, header, rows) {
  const csv = [header.join(","), ...rows.map((r) => r.map((c) => (c ?? "")).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}

function parseCSV(text) {
  // Lightweight parser (no quoted commas). One value per comma.
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (!lines.length) return { headers: [], rows: [] };
  const headers = lines[0].split(",").map((h) => h.trim());
  const rows = lines.slice(1).map((line) => line.split(",").map((v) => v.trim()));
  return { headers, rows };
}

/* ---------------------- seed data ---------------------- */
const seed = () => {
  const makeBlood = (n) =>
    Array.from({ length: n }).map((_, i) => ({
      id: `BAG-${i + 1}`,
      bagNo: String(4000 + i * 11),
      volume: i % 2 ? "220 g/dl" : "220 (ML)",
      lot: 2,
      institution: i % 3 === 0 ? "Blood Red Cross Society" : "",
      status: "available",
    }));

  const makeComp = (n) => {
    const comps = ["Red Cells", "Plasma", "Cryo.", "White Cells & Granulocytes"];
    return Array.from({ length: n }).map((_, i) => ({
      id: `CMP-${i + 1}`,
      bagNo: String(4400 + i * 17),
      volume: i % 2 ? "220 g/dl" : "220 (ML)",
      lot: 2,
      component: comps[i % comps.length],
      status: "available",
    }));
  };

  // B+ looks like screenshot (8 & 6)
  const data = {
    "B+": { blood: makeBlood(8), components: makeComp(6) },
  };
  // other groups – smaller random stock
  groups.forEach((g) => {
    if (g === "B+") return;
    data[g] = { blood: makeBlood(3), components: makeComp(2) };
  });
  return data;
};

/* -------------------- add / issue modals -------------------- */
const AddModal = ({ type, onAdd, onClose }) => {
  const [f, setF] = useState({
    bagNo: "",
    volume: "220 (ML)",
    lot: 1,
    institution: "",
    component: "Red Cells",
  });
  const onChange = (e) => {
    const { name, value } = e.target;
    setF((p) => ({ ...p, [name]: value }));
  };
  const submit = (e) => {
    e.preventDefault();
    const item =
      type === "blood"
        ? {
            id: `BAG-${Date.now()}`,
            bagNo: f.bagNo || String(Math.floor(Math.random() * 90000) + 10000),
            volume: f.volume,
            lot: Number(f.lot) || 1,
            institution: f.institution,
            status: "available",
          }
        : {
            id: `CMP-${Date.now()}`,
            bagNo: f.bagNo || String(Math.floor(Math.random() * 90000) + 10000),
            volume: f.volume,
            lot: Number(f.lot) || 1,
            component: f.component,
            status: "available",
          };
    onAdd(item);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="font-semibold">Add {type === "blood" ? "Blood Bag" : "Component Bag"}</div>
          <button onClick={onClose} className="text-xl leading-none">×</button>
        </div>
        <form onSubmit={submit} className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-600">Bag No</label>
            <input name="bagNo" value={f.bagNo} onChange={onChange} className="mt-1 w-full border rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="text-sm text-slate-600">Volume</label>
            <select name="volume" value={f.volume} onChange={onChange} className="mt-1 w-full border rounded-md px-3 py-2">
              <option>220 (ML)</option>
              <option>220 g/dl</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-600">Lot</label>
            <input type="number" min="1" name="lot" value={f.lot} onChange={onChange} className="mt-1 w-full border rounded-md px-3 py-2" />
          </div>
          {type === "blood" ? (
            <div>
              <label className="text-sm text-slate-600">Institution</label>
              <input name="institution" value={f.institution} onChange={onChange} className="mt-1 w-full border rounded-md px-3 py-2" />
            </div>
          ) : (
            <div>
              <label className="text-sm text-slate-600">Component</label>
              <select name="component" value={f.component} onChange={onChange} className="mt-1 w-full border rounded-md px-3 py-2">
                <option>Red Cells</option>
                <option>Plasma</option>
                <option>Cryo.</option>
                <option>White Cells & Granulocytes</option>
              </select>
            </div>
          )}
          <div className="md:col-span-2 flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border">Cancel</button>
            <button className="px-4 py-2 rounded-md bg-blue-600 text-white">Add</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const IssueModal = ({ item, type, group, onIssue, onClose }) => {
  const [f, setF] = useState({
    caseId: "",
    issuedTo: "",
    remarks: "",
    date: new Date().toISOString().slice(0, 10),
  });
  const onChange = (e) => setF((p) => ({ ...p, [e.target.name]: e.target.value }));
  const submit = (e) => {
    e.preventDefault();
    onIssue({
      group,
      type,
      bagNo: item.bagNo,
      lot: item.lot,
      component: item.component,
      institution: item.institution,
      date: f.date,
      caseId: f.caseId,
      issuedTo: f.issuedTo,
      remarks: f.remarks,
    });
  };
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="font-semibold">
            Issue {type === "blood" ? "Blood" : "Component"} • {group} • Bag {item.bagNo}
          </div>
          <button onClick={onClose} className="text-xl leading-none">×</button>
        </div>
        <form onSubmit={submit} className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-600">Case ID *</label>
            <input name="caseId" value={f.caseId} onChange={onChange} required className="mt-1 w-full border rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="text-sm text-slate-600">Issued To *</label>
            <input name="issuedTo" value={f.issuedTo} onChange={onChange} required className="mt-1 w-full border rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="text-sm text-slate-600">Date</label>
            <input type="date" name="date" value={f.date} onChange={onChange} className="mt-1 w-full border rounded-md px-3 py-2" />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-slate-600">Remarks</label>
            <textarea name="remarks" value={f.remarks} onChange={onChange} rows={3} className="mt-1 w-full border rounded-md px-3 py-2" />
          </div>
          <div className="md:col-span-2 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border">Cancel</button>
            <button className="px-4 py-2 rounded-md bg-blue-600 text-white">Issue</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AddDonorModal = ({ onAdd, onClose }) => {
  const [f, setF] = useState({
    name: "",
    age: "",
    phone: "",
    group: "B+",
    last: new Date().toISOString().slice(0, 10),
  });
  const onChange = (e) => setF((p) => ({ ...p, [e.target.name]: e.target.value }));
  const submit = (e) => {
    e.preventDefault();
    onAdd({
      ...f,
      age: Number(f.age) || undefined,
    });
    onClose();
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="font-semibold">Add Donor</div>
          <button onClick={onClose} className="text-xl leading-none">×</button>
        </div>
        <form onSubmit={submit} className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-600">Name *</label>
            <input name="name" value={f.name} onChange={onChange} required className="mt-1 w-full border rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="text-sm text-slate-600">Age</label>
            <input type="number" min="18" name="age" value={f.age} onChange={onChange} className="mt-1 w-full border rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="text-sm text-slate-600">Phone Number</label>
            <input name="phone" value={f.phone} onChange={onChange} className="mt-1 w-full border rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="text-sm text-slate-600">Blood Group</label>
            <select name="group" value={f.group} onChange={onChange} className="mt-1 w-full border rounded-md px-3 py-2">
              {groups.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-600">Date</label>
            <input type="date" name="last" value={f.last} onChange={onChange} className="mt-1 w-full border rounded-md px-3 py-2" />
          </div>
          <div className="md:col-span-2 flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border">Cancel</button>
            <button className="px-4 py-2 rounded-md bg-blue-600 text-white">Add</button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ------------------------ main ------------------------ */
const BloodBank = () => {
  const [store, setStore] = useState(seed());
  const [activeGroup, setActiveGroup] = useState("B+");

  const [drawer, setDrawer] = useState(null); // 'donors' | 'bloodIssues' | 'componentIssues' | null
  const [addOpen, setAddOpen] = useState(null); // 'blood' | 'component' | null
  const [issuing, setIssuing] = useState(null); // { type, item }
  const [addDonorOpen, setAddDonorOpen] = useState(false);
  const [donorSearch, setDonorSearch] = useState("");

  // Stock filters
  const [bloodQuery, setBloodQuery] = useState("");
  const [bloodLot, setBloodLot] = useState("");
  const [bloodInst, setBloodInst] = useState("");

  const [compQuery, setCompQuery] = useState("");
  const [compType, setCompType] = useState(""); // Red Cells / Plasma / Cryo. / White Cells...

  const bloodFileRef = useRef(null);
  const compFileRef = useRef(null);

  const donorsFileRef = useRef(null);

  const current = store[activeGroup];

  const availableCounts = useMemo(() => {
    const countBy = (arr) => arr.filter((x) => x.status === "available").length;
    const out = {};
    groups.forEach((g) => {
      out[g] = {
        blood: countBy(store[g].blood),
        components: countBy(store[g].components),
      };
    });
    return out;
  }, [store]);

  const issueHistory = useMemo(() => {
    const key = "__bb_history__";
    const raw = sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  }, []); // initial read once

  const setHistory = (fn) => {
    const key = "__bb_history__";
    const next = fn(JSON.parse(sessionStorage.getItem(key) || "[]"));
    sessionStorage.setItem(key, JSON.stringify(next));
  };

  const donorsInitial = [
    { id: "D001", name: "Sandeep R", age: 28, phone: "555-1234", group: "B+", last: "2025-08-10", total: 5 },
    { id: "D002", name: "Meenakshi", age: 25, phone: "555-5678", group: "O+", last: "2025-08-12", total: 2 },
    { id: "D003", name: "Zoya K", age: 32, phone: "555-9012", group: "AB+", last: "2025-07-28", total: 3 },
  ];

  const [donors, setDonors] = useState(donorsInitial);

  const filteredDonors = donors.filter(
    (d) =>
      d.id.toLowerCase().includes(donorSearch.toLowerCase()) ||
      d.name.toLowerCase().includes(donorSearch.toLowerCase()) ||
      (d.phone || "").toLowerCase().includes(donorSearch.toLowerCase())
  );

  /* ---------- filters for stock ---------- */
  const filteredBlood = useMemo(() => {
    return current.blood.filter((b) => {
      const q = bloodQuery.trim().toLowerCase();
      const lotOk = bloodLot ? String(b.lot) === String(bloodLot) : true;
      const instOk = bloodInst ? (b.institution || "").toLowerCase().includes(bloodInst.toLowerCase()) : true;
      const qOk =
        !q ||
        String(b.bagNo).toLowerCase().includes(q) ||
        String(b.volume).toLowerCase().includes(q) ||
        String(b.lot).toLowerCase().includes(q) ||
        (b.institution || "").toLowerCase().includes(q);
      return lotOk && instOk && qOk;
    });
  }, [current.blood, bloodQuery, bloodLot, bloodInst]);

  const filteredComps = useMemo(() => {
    return current.components.filter((c) => {
      const q = compQuery.trim().toLowerCase();
      const typeOk = compType ? c.component === compType : true;
      const qOk =
        !q ||
        String(c.bagNo).toLowerCase().includes(q) ||
        String(c.volume).toLowerCase().includes(q) ||
        String(c.lot).toLowerCase().includes(q) ||
        String(c.component).toLowerCase().includes(q);
      return typeOk && qOk;
    });
  }, [current.components, compQuery, compType]);

  /* ---------- actions ---------- */
  const addItem = (type, item) => {
    setStore((s) => {
      const next = { ...s };
      if (type === "blood") next[activeGroup].blood = [item, ...next[activeGroup].blood];
      else next[activeGroup].components = [item, ...next[activeGroup].components];
      return next;
    });
    setAddOpen(null);
  };

  const markIssued = ({ group, type, bagNo, lot, component, institution, date, caseId, issuedTo, remarks }) => {
    setStore((s) => {
      const next = { ...s };
      const list = type === "blood" ? next[group].blood : next[group].components;
      const idx = list.findIndex((x) => x.bagNo === bagNo);
      if (idx >= 0) list.splice(idx, 1); // remove from available
      return next;
    });
    setHistory((prev) => [
      { id: Date.now(), group, type, bagNo, lot, component, institution, date, caseId, issuedTo, remarks },
      ...prev,
    ]);
    setIssuing(null);
  };

  const addDonor = (newDonor) => {
    const nextIdNum = donors.length + 1;
    const id = `D${String(nextIdNum).padStart(3, "0")}`;
    setDonors([...donors, { id, ...newDonor, total: 1 }]);
    setAddDonorOpen(false);
  };

  /* ---------- export/import: stock ---------- */
  const exportBlood = () => {
    const header = ["group", "bagNo", "volume", "lot", "institution", "status"];
    const rows = filteredBlood.map((b) => [activeGroup, b.bagNo, b.volume, b.lot, b.institution || "", b.status || "available"]);
    downloadCSV(`blood_${activeGroup}.csv`, header, rows);
  };
  const exportComponents = () => {
    const header = ["group", "bagNo", "volume", "lot", "component", "status"];
    const rows = filteredComps.map((c) => [activeGroup, c.bagNo, c.volume, c.lot, c.component, c.status || "available"]);
    downloadCSV(`components_${activeGroup}.csv`, header, rows);
  };

  const importBlood = (file) => {
    if (!file) return;
    const fr = new FileReader();
    fr.onload = () => {
      const { headers, rows } = parseCSV(String(fr.result || ""));
      // expected headers: bagNo, volume, lot, institution (group/status optional)
      const idx = (h) => headers.findIndex((x) => x.toLowerCase() === h);
      const ibag = idx("bagno"), ivol = idx("volume"), ilot = idx("lot"), iinst = idx("institution");
      const igroup = idx("group"), istatus = idx("status");
      if (ibag < 0 || ivol < 0 || ilot < 0) {
        alert("CSV must have headers: bagNo, volume, lot, [institution]");
        return;
      }
      const items = rows.map((r) => ({
        id: `BAG-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        bagNo: r[ibag],
        volume: r[ivol],
        lot: Number(r[ilot]) || 1,
        institution: iinst >= 0 ? r[iinst] : "",
        status: istatus >= 0 ? r[istatus] : "available",
        __group: igroup >= 0 ? r[igroup] : activeGroup,
      }));
      setStore((s) => {
        const next = { ...s };
        items.forEach((it) => {
          const grp = groups.includes(it.__group) ? it.__group : activeGroup;
          next[grp].blood = [((({ __group, ...rest }) => rest)(it)), ...next[grp].blood];
        });
        return next;
      });
      if (bloodFileRef.current) bloodFileRef.current.value = "";
      alert("Blood stock imported");
    };
    fr.readAsText(file);
  };

  const importComponents = (file) => {
    if (!file) return;
    const fr = new FileReader();
    fr.onload = () => {
      const { headers, rows } = parseCSV(String(fr.result || ""));
      // expected headers: bagNo, volume, lot, component (group/status optional)
      const idx = (h) => headers.findIndex((x) => x.toLowerCase() === h);
      const ibag = idx("bagno"), ivol = idx("volume"), ilot = idx("lot"), icomp = idx("component");
      const igroup = idx("group"), istatus = idx("status");
      if (ibag < 0 || ivol < 0 || ilot < 0 || icomp < 0) {
        alert("CSV must have headers: bagNo, volume, lot, component");
        return;
      }
      const items = rows.map((r) => ({
        id: `CMP-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        bagNo: r[ibag],
        volume: r[ivol],
        lot: Number(r[ilot]) || 1,
        component: r[icomp],
        status: istatus >= 0 ? r[istatus] : "available",
        __group: igroup >= 0 ? r[igroup] : activeGroup,
      }));
      setStore((s) => {
        const next = { ...s };
        items.forEach((it) => {
          const grp = groups.includes(it.__group) ? it.__group : activeGroup;
          next[grp].components = [((({ __group, ...rest }) => rest)(it)), ...next[grp].components];
        });
        return next;
      });
      if (compFileRef.current) compFileRef.current.value = "";
      alert("Component stock imported");
    };
    fr.readAsText(file);
  };

  /* ----------------------- UI ----------------------- */
  return (
    <div className="p-4 bg-slate-100 min-h-screen">
      <div className="rounded-lg border bg-white">
        {/* header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="text-base font-semibold">Blood Bank Status</div>
          <div className="flex gap-2">
            <button onClick={() => setDrawer("donors")} className="rounded-md bg-slate-100 border px-3 py-1.5 text-xs hover:bg-slate-200">
              ▦ Donor Details
            </button>
            <button onClick={() => setDrawer("bloodIssues")} className="rounded-md bg-slate-100 border px-3 py-1.5 text-xs hover:bg-slate-200">
              ▦ Blood Issue Details
            </button>
            <button onClick={() => setDrawer("componentIssues")} className="rounded-md bg-slate-100 border px-3 py-1.5 text-xs hover:bg-slate-200">
              ▦ Component Issue
            </button>
          </div>
        </div>

        {/* body grid */}
        <div className="grid grid-cols-12 gap-4 p-4">
          {/* left: groups */}
          <div className="col-span-12 md:col-span-2">
            <div className="rounded-lg border overflow-hidden">
              {groups.map((g) => (
                <button
                  key={g}
                  onClick={() => {
                    setActiveGroup(g);
                    // reset filters on change to avoid confusion
                    setBloodQuery(""); setBloodLot(""); setBloodInst("");
                    setCompQuery(""); setCompType("");
                  }}
                  className={`w-full text-left px-4 py-3 border-b last:border-b-0 flex items-center justify-between ${
                    activeGroup === g ? "bg-blue-600 text-white" : "bg-slate-50 hover:bg-slate-100"
                  }`}
                >
                  <span>{g}</span>
                  <span className={`text-xs ${activeGroup === g ? "text-white/80" : "text-slate-500"}`}>
                    {availableCounts[g]?.blood + availableCounts[g]?.components} bags
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* center: Blood table */}
          <div className="col-span-12 md:col-span-5">
            <div className="rounded-lg border bg-white">
              <div className="flex flex-col gap-2 border-b bg-sky-50 px-4 py-2">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">Blood</div>
                  <div className="text-sm flex items-center gap-2">
                    <span>{availableCounts[activeGroup]?.blood} Bags</span>
                    <PlusBtn onClick={() => setAddOpen("blood")} />
                  </div>
                </div>

                {/* Filters + Export/Import */}
                <div className="flex flex-col lg:flex-row gap-2 lg:items-center lg:justify-between">
                  <div className="flex flex-1 flex-wrap gap-2">
                    <input
                      placeholder="Search bag / volume / lot / institution"
                      value={bloodQuery}
                      onChange={(e) => setBloodQuery(e.target.value)}
                      className="flex-1 min-w-[200px] border rounded-md px-3 py-1.5 text-sm"
                    />
                    <input
                      placeholder="Lot"
                      value={bloodLot}
                      onChange={(e) => setBloodLot(e.target.value)}
                      className="w-24 border rounded-md px-3 py-1.5 text-sm"
                    />
                    <input
                      placeholder="Institution"
                      value={bloodInst}
                      onChange={(e) => setBloodInst(e.target.value)}
                      className="min-w-[160px] border rounded-md px-3 py-1.5 text-sm"
                    />
                    <button
                      onClick={() => { setBloodQuery(""); setBloodLot(""); setBloodInst(""); }}
                      className="rounded-md border bg-white px-2.5 py-1.5 text-xs hover:bg-slate-50"
                      title="Clear filters"
                    >
                      Reset
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={exportBlood}
                      className="rounded-md bg-slate-900 text-white px-3 py-1.5 text-xs hover:bg-slate-800"
                      title="Export filtered blood as CSV"
                    >
                      Export
                    </button>
                    <button
                      onClick={() => bloodFileRef.current?.click()}
                      className="rounded-md bg-blue-600 text-white px-3 py-1.5 text-xs hover:bg-blue-700"
                      title='Import CSV: headers -> bagNo,volume,lot,institution,[group],[status]'
                    >
                      Import
                    </button>
                    <input ref={bloodFileRef} type="file" accept=".csv" className="hidden" onChange={(e) => importBlood(e.target.files?.[0])} />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-[600px] w-full divide-y divide-gray-200">
                  <thead className="bg-slate-100">
                    <tr className="text-left text-xs uppercase text-slate-600">
                      <th className="px-4 py-2">Bags</th>
                      <th className="px-4 py-2">Lot</th>
                      <th className="px-4 py-2">Institution</th>
                      <th className="px-4 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredBlood.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-6 text-center text-sm text-slate-500">
                          No stock.
                        </td>
                      </tr>
                    ) : (
                      filteredBlood.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-sm text-slate-800">
                            {b.bagNo} <span className="text-slate-500">({b.volume})</span>
                          </td>
                          <td className="px-4 py-3 text-sm">{b.lot}</td>
                          <td className="px-4 py-3 text-sm">{b.institution || "—"}</td>
                          <td className="px-4 py-3">
                            <IssueBtn onClick={() => setIssuing({ type: "blood", item: b })} />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* right: Components table */}
          <div className="col-span-12 md:col-span-5">
            <div className="rounded-lg border bg-white">
              <div className="flex flex-col gap-2 border-b bg-sky-50 px-4 py-2">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">Components</div>
                  <div className="text-sm">
                    {availableCounts[activeGroup]?.components} Bags
                    <PlusBtn onClick={() => setAddOpen("component")} />
                  </div>
                </div>

                {/* Filters + Export/Import */}
                <div className="flex flex-col lg:flex-row gap-2 lg:items-center lg:justify-between">
                  <div className="flex flex-1 flex-wrap gap-2">
                    <input
                      placeholder="Search bag / volume / lot / component"
                      value={compQuery}
                      onChange={(e) => setCompQuery(e.target.value)}
                      className="flex-1 min-w-[200px] border rounded-md px-3 py-1.5 text-sm"
                    />
                    <select
                      value={compType}
                      onChange={(e) => setCompType(e.target.value)}
                      className="min-w-[160px] border rounded-md px-3 py-1.5 text-sm"
                    >
                      <option value="">All Components</option>
                      <option>Red Cells</option>
                      <option>Plasma</option>
                      <option>Cryo.</option>
                      <option>White Cells & Granulocytes</option>
                    </select>
                    <button
                      onClick={() => { setCompQuery(""); setCompType(""); }}
                      className="rounded-md border bg-white px-2.5 py-1.5 text-xs hover:bg-slate-50"
                      title="Clear filters"
                    >
                      Reset
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={exportComponents}
                      className="rounded-md bg-slate-900 text-white px-3 py-1.5 text-xs hover:bg-slate-800"
                      title="Export filtered components as CSV"
                    >
                      Export
                    </button>
                    <button
                      onClick={() => compFileRef.current?.click()}
                      className="rounded-md bg-blue-600 text-white px-3 py-1.5 text-xs hover:bg-blue-700"
                      title='Import CSV: headers -> bagNo,volume,lot,component,[group],[status]'
                    >
                      Import
                    </button>
                    <input ref={compFileRef} type="file" accept=".csv" className="hidden" onChange={(e) => importComponents(e.target.files?.[0])} />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-[650px] w-full divide-y divide-gray-200">
                  <thead className="bg-slate-100">
                    <tr className="text-left text-xs uppercase text-slate-600">
                      <th className="px-4 py-2">Bags</th>
                      <th className="px-4 py-2">Lot</th>
                      <th className="px-4 py-2">Components</th>
                      <th className="px-4 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredComps.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-6 text-center text-sm text-slate-500">
                          No stock.
                        </td>
                      </tr>
                    ) : (
                      filteredComps.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-sm text-slate-800">
                            {c.bagNo} <span className="text-slate-500">({c.volume})</span>
                          </td>
                          <td className="px-4 py-3 text-sm">{c.lot}</td>
                          <td className="px-4 py-3 text-sm">{c.component}</td>
                          <td className="px-4 py-3">
                            <IssueBtn onClick={() => setIssuing({ type: "component", item: c })} />
                          </td>
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

      {/* Add + Issue Modals */}
      {addOpen && (
        <AddModal
          type={addOpen === "blood" ? "blood" : "component"}
          onAdd={(item) => addItem(addOpen === "blood" ? "blood" : "component", item)}
          onClose={() => setAddOpen(null)}
        />
      )}

      {issuing && (
        <IssueModal
          item={issuing.item}
          type={issuing.type}
          group={activeGroup}
          onIssue={markIssued}
          onClose={() => setIssuing(null)}
        />
      )}

      {addDonorOpen && <AddDonorModal onAdd={addDonor} onClose={() => setAddDonorOpen(false)} />}

      {/* Drawers */}
      {drawer === "donors" && (
        <Drawer title="Donor Details" onClose={() => setDrawer(null)}>
          <>
            <div className="mb-3 flex flex-col sm:flex-row sm:items-center gap-2">
              <input
                type="text"
                placeholder="Filter by ID, Name or Phone"
                value={donorSearch}
                onChange={(e) => setDonorSearch(e.target.value)}
                className="flex-1 border rounded-md px-3 py-2 text-sm"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const header = ["id", "name", "age", "phone", "group", "last", "total"];
                    const rows = filteredDonors.map((d) => [d.id, d.name, d.age ?? "", d.phone ?? "", d.group, d.last, d.total ?? 0]);
                    downloadCSV("donors.csv", header, rows);
                  }}
                  className="rounded-md bg-slate-900 text-white px-3 py-2 text-sm hover:bg-slate-800"
                >
                  Export
                </button>
                <button
                  onClick={() => donorsFileRef.current?.click()}
                  className="rounded-md bg-blue-600 text-white px-3 py-2 text-sm hover:bg-blue-700"
                  title='Import CSV: headers -> name,age,phone,group,last,[id],[total]'
                >
                  Import
                </button>
                <input
                  ref={donorsFileRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const fr = new FileReader();
                    fr.onload = () => {
                      const { headers, rows } = parseCSV(String(fr.result || ""));
                      const idx = (h) => headers.findIndex((x) => x.toLowerCase() === h);
                      const iname = idx("name"), iage = idx("age"), iphone = idx("phone"), igroup = idx("group"), ilast = idx("last");
                      const iid = idx("id"), itotal = idx("total");
                      if (iname < 0 || igroup < 0) {
                        alert("CSV must include at least: name, group (age/phone/last optional)");
                        return;
                      }
                      const next = rows.map((r, k) => ({
                        id: iid >= 0 ? r[iid] : `D${String(donors.length + k + 1).padStart(3, "0")}`,
                        name: r[iname],
                        age: iage >= 0 ? Number(r[iage] || 0) || undefined : undefined,
                        phone: iphone >= 0 ? r[iphone] : "",
                        group: r[igroup],
                        last: ilast >= 0 ? r[ilast] : new Date().toISOString().slice(0, 10),
                        total: itotal >= 0 ? Number(r[itotal] || 0) || 0 : 1,
                      }));
                      setDonors((prev) => [...prev, ...next]);
                      donorsFileRef.current.value = "";
                      alert("Donors imported");
                    };
                    fr.readAsText(file);
                  }}
                />
                <button
                  onClick={() => setAddDonorOpen(true)}
                  className="rounded-md bg-green-600 text-white px-3 py-2 text-sm hover:bg-green-700"
                >
                  Add Donor
                </button>
              </div>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase text-slate-500 border-b">
                  <th className="py-2">ID</th>
                  <th className="py-2">Name</th>
                  <th className="py-2">Age</th>
                  <th className="py-2">Phone</th>
                  <th className="py-2">Group</th>
                  <th className="py-2">Last Donation</th>
                  <th className="py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {filteredDonors.map((d) => (
                  <tr key={d.id} className="border-b last:border-b-0">
                    <td className="py-2">{d.id}</td>
                    <td className="py-2">{d.name}</td>
                    <td className="py-2">{d.age || "—"}</td>
                    <td className="py-2">{d.phone || "—"}</td>
                    <td className="py-2">{d.group}</td>
                    <td className="py-2">{d.last}</td>
                    <td className="py-2">{d.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-3 text-xs text-slate-500">* Demo donors list</div>
          </>
        </Drawer>
      )}

      {drawer === "bloodIssues" && (
        <Drawer title="Blood Issue Details" onClose={() => setDrawer(null)}>
          <HistoryTable filterType="blood" />
        </Drawer>
      )}

      {drawer === "componentIssues" && (
        <Drawer title="Component Issue Details" onClose={() => setDrawer(null)}>
          <HistoryTable filterType="component" />
        </Drawer>
      )}
    </div>
  );

  /* --------- nested: history table using sessionStorage --------- */
  function HistoryTable({ filterType }) {
    const [rows, setRows] = useState(() => {
      const raw = sessionStorage.getItem("__bb_history__");
      const all = raw ? JSON.parse(raw) : [];
      return all.filter((r) => r.type === filterType);
    });

    // Filters
    const [q, setQ] = useState("");
    const [g, setG] = useState(""); // group
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");

    const filtered = rows.filter((r) => {
      const qok =
        !q ||
        String(r.caseId).toLowerCase().includes(q.toLowerCase()) ||
        String(r.issuedTo).toLowerCase().includes(q.toLowerCase()) ||
        String(r.bagNo).toLowerCase().includes(q.toLowerCase()) ||
        (filterType === "component"
          ? String(r.component).toLowerCase().includes(q.toLowerCase())
          : String(r.institution || "").toLowerCase().includes(q.toLowerCase()));
      const gok = !g || r.group === g;
      const dok =
        (!from || r.date >= from) &&
        (!to || r.date <= to);
      return qok && gok && dok;
    });

    const exportRows = () => {
      const header =
        filterType === "component"
          ? ["date", "group", "bagNo", "component", "caseId", "issuedTo", "remarks"]
          : ["date", "group", "bagNo", "institution", "caseId", "issuedTo", "remarks"];
      const rowsOut = filtered.map((r) =>
        filterType === "component"
          ? [r.date, r.group, r.bagNo, r.component || "", r.caseId, r.issuedTo, r.remarks || ""]
          : [r.date, r.group, r.bagNo, r.institution || "", r.caseId, r.issuedTo, r.remarks || ""]
      );
      downloadCSV(`${filterType}_issues.csv`, header, rowsOut);
    };

    return (
      <>
        <div className="mb-3 flex flex-col sm:flex-row sm:items-end gap-2">
          <div className="flex-1 flex flex-col sm:flex-row gap-2">
            <input
              placeholder={`Search ${filterType === "component" ? "bag / component / case / issued to" : "bag / institution / case / issued to"}`}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="flex-1 border rounded-md px-3 py-2 text-sm"
            />
            <select value={g} onChange={(e) => setG(e.target.value)} className="border rounded-md px-3 py-2 text-sm min-w-[120px]">
              <option value="">All Groups</option>
              {groups.map((grp) => (
                <option key={grp} value={grp}>{grp}</option>
              ))}
            </select>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="border rounded-md px-3 py-2 text-sm" />
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="border rounded-md px-3 py-2 text-sm" />
            <button
              onClick={() => { setQ(""); setG(""); setFrom(""); setTo(""); }}
              className="rounded-md border bg-white px-3 py-2 text-sm hover:bg-slate-50"
            >
              Reset
            </button>
          </div>
          <button
            onClick={exportRows}
            className="rounded-md bg-slate-900 text-white px-3 py-2 text-sm hover:bg-slate-800"
          >
            Export
          </button>
        </div>

        {filtered.length === 0 ? (
          <div className="text-sm text-slate-500">No {filterType} issues found for current filters.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase text-slate-500 border-b">
                <th className="py-2">Date</th>
                <th className="py-2">Group</th>
                <th className="py-2">Bag</th>
                <th className="py-2">{filterType === "component" ? "Component" : "Institution"}</th>
                <th className="py-2">Case ID</th>
                <th className="py-2">Issued To</th>
                <th className="py-2">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b last:border-b-0">
                  <td className="py-2">{r.date}</td>
                  <td className="py-2">{r.group}</td>
                  <td className="py-2">{r.bagNo}</td>
                  <td className="py-2">{filterType === "component" ? r.component : r.institution || "—"}</td>
                  <td className="py-2">{r.caseId}</td>
                  <td className="py-2">{r.issuedTo}</td>
                  <td className="py-2">{r.remarks || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </>
    );
  }
};

export default BloodBank;
