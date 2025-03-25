'use client'
import React, { useEffect, useState } from 'react'
import { GET_USER_GIGS } from '@/utils/constant';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const page = () => {
    const router = useRouter();
    const [gigs, setGigs] = useState([]);

    useEffect(() => {
        const getUserGigs = async () => {
            try{
                const { data } = await axios.get(GET_USER_GIGS,{withCredentials: true});
                // console.log('gig', data);
                setGigs(data?.gigs);
        
            }catch(err){
                console.log('err', err);
            }
        };
        getUserGigs();
    },[])

    

    return (
        <div className='min-h-[80vh] my-10 mt-0 px-32'>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                {gigs?.length === 0 && (
                    <div className="flex flex-col justify-center items-center h-[65vh] text-center">
                        <div className='w-1/2 h-1/2'>
                            <img className='h-full w-full object-contain' src="/images/create_service.jpg" alt="" />
                        </div>
                        <p className="text-gray-700 text-xl font-semibold mb-4">
                            You haven't created any service yet!
                        </p>
                        <p className="text-gray-500 mb-6">
                            Start by creating your first service and attract potential buyers.
                        </p>
                        <button
                            onClick={() => router.push('/seller/gigs/create')}
                            className="bg-primary_button text-white px-6 py-3 rounded-md hover:bg-primary_button_hover transition">
                            Create your first Service
                        </button>
                    </div>
                )}

                {gigs?.length > 0 && (
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Category
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Price
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Delivery time
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Edit
                                </th>
                            </tr>
                        </thead>    
                        <tbody>
                            {gigs?.map(({title, category, price, deliveryTime,id}, key) => {
                                return (
                                    <tr key={id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {title}
                                        </th>
                                        <td className="px-6 py-4">
                                            {category}
                                        </td>
                                        <td className="px-6 py-4">
                                            {price}
                                        </td>
                                        <td className="px-6 py-4">
                                            {deliveryTime}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link 
                                                className='font-medium text-blue-600 dark:text-blue-300 hover:underline'
                                                href={`/seller/gigs/${id}`}
                                            >
                                                Edit
                                            </Link>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                )}

            </div>
        </div>
    )
}

export default page