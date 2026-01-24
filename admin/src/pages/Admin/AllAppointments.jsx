import React from "react";
import { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const AllAppointments = () => {
  const { aToken, appointments, getAllAppointments, cancelAppointment } =
    useContext(AdminContext);
  const { calculateAge, slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  return (
    <div className="w-full max-w-6xl m-5 transition-all duration-300">
      <p className="mb-3 text-lg font-medium text-gray-800 dark:text-gray-100">All Appointments</p>

      <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll no-scrollbar">
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr] grid-flow-col py-4 px-6 border-b dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 font-bold text-gray-700 dark:text-gray-200">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Provider</p>
          <p>Action</p>
        </div>

        {appointments.map((item, index) => {
          const providerData =
            item.providerType === "hospital" ? item.hospitalData : item.docData;

          const providerType = item.providerType || "doctor";

          if (!item.userData) {
            return (
              <div
                className="flex items-center justify-center py-6 px-6 border-b dark:border-zinc-800 text-gray-400"
                key={index}
              >
                <p>Patient data unavailable</p>
              </div>
            );
          }

          return (
            <div
              className="flex flex-col gap-3 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr] items-start sm:items-center text-gray-600 dark:text-gray-300 py-4 px-6 border-b dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors"
              key={index}
            >
              <p className="hidden sm:block text-gray-500 dark:text-gray-400">{index + 1}</p>

              {/* Patient Info */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="flex items-center gap-2">
                  <img
                    className="w-8 rounded-full border dark:border-zinc-800"
                    src={item.userData.image || assets.profile_pic}
                    alt={item.userData.name || "Patient"}
                    onError={(e) => (e.target.src = assets.profile_pic)}
                  />
                  <p className="font-medium text-gray-800 dark:text-gray-100">{item.userData.name || "Unknown Patient"}</p>
                </div>
                <div className="sm:hidden text-xs text-gray-500">
                  <span className="mr-2">#{index + 1}</span>
                  <span>Age: {calculateAge(item.userData.dob) || "N/A"}</span>
                </div>
              </div>

              {/* Age */}
              <p className="hidden sm:block">
                {calculateAge(item.userData.dob) || "N/A"}
              </p>

              {/* Date & Time */}
              <p>
                {slotDateFormat(item.slotDate)}, {item.slotTime}
              </p>

              {/* Provider Info (Doctor or Hospital) */}
              <div className="flex items-center gap-2">
                <img
                  className="w-8 h-8 rounded-full bg-gray-200 dark:bg-zinc-800 border dark:border-zinc-700"
                  src={providerData?.image || assets.profile_pic}
                  alt={providerData?.name || "Provider"}
                  onError={(e) => (e.target.src = assets.profile_pic)}
                />
                <div className="flex flex-col">
                  <p className="font-medium text-gray-800 dark:text-gray-100">
                    {providerData?.name || "Unknown Provider"}
                  </p>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full w-fit ${
                      providerType === "hospital"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    }`}
                  >
                    {providerType === "hospital" ? "HOSPITAL" : "DOCTOR"}
                  </span>
                </div>
              </div>

              {/* Action */}
              <div className="flex items-center">
              {item.cancelled ? (
                <p className="text-red-400 text-xs font-medium bg-red-50 dark:bg-red-900/10 px-2 py-1 rounded">Cancelled</p>
              ) : item.isCompleted ? (
                <p className="text-green-500 text-xs font-medium bg-green-50 dark:bg-green-900/10 px-2 py-1 rounded">Booked</p>
              ) : (
                <img
                  onClick={() => cancelAppointment(item._id)}
                  className="w-8 cursor-pointer hover:scale-110 transition-transform grayscale hover:grayscale-0"
                  src={assets.cancel_icon}
                  alt="Cancel"
                />
              )}
              </div>
            </div>
          );
        })}

        {/* Empty State */}
        {appointments.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-500">
             <img className="w-20 opacity-20 mb-4" src={assets.appointment_icon} alt="" />
            <p className="text-lg">No appointments found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllAppointments;
