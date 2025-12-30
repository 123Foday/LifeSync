import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

export const AppContext = createContext({
  doctors: [] as any[],
  hospitals: [] as any[],
  currencySymbol: '$',
  token: null as string | null,
  setToken: (token: string | null) => {},
  backendUrl: '',
  userData: null as any,
  logout: () => {},
});

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const currencySymbol = "$";
  const backendUrl = Constants.expoConfig?.extra?.backendUrl || "http://localhost:4000";

  const [doctors, setDoctors] = useState<any[]>([]);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);

  const loadToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
      }
    } catch (e) {
      console.error("Failed to load token", e);
    }
  };

  const getDoctorsData = useCallback(async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/list");
      if (data.success) {
        setDoctors(data.doctors);
      }
    } catch (error) {
      console.error("Error fetching doctors", error);
    }
  }, [backendUrl]);

  const getHospitalsData = useCallback(async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/hospital/list");
      if (data.success) {
        setHospitals(data.hospitals);
      }
    } catch (error) {
      console.error("Error fetching hospitals", error);
    }
  }, [backendUrl]);

  const loadUserProfileData = useCallback(async () => {
    if (!token) return;
    try {
      const { data } = await axios.get(backendUrl + "/api/user/get-profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setUserData(data.userData);
      }
    } catch (error) {
      console.error("Error fetching user profile", error);
    }
  }, [backendUrl, token]);

  useEffect(() => {
    loadToken();
  }, []);

  useEffect(() => {
    getDoctorsData();
    getHospitalsData();
  }, [getDoctorsData, getHospitalsData]);

  useEffect(() => {
    if (token) {
      loadUserProfileData();
    }
  }, [token, loadUserProfileData]);

  const logout = async () => {
    setToken(null);
    setUserData(null);
    await AsyncStorage.removeItem("token");
  };

  const value = {
    doctors,
    hospitals,
    currencySymbol,
    token,
    setToken: async (newToken: string | null) => {
      setToken(newToken);
      if (newToken) {
        await AsyncStorage.setItem("token", newToken);
      } else {
        await AsyncStorage.removeItem("token");
      }
    },
    backendUrl,
    userData,
    logout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
