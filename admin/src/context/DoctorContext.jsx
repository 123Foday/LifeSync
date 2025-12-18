import { createContext, useState, useEffect, useCallback } from "react"
import axios from 'axios'
import { toast } from 'react-toastify'

export const DoctorContext = createContext()

const DoctorContextProvider = (props) => {

  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const [dToken, setDToken] = useState(localStorage.getItem('dToken') ? localStorage.getItem('dToken') : '')
  const [appointments, setAppointments] = useState([])
  const [dashData, setDashData] = useState(false)
  const [profileData, setProfileData] = useState(false)

  const getAppointments = useCallback(async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/doctor/appointments', { headers: { Authorization: `Bearer ${dToken}` } })
      if (data.success) {
        setAppointments(data.appointments)
        console.log(data.appointments)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }, [backendUrl, dToken])

  const completeAppointment = async (appointmentId) => {

    try {

      const { data } = await axios.post(backendUrl + '/api/doctor/complete-appointment', {appointmentId}, {headers: { Authorization: `Bearer ${dToken}` }})
      if (data.success) {
        toast.success(data.message)
        getAppointments()
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
      console.log(error)
      toast.error(error.message)
    }
    
  }

  const cancelAppointment = async (appointmentId) => {

    try {

      const { data } = await axios.post(backendUrl + '/api/doctor/cancel-appointment', {appointmentId}, {headers: { Authorization: `Bearer ${dToken}` }})
      if (data.success) {
        toast.success(data.message)
        getAppointments()
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
      console.log(error)
      toast.error(error.message)
    }
    
  }

  const getDashData = async () => {

    try {

      const { data } = await axios.get(backendUrl + '/api/doctor/dashboard', {headers: { Authorization: `Bearer ${dToken}` }})
      if (data.success) {
        setDashData(data.dashData)
        console.log(data.dashData);
        

      } else {
        toast.error(data.message)
      }
      
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
    
  }

  const getProfileData = async () => {
    try {

      const { data } = await axios.get(backendUrl + '/api/doctor/profile', {headers: { Authorization: `Bearer ${dToken}` }})
      if (data.success) {
        setProfileData(data.profileData)
        console.log(data.profileData)
      }
      
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
    
  }

  const value = {
    dToken, setDToken,
    backendUrl, 
    appointments, setAppointments, getAppointments, completeAppointment,
    cancelAppointment, dashData,
    setDashData, getDashData, profileData, setProfileData, getProfileData,
  }

  // Listen for appointment updates from other parts of the app or other tabs
  useEffect(() => {
    const handler = () => {
      if (dToken) getAppointments()
    }

    const storageHandler = (e) => {
      if (e.key === 'appointments_update_ts') {
        if (dToken) getAppointments()
      }
    }

    window.addEventListener('appointmentsUpdated', handler)
    window.addEventListener('storage', storageHandler)

    return () => {
      window.removeEventListener('appointmentsUpdated', handler)
      window.removeEventListener('storage', storageHandler)
    }
  }, [dToken, getAppointments])

  return (
    <DoctorContext.Provider value={value}>
        {props.children}
    </DoctorContext.Provider>
  )
}

export default DoctorContextProvider