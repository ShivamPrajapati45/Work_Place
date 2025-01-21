'use client'
import { ORDER_SUCCESS_ROUTE } from '@/utils/constant';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'
import { useCookies } from 'react-cookie';

const page = () => {
    const router = useRouter();
    const query = useSearchParams();
    const [cookies] = useCookies();
    const orderId = query.get('orderId');

    useEffect(() => {
        // if(orderId){
            setTimeout(() => {
                router.push('/buyer/orders')
            }, 3000);
        // }

    },[orderId, query])

    return (
        <div className='flex items-center px-20 pt-10 flex-col h-[80vh]'>
            <h1 className='text-4xl text-center'>
                Payment Successful. You are being redirected to the orders page
            </h1>
            <h1 className='text-4xl text-center'>please do not refresh and close the page</h1>
        </div>
    )
}

export default page