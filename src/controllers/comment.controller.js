const { serverError, notFound } = require('../errors/Error');
const commentService = require('../services/comment.service');

const commentController = io => ({
    getAll: async (req, res) => {
        try {
            const comments = await commentService.getAllComments();
            if (!comments) {
                return notFound(res)
            }
            return res.status(200).json({
                code: 200,
                success: true,
                comments
            });
        } catch (error) {
            console.log('error', error);
            return serverError(res);
        }
    },
    getCommentByIdStatus: async (req, res) => {
        const { id } = req.params;
        try {
            const comments = await commentService.getCommentByIdStatus(id);
            if (!comments) {
                return notFound(res);
            }
            return res.status(200).json({
                code: 200,
                success: true,
                comments
            });

        } catch (error) {
            console.log('error', error);
            return serverError(res);
        }
    },
    createComment: async (req, res) => {
        const { statusId, comment } = req.body;
        try {
            const newComment = await commentService.createComment({
                user_id: req.user._id,
                status_id: statusId,
                comment,
            });
            if (!newComment) {
                return notFound(res);
            }
            io.sockets.emit('add-comment', newComment);
            return res.status(200).json({
                code: 200,
                success: true,
                comment: newComment
            });
        } catch (error) {
            console.log('error', error);
            serverError(res);
        }
    },
    updateComment: async (req, res) => {
        const { id } = req.params;
        const { comment } = req.body;
        try {
            const commentUpdate = await commentService.updateComment(id, { comment });
            if (!commentUpdate) {
                return notFound(res)
            }
            io.sockets.emit('update-comment', commentUpdate);
            return res.status(200).json({
                code: 200,
                success: true,
                comment: commentUpdate
            });
        } catch (error) {
            console.log('error', error);
            serverError(res);
        }
    },
    deleteComment: async (req, res) => {
        const { id } = req.params;
        try {
            const commentDelete = await commentService.deletedComment(id);
            if (!commentDelete) {
                return notFound(res)
            }
            io.sockets.emit('delete-comment', commentDelete);
            return res.status(200).json({
                code: 200,
                success: true,
                comment: commentDelete
            });
        } catch (error) {
            console.log('error', error);
            serverError(res);
        }
    },
    likeComment: async (req, res) => {
        const { comment_id } = req.body;
        try {
            const commentLike = await commentService.likeComment(comment_id, req.user._id);
            if (!commentLike) {
                return notFound(res, 'No comment found');
            }
            io.sockets.emit('like-comment', commentLike);
            return res.status(200).json({
                code: 200,
                success: true,
                comment: commentLike
            });
        } catch (error) {
            console.log('error', error);
            serverError(res);
        }
    }
})

module.exports = commentController;