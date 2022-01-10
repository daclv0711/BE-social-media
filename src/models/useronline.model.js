const mongoose = require('mongoose');

const { Schema } = mongoose;

const userOnlineSchema = new Schema({
    user_id: {
        type: String,
        required: true,
        unique: true,
    },
    user_name: {
        type: String,
    },
    avatar: {
        type: String,
    },
    online: {
        type: Boolean,
    },
    lastOnline: {
        type: Date,
        expires: 86400,
    },
})

userOnlineSchema.statics.findOneOrCreate = async function (condition, doc) {
    const userOnline = await this.findOne(condition);
    if (!userOnline) {
        return await this.create(doc);
    }
    userOnline.online = true;
    userOnline.lastOnline = null;
    return await userOnline.save();
}

module.exports = mongoose.model('user_online', userOnlineSchema);