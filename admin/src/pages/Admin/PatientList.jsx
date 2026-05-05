import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { StaffContext } from '../../context/StaffContext'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import SkeletonLoader from '../../components/SkeletonLoader'

const PatientList = () => {

  const { aToken, patients: adminPatients, getAllPatients: getAdminPatients } = useContext(AdminContext)
  const { sToken, patients: staffPatients, getAllPatients: getStaffPatients } = useContext(StaffContext)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true)
        if (aToken) {
            await getAdminPatients()
        } else if (sToken) {
            await getStaffPatients()
        }
        setLoading(false)
    }
    fetchData()
  }, [aToken, sToken])

  const currentPatients = aToken ? adminPatients : (sToken ? staffPatients : [])

  const filteredPatients = currentPatients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (patient.phone && patient.phone.includes(searchTerm))
  )

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <div className='p-6 md:p-8 bg-gray-50 min-h-screen w-full'>
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className='flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10'
      >
        <div>
          <h1 className='text-4xl font-extrabold text-slate-800 tracking-tight'>Patient Directory</h1>
          <p className='text-slate-500 mt-2 font-light text-lg'>Manage and monitor patient health records and history.</p>
        </div>
        
        <div className='flex items-center gap-4'>
            <div className='relative w-full md:w-80 group'>
                <div className='absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none'>
                    <svg className='w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors' aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                </div>
                <input 
                    type='text' 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='block w-full p-3.5 pl-12 text-sm text-slate-900 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-slate-900/10 focus:border-slate-900 transition-all shadow-sm group-hover:shadow-md' 
                    placeholder='Search by name, email, or ID...' 
                />
            </div>
            <button className='p-3.5 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
            </button>
        </div>
      </motion.div>

      <div className='bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden'>
        {loading ? (
            <div className='p-8'>
                <SkeletonLoader type="table" rows={8} />
            </div>
        ) : (
            <div className='overflow-x-auto'>
                <table className='w-full text-left'>
                    <thead>
                        <tr className='bg-slate-50/80 backdrop-blur-md border-b border-slate-100'>
                            <th className='px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest'>Patient Profile</th>
                            <th className='px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest'>Contact Information</th>
                            <th className='px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest'>Demographics</th>
                            <th className='px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest'>Access Level</th>
                            <th className='px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest text-right'>Action</th>
                        </tr>
                    </thead>
                    <motion.tbody 
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className='divide-y divide-slate-50'
                    >
                    {filteredPatients.map((patient, index) => (
                        <motion.tr 
                            variants={itemVariants} 
                            key={index} 
                            whileHover={{ backgroundColor: '#f8fafc', scale: 0.998 }}
                            className='bg-white transition-all group'
                        >
                            <td className='px-8 py-5'>
                                <div className='flex items-center gap-4'>
                                    <div className='relative'>
                                        <img className='w-12 h-12 rounded-2xl object-cover bg-slate-100 border-2 border-white shadow-md transition-transform group-hover:scale-110' src={patient.image || assets.profile_pic} alt="" />
                                        <div className='absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-sm'></div>
                                    </div>
                                    <div>
                                        <div className='font-bold text-slate-800 text-lg leading-tight group-hover:text-slate-600 transition-colors'>{patient.name}</div>
                                        <div className='text-xs text-slate-400 font-medium mt-1 tracking-wider uppercase'>ID: {patient._id.slice(-8).toUpperCase()}</div>
                                    </div>
                                </div>
                            </td>
                            <td className='px-8 py-5'>
                                <div className='flex flex-col gap-1'>
                                    <div className='text-slate-600 font-medium flex items-center gap-2'>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        {patient.email}
                                    </div>
                                    <div className='text-slate-400 text-xs flex items-center gap-2'>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        {patient.phone && patient.phone !== '000000000' ? patient.phone : 'Not provided'}
                                    </div>
                                </div>
                            </td>
                            <td className='px-8 py-5'>
                                <div className='flex items-center gap-3'>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase ${patient.gender === 'Male' ? 'bg-slate-100 text-slate-600' : 'bg-rose-50 text-rose-600'}`}>
                                        {patient.gender || 'N/A'}
                                    </span>
                                    <span className='text-slate-400 text-xs font-medium'>
                                        {patient.dob || 'Age unknown'}
                                    </span>
                                </div>
                            </td>
                            <td className='px-8 py-5'>
                                <div className='flex items-center gap-2'>
                                    <div className='w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'></div>
                                    <span className='text-emerald-600 font-bold text-xs uppercase tracking-tighter'>Verified</span>
                                </div>
                            </td>
                            <td className='px-8 py-5 text-right'>
                                <motion.button 
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => navigate(`/patient-profile/${patient._id}`)}
                                    className='inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-white rounded-xl font-bold text-xs shadow-lg shadow-slate-200 hover:bg-slate-900 transition-all'
                                >
                                    Record View
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </motion.button>
                            </td>
                        </motion.tr>
                    ))}
                    </motion.tbody>
                </table>
                
                {filteredPatients.length === 0 && (
                    <div className='w-full py-24 flex flex-col items-center justify-center text-center'>
                        <div className='w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-5xl grayscale opacity-50'>📁</div>
                        <h3 className='text-xl font-bold text-slate-800'>No Records Found</h3>
                        <p className='text-slate-500 mt-2 max-w-xs'>We couldn't find any patient records matching your current search parameters.</p>
                        <button 
                            onClick={() => setSearchTerm('')}
                            className='mt-6 text-slate-900 font-bold hover:underline'
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  )
}

export default PatientList
