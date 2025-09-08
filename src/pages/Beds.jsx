// Beds.jsx
import React, { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faBed, 
  faUser, 
  faStethoscope, 
  faCalendar,
  faNotesMedical,
  faXmark,
  faEllipsisVertical,
  faDownload,
  faRefresh,
  faPlus,
  faSearch,
  faFilter
} from "@fortawesome/free-solid-svg-icons";

/* ---------------- Beds sample dataset (floor/ward-wise) ---------------- */
const BEDS = [
  {
    title: "4th Floor · Non AC",
    code: "F4",
    blocks: [
      { 
        id: "FF-114", 
        status: "occupied", 
        patient: {
          name: "Anushka Sanjeewani",
          id: "PT-7892",
          age: 42,
          gender: "Female",
          condition: "Pneumonia",
          admissionDate: "2023-11-15",
          doctor: "Dr. Sharma"
        }
      },
      { id: "FF-145", status: "available" },
      { id: "FF-146", status: "available" },
      { 
        id: "FF-147", 
        status: "occupied", 
        patient: {
          name: "Gaurav Shrivastava",
          id: "PT-4521",
          age: 35,
          gender: "Male",
          condition: "Appendicitis",
          admissionDate: "2023-11-18",
          doctor: "Dr. Patel"
        }
      },
      { id: "FF-149", status: "available" },
      { id: "FF-150", status: "available", note: "Sanitized" },
      { id: "FF-151", status: "available" },
      { 
        id: "FF-152", 
        status: "occupied", 
        patient: {
          name: "Jeffrey M. Ransom",
          id: "PT-9834",
          age: 68,
          gender: "Male",
          condition: "Cardiac Arrhythmia",
          admissionDate: "2023-11-12",
          doctor: "Dr. Williams"
        }
      },
      { id: "FF-154", status: "cleaning" },
      { id: "FF-156", status: "maintenance" },
    ],
  },
  {
    title: "3rd Floor · Private Ward",
    code: "F3P",
    blocks: [
      { 
        id: "TF-104", 
        status: "occupied", 
        patient: {
          name: "Ryan D. Spangler",
          id: "PT-1267",
          age: 29,
          gender: "Male",
          condition: "Fractured Femur",
          admissionDate: "2023-11-17",
          doctor: "Dr. Rodriguez"
        }
      },
      { 
        id: "TF-105", 
        status: "occupied", 
        patient: {
          name: "Katie Strutt",
          id: "PT-3356",
          age: 31,
          gender: "Female",
          condition: "Gallstones",
          admissionDate: "2023-11-16",
          doctor: "Dr. Lee"
        }
      },
      { id: "TF-107", status: "available" },
    ],
  },
  {
    title: "3rd Floor · General Ward (Male)",
    code: "F3G",
    blocks: [
      { id: "TF-106", status: "available" },
      { id: "TF-110", status: "available" },
      { id: "TF-141", status: "available" },
      { 
        id: "TF-142", 
        status: "occupied", 
        patient: {
          name: "Varun Mahajan",
          id: "PT-5567",
          age: 45,
          gender: "Male",
          condition: "Diabetes Management",
          admissionDate: "2023-11-14",
          doctor: "Dr. Gupta"
        }
      },
      { 
        id: "TF-143", 
        status: "occupied", 
        patient: {
          name: "Ankit Singh",
          id: "PT-7789",
          age: 27,
          gender: "Male",
          condition: "Tonsillitis",
          admissionDate: "2023-11-19",
          doctor: "Dr. Kumar"
        }
      },
      { 
        id: "TF-144", 
        status: "occupied", 
        patient: {
          name: "Emma Watson",
          id: "PT-9912",
          age: 33,
          gender: "Female",
          condition: "Asthma Exacerbation",
          admissionDate: "2023-11-13",
          doctor: "Dr. Bennett"
        }
      },
    ],
  },
  {
    title: "2nd Floor · ICU",
    code: "F2I",
    blocks: [
      { id: "SF-137", status: "available" },
      { id: "SF-138", status: "available" },
      { 
        id: "SF-140", 
        status: "occupied", 
        patient: {
          name: "Gaurav Shrivastava",
          id: "PT-4521",
          age: 35,
          gender: "Male",
          condition: "Post-op Monitoring",
          admissionDate: "2023-11-19",
          doctor: "Dr. Patel"
        }
      },
      { id: "SF-141", status: "available" },
    ],
  },
  {
    title: "2nd Floor · NICU",
    code: "F2N",
    blocks: [
      { 
        id: "SF-113", 
        status: "occupied", 
        patient: {
          name: "Kelvin Octamin",
          id: "PT-1123",
          age: 0.3,
          gender: "Male",
          condition: "Premature Birth",
          admissionDate: "2023-11-10",
          doctor: "Dr. Fernandez"
        }
      },
      { 
        id: "SF-133", 
        status: "occupied", 
        patient: {
          name: "Chris Benjamin",
          id: "PT-2234",
          age: 0.4,
          gender: "Male",
          condition: "Neonatal Jaundice",
          admissionDate: "2023-11-15",
          doctor: "Dr. Wilson"
        }
      },
      { 
        id: "SF-135", 
        status: "occupied", 
        patient: {
          name: "Preeti Deshmukh",
          id: "PT-3345",
          age: 0.2,
          gender: "Female",
          condition: "Low Birth Weight",
          admissionDate: "2023-11-12",
          doctor: "Dr. Mehta"
        }
      },
      { 
        id: "SF-136", 
        status: "occupied", 
        patient: {
          name: "Ankit Singh",
          id: "PT-4456",
          age: 0.5,
          gender: "Male",
          condition: "Respiratory Distress",
          admissionDate: "2023-11-14",
          doctor: "Dr. Kumar"
        }
      },
    ],
  },
  {
    title: "1st Floor · AC (Normal)",
    code: "F1",
    blocks: [
      { id: "BF-101", status: "available" },
      { 
        id: "BF-102", 
        status: "occupied", 
        patient: {
          name: "Reserved",
          id: "PT-0000",
          age: 0,
          gender: "Unknown",
          condition: "Quarantine",
          admissionDate: "2023-11-20",
          doctor: "Dr. System"
        }
      },
      { 
        id: "BF-103", 
        status: "occupied", 
        patient: {
          name: "Reserved",
          id: "PT-0000",
          age: 0,
          gender: "Unknown",
          condition: "Quarantine",
          admissionDate: "2023-11-20",
          doctor: "Dr. System"
        }
      },
      { id: "BF-104", status: "available" },
      { id: "BF-105", status: "available" },
      { id: "BF-106", status: "available" },
      { id: "BF-107", status: "available" },
    ],
  },
];

/* ---------------- Helpers for beds ---------------- */
const statusChip = (s) =>
  s === "available"
    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
    : s === "occupied"
    ? "bg-rose-50 text-rose-700 border-rose-200"
    : s === "cleaning"
    ? "bg-amber-50 text-amber-700 border-amber-200"
    : "bg-slate-50 text-slate-700 border-slate-200";

const statusDot = (s) =>
  s === "available"
    ? "bg-emerald-500"
    : s === "occupied"
    ? "bg-rose-500"
    : s === "cleaning"
    ? "bg-amber-500"
    : "bg-slate-400";

const statusLabel = (s) => s[0].toUpperCase() + s.slice(1);

/* ========================================================================= */

export default function Beds() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedBed, setSelectedBed] = useState(null);
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: "",
    age: "",
    gender: "",
    condition: "",
    doctor: ""
  });

  const totals = useMemo(() => {
    const all = BEDS.flatMap((s) => s.blocks);
    return {
      total: all.length,
      available: all.filter((b) => b.status === "available").length,
      occupied: all.filter((b) => b.status === "occupied").length,
      cleaning: all.filter((b) => b.status === "cleaning").length,
      maintenance: all.filter((b) => b.status === "maintenance").length,
    };
  }, []);

  const visibleSections = useMemo(() => {
    const q = search.trim().toLowerCase();
    return BEDS.map((section) => {
      const blocks = section.blocks.filter((b) => {
        const matchStatus = !statusFilter || b.status === statusFilter;
        const matchQuery =
          q === "" ||
          b.id.toLowerCase().includes(q) ||
          (b.patient?.name || "").toLowerCase().includes(q) ||
          (b.note || "").toLowerCase().includes(q);
        return matchStatus && matchQuery;
      });
      return { ...section, blocks };
    });
  }, [search, statusFilter]);

  const handleAddPatient = (bedId) => {
    // In a real app, this would connect to a backend
    // For demo, we'll just show a success message and reset the form
    alert(`Patient ${newPatient.name} added to bed ${bedId} successfully!`);
    setShowAddPatient(false);
    setNewPatient({
      name: "",
      age: "",
      gender: "",
      condition: "",
      doctor: ""
    });
  };

  const handleDischargePatient = (bedId) => {
    // In a real app, this would connect to a backend
    alert(`Patient discharged from bed ${bedId} successfully!`);
    setSelectedBed(null);
  };

  return (
    <div className="min-h-[60vh] bg-transparent relative">
      {/* Local styles for animations */}
      <style>{`
        .animate-fade-in { animation: fadeIn .28s ease both; }
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }

        .bed-card-in { animation: bedIn .32s ease-out both; }
        @keyframes bedIn {
          from { opacity:0; transform: translateY(6px) scale(.98) }
          to   { opacity:1; transform: translateY(0) scale(1) }
        }
        
        .bed-pulse-occupied { animation: bedPulse 1.8s ease-in-out infinite; }
        .bed-pulse-cleaning { animation: bedPulse 1.8s ease-in-out infinite; }
        @keyframes bedPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(244,63,94,.22); }
          50%      { box-shadow: 0 0 0 6px rgba(244,63,94,.05); }
        }
        
        .modal-in {
          animation: modalIn .3s ease-out both;
        }
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        
        .glow:focus { box-shadow: 0 0 0 3px rgba(59,130,246,.35); outline: none; }
        
        @media (max-width: 640px) {
          .mobile-scroll {
            overflow-x: auto;
            white-space: nowrap;
            display: flex;
            padding-bottom: 8px;
          }
          
          .mobile-scroll > div {
            flex: 0 0 auto;
            width: 280px;
            margin-right: 12px;
          }
        }
      `}</style>

      {/* Header & controls (fits within AdminDashboard main area) */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-800 p-2 rounded-md">
            <FontAwesomeIcon icon={faBed} className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-slate-900 leading-tight">Beds Management</h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Total: <b>{totals.total}</b> • Available: <b className="text-emerald-700">{totals.available}</b> • Occupied: <b className="text-rose-700">{totals.occupied}</b> • Cleaning: <b className="text-amber-700">{totals.cleaning}</b> • Maintenance: <b className="text-slate-700">{totals.maintenance}</b>
            </p>
          </div>
        </div>

        {/* Filters row */}
        <div className="mt-4 flex flex-col md:flex-row gap-3 md:items-center">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faSearch} className="h-4 w-4 text-gray-400" />
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search beds, patients, notes…"
              className="w-full md:w-96 pl-10 rounded-md border px-3 py-2 text-sm glow"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <FontAwesomeIcon icon={faFilter} className="h-4 w-4 text-gray-400" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-md border px-3 py-2 text-sm"
            >
              <option value="">All Status</option>
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="cleaning">Cleaning</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
          
          <button 
            onClick={() => setShowAddPatient(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
          >
            <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
            <span>Add Patient</span>
          </button>
        </div>

        {/* Legend */}
        <div className="mt-3 flex items-center flex-wrap gap-2 text-xs">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md border bg-emerald-50 text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Available
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md border bg-rose-50 text-rose-700">
            <span className="h-2 w-2 rounded-full bg-rose-500" /> Occupied
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md border bg-amber-50 text-amber-700">
            <span className="h-2 w-2 rounded-full bg-amber-500" /> Cleaning
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md border bg-slate-50 text-slate-700">
            <span className="h-2 w-2 rounded-full bg-slate-400" /> Maintenance
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-5">
        {visibleSections.map((section, sIdx) => (
          <div key={section.code} className="bg-gray-100/80 p-4 rounded-xl border">
            <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
              <h3 className="text-lg font-semibold">{section.title}</h3>
              <div className="flex items-center gap-2 text-xs">
                <button className="flex items-center gap-1 px-3 py-1.5 rounded-md border hover:bg-white transition-colors">
                  <FontAwesomeIcon icon={faRefresh} className="h-3 w-3" />
                  <span>Refresh</span>
                </button>
                <button 
                  className="flex items-center gap-1 px-3 py-1.5 rounded-md border hover:bg-white transition-colors"
                  onClick={() => exportSection(section)}
                >
                  <FontAwesomeIcon icon={faDownload} className="h-3 w-3" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            {section.blocks.length === 0 ? (
              <div className="text-sm text-slate-500 p-3 bg-white rounded-md border">
                No beds match current filters in this section.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 mobile-scroll">
                {section.blocks.map((b, i) => (
                  <div
                    key={b.id}
                    className={`rounded-lg border bg-white p-3 bed-card-in cursor-pointer hover:shadow-md transition-shadow ${
                      b.status === "occupied"
                        ? "bed-pulse-occupied"
                        : b.status === "cleaning"
                        ? "bed-pulse-cleaning"
                        : ""
                    }`}
                    style={{ animationDelay: `${sIdx * 60 + i * 35}ms` }}
                    onClick={() => setSelectedBed({...b, section: section.title})}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-sm">{b.id}</div>
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border ${statusChip(
                          b.status
                        )}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${statusDot(b.status)}`} />
                        {statusLabel(b.status)}
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-gray-600 min-h-[18px]">
                      {b.status === "occupied" ? (
                        <span className="flex items-center gap-1">
                          <FontAwesomeIcon icon={faUser} className="h-3 w-3" />
                          {b.patient.name}
                        </span>
                      ) : b.note ? (
                        b.note
                      ) : (
                        "—"
                      )}
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <button className="text-[11px] px-2 py-1 rounded-md border hover:bg-gray-50">
                        Details
                      </button>
                      <button className="text-[11px] px-2 py-1 rounded-md border hover:bg-gray-50">
                        Actions
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bed Details Modal */}
      {selectedBed && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto modal-in">
            <div className="p-5 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">Bed Details</h3>
              <button onClick={() => setSelectedBed(null)} className="text-gray-400 hover:text-gray-600">
                <FontAwesomeIcon icon={faXmark} className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-5">
              <div className="mb-4">
                <div className="text-sm text-gray-500">Bed ID</div>
                <div className="font-medium">{selectedBed.id}</div>
              </div>
              
              <div className="mb-4">
                <div className="text-sm text-gray-500">Location</div>
                <div className="font-medium">{selectedBed.section}</div>
              </div>
              
              <div className="mb-4">
                <div className="text-sm text-gray-500">Status</div>
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${statusDot(selectedBed.status)}`} />
                  <span className={selectedBed.status === "available" ? "text-emerald-700" : 
                                 selectedBed.status === "occupied" ? "text-rose-700" : 
                                 selectedBed.status === "cleaning" ? "text-amber-700" : "text-slate-700"}>
                    {statusLabel(selectedBed.status)}
                  </span>
                </div>
              </div>
              
              {selectedBed.status === "occupied" && selectedBed.patient && (
                <>
                  <div className="border-t pt-4 mb-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <FontAwesomeIcon icon={faUser} className="h-4 w-4 text-blue-600" />
                      Patient Information
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <div className="text-sm text-gray-500">Name</div>
                        <div className="font-medium">{selectedBed.patient.name}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Patient ID</div>
                        <div className="font-medium">{selectedBed.patient.id}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <div className="text-sm text-gray-500">Age</div>
                        <div className="font-medium">{selectedBed.patient.age}{selectedBed.patient.age < 1 ? ' months' : ' years'}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Gender</div>
                        <div className="font-medium">{selectedBed.patient.gender}</div>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <FontAwesomeIcon icon={faStethoscope} className="h-3 w-3" />
                        Condition
                      </div>
                      <div className="font-medium">{selectedBed.patient.condition}</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <FontAwesomeIcon icon={faCalendar} className="h-3 w-3" />
                          Admitted
                        </div>
                        <div className="font-medium">{selectedBed.patient.admissionDate}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Attending Doctor</div>
                        <div className="font-medium">{selectedBed.patient.doctor}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm transition-colors">
                      Edit Details
                    </button>
                    <button 
                      onClick={() => handleDischargePatient(selectedBed.id)}
                      className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-2 rounded-md text-sm transition-colors"
                    >
                      Discharge
                    </button>
                  </div>
                </>
              )}
              
              {selectedBed.status === "available" && (
                <div className="pt-4">
                  <button 
                    onClick={() => {
                      setSelectedBed(null);
                      setShowAddPatient(true);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm transition-colors"
                  >
                    Assign Patient
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Patient Modal */}
      {showAddPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-xl max-w-md w-full modal-in">
            <div className="p-5 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">Add New Patient</h3>
              <button onClick={() => setShowAddPatient(false)} className="text-gray-400 hover:text-gray-600">
                <FontAwesomeIcon icon={faXmark} className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-5">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                  <input
                    type="text"
                    value={newPatient.name}
                    onChange={(e) => setNewPatient({...newPatient, name: e.target.value})}
                    className="w-full rounded-md border px-3 py-2 text-sm glow"
                    placeholder="Enter full name"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                    <input
                      type="number"
                      value={newPatient.age}
                      onChange={(e) => setNewPatient({...newPatient, age: e.target.value})}
                      className="w-full rounded-md border px-3 py-2 text-sm glow"
                      placeholder="Age"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                      value={newPatient.gender}
                      onChange={(e) => setNewPatient({...newPatient, gender: e.target.value})}
                      className="w-full rounded-md border px-3 py-2 text-sm"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Medical Condition</label>
                  <input
                    type="text"
                    value={newPatient.condition}
                    onChange={(e) => setNewPatient({...newPatient, condition: e.target.value})}
                    className="w-full rounded-md border px-3 py-2 text-sm glow"
                    placeholder="Diagnosis or condition"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Attending Doctor</label>
                  <input
                    type="text"
                    value={newPatient.doctor}
                    onChange={(e) => setNewPatient({...newPatient, doctor: e.target.value})}
                    className="w-full rounded-md border px-3 py-2 text-sm glow"
                    placeholder="Doctor's name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assign to Bed</label>
                  <select className="w-full rounded-md border px-3 py-2 text-sm">
                    <option value="">Select Available Bed</option>
                    {BEDS.flatMap(s => s.blocks)
                      .filter(b => b.status === "available")
                      .map(b => (
                        <option key={b.id} value={b.id}>{b.id}</option>
                      ))
                    }
                  </select>
                </div>
              </div>
              
              <div className="flex gap-2 pt-6">
                <button 
                  onClick={() => setShowAddPatient(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-md text-sm hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleAddPatient("BF-101")} // Hardcoded for demo
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm transition-colors"
                >
                  Add Patient
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- tiny export helper (CSV) ---------------- */
function exportSection(section) {
  const headers = ["Bed ID", "Status", "Patient Name", "Patient ID", "Condition", "Doctor"];
  const rows = section.blocks.map((b) => [
    b.id,
    statusLabel(b.status),
    b.status === "occupied" ? b.patient.name : "",
    b.status === "occupied" ? b.patient.id : "",
    b.status === "occupied" ? b.patient.condition : "",
    b.status === "occupied" ? b.patient.doctor : "",
  ]);
  const csv =
    headers.join(",") +
    "\n" +
    rows.map((r) => r.map((x) => `"${String(x || "").replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${section.code}_beds.csv`;
  a.click();
}