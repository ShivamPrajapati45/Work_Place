'use client'
import { useStateProvider } from '@/context/StateContext';
import { GET_SELLER_ORDERS_ROUTE } from '@/utils/constant';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

const page = () => {
    const [orders, setOrders] = useState([]);
    const [{userInfo,onlineUsers}] = useStateProvider();

    useEffect(() => {
        const getBuyerOrders = async () => {
            try {
                const {data: { orders }} = await axios.get(GET_SELLER_ORDERS_ROUTE,{withCredentials: true});
                // console.log('Orders seller : ', res)
                setOrders(orders);
                console.log("orders",orders);
            } catch (error) {
                console.log(error)
            }
        };

        if(userInfo) getBuyerOrders();
    },[userInfo])

    return (
        <div className='min-h-[88vh] my-10 mt-0 px-32'>
            <h3 className='font-bold text-lg'>All Your Orders</h3>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-g ray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Order ID
                            </th>
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
                                Order Date
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Send Message
                            </th>
                        </tr>
                    </thead>    

                    <tbody>
                        {orders.length > 0 && orders?.map(( order,index ) => {
                            return (
                                <tr key={order?.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-6 py-4">
                                        {order?.buyer?.isProfileInfoSet ? (
                                            <div className='relative h-14 w-14'>
                                            <img 
                                                src={order?.buyer?.profileImage} 
                                                className='h-full w-full object-cover rounded-full border border-gray-300'
                                                alt={`profile${index}`}
                                            />
                                            {onlineUsers?.includes(order?.buyer?.id.toString()) && (
                                                <span className='absolute bottom-0 right-10 h-4 w-4 bg-green-500 border-2 border-white rounded-full'></span>
                                            )}
                                            </div>
                                        ) : (
                                            <div className='bg-purple-500 flex items-center justify-center h-10 w-10 rounded-full relative'>
                                                <span className='text-xl text-white'>
                                                    {order?.buyer?.email[0].toUpperCase()}
                                                </span>
                                                {onlineUsers?.includes(order?.buyer?.id.toString()) && (
                                                    <span className='absolute top-8 right-6 h-4 w-4 bg-green-500 border-2 border-white rounded-full'></span>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {order?.gig?.title}
                                    </td>
                                    <td className="px-6 py-4">
                                        {order?.gig?.category}
                                    </td>
                                    <td className="px-6 py-4">
                                        {order?.gig?.price}
                                    </td>
                                    <td className="px-6 py-4">
                                        {order?.gig?.deliveryTime}
                                    </td>
                                    <td className="px-6 py-4">
                                        {order?.createdAt?.split("T")[0]}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link 
                                            className='font-medium text-blue-600 dark:text-blue-300 hover:underline'
                                            href={`/buyer/orders/messages/${order?.id}?second=${order?.buyer?.id}`}
                                        >
                                            Send
                                        </Link>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default page