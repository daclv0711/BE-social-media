const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    first_name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 8,
    },
    last_name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 8,
    },
    avatar: {
        type: String,
        trim: true,
        default: '',
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        default: '',
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    cloudinary_id: {
        type: String,
        trim: true,
        default: '',
    },
    role: {
        type: Number,
        default: 2,
        enum: [0, 1, 2],
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('users', UserSchema);