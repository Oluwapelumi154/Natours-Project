const express = require('express');

const router = express.Router();
const tourController = require('../Controllers/tourController');
const AuthController = require('../Controllers/Authcontroller');
// const { route } = require('./userRoute');
const Reviewroute = require('./Reviewroute');

//const Bookroute = require('./Bookingroute');

router.use('/:tourId/reviews', Reviewroute);
//router.use('/:tourId/bookings', Bookroute);
router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(tourController.getToursWithin);
router.route('/distances/:latlng/unit/:unit').get(tourController.getDistance);
router.route('/tour-stat').get(tourController.getTourStat);
router.route('/monthly-plan/:year').get(tourController.getMonthlyplan);
router.route('/top5-tours').get(tourController.aliasTour, tourController.getAlltours);
router.route('/').get(tourController.getAlltours).post(AuthController.Protect, AuthController.restrictTo('admin', 'lead-guide'), tourController.Createtour);
router.route('/:id/').get(tourController.getTour).patch(AuthController.Protect, AuthController.restrictTo('admin', 'lead-guide'), tourController.UploadtourImages, tourController.resizetourimages, tourController.updatetour).delete(AuthController.Protect, AuthController.restrictTo('admin', 'lead-guide'), tourController.Deletetour);
router.route('/:tourId/bookings').get(tourController.getBookedtours);
module.exports = router;