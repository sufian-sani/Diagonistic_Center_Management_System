import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const StaffContext = createContext();

const StaffContextProvider = (props) => {
    const [sToken, setSToken] = useState(localStorage.getItem('sToken') || '');
    const [staffRole, setStaffRole] = useState(localStorage.getItem('staffRole') || '');
    const [staffData, setStaffData] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [reports, setReports] = useState([]);
    const [labBookings, setLabBookings] = useState([]);
    const [patients, setPatients] = useState([]);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // Fetch all appointments (For Receptionist)
    const getAppointments = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/staff/appointments`, { headers: { stoken: sToken } });
            if (data.success) {
                setAppointments(data.appointments);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Fetch all reports (For Lab Tech)
    const getReports = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/staff/reports`, { headers: { stoken: sToken } });
            if (data.success) {
                setReports(data.reports);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Cancel appointment (For Receptionist)
    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/staff/cancel-appointment`, { appointmentId }, { headers: { stoken: sToken } });
            if (data.success) {
                toast.success(data.message);
                getAppointments();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    // Check in appointment (For Receptionist)
    const checkInAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/staff/check-in`, { appointmentId }, { headers: { stoken: sToken } });
            if (data.success) {
                toast.success(data.message);
                getAppointments();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    // Mark as paid (For Receptionist)
    const markAsPaid = async (appointmentId) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/staff/mark-paid`, { appointmentId }, { headers: { stoken: sToken } });
            if (data.success) {
                toast.success(data.message);
                getAppointments();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    // Update report status (For Lab Tech)
    const updateReportStatus = async (reportId, status) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/staff/update-report`, { reportId, status }, { headers: { stoken: sToken } });
            if (data.success) {
                toast.success(data.message);
                getReports();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    // ── Lab Booking functions ──────────────────────────────────────────
    const getLabBookings = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/lab/all`, { headers: { stoken: sToken } });
            if (data.success) setLabBookings(data.bookings);
            else toast.error(data.message);
        } catch (error) { toast.error(error.message); }
    }

    const checkInLabBooking = async (bookingId) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/lab/check-in`, { bookingId }, { headers: { stoken: sToken } });
            if (data.success) { toast.success(data.message); getLabBookings(); }
            else toast.error(data.message);
        } catch (error) { toast.error(error.message); }
    }

    const markLabPaid = async (bookingId) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/lab/mark-paid`, { bookingId }, { headers: { stoken: sToken } });
            if (data.success) { toast.success(data.message); getLabBookings(); }
            else toast.error(data.message);
        } catch (error) { toast.error(error.message); }
    }

    const updateLabStatus = async (bookingId, status) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/lab/update-status`, { bookingId, status }, { headers: { stoken: sToken } });
            if (data.success) { toast.success('Status updated'); getLabBookings(); }
            else toast.error(data.message);
        } catch (error) { toast.error(error.message); }
    }

    const cancelLabBookingStaff = async (bookingId) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/lab/cancel`, { bookingId }, { headers: { stoken: sToken } });
            if (data.success) { toast.success('Booking cancelled'); getLabBookings(); }
            else toast.error(data.message);
        } catch (error) { toast.error(error.message); }
    }

    // Fetch all patients for Staff
    const getAllPatients = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/staff/all-patients`, { headers: { stoken: sToken } });
            if (data.success) {
                setPatients(data.patients.reverse());
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    // Fetch specific patient details for Staff
    const getPatientDetails = async (patientId) => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/staff/patient-details/${patientId}`, { headers: { stoken: sToken } });
            if (data.success) {
                return data; // Return { patient, appointments }
            } else {
                toast.error(data.message);
                return null;
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
            return null;
        }
    }

    const value = {
        sToken, setSToken,
        staffRole, setStaffRole,
        staffData, setStaffData,
        appointments, setAppointments,
        reports, setReports,
        labBookings, setLabBookings,
        patients, setPatients,
        getAppointments, getReports, getLabBookings, getAllPatients, getPatientDetails,
        cancelAppointment, checkInAppointment, markAsPaid, updateReportStatus,
        checkInLabBooking, markLabPaid, updateLabStatus, cancelLabBookingStaff,
        backendUrl
    };

    return (
        <StaffContext.Provider value={value}>
            {props.children}
        </StaffContext.Provider>
    );
};

export default StaffContextProvider;
