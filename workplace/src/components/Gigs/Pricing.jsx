'use client'
import { useStateProvider } from '@/context/StateContext';
import { useRouter } from 'next/navigation'
import React from 'react'
import { FiClock, FiRefreshCcw } from 'react-icons/fi';
import {BiRightArrowAlt} from 'react-icons/bi'
import { BsCheckLg } from 'react-icons/bs';

const Pricing = () => {

    const router = useRouter();
    const [{ gigData,userInfo }, dispatch] = useStateProvider();

    return (
        <>
            {gigData && (
                <div className='sticky top-36 mb-10 h-max w-96'>
                    <div className='border p-10 flex flex-col gap-5'>
                        <div className='flex justify-between'>
                            <h4 className='text-lg font-normal text-gray-300'>
                                {gigData?.shortDesc}
                            </h4>
                            <h6 className='font-medium text-xs'>{gigData?.price}</h6>
                        </div>
                        <div >
                            <div className='text-gray-400 font-semibold text-sm flex gap-6'>
                                <div className='flex items-center gap-2'>
                                    <FiClock className='text-xl' />
                                    <span>{gigData?.deliveryTime} Days Delivery</span>
                                </div>
                                <div className='flex items-center gap-2'> 
                                    <FiRefreshCcw className='text-xl' />
                                    <span>{gigData?.revisions} Revisions</span>
                                </div>
                            </div>
                        </div>
                        <ul>
                            {gigData?.features.map((feature) => (
                                <li
                                    key={feature}
                                    className='flex items-center gap-3'
                                >
                                    <BsCheckLg className='text-lg text-green-400' />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                            {gigData?.userId === userInfo?.id ? (
                                // if agar user ne hi ye gig banaya he to use edit button dikhega
                                <button
                                    className='flex items-center justify-center text-white bg-green-400 font-bold'
                                    onClick={() => router.push(`/seller/gigs/${gigData?.id}`)}
                                >
                                    <span>EDIT</span>
                                    <BiRightArrowAlt className='text-2xl absolute right-4' />
                                </button>
                            ) : (
                                <button
                                    className='flex items-center justify-center text-white bg-green-400 font-bold'
                                    onClick={() => router.push(`/checkout?gigId=${gigData?.id}`)}
                                >
                                    <span>CONTINUE</span>
                                    <BiRightArrowAlt className='text-2xl absolute right-4' />
                                </button>
                            )}
                    </div>
                    {gigData?.userId !== userInfo?.id && (
                        <div className='flex items-center justify-end gap-3'>
                            <button className='w-5/6 py-1 border border-gray-300 px-5'>
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