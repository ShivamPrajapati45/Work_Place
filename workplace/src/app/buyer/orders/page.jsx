'use client'
import ExploreMore from '@/components/Gigs/ExploreMore';
import { Badge } from '@/components/ui/badge';
import { useStateProvider } from '@/context/StateContext';
import useAuth from '@/hooks/useAuth';
import { GET_BUYER_ORDERS_ROUTE, GET_GIGS } from '@/utils/constant';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { BsChatDotsFill } from 'react-icons/bs';


const page = () => {
    useAuth();
    const [orders, setOrders] = useState([]);
    const [{userInfo,onlineUsers,socket}] = useStateProvider();
    const [allGigs, setAllGigs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const [unreadCounts, setUnreadCounts] = useState(() => {
        const savedUnreadCounts = localStorage.getItem('unreadCounts');
        return savedUnreadCounts ? JSON.parse(savedUnreadCounts) : {};
    });
    
    useEffect(() => {
        if(socket){
            socket?.on('unreadCount', (data) => {
                console.log('UnreadCount: ', data);
                setUnreadCounts((prev) => {
                    const updatedUnreadCounts = {
                        ...prev,
                        [data.senderId]: data.unreadCount
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

    useEffect(() => {
        const getBuyerOrders = async () => {
            try {
                const {data: {orders}} = await axios.get(GET_BUYER_ORDERS_ROUTE,{withCredentials: true});
                setOrders(orders);
            } catch (error) {
                console.log(error);
            }
        };

        if(userInfo) getBuyerOrders();
    },[userInfo]);

    useEffect(() => {
        const fetchAllGigs = async () => {
            setIsLoading(true)
            try{
                const response = await axios.get(GET_GIGS,{withCredentials: true});
                if(response.data.success){
                    setTimeout(() => {
                        setAllGigs(response?.data?.gigs || []);
                        setIsLoading(false);
                    }, 3000);
                }

            }catch(err){
                console.log(err);
                setIsLoading(false);
            }
        };
        fetchAllGigs();
    },[]);

    return (
        <div className="min-h-screen h-screen items-center flex gap-10 flex-col justify-between my-8 mt-0">
            <div className="relative w-full overflow-x-auto px-28 sm:rounded-lg">
            {
                orders.length > 0 && (
                    <h3 className="font-bold text-lg text-center mb-2">All Your Orders</h3>
                )
            }
                {orders.length > 0 ? (
                    <table className="w-full rounded-xl text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-sm rounded-xl text-slate-800 uppercase bg-slate-300 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-1.5">Freelancer</th>
                                <th scope="col" className="px-6 py-1.5">name</th>
                                <th scope="col" className="px-6 py-1.5">Title</th>
                                <th scope="col" className="px-6 py-1.5">Price</th>
                                <th scope="col" className="px-6 py-1.5">Order Date</th>
                                <th scope="col" className="px-6 py-1.5">Message</th>
                                <th scope="col" className="px-6 py-1.5">Payment</th> 
                            </tr>
                        </thead>
                        <tbody className='divide-y dark:divide-gray-700 dark:divide-opacity-60'>
                            {orders.map((order,index) => (
                                <tr
                                    key={order?.id}
                                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-600"
                                >
                                    <td scope='col' className="px-6 py-1">
                                        {order?.gig?.createdBy?.isProfileInfoSet ? (
                                            <div className='relative h-14 w-14'>
                                                <img 
                                                    src={order?.gig?.createdBy?.profileImage} 
                                                    className='h-full w-full object-cover rounded-full border border-gray-300'
                                                    alt={`profile${index}`}
                                                />
                                                {unreadCounts[order?.gig?.createdBy?.id] > 0 && (
                                                    <span className='absolute h-4 w-4 text-xs top-0 right-0 rounded-full bg-red-500 text-white '>{unreadCounts[order?.gig?.createdBy?.id] || 0}</span>
                                                )}
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
                                                {unreadCounts[order?.gig?.createdBy?.id] > 0 && (
                                                    <span className='absolute h-4 w-4 text-xs top-0 right-0 rounded-full bg-red-500 text-white '>{unreadCounts[order?.gig?.createdBy?.id] || 0}</span>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                    <td scope='col' className='px-6 py-1'>{order?.gig?.createdBy?.isProfileInfoSet ? order?.gig?.createdBy?.fullName : order?.gig?.createdBy?.username}</td>
                                    <td scope='col' className="px-6 py-1">{order?.gig?.title}</td>
                                    <td scope='col' className="px-6 py-1">{order?.gig?.price}</td>
                                    <td scope='col' className="px-6 py-1">
                                        {order?.createdAt?.split("T")[0]}
                                    </td>
                                    <td scope='col' className="px-7 py-1 uppercase">
                                        <button
                                            onClick={() => router.push(`/buyer/orders/messages/${order?.id}?second=${order.gig.userId}`)}
                                            className='flex text-white items-center hover:bg-slate-200 transition-all duration-300 bg-slate-100 border border-white px-4 rounded-md py-1 gap-1'
                                        >
                                            <BsChatDotsFill size={24} className='text-blue-500 dark:text-blue-300'/>
                                        </button>
                                    </td>
                                    <td scope='col' className='px-6 py-1'>
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
                            <button className="bg-primary_button text-white px-6 py-3 rounded-md hover:bg-primary_button_hover transition">
                                Explore Services
                            </button>
                        </Link>
                    </div>
                )}
            </div>
            
            <div className='min-h-[40vh] w-full px-28 flex items-center justify-center'>
                {orders.length > 0 && (
                    <div className='w-full'>
                        {isLoading ? (
                            <div className="flex justify-center h-full">
                                <div className="w-16 h-16 border-4 border-gray-300 border-t-4 border-t-blue-400 rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            <ExploreMore allGigs={allGigs} />
                        )}
                    </div>
                )}
            </div>
        </div>

    )
}

export default page