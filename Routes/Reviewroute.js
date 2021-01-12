const express = require('express');

const router = express.Router({ mergeParams: true });


const Reviewroute = require('../Controllers/ReviewController');

const AuthController = require('../Controllers/Authcontroller');

const BookingController = require('../Controllers/BookingController');

router.route('/').get(Reviewroute.getAllReview);
router.route('/:id').get(Reviewroute.getReview).delete(Reviewroute.DeleteReview).post(AuthController.Protect, AuthController.restrictTo('user'), Reviewroute.SetTourUserId, Reviewroute.CreateReview);
module.exports = router;