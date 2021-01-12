/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable eol-last */
/* eslint-disable padded-blocks */
/* eslint-disable space-before-function-paren */
/* eslint-disable comma-dangle */
/* eslint-disable indent */
/* eslint-disable consistent-return */
/* eslint-disable no-console */
/* eslint-disable prefer-destructuring */

const crypto = require('crypto');
const {
    promisify,
} = require('util');
const jwt = require('jsonwebtoken');
const catchAsync = require('./Utils/CatchAsync');
const User = require('../model/Usermodel');

const AppError = require('./Utils/AppError');

const Email = require('./Utils/email');

const SignToken = (id) => jwt.sign({
        id,
    },
    process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
const CookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
};
const CreateSendToken = (user, StatusCode, res) => {
    const token = SignToken(user._id);
    res.cookie('jwt', token, CookieOptions);
    user.Password = undefined;
    if (process.env.NODE_ENV === 'production') {
        CookieOptions.secure = true;
    }
    res.status(StatusCode).json({
        status: 'success',
        token,
        data: {
            user,
        }
    });

};
exports.Signup = catchAsync(async(req, res, next) => {
    //const newuser = await User.create(req.body);
    const newuser = await User.create({
        name: req.body.name,
        email: req.body.email,
        Password: req.body.Password,
        PasswordConfirm: req.body.PasswordConfirm,
    });
    const url = `${req.protocol}://${req.get('host')}/me`;
    //console.log(url);
    await new Email(newuser, url).sendWelcome();
    CreateSendToken(newuser, 201, res);
});
exports.Login = async(req, res, next) => {
    const { email, Password } = req.body;
    console.log(req.body);
    if (!email || !Password) {
        /*console.log('invalid  credentials ', `
        $ { email }
        $ { Password }
        `);*/
        return next(new AppError('Please Provide a Email and  Password', 400));
    }
    const user = await User.findOne({
        email,
    }).select('+Password');
    //console.log('returned users from the database  ', user);
    if (!user || !(await user.Correctpassword(Password, user.Password))) {

        //console.log('invalid credentials here', user);
        return next(new AppError('Incorrect Email or Password', 401));
    }

    console.log('after everything ', user);
    CreateSendToken(user, 200, res);
};
// eslint-disable-next-line space-before-function-paren
// eslint-disable-next-line consistent-return
// eslint-disable-next-line space-before-function-paren
/*exports.Login = catchAsync(async(req, res, next) => {
    console.log('I got into this body successfully!', req.body);
    console.log(req.body.Password);
    const {
        email,
        password,
    } = req.body;
    console.log(password);
    if (!email || password) {
        // const loginerr =
        console.log('invalid  credentials ', email + " " + password);

        return next(new AppError('Please Provide a Email and  Password', 400));
    }
    const user = await User.findOne({
        email,
    }).select('+Password');
    console.log('returned users from the database  ', user);
    if (!user || !(await user.Correctpassword(password, user.Password))) {

        console.log('invalid credentials here', user);
        return next(new AppError('Incorrect Email or Password', 401));
    }

    console.log('after everything ', user);
    CreateSendToken(user, 200, res);

});*/
// eslint-disable-next-line space-before-function-paren
exports.Protect = catchAsync(async(req, res, next) => {
    let token;
    if (
        // eslint-disable-next-line operator-linebreak
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {

        token = req.headers.authorization.split(' ')[1];

    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }
    if (!token) {
        return next(
            new AppError('You are not Logged in !Please Login to get access', 401)
        );

    }
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
        return next(
            new AppError('The user belonging to this token no longer exist', 401)
        );
    }
    if (currentUser.changePasswordAfter(decoded.iat)) {
        return next(
            new AppError('User Recently changed Password! Plese Login again '),
            401
        );
    }
    req.user = currentUser;
    res.locals.user = currentUser;
    console.log('Testing');

    //res.locals.user = currentUser;

    next();


});

exports.isLoggedIn = async(req, res, next) => {
    try {
        if (req.cookies.jwt) {
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
            const currentUser = await User.findById(decoded.id);
            if (!currentUser) {
                return next();
            }
            if (currentUser.changePasswordAfter(decoded.iat)) {
                return next();

            }
            res.locals.user = currentUser;
            return next();
        }
    } catch (err) {
        return next();
    }
    next();
};
exports.restrictTo = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return next(
            new AppError('You do not have Permission to perform this action', 403)
        );
    }
    next();
};
exports.Loggout = (req, res) => {
    res.cookie('jwt', 'logout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.status(200).json({
        status: 'success',
    });
};

exports.forgotpassword = catchAsync(async(req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {

        return next(new AppError('There is no user with that email'), 404);

    }
    const resetToken = user.CreatePasswordResetToken();
    //console.log(resetToken);
    await user.save({ validateBeforeSave: false });

    // Send to user Email

    try {
        // eslint-disable-next-line spaced-comment
        /* await SendEmail({
            email: user.email,
                subject: 'your password reset token is only valid for (10min)',
                message,
        });*/

        const ResetUrl = `
        $ { req.get('host') }
        /resetpassword?token=${resetToken}`;
        await new Email(user, ResetUrl).sendPasswordReset();


        res.status(200).json({
            // Changed Status
            status: 'success',
            message: 'Token sent to email',
        });

    } catch (err) {
        user.Passwordresettoken = undefined;
        user.PasswordresetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new AppError('There was an error Sending the Email'), 500);
    }
});
exports.resetPassword = catchAsync(async(req, res, next) => {
    const hashtoken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({ Passwordresettoken: hashtoken, PasswordresetExpires: { $gt: Date.now() } });
    console.log(user);
    if (!user) {
        return next(new AppError('Token is Invalid or Expired'), 400);
    }
    user.Password = req.body.Password;
    user.PasswordConfirm = req.body.PasswordConfirm;
    user.Passwordresettoken = undefined;
    user.PasswordresetExpires = undefined;
    await user.save();

    CreateSendToken(user, 200, res);

});
exports.UpdatePassword = catchAsync(async(req, res, next) => {
    const user = await User.findById(req.user.id).select('+Password');

    if (!await user.Correctpassword(req.body.PasswordCurrent, user.Password)) {
        return next(new AppError('Your Current Password is wrong', 401));
    }
    user.Password = req.body.Password;
    user.PasswordConfirm = req.body.PasswordConfirm;
    await user.save();
    CreateSendToken(user, 200, res);

});