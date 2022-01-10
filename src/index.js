require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes');
const socket = require('./socket');
const useragent = require('express-useragent');
const app = express();
const whitelist = ['http://localhost:3000', "https://social-media-32983.netlify.app"];
app.use(cors({
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            // callback(null, true)
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'device-remember-token',
        'Access-Control-Allow-Origin',
        'Origin',
        'Accept',
    ]
}))
app.use(useragent.express());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static('public'));

var PORT = process.env.PORT || '4000';

//socket
const server = require('http').createServer(app);
socket(server);

//routes

routes(app, socket(server));

app.use('*', (req, res) => {
    return res.status(404).json({
        code: 404,
        message: '404 Not found',
    })
})

app.use((err, req, res, next) => {
    return res.status(500).json({
        code: 500,
        message: err.message,
    })
})
//connect DB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/workout', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, err => {
    if (err) throw err;
    console.log('Successfully connected to MongoDB');
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
