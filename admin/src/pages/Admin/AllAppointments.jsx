import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { StaffContext } from '../../context/StaffContext'
import { AppContext } from '../../context/AppContext'
import { motion, AnimatePresence } from 'framer-motion'
import { downloadInvoice } from '../../utils/generateInvoice';

const STATUS_CONFIG = {
  Completed: { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  Cancelled: { color: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500' },
  Arrived:   { color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  Upcoming:  { color: 'bg-slate-100 text-slate-700 border-slate-200', dot: 'bg-slate-500' },
}

const StatusBadge = ({ item }) => {
  let label = 'Upcoming';
  if (item.cancelled) label = 'Cancelled';
  else if (item.isCompleted) label = 'Completed';
  else if (item.hasArrived) label = 'Arrived';
  
  const cfg = STATUS_CONFIG[label]
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${label === 'Arrived' ? 'animate-pulse' : ''}`}></span>
      {label}
    </span>
  )
}

const AllAppointments = () => {
  const { aToken, appointments: adminAppointments, cancelAppointment: adminCancelAppointment, getAllAppointments } = useContext(AdminContext)
  const { sToken, staffRole, appointments: staffAppointments, getAppointments: getStaffAppointments, checkInAppointment, markAsPaid } = useContext(StaffContext)
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext)

  const appointments = aToken ? adminAppointments : staffAppointments;
  const cancelAppointment = aToken ? adminCancelAppointment : () => {};

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      if (aToken) { await getAllAppointments(); }
      if (sToken) { await getStaffAppointments(); }
      setLoading(false)
    }
    load()
  }, [aToken, sToken])

  const filtered = appointments.filter(item => {
    const matchSearch =
      item.userData?.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.docData?.name?.toLowerCase().includes(search.toLowerCase())
    
    let status = 'Upcoming';
    if (item.cancelled) status = 'Cancelled';
    else if (item.isCompleted) status = 'Completed';
    else if (item.hasArrived) status = 'Arrived';

    const matchStatus = statusFilter === 'All' || status === statusFilter || (statusFilter === 'Upcoming' && status === 'Arrived');
    return matchSearch && matchStatus
  })

  const stats = {
    total: appointments.length,
    arrived: appointments.filter(a => !a.cancelled && !a.isCompleted && a.hasArrived).length,
    upcoming: appointments.filter(a => !a.cancelled && !a.isCompleted && !a.hasArrived).length,
    completed: appointments.filter(a => a.isCompleted).length,
  }

  return (
    <div className='p-6 md:p-8 bg-slate-50 min-h-screen w-full'>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className='mb-10'>
        <h1 className='text-4xl font-extrabold text-slate-900 tracking-tight'>Live Queue & Appointments</h1>
        <p className='text-slate-500 mt-2 font-light text-lg'>Manage check-ins and monitor the waiting room in real-time.</p>
      </motion.div>

      {/* Stat Cards */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-10'>
        {[
          { label: 'Total', value: stats.total, icon: '📋', color: 'bg-slate-900 text-white' },
          { label: 'Arrived/Waiting', value: stats.arrived, icon: '🚶', color: 'bg-amber-50 text-amber-700 border-amber-200' },
          { label: 'Upcoming', value: stats.upcoming, icon: '⏳', color: 'bg-slate-100 text-slate-700' },
          { label: 'Completed', value: stats.completed, icon: '✅', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            onClick={() => setStatusFilter(s.label === 'Total' ? 'All' : s.label.split('/')[0])}
            className={`${s.color} rounded-2xl p-5 flex items-center gap-4 border border-slate-200 shadow-sm cursor-pointer hover:scale-[1.02] transition-transform`}
          >
            <span className='text-3xl'>{s.icon}</span>
            <div>
              <p className='text-3xl font-extrabold leading-none'>{s.value}</p>
              <p className='text-xs font-bold uppercase tracking-widest opacity-70 mt-1'>{s.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className='flex flex-col sm:flex-row gap-4 mb-6'>
        <div className='relative flex-1 max-w-md'>
          <div className='absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none'>
            <svg className='w-5 h-5 text-slate-400' fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
          </div>
          <input
            type='text'
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder='Search by patient or doctor name...'
            className='w-full p-3.5 pl-12 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-slate-900/10 focus:border-slate-900 transition-all shadow-sm outline-none'
          />
        </div>
      </div>

      {/* Table */}
      <div className='bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden'>
        <div className='hidden lg:grid grid-cols-[2fr_2fr_1.5fr_1fr_1fr_1fr] px-8 py-4 bg-slate-50 border-b border-slate-200'>
          {['Patient', 'Doctor', 'Date & Time', 'Fees', 'Status', 'Action'].map(h => (
            <p key={h} className='text-xs font-bold text-slate-500 uppercase tracking-widest'>{h}</p>
          ))}
        </div>

        <div className='divide-y divide-slate-100'>
          {loading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className='flex items-center gap-4 px-8 py-5 animate-pulse'>
                <div className='w-10 h-10 bg-slate-100 rounded-xl'></div>
                <div className='flex-1 space-y-2'><div className='h-3 bg-slate-200 rounded w-1/3'></div><div className='h-2 bg-slate-100 rounded w-1/4'></div></div>
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className='py-24 text-center'>
              <div className='text-5xl mb-4 opacity-20 grayscale'>📭</div>
              <h3 className='text-slate-700 font-bold'>No appointments found</h3>
            </div>
          ) : (
            filtered.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className={`flex flex-col lg:grid lg:grid-cols-[2fr_2fr_1.5fr_1fr_1fr_1fr] items-start lg:items-center gap-3 px-8 py-5 transition-colors group ${item.hasArrived && !item.isCompleted ? 'bg-amber-50/30' : 'hover:bg-slate-50/70'}`}
              >
                {/* Patient */}
                <div className='flex items-center gap-3'>
                  <img className='w-11 h-11 rounded-2xl object-cover border border-slate-200 shadow-sm' src={item.userData.image} alt="" />
                  <div>
                    <p className='font-bold text-slate-900 text-sm'>{item.userData.name}</p>
                    <p className='text-slate-500 text-xs'>Age {calculateAge(item.userData.dob)}</p>
                  </div>
                </div>
                {/* Doctor */}
                <div className='flex items-center gap-3'>
                  <img className='w-11 h-11 rounded-2xl object-cover border border-slate-200 shadow-sm bg-slate-50' src={item.docData.image} alt="" />
                  <div>
                    <p className='font-bold text-slate-900 text-sm'>{item.docData.name}</p>
                    <p className='text-slate-500 text-xs'>{item.docData.speciality}</p>
                  </div>
                </div>
                {/* Date */}
                <div>
                  <p className='font-semibold text-slate-800 text-sm'>{slotDateFormat(item.slotDate)}</p>
                  <p className='text-slate-500 text-xs mt-0.5'>{item.slotTime}</p>
                </div>
                {/* Fees */}
                <p className='font-bold text-slate-900'>{currency}{item.amount}</p>
                {/* Status */}
                <StatusBadge item={item} />
                {/* Action */}
                <div className="flex gap-2">
                  {!item.cancelled && !item.isCompleted && !item.hasArrived && sToken && staffRole === 'Receptionist' && (
                    <button
                      onClick={() => checkInAppointment(item._id)}
                      className='px-3 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-sm'
                    >
                      Check-In
                    </button>
                  )}
                  {!item.cancelled && !item.isCompleted && !item.payment && sToken && staffRole === 'Receptionist' && (
                    <button
                      onClick={() => markAsPaid(item._id)}
                      className='px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-xl transition-all shadow-sm'
                    >
                      Collect Pay
                    </button>
                  )}
                  {item.payment && (
                    <button
                      onClick={() => downloadInvoice(item, currency)}
                      className='px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all shadow-sm'
                    >
                      Invoice
                    </button>
                  )}
                  <button
                    onClick={() => navigate(`/patient-profile/${item.userId}`)}
                    className='w-9 h-9 flex items-center justify-center bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-500 transition-all shadow-sm'
                    title="Patient Record"
                  >
                    👤
                  </button>
                  {aToken && !item.cancelled && !item.isCompleted && (
                    <button
                      onClick={() => cancelAppointment(item._id)}
                      className='px-3 py-1.5 text-xs font-bold text-rose-500 bg-rose-50 hover:bg-rose-100 border border-rose-100 rounded-xl transition-all'
                    >
                      Cancel
                    </button>
                  )}
                  {(item.cancelled || item.isCompleted || (item.hasArrived && !aToken)) && (
                     <span className='text-xs text-slate-300 font-medium'>—</span>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default AllAppointments