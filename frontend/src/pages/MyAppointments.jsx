import { useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../context/AppContext";

const MyAppointments = () => {
  const { backendUrl, token, getDoctorsData, getHospitalsData } =
    useContext(AppContext);

  const [appointments, setAppointments] = useState([]);
  const months = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_");
    return (
      dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    );
  };

  const navigate = useNavigate();

  const getUserAppointments = useCallback(async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setAppointments(data.appointments.reverse());
        console.log(data.appointments);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }, [backendUrl, token]);

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/cancel-appointment",
        { appointmentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
        // Refresh both doctors and hospitals data
        getDoctorsData();
        getHospitalsData();
        // Notify other parts of the app (and other tabs) that appointments changed
        try {
          window.dispatchEvent(new Event('appointmentsUpdated'))
          localStorage.setItem('appointments_update_ts', Date.now().toString())
        } catch (e) {
          console.log('Notify error:', e.message)
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token, getUserAppointments]);

  // Listen for appointment updates dispatched elsewhere in the app (other contexts/tabs)
  useEffect(() => {
    const handleUpdate = () => {
      if (token) getUserAppointments();
    };

    const handleStorage = (e) => {
      if (e.key === 'appointments_update_ts') {
        if (token) getUserAppointments();
      }
    };

    window.addEventListener('appointmentsUpdated', handleUpdate);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('appointmentsUpdated', handleUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, [token, getUserAppointments]);

  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">
        My Appointments
      </p>

      <div>
        {appointments.length > 0 ? (
          appointments.map((item, index) => {
            // Determine if this is a doctor or hospital appointment
            const providerData =
              item.providerType === "hospital"
                ? item.hospitalData
                : item.docData;
            const providerType = item.providerType || "doctor"; // Default to doctor for old appointments

            // Safety check for provider data
            if (!providerData) {
              return (
                <div
                  className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b"
                  key={index}
                >
                  <div>
                    <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No Image</span>
                    </div>
                  </div>

                  <div className="flex-1 text-sm text-zinc-600">
                    <p className="text-neutral-800 font-semibold">
                      Provider Unavailable
                    </p>
                    <p className="text-xs mt-1">
                      <span className="text-sm text-neutral-700 font-medium">
                        Date & Time:
                      </span>{" "}
                      {slotDateFormat(item.slotDate)} | {item.slotTime}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 justify-end">
                    {item.cancelled ? (
                      <button className="sm:min-w-48 py-2 border border-red-500 text-red-500">
                        Appointment Cancelled
                      </button>
                    ) : item.isCompleted ? (
                      <button className="sm:min-w-48 py-2 border border-green-500 rounded text-green-500">
                        Booked
                      </button>
                    ) : (
                      <button
                        onClick={() => cancelAppointment(item._id)}
                        className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300"
                      >
                        Cancel appointment
                      </button>
                    )}
                  </div>
                </div>
              );
            }

            return (
              <div
                className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b"
                key={index}
              >
                <div>
                  <img
                    className="w-32 bg-indigo-50 rounded-lg"
                    src={providerData.image}
                    alt={providerData.name || "Provider"}
                    onError={(e) => {
                      e.target.src =
                        'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128"><rect width="128" height="128" fill="%23e5e7eb"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999" font-size="14">No Image</text></svg>';
                    }}
                  />
                </div>

                <div className="flex-1 text-sm text-zinc-600">
                  {/* Provider Name with Badge */}
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-neutral-800 font-semibold">
                      {providerData.name || "Unknown Provider"}
                    </p>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        providerType === "doctor"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {providerType === "doctor" ? "👨‍⚕️ Doctor" : "🏥 Hospital"}
                    </span>
                  </div>

                  <p>{providerData.speciality || "Speciality not specified"}</p>

                  <p className="text-zinc-700 font-medium mt-1">Address:</p>
                  <p className="text-xs">
                    {providerData.address?.line1 || "No address available"}
                  </p>
                  <p className="text-xs">{providerData.address?.line2 || ""}</p>

                  <p className="text-xs mt-1">
                    <span className="text-sm text-neutral-700 font-medium">
                      Date & Time:
                    </span>{" "}
                    {slotDateFormat(item.slotDate)} | {item.slotTime}
                  </p>
                </div>

                <div className="flex flex-col gap-2 justify-end">
                  {/* Paid Status */}
                  {!item.cancelled && item.payment && !item.isCompleted && (
                    <button className="sm:min-w-48 py-2 border rounded text-stone-500 bg-indigo-50">
                      Paid
                    </button>
                  )}

                  {/* Pay Online Button */}
                  {!item.cancelled && !item.payment && !item.isCompleted && (
                    <button className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-[#5f6FFF] hover:text-white transition-all duration-300">
                      Pay Online
                    </button>
                  )}

                  {/* Cancel Button */}
                  {!item.cancelled && !item.isCompleted && (
                    <button
                      onClick={() => cancelAppointment(item._id)}
                      className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300"
                    >
                      Cancel appointment
                    </button>
                  )}

                  {/* Cancelled Status */}
                  {item.cancelled && !item.isCompleted && (
                    <button className="sm:min-w-48 py-2 border border-red-500 text-red-500">
                      Appointment Cancelled
                    </button>
                  )}

                  {/* Booked Status */}
                  {item.isCompleted && (
                    <button className="sm:min-w-48 py-2 border border-green-500 rounded text-green-500">
                      Booked
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <p className="text-lg mb-2">No appointments yet</p>
            <p className="text-sm">Book an appointment to get started</p>
            <button
              onClick={() => navigate("/doctors")}
              className="mt-4 px-6 py-2 bg-[#5f6FFF] text-white rounded-full hover:bg-[#4f5fef] transition-all"
            >
              Find Doctors
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAppointments;
