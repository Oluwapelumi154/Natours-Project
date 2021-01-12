/* eslint-disable space-before-function-paren */
/* eslint-disable eol-last */
/* eslint-disable indent */
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const catchAsync = require('./Utils/CatchAsync');
const AppError = require('./Utils/AppError');
const Tour = require('../model/tourmodel');
const Booking = require('../model/bookingModel');
const Review = require('../model/ReviewModel');

const factory = require('./Utils/HandleFactory');
const CatchAsync = require('./Utils/CatchAsync');

exports.getCheckOutSession = catchAsync(async(req, res, next) => {
    const tour = await Tour.findById(req.params.tourId);
    console.log(tour);
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&Price=${tour.Price}`,
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference: req.user.tourId,
        line_items: [{
                name: `${tour.name} Tour`,
                description: tour.summary,
                amount: tour.Price * 100,
                currency: 'usd',
                quantity: 1,
            },

        ],
    });
    res.status(200).json({
        status: 'success',
        session,
    });
});
exports.CreateBookingCheckout = catchAsync(async(req, res, next) => {

    // This is only Temporary,because it is unsecure everyone can make booking without booking tour
    const { tour, user, Price } = req.query;
    if (!tour && !user && !Price) return next();
    await Booking.create({ tour, user, Price });
    res.redirect(req.originalurl.split('?')[0]);
});

exports.AllBookings = factory.getAll(Booking);
exports.getBookings = factory.getOne(Booking);
exports.createBookings = factory.CreateOne(Booking);

exports.UpdateBookings = factory.UpdateOne(Booking);
exports.DeleteBookings = factory.DeleteOne(Booking);