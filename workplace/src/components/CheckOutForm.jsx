import React, { useState } from "react";
import {
    useStripe,
    useElements,
    PaymentElement,
} from "@stripe/react-stripe-js";

export default function CheckoutForm({ amount,clientSecret }) {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    console.log(clientSecret)

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsLoading(true);
        if (!stripe || !elements) {
        // Stripe.js hasn't yet loaded.
        // Make sure to disable form submission until Stripe.js has loaded.
        return;
        }


        const { error } = await stripe.confirmPayment({
            elements,
            clientSecret,
            confirmParams: {
                // Make sure to change this to your payment completion page
                return_url: `${window.location.origin}/success`
            },
        }); 

        // This point will only be reached if there is an immediate error when
        // confirming the payment. Otherwise, your customer will be redirected to
        // your `return_url`. For some payment methods like iDEAL, your customer will
        // be redirected to an intermediate site first to authorize the payment, then
        // redirected to the `return_url`.
        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message);
        } else {
            setMessage("An unexpected error occurred.");
        }

        setIsLoading(false);
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
        <form onSubmit={handleSubmit} >
            {clientSecret && <PaymentElement/>}
            {message && <div>{message}</div>}
            <button
                disabled={!stripe || isLoading}
                className="text-white w-full p-5 bg-black mt-2 rounded-md font-bold disabled:opacity-50 disabled:animate-pulse"
            >
                {!isLoading ? `Pay $${amount}` : 'processing...'}
            </button>
        </form>
    ); 
    }