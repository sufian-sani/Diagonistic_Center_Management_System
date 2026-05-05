import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { motion } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { assets } from '../../assets/assets'

const StatCard = ({ icon, label, value, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className={`relative overflow-hidden bg-white rounded-3xl p-6 border border-slate-100 shadow-lg shadow-slate-100/50 group hover:shadow-xl transition-all`}
  >
    <div className={`absolute -right-6 -bottom-6 w-28 h-28 ${color.bg} rounded-full opacity-20 group-hover:opacity-30 transition-opacity`}></div>
    <div className={`w-14 h-14 ${color.bg} rounded-2xl flex items-center justify-center mb-5`}>
      <img className='w-8 h-8' src={icon} alt={label} style={{ filter: color.filter }} />
    </div>
    <p className='text-4xl font-extrabold text-slate-800 tracking-tight'>{value}</p>
    <p className='text-slate-400 font-semibold text-xs uppercase tracking-widest mt-2'>{label}</p>
  </motion.div>
)

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { dToken, dashData, getDashData, cancelAppointment, completeAppointment } = useContext(DoctorContext)
  const { slotDateFormat, currency } = useContext(AppContext)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    if (dToken) getDashData()
  }, [dToken])

  const chartData = [
    { name: 'Mon', patients: 4 },
    { name: 'Tue', patients: 7 },
    { name: 'Wed', patients: 5 },
    { name: 'Thu', patients: 9 },
    { name: 'Fri', patients: 11 },
    { name: 'Sat', patients: 6 },
    { name: 'Sun', patients: 3 },
  ]

  const getStatusBadge = (item) => {
    if (item.cancelled) return <span className='px-3 py-1 bg-rose-50 text-rose-600 text-[10px] font-extrabold rounded-lg uppercase tracking-wider'>Cancelled</span>
    if (item.isCompleted) return <span className='px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-extrabold rounded-lg uppercase tracking-wider'>Completed</span>
    return <span className='px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-extrabold rounded-lg uppercase tracking-wider'>Upcoming</span>
  }

  const filteredAppts = dashData?.latestAppointments?.filter(item => {
    if (activeTab === 'upcoming') return !item.cancelled && !item.isCompleted
    if (activeTab === 'completed') return item.isCompleted
    if (activeTab === 'cancelled') return item.cancelled
    return true
  }) || []

  if (!dashData) return (
    <div className='flex items-center justify-center min-h-[60vh]'>
      <div className='w-12 h-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin'></div>
    </div>
  )

  return (
    <div className='p-6 md:p-8 bg-gray-50 min-h-screen'>

      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className='relative overflow-hidden bg-slate-900 rounded-[2rem] p-8 md:p-10 mb-10 text-white'
      >
        <div className='absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/20 to-transparent z-0'></div>
        <div className='absolute -top-20 -right-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl'></div>
        <div className='relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6'>
          <div>
            <span className='px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest inline-block mb-4'>
              Medical Dashboard
            </span>
            <h1 className='text-4xl md:text-5xl font-extrabold tracking-tight mb-2'>Good Morning, Doctor 👋</h1>
            <p className='text-slate-400 text-base font-light max-w-lg'>
              You have <span className='text-emerald-400 font-bold'>{dashData?.appointments || 0} appointments</span> total and have served <span className='text-blue-400 font-bold'>{dashData?.patients || 0} unique patients</span>.
            </p>
          </div>
          <div className='flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5'>
            <div className='w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-2xl'>💊</div>
            <div>
              <p className='text-xs text-slate-400 font-bold uppercase tracking-wider'>Total Earnings</p>
              <p className='text-3xl font-extrabold text-white'>{currency}{dashData?.earnings || 0}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-10'>
        <StatCard delay={0.1} icon={assets.earning_icon} label="Total Earnings" value={`${currency}${dashData.earnings}`} color={{ bg: 'bg-emerald-50', filter: 'brightness(0) saturate(100%) invert(48%) sepia(79%) saturate(432%) hue-rotate(113deg) brightness(93%) contrast(96%)' }} />
        <StatCard delay={0.2} icon={assets.appointments_icon} label="Appointments" value={dashData.appointments} color={{ bg: 'bg-slate-100', filter: 'brightness(0) saturate(100%) invert(29%) sepia(97%) saturate(1478%) hue-rotate(164deg) brightness(96%) contrast(101%)' }} />
        <StatCard delay={0.3} icon={assets.patients_icon} label="Unique Patients" value={dashData.patients} color={{ bg: 'bg-slate-100', filter: 'brightness(0) saturate(100%) invert(32%) sepia(98%) saturate(1910%) hue-rotate(256deg) brightness(98%) contrast(106%)' }} />
      </div>

      {/* Chart + Appointments Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-5 gap-8'>

        {/* Weekly Activity Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className='lg:col-span-3 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 p-8'
        >
          <div className='flex items-center justify-between mb-8'>
            <div>
              <h2 className='text-2xl font-bold text-slate-800'>Weekly Overview</h2>
              <p className='text-slate-400 text-sm mt-1'>Patient appointments this week</p>
            </div>
            <div className='px-4 py-2 bg-slate-50 rounded-xl border border-slate-100'>
              <p className='text-xs font-bold text-slate-400 uppercase tracking-widest'>This Week</p>
            </div>
          </div>
          <div className='h-[240px]'>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="patientGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f172a" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0f172a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontSize: '13px' }} />
                <Area type="monotone" dataKey="patients" stroke="#0f172a" strokeWidth={3} fill="url(#patientGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className='lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 p-8 flex flex-col justify-between'
        >
          <h2 className='text-2xl font-bold text-slate-800 mb-6'>Quick Metrics</h2>
          <div className='space-y-5'>
            {[
              { label: 'Consultation Rate', value: '94%', color: 'bg-emerald-500', width: 'w-[94%]' },
              { label: 'Patient Satisfaction', value: '98%', color: 'bg-slate-900', width: 'w-[98%]' },
              { label: 'Appointment Completion', value: '87%', color: 'bg-amber-500', width: 'w-[87%]' },
              { label: 'Cancellation Rate', value: '6%', color: 'bg-rose-400', width: 'w-[6%]' },
            ].map((metric, i) => (
              <div key={i}>
                <div className='flex justify-between mb-2'>
                  <p className='text-slate-600 font-semibold text-sm'>{metric.label}</p>
                  <p className='text-slate-800 font-extrabold text-sm'>{metric.value}</p>
                </div>
                <div className='h-2 bg-slate-100 rounded-full overflow-hidden'>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: 0.6 + i * 0.1, duration: 1 }}
                    className={`h-full ${metric.color} ${metric.width} rounded-full`}
                  ></motion.div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Appointments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className='mt-8 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden'
      >
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between p-8 border-b border-slate-50 gap-4'>
          <div>
            <h2 className='text-2xl font-bold text-slate-800'>Recent Appointments</h2>
            <p className='text-slate-400 text-sm mt-1'>Latest patient bookings for your schedule</p>
          </div>
          {/* Filter Tabs */}
          <div className='flex bg-slate-100 rounded-xl p-1 gap-1'>
            {['all', 'upcoming', 'completed', 'cancelled'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${activeTab === tab ? 'bg-white shadow text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className='divide-y divide-slate-50'>
          {filteredAppts.slice(0, 6).map((item, index) => (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              key={index}
              className='flex items-center gap-4 px-8 py-5 hover:bg-slate-50/50 transition-colors group'
            >
              <div className='relative'>
                <img className='rounded-2xl w-14 h-14 object-cover border-2 border-white shadow-md' src={item.userData.image || 'https://randomuser.me/api/portraits/lego/1.jpg'} alt="" />
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white rounded-full ${item.isCompleted ? 'bg-emerald-500' : item.cancelled ? 'bg-rose-500' : 'bg-blue-500'}`}></div>
              </div>
              <div className='flex-1'>
                <p className='text-slate-800 font-bold text-lg leading-tight group-hover:text-primary transition-colors'>{item.userData.name}</p>
                <p className='text-slate-400 text-xs font-medium mt-1 flex items-center gap-1'>
                  📅 {slotDateFormat(item.slotDate)} &nbsp;·&nbsp; ⏰ {item.slotTime}
                </p>
              </div>
              <div className='flex items-center gap-3'>
                {getStatusBadge(item)}
                {!item.cancelled && !item.isCompleted && (
                  <div className='flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                    <button
                      onClick={() => cancelAppointment(item._id)}
                      className='w-9 h-9 bg-rose-50 hover:bg-rose-100 rounded-xl flex items-center justify-center transition-colors'
                      title="Cancel"
                    >
                      <img className='w-5' src={assets.cancel_icon} alt="" />
                    </button>
                    <button
                      onClick={() => completeAppointment(item._id)}
                      className='w-9 h-9 bg-emerald-50 hover:bg-emerald-100 rounded-xl flex items-center justify-center transition-colors'
                      title="Complete"
                    >
                      <img className='w-5' src={assets.tick_icon} alt="" />
                    </button>
                    <button
                      onClick={() => navigate(`/live-consultation/${item._id}`)}
                      className='px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl flex items-center justify-center transition-colors font-bold text-xs'
                      title="Join Video Call"
                    >
                      🎥 Call
                    </button>
                    <button
                      onClick={() => navigate(`/prescription-builder/${item._id}`)}
                      className='px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center transition-colors font-bold text-xs'
                      title="Generate Prescription"
                    >
                      💊 Prescribe
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {filteredAppts.length === 0 && (
            <div className='py-20 text-center'>
              <div className='text-5xl mb-4 opacity-20 grayscale'>📭</div>
              <h3 className='text-slate-700 font-bold'>No appointments found</h3>
              <p className='text-slate-400 text-sm mt-1'>No {activeTab} appointments to display</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default DoctorDashboard