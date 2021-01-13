/* eslint-disable eol-last */
/* eslint-disable indent */
const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const AppError = require('./Controllers/Utils/AppError');
const globalErrorhandler = require('./Controllers/Errorcontrollers');
const tourRouter = require('./Routes/tourRoute');
const userRouter = require('./Routes/userRoute');
const reviewRouter = require('./Routes/Reviewroute');
const viewRouter = require('./Routes/viewRouter');
const bookingRouter = require('./Routes/Bookingroute');

const app = express();
app.use(cors());
// Serving Stataic Files

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
// Set http Security headers
app.use(helmet());

if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line indent
    app.use(morgan('dev'));
}

const limiter = rateLimit({
    max: 10,
    windowMs: 60 * 60 * 1000,
    message: 'Too many request from the same Api try again in an hour',
});
app.use('/api', limiter);

// Body Parser reading data from body nto req.card-body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));


// Data Sanitization against No SQL injection
app.use(mongoSanitize());
// Data Sanitization
app.use(xss());
app.use(hpp());
// test Middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    //console.log(req.cookies);

    next();
});

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/booking', bookingRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this Server`, 404));
});

app.use(globalErrorhandler);
module.exports = app; // where is your login.js