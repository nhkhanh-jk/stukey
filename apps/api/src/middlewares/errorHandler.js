const errorHandler = (err, req, res, next) =>{
    const statusCode = res.statusCode ? res.statusCode : 500;

    const finalStatus = statusCode === 200 ? 500 : statusCode;

    res.status(finalStatus);
    res.json({
        error: {
            code: finalStatus,
            message: err.message,
            details: process.env.NODE_ENV === "production" ? null : err.stack,
        },
    });
};

module.exports = errorHandler;