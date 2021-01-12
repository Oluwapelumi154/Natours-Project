/* eslint-disable*/
import axios from 'axios';
import { showAlert } from './alert';
const stripe = Stripe('pk_test_51HSsOMEv38KztpmqUcITPjmyuuFestFzpWjq6IDYfUZ2xqOZXXz5Dkh9HUPwNVnWSi6SkF9vna3mA295rsrraQ6d00HnjpwEBG');
export const bookTour = async(tourId) => {
    try {

        //1) Get Checkout session from Api
        const session = await axios(`http://127.0.0.1:3000/api/v1/booking/Checkout-session/${tourId}`);
        console.log(session);
        //2)Create Checkout Form and charge Credit card
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id,
        });
    } catch (err) {
        showAlert('error', err, 'danger');

    }
}