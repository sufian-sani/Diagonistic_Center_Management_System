import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import axios from 'axios'

const DoctorProfile = () => {
  const { dToken, profileData, setProfileData, getProfileData } = useContext(DoctorContext)
  const { currency, backendUrl } = useContext(AppContext)
  const [isEdit, setIsEdit] = useState(false)
  const [saving, setSaving] = useState(false)

  const updateProfile = async () => {
    setSaving(true)
    try {
      const updateData = {
        address: profileData.address,
        fees: profileData.fees,
        about: profileData.about,
        available: profileData.available
      }
      const { data } = await axios.post(backendUrl + '/api/doctor/update-profile', updateData, { headers: { dToken } })
      if (data.success) {
        toast.success(data.message)
        setIsEdit(false)
        getProfileData()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setSaving(false)
  }

  useEffect(() => {
    if (dToken) getProfileData()
  }, [dToken])

  if (!profileData) return (
    <div className='flex items-center justify-center min-h-[60vh]'>
      <div className='w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin'></div>
    </div>
  )

  return (
    <div className='p-6 md:p-8 bg-gray-50 min-h-screen w-full'>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='max-w-5xl mx-auto'
      >
        {/* Header */}
        <div className='flex items-center justify-between mb-10'>
          <div>
            <h1 className='text-4xl font-extrabold text-slate-800 tracking-tight'>My Profile</h1>
            <p className='text-slate-400 mt-2 font-light'>Manage your professional information and availability</p>
          </div>
          {!isEdit ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsEdit(true)}
              className='flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-2xl font-bold text-sm shadow-lg hover:bg-slate-900 transition-all'
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Profile
            </motion.button>
          ) : (
            <div className='flex gap-3'>
              <button
                onClick={() => setIsEdit(false)}
                className='px-6 py-3 text-slate-500 font-bold text-sm hover:bg-slate-100 rounded-2xl transition-all'
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={updateProfile}
                disabled={saving}
                className='px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-lg shadow-slate-900/20 flex items-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-50'
              >
                {saving ? <div className='w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin'></div> : null}
                Save Changes
              </motion.button>
            </div>
          )}
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>

          {/* Left — Photo Card */}
          <div className='lg:col-span-1'>
            <div className='bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden'>
              <div className='bg-gradient-to-br from-slate-800 via-slate-900 to-slate-900 h-24 relative'>
                <div className='absolute inset-0 opacity-30'>
                  <div className='absolute -top-8 -left-8 w-32 h-32 bg-slate-700 rounded-full blur-3xl'></div>
                </div>
              </div>
              <div className='px-6 pb-6'>
                <div className='relative w-28 h-28 -mt-14 mx-auto'>
                  <img
                    className='w-full h-full rounded-2xl object-cover border-4 border-white shadow-xl bg-slate-100'
                    src={profileData.image}
                    alt={profileData.name}
                  />
                  <div className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-white shadow ${profileData.available ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>
                </div>
                <div className='text-center mt-4'>
                  <h2 className='text-2xl font-extrabold text-slate-800'>{profileData.name}</h2>
                  <p className='text-slate-900 font-semibold text-sm mt-1'>{profileData.speciality}</p>
                  <p className='text-slate-400 text-xs mt-1'>{profileData.degree}</p>
                </div>

                <div className='mt-6 space-y-4'>
                  <div className='flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100'>
                    <div>
                      <p className='text-[10px] text-slate-400 font-bold uppercase tracking-wider'>Experience</p>
                      <p className='text-slate-800 font-extrabold text-lg'>{profileData.experience}</p>
                    </div>
                    <div className='w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500'>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>

                  <div className='flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100'>
                    <div>
                      <p className='text-[10px] text-slate-400 font-bold uppercase tracking-wider'>Consultation Fee</p>
                      {isEdit ? (
                        <input
                          type='number'
                          value={profileData.fees}
                          onChange={e => setProfileData(prev => ({ ...prev, fees: e.target.value }))}
                          className='text-slate-800 font-extrabold text-lg bg-transparent border-b border-slate-900 outline-none w-24'
                        />
                      ) : (
                        <p className='text-slate-800 font-extrabold text-lg'>{currency}{profileData.fees}</p>
                      )}
                    </div>
                    <div className='w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500'>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>

                  {/* Availability Toggle */}
                  <div
                    onClick={() => isEdit && setProfileData(prev => ({ ...prev, available: !prev.available }))}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${profileData.available ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'} ${isEdit ? 'cursor-pointer' : ''}`}
                  >
                    <div>
                      <p className='text-[10px] text-slate-400 font-bold uppercase tracking-wider'>Status</p>
                      <p className={`font-extrabold ${profileData.available ? 'text-emerald-600' : 'text-slate-500'}`}>
                        {profileData.available ? 'Available' : 'Unavailable'}
                      </p>
                    </div>
                    <div className={`w-12 h-6 rounded-full transition-colors relative ${profileData.available ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${profileData.available ? 'left-7' : 'left-1'}`}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Details */}
          <div className='lg:col-span-2 space-y-6'>

            {/* About */}
            <div className='bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100/50 p-8'>
              <h3 className='text-xl font-bold text-slate-800 mb-4 flex items-center gap-3'>
                <div className='w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center text-slate-800'>📋</div>
                Professional Bio
              </h3>
              {isEdit ? (
                <textarea
                  rows={6}
                  value={profileData.about}
                  onChange={e => setProfileData(prev => ({ ...prev, about: e.target.value }))}
                  className='w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 text-sm leading-relaxed resize-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 outline-none transition-all'
                />
              ) : (
                <p className='text-slate-500 leading-relaxed font-light'>{profileData.about}</p>
              )}
            </div>

            {/* Address */}
            <div className='bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-100/50 p-8'>
              <h3 className='text-xl font-bold text-slate-800 mb-4 flex items-center gap-3'>
                <div className='w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500'>📍</div>
                Clinic Address
              </h3>
              <div className='space-y-3'>
                {isEdit ? (
                  <>
                    <input
                      type='text'
                      placeholder='Address Line 1'
                      value={profileData.address.line1}
                      onChange={e => setProfileData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))}
                      className='w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 outline-none transition-all'
                    />
                    <input
                      type='text'
                      placeholder='Address Line 2'
                      value={profileData.address.line2}
                      onChange={e => setProfileData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))}
                      className='w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 outline-none transition-all'
                    />
                  </>
                ) : (
                  <div className='bg-slate-50 p-4 rounded-2xl border border-slate-100 flex gap-3'>
                    <div className='text-slate-300 text-xl'>🗺</div>
                    <div>
                      <p className='text-slate-700 font-medium'>{profileData.address.line1}</p>
                      {profileData.address.line2 && <p className='text-slate-500 text-sm mt-1'>{profileData.address.line2}</p>}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Certifications decoration */}
            <div className='bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden'>
              <div className='absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent'></div>
              <div className='relative z-10'>
                <p className='text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2'>Professional Credentials</p>
                <h3 className='text-2xl font-bold mb-6'>Verified Medical Professional</h3>
                <div className='grid grid-cols-3 gap-4'>
                  {[
                    { label: 'Degree', value: profileData.degree },
                    { label: 'Speciality', value: profileData.speciality },
                    { label: 'Experience', value: profileData.experience },
                  ].map((item, i) => (
                    <div key={i} className='bg-white/5 rounded-2xl p-4 border border-white/10'>
                      <p className='text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1'>{item.label}</p>
                      <p className='text-white font-extrabold text-sm leading-tight'>{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default DoctorProfile