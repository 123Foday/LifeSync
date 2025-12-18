import { useState } from 'react'
import Header from '../components/Header'
import SpecialityMenu from '../components/SpecialityMenu'
import TopDoctors from '../components/TopDoctors'
import TopHospitals from '../components/TopHospitals'
import Banner from '../components/Banner'
import CategoryMenu from '../components/CategoryMenu'


const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState('')

  return (
    <div className="pt-9">
      <Header />
      <CategoryMenu selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
      <TopHospitals selectedCategory={selectedCategory} />
      <SpecialityMenu />
      <TopDoctors />
      <Banner />
    </div>
  );
}

export default Home
