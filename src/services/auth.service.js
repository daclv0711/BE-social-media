const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');
const TokenModel = require('../models/token.model');
const OtpModel = require('../models/otp.model');
const bcrypt = require('bcrypt');
const fs = require('fs');
const userValidate = require('../validate/user.validate');
const saltRounds = 10;
const privateKey = fs.readFileSync('./src/keys/rsa.private');
const privateKeyFresh = fs.readFileSync('./src/keys/private-refresh.pem');
const publicKeyFresh = fs.readFileSync('./src/keys/public-refresh.pem');
const sendMail = require('../utils/sendEmail');
const htmlMail = require('../utils/htmlMail');

const authService = {
    signIn: (email, password, agent) => new Promise(async (resolve, reject) => {
        const validateLoginError = userValidate.validateLogin(email, password);
        if (validateLoginError) {
            return resolve({
                notValid: validateLoginError
            });
        }
        try {
            const user = await UserModel.findOne({ email }).lean();
            if (!user) {
                return resolve();
            }
            const passwordComp = await bcrypt.compareSync(password, user?.password);
            !passwordComp && resolve();
            const token = jwt.sign({ _id: user._id, agent, type: 'access' }, privateKey, { algorithm: 'RS256', expiresIn: '20s' });
            const refreshToken = jwt.sign({ _id: user._id, agent, type: 'refresh' }, privateKeyFresh, { algorithm: 'RS256', expiresIn: '7d' });
            const hashRefreshToken = bcrypt.hashSync(refreshToken, saltRounds);
            await TokenModel.create({
                user_id: user._id,
                token: hashRefreshToken,
                agent
            });
            resolve({ token, refreshToken, ...user });
        } catch (error) {
            reject(error);
        }
    }),
    signUp: (info) => new Promise(async (resolve, reject) => {
        const { first_name, last_name, email, password } = info;
        const validateRegisterError = userValidate.validateRegister({ first_name, last_name, email, password });
        if (validateRegisterError) {
            return resolve({ notValid: validateRegisterError });
        }
        try {
            const hash = bcrypt.hashSync(password, saltRounds);
            const user = await UserModel.findOne({ email });
            if (user) {
                return resolve();
            }
            const newUser = new UserModel({
                first_name,
                last_name,
                email,
                password: hash
            });
            await newUser.save();
            resolve(newUser);
        } catch (error) {
            reject(error);
        }
    }),
    refreshToken: (refreshToken, agent) => new Promise(async (resolve, reject) => {
        try {
            const payload = jwt.verify(refreshToken, publicKeyFresh, { algorithm: 'RS256' });
            const checkToken = await TokenModel.findOne({ agent, user_id: payload._id });
            const compareToken = await bcrypt.compareSync(refreshToken, checkToken.token);
            if (!checkToken || !compareToken) {
                return resolve();
            }
            const token = jwt.sign({ _id: payload._id, agent: checkToken.agent, type: 'access' }, privateKey, { algorithm: 'RS256', expiresIn: '5h' });
            resolve(token);
        } catch (error) {
            reject(error);
        }
    }),
    signOut: (refreshToken, agent) => new Promise(async (resolve, reject) => {
        try {
            const payload = jwt.verify(refreshToken, publicKeyFresh, { algorithm: 'RS256' });
            const checkToken = await TokenModel.findOne({ agent, user_id: payload._id });
            if (!checkToken) {
                return resolve();
            }
            await TokenModel.deleteOne({ agent, user_id: payload._id });
            resolve(true);
        } catch (error) {
            reject(error);
        }
    }),
    generateOtp: () => {
        let otp = Math.floor(Math.random() * 1000000).toFixed(0);
        for (let i = 0; i < 6; i++) {
            if (otp.length < 6) {
                otp = '0' + otp;
            }
        }
        return otp;
    },
    sendOtp: (email, agent) => new Promise(async (resolve, reject) => {
        try {
            const user = await UserModel.findOne({ email }).lean();
            if (!user) {
                return resolve();
            }
            const otp = authService.generateOtp();
            const hashOtp = bcrypt.hashSync(otp, saltRounds);
            await OtpModel.create({
                otp: hashOtp,
                user_id: user._id,
                agent
            });
            resolve(true);
            await sendMail(email, htmlMail.getOtpHtml(otp, process.env.OTP_EXPIRE_MINUTE));
        } catch (error) {
            reject(error);
        }
    }),
    resetPassword: (email, otp, agent, password) => new Promise(async (resolve, reject) => {
        try {
            const user = await UserModel.findOne({ email }).lean();
            const checkOtp = await OtpModel.findOne({ user_id: user._id, agent }).sort({ 'created_at': -1 }).lean();
            if (!checkOtp || !user) {
                return resolve();
            }
            const compareOtp = await bcrypt.compareSync(otp, checkOtp?.otp);
            if (!compareOtp) return resolve()
            const hash = await bcrypt.hashSync(password, saltRounds);
            await UserModel.updateOne({ _id: user._id }, { password: hash }, { new: true });
            await OtpModel.deleteMany({ user_id: user._id })
            resolve(true);
        } catch (error) {
            reject(error);
        }
    }),
}

module.exports = authService