import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";


export const AdminContext = createContext()

const AdminContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '')

    const [appointments, setAppointments] = useState([])
    const [doctors, setDoctors] = useState([])
    const [patients, setPatients] = useState([])
    const [reports, setReports] = useState([])
    const [dashData, setDashData] = useState(false)

    // Getting all Doctors data from Database using API
    const getAllDoctors = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/all-doctors', { headers: { aToken } })
            if (data.success) {
                setDoctors(data.doctors)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // Function to change doctor availablity using API
    const changeAvailability = async (docId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/change-availability', { docId }, { headers: { aToken } })
            if (data.success) {
                toast.success(data.message)
                getAllDoctors()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }


    // Getting all appointment data from Database using API
    const getAllAppointments = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/appointments', { headers: { aToken } })
            if (data.success) {
                setAppointments(data.appointments.reverse())
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }
    }

    // Function to cancel appointment using API
    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/cancel-appointment', { appointmentId }, { headers: { aToken } })
            if (data.success) {
                toast.success(data.message)
                getAllAppointments()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }
    }

    // Getting Admin Dashboard data from Database using API
    const getDashData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/dashboard', { headers: { aToken } })
            if (data.success) {
                setDashData(data.dashData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // Getting all Patients data from Database using API
    const getAllPatients = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/all-patients', { headers: { aToken } })
            if (data.success) {
                setPatients(data.patients.reverse())
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // Getting specific Patient details from Database using API
    const getPatientDetails = async (patientId) => {
        try {
            const { data } = await axios.get(backendUrl + `/api/admin/patient-details/${patientId}`, { headers: { aToken } })
            if (data.success) {
                return data; // Return { patient, appointments }
            } else {
                toast.error(data.message)
                return null;
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
            return null;
        }
    }

    // Getting all reports
    const getAllReports = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/all-reports', { headers: { aToken } })
            if (data.success) {
                setReports(data.reports)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // Add a new report
    const addReport = async (reportData) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/add-report', reportData, { headers: { aToken } })
            if (data.success) {
                toast.success(data.message)
                getAllReports()
                return true
            } else {
                toast.error(data.message)
                return false
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
            return false
        }
    }

    // Update report status
    const updateReportStatus = async (reportId, status, result = '') => {
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/update-report', { reportId, status, result }, { headers: { aToken } })
            if (data.success) {
                toast.success(data.message)
                getAllReports()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const value = {
        aToken, setAToken,
        doctors,
        getAllDoctors,
        changeAvailability,
        appointments,
        getAllAppointments,
        getDashData,
        cancelAppointment,
        dashData,
        patients,
        getAllPatients,
        getPatientDetails,
        reports,
        getAllReports,
        addReport,
        updateReportStatus,
        backendUrl
    }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )

}

export default AdminContextProvider