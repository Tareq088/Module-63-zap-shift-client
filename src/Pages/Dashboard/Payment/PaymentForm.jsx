import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import useAuth from './../../../Hooks/useAuth';
import Swal from 'sweetalert2';

const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const {parcelId} = useParams();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const {user} = useAuth();
    // console.log(parcelId)
    const [error, setError] = useState(" ");
                // tanstack query diye parcelInfo nitechi
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
    const amount = parcelInfo.cost;
    const amountInCents = parseFloat(amount)*100;
    console.log("amountInCents:", amountInCents)

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
                        // step-1: validate the card
        if(!card){
            return;
        }
        const {error, paymentMethod} = await stripe.createPaymentMethod({type: 'card', card});
        if(error){
            console.log("error", error);
            setError(error.message);
        }
        else{
            setError(" ")
            console.log("payment Method", paymentMethod);
                        // step:2--create payment intent
            const res =await axiosSecure.post('/create-payment-intent',{
            amountInCents,parcelId
            })
            // console.log("res from intent", res);

            const clientSecret = res.data.clientSecret;
                        // step:3-- confirm payment
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                    name: user.displayName,
                    email: user.email
                    },
                },
                });
                if (result.error) {
                    setError(result.error.message);
                } 
                else {
                        setError(" ")
                    if (result.paymentIntent.status === 'succeeded') {
                        console.log('Payment succeeded!');
                        console.log(result);
                        const transactionId = result.paymentIntent.id;
                                //step:4- mark parcel paid also create payment history
                                // const { parcelId, amount, created_by, payment_method, transaction_id } = req.body;
                        const paymentData = {
                            parcelId, 
                            amount,
                            created_by: parcelInfo.created_by,
                            payment_method:result.paymentIntent.payment_method_types,
                            transaction_id:transactionId,
                        }
                        const paymentRes = await axiosSecure.post("/payments",paymentData);
                        console.log(paymentRes)
                        if(paymentRes.data.insertedId){
                            console.log("payment successfully done...");
                             Swal.fire({
                                        icon: 'success',
                                        title: 'Payment Successful!',
                                        html: `<p>Your payment was successful.</p><p><strong>Transaction ID:</strong> ${transactionId}</p>`,
                                        confirmButtonText: 'Go to My Parcels',
                                        }).then(result => {
                                        if (result.isConfirmed) {
                                            navigate('/dashboard/myParcels');
                                        }
                                                        })
                        }
                    }
                }
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
                        Pay ৳ {amount}
                </button>
                { error && <p className='text-sm text-red-800 font-semibold'> {error}</p>}
            </form>
          
        </div>
    );
};

export default PaymentForm;