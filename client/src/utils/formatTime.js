import { format, getTime, formatDistanceToNow } from 'date-fns';

// ----------------------------------------------------------------------

export function fDate(date) {
    return format(new Date(date), 'dd MMMM yyyy');
}

export function fDateTime(date) {
    return format(new Date(date), 'dd MMM yyyy HH:mm');
}

export function fTimestamp(date) {
    return getTime(new Date(date));
}

export function fDateTimeSuffix(date) {
    return format(new Date(date), 'dd/MM/yyyy hh:mm');
}

export function fToNow(date) {
    return formatDistanceToNow(new Date(date), {
        addSuffix: true,
    });
}

export function formatDate(isoTime) {
    const date = new Date(isoTime);
    const now = new Date();

    const diffInSeconds = Math.floor((now - date) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInYears = Math.floor(diffInDays / 365);

    if (diffInYears > 0) {
        return date.toLocaleDateString(); // format: "month/day/year"
    } else if (diffInWeeks > 0) {
        const options = { month: 'long', day: 'numeric' };
        return date.toLocaleDateString(undefined, options); // format: "month day"
    } else if (diffInDays > 0) {
        return date.toLocaleDateString(undefined, { weekday: 'long' }); // format: "weekday"
    } else {
        return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false }); // format: "hour:minute"
    }
}
