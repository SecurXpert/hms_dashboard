
// // import axios from 'axios';
// // import { useState } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import {
// //   FaCrown, FaUserShield, FaUserMd, FaPills, FaFlask, FaXRay,
// //   FaCalculator, FaClipboardList, FaKey, FaGlobe, FaEye, FaEyeSlash,
// //   FaStethoscope, FaHeartbeat, FaHospital, FaShieldAlt
// // } from 'react-icons/fa';
// // import { MdMedicalServices } from 'react-icons/md';

// // // Define reusable styles
// // const inputBase =
// //   "block w-full rounded-xl border-0 bg-white/80 px-4 py-3 text-sm outline-none transition-all duration-300 focus:bg-white focus:ring-2 focus:ring-teal-400 focus:ring-opacity-50 shadow-sm";
// // const btnBase =
// //   "inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:-translate-y-0.5";
// // const btnTeal = `${btnBase} bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700 focus:ring-teal-500 shadow-md hover:shadow-lg`;
// // const btnGray = `${btnBase} bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-400`;

// // // Login Component
// // const Login = () => {
// //   const [email, setEmail] = useState('');
// //   const [password, setPassword] = useState('');
// //   const [selectedRole, setSelectedRole] = useState('');
// //   const [error, setError] = useState('');
// //   const [showPassword, setShowPassword] = useState(false);
// //   const navigate = useNavigate();

// //   // Forgot password (OTP) state
// //   const [showForgot, setShowForgot] = useState(false);
// //   const [otpEmail, setOtpEmail] = useState('');
// //   const [otpSent, setOtpSent] = useState(false);
// //   const [sendingOtp, setSendingOtp] = useState(false);
// //   const [otp, setOtp] = useState('');
// //   const [newPwd, setNewPwd] = useState('');
// //   const [confirmPwd, setConfirmPwd] = useState('');
// //   const [resetting, setResetting] = useState(false);
// //   const [otpStatus, setOtpStatus] = useState('');

// //   const handleLogin = async (e) => {
// //     e.preventDefault();
// //     setError('');

// //     if (!selectedRole) {
// //       setError('Please select a role');
// //       return;
// //     }

// //     try {
// //       const response = await axios.post('/api/v1/auth/login', {
// //         email,
// //         password,
// //         role: selectedRole,
// //       });

// //       if (response.data.access_token) {
// //         localStorage.setItem('token', response.data.access_token);
// //         localStorage.setItem('userRole', selectedRole);

// //         if (selectedRole === 'admin' || selectedRole === 'super_admin') {
// //           navigate('/admin', { state: { role: selectedRole } });
// //         } else {
// //           navigate('/home', { state: { role: selectedRole } });
// //         }
// //       } else {
// //         setError(response.data.message || 'Invalid credentials!');
// //       }
// //     } catch (error) {
// //       setError(
// //         error.response?.status === 404
// //           ? 'Request not found. Please ensure the proxy is correctly configured.'
// //           : 'Failed to connect to the server. Please check your network or try again.'
// //       );
// //     }
// //   };

// //   const handleSendOtp = async () => {
// //     setOtpStatus('');
// //     if (!otpEmail) {
// //       setOtpStatus('Please enter your email to receive OTP.');
// //       return;
// //     }
// //     setSendingOtp(true);
// //     try {
// //       await axios.post('/api/v1/auth/forgot/send-otp', { email: otpEmail });
// //       setOtpSent(true);
// //       setOtpStatus('OTP sent to your email.');
// //     } catch (err) {
// //       setOtpStatus(err.response?.data?.message || 'Failed to send OTP. Please try again.');
// //     } finally {
// //       setSendingOtp(false);
// //     }
// //   };

// //   const handleResetPassword = async (e) => {
// //     e.preventDefault();
// //     setOtpStatus('');

// //     if (!otp) {
// //       setOtpStatus('Please enter the OTP sent to your email.');
// //       return;
// //     }
// //     if (newPwd.length < 8) {
// //       setOtpStatus('New password must be at least 8 characters.');
// //       return;
// //     }
// //     if (newPwd !== confirmPwd) {
// //       setOtpStatus('Passwords do not match.');
// //       return;
// //     }

// //     setResetting(true);
// //     try {
// //       await axios.post('/api/v1/auth/forgot/reset', {
// //         email: otpEmail,
// //         otp,
// //         new_password: newPwd,
// //       });
// //       setOtpStatus('Password reset successful. You can sign in now.');
// //       setShowForgot(false);
// //       setOtp(''); setNewPwd(''); setConfirmPwd('');
// //       setOtpSent(false);
// //       setEmail(otpEmail);
// //       setPassword('');
// //     } catch (err) {
// //       setOtpStatus(err.response?.data?.message || 'Password reset failed. Please try again.');
// //     } finally {
// //       setResetting(false);
// //     }
// //   };

// //   const roles = [
// //     { id: 'super_admin', name: 'Super Admin', color: 'from-teal-500 to-teal-600', icon: <FaCrown /> },
// //     { id: 'admin', name: 'Admin', color: 'from-blue-500 to-blue-600', icon: <FaUserShield /> },
// //     { id: 'doctor', name: 'Doctor', color: 'from-green-500 to-green-600', icon: <FaUserMd /> },
// //     { id: 'pharmacist', name: 'Pharmacist', color: 'from-cyan-500 to-cyan-600', icon: <FaPills /> },
// //     { id: 'pathologist', name: 'Pathologist', color: 'from-purple-500 to-purple-600', icon: <FaFlask /> },
// //     { id: 'radiologist', name: 'Radiologist', color: 'from-red-500 to-red-600', icon: <FaXRay /> },
// //     { id: 'accountant', name: 'Accountant', color: 'from-indigo-500 to-indigo-600', icon: <FaCalculator /> },
// //     { id: 'receptionist', name: 'Receptionist', color: 'from-teal-400 to-teal-500', icon: <FaClipboardList /> },
// //     { id: 'nurse', name: 'Nurse', color: 'from-blue-400 to-blue-500', icon: <MdMedicalServices /> },
// //   ];

// //   const roleDisplayNameById = {
// //     super_admin: 'Super Admin',
// //     admin: 'Admin',
// //     doctor: 'Doctor',
// //     pharmacist: 'Pharmacist',
// //     pathologist: 'Pathologist',
// //     radiologist: 'Radiologist',
// //     accountant: 'Accountant',
// //     receptionist: 'Receptionist',
// //     nurse: 'Nurse',
// //   };
// //   const headerRole = selectedRole ? roleDisplayNameById[selectedRole] : 'Medical Professional';

// //   // Floating particles for background
// //   const Particle = ({ style }) => (
// //     <div 
// //       className="absolute rounded-full opacity-20 animate-float" 
// //       style={style}
// //     />
// //   );

// //   // Medical icons for animation
// //   const MedicalIcon = ({ icon: Icon, style }) => (
// //     <div 
// //       className="absolute text-white/30 animate-medical-float"
// //       style={style}
// //     >
// //       <Icon className="text-2xl" />
// //     </div>
// //   );

// //   return (
// //     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-blue-100 to-indigo-100 relative overflow-hidden">
// //       {/* Animated background elements */}
// //       <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Ccircle cx=%2250%22 cy=%2250%22 r=%224%22 fill=%22%230e7490%22/%3E%3C/svg%3E')] bg-repeat bg-[length:100px_100px]"></div>
      
// //       {/* Floating particles */}
// //       <Particle style={{ top: '20%', left: '10%', width: '40px', height: '40px', backgroundColor: '#0e7490', animationDuration: '15s' }} />
// //       <Particle style={{ top: '60%', left: '5%', width: '20px', height: '20px', backgroundColor: '#0d9488', animationDuration: '12s', animationDelay: '1s' }} />
// //       <Particle style={{ top: '30%', right: '15%', width: '30px', height: '30px', backgroundColor: '#0369a1', animationDuration: '18s', animationDelay: '2s' }} />
// //       <Particle style={{ bottom: '20%', right: '10%', width: '25px', height: '25px', backgroundColor: '#1d4ed8', animationDuration: '14s', animationDelay: '3s' }} />
      
// //       {/* Animated waves */}
// //       <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-teal-200/30 to-transparent"></div>

// //       {/* Login Form Container */}
// //       <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden relative border border-white/20 transform transition-all duration-500 hover:shadow-2xl">
// //         {/* Decorative medical ribbon */}
// //         <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-400 via-blue-400 to-indigo-400"></div>
        
// //         {/* Security badge */}
// //         <div className="absolute top-4 right-4 bg-teal-100 text-teal-600 p-2 rounded-full shadow-sm">
// //           <FaShieldAlt className="text-sm" />
// //         </div>

// //         <div className="flex flex-col md:flex-row">
// //           {/* Left side - Branding */}
// //           <div className="bg-gradient-to-br from-teal-500 to-blue-600 text-white p-8 md:w-2/5 relative overflow-hidden">
// //             <div className="absolute inset-0 bg-medical-pattern opacity-10"></div>
// //             <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-full"></div>
// //             <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full"></div>
            
// //             {/* Top floating medical icons */}
// //             <MedicalIcon icon={FaHeartbeat} style={{ top: '15%', left: '20%', animationDuration: '20s', animationDelay: '0s' }} />
// //             <MedicalIcon icon={FaStethoscope} style={{ top: '25%', right: '15%', animationDuration: '18s', animationDelay: '2s' }} />
// //             <MedicalIcon icon={FaPills} style={{ top: '10%', right: '25%', animationDuration: '22s', animationDelay: '1s' }} />
            
// //             {/* Bottom floating medical icons */}
// //             <MedicalIcon icon={FaFlask} style={{ bottom: '15%', left: '15%', animationDuration: '17s', animationDelay: '3s' }} />
// //             <MedicalIcon icon={FaXRay} style={{ bottom: '25%', right: '20%', animationDuration: '19s', animationDelay: '4s' }} />
// //             <MedicalIcon icon={MdMedicalServices} style={{ bottom: '10%', right: '30%', animationDuration: '21s', animationDelay: '2s' }} />
            
// //             <div className="relative z-10 h-full flex flex-col justify-center items-center pb-8">
// //               <div className="text-center">
// //                 <div className="flex items-center justify-center mb-4">
// //                   <div className="bg-white p-4 rounded-2xl shadow-lg transform transition-transform duration-500 hover:scale-105 animate-pulse">
// //                     <FaHospital className="text-5xl text-teal-600" />
// //                   </div>
// //                 </div>
// //                 <h1 className="text-3xl font-bold mb-2">Vaidhya Narayan HMS</h1>
// //                 <p className="text-teal-100">Secure Healthcare Management System</p>
// //               </div>
// //               <div className="mt-4">
// //                 <div className="flex items-center justify-center space-x-2 text-teal-200">
// //                   <FaHeartbeat className="animate-pulse" />
// //                   <span className="text-sm">Serving with care since 2010</span>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Right side - Login Form */}
// //           <div className="p-8 md:w-3/5">
// //             <div className="text-center mb-8">
// //               <h2 className="text-2xl font-bold text-gray-800 mb-2">
// //                 <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
// //                   {headerRole} Portal
// //                 </span>
// //               </h2>
// //               <p className="text-gray-600">Sign in to access your dashboard</p>
// //             </div>

// //             {/* Login Form */}
// //             <form onSubmit={handleLogin} className="space-y-6">
// //               <div>
// //                 <label className="block text-sm text-gray-700 font-medium mb-2">Username</label>
// //                 <div className="relative">
// //                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
// //                     <FaUserMd />
// //                   </div>
// //                   <input
// //                     type="text"
// //                     value={email}
// //                     onChange={(e) => setEmail(e.target.value)}
// //                     className={inputBase + " pl-10"}
// //                     placeholder="Enter username"
// //                     required
// //                   />
// //                 </div>
// //               </div>

// //               <div>
// //                 <label className="block text-sm text-gray-700 font-medium mb-2">Password</label>
// //                 <div className="relative">
// //                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
// //                     <FaKey />
// //                   </div>
// //                   <input
// //                     type={showPassword ? "text" : "password"}
// //                     value={password}
// //                     onChange={(e) => setPassword(e.target.value)}
// //                     className={inputBase + " pl-10 pr-10"}
// //                     placeholder="Enter password"
// //                     required
// //                   />
// //                   <button
// //                     type="button"
// //                     className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-teal-500 transition-colors"
// //                     onClick={() => setShowPassword(!showPassword)}
// //                   >
// //                     {showPassword ? <FaEyeSlash /> : <FaEye />}
// //                   </button>
// //                 </div>
// //               </div>

// //               {error && (
// //                 <div className="bg-red-50 text-red-700 p-3 rounded-xl border border-red-200 animate-shake">
// //                   <p className="text-sm">{error}</p>
// //                 </div>
// //               )}

// //               <button
// //                 type="submit"
// //                 className={btnTeal + " w-full py-3 shadow-lg hover:shadow-xl"}
// //               >
// //                 Sign In
// //                 <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
// //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
// //                 </svg>
// //               </button>

// //               {/* Forgot Password link */}
// //               <div className="flex justify-center">
// //                 <button
// //                   type="button"
// //                   className="text-teal-600 hover:text-teal-800 text-sm font-medium transition-colors duration-200 flex items-center"
// //                   onClick={() => {
// //                     setShowForgot((v) => !v);
// //                     setOtpEmail((prev) => prev || email);
// //                   }}
// //                 >
// //                   <span className="border-b border-dashed border-teal-400 hover:border-teal-600">
// //                     Forgot Password?
// //                   </span>
// //                 </button>
// //               </div>
// //             </form>

// //             {/* Forgot Password (OTP) Section */}
// //             {showForgot && (
// //               <div className="mt-6 bg-teal-50/80 rounded-xl p-4 text-gray-800 backdrop-blur-sm animate-slide-in border border-teal-200">
// //                 <h3 className="text-sm font-semibold mb-3 flex items-center">
// //                   <FaKey className="mr-2 text-teal-600" />
// //                   Reset Password with OTP
// //                 </h3>

// //                 <div className="space-y-3">
// //                   <div>
// //                     <label className="block text-xs mb-1">Email</label>
// //                     <input
// //                       type="email"
// //                       value={otpEmail}
// //                       onChange={(e) => setOtpEmail(e.target.value)}
// //                       className={inputBase}
// //                       placeholder="Enter your email"
// //                     />
// //                   </div>

// //                   {!otpSent ? (
// //                     <button
// //                       type="button"
// //                       onClick={handleSendOtp}
// //                       className={btnTeal + " w-full text-xs py-2"}
// //                       disabled={sendingOtp}
// //                     >
// //                       {sendingOtp ? 'Sending OTP...' : 'Send OTP'}
// //                     </button>
// //                   ) : (
// //                     <>
// //                       <div>
// //                         <label className="block text-xs mb-1">OTP</label>
// //                         <input
// //                           type="text"
// //                           value={otp}
// //                           onChange={(e) => setOtp(e.target.value)}
// //                           className={inputBase}
// //                           placeholder="Enter OTP"
// //                         />
// //                       </div>

// //                       <div>
// //                         <label className="block text-xs mb-1">New Password</label>
// //                         <input
// //                           type="password"
// //                           value={newPwd}
// //                           onChange={(e) => setNewPwd(e.target.value)}
// //                           className={inputBase}
// //                           placeholder="Enter new password"
// //                         />
// //                       </div>

// //                       <div>
// //                         <label className="block text-xs mb-1">Confirm New Password</label>
// //                         <input
// //                           type="password"
// //                           value={confirmPwd}
// //                           onChange={(e) => setConfirmPwd(e.target.value)}
// //                           className={inputBase}
// //                           placeholder="Confirm new password"
// //                         />
// //                       </div>

// //                       <button
// //                         type="button"
// //                         onClick={handleResetPassword}
// //                         className={btnTeal + " w-full text-xs py-2"}
// //                         disabled={resetting}
// //                       >
// //                         {resetting ? 'Resetting...' : 'Reset Password'}
// //                       </button>
// //                     </>
// //                   )}

// //                   {otpStatus && (
// //                     <p className={`text-xs mt-2 ${otpStatus.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
// //                       {otpStatus}
// //                     </p>
// //                   )}
// //                 </div>
// //               </div>
// //             )}

// //             {/* Role Selection */}
// //             <div className="mt-8">
// //               <h3 className="text-gray-700 text-center mb-4 font-medium flex items-center justify-center">
// //                 <FaUserShield className="mr-2 text-teal-600" />
// //                 Select Your Role
// //               </h3>

// //               <div className="grid grid-cols-3 gap-3">
// //                 {roles.map((role) => (
// //                   <button
// //                     key={role.id}
// //                     type="button"
// //                     aria-pressed={selectedRole === role.id}
// //                     onClick={() => setSelectedRole(role.id)}
// //                     className={`p-2 rounded-xl text-white text-xs font-medium transition-all duration-300 transform hover:scale-105 ${
// //                       selectedRole === role.id
// //                         ? `bg-gradient-to-r ${role.color} ring-2 ring-white ring-opacity-50 shadow-lg`
// //                         : `bg-gradient-to-r ${role.color} opacity-80 hover:opacity-100`
// //                     }`}
// //                   >
// //                     <div className="text-center">
// //                       <div className="text-lg mb-1">{role.icon}</div>
// //                       <div className="text-xs">{role.name}</div>
// //                     </div>
// //                   </button>
// //                 ))}
// //               </div>
// //             </div>

// //             {/* Bottom Links */}
// //             <div className="mt-8 flex justify-center text-sm">
// //               <a href="#" className="text-teal-600 hover:text-teal-800 flex items-center space-x-1 transition-colors duration-200 font-medium">
// //                 <FaGlobe />
// //                 <span>Visit Our Website</span>
// //               </a>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Add custom animations */}
// //       <style jsx>{`
// //         @keyframes float {
// //           0% { transform: translateY(0) rotate(0deg); }
// //           50% { transform: translateY(-10px) rotate(5deg); }
// //           100% { transform: translateY(0) rotate(0deg); }
// //         }
// //         @keyframes medical-float {
// //           0% { transform: translateY(0) rotate(0deg) scale(1); opacity: 3; }
// //           33% { transform: translateY(-15px) rotate(5deg) scale(1.1); opacity: 4; }
// //           66% { transform: translateY(10px) rotate(-5deg) scale(0.9); opacity: 25; }
// //           100% { transform: translateY(0) rotate(0deg) scale(1); opacity: 3; }
// //         }
// //         @keyframes shake {
// //           0%, 100% { transform: translateX(0); }
// //           10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
// //           20%, 40%, 60%, 80% { transform: translateX(5px); }
// //         }
// //         @keyframes slideIn {
// //           from { opacity: 0; transform: translateY(-10px); }
// //           to { opacity: 1; transform: translateY(0); }
// //         }
// //         .animate-float { animation: float 10s ease-in-out infinite; }
// //         .animate-medical-float { animation: medical-float 15s ease-in-out infinite; }
// //         .animate-shake { animation: shake 0.5s ease-in-out; }
// //         .animate-slide-in { animation: slideIn 0.3s ease-out; }
// //         .bg-medical-pattern {
// //           background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%230e7490' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
// //         }
// //       `}</style>
// //     </div>
// //   );
// // };

// // export default Login;




// import { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import {
//   FaCrown, FaUserShield, FaUserMd, FaPills, FaFlask, FaXRay,
//   FaCalculator, FaClipboardList, FaKey, FaGlobe, FaEye, FaEyeSlash,
//   FaStethoscope, FaHeartbeat, FaHospital, FaShieldAlt
// } from 'react-icons/fa'
// import { MdMedicalServices } from 'react-icons/md'

// // Define reusable styles
// const inputBase =
//   'block w-full rounded-xl border-0 bg-white/80 px-4 py-3 text-sm outline-none transition-all duration-300 focus:bg-white focus:ring-2 focus:ring-teal-400 focus:ring-opacity-50 shadow-sm'
// const btnBase =
//   'inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:-translate-y-0.5'
// const btnTeal = `${btnBase} bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700 focus:ring-teal-500 shadow-md hover:shadow-lg`
// const btnGray = `${btnBase} bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-400`

// // Login Component (STATIC / NO BACKEND)
// const Login = () => {
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [selectedRole, setSelectedRole] = useState('')
//   const [error, setError] = useState('')
//   const [showPassword, setShowPassword] = useState(false)
//   const navigate = useNavigate()

//   // ⬇️ Persist role only when it’s actually chosen; also restore it on mount
//   useEffect(() => {
//     const savedRole = localStorage.getItem('userRole')
//     if (savedRole) setSelectedRole(savedRole)
//   }, [])
//   useEffect(() => {
//     if (selectedRole) localStorage.setItem('userRole', selectedRole)
//   }, [selectedRole])

//   // Forgot password (OTP) state
//   const [showForgot, setShowForgot] = useState(false)
//   const [otpEmail, setOtpEmail] = useState('')
//   const [otpSent, setOtpSent] = useState(false)
//   const [sendingOtp, setSendingOtp] = useState(false)
//   const [otp, setOtp] = useState('')
//   const [newPwd, setNewPwd] = useState('')
//   const [confirmPwd, setConfirmPwd] = useState('')
//   const [resetting, setResetting] = useState(false)
//   const [otpStatus, setOtpStatus] = useState('')
//   const [expectedOtp, setExpectedOtp] = useState('123456') // DEMO OTP

//   // ---- DEMO: Local "login" (no network) ----
//   const handleLogin = (e) => {
//     e.preventDefault()
//     setError('')

//     if (!selectedRole) {
//       setError('Please select a role')
//       return
//     }
//     if (!email || !password) {
//       setError('Please enter username and password.')
//       return
//     }

//     // Simulate a small delay like a network call
//     setTimeout(() => {
//       // Accept any non-empty credentials for demo
//       const dummyToken = 'demo-token-' + Date.now()
//       localStorage.setItem('token', dummyToken)
//       localStorage.setItem('userRole', selectedRole) // ensure saved at login

//       if (selectedRole === 'admin' || selectedRole === 'super_admin') {
//         navigate('/landingpage', { state: { role: selectedRole } })
//       } else {
//         // navigate('/home', { state: { role: selectedRole } })
//       }
//     }, 400)
//   }

//   // ---- DEMO: Send OTP locally ----
//   const handleSendOtp = () => {
//     setOtpStatus('')
//     if (!otpEmail) {
//       setOtpStatus('Please enter your email to receive OTP.')
//       return
//     }
//     setSendingOtp(true)
//     setTimeout(() => {
//       const demoOtp = '123456'
//       setExpectedOtp(demoOtp)
//       setOtpSent(true)
//       setOtpStatus(`OTP sent to your email. (Demo OTP: ${demoOtp})`)
//       setSendingOtp(false)
//     }, 500)
//   }

//   // ---- DEMO: Reset password locally ----
//   const handleResetPassword = (e) => {
//     e.preventDefault()
//     setOtpStatus('')

//     if (!otp) {
//       setOtpStatus('Please enter the OTP sent to your email.')
//       return
//     }
//     if (otp !== expectedOtp) {
//       setOtpStatus('Invalid OTP. Please try again.')
//       return
//     }
//     if (newPwd.length < 8) {
//       setOtpStatus('New password must be at least 8 characters.')
//       return
//     }
//     if (newPwd !== confirmPwd) {
//       setOtpStatus('Passwords do not match.')
//       return
//     }

//     setResetting(true)
//     setTimeout(() => {
//       setOtpStatus('Password reset successful. You can sign in now.')
//       setShowForgot(false)
//       setOtp(''); setNewPwd(''); setConfirmPwd('')
//       setOtpSent(false)
//       setEmail(otpEmail)
//       setPassword('')
//       setResetting(false)
//     }, 500)
//   }

//   const roles = [
//     { id: 'super_admin', name: 'Super Admin', color: 'from-teal-500 to-teal-600', icon: <FaCrown /> },
//     { id: 'admin', name: 'Admin', color: 'from-blue-500 to-blue-600', icon: <FaUserShield /> },
//     { id: 'doctor', name: 'Doctor', color: 'from-green-500 to-green-600', icon: <FaUserMd /> },
//     { id: 'pharmacist', name: 'Pharmacist', color: 'from-cyan-500 to-cyan-600', icon: <FaPills /> },
//     { id: 'pathologist', name: 'Pathologist', color: 'from-purple-500 to-purple-600', icon: <FaFlask /> },
//     { id: 'radiologist', name: 'Radiologist', color: 'from-red-500 to-red-600', icon: <FaXRay /> },
//     { id: 'accountant', name: 'Accountant', color: 'from-indigo-500 to-indigo-600', icon: <FaCalculator /> },
//     { id: 'receptionist', name: 'Receptionist', color: 'from-teal-400 to-teal-500', icon: <FaClipboardList /> },
//     { id: 'nurse', name: 'Nurse', color: 'from-blue-400 to-blue-500', icon: <MdMedicalServices /> },
//   ]

//   const roleDisplayNameById = {
//     super_admin: 'Super Admin',
//     admin: 'Admin',
//     doctor: 'Doctor',
//     pharmacist: 'Pharmacist',
//     pathologist: 'Pathologist',
//     radiologist: 'Radiologist',
//     accountant: 'Accountant',
//     receptionist: 'Receptionist',
//     nurse: 'Nurse',
//   }
//   const headerRole = selectedRole ? roleDisplayNameById[selectedRole] : 'Medical Professional'

//   // Floating particles for background
//   const Particle = ({ style }) => (
//     <div className="absolute rounded-full opacity-20 animate-float" style={style} />
//   )

//   // Medical icons for animation
//   const MedicalIcon = ({ icon: Icon, style }) => (
//     <div className="absolute text-white/30 animate-medical-float" style={style}>
//       <Icon className="text-2xl" />
//     </div>
//   )

//   // ECG border segment
//   const ECG = () => (
//     <svg viewBox="0 0 600 60" className="w-full h-8 text-teal-500/70">
//       <path d="M0 30 Q 40 10 80 30 T 160 30 L 180 30 188 10 202 50 214 20 226 40 240 30 T 320 30 L 340 30 348 10 362 56 374 16 388 44 402 30 T 480 30 Q 520 50 560 30 T 600 30" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="ecg-stroke"/>
//     </svg>
//   )

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-blue-100 to-indigo-100 relative overflow-hidden">
//       {/* Animated background elements */}
//       <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Ccircle cx=%2250%22 cy=%2250%22 r=%224%22 fill=%22%230e7490%22/%3E%3C/svg%3E')] bg-repeat bg-[length:100px_100px]" />

//       {/* Floating particles */}
//       <Particle style={{ top: '20%', left: '10%', width: '40px', height: '40px', backgroundColor: '#0e7490', animationDuration: '15s' }} />
//       <Particle style={{ top: '60%', left: '5%', width: '20px', height: '20px', backgroundColor: '#0d9488', animationDuration: '12s', animationDelay: '1s' }} />
//       <Particle style={{ top: '30%', right: '15%', width: '30px', height: '30px', backgroundColor: '#0369a1', animationDuration: '18s', animationDelay: '2s' }} />
//       <Particle style={{ bottom: '20%', right: '10%', width: '25px', height: '25px', backgroundColor: '#1d4ed8', animationDuration: '14s', animationDelay: '3s' }} />

//       {/* Animated waves */}
//       <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-teal-200/30 to-transparent" />

//       {/* Login Form Container */}
//       <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden relative border border-white/20 transform transition-all duration-500 hover:shadow-2xl">
//         {/* Decorative medical ribbon */}
//         <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-400 via-blue-400 to-indigo-400" />

//         {/* Security badge */}
//         <div className="absolute top-4 right-4 bg-teal-100 text-teal-600 p-2 rounded-full shadow-sm">
//           <FaShieldAlt className="text-sm" />
//         </div>

//         <div className="flex flex-col md:flex-row">
//           {/* Left side - Branding */}
//           <div className="bg-gradient-to-br from-teal-500 to-blue-600 text-white p-8 md:w-2/5 relative overflow-hidden">
//             <div className="absolute inset-0 bg-medical-pattern opacity-10" />
//             <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-full" />
//             <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />

//             {/* Top floating medical icons */}
//             <MedicalIcon icon={FaHeartbeat} style={{ top: '15%', left: '20%', animationDuration: '20s', animationDelay: '0s' }} />
//             <MedicalIcon icon={FaStethoscope} style={{ top: '25%', right: '15%', animationDuration: '18s', animationDelay: '2s' }} />
//             <MedicalIcon icon={FaPills} style={{ top: '10%', right: '25%', animationDuration: '22s', animationDelay: '1s' }} />

//             {/* Bottom floating medical icons */}
//             <MedicalIcon icon={FaFlask} style={{ bottom: '15%', left: '15%', animationDuration: '17s', animationDelay: '3s' }} />
//             <MedicalIcon icon={FaXRay} style={{ bottom: '25%', right: '20%', animationDuration: '19s', animationDelay: '4s' }} />
//             <MedicalIcon icon={MdMedicalServices} style={{ bottom: '10%', right: '30%', animationDuration: '21s', animationDelay: '2s' }} />

//             <div className="relative z-10 h-full flex flex-col justify-center items-center pb-8">
//               <div className="text-center">
//                 <div className="flex items-center justify-center mb-4">
//                   <div className="bg-white p-4 rounded-2xl shadow-lg transform transition-transform duration-500 hover:scale-105 animate-pulse">
//                     <FaHospital className="text-5xl text-teal-600" />
//                   </div>
//                 </div>
//                 <h1 className="text-3xl font-bold mb-2">Vaidhya Narayan</h1>
//                 <p className="text-teal-100">Transforming hospitals, clinics, and medical colleges with technology.</p>
//               </div>
//               <div className="mt-4">
//                 <div className="flex items-center justify-center space-x-2 text-teal-200">
//                   <FaHeartbeat className="animate-pulse" />
//                   <span className="text-sm">Serving with care since 2025</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right side - Login Form */}
//           <div className="p-8 md:w-3/5">
//             <div className="text-center mb-6">
//               <h2 className="text-2xl font-bold text-gray-800 mb-2">
//                 <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
//                   {headerRole} Portal
//                 </span>
//               </h2>
//               <p className="text-gray-600">Sign in to access your dashboard</p>
//             </div>

//             {/* ECG top border */}
//             <ECG />

//             {/* Login Form */}
//             <form onSubmit={handleLogin} className="space-y-6">
//               <div>
//                 <label className="block text-sm text-gray-700 font-medium mb-2">Username</label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
//                     <FaUserMd />
//                   </div>
//                   <input
//                     type="text"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className={inputBase + ' pl-10'}
//                     placeholder="Enter username"
//                     required
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm text-gray-700 font-medium mb-2">Password</label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
//                     <FaKey />
//                   </div>
//                   <input
//                     type={showPassword ? 'text' : 'password'}
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     className={inputBase + ' pl-10 pr-10'}
//                     placeholder="Enter password"
//                     required
//                   />
//                   <button
//                     type="button"
//                     aria-label={showPassword ? 'Hide password' : 'Show password'}
//                     className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-teal-500 transition-colors"
//                     onClick={() => setShowPassword(!showPassword)}
//                   >
//                     {showPassword ? <FaEyeSlash /> : <FaEye />}
//                   </button>
//                 </div>
//               </div>

//               {error && (
//                 <div className="bg-red-50 text-red-700 p-3 rounded-xl border border-red-200 animate-shake">
//                   <p className="text-sm">{error}</p>
//                 </div>
//               )}

//               <button type="submit" className={btnTeal + ' w-full py-3 shadow-lg hover:shadow-xl'}>
//                 Sign In
//                 <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
//                 </svg>
//               </button>

//               {/* Forgot Password link */}
//               <div className="flex justify-center">
//                 <button
//                   type="button"
//                   className="text-teal-600 hover:text-teal-800 text-sm font-medium transition-colors duration-200 flex items-center"
//                   onClick={() => {
//                     setShowForgot((v) => !v)
//                     setOtpEmail((prev) => prev || email)
//                   }}
//                 >
//                   <span className="border-b border-dashed border-teal-400 hover:border-teal-600">
//                     Forgot Password?
//                   </span>
//                 </button>
//               </div>
//             </form>

//             {/* Forgot Password (OTP) Section */}
//             {showForgot && (
//               <div className="mt-6 bg-teal-50/80 rounded-xl p-4 text-gray-800 backdrop-blur-sm animate-slide-in border border-teal-200">
//                 <h3 className="text-sm font-semibold mb-3 flex items-center">
//                   <FaKey className="mr-2 text-teal-600" />
//                   Reset Password with OTP
//                 </h3>

//                 <div className="space-y-3">
//                   <div>
//                     <label className="block text-xs mb-1">Email</label>
//                     <input
//                       type="email"
//                       value={otpEmail}
//                       onChange={(e) => setOtpEmail(e.target.value)}
//                       className={inputBase}
//                       placeholder="Enter your email"
//                     />
//                   </div>

//                   {!otpSent ? (
//                     <button
//                       type="button"
//                       onClick={handleSendOtp}
//                       className={btnTeal + ' w-full text-xs py-2'}
//                       disabled={sendingOtp}
//                     >
//                       {sendingOtp ? 'Sending OTP...' : 'Send OTP'}
//                     </button>
//                   ) : (
//                     <>
//                       <div>
//                         <label className="block text-xs mb-1">OTP</label>
//                         <input
//                           type="text"
//                           value={otp}
//                           onChange={(e) => setOtp(e.target.value)}
//                           className={inputBase}
//                           placeholder="Enter OTP"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-xs mb-1">New Password</label>
//                         <input
//                           type="password"
//                           value={newPwd}
//                           onChange={(e) => setNewPwd(e.target.value)}
//                           className={inputBase}
//                           placeholder="Enter new password"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-xs mb-1">Confirm New Password</label>
//                         <input
//                           type="password"
//                           value={confirmPwd}
//                           onChange={(e) => setConfirmPwd(e.target.value)}
//                           className={inputBase}
//                           placeholder="Confirm new password"
//                         />
//                       </div>

//                       <button
//                         type="button"
//                         onClick={handleResetPassword}
//                         className={btnTeal + ' w-full text-xs py-2'}
//                         disabled={resetting}
//                       >
//                         {resetting ? 'Resetting...' : 'Reset Password'}
//                       </button>
//                     </>
//                   )}

//                   {otpStatus && (
//                     <p className={`text-xs mt-2 ${otpStatus.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
//                       {otpStatus}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Role Selection */}
//             <div className="mt-8">
//               <h3 className="text-gray-700 text-center mb-4 font-medium flex items-center justify-center">
//                 <FaUserShield className="mr-2 text-teal-600" />
//                 Select Your Role
//               </h3>

//               <div className="grid grid-cols-3 gap-3">
//                 {roles.map((role) => (
//                   <button
//                     key={role.id}
//                     type="button"
//                     aria-pressed={selectedRole === role.id}
//                     onClick={() => setSelectedRole(role.id)}
//                     className={`p-2 rounded-xl text-white text-xs font-medium transition-all duration-300 transform hover:scale-105 ${
//                       selectedRole === role.id
//                         ? `bg-gradient-to-r ${role.color} ring-2 ring-white ring-opacity-50 shadow-lg`
//                         : `bg-gradient-to-r ${role.color} opacity-80 hover:opacity-100`
//                     }`}
//                   >
//                     <div className="text-center">
//                       <div className="text-lg mb-1">{role.icon}</div>
//                       <div className="text-xs">{role.name}</div>
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Bottom Links */}
//             <div className="mt-8 flex justify-center text-sm">
//               <a href="#" className="text-teal-600 hover:text-teal-800 flex items-center space-x-1 transition-colors duration-200 font-medium">
//                 <FaGlobe />
//                 <span>Visit Our Website</span>
//               </a>
//             </div>

//             {/* ECG bottom border */}
//             <div className="mt-6">
//               <ECG />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Add custom animations */}
//       <style>{`
//         @keyframes float {
//     0% { transform: translateY(0) rotate(0deg); }
//     50% { transform: translateY(-10px) rotate(5deg); }
//     100% { transform: translateY(0) rotate(0deg); }
//   }
//         @keyframes medical-float {
//           0% { transform: translateY(0) rotate(0deg) scale(1); opacity: .25; }
//           33% { transform: translateY(-12px) rotate(5deg) scale(1.06); opacity: .4; }
//           66% { transform: translateY(8px) rotate(-5deg) scale(.95); opacity: .25; }
//           100% { transform: translateY(0) rotate(0deg) scale(1); opacity: .25; }
//         }
//         @keyframes shake {
//           0%, 100% { transform: translateX(0); }
//           10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
//           20%, 40%, 60%, 80% { transform: translateX(5px); }
//         }
//         @keyframes slideIn {
//           from { opacity: 0; transform: translateY(-10px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .animate-float { animation: float 10s ease-in-out infinite; }
//         .animate-medical-float { animation: medical-float 15s ease-in-out infinite; }
//         .animate-shake { animation: shake 0.5s ease-in-out; }
//         .animate-slide-in { animation: slideIn 0.3s ease-out; }
//         .bg-medical-pattern {
//           background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%230e7490' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
//         }
//         .ecg-stroke { stroke-dasharray: 10 6; animation: heartbeat 2.4s ease-in-out infinite; }
//         @keyframes heartbeat {
//           0%, 100% { stroke-dashoffset: 0; }
//           50% { stroke-dashoffset: 28; }
//         }
//       `}</style>
//     </div>
//   )
// }

// export default Login



import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaCrown, FaUserShield, FaUserMd, FaPills, FaFlask, FaXRay,
  FaCalculator, FaClipboardList, FaKey, FaGlobe, FaEye, FaEyeSlash,
  FaStethoscope, FaHeartbeat, FaShieldAlt
} from 'react-icons/fa';
import { MdMedicalServices } from 'react-icons/md';
import img1 from '../assets/img/hmslogo.png'
 
// Define reusable styles
const inputBase =
  "block w-full rounded-xl border-0 bg-white/80 px-4 py-3 text-sm outline-none transition-all duration-300 focus:bg-white focus:ring-2 focus:ring-teal-400 focus:ring-opacity-50 shadow-sm";
const btnBase =
  "inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:-translate-y-0.5";
const btnTeal = `${btnBase} bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700 focus:ring-teal-500 shadow-md hover:shadow-lg`;
const btnGray = `${btnBase} bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-400`;

// 🔒 Lightweight obfuscation helpers (XOR + Base64) for localStorage values
const OBFUSCATION_KEY = 'vaidya_demo_key';
const obfuscate = (plainStr) => {
  try {
    const s = String(plainStr);
    let x = '';
    for (let i = 0; i < s.length; i++) {
      x += String.fromCharCode(s.charCodeAt(i) ^ OBFUSCATION_KEY.charCodeAt(i % OBFUSCATION_KEY.length));
    }
    return btoa(x);
  } catch {
    return '';
  }
};
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

// 🔐 Static dummy credentials per role (unchanged)
const DEMO_CREDS = {
  super_admin: { username: 'vaidhyanarayan@manasa',  password: 'Skanda@2024' },
  admin:       { username: 'admin@demo',       password: 'Admin@123' },
  doctor:      { username: 'doctor@demo',      password: 'Doctor@123' },
  pharmacist:  { username: 'pharmacist@demo',  password: 'Pharma@123' },
  pathologist: { username: 'pathologist@demo', password: 'Patho@123' },
  radiologist: { username: 'radiologist@demo', password: 'Radio@123' },
  accountant:  { username: 'accountant@demo',  password: 'Accounts@123' },
  receptionist:{ username: 'reception@demo',   password: 'Reception@123' },
  nurse:       { username: 'nurse@demo',       password: 'Nurse@123' },
};
 
// Login Component (STATIC / NO BACKEND)
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
 
  // Forgot password (OTP) state
  const [showForgot, setShowForgot] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [resetting, setResetting] = useState(false);
  const [otpStatus, setOtpStatus] = useState('');
  const [expectedOtp, setExpectedOtp] = useState('123456'); // DEMO OTP

  // ---- DEMO BOOKING FORM (localStorage only) ----
  const [demoName, setDemoName] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [demoLocation, setDemoLocation] = useState('');
  const [demoContact, setDemoContact] = useState('');
  const [demoEmail, setDemoEmail] = useState('');
  const [demoSlot, setDemoSlot] = useState('Morning');
  const [demoDate, setDemoDate] = useState('');          // NEW: date
  const [demoTime, setDemoTime] = useState('');
  const [demoMsg, setDemoMsg] = useState('');

  const handleDemoSubmit = (e) => {
    e.preventDefault();
    setDemoMsg('');

    if (!demoName || !clinicName || !demoLocation || !demoContact || !demoEmail || !demoDate || !demoTime) {
      setDemoMsg('Please fill all fields.');
      return;
    }

    const booking = {
      id: `demo-${Date.now()}`,
      name: demoName,
      clinicOrHospital: clinicName,
      location: demoLocation,
      contact: demoContact,
      email: demoEmail,
      slot: demoSlot,
      date: demoDate,                                 // save date
      time: demoTime,
      createdAt: new Date().toISOString(),
    };

    try {
      // Read, deobfuscate, parse
      const raw = localStorage.getItem('demoBookings');
      const existing = raw ? JSON.parse(deobfuscate(raw) || '[]') : [];
      existing.push(booking);
      // Obfuscate before saving
      localStorage.setItem('demoBookings', obfuscate(JSON.stringify(existing)));
      setDemoMsg('✅ Demo session request submitted successfully!');
      setDemoName('');
      setClinicName('');
      setDemoLocation('');
      setDemoContact('');
      setDemoEmail('');
      setDemoSlot('Morning');
      setDemoDate('');
      setDemoTime('');
    } catch {
      setDemoMsg('Something went wrong while saving. Please try again.');
    }
  };

  // 👉 Excel Download (.xls) for Super Admin
  const downloadDemoBookingsAsExcel = () => {
    try {
      const raw = localStorage.getItem('demoBookings');
      const bookings = raw ? JSON.parse(deobfuscate(raw) || '[]') : [];
      if (!bookings || bookings.length === 0) {
        setDemoMsg('No demo bookings found to export.');
        return;
      }

      // Build HTML table (Excel-compatible)
      const headers = [
        'ID','Name','Clinic/Hospital','Location','Contact','Email','Slot','Date','Time','Created At'
      ];
      const escape = (v) =>
        String(v ?? '')
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');

      const rowsHtml = bookings.map(b => `
        <tr>
          <td>${escape(b.id)}</td>
          <td>${escape(b.name)}</td>
          <td>${escape(b.clinicOrHospital)}</td>
          <td>${escape(b.location)}</td>
          <td>${escape(b.contact)}</td>
          <td>${escape(b.email)}</td>
          <td>${escape(b.slot)}</td>
          <td>${escape(b.date)}</td>
          <td>${escape(b.time)}</td>
          <td>${escape(b.createdAt)}</td>
        </tr>
      `).join('');

      const tableHtml = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office"
              xmlns:x="urn:schemas-microsoft-com:office:excel"
              xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <meta charset="UTF-8" />
        </head>
        <body>
          <table border="1">
            <thead>
              <tr>${headers.map(h => `<th>${escape(h)}</th>`).join('')}</tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </body>
        </html>
      `;

      const blob = new Blob([tableHtml], {
        type: 'application/vnd.ms-excel;charset=utf-8'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `demo_bookings_${new Date().toISOString().slice(0,10)}.xls`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setDemoMsg('');
    } catch (e) {
      setDemoMsg('Failed to export Excel.');
    }
  };
 
  // ---- DEMO: Local "login" (validates against static credentials) ----
  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
 
    if (!selectedRole) {
      setError('Please select a role');
      return;
    }
    if (!email || !password) {
      setError('Please enter username and password.');
      return;
    }

    const creds = DEMO_CREDS[selectedRole];
    if (!creds || email !== creds.username || password !== creds.password) {
      setError('Invalid credentials for the selected role.');
      return;
    }
 
    setTimeout(() => {
      // NOTE: token & userRole remain plaintext to avoid breaking other pages that read them
      const dummyToken = 'demo-token-' + Date.now();
      localStorage.setItem('token', dummyToken);
      localStorage.setItem('userRole', selectedRole);
 
      if (['admin', 'super_admin'].includes(selectedRole)) {
        navigate('/admin', { state: { role: selectedRole } });
      } else if (['radiologist', 'pathologist', 'pharmacist'].includes(selectedRole)) {
        navigate('/specialist', { state: { role: selectedRole } });
      } else if (selectedRole === 'receptionist') {
        navigate('/receptionist', { state: { role: selectedRole } });
      } else if (selectedRole === 'doctor') {
        navigate('/doctor', { state: { role: selectedRole } });
      } else if (selectedRole === 'nurse') {
        navigate('/nurse', { state: { role: selectedRole } });
      } else if (selectedRole === 'accountant') {
        navigate('/accountant', { state: { role: selectedRole } });
      } else {
        navigate('/home', { state: { role: selectedRole } });
      }
    }, 400);
  };
 
  // ---- DEMO: Send OTP locally ----
  const handleSendOtp = () => {
    setOtpStatus('');
    if (!otpEmail) {
      setOtpStatus('Please enter your email to receive OTP.');
      return;
    }
    setSendingOtp(true);
    setTimeout(() => {
      const demoOtp = '123456';
      setExpectedOtp(demoOtp);
      setOtpSent(true);
      setOtpStatus(`OTP sent to your email. (Demo OTP: ${demoOtp})`);
      setSendingOtp(false);
    }, 500);
  };
 
  // ---- DEMO: Reset password locally ----
  const handleResetPassword = (e) => {
    e.preventDefault();
    setOtpStatus('');
 
    if (!otp) {
      setOtpStatus('Please enter the OTP sent to your email.');
      return;
    }
    if (otp !== expectedOtp) {
      setOtpStatus('Invalid OTP. Please try again.');
      return;
    }
    if (newPwd.length < 8) {
      setOtpStatus('New password must be at least 8 characters.');
      return;
    }
    if (newPwd !== confirmPwd) {
      setOtpStatus('Passwords do not match.');
      return;
    }
 
    setResetting(true);
    setTimeout(() => {
      setOtpStatus('Password reset successful. You can sign in now.');
      setShowForgot(false);
      setOtp(''); setNewPwd(''); setConfirmPwd('');
      setOtpSent(false);
      setEmail(otpEmail);
      setPassword('');
      setResetting(false);
    }, 500);
  };
 
  const roles = [
    { id: 'super_admin', name: 'Super Admin', color: 'from-teal-500 to-teal-600', icon: <FaCrown /> },
    { id: 'admin', name: 'Admin', color: 'from-blue-500 to-blue-600', icon: <FaUserShield /> },
    { id: 'doctor', name: 'Doctor', color: 'from-green-500 to-green-600', icon: <FaUserMd /> },
    { id: 'pharmacist', name: 'Pharmacist', color: 'from-cyan-500 to-cyan-600', icon: <FaPills /> },
    { id: 'pathologist', name: 'Pathologist', color: 'from-purple-500 to-purple-600', icon: <FaFlask /> },
    { id: 'radiologist', name: 'Radiologist', color: 'from-red-500 to-red-600', icon: <FaXRay /> },
    { id: 'accountant', name: 'Accountant', color: 'from-indigo-500 to-indigo-600', icon: <FaCalculator /> },
    { id: 'receptionist', name: 'Receptionist', color: 'from-teal-400 to-teal-500', icon: <FaClipboardList /> },
    { id: 'nurse', name: 'Nurse', color: 'from-blue-400 to-blue-500', icon: <MdMedicalServices /> },
  ];
 
  const roleDisplayNameById = {
    super_admin: 'Super Admin',
    admin: 'Admin',
    doctor: 'Doctor',
    pharmacist: 'Pharmacist',
    pathologist: 'Pathologist',
    radiologist: 'Radiologist',
    accountant: 'Accountant',
    receptionist: 'Receptionist',
    nurse: 'Nurse',
  };
  const headerRole = selectedRole ? roleDisplayNameById[selectedRole] : 'Medical Professional';
 
  // Floating particles for background
  const Particle = ({ style }) => (
    <div className="absolute rounded-full opacity-20 animate-float" style={style} />
  );
 
  // Medical icons for animation
  const MedicalIcon = ({ icon: Icon, style }) => (
    <div className="absolute text-white/30 animate-medical-float" style={style}>
      <Icon className="text-2xl" />
    </div>
  );
 
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-blue-100 to-indigo-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Ccircle cx=%2250%22 cy=%2250%22 r=%224%22 fill=%22%230e7490%22/%3E%3C/svg%3E')] bg-repeat bg-[length:100px_100px]"></div>
     
      {/* Floating particles */}
      <Particle style={{ top: '20%', left: '10%', width: '40px', height: '40px', backgroundColor: '#0e7490', animationDuration: '15s' }} />
      <Particle style={{ top: '60%', left: '5%', width: '20px', height: '20px', backgroundColor: '#0d9488', animationDuration: '12s', animationDelay: '1s' }} />
      <Particle style={{ top: '30%', right: '15%', width: '30px', height: '30px', backgroundColor: '#0369a1', animationDuration: '18s', animationDelay: '2s' }} />
      <Particle style={{ bottom: '20%', right: '10%', width: '25px', height: '25px', backgroundColor: '#1d4ed8', animationDuration: '14s', animationDelay: '3s' }} />
     
      {/* Animated waves */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-teal-200/30 to-transparent"></div>
 
      {/* Login Form Container */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden relative border border-white/20 transform transition-all duration-500 hover:shadow-2xl">
        {/* Decorative medical ribbon */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-400 via-blue-400 to-indigo-400"></div>
       
        {/* Security badge */}
        <div className="absolute top-4 right-4 bg-teal-100 text-teal-600 p-2 rounded-full shadow-sm">
          <FaShieldAlt className="text-sm" />
        </div>
 
        <div className="flex flex-col md:flex-row">
          {/* Left side - Branding + Demo Booking */}
          <div className="bg-gradient-to-br from-teal-500 to-blue-600 text-white p-6 md:p-8 md:w-2/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-medical-pattern opacity-10"></div>
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-full"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full"></div>
           
            {/* Top floating medical icons */}
            <MedicalIcon icon={FaHeartbeat} style={{ top: '15%', left: '20%', animationDuration: '20s', animationDelay: '0s' }} />
            <MedicalIcon icon={FaStethoscope} style={{ top: '25%', right: '15%', animationDuration: '18s', animationDelay: '2s' }} />
            <MedicalIcon icon={FaPills} style={{ top: '10%', right: '25%', animationDuration: '22s', animationDelay: '1s' }} />
           
            {/* Bottom floating medical icons */}
            <MedicalIcon icon={FaFlask} style={{ bottom: '15%', left: '15%', animationDuration: '17s', animationDelay: '3s' }} />
            <MedicalIcon icon={FaXRay} style={{ bottom: '25%', right: '20%', animationDuration: '19s', animationDelay: '4s' }} />
            <MedicalIcon icon={MdMedicalServices} style={{ bottom: '10%', right: '30%', animationDuration: '21s', animationDelay: '2s' }} />
           
            <div className="relative z-10 h-full flex flex-col justify-start items-stretch pb-4">
              {/* Logo / Title */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-4">
  <div className="bg-white rounded-2xl shadow-lg transform transition-transform duration-500 hover:scale-105 animate-pulse">
    <img
      src={img1}
      alt="HMS Logo"
      className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 object-contain"
    />
  </div>
</div>


                <h1 className="text-3xl sm:text-4xl font-bold mb-1">Vaidhya Narayan</h1>
                <p className="text-teal-100">Secure Healthcare Management System</p>
              </div>

              {/* Demo Booking Form */}
              <div className="bg-white/10 rounded-2xl p-4 md:p-5 shadow-sm border border-white/20 max-h-[60vh] overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4 text-center md:text-left">Book for Demo Session</h3>

                {/* 👑 Super Admin — Excel download button */}
                {selectedRole === 'super_admin' && (
                  <div className="mb-3">
                    <button onClick={downloadDemoBookingsAsExcel} type="button" className="w-full rounded-xl bg-white/90 text-teal-700 font-semibold py-2 shadow hover:shadow-md hover:bg-white transition-all">
                      Download Demo Bookings (.xls)
                    </button>
                  </div>
                )}

                <form className="space-y-4" onSubmit={handleDemoSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-teal-100 mb-1">Person Name</label>
                      <input
                        type="text"
                        value={demoName}
                        onChange={(e) => setDemoName(e.target.value)}
                        className="w-full rounded-xl px-3 py-2 text-sm text-gray-900 border-0 focus:ring-2 focus:ring-white/60"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-teal-100 mb-1">Clinic / Hospital Name</label>
                      <input
                        type="text"
                        value={clinicName}
                        onChange={(e) => setClinicName(e.target.value)}
                        className="w-full rounded-xl px-3 py-2 text-sm text-gray-900 border-0 focus:ring-2 focus:ring-white/60"
                        placeholder="Enter clinic or hospital"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-teal-100 mb-1">Location</label>
                      <input
                        type="text"
                        value={demoLocation}
                        onChange={(e) => setDemoLocation(e.target.value)}
                        className="w-full rounded-xl px-3 py-2 text-sm text-gray-900 border-0 focus:ring-2 focus:ring-white/60"
                        placeholder="City / Area"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-teal-100 mb-1">Contact</label>
                      <input
                        type="tel"
                        value={demoContact}
                        onChange={(e) => setDemoContact(e.target.value)}
                        className="w-full rounded-xl px-3 py-2 text-sm text-gray-900 border-0 focus:ring-2 focus:ring-white/60"
                        placeholder="Phone number"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-teal-100 mb-1">Email</label>
                      <input
                        type="email"
                        value={demoEmail}
                        onChange={(e) => setDemoEmail(e.target.value)}
                        className="w-full rounded-xl px-3 py-2 text-sm text-gray-900 border-0 focus:ring-2 focus:ring-white/60"
                        placeholder="Email address"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-teal-100 mb-1">Slot</label>
                      <select
                        value={demoSlot}
                        onChange={(e) => setDemoSlot(e.target.value)}
                        className="w-full rounded-xl px-3 py-2 text-sm text-gray-900 border-0 focus:ring-2 focus:ring-white/60"
                      >
                        <option>Morning</option>
                        <option>Afternoon</option>
                        <option>Evening</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-teal-100 mb-1">Preferred Date</label>
                      <input
                        type="date"
                        value={demoDate}
                        onChange={(e) => setDemoDate(e.target.value)}
                        className="w-full rounded-xl px-3 py-2 text-sm text-gray-900 border-0 focus:ring-2 focus:ring-white/60"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-teal-100 mb-1">Time</label>
                      <input
                        type="time"
                        value={demoTime}
                        onChange={(e) => setDemoTime(e.target.value)}
                        className="w-full rounded-xl px-3 py-2 text-sm text-gray-900 border-0 focus:ring-2 focus:ring-white/60"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-white text-teal-700 font-semibold py-2.5 shadow hover:shadow-md hover:bg-white/90 transition-all"
                  >
                    Submit
                  </button>

                  {demoMsg && (
                    <p className={`text-xs mt-2 ${demoMsg.startsWith('✅') ? 'text-green-100' : 'text-yellow-100'}`}>
                      {demoMsg}
                    </p>
                  )}
                </form>
              </div>
            </div>
          </div>
 
          {/* Right side - Login Form */}
          <div className="p-8 md:w-3/5">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                  {headerRole} Portal
                </span>
              </h2>
              <p className="text-gray-600">Sign in to access your dashboard</p>
            </div>
 
            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm text-gray-700 font-medium mb-2">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <FaUserMd />
                  </div>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputBase + " pl-10"}
                    placeholder="Enter username"
                    required
                  />
                </div>
              </div>
 
              <div>
                <label className="block text-sm text-gray-700 font-medium mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <FaKey />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={inputBase + " pl-10 pr-10"}
                    placeholder="Enter password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-teal-500 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
 
              {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded-xl border border-red-200 animate-shake">
                  <p className="text-sm">{error}</p>
                </div>
              )}
 
              <button
                type="submit"
                className={btnTeal + " w-full py-3 shadow-lg hover:shadow-xl"}
              >
                Sign In
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                </svg>
              </button>
 
              {/* Forgot Password link */}
              <div className="flex justify-center">
                <button
                  type="button"
                  className="text-teal-600 hover:text-teal-800 text-sm font-medium transition-colors duration-200 flex items-center"
                  onClick={() => {
                    setShowForgot((v) => !v);
                    setOtpEmail((prev) => prev || email);
                  }}
                >
                  <span className="border-b border-dashed border-teal-400 hover:border-teal-600">
                    Forgot Password?
                  </span>
                </button>
              </div>
            </form>
 
            {/* Forgot Password (OTP) Section */}
            {showForgot && (
              <div className="mt-6 bg-teal-50/80 rounded-xl p-4 text-gray-800 backdrop-blur-sm animate-slide-in border border-teal-200">
                <h3 className="text-sm font-semibold mb-3 flex items-center">
                  <FaKey className="mr-2 text-teal-600" />
                  Reset Password with OTP
                </h3>
 
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs mb-1">Email</label>
                    <input
                      type="email"
                      value={otpEmail}
                      onChange={(e) => setOtpEmail(e.target.value)}
                      className={inputBase}
                      placeholder="Enter your email"
                    />
                  </div>
 
                  {!otpSent ? (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className={btnTeal + " w-full text-xs py-2"}
                      disabled={sendingOtp}
                    >
                      {sendingOtp ? 'Sending OTP...' : 'Send OTP'}
                    </button>
                  ) : (
                    <>
                      <div>
                        <label className="block text-xs mb-1">OTP</label>
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className={inputBase}
                          placeholder="Enter OTP"
                        />
                      </div>
 
                      <div>
                        <label className="block text-xs mb-1">New Password</label>
                        <input
                          type="password"
                          value={newPwd}
                          onChange={(e) => setNewPwd(e.target.value)}
                          className={inputBase}
                          placeholder="Enter new password"
                        />
                      </div>
 
                      <div>
                        <label className="block text-xs mb-1">Confirm New Password</label>
                        <input
                          type="password"
                          value={confirmPwd}
                          onChange={(e) => setConfirmPwd(e.target.value)}
                          className={inputBase}
                          placeholder="Confirm new password"
                        />
                      </div>
 
                      <button
                        type="button"
                        onClick={handleResetPassword}
                        className={btnTeal + " w-full text-xs py-2"}
                        disabled={resetting}
                      >
                        {resetting ? 'Resetting...' : 'Reset Password'}
                      </button>
                    </>
                  )}
 
                  {otpStatus && (
                    <p className={`text-xs mt-2 ${otpStatus.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
                      {otpStatus}
                    </p>
                  )}
                </div>
              </div>
            )}
 
            {/* Role Selection */}
            <div className="mt-8">
              <h3 className="text-gray-700 text-center mb-4 font-medium flex items-center justify-center">
                <FaUserShield className="mr-2 text-teal-600" />
                Select Your Role
              </h3>
 
              {/* ⬆️ Fully responsive grid on mobile */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    aria-pressed={selectedRole === role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`p-2 rounded-xl text-white text-xs font-medium transition-all duration-300 transform hover:scale-105 ${
                      selectedRole === role.id
                        ? `bg-gradient-to-r ${role.color} ring-2 ring-white ring-opacity-50 shadow-lg`
                        : `bg-gradient-to-r ${role.color} opacity-80 hover:opacity-100`
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-lg mb-1">{role.icon}</div>
                      <div className="text-xs">{role.name}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
 
            {/* Bottom Links */}
            <div className="mt-8 flex justify-center text-sm">
              <a href="#" className="text-teal-600 hover:text-teal-800 flex items-center space-x-1 transition-colors duration-200 font-medium">
                <FaGlobe />
                <span>Visit Our Website</span>
              </a>
            </div>
          </div>
        </div>
      </div>
 
      {/* Add custom animations */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }
        @keyframes medical-float {
          0% { transform: translateY(0) rotate(0deg) scale(1); opacity: 0.3; }
          33% { transform: translateY(-15px) rotate(5deg) scale(1.1); opacity: 0.4; }
          66% { transform: translateY(10px) rotate(-5deg) scale(0.9); opacity: 0.25; }
          100% { transform: translateY(0) rotate(0deg) scale(1); opacity: 0.3; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float { animation: float 10s ease-in-out infinite; }
        .animate-medical-float { animation: medical-float 15s ease-in-out infinite; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
        .animate-slide-in { animation: slideIn 0.3s ease-out; }
        .bg-medical-pattern {
          background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%230e7490' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
        }
      `}</style>
    </div>
  );
};
 
export default Login;
