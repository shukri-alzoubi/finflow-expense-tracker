import React, { useState, useRef, useEffect, useMemo } from 'react';

const DatePicker = ({
    value,
    onChange,
    nullable = true,
    placeholder,
    autoClose = false,
    tailing,
    className,
    children
}) => {
    
    const [showCalendar, setShowCalendar] = useState(false);
    const [viewDate, setViewDate] = useState(new Date()); // The month we are looking at
    const calendarRef = useRef(null);

    useEffect(() => {
        setViewDate(new Date(value ?? Date.now()))
    }, [showCalendar])

    // Close calendar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                setShowCalendar(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedDate = useMemo(() => {
        if (!value || new Date(value).toString() === 'Invalid Date') return nullable ? null : new Date();

        return new Date(value);
    }, [value])

    const setSelectedDate = (date) => {
        if (onChange) onChange(!date ? date : date.getTime());
        setShowCalendar(false);
    }

    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const handlePrevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1));
    const handleNextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1));

    const selectDay = (day) => {
        const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        setSelectedDate(newDate);
    };

    const renderDays = () => {
        const totalDays = daysInMonth(viewDate.getFullYear(), viewDate.getMonth());
        const startDay = firstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());
        const days = [];

        // Blank spaces for previous month's trailing days
        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} className="p-2"></div>);
        }

        // Actual days
        for (let d = 1; d <= totalDays; d++) {
            const isToday = new Date().toDateString() === new Date(viewDate.getFullYear(), viewDate.getMonth(), d).toDateString();
            const isSelected = selectedDate?.toDateString() === new Date(viewDate.getFullYear(), viewDate.getMonth(), d).toDateString();

            days.push(
                <button
                    onClick={() => selectDay(d)} type='button'
                    className={`btn btn-sm calendar-day rounded-circle ${isSelected ? 'active' : 'btn-body'} ${isToday && 'today'}`}
                    key={d}>
                    {d}
                </button>
            );
        }
        return days;
    };

    return (
        <div className="position-relative" ref={calendarRef} style={{ width: '100%' }}>
            {children ? <div onClick={() => setShowCalendar(!showCalendar)}>{children}</div> :
                <div className="input-group" onClick={() => setShowCalendar(!showCalendar)}>
                    <span className="input-group-text">
                        <i className="bi bi-calendar3"></i>
                    </span>
                    <input
                        type="text"
                        className={`form-control ${className}`}
                        readOnly
                        value={selectedDate ? selectedDate.toLocaleDateString() : placeholder ?? "Select Date"}
                        style={{ cursor: 'pointer' }}
                    />

                    {/* Clear */}
                    {nullable && <span
                        className="input-group-text text-danger-emphasis pointer"
                        onClick={(e) => { e.stopPropagation(); setSelectedDate(null); setShowCalendar(false) }}>
                        <i className="bi bi-x-lg"></i>
                    </span>}

                    {tailing && <span className='input-group-text'>{tailing}</span>}
                </div>}

            {(
                <div
                    className={`custom-datepicker-popup-container d-flex justify-content-center align-items-center ${showCalendar && 'show'}`}
                    onClick={(e) => setShowCalendar(false)}>
                    <div
                        className="custom-datepicker-popup shadow-lg rounded border border-secondary p-3"
                        onClick={(e) => e.stopPropagation()}>
                        {/* Header */}
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <button type='button' onClick={handlePrevMonth} className="btn btn-sm btn-outline-secondary border-0">
                                <i className="bi bi-chevron-left"></i>
                            </button>
                            <h6 className="mb-0 fw-bold text-body">
                                {viewDate.toLocaleString('default', { month: 'long' })} {viewDate.getFullYear()}
                            </h6>
                            <button type='button' onClick={handleNextMonth} className="btn btn-sm btn-outline-secondary border-0">
                                <i className="bi bi-chevron-right"></i>
                            </button>
                        </div>

                        {/* Weekday Names */}
                        <div className="calendar-grid text-secondary mb-1 fw-bold" style={{ fontSize: '0.75rem' }}>
                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d}>{d}</div>)}
                        </div>

                        {/* Days Grid */}
                        <div className="calendar-grid">
                            {renderDays()}
                        </div>

                        <div className='text-end'>
                            <button
                                type='button'
                                className="btn btn-sm border-0 text-secondary"
                                onClick={() => setSelectedDate(new Date())}>Today</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DatePicker;