const socketio = require('socket.io');
const userModel = require('../models/user.model');
const userOnline = require('./userOnline');

const getAllUsers = async (client) => {
    const users = await userModel.find({}).select(['-password', '-email']).lean();
    client.emit('users', users);
    return users;
}

module.exports = server => {
    const io = socketio(server, {
        path: '/socket',
        reconnect: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 10,
        cors: {
            origin: ["https://social-media-32983.netlify.app", "http://localhost:3000"],
            methods: ["GET", "POST"],
            allowedHeaders: "*",
            credentials: true
        },
        transports: ['polling', 'websocket']
    });

    io.sockets.on('connection', (client) => {
        client.send(getAllUsers(client));
        console.log('client connect id: ', client.id)
        client.on('disconnect', function (resa) {
            console.log(client.id, ' disconnect', resa)
            userOnline.handleUserOffline(client, io)
        })


        // reconnect from client
        client.on('reconnect', () => {
            console.log('reconnect', client.id)
        })
        client.on('user', (data) => {
            userOnline.handleUserOnline(client, io, data)
        })

        client.on('focus-comment', (data) => {
            client.broadcast.emit('focus', data);
        })

        client.on('blur-comment', (data) => {
            client.broadcast.emit('blur', data);
        })

        // notify status 
        client.on('notify-status', (data) => {
            client.broadcast.emit('notify', data);
        })
    })

    return io;
};