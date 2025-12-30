import { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import RelatedHospitals from "../components/RelatedHospitals";

const Appointments = () => {
  // Get the ID from params - it could be either doctor or hospital
  const { id } = useParams();
  const {
    doctors,
    hospitals,
    currencySymbol,
    backendUrl,
    token,
    getDoctorsData,
    getHospitalsData,
  } = useContext(AppContext);
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const navigate = useNavigate();

  // Single state for provider info (doctor or hospital)
  const [providerInfo, setProviderInfo] = useState(null);
  const [providerType, setProviderType] = useState(null); // 'doctor' or 'hospital'
  const [slots, setSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  // Fetch provider info (doctor or hospital)
  const fetchProviderInfo = useCallback(() => {
    if (!id) return;

    // First check if it's a doctor
    const doctor = doctors.find((doc) => doc._id === id);
    if (doctor) {
      setProviderInfo(doctor);
      setProviderType("doctor");
      return;
    }

    // Then check if it's a hospital
    const hospital = hospitals.find((hosp) => hosp._id === id);
    if (hospital) {
      setProviderInfo(hospital);
      setProviderType("hospital");
      return;
    }

    // If neither found, provider might not be loaded yet
    setProviderInfo(null);
    setProviderType(null);
  }, [doctors, hospitals, id]);

  const getAvailableSlots = useCallback(() => {
    if (!providerInfo || !providerInfo.slots_booked) {
      console.warn("Provider info not ready yet or missing slots_booked");
      return;
    }

    setSlots([]);

    let today = new Date();

    for (let i = 0; i < 7; i++) {
      // Get date with index
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      // Set end time of the date with index
      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0); // 9 PM

      // Set hours
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10
        );
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10); // 10 AM
        currentDate.setMinutes(0);
      }

      let timeSlots = [];

  while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();

        const slotDate = day + "_" + month + "_" + year;
        const slotTime = formattedTime;

        // Check if slot is available
        const isSlotBooked =
          providerInfo.slots_booked[slotDate]?.includes(slotTime) || false;
        const isSlotAvailable = !isSlotBooked;

        if (isSlotAvailable) {
          // Add slot to array
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime,
          });
        }

        // Increment by 30 mins
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      setSlots((prev) => [...prev, timeSlots]);
    }
  }, [providerInfo]);

  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Login to book an appointment");
      return navigate("/login");
    }

    if (!slotTime) {
      toast.warn("Please select a time slot");
      return;
    }

    try {
      const date = slots[slotIndex][0].datetime;

      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      const slotDate = day + "_" + month + "_" + year;

      // Send data matching backend expectations
      const appointmentData = {
        providerId: providerInfo._id,
        providerType: providerType, // 'doctor' or 'hospital'
        slotDate,
        slotTime,
      };

      if (!token) {
        toast.warn("Login to book an appointment");
        return navigate("/login");
      }

      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        appointmentData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);

        // Refresh data based on provider type
        if (providerType === "doctor") {
          getDoctorsData();
        } else {
          getHospitalsData();
        }

        // Notify other parts of the app (and other tabs) that appointments changed
        try {
          window.dispatchEvent(new Event('appointmentsUpdated'))
          localStorage.setItem('appointments_update_ts', Date.now().toString())
        } catch (e) {
          console.log('Notify error:', e.message)
        }

        navigate("/my-appointments");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Fetch provider info when doctors/hospitals data or id changes
  useEffect(() => {
    fetchProviderInfo();
  }, [fetchProviderInfo]);

  // Get available slots when provider info changes
  useEffect(() => {
    if (providerInfo) {
      getAvailableSlots();
    }
  }, [getAvailableSlots, providerInfo]);

  // Show loading state
  if (!providerInfo) {
    return (
      <div className="text-center py-10 text-gray-500 dark:text-gray-400">Loading details...</div>
    );
  }

  return (
    <div className="transition-all duration-300">
      {/*-------------Provider Info------------------*/}
      <div className="flex flex-col sm:flex-row gap-4">
        <div>
          <img
            className="bg-[#5f6FFF] w-full sm:max-w-72 rounded-lg"
            src={providerInfo.image}
            alt=""
          />
        </div>
        <div className="flex-1 border border-gray-400 dark:border-gray-700 rounded-lg p-8 py-7 bg-white dark:bg-black mx-2 sm:mx-0 mt-[-80px] sm:mt-0 shadow-sm">
          {/*--------Provider Info: name, degree/accreditation, experience----------------*/}
          <p className="flex items-center gap-2 text-2xl font-medium text-gray-900 dark:text-gray-100">
            {providerInfo.name}
            <img className="w-5 dark:brightness-200" src={assets.verified_icon} alt="" />
          </p>
          <div className="flex items-center gap-2 mt-1 text-sm text-gray-600 dark:text-gray-400">
            <p>
              {providerInfo.degree} - {providerInfo.speciality}
            </p>
            <button className="py-0.5 px-2 border dark:border-gray-600 text-xs rounded-full">
              {providerInfo.experience}
            </button>
          </div>

          {/* Provider Type Badge */}
          <div className="mt-3">
            {providerType === "doctor" && providerInfo.hospitalId ? (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                🏥 Institutional Doctor
              </span>
            ) : providerType === "doctor" ? (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300">
                👨‍⚕️ Private Doctor
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">
                🏥 Hospital
              </span>
            )}
          </div>

          {/*--------Provider About----------------*/}
          <div>
            <p className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-gray-200 mt-4">
              About <img className="dark:brightness-200" src={assets.info_icon} alt="" />
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[700px] mt-1">
              {providerInfo.about}
            </p>
          </div>
        </div>
      </div>

      {/*-------------Booking slots------------------*/}
      <div className="sm:ml-72 sm:pl-4 mt-8 pt-4 font-medium text-gray-700 dark:text-gray-300 border-t dark:border-gray-800 sm:border-t-0">
        <p className="text-lg">Booking slots</p>
        <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4 pb-2">
          {slots.length > 0 &&
            slots.map((item, index) => (
              <div
                onClick={() => setSlotIndex(index)}
                className={`text-center py-6 min-w-16 rounded-full cursor-pointer transition-all duration-200 ${
                  slotIndex === index
                    ? "bg-[#5f6FFF] text-white shadow-lg shadow-blue-200 dark:shadow-none"
                    : "border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
                key={index}
              >
                <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                <p>{item[0] && item[0].datetime.getDate()}</p>
              </div>
            ))}
        </div>

        <div className="flex items-center gap-3 w-full overflow-x-scroll mt-6 pb-2">
          {slots.length > 0 &&
            slots[slotIndex]?.map((item, index) => (
              <p
                onClick={() => setSlotTime(item.time)}
                className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer transition-all duration-200 ${
                  item.time === slotTime
                    ? "bg-[#5f6FFF] text-white shadow-md shadow-blue-200 dark:shadow-none"
                    : "text-gray-400 dark:text-gray-500 border border-gray-300 dark:border-gray-700 hover:border-[#5f6FFF] dark:hover:border-[#5f6FFF]"
                }`}
                key={index}
              >
                {item.time.toLowerCase()}
              </p>
            ))}
        </div>
        <button
          onClick={bookAppointment}
          className="bg-[#5f6FFF] text-white text-sm font-medium px-14 py-4 rounded-full my-8 cursor-pointer hover:bg-[#4f5fef] hover:scale-105 transition-all shadow-lg shadow-blue-100 dark:shadow-none"
        >
          Book an appointment
        </button>
      </div>

      {/*-------------Related Providers------------------*/}
      <div className="mt-10 pt-10 border-t dark:border-gray-800">
        {providerType === "doctor" ? (
          <RelatedDoctors docId={id} speciality={providerInfo.speciality} />
        ) : (
          <RelatedHospitals
            hospitalId={id}
            speciality={providerInfo.speciality}
          />
        )}
      </div>
    </div>
  );
};

export default Appointments;
