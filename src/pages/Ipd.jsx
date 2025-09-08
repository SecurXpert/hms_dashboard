
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiPlusCircle, FiUserPlus } from "react-icons/fi";
import PatientForm from "../components/PatientForm";
import Conversion from "../components/Conversion";
import CreateAppointmentModal, { mockAppointments } from "../components/CreateAppointmentModal";
 
// Utilities
const fmtDT = (iso) =>
  iso
    ? new Date(iso).toLocaleString([], {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";
 
const isToday = (iso) => {
  if (!iso) return false;
  const d = new Date(iso);
  const t = new Date();
  return (
    d.getFullYear() === t.getFullYear() &&
    d.getMonth() === t.getMonth() &&
    d.getDate() === t.getDate()
  );
};
 
const isFuture = (iso) => (iso ? new Date(iso).getTime() > Date.now() : false);
 
const inputBase =
  "mt-1 block w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200";
const btnBase =
  "inline-flex items-center justify-center rounded-xl px-3.5 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2";
const btnBlue = `${btnBase} bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500`;
const btnGray = `${btnBase} bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-400`;
const btnGreen = `${btnBase} bg-green-600 text-white hover:bg-green-700 focus:ring-green-500`;
const btnRed = `${btnBase} bg-red-600 text-white hover:bg-red-700 focus:ring-red-500`;
const badge = (color) =>
  `inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${color}`;
 
// Main Page
export default function Ipd() {
  const navigate = useNavigate();
  const location = useLocation();
 
  // Filters / paging
  const [doctorId, setDoctorId] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 20;
 
  // Data state
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
 
  // Modals
  const [openCreate, setOpenCreate] = useState(false);
  const [newPatient, setNewPatient] = useState(null);
  const [detail, setDetail] = useState(null);
  const [openPatientForm, setOpenPatientForm] = useState(false);
 const [openConversion, setOpenConversion] = useState(false);
 
  // Cancel popup
  const [cancelCtx, setCancelCtx] = useState(null); // { id, appointment_no, patient_name, doctor_name }
 
  const params = useMemo(
    () => ({
      doctor_id: doctorId || undefined,
      date_from: from || undefined,
      date_to: to || undefined,
      page,
      page_size: pageSize,
    }),
    [doctorId, from, to, page]
  );
 
  // Simulate fetching appointments with mock data
  function listAppointments() {
    setLoading(true);
    setErr("");
    try {
      // Filter mock data based on params
      let filteredItems = mockAppointments;
      if (params.doctor_id) {
        filteredItems = filteredItems.filter(
          (item) => item.doctor_id === parseInt(params.doctor_id)
        );
      }
      if (params.date_from) {
        filteredItems = filteredItems.filter(
          (item) => new Date(item.scheduled_for) >= new Date(params.date_from)
        );
      }
      if (params.date_to) {
        filteredItems = filteredItems.filter(
          (item) => new Date(item.scheduled_for) <= new Date(params.date_to)
        );
      }
      // Simulate pagination
      const start = (params.page - 1) * params.page_size;
      const paginatedItems = filteredItems.slice(
        start,
        start + params.page_size
      );
      setItems(paginatedItems);
      setTotal(filteredItems.length);
    } catch (e) {
      console.error(e);
      setErr("Failed to load appointments.");
    } finally {
      setLoading(false);
    }
  }
 
  // Simulate getting appointment by ID
  function getAppointmentById(id) {
    const appointment = mockAppointments.find((item) => item.id === id);
    if (!appointment) throw new Error("Appointment not found");
    return appointment;
  }
 
  const handleViewClick = (id) => {
    try {
      const appointment = getAppointmentById(id);
      navigate(`/view1/${id}`);
    } catch (e) {
      alert(e.message);
    }
  };
 
  useEffect(() => {
    listAppointments();
  }, [doctorId, from, to, page]);
 
  // Handle new patient creation and redirect to CreateAppointmentModal
  const handlePatientSaved = (createdPatient) => {
    setOpenPatientForm(false);
    setNewPatient(createdPatient);
    setOpenCreate(true);
  };
 
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Page Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50">
          <div className="max-w-9xl mx-auto space-y-5">
            {/* Page Header */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                  Appointments
                </h1>
                <p className="text-sm text-gray-500">
                  Manage bookings, view details, and handle cancellations.
                </p>
              </div>
              <div className="flex gap-2">
                      <button className={btnBlue} onClick={() => setOpenConversion(true)}>
                  <FiUserPlus className="mr-2" /> OPD TO IPD
                </button>
                <button
                  className={btnBlue}
                  onClick={() => setOpenPatientForm(true)}
                >
                  <FiUserPlus className="mr-2" /> New Patient
                </button>
                <button
                  className={btnGreen}
                  onClick={() => {
                    setNewPatient(null);
                    setOpenCreate(true);
                  }}
                >
                  <FiPlusCircle className="mr-2" /> Add Appointment
                </button>
              </div>
            </div>
 
            {/* Filters */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 lg:p-5">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <div className="md:col-span-1">
                  <label className="text-sm text-gray-700">Doctor ID</label>
                  <input
                    type="number"
                    className={inputBase}
                    value={doctorId}
                    onChange={(e) => setDoctorId(e.target.value)}
                    placeholder="e.g., 101"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-700">From</label>
                  <input
                    type="date"
                    className={inputBase}
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-700">To</label>
                  <input
                    type="date"
                    className={inputBase}
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                  />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-end">
                <button className={btnBlue} onClick={listAppointments}>
                  Apply Filters
                </button>
              </div>
            </div>
 
            {/* Table card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-blue-50 sticky top-0 z-10">
                    <tr className="text-left text-gray-700">
                      {[
                        "Appt No",
                        "Patient ID",
                        "Patient",
                        "Doctor ID",
                        "Doctor Name",
                        "Department",
                        "Fees",
                        
                        "Reason",
                        // "Slot Label",
                        "Priority",
                        "Payment",
                        "Discount %",
                        
                        "Actions",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 font-semibold whitespace-nowrap"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loading ? (
                      <tr>
                        <td className="px-4 py-7 text-center" colSpan={14}>
                          <span className="animate-pulse text-gray-500">
                            Loading...
                          </span>
                        </td>
                      </tr>
                    ) : items.length ? (
                      items.map((it) => (
                        <tr key={it.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">{it.appointment_no}</td>
                          <td className="px-4 py-3">{it.patient_id ?? "-"}</td>
                          <td className="px-4 py-3">{it.patient_name}</td>
                          <td className="px-4 py-3">{it.doctor_id ?? "-"}</td>
                          <td className="px-4 py-3">{it.doctor_name}</td>
                          <td className="px-4 py-3">
                            {it.department || "-"}
                          </td>
                          <td className="px-4 py-3">
                            ₹ {it.doctor_fee ?? it.amount_payable ?? "-"}
                          </td>
                        
                           <td
                            className="px-4 py-3 max-w-[220px] truncate"
                            title={it.reason || it.notes}
                          >
                            {it.reason || it.notes || "-"}
                          </td>
                          {/* <td className="px-4 py-3">{it.slot_label}</td> */}
                          <td className="px-4 py-3">
                            <span
                              className={badge(
                                it.priority === "Emergency"
                                  ? "bg-red-100 text-red-700"
                                  : it.priority === "Priority"
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-emerald-100 text-emerald-700"
                              )}
                            >
                              {it.priority}
                            </span>
                          </td>
                          {/* <td className="px-4 py-3">{it.payment_mode}</td> */}
                            <td className="px-4 py-3">
                            <span
                              className={badge(
                                isToday(it.payment_mode)
                                  ? "bg-purple-100 text-purple-700"
                                  : isFuture(it.payment_mode)
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-gray-100 text-gray-700"
                              )}
                            >
                              {isToday(it.payment_mode)
                                ? "Pending"
                                : isFuture(it.payment_mode)
                                ? "Completed"
                                : "Pending"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {it.discount_pct ?? 0}
                          </td>
                         
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button
                                className={btnGray}
                                onClick={() => handleViewClick(it.id)}
                              >
                                View
                              </button>
                              <button
                                className={btnRed}
                                onClick={() =>
                                  setCancelCtx({
                                    id: it.id,
                                    appointment_no:
                                      it.appointment_no || String(it.id),
                                    patient_name: it.patient_name,
                                    doctor_name: it.doctor_name,
                                  })
                                }
                                disabled={it.status === "cancelled"}
                              >
                                Cancel
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          className="px-4 py-7 text-center text-gray-500"
                          colSpan={14}
                        >
                          No records found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
 
              {/* Footer / pagination */}
              <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 text-sm">
                <p className="text-gray-600">
                  Page <span className="font-medium">{page}</span> • Total{" "}
                  <span className="font-medium">{total}</span>
                </p>
                <div className="flex items-center gap-2">
                  <button
                    className={btnGray}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Prev
                  </button>
                  <button
                    className={btnGray}
                    onClick={() => setPage((p) => p + 1)}
                    disabled={items.length < pageSize}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
 
            {err && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {err}
              </div>
            )}
          </div>
        </main>
      </div>
 
      {/* Create modal */}
      {openCreate && (
        <CreateAppointmentModal
          onClose={() => setOpenCreate(false)}
          onSaved={() => {
            setOpenCreate(false);
            setNewPatient(null);
            listAppointments();
          }}
          newPatient={newPatient}
        />
      )}
 
      {/* Patient Form modal */}
      {openPatientForm && (
        <PatientForm
          onClose={() => setOpenPatientForm(false)}
          onSaved={handlePatientSaved}
        />
      )}
 
           {openConversion && (
        <Conversion
          onClose={() => setOpenConversion(false)}
         />
      )}
 
      {/* Detail modal */}
      {detail && (
        <AppointmentDetailModal
          data={detail}
          onClose={() => setDetail(null)}
          onCancel={() =>
            setCancelCtx({
              id: detail.id,
              appointment_no: detail.appointment_no || String(detail.id),
              patient_name: detail.patient_name,
              doctor_name: detail.doctor_name,
            })
          }
        />
      )}
 
      {/* Cancel modal */}
      {cancelCtx && (
        <CancelAppointmentModal
          appt={cancelCtx}
          onClose={() => setCancelCtx(null)}
          onSaved={() => {
            setCancelCtx(null);
            setDetail(null);
            listAppointments();
          }}
        />
      )}
    </div>
  );
}
 
// Detail Modal
function AppointmentDetailModal({ data, onClose, onCancel }) {
  const btnWhiteGhost =
    "inline-flex items-center justify-center rounded-xl px-3.5 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 !bg-white/10 text-white";
 
  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white shadow-xl">
          <div className="flex items-center justify-between rounded-t-2xl bg-blue-600 px-5 py-3 text-white">
            <h3 className="text-base font-semibold">
              Appointment #{data.appointment_no || data.id}
            </h3>
            <div className="flex gap-2">
              <button
                className={btnRed}
                onClick={onCancel}
                disabled={data.status === "cancelled"}
              >
                Cancel
              </button>
              <button className={btnWhiteGhost} onClick={onClose}>
                Close
              </button>
            </div>
          </div>
 
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <Info label="Patient ID" value={data.patient_id} />
            <Info label="Patient" value={data.patient_name} />
            <Info label="Doctor ID" value={data.doctor_id} />
            <Info label="Doctor" value={data.doctor_name} />
            <Info label="Department" value={data.department} />
            <Info label="Scheduled For" value={fmtDT(data.scheduled_for)} />
            {/* <Info label="Slot" value={data.slot_label} /> */}
            <Info label="Priority" value={data.priority} />
            <Info label="Payment Mode" value={data.payment_mode} />
            <Info label="Doctor Fee" value={data.doctor_fee} />
            <Info label="Discount %" value={data.discount_pct} />
            <Info label="Discount Reason" value={data.discount_reason} />
            <Info label="Amount Payable" value={data.amount_payable} />
            <Info label="UTR No" value={data.utr_no} />
            <Info label="Card Txn ID" value={data.card_txn_id} />
            <Info label="Cash Total" value={data.cash_total} />
            {["cash_500", "cash_200", "cash_100", "cash_50", "cash_20", "cash_10"].map(
              (k) => (
                <Info key={k} label={k.replace("cash_", "₹")} value={data[k]} />
              )
            )}
            <div className="sm:col-span-2">
              <Info label="Reason" value={data.reason} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
 
function Info({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-900">{value ?? "-"}</span>
    </div>
  );
}
 
// Cancel Modal
function CancelAppointmentModal({ appt, onClose, onSaved }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [reason, setReason] = useState("");
  const [refundMode, setRefundMode] = useState("Cash");
  const [denoms, setDenoms] = useState({
    cash_500: 0,
    cash_200: 0,
    cash_100: 0,
    cash_50: 0,
    cash_20: 0,
    cash_10: 0,
  });
 
  const total =
    denoms.cash_500 * 500 +
    denoms.cash_200 * 200 +
    denoms.cash_100 * 100 +
    denoms.cash_50 * 50 +
    denoms.cash_20 * 20 +
    denoms.cash_10 * 10;
 
  const setCount = (key, v) => {
    const num = Math.max(0, Number.isFinite(+v) ? parseInt(v || "0", 10) : 0);
    setDenoms((d) => ({ ...d, [key]: num }));
  };
 
  function submit() {
    setSaving(true);
    setError("");
    try {
      if (!reason.trim()) {
        setSaving(false);
        setError("Please enter a cancellation reason.");
        return;
      }
 
      // Simulate cancellation by updating mock data
      const appointment = mockAppointments.find((item) => item.id === appt.id);
      if (appointment) {
        appointment.status = "cancelled";
        appointment.reason = reason.trim();
      }
      onSaved?.();
    } catch (e) {
      console.error(e);
      setError("Cancel failed.");
    } finally {
      setSaving(false);
    }
  }
 
  const denomField = (label, key) => (
    <div className="flex items-center justify-between rounded-xl border border-gray-200 px-3 py-2">
      <span className="text-gray-700 font-medium">{label}</span>
      <input
        type="number"
        min={0}
        className="w-24 rounded-lg border border-gray-300 px-2 py-1 text-sm text-right focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        value={denoms[key]}
        onChange={(e) => setCount(key, e.target.value)}
      />
    </div>
  );
 
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl rounded-2xl border border-gray-200 bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between rounded-t-2xl bg-red-600 px-5 py-3 text-white">
            <h3 className="text-base font-semibold">
              Cancel Appointment #{appt.appointment_no}
            </h3>
            <button className={btnGray + " !bg-white/10 text-white"} onClick={onClose}>
              Close
            </button>
          </div>
 
          {/* Body */}
          <div className="p-5 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <Info label="Patient" value={appt.patient_name || "-"} />
              <Info label="Doctor" value={appt.doctor_name || "-"} />
              <Info label="Refund Mode" value="Cash" />
            </div>
 
            <div>
              <label className="text-sm text-gray-700">Cancellation Reason</label>
              <textarea
                className={inputBase + " min-h-[90px]"}
                placeholder="Enter reason for cancellation..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
 
            {/* Refund mode (locked to cash) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-gray-700">Refund Method</label>
                <select
                  className={inputBase}
                  value={refundMode}
                  onChange={(e) => setRefundMode(e.target.value)}
                  disabled
                  title="Only Cash is enabled now"
                >
                  <option value="Cash">Cash</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <div className="text-xs text-gray-500 mt-2">
                  Select cash denominations to be refunded.
                </div>
              </div>
            </div>
 
            {/* Denominations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {denomField("₹500 Notes", "cash_500")}
              {denomField("₹200 Notes", "cash_200")}
              {denomField("₹100 Notes", "cash_100")}
              {denomField("₹50 Notes", "cash_50")}
              {denomField("₹20 Notes", "cash_20")}
              {denomField("₹10 Notes", "cash_10")}
            </div>
 
            {/* Total */}
            <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
              <span className="text-emerald-700 font-medium">Refund Total</span>
              <span className="text-emerald-800 font-semibold text-lg">
                ₹ {total}
              </span>
            </div>
 
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
          </div>
 
          {/* Footer */}
          <div className="flex items-center justify-end gap-2 border-t border-gray-200 px-5 py-3">
            <button className={btnGray} onClick={onClose} disabled={saving}>
              Close
            </button>
            <button className={btnRed} onClick={submit} disabled={saving}>
              {saving ? "Saving..." : "Save & Cancel Appointment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
 