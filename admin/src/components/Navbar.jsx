import React, { useContext, useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { AdminContext } from '../context/AdminContext'
import { DoctorContext } from '../context/DoctorContext'
import { HospitalContext } from '../context/HospitalContext'
import { useTheme } from '../context/ThemeContext'
import { Sun, Moon, Search } from 'lucide-react'
import Fuse from 'fuse.js'

const Navbar = () => {

  const {aToken, setAToken, doctors, hospitals, users, getAllUsers} = useContext(AdminContext)
  const { dToken, setDToken } = useContext(DoctorContext)
  const { hToken, setHToken } = useContext(HospitalContext)
  const { theme, toggleTheme } = useTheme()
  
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [showResults, setShowResults] = useState(false)

  const navigate = useNavigate()

  // Fetch users if admin is logged in and users are empty (optional, depending on flow)
  useEffect(() => {
    if (aToken && users.length === 0) {
      getAllUsers()
    }
  }, [aToken, users, getAllUsers])

  const allData = useMemo(() => {
    const d = doctors ? doctors.map(doc => ({ ...doc, type: 'Doctor', link: '/doctor-list' })) : []
    const h = hospitals ? hospitals.map(hos => ({ ...hos, type: 'Hospital', link: '/hospital-list' })) : []
    const u = users ? users.map(usr => ({ ...usr, type: 'User', link: '/all-appointments' })) : []
    return [...d, ...h, ...u]
  }, [doctors, hospitals, users])

  const fuse = useMemo(() => {
    return new Fuse(allData, {
      keys: ['name', 'email', 'speciality', 'address.line1', 'address.line2'],
      threshold: 0.3,
      distance: 100
    })
  }, [allData])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        const searchResults = fuse.search(query).map(result => result.item)
        setResults(searchResults)
        setShowResults(true)
      } else {
        setResults([])
        setShowResults(false)
      }
    }, 300)
    return () => clearTimeout(timeoutId)
  }, [query, fuse])

  const logout = () => {
    navigate('/')
    aToken && setAToken('')
    aToken && localStorage.removeItem('aToken')
    dToken && setDToken('')
    dToken && localStorage.removeItem('dToken')
    hToken && setHToken('')
    hToken && localStorage.removeItem('hToken')
  }

  const handleResultClick = (item) => {
    setQuery('')
    setShowResults(false)
    // Navigate or Action
    navigate(item.link || '/')
  }

  return (
    <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white dark:bg-black dark:border-zinc-800 sticky top-0 z-50 transition-colors duration-300'>
      <div className='flex items-center gap-2 text-xs'>
        <img className='w-36 sm:w-40 cursor-pointer dark:brightness-200 transition-all' src={assets.admin_logo} alt="" />
        <p className='border px-2.5 py-0.5 rounded-full border-gray-500 dark:text-gray-300 dark:border-gray-500'>{aToken ? 'Admin' : dToken ? 'Doctor' : 'Hospital'}</p>
      </div>
      
      {/* Search Bar - Desktop Only */}
      <div className='hidden md:flex items-center flex-1 max-w-md mx-10 relative'>
        <div className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'>
          <Search size={18} />
        </div>
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Start typing to search...' 
          className='w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all dark:text-white'
        />
        {/* Results Dropdown */}
        {showResults && results.length > 0 && (
          <div className='absolute top-full mt-2 left-0 w-full bg-white dark:bg-zinc-900 shadow-xl rounded-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto z-[60]'>
            {results.map((item, index) => (
              <div 
                key={index} 
                onClick={() => handleResultClick(item)}
                className='px-4 py-3 hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer border-b border-gray-100 dark:border-gray-800 last:border-none group'
              >
                <div className='flex justify-between items-start'>
                  <div>
                    <p className='font-medium text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors'>{item.name}</p>
                    <p className='text-xs text-gray-500 dark:text-gray-400'>{item.email || item.speciality || 'User'}</p>
                  </div>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full 
                    ${item.type === 'Doctor' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 
                      item.type === 'Hospital' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 
                      'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'}`}>
                    {item.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
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
