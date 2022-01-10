const authController = require('../controllers/auth.controller');
const captchaController = require('../controllers/captcha.controller');
const userController = require('../controllers/user.controller');
const { checkAuth } = require('../middlewares/checkAuth');
const upload = require('../utils/multer');

const routes = (route, io) => {
    const statusController = require('../controllers/status.controller')(io);
    const commentController = require('../controllers/comment.controller')(io);
    //auth
    route.route('/auth/signup').post(authController.signUp);
    route.route('/auth/signin').post(authController.signIn);
    route.route('/auth/refresh').post(authController.refreshToken);
    route.route('/auth/signout').post(authController.signOut);
    route.route('/auth/otp').post(authController.sendOtp);
    route.route('/auth/reset-password').post(authController.resetPassword);
    //user
    route.route('/user').get(checkAuth, userController.getUser)
    route.route('/user/:id').delete(checkAuth, userController.deleteUser);
    route.route('/user/allUser').get(userController.getAllUsers);
    route.route('/user/:id').put(checkAuth, upload.single('avatar'), userController.updateUser);
    route.route('/user/change-password/:id').put(checkAuth, userController.changePassword);
    //status
    route.route('/status')
        .get(statusController.getStatus)
        .post(checkAuth, upload.single('image'), statusController.createStatus);
    route.route('/status/like').put(checkAuth, statusController.likeStatus);
    route.route('/status/:id')
        .put(checkAuth, upload.single('image'), statusController.updateStatus)
        .delete(checkAuth, statusController.deleteStatus);

    //comment
    route.route('/status/comment').get(commentController.getAll);
    route.route('/status/:id/comment')
        .get(commentController.getCommentByIdStatus)
        .post(checkAuth, commentController.createComment)
    route.route('/status/comment/likeComment')
        .put(checkAuth, commentController.likeComment)
    route.route('/status/:id/comment/:id')
        .put(checkAuth, commentController.updateComment)
        .delete(checkAuth, commentController.deleteComment)

    // captcha
    route.route('/captcha').get(captchaController.getGoogleCaptcha);
}

module.exports = routes;