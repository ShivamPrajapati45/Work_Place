'use client'
import { useStateProvider } from '@/context/StateContext';
import { GET_SELLER_DASHBOARD_DATA } from '@/utils/constant';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const page = () => {
    const [{userInfo}] = useStateProvider();
    const router = useRouter();
    const [dashboardData, setDashboardData] = useState(undefined);
    // console.log("User: ", userInfo)
    useEffect(() => {
        const getSellerDashboardData = async () => {
            try {
                const response = await axios.get(GET_SELLER_DASHBOARD_DATA,{
                    withCredentials: true
                });

                if(response.data.success){
                    setDashboardData(response.data.dashBoardData)
                };
            } catch (error) {
                console.log(error)
            }
        };

        if(userInfo) getSellerDashboardData();
    },[userInfo])

    return (
        <>
            {userInfo && (
                <div className='flex flex-col lg:flex-row max-h-[80vh]  my-6 px-6 lg:px-32 gap-10'>

                    {/* Profile Section */}
                    <div className="shadow-lg bg-black/5  rounded-lg p-8 flex flex-col gap-6 lg:min-w-[320px] lg:w-96 relative">
                        {/* Notification Icon */}
                        <div className="absolute top-4 right-4 flex items-center justify-center">
                            <div className="relative">
                            <button className="text-gray-700 hover:text-blue-500 transition">
                                <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14V11a6 6 0 00-5-5.917V4a1 1 0 10-2 0v1.083A6 6 0 006 11v3c0 .217-.07.417-.195.595L4.4 17H9m3 0a3 3 0 006 0m-6 0v1a3 3 0 01-6 0v-1m6 0H9"
                                />
                                </svg>
                            </button>
                            {/* Notification Badge */}
                            {dashboardData?.notifications > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                                {dashboardData.notifications}
                                </span>
                            )}
                            </div>
                        </div>

                        {/* Profile Image */}
                        <div className='w-full flex items-center justify-center'>
                            <div className="relative h-28 w-28">
                                {userInfo ? (
                                <img
                                    src={userInfo?.profileImage}
                                    alt="profile"
                                    className="rounded-full h-full w-full object-contain border-2 border-blue-500 shadow-md"
                                />
                                ) : (
                                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-36 w-36 flex items-center justify-center rounded-full shadow-lg">
                                    <span className="text-6xl text-white font-bold">
                                    {userInfo.email[0].toUpperCase()}
                                    </span>
                                </div>
                                )}
                                {/* Online Badge */}
                                <span className="absolute bottom-2 right-2 h-4 w-4 bg-green-500 border-2 border-white rounded-full"></span>
                            </div>
                        </div>


                        {/* User Information */}
                        <div className="">
                            <h2 className="text-2xl font-bold text-gray-800">{userInfo.fullName}</h2>
                            <p className="text-lg text-gray-500">{userInfo.username}</p>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 leading-relaxed">
                            {userInfo.description || "No description provided."}
                        </p>

                        {/* skills Section */}
                        {userInfo.skills?.length > 0 && (
                            <div className='w-full'>
                                <h3 className='text-lg font-bold text-gray-700 mb-2'>Skills</h3>
                                <div className='flex flex-wrap gap-2'>
                                    {userInfo.skills.map((skill, index) => (
                                        <span 
                                            key={index}
                                            className="bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded-full"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Social  */}
                        {userInfo.socialLinks?.length > 0 && (
                            <div className="w-full">
                                <h3 className="text-lg font-bold text-gray-700 mb-2">Social Links</h3>
                                <div className="flex gap-4">
                                    {userInfo.socialLinks.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:text-blue-700 transition-colors"
                                        >
                                            {link.includes("instagram") && (
                                                <i className="fab fa-instagram text-2xl"></i>
                                            )}
                                            {link.includes("facebook") && (
                                                <i className="fab fa-facebook text-2xl"></i>
                                            )}
                                            {/* Fallback icon */}
                                            {!link.includes("instagram") && !link.includes("facebook") && (
                                                <i className="fas fa-link text-2xl"></i>
                                            )}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Right side */}
                        <div 
                            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-h-20'
                        >
                            <div
                                className='shadow-md bg-white h-32 rounded-lg p-6 flex flex-col gap-4 cursor-pointer hover:shadow-xl transition-shadow'
                                onClick={() => router.push('/seller/gigs')}
                            >
                                <h2 className='text-lg font-semibold text-gray-600'>Total Gigs</h2>
                                <h3 className='text-4xl font-extrabold text-blue-600'>
                                    {dashboardData?.gigs}
                                </h3>
                            </div>
                            {/* total orders */}
                            <div
                                className='shadow-md bg-white h-32 rounded-lg p-6 flex flex-col gap-4 cursor-pointer hover:shadow-xl transition-shadow'
                                onClick={() => router.push('/seller/orders')}
                            >
                                <h2 className='text-xl'>Total Orders</h2>
                                <h3 className='text-4xl font-extrabold text-blue-600'>
                                    {dashboardData?.orders}
                                </h3>
                            </div>

                            {/* Unread Messages */}
                            {/* <div
                                className='shadow-md bg-white h-32 rounded-lg p-6 flex flex-col gap-4 cursor-pointer hover:shadow-xl transition-shadow'
                                onClick={() => router.push('/seller/unreadMessages')}
                            >
                                <h2 className='text-lg font-semibold text-gray-600'>Unread Messages </h2>
                                <h3 className='text-4xl font-extrabold text-blue-600'>
                                    {dashboardData?.unreadMessages}
                                </h3>
                            </div> */}

                            {/* Today Earnings */}
                            <div
                                className='shadow-md h-32 bg-white rounded-lg p-6 flex flex-col gap-4'
                            >
                                <h2 className='text-lg font-semibold text-gray-600'>Today Earnings </h2>
                                <h3 className='text-4xl font-extrabold text-green-600'>
                                    {dashboardData?.dailyRevenue > 0 ? dashboardData.dailyRevenue : 0}
                                </h3>
                            </div>

                            {/* Monthly Earnings */}
                            <div
                                className='shadow-md h-32 bg-white rounded-lg p-6 flex flex-col gap-4'
                            >
                                <h2 className='text-lg font-semibold text-gray-600'>Monthly Earnings </h2>
                                <h3 className='text-4xl font-extrabold text-green-600'>
                                    {dashboardData?.monthlyRevenue > 0 ? dashboardData.monthlyRevenue : 0}
                                </h3>
                            </div>

                            {/* Yearly Earnings */}
                            <div
                                className='shadow-md h-32 bg-white rounded-lg p-6 flex flex-col gap-4'
                            >
                                <h2 className='text-lg font-semibold text-gray-600'>Yearly Earnings </h2>
                                <h3 className='text-4xl font-extrabold text-green-600'>
                                    {dashboardData?.revenue > 0 ? dashboardData.revenue : 0}
                                </h3>
                            </div>
                            
                        </div>
                </div>
            )}
        </>
    )
}

export default page