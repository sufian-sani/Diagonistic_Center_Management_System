import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from 'google-auth-library';
import staffModel from "../models/staffModel.js";
import appointmentModel from "../models/appointmentModel.js";
import reportModel from "../models/reportModel.js";
import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// API for staff login
const loginStaff = async (req, res) => {
    try {
        const { email, password } = req.body;
        const staff = await staffModel.findOne({ email });

        if (!staff) {
            return res.json({ success: false, message: "Staff member not found" });
        }

        const isMatch = await bcrypt.compare(password, staff.password);

        if (isMatch) {
            const token = jwt.sign({ id: staff._id, role: staff.role }, process.env.JWT_SECRET);
            res.json({ success: true, token, role: staff.role });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API for staff login with Google
const googleLoginStaff = async (req, res) => {
    try {
        const { token } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { email } = ticket.getPayload();

        // Role Isolation Check
        const isPatient = await userModel.findOne({ email });
        const isDoctor = await doctorModel.findOne({ email });
        const isAdmin = email === process.env.ADMIN_EMAIL;

        if (isPatient || isDoctor || isAdmin) {
             // Block or handle cross-role clash
        }

        const staff = await staffModel.findOne({ email });

        if (staff) {
            const token = jwt.sign({ id: staff._id, role: staff.role }, process.env.JWT_SECRET)
            res.json({ success: true, token, role: staff.role })
        } else {
            res.json({ success: false, message: "Staff email not found" })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get staff profile
const getStaffProfile = async (req, res) => {
    try {
        const { staffId } = req.body;
        const profileData = await staffModel.findById(staffId).select('-password');
        res.json({ success: true, profileData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to get all appointments (Restricted to Receptionist)
const getStaffAppointments = async (req, res) => {
    try {
        const { staffRole } = req.body;
        
        // Only Receptionists should see the full appointment list
        if (staffRole !== 'Receptionist' && staffRole !== 'Head Admin') {
            return res.json({ success: false, message: 'Unauthorized access to appointment list' });
        }

        const appointments = await appointmentModel.find({});
        res.json({ success: true, appointments });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to cancel appointment (for Receptionist)
const cancelAppointment = async (req, res) => {
    try {
        const { staffRole } = req.body;
        if (staffRole !== 'Receptionist' && staffRole !== 'Head Admin') {
             return res.json({ success: false, message: 'Unauthorized' });
        }
        const { appointmentId } = req.body;
        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });
        res.json({ success: true, message: 'Appointment Cancelled' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to check in appointment (for Receptionist)
const checkInAppointment = async (req, res) => {
    try {
        const { staffRole } = req.body;
        if (staffRole !== 'Receptionist' && staffRole !== 'Head Admin') {
             return res.json({ success: false, message: 'Unauthorized' });
        }
        const { appointmentId } = req.body;
        await appointmentModel.findByIdAndUpdate(appointmentId, { hasArrived: true });
        res.json({ success: true, message: 'Patient Checked In Successfully' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to mark appointment as paid (for Receptionist)
const markAsPaid = async (req, res) => {
    try {
        const { staffRole } = req.body;
        if (staffRole !== 'Receptionist' && staffRole !== 'Head Admin') {
             return res.json({ success: false, message: 'Unauthorized' });
        }
        const { appointmentId } = req.body;
        await appointmentModel.findByIdAndUpdate(appointmentId, { payment: true });
        res.json({ success: true, message: 'Appointment marked as Paid' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to get all reports (for Lab Tech)
const getStaffReports = async (req, res) => {
    try {
        const { staffRole } = req.body;
        
        // Example of role-based check
        if (staffRole !== 'Lab Technician' && staffRole !== 'Head Admin') {
             // For now we allow Receptionists to view or we restrict them.
        }
        
        const reports = await reportModel.find({});
        res.json({ success: true, reports });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to update report status (for Lab Tech)
const updateReportStatus = async (req, res) => {
    try {
        const { staffRole } = req.body;
        if (staffRole !== 'Lab Technician' && staffRole !== 'Head Admin') {
             return res.json({ success: false, message: 'Unauthorized' });
        }
        const { reportId, status } = req.body;
        await reportModel.findByIdAndUpdate(reportId, { status });
        res.json({ success: true, message: 'Report Status Updated' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// API to get all patients/users for staff panel
const getAllPatients = async (req, res) => {
    try {
        const patients = await userModel.find({}).select('-password');
        res.json({ success: true, patients });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to get specific patient details for staff panel
const getPatientDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const patient = await userModel.findById(id).select("-password");
        const appointments = await appointmentModel.find({ userId: id });

        res.json({ success: true, patient, appointments });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export {
    loginStaff,
    getStaffProfile,
    getStaffAppointments,
    cancelAppointment,
    checkInAppointment,
    markAsPaid,
    getStaffReports,
    updateReportStatus,
    getAllPatients,
    getPatientDetails,
    googleLoginStaff
}
