const { serverError, notFound } = require("../errors/Error");
const statusService = require("../services/status.service");

const PAGE_SIZE = 2
const statusController = io => ({
    getStatus: async (req, res) => {
        let { skip } = req.query
        try {
            skip = skip ? parseInt(skip) : 0
            const status = await statusService.getAllStatus(skip, PAGE_SIZE);
            if (!status) {
                return notFound(res);
            }
            return res.status(200).json(status)
        } catch (error) {
            console.log('error', error);
            serverError(res);
        }
    },
    createStatus: async (req, res) => {
        const { status, public } = req.body
        try {

            const newStatus = await statusService.createStatus(status, req.user._id, public, req.file);
            if (!newStatus) {
                return notFound(res);
            }
            io.sockets.emit("add-status", newStatus)
            return res.status(201).json({
                code: 201,
                success: true,
                newStatus,
                message: "Status created successfully",
            })
        } catch (error) {
            console.log('error', error);
            serverError(res);
        }
    },
    updateStatus: async (req, res) => {
        const { status, old_status, cloudinary_id, public } = req.body
        const old = [...JSON.parse(old_status)]
        try {
            const updateStatus = await statusService.updateStatus({
                status,
                user_id: req.user._id,
                old_status: old,
                cloudinary_id,
                public,
                id: req.params.id,
                file: req.file
            });

            if (!updateStatus) {
                return notFound(res);
            }

            io.sockets.emit("update-status", updateStatus)
            return res.status(200).json({
                code: 200,
                success: true,
                updateStatus,
                message: "Update status success"
            })
        } catch (error) {
            console.log('error', error);
            serverError(res);
        }
    },
    deleteStatus: async (req, res) => {
        try {
            const statusDeleted = await statusService.deleteStatus(req.params.id)
            if (!statusDeleted) {
                return notFound(res)
            }
            io.sockets.emit("delete-status", statusDeleted)
            return res.status(200).json({
                code: 200,
                success: true,
                message: "Status deleted",
            })
        } catch (error) {
            console.log('error', error);
            serverError(res);
        }
    },
    likeStatus: async (req, res) => {
        try {
            const { status_id } = req.body
            const likeStatus = await statusService.likeStatus(status_id, req.user._id)
            if (!likeStatus) {
                return notFound(res)
            }
            io.sockets.emit("like-status", likeStatus)
            return res.status(200).json({
                code: 200,
                success: true,
                message: "Like status success"
            })
        } catch (error) {
            console.log('error', error);
            serverError(res);
        }
    }
})

module.exports = statusController