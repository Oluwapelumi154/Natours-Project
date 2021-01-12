/* eslint-disable func-names */
/* eslint-disable space-before-function-paren */
/* eslint-disable eol-last */
/* eslint-disable indent */
// eslint-disable-next-line eol-last
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Booking must belong to a Tour!'],
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: [true, 'Booking must belong to a User!'],
    },
    Price: {
        type: Number,
        required: [true, 'Booking must have a Price'],
    },
    CreatedAt: {
        type: Date,
        default: Date.now(),
    },
    paid: {
        type: Boolean,
        default: true,
    },

}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
bookingSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'tour',
        select: 'name',
    }).populate({
        path: 'user',
        select: 'name',
    });


    next();
});
const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;