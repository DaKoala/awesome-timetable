require('./db');
const mongoose = require('mongoose');
const path = require('path');
const express = require('express');

const User = mongoose.model('User');
const app = express();
const apiPath = {
    checkEmail: '/user/checkemail',
    checkName: '/user/checkname',
};

app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    next();
});

app.use(express.static(path.resolve(__dirname, 'dist')));

app.get(apiPath.checkEmail, async (req, res) => {
    const { email } = req.query;
    try {
        const result = await User.findOne({ email });
        res.json({
            valid: !!result,
        });
    } catch (e) {
        console.log(e);
        res.status(404);
        res.send(e);
    }
});

app.get(apiPath.checkName, async (req, res) => {
    const { name } = req.query;
    try {
        const result = await User.findOne({ name });
        if (result) {
            res.json({
                valid: !result,
            });
        }
    } catch (e) {
        console.log(e);
        res.status(404);
        res.send(e);
    }
});

app.listen(3000);
