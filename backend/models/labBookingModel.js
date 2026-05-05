import mongoose from 'mongoose'

const labBookingSchema = new mongoose.Schema({
    userId:      { type: String, required: true },
    userData:    { type: Object, required: true },   // name, email, phone, image
    testName:    { type: String, required: true },
    category:    { type: String, required: true },   // derived from testName
    slotDate:    { type: String, required: true },   // YYYY-MM-DD
    slotTime:    { type: String, required: true },   // e.g. "10:00 AM"
    status:      { type: String, default: 'Pending' }, // Pending | Processing | Completed | Delivered
    cancelled:   { type: Boolean, default: false },
    payment:     { type: Boolean, default: false },
    hasArrived:  { type: Boolean, default: false },
    notes:       { type: String, default: '' },
    result:      { type: String, default: '' },
    fileUrl:     { type: String, default: '' },
    amount:      { type: Number, required: true, default: 50 },
    date:        { type: Number, required: true },   // Date.now()
}, { timestamps: true })

const labBookingModel = mongoose.models.labBooking || mongoose.model('labBooking', labBookingSchema)
export default labBookingModel
