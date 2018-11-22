const startAuthSession = function(req, user) {
    return new Promise((resolve, reject) => {
        req.session.regenerate((err) => {
            if (!err) {
                req.session.user = {
                    email: user.email,
                    name: user.name,
                };
                resolve({
                    email: user.email,
                    name: user.name,
                });
            } else {
                console.log(err);
                reject(new Error('Session generation error'));
            }
        });
    });
};

const accessAuth = function(req, res) {
    let author;
    if (req.method === 'GET') {
        author = req.query.author;
    } else {
        author = req.body.author;
    }
    if (author !== req.session.user.name) {
        res.status(404);
        res.send({
            message: 'Unauthorized user',
        });
        return false;
    }
    return true;
};

module.exports = {
    startAuthSession,
    accessAuth,
};
