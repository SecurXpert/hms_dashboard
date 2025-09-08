import React, { useEffect, useMemo, useState } from "react";

/* Match Login/Admin obfuscation */
const OBFUSCATION_KEY = "vaidya_demo_key";
const deobfuscate = (encStr) => {
  try {
    const s = atob(encStr || "");
    let x = "";
    for (let i = 0; i < s.length; i++) {
      x += String.fromCharCode(
        s.charCodeAt(i) ^ OBFUSCATION_KEY.charCodeAt(i % OBFUSCATION_KEY.length)
      );
    }
    return x;
  } catch {
    return "";
  }
};

const DemoBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("demoBookings");
      const decoded = raw ? deobfuscate(raw) : "";
      const data = decoded ? JSON.parse(decoded) : [];
      setBookings(Array.isArray(data) ? data : []);
    } catch {
      setBookings([]);
    }
  }, []);

  const filtered = useMemo(() => {
    if (!q.trim()) return bookings;
    const s = q.toLowerCase();
    return bookings.filter((b) =>
      [
        b?.name,
        b?.clinicOrHospital,
        b?.location,
        b?.email,
        b?.contact,
        b?.slot,
        b?.date,
        b?.time,
        b?.id,
      ]
        .map((x) => String(x ?? "").toLowerCase())
        .some((v) => v.includes(s))
    );
  }, [q, bookings]);

  const downloadOneTxt = (b) => {
    const text = [
      "DEMO BOOKING",
      "-------------",
      `ID           : ${b.id || "-"}`,
      `Name         : ${b.name || "-"}`,
      `Clinic/Hosp. : ${b.clinicOrHospital || "-"}`,
      `Location     : ${b.location || "-"}`,
      `Contact      : ${b.contact || "-"}`,
      `Email        : ${b.email || "-"}`,
      `Slot         : ${b.slot || "-"}`,
      `Date         : ${b.date || "-"}`,
      `Time         : ${b.time || "-"}`,
      `Created At   : ${b.createdAt || "-"}`,
      "",
    ].join("\n");
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const safeName = (b.name || "booking").replace(/[^a-z0-9_-]+/gi, "_");
    a.href = url;
    a.download = `${safeName}_${b.id || "demo"}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const downloadAllTxt = () => {
    if (!filtered.length) return;
    const chunks = filtered.map((b, i) =>
      [
        `### BOOKING #${i + 1}`,
        `ID           : ${b.id || "-"}`,
        `Name         : ${b.name || "-"}`,
        `Clinic/Hosp. : ${b.clinicOrHospital || "-"}`,
        `Location     : ${b.location || "-"}`,
        `Contact      : ${b.contact || "-"}`,
        `Email        : ${b.email || "-"}`,
        `Slot         : ${b.slot || "-"}`,
        `Date         : ${b.date || "-"}`,
        `Time         : ${b.time || "-"}`,
        `Created At   : ${b.createdAt || "-"}`,
      ].join("\n")
    );
    const text = chunks.join("\n\n------------------------------\n\n") + "\n";
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const today = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `demo_bookings_${today}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-3">
        <h1 className="text-xl font-semibold text-gray-800 flex-1">
          Demo Bookings (TXT Export)
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={downloadAllTxt}
            className="inline-flex items-center rounded-lg bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700"
            title="Download all filtered bookings as TXT"
          >
            Download All (TXT)
          </button>
        </div>
      </div>

      <div className="mb-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, clinic, email, date, etc."
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Responsive list (table on md+, cards on mobile) */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3 border-b">Name</th>
              <th className="text-left p-3 border-b">Clinic/Hospital</th>
              <th className="text-left p-3 border-b">Date / Time</th>
              <th className="text-left p-3 border-b">Slot</th>
              <th className="text-left p-3 border-b">Contact</th>
              <th className="text-left p-3 border-b">Email</th>
              <th className="text-right p-3 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length ? (
              filtered.map((b, i) => (
                <tr key={b.id || i} className="odd:bg-white even:bg-gray-50">
                  <td className="p-3">{b.name || "-"}</td>
                  <td className="p-3">{b.clinicOrHospital || "-"}</td>
                  <td className="p-3">
                    {b.date || "-"} {b.time ? `• ${b.time}` : ""}
                  </td>
                  <td className="p-3">{b.slot || "-"}</td>
                  <td className="p-3">{b.contact || "-"}</td>
                  <td className="p-3">{b.email || "-"}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => downloadOneTxt(b)}
                      className="rounded-md bg-gray-100 hover:bg-gray-200 px-3 py-1.5 text-xs font-medium"
                    >
                      Download TXT
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-6 text-center text-gray-500" colSpan={7}>
                  No demo bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {filtered.length ? (
          filtered.map((b, i) => (
            <div
              key={b.id || i}
              className="rounded-xl border border-gray-200 bg-white p-3"
            >
              <div className="flex items-center justify-between">
                <div className="font-medium">{b.name || "-"}</div>
                <button
                  onClick={() => downloadOneTxt(b)}
                  className="rounded-md bg-gray-100 hover:bg-gray-200 px-3 py-1.5 text-xs font-medium"
                >
                  TXT
                </button>
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {b.clinicOrHospital || "-"}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {b.date || "-"} {b.time ? `• ${b.time}` : ""} • {b.slot || "-"}
              </div>
              <div className="text-xs text-gray-600 mt-1 break-all">
                {b.email || "-"} • {b.contact || "-"}
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-gray-500 rounded-xl border border-gray-200 bg-white">
            No demo bookings found.
          </div>
        )}
      </div>
    </div>
  );
};

export default DemoBookings;
