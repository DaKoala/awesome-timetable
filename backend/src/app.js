require('./db');
const mongoose = require('mongoose');
const path = require('path');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const auth = require('./util/auth');

const User = mongoose.model('User');
const app = express();
app.use(session({
    secret: 'add session secret here!',
    resave: false,
    saveUninitialized: true,
}));
const apiPath = {
    checkExist: '/user/checkExist',
    register: '/user/register',
};

app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    next();
});

app.use(express.static(path.resolve(__dirname, 'dist')));

app.get(apiPath.checkExist, async (req, res) => {
    const { email, name } = req.query;
    try {
        let result;
        if (email) {
            result = await User.findOne({ email });
        } else {
            result = await User.findOne({ name });
        }
        res.json({
            valid: !result,
        });
    } catch (e) {
        console.log(e);
        res.status(404);
        res.send(e);
    }
});

app.post(apiPath.register, async (req, res) => {
    const user = req.body;
    try {
        const email = await User.findOne({ email: user.email });
        const name = await User.findOne({ name: user.name });
        if (email || name) {
            res.status(404);
            res.json({
                message: 'Existing user',
            });
        }
        const hash = await bcrypt.hash(user.password, 6);
        const newUser = new User({
            email: user.email,
            pwdHash: hash,
            name: user.name,
            schedules: [],
        });
        const newUserSaved = await newUser.save();
        await auth.startAuthSession(req, newUserSaved);
        res.json({
            message: 'success',
            user: {
                email: newUserSaved.email,
                name: newUserSaved.name,
            },
        });
    } catch (e) {
        console.log(e);
        res.status(404);
        res.json({
            message: 'Database error',
        });
    }
});

app.listen(process.env.PORT || 3000);
