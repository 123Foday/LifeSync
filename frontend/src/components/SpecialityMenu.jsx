import { useState, useRef, useEffect } from 'react'
import { specialityData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const SpecialityMenu = () => {
  const [selectedSpeciality, setSelectedSpeciality] = useState('')
  const navigate = useNavigate()
  const navRef = useRef(null)
  const itemRefs = useRef([])
  const [hoverIndex, setHoverIndex] = useState(null)
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 })

  const updateIndicator = (index) => {
    const ul = navRef.current
    const el = itemRefs.current[index]
    if (!ul || !el) return setIndicator({ left: 0, width: 0, opacity: 0 })

    const ulRect = ul.getBoundingClientRect()
    const elRect = el.getBoundingClientRect()
    const horizontalInset = 8
    const left = Math.round(elRect.left - ulRect.left + (ul.scrollLeft || 0) + horizontalInset)
    const width = Math.max(24, Math.round(elRect.width - horizontalInset * 2))
    setIndicator({ left, width, opacity: 1 })
  }

  useEffect(() => {
    const activeIndex = specialityData.findIndex((i) => i.speciality === selectedSpeciality)
    const target = hoverIndex !== null ? hoverIndex : activeIndex
    if (target >= 0) updateIndicator(target)
    else setIndicator({ left: 0, width: 0, opacity: 0 })

    const onResize = () => {
      const newActive = specialityData.findIndex((i) => i.speciality === selectedSpeciality)
      const t = hoverIndex !== null ? hoverIndex : newActive
      if (t >= 0) updateIndicator(t)
    }

    const ul = navRef.current
    const onScroll = () => {
      const t = hoverIndex !== null ? hoverIndex : specialityData.findIndex((i) => i.speciality === selectedSpeciality)
      if (t >= 0) updateIndicator(t)
    }

    window.addEventListener('resize', onResize)
    if (ul) ul.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('resize', onResize)
      if (ul) ul.removeEventListener('scroll', onScroll)
    }
  }, [hoverIndex, selectedSpeciality])

  return (
    <section id="speciality" className="py-12 text-gray-800">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col gap-4 items-center">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold">Find Doctors by Speciality</h2>
            <p className="text-sm text-gray-600 mt-1 sm:w-[520px]">Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free</p>
          </div>

          <nav aria-label="Doctor specialities" className="w-full">
            <div className="flex justify-center">
              <ul ref={navRef} className="flex gap-3 overflow-x-auto no-scrollbar py-2 px-1 snap-x snap-mandatory justify-center">
                {/* ALL at index 0 */}
                <li className="flex-shrink-0 snap-start" ref={(el) => (itemRefs.current[0] = el)} onMouseEnter={() => setHoverIndex(0)} onMouseLeave={() => setHoverIndex(null)}>
                  <button
                    type="button"
                    tabIndex={0}
                    aria-label="Show all specialities"
                    onFocus={() => setHoverIndex(0)}
                    onBlur={() => setTimeout(() => setHoverIndex(null), 80)}
                    aria-pressed={!selectedSpeciality}
                    onClick={() => { setSelectedSpeciality(''); navigate('/doctors'); window.scrollTo(0,0) }}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 ${!selectedSpeciality ? 'bg-[#5f6FFF] text-white shadow-md' : 'bg-white text-gray-700 hover:bg-blue-50'} border border-gray-200`}
                  >
                    <span className="truncate">ALL</span>
                  </button>
                </li>

                {specialityData.map((item, index) => {
                  const mappedIndex = index + 1
                  const isActive = selectedSpeciality === item.speciality

                  return (
                    <li key={index} className="flex-shrink-0 snap-start" ref={(el) => (itemRefs.current[mappedIndex] = el)} onMouseEnter={() => setHoverIndex(mappedIndex)} onMouseLeave={() => setHoverIndex(null)}>
                      <button
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => {
                          setSelectedSpeciality(item.speciality)
                          navigate(`/doctors/${item.speciality}`)
                          window.scrollTo(0, 0)
                        }}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 ${isActive ? 'bg-[#5f6FFF] text-white shadow-md' : 'bg-white text-gray-700 hover:bg-blue-50'} border border-gray-200`}
                      >
                        <span className="text-base">{item.emoji || ''}</span>
                        <span className="truncate">{item.speciality}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>

            <div style={{ position: 'relative', height: 12 }}>
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: indicator.left + 'px',
                  width: indicator.width + 'px',
                  height: '4px',
                  background: '#5f6FFF',
                  borderRadius: '9999px',
                  transition: 'left 220ms ease, width 220ms ease, opacity 180ms ease',
                  opacity: indicator.opacity,
                  pointerEvents: 'none'
                }}
              />
            </div>
          </nav>
        </div>
      </div>
    </section>
  )
}

export default SpecialityMenu
