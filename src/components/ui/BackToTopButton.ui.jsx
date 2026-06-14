import React, { useState, useEffect, useMemo } from 'react';

function BackToTop({ }) {
    const [isVisible, setIsVisible] = useState(false);

    // Monitor window scroll position
    useEffect(() => {

        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);

        // Clean up event listener on unmount
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    // Smooth scroll back to the top of the document
    const scrollToTop = () => {

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <div style={{opacity: isVisible ? 1 : 0, pointerEvents: 'none',}} className='position-fixed bottom-0 end-0 start-0 d-flex align-items-center justify-content-center'>
            <button
                type="button"
                onClick={scrollToTop}
                className={`btn bg-black bg-opacity-50 text-white rounded-circle d-flex align-items-center justify-content-center m-4 shadow-lg transition-all`}
                style={{
                    width: '50px',
                    height: '50px',
                    zIndex: 1050,
                    transform: isVisible ? 'scale(1)' : 'scale(0.8)',
                    pointerEvents: isVisible ? 'auto' : 'none',
                    transition: 'opacity 0.3s ease, transform 0.3s ease, background-color 0.2s ease',
                }}
                aria-label="Scroll to top"
            >
                <i className="bi bi-arrow-up-short fs-3 line-height-0"></i>
            </button>
        </div>
    );
}

export default BackToTop;