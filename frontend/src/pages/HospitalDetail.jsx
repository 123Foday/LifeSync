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
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
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
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{hospital.name}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Hospital Information</h2>
                <div className="space-y-2 text-gray-600">
                  <p><span className="font-medium">Type:</span> {hospital.speciality}</p>
                  <p><span className="font-medium">Experience:</span> {hospital.experience}</p>
                  <p><span className="font-medium">Consultation Fee:</span> {currency}{hospital.fees}</p>
                  <p><span className="font-medium">Address:</span> {hospital.address?.line1}</p>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Accreditation</h2>
                <p className="text-gray-600">{hospital.degree}</p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">About Hospital</h2>
              <p className="text-gray-600 whitespace-pre-line">{hospital.about}</p>
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