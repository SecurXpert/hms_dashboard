import React from 'react';

const list = [
  { patientId: 'P001', patientName: 'John Doe' },
  { patientId: 'P002', patientName: 'Jane Roe' },
];

const List = () => {

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">patient List</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
          <thead>
            <tr className="bg-blue-100">
              <th className="px-4 py-2 text-left text-gray-700 font-semibold">Patient ID</th>
              <th className="px-4 py-2 text-left text-gray-700 font-semibold">Patient Name</th>
            </tr>
          </thead>
          <tbody>
            {list.map((list, index) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-2">{list.patientId}</td>
                <td className="px-4 py-2">{list.patientName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default List;
