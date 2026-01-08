import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import { Eye, EyeOff } from "lucide-react";
import { assets } from "../assets/assets";

const Login = () => {
  const { backendUrl, token, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  const [state, setState] = useState("Login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Regular email/password authentication
  const onSubmitHandler = async (event) => {
    event.preventDefault();

    // Check terms agreement for signup
    if (state === "Sign Up" && !agreedToTerms) {
      toast.error("Please agree to the Terms & Conditions and Privacy Policy");
      return;
    }

    // Check password confirmation
    if (state === "Sign Up" && password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      if (state === "Sign Up") {
        const { data } = await axios.post(backendUrl + "/api/user/register", {
          name,
          password,
          email,
        });
        if (data.success) {
          toast.success(data.message || "Registered. Please verify your email.")
          // don't auto-login; user must verify email first
          setState('Login')
          setAgreedToTerms(false);
          setConfirmPassword("");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/user/login", {
          password,
          email,
        });
        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          toast.success("Login successful!");
          if (data.onboardingIncomplete) {
            navigate('/onboarding')
          } else {
            navigate('/')
          }
        } else {
          if (data.needsVerification) {
            toast.info('Account not verified. Please verify your email or phone before logging in.')
          } else {
            toast.error(data.message);
          }
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Google SSO handler
  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/google-login`, {
        credential: credentialResponse.credential,
      });
      if (data.success) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        toast.success(data.message || "Login successful!");
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast.error(error.response?.data?.message || "Google login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error("Google Sign-In failed. Please try again.");
  };

  // Apple SSO handler
  const handleAppleSuccess = async (response) => {
    setIsLoading(true);
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/apple-login`, {
        authorization: response.authorization,
        user: response.user,
      });
      if (data.success) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        toast.success(data.message || "Login successful!");
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Apple login error:", error);
      toast.error(error.response?.data?.message || "Apple login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleError = (error) => {
    console.error("Apple Sign-In error:", error);
    toast.error("Apple Sign-In failed. Please try again.");
  };

  // Initialize Apple Sign-In
  useEffect(() => {
    // Load Apple Sign-In script
    const script = document.createElement('script');
    script.src = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.AppleID) {
        window.AppleID.auth.init({
          clientId: import.meta.env.VITE_APPLE_CLIENT_ID || 'com.lifesync.service',
          scope: 'name email',
          redirectURI: import.meta.env.VITE_APPLE_REDIRECT_URI || window.location.origin,
          usePopup: true,
        });
      }
    };

    return () => {
      if(document.body.contains(script)){
        document.body.removeChild(script);
      }
    };
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  // Handle state change - reset terms checkbox when switching
  const handleStateChange = (newState) => {
    if (!isLoading) {
      setState(newState);
      setAgreedToTerms(false);
      setConfirmPassword("");
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center transition-all duration-300">
      <div className="flex flex-col gap-4 w-full max-w-md mx-auto items-start p-8 border dark:border-gray-800 rounded-2xl text-zinc-600 dark:text-zinc-300 text-sm shadow-xl bg-white dark:bg-[#121212] backdrop-blur-sm">
        
        {/* Sliding Toggle Header */}
        <div className="w-full mb-2">
          <div className="relative bg-gray-100 dark:bg-zinc-900 rounded-full p-1 flex items-center">
            {/* Sliding Background */}
            <div 
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#5f6FFF] rounded-full transition-all duration-300 ease-in-out ${
                state === "Sign Up" ? "left-[calc(50%+4px)]" : "left-1"
              }`}
            />
            
            {/* Login Button */}
            <button
              type="button"
              onClick={() => handleStateChange("Login")}
              disabled={isLoading}
              className={`relative z-10 flex-1 py-2.5 text-center font-semibold rounded-full transition-all duration-300 ${
                state === "Login" 
                  ? "text-white" 
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              Login
            </button>
            
            {/* Sign Up Button */}
            <button
              type="button"
              onClick={() => handleStateChange("Sign Up")}
              disabled={isLoading}
              className={`relative z-10 flex-1 py-2.5 text-center font-semibold rounded-full transition-all duration-300 ${
                state === "Sign Up" 
                  ? "text-white" 
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Logo */}
        <div className="w-full flex justify-center">
          <img src={assets.logo} alt="LifeSync" className="h-10 mb-2" />
        </div>

        {/* Header Text */}
        <div className="w-full text-center">
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {state === "Sign Up" ? "Create Account" : "Welcome Back"}
          </p>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {state === "Login" 
              ? "Login to book appointments and manage your health" 
              : "Sign up to get started with LifeSync"}
          </p>
        </div>

        {/* Name field (Sign Up only) */}
        {state === "Sign Up" && (
          <div className="w-full">
            <p className="mb-1 font-medium">Full Name</p>
            <input
              className="border dark:border-gray-800 dark:bg-zinc-900 dark:text-white rounded-lg w-full p-2.5 focus:ring-2 focus:ring-[#5f6FFF] outline-none transition-all"
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
              disabled={isLoading}
              placeholder="Enter your full name"
            />
          </div>
        )}

        {/* Email field */}
        <div className="w-full">
          <p className="mb-1 font-medium">Email</p>
          <input
            className="border dark:border-gray-800 dark:bg-zinc-900 dark:text-white rounded-lg w-full p-2.5 focus:ring-2 focus:ring-[#5f6FFF] outline-none transition-all"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
            disabled={isLoading}
            placeholder="your@email.com"
          />
        </div>

        {/* Password field with show/hide toggle */}
        <div className="w-full">
          <p className="mb-1 font-medium">Password</p>
          <div className="relative">
            <input
              className="border dark:border-gray-800 dark:bg-zinc-900 dark:text-white rounded-lg w-full p-2.5 pr-10 focus:ring-2 focus:ring-[#5f6FFF] outline-none transition-all"
              type={showPassword ? "text" : "password"}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
              disabled={isLoading}
              placeholder={state === "Sign Up" ? "Create a strong password" : "Enter your password"}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password field (Sign Up only) */}
        {state === "Sign Up" && (
          <div className="w-full">
            <p className="mb-1 font-medium">Confirm Password</p>
            <div className="relative">
              <input
                className="border dark:border-gray-800 dark:bg-zinc-900 dark:text-white rounded-lg w-full p-2.5 pr-10 focus:ring-2 focus:ring-[#5f6FFF] outline-none transition-all"
                type={showConfirmPassword ? "text" : "password"}
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                required
                disabled={isLoading}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>
        )}

        {/* Terms & Conditions Checkbox (Sign Up only) */}
        {state === "Sign Up" && (
          <div className="w-full flex items-start gap-2">
            <input
              type="checkbox"
              id="terms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              disabled={isLoading}
              className="mt-1 w-4 h-4 text-[#5f6FFF] bg-gray-100 dark:bg-zinc-900 border-gray-300 dark:border-gray-700 rounded focus:ring-[#5f6FFF] focus:ring-2 cursor-pointer"
            />
            <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
              I agree to the{" "}
              <a 
                href="/terms" 
                target="_blank" 
                className="text-[#5f6FFF] hover:underline font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                Terms & Conditions
              </a>
              {" "}and{" "}
              <a 
                href="/privacy" 
                target="_blank" 
                className="text-[#5f6FFF] hover:underline font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                Privacy Policy
              </a>
            </label>
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          className="bg-[#5f6FFF] text-white w-full py-3 rounded-lg text-base font-semibold hover:bg-[#4f5fef] hover:scale-[1.02] active:scale-95 transition-all disabled:bg-gray-400 dark:disabled:bg-gray-700 disabled:cursor-not-allowed mt-2 shadow-lg shadow-blue-100 dark:shadow-none"
          disabled={isLoading}
        >
          {isLoading
            ? "Authenticating..."
            : state === "Sign Up"
            ? "Create Account"
            : "Sign In"}
        </button>

        {/* Divider */}
        <div className="w-full flex items-center gap-3 my-2">
          <div className="flex-1 h-px bg-zinc-200 dark:bg-gray-800"></div>
          <p className="text-zinc-400 dark:text-gray-500 text-[10px] font-bold tracking-widest uppercase">OR CONTINUE WITH</p>
          <div className="flex-1 h-px bg-zinc-200 dark:bg-gray-800"></div>
        </div>

        {/* SSO Buttons Container */}
        <div className="w-full flex flex-col gap-3">
          {/* Google Sign-In */}
          <div className="w-full flex justify-center">
            <div className="w-full h-11 relative flex items-center justify-center">
              <span className="w-full text-gray-600 dark:text-gray-300">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="outline"
                  size="large"
                  shape="pill"
                  text={state === "Sign Up" ? "signup_with" : "signin_with"}
                  width="100%"
                  logo_alignment=""
                  useOneTap={false}
                />
              </span>
            </div>
          </div>

          {/* Apple Sign-In - Styled to match Google button's height ~40px-44px */}
          <button
            type="button"
            onClick={async () => {
              try {
                if (window.AppleID) {
                  const response = await window.AppleID.auth.signIn();
                  handleAppleSuccess(response);
                } else {
                  toast.error("Apple Sign-In is not available");
                }
              } catch (error) {
                handleAppleError(error);
              }
            }}
            disabled={isLoading}
            className="w-full h-[4px] flex items-center justify-center gap-2.5 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-gray-700 rounded-full hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm text-sm"
          >
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            <span className="text-gray-600 dark:text-gray-300">
              {state === "Sign Up" ? "Sign up with Apple" : "Sign in with Apple"}
            </span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default Login;
