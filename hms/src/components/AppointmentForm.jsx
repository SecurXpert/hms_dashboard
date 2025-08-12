import React, { useState } from 'react';

const AppointmentForm = () => {
  const [doctor, setDoctor] = useState('');
  const [doctorFees, setDoctorFees] = useState('');
  const [shift, setShift] = useState('');
  const [slot, setSlot] = useState('');
  const [appointmentPriority, setAppointmentPriority] = useState('Normal');
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [status, setStatus] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [message, setMessage] = useState('');
  const [liveConsultant, setLiveConsultant] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({ doctor, doctorFees, shift, slot, appointmentPriority, paymentMode, status, discountPercentage, message, liveConsultant });
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-4 bg-blue-500 text-white p-2 rounded-t-lg">
        <h2 className="text-xl font-bold">Appointment</h2>
        <button className="bg-blue-500 text-white px-4 py-2 rounded">+ New Patient</button>
      </div>
      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Doctor *</label>
          <select
            value={doctor}
            onChange={(e) => setDoctor(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select</option>
            <option value="doc1">Doctor 1</option>
            <option value="doc2">Doctor 2</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Doctor Fees (₹) *</label>
          <input
            type="text"
            value={doctorFees}
            onChange={(e) => setDoctorFees(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Shift *</label>
          <select
            value={shift}
            onChange={(e) => setShift(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select</option>
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Appointment Date *</label>
          <input
            type="text"
            value="08/11/2025 10:31 AM"
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
            readOnly
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Slot *</label>
          <select
            value={slot}
            onChange={(e) => setSlot(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select</option>
            <option value="slot1">Slot 1</option>
            <option value="slot2">Slot 2</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Appointment Priority</label>
          <select
            value={appointmentPriority}
            onChange={(e) => setAppointmentPriority(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="Normal">Normal</option>
            <option value="High">High</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Payment Mode</label>
          <select
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Status *</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Discount Percentage *</label>
          <input
            type="text"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Message</label>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Live Consultant (On Video Conference) *</label>
          <select
            value={liveConsultant}
            onChange={(e) => setLiveConsultant(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
        <div className="col-span-3 flex justify-end space-x-4">
          <button
            type="button"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Save & Print
          </button>
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

export default AppointmentForm;