import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { AdminContext } from '../context/AdminContext';
import { assets } from '../assets/assets';
import { DoctorContext } from '../context/DoctorContext'
import { HospitalContext } from '../context/HospitalContext';

const Sidebar = () => {

  const { aToken } = useContext(AdminContext)
  const { dToken } = useContext(DoctorContext)
  const { hToken } = useContext(HospitalContext)


  const activeStyle = ({ isActive }) =>
    `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transition-all ${
      isActive ? "bg-[#F2F3FF] dark:bg-zinc-900 border-r-4 border-primary text-primary dark:text-white" : "text-[#515151] dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-900/50"
    }`

  return (
    <div className="h-full bg-background dark:bg-zinc-900 border-r dark:border-zinc-800 transition-colors duration-300">
      {aToken && (
        <ul className="py-5">
          <NavLink className={activeStyle} to={"/admin-dashboard"}>
            <img className='brand-icon w-5' src={assets.home_icon} alt="" />
            <p className="hidden md:block">Dashboard</p>
          </NavLink>

          <NavLink className={activeStyle} to={"/all-appointments"}>
            <img className='brand-icon w-5' src={assets.appointment_icon} alt="" />
            <p className="hidden md:block">Appointments</p>
          </NavLink>

          <NavLink className={activeStyle} to={"/add-doctor"}>
            <img className='brand-icon w-5' src={assets.add_icon} alt="" />
            <p className="hidden md:block">Add Doctor</p>
          </NavLink>

          <NavLink className={activeStyle} to={"/doctor-list"}>
            <img className='brand-icon w-5' src={assets.people_icon} alt="" />
            <p className="hidden md:block">Doctors List</p>
          </NavLink>

          <NavLink className={activeStyle} to={"/add-hospital"}>
            <img className='brand-icon w-5' src={assets.add_icon} alt="" />
            <p className="hidden md:block">Add Hospital</p>
          </NavLink>

          <NavLink className={activeStyle} to={"/hospital-list"}>
            <img className='brand-icon w-5' src={assets.people_icon} alt="" />
            <p className="hidden md:block">Hospitals List</p>
          </NavLink>

          <NavLink className={activeStyle} to={"/emergency-call-center"}>
            <svg className='brand-icon w-5' fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <p className="hidden md:block">Emergency Call Center</p>
          </NavLink>
        </ul>
      )}

      {dToken && (
        <ul className="mt-5">
          <NavLink className={activeStyle} to={"/doctor-dashboard"}>
            <img className='brand-icon w-5' src={assets.home_icon} alt="" />
            <p className="hidden md:block">Dashboard</p>
          </NavLink>

          <NavLink className={activeStyle} to={"/doctor-appointments"}>
            <img className='brand-icon w-5' src={assets.appointment_icon} alt="" />
            <p className="hidden md:block">Appointments</p>
          </NavLink>

          <NavLink className={activeStyle} to={"/doctor-profile"}>
            <img className='brand-icon w-5' src={assets.people_icon} alt="" />
            <p className="hidden md:block">Profile</p>
          </NavLink>
        </ul>
      )}

      {hToken && (
        <ul className="mt-5">
          <NavLink className={activeStyle} to={"/hospital-dashboard"}>
            <img className='brand-icon w-5' src={assets.home_icon} alt="" />
            <p className="hidden md:block">Dashboard</p>
          </NavLink>

          <NavLink className={activeStyle} to={"/hospital-appointments"}>
            <img className='brand-icon w-5' src={assets.appointment_icon} alt="" />
            <p className="hidden md:block">Appointments</p>
          </NavLink>

          <NavLink className={activeStyle} to={"/hospital-add-doctor"}>
            <img className='brand-icon w-5' src={assets.add_icon} alt="" />
            <p className="hidden md:block">Add Doctor</p>
          </NavLink>

          <NavLink className={activeStyle} to={"/hospital-doctor-list"}>
            <img className='brand-icon w-5' src={assets.people_icon} alt="" />
            <p className="hidden md:block">Doctors List</p>
          </NavLink>

          <NavLink className={activeStyle} to={"/hospital-profile"}>
            <img className='brand-icon w-5' src={assets.people_icon} alt="" />
            <p className="hidden md:block">Profile</p>
          </NavLink>

          <NavLink className={activeStyle} to={"/hospital-emergency-call-center"}>
            <svg className='brand-icon w-5' fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <p className="hidden md:block">Emergency Call Center</p>
          </NavLink>
        </ul>
      )}
    </div>
  )
}

export default Sidebar
