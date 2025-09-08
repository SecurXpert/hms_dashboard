import React, { useState, useMemo } from "react";

const FrontOffice = () => {
  const [visitors, setVisitors] = useState([
    { id: "V001", purpose: "Seminar", name: "Jason", visitTo: "Staff", ipdOpdStaff: "Maria Ford (9018)", phone: "8907834523", date: "08/30/2025", inTime: "02:07 PM", outTime: "03:30 PM" },
    { id: "V002", purpose: "Inquiry", name: "Nylah", visitTo: "OPD Patient", ipdOpdStaff: "Chris Benjamin (1144) (OPN7222)", phone: "9807654323", date: "08/28/2025", inTime: "03:07 PM", outTime: "04:10 PM" },
    { id: "V003", purpose: "Visit", name: "KRAKENex", visitTo: "IPD Patient", ipdOpdStaff: "Hayley Matthews (1121) (IPN100)", phone: "8907656733", date: "08/20/2025", inTime: "02:04 PM", outTime: "03:06 PM" },
  ]);

  const [search, setSearch] = useState("");
  const [purposeFilter, setPurposeFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [visitToFilter, setVisitToFilter] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    id: `V${Math.floor(1000 + Math.random() * 9000)}`,
    purpose: "",
    name: "",
    visitTo: "",
    ipdOpdStaff: "",
    phone: "",
    date: "",
    inTime: "",
    outTime: "",
  });

  // Complaint modal state
  const [showComplaint, setShowComplaint] = useState(false);
  const [complaint, setComplaint] = useState({
    name: "",
    phone: "",
    reason: "",
    note: "",
  });
  const [complaints, setComplaints] = useState([]); // optional storage

  const filteredData = useMemo(() => {
    return visitors.filter((visitor) => {
      const matchesPurpose = !purposeFilter || visitor.purpose.toLowerCase().includes(purposeFilter.toLowerCase());
      const matchesName = !nameFilter || visitor.name.toLowerCase().includes(nameFilter.toLowerCase());
      const matchesVisitTo = !visitToFilter || visitor.visitTo.toLowerCase().includes(visitToFilter.toLowerCase());
      const matchesSearch =
        !search ||
        visitor.id.toLowerCase().includes(search.toLowerCase()) ||
        visitor.name.toLowerCase().includes(search.toLowerCase()) ||
        visitor.ipdOpdStaff.toLowerCase().includes(search.toLowerCase()) ||
        visitor.phone.toLowerCase().includes(search.toLowerCase()) ||
        visitor.date.toLowerCase().includes(search.toLowerCase()) ||
        visitor.inTime.toLowerCase().includes(search.toLowerCase()) ||
        visitor.outTime.toLowerCase().includes(search.toLowerCase());
      return matchesPurpose && matchesName && matchesVisitTo && matchesSearch;
    });
  }, [search, purposeFilter, nameFilter, visitToFilter, visitors]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddVisitor = () => {
    setShowForm(true);
  };

  const handleSaveVisitor = () => {
    if (
      formData.purpose &&
      formData.name &&
      formData.visitTo &&
      formData.ipdOpdStaff &&
      formData.phone &&
      formData.date &&
      formData.inTime
    ) {
      setVisitors((prev) => [...prev, formData]);
      setShowForm(false);
      setFormData({
        id: `V${Math.floor(1000 + Math.random() * 9000)}`,
        purpose: "",
        name: "",
        visitTo: "",
        ipdOpdStaff: "",
        phone: "",
        date: "",
        inTime: "",
        outTime: "",
      });
    } else {
      alert("Please fill all required fields.");
    }
  };

  const handleSaveComplaint = () => {
    if (!complaint.name || !complaint.phone || !complaint.reason) {
      alert("Please fill Name, Phone, and Reason of complaint.");
      return;
    }
    setComplaints((prev) => [{ id: `C${prev.length + 1}`, ...complaint, createdAt: new Date().toISOString() }, ...prev]);
    setShowComplaint(false);
    setComplaint({ name: "", phone: "", reason: "", note: "" });
    alert("Complaint saved.");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Visitor List</h2>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/3 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={purposeFilter}
            onChange={(e) => setPurposeFilter(e.target.value)}
            className="w-full md:w-1/4 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Purpose...</option>
            <option value="Visit">Visit</option>
            <option value="Inquiry">Inquiry</option>
            <option value="Seminar">Seminar</option>
          </select>
          <select
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            className="w-full md:w-1/4 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Name...</option>
            {[...new Set(visitors.map((v) => v.name))].map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <select
            value={visitToFilter}
            onChange={(e) => setVisitToFilter(e.target.value)}
            className="w-full md:w-1/4 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Visit To...</option>
            <option value="Staff">Staff</option>
            <option value="OPD Patient">OPD Patient</option>
            <option value="IPD Patient">IPD Patient</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={handleAddVisitor}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            + Add Visitor
          </button>

          {/* Removed Phone Call and Postal buttons */}

          <button
            onClick={() => setShowComplaint(true)}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Complaint
          </button>
        </div>

        {/* Add Visitor Form */}
        {showForm && (
          <div className="mb-4 p-4 bg-gray-50 rounded-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Add New Visitor</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="purpose"
                value={formData.purpose}
                onChange={handleInputChange}
                placeholder="Purpose (e.g., Visit)"
                className="p-2 border rounded-md"
              />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Name"
                className="p-2 border rounded-md"
              />
              <input
                type="text"
                name="visitTo"
                value={formData.visitTo}
                onChange={handleInputChange}
                placeholder="Visit To (e.g., Staff)"
                className="p-2 border rounded-md"
              />
              <input
                type="text"
                name="ipdOpdStaff"
                value={formData.ipdOpdStaff}
                onChange={handleInputChange}
                placeholder="IPD/Staff (e.g., Pavan K (9018))"
                className="p-2 border rounded-md"
              />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Phone (e.g., 8907834523)"
                className="p-2 border rounded-md"
              />
              <input
                type="text"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                placeholder="Date (e.g., 08/30/2025)"
                className="p-2 border rounded-md"
              />
              <input
                type="text"
                name="inTime"
                value={formData.inTime}
                onChange={handleInputChange}
                placeholder="In Time (e.g., 02:07 PM)"
                className="p-2 border rounded-md"
              />
              <input
                type="text"
                name="outTime"
                value={formData.outTime}
                onChange={handleInputChange}
                placeholder="Out Time (e.g., 03:30 PM)"
                className="p-2 border rounded-md"
              />
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleSaveVisitor}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              >
                Save
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Visitor Table */}
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Purpose</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Visit To</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">IPD/OPD/Staff</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Phone</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">In Time</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Out Time</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-4 py-4 text-center text-gray-500">
                    No visitors found matching the criteria.
                  </td>
                </tr>
              ) : (
                filteredData.map((visitor) => (
                  <tr key={visitor.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-700">{visitor.purpose}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{visitor.name}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{visitor.visitTo}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{visitor.ipdOpdStaff}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{visitor.phone}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{visitor.date}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{visitor.inTime}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{visitor.outTime}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      <button className="text-blue-500 hover:text-blue-700">Edit</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Complaint Modal */}
      {showComplaint && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Register Complaint</h3>
              <button
                onClick={() => setShowComplaint(false)}
                className="text-gray-500 hover:text-gray-700"
                title="Close"
              >
                ✕
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="text-sm">
                <span className="block text-gray-700 mb-1">Name *</span>
                <input
                  type="text"
                  value={complaint.name}
                  onChange={(e) => setComplaint((c) => ({ ...c, name: e.target.value }))}
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="Complainant's name"
                />
              </label>
              <label className="text-sm">
                <span className="block text-gray-700 mb-1">Phone *</span>
                <input
                  type="tel"
                  value={complaint.phone}
                  onChange={(e) => setComplaint((c) => ({ ...c, phone: e.target.value }))}
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="10-digit phone"
                />
              </label>
              <label className="text-sm md:col-span-2">
                <span className="block text-gray-700 mb-1">Reason of Complaint *</span>
                <input
                  type="text"
                  value={complaint.reason}
                  onChange={(e) => setComplaint((c) => ({ ...c, reason: e.target.value }))}
                  className="w-full border rounded-md px-3 py-2"
                  placeholder="e.g., Delay in service"
                />
              </label>
              <label className="text-sm md:col-span-2">
                <span className="block text-gray-700 mb-1">Note</span>
                <textarea
                  value={complaint.note}
                  onChange={(e) => setComplaint((c) => ({ ...c, note: e.target.value }))}
                  className="w-full border rounded-md px-3 py-2 min-h-[100px]"
                  placeholder="Additional details..."
                />
              </label>
            </div>
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-2">
              <button
                onClick={() => setShowComplaint(false)}
                className="px-4 py-2 rounded-md border hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveComplaint}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Save Complaint
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FrontOffice;
