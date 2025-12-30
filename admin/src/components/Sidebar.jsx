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
    <div className="h-full bg-white dark:bg-black border-r dark:border-zinc-800 transition-colors duration-300">
      {aToken && (
        <ul className="py-5">
          <NavLink className={activeStyle} to={"/admin-dashboard"}>
            <img src={assets.home_icon} alt="" />
            <p className="hidden md:block">Dashboard</p>
          </NavLink>

          <NavLink className={activeStyle} to={"/all-appointments"}>
            <img src={assets.appointment_icon} alt="" />
            <p className="hidden md:block">Appointments</p>
          </NavLink>

          <NavLink className={activeStyle} to={"/add-doctor"}>
            <img src={assets.add_icon} alt="" />
            <p className="hidden md:block">Add Doctor</p>
          </NavLink>

          <NavLink className={activeStyle} to={"/doctor-list"}>
            <img src={assets.people_icon} alt="" />
            <p className="hidden md:block">Doctors List</p>
          </NavLink>

          <NavLink className={activeStyle} to={"/add-hospital"}>
            <img src={assets.add_icon} alt="" />
            <p className="hidden md:block">Add Hospital</p>
          </NavLink>

          <NavLink className={activeStyle} to={"/hospital-list"}>
            <img src={assets.people_icon} alt="" />
            <p className="hidden md:block">Hospitals List</p>
          </NavLink>
        </ul>
      )}

      {dToken && (
        <ul className="mt-5">
          <NavLink className={activeStyle} to={"/doctor-dashboard"}>
            <img src={assets.home_icon} alt="" />
            <p className="hidden md:block">Dashboard</p>
          </NavLink>

          <NavLink className={activeStyle} to={"/doctor-appointments"}>
            <img src={assets.appointment_icon} alt="" />
            <p className="hidden md:block">Appointments</p>
          </NavLink>

          <NavLink className={activeStyle} to={"/doctor-profile"}>
            <img src={assets.people_icon} alt="" />
            <p className="hidden md:block">Profile</p>
          </NavLink>
        </ul>
      )}

      {hToken && (
        <ul className="mt-5">
          <NavLink className={activeStyle} to={"/hospital-dashboard"}>
            <img src={assets.home_icon} alt="" />
            <p className="hidden md:block">Dashboard</p>
          </NavLink>

          <NavLink className={activeStyle} to={"/hospital-appointments"}>
            <img src={assets.appointment_icon} alt="" />
            <p className="hidden md:block">Appointments</p>
          </NavLink>

          <NavLink className={activeStyle} to={"/hospital-add-doctor"}>
            <img src={assets.add_icon} alt="" />
            <p className="hidden md:block">Add Doctor</p>
          </NavLink>

          <NavLink className={activeStyle} to={"/hospital-doctor-list"}>
            <img src={assets.people_icon} alt="" />
            <p className="hidden md:block">Doctors List</p>
          </NavLink>

          <NavLink className={activeStyle} to={"/hospital-profile"}>
            <img src={assets.people_icon} alt="" />
            <p className="hidden md:block">Profile</p>
          </NavLink>
        </ul>
      )}
    </div>
  )
}

export default Sidebar
