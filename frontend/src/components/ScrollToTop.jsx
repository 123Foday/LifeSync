import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop Component
 * 
 * This component scrolls the window to the top whenever the route changes.
 * It ensures a clean UX by starting each page at the top rather than
 * maintaining the scroll position from the previous page.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to the top of the page on route change
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // Use 'instant' for immediate scroll, 'smooth' for animated scroll
    });
  }, [pathname]);

  return null; // This component doesn't render anything
};

export default ScrollToTop;
