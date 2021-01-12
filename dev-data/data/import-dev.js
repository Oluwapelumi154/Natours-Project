const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../model/tourmodel');
const Users = require('../../model/Usermodel');
const review = require('../../model/ReviewModel');

dotenv.config({
    path: './config.env',
});

// console.log(process.env.DATABASE_LOCAL);
mongoose
    .connect(process.env.DATABASE_LOCAL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
    .then(() => console.log('DB connection Successful'));
// READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tour-simple.json`, 'utf-8'));
//const reviews = JSON.parse(fs.readFileSync(`${__dirname}/review.json`, 'utf-8'));
//const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
// Import data into DB
const importdata = async() => {
    try {
        await Tour.create(tours);
        //await Users.create(users, { validateBeforeSave: false });
        // await review.create(reviews);
        console.log('Data Successfully Created');
    } catch (err) {
        console.log(err);
    }
    process.exit();
};
const deletedata = async() => {
    try {
        await Tour.deleteMany();
        // await Users.deleteMany();
        // await review.deleteMany();
        console.log('Data Successfully deleted');
    } catch (err) {
        console.log(err);
    }
    process.exit();
};
if (process.argv[2] === '--import') {
    importdata();
} else if (process.argv[2] === '--delete') {
    deletedata();
}