'use client'
import CheckoutForm from '@/components/CheckOutForm';
import { CREATE_ORDER } from '@/utils/constant';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';

const stripePromise = loadStripe("pk_test_51QbRQjGdqwTyou2eZMVq67IqXoW4sU9bHCiF1ISx63aFmXfMjOiQ73DHzCVEX1dNyiqh8xhZFxjMyMluiex6yzAU00PVldU9Pq");

const page = () => {
    const router = useRouter();
    const [cookies] = useCookies();
    const [clientSecret, setClientSecret] = useState('');

    const query = useSearchParams();
    // console.log(query.get('gigId'))
    const gigId = query.get('gigId');
    // console.log(gigId);
    useEffect(() => {
        const createOrder = async () => {
            try {
                const {data: {clientSecret}} = await axios.post(CREATE_ORDER,{gigId},{withCredentials: true});
                setClientSecret(clientSecret);
                // console.log(data);
                
            } catch (error) {
                console.log(error);
            }
        };
        if(gigId) createOrder();
    },[query,gigId]);

    // this two variable for Stripe
    const appearance = {
        theme: "stripe"
    };
    const options = {
        clientSecret,
        appearance
    };
    


    console.log('secret', clientSecret);
    return (
        <div className='min-h-[80vh] max-w-full mx-20 flex flex-col gap-1 items-center'>
            <h3 className='text-3xl'>
                Please the complete the payment to place the Order
            </h3>
            {clientSecret && (
                <Elements options={options} stripe={stripePromise}>
                    <CheckoutForm/>
                </Elements>
            )}
        </div>
    )
}

export default page