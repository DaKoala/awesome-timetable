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

const PlanSchema = new Schema({
    creator: {
        required: true,
        type: String,
    },
    name: {
        required: true,
        type: String,
    },
    createdAt: {
        required: true,
        type: Date,
    },
    events: [ObjectId],
});

const EventSchema = new Schema({
    creator: {
        required: true,
        type: String,
    },
    plan: {
        required: true,
        type: String,
    },
    name: {
        required: true,
        type: String,
    },
    location: {
        type: String,
    },
    date: {
        required: true,
        type: Array,
        validate: {
            validator: (value) => {
                const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                if (value.length > 7 || value.length < 1) {
                    return false;
                }
                return value.reduce((acc, day) => acc && days.includes(day), true);
            },
        },
    },
    fromTime: {
        required: true,
        type: Array,
        validate: {
            validator: (value) => {
                const [hour, minute] = value;
                return !(value.length !== 2 || hour < 0 || hour > 23 || minute < 0 || minute > 59);
            },
        },
    },
    toTime: {
        required: true,
        type: Array,
        validate: {
            validator: (value) => {
                const [hour, minute] = value;
                return !(value.length !== 2 || hour < 0 || hour > 23 || minute < 0 || minute > 59);
            },
        },
    },
});

mongoose.model('User', UserSchema);
mongoose.model('Plan', PlanSchema);
mongoose.model('Event', EventSchema);

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
