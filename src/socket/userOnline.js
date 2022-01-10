const userOnlineModel = require("../models/useronline.model");

const userOnline = {
    handleUserOnline: async (client, io, data) => {
        try {
            const newUser = {
                user_id: data._id,
                user_name: data.last_name + ' ' + data.first_name,
                avatar: data.avatar,
                online: true,
                lastOnline: null
            }
            const user = await userOnlineModel.findOneOrCreate({ user_id: data._id }, newUser);
            if (user) {
                client.user = user;
                const listUser = await userOnlineModel.find({}).lean();
                io.sockets.emit('list-user', listUser);
            }
        } catch (error) {
            console.log(error)
        }
    },
    handleUserOffline: async (client, io) => {
        try {
            const userOffline = await userOnlineModel.findOneAndUpdate({ user_id: client?.user?.user_id }, { online: false, lastOnline: new Date() }, { new: true });
            if (userOffline) {
                const listUser = await userOnlineModel.find({}).lean();
                io.sockets.emit('list-user', listUser);
            }
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = userOnline;