import React, { useState } from 'react';

const PatientForm = () => {
  const [name, setName] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState({ year: '', month: '', day: '' });
  const [age, setAge] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [phone, setPhone] = useState('');
  const [remarks, setRemarks] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [knownAllergies, setKnownAllergies] = useState('');
  const [tpa, setTpa] = useState('');
  const [tpaId, setTpaId] = useState('');
  const [tpaValidity, setTpaValidity] = useState('');
  const [nationalId, setNationalId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({ name, guardianName, gender, dateOfBirth, age, bloodGroup, maritalStatus, phone, email, address, knownAllergies, tpa, tpaId, tpaValidity, nationalId });
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-4 bg-blue-500 text-white p-2 rounded-t-lg">
        <h2 className="text-xl font-bold">Add Patient</h2>
        <button className="text-white">×</button>
      </div>
      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Guardian Name</label>
          <input
            type="text"
            value={guardianName}
            onChange={(e) => setGuardianName(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
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
            type="text"
            value={`${dateOfBirth.year}-${dateOfBirth.month}-${dateOfBirth.day}`}
            onChange={(e) => {
              const [year, month, day] = e.target.value.split('-');
              setDateOfBirth({ year, month, day });
            }}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Year-Month-Day"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Age (yy-mm-dd) *</label>
          <input
            type="text"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Blood Group</label>
          <select
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
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
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select</option>
            <option value="single">Single</option>
            <option value="married">Married</option>
            <option value="divorced">Divorced</option>
            <option value="widowed">Widowed</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Patient Photo</label>
          <div className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-center text-gray-500">
            Drop a file here or click
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Remarks</label>
          <input
            type="text"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Any Known Allergies</label>
          <input
            type="text"
            value={knownAllergies}
            onChange={(e) => setKnownAllergies(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">TPA</label>
          <select
            value={tpa}
            onChange={(e) => setTpa(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select</option>
            <option value="tpa1">TPA 1</option>
            <option value="tpa2">TPA 2</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">TPA ID</label>
          <input
            type="text"
            value={tpaId}
            onChange={(e) => setTpaId(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">TPA Validity</label>
          <input
            type="text"
            value={tpaValidity}
            onChange={(e) => setTpaValidity(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">National Identification Number</label>
          <input
            type="text"
            value={nationalId}
            onChange={(e) => setNationalId(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="col-span-3 flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientForm;