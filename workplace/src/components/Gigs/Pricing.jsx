'use client'
import { useStateProvider } from '@/context/StateContext';
import { useRouter } from 'next/navigation'
import React from 'react'
import { FiClock, FiRefreshCcw } from 'react-icons/fi';
import {BiRightArrowAlt} from 'react-icons/bi'
import { BsCheckLg } from 'react-icons/bs';


const Pricing = () => {

    const router = useRouter();
    const [{ gigData,userInfo }] = useStateProvider();

    return (
        <>
            {gigData && (
                <div className='sticky border border-gray-300 rounded-md top-36 mb-10 h-max w-96'>
                    <div className='border p-6 rounded-lg shadow-lg flex flex-col gap-6'>
                        <div className='flex justify-between items-center'>
                            <h4 className='text-lg font-medium text-gray-800'>
                                {gigData?.shortDesc}
                            </h4>
                            <h6 className='font-bold text-lg text-green-600'>
                                ${gigData?.price}
                            </h6>
                        </div>

                        <div className='text-gray-400 font-medium text-sm flex gap-6'>
                            <div className='flex items-center gap-2'>
                                <FiClock className='text-xl text-blue-500' />
                                <span>{gigData?.deliveryTime} Days Delivery</span>
                            </div>
                            <div className='flex items-center gap-2'> 
                                <FiRefreshCcw className='text-xl text-blue-500' />
                                <span>{gigData?.revisions} Revisions</span>
                            </div>
                        </div>
                        
                        <ul className='space-y-3'>
                            {gigData?.features.map((feature) => (
                                <li
                                    key={feature}
                                    className='flex items-center gap-3 text-gray-700 text-sm'
                                >
                                    <BsCheckLg className='text-lg text-green-500' />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                            {gigData?.userId === userInfo?.id ? (
                                // if agar user ne hi ye gig banaya he to use edit button dikhega
                                <button
                                    className='relative flex items-center justify-center py-2 px-4 bg-green-500 text-white font-bold rounded-md hover:bg-green-600'
                                    onClick={() => router.push(`/seller/gigs/${gigData?.id}`)}
                                >
                                    <span>EDIT</span>
                                    <BiRightArrowAlt className='text-2xl absolute right-4' />
                                </button>
                            ) : (
                                <button
                                    className='relative flex items-center justify-center py-2 px-4 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600'
                                    onClick={() => router.push(`/paymentForm?gigId=${gigData?.id}`)}
                                >
                                    <span>CONTINUE</span>
                                    <BiRightArrowAlt className='text-2xl absolute right-4' />
                                </button>
                            )}
                    </div>
                    {gigData?.userId !== userInfo?.id && (
                        <div className='flex justify-end mt-4'>
                            <button className='py-2 w-full px-6 border border-black text-gray-700 rounded-md hover:bg-gray-100'>
                                Contact Me
                            </button>
                        </div>
                    )}
                </div>
            )}
        </>
    )
}

export default Pricing