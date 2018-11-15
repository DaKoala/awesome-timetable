const mongoose = require('mongoose');

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

mongoose.connect('mongodb://localhost/awesome');
