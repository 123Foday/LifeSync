import PropTypes from 'prop-types'
import { categoryData } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from 'react'

const CategoryMenu = ({ selectedCategory, onSelectCategory }) => {
  const navigate = useNavigate();
  const navRef = useRef(null)
  const itemRefs = useRef([])
  const [hoverIndex, setHoverIndex] = useState(null)
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 })

  const updateIndicator = (index) => {
    const ul = navRef.current
    const el = itemRefs.current[index]
    if (!ul || !el) return setIndicator({ left: 0, width: 0, opacity: 0 })

    // compute left relative to the nav container (ul) using bounding rects
    const ulRect = ul.getBoundingClientRect()
    const elRect = el.getBoundingClientRect()
    const horizontalInset = 8
    const left = Math.round(elRect.left - ulRect.left + (ul.scrollLeft || 0) + horizontalInset)
    const width = Math.max(24, Math.round(elRect.width - horizontalInset * 2))
    setIndicator({ left, width, opacity: 1 })
  }

  useEffect(() => {
    const activeIndex = categoryData.findIndex((i) => i.speciality === selectedCategory)
    const target = hoverIndex !== null ? hoverIndex : activeIndex
    if (target >= 0) updateIndicator(target)
    else setIndicator({ left: 0, width: 0, opacity: 0 })

    const onResize = () => {
      const newActive = categoryData.findIndex((i) => i.speciality === selectedCategory)
      const t = hoverIndex !== null ? hoverIndex : newActive
      if (t >= 0) updateIndicator(t)
    }

    const ul = navRef.current
    const onScroll = () => {
      const t = hoverIndex !== null ? hoverIndex : categoryData.findIndex((i) => i.speciality === selectedCategory)
      if (t >= 0) updateIndicator(t)
    }

    window.addEventListener('resize', onResize)
    if (ul) ul.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('resize', onResize)
      if (ul) ul.removeEventListener('scroll', onScroll)
    }
  }, [hoverIndex, selectedCategory])

  return (
    <section id="speciality" className="py-8 sm:py-10 md:py-12 text-gray-800 dark:text-gray-100">
      <div className="container px-4 sm:px-6">
        <div className="flex flex-col gap-3 sm:gap-4 items-center">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold">Find Hospitals by Category</h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 sm:mt-2 w-full sm:w-[90%] md:w-[520px] px-4 sm:px-0">Browse trusted hospitals by category and jump straight to the list — fast, simple, and user-friendly.</p>
          </div>

          {/* Centered text navbar - horizontally scrollable on small screens */}
          <nav aria-label="Hospital categories" className="w-full">
            <div className="flex justify-start">
              <ul
                ref={navRef}
                className="flex gap-3 overflow-x-auto no-scrollbar py-2 px-1 snap-x snap-mandatory"
                style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-x' }}
              >
                {/* All button as default (index 0) */}
                <li className="flex-shrink-0 snap-start" ref={(el) => (itemRefs.current[0] = el)} onMouseEnter={() => setHoverIndex(0)} onMouseLeave={() => setHoverIndex(null)}>
                  <button
                    type="button"
                    tabIndex={0}
                    aria-label="Show all categories"
                    onFocus={() => setHoverIndex(0)}
                    onBlur={() => setTimeout(() => setHoverIndex(null), 80)}
                    aria-pressed={!selectedCategory}
                    onClick={() => { if (typeof onSelectCategory === 'function') { onSelectCategory('') } else { navigate('/hospitals'); window.scrollTo(0, 0) } }}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 ${!selectedCategory ? 'bg-[#5f6FFF] text-white shadow-md' : 'bg-white dark:bg-black text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-zinc-900'} border border-gray-200 dark:border-gray-700`}
                  >
                    <span className="truncate">ALL</span>
                  </button>
                </li>

                {categoryData.map((item, index) => {
                  const mappedIndex = index + 1 // account for ALL at 0
                  const isActive = selectedCategory
                    ? selectedCategory === item.speciality
                    : false;

                  return (
                    <li key={index} className="flex-shrink-0 snap-start" ref={(el) => (itemRefs.current[mappedIndex] = el)} onMouseEnter={() => setHoverIndex(mappedIndex)} onMouseLeave={() => setHoverIndex(null)}>
                      <button
                        type="button"
                        tabIndex={0}
                        aria-label={`Filter ${item.speciality}`}
                        onFocus={() => setHoverIndex(mappedIndex)}
                        onBlur={() => setTimeout(() => setHoverIndex(null), 80)}
                        aria-pressed={isActive}
                        onClick={() => {
                          if (typeof onSelectCategory === 'function') {
                            onSelectCategory(item.speciality);
                          } else {
                            navigate(`/hospitals/${item.speciality}`);
                            window.scrollTo(0, 0);
                          }
                        }}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 ${isActive ? 'bg-[#5f6FFF] text-white shadow-md' : 'bg-white dark:bg-black text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-zinc-900'} border border-gray-200 dark:border-gray-700`}
                      >
                        <span className="hidden sm:inline-block text-xs text-gray-400 dark:text-gray-500">{item.emoji || ''}</span>
                        <span className="truncate">{item.speciality}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Moving underline indicator */}
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
  );
};

export default CategoryMenu;

CategoryMenu.propTypes = {
  selectedCategory: PropTypes.string,
  onSelectCategory: PropTypes.func,
}
