// src/college/MedicalCollegeAdmin.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  FiHome, FiBookOpen, FiCalendar, FiClipboard, FiLayers, FiGrid, FiAward,
  FiFolder, FiUsers, FiBell, FiLogOut, FiSettings, FiSearch
} from "react-icons/fi";

// ✅ FIXED IMPORT PATHS (no extra /college/)
import MC_Dashboard from "./DashboardCollege";
import MC_Curriculum from "./Curriculum";
import MC_Attendance from "./Attendance";
import MC_Courses from "./Courses";
import MC_Departments from "./Departments";
import MC_DigitalLibrary from "./DigitalLibrary";
import MC_CentralFacilities from "./CentralFacilities";
import MC_AwardsAchievements from "./AwardsAchievements";

const BRAND = "MedCollege Admin";

/* ----------------- Helpers ------------------ */
const cls = (...a) => a.filter(Boolean).join(" ");

export default function MedicalCollegeAdmin() {
  const location = useLocation();
  const navigate = useNavigate();

  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [q, setQ] = useState("");

  const [notifications, setNotifications] = useState([
    { id: 1, msg: "Academic Council meet at 4:00 PM", time: "10m", read: false, type: "calendar" },
    { id: 2, msg: "New e-journal subscription: NEJM", time: "45m", read: false, type: "library" },
    { id: 3, msg: "Attendance synced for MBBS - Sem 3", time: "2h", read: true, type: "attendance" },
  ]);

  /* ---------- path → active tab mapping ---------- */
  useEffect(() => {
    const p = location.pathname;
    if (p === "/college" || p === "/college/") setActive("dashboard");
    else if (p.startsWith("/college/curriculum")) setActive("curriculum");
    else if (p.startsWith("/college/attendance")) setActive("attendance");
    else if (p.startsWith("/college/courses")) setActive("courses");
    else if (p.startsWith("/college/departments")) setActive("departments");
    else if (p.startsWith("/college/digital-library")) setActive("library");
    else if (p.startsWith("/college/central-facilities")) setActive("facilities");
    else if (p.startsWith("/college/awards")) setActive("awards");
    else if (p.startsWith("/college/settings")) setActive("settings");
  }, [location.pathname]);

  const unread = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);
  const markAllRead = () => setNotifications(n => n.map(x => ({ ...x, read: true })));
  const clearAll = () => setNotifications([]);

  const handleLogout = () => navigate("/");

  const handleSearch = (e) => {
    e.preventDefault();
    // hook up to your search page or global finder
    console.log("Search:", q);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Top Bar */}
      <div className="bg-white shadow-md sticky top-0 z-40">
        <div className="px-3 sm:px-6 py-3 flex items-center gap-3">
          {/* Hamburger (mobile) */}
          <button
            className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500"
            onClick={() => setSidebarOpen(s => !s)}
            aria-label="Open sidebar"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>

          {/* Logo */}
          <div className="flex items-center shrink-0">
            <div className="bg-blue-800 p-2 rounded-md mr-3">
              <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none">
                <path d="M12 2v20M7 7h10M5 12h14M6 18h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="text-lg sm:text-xl font-bold text-blue-800">{BRAND}</div>
          </div>

          {/* Search */}
          <div className="flex-1 min-w-0">
            <form onSubmit={handleSearch} className="relative">
              <input
                value={q}
                onChange={e => setQ(e.target.value)}
                className="w-full py-2 px-4 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Search students, faculty, courses, journals…"
              />
              <button type="submit" className="absolute right-3 top-2.5 text-gray-500 hover:text-blue-600">
                <FiSearch className="h-5 w-5" />
              </button>
            </form>
          </div>

          {/* Actions */}
          <button
            onClick={() => setNotifyOpen(v => !v)}
            className="relative p-2 rounded-md text-gray-600 hover:text-blue-600"
            aria-haspopup="true"
            aria-expanded={notifyOpen}
            title="Notifications"
          >
            <FiBell className="h-6 w-6" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-[10px] w-4 h-4 flex items-center justify-center">{unread}</span>
            )}
          </button>

          <div className="relative">
            <button
              className="flex items-center space-x-2 focus:outline-none"
              onClick={() => setProfileOpen(v => !v)}
            >
              <div className="h-9 w-9 rounded-full bg-blue-800 text-white flex items-center justify-center font-semibold">AD</div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-700">Admin</p>
                <p className="text-xs text-gray-500">Medical College</p>
              </div>
            </button>
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50 animate-pop">
                <Link to="/college/settings" className="block px-4 py-2 text-sm hover:bg-blue-50 text-gray-700">Settings</Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-50 text-gray-700"
                >
                  <FiLogOut className="inline mr-2" /> Logout
                </button>
              </div>
            )}
          </div>

          {/* Notifications dropdown */}
          {notifyOpen && (
            <div className="relative">
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl py-2 z-50 animate-pop">
                <div className="px-4 py-2 border-b flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">Notifications</h3>
                  <div className="flex items-center gap-2">
                    <button className="text-xs text-blue-600 hover:underline" onClick={markAllRead}>Mark all read</button>
                    <button className="text-xs text-rose-600 hover:underline" onClick={clearAll}>Clear</button>
                  </div>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.length ? notifications.map((n, i) => (
                    <div
                      key={n.id}
                      className={cls("px-4 py-3 flex items-start gap-3 cursor-pointer animate-fade",
                        !n.read ? "bg-blue-50" : "hover:bg-gray-50")}
                      style={{ animationDelay: `${i * 40}ms` }}
                      onClick={() =>
                        setNotifications(list => list.map(x => x.id === n.id ? { ...x, read: true } : x))
                      }
                    >
                      <span className={cls("mt-1 h-2.5 w-2.5 rounded-full", n.read ? "bg-slate-300" : "bg-blue-500")} />
                      <div>
                        <p className="text-sm text-gray-800">{n.msg}</p>
                        <p className="text-xs text-gray-500 mt-1">{n.time} ago</p>
                      </div>
                    </div>
                  )) : (
                    <p className="px-4 py-6 text-sm text-gray-500 text-center">No notifications</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Inline animations */}
      <style>{`
        .animate-pop { animation: pop .18s ease-out both; }
        @keyframes pop { from { opacity:.2; transform: translateY(-4px) scale(.98) } to { opacity:1; transform:none } }
        .animate-fade { animation: fade .28s ease both; }
        @keyframes fade { from { opacity:0 } to { opacity:1 } }
        .card-in { animation: cardIn .3s ease both; }
        @keyframes cardIn { from { opacity:0; transform: translateY(6px) } to { opacity:1; transform:none } }
        .pulse { animation: pulse 1.6s ease-in-out infinite; }
        @keyframes pulse { 0%,100%{ box-shadow:0 0 0 0 rgba(59,130,246,.18)} 50%{ box-shadow:0 0 0 8px rgba(59,130,246,.04)}}
      `}</style>

      <div className="flex flex-1">
        {/* Sidebar (desktop) */}
        <aside className="hidden lg:flex w-72 bg-blue-800 text-white flex-col shrink-0">
          <Sidebar active={active} setActive={setActive} />
        </aside>

        {/* Sidebar (mobile) */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <div className="absolute inset-y-0 left-0 w-80 max-w-[90vw] bg-blue-800 text-white shadow-2xl flex flex-col">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <span className="font-semibold">Menu</span>
                <button className="p-2 rounded-md hover:bg-white/10" onClick={() => setSidebarOpen(false)}>
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <Sidebar active={active} setActive={(t) => { setActive(t); setSidebarOpen(false); }} />
              </div>
              <button
                onClick={handleLogout}
                className="m-4 mb-6 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 flex items-center justify-center"
              >
                <FiLogOut className="mr-2" /> Logout
              </button>
            </div>
          </div>
        )}

        {/* Main */}
        <main className="flex-1 p-3 sm:p-6 overflow-x-hidden">
          {active === "dashboard" && <MC_Dashboard />}
          {active === "curriculum" && <MC_Curriculum />}
          {active === "attendance" && <MC_Attendance />}
          {active === "courses" && <MC_Courses />}
          {active === "departments" && <MC_Departments />}
          {active === "library" && <MC_DigitalLibrary />}
          {active === "facilities" && <MC_CentralFacilities />}
          {active === "awards" && <MC_AwardsAchievements />}
          {active === "settings" && (
            <div className="card-in bg-white rounded-xl p-6 border">
              <h2 className="text-xl font-semibold mb-2 flex items-center"><FiSettings className="mr-2" /> Settings</h2>
              <p className="text-gray-600">Place your general preferences here.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

/* --------------- Sidebar --------------- */
function Sidebar({ active, setActive }) {
  const Item = ({ to, label, icon: Icon, isActive }) => (
    <Link
      to={to}
      onClick={() => setActive(label.key || label)}
      className={cls(
        "mx-3 my-1 px-3 py-2 rounded-lg flex items-center hover:bg-white/10 transition",
        isActive ? "bg-white/15" : ""
      )}
    >
      <Icon className="h-5 w-5 mr-3" />
      <span>{label.text || label}</span>
    </Link>
  );

  const Section = ({ title, children }) => (
    <div className="mt-3">
      <div className="px-4 text-[11px] uppercase tracking-wider text-white/70">{title}</div>
      <div className="mt-1">{children}</div>
    </div>
  );

  return (
    <nav className="flex-1 py-4 overflow-y-auto">
      <Item to="/college" label={{ key: "dashboard", text: "Dashboard" }} icon={FiHome} isActive={active === "dashboard"} />

      <Section title="Academics">
        <Item to="/college/curriculum" label={{ key: "curriculum", text: "Curriculum" }} icon={FiBookOpen} isActive={active === "curriculum"} />
        <Item to="/college/courses" label={{ key: "courses", text: "Courses" }} icon={FiLayers} isActive={active === "courses"} />
        <Item to="/college/departments" label={{ key: "departments", text: "Departments" }} icon={FiGrid} isActive={active === "departments"} />
      </Section>

      <Section title="Administration">
        <Item to="/college/attendance" label={{ key: "attendance", text: "Attendance" }} icon={FiClipboard} isActive={active === "attendance"} />
        <Item to="/college/awards" label={{ key: "awards", text: "Awards & Achievements" }} icon={FiAward} isActive={active === "awards"} />
      </Section>

      <Section title="Resources">
        <Item to="/college/digital-library" label={{ key: "library", text: "Digital Library" }} icon={FiFolder} isActive={active === "library"} />
        <Item to="/college/central-facilities" label={{ key: "facilities", text: "Central Facilities" }} icon={FiUsers} isActive={active === "facilities"} />
      </Section>

      <div className="h-6" />
      <div className="mx-3 p-3 rounded-xl bg-white/10 text-white/90">
        <div className="text-xs opacity-80">Upcoming</div>
        <div className="mt-1 text-sm font-medium">Academic Calendar</div>
        <div className="flex items-center text-xs opacity-80 mt-2"><FiCalendar className="mr-2" /> Sep 02 – Orientation</div>
        <Link to="/college/curriculum" onClick={() => setActive("curriculum")} className="inline-block mt-3 text-xs px-2 py-1 bg-white/20 rounded-lg hover:bg-white/25">
          View curriculum
        </Link>
      </div>
    </nav>
  );
}
