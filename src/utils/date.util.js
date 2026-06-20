import { format, isValid, parseISO } from 'date-fns'

export const dateNow = () => new Date();

export const isSameDate = (d1, d2)=>{
    if(!d1 || !d2) return false;

    return new Date(d1).toLocaleDateString() === new Date(d2).toLocaleDateString()
}

export const isSameMonth = (date1, date2)=>{
    if(!date1 || !date2) return false;
    let dt1 = new Date(date1);
    let dt2 = new Date(date2);

    return dt1?.getFullYear() === dt2?.getFullYear() && dt1?.getMonth() === dt2?.getMonth()
} 

export const isSameYear = (d1, d2)=>{
    if(!d1 || !d2) return false;
    let dt1 = new Date(d1);
    let dt2 = new Date(d2);

    return dt1?.getFullYear() === dt2?.getFullYear();
} 

export const isInRange = (start, end, date)=>{
    let sdt = new Date(start);
    let edt = new Date(end);
    let dt = new Date(date);

    return sdt?.getTime() <= dt?.getTime() && edt?.getTime() >= dt?.getTime();
}


/**
 * Changes a date into a readable format
 * * @param {Date | String} date 
 * @returns {String}
 */
export function formatDate(date, pattern = 'MMM dd yyy') {
    if (!date) return null;

    const parsed =
        typeof date === 'string'
            ? parseISO(date)
            : new Date(date);


    if (!isValid(parsed)) return null;

    return format(parsed, pattern);
}


// Date Input Helper
export function toInputDate(ts) {
    if(!ts || ts === '') return ''
    const d = new Date(ts);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

export function fromInputDate(dateStr) {
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d, 12).getTime(); // noon
}


export function getMonthRange(month, year) {
    const now = new Date();
    if (year) now.setFullYear(year);
    if (month) now.setMonth(month);

    // Get the first day of the current month
    const start = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get the last day of the current month
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return { start, end };
}

export const getCurrentWeekRange = () => {
    const now = new Date();

    const first = new Date(now);
    first.setDate(now.getDate() - now.getDay()); // Sunday

    const last = new Date(first);
    last.setDate(first.getDate() + 6); // Saturday

    return {
        start: first.getTime(),
        end: last.getTime()
    };
};