/* eslint-disable space-before-function-paren */
/* eslint-disable indent */
const multer = require('multer');
const sharp = require('sharp');
const Apifeatures = require('./Utils/ApiFeatures');
const catchAsync = require('./Utils/CatchAsync');
const AppError = require('./Utils/AppError');
const Tour = require('../model/tourmodel');
const factory = require('./Utils/HandleFactory');
const Booking = require('../model/bookingModel');

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
    // eslint-disable-next-line no-empty
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an Image Please Upload an Image Only!', 400), false);
    }
};
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
});
exports.UploadtourImages = upload.fields([
    { name: 'imageCover', maxCount: 1 },
    { name: 'images', maxCount: 3 },
]);
exports.resizetourimages = catchAsync(async(req, res, next) => {
    console.log(req.files);
    if (!req.files.imageCover || !req.files.images) return next();
    req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
        .resize(2000, 1333).toFormat('jpeg').jpeg({
            quality: 90,
        })
        .toFile(`public/img/${req.body.imageCover}`);
    // images
    req.body.images = [];
    await Promise.all(req.files.images.map(async(file, i) => {
        const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;
        await sharp(file.buffer)
            .resize(2000, 1333).toFormat('jpeg').jpeg({
                quality: 90,
            })
            .toFile(`public/img/${filename}`);
        req.body.images.push(filename);
    }));
    console.log(req.body);
    next();
});
// eslint-disable-next-line space-before-function-paren
exports.aliasTour = async(req, res, next) => {
    req.query.limit = '3';
    // eslint-disable-next-line indent
    req.query.sort = '-Price -ratingAverage';
    req.query.fields = 'name Price';
    next();
};



exports.getAlltours = factory.getAll(Tour);

exports.getTour = factory.getOne(Tour, 'Reviews');
exports.getBookedtours = catchAsync(async(req, res, next) => {
    let tour;
    if (req.params.tourId) {
        tour = Booking.findOne({
            tour: req.params.tourId,
        });
    }




    const doc = await tour;
    if (!doc) {
        return next(new AppError('No booking found with that ID', 404));
    }
    res.status(200).json({
        status: 'success',

        data: {
            data: doc,


        },
    });
});
exports.Createtour = factory.CreateOne(Tour);


exports.updatetour = factory.UpdateOne(Tour);


exports.Deletetour = factory.DeleteOne(Tour);

exports.getTourStat = catchAsync(async(req, res, next) => {
    const stat = await Tour.aggregate([{

            $group: {
                _id: {
                    $toUpper: '$name',
                },
                maxPrice: {
                    $max: '$Price',
                },
                minPri: {
                    $min: '$Price',
                },
                numTour: {
                    $sum: 1,
                },
                totalPrice: {
                    $sum: '$Price',
                },
            },
        },
        {
            $sort: {
                maxPrice: 1,
            },
        },
    ]);
    res.status(200).json({
        status: 'success',
        data: {
            stat,
        },
    });
});

exports.getMonthlyplan = catchAsync(async(req, res, next) => {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([{
            $unwind: '$startDates',
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`),
                },
            },
        },
        {
            $group: {
                _id: {
                    $month: '$startDates',
                },
                numTours: {
                    $sum: 1,
                },
                tours: {
                    $push: '$name',
                },



            },
        },
        {
            $addFields: {
                month: '$_id',


            },

        },
        {
            $project: {
                _id: 0,
            },
        },
        {
            $sort: {
                tours: -1,
            },
        },
        {
            $limit: 12,
        },
    ]);
    res.status(200).json({
        status: 'Success',
        data: {
            plan,
        },
    });
});
exports.getToursWithin = catchAsync(async(req, res, next) => {
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');
    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
    if (!lat || !lng) {
        return next(new AppError('Please Provide in the Format lat,lng', 400));
    }
    const tours = await Tour.find({
        StartLocation: {
            $geoWithin: {
                $centerSphere: [
                    [lng, lat], radius,
                ],
            },
        },
    });
    console.log(tours);
    res.status(200).json({
        status: 'Success',
        result: tours.length,
        data: {
            data: tours,
        },

    });
});
exports.getDistance = catchAsync(async(req, res, next) => {
    const { latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');
    const multiplier = unit === 'mi' ? 0.000621371 : 0.001;
    if (!lat || !lng) {
        return next(new AppError('Please Provide in the Format lat,lng', 400));
    }
    const distances = await Tour.aggregate([{
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [lng * 1, lat * 1],
                },
                distanceField: 'distance',
                distanceMultiplier: multiplier,
            },
        },
        {
            $project: {
                distance: 1,
                name: 1,
            },

        },
    ]);
    res.status(200).json({
        status: 'Success',
        data: {
            data: distances,
        },

    });
});