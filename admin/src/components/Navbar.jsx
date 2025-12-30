import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { AdminContext } from '../context/AdminContext'
import { DoctorContext } from '../context/DoctorContext'
import { HospitalContext } from '../context/HospitalContext'
import { useTheme } from '../context/ThemeContext'
import { Sun, Moon } from 'lucide-react'

const Navbar = () => {

  const {aToken, setAToken} = useContext(AdminContext)
  const { dToken, setDToken } = useContext(DoctorContext)
  const { hToken, setHToken } = useContext(HospitalContext)
  const { theme, toggleTheme } = useTheme()


  const navigate = useNavigate()

  const logout = () => {
    navigate('/')
    aToken && setAToken('')
    aToken && localStorage.removeItem('aToken')
    dToken && setDToken('')
    dToken && localStorage.removeItem('dToken')
    hToken && setHToken('')
    hToken && localStorage.removeItem('hToken')
  }

  return (
    <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white dark:bg-black dark:border-zinc-800 sticky top-0 z-50 transition-colors duration-300'>
      <div className='flex items-center gap-2 text-xs'>
        <img className='w-36 sm:w-40 cursor-pointer dark:brightness-200 transition-all' src={assets.admin_logo} alt="" />
        <p className='border px-2.5 py-0.5 rounded-full border-gray-500 dark:text-gray-300 dark:border-gray-500'>{aToken ? 'Admin' : dToken ? 'Doctor' : 'Hospital'}</p>
      </div>
      <div className='flex items-center gap-4'>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-gray-100 dark:bg-zinc-900 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-800 transition-all"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        <button onClick={logout} className='bg-primary text-white text-sm px-6 sm:px-10 py-2 rounded-full hover:opacity-90 transition-opacity'>Logout</button>
      </div>
    </div>
  )
}

export default Navbar
