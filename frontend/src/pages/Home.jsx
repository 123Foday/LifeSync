import React from 'react'
import Header from '../components/Header'
import SpecialityMenu from '../components/SpecialityMenu'
import TodDoctors from '../components/TopDoctors'
import Banner from '../components/Banner'


const Home = () => {
  return (
    <div>
        <Header />
        <SpecialityMenu />
        <TodDoctors />
        <Banner />
    </div>
  )
}

export default Home
