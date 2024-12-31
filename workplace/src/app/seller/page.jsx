'use client'
import { useStateProvider } from '@/context/StateContext';
import { GET_SELLER_DASHBOARD_DATA } from '@/utils/constant';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'

const page = () => {
    const [cookies] = useCookies();
    const [{userInfo}] = useStateProvider();
    const router = useRouter();
    const [dashboardData, setDashboardData] = useState(undefined);
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
                <div className='flex min-h-[80vh] my-10 mt-0 px-32 gap-5'>
                    <div className='shadow-md h-max p-10 flex flex-col gap-5 min-w-96 w-96'>
                        <div className='flex gap-6  justify-center items-center'>
                            <div>
                                {userInfo?.imageName ? (
                                    <Image
                                        src={userInfo.imageName}
                                        alt='profile'
                                        width={140}
                                        height={140}
                                        className='rounded-full'
                                    />
                                ) : (
                                    <div className='bg-purple-400 h-24 w-24 flex items-center justify-center rounded-full relative'>
                                        <span className='text-5xl text-white'>
                                            {userInfo.email[0].toUpperCase()}
                                        </span>
                                    </div>
                                )}
                                <div className='flex flex-col gap-2'>
                                    <span className='text-gray-400 text-lg font-medium'>
                                        {userInfo.username}
                                    </span>
                                    <span className='font-bold text-lg'>{userInfo.fullName}</span>
                                </div>
                            </div>
                            <div className='border-t py-5'>
                                <p>{userInfo.description}</p>
                            </div>
                        </div>
                        <div 
                            className='grid grid-cols-3 gap-10 w-full'
                        >
                            <div
                                className='shadow-md h-max p-10 flex flex-col cursor-pointer gap-2 transition-all hover:shadow-xl'
                                onClick={() => router.push('/seller/gigs')}
                            >
                                <h2 className='text-xl'>Total Gigs</h2>
                                <h3 className='font-extrabold text-3xl text-gray-400'>
                                    {dashboardData?.gigs}
                                </h3>
                            </div>
                            <div
                                className='shadow-md h-max p-10 flex flex-col cursor-pointer gap-2 transition-all hover:shadow-xl'
                                onClick={() => router.push('/seller/orders')}
                            >
                                <h2 className='text-xl'>Total Orders</h2>
                                <h3 className='font-extrabold text-3xl text-gray-400'>
                                    {dashboardData?.orders}
                                </h3>
                            </div>
                            <div
                                className='shadow-md h-max p-10 flex flex-col cursor-pointer gap-2 transition-all hover:shadow-xl'
                                onClick={() => router.push('/seller/unreadMessages')}
                            >
                                <h2 className='text-xl'>Unread Messages </h2>
                                <h3 className='font-extrabold text-3xl text-gray-400'>
                                    {dashboardData?.unreadMessages}
                                </h3>
                            </div>
                            <div
                                className='shadow-md h-max p-10 flex flex-col cursor-pointer gap-2 transition-all hover:shadow-xl'
                            >
                                <h2 className='text-xl'>Today Earnings </h2>
                                <h3 className='font-extrabold text-3xl text-gray-400'>
                                    {dashboardData?.dailyRevenue > 0 ? dashboardData.dailyRevenue : 0}
                                </h3>
                            </div>
                            <div
                                className='shadow-md h-max p-10 flex flex-col cursor-pointer gap-2 transition-all hover:shadow-xl'
                            >
                                <h2 className='text-xl'>Monthly Earnings </h2>
                                <h3 className='font-extrabold text-3xl text-gray-400'>
                                    {dashboardData?.monthlyRevenue > 0 ? dashboardData.monthlyRevenue : 0}
                                </h3>
                            </div>
                            <div
                                className='shadow-md h-max p-10 flex flex-col cursor-pointer gap-2 transition-all hover:shadow-xl'
                            >
                                <h2 className='text-xl'>Yearly Earnings </h2>
                                <h3 className='font-extrabold text-3xl text-gray-400'>
                                    {dashboardData?.revenue > 0 ? dashboardData.revenue : 0}
                                </h3>
                            </div>
                            
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default page