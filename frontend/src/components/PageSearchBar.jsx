import React, { useContext, useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import Fuse from 'fuse.js'
import { Search } from 'lucide-react'

const PageSearchBar = () => {
  const navigate = useNavigate();
  const { hospitals = [], doctors = [] } = useContext(AppContext)
  
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

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
      setShowResults(true)
    } else {
      setSearchResults([])
      setShowResults(false)
    }
  }, [debouncedTerm, fuse])

  const handleSearchSelect = (item, type) => {
    setSearchTerm('')
    setShowResults(false)
    // Navigate using ID
    if (type === 'hospital' || type === 'doctor') {
      navigate(`/appointment/${item._id}`)
    }
    window.scrollTo(0, 0)
  }

  // Handle Search Button Click
  const handleSearchClick = () => {
    if (searchResults.length > 0) {
      // If results exist, pick first or just show results
      setShowResults(true);
    } else {
       // Maybe navigate to a search results page? specialized search?
       // For now, focus input
       setShowResults(true);
    }
  }

  return (
    <div className="hidden xl:block sticky top-0 z-40 py-4 bg-white/80 dark:bg-black/80 backdrop-blur-md transition-colors duration-500 border-b border-gray-100 dark:border-gray-800">
      <div className="relative max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12">
        <div className="relative max-w-2xl mx-auto">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
             <Search size={22} />
          </div>
          <input
            type="text"
            placeholder="Search for doctors, hospitals, specialities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setShowResults(searchTerm.trim().length > 0)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
            className="w-full pl-14 pr-32 py-4 bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-gray-700 rounded-full shadow-sm hover:shadow-md focus:shadow-lg focus:border-[#5f6FFF] dark:focus:border-[#5f6FFF] outline-none transition-all text-gray-700 dark:text-gray-200 text-base"
          />
          <button 
            onClick={handleSearchClick}
            className="absolute right-2 top-2 bottom-2 bg-[#5f6FFF] text-white px-6 rounded-full font-medium hover:bg-[#4b58e6] transition-colors shadow-md"
          >
            Search
          </button>
        </div>

        {/* Results Dropdown */}
        {showResults && searchResults.length > 0 && (
          <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl z-50 max-h-96 overflow-y-auto animate-fade-in-up">
            <div className="p-2">
              {searchResults.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSearchSelect(item, item.type?.toLowerCase())}
                  className="px-4 py-4 hover:bg-gray-50 dark:hover:bg-zinc-800/50 rounded-xl cursor-pointer flex justify-between items-center group transition-colors border-b border-gray-50 dark:border-gray-800/50 last:border-0"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm ${
                      item.type === 'Doctor' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'bg-green-50 dark:bg-green-900/20 text-green-600'
                    }`}>
                      {item.image ? (
                        <img src={item.image} alt="" className="w-12 h-12 rounded-full object-cover" />
                      ) : (
                        <span className="font-bold text-lg">{item.type?.[0]}</span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100 text-base group-hover:text-[#5f6FFF] transition-colors">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {item.speciality || item.address?.line1 || item.address}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs uppercase font-bold px-3 py-1 rounded-full 
                    ${item.type === 'Doctor' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 
                      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'}`}>
                    {item.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PageSearchBar
