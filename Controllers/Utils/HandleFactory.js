/* eslint-disable indent */
const catchAsync = require("../Utils/CatchAsync");

const AppError = require('./AppError');
const Apifeatures = require("../Utils/ApiFeatures");

exports.DeleteOne = Model => catchAsync(async(req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
        return next(new AppError('No doc found with that ID', 404));
    }
    res.status(204).json({
        status: 'success',
        data: null,
    });

});
exports.UpdateOne = Model => catchAsync(async(req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        status: 'success',
        data: {
            data: doc,

        },
    });
});
exports.CreateOne = Model => catchAsync(async(req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            data: doc,
        },
    });
});
exports.getOne = (Model, PopulateOption) => catchAsync(async(req, res, next) => {
    let tour;


    tour = Model.findById(req.params.id);
    if (PopulateOption) {
        tour = tour.populate(PopulateOption);
    }
    const doc = await tour;
    if (!doc) {
        return next(new AppError('No document found with that ID', 404));
    }
    res.status(200).json({
        status: 'success',

        data: {
            data: doc,

        },
    });
});
/*exports.getOne2 = (Model, PopulateOption) => catchAsync(async(req, res, next) => {
    let tour = Model.findById(req.params.id);
    if (PopulateOption) {
        tour = tour.populate(PopulateOption);
    }
    const doc = await tour;
    if (!doc) {
        return next(new AppError('No document found with that ID', 404));
    }
    res.status(200).json({
        status: 'success',

        data: {
            data: doc,

        },
    });
    next();
});*/
exports.getUserBookings = (Model, PopulateOption) => catchAsync(async(req, res, next) => {
    let tour;
    if (req.params.UserId) {
        tour = Model.findOne({
            user: req.params.UserId,
        });
    }



    if (PopulateOption) {
        tour = tour.populate(PopulateOption);
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

exports.getAll = (Model) => catchAsync(async(req, res, next) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new Apifeatures(Model.find(filter), req.query)
        .filter()
        .sort()
        .limitfields()
        .paginate();
    const tours = await features.query;

    // var tours = await Tour.find().where('Price').equals(800).where('Duration').equals(5);
    // SEND RESPONSE
    res.status(200).json({
        status: 'success',
        result: tours.length,
        data: {
            data: tours,
        },
    });

});
/*exports.getTourBookings = (Model, PopulateOption) => catchAsync(async(req, res, next) => {
    let tour;
    if (req.params.tourId) {
        tour = Model.findOne({
            tour: req.params.tourId,
        });
    }



    if (PopulateOption) {
        tour = tour.populate(PopulateOption);
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
});*/