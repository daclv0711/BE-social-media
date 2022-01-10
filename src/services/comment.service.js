const CommentModel = require('../models/comment.model');

const commentService = {
    getAllComments: () => new Promise(async (resolve, reject) => {
        try {
            const comments = await CommentModel.find().populate('user_id').lean();
            if (!comments) {
                resolve();
            }
            resolve(comments);
        } catch (error) {
            reject(error);
        }
    }),
    getCommentByIdStatus: (id) => new Promise(async (resolve, reject) => {
        try {
            const comment = await CommentModel.find({ status_id: id }).populate('user_id').lean();
            if (!comment) {
                resolve();
            }
            resolve(comment);
        } catch (error) {
            reject(error);
        }
    }),
    createComment: (data) => new Promise(async (resolve, reject) => {
        const { user_id, status_id, comment } = data;
        try {
            const newComment = CommentModel.create({
                user_id,
                status_id,
                comment,
                old_comment: [{ comment }]
            });
            if (!newComment) {
                resolve();
            }
            resolve(newComment);
        } catch (error) {
            reject(error);
        }
    }),
    updateComment: (id, data) => new Promise(async (resolve, reject) => {
        try {
            const commentUpdated = await CommentModel.findByIdAndUpdate(id, data, { new: true });
            if (!commentUpdated) {
                resolve();
            }
            resolve(commentUpdated);
        } catch (error) {
            reject(error);
        }
    }),
    deletedComment: (id) => new Promise(async (resolve, reject) => {
        try {
            const commentDeleted = await CommentModel.findByIdAndDelete(id);
            if (!commentDeleted) {
                resolve();
            }
            resolve(commentDeleted);
        } catch (error) {
            reject(error);
        }
    }),
    likeComment: (commentId, idUser) => new Promise(async (resolve, reject) => {
        try {
            const commentLike = await CommentModel.findById(commentId);
            if (!commentLike) {
                return resolve();
            }
            const index = commentLike.likes.indexOf(idUser);
            if (index === -1) {
                commentLike.likes.push(idUser);
            } else {
                commentLike.likes.splice(index, 1);
            }
            await commentLike.save();
            resolve(commentLike);
        } catch (error) {
            reject(error);
        }
    }),
}

module.exports = commentService;