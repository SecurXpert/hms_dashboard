import React, { useState, useMemo } from "react";

const FrontCMS = () => {
  const [contents, setContents] = useState([
    { id: "C001", title: "Welcome Page", content: "Welcome to our healthcare system!", author: "Admin", date: "08/20/2025", status: "Published" },
    { id: "C002", title: "About Us", content: "Learn about our mission and team.", author: "Admin", date: "08/21/2025", status: "Draft" },
    { id: "C003", title: "Services", content: "Explore our medical services.", author: "Admin", date: "08/22/2025", status: "Published" },
  ]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    id: `C${Math.floor(1000 + Math.random() * 9000)}`,
    title: "",
    content: "",
    author: "",
    date: "08/22/2025",
    status: "Draft",
  });

  const filteredContents = useMemo(() => {
    return contents.filter((item) => {
      const matchesStatus = !statusFilter || item.status.toLowerCase().includes(statusFilter.toLowerCase());
      const matchesSearch = !search || 
        item.id.toLowerCase().includes(search.toLowerCase()) ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.content.toLowerCase().includes(search.toLowerCase()) ||
        item.author.toLowerCase().includes(search.toLowerCase()) ||
        item.date.toLowerCase().includes(search.toLowerCase()) ||
        item.status.toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [search, statusFilter, contents]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddContent = () => {
    setEditingId(null);
    setFormData({
      id: `C${Math.floor(1000 + Math.random() * 9000)}`,
      title: "",
      content: "",
      author: "",
      date: "08/22/2025",
      status: "Draft",
    });
    setShowForm(true);
  };

  const handleEditContent = (id) => {
    const content = contents.find((item) => item.id === id);
    if (content) {
      setEditingId(id);
      setFormData({ ...content });
      setShowForm(true);
    }
  };

  const handleSaveContent = () => {
    if (formData.title && formData.content && formData.author) {
      if (editingId) {
        setContents(contents.map((item) => (item.id === editingId ? formData : item)));
      } else {
        setContents((prev) => [...prev, formData]);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({
        id: `C${Math.floor(1000 + Math.random() * 9000)}`,
        title: "",
        content: "",
        author: "",
        date: "08/22/2025",
        status: "Draft",
      });
    } else {
      alert("Please fill all required fields.");
    }
  };

  const handleDownload = () => {
    alert("Content downloaded as PDF as of 04:12 PM IST, August 22, 2025.");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Frontend CMS</h2>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 bg-white p-4 rounded-lg shadow">
          <input
            type="text"
            placeholder="Search by title or content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/2 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-1/2 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Statuses</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <button onClick={handleAddContent} className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">+ Add Content</button>
          <button onClick={() => handleEditContent(filteredContents[0]?.id)} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition" disabled={!filteredContents.length}>Edit Content</button>
          <button onClick={handleSaveContent} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition" disabled={!showForm}>Save</button>
          <button onClick={handleDownload} className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition">Download</button>
          <button onClick={handlePrint} className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition">Print</button>
        </div>

        {/* Add/Edit Content Form */}
        {showForm && (
          <div className="mb-6 bg-white p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{editingId ? "Edit Content" : "Add New Content"}</h3>
            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Title (e.g., Welcome Page)"
                className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                required
              />
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Content (e.g., Welcome to our healthcare system!)"
                className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 h-32"
                required
              />
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                placeholder="Author (e.g., Admin)"
                className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                required
              />
              <input
                type="text"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                placeholder="Date (e.g., 08/22/2025)"
                className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                required
              />
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>
            <div className="mt-4 flex gap-4">
              <button onClick={handleSaveContent} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">Save</button>
              <button onClick={() => setShowForm(false)} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">Cancel</button>
            </div>
          </div>
        )}

        {/* Content Table */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="grid grid-cols-6 gap-2 text-sm font-medium text-gray-700 bg-gray-100 p-2 rounded-t-lg">
            <div>ID</div>
            <div>Title</div>
            <div>Content</div>
            <div>Author</div>
            <div>Date</div>
            <div>Status</div>
          </div>
          {filteredContents.length === 0 ? (
            <div className="text-center text-gray-500 p-4">No content found matching the criteria.</div>
          ) : (
            filteredContents.map((item) => (
              <div key={item.id} className="grid grid-cols-6 gap-2 p-2 border-b hover:bg-gray-50">
                <div className="text-gray-900">{item.id}</div>
                <div className="text-gray-900">{item.title}</div>
                <div className="text-gray-900 truncate max-w-xs">{item.content}</div>
                <div className="text-gray-900">{item.author}</div>
                <div className="text-gray-900">{item.date}</div>
                <div className="text-gray-900">{item.status}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FrontCMS;