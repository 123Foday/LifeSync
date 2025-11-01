import { createContext, useState, useCallback } from "react";
import PropTypes from 'prop-types'
import axios from "axios";
import { toast } from "react-toastify";

export const HospitalContext = createContext();

const HospitalContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [dToken, setDToken] = useState(
    localStorage.getItem("dToken") ? localStorage.getItem("dToken") : ""
  );
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);
  const [profileData, setProfileData] = useState(false);

  const getAppointments = useCallback(async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/hospital/appointments",
        { headers: { Authorization: `Bearer ${dToken}` } }
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
  }, [backendUrl, dToken]);

  const completeAppointment = useCallback(async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/hospital/complete-appointment",
        { appointmentId },
        { headers: { Authorization: `Bearer ${dToken}` } }
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
  }, [backendUrl, dToken, getAppointments]);

  const cancelAppointment = useCallback(async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/hospital/cancel-appointment",
        { appointmentId },
        { headers: { Authorization: `Bearer ${dToken}` } }
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
  }, [backendUrl, dToken, getAppointments]);

  const getDashData = useCallback(async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/hospital/dashboard", {
        headers: { Authorization: `Bearer ${dToken}` },
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
  }, [backendUrl, dToken]);

  const getProfileData = useCallback(async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/hospital/profile", {
        headers: { Authorization: `Bearer ${dToken}` },
      });
      if (data.success) {
        setProfileData(data.profileData);
        console.log(data.profileData);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }, [backendUrl, dToken]);

  const value = {
    dToken,
    setDToken,
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
  };

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
