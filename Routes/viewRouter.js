const express = require('express');
const viewController = require('../Controllers/Viewcontroller');
const Authcontroller = require('../Controllers/Authcontroller');
const bookingController = require('../Controllers/BookingController');

const router = express();
//router.use(Authcontroller.isLoggedIn);
router.get('/', bookingController.CreateBookingCheckout, Authcontroller.isLoggedIn, viewController.getOverview);
router.get('/tour/:slug', Authcontroller.isLoggedIn, viewController.getTours);
router.get('/login', Authcontroller.isLoggedIn, viewController.Login);

router.get('/signup', Authcontroller.isLoggedIn, viewController.signup);

router.get('/me', Authcontroller.Protect, viewController.getAccount);
router.get('/forgotpassword', Authcontroller.isLoggedIn, viewController.Emailverify);
router.get('/resetpassword/', viewController.ResetPassword);
router.get('/resetdetails', viewController.forms);
router.get('/my-tours', Authcontroller.Protect, viewController.getMyTours);
router.post('/submit-user-data', Authcontroller.Protect, viewController.UpdateUserdata);
module.exports = router;