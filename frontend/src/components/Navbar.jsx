import { useContext, useState, useEffect, useRef, useMemo } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import {assets} from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { useTheme } from '../context/ThemeContext'
import { NotificationContext } from '../context/NotificationContext'
import NotificationDropdown from './NotificationDropdown'
import { toast } from 'react-toastify' 
import { Search, Bell, X, Check, BellRing } from 'lucide-react' 
import Fuse from 'fuse.js'

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, setToken, userData, setUserData, hospitals = [], doctors = [] } = useContext(AppContext)
  const { theme, toggleTheme } = useTheme();
  const { notifications, unreadCount, markAsRead, clearAll } = useContext(NotificationContext)
  
  const [showMenu, setShowMenu] = useState(false);
  const [hasShadow, setHasShadow] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(null);

  // ... (rest of the code)


  const navItems = useMemo(() => [
    { label: 'Home', path: '/' },
    { label: 'Hospitals', path: '/hospitals' },
    { label: 'All Doctors', path: '/doctors' },
    { label: 'Emergency', path: '/emergency' },
    { label: 'About Us', path: '/about' }
  ], [])

  // refs & indicator state for single moving underline
  const navRef = useRef(null)
  const itemRefs = useRef([])
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 })
  const [showSearchMobile, setShowSearchMobile] = useState(false);
  const mobileSearchRef = useRef(null);
  const mobileSearchPanelRef = useRef(null);
  const menuRef = useRef(null);
  const prevActiveEl = useRef(null);

  // Focus trap & restore focus when mobile overlays are open
  useEffect(() => {
    const handleTab = (e) => {
      if (!(showMenu || showSearchMobile)) return
      const panel = showMenu ? menuRef.current : mobileSearchPanelRef.current
      if (!panel) return
      const focusable = panel.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])')
      if (!focusable.length) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first.focus()
          }
        }
      }
    }

    // When opening, save active element and move focus inside
    if (showMenu) {
      prevActiveEl.current = document.activeElement
      setTimeout(() => menuRef.current?.querySelector('button, a, input')?.focus(), 50)
    } else if (showSearchMobile) {
      prevActiveEl.current = document.activeElement
      setTimeout(() => mobileSearchRef.current?.focus(), 50)
    }

    window.addEventListener('keydown', handleTab)
    return () => {
      window.removeEventListener('keydown', handleTab)
      // Restore focus when overlays close
      if (!showMenu && !showSearchMobile && prevActiveEl.current) {
        prevActiveEl.current.focus?.()
        prevActiveEl.current = null
      }
    }
  }, [showMenu, showSearchMobile])

  const updateIndicator = (index) => {
    const ul = navRef.current
    const el = itemRefs.current[index]
    if (!ul || !el) return setIndicator({ left: 0, width: 0, opacity: 0 })

    // Use bounding rects so the underline positions correctly even with padding, scroll or transforms
    const ulRect = ul.getBoundingClientRect()
    const elRect = el.getBoundingClientRect()
    const horizontalInset = 8
    const left = Math.round(elRect.left - ulRect.left + (ul.scrollLeft || 0) + horizontalInset)
    const width = Math.max(24, Math.round(elRect.width - horizontalInset * 2))
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

  // Close mobile menus on navigation or Escape, and focus search when opened
  useEffect(() => {
    setShowMenu(false)
    setShowSearchMobile(false)
    setShowSearchResults(false)
  }, [location.pathname])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setShowMenu(false)
        setShowSearchMobile(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (showSearchMobile) mobileSearchRef.current?.focus()
  }, [showSearchMobile])

  // Prevent body scroll when mobile overlays are open
  useEffect(() => {
    if (showMenu || showSearchMobile) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [showMenu, showSearchMobile])

  const logout = () => {
    // Clear session, show confirmation toast, then redirect to login
    setToken(false)
    setUserData(false)
    localStorage.removeItem('token')
    toast.info('Logged out successfully')
    setTimeout(() => navigate('/login'), 400)
  }

 
  // Filter hospitals and doctors using Fuse.js
  const allData = useMemo(() => {
    const h = hospitals.map(item => ({ ...item, type: 'Hospital' }))
    const d = doctors.map(item => ({ ...item, type: 'Doctor' }))
    return [...h, ...d]
  }, [hospitals, doctors])

  const fuse = useMemo(() => new Fuse(allData, {
    keys: ['name', 'speciality', 'address.line1', 'address.line2'],
    threshold: 0.3,
    distance: 100
  }), [allData])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    if (debouncedTerm.trim()) {
      const results = fuse.search(debouncedTerm).map(res => res.item).slice(0, 5)
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }, [debouncedTerm, fuse])

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
    <div
      className={`sticky top-0 z-50 bg-white dark:bg-[#121212] transition-shadow ${
        hasShadow ? "shadow-md dark:shadow-gray-900" : ""
      }`}
    >
      <div className="flex items-center justify-between text-xs sm:text-sm md:text-sm lg:text-base py-2.5 sm:py-3 md:py-3 lg:py-4 border-b border-b-gray-400 dark:border-b-gray-700 px-2 sm:px-3 md:px-4 lg:px-6">
        <img
          onClick={() => navigate("/")}
          className="w-24 sm:w-28 md:w-32 lg:w-40 xl:w-44 cursor-pointer flex-shrink-0"
          src={assets.logo}
          alt="Logo"
        />

        <div className="hidden md:block relative">
          <ul
            ref={navRef}
            className="flex items-center gap-2 md:gap-3 lg:gap-4 xl:gap-5 font-medium pb-1 text-xs md:text-sm lg:text-base whitespace-nowrap"
          >
            {navItems.map((item, index) => (
              <li
                key={index}
                ref={(el) => (itemRefs.current[index] = el)}
                onMouseEnter={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(null)}
                className="px-1.5 md:px-2 lg:px-3 flex-shrink-0"
              >
                <NavLink
                  to={item.path}
                  onClick={() => setHoverIndex(index)}
                  className={({ isActive: isNavActive }) =>
                    `py-1 transition-colors duration-100 whitespace-nowrap ${
                      isNavActive
                        ? "text-[#5f6FFF]"
                        : "text-gray-500 dark:text-gray-400 hover:text-[#5f6FFF] dark:hover:text-[#5f6FFF]"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Single moving underline indicator */}
          <div
            style={{
              position: "absolute",
              bottom: "-8px",
              left: indicator.left + "px",
              width: indicator.width + "px",
              height: "4px",
              background: "#5f6FFF",
              borderRadius: "999px",
              transition:
                "left 220ms ease, width 220ms ease, opacity 180ms ease",
              opacity: indicator.opacity,
              pointerEvents: "none",
            }}
          />
        </div>

        {/* Desktop Search & Notifications Group */}
        <div className="hidden md:flex items-center gap-2 flex-1 max-w-xs lg:max-w-sm ml-4 mr-2 relative">
          <div className="relative flex-1">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
               <Search size={16} />
            </div>
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
              className="w-full pl-9 pr-3 py-1.5 md:py-2 border border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-[#5f6FFF] text-xs md:text-sm transition-all"
            />

            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-12 left-0 right-0 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-gray-800 rounded-lg shadow-lg z-30 max-h-96 overflow-y-auto">
                {searchResults.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() =>
                      handleSearchSelect(
                        item,
                        item.type?.toLowerCase() || (item.availableSlots ? "doctor" : "hospital")
                      )
                    }
                    className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-200 dark:border-gray-600 last:border-b-0 flex justify-between items-center group"
                  >
                     <div>
                      <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {item.speciality || item.address?.line1 || item.address}
                      </p>
                    </div>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full 
                      ${item.type === 'Doctor' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 
                        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'}`}>
                      {item.type}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Notifications - Integrated near Search */}
          {token && (
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-2.5 rounded-xl transition-all relative flex items-center justify-center ${
                  showNotifications 
                  ? "bg-[#5f6FFF] text-white shadow-lg shadow-blue-500/20" 
                  : "bg-gray-100 dark:bg-zinc-900 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-800"
                }`}
                aria-label="Toggle notifications"
              >
                {unreadCount > 0 ? (
                  <BellRing size={20} className={unreadCount > 0 ? "animate-wiggle" : ""} />
                ) : (
                  <Bell size={20} />
                )}
                
                {unreadCount > 0 && (
                  <>
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white dark:border-zinc-900 text-[9px] text-white items-center justify-center font-black">
                        {unreadCount > 9 ? "9" : unreadCount}
                      </span>
                    </span>
                  </>
                )}
              </button>

              <NotificationDropdown 
                isOpen={showNotifications} 
                onClose={() => setShowNotifications(false)} 
              />
            </div>
          )}
        </div>



        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full transition-colors duration-200 ${
            theme === "dark"
              ? "bg-gray-800 text-yellow-300 hover:text-yellow-200"
              : "bg-gray-100 text-gray-600 hover:text-gray-800"
          }`}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
              />
            </svg>
          )}
        </button>

        <div className="flex items-center gap-2 md:gap-3 lg:gap-4">
          {token && userData ? (
            <div className="flex items-center gap-1.5 md:gap-2 cursor-pointer group relative">
              <img
                className="w-7 md:w-8 rounded-full flex-shrink-0"
                src={userData.image}
                alt="User"
              />
              <img
                className="w-2 md:w-2.5 flex-shrink-0"
                src={assets.dropdown_icon}
                alt="Dropdown"
              />
              <div className="absolute top-10 right-0 pt-14 text-sm md:text-base font-medium text-gray-600 dark:text-gray-300 z-20 hidden group-hover:block">
                <div className="w-40 md:w-44 max-w-[90vw] bg-white dark:bg-black rounded-lg flex flex-col gap-3 md:gap-4 p-3 md:p-4 shadow-2xl border border-gray-200 dark:border-gray-800">
                  <p
                    onClick={() => navigate("/my-profile")}
                    className="hover:text-black dark:hover:text-white cursor-pointer text-xs md:text-sm"
                  >
                    My Profile
                  </p>
                  <p
                    onClick={() => navigate("/my-appointments")}
                    className="hover:text-black dark:hover:text-white cursor-pointer text-xs md:text-sm"
                  >
                    My Appointment
                  </p>
                  <p
                    onClick={logout}
                    className="hover:text-black dark:hover:text-white cursor-pointer text-xs md:text-sm"
                  >
                    Logout
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-[#5f6FFF] text-white px-2.5 md:px-4 lg:px-6 py-1.5 md:py-2 lg:py-3 rounded-full font-light hidden md:inline-flex items-center cursor-pointer text-xs md:text-sm lg:text-base whitespace-nowrap"
            >
              Get Started
            </button>
          )}

          <div className="flex items-center gap-1 sm:gap-2">
            {/* Mobile Notifications - Strategically placed near search */}
            {token && (
              <div className="md:hidden relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`p-2 rounded-xl transition-all relative ${
                    showNotifications 
                    ? "bg-[#5f6FFF] text-white" 
                    : "text-gray-700 dark:text-gray-300"
                  }`}
                  aria-label="Notifications"
                >
                  {unreadCount > 0 ? (
                    <BellRing size={18} className={unreadCount > 0 ? "animate-wiggle" : ""} />
                  ) : (
                    <Bell size={18} />
                  )}
                  
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white dark:border-zinc-900 font-bold">
                      {unreadCount > 9 ? "9" : unreadCount}
                    </span>
                  )}
                </button>
                
                <NotificationDropdown 
                  isOpen={showNotifications} 
                  onClose={() => setShowNotifications(false)} 
                />
              </div>
            )}

            <button
              aria-label="Open search"
              onClick={() => {
                setShowSearchMobile(true);
                setShowMenu(false);
                setShowNotifications(false);
              }}
              className="md:hidden p-2 text-gray-700 dark:text-gray-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            <button
              aria-label="Open menu"
              aria-expanded={showMenu}
              aria-controls="mobile-menu"
              onClick={() => {
                setShowMenu(true);
                setShowSearchMobile(false);
              }}
              className="md:hidden p-2"
            >
              <img
                className="w-6 invert dark:invert-0"
                src={assets.menu_icon}
                alt="Menu"
              />
            </button>
          </div>

          {/* Mobile Menu */}
          <div
            className={`fixed inset-0 z-40 md:hidden ${
              showMenu ? "" : "pointer-events-none"
            }`}
            aria-hidden={!showMenu}
          >
            {/* Backdrop */}
            <div
              onClick={() => setShowMenu(false)}
              className={`absolute inset-0 bg-black/40 transition-opacity ${
                showMenu ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden="true"
            />

            {/* Panel */}
            <aside
              ref={menuRef}
              id="mobile-menu"
              role="dialog"
              aria-modal={showMenu}
              aria-hidden={!showMenu}
              className={`absolute right-0 top-0 bottom-0 w-3/4 sm:w-1/2 bg-white dark:bg-[#121212] transform ${
                showMenu ? "translate-x-0" : "translate-x-full"
              } transition-transform duration-300 overflow-auto border-l dark:border-gray-800`}
            >
              <div className="flex items-center justify-between px-5 py-6">
                <img
                  className="w-32 md:w-36"
                  src={assets.logo}
                  alt="Logo"
                />
                <button
                  className="w-8 h-8 rounded p-1 dark:text-white"
                  onClick={() => setShowMenu(false)}
                  aria-label="Close menu"
                >
                  <img
                    className="w-7 dark:invert"
                    src={assets.cross_icon}
                    alt="Close"
                  />
                </button>
              </div>
              <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100">
                <NavLink onClick={() => setShowMenu(false)} to="/">
                  <p className="px-4 py-2 rounded inline-block">Home</p>
                </NavLink>
                <NavLink onClick={() => setShowMenu(false)} to="/hospitals">
                  <p className="px-4 py-2 rounded inline-block">Hospitals</p>
                </NavLink>
                <NavLink onClick={() => setShowMenu(false)} to="/doctors">
                  <p className="px-4 py-2 rounded inline-block">All Doctors</p>
                </NavLink>
                <NavLink onClick={() => setShowMenu(false)} to="/emergency">
                  <p className="px-4 py-2 rounded inline-block text-red-600 dark:text-red-400 font-semibold">Emergency</p>
                </NavLink>
                <NavLink onClick={() => setShowMenu(false)} to="/about">
                  <p className="px-4 py-2 rounded inline-block">About Us</p>
                </NavLink>
                {!token ? (
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      navigate("/login");
                    }}
                    className="mt-4 bg-[#5f6FFF] text-white px-4 md:px-6 py-2 rounded-full w-full max-w-xs"
                  >
                    Get Started
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      logout();
                    }}
                    className="mt-4 bg-[#5f6FFF] text-white px-4 md:px-6 py-2 rounded-full w-full max-w-xs"
                  >
                    Logout
                  </button>
                )}
              </ul>
            </aside>
          </div>
        </div>

        {/* Mobile search overlay */}
        {showSearchMobile && (
          <div
            ref={mobileSearchPanelRef}
            role="dialog"
            aria-modal={showSearchMobile}
            aria-hidden={!showSearchMobile}
            className="fixed inset-0 z-50 bg-white dark:bg-[#121212] p-4 overflow-auto md:hidden"
          >
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => setShowSearchMobile(false)}
                aria-label="Close search"
                className="p-2 text-gray-700 dark:text-gray-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
              <input
                ref={mobileSearchRef}
                type="text"
                placeholder="Search hospitals, doctors..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSearchResults(e.target.value.trim().length > 0);
                }}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {showSearchResults && searchResults.length > 0 && (
              <div className="flex flex-col gap-2">
                {searchResults.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      handleSearchSelect(
                        item,
                        item.type?.toLowerCase() || (item.availableSlots ? "doctor" : "hospital")
                      );
                      setShowSearchMobile(false);
                    }}
                    className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-200 dark:border-gray-700 last:border-b-0 flex justify-between items-center group"
                  >
                     <div>
                      <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {item.speciality || item.address?.line1 || item.address}
                      </p>
                    </div>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full 
                      ${item.type === 'Doctor' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 
                        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'}`}>
                      {item.type}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar
