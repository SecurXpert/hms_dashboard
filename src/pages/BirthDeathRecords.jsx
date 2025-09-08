import React, { useState, useMemo } from "react";

const BirthDeathRecords = () => {
  const [birthRecords, setBirthRecords] = useState([
    { id: "B001", name: "Baby Sharma", parentName: "Anita Sharma", date: "08/15/2025", time: "10:30 AM", gender: "Female", hospitalId: "HOSP001", approvedBy: "Dr. Priya" },
    { id: "B002", name: "Baby Patel", parentName: "Ravi Patel", date: "08/10/2025", time: "02:15 PM", gender: "Male", hospitalId: "HOSP002", approvedBy: "Dr. Anil" },
  ]);
  const [deathRecords, setDeathRecords] = useState([
    { id: "D001", name: "John Doe", date: "08/20/2025", time: "03:45 PM", cause: "Cardiac Arrest", hospitalId: "HOSP001", approvedBy: "Dr. Sanjay" },
    { id: "D002", name: "Jane Smith", date: "08/18/2025", time: "11:00 AM", cause: "Pneumonia", hospitalId: "HOSP002", approvedBy: "Dr. Meera" },
  ]);

  // Certificates store (optional history)
  const [birthCertificates, setBirthCertificates] = useState([]);
  const [deathCertificates, setDeathCertificates] = useState([]);

  const [search, setSearch] = useState("");
  const [recordTypeFilter, setRecordTypeFilter] = useState("");
  const [idFilter, setIdFilter] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [isBirth, setIsBirth] = useState(true);

  const [formData, setFormData] = useState({
    id: `B${Math.floor(1000 + Math.random() * 9000)}`,
    name: "",
    parentName: "",
    date: "",
    time: "",
    gender: "",
    cause: "",
    hospitalId: "",
    approvedBy: "",
  });

  // Certificate modals
  const [showBirthCert, setShowBirthCert] = useState(false);
  const [showDeathCert, setShowDeathCert] = useState(false);

  const [birthCertData, setBirthCertData] = useState({
    patientName: "",
    fatherName: "",
    date: "", // certificate date
    dob: "",
    tob: "",
    gender: "",
    hospitalId: "",
    doctorName: "",
    deliveryType: "",
    babyWeight: "",
    attachments: [],
  });

  const [deathCertData, setDeathCertData] = useState({
    caseId: "",
    patientName: "",
    deathDate: "",
    guardianName: "",
    attachment: [],
    report: "",
    policeClearanceRequired: false,
    policeClearanceFiles: [],
  });

  const allRecords = useMemo(() => [...birthRecords, ...deathRecords], [birthRecords, deathRecords]);

  const filteredRecords = useMemo(() => {
    return allRecords.filter((record) => {
      const type = record.id.startsWith("B") ? "Birth" : "Death";
      const matchesType = !recordTypeFilter || type === recordTypeFilter;
      const matchesId = !idFilter || record.id === idFilter;
      const s = search.toLowerCase();
      const matchesSearch =
        !s ||
        record.id.toLowerCase().includes(s) ||
        record.name.toLowerCase().includes(s) ||
        (record.parentName || "").toLowerCase().includes(s) ||
        record.date.toLowerCase().includes(s) ||
        record.time.toLowerCase().includes(s) ||
        (record.gender || "").toLowerCase().includes(s) ||
        (record.cause || "").toLowerCase().includes(s) ||
        record.hospitalId.toLowerCase().includes(s) ||
        (record.approvedBy || "").toLowerCase().includes(s);
      return matchesType && matchesId && matchesSearch;
    });
  }, [allRecords, recordTypeFilter, idFilter, search]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddBirth = () => {
    setIsBirth(true);
    setFormData({
      id: `B${Math.floor(1000 + Math.random() * 9000)}`,
      name: "",
      parentName: "",
      date: "",
      time: "",
      gender: "",
      cause: "",
      hospitalId: "",
      approvedBy: "",
    });
    setShowForm(true);
  };

  const handleAddDeath = () => {
    setIsBirth(false);
    setFormData({
      id: `D${Math.floor(1000 + Math.random() * 9000)}`,
      name: "",
      parentName: "",
      date: "",
      time: "",
      cause: "",
      hospitalId: "",
      approvedBy: "",
    });
    setShowForm(true);
  };

  const handleSaveRecord = () => {
    if (isBirth) {
      if (
        formData.name &&
        formData.parentName &&
        formData.date &&
        formData.time &&
        formData.gender &&
        formData.hospitalId &&
        formData.approvedBy
      ) {
        setBirthRecords((prev) => [...prev, formData]);
        setShowForm(false);
      } else {
        alert("Please fill all required fields for birth record.");
        return;
      }
    } else {
      if (
        formData.name &&
        formData.date &&
        formData.time &&
        formData.cause &&
        formData.hospitalId &&
        formData.approvedBy
      ) {
        setDeathRecords((prev) => [...prev, formData]);
        setShowForm(false);
      } else {
        alert("Please fill all required fields for death record.");
        return;
      }
    }
    // reset form
    setFormData({
      id: isBirth ? `B${Math.floor(1000 + Math.random() * 9000)}` : `D${Math.floor(1000 + Math.random() * 9000)}`,
      name: "",
      parentName: "",
      date: "",
      time: "",
      gender: "",
      cause: "",
      hospitalId: "",
      approvedBy: "",
    });
  };

  // Birth certificate handlers
  const saveBirthCertificate = () => {
    const d = birthCertData;
    if (!d.patientName || !d.fatherName || !d.date || !d.dob || !d.tob || !d.gender || !d.hospitalId || !d.doctorName || !d.deliveryType) {
      alert("Please fill all required fields for birth certificate.");
      return;
    }
    setBirthCertificates((prev) => [
      { id: `BC${prev.length + 1}`, ...d, createdAt: new Date().toISOString() },
      ...prev,
    ]);
    setShowBirthCert(false);
    setBirthCertData({
      patientName: "",
      fatherName: "",
      date: "",
      dob: "",
      tob: "",
      gender: "",
      hospitalId: "",
      doctorName: "",
      deliveryType: "",
      babyWeight: "",
      attachments: [],
    });
    alert("Birth certificate saved.");
  };

  // Death certificate handlers
  const saveDeathCertificate = () => {
    const d = deathCertData;
    if (!d.caseId || !d.patientName || !d.deathDate || !d.guardianName) {
      alert("Please fill Case ID, Patient Name, Death Date, and Guardian Name.");
      return;
    }
    setDeathCertificates((prev) => [
      { id: `DC${prev.length + 1}`, ...d, createdAt: new Date().toISOString() },
      ...prev,
    ]);
    setShowDeathCert(false);
    setDeathCertData({
      caseId: "",
      patientName: "",
      deathDate: "",
      guardianName: "",
      attachment: [],
      report: "",
      policeClearanceRequired: false,
      policeClearanceFiles: [],
    });
    alert("Death certificate saved.");
  };

  // Helpers to render file name chips
  const FileChips = ({ files }) => {
    if (!files || files.length === 0) return null;
    const arr = Array.from(files);
    return (
      <div className="mt-2 flex flex-wrap gap-2">
        {arr.map((f, idx) => (
          <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded border border-gray-200">
            {f.name || `File ${idx + 1}`}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Birth & Death Records</h2>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Search (ID, name, date...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/3 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={recordTypeFilter}
            onChange={(e) => setRecordTypeFilter(e.target.value)}
            className="w-full md:w-1/3 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Record Type...</option>
            <option value="Birth">Birth</option>
            <option value="Death">Death</option>
          </select>
          <select
            value={idFilter}
            onChange={(e) => setIdFilter(e.target.value)}
            className="w-full md:w-1/3 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">ID...</option>
            {[...new Set(allRecords.map((r) => r.id))].map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button onClick={handleAddBirth} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            + Add Birth
          </button>
          <button onClick={handleAddDeath} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
            + Add Death
          </button>

          {/* Certificates */}
          <button
            onClick={() => setShowBirthCert(true)}
            className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700"
          >
            Birth Certificate
          </button>
          <button
            onClick={() => setShowDeathCert(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Death Certificate
          </button>

          {/* (Optional) Report button kept for parity */}
          {/* <button onClick={() => alert('Report under development')} className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600">Report</button> */}
        </div>

        {/* Add Record Form */}
        {showForm && (
          <div className="mb-4 p-4 bg-gray-50 rounded-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {isBirth ? "Add New Birth Record" : "Add New Death Record"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Patient / Baby Name"
                className="p-2 border rounded-md"
                required
              />
              {isBirth && (
                <input
                  type="text"
                  name="parentName"
                  value={formData.parentName}
                  onChange={handleInputChange}
                  placeholder="Parent Name"
                  className="p-2 border rounded-md"
                  required
                />
              )}
              <input
                type="text"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                placeholder="Date (e.g., 08/22/2025)"
                className="p-2 border rounded-md"
                required
              />
              <input
                type="text"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                placeholder="Time (e.g., 03:34 PM)"
                className="p-2 border rounded-md"
                required
              />
              {isBirth ? (
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="p-2 border rounded-md"
                  required
                >
                  <option value="">Gender...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <input
                  type="text"
                  name="cause"
                  value={formData.cause}
                  onChange={handleInputChange}
                  placeholder="Cause of Death"
                  className="p-2 border rounded-md"
                  required
                />
              )}
              <input
                type="text"
                name="hospitalId"
                value={formData.hospitalId}
                onChange={handleInputChange}
                placeholder="Hospital ID (e.g., HOSP001)"
                className="p-2 border rounded-md"
                required
              />
              <input
                type="text"
                name="approvedBy"
                value={formData.approvedBy}
                onChange={handleInputChange}
                placeholder="Approved By (e.g., Dr. Sanjay)"
                className="p-2 border rounded-md"
                required
              />
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleSaveRecord}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              >
                Save
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Records Table */}
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">{recordTypeFilter === "Death" ? "Cause" : "Parent / Cause"}</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Time</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Gender</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Hospital ID</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Approved By</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-4 text-center text-gray-500">
                    No records found matching the criteria.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-700">{record.id}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{record.name}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {record.id.startsWith("B") ? record.parentName : record.cause}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">{record.date}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{record.time}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {record.id.startsWith("B") ? record.gender : "—"}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">{record.hospitalId}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{record.approvedBy}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      <button className="text-blue-500 hover:text-blue-700">Edit</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Small summaries of saved certificates (optional) */}
        {(birthCertificates.length > 0 || deathCertificates.length > 0) && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {birthCertificates.length > 0 && (
              <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">Birth Certificates</h4>
                <ul className="list-disc ml-5 text-sm text-blue-900">
                  {birthCertificates.map((c) => (
                    <li key={c.id}>
                      {c.id}: {c.patientName} — {c.dob} ({c.deliveryType}) • {c.hospitalId}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {deathCertificates.length > 0 && (
              <div className="border rounded-lg p-4 bg-red-50 border-red-200">
                <h4 className="font-semibold text-red-900 mb-2">Death Certificates</h4>
                <ul className="list-disc ml-5 text-sm text-red-900">
                  {deathCertificates.map((c) => (
                    <li key={c.id}>
                      {c.id}: {c.patientName} — {c.deathDate} {c.policeClearanceRequired ? "• Police clearance attached" : ""}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Birth Certificate Modal */}
      {showBirthCert && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Birth Certificate</h3>
              <button onClick={() => setShowBirthCert(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className="p-2 border rounded-md" placeholder="Patient / Baby Name *"
                value={birthCertData.patientName} onChange={(e)=>setBirthCertData(d=>({...d,patientName:e.target.value}))}/>
              <input className="p-2 border rounded-md" placeholder="Father Name *"
                value={birthCertData.fatherName} onChange={(e)=>setBirthCertData(d=>({...d,fatherName:e.target.value}))}/>
              <input className="p-2 border rounded-md" placeholder="Certificate Date * (e.g., 08/25/2025)"
                value={birthCertData.date} onChange={(e)=>setBirthCertData(d=>({...d,date:e.target.value}))}/>
              <input className="p-2 border rounded-md" placeholder="Date of Birth * (e.g., 08/20/2025)"
                value={birthCertData.dob} onChange={(e)=>setBirthCertData(d=>({...d,dob:e.target.value}))}/>
              <input className="p-2 border rounded-md" placeholder="Time of Birth * (e.g., 10:12 AM)"
                value={birthCertData.tob} onChange={(e)=>setBirthCertData(d=>({...d,tob:e.target.value}))}/>
              <select className="p-2 border rounded-md" value={birthCertData.gender} onChange={(e)=>setBirthCertData(d=>({...d,gender:e.target.value}))}>
                <option value="">Gender *</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
              <input className="p-2 border rounded-md" placeholder="Hospital ID *"
                value={birthCertData.hospitalId} onChange={(e)=>setBirthCertData(d=>({...d,hospitalId:e.target.value}))}/>
              <input className="p-2 border rounded-md" placeholder="Doctor Name *"
                value={birthCertData.doctorName} onChange={(e)=>setBirthCertData(d=>({...d,doctorName:e.target.value}))}/>
              <select className="p-2 border rounded-md" value={birthCertData.deliveryType} onChange={(e)=>setBirthCertData(d=>({...d,deliveryType:e.target.value}))}>
                <option value="">Delivery Type *</option>
                <option>Normal (Vaginal)</option>
                <option>C-Section</option>
                <option>Assisted (Forceps/Vacuum)</option>
                <option>VBAC</option>
              </select>
              <input className="p-2 border rounded-md" placeholder="Baby Weight (kg)"
                value={birthCertData.babyWeight} onChange={(e)=>setBirthCertData(d=>({...d,babyWeight:e.target.value}))}/>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-700 mb-1">Attach Documents</label>
                <input type="file" multiple onChange={(e)=>setBirthCertData(d=>({...d,attachments:e.target.files}))}/>
                <FileChips files={birthCertData.attachments}/>
              </div>
            </div>
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-2">
              <button onClick={()=>setShowBirthCert(false)} className="px-4 py-2 rounded-md border hover:bg-gray-100">Cancel</button>
              <button onClick={saveBirthCertificate} className="px-4 py-2 rounded-md bg-yellow-600 text-white hover:bg-yellow-700">Save Certificate</button>
            </div>
          </div>
        </div>
      )}

      {/* Death Certificate Modal */}
      {showDeathCert && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Death Certificate</h3>
              <button onClick={() => setShowDeathCert(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className="p-2 border rounded-md" placeholder="Case ID *"
                value={deathCertData.caseId} onChange={(e)=>setDeathCertData(d=>({...d,caseId:e.target.value}))}/>
              <input className="p-2 border rounded-md" placeholder="Patient Name *"
                value={deathCertData.patientName} onChange={(e)=>setDeathCertData(d=>({...d,patientName:e.target.value}))}/>
              <input className="p-2 border rounded-md" placeholder="Death Date * (e.g., 08/20/2025)"
                value={deathCertData.deathDate} onChange={(e)=>setDeathCertData(d=>({...d,deathDate:e.target.value}))}/>
              <input className="p-2 border rounded-md" placeholder="Guardian Name *"
                value={deathCertData.guardianName} onChange={(e)=>setDeathCertData(d=>({...d,guardianName:e.target.value}))}/>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-700 mb-1">Attachment(s)</label>
                <input type="file" multiple onChange={(e)=>setDeathCertData(d=>({...d,attachment:e.target.files}))}/>
                <FileChips files={deathCertData.attachment}/>
              </div>
              <label className="md:col-span-2">
                <span className="block text-sm text-gray-700 mb-1">Report / Notes</span>
                <textarea
                  className="w-full p-2 border rounded-md min-h-[100px]"
                  placeholder="Brief report or notes..."
                  value={deathCertData.report}
                  onChange={(e)=>setDeathCertData(d=>({...d,report:e.target.value}))}
                />
              </label>
              <div className="md:col-span-2 flex items-center gap-3">
                <input
                  id="policeClearance"
                  type="checkbox"
                  checked={deathCertData.policeClearanceRequired}
                  onChange={(e)=>setDeathCertData(d=>({...d,policeClearanceRequired:e.target.checked}))}
                />
                <label htmlFor="policeClearance" className="text-sm text-gray-700">
                  Police clearance required
                </label>
              </div>
              {deathCertData.policeClearanceRequired && (
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-700 mb-1">Police Clearance File(s)</label>
                  <input type="file" multiple onChange={(e)=>setDeathCertData(d=>({...d,policeClearanceFiles:e.target.files}))}/>
                  <FileChips files={deathCertData.policeClearanceFiles}/>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-2">
              <button onClick={()=>setShowDeathCert(false)} className="px-4 py-2 rounded-md border hover:bg-gray-100">Cancel</button>
              <button onClick={saveDeathCertificate} className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700">Save Certificate</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BirthDeathRecords;
