import React, { useContext, useState } from 'react'
import axios from 'axios'
import { AdminContext } from '../../context/AdminContext'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'

const AddStaff = () => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('Lab Technician')

    const { aToken, backendUrl } = useContext(AdminContext)

    const onSubmitHandler = async (event) => {
        event.preventDefault()

        try {
            const { data } = await axios.post(backendUrl + '/api/admin/add-staff', { name, email, password, role }, { headers: { aToken } })
            if (data.success) {
                toast.success(data.message)
                setName('')
                setEmail('')
                setPassword('')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='m-5 w-full max-w-4xl'
        >
            <h1 className='text-2xl font-bold text-gray-800 mb-6'>Add New Staff Member</h1>

            <form onSubmit={onSubmitHandler} className='bg-white p-8 rounded-3xl shadow-xl shadow-slate-100/50 border border-slate-100'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    
                    <div className='flex flex-col gap-1'>
                        <label className='text-sm font-medium text-gray-600'>Full Name</label>
                        <input 
                            onChange={(e) => setName(e.target.value)} 
                            value={name} 
                            className='border border-slate-200 rounded-xl p-3.5 outline-none focus:ring-4 focus:ring-slate-900/10 focus:border-slate-900 transition-all bg-slate-50'  
                            type="text" 
                            placeholder="Full Name" 
                            required 
                        />
                    </div>

                    <div className='flex flex-col gap-1'>
                        <label className='text-sm font-medium text-gray-600'>Email Address</label>
                        <input 
                            onChange={(e) => setEmail(e.target.value)} 
                            value={email} 
                            className='border border-slate-200 rounded-xl p-3.5 outline-none focus:ring-4 focus:ring-slate-900/10 focus:border-slate-900 transition-all bg-slate-50'  
                            type="email" 
                            placeholder="Email" 
                            required 
                        />
                    </div>

                    <div className='flex flex-col gap-1'>
                        <label className='text-sm font-medium text-gray-600'>Password</label>
                        <input 
                            onChange={(e) => setPassword(e.target.value)} 
                            value={password} 
                            className='border border-slate-200 rounded-xl p-3.5 outline-none focus:ring-4 focus:ring-slate-900/10 focus:border-slate-900 transition-all bg-slate-50'  
                            type="password" 
                            placeholder="Password" 
                            required 
                        />
                    </div>

                    <div className='flex flex-col gap-1'>
                        <label className='text-sm font-medium text-gray-600'>Staff Role</label>
                        <select 
                            onChange={(e) => setRole(e.target.value)} 
                            value={role} 
                            className='border border-slate-200 rounded-xl p-3.5 outline-none focus:ring-4 focus:ring-slate-900/10 focus:border-slate-900 transition-all bg-slate-50' 
                        >
                            <option value="Lab Technician">Lab Technician</option>
                            <option value="Receptionist">Receptionist</option>
                        </select>
                    </div>

                </div>

                <button type="submit" className='mt-8 bg-slate-900 text-white px-10 py-3.5 rounded-xl font-bold shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98]'>
                    Create Staff Account
                </button>
            </form>
        </motion.div>
    )
}

export default AddStaff
