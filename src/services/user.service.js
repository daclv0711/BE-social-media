const UserModel = require('../models/user.model');
const userValidate = require('../validate/user.validate');
const { cloudinary } = require('../utils/cloudinary');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userService = {
    getUser: (id) => new Promise(async (resolve, reject) => {
        try {
            const user = await UserModel.findById(id).select('-password').lean();
            if (!user) {
                reject()
            }
            resolve(user);
        } catch (error) {
            reject(error);
        }
    }),
    getAllUsers: () => new Promise(async (resolve, reject) => {
        try {
            const users = await UserModel.find({}).select(['-password', '-email']).lean();
            if (!users) {
                reject()
            }
            resolve(users);
        } catch (error) {
            reject(error);
        }
    }),
    updateUser: (id, body, file) => new Promise(async (resolve, reject) => {
        const { first_name, last_name, email } = body;
        const validateUserErr = userValidate.validateUpdateUser(body);
        if (validateUserErr) {
            resolve({
                notValid: validateUserErr
            });
        }
        try {
            const user = await UserModel.findById(id).lean();
            if (!user) {
                resolve();
            }
            const newUser = {};
            if (file) {
                if (user.cloudinary_id) {
                    await cloudinary.uploader.destroy(user.cloudinary_id);
                }
                const resultCloudinary = await cloudinary.uploader.upload(file.path);
                newUser.avatar = resultCloudinary.secure_url;
                newUser.cloudinary_id = resultCloudinary.public_id;
            }
            newUser.first_name = first_name;
            newUser.last_name = last_name;
            newUser.email = email;
            const userUpdate = await UserModel.findOneAndUpdate({ _id: id }, newUser, { new: true }).select('-password').lean();
            resolve(userUpdate);
        } catch (error) {
            reject(error);
        }
    }),
    deleteUser: (id) => new Promise(async (resolve, reject) => {
        try {
            const user = await UserModel.findByIdAndDelete(id).lean();
            if (!user) {
                resolve();
            }
            if (user.cloudinary_id) {
                await cloudinary.uploader.destroy(user.cloudinary_id);
            }
            resolve(true);
        } catch (error) {
            reject(error);
        }
    }),
    changePassword: (id, body) => new Promise(async (resolve, reject) => {
        const { password, newPassword } = body;
        const validatePassError = userValidate.validateChangePassword(password, newPassword);
        if (validatePassError) {
            resolve({
                notValid: validatePassError
            });
        }
        try {
            const user = await UserModel.findById(id).lean();
            if (!user) {
                resolve();
            }
            const isMatch = await bcrypt.compareSync(password, user.password);
            if (!isMatch) {
                resolve({ passwordWrong: 'Mật khẩu cũ không đúng' });
            }
            const salt = await bcrypt.genSaltSync(saltRounds);
            const hashPassword = await bcrypt.hashSync(newPassword, salt);
            const updatePassword = await UserModel.findByIdAndUpdate(id, { password: hashPassword }, { new: true }).lean();
            resolve(updatePassword);
        } catch (error) {
            reject(error);
        }
    }),
}

module.exports = userService