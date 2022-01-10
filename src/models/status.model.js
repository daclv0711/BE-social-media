const mongoose = require('mongoose');

const { Schema } = mongoose;

const StatusSchema = new Schema({
    status: {
        type: String,
        required: true,
        trim: true
    },
    public: {
        type: String,
    },
    user_id: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: '',
    },
    cloudinary_id: {
        type: String,
    },
    public: {
        type: String,
        default: 'global',
        enum: ['global', 'private', 'friend', 'friends'],
    },
    old_status: [{
        status: {
            type: String,
        },
        update: {
            type: Date,
            default: Date.now
        }

    }],
    likes: {
        type: Array,
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('status', StatusSchema);