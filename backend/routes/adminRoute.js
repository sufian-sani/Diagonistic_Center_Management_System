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
    docDelete,
    allPatients,
    patientDetails,
    addStaff,
    allStaff,
    googleLoginAdmin
} from '../controllers/adminController.js';
import { changeAvailablity } from '../controllers/doctorController.js';
import { addReport, getAllReports, updateReport } from '../controllers/reportController.js';
import authAdmin from '../middleware/authAdmin.js';
import upload from '../middleware/multer.js';
const adminRouter = express.Router();

adminRouter.post("/login", loginAdmin)
adminRouter.post("/google-login", googleLoginAdmin)
adminRouter.post("/add-doctor", authAdmin, upload.single('image'), addDoctor)
adminRouter.get("/appointments", authAdmin, appointmentsAdmin)
adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel)
adminRouter.get("/all-doctors", authAdmin, allDoctors)
adminRouter.post("/change-availability", authAdmin, changeAvailablity)
adminRouter.get("/dashboard", authAdmin, adminDashboard)
adminRouter.get("/all-patients", authAdmin, allPatients)
adminRouter.get("/patient-details/:id", authAdmin, patientDetails)

// Staff management
adminRouter.post("/add-staff", authAdmin, addStaff)
adminRouter.get("/all-staff", authAdmin, allStaff)

// Report routes
adminRouter.post("/add-report", authAdmin, addReport)
adminRouter.get("/all-reports", authAdmin, getAllReports)
adminRouter.post("/update-report", authAdmin, updateReport)

// doctor details api for admin
adminRouter.get("/doctor-details/:id", docDetails)
adminRouter.delete("/doctor-delete/:id", docDelete)
adminRouter.get("/doctor-booked-schedule/:id", scheduleDetails)
adminRouter.get("/appointment-details/:appointmentId", appointmentDetails)
adminRouter.patch("/appointments/:appointmentId/note", addAppointmentNote)

export default adminRouter;