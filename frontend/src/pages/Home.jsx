import { useState } from 'react'
import Header from '../components/Header'
import HealthAdvisorCard from '../components/HealthAdvisorCard'
import SpecialityMenu from '../components/SpecialityMenu'
import TopDoctors from '../components/TopDoctors'
import TopHospitals from '../components/TopHospitals'
import Banner from '../components/Banner'
import CategoryMenu from '../components/CategoryMenu'


const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState('')

  const [selectedSpeciality, setSelectedSpeciality] = useState('')

  return (
    <div>
      <Header />
      <div className="mt-4 sm:mt-6 md:mt-6"></div>
      {/* MedicalAdvisor */}
      <HealthAdvisorCard />
      {/*add margin */}
      <div className="mt-8 sm:mt-12 md:mt-16 lg:mt-20"></div>
      {/* CategoryMenu */}
      <CategoryMenu
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <TopHospitals selectedCategory={selectedCategory} />
      {/* SpecialityMenu */}
      <SpecialityMenu 
        selectedSpeciality={selectedSpeciality}
        onSelectSpeciality={setSelectedSpeciality}
      />
      <TopDoctors speciality={selectedSpeciality} />
      <Banner />
    </div>
  );
}

export default Home
