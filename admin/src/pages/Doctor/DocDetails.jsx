import React, { useContext, useEffect, useState } from 'react'
// import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import {useNavigate, useParams} from 'react-router-dom';
import {AdminContext} from "../../context/AdminContext.jsx";

const DocProfile = () => {
    const {docId} = useParams();
    const navigate = useNavigate();

    const [docInfo, setDocInfo] = useState(null)
    const [appointments, setAppointments] = useState([]);

    // const {doctors, aToken} = useContext(AdminContext)
    const {currency, backendUrl} = useContext(AppContext)


    const fetchDoctorDetails = async () => {
        try {
            const response = await axios.get(backendUrl + `/api/admin/doctor-details/${docId}`, {
                cache: 'no-store'
            })
            const data = response.data;
            setDocInfo(data.doc)
        } catch (error) {
            console.error(error);
        }
    };

    const fetchAppointments = async () => {
        try {
            const response = await axios.get(backendUrl + `/api/admin/doctor-booked-schedule/${docId}`, {
                cache: 'no-store'
            })
            const data = response.data;
            setAppointments(data)
        } catch (err) {
            console.log(err)
        }
    }

    const handleItemClick = (appId) => {
        navigate(`/appointment-details/${appId}`);
    };


    useEffect(() => {
        fetchDoctorDetails()
        fetchAppointments()
    }, [docId])

    const handleDelete = async () => {
        try {
            // Call the API to delete the doctor
            console.log(backendUrl,docId)
            const response = await axios.delete(backendUrl + `/api/admin/doctor-delete/${docId}`);

            console.log(response);

            if (response.data.success) {
                alert('Doctor deleted successfully');
            }
            navigate('/')
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <div>
            {docInfo ? (<div className='flex flex-col gap-4 m-5'>
                    <div>
                        <img className='bg-primary/80 w-full sm:max-w-64 rounded-lg' src={docInfo.image} alt=""/>
                    </div>

                    <div className='flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white'>

                        {/* ----- Doc Info : name, degree, experience ----- */}

                        <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>{docInfo.name}</p>
                        <div className='flex items-center gap-2 mt-1 text-gray-600'>
                            <p>{docInfo.degree} - {docInfo.speciality}</p>
                            <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
                        </div>

                        {/* ----- Doc About ----- */}
                        <div>
                            <p className='flex items-center gap-1 text-sm font-medium text-[#262626] mt-3'>About :</p>
                            <p className='text-sm text-gray-600 max-w-[700px] mt-1'>
                            <textarea type='text' className='w-full outline-primary p-2' rows={8}
                                      value={docInfo.about}/>
                            </p>
                        </div>
                        <p className='text-gray-600 font-medium mt-4'>
                            Appointment fee: <span className='text-gray-800'>{currency} <input type='number'
                                                                                               value={docInfo.fees}/></span>
                        </p>
                        <br/>
                        <button
                            className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                            onClick={handleDelete}
                        >
                            Delete Doctor
                        </button>
                        <br/>
                        <div>
                            <h1>Booked Appointments</h1>
                            <br/>
                            {appointments.length === 0 ? (
                                <p>No booked appointments found</p>
                            ) : (
                                <ul>
                                    {appointments.map((appointment, index) => (
                                        <li key={index} style={{marginBottom: '10px'}}>
                                            <button onClick={() => handleItemClick(appointment.id)}
                                                    className="list-item" style={{
                                                all: 'unset',
                                                cursor: 'pointer',
                                                backgroundColor: 'silver',
                                                display: 'block',
                                                width: '100%',
                                                padding: '10px',
                                                textAlign: 'left',
                                                borderRadius: '8px',
                                                transition: 'box-shadow 0.3s ease'
                                            }}><strong>Date:</strong> {appointment.date} <br/>
                                                <strong>Time:</strong> {appointment.time} <br/>
                                                <strong>Patient:</strong> {appointment.patientName} <br/>
                                                <strong>Completed:</strong> {appointment.isCompleted ? 'Yes' : 'No'}
                                            </button>
                                            <br/>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                    </div>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    )
}
export default DocProfile