/* eslint-disable no-restricted-globals */
/* eslint-disable space-before-function-paren */
/* eslint-disable import/prefer-default-export */
/* eslint-disable indent */
import axios from 'axios';
import { showAlert } from './alert';

export const resetpassword = async(Password, PasswordConfirm, token) => {
    //console.log(Password, PasswordConfirm);

    try {
        const res = await axios({
            method: 'PATCH',
            url: `http: //127.0.0.1:3000/api/v1/users/resetpassword/${token}`,
            data: {
                Password,
                PasswordConfirm,
            },

        });
        if (res.data.status === 'success') {
            showAlert('success', 'Data Successfully Submitted', 'success');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        };
    } catch (err) {
        showAlert('error', err.response.data.message, 'danger');
    }
};