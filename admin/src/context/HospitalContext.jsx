import { createContext, useState, useCallback, useEffect } from "react";
import PropTypes from 'prop-types'
import axios from "axios";
import { toast } from "react-toastify";

export const HospitalContext = createContext();

const HospitalContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [hToken, setHToken] = useState(
    localStorage.getItem("hToken") ? localStorage.getItem("hToken") : ""
  );
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);
  const [profileData, setProfileData] = useState(false);
  const [doctors, setDoctors] = useState([]);

  const getAppointments = useCallback(async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/hospital/appointments",
        { headers: { Authorization: `Bearer ${hToken}` } }
      );
      if (data.success) {
        setAppointments(data.appointments);
        console.log(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }, [backendUrl, hToken]);

  const completeAppointment = useCallback(async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/hospital/complete-appointment",
        { appointmentId },
        { headers: { Authorization: `Bearer ${hToken}` } }
      );
      if (data.success) {
        toast.success(data.message);
        getAppointments();
          // Notify other parts of the app (and other tabs) that appointments changed
          try {
            window.dispatchEvent(new Event('appointmentsUpdated'))
            localStorage.setItem('appointments_update_ts', Date.now().toString())
          } catch (e) {
            console.log('Notify error:', e.message)
          }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }, [backendUrl, hToken, getAppointments]);

  const cancelAppointment = useCallback(async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/hospital/cancel-appointment",
        { appointmentId },
        { headers: { Authorization: `Bearer ${hToken}` } }
      );
      if (data.success) {
        toast.success(data.message);
        getAppointments();
          // Notify other parts of the app (and other tabs) that appointments changed
          try {
            window.dispatchEvent(new Event('appointmentsUpdated'))
            localStorage.setItem('appointments_update_ts', Date.now().toString())
          } catch (e) {
            console.log('Notify error:', e.message)
          }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }, [backendUrl, hToken, getAppointments]);

  const getDashData = useCallback(async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/hospital/dashboard", {
        headers: { Authorization: `Bearer ${hToken}` },
      });
      if (data.success) {
        setDashData(data.dashData);
        console.log(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }, [backendUrl, hToken]);

  const getProfileData = useCallback(async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/hospital/profile", {
        headers: { Authorization: `Bearer ${hToken}` },
      });
      if (data.success) {
        setProfileData(data.profileData);
        console.log(data.profileData);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }, [backendUrl, hToken]);

  const getDoctors = useCallback(async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/hospital/doctors", {
        headers: { Authorization: `Bearer ${hToken}` },
      });
      if (data.success) {
        setDoctors(data.doctors);
        console.log(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }, [backendUrl, hToken]);

  const assignDoctor = useCallback(async (appointmentId, doctorId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/hospital/assign-doctor",
        { appointmentId, doctorId },
        { headers: { Authorization: `Bearer ${hToken}` } }
      );
      if (data.success) {
        toast.success(data.message);
        getAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }, [backendUrl, hToken, getAppointments]);

  const value = {
    hToken,
    setHToken,
    backendUrl,
    appointments,
    setAppointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
    dashData,
    setDashData,
    getDashData,
    profileData,
    setProfileData,
    getProfileData,
    doctors,
    setDoctors,
    getDoctors,
    assignDoctor,
  };

  // Listen for appointment updates from other parts of the app (and other tabs)
  useEffect(() => {
    const handler = () => {
      if (hToken) getAppointments()
    }

    const storageHandler = (e) => {
      if (e.key === 'appointments_update_ts') {
        if (hToken) getAppointments()
      }
    }

    window.addEventListener('appointmentsUpdated', handler)
    window.addEventListener('storage', storageHandler)

    return () => {
      window.removeEventListener('appointmentsUpdated', handler)
      window.removeEventListener('storage', storageHandler)
    }
  }, [hToken, getAppointments])

  return (
    <HospitalContext.Provider value={value}>
      {children}
    </HospitalContext.Provider>
  );
};

export default HospitalContextProvider;

HospitalContextProvider.propTypes = {
  children: PropTypes.node
}
