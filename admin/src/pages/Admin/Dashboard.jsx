import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import { motion } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import SkeletonLoader from '../../components/SkeletonLoader'

// Animated Counter Component
const AnimatedCounter = ({ from, to }) => {
  const [count, setCount] = useState(from)

  useEffect(() => {
    let start = from
    const duration = 1500 // 1.5 seconds
    const increment = to / (duration / 16) // 60fps

    const timer = setInterval(() => {
      start += increment
      if (start >= to) {
        setCount(to)
        clearInterval(timer)
      } else {
        setCount(Math.ceil(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [to, from])

  return <span>{count}</span>
}

const Dashboard = () => {
  const navigate = useNavigate()
  const { aToken, getDashData, cancelAppointment, dashData } = useContext(AdminContext)
  const { slotDateFormat } = useContext(AppContext)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
        if (aToken) {
            setLoading(true)
            await getDashData()
            setLoading(false)
        }
    }
    fetchData()
  }, [aToken])

  // Mock data for the chart since the backend doesn't provide historical data yet
  const chartData = [
    { name: 'Mon', appointments: 12, revenue: 1500 },
    { name: 'Tue', appointments: 19, revenue: 2300 },
    { name: 'Wed', appointments: 15, revenue: 1800 },
    { name: 'Thu', appointments: 22, revenue: 2900 },
    { name: 'Fri', appointments: 28, revenue: 3500 },
    { name: 'Sat', appointments: 14, revenue: 1600 },
    { name: 'Sun', appointments: 8, revenue: 900 },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  if (loading) {
    return (
        <div className='p-6 md:p-8 bg-gray-50 min-h-screen'>
            <div className='mb-8'>
                <div className='h-8 w-48 bg-gray-200 rounded animate-pulse mb-2'></div>
                <div className='h-4 w-64 bg-gray-100 rounded animate-pulse'></div>
            </div>
            <SkeletonLoader type="card" rows={3} />
            <div className='mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8'>
                <div className='lg:col-span-2 bg-white rounded-2xl p-6 h-[400px] shadow-sm'>
                    <SkeletonLoader type="table" rows={6} />
                </div>
                <div className='bg-white rounded-2xl p-6 h-[400px] shadow-sm'>
                    <SkeletonLoader type="table" rows={6} />
                </div>
            </div>
        </div>
    )
  }

  return dashData && (
    <div className='p-6 md:p-8 bg-gray-50 min-h-screen'>
      
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className='relative overflow-hidden bg-white border border-slate-200 rounded-[2rem] p-8 md:p-12 mb-10 text-slate-800 shadow-xl shadow-slate-200/50'
      >
        <div className='absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-indigo-50 to-transparent z-0'></div>
        <div className='absolute -top-24 -right-24 w-64 h-64 bg-indigo-100/50 rounded-full blur-3xl'></div>
        
        <div className='relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6'>
            <div>
                <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className='px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 inline-block border border-indigo-100'
                >
                    System Administrator
                </motion.span>
                <h1 className='text-4xl md:text-5xl font-extrabold tracking-tight mb-2 text-slate-900'>Welcome Back</h1>
                <p className='text-slate-500 text-lg font-light max-w-xl'>Your diagnostic center is performing at <span className='text-indigo-600 font-bold'>optimal capacity</span>. You have {dashData?.appointments || 0} pending engagements today.</p>
            </div>
            
            <div className='flex items-center gap-4'>
                <div className='text-right hidden md:block'>
                    <p className='text-slate-400 text-xs font-bold uppercase tracking-tighter'>Live Pulse</p>
                    <p className='text-2xl font-mono font-bold text-indigo-600'>98.2%</p>
                </div>
                <div className='w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
            </div>
        </div>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'
      >
        {/* Doctors Card */}
        <motion.div variants={itemVariants} className='bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden'>
          <div className='absolute -right-4 -bottom-4 w-24 h-24 bg-slate-50 rounded-full opacity-50 pointer-events-none'></div>
          <div className='flex items-center gap-4 relative z-10'>
            <div className='w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center text-slate-800'>
              <img className='w-8' src={assets.doctor_icon} alt="Doctors" style={{ filter: 'brightness(0) saturate(100%) invert(29%) sepia(97%) saturate(1478%) hue-rotate(164deg) brightness(96%) contrast(101%)' }} />
            </div>
            <div>
              <p className='text-3xl font-bold text-gray-800'><AnimatedCounter from={0} to={dashData.doctors} /></p>
              <p className='text-sm text-gray-500 font-medium uppercase tracking-wide mt-1'>Total Doctors</p>
            </div>
          </div>
        </motion.div>

        {/* Appointments Card */}
        <motion.div variants={itemVariants} className='bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden'>
          <div className='absolute -right-4 -bottom-4 w-24 h-24 bg-slate-50 rounded-full opacity-50 pointer-events-none'></div>
          <div className='flex items-center gap-4 relative z-10'>
            <div className='w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center text-slate-800'>
              <img className='w-8' src={assets.appointments_icon} alt="Appointments" style={{ filter: 'brightness(0) saturate(100%) invert(60%) sepia(87%) saturate(464%) hue-rotate(106deg) brightness(93%) contrast(92%)' }} />
            </div>
            <div>
              <p className='text-3xl font-bold text-gray-800'><AnimatedCounter from={0} to={dashData.appointments} /></p>
              <p className='text-sm text-gray-500 font-medium uppercase tracking-wide mt-1'>Appointments</p>
            </div>
          </div>
        </motion.div>

        {/* Patients Card */}
        <motion.div variants={itemVariants} className='bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden'>
          <div className='absolute -right-4 -bottom-4 w-24 h-24 bg-slate-50 rounded-full opacity-50 pointer-events-none'></div>
          <div className='flex items-center gap-4 relative z-10'>
            <div className='w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center text-slate-800'>
              <img className='w-8' src={assets.patients_icon} alt="Patients" style={{ filter: 'brightness(0) saturate(100%) invert(32%) sepia(98%) saturate(1910%) hue-rotate(256deg) brightness(98%) contrast(106%)' }} />
            </div>
            <div>
              <p className='text-3xl font-bold text-gray-800'><AnimatedCounter from={0} to={dashData.patients} /></p>
              <p className='text-sm text-gray-500 font-medium uppercase tracking-wide mt-1'>Total Patients</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Activity Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className='lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6'
        >
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h2 className='text-xl font-bold text-gray-800'>Activity Overview</h2>
              <p className='text-sm text-gray-500'>Appointments volume past 7 days</p>
            </div>
            <select className='bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-primary focus:border-primary block p-2'>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>This Year</option>
            </select>
          </div>
          <div className='h-[300px] w-full'>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAppointments" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f172a" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0f172a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '3 3' }}
                />
                <Area type="monotone" dataKey="appointments" stroke="#0f172a" strokeWidth={3} fillOpacity={1} fill="url(#colorAppointments)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Latest Bookings */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col'
        >
          <div className='flex items-center gap-3 px-6 py-5 border-b border-gray-100 bg-gray-50/50'>
            <div className='bg-slate-100 p-2 rounded-lg'>
              <img className='w-5 h-5' src={assets.list_icon} alt="List" style={{ filter: 'brightness(0) saturate(100%) invert(29%) sepia(97%) saturate(1478%) hue-rotate(164deg) brightness(96%) contrast(101%)' }} />
            </div>
            <h2 className='text-lg font-bold text-gray-800'>Latest Bookings</h2>
          </div>

          <div className='flex-1 overflow-y-auto p-2'>
            {dashData.latestAppointments.length > 0 ? dashData.latestAppointments.slice(0, 6).map((item, index) => (
              <motion.div 
                whileHover={{ x: 4, backgroundColor: '#f8fafc' }}
                className='flex items-center justify-between px-4 py-3 gap-3 rounded-xl transition-colors' 
                key={index}
              >
                <div className='flex items-center gap-3'>
                  <div className='relative'>
                    <img className='rounded-full w-12 h-12 object-cover border-2 border-white shadow-sm bg-slate-50' src={item.docData.image} alt={item.docData.name} />
                    <span className='absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full'></span>
                  </div>
                  <div className='text-sm'>
                    <p className='text-gray-800 font-bold'>{item.docData.name}</p>
                    <p className='text-gray-500 text-xs mt-0.5 flex items-center gap-1'>
                      <span>📅</span> {slotDateFormat(item.slotDate)}
                    </p>
                  </div>
                </div>
                
                <div>
                  {item.cancelled ? (
                    <span className='px-2.5 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-md'>Cancelled</span>
                  ) : item.isCompleted ? (
                    <span className='px-2.5 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-md'>Completed</span>
                  ) : (
                    <button 
                      onClick={() => cancelAppointment(item._id)} 
                      className='p-2 hover:bg-red-50 rounded-lg group transition-colors'
                      title="Cancel Appointment"
                    >
                      <img className='w-5 opacity-40 group-hover:opacity-100 transition-opacity' src={assets.cancel_icon} alt="Cancel" />
                    </button>
                  )}
                </div>
              </motion.div>
            )) : (
              <div className='flex flex-col items-center justify-center h-full py-10 text-center'>
                <div className='w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3 text-2xl'>📭</div>
                <p className='text-gray-500 font-medium'>No recent bookings</p>
              </div>
            )}
          </div>
          
          <div className='p-4 border-t border-gray-100'>
            <button 
                onClick={() => navigate('/all-appointments')}
                className='w-full py-2.5 text-slate-900 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors'
            >
              View All Appointments
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard