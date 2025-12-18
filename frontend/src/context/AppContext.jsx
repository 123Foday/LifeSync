import { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const currencySymbol = "$";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [doctors, setDoctors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : false
  );
  const [userData, setUserData] = useState(false);

  const getDoctorsData = useCallback(async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/list");
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }, [backendUrl]);

  // Get hospitals data
  const getHospitalsData = useCallback(async () => {
    try {
      const response = await axios.get(backendUrl + "/api/hospital/list");
      const { data } = response;
      if (data.success) {
        setHospitals(data.hospitals);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Hospital fetch error:", error);
      if (error.response) {
        toast.error(error.response.data.message || "Failed to fetch hospitals");
      } else if (error.request) {
        toast.error("No response from server. Is the backend running?");
      } else {
        toast.error(error.message);
      }
    }
  }, [backendUrl]);

  const loadUserProfileData = useCallback(async () => {
    try {
      // ✅ Fixed: Send token in Bearer format
      const { data } = await axios.get(backendUrl + "/api/user/get-profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }, [backendUrl, token]);

  useEffect(() => {
    getDoctorsData();
  }, [getDoctorsData]);

  useEffect(() => {
    getHospitalsData();
  }, [getHospitalsData]);

  useEffect(() => {
    if (token) {
      // Set axios default Authorization so all requests use the Bearer token
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      loadUserProfileData();
    } else {
      // Remove default header when no token
      delete axios.defaults.headers.common.Authorization;
      setUserData(false);
    }
  }, [token, loadUserProfileData]);

  const value = {
    doctors,
    getDoctorsData,
    hospitals,
    getHospitalsData,
    currencySymbol,
    token,
    setToken,
    backendUrl,
    userData,
    setUserData,
    loadUserProfileData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

AppContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppContextProvider;
