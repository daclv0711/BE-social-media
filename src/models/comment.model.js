const mongoose = require('mongoose');

const { Schema } = mongoose;

const CommentSchema = new Schema({
    comment: {
        type: String,
        required: true,
        trim: true,
    },
    user_id: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    old_comment: [{
        comment: {
            type: String,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    }],
    likes: {
        type: Array,
        default: [],
    },
    status_id: {
        type: mongoose.Types.ObjectId,
        required: true,
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('comments', CommentSchema);