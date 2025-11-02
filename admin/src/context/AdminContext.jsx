import { createContext, useState, useCallback } from "react"
import PropTypes from 'prop-types'
import axios from 'axios'
import { toast } from 'react-toastify'

export const AdminContext = createContext()


const AdminContextProvider = ({ children }) => {

  const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '')
  const [doctors, setDoctors] = useState([])
  const [hospitals, setHospitals] = useState([])
  const [appointments, setAppointments] = useState([])
  const [dashData, setDashData] = useState(false)

  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const getAllDoctors = useCallback(async () => {
    try {
  const { data } = await axios.post(backendUrl + '/api/admin/all-doctors', {}, { headers: { atoken: aToken } })
      if (data.success) {
        setDoctors(data.doctors)
        console.log(data.doctors)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }, [backendUrl, aToken])

  const changeAvailability = async (docId) => {

    try {

  const { data } = await axios.post(backendUrl + '/api/admin/change-availability', {docId}, {headers:{atoken: aToken}})
      if (data.success) {
        toast.success(data.message)
        getAllDoctors()
      } else {
        toast.error(data.message)
      }
      
    } catch (error) {
      toast.error(error.message)
    }
  }

  const getAllHospitals = useCallback(async () => {
    try {
      // use POST to match backend route definition
  const { data } = await axios.post(backendUrl + '/api/admin/all-hospitals', {}, { headers: { atoken: aToken } })
      if (data.success) {
        setHospitals(data.hospitals)
        console.log(data.hospitals)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }, [backendUrl, aToken])

  const changeHospitalAvailability = async (hospitalId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/change-hospital-availability",
        { hospitalId },
        { headers: { atoken: aToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAllHospitals();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getAllAppointments = useCallback(async () => {
    try {
  const { data } = await axios.get(backendUrl + '/api/admin/appointments', { headers: { atoken: aToken } })
      if (data.success) {
        setAppointments(data.appointments)
        console.log(data.appointments)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }, [backendUrl, aToken])

  const cancelAppointment = async (appointmentId) => {
    
    try {

  const {data} = await axios.post(backendUrl + '/api/admin/cancel-appointment', {appointmentId}, {headers:{atoken: aToken}})
      if (data.success) {
        toast.success(data.message)
        getAllAppointments()
      } else {
        toast.error(data.message)
      }
      
    } catch (error) {
      toast.error(error.message)
    }
  }

  const getDashData = useCallback(async () => {
    try {
  const { data } = await axios.get(backendUrl + '/api/admin/dashboard', { headers: { atoken: aToken } })
      if (data.success) {
        setDashData(data.dashData)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }, [backendUrl, aToken])

  const value = {
    aToken,
    setAToken,
    backendUrl,
    doctors,
    hospitals,
    getAllDoctors,
    getAllHospitals,
    changeHospitalAvailability,
    changeAvailability,
    appointments,
    setAppointments,
    getAllAppointments,
    cancelAppointment,
    dashData,
    getDashData
  }

  return (
    <AdminContext.Provider value={value}>
        {children}
    </AdminContext.Provider>
  )
}

export default AdminContextProvider

AdminContextProvider.propTypes = {
  children: PropTypes.node
}