'use client'
import { GET_NOTIFICATIONS, GET_READ_NOTIFICATIONS } from '@/utils/constant';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

const page = () => {
    const [unreadNotifications, setUnReadNotifications] = useState([]);
    const [readNotifications, setReadNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

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
    },[]);

    if(loading) return <div className='h-screen text-center flex  justify-center py-4'>
            <span className='animate-pulse text-4xl font-semibold'>Loading...</span>
    </div>  

    return (
        <div className="container h-screen mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-4">Unread Notifications</h2>
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
                        onClick={() => markAsRead(notification.id)}
                    >
                        Mark as Read
                    </button>
                    </div>
                ))
                ) : (
                <p>No unread notifications.</p>
                )}
            </div>

            <h2 className="text-2xl font-semibold mb-4 mt-8">Read Notifications</h2>
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
            </div>
        </div>
    )
};

export default page