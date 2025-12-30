import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

const Login = () => {
  const { backendUrl, token, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  const [state, setState] = useState("Login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Regular email/password authentication
  const onSubmitHandler = async (event) => {
    event.preventDefault();
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

  // Redirect if already logged in
  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center transition-all duration-300">
      <div className="flex flex-col gap-4 w-full max-w-md mx-auto items-start p-8 border dark:border-gray-800 rounded-2xl text-zinc-600 dark:text-zinc-300 text-sm shadow-xl bg-white dark:bg-black backdrop-blur-sm">
        {/* Header */}
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </p>
        <p className="text-gray-500 dark:text-gray-400">
          Please {state === "Login" ? "login" : "sign up"} to book appointment
        </p>

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
          />
        </div>

        {/* Password field */}
        <div className="w-full">
          <p className="mb-1 font-medium">Password</p>
          <input
            className="border dark:border-gray-800 dark:bg-zinc-900 dark:text-white rounded-lg w-full p-2.5 focus:ring-2 focus:ring-[#5f6FFF] outline-none transition-all"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
            disabled={isLoading}
          />
        </div>

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
          <div className="w-full flex justify-center scale-[1.02]">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              shape="pill"
              text={state === "Sign Up" ? "signup_with" : "signin_with"}
              style={{ width: '100%' }}
              logo_alignment="left"
              useOneTap={false}
            />
          </div>
        </div>

        {/* Toggle between Login/Sign Up */}
        <div className="w-full text-center mt-2">
          {state === "Sign Up" ? (
            <p className="text-gray-500 dark:text-gray-400">
              Already have an account?{" "}
              <span
                onClick={() => !isLoading && setState("Login")}
                className="text-[#5f6FFF] font-semibold cursor-pointer hover:underline"
              >
                Login here
              </span>
            </p>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No account yet?{" "}
              <span
                onClick={() => !isLoading && setState("Sign Up")}
                className="text-[#5f6FFF] font-semibold cursor-pointer hover:underline"
              >
                Create Account
              </span>
            </p>
          )}
        </div>
      </div>
    </form>
  );
};

export default Login;
