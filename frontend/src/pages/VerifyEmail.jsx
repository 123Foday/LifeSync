import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiXCircle, FiLoader, FiArrowRight } from 'react-icons/fi';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');

  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

  useEffect(() => {
    const verifyToken = async () => {
      if (!token || !email) {
        setStatus('error');
        setMessage('Invalid verification link. Missing token or email.');
        return;
      }

      try {
        const { data } = await axios.get(`${backendUrl}/api/user/verify-email`, {
          params: { token, email }
        });

        if (data.success) {
          setStatus('success');
          setMessage(data.message);
          toast.success(data.message);
        } else {
          setStatus('error');
          setMessage(data.message);
        }
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Verification failed. Please try again.');
        toast.error(error.response?.data?.message || 'Verification failed');
      }
    };

    verifyToken();
  }, [token, email, backendUrl]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center border border-slate-100 dark:border-slate-700"
      >
        {status === 'loading' && (
          <div className="flex flex-col items-center">
            <FiLoader className="w-16 h-16 text-primary animate-spin mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Verifying Your Email</h2>
            <p className="text-slate-500 dark:text-slate-400">Please wait while we secure your account...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
              <FiCheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">Email Verified!</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8">{message}</p>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 group"
            >
              Continue to Login
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
              <FiXCircle className="w-12 h-12 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">Verification Failed</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8">{message}</p>
            <div className="flex flex-col w-full gap-3">
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-semibold py-3 px-6 rounded-xl transition-all"
              >
                Back to Login
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
