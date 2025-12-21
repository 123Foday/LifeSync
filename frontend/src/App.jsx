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
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MedicalBotButton from "./components/MedicalBotButton"; // ✅ NEW

const App = () => {
  return (
    <div className="mx-2 sm:mx-4 md:mx-6 lg:mx-[8%] xl:mx-[10%]">
      <ToastContainer />
      <Navbar />
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
      </Routes>
      <Footer />

      {/* ✅ NEW: Floating Medical Bot Button - Accessible from all pages */}
      <MedicalBotButton />
    </div>
  );
};

export default App;
