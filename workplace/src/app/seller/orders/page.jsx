'use client'
import { useStateProvider } from '@/context/StateContext';
import { GET_BUYER_ORDERS_ROUTE, GET_SELLER_ORDERS_ROUTE } from '@/utils/constant';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'

const page = () => {
    const [cookie] = useCookies();
    const [orders, setOrders] = useState([]);
    const [{userInfo}] = useStateProvider();

    useEffect(() => {
        const getBuyerOrders = async () => {
            try {
                const {data: {orders}} = await axios.get(GET_SELLER_ORDERS_ROUTE,{withCredentials: true});
                setOrders(orders);
                // console.log("orders",orders);
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
                        {orders?.map(( order ) => {
                            return (
                                <tr key={order?.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {order?.id}
                                    </th>
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
                                        {order?.createdAt?.split("Y")[0]}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link 
                                            className='font-medium text-blue-600 dark:text-blue-300 hover:underline'
                                            href={`/buyer/orders/messages/${order?.id}`}
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