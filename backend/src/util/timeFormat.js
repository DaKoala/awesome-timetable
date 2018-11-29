function stringTimeToArray(strTime) {
    return strTime.split(':').map(item => parseInt(item, 10));
}

module.exports = {
    stringTimeToArray,
};
