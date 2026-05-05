import React, { useContext } from 'react'
import { DoctorContext } from './context/DoctorContext';
import { AdminContext } from './context/AdminContext';
import { StaffContext } from './context/StaffContext';
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/CustomToast.css';
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Admin/Dashboard';
import AllAppointments from './pages/Admin/AllAppointments';
import AddDoctor from './pages/Admin/AddDoctor';
import AddStaff from './pages/Admin/AddStaff';
import DoctorsList from './pages/Admin/DoctorsList';
import PatientList from './pages/Admin/PatientList';
import PatientProfile from './pages/Admin/PatientProfile';
import ReportsList from './pages/Admin/ReportsList';
import Inventory from './pages/Admin/Inventory';
import Login from './pages/Login';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorProfile from './pages/Doctor/DoctorProfile';
import DocProfile from "./pages/Doctor/DocDetails.jsx";
import AppointmentDetails from "./pages/Doctor/AppointmentDetails.jsx";
import Analytics from "./pages/Admin/Analytics.jsx";
import LabBookings from "./pages/Admin/LabBookings.jsx";
import LiveConsultation from "./pages/Doctor/LiveConsultation.jsx";
import AIPrescriptionBuilder from "./pages/Doctor/AIPrescriptionBuilder.jsx";

const App = () => {

  const { dToken } = useContext(DoctorContext)
  const { aToken } = useContext(AdminContext)
  const { sToken, staffRole } = useContext(StaffContext)

  return dToken || aToken || sToken ? (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer />
      <Navbar />
      <div className='flex items-start'>
        <Sidebar />
        <Routes>
          <Route path='/' element={
            aToken ? <Dashboard /> : 
            dToken ? <DoctorDashboard /> : 
            sToken ? (staffRole === 'Lab Technician' ? <ReportsList /> : <AllAppointments />) : 
            <></>
          } />
          <Route path='/admin-dashboard' element={<Dashboard />} />
          <Route path='/all-appointments' element={aToken || staffRole === 'Receptionist' || staffRole === 'Head Admin' ? <AllAppointments /> : <ReportsList />} />
          <Route path='/add-doctor' element={<AddDoctor />} />
          <Route path='/add-staff' element={<AddStaff />} />
          <Route path='/doctor-list' element={<DoctorsList />} />
          <Route path='/patient-list' element={<PatientList />} />
          <Route path='/patient-profile/:id' element={<PatientProfile />} />
          <Route path='/inventory' element={<Inventory />} />
          <Route path='/all-reports' element={<ReportsList />} />
          <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
          <Route path='/doctor-appointments' element={<DoctorAppointments />} />
          <Route path='/doctor-profile' element={<DoctorProfile />} />
          <Route path='/doctor-profile/:docId' element={<DocProfile />} />
          <Route path='/appointment-details/:appointmentId' element={<AppointmentDetails />} />
          <Route path='/analytics' element={<Analytics />} />
          <Route path='/lab-bookings' element={<LabBookings />} />
          <Route path='/live-consultation/:roomId' element={<LiveConsultation />} />
          <Route path='/prescription-builder/:appointmentId' element={<AIPrescriptionBuilder />} />
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <ToastContainer />
      <Login />
    </>
  )
}

export default App