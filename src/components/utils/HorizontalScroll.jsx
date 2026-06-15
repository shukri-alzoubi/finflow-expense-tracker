import { useRef } from 'react';

const HorizontalScroll = ({ children, className, scrollButtonClassName = 'btn-hover ' }) => {
    const listRef = useRef(null);

    const scrollBy = (amount) => {
        if (!listRef.current) return;

        listRef.current.scrollBy({
            left: amount,
            behavior: 'smooth',
        });
    };

    return (<div className={` d-flex gap-3 ${className}`}>
        
        <button className={`btn bg-body-secondary rounded border-0 ${scrollButtonClassName}`} type='button' onClick={() => scrollBy(-100)}>
            <i className="bi bi-chevron-left"></i>
        </button>

        <div className="v-scroll-content flex-grow-1 d-flex gap-3" ref={listRef}>
            {children}
        </div>

        <button className={`btn bg-body-secondary rounded border-0 ${scrollButtonClassName}`} type='button' onClick={() => scrollBy(100)}>
            <i className="bi bi-chevron-right"></i>
        </button>
    </div>);
}

export default HorizontalScroll;