class ErrorHandler {
    constructor(defaultMsg = 'Unknown error') {
        this.defaultMsg = defaultMsg;
    }

    serverError(res) {
        this.defaultMsg = 'Server error';
        res.status(404);
        res.send({
            message: this.defaultMsg,
        });
    }

    customError(res, msg = 'Unknown error') {
        this.defaultMsg = msg;
        res.status(404);
        res.send({
            message: this.defaultMsg,
        });
    }
}

const error = new ErrorHandler();

module.exports = error;
