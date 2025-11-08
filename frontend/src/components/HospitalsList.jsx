import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const HospitalsList = () => {
  const { hospitals, currencySymbol: currency } = useContext(AppContext);
  const navigate = useNavigate();

  console.log('HospitalsList rendering with hospitals:', hospitals);

  const content = (
    <div className="w-full py-16 px-4 sm:px-10">
      <h2 className="text-3xl font-medium text-center mb-2">Our Hospitals</h2>
      <p className="text-center text-gray-600 mb-8">Find the best healthcare facilities near you</p>
      {(!hospitals || hospitals.length === 0) ? (
        <div className="text-center text-gray-500 py-10">
          No hospitals available at the moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hospitals.map((hospital) => (
            <div 
              key={hospital._id} 
              onClick={() => navigate(`/hospital/${hospital._id}`)}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border border-gray-100 overflow-hidden"
            >
              <div className="relative">
                <img 
                  className="w-full h-48 object-cover" 
                  src={hospital.image} 
                  alt={hospital.name} 
                />
                <div className={`absolute top-4 right-4 p-2 rounded-full ${
                  hospital.available ? 'bg-green-500' : 'bg-red-500'
                }`}>
                  <span className="text-white text-sm">
                    {hospital.available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{hospital.name}</h3>
                
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <span className="font-medium">Type:</span>
                  <span>{hospital.speciality}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <span className="font-medium">Experience:</span>
                  <span>{hospital.experience}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <span className="font-medium">Fees:</span>
                  <span>{currency}{hospital.fees}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <span className="font-medium">Address:</span>
                  <span>{hospital.address?.line1}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return content;
};

export default HospitalsList;