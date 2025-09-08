import React, { useEffect, useMemo, useState } from "react";

/* -------- storage & seeds -------- */
const LS_PATIENTS = "HMS_PATIENTS";
const LS_APPTS = "HMS_APPOINTMENTS";
const LS_APPT_SEQ = "HMS_APPT_SEQ";
const LS_PREFILL_PID = "HMS_PREFILL_PID";
const loadJSON = (k, fb) => { try { return JSON.parse(localStorage.getItem(k)) ?? fb; } catch { return fb; } };
const saveJSON = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const nextId = (seqKey, prefix) => {
  const cur = Number(localStorage.getItem(seqKey) || "0") + 1;
  localStorage.setItem(seqKey, String(cur));
  const yy = String(new Date().getFullYear()).slice(-2);
  return `${prefix}${yy}-${String(cur).padStart(4, "0")}`;
};
/* doctors (edit as needed or replace with your own local list) */
const DOCTORS = [
  { id: 101, name: "Dr. Charan", department: "General Physician", consultation_fee: 500 },
  { id: 102, name: "Dr. Sneha", department: "Gynecology", consultation_fee: 700 },
  { id: 103, name: "Dr. Sridevi", department: "Radiology", consultation_fee: 600 },
];

const inputCls = "mt-1 w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500";
const selectCls = inputCls;

/* quick 30m slot generator for a given date */
const buildSlots = (yyyyMmDd) => {
  if (!yyyyMmDd) return [];
  const [Y, M, D] = yyyyMmDd.split("-").map(Number);
  const base = new Date(Y, (M - 1), D, 9, 0, 0, 0);
  const out = [];
  for (let i = 0; i < 16; i++) {
    const start = new Date(base.getTime() + i * 30 * 60000);
    const end = new Date(start.getTime() + 30 * 60000);
    const label = start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    out.push({ label, start: start.toISOString(), end: end.toISOString(), available: true });
  }
  return out;
};
const yyyyMmDd = (d) => {
  const x = d ? new Date(d) : new Date();
  const mm = String(x.getMonth() + 1).padStart(2, "0");
  const dd = String(x.getDate()).padStart(2, "0");
  return `${x.getFullYear()}-${mm}-${dd}`;
};

const AppointmentForm = ({ onClose }) => {
  const patients = loadJSON(LS_PATIENTS, []);
  const [patient_id, setPatientId] = useState(localStorage.getItem(LS_PREFILL_PID) || "");
  const patientName = useMemo(() => patients.find((p) => String(p.id) === String(patient_id))?.name || "", [patients, patient_id]);

  const [doctor_id, setDoctorId] = useState("");
  const [doctor_name, setDoctorName] = useState("");
  const [department, setDepartment] = useState("");
  const [doctor_fee, setDoctorFee] = useState("");

  const [date, setDate] = useState(yyyyMmDd());
  const slots = useMemo(() => buildSlots(date), [date]);
  const [slot_label, setSlotLabel] = useState("");
  const [visit_type, setVisitType] = useState("Consultation");
  const [shift, setShift] = useState("morning");
  const [priority, setPriority] = useState("Normal");
  const [payment_mode, setPaymentMode] = useState("Cash");
  const [discount_pct, setDiscountPct] = useState("");
  const [is_video, setIsVideo] = useState(false);
  const [status, setStatus] = useState("booked");
  const [notes, setNotes] = useState("");
  const [cash, setCash] = useState({ n500: "", n200: "", n100: "", n50: "", n20: "", n10: "" });
  const [utr_no, setUtr] = useState("");

  // doctor fill by id
  useEffect(() => {
    const d = DOCTORS.find((x) => String(x.id) === String(doctor_id));
    if (d) {
      setDoctorName(d.name);
      setDepartment(d.department || "");
      setDoctorFee(String(d.consultation_fee ?? 0));
    }
  }, [doctor_id]);

  // doctor search by name (first match)
  useEffect(() => {
    if (!doctor_name || doctor_id) return;
    const t = setTimeout(() => {
      const d = DOCTORS.find((x) => x.name.toLowerCase().includes(doctor_name.toLowerCase()));
      if (d) {
        setDoctorId(String(d.id));
        setDepartment(d.department || "");
        setDoctorFee(String(d.consultation_fee ?? 0));
      }
    }, 300);
    return () => clearTimeout(t);
  }, [doctor_name, doctor_id]);

  const submit = (e) => {
    e.preventDefault();
    const p = patients.find((x) => String(x.id) === String(patient_id));
    if (!p) { alert("Patient not found."); return; }
    const d = DOCTORS.find((x) => String(x.id) === String(doctor_id));
    if (!d) { alert("Doctor not found."); return; }
    const slot = slots.find((s) => s.label === slot_label);
    if (!slot) { alert("Pick a slot."); return; }

    const row = {
      id: nextId(LS_APPT_SEQ, "A"),
      createdAt: new Date().toISOString(),
      patient_id: Number(patient_id),
      patient_name: p.name,
      doctor_id: Number(doctor_id),
      doctor_name: d.name,
      department,
      scheduled_for: slot.start,
      visit_type, shift, slot_label, priority,
      payment_mode,
      doctor_fee: Number(doctor_fee || 0),
      discount_pct: Number(discount_pct || 0),
      is_video,
      status, notes,
      cash_500: Number(cash.n500 || 0),
      cash_200: Number(cash.n200 || 0),
      cash_100: Number(cash.n100 || 0),
      cash_50: Number(cash.n50 || 0),
      cash_20: Number(cash.n20 || 0),
      cash_10: Number(cash.n10 || 0),
      utr_no,
    };

    const rows = loadJSON(LS_APPTS, []);
    rows.unshift(row);
    saveJSON(LS_APPTS, rows);
    alert("Appointment saved (local).");
    onClose?.();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-6xl rounded-xl border shadow">
        <div className="flex items-center justify-between bg-blue-600 text-white px-4 py-3 rounded-t-xl">
          <div className="font-semibold">Book New Appointment</div>
          <button className="bg-white/15 px-3 py-1.5 rounded" onClick={onClose}>Close</button>
        </div>

        <form onSubmit={submit} className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-slate-700">Patient ID *</label>
            <input className={inputCls} value={patient_id} onChange={(e)=>setPatientId(e.target.value)} />
            <div className="text-xs mt-1">{patientName ? <>Name: <b>{patientName}</b></> : <span className="text-red-600">No match</span>}</div>
          </div>

          <div>
            <label className="text-sm text-slate-700">Doctor Name</label>
            <input className={inputCls} value={doctor_name} onChange={(e)=>setDoctorName(e.target.value)} placeholder="Type to search" />
          </div>
          <div>
            <label className="text-sm text-slate-700">Doctor ID *</label>
            <input className={inputCls} value={doctor_id} onChange={(e)=>setDoctorId(e.target.value)} />
          </div>

          <div>
            <label className="text-sm text-slate-700">Department</label>
            <input className={inputCls} value={department} onChange={(e)=>setDepartment(e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-slate-700">Doctor Fee (₹) *</label>
            <input type="number" className={inputCls} value={doctor_fee} onChange={(e)=>setDoctorFee(e.target.value)} />
          </div>

          <div>
            <label className="text-sm text-slate-700">Date *</label>
            <input type="date" className={inputCls} value={date} onChange={(e)=>setDate(e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-slate-700">Slot *</label>
            <select className={selectCls} value={slot_label} onChange={(e)=>setSlotLabel(e.target.value)}>
              <option value="">Select…</option>
              {slots.map(s => <option key={s.label} value={s.label}>{s.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-700">Shift *</label>
            <select className={selectCls} value={shift} onChange={(e)=>setShift(e.target.value)}>
              <option value="morning">Morning</option><option value="afternoon">Afternoon</option><option value="evening">Evening</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-slate-700">Visit Type *</label>
            <input className={inputCls} value={visit_type} onChange={(e)=>setVisitType(e.target.value)} placeholder="Consultation / Follow-up" />
          </div>
          <div>
            <label className="text-sm text-slate-700">Priority</label>
            <select className={selectCls} value={priority} onChange={(e)=>setPriority(e.target.value)}>
              <option>Normal</option><option>High</option><option>Urgent</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-700">Payment Mode</label>
            <select className={selectCls} value={payment_mode} onChange={(e)=>setPaymentMode(e.target.value)}>
              <option>Cash</option><option>Card</option><option>UPI</option><option>Insurance</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-slate-700">Discount %</label>
            <input type="number" className={inputCls} value={discount_pct} onChange={(e)=>setDiscountPct(e.target.value)} min="0" max="100" />
          </div>
          <div className="flex items-center gap-2">
            <input id="isvideo" type="checkbox" checked={is_video} onChange={(e)=>setIsVideo(e.target.checked)} />
            <label htmlFor="isvideo" className="text-sm text-slate-700">Is Video Consultation</label>
          </div>
          <div>
            <label className="text-sm text-slate-700">Status</label>
            <select className={selectCls} value={status} onChange={(e)=>setStatus(e.target.value)}>
              <option>booked</option><option>confirmed</option><option>completed</option><option>cancelled</option>
            </select>
          </div>

          {/* Cash denominations */}
          {payment_mode === "Cash" && (
            <>
              {[
                ["₹500","n500"],["₹200","n200"],["₹100","n100"],
                ["₹50","n50"],["₹20","n20"],["₹10","n10"],
              ].map(([label,key])=>(
                <div key={key}>
                  <label className="text-sm text-slate-700">{label} Notes</label>
                  <input type="number" className={inputCls} value={cash[key]} onChange={(e)=>setCash(p=>({...p,[key]:e.target.value}))} min="0" />
                </div>
              ))}
            </>
          )}
          {payment_mode === "UPI" && (
            <div>
              <label className="text-sm text-slate-700">UTR Number</label>
              <input className={inputCls} value={utr_no} onChange={(e)=>setUtr(e.target.value)} />
            </div>
          )}

          <div className="md:col-span-3">
            <label className="text-sm text-slate-700">Notes</label>
            <textarea className={inputCls} value={notes} onChange={(e)=>setNotes(e.target.value)} rows={3} />
          </div>

          <div className="md:col-span-3 flex justify-end gap-2">
            <button type="button" className="bg-gray-500 text-white px-3 py-2 rounded" onClick={onClose}>Cancel</button>
            <button type="submit" className="bg-blue-600 text-white px-3 py-2 rounded">Save Appointment</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;
