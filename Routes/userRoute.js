const express = require('express');


const router = express.Router();
const Bookingroute = require("./Bookingroute");

const userController = require('../Controllers/userController');
//const BookingController = require('../Controllers/BookingController');
const Authcontroller = require('../Controllers/Authcontroller');

//router.use('/:UserId/bookings', Bookingroute);
router.post('/signup', Authcontroller.Signup);
router.post('/login', Authcontroller.Login);
router.get('/logout', Authcontroller.Loggout);
router.post('/forgotpassword', Authcontroller.forgotpassword);
router.patch('/resetpassword/:token', Authcontroller.resetPassword);
router.use(Authcontroller.Protect);
router.patch('/UpdateMyPassword', Authcontroller.UpdatePassword);

router.patch('/UpdateMe', userController.uploaduserphoto, userController.resizeuserphoto, userController.UpdateMe);
router.delete('/DeleteMe', userController.DeleteMe);
router.get('/Me', userController.getMe, userController.getUser);
router.use(Authcontroller.restrictTo('admin', 'lead-guide'));
router
    .route('/')
    .get(userController.getallUsers)
    .post(userController.CreateUsers);
router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.Updateuser)
    .delete(userController.DeleteUser);
router
    .route('/:UserId/Bookings')
    .get(userController.getUserbooking);
module.exports = router;