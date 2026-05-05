import express from 'express'
import authUser from '../middleware/authUser.js'
import authStaff from '../middleware/authStaff.js'
import authAdmin from '../middleware/authAdmin.js'
import {
    bookLabTest,
    getMyLabBookings,
    getAllLabBookings,
    updateLabBookingStatus,
    cancelLabBooking,
    checkInLabBooking,
    markLabPaid,
} from '../controllers/labBookingController.js'

const labRouter = express.Router()

// Patient routes
labRouter.post('/book',          authUser,  bookLabTest)
labRouter.get('/my-bookings',    authUser,  getMyLabBookings)
labRouter.post('/cancel',        authUser,  cancelLabBooking)

// Staff / Admin routes
labRouter.get('/all',            authStaff, getAllLabBookings)
labRouter.post('/update-status', authStaff, updateLabBookingStatus)
labRouter.post('/check-in',      authStaff, checkInLabBooking)
labRouter.post('/mark-paid',     authStaff, markLabPaid)

// Admin can also get all
labRouter.get('/admin/all',      authAdmin, getAllLabBookings)

export default labRouter
