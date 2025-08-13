import React, { useState } from 'react';
import Login from './pages/Login';
import PatientForm from './components/PatientForm';
import AppointmentForm from './components/AppointmentForm';


const App = () => {
  const [currentPage, setCurrentPage] = useState('login');

  const handleLogin = (role) => {
    setCurrentPage(role === 'doctor' ? 'appointment' : 'patient');
  };

  return (
    <div>
      {currentPage === 'login' && <Login onLogin={handleLogin} />}
      {currentPage === 'patient' && <PatientForm />}
      {currentPage === 'appointment' && <AppointmentForm />}
    </div>
  );
};

export default App;
