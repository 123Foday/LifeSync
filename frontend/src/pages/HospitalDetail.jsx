import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import RelatedDoctors from '../components/RelatedDoctors';

const HospitalDetail = () => {
  const { hospitalId } = useParams();
  const { hospitals, currencySymbol: currency } = useContext(AppContext);
  const [hospital, setHospital] = useState(null);

  useEffect(() => {
    if (hospitals.length > 0 && hospitalId) {
      const hospitalData = hospitals.find(h => h._id === hospitalId);
      setHospital(hospitalData);
    }
  }, [hospitals, hospitalId]);

  if (!hospital) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 transition-all duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-black shadow dark:shadow-gray-900 rounded-lg overflow-hidden border dark:border-gray-800">
          <div className="relative h-96">
            <img
              src={hospital.image}
              alt={hospital.name}
              className="w-full h-full object-cover"
            />
            <div className={`absolute top-4 right-4 p-2 rounded-full ${
              hospital.available ? 'bg-green-500' : 'bg-red-500'
            }`}>
              <span className="text-white text-sm">
                {hospital.available ? 'Available' : 'Unavailable'}
              </span>
            </div>
          </div>

          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">{hospital.name}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-2">Hospital Information</h2>
                <div className="space-y-2 text-gray-600 dark:text-gray-400">
                  <p><span className="font-medium dark:text-gray-300">Type:</span> {hospital.speciality}</p>
                  <p><span className="font-medium dark:text-gray-300">Experience:</span> {hospital.experience}</p>
                  <p><span className="font-medium dark:text-gray-300">Address:</span> {hospital.address?.line1}</p>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-2">Accreditation</h2>
                <p className="text-gray-600 dark:text-gray-400">{hospital.degree}</p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-2">About Hospital</h2>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">{hospital.about}</p>
            </div>
          </div>
        </div>

        {/* Related Doctors Section */}
        <div className="mt-8">
          <RelatedDoctors hospitalId={hospitalId} />
        </div>
      </div>
    </div>
  );
};

export default HospitalDetail;