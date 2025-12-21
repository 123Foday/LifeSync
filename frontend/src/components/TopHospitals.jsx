import PropTypes from 'prop-types'
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const TopHospitals = ({ selectedCategory = '' }) => {
  const navigate = useNavigate();
  const { hospitals } = useContext(AppContext);

  const filtered = selectedCategory
    ? hospitals.filter((h) => h.speciality === selectedCategory)
    : hospitals;

  return (
    <div className="container flex flex-col items-center gap-3 sm:gap-4 my-12 sm:my-16 text-gray-900 px-4 sm:px-6">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium text-center">
        Easy Appointment with Top Hospitals
      </h1>
      <p className="w-full sm:w-2/3 md:w-1/2 lg:w-1/3 text-center text-xs sm:text-sm px-4">
        Simply scroll through our extensive list of trusted hospitals.
      </p>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 pt-5 gap-y-6">
        {filtered.slice(0, 10).map((item, index) => (
          <div
            onClick={() => {
              navigate(`/appointment/${item._id}`);
              scrollTo(0, 0);
            }}
            className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-1 transition-all duration-300"
            key={index}
          >
            <img
              className="w-full h-44 object-cover bg-blue-50"
              src={item.image}
              alt=""
            />
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
      <button
        onClick={() => {
          navigate("/hospitals");
          scrollTo(0, 0);
        }}
        className="bg-blue-100 text-gray-600 text-sm sm:text-base px-6 sm:px-8 md:px-12 py-2.5 sm:py-3 rounded-full mt-8 sm:mt-10 hover:bg-blue-200 transition-colors"
      >
        More
      </button>
    </div>
  );
};

export default TopHospitals;

TopHospitals.propTypes = {
  selectedCategory: PropTypes.string,
}
