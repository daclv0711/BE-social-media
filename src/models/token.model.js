const mongoose = require('mongoose');

const { Schema } = mongoose;
const tokenSchema = new Schema({
    token: {
        type: String,
        required: true
    },
    user_id: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    agent: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 60 * 24 * 7
    }
});

module.exports = mongoose.model('token', tokenSchema);