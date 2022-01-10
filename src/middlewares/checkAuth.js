const fs = require('fs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');

const publicKeyAccess = fs.readFileSync('./src/keys/rsa.public');

const checkAuth = async (req, res, next) => {
    const agent = req.headers['user-agent'];
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        if (!token) {
            return res.status(404).json({
                message: 'Token is not found',
            });
        }
        const decoded = jwt.verify(token, publicKeyAccess, { algorithm: 'RS256' });
        const user = await userModel.findById({ _id: decoded._id });
        if (!decoded.agent || !user) {
            return res.status(403).json({
                code: 403,
                message: "Not permission"
            })
        }

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json(error);
    }
}

module.exports = {
    checkAuth
}