const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//User schema
const UserSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    permission_level: {
        type: String,
        enum: ['REGULAR', 'MANAGER', 'ADMIN'],
        required: true
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;