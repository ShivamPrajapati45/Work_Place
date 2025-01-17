import React, { useEffect, useState } from 'react'
import {
    useStripe,
    useElements,
    PaymentElement
} from '@stripe/react-stripe-js'
import { CREATE_ORDER } from '@/utils/constant';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';


const CheckOutPage = ({ amount }) => {
    const stripe = useStripe();
    const elements = useElements();

    const [errorMessage, setErrorMessage] = useState('');
    const [clientSecret, setClientSecret] = useState('');
    const [loading, setLoading] = useState(false);
    const query = useSearchParams();
    const gigId = query.get('gigId');
    const orderId = query.get('orderId')

    useEffect(() => {
        const createOrder = async () => {
            try {
                const {data: {clientSecret}} = await axios.post(CREATE_ORDER,{gigId,orderId},{withCredentials: true});
                setClientSecret(clientSecret);
                // console.log(data);
                
            } catch (error) {
                console.log(error);
            }
        };
        if(gigId) createOrder();

    },[query,gigId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if(!stripe || !elements){
            return;
        }

        const {error} = await elements.submit();
        if(error){
            setErrorMessage(error.message);
            setLoading(false);
            return;
        }

        const {err} = await stripe.confirmPayment({
            elements,
            clientSecret,
            confirmParams: {
                return_url: `${window.location.origin}/success`
            }
        });

        if(err){
            setErrorMessage(err)
        }else{

        }
        setLoading(false);
    };

    if(!clientSecret || !stripe || !elements){
        console.log({clientSecret, stripe, elements})
        return (
            <div className="flex items-center justify-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                role="status"
            >
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                    loading...
                </span>
            </div>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className='mb-20'>
            {clientSecret && <PaymentElement/>} 
            {errorMessage && <div>{errorMessage}</div>}
            <button
                disabled={!stripe || loading}
                className="text-white w-full p-3 bg-green-600 mt-2 rounded-md font-bold disabled:opacity-50 disabled:animate-pulse"
            >
                {!loading ? `Pay $${amount}` : 'processing...'}
            </button>
        </form>
    )
}

export default CheckOutPage