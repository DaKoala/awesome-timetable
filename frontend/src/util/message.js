function popupMessage(app, res, type = 'error') {
    app.$message({
        message: res.data.message,
        type,
    });
}

export default popupMessage;
