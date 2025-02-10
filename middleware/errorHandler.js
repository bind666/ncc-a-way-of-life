const errorHandler = (err, req, res, next) => {
    const message = err.message || "Something went wrong.";
    const statusCode = err.statusCode || 500;
    const error = err || {}
    const stack = err.stack || []

    res.status(statusCode).json({
        message,
        statusCode,
        error,
        stack
    })
}
export default errorHandler
