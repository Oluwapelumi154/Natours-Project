/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
/* eslint-disable indent */
/* eslint-disable prefer-destructuring */
const nodemailer = require('nodemailer');

const pug = require('pug');
const html_text_to = require('html-to-text');
/*module.exports = class Email {
constructor(user, url) {

}*/

module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstname = user.name.split(' ')[0];
        this.url = url;
        this.from = `Orebayo pelumi <${process.env.EMAIL_FROM}>`;
    }

    newTransport() {
        if (process.env.NODE_ENV === 'production') {
            console.log(process.env.NODE_ENV);
            return nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.USER_GMAIL,
                    pass: process.env.PASS_GMAIL,
                },
            });
        };
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }

    async send(template, subject) {
        const html = pug.renderFile(`./views/email/${template}.pug`, {
            Firstname: this.firstname,
            url: this.url,
            subject,
        });
        const Mailoptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: html_text_to.toString(html),
        };
        await this.newTransport().sendMail(Mailoptions);
    }

    async sendWelcome() {
        await this.send('welcome', 'Welcome to Natours Family');
    }

    async sendPasswordReset() {
        await this.send('Password', 'Your password reset token valid for only 10minutes');
    }
};