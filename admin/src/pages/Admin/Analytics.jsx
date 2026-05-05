import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'

const COLORS = ['#0e7490', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4']

const Analytics = () => {
  const { aToken, appointments, doctors, patients, getAllAppointments, getAllDoctors, getAllPatients } = useContext(AdminContext)
  const { currency } = useContext(AppContext)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      if (aToken) {
        setLoading(true)
        await Promise.all([getAllAppointments(), getAllDoctors(), getAllPatients()])
        setLoading(false)
      }
    }
    load()
  }, [aToken])

  if (loading) return (
    <div className='flex items-center justify-center min-h-[60vh]'>
      <div className='w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin'></div>
    </div>
  )

  // Monthly appointments (mock from real data)
  const monthlyData = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((m, i) => ({
    name: m,
    appointments: Math.floor(Math.random() * 30) + 5,
    revenue: Math.floor(Math.random() * 3000) + 500,
  }))
  // Use real appointments for the last few entries
  monthlyData[11] = { name: 'Dec', appointments: appointments.filter(a=>!a.cancelled).length, revenue: appointments.reduce((s,a)=>s+a.amount,0) }

  // Speciality breakdown
  const specialityMap = {}
  doctors.forEach(d => { specialityMap[d.speciality] = (specialityMap[d.speciality] || 0) + 1 })
  const specialityData = Object.entries(specialityMap).map(([name, value]) => ({ name, value }))

  // Doctor performance
  const doctorPerf = doctors.slice(0, 6).map(d => ({
    name: d.name.replace('Dr. ', ''),
    appointments: appointments.filter(a => a.docId === d._id.toString()).length,
    revenue: appointments.filter(a => a.docId === d._id.toString()).reduce((s,a) => s+a.amount, 0),
  })).sort((a,b) => b.appointments - a.appointments)

  // Status breakdown
  const statusData = [
    { name: 'Completed', value: appointments.filter(a=>a.isCompleted).length, color: '#10b981' },
    { name: 'Upcoming', value: appointments.filter(a=>!a.isCompleted && !a.cancelled).length, color: '#0e7490' },
    { name: 'Cancelled', value: appointments.filter(a=>a.cancelled).length, color: '#ef4444' },
  ]

  const totalRevenue = appointments.reduce((s,a) => s + a.amount, 0)
  const completionRate = appointments.length ? ((appointments.filter(a=>a.isCompleted).length / appointments.length) * 100).toFixed(1) : 0

  return (
    <div className='p-6 md:p-8 bg-gray-50 min-h-screen w-full'>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className='mb-10'>
        <h1 className='text-4xl font-extrabold text-slate-800 tracking-tight'>Analytics</h1>
        <p className='text-slate-400 mt-2 font-light text-lg'>Deep insights into hospital performance and trends.</p>
      </motion.div>

      {/* KPI Cards */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-5 mb-10'>
        {[
          { label: 'Total Revenue', value: `${currency}${totalRevenue.toLocaleString()}`, icon: '💰', color: 'from-emerald-500 to-teal-600', sub: `From ${appointments.length} appointments` },
          { label: 'Active Doctors', value: doctors.filter(d=>d.available).length, icon: '👨‍⚕️', color: 'from-slate-600 to-slate-900', sub: `${doctors.filter(d=>!d.available).length} unavailable` },
          { label: 'Registered Patients', value: patients.length, icon: '🧑‍🤝‍🧑', color: 'from-purple-500 to-violet-600', sub: 'All time registrations' },
          { label: 'Completion Rate', value: `${completionRate}%`, icon: '📊', color: 'from-amber-500 to-orange-500', sub: 'Of all appointments' },
        ].map((kpi, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${kpi.color} p-6 text-white shadow-lg`}
          >
            <div className='absolute -right-6 -bottom-6 w-28 h-28 bg-white/10 rounded-full'></div>
            <div className='text-4xl mb-4'>{kpi.icon}</div>
            <p className='text-3xl font-extrabold tracking-tight'>{kpi.value}</p>
            <p className='font-bold text-sm opacity-90 mt-1'>{kpi.label}</p>
            <p className='text-xs opacity-60 mt-1'>{kpi.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6'>

        {/* Monthly Revenue Trend */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
          className='lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 p-8'
        >
          <h2 className='text-2xl font-bold text-slate-800 mb-2'>Monthly Revenue Trend</h2>
          <p className='text-slate-400 text-sm mb-8'>Simulated revenue across 12 months</p>
          <div className='h-[260px]'>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontSize: '12px' }} formatter={(v) => [`${currency}${v}`, 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Appointment Status Pie */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
          className='bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 p-8'
        >
          <h2 className='text-2xl font-bold text-slate-800 mb-2'>Appointment Status</h2>
          <p className='text-slate-400 text-sm mb-6'>Distribution of all appointments</p>
          <div className='h-[180px]'>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                  {statusData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className='space-y-3 mt-4'>
            {statusData.map((s, i) => (
              <div key={i} className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <div className='w-3 h-3 rounded-full' style={{ backgroundColor: s.color }}></div>
                  <span className='text-slate-600 text-sm font-medium'>{s.name}</span>
                </div>
                <span className='text-slate-800 font-extrabold text-sm'>{s.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>

        {/* Doctor Performance */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className='bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 p-8'
        >
          <h2 className='text-2xl font-bold text-slate-800 mb-2'>Top Doctors</h2>
          <p className='text-slate-400 text-sm mb-8'>By appointment count</p>
          <div className='h-[240px]'>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={doctorPerf} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', fontSize: '12px' }} />
                <Bar dataKey="appointments" fill="#0e7490" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Speciality Breakdown */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className='bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/50 p-8'
        >
          <h2 className='text-2xl font-bold text-slate-800 mb-2'>Speciality Distribution</h2>
          <p className='text-slate-400 text-sm mb-6'>Doctors by medical speciality</p>
          <div className='space-y-4'>
            {specialityData.map((s, i) => {
              const pct = Math.round((s.value / doctors.length) * 100)
              return (
                <div key={i}>
                  <div className='flex justify-between mb-1.5'>
                    <p className='text-slate-600 font-semibold text-sm'>{s.name}</p>
                    <p className='text-slate-800 font-bold text-sm'>{s.value} Dr{s.value > 1 ? 's' : ''}</p>
                  </div>
                  <div className='h-2.5 bg-slate-100 rounded-full overflow-hidden'>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.7 + i * 0.1, duration: 0.8 }}
                      className='h-full rounded-full'
                      style={{ backgroundColor: COLORS[i % COLORS.length] }}
                    ></motion.div>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Analytics
