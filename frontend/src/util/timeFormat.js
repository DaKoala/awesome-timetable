function dateToString(d) {
    const date = new Date(d);
    const year = String(date.getFullYear());
    const month = String(date.getMonth() + 1);
    const day = String(date.getDate());
    const result = [];
    result.push(year);
    result.push(month.length < 2 ? `0${month}` : month);
    result.push(day.length < 2 ? `0${day}` : day);
    return result.join('-');
}

function arrayTimeToString([hour, minute]) {
    const hourString = String(hour).length > 1 ? String(hour) : `0${hour}`;
    const minuteString = String(minute).length > 1 ? String(minute) : `0${minute}`;
    return `${hourString}:${minuteString}`;
}

export {
    dateToString,
    arrayTimeToString,
};
