import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React from 'react';

const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async(e) =>{
        e.preventDefault();
        // payment method or card er data na thakle return kore dibe
        if(!stripe || !elements){
            return;
        }
         // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
        const card = elements.getElement(CardElement);
        if(!card){
            return;
        }
        const {error, paymentMethod} = await stripe.createPaymentMethod({type: 'card', card});
        if(error){
            console.log("error", error);
        }
        else{
            console.log("payment Method", paymentMethod)
        }

    }
  
    return (
        <div>
            <form onSubmit={handleSubmit} className='space-y-4 bg-white p-6 rounded-2xl shadow-md w-full max-w-md mx-auto'>
                <CardElement className='p-2 border rounded'>
                    <button type='submit' 
                    className='btn btn-primary w-full'
                    disabled={!stripe}>
                        Pay for parcel pick up
                    </button>
                </CardElement>
            </form>
          
        </div>
    );
};

export default PaymentForm;