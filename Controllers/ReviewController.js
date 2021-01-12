const catchAsync = require("./Utils/CatchAsync");

const AppError = require("./Utils/AppError");

const factory = require('./Utils/HandleFactory');

const Review = require('../model/ReviewModel');

// exports.getAllReview = catchAsync(async(req, res, next) => {
//     let filter = {};
//     if (req.params.tourId) filter = { tour: req.params.tourId };
//     const getallReview = await Review.find(filter);
//     res.status(200).json({
//         status: 'success',
//         result: getallReview.length,
//         data: {
//             review: getallReview,
//         },
//     });
// })
exports.SetTourUserId = (req, res, next) => {
        if (!req.body.tour) req.body.tour = req.params.tourId;
        if (!req.body.User) req.body.User = req.user.id;
        next();
    }
    // exports.createReview = catchAsync(async(req, res, next) => {
    //     if (!req.body.tour) req.body.tour = req.params.tourId;
    //     if (!req.body.User) req.body.User = req.user.id;
    //     const createreview = await Review.create(req.body);
    //     if (req.body.User)
    //         res.status(201).json({
    //             status: 'success',
    //             data: {
    //                 createreview,
    //             },
    //         });
    // });
exports.getAllReview = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.CreateReview = factory.CreateOne(Review);
exports.UpdateReview = factory.UpdateOne(Review);
exports.DeleteReview = factory.DeleteOne(Review);