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

export const Signup = async(name, email, Password, PasswordConfirm) => {
    console.log(name, email, Password, PasswordConfirm);
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:3000/api/v1/users/signup',
            data: {
                name,
                email,
                Password,
                PasswordConfirm,
            },

        });
        console.log(res.data.status);
        if (res.data.status === 'success') {
            showAlert('success', 'Data Successfully Submitted', 'success');
            window.setTimeout(() => {
                location.assign('/');
            }, 5000);
        };
    } catch (err) {
        showAlert('error', err.response.data.message, 'danger');
    }
};