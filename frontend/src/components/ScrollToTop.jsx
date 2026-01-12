import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // Smooth scroll to top when path changes
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }, [pathname]);

    useEffect(() => {
        // If the user clicks an internal link that points to the current pathname,
        // force a full reload so the page re-fetches data and gives a clean UX.
        // Also, any element with `data-refresh="true"` or `data-reload="true"`
        // will trigger a reload when clicked.
        const onClick = (e) => {
            let el = e.target;
            while (el && el !== document.body) {
                if (el.dataset && (el.dataset.refresh === 'true' || el.dataset.reload === 'true')) {
                    // allow navigation to happen (if any) then reload shortly after
                    setTimeout(() => window.location.reload(), 50);
                    return;
                }
                if (el.tagName === 'A' && el.href) {
                    try {
                        const url = new URL(el.href);
                        if (url.origin === window.location.origin) {
                            if (url.pathname === window.location.pathname) {
                                // clicking the active route — reload instead of letting
                                // React keep the current state.
                                e.preventDefault();
                                window.location.reload();
                            }
                        }
                    } catch (err) {
                        // ignore malformed URLs
                    }
                    return;
                }
                el = el.parentElement;
            }
        };

        document.addEventListener('click', onClick, true);
        return () => document.removeEventListener('click', onClick, true);
    }, []);

    return null;
};

export default ScrollToTop;
