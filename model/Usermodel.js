/* eslint-disable indent */
const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');


const Userschema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please Provide a name'],
    },
    email: {
        type: String,
        required: [true, 'Please Provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please Provide a valid Email'],
    },
    PasswordChangeAt: Date,

    Password: {
        type: String,
        required: [true, 'Please Provide your Password'],
        minlength: 8,
        select: false,
    },
    photo: { type: String, default: 'default.jpg' },
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user',
    },
    /*bookings: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Booking',
    }],*/
    Passwordresettoken: String,
    PasswordresetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false,
    },
    PasswordConfirm: {
        type: String,
        required: [true, 'Please Confirm your Passowrd'],
        validate: {
            validator(el) {
                return el === this.Password;
            },

            message: 'Password are not the same',
        },
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
//users/:id/bookings
Userschema.pre('save', async function(next) {
    if (!this.isModified('Password')) return next();

    this.Password = await bcrypt.hash(this.Password, 12);
    this.PasswordConfirm = undefined;
    next();
});

Userschema.pre('save', function(next) {
    if (!this.isModified('Password') || this.isNew) return next();
    this.PasswordChangeAt = Date.now() - 1000;
    next();
});
Userschema.pre(/^find/, function(next) {
    this.find({ active: { $ne: false } });
    next();
});
Userschema.virtual('bookings', {
    ref: 'Booking',
    foreignField: 'user',
    localField: '_id',

});
/*Userschema.pre(/^find/, function(next) {

    this.populate('bookings');

    next();
});
*/
Userschema.methods.Correctpassword = async function(
    CandidatePassword,
    Userpassword,
) {
    return await bcrypt.compare(CandidatePassword, Userpassword);
};
Userschema.methods.changePasswordAfter = function(JWTtimeStamp) {
    if (this.PasswordChangeAt) {
        const conv = parseInt(this.PasswordChangeAt.getTime() / 1000, 10);
        console.log(conv, JWTtimeStamp);
        return JWTtimeStamp < conv;
    }
    return false;
};
Userschema.methods.CreatePasswordResetToken = function() {
    const resettoken = crypto.randomBytes(32).toString('hex');
    this.Passwordresettoken = crypto.createHash('sha256').update(resettoken).digest('hex');
    //console.log(this.Passwordresettoken);
    //console.log({ resettoken }, this.Passwordresettoken);
    this.PasswordresetExpires = Date.now() + 3 * 60 * 1000;
    return resettoken;
};
const user = mongoose.model('user', Userschema);

module.exports = user;