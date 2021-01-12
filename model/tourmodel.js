/* eslint-disable space-before-function-paren */
/* eslint-disable func-names */
/* eslint-disable indent */
const mongoose = require('mongoose');
const slugify = require('slugify');

// const user = require('../model/Usermodel');

const tourschema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
        max: [10, 'It must not be more than 10 characters long'],
        min: [5, 'The minimum is 5'],
    },
    ratingAverage: {
        type: Number,
        default: 4.5,
        max: [5, 'Rating Average must not be above 5'],
        min: [1, 'Rating Average must not be below 1'],
        set: (val) => Math.round(val * 10) / 10,
    },
    ratingQuantity: {
        type: Number,
        default: 0,
    },
    Price: {
        type: Number,
        required: [true, 'A tour must have a Price'],
    },

    PriceDiscount: {
        type: Number,
        validate: {
            validator(val) {
                return val < this.Price;
            },
            message: 'Discount Price({VALUE}) should be below the regular Price',
        },
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'A tour is either difficult or easy',
        },
    },
    summary: {
        type: String,
        required: [true, 'A tour must have a Summary'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'A tour must have a description'],
        trim: true,

    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a maximum group size'],

    },
    Duration: {
        type: Number,
        required: [true, 'A tour must have a Duration'],
    },
    imageCover: {
        type: String,
        required: [false, 'A tour must have an image'],
    },
    slug: {
        type: String,
    },
    SecretTour: {
        type: Boolean,
        default: false,
    },
    guides: [{
            type: mongoose.Schema.ObjectId,
            ref: 'user',
        },

    ],
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false,
    },
    startDates: [Date],
    StartLocation: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
    },

    Locations: [{
        type: {
            type: String,
            default: 'Point',
            enum: ['Point'],
        },
        coordinates: [Number],
        description: String,
        address: String,
        day: Number,
    }],
    participant: {
        type: Number,
        default: 0,

    },
}, {
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
});

tourschema.virtual('Durationwks').get(function() {
    return this.Duration / 7;
});
tourschema.virtual('Reviews', {
    ref: 'review',
    foreignField: 'tour',
    localField: '_id',

});
/* tourschema.virtual('ToursBookings', {
    ref: 'Booking',
    foreignField: 'tour',
    localField: '_id',

}); */

// DOCUMENT MIDDLEWARE IT RUNS ON .CREATE() AND .SAVE()
tourschema.pre('save', function(next) {
    this.slug = slugify(this.name, {
        lower: true,
    });
    next();
});
// tourschema.pre('save', async function(next) {
//     const promise = this.guides.map(async(id) => await User.findById(id));
//     this.guides = await Promise.all(promise);
//     next();
// })

tourschema.index({ Price: 1, ratingAverage: -1 });
tourschema.index({ slug: 1 });
tourschema.index({ StartLocation: '2dsphere' });
// QUERY MIDDLEWARE

tourschema.pre(/^find/, function(next) {
    this.getDate = Date.now();
    // eslint-disable-next-line no-unused-expressions
    this.find({
        SecretTour: {
            $ne: true,
        },
    });
    next();
});

tourschema.pre(/^find/, function(next) {
    this.populate({ path: 'guides', select: '-__v' });
    next();
});

tourschema.post(/^find/, function(docs, next) {
    /*console.log(`Query took ${Date.now() - this.getDate} milliseconds`);
    console.log(docs);*/
    next();
});
// eslint-disable-next-line spaced-comment
//AGREGATE MIDDLEWARE
// tourschema.pre('aggregate', function(next) {
//     this.pipeline().unshift({
//         $match: {
//             SecretTour: {
//                 $ne: true,
//             }, 
//         },
//     });
//     // console.log(this.pipeline());
//     next();
// });

const Tour = mongoose.model('Tour', tourschema);

module.exports = Tour;