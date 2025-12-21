import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

const MedicalAdvisorCard = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex flex-col items-center justify-center text-center px-4 sm:px-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium">
          Health Answers, When You Need Them Most
        </h1>
        <p className="w-full sm:w-2/3 md:w-1/2 lg:w-1/3 text-xs sm:text-sm mt-2 sm:mt-3">
          LifeSync&apos;s AI Medical Advisor delivers instant, reliable health insights.
          Get clear answers to your health questions, whenever you need them.
        </p>
      </div>
      <div className="mb-6 sm:mb-8 md:mb-10"></div>
      <div className="container relative flex flex-col md:flex-row bg-[#5f6FFF] rounded-lg px-4 sm:px-6 md:px-8 lg:px-10 mt-4 sm:mt-6 mb-6 sm:mb-8 text-white overflow-hidden">
        {/* Left - content */}
        <div className="flex-1 py-6 sm:py-8 md:py-10 relative z-10">
          <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold">
            <p>🏥 Health Advisor</p>
            <p className="mt-2 text-xs sm:text-sm md:text-base text-blue-100">
              AI-Powered Medical Assessment
            </p>
          </div>
          {/* Mobile icon - visible on small screens */}
          <div className="absolute right-4 top-4 sm:right-6 sm:top-6 md:hidden bg-green-300 backdrop-blur-sm rounded-full p-3 sm:p-4 flex items-center justify-center h-16 w-16 sm:h-20 sm:w-20">
            <span className="text-3xl sm:text-4xl">🩺</span>
          </div>
          <div className="space-y-2 sm:space-y-3 mt-4 sm:mt-6 pr-16 sm:pr-20 md:pr-0">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <span className="text-xl sm:text-2xl text-green-300 flex-shrink-0">✓</span>
              <p className="text-white/90 text-xs sm:text-sm md:text-base">
                Get preliminary health assessments
              </p>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <span className="text-xl sm:text-2xl text-green-300 flex-shrink-0">✓</span>
              <p className="text-white/90 text-xs sm:text-sm md:text-base">Identify possible conditions</p>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <span className="text-xl sm:text-2xl text-green-300 flex-shrink-0">✓</span>
              <p className="text-white/90 text-xs sm:text-sm md:text-base">Know when to see a doctor</p>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <span className="text-xl sm:text-2xl text-green-300 flex-shrink-0">✓</span>
              <p className="text-white/90 text-xs sm:text-sm md:text-base">Track your health history</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/medical-advisor")}
            className="flex items-center gap-2 bg-white text-xs sm:text-sm md:text-base text-gray-600 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full mt-4 sm:mt-6 hover:scale-105 transition-all md:hidden w-full sm:w-auto justify-center"
          >
            Ask LifeSync
            <img className="w-3" src={assets.arrow_icon} alt="" />
          </button>

          <p className="text-[10px] sm:text-xs text-red-100 mt-4 sm:mt-6 text-center md:text-left">
            * For informational purposes only. Not a substitute for professional
            medical advice.
          </p>
        </div>

        {/* Icon - center-right (absolute) */}
        <div className="hidden md:block md:w-1/2 lg:w-2/5 relative">
          <div className="absolute right-4 md:right-6 lg:right-8 top-1/2 transform -translate-y-1/2 flex flex-col items-center justify-center">
            <p className="text-xs md:text-sm lg:text-base text-blue-100 mb-2 text-center max-w-[200px]">
              Hey Dear, I&apos;m LifeSync your Health Advisor!
            </p>
            <span
              className="absolute w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full bg-blue-400 opacity-60 animate-ping"
              aria-hidden="true"
            />

            <button
              onClick={() => navigate("/medical-advisor")}
              aria-label="Open Medical Advisor"
              className="relative z-10 bg-white/20 backdrop-blur-sm rounded-full p-2 md:p-3 w-24 h-24 md:w-28 md:h-28 lg:w-36 lg:h-36 flex items-center justify-center hover:scale-105 transition-transform"
            >
              <svg
                className="w-12 h-12 md:w-16 md:h-16 lg:w-24 lg:h-24 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Robot Head */}
                <rect
                  x="6"
                  y="8"
                  width="12"
                  height="10"
                  rx="2"
                  strokeWidth="2"
                />
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
                <rect
                  x="8"
                  y="18"
                  width="8"
                  height="3"
                  rx="1"
                  strokeWidth="2"
                />
                {/* Left Arm */}
                <line x1="6" y1="12" x2="4" y2="14" strokeWidth="2" />
                <circle cx="4" cy="14" r="1" fill="currentColor" />
                {/* Right Arm */}
                <line x1="18" y1="12" x2="20" y2="14" strokeWidth="2" />
                <circle cx="20" cy="14" r="1" fill="currentColor" />
              </svg>
            </button>

            <button
              onClick={() => navigate("/medical-advisor")}
              className="mt-4 md:mt-5 flex items-center gap-2 bg-white text-xs md:text-sm lg:text-base text-gray-600 px-6 md:px-8 py-2.5 md:py-3 rounded-full hover:scale-105 transition-all"
            >
              Ask LifeSync
              <img className="w-3" src={assets.arrow_icon} alt="" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MedicalAdvisorCard;
