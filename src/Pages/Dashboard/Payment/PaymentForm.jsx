import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useParams } from 'react-router';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const {parcelId} = useParams();
    const axiosSecure = useAxiosSecure();
    // console.log(parcelId)
    const [error, setError] = useState(" ");

    const {data:parcelInfo = {}, isPending} = useQuery({
        queryKey:['parcels', parcelId],
        queryFn: async() =>{
            const res = await axiosSecure.get(`/parcels/${parcelId}`)
            return res.data;
        }
    })
    if (isPending){
        return ".......loading"
    }
    console.log(parcelInfo);
    const price = parcelInfo.cost;
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
            setError(error.message)
        }
        else{
            setError(" ")
            console.log("payment Method", paymentMethod)
        }
    }
    return (
        <div>
            <form onSubmit={handleSubmit} className='space-y-4 bg-white p-6 rounded-2xl shadow-md w-full max-w-md mx-auto'>
                <CardElement className='p-2 border rounded'>
                   
                </CardElement>
                <button type='submit' 
                    className='btn btn-primary w-full text-black'
                    disabled={!stripe}>
                        Pay ৳ {price}
                </button>
                { error && <p className='text-sm text-red-800 font-semibold'> {error}</p>}
            </form>
          
        </div>
    );
};

export default PaymentForm;