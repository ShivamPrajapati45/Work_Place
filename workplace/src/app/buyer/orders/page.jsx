'use client'
import { useStateProvider } from '@/context/StateContext';
import useAuth from '@/hooks/useAuth';
import { GET_BUYER_ORDERS_ROUTE } from '@/utils/constant';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'

const page = () => {
    useAuth();
    const [orders, setOrders] = useState([]);
    const [{userInfo}] = useStateProvider();

    useEffect(() => {
        const getBuyerOrders = async () => {
            try {
                const {data: {orders}} = await axios.get(GET_BUYER_ORDERS_ROUTE,{withCredentials: true});
                setOrders(orders);
                // console.log("orders",orders);
            } catch (error) {
                console.log(error)
            }
        };

        if(userInfo) getBuyerOrders();
    },[userInfo])

    return (
        <div className="min-h-[88vh] my-10 mt-0 px-32">
            {
                orders.length > 0 && (
                    <h3 className="font-bold text-lg text-center mb-5">All Your Orders</h3>
                )
            }
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        {orders.length > 0 ? (
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-sm text-slate-800 uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">Order ID</th>
                        <th scope="col" className="px-6 py-3">Name</th>
                        <th scope="col" className="px-6 py-3">Category</th>
                        <th scope="col" className="px-6 py-3">Price</th>
                        <th scope="col" className="px-6 py-3">Delivery time</th>
                        <th scope="col" className="px-6 py-3">Order Date</th>
                        <th scope="col" className="px-6 py-3">Send Message</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr
                            key={order?.id}
                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                            <th
                                scope="row"
                                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                            >
                                {order?.id}
                            </th>
                            <td className="px-6 py-4">{order?.gig?.title}</td>
                            <td className="px-6 py-4">{order?.gig?.category}</td>
                            <td className="px-6 py-4">{order?.gig?.price}</td>
                            <td className="px-6 py-4">{order?.gig?.deliveryTime}</td>
                            <td className="px-6 py-4">
                                {order?.createdAt?.split("Y")[0]}
                            </td>
                            <td className="px-6 py-4">
                                <Link
                                    className="font-medium text-blue-600 dark:text-blue-300 hover:underline"
                                    href={`/buyer/orders/messages/${order?.id}`}
                                >
                                    Send
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        ) : (
            <div className="flex flex-col justify-center items-center h-[65vh] text-center">
                {/* <img
                    src="https://via.placeholder.com/200"
                    alt="No Orders"
                    className="w-[200px] h-[200px] mb-6"
                /> */}
                <p className="text-gray-700 text-xl font-semibold mb-4">
                    You haven't placed any orders yet!
                </p>
                <p className="text-gray-500 mb-6">
                    Explore services and place your first order today.
                </p>
                <Link href="/gigs">
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition">
                        Explore Services
                    </button>
                </Link>
            </div>
        )}
    </div>
</div>

    )
}

export default page