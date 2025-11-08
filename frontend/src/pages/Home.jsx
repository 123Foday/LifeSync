import React from 'react'
import Header from '../components/Header'
import SpecialityMenu from '../components/SpecialityMenu'
import TopDoctors from '../components/TopDoctors'
import TopHospitals from '../components/TopHospitals'
import Banner from '../components/Banner'
import CategoryMenu from '../components/CategoryMenu'


const Home = () => {
  return (
    <div>
      <Header />
      <CategoryMenu />
      <TopHospitals />
      <SpecialityMenu />
      <TopDoctors />
      <Banner />
    </div>
  );
}

export default Home
