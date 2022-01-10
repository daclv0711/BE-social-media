const { serverError, badRequest } = require('../errors/Error');
const userService = require('../services/user.service');

const userController = {
    getUser: async (req, res) => {
        const { _id } = req.user;
        try {
            const user = await userService.getUser(_id);
            if (!user) {
                return res.status(400).json('User does not exist');
            }
            return res.status(200).json(user);
        } catch (error) {
            console.log('error', error);
            serverError(res);
        }
    },

    getAllUsers: async (req, res) => {
        try {
            const users = await userService.getAllUsers();
            if (!users) {
                return res.status(400).json('User does not exist');
            }
            return res.status(200).json(users);
        } catch (error) {
            console.log('error', error);
            serverError(res);
        }
    },
    updateUser: async (req, res) => {

        try {
            const userUpdate = await userService.updateUser(req.params.id, req.body, req.file);
            if (!userUpdate) {
                return res.status(400).json('User does not exist');
            }
            if (userUpdate.notValid) {
                return res.status(400).json(userUpdate.notValid);
            }
            return res.status(200).json(userUpdate);
        } catch (error) {
            console.log('error', error);
            serverError(res);
        }
    },

    deleteUser: async (req, res) => {
        try {
            const user = await userService.deleteUser(req.params.id);
            if (!user) {
                return badRequest(res, 'User does not exist');
            }
            return res.status(200).json('User deleted successfully');
        } catch (error) {
            console.log('error', error);
            serverError(res);
        }
    },
    changePassword: async (req, res) => {
        try {
            const user = await userService.changePassword(req.params.id, req.body);
            if (!user) {
                return badRequest(res, 'User does not exist');
            }
            if (user.passwordWrong) {
                return badRequest(res, 'Mật khẩu cũ không đúng');
            }
            if (user.notValid) {
                return res.status(400).json(user.notValid);
            }
            return res.status(200).json('Thay đổi mật khẩu thành công');
        } catch (error) {
            console.log('error', error);
            serverError(res);
        }
    }
}

module.exports = userController