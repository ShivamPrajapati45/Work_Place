'use client'
import { GET_NOTIFICATIONS, GET_READ_NOTIFICATIONS, MARK_READ, MARK_READ_SINGLE_NOTIFICATION } from '@/utils/constant';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Tabs,TabsContent,TabsList,TabsTrigger } from '@/components/ui/tabs';
import {IoCheckmark} from 'react-icons/io5'
import {formatDistanceToNow} from 'date-fns'

const page = () => {
    const [unreadNotifications, setUnReadNotifications] = useState([]);
    const [readNotifications, setReadNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    // const [unreadCount, setUnreadCount] = useState(0);
    const [call, setCall] = useState(false);


    // fetching Notifications
    useEffect(() => {
        const fetchNotifications = async () => {
            try{
                const unreadResponse = await axios.get(GET_NOTIFICATIONS,{withCredentials: true});
                const readResponse = await axios.get(GET_READ_NOTIFICATIONS,{withCredentials: true});
                if(unreadResponse.data.success || readResponse.data.success){
                    setReadNotifications(readResponse.data.notifications);
                    setUnReadNotifications(unreadResponse.data.notifications);
                    setLoading(false);
                }

            }catch(err){
                console.log(err)
            }finally{
                setLoading(false);
            }
        };
        fetchNotifications();
    },[call]);

    const markAsRead = async (id) => {
        await axios.patch(`${MARK_READ_SINGLE_NOTIFICATION}/${id}`,{
            withCredentials: true
        });
        setCall((e) => {
            !e
        });
    };

    const markAllRead = async () => {
        await axios.put(MARK_READ,{withCredentials: true});
        setCall((e) => {
            !e
        });
    }

    if(loading) return <div className='h-screen text-center flex  justify-center py-4'>
            <span className='animate-pulse text-4xl font-semibold'>Loading...</span>
    </div>  

    return (
        <div className="container h-screen mx-auto p-4">
            {/* <div className="flex w-full items-center justify-around mb-3">
                <p  
                    className='text-blue-500 cursor-pointer hover:text-blue-600 font-semibold uppercase'
                    onClick={() => markAllRead()}
                >Mark All as Read</p>
            </div>
            <div className="unread-notifications space-y-4">
                {unreadNotifications.length > 0 ? (
                    unreadNotifications.map((notification) => (
                        <div
                            key={notification.id}
                            className="notification p-4 bg-gray-100 rounded-lg shadow-sm flex justify-between items-center"
                        >
                        <p className="text-gray-800">{notification.message}</p>
                        <button
                            className="mark-read-btn bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none"
                            onClick={() => markAsRead(notification?.id)}
                        >
                            Mark as Read
                        </button>
                        </div>
                    ))
                    ) : (
                        <p>No unread notifications.</p>
                    )
                }
            </div>



            <div className="read-notifications space-y-4">
                {readNotifications.length > 0 ? (
                readNotifications.map((notification) => (
                    <div
                    key={notification.id}
                    className="notification p-4 bg-gray-200 rounded-lg shadow-sm"
                    >
                    <p className="text-gray-800">{notification.message}</p>
                    </div>
                ))
                ) : (
                <p>No read notifications.</p>
                )}
            </div> */}
            <Tabs
                defaultValue='read'
                className='w-full'
            >
                <TabsList className='grid w-full grid-cols-2'>
                    <TabsTrigger value='unread'>Unread</TabsTrigger>
                    <TabsTrigger value='read'>Read</TabsTrigger>
                </TabsList>
                <TabsContent value='unread'>
                    {unreadNotifications.length > 0 ? (
                        unreadNotifications.map((notification) => (
                            <div
                                key={notification.id}
                            >
                                <p>
                                    {notification.message}
                                </p>
                                <div>
                                    <IoCheckmark/>
                                    {formatDistanceToNow(new Date(notification.createdAt), {addSuffix: true})}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No</p>
                    )}
                </TabsContent>
                <TabsContent value='read'>
                    {readNotifications.length > 0 ? (
                            readNotifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className='w-full flex border border-black items-center justify-between px-10'
                                >
                                    <p>
                                        {notification.message}
                                    </p>
                                    <div className='flex flex-col gap-2'>
                                        <IoCheckmark
                                            className='text-blue-500 text-2xl cursor-pointer'
                                            
                                        />
                                        {formatDistanceToNow(new Date(notification.createdAt), {addSuffix: true})}
                                    </div>

                                </div>
                            ))
                        ) : (
                            <p>No</p>
                    )}
                </TabsContent>
            </Tabs>

        </div>
    )
};

export default page