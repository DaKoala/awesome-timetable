require('./db');
const mongoose = require('mongoose');
const path = require('path');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const auth = require('./util/auth');

const User = mongoose.model('User');
const Plan = mongoose.model('Plan');
const app = express();
app.use(session({
    secret: 'add session secret here!',
    resave: false,
    saveUninitialized: false,
}));

const apiPath = {
    checkExist: '/user/checkExist',
    register: '/user/register',
    login: '/user/login',
    auth: '/user/auth',
    newPlan: '/plan/new',
    getPlan: '/plan/get',
};

app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    const originName = process.env.NODE_ENV === 'production' ? 'http://linserv1.cims.nyu.edu:38499' : 'http://localhost:8080';
    res.set('Access-Control-Allow-Origin', originName);
    res.set('Access-Control-Allow-Credentials', 'true');
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

app.post(apiPath.login, async (req, res) => {
    const user = req.body;
    const savedUser = await User.findOne({ email: user.email });
    if (!savedUser) {
        res.status(404);
        res.send({
            message: 'User Not Found',
        });
    }
    const match = await bcrypt.compare(user.password, savedUser.pwdHash);
    if (match) {
        const authedUser = await auth.startAuthSession(req, {
            email: savedUser.email,
            name: savedUser.name,
        });
        res.send({
            user: {
                email: authedUser.email,
                name: authedUser.name,
            },
        });
    } else {
        res.status(404);
        res.send({
            message: 'Incorrect email/password',
        });
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
            return;
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

app.get(apiPath.auth, (req, res) => {
    res.json({
        user: req.session.user,
    });
});

app.post(apiPath.newPlan, async (req, res) => {
    if (!auth.accessAuth(req, res)) { return; }

    const plan = req.body;
    const existPlan = await Plan.findOne({ name: plan.name, creator: req.session.user.name });
    if (existPlan) {
        res.status(404);
        res.send({
            message: 'Existing plan',
        });
        return;
    }

    const newPlan = new Plan({
        name: plan.name,
        creator: req.session.user.name,
        createdAt: new Date(),
        schedules: [],
    });
    try {
        const savedPlan = await newPlan.save();
        res.send({
            message: 'ok',
            plan: {
                name: savedPlan.name,
                createdAt: savedPlan.createdAt,
                scheduleCount: savedPlan.schedules.length,
            },
        });
    } catch (e) {
        res.status(404);
        res.send({
            message: 'Server error',
        });
    }
});

app.get(apiPath.getPlan, async (req, res) => {
    if (!auth.accessAuth(req, res)) { return; }

    try {
        const plans = await Plan.find({ creator: req.session.user.name });
        res.json(plans);
    } catch (e) {
        res.status(404);
        res.send({
            message: 'Server error',
        });
    }
});

app.listen(process.env.PORT || 3000);
