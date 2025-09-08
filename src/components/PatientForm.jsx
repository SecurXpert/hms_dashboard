// // import React, { useState } from 'react';
 
// // const API_BASE = 'http://192.168.0.114:8000';
 
// // const PatientForm = ({ onClose, onSaved }) => {
// //   const [name, setName] = useState('');
// //   const [guardianName, setGuardianName] = useState('');
// //   const [gender, setGender] = useState('');
// //   const [dateOfBirth, setDateOfBirth] = useState('');
// //   const [age, setAge] = useState('');
// //   const [bloodGroup, setBloodGroup] = useState('');
// //   const [maritalStatus, setMaritalStatus] = useState('');
// //   const [phone, setPhone] = useState('');
// //   const [remarks, setRemarks] = useState('');
// //   const [email, setEmail] = useState('');
// //   const [location, setLocation] = useState('');
// //   const [error, setError] = useState('');
// //   const [saving, setSaving] = useState(false);
 
// //   const authHeaders = () => ({
// //     Authorization: `Bearer ${localStorage.getItem('token')}`,
// //     'Content-Type': 'application/json',
// //     Accept: 'application/json',
// //   });
 
// //   // Single submit handler: detects which button was used (Save vs Save & Next)
// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     const action = e?.nativeEvent?.submitter?.dataset?.action || 'save'; // 'save' | 'next'
// //     setSaving(true);
// //     setError('');
 
// //     const patientData = {
// //       name,
// //       guardian_name: guardianName,
// //       gender,
// //       dob: dateOfBirth,
// //       age,
// //       blood_group: bloodGroup,
// //       marital_status: maritalStatus,
// //       phone,
// //       email,
// //       location,
// //       remarks,
// //     };
 
// //     try {
// //       const res = await fetch(`${API_BASE}/api/v1/patients`, {
// //         method: 'POST',
// //         headers: authHeaders(),
// //         body: JSON.stringify(patientData),
// //       });
// //       if (!res.ok) {
// //         const t = await res.text();
// //         throw new Error(t || 'Create failed');
// //       }
// //       const created = await res.json();
 
// //       if (action === 'next' && onSaved) {
// //         // Save & Next → bubble new patient up so parent can open "Add Appointment"
// //         onSaved(created);
// //       } else {
// //         // Save → just close the modal
// //         onClose?.();
// //       }
// //     } catch (error) {
// //       console.error('Error creating patient:', error);
// //       setError(error.message || 'Failed to create patient.');
// //     } finally {
// //       setSaving(false);
// //     }
// //   };
 
// //   return (
// //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
// //       <div className="p-6 bg-white shadow-lg rounded-lg max-w-4xl w-full">
// //         <div className="flex justify-between items-center mb-4 bg-blue-500 text-white p-2 rounded-t-lg">
// //           <h2 className="text-xl font-bold">New Patient</h2>
// //           <button className="text-white text-2xl" onClick={onClose}>×</button>
// //         </div>
 
// //         {error && <p className="text-red-500 mb-4">{error}</p>}
 
// //         <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700">Patient Name *</label>
// //             <input
// //               type="text"
// //               value={name}
// //               onChange={(e) => setName(e.target.value)}
// //               className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //               required
// //             />
// //           </div>
 
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700">Guardian Name</label>
// //             <input
// //               type="text"
// //               value={guardianName}
// //               onChange={(e) => setGuardianName(e.target.value)}
// //               className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //             />
// //           </div>
 
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700">Gender *</label>
// //             <select
// //               value={gender}
// //               onChange={(e) => setGender(e.target.value)}
// //               className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //               required
// //             >
// //               <option value="">Select</option>
// //               <option value="male">Male</option>
// //               <option value="female">Female</option>
// //               <option value="other">Other</option>
// //             </select>
// //           </div>
 
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700">Date Of Birth</label>
// //             <input
// //               type="date"
// //               value={dateOfBirth}
// //               onChange={(e) => setDateOfBirth(e.target.value)}
// //               className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //             />
// //           </div>
 
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700">Age *</label>
// //             <input
// //               type="text"
// //               value={age}
// //               onChange={(e) => setAge(e.target.value)}
// //               className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //               required
// //             />
// //           </div>
 
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700">Blood Group</label>
// //             <select
// //               value={bloodGroup}
// //               onChange={(e) => setBloodGroup(e.target.value)}
// //               className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //             >
// //               <option value="">Select</option>
// //               <option value="A+">A+</option>
// //               <option value="A-">A-</option>
// //               <option value="B+">B+</option>
// //               <option value="B-">B-</option>
// //               <option value="AB+">AB+</option>
// //               <option value="AB-">AB-</option>
// //               <option value="O+">O+</option>
// //               <option value="O-">O-</option>
// //             </select>
// //           </div>
 
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700">Marital Status</label>
// //             <select
// //               value={maritalStatus}
// //               onChange={(e) => setMaritalStatus(e.target.value)}
// //               className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //             >
// //               <option value="">Select</option>
// //               <option value="single">Single</option>
// //               <option value="married">Married</option>
// //               <option value="divorced">Divorced</option>
// //               <option value="widowed">Widowed</option>
// //             </select>
// //           </div>
 
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
// //             <input
// //               type="text"
// //               value={phone}
// //               onChange={(e) => setPhone(e.target.value)}
// //               className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //               required
// //             />
// //           </div>
 
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700">Email</label>
// //             <input
// //               type="email"
// //               value={email}
// //               onChange={(e) => setEmail(e.target.value)}
// //               className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //             />
// //           </div>
 
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700">Location</label>
// //             <input
// //               type="text"
// //               value={location}
// //               onChange={(e) => setLocation(e.target.value)}
// //               className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// //             />
// //           </div>
 
// //           <div className="md:col-span-3">
// //             <label className="block text-sm font-medium text-gray-700">Reason</label>
// //             <textarea
// //               value={remarks}
// //               onChange={(e) => setRemarks(e.target.value)}
// //               rows={4}
// //               className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
// //               placeholder="Enter reason here..."
// //             />
// //           </div>
 
// //           <div className="col-span-1 md:col-span-3 flex items-center justify-end gap-2">
// //             <button
// //               type="submit"
// //               data-action="save"
// //               className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200 transition duration-200"
// //               disabled={saving}
// //             >
// //               {saving ? 'Saving...' : 'Save'}
// //             </button>
// //             <button
// //               type="submit"
// //               data-action="next"
// //               className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
// //               disabled={saving}
// //             >
// //               {saving ? 'Saving...' : 'Save & Next'}
// //             </button>
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // };
 
// // export default PatientForm;
 
// import React, { useEffect, useState } from 'react';

// // Mock data store for patients
// const mockPatients = [];

// // ---- helpers ----
// const calcAge = (dob) => {
//   if (!dob) return '';
//   const d = new Date(dob);
//   if (Number.isNaN(d.getTime())) return '';
//   const today = new Date();
//   let years = today.getFullYear() - d.getFullYear();
//   const m = today.getMonth() - d.getMonth();
//   if (m < 0 || (m === 0 && today.getDate() < d.getDate())) years--;
//   return String(Math.max(0, years));
// };

// const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
// const phoneRegexIN = /^[6-9]\d{9}$/; // Indian mobiles: 10 digits, starts 6–9

// const PatientForm = ({ onClose, onSaved }) => {
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
//   const [error, setError] = useState('');
//   const [saving, setSaving] = useState(false);

//   // field-level errors
//   const [emailError, setEmailError] = useState('');
//   const [phoneError, setPhoneError] = useState('');
//   const [dobError, setDobError] = useState('');

//   // Auto-calc age whenever DOB changes
//   useEffect(() => {
//     if (dateOfBirth) {
//       const a = calcAge(dateOfBirth);
//       setAge(a);
//       // sanity guard: unrealistic ages
//       if (a !== '' && (Number(a) > 120)) {
//         setDobError('Please check Date of Birth (age > 120).');
//       } else {
//         setDobError('');
//       }
//     } else {
//       setDobError('');
//     }
//   }, [dateOfBirth]);

//   // Simulate patient creation
//   const createPatient = (patientData) => {
//     const newPatient = {
//       id: mockPatients.length + 101, // Simple ID generation
//       ...patientData,
//     };
//     mockPatients.push(newPatient);
//     return newPatient;
//   };

//   const validateFields = () => {
//     let ok = true;

//     if (!name || !gender || !age || !phone) {
//       setError('Please fill all required fields.');
//       ok = false;
//     } else {
//       setError('');
//     }

//     // phone
//     if (!phoneRegexIN.test(phone)) {
//       setPhoneError('Enter a valid 10-digit Indian mobile number starting with 6–9.');
//       ok = false;
//     } else {
//       setPhoneError('');
//     }

//     // email (optional, but if present must be valid)
//     if (email && !emailRegex.test(email)) {
//       setEmailError('Please enter a valid email address.');
//       ok = false;
//     } else {
//       setEmailError('');
//     }

//     // dob sanity
//     if (dateOfBirth) {
//       const a = calcAge(dateOfBirth);
//       if (a === '' || Number(a) > 120) {
//         setDobError('Please check Date of Birth.');
//         ok = false;
//       } else {
//         setDobError('');
//       }
//     }

//     return ok;
//   };

//   // Single submit handler: detects which button was used (Save vs Save & Next)
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const action = e?.nativeEvent?.submitter?.dataset?.action || 'save'; // 'save' | 'next'
//     setSaving(true);
//     setError('');

//     // Ensure latest auto-age is applied just before submit
//     const finalAge = dateOfBirth ? calcAge(dateOfBirth) : age;
//     if (dateOfBirth && finalAge !== age) setAge(finalAge);

//     const patientData = {
//       name,
//       guardian_name: guardianName,
//       gender,
//       dob: dateOfBirth,
//       age: finalAge,
//       blood_group: bloodGroup,
//       marital_status: maritalStatus,
//       phone,
//       email,
//       location,
//       remarks,
//     };

//     try {
//       if (!validateFields()) {
//         throw new Error('Validation failed.');
//       }

//       const created = createPatient(patientData);

//       if (action === 'next' && onSaved) {
//         // Save & Next → bubble new patient up so parent can open "Add Appointment"
//         onSaved(created);
//       } else {
//         // Save → just close the modal
//         onClose?.();
//       }
//     } catch (err) {
//       console.error('Error creating patient:', err);
//       if (!String(err?.message || '').includes('Validation')) {
//         setError('Failed to create patient.');
//       }
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="p-6 bg-white shadow-lg rounded-lg max-w-4xl w-full">
//         <div className="flex justify-between items-center mb-4 bg-blue-500 text-white p-2 rounded-t-lg">
//           <h2 className="text-xl font-bold">New Patient</h2>
//           <button className="text-white text-2xl" onClick={onClose}>×</button>
//         </div>

//         {error && <p className="text-red-500 mb-4">{error}</p>}

//         <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Patient Name *</label>
//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Guardian Name</label>
//             <input
//               type="text"
//               value={guardianName}
//               onChange={(e) => setGuardianName(e.target.value)}
//               className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Gender *</label>
//             <select
//               value={gender}
//               onChange={(e) => setGender(e.target.value)}
//               className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             >
//               <option value="">Select</option>
//               <option value="male">Male</option>
//               <option value="female">Female</option>
//               <option value="other">Other</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Date Of Birth</label>
//             <input
//               type="date"
//               value={dateOfBirth}
//               onChange={(e) => setDateOfBirth(e.target.value)}
//               className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             {dobError && <p className="text-xs text-red-600 mt-1">{dobError}</p>}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Age *</label>
//             <input
//               type="text"
//               value={age}
//               onChange={(e) => setAge(e.target.value)}
//               className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//               readOnly={!!dateOfBirth} // auto-calculated when DOB is present
//               title={dateOfBirth ? 'Age auto-calculated from Date of Birth' : undefined}
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Blood Group</label>
//             <select
//               value={bloodGroup}
//               onChange={(e) => setBloodGroup(e.target.value)}
//               className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">Select</option>
//               <option value="A+">A+</option>
//               <option value="A-">A-</option>
//               <option value="B+">B+</option>
//               <option value="B-">B-</option>
//               <option value="AB+">AB+</option>
//               <option value="AB-">AB-</option>
//               <option value="O+">O+</option>
//               <option value="O-">O-</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Marital Status</label>
//             <select
//               value={maritalStatus}
//               onChange={(e) => setMaritalStatus(e.target.value)}
//               className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">Select</option>
//               <option value="single">Single</option>
//               <option value="married">Married</option>
//               <option value="divorced">Divorced</option>
//               <option value="widowed">Widowed</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
//             <input
//               type="tel"
//               value={phone}
//               onChange={(e) => {
//                 const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
//                 setPhone(digitsOnly);
//               }}
//               inputMode="numeric"
//               maxLength={10}
//               placeholder="10-digit mobile"
//               className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//             {phoneError && <p className="text-xs text-red-600 mt-1">{phoneError}</p>}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Email</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => {
//                 setEmail(e.target.value);
//                 if (!e.target.value) setEmailError('');
//               }}
//               onBlur={() => setEmailError(email && !emailRegex.test(email) ? 'Please enter a valid email address.' : '')}
//               className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="name@example.com"
//             />
//             {emailError && <p className="text-xs text-red-600 mt-1">{emailError}</p>}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Location</label>
//             <input
//               type="text"
//               value={location}
//               onChange={(e) => setLocation(e.target.value)}
//               className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div className="md:col-span-3">
//             <label className="block text-sm font-medium text-gray-700">Reason</label>
//             <textarea
//               value={remarks}
//               onChange={(e) => setRemarks(e.target.value)}
//               rows={4}
//               className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
//               placeholder="Enter reason here..."
//             />
//           </div>

//           <div className="col-span-1 md:col-span-3 flex items-center justify-end gap-2">
//             <button
//               type="submit"
//               data-action="save"
//               className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200 transition duration-200"
//               disabled={saving}
//             >
//               {saving ? 'Saving...' : 'Save'}
//             </button>
//             <button
//               type="submit"
//               data-action="next"
//               className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
//               disabled={saving}
//             >
//               {saving ? 'Saving...' : 'Save & Next'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default PatientForm;



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////












import React, { useState } from 'react';
 
// Mock data store for patients with a sample patient
export const mockPatients = [
  {
    id: 101,
    name: 'John Doe',
    guardian_name: 'Jane Doe',
    gender: 'male',
    dob: '1990-01-01',
    age: '35',
    blood_group: 'A+',
    marital_status: 'married',
    phone: '9876543210',
    email: 'john.doe@example.com',
    location: 'Mumbai',
    remarks: 'Hypertension',
  },
];
 
const PatientForm = ({ onClose, onSaved }) => {
  const [name, setName] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [age, setAge] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [phone, setPhone] = useState('');
  const [remarks, setRemarks] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // --- Age calculator from DOB ---
  const calculateAge = (dobStr) => {
    if (!dobStr) return '';
    const dob = new Date(dobStr + 'T00:00:00'); // avoid TZ issues
    if (Number.isNaN(dob.getTime())) return '';
    const today = new Date();
    let years = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      years--;
    }
    return years < 0 ? '' : String(years);
  };

  // Update DOB and auto-calc age
  const handleDobChange = (e) => {
    const val = e.target.value;
    setDateOfBirth(val);
    const computed = calculateAge(val);
    if (computed !== '') {
      setAge(computed);
    }
  };

  // Simulate patient creation
  const createPatient = (patientData) => {
    const newPatient = {
      id: mockPatients.length + 101, // Simple ID generation starting from 101
      ...patientData,
    };
    mockPatients.push(newPatient);
    return newPatient;
  };
 
  // Simple validators
  const isValidPhone = (p) => /^\d{10}$/.test((p || '').trim());
  const isValidEmail = (e) => !e || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());
 
  // Single submit handler: detects which button was used (Save vs Save & Next)
  const handleSubmit = (e) => {
    e.preventDefault();
    const action = e?.nativeEvent?.submitter?.dataset?.action || 'save'; // 'save' | 'next'
    setSaving(true);
    setError('');

    // If DOB present, compute age and prefer it
    let finalAge = age;
    if (dateOfBirth) {
      const computedAge = calculateAge(dateOfBirth);
      if (computedAge === '') {
        setSaving(false);
        setError('Please enter a valid Date of Birth.');
        return;
      }
      finalAge = computedAge;
      if (finalAge !== age) {
        // keep state in sync without changing UI structure
        setAge(finalAge);
      }
    }

    // Required checks (kept same fields you already required)
    if (!name || !gender || !finalAge || !phone) {
      setSaving(false);
      setError('Please fill all required fields.');
      return;
    }

    // Extra format validations
    if (!isValidPhone(phone)) {
      setSaving(false);
      setError('Please enter a valid 10-digit phone number.');
      return;
    }
    if (!isValidEmail(email)) {
      setSaving(false);
      setError('Please enter a valid email address.');
      return;
    }
 
    const patientData = {
      name,
      guardian_name: guardianName,
      gender,
      dob: dateOfBirth,
      age: finalAge, // use validated/computed age
      blood_group: bloodGroup,
      marital_status: maritalStatus,
      phone,
      email,
      location,
      remarks,
    };
 
    try {
      const created = createPatient(patientData);
 
      if (action === 'next' && onSaved) {
        // Save & Next → bubble new patient up so parent can open "Add Appointment"
        onSaved(created);
      } else {
        // Save → just close the modal
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
      <div className="p-6 bg-white shadow-lg rounded-lg max-w-4xl w-full">
        <div className="flex justify-between items-center mb-4 bg-blue-500 text-white p-2 rounded-t-lg">
          <h2 className="text-xl font-bold">New Patient</h2>
          <button className="text-white text-2xl" onClick={onClose}>×</button>
        </div>
 
        {error && <p className="text-red-500 mb-4">{error}</p>}
 
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <label className="block text-sm font-medium text-gray-700">Date Of Birth</label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={handleDobChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
 
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
 
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700">Reason</label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={4}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
              placeholder="Enter reason here..."
            />
          </div>
 
          <div className="col-span-1 md:col-span-3 flex items-center justify-end gap-2">
            <button
              type="submit"
              data-action="save"
              className="bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200 transition duration-200"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              type="submit"
              data-action="next"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save & Next'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
 
export default PatientForm;
