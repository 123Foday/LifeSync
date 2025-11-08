import React from "react";
import { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const AllAppointments = () => {
  const { aToken, appointments, getAllAppointments, cancelAppointment } =
    useContext(AdminContext);
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">All Appointments</p>

      <div className="bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll">
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Provider</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {appointments.map((item, index) => {
          // Safely get provider data (doctor or hospital)
          const providerData =
            item.providerType === "hospital" ? item.hospitalData : item.docData;

          const providerType = item.providerType || "doctor";

          // Safety check for userData
          if (!item.userData) {
            return (
              <div
                className="flex items-center justify-center py-6 px-6 border-b text-gray-400"
                key={index}
              >
                <p>Patient data unavailable</p>
              </div>
            );
          }

          // Safety check for provider data
          if (!providerData) {
            return (
              <div
                className="flex flex-wrap justify-between max-sm:gap-2 sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50"
                key={index}
              >
                <p className="max-sm:hidden">{index + 1}</p>
                <div className="flex items-center gap-2">
                  <img
                    className="w-8 rounded-full"
                    src={item.userData.image || "/default-avatar.png"}
                    alt={item.userData.name || "Patient"}
                    onError={(e) => (e.target.src = "/default-avatar.png")}
                  />
                  <p>{item.userData.name || "Unknown Patient"}</p>
                </div>
                <p className="max-sm:hidden">
                  {calculateAge(item.userData.dob) || "N/A"}
                </p>
                <p>
                  {slotDateFormat(item.slotDate)}, {item.slotTime}
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xs text-gray-400">N/A</span>
                  </div>
                  <p className="text-gray-400">Provider Unavailable</p>
                </div>
                <p>
                  {currency}
                  {item.amount || 0}
                </p>
                {item.cancelled ? (
                  <p className="text-red-400 text-xs font-medium">Cancelled</p>
                ) : item.isCompleted ? (
                  <p className="text-green-500 text-xs font-medium">
                    Completed
                  </p>
                ) : (
                  <img
                    onClick={() => cancelAppointment(item._id)}
                    className="w-10 cursor-pointer"
                    src={assets.cancel_icon}
                    alt=""
                  />
                )}
              </div>
            );
          }

          return (
            <div
              className="flex flex-wrap justify-between max-sm:gap-2 sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50"
              key={index}
            >
              <p className="max-sm:hidden">{index + 1}</p>

              {/* Patient Info */}
              <div className="flex items-center gap-2">
                <img
                  className="w-8 rounded-full"
                  src={item.userData.image || "/default-avatar.png"}
                  alt={item.userData.name || "Patient"}
                  onError={(e) => (e.target.src = "/default-avatar.png")}
                />
                <p>{item.userData.name || "Unknown Patient"}</p>
              </div>

              {/* Age */}
              <p className="max-sm:hidden">
                {calculateAge(item.userData.dob) || "N/A"}
              </p>

              {/* Date & Time */}
              <p>
                {slotDateFormat(item.slotDate)}, {item.slotTime}
              </p>

              {/* Provider Info (Doctor or Hospital) */}
              <div className="flex items-center gap-2">
                <img
                  className="w-8 rounded-full bg-gray-200"
                  src={providerData.image || "/default-avatar.png"}
                  alt={providerData.name || "Provider"}
                  onError={(e) => (e.target.src = "/default-avatar.png")}
                />
                <div className="flex flex-col">
                  <p className="font-medium">
                    {providerData.name || "Unknown Provider"}
                  </p>
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full w-fit ${
                      providerType === "hospital"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {providerType === "hospital" ? "🏥 Hospital" : "👨‍⚕️ Doctor"}
                  </span>
                </div>
              </div>

              {/* Fees */}
              <p>
                {currency}
                {item.amount || 0}
              </p>

              {/* Action */}
              {item.cancelled ? (
                <p className="text-red-400 text-xs font-medium">Cancelled</p>
              ) : item.isCompleted ? (
                <p className="text-green-500 text-xs font-medium">Completed</p>
              ) : (
                <img
                  onClick={() => cancelAppointment(item._id)}
                  className="w-10 cursor-pointer"
                  src={assets.cancel_icon}
                  alt=""
                />
              )}
            </div>
          );
        })}

        {/* Empty State */}
        {appointments.length === 0 && (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <p>No appointments found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllAppointments;
