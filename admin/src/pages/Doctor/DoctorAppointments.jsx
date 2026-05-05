import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const StatusBadge = ({ item }) => {
  if (item.cancelled) return <span className='px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold rounded-full uppercase tracking-wider'>Cancelled</span>
  if (item.isCompleted) return <span className='px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold rounded-full uppercase tracking-wider'>Completed</span>
  return <span className='px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold rounded-full uppercase tracking-wider'>Upcoming</span>
}

const DoctorAppointments = () => {
  const { dToken, appointments, getAppointments, cancelAppointment, completeAppointment } = useContext(DoctorContext)
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext)
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      if (dToken) { setLoading(true); await getAppointments(); setLoading(false) }
    }
    load()
  }, [dToken])

  const filtered = (appointments || []).filter(item => {
    const matchSearch = item.userData.name.toLowerCase().includes(search.toLowerCase())
    const status = item.cancelled ? 'Cancelled' : item.isCompleted ? 'Completed' : 'Upcoming'
    const matchStatus = statusFilter === 'All' || status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className='p-6 md:p-8 bg-gray-50 min-h-screen w-full'>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className='mb-10'>
        <h1 className='text-4xl font-extrabold text-slate-800 tracking-tight'>My Appointments</h1>
        <p className='text-slate-400 mt-2 font-light text-lg'>Track your patient consultations and manage bookings.</p>
      </motion.div>

      {/* Quick stats */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-10'>
        {[
          { label: 'Total', value: appointments?.length || 0, icon: '📋', color: 'bg-slate-900 text-white' },
          { label: 'Upcoming', value: appointments?.filter(a => !a.cancelled && !a.isCompleted).length || 0, icon: '⏳', color: 'bg-slate-100 text-slate-700' },
          { label: 'Completed', value: appointments?.filter(a => a.isCompleted).length || 0, icon: '✅', color: 'bg-emerald-50 text-emerald-700' },
          { label: 'Cancelled', value: appointments?.filter(a => a.cancelled).length || 0, icon: '❌', color: 'bg-rose-50 text-rose-700' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            onClick={() => setStatusFilter(s.label === 'Total' ? 'All' : s.label)}
            className={`${s.color} rounded-2xl p-5 flex items-center gap-4 border border-slate-100 shadow-sm cursor-pointer hover:scale-[1.02] transition-transform`}
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
            <svg className='w-5 h-5 text-slate-400' fill="none" viewBox="0 0 20 20"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/></svg>
          </div>
          <input type='text' value={search} onChange={e => setSearch(e.target.value)} placeholder='Search by patient name...'
            className='w-full p-3.5 pl-12 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-slate-900/10 focus:border-slate-900 transition-all shadow-sm outline-none'
          />
        </div>
        <div className='flex bg-white border border-slate-200 rounded-2xl p-1 shadow-sm gap-1'>
          {['All', 'Upcoming', 'Completed', 'Cancelled'].map(tab => (
            <button key={tab} onClick={() => setStatusFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${statusFilter === tab ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-slate-700'}`}
            >{tab}</button>
          ))}
        </div>
      </div>

      {/* Appointments List */}
      <div className='space-y-4'>
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className='bg-white rounded-3xl border border-slate-100 p-6 animate-pulse flex gap-4'>
              <div className='w-16 h-16 bg-slate-100 rounded-2xl'></div>
              <div className='flex-1 space-y-2 py-2'>
                <div className='h-4 bg-slate-100 rounded w-1/3'></div>
                <div className='h-3 bg-slate-50 rounded w-1/4'></div>
              </div>
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div className='py-24 text-center bg-white rounded-3xl border border-slate-100'>
            <div className='text-5xl mb-4 opacity-20 grayscale'>📭</div>
            <h3 className='text-slate-700 font-bold'>No appointments found</h3>
          </div>
        ) : (
          filtered.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className='bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg hover:shadow-slate-100 transition-all overflow-hidden group'
            >
              <div className='flex flex-col sm:flex-row items-start sm:items-center gap-5 p-6'>
                {/* Patient Photo */}
                <div className='relative'>
                  <img className='w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md' src={item.userData.image} alt="" />
                  <div className={`absolute -bottom-1 -right-1 w-5 h-5 border-2 border-white rounded-full ${item.isCompleted ? 'bg-emerald-500' : item.cancelled ? 'bg-rose-500' : 'bg-amber-500'}`}></div>
                </div>

                {/* Info */}
                <div className='flex-1'>
                  <div className='flex flex-wrap items-center gap-3 mb-1'>
                    <h3 className='font-extrabold text-slate-800 text-lg leading-none'>{item.userData.name}</h3>
                    <StatusBadge item={item} />
                    {item.payment && <span className='px-2.5 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-full border border-slate-200 uppercase'>Paid Online</span>}
                  </div>
                  <p className='text-slate-400 text-sm mt-1'>
                    Age {calculateAge(item.userData.dob)} &nbsp;·&nbsp; 📅 {slotDateFormat(item.slotDate)} &nbsp;·&nbsp; ⏰ {item.slotTime} &nbsp;·&nbsp; 💰 {currency}{item.amount}
                  </p>
                  {item.note && (
                    <p className='mt-2 text-xs bg-amber-50 text-amber-700 px-3 py-1.5 rounded-xl border border-amber-100 inline-block'>
                      📝 {item.note}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className='flex items-center gap-3'>
                  <button
                    onClick={() => navigate(`/appointment-details/${item._id}`)}
                    className='px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-slate-600 text-xs font-bold transition-all'
                  >
                    View Details
                  </button>
                  {!item.cancelled && !item.isCompleted && (
                    <>
                      {item.isTeleconsultation && (
                        <button
                          onClick={() => navigate(`/live-consultation/${item._id}`)}
                          className='px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-2xl text-indigo-600 text-xs font-bold transition-all flex items-center gap-2'
                          title="Join Video Call"
                        >
                          <span>🎥</span> Join Call
                        </button>
                      )}
                      <button
                        onClick={() => cancelAppointment(item._id)}
                        className='w-10 h-10 bg-rose-50 hover:bg-rose-100 border border-rose-100 rounded-2xl flex items-center justify-center transition-all'
                        title="Cancel"
                      >
                        <img className='w-5' src={assets.cancel_icon} alt="" />
                      </button>
                      <button
                        onClick={() => completeAppointment(item._id)}
                        className='w-10 h-10 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 rounded-2xl flex items-center justify-center transition-all'
                        title="Mark Complete"
                      >
                        <img className='w-5' src={assets.tick_icon} alt="" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}

export default DoctorAppointments