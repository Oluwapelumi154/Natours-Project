/* eslint-disable space-before-function-paren */
/* eslint-disable eol-last */
/* eslint-disable indent */
const crypto = require('crypto');
const Tour = require('../model/tourmodel');
const CatchAsync = require('./Utils/CatchAsync');
const AppError = require('./Utils/AppError');
const user = require('../model/Usermodel');
const Booking = require('../model/bookingModel');
// eslint-disable-next-line space-before-function-paren
exports.getOverview = CatchAsync(async(req, res) => {
    const tours = await Tour.find();

    res.status(200).render('overview', {
        title: 'The Overview Page',
        tours,

    });

});
/*exports.getparams = async(req, res, next) => {
const params = req.params.token;
return params;

};
*/
// eslint-disable-next-line space-before-function-paren
exports.getTours = CatchAsync(async(req, res, next) => {
    const tours = await Tour.findOne({ slug: req.params.slug }).populate({
        path: 'Reviews',
        fields: 'review rating User',
    });
    if (!tours) {
        return next(new AppError('There is no tour with that name', 404));
    }
    res.status(200).render('tour', {
        title: `${tours.name} tour`,
        tours,
    });
});
exports.Login = (req, res) => {
    res.status(200).render('login', {
        title: 'Login into your account',

    });
};
exports.signup = (req, res) => {
    res.status(200).render('signup', {
        title: 'Signup',

    });
};
exports.getAccount = (req, res) => {
    res.status(200).render('account', {
        title: 'Users Info',


    });
};
exports.getMyTours = CatchAsync(async(req, res, next) => {
    // 1)find all bookings
    const bookings = await Booking.find({ user: req.user.id });
    const UserID = bookings.map((el) => el.user);
    const tours = await Tour.find({ _id: { $in: UserID } });
    res.status(200).render('overview', {
        title: 'My tours',
        tours,
    });
});

exports.ResetPassword = CatchAsync(async(req, res, next) => {
    // eslint-disable-next-line max-len

    const hashtoken = crypto.createHash('sha256').update(req.query.token).digest('hex');

    const User = await user.findOne({ Passwordresettoken: hashtoken, PasswordresetExpires: { $gt: Date.now() } });


    if (!User) {
        return next(new AppError('Token is Invalid or Expired', 400));
    }
    res.locals.token = hashtoken;
    //res.redirect('/')
    res.status(200).render('ResetDetails', {
        title: 'Reset details',

    });



});
exports.forms = CatchAsync(async(req, res, next) => {

    res.status(200).render('ResetDetails', {
        title: 'Reset details',
    });

});
exports.UpdateUserdata = CatchAsync(async(req, res, next) => {
    const Updateduser = await user.findByIdAndUpdate(req.user.id, {
        email: req.body.email,
        name: req.body.name,

    }, {
        new: true,
        runValidators: true,
    });
    res.status(200).render('account', {
        title: 'Users Info',
        user: Updateduser,

    });
});
exports.Emailverify = (req, res) => {
    res.status(200).render('emailverify', {
        title: 'forgotpassword',


    });

};