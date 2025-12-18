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
              speciality === "Private"
                ? navigate("/hospitals")
                : navigate("/hospitals/Private")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === "Private"
                ? "bg-indigo-100 text-black"
                : ""
            }`}
          >
            Private
          </p>
          
          <p
            onClick={() =>
              speciality === "General Hospital"
                ? navigate("/hospitals")
                : navigate("/hospitals/General Hospital")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === "General Hospital"
                ? "bg-indigo-100 text-black"
                : ""
            }`}
          >
            General Hospital
          </p>

          <p
            onClick={() =>
              speciality === "Community Health Center"
                ? navigate("/hospitals")
                : navigate("/hospitals/Community Health Center")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === "Community Health Center"
                ? "bg-indigo-100 text-black"
                : ""
            }`}
          >
            NGO/Community
          </p>

          <p
            onClick={() =>
              speciality === "Children's Hospital"
                ? navigate("/hospitals")
                : navigate("/hospitals/Children's Hospital")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === "Children's Hospital"
                ? "bg-indigo-100 text-black"
                : ""
            }`}
          >
            Children&apos;s Hospital
          </p>

          <p
            onClick={() =>
              speciality === "Maternity Hospital"
                ? navigate("/hospitals")
                : navigate("/hospitals/Maternity Hospital")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === "Maternity Hospital"
                ? "bg-indigo-100 text-black"
                : ""
            }`}
          >
            Maternity Hospital
          </p>

          <p
            onClick={() =>
              speciality === "Mental Health"
                ? navigate("/hospitals")
                : navigate("/hospitals/Mental Health")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === "Mental Health"
                ? "bg-indigo-100 text-black"
                : ""
            }`}
          >
            Mental Health
          </p>

          <p
            onClick={() =>
              speciality === "Rehabilitation Center"
                ? navigate("/hospitals")
                : navigate("/hospitals/Rehabilitation Center")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === "Rehabilitation Center"
                ? "bg-indigo-100 text-black"
                : ""
            }`}
          >
            Rehab Center
          </p>

          <p
            onClick={() =>
              speciality === "Teaching Hospital"
                ? navigate("/hospitals")
                : navigate("/hospitals/Teaching Hospital")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === "Teaching Hospital"
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
