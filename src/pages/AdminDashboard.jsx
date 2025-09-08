// import { useNavigate, Link, useLocation, useParams } from 'react-router-dom';
// import { useState, useEffect, useMemo, useRef, useLayoutEffect } from 'react';
// import Appointments from './Appointments';
// import Ipd from './Ipd';
// import Radiology from './Radiology';
// import Pathology from './Pathology';
// import Dashboard from './Dashboard';
// import Billing from './Billing';
// import Pharmacy from './Pharmacy';
// import BloodBank from './BloodBank';
// import Ambulance from './Ambulance';
// import FrontOffice from './FrontOffice';
// import BirthDeathRecords from './BirthDeathRecords';
// import HumanResources from './HumanResources';
// import DutyRooster from './DutyRooster';
// import AnnualCalender from './AnnualCalender';
// import TPA from './TPA';
// import Inventory from './Inventory';
// import Reports from './Reports';
// import Settings from './Settings';
// import View from './View';
// import Beds from './Beds';
// import Radiodash from './Radiodash';
// import PharmacyDash from './Pharmacydash';
// import Pathodash from './Pathodash';
// import Accountdash from './Accountdash';
// import Receptiondash from './Receptiondash';
// import PatientRecords from './PatientRecords'; 
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import Attendance from './Attendance'; 
// import { faUserClock } from '@fortawesome/free-solid-svg-icons';

// import {
//   faBed,
//   faCalendarAlt,
//   faBell,
//   faSearch,
//   faSignOutAlt,
//   faUserCircle,
//   faTimes,
//   faBars,
//   faChevronDown,
//   faChevronUp,
//   faHome,
//   faCalendarCheck,
//   faProcedures,
//   faXRay,
//   faMicroscope,
//   faReceipt,
//   faPills,
//   faTint,
//   faAmbulance,
//   faDesktop,
//   faCertificate,
//   faUsers,
//   faClipboardList,
//   faCalendarDay,
//   faShieldAlt,
//   faBoxes,
//   faChartBar,
//   faCog,
//   faEye,
//   faUser,
//   faFileExcel,            // Excel icon
// } from "@fortawesome/free-solid-svg-icons";
// import View1 from './View1';
// import logo1 from '../assets/img/hmslogo.png'


// /* ---------------- Add: match Login's obfuscation helpers ---------------- */
// const OBFUSCATION_KEY = 'vaidya_demo_key';
// const deobfuscate = (encStr) => {
//   try {
//     const s = atob(encStr || '');
//     let x = '';
//     for (let i = 0; i < s.length; i++) {
//       x += String.fromCharCode(s.charCodeAt(i) ^ OBFUSCATION_KEY.charCodeAt(i % OBFUSCATION_KEY.length));
//     }
//     return x;
//   } catch {
//     return '';
//   }
// };
// /* ----------------------------------------------------------------------- */

// /* ---------------- Disclosure Component for Dropdowns ---------------- */
// function Disclosure({ title, children, active }) {
//   const [isOpen, setIsOpen] = useState(active);
//   return (
//     <div className="space-y-1">
//       <button
//         className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-blue-700 ${active ? 'bg-blue-700' : ''}`}
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <div className="flex items-center">
//           {title}
//         </div>
//         <FontAwesomeIcon
//           icon={isOpen ? faChevronUp : faChevronDown}
//           className="w-3 h-3 transition-transform duration-200"
//         />
//       </button>
//       {isOpen && <div className="space-y-1 pl-2 border-l border-blue-600 ml-3 mt-1">{children}</div>}
//     </div>
//   );
// }

// /* ---------------- NavLinkItem Component ---------------- */
// function NavLinkItem({ to, label, icon, active, onClick, nested = false }) {
//   return (
//     <Link
//       to={to}
//       className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-blue-700 ${active ? 'bg-blue-700' : ''} ${nested ? 'pl-8' : ''}`}
//       onClick={onClick}
//     >
//       <FontAwesomeIcon icon={icon} className="w-4 h-4 mr-3" />
//       {label}
//     </Link>
//   );
// }

// /* ========================================================================= */

// const AdminDashboard = ({ initialTab = 'dashboard' }) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { id, name } = useParams();

//   const [activeTab, setActiveTab] = useState(initialTab);
//   const [isAppointmentDropdownOpen, setIsAppointmentDropdownOpen] = useState(false);
//   const [isTestDropdownOpen, setIsTestDropdownOpen] = useState(false);
//   const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isNotificationOpen, setIsNotificationOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');

//   // 🔔 Sample notifications (with unread flags)
//   const [notifications, setNotifications] = useState([
//     { id: 101, message: 'New appointment request (OPD)', time: '10 mins ago', read: false, type: 'opd' },
//     { id: 102, message: 'Radiology report uploaded for P1302', time: '22 mins ago', read: false, type: 'radiology' },
//     { id: 103, message: 'IPD bed allocated (Private Ward TF-104)', time: '1 hour ago', read: true, type: 'ipd' },
//     { id: 104, message: 'Ambulance dispatched to Sector 9', time: '2 hours ago', read: false, type: 'ambulance' },
//     { id: 105, message: 'Pharmacy bill pending payment (PH-9002)', time: '3 hours ago', read: true, type: 'pharmacy' },
//   ]);

//   // Get user role from localStorage
//   const userRole = localStorage.getItem('userRole') || 'admin';

//   // --- SCROLL FIX ---
//   // This div (not the window) is the scroll container. Reset it on route/tab/name changes.
//   const contentRef = useRef(null);
//   useLayoutEffect(() => {
//     if (contentRef.current) {
//       contentRef.current.scrollTo({ top: 0, left: 0, behavior: 'auto' });
//     }
//     // Also reset the window just in case (harmless if window doesn't scroll)
//     window.scrollTo(0, 0);
//   }, [location.pathname, activeTab, name]);
//   // --- /SCROLL FIX ---

//   // existing mount scroll (kept)
//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   // ✅ Also keep your name-based scroll as you requested
//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [name]);

//   useEffect(() => {
//      if (userRole === 'pharmacist' && location.pathname === '/specialist') {
//       setActiveTab('pharmacydash');
//     } else if (userRole === 'radiologist' && location.pathname === '/specialist') {
//       setActiveTab('radiodash');
//       } else if (userRole === 'pathologist' && location.pathname === '/specialist') {
//       setActiveTab('pathodash');
//        } else if (userRole === 'accountant' && location.pathname === '/accountant') {
//       setActiveTab('accountdash');
//          } else if (userRole === 'receptionist' && location.pathname === '/receptionist') {
//       setActiveTab('receptiondash');
//      } else if (location.pathname === '/admin/appointments' ||
//         location.pathname === '/specialist/appointments' ||
//         location.pathname === '/receptionist/appointments' ||
//         location.pathname === '/doctor/appointments' ||
//         location.pathname === '/nurse/appointments' ||
//         location.pathname === '/accountant/appointments') setActiveTab('appointments');
//     else if (location.pathname === '/ipd') setActiveTab('ipd');
//     else if (location.pathname === '/admin/radiology' ||
//              location.pathname === '/specialist/radiology' ||
//              location.pathname === '/doctor/radiology' ||
//              location.pathname === '/nurse/radiology' ||
//              location.pathname === '/accountant/radiology') setActiveTab('radiology');
//     else if (location.pathname === '/admin/pathology' ||
//              location.pathname === '/specialist/pathology' ||
//              location.pathname === '/doctor/pathology' ||
//              location.pathname === '/nurse/pathology' ||
//              location.pathname === '/accountant/pathology') setActiveTab('pathology');
//     else if (location.pathname === '/admin' ||
//              location.pathname === '/specialist' ||
//              location.pathname === '/receptionist' ||
//              location.pathname === '/doctor' ||
//              location.pathname === '/nurse' ||
//              location.pathname === '/accountant') setActiveTab('dashboard');
//     else if (location.pathname.startsWith('/view/')) setActiveTab('view');
//     else if (location.pathname.startsWith('/view1/')) setActiveTab('view1');
 
//     else if (
//              location.pathname === '/specialist/billing' ||
//              location.pathname === '/receptionist/billing' ||
//              location.pathname === '/doctor/billing' ||
//              location.pathname === '/nurse/billing' ||
//              location.pathname === '/accountant/billing') setActiveTab('billing');
//     else if (location.pathname === '/admin/pharmacy' ||
//              location.pathname === '/specialist/pharmacy' ||
//              location.pathname === '/receptionist/pharmacy' ||
//              location.pathname === '/doctor/pharmacy' ||
//              location.pathname === '/nurse/pharmacy' ||
//              location.pathname === '/accountant/pharmacy') setActiveTab('pharmacy');
//     else if (location.pathname === '/admin/bloodbank' ||
//              location.pathname === '/receptionist/bloodbank' ||
//              location.pathname === '/doctor/bloodbank' ||
//              location.pathname === '/nurse/bloodbank' ||
//              location.pathname === '/accountant/bloodbank') setActiveTab('bloodbank');
//     else if (location.pathname === '/admin/ambulance' ||
//              location.pathname === '/receptionist/ambulance' ||
//              location.pathname === '/doctor/ambulance' ||
//              location.pathname === '/nurse/ambulance' ||
//              location.pathname === '/accountant/ambulance') setActiveTab('ambulance');
//     else if (location.pathname === '/admin/frontoffice' ||
//              location.pathname === '/receptionist/frontoffice' ||
//              location.pathname === '/doctor/frontoffice' ||
//              location.pathname === '/nurse/frontoffice' ||
//              location.pathname === '/accountant/frontoffice') setActiveTab('frontoffice');
//     else if (location.pathname === '/admin/birthdeathrecords' ||
//              location.pathname === '/receptionist/birthdeathrecords' ||
//              location.pathname === '/doctor/birthdeathrecords' ||
//              location.pathname === '/nurse/birthdeathrecords' ||
//              location.pathname === '/accountant/birthdeathrecords') setActiveTab('birthdeathrecords');
//     else if (location.pathname === '/admin/humanresources' ||
//              location.pathname === '/accountant/humanresources') setActiveTab('humanresources');
//     else if (location.pathname === '/admin/dutyrooster' ||
//              location.pathname === '/specialist/dutyrooster' ||
//              location.pathname === '/receptionist/dutyrooster' ||
//              location.pathname === '/doctor/dutyrooster' ||
//              location.pathname === '/nurse/dutyrooster' ||
//              location.pathname === '/accountant/dutyrooster') setActiveTab('dutyrooster');
//     else if (location.pathname === '/admin/AnnualCalender' ||
//              location.pathname === '/specialist/AnnualCalender' ||
//              location.pathname === '/receptionist/AnnualCalender' ||
//              location.pathname === '/doctor/AnnualCalender' ||
//              location.pathname === '/nurse/AnnualCalender' ||
//              location.pathname === '/accountant/AnnualCalender') setActiveTab('AnnualCalender');
//     else if (location.pathname === '/admin/tpa' ||
//              location.pathname === '/specialist/tpa' ||
//              location.pathname === '/receptionist/tpa' ||
//              location.pathname === '/doctor/tpa' ||
//              location.pathname === '/nurse/tpa' ||
//              location.pathname === '/accountant/tpa') setActiveTab('tpa');
//     else if (location.pathname === '/admin/inventory' ||
//              location.pathname === '/specialist/inventory' ||
//              location.pathname === '/receptionist/inventory' ||
//              location.pathname === '/doctor/inventory' ||
//              location.pathname === '/nurse/inventory' ||
//              location.pathname === '/accountant/inventory') setActiveTab('inventory');
//     else if (location.pathname === '/admin/reports' ||
//              location.pathname === '/doctor/reports' ||
//              location.pathname === '/accountant/reports') setActiveTab('reports');
//     else if (location.pathname === '/admin/settings' ||
//              location.pathname === '/specialist/settings' ||
//              location.pathname === '/receptionist/settings' ||
//              location.pathname === '/doctor/settings' ||
//              location.pathname === '/nurse/settings' ||
//              location.pathname === '/accountant/settings') setActiveTab('settings');

//               else if (location.pathname === '/admin/attendance');
//             else if (location.pathname === '/admin/patientrecords');
//     // ✅ Beds routes
//     else if (location.pathname === '/admin/beds' ||
//              location.pathname === '/receptionist/beds' ||
//              location.pathname === '/doctor/beds' ||
//              location.pathname === '/nurse/beds' ||
//              location.pathname === '/accountant/beds') setActiveTab('beds');

//   }, [location.pathname, userRole]);

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('userRole');
//     navigate('/');
//   };

//   const toggleProfileDropdown = () => setIsProfileDropdownOpen((v) => !v);
//   const toggleSidebar = () => setIsSidebarOpen((s) => !s);
//   const toggleNotifications = () => setIsNotificationOpen((v) => !v);

//   const handleSearch = (e) => {
//     e.preventDefault();
//     console.log('Searching for:', searchQuery);
//   };

//   const markNotificationAsRead = (nid) => {
//     setNotifications((prev) => prev.map(n => n.id === nid ? { ...n, read: true } : n));
//   };
//   const markAllAsRead = () => setNotifications((prev) => prev.map(n => ({ ...n, read: true })));
//   const clearNotifications = () => setNotifications([]);

//   const unreadNotificationsCount = useMemo(
//     () => notifications.filter(n => !n.read).length,
//     [notifications]
//   );

//   const showCalendar = () => navigate(getBasePath(userRole) + '/AnnualCalender');
//   const goToBeds = () => navigate(getBasePath(userRole) + '/beds');

//   // role-based access (✅ includes 'beds' where allowed)
//   const radiologistAllowedTabs = ['appointments', 'ipd', 'radiology', 'radiodash', 'billing', 'dutyrooster', 'AnnualCalender', 'tpa', 'inventory', 'settings', 'view','view1'];
//   const pathologistAllowedTabs = ['appointments', 'ipd', 'pathology', 'pathodash', 'billing', 'dutyrooster', 'AnnualCalender', 'tpa', 'inventory', 'settings', 'view','view1'];
//   const pharmacistAllowedTabs = ['appointments', 'ipd', 'billing', 'pharmacy', 'pharmacydash', 'dutyrooster', 'AnnualCalender', 'tpa', 'inventory', 'settings', 'view','view1'];
//   const receptionistAllowedTabs = ['receptiondash', 'appointments', 'ipd', 'billing', 'pharmacy', 'bloodbank', 'ambulance', 'frontoffice', 'birthdeathrecords', 'dutyrooster', 'AnnualCalender', 'tpa', 'inventory', 'settings', 'view','view1', 'beds'];
//   const doctorAllowedTabs = ['dashboard', 'appointments', 'billing', 'patientrecords','ipd', 'radiology', 'ambulance', 'pathology', 'pharmacy', 'tpa', 'inventory', 'bloodbank', 'frontoffice', 'birthdeathrecords', 'dutyrooster', 'AnnualCalender', 'reports', 'settings', 'view','view1', 'beds'];
//   const accountantAllowedTabs = ['accountdash', 'billing', 'pharmacy', 'birthdeathrecords', 'inventory', 'reports', 'tpa', 'settings', 'view','view1', 'beds'];
//   const nurseAllowedTabs = ['dashboard', 'appointments', 'ipd', 'radiology', 'pathology', 'bloodbank', 'ambulance', 'dutyrooster', 'inventory', 'settings','tpa', 'view','view1', 'beds'];

//   // Roles allowed to see Beds quick button in top bar
//   const bedsTopBarAllowed = ['super_admin','admin','receptionist','doctor','nurse','accountant'];

//   /* ---------- Excel download (exports localStorage demoBookings) ---------- */
//   const downloadDemoBookingsExcel = () => {
//     try {
//       // READ + DEOBFUSCATE to match Login component storage
//       const raw = localStorage.getItem('demoBookings');
//       const decoded = raw ? deobfuscate(raw) : '';
//       const data = decoded ? JSON.parse(decoded) : [];

//       const headers = [
//         'ID','Person Name','Clinic/Hospital','Location','Contact','Email','Slot','Date','Time','Created At'
//       ];

//       const csvRows = [];
//       csvRows.push(headers.join(','));

//       const escapeCell = (val) => {
//         if (val === null || val === undefined) return '';
//         const s = String(val).replace(/"/g, '""');
//         return /[",\n]/.test(s) ? `"${s}"` : s;
//         };

//       data.forEach(row => {
//         const line = [
//           row.id,
//           row.name,
//           row.clinicOrHospital,
//           row.location,
//           row.contact,
//           row.email,
//           row.slot,
//           row.date,
//           row.time,
//           row.createdAt
//         ].map(escapeCell).join(',');
//         csvRows.push(line);
//       });

//       const csvString = csvRows.join('\n');
//       const blob = new Blob([csvString], {
//         type: 'application/vnd.ms-excel;charset=utf-8;'
//       });
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       const today = new Date().toISOString().slice(0,10);
//       a.href = url;
//       a.download = `demo_bookings_${today}.csv`;
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//       URL.revokeObjectURL(url);
//     } catch (e) {
//       console.error('Export failed:', e);
//       alert('Could not export demo bookings.');
//     }
//   };

//   return (
//     <div className="flex flex-col h-screen overflow-hidden bg-gray-50">

//       {/* Top Bar */}
//       <div className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-200">
//         <div className="py-3 px-4 sm:px-6 flex items-center gap-3">
//           {/* Hamburger (mobile) */}
//           <button
//             className="lg:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
//             onClick={toggleSidebar}
//             aria-label="Open sidebar"
//           >
//             <FontAwesomeIcon icon={faBars} className="h-5 w-5" />
//           </button>

//           {/* Logo */}
//           <div className="flex items-center flex-shrink-0">
//  <div className="mr-2 sm:mr-3 flex items-center justify-center">
//   <img 
//     src={logo1} 
//     alt="HMS Logo" 
//     className="h-10 w-20 sm:h-12 sm:w-12 md:h-14 md:w-14 object-contain"
//   />
// </div>

//   <div className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">
//     Vaidhya Narayan {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
//   </div>
// </div>


//           {/* Spacer ensures right cluster sticks to far right */}
//           <div className="flex-1" />

//           {/* Search (hidden on very small screens to preserve right alignment) */}
//           <div className="hidden sm:block w-full max-w-xl">
//             <form onSubmit={handleSearch} className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FontAwesomeIcon icon={faSearch} className="h-4 w-4 text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search patients, appointments, reports..."
//                 className="w-full py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50 transition-colors duration-200"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </form>
//           </div>

//           {/* RIGHT CLUSTER — Beds, Calendar, Download(only super_admin), Notifications, Super_User */}
//           <div className="ml-auto flex items-center gap-2 sm:gap-3">
//             {/* Beds quick nav — only for allowed roles */}
//             {bedsTopBarAllowed.includes(userRole) && (
//               <button
//                 className="text-gray-600 hover:text-blue-600 transition-colors duration-200 p-2 rounded-full hover:bg-blue-50"
//                 onClick={goToBeds}
//                 title="Bed Status"
//               >
//                 <FontAwesomeIcon icon={faBed} className="h-5 w-5" />
//               </button>
//             )}

//             {/* Calendar */}
//             <button
//               className="text-gray-600 hover:text-blue-600 transition-colors duration-200 p-2 rounded-full hover:bg-blue-50"
//               onClick={showCalendar}
//               title="Annual Calendar"
//             >
//               <FontAwesomeIcon icon={faCalendarAlt} className="h-5 w-5" />
//             </button>

//             {/* Excel Download (super_admin only) */}
//             {userRole === 'super_admin' && (
//               <button
//                 className="text-green-600 hover:text-green-700 transition-colors duration-200 p-2 rounded-full hover:bg-green-50"
//                 onClick={downloadDemoBookingsExcel}
//                 title="Download Demo Bookings (Excel)"
//                 aria-label="Download Excel"
//               >
//                 <FontAwesomeIcon icon={faFileExcel} className="h-5 w-5" />
//               </button>
//             )}

//             {/* Notifications */}
//             <div className="relative">
//               <button
//                 className="text-gray-600 hover:text-blue-600 transition-colors duration-200 p-2 rounded-full hover:bg-blue-50 relative"
//                 onClick={toggleNotifications}
//                 aria-haspopup="true"
//                 aria-expanded={isNotificationOpen}
//                 title="Notifications"
//               >
//                 <FontAwesomeIcon icon={faBell} className="h-5 w-5" />
//                 {unreadNotificationsCount > 0 && (
//                   <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center text-[10px] font-medium">
//                     {unreadNotificationsCount}
//                   </span>
//                 )}
//               </button>

//               {isNotificationOpen && (
//                 <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200 animate-notify-in">
//                   <div className="px-4 py-2 border-b border-gray-200 flex items-center justify-between">
//                     <h3 className="font-semibold text-gray-800 text-sm">Notifications</h3>
//                     <div className="flex items-center gap-2">
//                       <button onClick={markAllAsRead} className="text-xs text-blue-600 hover:underline font-medium">Mark all read</button>
//                       <button onClick={clearNotifications} className="text-xs text-red-600 hover:underline font-medium">Clear</button>
//                     </div>
//                   </div>
//                   <div className="max-h-72 overflow-y-auto">
//                     {notifications.length > 0 ? (
//                       notifications.map((n, i) => (
//                         <div
//                           key={n.id}
//                           className={`px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-start gap-3 ${!n.read ? 'bg-blue-50' : ''} animate-fade-in transition-colors duration-200`}
//                           style={{ animationDelay: `${i * 40}ms` }}
//                           onClick={() => markNotificationAsRead(n.id)}
//                         >
//                           <span className={`mt-1.5 flex-shrink-0 h-2.5 w-2.5 rounded-full ${n.read ? 'bg-gray-300' : 'bg-blue-500'}`} />
//                           <div className="flex-1 min-w-0">
//                             <p className="text-sm text-gray-800 truncate">{n.message}</p>
//                             <p className="text-xs text-gray-500 mt-1">{n.time}</p>
//                           </div>
//                         </div>
//                       ))
//                     ) : (
//                       <p className="px-4 py-6 text-sm text-gray-500 text-center">No notifications</p>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Super_User (Profile) */}
//             <div className="relative">
//               <button
//                 className="flex items-center space-x-2 focus:outline-none p-1 rounded-full hover:bg-blue-50 transition-colors duration-200"
//                 onClick={toggleProfileDropdown}
//                 title="Super User"
//               >
//                 <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-gradient-to-r from-blue-700 to-blue-600 flex items-center justify-center text-white font-semibold shadow-sm">
//                   {userRole.substring(0,2).toUpperCase()}
//                 </div>
//                 <div className="text-left hidden md:block">
//                   <p className="text-sm font-medium text-gray-700">Super User</p>
//                   <p className="text-xs text-gray-500">{userRole}</p>
//                 </div>
//               </button>
//               {isProfileDropdownOpen && (
//                 <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
//                   <div className="px-4 py-2 border-b border-gray-200">
//                     <p className="text-sm text-gray-800 font-medium">Super User</p>
//                     <p className="text-xs text-gray-500">{userRole}@example.com</p>
//                   </div>
//                   <Link
//                     to={`/${['radiologist','pathologist','pharmacist','receptionist','nurse','accountant'].includes(userRole) ? userRole : 'admin'}/profile`}
//                     className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 flex items-center"
//                   >
//                     <FontAwesomeIcon icon={faUser} className="w-4 h-4 mr-2" />
//                     Your Profile
//                   </Link>
//                   <div className="border-t border-gray-100" />
//                   <button
//                     onClick={handleLogout}
//                     className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 flex items-center"
//                   >
//                     <FontAwesomeIcon icon={faSignOutAlt} className="w-4 h-4 mr-2" />
//                     Sign out
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Animations */}
//       <style>{`
//         .animate-notify-in { animation: notifyIn .18s ease-out both; }
//         @keyframes notifyIn { from { opacity: .2; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
//         .animate-fade-in { animation: fadeIn .28s ease both; }
//         @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
//       `}</style>

//       <div className="flex flex-1 min-h-0">

//         {/* Sidebar (desktop) */}
//         <div className="hidden lg:flex w-64 bg-gradient-to-b from-blue-800 to-blue-900 text-white flex-col flex-shrink-0 shadow-lg overflow-y-auto min-h-0 [-webkit-overflow-scrolling:touch]">

//           <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} handleLogout={handleLogout} userRole={userRole} />
//         </div>

//         {/* Sidebar (mobile drawer) */}
//         {isSidebarOpen && (
//           <div className="lg:hidden fixed inset-0 z-50">
//             <div className="absolute inset-0 bg-black/50" onClick={() => setIsSidebarOpen(false)} aria-hidden="true" />
//             <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] h-full bg-gradient-to-b from-blue-800 to-blue-900 text-white shadow-2xl flex flex-col overflow-y-auto min-h-0 [-webkit-overflow-scrolling:touch]">
//               <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
//                 <span className="font-semibold">Menu</span>
//                 <button className="rounded-md p-2 hover:bg-white/10 transition-colors duration-200" onClick={() => setIsSidebarOpen(false)} aria-label="Close sidebar">
//                   <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
//                 </button>
//               </div>
//               <div className="flex-1 overflow-y-auto">
//                 <Sidebar
//                   activeTab={activeTab}
//                   setActiveTab={(t) => { setActiveTab(t); setIsSidebarOpen(false); }}
//                   handleLogout={() => { setIsSidebarOpen(false); handleLogout(); }}
//                   userRole={userRole}
//                 />
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Main Content */}
//         <div
//           ref={contentRef}
//           className="flex-1 p-4 sm:p-6 overflow-y-auto overflow-x-hidden bg-gray-50 min-w-0 min-h-0 [-webkit-overflow-scrolling:touch]"
//         >
//           {(['admin', 'super_admin'].includes(userRole) ||
//              (userRole === 'radiologist' && radiologistAllowedTabs.includes(activeTab)) ||
//              (userRole === 'pathologist' && pathologistAllowedTabs.includes(activeTab)) ||
//              (userRole === 'pharmacist' && pharmacistAllowedTabs.includes(activeTab)) ||
//              (userRole === 'receptionist' && receptionistAllowedTabs.includes(activeTab)) ||
//              (userRole === 'doctor' && doctorAllowedTabs.includes(activeTab)) ||
//              (userRole === 'nurse' && nurseAllowedTabs.includes(activeTab)) ||
//              (userRole === 'accountant' && accountantAllowedTabs.includes(activeTab))) && (
//             <>
//               {activeTab === 'dashboard' && <Dashboard />}
//               {activeTab === 'appointments' && <Appointments />}
//               {activeTab === 'ipd' && <Ipd />}
//               {activeTab === 'patientrecords' && <PatientRecords />}
//               {activeTab === 'radiology' && <Radiology />}
//               {activeTab === 'pathology' && <Pathology />}
//               {activeTab === 'billing' && <Billing />}
//               {activeTab === 'pharmacy' && <Pharmacy />}
//               {activeTab === 'settings' && <Settings />}
//               {activeTab === 'bloodbank' && <BloodBank />}
//               {activeTab === 'ambulance' && <Ambulance />}
//               {activeTab === 'frontoffice' && <FrontOffice />}
//               {activeTab === 'birthdeathrecords' && <BirthDeathRecords />}
//               {activeTab === 'humanresources' && <HumanResources />}
//               {activeTab === 'dutyrooster' && <DutyRooster />}
//               {activeTab === 'AnnualCalender' && <AnnualCalender />}
//               {activeTab === 'tpa' && <TPA />}
//               {activeTab === 'view' && <View />}
//               {activeTab === 'view1' && <View1 />}
//               {activeTab === 'inventory' && <Inventory />}
//               {activeTab === 'reports' && <Reports />}
//               {activeTab === 'beds' && <Beds />}
//                {activeTab === 'attendance' && <Attendance />}
//                {activeTab === 'pharmacydash' && <PharmacyDash />}
//               {activeTab === 'radiodash' && <Radiodash />}
//               {activeTab === 'pathodash' && <Pathodash />}
//               {activeTab === 'accountdash' && <Accountdash />}
//               {activeTab === 'receptiondash' && <Receptiondash />}
 
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// /** helpers */
// const getBasePath = (userRole) =>
//   (userRole === 'receptionist' || userRole === 'nurse') ? `/${userRole}` :
//   ['radiologist', 'pathologist', 'pharmacist'].includes(userRole) ? '/specialist' :
//   userRole === 'doctor' ? '/doctor' :
//   userRole === 'accountant' ? '/accountant' : '/admin';

// /** Sidebar extracted so we can reuse for desktop + mobile drawer */
// function Sidebar({ activeTab, setActiveTab, handleLogout, userRole }) {
//   const basePath = getBasePath(userRole);
//   return (
//     <nav className="flex-1 p-4 overflow-y-auto space-y-1">
//       {['admin', 'super_admin', 'doctor', 'nurse'].includes(userRole) && (
//         <NavLinkItem
//           to={basePath}
//           label="Dashboard"
//           icon={faHome}
//           active={activeTab==='dashboard'}
//           onClick={() => setActiveTab('dashboard')}
//         />
//       )}
//       {userRole === 'pharmacist' && (
//         <NavLinkItem
//           to={basePath}
//           label="Pharmacy Dashboard"
//           icon={faHome}
//           active={activeTab==='pharmacydash'}
//           onClick={() => setActiveTab('pharmacydash')}
//         />
//       )}
//       {userRole === 'radiologist' && (
//         <NavLinkItem
//           to={basePath}
//           label="Radiology Dashboard"
//           icon={faHome}
//           active={activeTab==='radiodash'}
//           onClick={() => setActiveTab('radiodash')}
//         />
//       )}
 
//     {userRole === 'pathologist' && (
//         <NavLinkItem
//           to={basePath}
//           label="Pathology Dashboard"
//           icon={faHome}
//           active={activeTab==='pathodash'}
//           onClick={() => setActiveTab('pathodash')}
//         />
//       )}
//        {userRole === 'accountant' && (
//         <NavLinkItem
//           to={basePath}
//           label="Accountant Dashboard"
//           icon={faHome}
//           active={activeTab==='accountdash'}
//           onClick={() => setActiveTab('accountdash')}
//         />
//       )}
//           {userRole === 'receptionist' && (
//         <NavLinkItem
//           to={basePath}
//           label="Receptionist Dashboard"
//           icon={faHome}
//           active={activeTab==='receptiondash'}
//           onClick={() => setActiveTab('receptiondash')}
//         />
//       )}
 
//       {/* Appointments group */}
//       {['admin', 'super_admin', 'radiologist', 'pathologist', 'pharmacist', 'receptionist', 'doctor', 'nurse'].includes(userRole) && (
//         <Disclosure title="Appointments" active={activeTab==='appointments' || activeTab==='ipd'}>
//           <NavLinkItem
//             to={`${basePath}/appointments`}
//             label="OPD"
//             icon={faCalendarCheck}
//             active={activeTab==='appointments'}
//             onClick={() => setActiveTab('appointments')}
//             nested
//           />
//           <NavLinkItem
//             to="/ipd"
//             label="IPD"
//             icon={faProcedures}
//             active={activeTab==='ipd'}
//             onClick={() => setActiveTab('ipd')}
//             nested
//           />
//         </Disclosure>
//       )}

//       {/* Labs group */}
//       {(['admin', 'super_admin', 'doctor', 'nurse'].includes(userRole)) && (
//         <Disclosure title="Labs" active={activeTab==='radiology' || activeTab==='pathology'}>
//           <NavLinkItem
//             to={`${basePath}/radiology`}
//             label="Radiology"
//             icon={faXRay}
//             active={activeTab==='radiology'}
//             onClick={() => setActiveTab('radiology')}
//             nested
//           />
//           <NavLinkItem
//             to={`${basePath}/pathology`}
//             label="Pathology"
//             icon={faMicroscope}
//             active={activeTab==='pathology'}
//             onClick={() => setActiveTab('pathology')}
//             nested
//           />
//         </Disclosure>
//       )}

//       {/* Radiology for radiologist */}
//       {userRole === 'radiologist' && (
//         <NavLinkItem
//           to={`${basePath}/radiology`}
//           label="Radiology"
//           icon={faXRay}
//           active={activeTab==='radiology'}
//           onClick={() => setActiveTab('radiology')}
//         />
//       )}

//       {/* Pathology for pathologist */}
//       {userRole === 'pathologist' && (
//         <NavLinkItem
//           to={`${basePath}/pathology`}
//           label="Pathology"
//           icon={faMicroscope}
//           active={activeTab==='pathology'}
//           onClick={() => setActiveTab('pathology')}
//         />
//       )}

//       {/* Pharmacy for pharmacist */}
//       {userRole === 'pharmacist' && (
//         <NavLinkItem
//           to={`${basePath}/pharmacy`}
//           label="Pharmacy"
//           icon={faPills}
//           active={activeTab==='pharmacy'}
//           onClick={() => setActiveTab('pharmacy')}
//         />
//       )}

//       {['admin', 'super_admin', 'receptionist', 'doctor', 'accountant','radiologist','pathologist','pharmacist'].includes(userRole) && (
//         <NavLinkItem
//           to={`${basePath}/billing`}
//           label="Billing"
//           icon={faReceipt}
//           active={activeTab==='billing'}
//           onClick={() => setActiveTab('billing')}
//         />
//       )}

//       {['admin', 'super_admin', 'receptionist', 'doctor', 'accountant'].includes(userRole) && (
//         <NavLinkItem
//           to={`${basePath}/pharmacy`}
//           label="Pharmacy"
//           icon={faPills}
//           active={activeTab==='pharmacy'}
//           onClick={() => setActiveTab('pharmacy')}
//         />
//       )}
//         {['admin', 'super_admin'].includes(userRole) && (
//   <NavLinkItem
//     to={`${basePath}/attendance`}
//     label="Attendance"
//     icon={faUserClock}
//     active={activeTab === 'attendance'}
//     onClick={() => setActiveTab('attendance')}
//   />
// )}
//         {['admin', 'super_admin', 'doctor'].includes(userRole) && (
//   <NavLinkItem
//     to={`${basePath}/patientrecords`}
//     label="PatientRecords"
//     icon={faUserClock}
//     active={activeTab === 'patientrecords'}
//     onClick={() => setActiveTab('patientrecords')}
//   />
// )}


//       {['admin', 'super_admin', 'receptionist', 'doctor', 'nurse'].includes(userRole) && (
//         <NavLinkItem
//           to={`${basePath}/bloodbank`}
//           label="Blood Bank"
//           icon={faTint}
//           active={activeTab==='bloodbank'}
//           onClick={() => setActiveTab('bloodbank')}
//         />
//       )}

//       {['admin', 'super_admin', 'receptionist', 'doctor', 'nurse'].includes(userRole) && (
//         <NavLinkItem
//           to={`${basePath}/ambulance`}
//           label="Ambulance"
//           icon={faAmbulance}
//           active={activeTab==='ambulance'}
//           onClick={() => setActiveTab('ambulance')}
//         />
//       )}

//       {['admin', 'super_admin', 'receptionist', 'doctor'].includes(userRole) && (
//         <NavLinkItem
//           to={`${basePath}/frontoffice`}
//           label="Front Office"
//           icon={faDesktop}
//           active={activeTab==='frontoffice'}
//           onClick={() => setActiveTab('frontoffice')}
//         />
//       )}

//       {['admin', 'super_admin', 'receptionist', 'doctor', 'accountant'].includes(userRole) && (
//         <NavLinkItem
//           to={`${basePath}/birthdeathrecords`}
//           label="Birth & Death Records"
//           icon={faCertificate}
//           active={activeTab==='birthdeathrecords'}
//           onClick={() => setActiveTab('birthdeathrecords')}
//         />
//       )}

//       {['admin', 'super_admin'].includes(userRole) && (
//         <NavLinkItem
//           to="/admin/humanresources"
//           label="Human Resources"
//           icon={faUsers}
//           active={activeTab==='humanresources'}
//           onClick={() => setActiveTab('humanresources')}
//         />
//       )}

//       {['admin', 'super_admin', 'radiologist', 'pathologist', 'pharmacist', 'receptionist', 'doctor', 'nurse'].includes(userRole) && (
//         <NavLinkItem
//           to={`${basePath}/dutyrooster`}
//           label="Duty Rooster"
//           icon={faClipboardList}
//           active={activeTab==='dutyrooster'}
//           onClick={() => setActiveTab('dutyrooster')}
//         />
//       )}

//       {['admin', 'super_admin', 'radiologist', 'pathologist', 'pharmacist', 'receptionist', 'doctor'].includes(userRole) && (
//         <NavLinkItem
//           to={`${basePath}/AnnualCalender`}
//           label="Annual Calendar"
//           icon={faCalendarDay}
//           active={activeTab==='AnnualCalender'}
//           onClick={() => setActiveTab('AnnualCalender')}
//         />
//       )}

//       {['admin', 'super_admin', 'radiologist', 'pathologist', 'pharmacist', 'receptionist', 'doctor', 'nurse', 'accountant'].includes(userRole) && (
//         <NavLinkItem
//           to={`${basePath}/tpa`}
//           label="TPA"
//           icon={faShieldAlt}
//           active={activeTab==='tpa'}
//           onClick={() => setActiveTab('tpa')}
//         />
//       )}

//       {['admin', 'super_admin', 'radiologist', 'pathologist', 'pharmacist', 'receptionist', 'doctor', 'nurse', 'accountant'].includes(userRole) && (
//         <NavLinkItem
//           to={`${basePath}/inventory`}
//           label="Inventory"
//           icon={faBoxes}
//           active={activeTab==='inventory'}
//           onClick={() => setActiveTab('inventory')}
//         />
//       )}

//       {['admin', 'super_admin', 'doctor', 'accountant'].includes(userRole) && (
//         <NavLinkItem
//           to={`${basePath}/reports`}
//           label="Reports"
//           icon={faChartBar}
//           active={activeTab==='reports'}
//           onClick={() => setActiveTab('reports')}
//         />
//       )}

//       {['admin', 'super_admin', 'radiologist', 'pathologist', 'pharmacist', 'receptionist', 'doctor', 'nurse', 'accountant'].includes(userRole) && (
//         <NavLinkItem
//           to={`${basePath}/settings`}
//           label="Settings"
//           icon={faCog}
//           active={activeTab==='settings'}
//           onClick={() => setActiveTab('settings')}
//         />
//       )}

//       {/* View
//       {['admin', 'super_admin', 'radiologist', 'pathologist', 'pharmacist', 'receptionist', 'doctor', 'nurse', 'accountant'].includes(userRole) && (
//         <NavLinkItem
//           to={`${basePath}/view`}
//           label="View"
//           icon={faEye}
//           active={activeTab==='view'}
//           onClick={() => setActiveTab('view')}
//         />
//       )} */}

//       {/* ✅ Beds link for allowed roles */}
//       {['super_admin', 'admin', 'receptionist', 'doctor', 'nurse', 'accountant'].includes(userRole) && (
//         <NavLinkItem
//           to={`${basePath}/beds`}
//           label="Beds"
//           icon={faBed}
//           active={activeTab === 'beds'}
//           onClick={() => setActiveTab('beds')}
//         />
//       )}

//       <button
//         onClick={handleLogout}
//         className="flex items-center px-4 py-3 rounded-lg text-sm font-medium text-white hover:bg-blue-700 w-full transition-colors duration-200 mt-4"
//       >
//         <FontAwesomeIcon icon={faSignOutAlt} className="w-4 h-4 mr-3" />
//         Logout
//       </button>
//     </nav>
//   );
// }

// export default AdminDashboard;


import { useNavigate, Link, useLocation, useParams } from 'react-router-dom';
import { useState, useEffect, useMemo, useRef, useLayoutEffect } from 'react';
import Appointments from './Appointments';
import Ipd from './Ipd';
import Radiology from './Radiology';
import Pathology from './Pathology';
import Dashboard from './Dashboard';
import Billing from './Billing';
import Pharmacy from './Pharmacy';
import BloodBank from './BloodBank';
import Ambulance from './Ambulance';
import FrontOffice from './FrontOffice';
import BirthDeathRecords from './BirthDeathRecords';
import HumanResources from './HumanResources';
import DutyRooster from './DutyRooster';
import AnnualCalender from './AnnualCalender';
import TPA from './TPA';
import Inventory from './Inventory';
import Reports from './Reports';
import Settings from './Settings';
import View from './View';
import Beds from './Beds';
import Radiodash from './Radiodash';
import PharmacyDash from './Pharmacydash';
import Pathodash from './Pathodash';
import Accountdash from './Accountdash';
import Receptiondash from './Receptiondash';
import PatientRecords from './PatientRecords';
// import DemoBookings from './DemoBookings'; // NEW PAGE
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Attendance from './Attendance';
import { faUserClock } from '@fortawesome/free-solid-svg-icons';

import {
  faBed,
  faCalendarAlt,
  faBell,
  faSearch,
  faSignOutAlt,
  faUserCircle,
  faTimes,
  faBars,
  faChevronDown,
  faChevronUp,
  faHome,
  faCalendarCheck,
  faProcedures,
  faXRay,
  faMicroscope,
  faReceipt,
  faPills,
  faTint,
  faAmbulance,
  faDesktop,
  faCertificate,
  faUsers,
  faClipboardList,
  faCalendarDay,
  faShieldAlt,
  faBoxes,
  faChartBar,
  faCog,
  faEye,
  faUser,
  faFileExcel,
  faFileAlt,               // NEW: TXT icon
} from "@fortawesome/free-solid-svg-icons";
import View1 from './View1';
import logo1 from '../assets/img/hmslogo.png'


/* ---------------- Add: match Login's obfuscation helpers ---------------- */
const OBFUSCATION_KEY = 'vaidya_demo_key';
const deobfuscate = (encStr) => {
  try {
    const s = atob(encStr || '');
    let x = '';
    for (let i = 0; i < s.length; i++) {
      x += String.fromCharCode(s.charCodeAt(i) ^ OBFUSCATION_KEY.charCodeAt(i % OBFUSCATION_KEY.length));
    }
    return x;
  } catch {
    return '';
  }
};
/* ----------------------------------------------------------------------- */

/* ---------------- Disclosure Component for Dropdowns ---------------- */
function Disclosure({ title, children, active }) {
  const [isOpen, setIsOpen] = useState(active);
  return (
    <div className="space-y-1">
      <button
        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-blue-700 ${active ? 'bg-blue-700' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          {title}
        </div>
        <FontAwesomeIcon
          icon={isOpen ? faChevronUp : faChevronDown}
          className="w-3 h-3 transition-transform duration-200"
        />
      </button>
      {isOpen && <div className="space-y-1 pl-2 border-l border-blue-600 ml-3 mt-1">{children}</div>}
    </div>
  );
}

/* ---------------- NavLinkItem Component ---------------- */
function NavLinkItem({ to, label, icon, active, onClick, nested = false }) {
  return (
    <Link
      to={to}
      className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-blue-700 ${active ? 'bg-blue-700' : ''} ${nested ? 'pl-8' : ''}`}
      onClick={onClick}
    >
      <FontAwesomeIcon icon={icon} className="w-4 h-4 mr-3" />
      {label}
    </Link>
  );
}

/* ========================================================================= */

const AdminDashboard = ({ initialTab = 'dashboard' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id, name } = useParams();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [isAppointmentDropdownOpen, setIsAppointmentDropdownOpen] = useState(false);
  const [isTestDropdownOpen, setIsTestDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 🔔 Sample notifications (with unread flags)
  const [notifications, setNotifications] = useState([
    { id: 101, message: 'New appointment request (OPD)', time: '10 mins ago', read: false, type: 'opd' },
    { id: 102, message: 'Radiology report uploaded for P1302', time: '22 mins ago', read: false, type: 'radiology' },
    { id: 103, message: 'IPD bed allocated (Private Ward TF-104)', time: '1 hour ago', read: true, type: 'ipd' },
    { id: 104, message: 'Ambulance dispatched to Sector 9', time: '2 hours ago', read: false, type: 'ambulance' },
    { id: 105, message: 'Pharmacy bill pending payment (PH-9002)', time: '3 hours ago', read: true, type: 'pharmacy' },
  ]);

  // Get user role from localStorage
  const userRole = localStorage.getItem('userRole') || 'admin';

  // --- SCROLL FIX ---
  const contentRef = useRef(null);
  useLayoutEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
    window.scrollTo(0, 0);
  }, [location.pathname, activeTab, name]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [name]);

  useEffect(() => {
     if (userRole === 'pharmacist' && location.pathname === '/specialist') {
      setActiveTab('pharmacydash');
    } else if (userRole === 'radiologist' && location.pathname === '/specialist') {
      setActiveTab('radiodash');
      } else if (userRole === 'pathologist' && location.pathname === '/specialist') {
      setActiveTab('pathodash');
       } else if (userRole === 'accountant' && location.pathname === '/accountant') {
      setActiveTab('accountdash');
         } else if (userRole === 'receptionist' && location.pathname === '/receptionist') {
      setActiveTab('receptiondash');
     } else if (location.pathname === '/admin/appointments' ||
        location.pathname === '/specialist/appointments' ||
        location.pathname === '/receptionist/appointments' ||
        location.pathname === '/doctor/appointments' ||
        location.pathname === '/nurse/appointments' ||
        location.pathname === '/accountant/appointments') setActiveTab('appointments');
    else if (location.pathname === '/ipd') setActiveTab('ipd');
    else if (location.pathname === '/admin/radiology' ||
             location.pathname === '/specialist/radiology' ||
             location.pathname === '/doctor/radiology' ||
             location.pathname === '/nurse/radiology' ||
             location.pathname === '/accountant/radiology') setActiveTab('radiology');
    else if (location.pathname === '/admin/pathology' ||
             location.pathname === '/specialist/pathology' ||
             location.pathname === '/doctor/pathology' ||
             location.pathname === '/nurse/pathology' ||
             location.pathname === '/accountant/pathology') setActiveTab('pathology');
    else if (location.pathname === '/admin' ||
             location.pathname === '/specialist' ||
             location.pathname === '/receptionist' ||
             location.pathname === '/doctor' ||
             location.pathname === '/nurse' ||
             location.pathname === '/accountant') setActiveTab('dashboard');
    else if (location.pathname.startsWith('/view/')) setActiveTab('view');
    else if (location.pathname.startsWith('/view1/')) setActiveTab('view1');

    else if (
             location.pathname === '/specialist/billing' ||
             location.pathname === '/receptionist/billing' ||
             location.pathname === '/doctor/billing' ||
             location.pathname === '/nurse/billing' ||
             location.pathname === '/accountant/billing') setActiveTab('billing');
    else if (location.pathname === '/admin/pharmacy' ||
             location.pathname === '/specialist/pharmacy' ||
             location.pathname === '/receptionist/pharmacy' ||
             location.pathname === '/doctor/pharmacy' ||
             location.pathname === '/nurse/pharmacy' ||
             location.pathname === '/accountant/pharmacy') setActiveTab('pharmacy');
    else if (location.pathname === '/admin/bloodbank' ||
             location.pathname === '/receptionist/bloodbank' ||
             location.pathname === '/doctor/bloodbank' ||
             location.pathname === '/nurse/bloodbank' ||
             location.pathname === '/accountant/bloodbank') setActiveTab('bloodbank');
    else if (location.pathname === '/admin/ambulance' ||
             location.pathname === '/receptionist/ambulance' ||
             location.pathname === '/doctor/ambulance' ||
             location.pathname === '/nurse/ambulance' ||
             location.pathname === '/accountant/ambulance') setActiveTab('ambulance');
    else if (location.pathname === '/admin/frontoffice' ||
             location.pathname === '/receptionist/frontoffice' ||
             location.pathname === '/doctor/frontoffice' ||
             location.pathname === '/nurse/frontoffice' ||
             location.pathname === '/accountant/frontoffice') setActiveTab('frontoffice');
    else if (location.pathname === '/admin/birthdeathrecords' ||
             location.pathname === '/receptionist/birthdeathrecords' ||
             location.pathname === '/doctor/birthdeathrecords' ||
             location.pathname === '/nurse/birthdeathrecords' ||
             location.pathname === '/accountant/birthdeathrecords') setActiveTab('birthdeathrecords');
    else if (location.pathname === '/admin/humanresources' ||
             location.pathname === '/accountant/humanresources') setActiveTab('humanresources');
    else if (location.pathname === '/admin/dutyrooster' ||
             location.pathname === '/specialist/dutyrooster' ||
             location.pathname === '/receptionist/dutyrooster' ||
             location.pathname === '/doctor/dutyrooster' ||
             location.pathname === '/nurse/dutyrooster' ||
             location.pathname === '/accountant/dutyrooster') setActiveTab('dutyrooster');
    else if (location.pathname === '/admin/AnnualCalender' ||
             location.pathname === '/specialist/AnnualCalender' ||
             location.pathname === '/receptionist/AnnualCalender' ||
             location.pathname === '/doctor/AnnualCalender' ||
             location.pathname === '/nurse/AnnualCalender' ||
             location.pathname === '/accountant/AnnualCalender') setActiveTab('AnnualCalender');
    else if (location.pathname === '/admin/tpa' ||
             location.pathname === '/specialist/tpa' ||
             location.pathname === '/receptionist/tpa' ||
             location.pathname === '/doctor/tpa' ||
             location.pathname === '/nurse/tpa' ||
             location.pathname === '/accountant/tpa') setActiveTab('tpa');
    else if (location.pathname === '/admin/inventory' ||
             location.pathname === '/specialist/inventory' ||
             location.pathname === '/receptionist/inventory' ||
             location.pathname === '/doctor/inventory' ||
             location.pathname === '/nurse/inventory' ||
             location.pathname === '/accountant/inventory') setActiveTab('inventory');
    else if (location.pathname === '/admin/reports' ||
             location.pathname === '/doctor/reports' ||
             location.pathname === '/accountant/reports') setActiveTab('reports');
    else if (location.pathname === '/admin/settings' ||
             location.pathname === '/specialist/settings' ||
             location.pathname === '/receptionist/settings' ||
             location.pathname === '/doctor/settings' ||
             location.pathname === '/nurse/settings' ||
             location.pathname === '/accountant/settings') setActiveTab('settings');
    else if (location.pathname === '/admin/attendance') setActiveTab('attendance');
    else if (location.pathname === '/admin/patientrecords') setActiveTab('patientrecords');
    // else if (location.pathname === '/admin/demobookings') setActiveTab('demobookings'); // NEW
    // ✅ Beds routes
    else if (location.pathname === '/admin/beds' ||
             location.pathname === '/receptionist/beds' ||
             location.pathname === '/doctor/beds' ||
             location.pathname === '/nurse/beds' ||
             location.pathname === '/accountant/beds') setActiveTab('beds');

  }, [location.pathname, userRole]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  const toggleProfileDropdown = () => setIsProfileDropdownOpen((v) => !v);
  const toggleSidebar = () => setIsSidebarOpen((s) => !s);
  const toggleNotifications = () => setIsNotificationOpen((v) => !v);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  const markNotificationAsRead = (nid) => {
    setNotifications((prev) => prev.map(n => n.id === nid ? { ...n, read: true } : n));
  };
  const markAllAsRead = () => setNotifications((prev) => prev.map(n => ({ ...n, read: true })));
  const clearNotifications = () => setNotifications([]);

  const unreadNotificationsCount = useMemo(
    () => notifications.filter(n => !n.read).length,
    [notifications]
  );

  const showCalendar = () => navigate(getBasePath(userRole) + '/AnnualCalender');
  const goToBeds = () => navigate(getBasePath(userRole) + '/beds');

  // role-based access
  const radiologistAllowedTabs = ['appointments', 'ipd', 'radiology', 'radiodash', 'billing', 'dutyrooster', 'AnnualCalender', 'tpa', 'inventory', 'settings', 'view','view1'];
  const pathologistAllowedTabs = ['appointments', 'ipd', 'pathology', 'pathodash', 'billing', 'dutyrooster', 'AnnualCalender', 'tpa', 'inventory', 'settings', 'view','view1'];
  const pharmacistAllowedTabs = ['appointments', 'ipd', 'billing', 'pharmacy', 'pharmacydash', 'dutyrooster', 'AnnualCalender', 'tpa', 'inventory', 'settings', 'view','view1'];
  const receptionistAllowedTabs = ['receptiondash', 'appointments', 'ipd', 'billing', 'pharmacy', 'bloodbank', 'ambulance', 'frontoffice', 'birthdeathrecords', 'dutyrooster', 'AnnualCalender', 'tpa', 'inventory', 'settings', 'view','view1', 'beds'];
  const doctorAllowedTabs = ['dashboard', 'appointments', 'billing', 'patientrecords','ipd', 'radiology', 'ambulance', 'pathology', 'pharmacy', 'tpa', 'inventory', 'bloodbank', 'frontoffice', 'birthdeathrecords', 'dutyrooster', 'AnnualCalender', 'reports', 'settings', 'view','view1', 'beds'];
  const accountantAllowedTabs = ['accountdash', 'billing', 'pharmacy', 'birthdeathrecords', 'inventory', 'reports', 'tpa', 'settings', 'view','view1', 'beds'];
  const nurseAllowedTabs = ['dashboard', 'appointments', 'ipd', 'radiology', 'pathology', 'bloodbank', 'ambulance', 'dutyrooster', 'inventory', 'settings','tpa', 'view','view1', 'beds'];

  const bedsTopBarAllowed = ['super_admin','admin','receptionist','doctor','nurse','accountant'];

  /* ---------- Excel download (exports localStorage demoBookings) ---------- */
  const downloadDemoBookingsExcel = () => {
    try {
      const raw = localStorage.getItem('demoBookings');
      const decoded = raw ? deobfuscate(raw) : '';
      const data = decoded ? JSON.parse(decoded) : [];

      const headers = [
        'ID','Person Name','Clinic/Hospital','Location','Contact','Email','Slot','Date','Time','Created At'
      ];

      const csvRows = [];
      csvRows.push(headers.join(','));

      const escapeCell = (val) => {
        if (val === null || val === undefined) return '';
        const s = String(val).replace(/"/g, '""');
        return /[",\n]/.test(s) ? `"${s}"` : s;
      };

      data.forEach(row => {
        const line = [
          row.id,
          row.name,
          row.clinicOrHospital,
          row.location,
          row.contact,
          row.email,
          row.slot,
          row.date,
          row.time,
          row.createdAt
        ].map(escapeCell).join(',');
        csvRows.push(line);
      });

      const csvString = csvRows.join('\n');
      const blob = new Blob([csvString], {
        type: 'application/vnd.ms-excel;charset=utf-8;'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const today = new Date().toISOString().slice(0,10);
      a.href = url;
      a.download = `demo_bookings_${today}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Export failed:', e);
      alert('Could not export demo bookings.');
    }
  };

  /* ---------- TXT download (all bookings in one .txt) ---------- */
  const downloadDemoBookingsTxt = () => {
    try {
      const raw = localStorage.getItem('demoBookings');
      const decoded = raw ? deobfuscate(raw) : '';
      const data = decoded ? JSON.parse(decoded) : [];

      if (!Array.isArray(data) || data.length === 0) {
        alert('No demo bookings found.');
        return;
      }

      const blocks = data.map((b, idx) =>
        [
          `### BOOKING #${idx + 1}`,
          `ID           : ${b.id || "-"}`,
          `Name         : ${b.name || "-"}`,
          `Clinic/Hosp. : ${b.clinicOrHospital || "-"}`,
          `Location     : ${b.location || "-"}`,
          `Contact      : ${b.contact || "-"}`,
          `Email        : ${b.email || "-"}`,
          `Slot         : ${b.slot || "-"}`,
          `Date         : ${b.date || "-"}`,
          `Time         : ${b.time || "-"}`,
          `Created At   : ${b.createdAt || "-"}`,
        ].join('\n')
      );

      const text = blocks.join('\n\n------------------------------\n\n') + '\n';
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const today = new Date().toISOString().slice(0,10);
      a.href = url;
      a.download = `demo_bookings_${today}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('TXT export failed:', e);
      alert('Could not export TXT.');
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">

      {/* Top Bar */}
      <div className="bg-white shadow-sm sticky top-0 z-40 border-b border-gray-200">
        <div className="py-3 px-4 sm:px-6 flex items-center gap-3">
          {/* Hamburger (mobile) */}
          <button
            className="lg:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
            onClick={toggleSidebar}
            aria-label="Open sidebar"
          >
            <FontAwesomeIcon icon={faBars} className="h-5 w-5" />
          </button>

          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <div className="mr-2 sm:mr-3 flex items-center justify-center">
              <img 
                src={logo1} 
                alt="HMS Logo" 
                className="h-10 w-20 sm:h-12 sm:w-12 md:h-14 md:w-14 object-contain"
              />
            </div>

            <div className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">
              Vaidhya Narayan {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Search */}
          <div className="hidden sm:block w-full max-w-xl">
            <form onSubmit={handleSearch} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faSearch} className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search patients, appointments, reports..."
                className="w-full py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50 transition-colors duration-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          {/* RIGHT CLUSTER */}
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            {/* Beds quick nav */}
            {bedsTopBarAllowed.includes(userRole) && (
              <button
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200 p-2 rounded-full hover:bg-blue-50"
                onClick={goToBeds}
                title="Bed Status"
              >
                <FontAwesomeIcon icon={faBed} className="h-5 w-5" />
              </button>
            )}

            {/* Calendar */}
            <button
              className="text-gray-600 hover:text-blue-600 transition-colors duration-200 p-2 rounded-full hover:bg-blue-50"
              onClick={showCalendar}
              title="Annual Calendar"
            >
              <FontAwesomeIcon icon={faCalendarAlt} className="h-5 w-5" />
            </button>

            {/* Excel Download (super_admin only) */}
            {userRole === 'super_admin' && (
              <button
                className="text-green-600 hover:text-green-700 transition-colors duration-200 p-2 rounded-full hover:bg-green-50"
                onClick={downloadDemoBookingsExcel}
                title="Download Demo Bookings (Excel)"
                aria-label="Download Excel"
              >
                <FontAwesomeIcon icon={faFileExcel} className="h-5 w-5" />
              </button>
            )}

            {/* TXT Download (super_admin only) */}
            {userRole === 'super_admin' && (
              <button
                className="text-blue-600 hover:text-blue-700 transition-colors duration-200 p-2 rounded-full hover:bg-blue-50"
                onClick={downloadDemoBookingsTxt}
                title="Download Demo Bookings (TXT)"
                aria-label="Download TXT"
              >
                <FontAwesomeIcon icon={faFileAlt} className="h-5 w-5" />
              </button>
            )}

            {/* Notifications */}
            <div className="relative">
              <button
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200 p-2 rounded-full hover:bg-blue-50 relative"
                onClick={toggleNotifications}
                aria-haspopup="true"
                aria-expanded={isNotificationOpen}
                title="Notifications"
              >
                <FontAwesomeIcon icon={faBell} className="h-5 w-5" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center text-[10px] font-medium">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200 animate-notify-in">
                  <div className="px-4 py-2 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800 text-sm">Notifications</h3>
                    <div className="flex items-center gap-2">
                      <button onClick={markAllAsRead} className="text-xs text-blue-600 hover:underline font-medium">Mark all read</button>
                      <button onClick={clearNotifications} className="text-xs text-red-600 hover:underline font-medium">Clear</button>
                    </div>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((n, i) => (
                        <div
                          key={n.id}
                          className={`px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-start gap-3 ${!n.read ? 'bg-blue-50' : ''} animate-fade-in transition-colors duration-200`}
                          style={{ animationDelay: `${i * 40}ms` }}
                          onClick={() => markNotificationAsRead(n.id)}
                        >
                          <span className={`mt-1.5 flex-shrink-0 h-2.5 w-2.5 rounded-full ${n.read ? 'bg-gray-300' : 'bg-blue-500'}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-800 truncate">{n.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{n.time}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="px-4 py-6 text-sm text-gray-500 text-center">No notifications</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Super_User (Profile) */}
            <div className="relative">
              <button
                className="flex items-center space-x-2 focus:outline-none p-1 rounded-full hover:bg-blue-50 transition-colors duration-200"
                onClick={toggleProfileDropdown}
                title="Super User"
              >
                <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-gradient-to-r from-blue-700 to-blue-600 flex items-center justify-center text-white font-semibold shadow-sm">
                  {userRole.substring(0,2).toUpperCase()}
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-sm font-medium text-gray-700">Super User</p>
                  <p className="text-xs text-gray-500">{userRole}</p>
                </div>
              </button>
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm text-gray-800 font-medium">Super User</p>
                    <p className="text-xs text-gray-500">{userRole}@example.com</p>
                  </div>
                  <Link
                    to={`/${['radiologist','pathologist','pharmacist','receptionist','nurse','accountant'].includes(userRole) ? userRole : 'admin'}/profile`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 flex items-center"
                  >
                    <FontAwesomeIcon icon={faUser} className="w-4 h-4 mr-2" />
                    Your Profile
                  </Link>
                  <div className="border-t border-gray-100" />
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 flex items-center"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="w-4 h-4 mr-2" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        .animate-notify-in { animation: notifyIn .18s ease-out both; }
        @keyframes notifyIn { from { opacity: .2; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn .28s ease both; }
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
      `}</style>

      <div className="flex flex-1 min-h-0">

        {/* Sidebar (desktop) */}
        <div className="hidden lg:flex w-64 bg-gradient-to-b from-blue-800 to-blue-900 text-white flex-col flex-shrink-0 shadow-lg overflow-y-auto min-h-0 [-webkit-overflow-scrolling:touch]">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} handleLogout={handleLogout} userRole={userRole} />
        </div>

        {/* Sidebar (mobile drawer) */}
        {isSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/50" onClick={() => setIsSidebarOpen(false)} aria-hidden="true" />
            <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] h-full bg-gradient-to-b from-blue-800 to-blue-900 text-white shadow-2xl flex flex-col overflow-y-auto min-h-0 [-webkit-overflow-scrolling:touch]">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <span className="font-semibold">Menu</span>
                <button className="rounded-md p-2 hover:bg-white/10 transition-colors duration-200" onClick={() => setIsSidebarOpen(false)} aria-label="Close sidebar">
                  <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <Sidebar
                  activeTab={activeTab}
                  setActiveTab={(t) => { setActiveTab(t); setIsSidebarOpen(false); }}
                  handleLogout={() => { setIsSidebarOpen(false); handleLogout(); }}
                  userRole={userRole}
                />
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div
          ref={contentRef}
          className="flex-1 p-4 sm:p-6 overflow-y-auto overflow-x-hidden bg-gray-50 min-w-0 min-h-0 [-webkit-overflow-scrolling:touch]"
        >
          {(['admin', 'super_admin'].includes(userRole) ||
             (userRole === 'radiologist' && radiologistAllowedTabs.includes(activeTab)) ||
             (userRole === 'pathologist' && pathologistAllowedTabs.includes(activeTab)) ||
             (userRole === 'pharmacist' && pharmacistAllowedTabs.includes(activeTab)) ||
             (userRole === 'receptionist' && receptionistAllowedTabs.includes(activeTab)) ||
             (userRole === 'doctor' && doctorAllowedTabs.includes(activeTab)) ||
             (userRole === 'nurse' && nurseAllowedTabs.includes(activeTab)) ||
             (userRole === 'accountant' && accountantAllowedTabs.includes(activeTab))) && (
            <>
              {activeTab === 'dashboard' && <Dashboard />}
              {activeTab === 'appointments' && <Appointments />}
              {activeTab === 'ipd' && <Ipd />}
              {activeTab === 'patientrecords' && <PatientRecords />}
              {activeTab === 'radiology' && <Radiology />}
              {activeTab === 'pathology' && <Pathology />}
              {activeTab === 'billing' && <Billing />}
              {activeTab === 'pharmacy' && <Pharmacy />}
              {activeTab === 'settings' && <Settings />}
              {activeTab === 'bloodbank' && <BloodBank />}
              {activeTab === 'ambulance' && <Ambulance />}
              {activeTab === 'frontoffice' && <FrontOffice />}
              {activeTab === 'birthdeathrecords' && <BirthDeathRecords />}
              {activeTab === 'humanresources' && <HumanResources />}
              {activeTab === 'dutyrooster' && <DutyRooster />}
              {activeTab === 'AnnualCalender' && <AnnualCalender />}
              {activeTab === 'tpa' && <TPA />}
              {activeTab === 'view' && <View />}
              {activeTab === 'view1' && <View1 />}
              {activeTab === 'inventory' && <Inventory />}
              {activeTab === 'reports' && <Reports />}
              {activeTab === 'beds' && <Beds />}
              {activeTab === 'attendance' && <Attendance />}
              {activeTab === 'pharmacydash' && <PharmacyDash />}
              {activeTab === 'radiodash' && <Radiodash />}
              {activeTab === 'pathodash' && <Pathodash />}
              {activeTab === 'accountdash' && <Accountdash />}
              {activeTab === 'receptiondash' && <Receptiondash />}

              {/* NEW: Demo Bookings TXT page */}
              {/* {activeTab === 'demobookings' && <DemoBookings />} */}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/** helpers */
const getBasePath = (userRole) =>
  (userRole === 'receptionist' || userRole === 'nurse') ? `/${userRole}` :
  ['radiologist', 'pathologist', 'pharmacist'].includes(userRole) ? '/specialist' :
  userRole === 'doctor' ? '/doctor' :
  userRole === 'accountant' ? '/accountant' : '/admin';

/** Sidebar extracted so we can reuse for desktop + mobile drawer */
function Sidebar({ activeTab, setActiveTab, handleLogout, userRole }) {
  const basePath = getBasePath(userRole);
  return (
    <nav className="flex-1 p-4 overflow-y-auto space-y-1">
      {['admin', 'super_admin', 'doctor', 'nurse'].includes(userRole) && (
        <NavLinkItem
          to={basePath}
          label="Dashboard"
          icon={faHome}
          active={activeTab==='dashboard'}
          onClick={() => setActiveTab('dashboard')}
        />
      )}
      {userRole === 'pharmacist' && (
        <NavLinkItem
          to={basePath}
          label="Pharmacy Dashboard"
          icon={faHome}
          active={activeTab==='pharmacydash'}
          onClick={() => setActiveTab('pharmacydash')}
        />
      )}
      {userRole === 'radiologist' && (
        <NavLinkItem
          to={basePath}
          label="Radiology Dashboard"
          icon={faHome}
          active={activeTab==='radiodash'}
          onClick={() => setActiveTab('radiodash')}
        />
      )}

      {userRole === 'pathologist' && (
        <NavLinkItem
          to={basePath}
          label="Pathology Dashboard"
          icon={faHome}
          active={activeTab==='pathodash'}
          onClick={() => setActiveTab('pathodash')}
        />
      )}
      {userRole === 'accountant' && (
        <NavLinkItem
          to={basePath}
          label="Accountant Dashboard"
          icon={faHome}
          active={activeTab==='accountdash'}
          onClick={() => setActiveTab('accountdash')}
        />
      )}
      {userRole === 'receptionist' && (
        <NavLinkItem
          to={basePath}
          label="Receptionist Dashboard"
          icon={faHome}
          active={activeTab==='receptiondash'}
          onClick={() => setActiveTab('receptiondash')}
        />
      )}

      {/* Appointments group */}
      {['admin', 'super_admin', 'radiologist', 'pathologist', 'pharmacist', 'receptionist', 'doctor', 'nurse'].includes(userRole) && (
        <Disclosure title="Appointments" active={activeTab==='appointments' || activeTab==='ipd'}>
          <NavLinkItem
            to={`${basePath}/appointments`}
            label="OPD"
            icon={faCalendarCheck}
            active={activeTab==='appointments'}
            onClick={() => setActiveTab('appointments')}
            nested
          />
          <NavLinkItem
            to="/ipd"
            label="IPD"
            icon={faProcedures}
            active={activeTab==='ipd'}
            onClick={() => setActiveTab('ipd')}
            nested
          />
        </Disclosure>
      )}

      {/* Labs group */}
      {(['admin', 'super_admin', 'doctor', 'nurse'].includes(userRole)) && (
        <Disclosure title="Labs" active={activeTab==='radiology' || activeTab==='pathology'}>
          <NavLinkItem
            to={`${basePath}/radiology`}
            label="Radiology"
            icon={faXRay}
            active={activeTab==='radiology'}
            onClick={() => setActiveTab('radiology')}
            nested
          />
          <NavLinkItem
            to={`${basePath}/pathology`}
            label="Pathology"
            icon={faMicroscope}
            active={activeTab==='pathology'}
            onClick={() => setActiveTab('pathology')}
            nested
          />
        </Disclosure>
      )}

      {/* Radiology for radiologist */}
      {userRole === 'radiologist' && (
        <NavLinkItem
          to={`${basePath}/radiology`}
          label="Radiology"
          icon={faXRay}
          active={activeTab==='radiology'}
          onClick={() => setActiveTab('radiology')}
        />
      )}

      {/* Pathology for pathologist */}
      {userRole === 'pathologist' && (
        <NavLinkItem
          to={`${basePath}/pathology`}
          label="Pathology"
          icon={faMicroscope}
          active={activeTab==='pathology'}
          onClick={() => setActiveTab('pathology')}
        />
      )}

      {/* Pharmacy for pharmacist */}
      {userRole === 'pharmacist' && (
        <NavLinkItem
          to={`${basePath}/pharmacy`}
          label="Pharmacy"
          icon={faPills}
          active={activeTab==='pharmacy'}
          onClick={() => setActiveTab('pharmacy')}
        />
      )}

      {['admin', 'super_admin', 'receptionist', 'doctor', 'accountant','radiologist','pathologist','pharmacist'].includes(userRole) && (
        <NavLinkItem
          to={`${basePath}/billing`}
          label="Billing"
          icon={faReceipt}
          active={activeTab==='billing'}
          onClick={() => setActiveTab('billing')}
        />
      )}

      {['admin', 'super_admin', 'receptionist', 'doctor', 'accountant'].includes(userRole) && (
        <NavLinkItem
          to={`${basePath}/pharmacy`}
          label="Pharmacy"
          icon={faPills}
          active={activeTab==='pharmacy'}
          onClick={() => setActiveTab('pharmacy')}
        />
      )}
      {['admin', 'super_admin'].includes(userRole) && (
        <NavLinkItem
          to={`${basePath}/attendance`}
          label="Attendance"
          icon={faUserClock}
          active={activeTab === 'attendance'}
          onClick={() => setActiveTab('attendance')}
        />
      )}
      {['admin', 'super_admin', 'doctor'].includes(userRole) && (
        <NavLinkItem
          to={`${basePath}/patientrecords`}
          label="PatientRecords"
          icon={faUserClock}
          active={activeTab === 'patientrecords'}
          onClick={() => setActiveTab('patientrecords')}
        />
      )}

      {/* NEW: Demo Bookings page (TXT/Excel) */}
      {/* {['admin', 'super_admin'].includes(userRole) && (
        <NavLinkItem
          to={`${basePath}/demobookings`}
          label="Demo Bookings"
          icon={faClipboardList}
          active={activeTab === 'demobookings'}
          onClick={() => setActiveTab('demobookings')}
        />
      )} */}

      {['admin', 'super_admin', 'receptionist', 'doctor', 'nurse'].includes(userRole) && (
        <NavLinkItem
          to={`${basePath}/bloodbank`}
          label="Blood Bank"
          icon={faTint}
          active={activeTab==='bloodbank'}
          onClick={() => setActiveTab('bloodbank')}
        />
      )}

      {['admin', 'super_admin', 'receptionist', 'doctor', 'nurse'].includes(userRole) && (
        <NavLinkItem
          to={`${basePath}/ambulance`}
          label="Ambulance"
          icon={faAmbulance}
          active={activeTab==='ambulance'}
          onClick={() => setActiveTab('ambulance')}
        />
      )}

      {['admin', 'super_admin', 'receptionist', 'doctor'].includes(userRole) && (
        <NavLinkItem
          to={`${basePath}/frontoffice`}
          label="Front Office"
          icon={faDesktop}
          active={activeTab==='frontoffice'}
          onClick={() => setActiveTab('frontoffice')}
        />
      )}

      {['admin', 'super_admin', 'receptionist', 'doctor', 'accountant'].includes(userRole) && (
        <NavLinkItem
          to={`${basePath}/birthdeathrecords`}
          label="Birth & Death Records"
          icon={faCertificate}
          active={activeTab==='birthdeathrecords'}
          onClick={() => setActiveTab('birthdeathrecords')}
        />
      )}

      {['admin', 'super_admin'].includes(userRole) && (
        <NavLinkItem
          to="/admin/humanresources"
          label="Human Resources"
          icon={faUsers}
          active={activeTab==='humanresources'}
          onClick={() => setActiveTab('humanresources')}
        />
      )}

      {['admin', 'super_admin', 'radiologist', 'pathologist', 'pharmacist', 'receptionist', 'doctor', 'nurse'].includes(userRole) && (
        <NavLinkItem
          to={`${basePath}/dutyrooster`}
          label="Duty Rooster"
          icon={faClipboardList}
          active={activeTab==='dutyrooster'}
          onClick={() => setActiveTab('dutyrooster')}
        />
      )}

      {['admin', 'super_admin', 'radiologist', 'pathologist', 'pharmacist', 'receptionist', 'doctor'].includes(userRole) && (
        <NavLinkItem
          to={`${basePath}/AnnualCalender`}
          label="Annual Calendar"
          icon={faCalendarDay}
          active={activeTab==='AnnualCalender'}
          onClick={() => setActiveTab('AnnualCalender')}
        />
      )}

      {['admin', 'super_admin', 'radiologist', 'pathologist', 'pharmacist', 'receptionist', 'doctor', 'nurse', 'accountant'].includes(userRole) && (
        <NavLinkItem
          to={`${basePath}/tpa`}
          label="TPA"
          icon={faShieldAlt}
          active={activeTab==='tpa'}
          onClick={() => setActiveTab('tpa')}
        />
      )}

      {['admin', 'super_admin', 'radiologist', 'pathologist', 'pharmacist', 'receptionist', 'doctor', 'nurse', 'accountant'].includes(userRole) && (
        <NavLinkItem
          to={`${basePath}/inventory`}
          label="Inventory"
          icon={faBoxes}
          active={activeTab==='inventory'}
          onClick={() => setActiveTab('inventory')}
        />
      )}

      {['admin', 'super_admin', 'doctor', 'accountant'].includes(userRole) && (
        <NavLinkItem
          to={`${basePath}/reports`}
          label="Reports"
          icon={faChartBar}
          active={activeTab==='reports'}
          onClick={() => setActiveTab('reports')}
        />
      )}

      {['admin', 'super_admin', 'radiologist', 'pathologist', 'pharmacist', 'receptionist', 'doctor', 'nurse', 'accountant'].includes(userRole) && (
        <NavLinkItem
          to={`${basePath}/settings`}
          label="Settings"
          icon={faCog}
          active={activeTab==='settings'}
          onClick={() => setActiveTab('settings')}
        />
      )}

      {/* ✅ Beds link for allowed roles */}
      {['super_admin', 'admin', 'receptionist', 'doctor', 'nurse', 'accountant'].includes(userRole) && (
        <NavLinkItem
          to={`${basePath}/beds`}
          label="Beds"
          icon={faBed}
          active={activeTab === 'beds'}
          onClick={() => setActiveTab('beds')}
        />
      )}

      <button
        onClick={handleLogout}
        className="flex items-center px-4 py-3 rounded-lg text-sm font-medium text-white hover:bg-blue-700 w-full transition-colors duration-200 mt-4"
      >
        <FontAwesomeIcon icon={faSignOutAlt} className="w-4 h-4 mr-3" />
        Logout
      </button>
    </nav>
  );
}

export default AdminDashboard;
