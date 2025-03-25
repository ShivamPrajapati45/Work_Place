'use client'
import { useStateProvider } from '@/context/StateContext';
import { GET_SELLER_DASHBOARD_DATA } from '@/utils/constant';
import axios from 'axios';
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
                <div className='flex flex-col max-w-full lg:flex-row max-h-[80vh] h-screen my-5 px-6 lg:px-20 gap-10'>

                    {/* Profile Section */}
                    <div className="overflow-scroll rounded-lg p-8 flex custom-scrollbar flex-col gap-5 lg:min-w-[350px] lg:w-96 bg-white shadow-lg relative">

                        {/* Basic detail: Full Name, Username, Profession */}
                        <div className='w-full flex  gap-10 p-2 items-start rounded-lg'>
                            <div className="relative flex  flex-col items-center justify-center h-20 w-20">
                                {userInfo?.isProfileInfoSet ? (
                                <img
                                    src={userInfo?.profileImage}
                                    alt="profile"
                                    className="rounded-full h-full w-full object-contain border-2 border-blue-500 shadow-md"
                                />
                                ) : (
                                    <div className='bg-purple-500 h-16 w-16 object-contain flex items-center justify-center rounded-full relative'>
                                        <span className='text-4xl text-white'>
                                            {userInfo?.email[0].toUpperCase()}
                                        </span>
                                    </div>
                                )}
                                <h1 className="text-sm mt-2 font-semibold text-gray-700 text-center">
                                    {userInfo?.profession}
                                </h1>
                            </div>
                            {/* User Information */}
                            <div className="flex flex-col fl items-start justify-start w-full h-full">
                                <div className='flex w-full justify-between gap-10'>
                                    <h2 className="text-xl font-bold text-gray-900">{userInfo?.fullName ? userInfo.fullName : ''}</h2>
                                    <p className="text-sm text-gray-500">{userInfo?.username ? `@ ${userInfo?.username}` : ''}</p>
                                </div>
                                <p className="text-base text-slate-500">{userInfo.email}</p>
                            </div>
                        </div>

                        {/* Description, skills ,languages */}
                        <div className="p-2 rounded-lg border-t border-slate-500">
                            <h3 className="text-base font-semibold text-gray-700 mb-2">About</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {/* {showMore ? userInfo?.description : `${userInfo?.description?.slice(0, 100)}...`} */}
                                {showMore ? userInfo?.description :  userInfo?.description ? `${userInfo?.description?.slice(0, 100)}...` : 'Not Available'}
                                
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

                        <div className='flex flex-col gap-8'>

                        {/* skills Section */}
                            <div>
                                <h3 className='font-semibold text-gray-700 mb-1 border-b-[1.5px] border-black'>Skills</h3>
                                {/* {!userInfo?.skills?.length > 0 && <span>Not Available</span> } */}
                                {userInfo?.skills?.length > 0 ? (
                                    <div className='w-full'>
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
                                ) : (
                                    <span>Not Available</span>
                                )}
                            </div>

                            <div>
                                <h3 className='text-base font-bold text-gray-700 mb-1 border-b-[1.5px] border-black'>Languages</h3>
                                {userInfo?.languages?.length > 0 ? (
                                    <div className='w-full'>
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
                                ) : (
                                    <span>Not Available</span>
                                )}
                            </div>

                            {/* Social  */}
                            <div>
                                <h3 className="text-base font-bold text-gray-700 mb-1 border-b-[1.5px] border-black">Social Links</h3>
                                {userInfo?.socialLinks?.length > 0 ? (
                                    <div className="w-full">
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
                                ) : (
                                    <span>Not Available</span>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* Right side */}
                        <div 
                            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-h-20'
                        >
                            <div
                                className='relative group shadow-md bg-white h-32 rounded-lg p-6 flex flex-col gap-4 cursor-pointer hover:shadow-xl transition-shadow'
                                onClick={() => router.push('/seller/gigs')}
                            >
                                <h2 className='text-lg font-semibold text-gray-600'>Total Services</h2>
                                <h3 className='text-4xl font-extrabold text-blue-600'>
                                    {dashboardData?.gigs}
                                </h3>
                                <div className="absolute left-1/2 bottom-full w-max -translate-x-1/2 scale-0 rounded-lg bg-black px-3 py-1 text-white text-sm opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100">
                                    Total Services Created by you
                                    <div className="absolute left-1/2 top-full -translate-x-1/2 border-8 border-transparent border-t-black"></div>
                                </div>
                            </div>
                            {/* total orders */}
                            <div
                                className='relative group shadow-md bg-white h-32 rounded-lg p-6 flex flex-col gap-4 cursor-pointer hover:shadow-xl transition-shadow'
                                onClick={() => router.push('/seller/orders')}
                            >
                                <h2 className='text-lg font-semibold text-gray-600'>Total Orders</h2>
                                <h3 className='text-4xl font-extrabold text-blue-600'>
                                    {dashboardData?.orders}
                                </h3>
                                <div className="absolute left-1/2 bottom-full w-max -translate-x-1/2 scale-0 rounded-lg bg-black px-3 py-1 text-white text-sm opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100">
                                    Total orders received for your services
                                    <div className="absolute left-1/2 top-full -translate-x-1/2 border-8 border-transparent border-t-black"></div>
                                </div>
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