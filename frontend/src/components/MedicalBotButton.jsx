import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const MedicalBotButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useContext(AppContext);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  // Don't show the button on the medical advisor page itself or login page
  if (
    location.pathname === "/medical-advisor" ||
    location.pathname === "/login"
  ) {
    return null;
  }

  // Show welcome message on first visit
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("medicalBotWelcomeSeen");
    if (!hasSeenWelcome) {
      const timer = setTimeout(() => {
        setShowWelcome(true);
        // Auto-hide after 5 seconds
        setTimeout(() => {
          setShowWelcome(false);
          localStorage.setItem("medicalBotWelcomeSeen", "true");
        }, 5000);
      }, 2000); // Show after 2 seconds on page load

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClick = () => {
    setShowWelcome(false);
    if (!token) {
      // If not logged in, redirect to login with a message
      navigate("/login");
    } else {
      navigate("/medical-advisor");
    }
  };

  const handleCloseWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem("medicalBotWelcomeSeen", "true");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Welcome Popup */}
      {showWelcome && (
        <div className="absolute bottom-20 right-0 w-64 bg-white dark:bg-[#121212] rounded-xl shadow-2xl p-4 mb-2 animate-bounce-in border border-gray-100 dark:border-gray-800">
          <button
            onClick={handleCloseWelcome}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">🤖</span>
              </div>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-1">
                Hi! I'm LifeSync your Health Bot
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Need a quick health check? I can help assess your symptoms!
              </p>
              <button
                onClick={handleClick}
                className="mt-3 w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition"
              >
                Get Started →
              </button>
            </div>
          </div>
          {/* Arrow pointing to button */}
          <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white dark:bg-[#121212] transform rotate-45 border-r border-b border-gray-100 dark:border-gray-800"></div>
        </div>
      )}

      {/* Tooltip */}
      {showTooltip && !showWelcome && (
        <div className="absolute bottom-full right-0 mb-2 px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm rounded-lg shadow-lg whitespace-nowrap animate-fade-in font-medium">
          🩺 AI Medical Advisor
          <div className="absolute top-full right-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="group relative flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 active:scale-95 animate-float"
        aria-label="Open AI Medical Advisor"
        style={{ animationDelay: "1s" }}
      >
        {/* Pulse Animation Ring */}
        <span className="absolute inset-0 rounded-full bg-blue-400 opacity-75 animate-ping"></span>

        {/* Bot Icon */}
        <div className="relative z-10">
          <svg
            className="w-8 h-8 text-white transition-transform group-hover:scale-110"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Robot Head */}
            <rect x="6" y="8" width="12" height="10" rx="2" strokeWidth="2" />
            {/* Antenna */}
            <line x1="12" y1="4" x2="12" y2="8" strokeWidth="2" />
            <circle cx="12" cy="3" r="1.5" fill="currentColor" />
            {/* Eyes */}
            <circle
              cx="9.5"
              cy="12"
              r="1.5"
              fill="currentColor"
              className="animate-pulse"
            />
            <circle
              cx="14.5"
              cy="12"
              r="1.5"
              fill="currentColor"
              className="animate-pulse"
              style={{ animationDelay: "0.2s" }}
            />
            {/* Smile */}
            <path d="M9 15 Q12 17 15 15" strokeWidth="1.5" />
            {/* Body */}
            <rect x="8" y="18" width="8" height="3" rx="1" strokeWidth="2" />
            {/* Left Arm */}
            <line x1="6" y1="12" x2="4" y2="14" strokeWidth="2" />
            <circle cx="4" cy="14" r="1" fill="currentColor" />
            {/* Right Arm */}
            <line x1="18" y1="12" x2="20" y2="14" strokeWidth="2" />
            <circle cx="20" cy="14" r="1" fill="currentColor" />
          </svg>
        </div>

        {/* Medical Cross Badge */}
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg z-10 animate-pulse">
          <svg
            className="w-3.5 h-3.5 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 3.5a.5.5 0 01.5.5v2h2a.5.5 0 010 1h-2v2a.5.5 0 01-1 0v-2h-2a.5.5 0 010-1h2v-2a.5.5 0 01.5-.5z" />
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-1a7 7 0 100-14 7 7 0 000 14z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </button>

      {/* Optional: Online Indicator Dot */}
      <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
    </div>
  );
};

export default MedicalBotButton;
