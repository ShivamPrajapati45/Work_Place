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
    };

    const markAllRead = async () => {
        await axios.put(MARK_READ,{withCredentials: true});
    }

    if(loading) return <div className='h-screen text-center flex  justify-center py-4'>
            <span className='animate-pulse text-4xl font-semibold'>Loading...</span>
    </div>  

    return (
        <div className="container h-screen mx-auto p-4">
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