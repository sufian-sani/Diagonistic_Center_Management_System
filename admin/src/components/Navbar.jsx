import React, { useContext, useState, useEffect, useRef } from 'react'
import { assets } from '../assets/assets'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'
import { StaffContext } from '../context/StaffContext'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const Navbar = () => {
  const { dToken, setDToken } = useContext(DoctorContext)
  const { aToken, setAToken, appointments, getAllAppointments } = useContext(AdminContext)
  const { sToken, setSToken, setStaffRole, staffRole } = useContext(StaffContext)
  const navigate = useNavigate()

  const [showNotifs, setShowNotifs] = useState(false)
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true')
  const [notifRead, setNotifRead] = useState(false)
  const notifRef = useRef(null)

  // Recent appointments as notifications
  const recentAppointments = (appointments || []).slice(0, 5)
  const unreadCount = notifRead ? 0 : recentAppointments.length

  useEffect(() => {
    if (aToken && getAllAppointments) getAllAppointments()
  }, [aToken])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('darkMode', 'true')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('darkMode', 'false')
    }
  }, [darkMode])

  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const logout = () => {
    navigate('/')
    if (dToken) { setDToken(''); localStorage.removeItem('dToken') }
    if (aToken) { setAToken(''); localStorage.removeItem('aToken') }
    if (sToken) { setSToken(''); setStaffRole(''); localStorage.removeItem('sToken'); localStorage.removeItem('staffRole') }
  }

  const roleLabel = aToken ? 'Admin' : dToken ? 'Doctor' : staffRole || 'Staff'
  const roleColor = aToken ? 'bg-slate-900 text-white' : dToken ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'

  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
  const fmtDate = (d) => { const p = d.split('_'); return `${p[0]} ${months[Number(p[1])]} ${p[2]}` }

  return (
    <div className='sticky top-0 z-40 flex justify-between items-center px-4 sm:px-8 py-3 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm'>
      
      {/* Left: Logo + Role badge */}
      <div className='flex items-center gap-3'>
        <div 
          onClick={() => navigate('/')} 
          className='flex items-center gap-2 cursor-pointer group'
        >
          <img className='w-12 h-12 object-contain rounded-full shadow-md group-hover:scale-105 transition-all' src="/sheba_logo.png" alt="Sheba Logo" />
          <span className='text-xl font-extrabold tracking-tighter text-slate-900 hidden xs:block'>Sheba Diagnostic <span className='text-slate-400 font-light text-lg'>Center</span></span>
        </div>
        <span className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${roleColor} border border-current/10`}>
          <span className='w-1.5 h-1.5 rounded-full bg-current animate-pulse'></span>
          {roleLabel}
        </span>
      </div>

      {/* Right: Actions */}
      <div className='flex items-center gap-2 sm:gap-3'>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(d => !d)}
          className='w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-all'
          title={darkMode ? 'Light Mode' : 'Dark Mode'}
        >
          {darkMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>

        {/* Notification Bell */}
        <div className='relative' ref={notifRef}>
          <button
            onClick={() => { setShowNotifs(v => !v); setNotifRead(true) }}
            className='relative w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-all'
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadCount > 0 && (
              <span className='absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center'>
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifs && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.15 }}
                className='absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl shadow-slate-200/80 border border-slate-100 overflow-hidden z-50'
              >
                <div className='flex items-center justify-between px-5 py-4 border-b border-slate-50'>
                  <h3 className='font-bold text-slate-800 text-sm'>Recent Activity</h3>
                  <span className='text-xs text-slate-400 font-medium'>{recentAppointments.length} notifications</span>
                </div>
                <div className='divide-y divide-slate-50 max-h-72 overflow-y-auto'>
                  {recentAppointments.length > 0 ? recentAppointments.map((appt, i) => (
                    <div key={i} className='px-5 py-3.5 hover:bg-slate-50 transition-colors cursor-pointer'>
                      <div className='flex items-center gap-3'>
                        <img className='w-8 h-8 rounded-xl object-cover border border-slate-100' src={appt.docData?.image} alt="" />
                        <div className='flex-1 min-w-0'>
                          <p className='text-slate-800 font-bold text-xs truncate'>
                            {appt.userData?.name}
                          </p>
                          <p className='text-slate-400 text-[10px] mt-0.5'>
                            with {appt.docData?.name} · {fmtDate(appt.slotDate)}
                          </p>
                        </div>
                        <div>
                          {appt.cancelled
                            ? <span className='w-2 h-2 bg-rose-500 rounded-full inline-block'></span>
                            : appt.isCompleted
                            ? <span className='w-2 h-2 bg-emerald-500 rounded-full inline-block'></span>
                            : <span className='w-2 h-2 bg-amber-500 rounded-full inline-block animate-pulse'></span>
                          }
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className='py-8 text-center text-slate-400 text-sm'>No recent activity</div>
                  )}
                </div>
                <div className='px-5 py-3 border-t border-slate-50 bg-slate-50/50'>
                  <button
                    onClick={() => { navigate(aToken ? '/all-appointments' : '/doctor-appointments'); setShowNotifs(false) }}
                    className='w-full text-slate-900 text-xs font-bold hover:underline'
                  >
                    View all appointments →
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Logout */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={logout}
          className='bg-slate-800 text-white text-xs sm:text-sm px-5 py-2.5 rounded-xl font-bold hover:bg-slate-900 transition-all shadow-sm'
        >
          Logout
        </motion.button>
      </div>
    </div>
  )
}

export default Navbar