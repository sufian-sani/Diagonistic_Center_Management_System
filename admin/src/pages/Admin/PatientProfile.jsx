import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import { motion } from 'framer-motion'
import { StaffContext } from '../../context/StaffContext'
import { assets } from '../../assets/assets'

const PatientProfile = () => {

  const { id } = useParams()
  const navigate = useNavigate()
  const { aToken, getPatientDetails: getAdminPatientDetails } = useContext(AdminContext)
  const { sToken, getPatientDetails: getStaffPatientDetails } = useContext(StaffContext)
  const { slotDateFormat } = useContext(AppContext)

  const [patientData, setPatientData] = useState(null)
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPatientData = async () => {
      if ((aToken || sToken) && id) {
        setLoading(true)
        const fetchFunc = aToken ? getAdminPatientDetails : getStaffPatientDetails
        const data = await fetchFunc(id)
        if (data) {
          setPatientData(data.patient)
          setAppointments(data.appointments)
        }
        setLoading(false)
      }
    }
    fetchPatientData()
  }, [aToken, sToken, id])

  if (loading) {
    return (
      <div className="p-8 w-full flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!patientData) {
    return (
      <div className="p-8 w-full flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="text-4xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold text-gray-800">Patient Not Found</h2>
        <button onClick={() => navigate('/patient-list')} className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg">Go Back</button>
      </div>
    )
  }

  return (
    <div className='p-6 md:p-8 bg-gray-50 min-h-screen w-full'>
      
      <button 
        onClick={() => navigate('/patient-list')}
        className='flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-6 text-sm font-medium'
      >
        <span>&larr;</span> Back to Patients
      </button>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        
        {/* Left Column: Profile Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className='lg:col-span-1'
        >
          <div className='bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden sticky top-8'>
            <div className='bg-gradient-to-br from-slate-800 via-slate-900 to-slate-900 h-32 relative overflow-hidden'>
                <div className='absolute inset-0 opacity-20'>
                    <div className='absolute -top-10 -left-10 w-40 h-40 rounded-full bg-slate-700 blur-3xl'></div>
                    <div className='absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-emerald-500 blur-3xl'></div>
                </div>
            </div>
            <div className='px-8 pb-8 relative'>
              <div className='relative w-32 h-32 -mt-16 mx-auto'>
                <img 
                    src={patientData.image || assets.profile_pic} 
                    alt="Patient" 
                    className='w-full h-full rounded-3xl border-8 border-white shadow-xl bg-white object-cover'
                />
                <div className='absolute bottom-2 right-2 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full shadow-lg'></div>
              </div>
              
              <div className='pt-6 text-center'>
                <h2 className='text-3xl font-extrabold text-slate-800 tracking-tight'>{patientData.name}</h2>
                <div className='inline-flex items-center gap-2 mt-2 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100'>
                  <span className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse'></span> 
                  <span className='text-[10px] font-bold uppercase tracking-widest'>Patient Verified</span>
                </div>
                
                <div className='mt-10 space-y-8 text-left'>
                  <div className='group'>
                    <p className='text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold mb-3'>Primary Contact</p>
                    <div className='space-y-4'>
                      <div className='flex items-center gap-4 group/item'>
                        <div className='w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover/item:bg-slate-100 group-hover/item:text-slate-800 transition-all'>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <p className='text-[10px] text-slate-400 font-bold uppercase'>Email Address</p>
                            <p className='text-sm text-slate-700 font-medium'>{patientData.email}</p>
                        </div>
                      </div>
                      <div className='flex items-center gap-4 group/item'>
                        <div className='w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover/item:bg-emerald-100/50 group-hover/item:text-emerald-600 transition-all'>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        </div>
                        <div>
                            <p className='text-[10px] text-slate-400 font-bold uppercase'>Phone Number</p>
                            <p className='text-sm text-slate-700 font-medium'>{patientData.phone && patientData.phone !== '000000000' ? patientData.phone : 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='pt-6 border-t border-slate-50'>
                    <p className='text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold mb-3'>Demographics</p>
                    <div className='grid grid-cols-2 gap-4'>
                      <div className='bg-slate-50 p-4 rounded-2xl border border-slate-100'>
                        <p className='text-[10px] text-slate-400 font-bold uppercase'>Gender</p>
                        <p className='font-extrabold text-slate-800'>{patientData.gender !== 'Not Selected' ? patientData.gender : 'N/A'}</p>
                      </div>
                      <div className='bg-slate-50 p-4 rounded-2xl border border-slate-100'>
                        <p className='text-[10px] text-slate-400 font-bold uppercase'>Birth Date</p>
                        <p className='font-extrabold text-slate-800'>{patientData.dob !== 'Not Selected' ? patientData.dob : 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className='pt-6 border-t border-slate-50'>
                    <p className='text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold mb-3'>Registered Address</p>
                    <div className='bg-slate-50 p-4 rounded-2xl border border-slate-100 flex gap-3'>
                        <div className='text-slate-300'>📍</div>
                        <p className='text-xs text-slate-600 leading-relaxed font-medium'>
                            {patientData.address?.line1 || 'No primary address recorded.'}
                            {patientData.address?.line2 && <><br/>{patientData.address.line2}</>}
                        </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Appointment History & Timeline */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className='lg:col-span-2 space-y-8'
        >
          
          <div className='bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-8'>
            <div className='flex items-center justify-between mb-8'>
                <h3 className='text-2xl font-bold text-slate-800 flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center'>
                        <img src={assets.appointments_icon} alt="" className='w-6 opacity-80' />
                    </div>
                    Clinical Engagements
                </h3>
                <span className='px-4 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-bold'>{appointments.length} Records</span>
            </div>

            {appointments.length > 0 ? (
              <div className='relative space-y-6 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent'>
                {appointments.map((item, index) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    key={index} 
                    className='relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group'
                  >
                    {/* Dot */}
                    <div className='flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-200 group-hover:bg-slate-900 text-white shadow shadow-slate-300 group-hover:shadow-slate-900/30 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-all duration-300 z-10'>
                        <svg className='fill-current w-3 h-3' viewBox='0 0 12 12' xmlns='http://www.w3.org/2000/svg'>
                            <path d='M12 10v2H0v-2h12zm0-4v2H0V6h12zm0-4v2H0V2h12z'/>
                        </svg>
                    </div>
                    {/* Content Block */}
                    <div className='w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-all'>
                      <div className='flex items-center justify-between space-x-2 mb-2'>
                        <div className='font-bold text-slate-800'>{slotDateFormat(item.slotDate)}</div>
                        <time className='font-medium text-xs text-slate-900 bg-slate-100 px-2 py-0.5 rounded-full'>{item.slotTime}</time>
                      </div>
                      <div className='flex items-center gap-3 mb-3'>
                        <img className='w-8 h-8 rounded-lg object-cover' src={item.docData.image} alt="" />
                        <div>
                            <div className='text-sm font-bold text-slate-700 leading-none'>{item.docData.name}</div>
                            <div className='text-[10px] text-slate-400 font-medium uppercase mt-1 tracking-wider'>{item.docData.speciality}</div>
                        </div>
                      </div>
                      <div className='flex items-center justify-between pt-3 border-t border-slate-50'>
                         <span className='text-xs font-bold text-slate-400'>Consultation Fee: ${item.amount}</span>
                         {item.cancelled ? (
                          <span className='px-3 py-1 bg-rose-50 text-rose-600 text-[10px] font-extrabold rounded-lg uppercase tracking-wider'>Cancelled</span>
                        ) : item.isCompleted ? (
                          <span className='px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-extrabold rounded-lg uppercase tracking-wider'>Completed</span>
                        ) : (
                          <span className='px-3 py-1 bg-slate-100 text-slate-700 text-[10px] font-extrabold rounded-lg uppercase tracking-wider'>Upcoming</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className='text-center py-20 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-200'>
                <div className='text-5xl mb-4 opacity-20 grayscale'>📅</div>
                <h4 className='text-slate-800 font-bold'>No Encounters Recorded</h4>
                <p className='text-slate-400 mt-1 text-sm'>This patient has not visited any medical professionals yet.</p>
              </div>
            )}
          </div>
          
          <div className='bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-8'>
            <div className='flex items-center justify-between mb-8'>
                <h3 className='text-2xl font-bold text-slate-800 flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center'>
                        <span className='text-xl'>🔬</span>
                    </div>
                    Diagnostic Intelligence
                </h3>
            </div>
            
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='p-6 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-primary/30 transition-all'>
                    <div className='w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform'>🩸</div>
                    <h5 className='font-bold text-slate-800'>Blood Analysis</h5>
                    <p className='text-xs text-slate-400 mt-1'>Comprehensive metabolic panel and CBC tracking.</p>
                    <div className='mt-6 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden'>
                        <div className='h-full bg-slate-900 w-2/3 rounded-full'></div>
                    </div>
                    <div className='mt-2 flex justify-between text-[10px] font-bold text-slate-400'>
                        <span>STABILITY</span>
                        <span className='text-slate-900'>NORMAL RANGE</span>
                    </div>
                </div>
                <div className='p-6 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-emerald-300 transition-all'>
                    <div className='w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform'>🧠</div>
                    <h5 className='font-bold text-slate-800'>Neurological Scan</h5>
                    <p className='text-xs text-slate-400 mt-1'>Historical MRI/CT scan archive and comparisons.</p>
                    <div className='mt-6 flex items-center justify-between'>
                        <span className='text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-md uppercase'>Active File</span>
                        <span className='text-[10px] font-bold text-slate-400'>UPDATED 2D AGO</span>
                    </div>
                </div>
            </div>

            <div className='mt-6 text-center p-6 bg-slate-900 rounded-2xl text-white relative overflow-hidden'>
                <div className='absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent z-0'></div>
                <div className='relative z-10'>
                    <p className='text-xs font-bold text-slate-400 uppercase tracking-widest mb-1'>Coming Soon</p>
                    <h4 className='text-lg font-bold'>Advanced Medical Report AI</h4>
                    <p className='text-slate-400 text-xs mt-1 font-light'>Automated anomaly detection and history visualization is currently in development.</p>
                </div>
            </div>
          </div>

        </motion.div>

      </div>
    </div>
  )
}

export default PatientProfile
