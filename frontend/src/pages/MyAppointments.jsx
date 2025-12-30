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

  // Determine whether a 'pending' appointment should show as Pending... in the UI.
  // Do not show Pending for appointments that are completed/booked/rejected/cancelled
  const isPending = (item) => {
    if (!item) return false;
    if (item.cancelled) return false;
    if (item.isCompleted) return false; // legacy flag
    if (item.status && (item.status === 'booked' || item.status === 'rejected' || item.status === 'cancelled')) return false;
    return item.status === 'pending';
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
    <div className="transition-all duration-300">
      <p className="pb-3 mt-12 font-medium text-zinc-700 dark:text-zinc-300 border-b dark:border-gray-800">
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
                  className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b dark:border-gray-800"
                  key={index}
                >
                  <div>
                    <div className="w-32 h-32 bg-gray-200 dark:bg-zinc-950 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 dark:text-gray-500 text-xs">No Image</span>
                    </div>
                  </div>

                  <div className="flex-1 text-sm text-zinc-600 dark:text-zinc-400">
                    <p className="text-neutral-800 dark:text-neutral-100 font-semibold text-base">
                      Provider Unavailable
                    </p>
                    <p className="text-xs mt-1">
                      <span className="text-sm text-neutral-700 dark:text-neutral-300 font-medium">
                        Date & Time:
                      </span>{" "}
                      {slotDateFormat(item.slotDate)} | {item.slotTime}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 justify-end">
                    {item.cancelled ? (
                      <button className="sm:min-w-48 py-2 border border-red-500 text-red-500 rounded">
                        Appointment Cancelled
                      </button>
                    ) : item.isCompleted ? (
                      <button className="sm:min-w-48 py-2 border border-green-500 rounded text-green-500">
                        Booked
                      </button>
                    ) : (
                      <button
                        onClick={() => cancelAppointment(item._id)}
                        className="text-sm text-stone-500 dark:text-stone-400 text-center sm:min-w-48 py-2 border dark:border-gray-700 rounded hover:bg-red-600 hover:text-white transition-all duration-300"
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
                className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-zinc-950/30 transition-colors"
                key={index}
              >
                <div>
                  <img
                    className="w-32 bg-indigo-50 dark:bg-zinc-950 rounded-lg"
                    src={providerData.image}
                    alt={providerData.name || "Provider"}
                    onError={(e) => {
                      e.target.src =
                        'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128"><rect width="128" height="128" fill="%23e5e7eb"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999" font-size="14">No Image</text></svg>';
                    }}
                  />
                </div>

                <div className="flex-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {/* Provider Name with Badge */}
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-neutral-800 dark:text-neutral-100 font-semibold text-base">
                      {providerData.name || "Unknown Provider"}
                    </p>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        providerType === "doctor"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                          : "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                      }`}
                    >
                      {providerType === "doctor" ? "👨‍⚕️ Doctor" : "🏥 Hospital"}
                    </span>
                  </div>

                  <p className="text-indigo-600 dark:text-indigo-400 font-medium">{providerData.speciality || "Speciality not specified"}</p>

                  <p className="text-zinc-700 dark:text-zinc-300 font-medium mt-2">Address:</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {providerData.address?.line1 || "No address available"}
                    {providerData.address?.line2 ? `, ${providerData.address.line2}` : ""}
                  </p>

                  <p className="text-xs mt-3 flex items-center gap-1">
                    <span className="text-sm text-neutral-700 dark:text-neutral-300 font-medium tracking-wide">
                      Date & Time:
                    </span>{" "}
                    <span className="text-gray-500 dark:text-gray-400">{slotDateFormat(item.slotDate)} | {item.slotTime}</span>
                  </p>
                </div>

                <div className="flex flex-col gap-2 justify-end">
                  {/* Pending for any unaccepted appointment */}
                  {isPending(item) && (
                    <button className="sm:min-w-48 py-2 border dark:border-yellow-900/50 rounded text-stone-500 dark:text-yellow-500 bg-yellow-50 dark:bg-yellow-900/10 font-medium">
                      Pending Approval
                    </button>
                  )}

                  {/* Cancel Button */}
                  {!item.cancelled && !item.isCompleted && (
                    <button
                      onClick={() => cancelAppointment(item._id)}
                      className="text-sm text-stone-500 dark:text-stone-400 text-center sm:min-w-48 py-2 border dark:border-gray-700 rounded hover:bg-red-600 hover:text-white dark:hover:bg-red-700 transition-all duration-300"
                    >
                      Cancel Appointment
                    </button>
                  )}

                  {/* Cancelled / Rejected Status */}
                  {item.cancelled && !item.isCompleted && (
                    item.status === 'rejected' ? (
                      <button className="sm:min-w-48 py-2 border border-red-500 text-red-500 rounded font-medium">
                        Appointment Rejected
                      </button>
                    ) : (
                      <button className="sm:min-w-48 py-2 border border-red-500 text-red-500 rounded font-medium">
                        Appointment Cancelled
                      </button>
                    )
                  )}

                  {/* Booked Status */}
                  {(item.status === 'booked' || item.isCompleted) && (
                    <button className="sm:min-w-48 py-2 border border-green-500 rounded text-green-500 font-medium bg-green-50/50 dark:bg-green-900/10">
                      Payment Confirmed
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-600 transition-all">
             <div className="w-20 h-20 bg-gray-100 dark:bg-zinc-950 rounded-full flex items-center justify-center mb-4">
               <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
             </div>
            <p className="text-xl font-medium mb-1">No appointments yet</p>
            <p className="text-sm">Your scheduled visits will appear here</p>
            <button
              onClick={() => navigate("/doctors")}
              className="mt-6 px-10 py-3 bg-[#5f6FFF] text-white rounded-full hover:bg-[#4f5fef] hover:scale-105 transition-all shadow-lg shadow-blue-100 dark:shadow-none font-medium"
            >
              Start Booking
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAppointments;
