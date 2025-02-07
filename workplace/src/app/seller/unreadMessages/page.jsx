'use client'
import { useStateProvider } from '@/context/StateContext';
import { GET_UNREAD_MESSAGES, MARK_AS_READ } from '@/utils/constant';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'

const page = () => {
    const [cookies] = useCookies();
    const [{userInfo}] = useStateProvider();
    const [messages, setMessages] = useState([]);
    useEffect(() => {
        const getUnreadMessages = async () => {
            const {data} = await axios.get(GET_UNREAD_MESSAGES,{withCredentials: true})
            if(data.success){
                setMessages(data.messages);
            }
        };

        if(userInfo){
            getUnreadMessages();
        } 
    },[userInfo,messages]);

    const markAsRead = async (id) => {
        const response = await axios.put(`${MARK_AS_READ}/${id}`,{},{withCredentials: true});

        if(response.data.success){
            const clonedMessages = [...messages]
            const index = clonedMessages.findIndex((msg) => msg.id === id);
            clonedMessages.splice(index, 1);
            setMessages(clonedMessages);
        }
    }

    return (
        <div className='min-h-[88vh] my-10 mt-0 px-32'>
            <h3 className='font-bold text-lg'>All Unread Messages </h3>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-g ray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Text
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Sender Name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Order Id
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Mark as Read
                            </th>
                            <th scope="col" className="px-6 py-3">
                                View Conversation
                            </th>
                        </tr>
                    </thead>    
                    <tbody>
                        {messages?.map(( msg,index ) => {
                            return (
                                <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <th scope="row" className="px-6 py-4 ">
                                        {msg?.text}
                                    </th>
                                    <td className="px-6 py-4">
                                        {msg?.sender?.fullName}
                                    </td>
                                    <td className="px-6 py-4">
                                        {msg?.orderId}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link 
                                            className='font-medium text-blue-600 dark:text-blue-300 hover:underline'
                                            href='#'
                                            onClick={(e) => {
                                                e.preventDefault();
                                                markAsRead(msg?.id)
                                            }}
                                        >
                                            Mark As Read
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link 
                                            className='font-medium text-blue-600 dark:text-blue-300 hover:underline'
                                            href={`/seller/orders/messages/${msg.orderId}`}
                                        >
                                            View
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