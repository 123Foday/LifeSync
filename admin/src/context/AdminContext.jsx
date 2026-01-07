import { createContext, useState, useCallback, useEffect } from "react"
import PropTypes from 'prop-types'
import axios from 'axios'
import { toast } from 'react-toastify'

export const AdminContext = createContext()


const AdminContextProvider = ({ children }) => {

  const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '')
  const [doctors, setDoctors] = useState([])
  const [hospitals, setHospitals] = useState([])
  const [appointments, setAppointments] = useState([])
  const [users, setUsers] = useState([])
  const [dashData, setDashData] = useState(false)

  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const getAllUsers = useCallback(async () => {
    try {
      const { data } = await axios.post(backendUrl + '/api/admin/all-users', {}, { headers: { atoken: aToken } })
      if (data.success) {
        setUsers(data.users)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }, [backendUrl, aToken])

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
        // Notify other parts of the app (and other tabs) that appointments changed
        try {
          window.dispatchEvent(new Event('appointmentsUpdated'))
          localStorage.setItem('appointments_update_ts', Date.now().toString())
        } catch (e) {
          console.log('Notify error:', e.message)
        }
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
    users,
    getAllDoctors,
    getAllHospitals,
    getAllUsers,
    changeHospitalAvailability,
    changeAvailability,
    appointments,
    setAppointments,
    getAllAppointments,
    cancelAppointment,
    dashData,
    getDashData
  }

  // Listen for updates (in-window or cross-tab) to refresh appointments
  useEffect(() => {
    const handleUpdate = () => {
      if (aToken) getAllAppointments()
    }

    const handleStorage = (e) => {
      if (e.key === 'appointments_update_ts') {
        if (aToken) getAllAppointments()
      }
    }

    window.addEventListener('appointmentsUpdated', handleUpdate)
    window.addEventListener('storage', handleStorage)

    return () => {
      window.removeEventListener('appointmentsUpdated', handleUpdate)
      window.removeEventListener('storage', handleStorage)
    }
  }, [aToken, getAllAppointments])

  return (
    <AdminContext.Provider value={value}>
        {children}
    </AdminContext.Provider>
  )
}

// Listen for cross-tab or in-window updates to refresh appointments
// (kept outside the provider return to avoid re-creating listeners)
// Note: We attach listeners when this module is evaluated; they call into the provider via window events.


export default AdminContextProvider

AdminContextProvider.propTypes = {
  children: PropTypes.node
}