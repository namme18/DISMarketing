const ErrorResponse = require('./ErrorResponse');

const errorHandler = (err, req, res, next) => {

    let error = { ...err };

    error.message = err.message

    if(err.code === 11000){
        const message = `${JSON.stringify(err.keyValue)} Already exist!`;
        error = new ErrorResponse(message, 400);
    }

    if(err.name === 'ValidationError'){
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(message, 400);
    }

    res.status(error.statusCode || 400).json({
        msg: error.message || 'Server error'
    });
}

module.exports = errorHandler;