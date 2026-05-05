import jwt from "jsonwebtoken";
import { OAuth2Client } from 'google-auth-library';
import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import { v2 as cloudinary } from "cloudinary";
import userModel from "../models/userModel.js";
import staffModel from "../models/staffModel.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// API for admin login
const loginAdmin = async (req, res) => {
    try {

        const { email, password } = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API for admin login with Google
const googleLoginAdmin = async (req, res) => {
    try {
        const { token } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { email } = ticket.getPayload();

        if (email === process.env.ADMIN_EMAIL) {
            const token = jwt.sign(email + process.env.ADMIN_PASSWORD, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Unauthorized admin email" })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


// API to get all appointments list
const appointmentsAdmin = async (req, res) => {
    try {

        const appointments = await appointmentModel.find({})
        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API for appointment cancellation
const appointmentCancel = async (req, res) => {
    try {

        const { appointmentId } = req.body
        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        res.json({ success: true, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API for adding Doctor
const addDoctor = async (req, res) => {

    try {

        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body
        const imageFile = req.file

        // Role Isolation Check: Prevent Patients from being added as Doctors
        const isPatient = await userModel.findOne({ email });
        if (isPatient) {
            return res.json({ success: false, message: "This email is already registered as a Patient. Please use a unique Staff email." })
        }

        // checking for all data to add doctor
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.json({ success: false, message: "Missing Details" })
        }

        if (!imageFile) {
            return res.json({ success: false, message: "Doctor image not uploaded" })
        }

        // validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        // validating strong password
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10); // the more no. round the more time it will take
        const hashedPassword = await bcrypt.hash(password, salt)

        // upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
        const imageUrl = imageUpload.secure_url

        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address),
            date: Date.now()
        }

        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save()
        res.json({ success: true, message: 'Doctor Added' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get all doctors list for admin panel
const allDoctors = async (req, res) => {
    try {

        const doctors = await doctorModel.find({}).select('-password')
        res.json({ success: true, doctors })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//API for doctor details
const docDetails = async (req, res) => {
    try{
        const doc = await doctorModel.findById(req.params.id)
        res.json({ success: true, doc })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//delete doctor
const docDelete = async (req, res) => {
    try{
        const doc = await doctorModel.deleteOne({_id: req.params.id})
        res.json({ success: true, doc })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//api for schedule details
const scheduleDetails = async (req, res) => {
    try {
        const doctorId = req.params.id;

        const appointments = await appointmentModel.find({
            docId: doctorId,
            cancelled: false, // Exclude cancelled appointments
        }).sort({ slotDate: 1, slotTime: 1 }); // Sort by date and time

        if (!appointments.length) {
            return res.status(404).json({ message: 'No booked appointments found' });
        }

        const formattedAppointments = appointments.map(appointment => ({
            id: appointment._id,
            date: appointment.slotDate,
            time: appointment.slotTime,
            patientName: appointment.userData.name,
            isCompleted: appointment.isCompleted,
        }));

        res.status(200).json(formattedAppointments);

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}
//api for appointmentDetails

const appointmentDetails = async (req, res) => {
    try{
        const { appointmentId } = req.params;
        const appointment = await appointmentModel.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        res.status(200).json(appointment);
    } catch (error){
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Add or update a note for an appointment
const addAppointmentNote = async (req, res) => {
    const { appointmentId } = req.params;
    const { note } = req.body;

    try {
        const appointment = await appointmentModel.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        appointment.note = note;
        await appointment.save();

        res.status(200).json({ message: 'Note added/updated successfully', appointment });
    } catch (error) {
        res.status(500).json({ message: 'Error updating note', error });
    }
};


// API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
    try {

        const doctors = await doctorModel.find({})
        const users = await userModel.find({})
        const appointments = await appointmentModel.find({})

        const dashData = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients: users.length,
            latestAppointments: appointments.reverse()
        }

        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get all patients/users for admin panel
const allPatients = async (req, res) => {
    try {
        const patients = await userModel.find({}).select('-password')
        res.json({ success: true, patients })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get specific patient details and their appointments
const patientDetails = async (req, res) => {
    try {
        const patientId = req.params.id;
        const patient = await userModel.findById(patientId).select('-password');
        
        if (!patient) {
            return res.status(404).json({ success: false, message: "Patient not found" });
        }

        const appointments = await appointmentModel.find({ userId: patientId }).sort({ slotDate: -1 });

        res.json({ success: true, patient, appointments });
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API for adding Staff (Lab Tech / Receptionist)
const addStaff = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        
        // Role Isolation Check: Prevent Patients from being added as Staff
        const isPatient = await userModel.findOne({ email });
        if (isPatient) {
            return res.json({ success: false, message: "This email is already registered as a Patient. Please use a unique Staff email." })
        }

        if (!name || !email || !password || !role) {
            return res.json({ success: false, message: "Missing Details" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const staffData = {
            name,
            email,
            password: hashedPassword,
            role,
            date: Date.now()
        }

        const newStaff = new staffModel(staffData);
        await newStaff.save();

        res.json({ success: true, message: `${role} Added Successfully` });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to get all staff list
const allStaff = async (req, res) => {
    try {
        const staff = await staffModel.find({}).select('-password');
        res.json({ success: true, staff });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export {
    loginAdmin,
    appointmentsAdmin,
    appointmentCancel,
    addDoctor,
    allDoctors,
    adminDashboard,
    docDetails,
    scheduleDetails,
    addAppointmentNote,
    appointmentDetails,
    docDelete,
    allPatients,
    patientDetails,
    addStaff,
    allStaff,
    googleLoginAdmin
}
