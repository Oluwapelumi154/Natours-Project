/* eslint-disable no-restricted-globals */
/* eslint-disable space-before-function-paren */
/* eslint-disable indent */
/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import { showAlert } from './alert';

export const ForgotPassword = async(email) => {
    console.log(email);
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:3000/api/v1/users/forgotpassword',
            data: {
                email,

            },

        });

        if (res.data.status === 'success') {
            showAlert('success', 'Token sent Successfully to your Mail', 'success');
            window.setTimeout(() => {
                location.assign('/');
            }, 1000);
        }

    } catch (err) {
        console.log(err.response.data.message);
        showAlert('error', err.response.data.message, 'danger');
    }

    // eslint-disable-next-line eol-last
};