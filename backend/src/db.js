const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const { Schema } = mongoose;
const { ObjectId } = Schema;

const UserSchema = new Schema({
    email: {
        unique: true,
        required: true,
        type: String,
        match: /^.+@.+\..+$/,
    },
    pwdHash: {
        required: true,
        type: String,
        unique: true,
    },
    name: {
        required: true,
        type: String,
        unique: true,
        minLength: 4,
        maxLength: 16,
    },
    schedules: [ObjectId],
});

mongoose.model('User', UserSchema);

let dbconf;
if (process.env.NODE_ENV === 'production') {
    const fn = path.join(__dirname, 'dbconfig.json');
    const data = fs.readFileSync(fn);
    const conf = JSON.parse(data);
    dbconf = conf.dbconf;
} else {
    dbconf = 'mongodb://localhost/awesome';
}

mongoose.connect(dbconf);
