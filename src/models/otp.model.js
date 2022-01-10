const mongoose = require('mongoose');

const { Schema } = mongoose;

const otpSchema = new Schema({
    otp: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true,
    },
    agent: {
        type: String,
        required: true
    },
    createAt: {
        type: Date,
        default: Date.now,
        expires: 300
    },
});

module.exports = mongoose.model('otp', otpSchema);