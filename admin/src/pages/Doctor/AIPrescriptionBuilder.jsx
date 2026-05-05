import React, { useState, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../../context/AppContext';
import { DoctorContext } from '../../context/DoctorContext';
import { motion } from 'framer-motion';

const AIPrescriptionBuilder = () => {
    const { appointmentId } = useParams();
    const location = useLocation();
    const { backendUrl } = useContext(AppContext);
    const { dToken } = useContext(DoctorContext);
    const navigate = useNavigate();

    const [notes, setNotes] = useState(location.state?.initialNotes || '');
    const [isGenerating, setIsGenerating] = useState(false);
    const [prescription, setPrescription] = useState(null);

    const generatePrescription = async () => {
        if (!notes) {
            toast.error("Please enter some notes");
            return;
        }
        setIsGenerating(true);
        try {
            const { data } = await axios.post(`${backendUrl}/api/ai/generate-prescription`, { notes }, { headers: { dToken } });
            if (data.success) {
                setPrescription(data.prescription);
                toast.success("AI generated prescription successfully");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsGenerating(false);
        }
    };

    const savePrescription = async () => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/doctor/complete-appointment`, { 
                appointmentId, 
                aiPrescriptionData: prescription 
            }, { headers: { dToken } });
            
            if (data.success) {
                toast.success("Prescription saved and sent to patient!");
                navigate('/doctor-dashboard');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto w-full min-h-screen">
            <h1 className="text-3xl font-extrabold text-slate-800 mb-6">AI Digital Prescription</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Side: Notes */}
                <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-100/50 border border-slate-100">
                    <h2 className="text-xl font-bold mb-4 text-slate-700">Consultation Notes</h2>
                    <p className="text-sm text-slate-500 mb-4">Type rough notes, medicines, and advice here. The AI will structure it.</p>
                    <textarea 
                        className="w-full h-64 p-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none bg-slate-50"
                        placeholder="e.g. Patient complains of severe headache for 3 days. Prescribe Paracetamol 500mg twice a day for 5 days. Drink plenty of water and sleep well."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    ></textarea>
                    <button 
                        onClick={generatePrescription}
                        disabled={isGenerating}
                        className={`w-full mt-6 py-3 rounded-xl font-bold text-white transition-all ${isGenerating ? 'bg-slate-400' : 'bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30'}`}
                    >
                        {isGenerating ? '🤖 Generating Magic...' : '✨ Generate Structured Prescription'}
                    </button>
                </div>

                {/* Right Side: Generated Prescription */}
                <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-100/50 border border-slate-100 relative">
                    <h2 className="text-xl font-bold mb-4 text-slate-700">Structured Output</h2>
                    
                    {!prescription && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-[2px] rounded-3xl border border-dashed border-slate-300 m-6">
                            <p className="text-slate-400 font-medium">Waiting for generation...</p>
                        </div>
                    )}

                    {prescription && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                            <div>
                                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-3 bg-slate-100 inline-block px-3 py-1 rounded-lg">Medicines</h3>
                                <div className="space-y-3">
                                    {prescription.medicines?.map((med, idx) => (
                                        <div key={idx} className="flex justify-between items-center p-3 bg-blue-50/50 border border-blue-100 rounded-xl">
                                            <div>
                                                <p className="font-bold text-blue-900">{med.name}</p>
                                                <p className="text-sm text-blue-600 font-medium">{med.dosage}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-slate-500 bg-white px-3 py-1 rounded-lg border border-slate-100 shadow-sm">{med.duration}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-2 bg-slate-100 inline-block px-3 py-1 rounded-lg">Advice</h3>
                                <p className="text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm leading-relaxed">{prescription.advice}</p>
                            </div>

                            <div>
                                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-2 bg-slate-100 inline-block px-3 py-1 rounded-lg">Follow Up</h3>
                                <p className="text-slate-600 font-medium">{prescription.followUp}</p>
                            </div>

                            <button onClick={savePrescription} className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/30 transition-all mt-4">
                                Finalize & Save
                            </button>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AIPrescriptionBuilder;
