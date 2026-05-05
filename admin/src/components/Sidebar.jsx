import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink } from 'react-router-dom'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'
import { StaffContext } from '../context/StaffContext'
import { motion } from 'framer-motion'

const Sidebar = () => {

  const { dToken } = useContext(DoctorContext)
  const { aToken } = useContext(AdminContext)
  const { sToken, staffRole } = useContext(StaffContext)
  const [isOpen, setIsOpen] = useState(true)

  const toggleSidebar = () => setIsOpen(!isOpen)

  const navLinkClasses = ({ isActive }) =>
    `flex items-center gap-4 py-4 px-4 md:px-6 cursor-pointer transition-all duration-300 relative group overflow-hidden ${isActive
      ? 'bg-slate-900 text-white font-semibold'
      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
    }`

  const sidebarVariants = {
    open: { width: '16rem', transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { width: '5rem', transition: { type: 'spring', stiffness: 300, damping: 30 } }
  }

  return (
    <motion.div
      variants={sidebarVariants}
      animate={isOpen ? 'open' : 'closed'}
      className='min-h-[calc(100vh-80px)] bg-white border-r border-gray-100 shadow-sm hidden md:block overflow-hidden relative z-10 flex-shrink-0'
    >
      {/* Toggle Button for Desktop */}
      <button
        onClick={toggleSidebar}
        className='absolute -right-3 top-6 bg-white border border-gray-200 rounded-full p-1 shadow-md z-20 text-gray-500 hover:text-primary transition-colors'
      >
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-300 ${isOpen ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {aToken && <ul className='text-sm mt-6 flex flex-col gap-2 px-2'>
        <NavLink to={'/admin-dashboard'} className={navLinkClasses}>
          {({ isActive }) => (
            <>
              {isActive && <motion.div layoutId="activeTab" className='absolute left-0 top-0 bottom-0 w-1 bg-slate-700 rounded-r-full' />}
              <img className={`min-w-6 w-6 transition-transform ${isActive ? 'scale-110 sepia-0 hue-rotate-180 saturate-200' : 'opacity-60'}`} src={assets.home_icon} alt='Dashboard' />
              <p className={`whitespace-nowrap transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0 hidden'}`}>Dashboard</p>
            </>
          )}
        </NavLink>
        <NavLink to={'/all-appointments'} className={navLinkClasses}>
          {({ isActive }) => (
            <>
              {isActive && <motion.div layoutId="activeTab" className='absolute left-0 top-0 bottom-0 w-1 bg-slate-700 rounded-r-full' />}
              <img className={`min-w-6 w-6 transition-transform ${isActive ? 'scale-110 sepia-0 hue-rotate-180 saturate-200' : 'opacity-60'}`} src={assets.appointment_icon} alt='Appointments' />
              <p className={`whitespace-nowrap transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0 hidden'}`}>Appointments</p>
            </>
          )}
        </NavLink>
        <NavLink to={'/add-doctor'} className={navLinkClasses}>
          {({ isActive }) => (
            <>
              {isActive && <motion.div layoutId="activeTab" className='absolute left-0 top-0 bottom-0 w-1 bg-slate-700 rounded-r-full' />}
              <img className={`min-w-6 w-6 transition-transform ${isActive ? 'scale-110 sepia-0 hue-rotate-180 saturate-200' : 'opacity-60'}`} src={assets.add_icon} alt='Add Doctor' />
              <p className={`whitespace-nowrap transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0 hidden'}`}>Add Doctor</p>
            </>
          )}
        </NavLink>
        <NavLink to={'/add-staff'} className={navLinkClasses}>
          {({ isActive }) => (
            <>
              {isActive && <motion.div layoutId="activeTab" className='absolute left-0 top-0 bottom-0 w-1 bg-slate-700 rounded-r-full' />}
              <div className={`min-w-6 w-6 flex items-center justify-center transition-transform ${isActive ? 'scale-110 text-white' : 'text-gray-500 opacity-60'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM3 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 018.625 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              </div>
              <p className={`whitespace-nowrap transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0 hidden'}`}>Add Staff</p>
            </>
          )}
        </NavLink>
        <NavLink to={'/doctor-list'} className={navLinkClasses}>
          {({ isActive }) => (
            <>
              {isActive && <motion.div layoutId="activeTab" className='absolute left-0 top-0 bottom-0 w-1 bg-slate-700 rounded-r-full' />}
              <img className={`min-w-6 w-6 transition-transform ${isActive ? 'scale-110 sepia-0 hue-rotate-180 saturate-200' : 'opacity-60'}`} src={assets.people_icon} alt='Doctors List' />
              <p className={`whitespace-nowrap transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0 hidden'}`}>Doctors List</p>
            </>
          )}
        </NavLink>
        <NavLink to={'/patient-list'} className={navLinkClasses}>
          {({ isActive }) => (
            <>
              {isActive && <motion.div layoutId="activeTab" className='absolute left-0 top-0 bottom-0 w-1 bg-slate-700 rounded-r-full' />}
              <div className={`min-w-6 w-6 flex items-center justify-center transition-transform ${isActive ? 'scale-110 text-white' : 'text-gray-500 opacity-60'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              </div>
              <p className={`whitespace-nowrap transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0 hidden'}`}>Patient List</p>
            </>
          )}
        </NavLink>
        <NavLink to={'/all-reports'} className={navLinkClasses}>
          {({ isActive }) => (
            <>
              {isActive && <motion.div layoutId="activeTab" className='absolute left-0 top-0 bottom-0 w-1 bg-slate-700 rounded-r-full' />}
              <div className={`min-w-6 w-6 flex items-center justify-center transition-transform ${isActive ? 'scale-110 text-white' : 'text-gray-500 opacity-60'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <p className={`whitespace-nowrap transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0 hidden'}`}>Diagnostic Reports</p>
            </>
          )}
        </NavLink>
        <NavLink to={'/analytics'} className={navLinkClasses}>
          {({ isActive }) => (
            <>
              {isActive && <motion.div layoutId="activeTab" className='absolute left-0 top-0 bottom-0 w-1 bg-slate-700 rounded-r-full' />}
              <div className={`min-w-6 w-6 flex items-center justify-center transition-transform ${isActive ? 'scale-110 text-white' : 'text-gray-500 opacity-60'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </div>
              <p className={`whitespace-nowrap transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0 hidden'}`}>Analytics</p>
            </>
          )}
        </NavLink>
        <NavLink to={'/inventory'} className={navLinkClasses}>
          {({ isActive }) => (
            <>
              {isActive && <motion.div layoutId="activeTab" className='absolute left-0 top-0 bottom-0 w-1 bg-slate-700 rounded-r-full' />}
              <div className={`min-w-6 w-6 flex items-center justify-center transition-transform ${isActive ? 'scale-110 text-white' : 'text-gray-500 opacity-60'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <p className={`whitespace-nowrap transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0 hidden'}`}>Inventory</p>
            </>
          )}
        </NavLink>
        <NavLink to={'/lab-bookings'} className={navLinkClasses}>
          {({ isActive }) => (
            <>
              {isActive && <motion.div layoutId="activeTab" className='absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-r-full' />}
              <div className={`min-w-6 w-6 flex items-center justify-center transition-transform ${isActive ? 'scale-110 text-white' : 'text-gray-500 opacity-60'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1 1 .03 2.713-1.228 2.523l-2.049-.306A24.514 24.514 0 0112 18.75a24.515 24.515 0 00-5.925.773l-2.049.306c-1.258.19-2.228-1.522-1.228-2.523L4.2 15.3" />
                </svg>
              </div>
              <p className={`whitespace-nowrap transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0 hidden'}`}>Lab Bookings</p>
            </>
          )}
        </NavLink>
      </ul>}

      {dToken && <ul className='text-sm mt-6 flex flex-col gap-2 px-2'>
        <NavLink to={'/doctor-dashboard'} className={navLinkClasses}>
          {({ isActive }) => (
            <>
              {isActive && <motion.div layoutId="activeTabDoc" className='absolute left-0 top-0 bottom-0 w-1 bg-slate-700 rounded-r-full' />}
              <img className={`min-w-6 w-6 transition-transform ${isActive ? 'scale-110 sepia-0 hue-rotate-180 saturate-200' : 'opacity-60'}`} src={assets.home_icon} alt='Dashboard' />
              <p className={`whitespace-nowrap transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0 hidden'}`}>Dashboard</p>
            </>
          )}
        </NavLink>
        <NavLink to={'/doctor-appointments'} className={navLinkClasses}>
          {({ isActive }) => (
            <>
              {isActive && <motion.div layoutId="activeTabDoc" className='absolute left-0 top-0 bottom-0 w-1 bg-slate-700 rounded-r-full' />}
              <img className={`min-w-6 w-6 transition-transform ${isActive ? 'scale-110 sepia-0 hue-rotate-180 saturate-200' : 'opacity-60'}`} src={assets.appointment_icon} alt='Appointments' />
              <p className={`whitespace-nowrap transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0 hidden'}`}>Appointments</p>
            </>
          )}
        </NavLink>
        <NavLink to={'/doctor-profile'} className={navLinkClasses}>
          {({ isActive }) => (
            <>
              {isActive && <motion.div layoutId="activeTabDoc" className='absolute left-0 top-0 bottom-0 w-1 bg-slate-700 rounded-r-full' />}
              <img className={`min-w-6 w-6 transition-transform ${isActive ? 'scale-110 sepia-0 hue-rotate-180 saturate-200' : 'opacity-60'}`} src={assets.people_icon} alt='Profile' />
              <p className={`whitespace-nowrap transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0 hidden'}`}>Profile</p>
            </>
          )}
        </NavLink>
      </ul>}

      {sToken && <ul className='text-sm mt-6 flex flex-col gap-2 px-2'>
        <NavLink to={staffRole === 'Lab Technician' ? '/all-reports' : '/all-appointments'} className={navLinkClasses}>
          {({ isActive }) => (
            <>
              {isActive && <motion.div layoutId="activeTabStaff" className='absolute left-0 top-0 bottom-0 w-1 bg-slate-700 rounded-r-full' />}
              <img className={`min-w-6 w-6 transition-transform ${isActive ? 'scale-110 sepia-0 hue-rotate-180 saturate-200' : 'opacity-60'}`} src={assets.home_icon} alt='Dashboard' />
              <p className={`whitespace-nowrap transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0 hidden'}`}>Dashboard</p>
            </>
          )}
        </NavLink>


        {(staffRole === 'Lab Technician' || staffRole === 'Receptionist') && (
          <NavLink to={'/patient-list'} className={navLinkClasses}>
            {({ isActive }) => (
              <>
                {isActive && <motion.div layoutId="activeTabStaff" className='absolute left-0 top-0 bottom-0 w-1 bg-slate-700 rounded-r-full' />}
                <div className={`min-w-6 w-6 flex items-center justify-center transition-transform ${isActive ? 'scale-110 text-white' : 'text-gray-500 opacity-60'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                </div>
                <p className={`whitespace-nowrap transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0 hidden'}`}>Patient List</p>
              </>
            )}
          </NavLink>
        )}

        {(staffRole === 'Receptionist' || staffRole === 'Lab Technician') && (
          <NavLink to={'/lab-bookings'} className={navLinkClasses}>
            {({ isActive }) => (
              <>
                {isActive && <motion.div layoutId="activeTabStaff" className='absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-r-full' />}
                <div className={`min-w-6 w-6 flex items-center justify-center transition-transform ${isActive ? 'scale-110 text-white' : 'text-gray-500 opacity-60'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1 1 .03 2.713-1.228 2.523l-2.049-.306A24.514 24.514 0 0112 18.75a24.515 24.515 0 00-5.925.773l-2.049.306c-1.258.19-2.228-1.522-1.228-2.523L4.2 15.3" />
                  </svg>
                </div>
                <p className={`whitespace-nowrap transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0 hidden'}`}>Lab Bookings</p>
              </>
            )}
          </NavLink>
        )}
      </ul>}


    </motion.div>
  )
}

export default Sidebar