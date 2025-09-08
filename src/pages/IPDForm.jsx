import React, { useMemo, useState } from "react";

const LS_PATIENTS = "HMS_PATIENTS";
const LS_IPD = "HMS_IPD";
const LS_IPD_SEQ = "HMS_IPD_SEQ";
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

const IPDForm = ({ onClose }) => {
  const patients = loadJSON(LS_PATIENTS, []);
  const [patient_id, setPatientId] = useState(localStorage.getItem(LS_PREFILL_PID) || "");
  const patient = useMemo(() => patients.find((p) => String(p.id) === String(patient_id)), [patients, patient_id]);

  const [admit_date, setAdmitDate] = useState(new Date().toISOString().slice(0,16));
  const [ward, setWard] = useState("");
  const [room, setRoom] = useState("");
  const [bed, setBed] = useState("");
  const [doctor_id, setDoctorId] = useState("");
  const [doctor_name, setDoctorName] = useState("");
  const [status, setStatus] = useState("admitted");
  const [discharge_date, setDischargeDate] = useState("");
  const [notes, setNotes] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!patient) { alert("Patient not found."); return; }

    const rows = loadJSON(LS_IPD, []);
    rows.unshift({
      id: nextId(LS_IPD_SEQ, "I"),
      createdAt: new Date().toISOString(),
      patient_id: patient.id,
      patient_name: patient.name,
      admit_date: admit_date ? new Date(admit_date).toISOString() : "",
      ward, room, bed,
      doctor_id: doctor_id ? Number(doctor_id) : null,
      doctor_name,
      status,
      discharge_date: discharge_date ? new Date(discharge_date).toISOString() : "",
      notes,
    });
    saveJSON(LS_IPD, rows);
    alert("IPD record saved.");
    onClose?.();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-5xl rounded-xl border shadow">
        <div className="flex items-center justify-between bg-blue-600 text-white px-4 py-3 rounded-t-xl">
          <div className="font-semibold">IPD Admission</div>
          <button className="bg-white/15 px-3 py-1.5 rounded" onClick={onClose}>Close</button>
        </div>

        <form onSubmit={submit} className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-slate-700">Patient ID *</label>
            <input className={inputCls} value={patient_id} onChange={(e)=>setPatientId(e.target.value)} />
            <div className="text-xs mt-1">{patient ? <>Name: <b>{patient.name}</b></> : <span className="text-red-600">No match</span>}</div>
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-slate-700">Admit Date & Time *</label>
            <input type="datetime-local" className={inputCls} value={admit_date} onChange={(e)=>setAdmitDate(e.target.value)} />
          </div>

          <div>
            <label className="text-sm text-slate-700">Ward</label>
            <input className={inputCls} value={ward} onChange={(e)=>setWard(e.target.value)} placeholder="ICU / Private / Semi" />
          </div>
          <div>
            <label className="text-sm text-slate-700">Room</label>
            <input className={inputCls} value={room} onChange={(e)=>setRoom(e.target.value)} placeholder="e.g., 203" />
          </div>
          <div>
            <label className="text-sm text-slate-700">Bed</label>
            <input className={inputCls} value={bed} onChange={(e)=>setBed(e.target.value)} placeholder="e.g., B" />
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
            <label className="text-sm text-slate-700">Status</label>
            <select className={inputCls} value={status} onChange={(e)=>setStatus(e.target.value)}>
              <option value="admitted">Admitted</option>
              <option value="discharged">Discharged</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm text-slate-700">Discharge Date & Time</label>
            <input type="datetime-local" className={inputCls} value={discharge_date} onChange={(e)=>setDischargeDate(e.target.value)} />
          </div>
          <div className="md:col-span-3">
            <label className="text-sm text-slate-700">Notes</label>
            <textarea className={inputCls} rows={3} value={notes} onChange={(e)=>setNotes(e.target.value)} />
          </div>

          <div className="md:col-span-3 flex justify-end gap-2">
            <button type="button" className="bg-gray-500 text-white px-3 py-2 rounded" onClick={onClose}>Cancel</button>
            <button type="submit" className="bg-blue-600 text-white px-3 py-2 rounded">Save IPD</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IPDForm;
