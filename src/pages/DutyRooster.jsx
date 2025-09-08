import React, { useState, useMemo } from "react";

const DutyRooster = () => {
  const userRole = localStorage.getItem('userRole') || 'receptionist'; // Get user role from localStorage, default to 'receptionist'
  const [viewMode, setViewMode] = useState("duty"); // duty, shift, roster, assign
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showAddShift, setShowAddShift] = useState(false);
  const [showAddRoster, setShowAddRoster] = useState(false);
  const [editShiftId, setEditShiftId] = useState(null);
  const [editRosterId, setEditRosterId] = useState(null);
  const [shiftForm, setShiftForm] = useState({ name: "", start: "", end: "" });
  const [rosterForm, setRosterForm] = useState({ shiftId: "", startDate: "", endDate: "" });
  const [assignForm, setAssignForm] = useState({ staff: "", department: "", floor: "", rosterId: "" });

  const [shifts, setShifts] = useState([
    { id: "S001", name: "Second Shift (Day)", start: "12:00 PM", end: "08:00 PM", hour: "08:00.00" },
    { id: "S002", name: "First Shift (Morning)", start: "08:00 AM", end: "04:00 PM", hour: "08:00.00" },
    { id: "S003", name: "Third Shift (Evening)", start: "04:00 PM", end: "11:59 PM", hour: "07:59.00" },
  ]);

  const [rosters, setRosters] = useState([
    { id: "R001", shiftId: "S003", shiftName: "Third Shift (Evening)", startDate: "08/18/2025", endDate: "08/25/2025", shiftStart: "04:00 PM", shiftEnd: "11:59 PM", shiftHour: "07:59.00", rosterDays: 8 },
    { id: "R002", shiftId: "S002", shiftName: "First Shift (Morning)", startDate: "08/08/2025", endDate: "08/16/2025", shiftStart: "08:00 AM", shiftEnd: "04:00 PM", shiftHour: "08:00.00", rosterDays: 9 },
    { id: "R003", shiftId: "S001", shiftName: "Second Shift (Day)", startDate: "07/01/2025", endDate: "07/21/2025", shiftStart: "12:00 PM", shiftEnd: "08:00 PM", shiftHour: "08:00.00", rosterDays: 21 },
    // add more from image if needed
  ]);

  const [duties, setDuties] = useState([
    { staff: "Sonia Bush (9002)", date: "08/07/2025", shiftStart: "12:00 PM", shiftEnd: "08:00 PM", shiftHour: "08:00.00", shiftType: "Second Shift (Day)", department: "Emergency Department", floor: "2nd Floor" },
    { staff: "Sonia Bush (9002)", date: "08/06/2025", shiftStart: "12:00 PM", shiftEnd: "08:00 PM", shiftHour: "08:00.00", shiftType: "Second Shift (Day)", department: "Emergency Department", floor: "2nd Floor" },
    { staff: "Sonia Bush (9002)", date: "08/05/2025", shiftStart: "12:00 PM", shiftEnd: "08:00 PM", shiftHour: "08:00.00", shiftType: "Second Shift (Day)", department: "Emergency Department", floor: "2nd Floor" },
    { staff: "Sonia Bush (9002)", date: "08/04/2025", shiftStart: "12:00 PM", shiftEnd: "08:00 PM", shiftHour: "08:00.00", shiftType: "Second Shift (Day)", department: "Emergency Department", floor: "2nd Floor" },
    { staff: "Sonia Bush (9002)", date: "08/03/2025", shiftStart: "12:00 PM", shiftEnd: "08:00 PM", shiftHour: "08:00.00", shiftType: "Second Shift (Day)", department: "Emergency Department", floor: "2nd Floor" },
    { staff: "Sonia Bush (9002)", date: "08/02/2025", shiftStart: "12:00 PM", shiftEnd: "08:00 PM", shiftHour: "08:00.00", shiftType: "Second Shift (Day)", department: "Emergency Department", floor: "2nd Floor" },
    { staff: "Sonia Bush (9002)", date: "08/01/2025", shiftStart: "12:00 PM", shiftEnd: "08:00 PM", shiftHour: "08:00.00", shiftType: "Second Shift (Day)", department: "Emergency Department", floor: "2nd Floor" },
    { staff: "Sonia Bush (9002)", date: "04/10/2025", shiftStart: "08:00 AM", shiftEnd: "04:00 PM", shiftHour: "08:00.00", shiftType: "First Shift (Morning)", department: "IPD Department", floor: "2nd Floor" },
    // add more
  ]);

  const staffList = ["Sonia Bush (9002)", "Dr. Anil", "Nurse Maria"];
  const departments = ["Emergency Department", "IPD Department", "ICU"];
  const floors = ["1st Floor", "2nd Floor"];

  const filteredDuties = useMemo(() => {
    // filter logic for duties
    return duties.filter((d) => true); // placeholder
  }, [duties]);

  const handleShiftChange = (e) => {
    const { name, value } = e.target;
    setShiftForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRosterChange = (e) => {
    const { name, value } = e.target;
    setRosterForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAssignChange = (e) => {
    const { name, value } = e.target;
    setAssignForm((prev) => ({ ...prev, [name]: value }));
  };

  const calculateHour = (start, end) => {
    const startDate = new Date(`2000-01-01 ${start}`);
    const endDate = new Date(`2000-01-01 ${end}`);
    if (endDate < startDate) endDate.setDate(endDate.getDate() + 1);
    const diff = (endDate - startDate) / 3600000;
    const hh = Math.floor(diff);
    const mm = Math.floor((diff - hh) * 60);
    return `${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}.00`;
  };

  const calculateDays = (start, end) => {
    const startD = new Date(start);
    const endD = new Date(end);
    const diff = (endD - startD) / 86400000 + 1;
    return Math.floor(diff);
  };

  // ---- helpers to keep Assign Save reliable across date formats
  const parseDateSafe = (str) => {
    if (!str) return null;
    // YYYY-MM-DD (from <input type="date">)
    if (str.includes("-")) {
      // Construct with T00:00:00 to avoid TZ issues
      return new Date(str + "T00:00:00");
    }
    // MM/DD/YYYY (seeded data)
    if (str.includes("/")) {
      const [mm, dd, yyyy] = str.split("/").map((p) => parseInt(p, 10));
      return new Date(yyyy, mm - 1, dd);
    }
    // Fallback
    return new Date(str);
  };

  const formatDateMMDDYYYY = (dateObj) => {
    const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
    const dd = String(dateObj.getDate()).padStart(2, "0");
    const yyyy = dateObj.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  };
  // ---- end helpers

  const handleSaveShift = () => {
    const hour = calculateHour(shiftForm.start, shiftForm.end);
    if (editShiftId) {
      setShifts((prev) => prev.map((s) => s.id === editShiftId ? { ...shiftForm, hour, id: editShiftId } : s));
      setEditShiftId(null);
    } else {
      const newId = `S${(shifts.length + 1).toString().padStart(3, '0')}`;
      setShifts((prev) => [...prev, { ...shiftForm, hour, id: newId }]);
    }
    setShowAddShift(false);
    setShiftForm({ name: "", start: "", end: "" });
  };

  const handleEditShift = (id) => {
    const shift = shifts.find((s) => s.id === id);
    setShiftForm({ name: shift.name, start: shift.start, end: shift.end });
    setEditShiftId(id);
    setShowAddShift(true);
  };

  const handleDeleteShift = (id) => {
    setShifts((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSaveRoster = () => {
    const selectedShift = shifts.find((s) => s.id === rosterForm.shiftId);
    if (selectedShift) {
      const days = calculateDays(rosterForm.startDate, rosterForm.endDate);
      if (editRosterId) {
        setRosters((prev) => prev.map((r) => r.id === editRosterId ? { ...rosterForm, shiftName: selectedShift.name, shiftStart: selectedShift.start, shiftEnd: selectedShift.end, shiftHour: selectedShift.hour, rosterDays: days, id: editRosterId } : r));
        setEditRosterId(null);
      } else {
        const newId = `R${(rosters.length + 1).toString().padStart(3, '0')}`;
        setRosters((prev) => [...prev, { ...rosterForm, shiftName: selectedShift.name, shiftStart: selectedShift.start, shiftEnd: selectedShift.end, shiftHour: selectedShift.hour, rosterDays: days, id: newId }]);
      }
      setShowAddRoster(false);
      setRosterForm({ shiftId: "", startDate: "", endDate: "" });
    } else {
      alert("Select a valid shift.");
    }
  };

  const handleEditRoster = (id) => {
    const roster = rosters.find((r) => r.id === id);
    setRosterForm({ shiftId: roster.shiftId, startDate: roster.startDate, endDate: roster.endDate });
    setEditRosterId(id);
    setShowAddRoster(true);
  };

  const handleDeleteRoster = (id) => {
    setRosters((prev) => prev.filter((r) => r.id !== id));
  };

  const handleSaveAssign = () => {
    const selectedRoster = rosters.find((r) => r.id === assignForm.rosterId);
    if (selectedRoster && assignForm.staff && assignForm.department && assignForm.floor) {
      const newDuties = [];
      let currentDate = parseDateSafe(selectedRoster.startDate);
      const endDate = parseDateSafe(selectedRoster.endDate);

      if (!currentDate || !endDate || isNaN(currentDate) || isNaN(endDate)) {
        alert("Roster dates are invalid.");
        return;
      }

      while (currentDate <= endDate) {
        newDuties.push({
          staff: assignForm.staff,
          date: formatDateMMDDYYYY(currentDate),
          shiftStart: selectedRoster.shiftStart,
          shiftEnd: selectedRoster.shiftEnd,
          shiftHour: selectedRoster.shiftHour,
          shiftType: selectedRoster.shiftName,
          department: assignForm.department,
          floor: assignForm.floor,
        });
        // add 1 day
        currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);
      }
      setDuties((prev) => [...prev, ...newDuties]);
      setAssignForm({ staff: "", department: "", floor: "", rosterId: "" });
      alert("Roster assigned and duties generated.");
    } else {
      alert("Please fill all fields.");
    }
  };

  const handleNotifyStaff = () => {
    alert("Notification sent to all staff for their duty schedules.");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Duty Roster</h2>

        {/* Tab Buttons */}
        <div className="flex gap-4 mb-6">
          <button onClick={() => setViewMode("duty")} className={viewMode === "duty" ? "px-4 py-2 rounded bg-blue-600 text-white" : "px-4 py-2 rounded bg-gray-200"}>Duty Roster</button>
          <button onClick={() => setViewMode("shift")} className={viewMode === "shift" ? "px-4 py-2 rounded bg-blue-600 text-white" : "px-4 py-2 rounded bg-gray-200"}>Shift</button>
          <button onClick={() => setViewMode("roster")} className={viewMode === "roster" ? "px-4 py-2 rounded bg-blue-600 text-white" : "px-4 py-2 rounded bg-gray-200"}>Roster List</button>
          {(userRole === 'admin' || userRole === 'super_admin') && (
            <button onClick={() => setViewMode("assign")} className={viewMode === "assign" ? "px-4 py-2 rounded bg-blue-600 text-white" : "px-4 py-2 rounded bg-gray-200"}>Assign Roster</button>
          )}
        </div>

        {viewMode === "duty" && (
          <>
            {/* Filters for Duty */}
            <div className="flex gap-4 mb-4">
              <select className="p-2 border rounded">
                <option>Time Duration</option>
              </select>
              <select className="p-2 border rounded">
                <option>Staff</option>
                {staffList.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <select className="p-2 border rounded">
                <option>Shift</option>
                {shifts.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
            </div>
            {/* Duty Table */}
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="grid grid-cols-8 gap-2 text-sm font-medium text-gray-700 bg-gray-100 p-2 rounded-t-lg">
                <div>Staff</div>
                <div>Date</div>
                <div>Shift Start</div>
                <div>Shift End</div>
                <div>Shift Hour</div>
                <div>Shift Type</div>
                <div>Department</div>
                <div>Floor</div>
              </div>
              {filteredDuties.map((duty, index) => (
                <div key={index} className="grid grid-cols-8 gap-2 p-2 border-b hover:bg-gray-50">
                  <div>{duty.staff}</div>
                  <div>{duty.date}</div>
                  <div>{duty.shiftStart}</div>
                  <div>{duty.shiftEnd}</div>
                  <div>{duty.shiftHour}</div>
                  <div>{duty.shiftType}</div>
                  <div>{duty.department}</div>
                  <div>{duty.floor}</div>
                </div>
              ))}
              {filteredDuties.length === 0 && <div className="text-center p-4">No duties.</div>}
            </div>
          </>
        )}

        {viewMode === "shift" && (
          <>
            <button onClick={() => { setShowAddShift(true); setEditShiftId(null); setShiftForm({ name: "", start: "", end: "" }); }} className="bg-blue-600 text-white px-4 py-2 rounded mb-4">Add Shift</button>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="grid grid-cols-5 gap-2 text-sm font-medium text-gray-700 bg-gray-100 p-2 rounded-t-lg">
  <div>Shift Name</div>
  <div>Shift Start</div>
  <div>Shift End</div>
  <div>Shift Hour</div>
  <div>Action</div>
</div>

{/* Example Data Row */}
<div className="grid grid-cols-5 gap-2 text-sm text-gray-600 border-b p-2">
  <div>Morning Shift</div>
  <div>09:00 AM</div>
  <div>05:00 PM</div>
  <div>8 hrs</div>
  <div>
    <button
      className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
      onClick={() => alert("Cancelled")}
    >
      Cancel
    </button>
  </div>
</div>

              {shifts.map((shift) => (
                <div key={shift.id} className="grid grid-cols-5 gap-2 p-2 border-b hover:bg-gray-50">
                  <div>{shift.name}</div>
                  <div>{shift.start}</div>
                  <div>{shift.end}</div>
                  <div>{shift.hour}</div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditShift(shift.id)} className="text-blue-600">✏️</button>
                    <button onClick={() => handleDeleteShift(shift.id)} className="text-red-600">🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {viewMode === "roster" && (
          <>
            <button onClick={() => { setShowAddRoster(true); setEditRosterId(null); setRosterForm({ shiftId: "", startDate: "", endDate: "" }); }} className="bg-blue-600 text-white px-4 py-2 rounded mb-4">Add Roster</button>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="grid grid-cols-8 gap-2 text-sm font-medium text-gray-700 bg-gray-100 p-2 rounded-t-lg">
                <div>Shift Name</div>
                <div>Start Date</div>
                <div>End Date</div>
                <div>Shift Start</div>
                <div>Shift End</div>
                <div>Shift Hour</div>
                <div>Roster Days</div>
                <div>Action</div>
              </div>
              {rosters.map((roster) => (
                <div key={roster.id} className="grid grid-cols-8 gap-2 p-2 border-b hover:bg-gray-50">
                  <div>{roster.shiftName}</div>
                  <div>{roster.startDate}</div>
                  <div>{roster.endDate}</div>
                  <div>{roster.shiftStart}</div>
                  <div>{roster.shiftEnd}</div>
                  <div>{roster.shiftHour}</div>
                  <div>{roster.rosterDays}</div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditRoster(roster.id)} className="text-blue-600">✏️</button>
                    <button onClick={() => handleDeleteRoster(roster.id)} className="text-red-600">🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {(userRole === 'admin' || userRole === 'super_admin') && viewMode === "assign" && (
          <>
            <h3 className="text-xl font-semibold mb-4">Assign Roster</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <select name="staff" value={assignForm.staff} onChange={handleAssignChange} className="p-2 border rounded">
                <option value="">Select Staff</option>
                {staffList.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <select name="department" value={assignForm.department} onChange={handleAssignChange} className="p-2 border rounded">
                <option value="">Select Department</option>
                {departments.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              <select name="floor" value={assignForm.floor} onChange={handleAssignChange} className="p-2 border rounded">
                <option value="">Select Floor</option>
                {floors.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
              <select name="rosterId" value={assignForm.rosterId} onChange={handleAssignChange} className="p-2 border rounded">
                <option value="">Select Roster</option>
                {rosters.map((r) => <option key={r.id} value={r.id}>{r.shiftName} ({r.startDate} - {r.endDate})</option>)}
              </select>
            </div>
            <button onClick={handleSaveAssign} className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
          </>
        )}

        {/* Popups */}
        {showAddShift && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white p-4 rounded shadow w-full max-w-md">
              <h3 className="font-semibold mb-2">{editShiftId ? "Edit Shift" : "Add Shift"}</h3>
              <input name="name" value={shiftForm.name} onChange={handleShiftChange} placeholder="Shift Name" className="p-2 border rounded mb-2 w-full" />
              <input type="time" name="start" value={shiftForm.start} onChange={handleShiftChange} className="p-2 border rounded mb-2 w-full" />
              <input type="time" name="end" value={shiftForm.end} onChange={handleShiftChange} className="p-2 border rounded mb-2 w-full" />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowAddShift(false);
                    setEditShiftId(null);
                    setShiftForm({ name: "", start: "", end: "" });
                  }}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
                >
                  Cancel
                </button>
                <button onClick={handleSaveShift} className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
              </div>
            </div>
          </div>
        )}

        {showAddRoster && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white p-4 rounded shadow w-full max-w-md">
              <h3 className="font-semibold mb-2">{editRosterId ? "Edit Roster" : "Add Roster"}</h3>
              <select name="shiftId" value={rosterForm.shiftId} onChange={handleRosterChange} className="p-2 border rounded mb-2 w-full">
                <option>Select Shift</option>
                {shifts.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <input type="date" name="startDate" value={rosterForm.startDate} onChange={handleRosterChange} className="p-2 border rounded mb-2 w-full" />
              <input type="date" name="endDate" value={rosterForm.endDate} onChange={handleRosterChange} className="p-2 border rounded mb-2 w-full" />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowAddRoster(false);
                    setEditRosterId(null);
                    setRosterForm({ shiftId: "", startDate: "", endDate: "" });
                  }}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
                >
                  Cancel
                </button>
                <button onClick={handleSaveRoster} className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DutyRooster;
