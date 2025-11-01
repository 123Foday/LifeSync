import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import Login from './pages/Login.jsx';
import { AdminContext } from './context/AdminContext.jsx';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import Dashboard from './pages/Admin/Dashboard.jsx';
import AllAppointments from './pages/Admin/AllAppointments.jsx';
import AddDoctor from './pages/Admin/AddDoctor.jsx';
import AddHospital from './pages/Admin/AddHospital.jsx';
import DoctorList from './pages/Admin/DoctorList.jsx';
import HospitalList from './pages/Admin/HospitalList.jsx';
import { HospitalContext } from './context/HospitalContext.jsx';
import { DoctorContext } from './context/DoctorContext.jsx';
import HospitalDashboard from './pages/Hospital/HospitalDashboard.jsx';
import HospitalAppointments from './pages/Hospital/HospitalAppointment.jsx';
import HospitalProfile from './pages/Hospital/HospitalProfile.jsx';
import DoctorDashboard from './pages/Doctor/DoctorDashboard.jsx';
import DoctorAppointments from './pages/Doctor/DoctorAppointments.jsx';
import DoctorProfile from './pages/Doctor/DoctorProfile.jsx';

const App = () => {

  const { aToken } = useContext(AdminContext)
  const { dToken } = useContext(DoctorContext)
  const { hToken } = useContext(HospitalContext)

  return aToken || dToken || hToken ? (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer />
      <Navbar />
      <div className='flex items-start'>
        <Sidebar />
        <Routes>
          {/* Admin Routes */}
          <Route path='/' element={<></>} />
          <Route path='/admin-dashboard' element={<Dashboard />} />
          <Route path='/all-appointments' element={<AllAppointments />} />
          <Route path='/add-doctor' element={<AddDoctor />} />
          <Route path='/add-hospital' element={<AddHospital />} />
          <Route path='/doctor-list' element={<DoctorList />} />
          <Route path='/hospital-list' element={<HospitalList />} />

          {/* Doctor Routes */}
          <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
          <Route path='/doctor-appointments' element={<DoctorAppointments />} />
          <Route path='/doctor-profile' element={<DoctorProfile />} />

          {/* Hospital Routes */}
          <Route path='/hospital-dashboard' element={<HospitalDashboard />} />
          <Route path='/hospital-appointments' element={<HospitalAppointments />} />
          <Route path='/hospital-profile' element={<HospitalProfile />} />
        </Routes>
      </div>
    </div>

  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  )
}

export default App
