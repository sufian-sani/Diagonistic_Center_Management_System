import axios from 'axios'
import React, { useContext, useState } from 'react'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'
import { StaffContext } from '../context/StaffContext'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { GoogleLogin } from '@react-oauth/google'

const Login = () => {

  const [state, setState] = useState('Admin')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const { setDToken } = useContext(DoctorContext)
  const { setAToken } = useContext(AdminContext)
  const { setSToken, setStaffRole } = useContext(StaffContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const trimmedEmail = email.trim();
      if (state === 'Admin') {
        const { data } = await axios.post(backendUrl + '/api/admin/login', { email: trimmedEmail, password })
        if (data.success) {
          setAToken(data.token)
          localStorage.setItem('aToken', data.token)
        } else {
          toast.error(data.message)
        }
      } else if (state === 'Doctor') {
        const { data } = await axios.post(backendUrl + '/api/doctor/login', { email: trimmedEmail, password })
        if (data.success) {
          setDToken(data.token)
          localStorage.setItem('dToken', data.token)
        } else {
          toast.error(data.message)
        }
      } else {
        // Lab Tech or Receptionist
        const { data } = await axios.post(backendUrl + '/api/staff/login', { email: trimmedEmail, password })
        if (data.success) {
          if (data.role === state) {
            setSToken(data.token)
            setStaffRole(data.role)
            localStorage.setItem('sToken', data.token)
            localStorage.setItem('staffRole', data.role)
          } else {
            toast.error(`Invalid login for ${state} role`)
          }
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      let endpoint = '/api/admin/google-login'
      if (state === 'Doctor') endpoint = '/api/doctor/google-login'
      else if (state !== 'Admin') endpoint = '/api/staff/google-login'

      const { data } = await axios.post(backendUrl + endpoint, { token: credentialResponse.credential })
      
      if (data.success) {
        if (state === 'Admin') {
          setAToken(data.token)
          localStorage.setItem('aToken', data.token)
        } else if (state === 'Doctor') {
          setDToken(data.token)
          localStorage.setItem('dToken', data.token)
        } else {
          // Staff
          if (data.role === state) {
            setSToken(data.token)
            setStaffRole(data.role)
            localStorage.setItem('sToken', data.token)
            localStorage.setItem('staffRole', data.role)
          } else {
            toast.error(`Invalid login for ${state} role`)
          }
        }
        toast.success(`Logged in as ${state} with Google`)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center p-4 bg-gray-50'>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className='flex w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden'
      >
        {/* Left Side - Welcome Panel */}
        <div className='hidden md:flex md:w-1/2 bg-slate-800 p-12 flex-col justify-between relative overflow-hidden'>
          <div className='absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 z-0'></div>
          
          <div className='absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20'>
            <div className='absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-500 blur-3xl'></div>
            <div className='absolute bottom-0 right-0 w-80 h-80 rounded-full bg-indigo-500 blur-3xl'></div>
          </div>

          <div className='relative z-10 text-white'>
            <div className='flex items-center gap-3 mb-12'>
              <img className='w-12 h-12 object-contain' src="/sheba_logo.png" alt="Logo" />
              <span className='text-2xl font-black tracking-tight'>Sheba Diagnostic Center</span>
            </div>
            
            <h2 className='text-4xl font-bold mb-4 leading-tight'>Staff <br/> Management <br/> Portal</h2>
            <p className='text-slate-300 mt-4 font-light text-lg'>Secure access for medical professionals and administrative staff.</p>
          </div>
          
          <div className='relative z-10'>
             <div className='bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10'>
               <p className='text-slate-200 text-sm font-light'>
                 "Streamlining operations and empowering our doctors to deliver the best care possible."
               </p>
               <div className='flex items-center gap-3 mt-4'>
                 <div className='w-2 h-2 rounded-full bg-green-400 animate-pulse'></div>
                 <p className='text-slate-400 text-xs font-medium'>System Online</p>
               </div>
             </div>
          </div>
        </div>

        {/* Right Side - Form Panel */}
        <div className='w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center'>
          <div className='mb-8'>
            <h3 className='text-3xl font-bold text-slate-800 flex items-center gap-2'>
              {state} Login
              <span className='px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold tracking-wider uppercase border border-slate-200'>
                Secure
              </span>
            </h3>
            <p className='text-slate-500 mt-2 text-sm'>Enter your credentials to access the dashboard</p>
          </div>

          <form onSubmit={onSubmitHandler} className='flex flex-col gap-5'>
            <div className='w-full'>
              <label className='text-sm font-medium text-slate-700 mb-1 block'>Work Email</label>
              <input 
                onChange={(e) => setEmail(e.target.value)} 
                value={email} 
                className='border border-slate-300 rounded-lg w-full p-3 outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent transition-all bg-slate-50 focus:bg-white' 
                type="email" 
                placeholder="email@healingheaven.com"
                required 
              />
            </div>
            
            <div className='w-full'>
              <div className='flex justify-between items-center mb-1'>
                <label className='text-sm font-medium text-slate-700'>Password</label>
              </div>
              <input 
                onChange={(e) => setPassword(e.target.value)} 
                value={password} 
                className='border border-slate-300 rounded-lg w-full p-3 outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent transition-all bg-slate-50 focus:bg-white' 
                type="password" 
                placeholder="••••••••"
                required 
              />
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className='bg-slate-800 text-white w-full py-3.5 mt-4 rounded-lg font-medium text-lg shadow-lg hover:bg-slate-900 transition-colors'
            >
              Authenticate
            </motion.button>

            <div className='flex items-center gap-4 my-2'>
              <hr className='flex-1 border-slate-200' />
              <span className='text-slate-400 text-[10px] font-bold uppercase tracking-wider'>Work Identity</span>
              <hr className='flex-1 border-slate-200' />
            </div>

            <div className='flex justify-center'>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error("Google Login Failed")}
                useOneTap={false}
                theme="filled_black"
                shape="rectangular"
                width="100%"
                text="signin"
              />
            </div>
          </form>

          <div className='mt-8 flex flex-wrap justify-center gap-2'>
            <div className='flex bg-slate-100 rounded-lg p-1'>
              <button 
                type="button"
                onClick={() => setState('Admin')} 
                className={`px-4 py-2 rounded-md text-xs font-medium transition-all ${state === 'Admin' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Admin
              </button>
              <button 
                type="button"
                onClick={() => setState('Doctor')} 
                className={`px-4 py-2 rounded-md text-xs font-medium transition-all ${state === 'Doctor' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Doctor
              </button>
              <button 
                type="button"
                onClick={() => setState('Lab Technician')} 
                className={`px-4 py-2 rounded-md text-xs font-medium transition-all ${state === 'Lab Technician' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Lab Tech
              </button>
              <button 
                type="button"
                onClick={() => setState('Receptionist')} 
                className={`px-4 py-2 rounded-md text-xs font-medium transition-all ${state === 'Receptionist' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Receptionist
              </button>
            </div>
          </div>

          <div className='mt-10 pt-6 border-t border-slate-100 text-center'>
             <p className='text-sm text-slate-500'>
               Not a staff member?{' '}
               <a href="http://localhost:5173/login" className='text-slate-800 font-semibold hover:underline flex items-center justify-center gap-1 mt-1'>
                 ← Return to Patient Portal
               </a>
             </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Login