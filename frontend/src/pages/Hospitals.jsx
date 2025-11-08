import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";

const Hospitals = () => {
  const { speciality } = useParams();

  const { hospitals } = useContext(AppContext);
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(hospitals.filter((doc) => doc.speciality === speciality));
    } else {
      setFilterDoc(hospitals);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [hospitals, speciality]);

  return (
    <div>
      <p className="text-gray-600">Browse through the hospitals Categories.</p>
      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        <button
          className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${
            showFilter ? "bg-[#5f6FFF]" : ""
          }`}
          onClick={() => setShowFilter((prev) => !prev)}
        >
          Filters
        </button>
        <div
          className={`flex-col gap-4 text-sm text-gray-600 ${
            showFilter ? "flex" : "hidden sm:flex"
          }`}
        >
          <p
            onClick={() =>
              speciality === "Government"
                ? navigate("/hospitals")
                : navigate("/hospitals/Government")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === "Government"
                ? "bg-indigo-100 text-black"
                : ""
            }`}
          >
            Government
          </p>

          <p
            onClick={() =>
              speciality === ""
                ? navigate("/hospitals")
                : navigate("/hospitals/Private")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === "Private" ? "bg-indigo-100 text-black" : ""
            }`}
          >
            Private
          </p>

          <p
            onClick={() =>
              speciality === "Mission/Faith-Based"
                ? navigate("/hospitals")
                : navigate("/hospitals/Mission/Faith-Based")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === "Mission/Faith-Based" ? "bg-indigo-100 text-black" : ""
            }`}
          >
            Mission/Faith-Based
          </p>

          <p
            onClick={() =>
              speciality === "NGO/Community"
                ? navigate("/hospitals")
                : navigate("/hospitals/NGO/Community")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === "NGO/Community" ? "bg-indigo-100 text-black" : ""
            }`}
          >
            NGO/Community
          </p>

          <p
            onClick={() =>
              speciality === "Military/Police"
                ? navigate("/hospitals")
                : navigate("/hospitals/Militrary/Police")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === "Military/Police" ? "bg-indigo-100 text-black" : ""
            }`}
          >
            Military/Police
          </p>

          <p
            onClick={() =>
              speciality === "Specialised/Teaching"
                ? navigate("/hospitals")
                : navigate("/hospitals/Specialised/Teaching")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === "Specialised/Teaching"
                ? "bg-indigo-100 text-black"
                : ""
            }`}
          >
            Specialised/Teaching
          </p>
        </div>

        <div className="w-full grid grid-auto-cols gap-4 gap-y-6 ">
          {filterDoc.map((item, index) => (
            <div
              onClick={() => navigate(`/appointment/${item._id}`)}
              className="border border-blue-200 rounded=xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration 500"
              key={index}
            >
              <img className="bg-blue-50" src={item.image} alt="" />
              <div className="p-4">
                <div
                  className={`flex items-center gap-2 text-sm text-center ${
                    item.available ? "text-green-500" : "text-gray-500"
                  } `}
                >
                  <p
                    className={`w-2 h-2 ${
                      item.available ? "bg-green-500" : "bg-gray-500"
                    }  rounded-full`}
                  ></p>
                  <p>{item.available ? "Available" : "Not Available"}</p>
                </div>
                <p className="text-gray-900 text-lg font-medium">{item.name}</p>
                <p className="text-gray-600 text-sm">{item.speciality}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hospitals;
