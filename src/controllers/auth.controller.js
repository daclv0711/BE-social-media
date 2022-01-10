const { serverError, badRequest } = require('../errors/Error');
const authService = require('../services/auth.service');

const AuthController = {
    signUp: async (req, res) => {
        try {
            const register = await authService.signUp(req.body);
            if (!register) {
                return badRequest(res, 'Email đã tồn tại.');
            }
            if (register.notValid) {
                return res.status(400).json(register.notValid);
            }
            return res.status(201).json({
                code: 201,
                create: true,
                message: 'Đăng ký tài khoản thành công.'
            });
        } catch (error) {
            console.log('error', error);
            return serverError(res);
        }
    },
    signIn: async (req, res) => {
        const { email, password } = req.body;
        const agent = req.headers['user-agent'];
        try {
            const user = await authService.signIn(email, password, agent);
            if (!user) {
                return badRequest(res, 'Tài khoản hoặc mật khẩu không đúng.');
            }
            if (user.notValid) {
                return res.status(400).json(user.notValid);
            }
            return res.status(200).json({
                code: 200,
                token: user.token,
                refreshToken: user.refreshToken,
                user: {
                    _id: user._id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    avatar: user.avatar,
                    email: user.email,
                    cloudinary_id: user.cloudinary_id,
                }
            });
        } catch (error) {
            console.log('error', error);
            return serverError(res);
        }
    },
    refreshToken: async (req, res) => {
        const agent = req.headers['user-agent'];
        const { refreshToken } = req.body;
        try {
            const checkToken = await authService.refreshToken(refreshToken, agent);
            if (!checkToken) {
                return badRequest(res, 'Invalid token or token expired.');
            }
            return res.status(200).json({
                code: 200,
                token: checkToken,
            });
        } catch (error) {
            console.log('error', error);
            return serverError(res);
        }
    },
    signOut: async (req, res) => {
        const agent = req.headers['user-agent'];
        const { refreshToken } = req.body;
        try {
            const checkToken = await authService.signOut(refreshToken, agent);
            if (!checkToken) {
                return badRequest(res, 'Invalid token or token expired.');
            }
            return res.status(200).json({
                code: 200,
                message: 'User signed out successfully'
            });

        } catch (error) {
            console.log('error', error);
            return serverError(res);
        }
    },
    sendOtp: async (req, res) => {
        const { email } = req.body;
        const agent = req.headers['user-agent'];
        try {
            const checkEmail = await authService.sendOtp(email, agent);
            if (!checkEmail) {
                return badRequest(res, 'Tài khoản không tồn tại.');
            }
            return res.status(200).json({
                code: 200,
                success: true,
                message: 'Gửi OTP thành công'
            });
        } catch (error) {
            console.log('error', error);
            return serverError(res);
        }
    },
    resetPassword: async (req, res) => {
        const { email, otp, password } = req.body;
        const agent = req.headers['user-agent'];
        try {
            const checkEmail = await authService.resetPassword(email, otp, agent, password);
            if (!checkEmail) {
                return badRequest(res, 'Tài khoản không tồn tại.');
            }
            return res.status(200).json({
                code: 200,
                success: true,
                message: 'Đổi mật khẩu thành công'
            });
        } catch (error) {
            console.log('error', error);
            return serverError(res);
        }
    }
}

module.exports = AuthController;