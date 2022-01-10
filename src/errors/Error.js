
const serverError = (res) => {
    return res.status(500).json({
        code: 500,
        success: false,
        message: 'Internal server error',
    });
}

const notFound = (res, message) => {
    return res.status(404).json({
        code: 404,
        success: false,
        message: message || 'Not found',
    });
}

const badRequest = (res, message) => {
    return res.status(400).json({
        code: 400,
        success: false,
        message: message || 'Bad request',
    });
}

module.exports = {
    serverError,
    notFound,
    badRequest,
};