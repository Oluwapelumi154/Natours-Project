const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({
    path: './config.env',
});
const app = require('./app');
// console.log(process.env.DATABASE_LOCAL);
mongoose.connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
}).then(() => console.log('DB connection Successful'));
const port = 3000;
app.listen(port, () => {
    console.log(`App running on Port ${port}`);
});