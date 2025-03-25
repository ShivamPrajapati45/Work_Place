'use client'
import { useStateProvider } from '@/context/StateContext';
import { GET_SELLER_ORDERS_ROUTE } from '@/utils/constant';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

const page = () => {
    const [orders, setOrders] = useState([]);
    const [{userInfo,onlineUsers,socket}] = useStateProvider();
    const [unreadCounts, setUnreadCounts] = useState(() => {
        const savedUnreadCounts = localStorage.getItem('unreadCounts');
        return savedUnreadCounts ? JSON.parse(savedUnreadCounts) : {};
    });

    useEffect(() => {
        const getBuyerOrders = async () => {
            try {
                const {data: { orders }} = await axios.get(GET_SELLER_ORDERS_ROUTE,{withCredentials: true});
                setOrders(orders);
            } catch (error) {
                console.log(error)
            }
        };

        if(userInfo) getBuyerOrders();
    },[userInfo]);

    useEffect(() => {
        if(socket){
            socket?.on('unreadCount', (data) => {
                console.log(data)
                setUnreadCounts((prev) => {
                    const updatedUnreadCounts = {
                        ...prev,
                        [data.senderId]: data.unreadCount,
                    };

                    localStorage.setItem('unreadCounts',JSON.stringify(updatedUnreadCounts));
                    return updatedUnreadCounts;
                })
            });
            
            return () => {
                socket?.off('unreadCount');
            }
        }else{
            console.log('Socket is null or not connected.');
        }

    },[socket]);

    console.log(orders);

    return (
        <div className='min-h-[88vh] my-10 mt-0 px-32'>
            {orders?.length > 0 && <h3 className='font-bold text-lg text-center'>All Your Orders</h3>}
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">

                {orders?.length === 0 && (
                    <div className="flex flex-col justify-center items-center h-[65vh] text-center">
                        <div className='w-full h-[60%]'>
                            <img className='h-full w-full object-contain' src="/images/no_order.jpg" alt="" />
                        </div>
                        <p className="text-gray-700 text-xl font-semibold mb-4">
                            No orders yet on your services!
                        </p>
                        <p className="text-gray-500 mb-6">
                            Your first order is just around the corner! 🚀
                        </p>
                    </div>
                )}

                {orders?.length > 0 && (
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-slate-300 dark:bg-g ray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Buyer
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Title
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Price
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    status
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
                                        <td className="px-6 py-1">
                                            {order?.buyer?.isProfileInfoSet ? (
                                                <div className='relative h-14 w-14'>
                                                <img 
                                                    src={order?.buyer?.profileImage} 
                                                    className='h-full w-full object-cover rounded-full border border-gray-300'
                                                    alt={`profile${index}`}
                                                />
                                                {unreadCounts[order?.buyerId] > 0 && (
                                                    <span className='absolute h-4 w-4 rounded-full text-center top-0 right-0 bg-red-500 text-white text-xs'>{unreadCounts[order?.buyerId]}</span>
                                                )}
                                                {onlineUsers?.includes(order?.buyer?.id.toString()) && (
                                                    <span className='absolute bottom-1 right-10 h-3 w-3 bg-green-500 border-2 border-white rounded-full'></span>
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
                                                    {unreadCounts[order?.buyerId] > 0 && (
                                                        <span className='absolute rounded-full h-4 w-4 text-center text-xs top-0 right-0 bg-red-500 text-white'>{unreadCounts[order?.buyerId]}</span>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-1">
                                            {order?.buyer?.isProfileInfoSet ? order?.buyer?.fullName : order?.fullName}
                                        </td>
                                        <td className="px-6 py-1">
                                            {order?.gig?.title}
                                        </td>
                                        <td className="px-6 py-1">
                                            {order?.gig?.price}
                                        </td>
                                        <td className="px-6 py-1">
                                            <span className={`${order?.status === 'Pending' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'} uppercase text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm`}>{order?.status}</span>
                                        </td>
                                        <td className="px-6 py-1">
                                            {order?.createdAt?.split("T")[0]}
                                        </td>
                                        <td className="px-6 text-center py-1 uppercase ">
                                            <Link 
                                                className='font-medium text-blue-600 dark:text-blue-300 hover:underline'
                                                href={`/buyer/orders/messages/${order?.id}?second=${order?.buyer?.id}`}
                                            >
                                                Chat
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