/* eslint-disable quotes */
/* eslint-disable indent */
const multer = require('multer');
const sharp = require('sharp');
const User = require('../model/Usermodel');
const Booking = require("../model/bookingModel");
const catchAsync = require('./Utils/CatchAsync');
const AppError = require('./Utils/AppError');
const factory = require('./Utils/HandleFactory');

/*const multerStorage = multer.diskStorage({
destination: (req, file, cb) => {
        cb(null, 'public/User-images');
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[0];
        cb(null, `users-${req.user.id}-${Date.now()}.${ext}`);
    },
});*/
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
exports.uploaduserphoto = upload.single('photo');
// eslint-disable-next-line consistent-return
// eslint-disable-next-line space-before-function-paren
exports.resizeuserphoto = catchAsync(async(req, res, next) => {
    req.file.filename = `users-${req.user.nid}-${Date.now()}.jpeg`;
    if (!req.file) return next();
    await sharp(req.file.buffer)
        .resize(300, 300).toFormat('jpeg').jpeg({
            quality: 90,
        })
        .toFile(`public/User-images/${req.file.filename}`);
    next();
});
const filterObj = (obj, ...allowedfields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowedfields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};


exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};
exports.DeleteMe = catchAsync(async(req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });
    res.status(204).json({
        status: 'success',
        data: {
            User: null,
        },

    });
});
exports.UpdateMe = catchAsync(async(req, res, next) => {

    if (req.body.Password || req.body.PasswordConfirm) {
        return next(new AppError('These Route is yet to be implemented use /UpdateMypassword', 400));
    }
    const Filteredbody = filterObj(req.body, 'name', 'email');
    if (req.file) Filteredbody.photo = req.file.filename;
    // eslint-disable-next-line max-len
    const UpdatedUser = await User.findByIdAndUpdate(req.user.id, Filteredbody, { new: true, runValidators: true });
    res.status(200).json({
        status: 'success',
        data: {
            user: UpdatedUser,
        },

    });
});
exports.CreateUsers = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet implented /Please use SignUp instead',
    });
};

exports.getallUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.getUserbooking = factory.getUserBookings(Booking);
exports.Updateuser = factory.UpdateOne(User);
exports.DeleteUser = factory.DeleteOne(User);