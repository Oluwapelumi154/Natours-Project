/* eslint-disable func-names */
/* eslint-disable space-before-function-paren */
const mongoose = require('mongoose');
const slugify = require('slugify');

const Tour = require('./tourmodel');

const ReviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'It must have a review'],
        unique: true,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    CreatedAt: {
        type: Date,
        default: Date.now(),
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Review must belong to a tour '],
    },
    User: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
        required: [true, 'Review must belong to a user '],
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
ReviewSchema.index({ tour: 1, User: 1 }, { unique: true });
ReviewSchema.pre(/^find/, function(next) {
    //this.populate({ path: 'tour', select: '-__v' }).populate({ path: 'User', select: '-__v  -name' });
    this.populate({ path: 'User', select: '-__v  -email' });
    next();
});
ReviewSchema.statics.CalcuAverageratings = async function(tourId) {
    // console.log(tourId);
    const stats = await this.aggregate([{
            $match: { tour: tourId },
        },
        {
            $group: {
                _id: '$tour',
                nrating: { $sum: 1 },
                ratingAverage: { $avg: '$rating' },

            }
        }
    ]);;
    //console.log(stats);
    if (stats.length > 0) {
        await Tour.findByIdAndUpdate(tourId, {
            ratingAverage: stats[0].ratingAverage,
            ratingQuantity: stats[0].nrating,
        })
    } else {
        await Tour.findByIdAndUpdate(tourId, {
            ratingAverage: 4.5,
            ratingQuantity: 0,
        })
    }
};
ReviewSchema.post('save', function() {
    console.log(this.consrtructor);
    this.constructor.CalcuAverageratings(this.tour);

});
// eslint-disable-next-line space-before-function-paren
// eslint-disable-next-line func-names
ReviewSchema.pre(/^findOneAnd/, async function(next) {
    this.r = await this.findOne();
    // console.log(this.r);
    next();
});
ReviewSchema.post(/^findOneAnd/, async function() {
    await this.r.constructor.CalcuAverageratings(this.r.tour);
});



const review = mongoose.model('review', ReviewSchema);
module.exports = review;