import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React from 'react';
import PaymentForm from './PaymentForm';
const stripePromise = loadStripe('pk_test_6pRNASCoBOKtIshFeQd4XMUh')

const Payment = () => {
    return (
        <div>
            <Elements stripe={stripePromise}>
                <PaymentForm></PaymentForm>
            </Elements>
        </div>
    );
};

export default Payment;