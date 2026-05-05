import mongoose from "mongoose"

const appointmentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    docId: { type: String, required: true },
    slotDate: { type: String, required: true },
    slotTime: { type: String, required: true },
    userData: { type: Object, required: true },
    docData: { type: Object, required: true },
    amount: { type: Number, required: true },
    date: { type: Number, required: true },
    cancelled: { type: Boolean, default: false },
    payment: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false },
    hasArrived: { type: Boolean, default: false }, // Tracks if the patient has physically checked in
    note: { type: String, default: '' }, // New field for notes
    isTeleconsultation: { type: Boolean, default: false },
    videoRoomId: { type: String, default: '' },
    sessionNotes: { type: String, default: '' },
    aiPrescriptionData: { type: Object, default: null }
})

const appointmentModel = mongoose.models.appointment || mongoose.model("appointment", appointmentSchema)
export default appointmentModel