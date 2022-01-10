const commentModel = require("../models/comment.model");
const StatusModel = require("../models/status.model");
const { cloudinary } = require("../utils/cloudinary");

const statusService = {
    getAllStatus: (skip, limitNumber) => new Promise(async (resolve, reject) => {
        try {
            const status = await StatusModel.find().skip(skip).limit(limitNumber).sort({ createdAt: -1 }).lean();
            if (!status) {
                resolve();
            }
            const total = await StatusModel.count({});
            resolve({ data: status, total });
        } catch (error) {
            reject(error);
        }
    }),
    createStatus: (status, user_id, public, file) => new Promise(async (resolve, reject) => {
        try {
            const newStatus = new StatusModel({
                status,
                user_id,
                public,
                old_status: [{ status }]
            });
            if (file) {
                const resultCloudinary = await cloudinary.uploader.upload(file.path);
                newStatus.image = resultCloudinary.secure_url
                newStatus.cloudinary_id = resultCloudinary.public_id
            }
            const statusCreated = await newStatus.save();
            if (!statusCreated) {
                resolve();
            }
            resolve(statusCreated);
        } catch (error) {
            reject(error);
        }
    }),
    updateStatus: (dataStatus) => new Promise(async (resolve, reject) => {
        const { status, user_id, public, file, old_status, cloudinary_id, id } = dataStatus;
        try {
            let dataImg = {};

            if (file) {
                cloudinary_id && await cloudinary.uploader.destroy(cloudinary_id)
                const resultCloudinary = await cloudinary.uploader.upload(file.path);
                dataImg.image = resultCloudinary.secure_url
                dataImg.cloudinary_id = resultCloudinary.public_id
            }
            const statusUpdated = await StatusModel.findOneAndUpdate({ _id: id }, {
                status,
                user_id,
                public,
                old_status: [...old_status, { status }],
                ...dataImg
            }, { new: true });
            if (!statusUpdated) {
                resolve();
            }
            const statusUpdated2 = await statusUpdated.save();
            if (!statusUpdated2) {
                resolve();
            }
            resolve(statusUpdated2);
        } catch (error) {
            reject(error);
        }
    }),
    deleteStatus: (id) => new Promise(async (resolve, reject) => {
        try {
            const statusDeleted = await StatusModel.findOneAndDelete({ _id: id });
            if (!statusDeleted) {
                resolve();
            }
            if (statusDeleted.image && statusDeleted.cloudinary_id) {
                await cloudinary.uploader.destroy(statusDeleted.cloudinary_id)
            }
            await commentModel.deleteMany({ status_id: statusDeleted._id })
            resolve(statusDeleted);
        } catch (error) {
            reject(error);
        }
    }),
    likeStatus: (id, user_id) => new Promise(async (resolve, reject) => {
        try {
            const updateStatusLike = await StatusModel.findById(id)
            if (!updateStatusLike) {
                resolve();
            }
            const index = updateStatusLike.likes.indexOf(user_id)
            if (index === -1) {
                updateStatusLike.likes.push(user_id)
            } else {
                updateStatusLike.likes.splice(index, 1)
            }
            const statusUpdated = await updateStatusLike.save()
            resolve(statusUpdated)
        } catch (error) {
            reject(error)
        }
    }),
}

module.exports = statusService;