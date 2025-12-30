import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

const Icons = {
  Bot: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" /></svg>
  ),
  Check: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="20 6 9 17 4 12" /></svg>
  ),
  Sparkles: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /><path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" /></svg>
  ),
  HeartPulse: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" /></svg>
  ),
  Zap: ({ size = 24, ...props }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
  ),
};

const MedicalAdvisorCard = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-12 my-20">
      <div className="flex flex-col items-center justify-center text-center px-4 space-y-4">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
          Health Answers, <span className="text-[#5f6FFF]">Instantly</span>
        </h2>
        <p className="max-w-xl text-sm sm:text-base text-gray-500 dark:text-gray-400">
          LifeSync's AI Medical Advisor delivers reliable health insights 24/7. Get clear, evidence-based answers to your medical questions.
        </p>
      </div>

      <div className="relative flex flex-col md:flex-row bg-[#5f6FFF] dark:bg-[#1e1e2d] rounded-[2.5rem] p-8 md:p-12 lg:p-16 text-white overflow-hidden shadow-2xl transition-all duration-500 group border border-white/10">
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-white/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-white/20 transition-all duration-700"></div>
        
        {/* Left Content */}
        <div className="flex-1 relative z-10 space-y-8">
          <div className="flex items-center gap-3">
             <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                <Icons.Bot size={32} className="text-blue-100" />
             </div>
             <div>
                <h3 className="text-2xl font-bold">Health Advisor</h3>
                <p className="text-blue-100/60 text-sm font-medium">AI-Powered Assessment</p>
             </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
             {[
               "Preliminary assessments",
               "Condition identification",
               "Triage recommendations",
               "Health history tracking"
             ].map((feature, i) => (
               <div key={i} className="flex items-center gap-4 group/item">
                  <div className="w-6 h-6 rounded-full bg-blue-400/20 border border-blue-300/30 flex items-center justify-center group-hover/item:bg-blue-400 transition-colors">
                     <Icons.Check size={14} className="text-white" />
                  </div>
                  <p className="text-blue-50/90 text-sm md:text-base font-medium">{feature}</p>
               </div>
             ))}
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center gap-6">
            <button
              onClick={() => navigate("/medical-advisor")}
              className="group flex items-center justify-center gap-3 bg-white text-black px-10 py-5 rounded-2xl font-bold transition-all hover:bg-gray-100 hover:shadow-xl active:scale-95 w-full sm:w-auto overflow-hidden"
            >
              Ask LifeSync AI
              <Icons.Sparkles size={18} className="text-[#5f6FFF] transition-transform group-hover:scale-125" />
            </button>
            <p className="text-[10px] uppercase font-bold tracking-widest text-blue-100/40 max-w-[200px] text-center sm:text-left leading-relaxed">
              * Non-substitute for professional medical advice.
            </p>
          </div>
        </div>

        {/* Right Content - Visual */}
        <div className="hidden md:flex flex-1 items-center justify-center relative z-10 bg-white/5 border border-white/10 backdrop-blur-md rounded-[2rem] p-12 ml-12">
            <div className="relative">
               <div className="absolute inset-0 bg-blue-400 rounded-full blur-[60px] opacity-20 animate-pulse"></div>
               <Icons.HeartPulse size={120} strokeWidth={1} className="text-white relative z-10 drop-shadow-2xl animate-float" />
               <div className="absolute -top-4 -right-4 p-4 rounded-full bg-[#5f6FFF] border-4 border-[#1e1e2d] shadow-xl">
                  <Icons.Zap size={24} className="text-white" />
               </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalAdvisorCard;
