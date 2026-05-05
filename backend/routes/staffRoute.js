import express from 'express';
import { loginStaff, getStaffProfile, getStaffAppointments, getStaffReports, cancelAppointment, updateReportStatus, checkInAppointment, markAsPaid, getAllPatients, getPatientDetails, googleLoginStaff } from '../controllers/staffController.js';
import authStaff from '../middleware/authStaff.js';

const staffRouter = express.Router();

staffRouter.post("/login", loginStaff);
staffRouter.post("/google-login", googleLoginStaff);
staffRouter.get("/profile", authStaff, getStaffProfile);
staffRouter.get("/appointments", authStaff, getStaffAppointments);
staffRouter.post("/cancel-appointment", authStaff, cancelAppointment);
staffRouter.post("/check-in", authStaff, checkInAppointment);
staffRouter.post("/mark-paid", authStaff, markAsPaid);
staffRouter.get("/reports", authStaff, getStaffReports);
staffRouter.post("/update-report", authStaff, updateReportStatus);
staffRouter.get("/all-patients", authStaff, getAllPatients);
staffRouter.get("/patient-details/:id", authStaff, getPatientDetails);

export default staffRouter;
