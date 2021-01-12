/* eslint-disable no-restricted-globals */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-alert */
/* eslint-disable quote-props */
/* eslint-disable no-empty */
/* eslint-disable no-console */
/* eslint-disable spaced-comment */
/* eslint-disable no-undef */
/* eslint-disable space-before-function-paren */
/* eslint-disable indent */
// eslint-disable-next-line no-var
// eslint-disable-next-line no-alert
// eslint-disable-next-line no-undefined

// eslint-disable-next-line import/newline-after-import

import axios from 'axios';
import { showAlert } from './alert';

export const Login = async(email, Password) => {
    console.log(email, Password);
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:3000/api/v1/users/login',
            data: {
                email,
                Password,
            },

        });
        if (res.data.status === 'success') {
            showAlert('success', 'Login Successfully', 'success');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
    } catch (err) {
        showAlert('error', err.response.data.message, 'danger');
    }

    // eslint-disable-next-line eol-last
};
export const Logout = async() => {
    try {
        const res = await axios({
            method: 'GET',
            url: 'http://127.0.0.1:3000/api/v1/users/logout',

        });
        if (res.data.status === 'success') {
            location.reload(true);
        }
    } catch (err) {
        showAlert('error', 'Error Logging out Try Again !');
    }
};