import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify'
import axios from 'axios'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import { motion } from 'framer-motion'

const AddDoctor = () => {

    const [docImg, setDocImg] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [experience, setExperience] = useState('1 Year')
    const [fees, setFees] = useState('')
    const [about, setAbout] = useState('')
    const [speciality, setSpeciality] = useState('General physician')
    const [degree, setDegree] = useState('')
    const [address1, setAddress1] = useState('')
    const [address2, setAddress2] = useState('')

    const { backendUrl } = useContext(AppContext)
    const { aToken } = useContext(AdminContext)

    const onSubmitHandler = async (event) => {
        event.preventDefault()

        try {

            if (!docImg) {
                return toast.error('Image Not Selected')
            }

            const formData = new FormData();

            formData.append('image', docImg)
            formData.append('name', name)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('experience', experience)
            formData.append('fees', Number(fees))
            formData.append('about', about)
            formData.append('speciality', speciality)
            formData.append('degree', degree)
            formData.append('address', JSON.stringify({ line1: address1, line2: address2 }))

            // console log formdata            
            formData.forEach((value, key) => {
                console.log(`${key}: ${value}`);
            });

            const { data } = await axios.post(backendUrl + '/api/admin/add-doctor', formData, { headers: { aToken } })
            if (data.success) {
                toast.success(data.message)
                setDocImg(false)
                setName('')
                setPassword('')
                setEmail('')
                setAddress1('')
                setAddress2('')
                setDegree('')
                setAbout('')
                setFees('')
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='p-6 md:p-8 bg-slate-50 min-h-screen w-full'
        >
            <div className='mb-8'>
                <h1 className='text-3xl font-extrabold text-slate-800 tracking-tight'>Add Doctor Profile</h1>
                <p className='text-slate-500 mt-2 font-light'>Register a new medical professional to the platform.</p>
            </div>

            <form onSubmit={onSubmitHandler} className='bg-white p-8 rounded-3xl shadow-xl shadow-slate-100/50 border border-slate-100 max-w-5xl'>
                
                <div className='flex items-center gap-6 mb-10'>
                    <label htmlFor="doc-img" className='relative group cursor-pointer'>
                        <div className='w-24 h-24 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden transition-all group-hover:border-slate-400 group-hover:bg-slate-100'>
                            {docImg ? (
                                <img className='w-full h-full object-cover' src={URL.createObjectURL(docImg)} alt="" />
                            ) : (
                                <img className='w-8 opacity-50 grayscale group-hover:scale-110 transition-transform' src={assets.upload_area} alt="" />
                            )}
                        </div>
                    </label>
                    <input onChange={(e) => setDocImg(e.target.files[0])} type="file" id="doc-img" hidden />
                    <div>
                        <p className='font-bold text-slate-800'>Profile Photo</p>
                        <p className='text-xs text-slate-400 mt-1'>High quality square image required.</p>
                    </div>
                </div>

                <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>

                    <div className='w-full lg:flex-1 flex flex-col gap-4'>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Your name</p>
                            <input onChange={e => setName(e.target.value)} value={name} className='border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-slate-900/10 focus:border-slate-900 transition-all bg-slate-50 text-sm' type="text" placeholder='Name' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Doctor Email</p>
                            <input onChange={e => setEmail(e.target.value)} value={email} className='border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-slate-900/10 focus:border-slate-900 transition-all bg-slate-50 text-sm' type="email" placeholder='Email' required />
                        </div>


                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Set Password</p>
                            <input onChange={e => setPassword(e.target.value)} value={password} className='border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-slate-900/10 focus:border-slate-900 transition-all bg-slate-50 text-sm' type="password" placeholder='Password' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Experience</p>
                            <select onChange={e => setExperience(e.target.value)} value={experience} className='border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-slate-900/10 focus:border-slate-900 transition-all bg-slate-50 text-sm' >
                                <option value="1 Year">1 Year</option>
                                <option value="2 Year">2 Years</option>
                                <option value="3 Year">3 Years</option>
                                <option value="4 Year">4 Years</option>
                                <option value="5 Year">5 Years</option>
                                <option value="6 Year">6 Years</option>
                                <option value="8 Year">8 Years</option>
                                <option value="9 Year">9 Years</option>
                                <option value="10 Year">10 Years</option>
                            </select>
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Fees</p>
                            <input onChange={e => setFees(e.target.value)} value={fees} className='border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-slate-900/10 focus:border-slate-900 transition-all bg-slate-50 text-sm' type="number" placeholder='Doctor fees' required />
                        </div>

                    </div>

                    <div className='w-full lg:flex-1 flex flex-col gap-4'>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Speciality</p>
                            <select onChange={e => setSpeciality(e.target.value)} value={speciality} className='border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-slate-900/10 focus:border-slate-900 transition-all bg-slate-50 text-sm'>
                                <option value="General physician">General physician</option>
                                <option value="Gynecologist">Gynecologist</option>
                                <option value="Dermatologist">Dermatologist</option>
                                <option value="Pediatricians">Pediatricians</option>
                                <option value="Neurologist">Neurologist</option>
                                <option value="Gastroenterologist">Gastroenterologist</option>
                            </select>
                        </div>


                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Degree</p>
                            <input onChange={e => setDegree(e.target.value)} value={degree} className='border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-slate-900/10 focus:border-slate-900 transition-all bg-slate-50 text-sm' type="text" placeholder='Degree' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Address</p>
                            <input onChange={e => setAddress1(e.target.value)} value={address1} className='border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-slate-900/10 focus:border-slate-900 transition-all bg-slate-50 text-sm' type="text" placeholder='Address 1' required />
                            <input onChange={e => setAddress2(e.target.value)} value={address2} className='border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-4 focus:ring-slate-900/10 focus:border-slate-900 transition-all bg-slate-50 text-sm' type="text" placeholder='Address 2' required />
                        </div>

                    </div>

                </div>

                <div className='mt-8 pt-8 border-t border-slate-100'>
                    <p className='text-sm font-bold text-slate-700 mb-3'>Professional Biography</p>
                    <textarea onChange={e => setAbout(e.target.value)} value={about} className='w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-slate-900/10 focus:border-slate-900 transition-all bg-slate-50 text-sm resize-none' rows={5} placeholder='Write a detailed description about the doctor...'></textarea>
                </div>

                <div className='mt-8'>
                    <button type='submit' className='bg-slate-900 text-white px-10 py-3.5 rounded-xl font-bold shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98]'>Register Doctor</button>
                </div>

            </form>
        </motion.div>
    )
}

export default AddDoctor