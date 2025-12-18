import { useContext, useState, useEffect, useRef, useMemo } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import {assets} from '../assets/assets'
import { AppContext } from '../context/AppContext'

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, setToken, userData, hospitals = [], doctors = [] } = useContext(AppContext)
  const [showMenu, setShowMenu] = useState(false);
  const [hasShadow, setHasShadow] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(null);

  const navItems = useMemo(() => [
    { label: 'Home', path: '/' },
    { label: 'Hospitals', path: '/hospitals' },
    { label: 'All Doctors', path: '/doctors' },
    { label: 'About Us', path: '/about' },
    { label: 'Contact Us', path: '/contact' }
  ], [])

  // refs & indicator state for single moving underline
  const navRef = useRef(null)
  const itemRefs = useRef([])
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 })

  const updateIndicator = (index) => {
    const ul = navRef.current
    const el = itemRefs.current[index]
    if (!ul || !el) {
      setIndicator({ left: 0, width: 0, opacity: 0 })
      return
    }

    // compute left relative to the nav container (ul)
    // add a small horizontal inset so the underline doesn't touch the button edges
    const horizontalInset = 8 // px space on each side
    const left = el.offsetLeft + horizontalInset
    const width = Math.max(24, el.offsetWidth - horizontalInset * 2)
    setIndicator({ left, width, opacity: 1 })
  }

  useEffect(() => {
    const activeIndex = navItems.findIndex((i) => i.path === location.pathname)
    const target = hoverIndex !== null ? hoverIndex : activeIndex
    if (target >= 0) updateIndicator(target)
    else setIndicator({ left: 0, width: 0, opacity: 0 })

    const onResize = () => {
      const newActive = navItems.findIndex((i) => i.path === location.pathname)
      const t = hoverIndex !== null ? hoverIndex : newActive
      if (t >= 0) updateIndicator(t)
    }

    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [hoverIndex, location.pathname, navItems])

  const logout = () => {
    setToken(false)
    localStorage.removeItem('token')
  }

  // Filter hospitals and doctors based on search term
  const searchResults = searchTerm.trim() ? [
    ...hospitals.filter(h => h.name?.toLowerCase().includes(searchTerm.toLowerCase()) || h.speciality?.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 3),
    ...doctors.filter(d => d.name?.toLowerCase().includes(searchTerm.toLowerCase()) || d.speciality?.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 3)
  ] : []

  const handleSearchSelect = (item, type) => {
    setSearchTerm('')
    setShowSearchResults(false)
    if (type === 'hospital') {
      navigate(`/appointment/${item._id}`)
    } else if (type === 'doctor') {
      navigate(`/appointment/${item._id}`)
    }
    window.scrollTo(0, 0)
  }

  useEffect(() => {
    const onScroll = () => {
      setHasShadow(window.scrollY > 8)
    }
    window.addEventListener('scroll', onScroll)
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className={`sticky top-0 z-50 bg-white transition-shadow ${hasShadow ? 'shadow-md' : ''}`}>
      <div className="flex items-center justify-between text-sm py-4 border-b border-b-gray-400 px-4 md:px-0">
        <img
          onClick={() => navigate("/")}
          className="w-44 cursor-pointer"
          src={assets.logo}
          alt="Logo"
        />

        <div className="hidden md:block relative">
          <ul ref={navRef} className="flex items-center gap-5 font-medium pb-1">
            {navItems.map((item, index) => (
              <li
                key={index}
                ref={(el) => (itemRefs.current[index] = el)}
                onMouseEnter={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(null)}
                className="px-2"
              >
                <NavLink
                  to={item.path}
                  onClick={() => setHoverIndex(index)}
                  className={({ isActive: isNavActive }) => `py-1 transition-colors duration-100 ${isNavActive ? 'text-[#5f6FFF]' : 'text-gray-500 hover:text-[#5f6FFF]'}`}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Single moving underline indicator */}
          <div
            style={{
              position: 'absolute',
              bottom: '-8px',
              left: indicator.left + 'px',
              width: indicator.width + 'px',
              height: '4px',
              background: '#5f6FFF',
              borderRadius: '999px',
              transition: 'left 220ms ease, width 220ms ease, opacity 180ms ease',
              opacity: indicator.opacity,
              pointerEvents: 'none'
            }}
          />
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex items-center relative">
          <input
            type="text"
            placeholder="Search hospitals, doctors..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSearchResults(e.target.value.trim().length > 0);
            }}
            onFocus={() => setShowSearchResults(searchTerm.trim().length > 0)}
            onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />
          
          {/* Search Results Dropdown */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute top-12 left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-30 max-h-96 overflow-y-auto">
              {searchResults.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSearchSelect(item, item.availableSlots ? 'doctor' : 'hospital')}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
                >
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.speciality || item.address}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {token && userData ? (
            <div className="flex items-center gap-2 cursor-pointer group relative">
              <img className="w-8 rounded-full" src={userData.image} alt="User" />
              <img className="w-2.5" src={assets.dropdown_icon} alt="Dropdown" />
              <div className="absolute top-10 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
                <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4">
                  <p onClick={() => navigate("/my-profile")} className="hover:text-black cursor-pointer">My Profile</p>
                  <p onClick={() => navigate("/my-appointments")} className="hover:text-black cursor-pointer">My Appointment</p>
                  <p onClick={logout} className="hover:text-black cursor-pointer">Logout</p>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-[#5f6FFF] text-white px-8 py-3 rounded-full font-light hidden md:block cursor-pointer"
            >
              Get Started
            </button>
          )}

          <img
            onClick={() => setShowMenu(true)}
            className="w-6 md:hidden cursor-pointer"
            src={assets.menu_icon}
            alt="Menu"
          />

          {/* Mobile Menu */}
          <div
            className={`${
              showMenu ? "fixed w-full" : "h-0 w-0"
            } md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}
          >
            <div className="flex items-center justify-between px-5 py-6">
              <img className="w-36" src={assets.logo} alt="Logo" />
              <img
                className="w-7 cursor-pointer"
                onClick={() => setShowMenu(false)}
                src={assets.cross_icon}
                alt="Close"
              />
            </div>
            <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium">
              <NavLink onClick={() => setShowMenu(false)} to="/">
                <p className="px-4 py-2 rounded inline-block">Home</p>
              </NavLink>
              <NavLink onClick={() => setShowMenu(false)} to="/hospitals">
                <p className="px-4 py-2 rounded inline-block">Hospitals</p>
              </NavLink>
              <NavLink onClick={() => setShowMenu(false)} to="/doctors">
                <p className="px-4 py-2 rounded inline-block">All Doctors</p>
              </NavLink>
              <NavLink onClick={() => setShowMenu(false)} to="/about">
                <p className="px-4 py-2 rounded inline-block">About Us</p>
              </NavLink>
              <NavLink onClick={() => setShowMenu(false)} to="/contact">
                <p className="px-4 py-2 rounded inline-block">Contact Us</p>
              </NavLink>
              {!token && (
                <button
                  onClick={() => { setShowMenu(false); navigate('/login') }}
                  className="mt-4 bg-[#5f6FFF] text-white px-6 py-2 rounded-full"
                >
                  Get Started
                </button>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
