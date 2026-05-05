import labBookingModel from '../models/labBookingModel.js'
import userModel from '../models/userModel.js'

// Map test name → category
const getCategoryFromTest = (testName) => {
    const t = testName.toLowerCase()
    if (t.includes('covid')) return 'Virology'
    if (t.includes('ultrasono')) return 'Radiology'
    if (t.includes('x-ray') || t.includes('xray')) return 'Radiology'
    if (t.includes('electrocardiogram') || t.includes('ecg') || t.includes('ekg')) return 'Cardiology'
    if (t.includes('cbc') || t.includes('gcc') || t.includes('blood count')) return 'Hematology'
    if (t.includes('biochem')) return 'Biochemistry'
    if (t.includes('microbio') || t.includes('culture')) return 'Microbiology'
    if (t.includes('hematol')) return 'Hematology'
    if (t.includes('histopath')) return 'Histopathology'
    return 'General'
}

const getPriceFromTest = (category) => {
    switch (category) {
        case 'Hematology': return 50
        case 'Radiology': return 120
        case 'Cardiology': return 150
        case 'Biochemistry': return 80
        case 'Virology': return 100
        case 'Microbiology': return 90
        case 'Histopathology': return 200
        default: return 40
    }
}

// POST /api/lab/book  (authUser)
const bookLabTest = async (req, res) => {
    try {
        const { userId, testName, slotDate, slotTime } = req.body

        if (!testName || !slotDate || !slotTime) {
            return res.json({ success: false, message: 'Missing required fields' })
        }

        const user = await userModel.findById(userId).select('-password')
        if (!user) return res.json({ success: false, message: 'User not found' })

        const userData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            image: user.image,
            dob: user.dob,
            gender: user.gender,
            address: user.address,
        }

        const category = getCategoryFromTest(testName)
        const amount = getPriceFromTest(category)

        const booking = new labBookingModel({
            userId,
            userData,
            testName,
            category,
            amount,
            slotDate,
            slotTime,
            date: Date.now(),
        })

        await booking.save()
        res.json({ success: true, message: 'Lab test booked successfully', booking })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// GET /api/lab/my-bookings  (authUser)
const getMyLabBookings = async (req, res) => {
    try {
        const { userId } = req.body
        const bookings = await labBookingModel.find({ userId }).sort({ date: -1 })
        res.json({ success: true, bookings })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// GET /api/lab/all  (authStaff / authAdmin)  – Receptionist + Lab Tech + Admin
const getAllLabBookings = async (req, res) => {
    try {
        const bookings = await labBookingModel.find({}).sort({ date: -1 })
        res.json({ success: true, bookings })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// POST /api/lab/update-status  (authStaff)
const updateLabBookingStatus = async (req, res) => {
    try {
        const { bookingId, status } = req.body
        await labBookingModel.findByIdAndUpdate(bookingId, { status })
        res.json({ success: true, message: 'Status updated' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// POST /api/lab/cancel  (authUser or authStaff)
const cancelLabBooking = async (req, res) => {
    try {
        const { bookingId } = req.body
        await labBookingModel.findByIdAndUpdate(bookingId, { cancelled: true })
        res.json({ success: true, message: 'Booking cancelled' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// POST /api/lab/check-in  (authStaff Receptionist)
const checkInLabBooking = async (req, res) => {
    try {
        const { bookingId } = req.body
        await labBookingModel.findByIdAndUpdate(bookingId, { hasArrived: true, status: 'Processing' })
        res.json({ success: true, message: 'Patient checked in and test marked Processing' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// POST /api/lab/mark-paid  (authStaff Receptionist)
const markLabPaid = async (req, res) => {
    try {
        const { bookingId } = req.body
        await labBookingModel.findByIdAndUpdate(bookingId, { payment: true })
        res.json({ success: true, message: 'Payment recorded' })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export {
    bookLabTest,
    getMyLabBookings,
    getAllLabBookings,
    updateLabBookingStatus,
    cancelLabBooking,
    checkInLabBooking,
    markLabPaid,
}
