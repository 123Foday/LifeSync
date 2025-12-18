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
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">
        {/* Header */}
        <p className="text-2xl font-semibold">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </p>
        <p>
          Please {state === "Login" ? "login" : "sign up"} to book appointment
        </p>

        {/* Name field (Sign Up only) */}
        {state === "Sign Up" && (
          <div className="w-full">
            <p>Full Name</p>
            <input
              className="border border-zinc-300 rounded w-full p-2 mt-1"
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
          <p>Email</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
            disabled={isLoading}
          />
        </div>

        {/* Password field */}
        <div className="w-full">
          <p>Password</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
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
          className="bg-[#5f6FFF] text-white w-full py-2 rounded-md text-base hover:bg-[#4f5fef] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading
            ? "Please wait..."
            : state === "Sign Up"
            ? "Create Account"
            : "Login"}
        </button>

        {/* Divider */}
        <div className="w-full flex items-center gap-2 my-1">
          <div className="flex-1 h-px bg-zinc-300"></div>
          <p className="text-zinc-500 text-xs">OR CONTINUE WITH</p>
          <div className="flex-1 h-px bg-zinc-300"></div>
        </div>

        {/* SSO Buttons Container */}
        <div className="w-full flex flex-col gap-3">
          {/* Google Sign-In */}
          <div className="w-full flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              text={state === "Sign Up" ? "signup_with" : "signin_with"}
              width="340"
              logo_alignment="left"
              useOneTap={false}
            />
          </div>

          {/* Microsoft Sign-In Button (Placeholder) */}
          {/* Uncomment when Microsoft SSO is ready
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 border border-zinc-300 rounded py-2 hover:bg-gray-50 transition-colors"
            disabled={isLoading}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
              alt="Microsoft"
              className="w-5 h-5"
            />
            <span>Continue with Microsoft</span>
          </button>
          */}

          {/* Apple Sign-In Button (Placeholder) */}
          {/* Uncomment when Apple SSO is ready
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 bg-black text-white rounded py-2 hover:bg-gray-900 transition-colors"
            disabled={isLoading}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
              alt="Apple"
              className="w-5 h-5"
            />
            <span>Continue with Apple</span>
          </button>
          */}
        </div>

        {/* Toggle between Login/Sign Up */}
        {state === "Sign Up" ? (
          <p>
            Already have an account?{" "}
            <span
              onClick={() => !isLoading && setState("Login")}
              className="text-[#5f6FFF] underline cursor-pointer hover:text-[#4f5fef]"
            >
              Login here
            </span>
          </p>
        ) : (
          <p>
            Create a new account?{" "}
            <span
              onClick={() => !isLoading && setState("Sign Up")}
              className="text-[#5f6FFF] underline cursor-pointer hover:text-[#4f5fef]"
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
