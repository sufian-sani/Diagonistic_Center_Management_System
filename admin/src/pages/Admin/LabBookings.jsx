import React, { useContext, useEffect, useState } from 'react'
import { StaffContext } from '../../context/StaffContext'
import { AdminContext } from '../../context/AdminContext'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import axios from 'axios'

const STATUS_COLORS = {
  Pending:    'bg-amber-50 text-amber-700 border-amber-200',
  Processing: 'bg-blue-50 text-blue-700 border-blue-200',
  Completed:  'bg-emerald-50 text-emerald-700 border-emerald-200',
  Delivered:  'bg-slate-100 text-slate-600 border-slate-200',
}

const LabBookings = () => {
  const { sToken, staffRole, labBookings, getLabBookings, checkInLabBooking, markLabPaid, updateLabStatus, cancelLabBookingStaff } = useContext(StaffContext)
  const { aToken, backendUrl } = useContext(AdminContext)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [loading, setLoading] = useState(true)
  const [adminBookings, setAdminBookings] = useState([])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      if (sToken) await getLabBookings()
      if (aToken) {
        try {
          const { data } = await axios.get(`${backendUrl}/api/lab/admin/all`, { headers: { atoken: aToken } })
          if (data.success) setAdminBookings(data.bookings)
        } catch (e) { toast.error('Failed to load lab bookings') }
      }
      setLoading(false)
    }
    load()
  }, [sToken, aToken])

  const bookings = aToken ? adminBookings : labBookings

  const filtered = bookings.filter(b => {
    const name = b.userData?.name?.toLowerCase() || ''
    const test = b.testName?.toLowerCase() || ''
    const matchSearch = name.includes(search.toLowerCase()) || test.includes(search.toLowerCase())
    const matchStatus = statusFilter === 'All' || b.status === statusFilter || (b.cancelled && statusFilter === 'Cancelled')
    return matchSearch && matchStatus && !b.cancelled
  })

  const stats = {
    total: bookings.filter(b => !b.cancelled).length,
    pending: bookings.filter(b => b.status === 'Pending' && !b.cancelled).length,
    processing: bookings.filter(b => b.status === 'Processing' && !b.cancelled).length,
    completed: bookings.filter(b => (b.status === 'Completed' || b.status === 'Delivered') && !b.cancelled).length,
  }

  return (
    <div className="p-6 md:p-8 bg-slate-50 min-h-screen w-full">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-xl">🧪</div>
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Lab Test Bookings</h1>
            <p className="text-slate-500 font-light text-base">Patient-booked diagnostic tests — manage check-in, payment, and status.</p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total', value: stats.total, icon: '📋', color: 'bg-slate-900 text-white', filter: 'All' },
          { label: 'Pending', value: stats.pending, icon: '⏳', color: 'bg-amber-50 text-amber-700 border-amber-200', filter: 'Pending' },
          { label: 'Processing', value: stats.processing, icon: '🔬', color: 'bg-blue-50 text-blue-700 border-blue-200', filter: 'Processing' },
          { label: 'Completed', value: stats.completed, icon: '✅', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', filter: 'Completed' },
        ].map((s, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            onClick={() => setStatusFilter(s.filter)}
            className={`${s.color} rounded-2xl p-5 flex items-center gap-4 border border-slate-200 shadow-sm cursor-pointer hover:scale-[1.02] transition-transform`}>
            <span className="text-3xl">{s.icon}</span>
            <div>
              <p className="text-3xl font-extrabold leading-none">{s.value}</p>
              <p className="text-xs font-bold uppercase tracking-widest opacity-70 mt-1">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
          </svg>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by patient name or test..."
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all outline-none shadow-sm"/>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="hidden lg:grid grid-cols-[2fr_2fr_1.5fr_1fr_1fr_1.5fr] px-8 py-4 bg-slate-50 border-b border-slate-200">
          {['Patient', 'Test Booked', 'Slot', 'Status', 'Paid', 'Actions'].map(h => (
            <p key={h} className="text-xs font-bold text-slate-500 uppercase tracking-widest">{h}</p>
          ))}
        </div>

        <div className="divide-y divide-slate-100">
          {loading ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-8 py-5 animate-pulse">
                <div className="w-10 h-10 bg-slate-100 rounded-2xl"/>
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-slate-200 rounded w-1/3"/>
                  <div className="h-2 bg-slate-100 rounded w-1/4"/>
                </div>
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="py-24 text-center">
              <div className="text-5xl mb-4 opacity-20">🧪</div>
              <h3 className="text-slate-700 font-bold">No lab bookings found</h3>
              <p className="text-slate-400 text-sm mt-1">Patient bookings from the website will appear here.</p>
            </div>
          ) : (
            filtered.map((booking, idx) => (
              <motion.div key={booking._id}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.03 }}
                className="flex flex-col lg:grid lg:grid-cols-[2fr_2fr_1.5fr_1fr_1fr_1.5fr] items-start lg:items-center gap-3 px-8 py-5 hover:bg-slate-50/70 transition-colors group">

                {/* Patient */}
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-700 font-extrabold text-lg border border-indigo-200 overflow-hidden">
                    {booking.userData?.image
                      ? <img src={booking.userData.image} alt="" className="w-full h-full object-cover"/>
                      : (booking.userData?.name?.[0] || '?')}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{booking.userData?.name || '—'}</p>
                    <p className="text-slate-400 text-xs">{booking.userData?.phone || booking.userData?.email || '—'}</p>
                  </div>
                </div>

                {/* Test */}
                <div>
                  <p className="font-bold text-slate-800 text-sm">{booking.testName}</p>
                  <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md font-medium">{booking.category}</span>
                </div>

                {/* Slot */}
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{booking.slotDate}</p>
                  <p className="text-slate-400 text-xs">{booking.slotTime}</p>
                </div>

                {/* Status badge */}
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${STATUS_COLORS[booking.status] || STATUS_COLORS.Pending}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${booking.status === 'Processing' ? 'bg-blue-500 animate-pulse' : booking.status === 'Completed' ? 'bg-emerald-500' : 'bg-amber-500'}`}/>
                  {booking.status}
                </span>

                {/* Paid */}
                <div>
                  {booking.payment
                    ? <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">✓ Paid</span>
                    : <span className="text-xs font-bold text-rose-500 bg-rose-50 px-2 py-1 rounded-lg border border-rose-200">Unpaid</span>}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  {sToken && staffRole === 'Receptionist' && !booking.hasArrived && !booking.cancelled && (
                    <button onClick={() => checkInLabBooking(booking._id)}
                      className="px-3 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-sm">
                      Check-In
                    </button>
                  )}
                  {sToken && staffRole === 'Receptionist' && !booking.payment && !booking.cancelled && (
                    <button onClick={() => markLabPaid(booking._id)}
                      className="px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-xl transition-all">
                      Collect Pay
                    </button>
                  )}
                  {(sToken && (staffRole === 'Lab Technician' || staffRole === 'Receptionist')) && (
                    <select value={booking.status}
                      onChange={e => updateLabStatus(booking._id, e.target.value)}
                      className="text-xs bg-white border border-slate-200 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-indigo-500/10 outline-none">
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Completed">Completed</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  )}
                  {sToken && staffRole === 'Receptionist' && !booking.cancelled && (
                    <button onClick={() => cancelLabBookingStaff(booking._id)}
                      className="px-3 py-1.5 text-xs font-bold text-rose-500 bg-rose-50 hover:bg-rose-100 border border-rose-100 rounded-xl transition-all">
                      Cancel
                    </button>
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

export default LabBookings
