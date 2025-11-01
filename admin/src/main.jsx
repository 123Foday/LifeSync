import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import AdminContextProvider from "./context/AdminContext.jsx";
import DoctorContextProvider from "./context/DoctorContext.jsx";
import HospitalContextProvider from "./context/HospitalContext.jsx";
import AppContextProvider from "./context/AppContext.jsx";


createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AdminContextProvider>
      <HospitalContextProvider>
        <DoctorContextProvider>
          <AppContextProvider>
            <App />
          </AppContextProvider>
        </DoctorContextProvider>
      </HospitalContextProvider>
    </AdminContextProvider>
  </BrowserRouter>
);
