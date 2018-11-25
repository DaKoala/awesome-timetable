function serverError(res) {
    res.status(404);
    res.send({
        message: 'Server error',
    });
}

function customError(res, msg = 'Unknown error') {
    res.status(404);
    res.send({
        message: msg,
    });
}

module.exports = {
    serverError,
    customError,
};
