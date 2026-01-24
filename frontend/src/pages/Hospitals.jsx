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
    <div className="transition-all duration-300">
      <p className="text-gray-600 dark:text-gray-400">Browse through the hospitals Categories.</p>
      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        <button
          className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${
            showFilter ? "bg-[#5f6FFF] text-white" : "dark:border-gray-700 dark:text-gray-300"
          }`}
          onClick={() => setShowFilter((prev) => !prev)}
        >
          Filters
        </button>
        <div
          className={`flex-col gap-4 text-sm text-gray-600 dark:text-gray-400 ${
            showFilter ? "flex" : "hidden sm:flex"
          }`}
        >
          {[
            { label: "Government", val: "Government" },
            { label: "Private", val: "Private" },
            { label: "General", val: "General" },
            { label: "NGO/Community", val: "Community" },
            { label: "Pediatrics", val: "Pediatrics" },
            { label: "Maternity", val: "Maternity" },
            { label: "Mental Asylum", val: "Mental Asylum" },
            { label: "Rehab Center", val: "Rehab Center" },
            { label: "Specialised/Teaching", val: "Teaching Hospital" },
          ].map((cat) => (
            <p
              key={cat.val}
              onClick={() =>
                speciality === cat.val
                  ? navigate("/hospitals")
                  : navigate(`/hospitals/${cat.val}`)
              }
              className={`w-full sm:w-auto pl-3 py-1.5 pr-6 border border-gray-300 dark:border-gray-700 rounded transition-all cursor-pointer ${
                speciality === cat.val
                  ? "bg-indigo-100 text-black dark:bg-indigo-900/40 dark:text-gray-100"
                  : "hover:bg-gray-50 dark:hover:bg-zinc-900"
              }`}
            >
              {cat.label}
            </p>
          ))}
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6 ">
          {filterDoc.map((item, index) => (
            <div
              onClick={() => navigate(`/hospital/${item._id}`)}
              className="border border-blue-200 dark:border-gray-800 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-1 transition-all duration-300 bg-white dark:bg-black shadow-sm"
              key={index}
            >
              <img className="bg-blue-50 dark:bg-zinc-950" src={item.image} alt="" />
              <div className="p-4">
                <div
                  className={`flex items-center gap-2 text-sm text-center ${
                    item.available ? "text-green-500" : "text-gray-500 dark:text-gray-400"
                  } `}
                >
                  <p
                    className={`w-2 h-2 ${
                      item.available ? "bg-green-500" : "bg-gray-500"
                    }  rounded-full`}
                  ></p>
                  <p>{item.available ? "Available" : "Not Available"}</p>
                </div>
                <p className="text-gray-900 dark:text-gray-100 text-lg font-medium">{item.name}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{item.speciality}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hospitals;
