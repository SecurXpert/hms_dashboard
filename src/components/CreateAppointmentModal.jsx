import React, { useEffect, useRef, useState } from "react";

/* ===== Mock data ===== */
const mockDoctors = [
  { id: 201, name: "Dr. Smith", department: "Cardiology", consultation_fee: 500 },
  { id: 202, name: "Dr. Adams", department: "Neurology", consultation_fee: 600 },
];

const mockSlots = [
  { label: "Morning 10:00 AM", start: new Date().toISOString(), end: new Date(Date.now() + 3600000).toISOString(), available: true },
  { label: "Afternoon 2:00 PM", start: new Date(Date.now() + 4 * 3600000).toISOString(), end: new Date(Date.now() + 5 * 3600000).toISOString(), available: true },
];

export const mockAppointments = [
  {
    id: 1,
    appointment_no: "APPT001",
    patient_id: 101,
    patient_name: "John Doe",
    doctor_id: 201,
    doctor_name: "Dr. Smith",
    department: "Cardiology",
    doctor_fee: 500,
    scheduled_for: new Date().toISOString(),
    slot_label: "Morning 10:00 AM",
    priority: "Normal",
    payment_mode: "Cash",
    discount_pct: 0,
    reason: "Regular checkup",
    status: "confirmed",
    // example structure for new fields:
    referral: { name: "Dr. House Clinic", amount: 0 },
  },
  {
    id: 2,
    appointment_no: "APPT002",
    patient_id: 102,
    patient_name: "Jane Roe",
    doctor_id: 202,
    doctor_name: "Dr. Adams",
    department: "Neurology",
    doctor_fee: 600,
    scheduled_for: new Date(Date.now() + 86400000).toISOString(),
    slot_label: "Afternoon 2:00 PM",
    priority: "Priority",
    payment_mode: "Card",
    discount_pct: 10,
    reason: "Follow-up",
    status: "confirmed",
    referral: { name: "Health Camp", amount: 50 },
  },
];

/* ===== Utils ===== */
const toISO = (localDateTime) => (localDateTime ? new Date(localDateTime).toISOString() : "");

const yyyyMmDd = (localOrISO) => {
  if (!localOrISO) return "";
  const d = new Date(localOrISO);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
};

const inputBase =
  "mt-1 block w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200";
const selectBase = inputBase;
const btnBase =
  "inline-flex items-center justify-center rounded-xl px-3.5 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2";
const btnBlue = `${btnBase} bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500`;
const btnGray = `${btnBase} bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-400`;

/* ===== Doctor helpers ===== */
function fetchDoctorById(id) {
  return mockDoctors.find((d) => d.id === Number(id)) || null;
}
function searchDoctorByName(name) {
  if (!name) return [];
  return mockDoctors.filter((d) => d.name.toLowerCase().includes(name.toLowerCase()));
}

/* ===== Component ===== */
function CreateAppointmentModal({ onClose, onSaved, newPatient }) {
  // Core state
  const [patient_id, setPatientId] = useState(newPatient?.id || "");
  const [patient_name, setPatientName] = useState(newPatient?.name || "");
  const [doctor_id, setDoctorId] = useState("");
  const [doctor_name, setDoctorName] = useState("");
  const [department, setDepartment] = useState("");
  const [scheduled_for, setScheduledFor] = useState("");
  const [visit_type, setVisitType] = useState("New"); // kept for parity
  const [shift, setShift] = useState("");
  const [slot_label, setSlotLabel] = useState("");
  const [priority, setPriority] = useState("Normal");
  const [payment_mode, setPaymentMode] = useState("Cash");
  const [doctor_fee, setDoctorFee] = useState(0);
  const [discount_pct, setDiscountPct] = useState(0);
  const [discount_reason, setDiscountReason] = useState("");
  const [is_video, setIsVideo] = useState(false);
  const [status, setStatus] = useState("booked");
  const [notes, setNotes] = useState("");
  const [appointment_reason, setAppointmentReason] = useState("");

  // NEW: Referral fields (doctor-friendly terminology)
  const [referral_name, setReferralName] = useState("");
  const [referral_amount, setReferralAmount] = useState(0);

  // Cash denominations
  const [cash_500, setC500] = useState(0);
  const [cash_200, setC200] = useState(0);
  const [cash_100, setC100] = useState(0);
  const [cash_50, setC50] = useState(0);
  const [cash_20, setC20] = useState(0);
  const [cash_10, setC10] = useState(0);

  // Digital
  const [utr_no, setUtr] = useState("");
  const [card_txn_id, setCardTxn] = useState("");

  // Availability
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const for_date = yyyyMmDd(scheduled_for);

  // Focus + accessibility + scroll lock
  const firstFieldRef = useRef(null);
  useEffect(() => {
    firstFieldRef.current?.focus();
  }, []);
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow || "";
    };
  }, [onClose]);

  // Load slots (mock)
  useEffect(() => {
    if (!doctor_id || !for_date) {
      setSlots([]);
      return;
    }
    setLoadingSlots(true);
    setTimeout(() => {
      setSlots(mockSlots);
      setLoadingSlots(false);
    }, 500);
  }, [doctor_id, for_date]);

  // Auto doctor info
  useEffect(() => {
    const d = fetchDoctorById(doctor_id);
    if (d) {
      setDoctorName((prev) => prev || d.name);
      setDepartment(d.department || "");
      if (d.consultation_fee != null) setDoctorFee(d.consultation_fee);
    }
  }, [doctor_id]);

  // Suggest doctor by name
  useEffect(() => {
    const t = setTimeout(() => {
      if (doctor_name && !doctor_id) {
        const list = searchDoctorByName(doctor_name);
        if (list && list.length) {
          const d = list[0];
          setDoctorId(d.id ?? "");
          setDepartment(d.department || "");
          if (d.consultation_fee != null) setDoctorFee(d.consultation_fee);
        }
      }
    }, 350);
    return () => clearTimeout(t);
  }, [doctor_name]);

  // Derived payment info
  const feeNum = Number(doctor_fee || 0);
  const pctNum = Math.min(100, Math.max(0, Number(discount_pct || 0)));
  const discountAmount = Number(((feeNum * pctNum) / 100).toFixed(2));
  const finalPayable = Math.max(0, Number((feeNum - discountAmount).toFixed(2)));
  const cashReceived = Number(
    (500 * Number(cash_500 || 0)) +
    (200 * Number(cash_200 || 0)) +
    (100 * Number(cash_100 || 0)) +
    (50 * Number(cash_50 || 0)) +
    (20 * Number(cash_20 || 0)) +
    (10 * Number(cash_10 || 0))
  );
  const balanceOrChange = Number((cashReceived - finalPayable).toFixed(2));
  const isChange = balanceOrChange > 0;
  const absBalanceOrChange = Math.abs(balanceOrChange);

  // Build payload
  const payload = () => {
    let finalScheduled = scheduled_for ? toISO(scheduled_for) : "";
    const picked = slots.find((s) => s.label === slot_label && s.available);
    if (picked?.start) finalScheduled = picked.start;

    return {
      patient_id: Number(patient_id || 0),
      patient_name: patient_name || "",
      doctor_id: Number(doctor_id || 0),
      doctor_name,
      scheduled_for: finalScheduled,
      visit_type,
      shift,
      slot_label,
      priority,
      payment_mode,
      doctor_fee: Number(doctor_fee || 0),
      discount_pct: Number(discount_pct || 0),
      discount_reason: discount_pct > 0 ? (discount_reason || undefined) : undefined,
      is_video,
      status,
      notes,
      reason: appointment_reason || undefined,
      department: department || undefined,

      // NEW: Referral bundle (doctor-friendly)
      referral: {
        name: referral_name || undefined,
        amount: Number(referral_amount || 0),
      },

      // Payments
      cash_500: payment_mode === "Cash" ? Number(cash_500 || 0) : undefined,
      cash_200: payment_mode === "Cash" ? Number(cash_200 || 0) : undefined,
      cash_100: payment_mode === "Cash" ? Number(cash_100 || 0) : undefined,
      cash_50: payment_mode === "Cash" ? Number(cash_50 || 0) : undefined,
      cash_20: payment_mode === "Cash" ? Number(cash_20 || 0) : undefined,
      cash_10: payment_mode === "Cash" ? Number(cash_10 || 0) : undefined,
      utr_no: payment_mode === "UPI" ? (utr_no || undefined) : undefined,
      card_txn_id: payment_mode === "Card" ? (card_txn_id || undefined) : undefined,
    };
  };

  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  function submit() {
    setSaving(true);
    setErr("");
    try {
      const appointmentData = payload();
      if (!appointmentData.patient_id || !appointmentData.doctor_id || !appointmentData.scheduled_for || !appointmentData.slot_label) {
        throw new Error("Please fill all required fields.");
      }
      const newAppointment = {
        id: mockAppointments.length + 1,
        appointment_no: `APPT${String(mockAppointments.length + 1).padStart(3, "0")}`,
        ...appointmentData,
        status: "confirmed",
      };
      mockAppointments.push(newAppointment);
      alert("Appointment created");
      onSaved?.();
    } catch (e) {
      console.error(e);
      setErr("Create failed. Check required fields / availability.");
    } finally {
      setSaving(false);
    }
  }

  const disableSubmit =
    (payment_mode === "UPI" && !utr_no) ||
    (payment_mode === "Card" && !card_txn_id) ||
    (discount_pct > 0 && !discount_reason);

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="add-appt-title">
      {/* simple micro-animations */}
      <style>{`
        @keyframes modalIn { from { opacity: 0; transform: translateY(8px) scale(.98) } to { opacity: 1; transform: translateY(0) scale(1) } }
        .modal-in { animation: modalIn .22s ease both; }
      `}</style>

      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />

      {/* Centered modal container: mobile fills height with sticky header/footer */}
      <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-4">
        <div className="modal-in relative w-full max-w-5xl h-[calc(100vh-1rem)] sm:h-[calc(100vh-2rem)] rounded-2xl border border-gray-200 bg-white shadow-2xl flex flex-col overflow-hidden">
          {/* Sticky Header */}
          <div className="sticky top-0 z-20 flex items-center justify-between bg-blue-600 px-4 sm:px-5 py-3 text-white shadow">
            <h3 id="add-appt-title" className="text-base sm:text-lg font-semibold">Add Appointment</h3>
            <button aria-label="Close modal" className={btnGray + " !bg-white/10 text-white"} onClick={onClose}>
              Close
            </button>
          </div>

          {/* Scrollable content */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
            className="flex-1 overflow-y-auto px-3 sm:px-5 pb-28 sm:pb-6 pt-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {/* IDs */}
              <div>
                <label className="text-sm text-gray-700">Patient ID *</label>
                <input
                  ref={firstFieldRef}
                  type="number"
                  inputMode="numeric"
                  className={inputBase}
                  value={patient_id}
                  onChange={(e) => setPatientId(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-700">Patient Name</label>
                <input
                  type="text"
                  className={inputBase}
                  value={patient_name}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Optional"
                />
              </div>
              <div>
                <label className="text-sm text-gray-700">Doctor ID *</label>
                <input
                  type="number"
                  inputMode="numeric"
                  className={inputBase}
                  value={doctor_id}
                  onChange={(e) => setDoctorId(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-700">Doctor Name</label>
                <input
                  type="text"
                  className={inputBase}
                  value={doctor_name}
                  onChange={(e) => setDoctorName(e.target.value)}
                  placeholder="Type to auto-fill"
                />
              </div>

              {/* Auto-filled */}
              <div>
                <label className="text-sm text-gray-700">Department</label>
                <input
                  type="text"
                  className={inputBase}
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Auto or manual"
                />
              </div>
              <div>
                <label className="text-sm text-gray-700">Doctor Fee (₹)</label>
                <input
                  type="number"
                  inputMode="decimal"
                  className={inputBase}
                  value={doctor_fee}
                  onChange={(e) => setDoctorFee(e.target.value)}
                  min="0"
                />
              </div>

              {/* DateTime */}
              <div>
                <label className="text-sm text-gray-700">Scheduled For (Local) *</label>
                <input
                  type="datetime-local"
                  className={inputBase}
                  value={scheduled_for}
                  onChange={(e) => setScheduledFor(e.target.value)}
                  required={!slot_label}
                />
                <p className="mt-1 text-xs text-gray-500">If you pick a Slot below, that time will override this.</p>
              </div>

              {/* Slot */}
              <div>
                <label className="text-sm text-gray-700">Slot Label *</label>
                <select
                  className={selectBase}
                  value={slot_label}
                  onChange={(e) => setSlotLabel(e.target.value)}
                  required
                  disabled={!doctor_id || !for_date || loadingSlots}
                >
                  <option value="">{loadingSlots ? "Loading..." : "Select"}</option>
                  {!loadingSlots &&
                    slots
                      .filter((s) => s.available)
                      .map((s) => (
                        <option key={s.label} value={s.label}>
                          {s.label} (
                          {new Date(s.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}-
                          {new Date(s.end).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })})
                        </option>
                      ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Choose <b>Doctor</b> & <b>Date</b> to load slots.
                </p>
              </div>

              {/* Priority / Payment */}
              <div>
                <label className="text-sm text-gray-700">Priority</label>
                <select
                  className={selectBase}
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="Normal">Normal</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-700">Payment Mode</label>
                <select
                  className={selectBase}
                  value={payment_mode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                >
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="Card">Card</option>
                </select>
              </div>

              {/* Discount */}
              <div>
                <label className="text-sm text-gray-700">Discount %</label>
                <input
                  type="number"
                  inputMode="decimal"
                  className={inputBase}
                  value={discount_pct}
                  onChange={(e) => setDiscountPct(e.target.value)}
                  min="0"
                  max="100"
                />
              </div>
              <div className="sm:col-span-1 lg:col-span-2">
                <label className="text-sm text-gray-700">
                  Discount Reason {discount_pct > 0 && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  className={inputBase}
                  value={discount_reason}
                  onChange={(e) => setDiscountReason(e.target.value)}
                  placeholder="Why discount was given"
                />
              </div>

              {/* Reason */}
              <div className="sm:col-span-2 lg:col-span-3">
                <label className="text-sm text-gray-700">Reason</label>
                <textarea
                  className={inputBase + " min-h-[96px]"}
                  value={appointment_reason}
                  onChange={(e) => setAppointmentReason(e.target.value)}
                  placeholder="Reason for visit / chief complaint"
                />
              </div>

              {/* NEW: Referral fields (doctor-friendly, no 'commission' term) */}
              <div>
                <label className="text-sm text-gray-700">Referral Name</label>
                <input
                  type="text"
                  className={inputBase}
                  value={referral_name}
                  onChange={(e) => setReferralName(e.target.value)}
                  placeholder="e.g., Dr. Kiran Clinic / Friends / Organization"
                />
              </div>
              <div>
                <label className="text-sm text-gray-700">Referral Amount (₹)</label>
                <input
                  type="number"
                  inputMode="decimal"
                  className={inputBase}
                  value={referral_amount}
                  onChange={(e) => setReferralAmount(e.target.value)}
                  min="0"
                  placeholder="0"
                />
              </div>

              {/* Cash denominations */}
              {payment_mode === "Cash" && (
                <div className="sm:col-span-2 lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  <NumField label="₹500" value={cash_500} onChange={setC500} />
                  <NumField label="₹200" value={cash_200} onChange={setC200} />
                  <NumField label="₹100" value={cash_100} onChange={setC100} />
                  <NumField label="₹50" value={cash_50} onChange={setC50} />
                  <NumField label="₹20" value={cash_20} onChange={setC20} />
                  <NumField label="₹10" value={cash_10} onChange={setC10} />
                </div>
              )}

              {/* UPI / Card fields */}
              {payment_mode === "UPI" && (
                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="text-sm text-gray-700">UTR Number *</label>
                  <input
                    type="text"
                    className={inputBase}
                    value={utr_no}
                    onChange={(e) => setUtr(e.target.value)}
                    placeholder="Required for UPI"
                    required
                  />
                </div>
              )}
              {payment_mode === "Card" && (
                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="text-sm text-gray-700">Card Transaction ID *</label>
                  <input
                    type="text"
                    className={inputBase}
                    value={card_txn_id}
                    onChange={(e) => setCardTxn(e.target.value)}
                    placeholder="Required for Card"
                    required
                  />
                </div>
              )}
            </div>

            {/* Cash summary card (shows when Cash) */}
            {payment_mode === "Cash" && (
              <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <h4 className="mb-3 text-sm font-semibold text-gray-800">Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <SummaryRow label="Doctor Fee" value={`₹${feeNum.toFixed(2)}`} />
                  <SummaryRow label="Discount %" value={`${pctNum}%`} />
                  <SummaryRow label="Discount Amount" value={`₹${discountAmount.toFixed(2)}`} />
                  <SummaryRow label="Final Payable" value={`₹${finalPayable.toFixed(2)}`} />
                  <SummaryRow label="Cash Received" value={`₹${cashReceived.toFixed(2)}`} />
                  {cashReceived === 0 ? (
                    <SummaryRow label="Balance To Collect" value={`₹${finalPayable.toFixed(2)}`} />
                  ) : isChange ? (
                    <SummaryRow label="Change To Return" value={`₹${absBalanceOrChange.toFixed(2)}`} />
                  ) : (
                    <SummaryRow label="Balance To Collect" value={`₹${absBalanceOrChange.toFixed(2)}`} />
                  )}
                </div>
              </div>
            )}

            {err && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {err}
              </div>
            )}
          </form>

          {/* Sticky Footer (better on small screens) */}
          <div className="sticky bottom-0 z-20 bg-white border-t border-gray-200 px-3 sm:px-5 py-3 flex flex-col sm:flex-row gap-2 sm:gap-3 sm:items-center sm:justify-end">
            <div className="text-xs text-gray-500 sm:mr-auto">
              Press <kbd className="px-1.5 py-0.5 border rounded">Esc</kbd> to close
            </div>
            <button type="button" className={btnGray} onClick={onClose}>
              Close
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={saving || disableSubmit}
              className={btnBlue + " disabled:opacity-60"}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== small fields ===== */
function NumField({ label, value, onChange }) {
  return (
    <div>
      <label className="text-xs text-gray-700">{label}</label>
      <input
        type="number"
        inputMode="numeric"
        className={inputBase + " mt-1"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min="0"
      />
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-white px-3 py-2 border border-gray-200">
      <span className="text-gray-600">{label}</span>
      <span className="ml-3 font-medium">{value}</span>
    </div>
  );
}

export default CreateAppointmentModal;
