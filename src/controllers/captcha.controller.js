

const captchaController = {
    async getGoogleCaptcha(req, res, next) {
        res.json({
            ENABLE_GOOGLE_CAPTCHA: new Boolean(
                process.env.ENABLE_GOOGLE_CAPTCHA
            ),
            KEY_GOOGLE_CAPTCHA: process.env.KEY_GOOGLE_CAPTCHA,
        });
    }
}

module.exports = captchaController;