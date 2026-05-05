import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { DoctorContext } from '../../context/DoctorContext';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from 'axios';

const AppointmentDetails = () => {
    const { appointmentId } = useParams();
    const navigate = useNavigate();
    const { backendUrl, slotDateFormat, currency } = useContext(AppContext);
    const { dToken } = useContext(DoctorContext);

    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [note, setNote] = useState('');

    const fetchAppointmentDetails = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${backendUrl}/api/doctor/appointments`, { headers: { dToken } });
            if (data.success) {
                const details = data.appointments.find(a => a._id === appointmentId);
                if (details) {
                    setAppointment(details);
                    setNote(details.note || '');
                } else {
                    toast.error("Appointment not found");
                }
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (dToken && appointmentId) {
            fetchAppointmentDetails();
        }
    }, [appointmentId, dToken]);

    const handleNoteUpdate = async () => {
        try {
            toast.info("Opening AI Prescription Builder...");
            navigate(`/prescription-builder/${appointmentId}`, { state: { initialNotes: note } });
        } catch (error) {
            toast.error(error.message);
        }
    };

    if (loading) {
        return (
            <div className='min-h-[60vh] flex items-center justify-center w-full'>
                <div className='w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin'></div>
            </div>
        );
    }

    if (!appointment) return <div className='p-8 text-center'>Appointment not found</div>;

    return (
        <div className='p-6 md:p-12 max-w-5xl mx-auto w-full min-h-screen'>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden'>
                {/* Header Section */}
                <div className='bg-slate-900 p-8 md:p-12 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6'>
                    <div>
                        <div className='flex items-center gap-3 mb-2'>
                            <span className='px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest'>Case Record</span>
                            <span className='px-3 py-1 bg-emerald-500 rounded-full text-[10px] font-bold uppercase tracking-widest'>{appointment.isCompleted ? 'Completed' : 'Active'}</span>
                        </div>
                        <h1 className='text-4xl font-extrabold tracking-tight'>Patient: {appointment.userData?.name}</h1>
                        <p className='text-slate-400 mt-2 font-medium flex items-center gap-2'>
                            <span className='text-xl'>📅</span> {slotDateFormat(appointment.slotDate)} • {appointment.slotTime}
                        </p>
                    </div>
                    <div className='bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10'>
                        <p className='text-slate-400 text-xs font-bold uppercase tracking-widest mb-1'>Consultation Fee</p>
                        <p className='text-3xl font-black'>{currency}{appointment.amount}</p>
                    </div>
                </div>

                {/* Content Section */}
                <div className='p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-12'>
                    {/* Left: Patient Details */}
                    <div className='md:col-span-1 space-y-8'>
                        <div>
                            <h3 className='text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-4'>Patient Profile</h3>
                            <div className='flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100'>
                                <img className='w-14 h-14 rounded-xl object-cover shadow-sm' src={appointment.userData?.image} alt="" />
                                <div>
                                    <p className='font-bold text-slate-800'>{appointment.userData?.name}</p>
                                    <p className='text-xs text-slate-500'>{appointment.userData?.email}</p>
                                </div>
                            </div>
                        </div>

                        <div className='grid gap-4'>
                            <div className='p-4 border border-slate-100 rounded-2xl'>
                                <p className='text-[10px] font-bold text-slate-400 uppercase mb-1'>Gender</p>
                                <p className='font-bold text-slate-700'>{appointment.userData?.gender}</p>
                            </div>
                            <div className='p-4 border border-slate-100 rounded-2xl'>
                                <p className='text-[10px] font-bold text-slate-400 uppercase mb-1'>Blood Group</p>
                                <p className='font-bold text-rose-600'>{appointment.userData?.bloodGroup || 'O+'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Notes & AI Prescription */}
                    <div className='md:col-span-2 space-y-8'>
                        <div>
                            <h3 className='text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-4'>Consultation Notes</h3>
                            <div className='relative'>
                                <textarea
                                    className='w-full h-40 p-6 bg-slate-50 border border-slate-200 rounded-3xl focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 outline-none transition-all text-slate-700 leading-relaxed font-medium resize-none'
                                    placeholder='Enter initial notes about the symptoms, diagnosis or general observations...'
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                />
                                <div className='absolute bottom-4 right-4'>
                                    <span className='text-[10px] font-bold text-slate-300 uppercase tracking-widest'>Manual Entry</span>
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col sm:flex-row gap-4'>
                            <button 
                                onClick={handleNoteUpdate}
                                className='flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl shadow-slate-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3'
                            >
                                <span className='text-xl'>✨</span>
                                Launch AI Prescription Builder
                            </button>
                            
                            <button 
                                onClick={() => navigate('/doctor-appointments')}
                                className='px-8 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all'
                            >
                                Go Back
                            </button>
                        </div>
                        
                        <div className='p-6 bg-indigo-50 border border-indigo-100 rounded-3xl'>
                            <p className='text-indigo-900 font-bold flex items-center gap-2 mb-1'>
                                <span className='text-lg'>💡</span> Smart Feature Tip
                            </p>
                            <p className='text-indigo-700 text-sm leading-relaxed'>
                                Clicking the button above will allow you to use our **AI Medical Scribe** to convert these notes into a structured digital prescription instantly.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AppointmentDetails;
