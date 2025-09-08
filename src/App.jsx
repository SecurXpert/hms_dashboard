// import React from 'react';
// import { Route, Routes } from "react-router-dom";
// import Login from './pages/Login';
// import Home from './components/Home';
// import AdminDashboard from './pages/AdminDashboard';
// import ProtectedRoute from './components/ProtectedRoute';
// import Dashboard from './pages/Dashboard';
// import Billing from './pages/Billing';
// import Pharmacy from './pages/Pharmacy';
// import BloodBank from './pages/BloodBank';
// import Ambulance from './pages/Ambulance';
// import FrontOffice from './pages/FrontOffice';
// import BirthDeathRecords from './pages/BirthDeathRecords';
// import HumanResources from './pages/HumanResources';
// import DutyRooster from './pages/DutyRooster';
// import AnnualCalender from './pages/AnnualCalender';
// import TPA from './pages/TPA';
// import Inventory from './pages/Inventory';
// import Settings from './pages/Settings';
// import Reports from './pages/Reports';
// import LandingPage from './pages/LandingPage';
// import Beds from './pages/Beds';
// // import Sample from './pages/Sample';
 
// function App() {
//   return (
//     <div>
//       <Routes>
//         {/* Public Routes */}
//         <Route path="/" element={<Login />} />
//         <Route path="/login" element={<Login />} />
//         <Route path='/landingpage' element={<LandingPage />} />
 
//         {/* Common Home */}
//         <Route path="/home" element={
//           <ProtectedRoute>
//             <Home />
//           </ProtectedRoute>
//         } />
 
//          <Route path="/view/:id" element={
//           <ProtectedRoute>
//             <AdminDashboard initialTab="view" />
//            </ProtectedRoute>
//         } />
//           <Route path="/admin/attendance" element={
//           <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
//             <AdminDashboard initialTab="attendance" />
//           </ProtectedRoute>
//         } />
        
//         {/* ================= ADMIN ================= */}
//         <Route path="/admin" element={
//           <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
//             <AdminDashboard />
//           </ProtectedRoute>
//         } />
//         <Route path="/admin/dashboard" element={
//           <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
//             <AdminDashboard initialTab="dashboard" />
//           </ProtectedRoute>
//         } />
//         <Route path="/admin/appointments" element={
//           <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
//             <AdminDashboard initialTab="appointments" />
//           </ProtectedRoute>
//         } />
 
 
//         <Route path="/admin/radiology" element={
//           <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
//             <AdminDashboard initialTab="radiology" />
//           </ProtectedRoute>
//         } />
//         <Route path="/admin/pathology" element={
//           <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
//             <AdminDashboard initialTab="pathology" />
//           </ProtectedRoute>
//         } />
 
 
//          <Route path="/ipd" element={
//           <ProtectedRoute >
//             <AdminDashboard initialTab="ipd" />
//           </ProtectedRoute>
//         } />
 
 
 
//         <Route path="/admin/billing" element={
//           <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
//             <AdminDashboard initialTab="billing" />
//           </ProtectedRoute>
//         } />
//         <Route path="/admin/pharmacy" element={
//           <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
//             <AdminDashboard initialTab="pharmacy" />
//           </ProtectedRoute>
//         } />
//         <Route path="/admin/bloodbank" element={
//           <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
//             <AdminDashboard initialTab="bloodbank" />
//           </ProtectedRoute>
//         } />
//         <Route path="/admin/ambulance" element={
//           <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
//             <AdminDashboard initialTab="ambulance" />
//           </ProtectedRoute>
//         } />
//         <Route path="/admin/frontoffice" element={
//           <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
//             <AdminDashboard initialTab="frontoffice" />
//           </ProtectedRoute>
//         } />
//         <Route path="/admin/birthdeathrecords" element={
//           <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
//             <AdminDashboard initialTab="birthdeathrecords" />
//           </ProtectedRoute>
//         } />
//         <Route path="/admin/humanresources" element={
//           <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
//             <AdminDashboard initialTab="humanresources" />
//           </ProtectedRoute>
//         } />
//         <Route path="/admin/dutyrooster" element={
//           <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
//             <AdminDashboard initialTab="dutyrooster" />
//           </ProtectedRoute>
//         } />
//         <Route path="/admin/AnnualCalender" element={
//           <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
//             <AdminDashboard initialTab="AnnualCalender" />
//           </ProtectedRoute>
//         } />
//         <Route path="/admin/tpa" element={
//           <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
//             <AdminDashboard initialTab="tpa" />
//           </ProtectedRoute>
//         } />
//         <Route path="/admin/inventory" element={
//           <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
//             <AdminDashboard initialTab="inventory" />
//           </ProtectedRoute>
//         } />
//         <Route path="/admin/reports" element={
//           <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
//             <AdminDashboard initialTab="reports" />
//           </ProtectedRoute>
//         } />
//         <Route path="/admin/settings" element={
//           <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
//             <AdminDashboard initialTab="settings" />
//           </ProtectedRoute>
//         } />
 
//         {/* ================= SPECIALIST ================= */}
//        <Route path="/specialist" element={
//            <ProtectedRoute allowedRoles={['radiologist', 'pathologist', 'pharmacist']}>
//              <AdminDashboard initialTab={
//               localStorage.getItem('userRole') === 'pharmacist' ? 'pharmacydash' : 
//               localStorage.getItem('userRole') === 'radiologist' ? 'radiodash' : 
//               localStorage.getItem('userRole') === 'pathologist' ? 'pathodash' :  'dashboard'
//               } />
//           </ProtectedRoute>
//         } />
//          <Route path="/specialist/radiodash" element={
//           <ProtectedRoute allowedRoles={['radiologist']}>
//             <AdminDashboard initialTab="radiodash" />
//           </ProtectedRoute>
//         } />
//         <Route path="/specialist/pathodash" element={
// <ProtectedRoute allowedRoles={['pathologist']}>
// <AdminDashboard initialTab="pathodash" />
// </ProtectedRoute>
//         } />     
 
//          <Route path="/specialist/pharmacydash" element={
//           <ProtectedRoute allowedRoles={['pharmacist']}>
//             <AdminDashboard initialTab="pharmacydash" />
//           </ProtectedRoute>
//         } />
//         <Route path="/specialist/dashboard" element={
//           <ProtectedRoute allowedRoles={['radiologist', 'pathologist', 'pharmacist']}>
//             <AdminDashboard initialTab="dashboard" />
//           </ProtectedRoute>
//         } />
//         <Route path="/specialist/appointments" element={
//           <ProtectedRoute allowedRoles={['radiologist', 'pathologist', 'pharmacist']}>
//             <AdminDashboard initialTab="appointments" />
//           </ProtectedRoute>
//         } />
//         <Route path="/specialist/radiology" element={
//           <ProtectedRoute allowedRoles={['radiologist']}>
//             <AdminDashboard initialTab="radiology" />
//           </ProtectedRoute>
//         } />
//         <Route path="/specialist/pathology" element={
//           <ProtectedRoute allowedRoles={['pathologist']}>
//             <AdminDashboard initialTab="pathology" />
//           </ProtectedRoute>
//         } />
//         <Route path="/specialist/billing" element={
//           <ProtectedRoute allowedRoles={['radiologist', 'pathologist', 'pharmacist']}>
//             <AdminDashboard initialTab="billing" />
//           </ProtectedRoute>
//         } />
//         <Route path="/specialist/pharmacy" element={
//           <ProtectedRoute allowedRoles={['pharmacist']}>
//             <AdminDashboard initialTab="pharmacy" />
//           </ProtectedRoute>
//         } />
//         <Route path="/specialist/dutyrooster" element={
//           <ProtectedRoute allowedRoles={['radiologist', 'pathologist', 'pharmacist']}>
//             <AdminDashboard initialTab="dutyrooster" />
//           </ProtectedRoute>
//         } />
//         <Route path="/specialist/AnnualCalender" element={
//           <ProtectedRoute allowedRoles={['radiologist', 'pathologist', 'pharmacist']}>
//             <AdminDashboard initialTab="AnnualCalender" />
//           </ProtectedRoute>
//         } />
//         <Route path="/specialist/tpa" element={
//           <ProtectedRoute allowedRoles={['radiologist', 'pathologist', 'pharmacist']}>
//             <AdminDashboard initialTab="tpa" />
//           </ProtectedRoute>
//         } />
//         <Route path="/specialist/inventory" element={
//           <ProtectedRoute allowedRoles={['radiologist', 'pathologist', 'pharmacist']}>
//             <AdminDashboard initialTab="inventory" />
//           </ProtectedRoute>
//         } />
//         <Route path="/specialist/settings" element={
//           <ProtectedRoute allowedRoles={['radiologist', 'pathologist', 'pharmacist']}>
//             <AdminDashboard initialTab="settings" />
//           </ProtectedRoute>
//         } />
 
//         {/* ================= RECEPTIONIST ================= */}
//             <Route path="/receptionist" element={
// <ProtectedRoute allowedRoles={['receptionist']}>
// <AdminDashboard initialTab='receptiondash'/>
// </ProtectedRoute>
//         } />
//         <Route path="/receptionist/receptiondash" element={
// <ProtectedRoute allowedRoles={['receptionist']}>
// <AdminDashboard initialTab="receptiondash" />
// </ProtectedRoute>
//         } />
//         <Route path="/receptionist/appointments" element={
//           <ProtectedRoute allowedRoles={['receptionist']}>
//             <AdminDashboard initialTab="appointments" />
//           </ProtectedRoute>
//         } />
//         <Route path="/receptionist/billing" element={
//           <ProtectedRoute allowedRoles={['receptionist']}>
//             <AdminDashboard initialTab="billing" />
//           </ProtectedRoute>
//         } />
//         <Route path="/receptionist/pharmacy" element={
//           <ProtectedRoute allowedRoles={['receptionist']}>
//             <AdminDashboard initialTab="pharmacy" />
//           </ProtectedRoute>
//         } />
//         {/* <Route path="/receptionist/lab" element={
//           <ProtectedRoute allowedRoles={['receptionist']}>
//             <AdminDashboard initialTab="lab" />
//           </ProtectedRoute>
//         } /> */}
//         <Route path="/receptionist/bloodbank" element={
//           <ProtectedRoute allowedRoles={['receptionist']}>
//             <AdminDashboard initialTab="bloodbank" />
//           </ProtectedRoute>
//         } />
//         <Route path="/receptionist/ambulance" element={
//           <ProtectedRoute allowedRoles={['receptionist']}>
//             <AdminDashboard initialTab="ambulance" />
//           </ProtectedRoute>
//         } />
//         <Route path="/receptionist/frontoffice" element={
//           <ProtectedRoute allowedRoles={['receptionist']}>
//             <AdminDashboard initialTab="frontoffice" />
//           </ProtectedRoute>
//         } />
//         <Route path="/receptionist/birthdeathrecords" element={
//           <ProtectedRoute allowedRoles={['receptionist']}>
//             <AdminDashboard initialTab="birthdeathrecords" />
//           </ProtectedRoute>
//         } />
//         <Route path="/receptionist/dutyrooster" element={
//           <ProtectedRoute allowedRoles={['receptionist']}>
//             <AdminDashboard initialTab="dutyrooster" />
//           </ProtectedRoute>
//         } />
//         <Route path="/receptionist/annualcalender" element={
//           <ProtectedRoute allowedRoles={['receptionist']}>
//             <AdminDashboard initialTab="annualcalender" />
//           </ProtectedRoute>
//         } />
//         <Route path="/receptionist/tpa" element={
//           <ProtectedRoute allowedRoles={['receptionist']}>
//             <AdminDashboard initialTab="tpa" />
//           </ProtectedRoute>
//         } />
//         <Route path="/receptionist/inventory" element={
//           <ProtectedRoute allowedRoles={['receptionist']}>
//             <AdminDashboard initialTab="inventory" />
//           </ProtectedRoute>
//         } />
//         <Route path="/receptionist/settings" element={
//           <ProtectedRoute allowedRoles={['receptionist']}>
//             <AdminDashboard initialTab="settings" />
//           </ProtectedRoute>
//         } />
//         <Route path="/receptionist/logout" element={<Login />} />
 
//         {/* ================= DOCTOR ================= */}
//         <Route path="/doctor" element={
//           <ProtectedRoute allowedRoles={['doctor']}>
//             <AdminDashboard />
//           </ProtectedRoute>
//         } />
//         <Route path="/doctor/dashboard" element={
//           <ProtectedRoute allowedRoles={['doctor']}>
//             <AdminDashboard initialTab="dashboard" />
//           </ProtectedRoute>
//         } />
//          <Route path="/doctor/ambulance" element={
//           <ProtectedRoute allowedRoles={['doctor']}>
//             <AdminDashboard initialTab="ambulance" />
//           </ProtectedRoute>
//         } />
//          <Route path="/doctor/inventory" element={
//           <ProtectedRoute allowedRoles={['doctor']}>
//             <AdminDashboard initialTab="inventory" />
//           </ProtectedRoute>
//         } />
//          <Route path="/doctor/tpa" element={
//           <ProtectedRoute allowedRoles={['doctor']}>
//             <AdminDashboard initialTab="tpa" />
//           </ProtectedRoute>
//         } />
//         <Route path="/doctor/appointments" element={
//           <ProtectedRoute allowedRoles={['doctor']}>
//             <AdminDashboard initialTab="appointments" />
//           </ProtectedRoute>
//         } />
//         <Route path="/doctor/radiology" element={
//           <ProtectedRoute allowedRoles={['doctor']}>
//             <AdminDashboard initialTab="radiology" />
//           </ProtectedRoute>
//         } />
//         <Route path="/doctor/pathology" element={
//           <ProtectedRoute allowedRoles={['doctor']}>
//             <AdminDashboard initialTab="pathology" />
//           </ProtectedRoute>
//         } />
//         <Route path="/doctor/pharmacy" element={
//           <ProtectedRoute allowedRoles={['doctor']}>
//             <AdminDashboard initialTab="pharmacy" />
//           </ProtectedRoute>
//         } />
//         <Route path="/doctor/bloodbank" element={
//           <ProtectedRoute allowedRoles={['doctor']}>
//             <AdminDashboard initialTab="bloodbank" />
//           </ProtectedRoute>
//         } />
//         <Route path="/doctor/frontoffice" element={
//           <ProtectedRoute allowedRoles={['doctor']}>
//             <AdminDashboard initialTab="frontoffice" />
//           </ProtectedRoute>
//         } />
//         <Route path="/doctor/birthdeathrecords" element={
//           <ProtectedRoute allowedRoles={['doctor']}>
//             <AdminDashboard initialTab="birthdeathrecords" />
//           </ProtectedRoute>
//         } />
//         <Route path="/doctor/dutyrooster" element={
//           <ProtectedRoute allowedRoles={['doctor']}>
//             <AdminDashboard initialTab="dutyrooster" />
//           </ProtectedRoute>
//         } />
//         <Route path="/doctor/AnnualCalender" element={
//           <ProtectedRoute allowedRoles={['doctor']}>
//             <AdminDashboard initialTab="AnnualCalender" />
//           </ProtectedRoute>
//         } />
//         <Route path="/doctor/reports" element={
//           <ProtectedRoute allowedRoles={['doctor']}>
//             <AdminDashboard initialTab="reports" />
//           </ProtectedRoute>
//         } />
//         <Route path="/doctor/settings" element={
//           <ProtectedRoute allowedRoles={['doctor']}>
//             <AdminDashboard initialTab="settings" />
//           </ProtectedRoute>
//         } />
//          <Route path="/doctor/billing" element={
//           <ProtectedRoute allowedRoles={['doctor']}>
//             <AdminDashboard initialTab="billing" />
//           </ProtectedRoute>
//         } />
 
//         {/* ================= ACCOUNTANT ================= */}
//           <Route path="/accountant" element={
// <ProtectedRoute allowedRoles={['accountant']}>
// <AdminDashboard initialTab="accountdash" />
// </ProtectedRoute>
//         } />
//       <Route path="/accountant/accountdash" element={
// <ProtectedRoute allowedRoles={['accountant']}>
// <AdminDashboard initialTab="accountdash" />
// </ProtectedRoute>
//         } />
//         <Route path="/accountant/billing" element={
//           <ProtectedRoute allowedRoles={['accountant']}>
//             <AdminDashboard initialTab="billing" />
//           </ProtectedRoute>
//         } />
//         <Route path="/accountant/pharmacy" element={
//           <ProtectedRoute allowedRoles={['accountant']}>
//             <AdminDashboard initialTab="pharmacy" />
//           </ProtectedRoute>
//         } />
//         <Route path="/accountant/birthdeathrecords" element={
//           <ProtectedRoute allowedRoles={['accountant']}>
//             <AdminDashboard initialTab="birthdeathrecords" />
//           </ProtectedRoute>
//         } />
//         <Route path="/accountant/inventory" element={
//           <ProtectedRoute allowedRoles={['accountant']}>
//             <AdminDashboard initialTab="inventory" />
//           </ProtectedRoute>
//         } />
//         <Route path="/accountant/reports" element={
//           <ProtectedRoute allowedRoles={['accountant']}>
//             <AdminDashboard initialTab="reports" />
//           </ProtectedRoute>
//         } />
//         <Route path="/accountant/tpa" element={
//           <ProtectedRoute allowedRoles={['accountant']}>
//             <AdminDashboard initialTab="tpa" />
//           </ProtectedRoute>
//         } />
//         <Route path="/accountant/settings" element={
//           <ProtectedRoute allowedRoles={['accountant']}>
//             <AdminDashboard initialTab="settings" />
//           </ProtectedRoute>
//         } />
 
//           {/* Nurse Routes */}
//         <Route
//           path="/nurse"
//           element={
//             <ProtectedRoute allowedRoles={['nurse']}>
//               <AdminDashboard initialTab="dashboard" />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/nurse/appointments"
//           element={
//             <ProtectedRoute allowedRoles={['nurse']}>
//               <AdminDashboard initialTab="appointments" />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/nurse/radiology"
//           element={
//             <ProtectedRoute allowedRoles={['nurse']}>
//               <AdminDashboard initialTab="radiology" />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/nurse/pathology"
//           element={
//             <ProtectedRoute allowedRoles={['nurse']}>
//               <AdminDashboard initialTab="pathology" />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/nurse/bloodbank"
//           element={
//             <ProtectedRoute allowedRoles={['nurse']}>
//               <AdminDashboard initialTab="bloodbank" />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/nurse/ambulance"
//           element={
//             <ProtectedRoute allowedRoles={['nurse']}>
//               <AdminDashboard initialTab="ambulance" />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/nurse/dutyrooster"
//           element={
//             <ProtectedRoute allowedRoles={['nurse']}>
//               <AdminDashboard initialTab="dutyrooster" />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/nurse/inventory"
//           element={
//             <ProtectedRoute allowedRoles={['nurse']}>
//               <AdminDashboard initialTab="inventory" />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/nurse/settings"
//           element={
//             <ProtectedRoute allowedRoles={['nurse']}>
//               <AdminDashboard initialTab="settings" />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/nurse/beds"
//           element={
//             <ProtectedRoute allowedRoles={['nurse']}>
//               <AdminDashboard initialTab="beds" />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/nurse/tpa"
//           element={
//             <ProtectedRoute allowedRoles={['nurse']}>
//               <AdminDashboard initialTab="tpa" />
//             </ProtectedRoute>
//           }
//         />
   


// <Route
//   path="/admin/beds"
//   element={
//     <ProtectedRoute allowedRoles={['admin']}>
//        <AdminDashboard initialTab="beds" />
//     </ProtectedRoute>
//   }
// />

// <Route
//   path="/doctor/beds"
//   element={
//     <ProtectedRoute allowedRoles={['doctor']}>
//        <AdminDashboard initialTab="beds" />
//     </ProtectedRoute>
//   }
// />

// <Route
//   path="/nurse/beds"
//   element={
//     <ProtectedRoute allowedRoles={['nurse']}>
//        <AdminDashboard initialTab="beds" />
//     </ProtectedRoute>
//   }
// />

// <Route
//   path="/receptionist/beds"
//   element={
//     <ProtectedRoute allowedRoles={['receptionist']}>
//      <AdminDashboard initialTab="beds" />
//     </ProtectedRoute>
//   }
// />

// <Route
//   path="/accountant/beds"
//   element={
//     <ProtectedRoute allowedRoles={['accountant']}>
//        <AdminDashboard initialTab="beds" />
//     </ProtectedRoute>
//   }
// />




 
//       </Routes>
//     </div>
//   );
// }
 
// export default App;
 

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './components/Home';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
// import LandingPage from './pages/LandingPage';
import NotFound from './pages/NotFound'; // Added for 404 handling
import Dashboard from './pages/Dashboard'; // Imported as per your original code
import Billing from './pages/Billing';
import Pharmacy from './pages/Pharmacy';
import BloodBank from './pages/BloodBank';
import Ambulance from './pages/Ambulance';
import FrontOffice from './pages/FrontOffice';
import BirthDeathRecords from './pages/BirthDeathRecords';
import HumanResources from './pages/HumanResources';
import DutyRooster from './pages/DutyRooster';
import AnnualCalender from './pages/AnnualCalender';
import TPA from './pages/TPA';
import Inventory from './pages/Inventory';
import Settings from './pages/Settings';
import Reports from './pages/Reports';
import Beds from './pages/Beds';

function App() {

  return (
    <Router>
      <div>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/landingpage" element={<LandingPage />} /> */}

          {/* Common Home */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/view/:id"
            element={
              <ProtectedRoute>
                <AdminDashboard initialTab="view" />
              </ProtectedRoute>
            }
          />
            <Route
            path="/view1/:id"
            element={
              <ProtectedRoute>
                <AdminDashboard initialTab="view1" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/attendance"
            element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <AdminDashboard initialTab="attendance" />
              </ProtectedRoute>
            }
          />
               <Route
            path="/admin/patientrecords"
            element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <AdminDashboard initialTab="patientrecords" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <AdminDashboard initialTab="dashboard" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/appointments"
            element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <AdminDashboard initialTab="appointments" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/radiology"
            element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <AdminDashboard initialTab="radiology" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/pathology"
            element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <AdminDashboard initialTab="pathology" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ipd"
            element={
              <ProtectedRoute>
                <AdminDashboard initialTab="ipd" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/billing"
            element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <AdminDashboard initialTab="billing" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/pharmacy"
            element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <AdminDashboard initialTab="pharmacy" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bloodbank"
            element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <AdminDashboard initialTab="bloodbank" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/ambulance"
            element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <AdminDashboard initialTab="ambulance" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/frontoffice"
            element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <AdminDashboard initialTab="frontoffice" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/birthdeathrecords"
            element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <AdminDashboard initialTab="birthdeathrecords" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/humanresources"
            element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <AdminDashboard initialTab="humanresources" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dutyrooster"
            element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <AdminDashboard initialTab="dutyrooster" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/annualcalender"
            element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <AdminDashboard initialTab="annualcalender" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/tpa"
            element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <AdminDashboard initialTab="tpa" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/inventory"
            element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <AdminDashboard initialTab="inventory" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <AdminDashboard initialTab="reports" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <AdminDashboard initialTab="settings" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/beds"
            element={
              <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                <AdminDashboard initialTab="beds" />
              </ProtectedRoute>
            }
          />

          {/* Specialist Routes */}
          <Route
            path="/specialist"
            element={
              <ProtectedRoute allowedRoles={['radiologist', 'pathologist', 'pharmacist']}>
                <AdminDashboard
                  initialTab={
                    localStorage.getItem('userRole') === 'pharmacist'
                      ? 'pharmacydash'
                      : localStorage.getItem('userRole') === 'radiologist'
                      ? 'radiodash'
                      : localStorage.getItem('userRole') === 'pathologist'
                      ? 'pathodash'
                      : 'dashboard'
                  }
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/specialist/radiodash"
            element={
              <ProtectedRoute allowedRoles={['radiologist']}>
                <AdminDashboard initialTab="radiodash" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/specialist/pathodash"
            element={
              <ProtectedRoute allowedRoles={['pathologist']}>
                <AdminDashboard initialTab="pathodash" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/specialist/pharmacydash"
            element={
              <ProtectedRoute allowedRoles={['pharmacist']}>
                <AdminDashboard initialTab="pharmacydash" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/specialist/dashboard"
            element={
              <ProtectedRoute allowedRoles={['radiologist', 'pathologist', 'pharmacist']}>
                <AdminDashboard initialTab="dashboard" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/specialist/appointments"
            element={
              <ProtectedRoute allowedRoles={['radiologist', 'pathologist', 'pharmacist']}>
                <AdminDashboard initialTab="appointments" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/specialist/radiology"
            element={
              <ProtectedRoute allowedRoles={['radiologist']}>
                <AdminDashboard initialTab="radiology" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/specialist/pathology"
            element={
              <ProtectedRoute allowedRoles={['pathologist']}>
                <AdminDashboard initialTab="pathology" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/specialist/billing"
            element={
              <ProtectedRoute allowedRoles={['radiologist', 'pathologist', 'pharmacist']}>
                <AdminDashboard initialTab="billing" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/specialist/pharmacy"
            element={
              <ProtectedRoute allowedRoles={['pharmacist']}>
                <AdminDashboard initialTab="pharmacy" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/specialist/dutyrooster"
            element={
              <ProtectedRoute allowedRoles={['radiologist', 'pathologist', 'pharmacist']}>
                <AdminDashboard initialTab="dutyrooster" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/specialist/annualcalender"
            element={
              <ProtectedRoute allowedRoles={['radiologist', 'pathologist', 'pharmacist']}>
                <AdminDashboard initialTab="annualcalender" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/specialist/tpa"
            element={
              <ProtectedRoute allowedRoles={['radiologist', 'pathologist', 'pharmacist']}>
                <AdminDashboard initialTab="tpa" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/specialist/inventory"
            element={
              <ProtectedRoute allowedRoles={['radiologist', 'pathologist', 'pharmacist']}>
                <AdminDashboard initialTab="inventory" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/specialist/settings"
            element={
              <ProtectedRoute allowedRoles={['radiologist', 'pathologist', 'pharmacist']}>
                <AdminDashboard initialTab="settings" />
              </ProtectedRoute>
            }
          />

          {/* Receptionist Routes */}
          <Route
            path="/receptionist"
            element={
              <ProtectedRoute allowedRoles={['receptionist']}>
                <AdminDashboard initialTab="receptiondash" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/receptionist/receptiondash"
            element={
              <ProtectedRoute allowedRoles={['receptionist']}>
                <AdminDashboard initialTab="receptiondash" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/receptionist/appointments"
            element={
              <ProtectedRoute allowedRoles={['receptionist']}>
                <AdminDashboard initialTab="appointments" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/receptionist/billing"
            element={
              <ProtectedRoute allowedRoles={['receptionist']}>
                <AdminDashboard initialTab="billing" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/receptionist/pharmacy"
            element={
              <ProtectedRoute allowedRoles={['receptionist']}>
                <AdminDashboard initialTab="pharmacy" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/receptionist/bloodbank"
            element={
              <ProtectedRoute allowedRoles={['receptionist']}>
                <AdminDashboard initialTab="bloodbank" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/receptionist/ambulance"
            element={
              <ProtectedRoute allowedRoles={['receptionist']}>
                <AdminDashboard initialTab="ambulance" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/receptionist/frontoffice"
            element={
              <ProtectedRoute allowedRoles={['receptionist']}>
                <AdminDashboard initialTab="frontoffice" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/receptionist/birthdeathrecords"
            element={
              <ProtectedRoute allowedRoles={['receptionist']}>
                <AdminDashboard initialTab="birthdeathrecords" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/receptionist/dutyrooster"
            element={
              <ProtectedRoute allowedRoles={['receptionist']}>
                <AdminDashboard initialTab="dutyrooster" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/receptionist/annualcalender"
            element={
              <ProtectedRoute allowedRoles={['receptionist']}>
                <AdminDashboard initialTab="annualcalender" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/receptionist/tpa"
            element={
              <ProtectedRoute allowedRoles={['receptionist']}>
                <AdminDashboard initialTab="tpa" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/receptionist/inventory"
            element={
              <ProtectedRoute allowedRoles={['receptionist']}>
                <AdminDashboard initialTab="inventory" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/receptionist/settings"
            element={
              <ProtectedRoute allowedRoles={['receptionist']}>
                <AdminDashboard initialTab="settings" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/receptionist/beds"
            element={
              <ProtectedRoute allowedRoles={['receptionist']}>
                <AdminDashboard initialTab="beds" />
              </ProtectedRoute>
            }
          />
          <Route path="/receptionist/logout" element={<Login />} />

          {/* Doctor Routes */}
          <Route
            path="/doctor"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/dashboard"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <AdminDashboard initialTab="dashboard" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/ambulance"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <AdminDashboard initialTab="ambulance" />
              </ProtectedRoute>
            }
          />
                <Route
            path="/doctor/patientrecords"
            element={
               <ProtectedRoute allowedRoles={['doctor']}>
                <AdminDashboard initialTab="patientrecords" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/inventory"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <AdminDashboard initialTab="inventory" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/tpa"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <AdminDashboard initialTab="tpa" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/appointments"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <AdminDashboard initialTab="appointments" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/radiology"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <AdminDashboard initialTab="radiology" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/pathology"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <AdminDashboard initialTab="pathology" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/pharmacy"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <AdminDashboard initialTab="pharmacy" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/bloodbank"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <AdminDashboard initialTab="bloodbank" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/frontoffice"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <AdminDashboard initialTab="frontoffice" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/birthdeathrecords"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <AdminDashboard initialTab="birthdeathrecords" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/dutyrooster"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <AdminDashboard initialTab="dutyrooster" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/annualcalender"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <AdminDashboard initialTab="annualcalender" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/reports"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <AdminDashboard initialTab="reports" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/settings"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <AdminDashboard initialTab="settings" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/billing"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <AdminDashboard initialTab="billing" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/beds"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <AdminDashboard initialTab="beds" />
              </ProtectedRoute>
            }
          />

          {/* Accountant Routes */}
          <Route
            path="/accountant"
            element={
              <ProtectedRoute allowedRoles={['accountant']}>
                <AdminDashboard initialTab="accountdash" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/accountant/accountdash"
            element={
              <ProtectedRoute allowedRoles={['accountant']}>
                <AdminDashboard initialTab="accountdash" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/accountant/billing"
            element={
              <ProtectedRoute allowedRoles={['accountant']}>
                <AdminDashboard initialTab="billing" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/accountant/pharmacy"
            element={
              <ProtectedRoute allowedRoles={['accountant']}>
                <AdminDashboard initialTab="pharmacy" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/accountant/birthdeathrecords"
            element={
              <ProtectedRoute allowedRoles={['accountant']}>
                <AdminDashboard initialTab="birthdeathrecords" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/accountant/inventory"
            element={
              <ProtectedRoute allowedRoles={['accountant']}>
                <AdminDashboard initialTab="inventory" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/accountant/reports"
            element={
              <ProtectedRoute allowedRoles={['accountant']}>
                <AdminDashboard initialTab="reports" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/accountant/tpa"
            element={
              <ProtectedRoute allowedRoles={['accountant']}>
                <AdminDashboard initialTab="tpa" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/accountant/settings"
            element={
              <ProtectedRoute allowedRoles={['accountant']}>
                <AdminDashboard initialTab="settings" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/accountant/beds"
            element={
              <ProtectedRoute allowedRoles={['accountant']}>
                <AdminDashboard initialTab="beds" />
              </ProtectedRoute>
            }
          />

          {/* Nurse Routes */}
          <Route
            path="/nurse"
            element={
              <ProtectedRoute allowedRoles={['nurse']}>
                <AdminDashboard initialTab="dashboard" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/nurse/appointments"
            element={
              <ProtectedRoute allowedRoles={['nurse']}>
                <AdminDashboard initialTab="appointments" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/nurse/radiology"
            element={
              <ProtectedRoute allowedRoles={['nurse']}>
                <AdminDashboard initialTab="radiology" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/nurse/pathology"
            element={
              <ProtectedRoute allowedRoles={['nurse']}>
                <AdminDashboard initialTab="pathology" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/nurse/bloodbank"
            element={
              <ProtectedRoute allowedRoles={['nurse']}>
                <AdminDashboard initialTab="bloodbank" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/nurse/ambulance"
            element={
              <ProtectedRoute allowedRoles={['nurse']}>
                <AdminDashboard initialTab="ambulance" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/nurse/dutyrooster"
            element={
              <ProtectedRoute allowedRoles={['nurse']}>
                <AdminDashboard initialTab="dutyrooster" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/nurse/inventory"
            element={
              <ProtectedRoute allowedRoles={['nurse']}>
                <AdminDashboard initialTab="inventory" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/nurse/settings"
            element={
              <ProtectedRoute allowedRoles={['nurse']}>
                <AdminDashboard initialTab="settings" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/nurse/beds"
            element={
              <ProtectedRoute allowedRoles={['nurse']}>
                <AdminDashboard initialTab="beds" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/nurse/tpa"
            element={
              <ProtectedRoute allowedRoles={['nurse']}>
                <AdminDashboard initialTab="tpa" />
              </ProtectedRoute>
            }
          />

          {/* Catch-All Route for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;