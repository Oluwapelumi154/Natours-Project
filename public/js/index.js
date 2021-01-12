/* eslint-disable camelcase */
/* eslint-disable eol-last */
/* eslint-disable import/newline-after-import */
/* eslint-disable indent */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { Signup } from './Signup';
import { Login, Logout } from './login';
import { ForgotPassword } from './emailverify';
import { UpdateSettings } from './UpdateSettings';
import { bookTour } from './stripe';
import { resetpassword } from './passwordreset';
const mapBox = document.getElementById('map');
const Resetbtn = document.getElementById('Resetbtn');
const Loginform = document.querySelector('.form-login');
const forgotpassword = document.querySelector('.forgot-details');

const SignupForm = document.querySelector('.Signup_form');
const userupdateform = document.querySelector('.User-data-form');
const PasswordUpdate = document.querySelector('.Password-Update');
const logout = document.querySelector('.logout');
const bookbtn = document.getElementById('book_tour');
const resetdetails = document.querySelector('.reset-details');

// const Signbtn = document.getElementById('Submit-sign');
/*if (Resetbtn) {
Resetbtn.addEventListener('click', (e) => {
    console.log(e);
});
}*/
if (resetdetails) {

    resetdetails.addEventListener('submit', (e) => {
        const tourId = e.target.dataset;
        console.log(tourId);
        e.preventDefault();
        //const tokenI = e.target.dataset;

        //console.log(tourId);
        const password = document.getElementById('pass').value;
        const newpass = document.getElementById('pass2').value;
        // resetpassword(password, newpass);
        resetpassword(password, newpass, tourId);
    });
}
if (mapBox) {
    const item = JSON.parse(mapBox.dataset.locations);
    displayMap(item);
}
if (Loginform) {
    Loginform.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const Password = document.getElementById('password').value;

        Login(email, Password);
        // eslint-disable-next-line eol-last
    });
}
if (logout) {
    logout.addEventListener('click', Logout);
}
// eslint-disable-next-line no-undef
if (SignupForm) {
    SignupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name-sign').value;
        // console.log(name);
        const email = document.getElementById('email-sign').value;
        const Password = document.getElementById('Password-sign').value;
        const PasswordConfirm = document.getElementById('PasswordConfirm-sign').value;
        Signup(name, email, Password, PasswordConfirm);
    });
}
if (userupdateform) {
    userupdateform.addEventListener('submit', (e) => {
        e.preventDefault();
        const form = new FormData();
        form.append('name', document.getElementById('name-form').value);
        form.append('email', document.getElementById('email-form').value);
        form.append('photo', document.getElementById('photo').files[0]);
        UpdateSettings(form, 'Data');
        console.log(form);
    });
}
if (PasswordUpdate) {
    // eslint-disable-next-line space-before-function-paren
    PasswordUpdate.addEventListener('submit', async(e) => {
        e.preventDefault();
        document.querySelector('.Save-info').textContent = 'Updating...';
        const PasswordCurrent = document.getElementById('CurrentPassword').value;
        const Password = document.getElementById('NewPassword').value;
        const PasswordConfirm = document.getElementById('ConfirmPassword').value;
        await UpdateSettings({
            PasswordCurrent,
            Password,
            PasswordConfirm,
        }, 'Password');
        document.querySelector('.Save-info').textContent = 'Save Password';
        document.getElementById('CurrentPassword').value = '';
        document.getElementById('NewPassword').value = '';
        document.getElementById('ConfirmPassword').value = '';
    });
}
if (bookbtn) {
    bookbtn.addEventListener('click', (e) => {
        e.target.textContent = 'Proccessing...';
        //const { tourId } = e.target.dataset;
        const info = e.target.dataset;
        console.log(info);
        //bookTour(tourId);
    });
}
if (forgotpassword) {
    forgotpassword.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('forgot-mail').value;
        console.log(email);
        ForgotPassword(email);
    });
}