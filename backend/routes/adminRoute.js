import express from 'express';
import {
    loginAdmin,
    appointmentsAdmin,
    appointmentCancel,
    addDoctor,
    allDoctors,
    adminDashboard,
    docDetails,
    addAppointmentNote,
    scheduleDetails,
    appointmentDetails,
    docDelete
} from '../controllers/adminController.js';
import { changeAvailablity } from '../controllers/doctorController.js';
import authAdmin from '../middleware/authAdmin.js';
import upload from '../middleware/multer.js';
const adminRouter = express.Router();

adminRouter.post("/login", loginAdmin)
adminRouter.post("/add-doctor", authAdmin, upload.single('image'), addDoctor)
adminRouter.get("/appointments", authAdmin, appointmentsAdmin)
adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel)
adminRouter.get("/all-doctors", authAdmin, allDoctors)
adminRouter.post("/change-availability", authAdmin, changeAvailablity)
adminRouter.get("/dashboard", authAdmin, adminDashboard)

// doctor details api for admin
adminRouter.get("/doctor-details/:id", docDetails)
adminRouter.delete("/doctor-delete/:id", docDelete)
adminRouter.get("/doctor-booked-schedule/:id", scheduleDetails)
adminRouter.get("/appointment-details/:appointmentId", appointmentDetails)
adminRouter.patch("/appointments/:appointmentId/note", addAppointmentNote)

export default adminRouter;