require('./db');
const mongoose = require('mongoose');
const path = require('path');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const auth = require('./util/auth');
const error = require('./util/error');
const clean = require('./util/clean');
const timeFormat = require('./util/timeFormat');

const User = mongoose.model('User');
const Plan = mongoose.model('Plan');
const Event = mongoose.model('Event');
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
    logout: '/user/logout',
    auth: '/user/auth',
    newPlan: '/plan/new',
    getAllPlan: '/plan/getAll',
    getPlan: '/plan/get',
    editPlanName: '/plan/editName',
    deletePlan: '/plan/delete',
    newEvent: '/event/new',
    deleteEvent: '/event/delete',
    updateEvent: '/event/update',
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
        error.serverError(res);
    }
});

app.post(apiPath.login, async (req, res) => {
    const user = req.body;
    try {
        const savedUser = await User.findOne({ email: user.email });
        if (!savedUser) {
            error.customError(res, 'User not found');
            return;
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
            error.customError(res, 'Incorrect email/password');
        }
    } catch (e) {
        console.log(e);
        error.serverError(res);
    }
});

app.get(apiPath.logout, (req, res) => {
    if (!auth.accessAuth(req, res)) { return; }

    req.session.regenerate((err) => {
        if (!err) {
            res.send({
                message: 'success',
            });
        } else {
            error.serverError(res);
        }
    });
});

app.post(apiPath.register, async (req, res) => {
    const user = req.body;
    try {
        const email = await User.findOne({ email: user.email });
        const name = await User.findOne({ name: user.name });
        if (email || name) {
            error.customError(res, 'Existing user');
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
        error.serverError(res);
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
    const existPlan = await Plan.findOne({
        name: plan.name,
        creator: auth.getUsernameFromSession(req),
    });
    if (existPlan) {
        error.customError(res, 'Existing plan');
        return;
    }

    const newPlan = new Plan({
        name: plan.name,
        creator: auth.getUsernameFromSession(req),
        createdAt: new Date(),
        events: [],
    });
    try {
        const savedPlan = await newPlan.save();
        res.send({
            message: 'ok',
            plan: {
                name: savedPlan.name,
                createdAt: savedPlan.createdAt,
                eventsCount: savedPlan.events.length,
            },
        });
    } catch (e) {
        error.serverError(res);
    }
});

app.get(apiPath.getAllPlan, async (req, res) => {
    if (!auth.accessAuth(req, res)) { return; }

    try {
        const plans = await Plan.find({ creator: auth.getUsernameFromSession(req) });
        const cleanPlans = plans.map(item => ({
            name: item.name,
            creator: item.creator,
            createdAt: item.createdAt,
            eventsCount: item.events.length,
        }));
        res.json(cleanPlans);
    } catch (e) {
        error.serverError(res);
    }
});

app.get(apiPath.getPlan, async (req, res) => {
    if (!auth.accessAuth(req, res)) { return; }

    try {
        const user = auth.getUsernameFromSession(req);
        const planName = req.query.planName;
        const plan = await Plan.findOne({ creator: user, name: planName });
        const events = await Event.find({ creator: user, plan: planName });
        const cleanEvents = events.map(clean.cleanSavedEvent);
        res.send({
            events: cleanEvents,
            message: 'ok',
            plan: {
                name: plan.name,
                creator: plan.creator,
            },
        });
    } catch (e) {
        console.log(e);
        error.serverError(res);
    }
});

app.post(apiPath.editPlanName, async (req, res) => {
    if (!auth.accessAuth(req, res)) { return; }

    const { oldName, newName } = req.body;
    const creator = auth.getUsernameFromSession(req);
    try {
        await Event.updateMany({ creator, plan: oldName }, {
            $set: { plan: newName },
        });
        await Plan.update({ creator, name: oldName }, {
            $set: { name: newName },
        });
        res.send({
            message: 'Plan name edited successfully',
        });
    } catch (e) {
        error.serverError(res);
    }
});

app.post(apiPath.newEvent, async (req, res) => {
    if (!auth.accessAuth(req, res)) { return; }

    const form = req.body;
    const creator = auth.getUsernameFromSession(req);
    try {
        const existEvent = await Event.findOne({
            creator,
            plan: form.planName,
            name: form.name,
        });
        if (existEvent) {
            error.customError(res, 'Existing event');
            return;
        }
        const cleanEvent = new Event({
            creator: form.author,
            plan: form.planName,
            name: form.name,
            location: form.location,
            date: form.date.split(','),
            fromTime: timeFormat.stringTimeToArray(form.fromTime),
            toTime: timeFormat.stringTimeToArray(form.toTime),
        });
        const savedEvent = await cleanEvent.save();
        await Plan.updateOne({ creator: savedEvent.creator, name: savedEvent.plan }, {
            $push: { events: savedEvent._id },
        });
        res.send(clean.cleanSavedEvent(savedEvent));
    } catch (e) {
        console.log(e);
        error.serverError(res);
    }
});

app.get(apiPath.deletePlan, async (req, res) => {
    if (!auth.accessAuth(req, res)) { return; }

    try {
        const { planName } = req.query;
        const username = auth.getUsernameFromSession(req);
        await Event.deleteMany({ plan: planName, creator: username });
        await Plan.deleteOne({ name: planName, creator: username });
        res.send({
            message: 'Plan has been deleted',
        });
    } catch (e) {
        error.serverError(res);
    }
});

app.get(apiPath.deleteEvent, async (req, res) => {
    if (!auth.accessAuth(req, res)) { return; }

    const eventFeatures = {
        creator: auth.getUsernameFromSession(req),
        plan: req.query.planName,
        name: req.query.eventName,
    };
    try {
        const eventInDb = await Event.findOne(eventFeatures);
        await Plan.update({ creator: auth.getUsernameFromSession(req), name: req.query.planName }, {
            $pull: { events: eventInDb._id },
        });
        await Event.deleteOne(eventFeatures);
        res.send({
            message: 'Event deleted',
        });
    } catch (e) {
        error.serverError(res);
    }
});

app.post(apiPath.updateEvent, async (req, res) => {
    if (!auth.accessAuth(req, res)) { return; }

    const form = req.body;
    const creator = auth.getUsernameFromSession(req);
    const modification = {
        name: form.newName,
        location: form.location,
        fromTime: timeFormat.stringTimeToArray(form.fromTime),
        toTime: timeFormat.stringTimeToArray(form.toTime),
        date: form.date.split(','),
    };
    try {
        await Event.update({ creator, plan: form.planName, name: form.oldName }, {
            $set: modification,
        });
        res.send(modification);
    } catch (e) {
        error.serverError(res);
    }
});

app.listen(process.env.PORT || 3000);
