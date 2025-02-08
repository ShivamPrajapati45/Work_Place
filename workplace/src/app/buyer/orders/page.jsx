'use client'
import { Badge } from '@/components/ui/badge';
import { useStateProvider } from '@/context/StateContext';
import useAuth from '@/hooks/useAuth';
import { GET_BUYER_ORDERS_ROUTE } from '@/utils/constant';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const page = () => {
    useAuth();
    const [orders, setOrders] = useState([]);
    const [{userInfo,onlineUsers}] = useStateProvider();
    const router = useRouter();

    useEffect(() => {
        const getBuyerOrders = async () => {
            try {
                const {data: {orders}} = await axios.get(GET_BUYER_ORDERS_ROUTE,{withCredentials: true});
                setOrders(orders);
                // console.log("orders",orders);
            } catch (error) {
                console.log(error);
            }
        };

        if(userInfo) getBuyerOrders();
    },[userInfo]);

    return (
        <div className="min-h-[88vh] my-10 mt-0 px-28">
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
                                {/* <th scope="col" className="px-6 py-3">Order ID</th> */}
                                <th scope="col" className="px-6 py-3">Freelancer</th>
                                <th scope="col" className="px-6 py-3">Title</th>
                                <th scope="col" className="px-6 py-3">Category</th>
                                <th scope="col" className="px-6 py-3">Price</th>
                                <th scope="col" className="px-6 py-3">Delivery time</th>
                                <th scope="col" className="px-6 py-3">Order Date</th>
                                <th scope="col" className="px-6 py-3">Send Message</th>
                                <th scope="col" className="px-6 py-3">Payment</th> 
                            </tr>
                        </thead>
                        <tbody className=''>
                            {orders.map((order,index) => (
                                <tr
                                    key={order?.id}
                                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                >
                                    <td className="px-6 py-4">
                                        {order?.gig?.createdBy?.isProfileInfoSet ? (
                                            <div className='relative h-14 w-14'>
                                                <img 
                                                    src={order?.gig?.createdBy?.profileImage} 
                                                    className='h-full w-full object-cover rounded-full border border-gray-300'
                                                    alt={`profile${index}`}
                                                />
                                                {onlineUsers?.includes(order?.gig?.createdBy?.id?.toString()) && (
                                                    <span className='absolute bottom-0 right-10 h-4 w-4 bg-green-500 border-2 border-white rounded-full'></span>
                                                )}
                                            </div>
                                        ) : (
                                            <div className='bg-purple-500 flex items-center justify-center h-10 w-10 rounded-full relative'>
                                                <span className='text-xl text-white'>
                                                    {order?.gig?.createdBy?.email[0].toUpperCase()}
                                                </span>
                                                {onlineUsers?.includes(order?.gig?.createdBy?.id?.toString()) && (
                                                    <span className='absolute top-8 right-6 h-4 w-4 bg-green-500 border-2 border-white rounded-full'></span>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">{order?.gig?.title}</td>
                                    <td className="px-6 py-4">{order?.gig?.category}</td>
                                    <td className="px-6 py-4 text-center">{order?.gig?.price}</td>
                                    <td className="px-6 py-4 text-center">{order?.gig?.deliveryTime}</td>
                                    <td className="px-6 py-4">
                                        {order?.createdAt?.split("T")[0]}
                                    </td>
                                    <td className="px-6 text-center py-4">
                                        <Link
                                            className="font-medium text-blue-600 dark:text-blue-300 hover:underline"
                                            href={`/buyer/orders/messages/${order?.id}?second=${order.gig.userId}`}
                                        >
                                            Send
                                        </Link>
                                    </td>
                                    <td className='text-center'>
                                        {/* {order.price !== order.paidAmount || !order.inCompleted ? 'Unpaid' : 'Paid'} */}
                                        {
                                            order.price !== order.paidAmount || !order.inCompleted ? (
                                                <button 
                                                    className='uppercase px-5 rounded-md bg-blue-600 outline-none font-semibold hover:bg-blue-500 duration-500 text-white py-1'
                                                    onClick={() => router.push(`/payment?gigId=${order?.gigId}&orderId=${order?.id}`)}

                                                >
                                                    Pay
                                                </button>
                                            ) : (
                                                <Badge className='uppercase opacity-70 font-semibold text-white px-5 py-2 bg-green-500'>
                                                    Paid
                                                </Badge>
                                            )
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="flex flex-col justify-center items-center h-[65vh] text-center">
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