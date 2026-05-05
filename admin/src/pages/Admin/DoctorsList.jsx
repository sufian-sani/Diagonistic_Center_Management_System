import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AdminContext } from '../../context/AdminContext'
import { motion } from 'framer-motion'

const DoctorsList = () => {

  const { doctors, changeAvailability , aToken , getAllDoctors} = useContext(AdminContext)
  const navigate = useNavigate();

  useEffect(() => {
    if (aToken) {
        getAllDoctors()
    }
  }, [aToken])

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
        className='mb-10'
      >
        <h1 className='text-4xl font-extrabold text-slate-800 tracking-tight'>Doctors Directory</h1>
        <p className='text-slate-500 mt-2 font-light text-lg'>Manage availability and profiles of our medical specialists.</p>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
      >
        {doctors.map((item, index) => (
          <motion.div 
            variants={itemVariants}
            key={index}
            className='bg-white border border-slate-100 shadow-sm rounded-3xl overflow-hidden flex flex-col group hover:shadow-xl transition-all'
          >
            <div 
                onClick={() => navigate(`/doctor-profile/${item._id}`)}
                className='relative h-56 bg-slate-50 flex items-end justify-center overflow-hidden cursor-pointer'
            >
                <div className='absolute inset-0 bg-gradient-to-t from-slate-200/50 to-transparent z-0 opacity-0 group-hover:opacity-100 transition-opacity'></div>
                <img className='w-full h-full object-cover object-top z-10 transition-transform duration-700 group-hover:scale-105' src={item.image} alt="" />
                
                <div className='absolute top-4 right-4 z-20'>
                    <div className='bg-white/80 backdrop-blur-md p-1.5 rounded-xl shadow-sm cursor-pointer' onClick={(e) => { e.stopPropagation(); changeAvailability(item._id); }}>
                        <div className={`w-3 h-3 rounded-full ${item.available ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-300'}`}></div>
                    </div>
                </div>
            </div>
            <div 
                className='p-6 flex-1 flex flex-col cursor-pointer'
                onClick={() => navigate(`/doctor-profile/${item._id}`)}
            >
              <p className='text-xl font-bold text-slate-800 group-hover:text-slate-600 transition-colors'>{item.name}</p>
              <p className='text-sm text-slate-500 font-medium mt-1 uppercase tracking-wider'>{item.speciality}</p>
              
              <div className='mt-auto pt-5 border-t border-slate-50 flex justify-between items-center'>
                <div className='flex items-center gap-2'>
                    <span className={`text-xs font-bold uppercase tracking-widest ${item.available ? 'text-emerald-500' : 'text-slate-400'}`}>
                        {item.available ? 'Available' : 'Unavailable'}
                    </span>
                </div>
                <div className='w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-colors'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

export default DoctorsList