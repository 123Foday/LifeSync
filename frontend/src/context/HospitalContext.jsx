import { createContext, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { toast } from 'react-toastify';

export const HospitalContext = createContext();

const HospitalContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAllHospitals = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/hospital/list`);
      if (data.success) {
        setHospitals(data.hospitals);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch hospitals');
    } finally {
      setLoading(false);
    }
  }, [backendUrl]);

  const value = {
    hospitals,
    loading,
    getAllHospitals
  };

  return (
    <HospitalContext.Provider value={value}>
      {children}
    </HospitalContext.Provider>
  );
};

HospitalContextProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default HospitalContextProvider;