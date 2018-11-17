const startAuthSession = function(req, user) {
    return new Promise((resolve, reject) => {
        req.session.regenerate((err) => {
            if (!err) {
                req.session.user = {
                    email: user.email,
                    name: user.name,
                };
                resolve();
            } else {
                console.log(err);
                reject(new Error('Session generation error'));
            }
        });
    });
};

module.exports = {
    startAuthSession,
};
