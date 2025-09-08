import React, { useMemo, useState } from "react";

const LS_PATIENTS = "HMS_PATIENTS";
const LS_APPTS = "HMS_APPOINTMENTS";
const LS_OPD = "HMS_OPD";
const LS_OPD_SEQ = "HMS_OPD_SEQ";
const LS_PRESC = "HMS_PRESCRIPTIONS";
const LS_RX_SEQ = "HMS_RX_SEQ";
const LS_PREFILL_PID = "HMS_PREFILL_PID";

const loadJSON = (k, fb) => { try { return JSON.parse(localStorage.getItem(k)) ?? fb; } catch { return fb; } };
const saveJSON = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const nextId = (seqKey, prefix) => {
  const cur = Number(localStorage.getItem(seqKey) || "0") + 1;
  localStorage.setItem(seqKey, String(cur));
  const yy = String(new Date().getFullYear()).slice(-2);
  return `${prefix}${yy}-${String(cur).padStart(4, "0")}`;
};

const inputCls = "mt-1 w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500";

const OPDForm = ({ onClose }) => {
  const patients = loadJSON(LS_PATIENTS, []);
  const appts = loadJSON(LS_APPTS, []);
  const [patient_id, setPatientId] = useState(localStorage.getItem(LS_PREFILL_PID) || "");
  const patient = useMemo(() => patients.find((p) => String(p.id) === String(patient_id)), [patients, patient_id]);

  const [doctor_id, setDoctorId] = useState("");
  const [doctor_name, setDoctorName] = useState("");
  const [department, setDepartment] = useState("");
  const [vitals, setVitals] = useState({ bp: "", pulse: "", temp: "" });
  const [complaints, setComplaints] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [plan, setPlan] = useState("");
  const [prescription, setPrescription] = useState("");

  const copyFromLatestAppointment = () => {
    const rows = appts.filter((a) => String(a.patient_id) === String(patient_id));
    if (!rows.length) { alert("No appointments found for this patient."); return; }
    const latest = rows[0]; // we store unshift, so index 0 is latest
    setDoctorId(String(latest.doctor_id || ""));
    setDoctorName(latest.doctor_name || "");
    setDepartment(latest.department || "");
  };

  const submit = (e) => {
    e.preventDefault();
    if (!patient) { alert("Patient not found."); return; }
    if (!doctor_id && !doctor_name) { alert("Enter Doctor details."); return; }

    const row = {
      id: nextId(LS_OPD_SEQ, "O"),
      createdAt: new Date().toISOString(),
      patient_id: patient.id,
      patient_name: patient.name,
      doctor_id: doctor_id ? Number(doctor_id) : null,
      doctor_name,
      department,
      vitals,
      complaints,
      diagnosis,
      plan,
      prescription,
    };

    const rows = loadJSON(LS_OPD, []);
    rows.unshift(row);
    saveJSON(LS_OPD, rows);

    // also store prescription for pharmacy (optional)
    if (prescription.trim()) {
      const rx = {
        id: nextId(LS_RX_SEQ, "R"),
        createdAt: new Date().toISOString(),
        patient_id: patient.id,
        patient_name: patient.name,
        doctor_id: doctor_id ? Number(doctor_id) : null,
        doctor_name,
        text: prescription.trim(),
        source: "OPD",
        reference_id: row.id,
      };
      const allRx = loadJSON(LS_PRESC, []);
      allRx.unshift(rx);
      saveJSON(LS_PRESC, allRx);
    }

    alert("OPD encounter saved.");
    onClose?.();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-5xl rounded-xl border shadow">
        <div className="flex items-center justify-between bg-blue-600 text-white px-4 py-3 rounded-t-xl">
          <div className="font-semibold">OPD Encounter</div>
          <button className="bg-white/15 px-3 py-1.5 rounded" onClick={onClose}>Close</button>
        </div>

        <form onSubmit={submit} className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-slate-700">Patient ID *</label>
            <input className={inputCls} value={patient_id} onChange={(e)=>setPatientId(e.target.value)} />
            <div className="text-xs mt-1">{patient ? <>Name: <b>{patient.name}</b></> : <span className="text-red-600">No match</span>}</div>
          </div>
          <div>
            <label className="text-sm text-slate-700">Doctor ID</label>
            <input className={inputCls} value={doctor_id} onChange={(e)=>setDoctorId(e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-slate-700">Doctor Name</label>
            <input className={inputCls} value={doctor_name} onChange={(e)=>setDoctorName(e.target.value)} />
          </div>

          <div>
            <label className="text-sm text-slate-700">Department</label>
            <input className={inputCls} value={department} onChange={(e)=>setDepartment(e.target.value)} />
          </div>
          <div className="md:col-span-2 flex items-end">
            <button type="button" className="bg-gray-100 px-3 py-2 rounded" onClick={copyFromLatestAppointment}>
              Use latest appointment
            </button>
          </div>

          <div>
            <label className="text-sm text-slate-700">BP</label>
            <input className={inputCls} value={vitals.bp} onChange={(e)=>setVitals(p=>({...p,bp:e.target.value}))} placeholder="120/80" />
          </div>
          <div>
            <label className="text-sm text-slate-700">Pulse</label>
            <input className={inputCls} value={vitals.pulse} onChange={(e)=>setVitals(p=>({...p,pulse:e.target.value}))} placeholder="72" />
          </div>
          <div>
            <label className="text-sm text-slate-700">Temp (°C)</label>
            <input className={inputCls} value={vitals.temp} onChange={(e)=>setVitals(p=>({...p,temp:e.target.value}))} placeholder="98.6" />
          </div>

          <div className="md:col-span-3">
            <label className="text-sm text-slate-700">Chief Complaints</label>
            <textarea className={inputCls} rows={2} value={complaints} onChange={(e)=>setComplaints(e.target.value)} />
          </div>
          <div className="md:col-span-3">
            <label className="text-sm text-slate-700">Diagnosis</label>
            <textarea className={inputCls} rows={2} value={diagnosis} onChange={(e)=>setDiagnosis(e.target.value)} />
          </div>
          <div className="md:col-span-3">
            <label className="text-sm text-slate-700">Plan</label>
            <textarea className={inputCls} rows={2} value={plan} onChange={(e)=>setPlan(e.target.value)} />
          </div>
          <div className="md:col-span-3">
            <label className="text-sm text-slate-700">Prescription (goes to Pharmacy)</label>
            <textarea className={inputCls} rows={3} value={prescription} onChange={(e)=>setPrescription(e.target.value)} placeholder="e.g., Tab Amoxicillin 500mg – 1-0-1 x 5 days" />
          </div>

          <div className="md:col-span-3 flex justify-end gap-2">
            <button type="button" className="bg-gray-500 text-white px-3 py-2 rounded" onClick={onClose}>Cancel</button>
            <button type="submit" className="bg-blue-600 text-white px-3 py-2 rounded">Save OPD</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OPDForm;
