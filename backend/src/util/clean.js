function cleanSavedEvent(event) {
    return {
        name: event.name,
        location: event.location,
        date: event.date,
        fromTime: event.fromTime,
        toTime: event.toTime,
    };
}

module.exports = {
    cleanSavedEvent,
};
