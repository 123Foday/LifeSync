import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import Hospitals from "./pages/Hospitals";
import About from "./pages/About";
import Login from "./pages/Login";
import MyProfile from "./pages/MyProfile";
import MyAppointments from "./pages/MyAppointments";
import Appointments from "./pages/Appointments";
import HospitalDetail from "./pages/HospitalDetail";
import MedicalAdvisor from "./pages/MedicalAdvisor";
import ResetPassword from "./pages/ResetPassword";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import VerifyEmail from "./pages/VerifyEmail";
import Emergency from "./pages/Emergency";
import Layout from "./components/Layout";
import MedicalBotButton from "./components/MedicalBotButton";
import ScrollToTop from "./components/ScrollToTop";

const App = () => {
  return (
    <>
      <ScrollToTop />
      <Layout>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:speciality" element={<Doctors />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/my-appointments" element={<MyAppointments />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/appointment/:id" element={<Appointments />} />
        <Route path="/hospitals" element={<Hospitals />} />
        <Route path="/hospitals/:speciality" element={<Hospitals />} />
        <Route path="/hospital/:hospitalId" element={<HospitalDetail />} />
        <Route path="/medical-advisor" element={<MedicalAdvisor />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsAndConditions />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/emergency" element={<Emergency />} />
      </Routes>
    </Layout>
    
    {/* ✅ NEW: Floating Medical Bot Button - Accessible from all pages */}
    <MedicalBotButton />
    </>
  );
};


export default App;
