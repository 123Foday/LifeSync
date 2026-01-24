import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { HospitalContext } from "../../context/HospitalContext";
import { AppContext } from "../../context/AppContext";

const HospitalProfile = () => {
  const { hToken, profileData, setProfileData, getProfileData, backendUrl } =
    useContext(HospitalContext);
  const { currency } = useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);

  const updateProfile = async () => {
    try {
      const updateData = {
        address: profileData.address,
        available: profileData.available,
      };

      const { data } = await axios.post(
        backendUrl + "/api/hospital/update-profile",
        updateData,
        { headers: { Authorization: `Bearer ${hToken}` } }
      );

      if (data.success) {
        toast.success(data.message);
        setIsEdit(false);
        getProfileData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  useEffect(() => {
    if (hToken) {
      getProfileData();
    }
  }, [hToken]);

  return (
    profileData && (
      <div>
      <div className="transition-all duration-300">
        <div className="flex flex-col gap-4 m-5">
          <div>
            <img
              className="bg-primary/80 dark:bg-primary/20 w-full sm:max-w-64 rounded-lg shadow-lg"
              src={profileData.image}
              alt=""
            />
          </div>

          <div
            className="flex-1 border border-stone-100 dark:border-zinc-800 rounded-lg p-8 py-7 bg-white dark:bg-zinc-900 shadow-sm transition-all duration-300"
          >
            {/*----------Hospital Info: name, degree, experience */}

            <p className="flex items-center gap-2 text-3xl font-medium text-gray-700 dark:text-gray-100">
              {profileData.name}
            </p>
            <div className="flex items-center gap-2 mt-1 text-gray-600 dark:text-gray-400">
              <p>
                {profileData.degree} - {profileData.speciality}
              </p>
              <button className="py-0.5 px-2 border dark:border-zinc-700 text-xs rounded-full">
                {profileData.experience}
              </button>
            </div>

            {/*--------Hospital About ------------ */}
            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-neutral-800 dark:text-gray-200 mt-3">
                About:
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 max-w-[700px] mt-1">
                {profileData.about}
              </p>
            </div>


            <div className="flex gap-2 py-2 text-gray-700 dark:text-gray-300">
              <p className="font-medium">Address:</p>
              <p className="text-sm">
                {isEdit ? (
                  <input
                    className="bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded px-2 py-1 outline-none focus:border-primary transition-all"
                    type="text"
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line1: e.target.value },
                      }))
                    }
                    value={profileData.address.line1}
                  />
                ) : (
                  profileData.address.line1
                )}
                <br />
                {isEdit ? (
                  <input
                    className="bg-white dark:bg-zinc-950 border dark:border-zinc-800 rounded px-2 py-1 outline-none focus:border-primary transition-all mt-1"
                    type="text"
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line2: e.target.value },
                      }))
                    }
                    value={profileData.address.line2}
                  />
                ) : (
                  profileData.address.line2
                )}
              </p>
            </div>

            <div className="flex gap-2 pt-2 items-center text-gray-700 dark:text-gray-300">
              <input
                className="accent-primary cursor-pointer w-4 h-4"
                onChange={() =>
                  isEdit &&
                  setProfileData((prev) => ({
                    ...prev,
                    available: !prev.available,
                  }))
                }
                checked={profileData.available}
                type="checkbox"
                name=""
                id="avail"
              />
              <label htmlFor="avail" className="cursor-pointer">Available</label>
            </div>

            {isEdit ? (
              <button
                onClick={updateProfile}
                className="px-6 py-2 bg-primary text-white text-sm rounded-full mt-6 hover:bg-[#4a58e6] transition-all cursor-pointer shadow-lg hover:shadow-primary/20"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => setIsEdit(true)}
                className="px-6 py-2 border border-primary text-primary text-sm rounded-full mt-6 hover:bg-primary hover:text-white transition-all cursor-pointer"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
      </div>
    )
  );
};

export default HospitalProfile;
