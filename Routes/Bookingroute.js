const express = require('express');


const BookingController = require('../Controllers/BookingController');

const AuthController = require('../Controllers/Authcontroller');

const router = express.Router();
router.use(AuthController.Protect);
router.get('/Checkout-session/:tourId', BookingController.getCheckOutSession);


router.use(AuthController.restrictTo('admin', 'lead-guide'));
router.route('/').get(BookingController.AllBookings).post(BookingController.createBookings);
router.route('/:id').get(BookingController.getBookings).patch(BookingController.UpdateBookings).delete(BookingController.DeleteBookings);

module.exports = router;