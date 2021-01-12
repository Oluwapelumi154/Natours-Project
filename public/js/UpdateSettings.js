/* eslint-disable space-before-function-paren */
/* eslint-disable indent */
/* eslint-disable import/prefer-default-export */
/* eslint-disable import/first */
/* eslint-disable import/order */
// eslint-disable-next-line import/prefer-default-export

import axios from 'axios';
import { showAlert } from './alert';

export const UpdateSettings = async(data, type) => {
    try {
        const url = type === 'Password' ? 'http://127.0.0.1:3000/api/v1/users/UpdateMyPassword' : 'http://127.0.0.1:3000/api/v1/users/UpdateMe'
        const res = await axios({
            method: 'PATCH',
            url,
            data,
        });

        if (res.data.status === 'success') {
            console.log(res.data.status);
            showAlert('Success', `${type} Successfully Submitted`, 'success');

        };
    } catch (err) {
        showAlert('error', err.response.data.message, 'danger');
    }
    // eslint-disable-next-line eol-last
};