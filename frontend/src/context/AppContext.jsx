import { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const currencySymbol = "$";
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  
  // Log backend URL for debugging (remove in production)
  if (import.meta.env.DEV) {
    console.log("Backend URL:", backendUrl);
  }

  const [doctors, setDoctors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : false
  );
  const [userData, setUserData] = useState(false);

  // Centralized logout helper so both proactive checks and response interceptor can reuse it
  const logout = (redirect = true) => {
    setToken(false);
    setUserData(false);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common.Authorization;
    if (redirect) {
      // Use location assign so history is replaced and back doesn't restore the expired session
      window.location.href = '/login';
    }
  }

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

  // Proactively detect token expiry by decoding JWT payload and scheduling an auto-logout
  useEffect(() => {
    let timerId;

    if (token) {
      try {
        const parts = token.split('.');
        if (parts.length === 3) {
          // Base64url -> Base64
          const base64Url = parts[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split('')
              .map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
              })
              .join('')
          );
          const payload = JSON.parse(jsonPayload);

          if (payload && payload.exp) {
            const expMs = payload.exp * 1000;
            const now = Date.now();

            if (expMs <= now) {
              // Already expired — force logout immediately (no redirect to avoid double navigation)
              logout(false);
              toast.info('Session expired. Please log in again.');
            } else {
              // Schedule a logout slightly before actual expiry to be safe
              const msUntilLogout = Math.max(expMs - now - 3000, 0);
              timerId = setTimeout(() => {
                logout(true);
                toast.info('Session expired. Please log in again.');
              }, msUntilLogout);
            }
          }
        }
      } catch (err) {
        // If decoding fails, don't break the app; rely on interceptor as a fallback
        console.warn('Failed to decode stored token for expiry check', err);
      }
    }

    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [token]);

  // Intercept 401 / JWT expired responses globally so we can auto-logout the user
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error?.response?.status;
        const message = error?.response?.data?.message || error?.message || '';

        // If the token is expired or the server returns 401, clear the session and redirect to login
        if (status === 401 || /jwt expired|token expired|invalid token/i.test(message)) {
          setToken(false);
          setUserData(false);
          localStorage.removeItem('token');
          delete axios.defaults.headers.common.Authorization;
          toast.info('Session expired. Please log in again.');
          // Small timeout to allow the toast to render
          setTimeout(() => {
            window.location.href = '/login';
          }, 600);
        }

        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, [setToken, setUserData]);

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
