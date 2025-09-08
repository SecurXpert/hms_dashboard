// import React, { useState } from 'react';
 
// const API_BASE = 'http://192.168.0.114:8000';
 
// const Conversion = ({ onClose, onSaved }) => {
//   const [name, setName] = useState('');
//   const [guardianName, setGuardianName] = useState('');
//   const [gender, setGender] = useState('');
//   const [dateOfBirth, setDateOfBirth] = useState('');
//   const [age, setAge] = useState('');
//   const [bloodGroup, setBloodGroup] = useState('');
//   const [maritalStatus, setMaritalStatus] = useState('');
//   const [phone, setPhone] = useState('');
//   const [remarks, setRemarks] = useState('');
//   const [email, setEmail] = useState('');
//   const [location, setLocation] = useState('');
//   const [admissionDate, setAdmissionDate] = useState('');
//   const [department, setDepartment] = useState('');
//   const [isEmergency, setIsEmergency] = useState(false);
//   const [observation, setObservation] = useState('');
//   const [totalAmount, setTotalAmount] = useState('');
//   const [paid, setPaid] = useState('');
//   const [credit, setCredit] = useState('');
//   const [discount, setDiscount] = useState('');
//   const [bedNo, setBedNo] = useState('');
//   const [floor, setFloor] = useState('');
//   const [visitorName, setVisitorName] = useState('');
//   const [visitorPhone, setVisitorPhone] = useState('');
//   const [isTpa, setIsTpa] = useState(false);
//   const [tpaNumber, setTpaNumber] = useState('');
//   const [tpaId, setTpaId] = useState('');
//   const [error, setError] = useState('');
//   const [saving, setSaving] = useState(false);
 
//   const authHeaders = () => ({
//     Authorization: `Bearer ${localStorage.getItem('token')}`,
//     'Content-Type zes.': 'application/json',
//     Accept: 'application/json',
//   });
 
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const action = e?.nativeEvent?.submitter?.dataset?.action || 'save';
//     setSaving(true);
//     setError('');
 
//     const patientData = {
//       name,
//       guardian_name: guardianName,
//       gender,
//       dob: dateOfBirth,
//       age,
//       blood_group: bloodGroup,
//       marital_status: maritalStatus,
//       phone,
//       email,
//       location,
//       remarks,
//       admission_date: admissionDate,
//       department,
//       is_emergency: isEmergency,
//       observation,
//       total_amount: totalAmount,
//       paid,
//       credit,
//       discount,
//       bed_no: bedNo,
//       floor,
//       visitor_name: visitorName,
//       visitor_phone: visitorPhone,
//       is_tpa: isTpa,
//       tpa_number: isTpa ? tpaNumber : null,
//       tpa_id: isTpa ? tpaId : null,
//     };
 
//     try {
//       const res = await fetch(`${API_BASE}/api/v1/patients`, {
//         method: 'POST',
//         headers: authHeaders(),
//         body: JSON.stringify(patientData),
//       });
//       if (!res.ok) {
//         const t = await res.text();
//         throw new Error(t || 'Create failed');
//       }
//       const created = await res.json();
 
//       if (action === 'next' && onSaved) {
//         onSaved(created);
//       } else {
//         onClose?.();
//       }
//     } catch (error) {
//       console.error('Error creating patient:', error);
//       setError(error.message || 'Failed to create patient.');
//     } finally {
//       setSaving(false);
//     }
//   };
 
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white shadow-lg rounded-lg max-w-4xl w-full flex flex-col max-h-[80vh]">
//         <div className="flex justify-between items-center mb-4 bg-blue-500 text-white p-2 rounded-t-lg">
//           <h2 className="text-xl font-bold">New IPD Patient</h2>
//           <button className="text-white text-2xl" onClick={onClose}>×</button>
//         </div>
 
//         {error && <p className="text-red-500 mb-4 px-6">{error}</p>}
 
//         <div className="flex-1 overflow-y-auto p-6">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Patient Details Card */}
//             <div className="bg-gray-50 p-4 rounded-md">
//               <h3 className="text-lg font-semibold mb-4">Patient Details</h3>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Patient Name *</label>
//                   <input
//                     type="text"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                     className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Guardian Name</label>
//                   <input
//                     type="text"
//                     value={guardianName}
//                     onChange={(e) => setGuardianName(e.target.value)}
//                     className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Gender *</label>
//                   <select
//                     value={gender}
//                     onChange={(e) => setGender(e.target.value)}
//                     className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     required
//                   >
//                     <option value="">Select</option>
//                     <option value="male">Male</option>
//                     <option value="female">Female</option>
//                     <option value="other">Other</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Date Of Birth</label>
//                   <input
//                     type="date"
//                     value={dateOfBirth}
//                     onChange={(e) => setDateOfBirth(e.target.value)}
//                     className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Age *</label>
//                   <input
//                     type="text"
//                     value={age}
//                     onChange={(e) => setAge(e.target.value)}
//                     className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Blood Group</label>
//                   <select
//                     value={bloodGroup}
//                     onChange={(e) => setBloodGroup(e.target.value)}
//                     className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">Select</option>
//                     <option value="A+">A+</option>
//                     <option value="A-">A-</option>
//                     <option value="B+">B+</option>
//                     <option value="B-">B-</option>
//                     <option value="AB+">AB+</option>
//                     <option value="AB-">AB-</option>
//                     <option value="O+">O+</option>
//                     <option value="O-">O-</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Marital Status</label>
//                   <select
//                     value={maritalStatus}
//                     onChange={(e) => setMaritalStatus(e.target.value)}
//                     className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">Select</option>
//                     <option value="single">Single</option>
//                     <option value="married">Married</option>
//                     <option value="divorced">Divorced</option>
//                     <option value="widowed">Widowed</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
//                   <input
//                     type="text"
//                     value={phone}
//                     onChange={(e) => setPhone(e.target.value)}
//                     className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Email</label>
//                   <input
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Location</label>
//                   <input
//                     type="text"
//                     value={location}
//                     onChange={(e) => setLocation(e.target.value)}
//                     className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Admission Date *</label>
//                   <input
//                     type="date"
//                     value={admissionDate}
//                     onChange={(e) => setAdmissionDate(e.target.value)}
//                     className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Department *</label>
//                   <select
//                     value={department}
//                     onChange={(e) => setDepartment(e.target.value)}
//                     className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     required
//                   >
//                     <option value="">Select</option>
//                     <option value="general_medicine">General Medicine</option>
//                     <option value="surgery">Surgery</option>
//                     <option value="pediatrics">Pediatrics</option>
//                     <option value="orthopedics">Orthopedics</option>
//                     <option value="cardiology">Cardiology</option>
//                     <option value="neurology">Neurology</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Emergency</label>
//                   <input
//                     type="checkbox"
//                     checked={isEmergency}
//                     onChange={(e) => setIsEmergency(e.target.checked)}
//                     className="mt-1 w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Total Amount</label>
//                   <input
//                     type="number"
//                     value={totalAmount}
//                     onChange={(e) => setTotalAmount(e.target.value)}
//                     className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     min="0"
//                     step="0.01"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Paid</label>
//                   <input
//                     type="number"
//                     value={paid}
//                     onChange={(e) => setPaid(e.target.value)}
//                     className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     min="0"
//                     step="0.01"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Credit</label>
//                   <input
//                     type="number"
//                     value={credit}
//                     onChange={(e) => setCredit(e.target.value)}
//                     className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     min="0"
//                     step="0.01"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Discount</label>
//                   <input
//                     type="number"
//                     value={discount}
//                     onChange={(e) => setDiscount(e.target.value)}
//                     className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     min="0"
//                     step="0.01"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Bed No.</label>
//                   <input
//                     type="text"
//                     value={bedNo}
//                     onChange={(e) => setBedNo(e.target.value)}
//                     className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Floor</label>
//                   <input
//                     type="text"
//                     value={floor}
//                     onChange={(e) => setFloor(e.target.value)}
//                     className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div className="md:col-span-3">
//                   <label className="block text-sm font-medium text-gray-700">Reason</label>
//                   <textarea
//                     value={remarks}
//                     onChange={(e) => setRemarks(e.target.value)}
//                     rows={4}
//                     className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
//                     placeholder="Enter reason here..."
//                   />
//                 </div>
//                 <div className="md:col-span-3">
//                   <label className="block text-sm font-medium text-gray-700">Observation</label>
//                   <textarea
//                     value={observation}
//                     onChange={(e) => setObservation(e.target.value)}
//                     rows={4}
//                     className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
//                     placeholder="Enter observation notes here..."
//                   />
//                 </div>
//               </div>
//             </div>
 
//             {/* Visitor Details Card */}
//             <div className="bg-gray-50 p-4 rounded-md">
//               <h3 className="text-lg font-semibold mb-4">Visitor Details</h3>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Visitor Name</label>
//                   <input
//                     type="text"
//                     value={visitorName}
//                     onChange={(e) => setVisitorName(e.target.value)}
//                     className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Visitor Phone Number</label>
//                   <input
//                     type="text"
//                     value={visitorPhone}
//                     onChange={(e) => setVisitorPhone(e.target.value)}
//                     className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">TPA</label>
//                   <input
//                     type="checkbox"
//                     checked={isTpa}
//                     onChange={(e) => setIsTpa(e.target.checked)}
//                     className="mt-1 w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
//                   />
//                 </div>
//                 {isTpa && (
//                   <>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700">TPA Number</label>
//                       <input
//                         type="text"
//                         value={tpaNumber}
//                         onChange={(e) => setTpaNumber(e.target.value)}
//                         className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700">TPA ID</label>
//                       <input
//                         type="text"
//                         value={tpaId}
//                         onChange={(e) => setTpaId(e.target.value)}
//                         className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       />
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>
 
//             <div className="flex items-center justify-end gap-2 pt-4">
//               <button
//                 type="submit"
//                 data-action="save"
//                 className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200 transition duration-200"
//                 disabled={saving}
//               >
//                 {saving ? 'Saving...' : 'Save'}
//               </button>
//               <button
//                 type="submit"
//                 data-action="next"
//                 className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
//                 disabled={saving}
//               >
//                 {saving ? 'Saving...' : 'Save & Next'}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };
 
 
// export default Conversion;

// import React, { useEffect, useState } from 'react';

// const API_BASE = 'http://192.168.0.114:8000';

// const Conversion = ({ onClose, onSaved }) => {
//   // Lookup by Patient ID
//   const [patientId, setPatientId] = useState('');

//   // Patient master fields (auto-fill)
//   const [name, setName] = useState('');
//   const [guardianName, setGuardianName] = useState('');
//   const [gender, setGender] = useState('');
//   const [dateOfBirth, setDateOfBirth] = useState('');
//   const [age, setAge] = useState('');
//   const [bloodGroup, setBloodGroup] = useState('');
//   const [maritalStatus, setMaritalStatus] = useState('');
//   const [phone, setPhone] = useState('');
//   const [email, setEmail] = useState('');
//   const [location, setLocation] = useState('');
//   const [aadhar, setAadhar] = useState('');
//   const [medicalHistory, setMedicalHistory] = useState('');
//   const [medicalFile, setMedicalFile] = useState(null);

//   // Admission fields
//   const [admissionDate, setAdmissionDate] = useState('');
//   const [department, setDepartment] = useState('');
//   const [reason, setReason] = useState('');
//   const [reasonType, setReasonType] = useState('emergency');
//   const [observation, setObservation] = useState('');
//   const [isEmergency, setIsEmergency] = useState(false);

//   // Financial / bed
//   const [reference, setReference] = useState('');
//   const [totalAmount, setTotalAmount] = useState('');
//   const [paid, setPaid] = useState('');
//   const [credit, setCredit] = useState('');
//   const [discount, setDiscount] = useState('');
//   const [bedNo, setBedNo] = useState('');
//   const [floor, setFloor] = useState('');
//   const [ward, setWard] = useState('');

//   // Visitor
//   const [visitorName, setVisitorName] = useState('');
//   const [visitorPhone, setVisitorPhone] = useState('');

//   // TPA
//   const [isTpa, setIsTpa] = useState(false);
//   const [tpaName, setTpaName] = useState('');
//   const [tpaIdNumber, setTpaIdNumber] = useState('');

//   // UI state
//   const [error, setError] = useState('');
//   const [saving, setSaving] = useState(false);
//   const [loadingPatient, setLoadingPatient] = useState(false);
//   const [lookupMsg, setLookupMsg] = useState('');

//   const authHeaders = () => ({
//     Authorization: `Bearer ${localStorage.getItem('token')}`,
//     'Content-Type': 'application/json',
//     Accept: 'application/json',
//   });

//   // Auto-derive emergency flag from reasonType
//   useEffect(() => {
//     setIsEmergency(reasonType === 'emergency');
//   }, [reasonType]);

//   // Fetch patient details when patientId changes (debounced)
//   useEffect(() => {
//     if (!patientId) {
//       setLookupMsg('');
//       return;
//     }
//     const id = String(patientId).trim();
//     if (!id) return;

//     const handle = setTimeout(async () => {
//       try {
//         setLoadingPatient(true);
//         setLookupMsg('Looking up patient...');
//         const res = await fetch(`${API_BASE}/api/v1/patients/${encodeURIComponent(id)}`, {
//           headers: authHeaders(),
//         });
//         if (!res.ok) {
//           setLookupMsg('Patient not found.');
//           setLoadingPatient(false);
//           return;
//         }
//         const p = await res.json();

//         // Fill fields
//         setName(p.name || '');
//         setGuardianName(p.guardian_name || '');
//         setGender(p.gender || '');
//         setDateOfBirth(p.dob || '');
//         setAge(p.age != null ? String(p.age) : '');
//         setBloodGroup(p.blood_group || '');
//         setMaritalStatus(p.marital_status || '');
//         setPhone(p.phone || '');
//         setEmail(p.email || '');
//         setLocation(p.location || '');
//         setAadhar(p.aadhar || p.aadhaar || '');
//         setMedicalHistory(p.medical_history || '');

//         setLookupMsg('Patient loaded.');
//       } catch (e) {
//         console.error('Error fetching patient:', e);
//         setLookupMsg('Failed to fetch patient.');
//       } finally {
//         setLoadingPatient(false);
//       }
//     }, 500);

//     return () => clearTimeout(handle);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [patientId]);

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       // Optional: Add file size/type validation
//       const maxSize = 5 * 1024 * 1024; // 5MB
//       if (file.size > maxSize) {
//         setError('File size exceeds 5MB limit.');
//         setMedicalFile(null);
//         return;
//       }
//       const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
//       if (!allowedTypes.includes(file.type)) {
//         setError('Invalid file type. Allowed: PDF, DOC, DOCX, JPG, PNG.');
//         setMedicalFile(null);
//         return;
//       }
//       setMedicalFile(file);
//     } else {
//       setMedicalFile(null);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const action = e?.nativeEvent?.submitter?.dataset?.action || 'save';
//     setSaving(true);
//     setError('');

//     const formData = new FormData();
//     formData.append('patient_id', patientId ? Number(patientId) : '');
//     formData.append('name', name);
//     formData.append('guardian_name', guardianName);
//     formData.append('gender', gender);
//     formData.append('dob', dateOfBirth);
//     formData.append('age', age);
//     formData.append('blood_group', bloodGroup);
//     formData.append('marital_status', maritalStatus);
//     formData.append('phone', phone);
//     formData.append('email', email);
//     formData.append('location', location);
//     formData.append('aadhar', aadhar);
//     formData.append('medical_history', medicalHistory);
//     if (medicalFile) {
//       formData.append('medical_file', medicalFile);
//     }
//     formData.append('admission_date', admissionDate);
//     formData.append('department', department);
//     formData.append('reason', reason);
//     formData.append('is_emergency', isEmergency);
//     formData.append('reason_type', reasonType);
//     formData.append('observation', observation);
//     formData.append('reference', reference);
//     formData.append('total_amount', totalAmount);
//     formData.append('paid', paid);
//     formData.append('credit', credit);
//     formData.append('discount', discount);
//     formData.append('bed_no', bedNo);
//     formData.append('floor', floor);
//     formData.append('ward', ward);
//     formData.append('visitor_name', visitorName);
//     formData.append('visitor_phone', visitorPhone);
//     formData.append('is_tpa', isTpa);
//     formData.append('tpa_name', isTpa ? tpaName : '');
//     formData.append('tpa_id_number', isTpa ? tpaIdNumber : '');

//     try {
//       const res = await fetch(`${API_BASE}/api/v1/patients`, {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//         body: formData,
//       });
//       if (!res.ok) {
//         const t = await res.text();
//         throw new Error(t || 'Create failed');
//       }
//       const created = await res.json();

//       if (action === 'next' && onSaved) {
//         onSaved(created);
//       } else {
//         onClose?.();
//       }
//     } catch (error) {
//       console.error('Error creating patient:', error);
//       setError(error.message || 'Failed to create patient.');
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white shadow-lg rounded-lg max-w-5xl w-full flex flex-col max-h-[85vh]">
//         <div className="flex justify-between items-center bg-blue-500 text-white p-3 rounded-t-lg">
//           <h2 className="text-lg font-semibold">New OPD-IPD Patient</h2>
//           <button className="text-white text-2xl leading-none" onClick={onClose}>×</button>
//         </div>

//         {error && <p className="text-red-600 px-6 py-2 text-sm">{error}</p>}

//         <div className="flex-1 overflow-y-auto p-6 space-y-6">
//           {/* Lookup / Patient ID */}
//           <div className="bg-gray-50 p-4 rounded-md">
//             <h3 className="text-base font-semibold mb-3">Patient Lookup</h3>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Patient ID</label>
//                 <input
//                   type="number"
//                   value={patientId}
//                   onChange={(e) => setPatientId(e.target.value)}
//                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="Enter existing Patient ID to auto-fill"
//                 />
//               </div>
//               <div className="md:col-span-2">
//                 <div className="text-xs text-gray-600">
//                   {loadingPatient ? 'Fetching patient…' : lookupMsg}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Patient Details */}
//           <div className="bg-gray-50 p-4 rounded-md">
//             <h3 className="text-base font-semibold mb-4">Patient Details</h3>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Patient Name *</label>
//                 <input
//                   type="text"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Guardian Name</label>
//                 <input
//                   type="text"
//                   value={guardianName}
//                   onChange={(e) => setGuardianName(e.target.value)}
//                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Gender *</label>
//                 <select
//                   value={gender}
//                   onChange={(e) => setGender(e.target.value)}
//                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 >
//                   <option value="">Select</option>
//                   <option value="male">Male</option>
//                   <option value="female">Female</option>
//                   <option value="other">Other</option>
//                 </select>
//               </div>
             
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Age *</label>
//                 <input
//                   type="text"
//                   value={age}
//                   onChange={(e) => setAge(e.target.value)}
//                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Blood Group</label>
//                 <select
//                   value={bloodGroup}
//                   onChange={(e) => setBloodGroup(e.target.value)}
//                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="">Select</option>
//                   <option value="A+">A+</option>
//                   <option value="A-">A-</option>
//                   <option value="B+">B+</option>
//                   <option value="B-">B-</option>
//                   <option value="AB+">AB+</option>
//                   <option value="AB-">AB-</option>
//                   <option value="O+">O+</option>
//                   <option value="O-">O-</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Marital Status</label>
//                 <select
//                   value={maritalStatus}
//                   onChange={(e) => setMaritalStatus(e.target.value)}
//                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="">Select</option>
//                   <option value="single">Single</option>
//                   <option value="married">Married</option>
//                   <option value="divorced">Divorced</option>
//                   <option value="widowed">Widowed</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
//                 <input
//                   type="text"
//                   value={phone}
//                   onChange={(e) => setPhone(e.target.value)}
//                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 />
//               </div>
             
             
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Aadhaar Card</label>
//                 <input
//                   type="text"
//                   value={aadhar}
//                   onChange={(e) => setAadhar(e.target.value)}
//                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="12-digit Aadhaar number"
//                 />
//               </div>
//               <div className="md:col-span-3">
//                 <label className="block text-sm font-medium text-gray-700">Previous Medical History</label>
//                 <textarea
//                   value={medicalHistory}
//                   onChange={(e) => setMedicalHistory(e.target.value)}
//                   rows={3}
//                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
//                   placeholder="Enter previous medical history (e.g., conditions, surgeries, allergies)"
//                 />
//               </div>
//               <div className="md:col-span-3">
//                 <label className="block text-sm font-medium text-gray-700">Upload Medical History Document</label>
//                 <input
//                   type="file"
//                   onChange={handleFileChange}
//                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   accept=".pdf,.doc,.docx,.jpg,.png"
//                 />
//                 {medicalFile && (
//                   <p className="mt-1 text-sm text-gray-600">Selected: {medicalFile.name} ({(medicalFile.size / 1024).toFixed(2)} KB)</p>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Admission Details */}
//           <div className="bg-gray-50 p-4 rounded-md">
//             <h3 className="text-base font-semibold mb-4">Admission Details</h3>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Admission Date *</label>
//                 <input
//                   type="date"
//                   value={admissionDate}
//                   onChange={(e) => setAdmissionDate(e.target.value)}
//                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Department *</label>
//                 <select
//                   value={department}
//                   onChange={(e) => setDepartment(e.target.value)}
//                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 >
//                   <option value="">Select</option>
//                   <option value="general_medicine">General Medicine</option>
//                   <option value="surgery">Surgery</option>
//                   <option value="pediatrics">Pediatrics</option>
//                   <option value="orthopedics">Orthopedics</option>
//                   <option value="cardiology">Cardiology</option>
//                   <option value="neurology">Neurology</option>
//                 </select>
//               </div>
//               <div className="md:col-span-3">
//                 <label className="block text-sm font-medium text-gray-700">Reason for Admission</label>
//                 <textarea
//                   value={reason}
//                   onChange={(e) => setReason(e.target.value)}
//                   rows={3}
//                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
//                   placeholder="Enter reason here..."
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Reason Type</label>
//                 <select
//                   value={reasonType}
//                   onChange={(e) => setReasonType(e.target.value)}
//                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="emergency">Emergency</option>
//                   <option value="observation">Observation</option>
//                 </select>
//               </div>
//               {reasonType === 'observation' && (
//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700">Observation Notes</label>
//                   <textarea
//                     value={observation}
//                     onChange={(e) => setObservation(e.target.value)}
//                     rows={3}
//                     className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
//                     placeholder="Enter observation notes..."
//                   />
//                 </div>
//               )}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Reference</label>
//                 <input
//                   type="text"
//                   value={reference}
//                   onChange={(e) => setReference(e.target.value)}
//                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="Referred by / Reference"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Total Amount</label>
//                 <input
//                   type="number"
//                   value={totalAmount}
//                   onChange={(e) => setTotalAmount(e.target.value)}
//                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   min="0"
//                   step="0.01"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Paid</label>
//                 <input
//                   type="number"
//                   value={paid}
//                   onChange={(e) => setPaid(e.target.value)}
//                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   min="0"
//                   step="0.01"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Credit</label>
//                 <input
//                   type="number"
//                   value={credit}
//                   onChange={(e) => setCredit(e.target.value)}
//                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   min="0"
//                   step="0.01"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Discount</label>
//                 <input
//                   type="number"
//                   value={discount}
//                   onChange={(e) => setDiscount(e.target.value)}
//                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   min="0"
//                   step="0.01"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Bed No.</label>
//                 <input
//                   type="text"
//                   value={bedNo}
//                   onChange={(e) => setBedNo(e.target.value)}
//                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Floor</label>
//                 <input
//                   type="text"
//                   value={floor}
//                   onChange={(e) => setFloor(e.target.value)}
//                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Ward</label>
//                 <input
//                   type="text"
//                   value={ward}
//                   onChange={(e) => setWard(e.target.value)}
//                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Visitor Details */}
//           <div className="bg-gray-50 p-4 rounded-md">
//             <h3 className="text-base font-semibold mb-4">Visitor Details</h3>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Visitor Name</label>
//                 <input
//                   type="text"
//                   value={visitorName}
//                   onChange={(e) => setVisitorName(e.target.value)}
//                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Visitor Phone Number</label>
//                 <input
//                   type="text"
//                   value={visitorPhone}
//                   onChange={(e) => setVisitorPhone(e.target.value)}
//                   className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* TPA */}
//           <div className="bg-gray-50 p-4 rounded-md">
//             <h3 className="text-base font-semibold mb-4">TPA (Third Party Assurance)</h3>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
//               <div className="flex items-center gap-2">
//                 <input
//                   id="is_tpa"
//                   type="checkbox"
//                   checked={isTpa}
//                   onChange={(e) => setIsTpa(e.target.checked)}
//                   className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                 />
//                 <label htmlFor="is_tpa" className="text-sm font-medium text-gray-700">
//                   Covered by TPA
//                 </label>
//               </div>
//               {isTpa && (
//                 <>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">TPA Name</label>
//                     <input
//                       type="text"
//                       value={tpaName}
//                       onChange={(e) => setTpaName(e.target.value)}
//                       className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       placeholder="Insurance/TPA Name"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">TPA ID Number</label>
//                     <input
//                       type="text"
//                       value={tpaIdNumber}
//                       onChange={(e) => setTpaIdNumber(e.target.value)}
//                       className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       placeholder="Policy/Claim/Member ID"
//                     />
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Actions */}
//         <div className="px-6 py-4 flex items-center justify-end gap-2 border-t">
//           <button
//             type="button"
//             onClick={onClose}
//             className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200 transition"
//             disabled={saving}
//           >
//             Close
//           </button>
//           <button
//             type="submit"
//             form="conversion-form"
//             data-action="save"
//             className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200 transition"
//             disabled={saving}
//           >
//             {saving ? 'Saving…' : 'Save'}
//           </button>
//           <button
//             type="submit"
//             form="conversion-form"
//             data-action="next"
//             className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
//             disabled={saving}
//           >
//             {saving ? 'Saving…' : 'Save & Next'}
//           </button>
//         </div>

//         {/* Hidden form wrapper */}
//         <form id="conversion-form" onSubmit={handleSubmit} className="hidden" />
//       </div>
//     </div>
//   );
// };

// export default Conversion;


////////////////  ////////////////  ////////////////  ////////////////  ////////////////  ////////////////  ////////////////  ////////////////   ////////////////  ////////////////  ////////////////

 
import React, { useEffect, useState } from 'react';
import { mockPatients } from './PatientForm'; // Adjust path if needed
 
const Conversion = ({ onClose, onSaved }) => {
  // Lookup by Patient ID
  const [patientId, setPatientId] = useState('');
 
  // Patient master fields (auto-fill)    ////////////////
  const [name, setName] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [age, setAge] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [aadhar, setAadhar] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [medicalFile, setMedicalFile] = useState(null);
 
  // Admission fields    ////////////////
  const [admissionDate, setAdmissionDate] = useState('');
  const [department, setDepartment] = useState('');
  const [reason, setReason] = useState('');
  const [reasonType, setReasonType] = useState('emergency');
  const [observation, setObservation] = useState('');
  const [isEmergency, setIsEmergency] = useState(false);
 
  // Financial / bed    ////////////////
  const [reference, setReference] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [paid, setPaid] = useState('');
  const [credit, setCredit] = useState('');
  const [discount, setDiscount] = useState('');
  const [bedNo, setBedNo] = useState('');
  const [floor, setFloor] = useState('');
  const [ward, setWard] = useState('');
 
  // Visitor   ////////////////
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
 
  // TPA   ////////////////
  const [isTpa, setIsTpa] = useState(false);
  const [tpaName, setTpaName] = useState('');
  const [tpaIdNumber, setTpaIdNumber] = useState('');
 
  // UI state   ////////////////
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [loadingPatient, setLoadingPatient] = useState(false);
  const [lookupMsg, setLookupMsg] = useState('');
 
  // Auto-derive emergency flag from reasonType  ////////////////
  useEffect(() => {
    setIsEmergency(reasonType === 'emergency');
  }, [reasonType]);
 
  // Fetch patient details when patientId changes (debounced)  ////////////////
  useEffect(() => {
    if (!patientId) {
      setLookupMsg('');
      setName('');
      setGuardianName('');
      setGender('');
      setDateOfBirth('');
      setAge('');
      setBloodGroup('');
      setMaritalStatus('');
      setPhone('');
      setEmail('');
      setLocation('');
      setAadhar('');
      setMedicalHistory('');
      return;
    }
    const id = String(patientId).trim();
    if (!id) return;
 
    const handle = setTimeout(() => {
      try {
        setLoadingPatient(true);
        setLookupMsg('Looking up patient...');
        console.log('Looking up patient with ID:', id); // Debug log  ////////////////
        console.log('mockPatients:', mockPatients); // Debug log  ////////////////
        const patient = mockPatients.find((p) => p.id === parseInt(id));
        if (!patient) {
          setLookupMsg('Patient not found.');
          setName('');
          setGuardianName('');
          setGender('');
          setDateOfBirth('');
          setAge('');
          setBloodGroup('');
          setMaritalStatus('');
          setPhone('');
          setEmail('');
          setLocation('');
          setAadhar('');
          setMedicalHistory('');
          console.log('No patient found for ID:', id); // Debug log
          setLoadingPatient(false);
          return;
        }
 
        console.log('Found patient:', patient); // Debug log
        // Fill fields with correct field names from mockPatients   ////////////////
        setName(patient.name || '');
        setGuardianName(patient.guardian_name || '');
        setGender(patient.gender || '');
        setDateOfBirth(patient.dob || '');
        setAge(patient.age != null ? String(patient.age) : '');
        setBloodGroup(patient.blood_group || '');
        setMaritalStatus(patient.marital_status || '');
        setPhone(patient.phone || '');
        setEmail(patient.email || '');
        setLocation(patient.location || '');
        setAadhar('');
        setMedicalHistory(patient.remarks || '');
 
        setLookupMsg('Patient loaded.');
      } catch (e) {
        console.error('Error fetching patient:', e);
        setLookupMsg('Failed to fetch patient.');
      } finally {
        setLoadingPatient(false);
      }
    }, 500);
 
    return () => clearTimeout(handle);
  }, [patientId]);
 
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Optional: Add file size/type validation   ////////////////
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setError('File size exceeds 5MB limit.');
        setMedicalFile(null);
        return;
      }
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        setError('Invalid file type. Allowed: PDF, DOC, DOCX, JPG, PNG.');
        setMedicalFile(null);
        return;
      }
      setMedicalFile(file);
    } else {
      setMedicalFile(null);
    }
  };
 
  const handleSubmit = (e) => {
    e.preventDefault();
    const action = e?.nativeEvent?.submitter?.dataset?.action || 'save';
    setSaving(true);
    setError('');
 
    try {
      // Simulate saving patient data   ////////////////
      const newPatient = {
        id: patientId ? parseInt(patientId) : mockPatients.length + 101,
        name,
        guardian_name: guardianName,
        gender,
        dob: dateOfBirth,
        age: age ? parseInt(age) : null,
        blood_group: bloodGroup,
        marital_status: maritalStatus,
        phone,
        email,
        location,
        remarks: medicalHistory,
        medicalFile: medicalFile ? medicalFile.name : null,
        admissionDate,
        department,
        reason,
        isEmergency,
        reasonType,
        observation,
        reference,
        totalAmount: totalAmount ? parseFloat(totalAmount) : null,
        paid: paid ? parseFloat(paid) : null,
        credit: credit ? parseFloat(credit) : null,
        discount: discount ? parseFloat(discount) : null,
        bedNo,
        floor,
        ward,
        visitorName,
        visitorPhone,
        isTpa,
        tpaName: isTpa ? tpaName : '',
        tpaIdNumber: isTpa ? tpaIdNumber : '',
      };
 
      // Update or add patient to mockPatients   ////////////////
      const index = mockPatients.findIndex((p) => p.id === parseInt(patientId));
      if (index !== -1) {
        mockPatients[index] = newPatient;
      } else {
        mockPatients.push(newPatient);
      }
 
      if (action === 'next' && onSaved) {
        onSaved(newPatient);
      } else {
        onClose?.();
      }
    } catch (error) {
      console.error('Error creating patient:', error);
      setError(error.message || 'Failed to create patient.');
    } finally {
      setSaving(false);
    }
  };
 
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white shadow-lg rounded-lg max-w-5xl w-full flex flex-col max-h-[85vh]">
        <div className="flex justify-between items-center bg-blue-500 text-white p-3 rounded-t-lg">
          <h2 className="text-lg font-semibold">New OPD-IPD Patient</h2>
          <button className="text-white text-2xl leading-none" onClick={onClose}>×</button>
        </div>
 
        {error && <p className="text-red-600 px-6 py-2 text-sm">{error}</p>}
 
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Lookup / Patient ID */}    
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-base font-semibold mb-3">Patient Lookup</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700">Patient ID</label>
                <input
                  type="number"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter existing Patient ID to auto-fill"
                />
              </div>
              <div className="md:col-span-2">
                <div className="text-xs text-gray-600">
                  {loadingPatient ? 'Fetching patient…' : lookupMsg}
                </div>
              </div>
            </div>
          </div>
 
          {/* Patient Details */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-base font-semibold mb-4">Patient Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Patient Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Guardian Name</label>
                <input
                  type="text"
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Gender *</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Age *</label>
                <input
                  type="text"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Blood Group</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Marital Status</label>
                <select
                  value={maritalStatus}
                  onChange={(e) => setMaritalStatus(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="divorced">Divorced</option>
                  <option value="widowed">Widowed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Aadhaar Card</label>
                <input
                  type="text"
                  value={aadhar}
                  onChange={(e) => setAadhar(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="12-digit Aadhaar number"
                />
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Previous Medical History</label>
                <textarea
                  value={medicalHistory}
                  onChange={(e) => setMedicalHistory(e.target.value)}
                  rows={3}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                  placeholder="Enter previous medical history (e.g., conditions, surgeries, allergies)"
                />
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Upload Medical History Document</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  accept=".pdf,.doc,.docx,.jpg,.png"
                />
                {medicalFile && (
                  <p className="mt-1 text-sm text-gray-600">Selected: {medicalFile.name} ({(medicalFile.size / 1024).toFixed(2)} KB)</p>
                )}
              </div>
            </div>
          </div>
 
          {/* Admission Details */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-base font-semibold mb-4">Admission Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Admission Date *</label>
                <input
                  type="date"
                  value={admissionDate}
                  onChange={(e) => setAdmissionDate(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Department *</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select</option>
                  <option value="general_medicine">General Medicine</option>
                  <option value="surgery">Surgery</option>
                  <option value="pediatrics">Pediatrics</option>
                  <option value="orthopedics">Orthopedics</option>
                  <option value="cardiology">Cardiology</option>
                  <option value="neurology">Neurology</option>
                </select>
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Reason for Admission</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                  placeholder="Enter reason here..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Reason Type</label>
                <select
                  value={reasonType}
                  onChange={(e) => setReasonType(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="emergency">Emergency</option>
                  <option value="observation">Observation</option>
                </select>
              </div>
              {reasonType === 'observation' && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Observation Notes</label>
                  <textarea
                    value={observation}
                    onChange={(e) => setObservation(e.target.value)}
                    rows={3}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
                    placeholder="Enter observation notes..."
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700">Reference</label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Referred by / Reference"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                <input
                  type="number"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Paid</label>
                <input
                  type="number"
                  value={paid}
                  onChange={(e) => setPaid(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Credit</label>
                <input
                  type="number"
                  value={credit}
                  onChange={(e) => setCredit(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Discount</label>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Bed No.</label>
                <input
                  type="text"
                  value={bedNo}
                  onChange={(e) => setBedNo(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Floor</label>
                <input
                  type="text"
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Ward</label>
                <input
                  type="text"
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
 
          {/* Visitor Details */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-base font-semibold mb-4">Visitor Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Visitor Name</label>
                <input
                  type="text"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Visitor Phone Number</label>
                <input
                  type="text"
                  value={visitorPhone}
                  onChange={(e) => setVisitorPhone(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
 
          {/* TPA */}
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-base font-semibold mb-4">TPA (Third Party Assurance)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="flex items-center gap-2">
                <input
                  id="is_tpa"
                  type="checkbox"
                  checked={isTpa}
                  onChange={(e) => setIsTpa(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="is_tpa" className="text-sm font-medium text-gray-700">
                  Covered by TPA
                </label>
              </div>
              {isTpa && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">TPA Name</label>
                    <input
                      type="text"
                      value={tpaName}
                      onChange={(e) => setTpaName(e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Insurance/TPA Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">TPA ID Number</label>
                    <input
                      type="text"
                      value={tpaIdNumber}
                      onChange={(e) => setTpaIdNumber(e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Policy/Claim/Member ID"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
 
        {/* Actions */}
        <div className="px-6 py-4 flex items-center justify-end gap-2 border-t">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200 transition"
            disabled={saving}
          >
            Close
          </button>
          <button
            type="submit"
            form="conversion-form"
            data-action="save"
            className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200 transition"
            disabled={saving}
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
          <button
            type="submit"
            form="conversion-form"
            data-action="next"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            disabled={saving}
          >
            {saving ? 'Saving…' : 'Save & Next'}
          </button>
        </div>
 
        {/* Hidden form wrapper */}
        <form id="conversion-form" onSubmit={handleSubmit} className="hidden" />
      </div>
    </div>
  );
};
 
export default Conversion;
 