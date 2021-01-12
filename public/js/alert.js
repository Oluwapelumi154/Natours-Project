/* eslint-disable indent */
/* eslint-disable import/prefer-default-export */
// Type is 'success' or 'err
const HideAlert = () => {
    const el = document.querySelector('.alert');
    if (el) {
        el.parentElement.removeChild(el);
    }
};
export const showAlert = (type, msg, color) => {
    const markup = `<div class='alert d-flex justify-content-center alert--${type} alert-${color}' role='alert'>${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
    window.setTimeout(HideAlert, 5000);
}