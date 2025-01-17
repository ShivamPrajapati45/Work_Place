'use client'
import CheckOutPage from '@/components/CheckOutPage';
import { GET_GIG_DATA } from '@/utils/constant';
import convertToSubCurrency from '@/utils/convertToSubCurrency';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

if(!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY){
    throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined")
};
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const page = () => {
    const param = useSearchParams();
    const gigId = param.get('gigId');
    const [gig, setGig] = useState(null);

    useEffect(() => {
        const getGigData = async () => {
            const res = await axios.get(`${GET_GIG_DATA}/${gigId}`,{withCredentials: true});
            if(res.data.success){
                setGig(res.data.gig);
            }
        }
        getGigData();

    },[param, gigId]);
    console.log('GigData: ',gig);

    const amount = 50;
    return (
        <div className='min-h-[80vh] max-w-full mx-20 flex flex-col gap-1 items-center'>
            <h1>Payment Amount {gig?.price/2}</h1>
            <Elements 
                stripe={stripePromise}
                options={{
                    mode: 'payment',
                    amount: convertToSubCurrency(gig?.price) || 5000,
                    currency: 'usd',
                }}
            >
                <CheckOutPage amount={gig?.price/2} />
            </Elements>
        </div>
    )
}

export default page