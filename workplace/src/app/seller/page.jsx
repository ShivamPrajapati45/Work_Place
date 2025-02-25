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
    const [showMore, setShowMore] = useState(false);

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
                <div className='flex flex-col max-w-full lg:flex-row max-h-[80vh] h-screen my-6 px-6 lg:px-20 gap-10'>

                    {/* Profile Section */}
                    <div className=" overflow-scroll rounded-lg p-8 flex scrollbar-hide flex-col gap-6 lg:min-w-[450px] lg:w-96 bg-white shadow-lg relative">

                        {/* Basic detail: Full Name, Username, Profession */}
                        <div className='w-full flex gap-6 p-4 items-start bg-white '>
                            <div className="relative flex flex-col items-center h-24 w-24">
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
                                <h1 className="text-sm mt-2 font-semibold text-gray-700 text-center">
                                    {userInfo?.profession}
                                </h1>
                            </div>
                            {/* User Information */}
                            <div className="flex flex-col">
                                <div className='flex w-full justify-between gap-10'>
                                    <h2 className="text-xl font-bold text-gray-900">{userInfo.fullName}</h2>
                                    <p className="text-sm text-gray-500">@{userInfo.username}</p>
                                </div>
                                <p className="text-base text-slate-500">{userInfo.email}</p>
                            </div>
                        </div>

                        {/* Description, skills ,languages */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-base font-semibold text-gray-700 mb-2">About</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {showMore ? userInfo.description : `${userInfo.description?.slice(0, 100)}...`}
                            </p>
                            {userInfo.description?.length > 100 && (
                                <button
                                    onClick={() => setShowMore(!showMore)}
                                    className="text-blue-500 mt-2 text-sm font-medium hover:underline"
                                >
                                    {showMore ? "Show Less" : "Show More"}
                                </button>
                            )}
                        </div>

                            {/* skills Section */}
                            {userInfo.skills?.length > 0 && (
                                <div className='w-full'>
                                    <h3 className='text-sm font-semibold text-gray-700 mb-2'>Skills</h3>
                                    <div className='flex flex-wrap gap-2'>
                                        {userInfo.skills.map((skill, index) => (
                                            <span 
                                                key={index}
                                                className="bg-green-100 text-slate-700 text-sm font-medium px-3 py-1 rounded-full"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {userInfo.languages?.length > 0 && (
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