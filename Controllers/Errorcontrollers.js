/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
/* eslint-disable consistent-return */
/* eslint-disable no-lone-blocks */
/* eslint-disable indent */
/* eslint-disable implicit-arrow-linebreak */
const AppError = require('./Utils/AppError');

const handleErrorDb = (err) => {
    const message = `Invalid ${err.path}:${err.value}`;
    return new AppError(message, 400);
};
const handleValidationError = (err) => {
    const error = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid data.${error.join('. ')}`;
    return new AppError(message, 400);
};
const handleDuplicateFields = (err) => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];

    const message = `Duplicate field value${value}`;

    return new AppError(message, 400);
};


const handleJWTError = () =>
    new AppError('Invalid Token !Please Login again', 401);

const sendErrorDev = (err, req, res) => {
    //A) RENDERED WEBSITE
    if (req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack,
        });
    }
    console.error('Error', err);
    //RENDERED WEBSITEn
    return res.status(err.statusCode).render('error', {
        title: 'Something went Wrong Try again',
        message: err.message,
    });
};
const sendErrorProd = (err, req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message,

            });
        }
        console.error('Error', err);
        return res.status(500).json({
            status: 'Error',
            message: 'Something Went wrong',
        });
    }

    //B)Rendered Website
    //B) Operational trusted error :Send message to Client 
    if (err.isOperational) {
        return res.status(err.statusCode).render('error', {
            title: 'Something went Wrong Try again',
            message: err.message,
        });
    }
    //console.error('Error', err);
    return res.status(err.statusCode).render('error', {
        title: 'Something went Wrong Try again',
        message: 'Please Try again',
    });
};

module.exports = (err, req, res, next) => {
    // eslint-disable-next-line no-param-reassign

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);
    } else if (process.env.NODE_ENV === 'production') {

        if (err.name === 'CastError') err = handleErrorDb(err);
        if (err.code === 11000) err = handleDuplicateFields(err);
        if (err.name === 'ValidationError') err = handleValidationError(err);
        if (err.name === 'JsonWebTokenError') err = handleJWTError();
        //if (err.name === 'TokenExpiredError') err = handleJWTExpiredError();
        //console.log(err.message);
        sendErrorProd(err, req, res);
    }
};