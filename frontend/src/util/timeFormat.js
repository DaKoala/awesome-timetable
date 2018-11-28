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

export default dateToString;
