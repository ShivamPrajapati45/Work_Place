import Home from '@/app/page';
import { useStateProvider } from '@/context/StateContext'
import { HOST } from '@/utils/constant';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { FaStar } from 'react-icons/fa';

const Details = () => {
    const [{ gigData,userInfo }] = useStateProvider();
    const [currentImages, setCurrentImages] = useState();
    
    useEffect(() => {
        console.log('dataGig',gigData)
        if(gigData){
            setCurrentImages(gigData?.images[0]);
        }
    },[gigData]);

    return (
        <>
            {gigData && currentImages !== "" && (
                <div className='flex flex-col col-span-2 gap-3'>
                    <h2 className='text-2xl font-bold mb-1 text-green-300'>
                        {gigData?.title}
                    </h2>
                    <div className='flex items-center gap-2'>
                        <div>
                            {gigData?.createdBy?.profileImage ? (
                                <Image
                                    src={HOST + "/" + gigData?.createdBy?.profileImage}
                                    alt='profile'
                                    height={30}
                                    width={30}
                                    className='rounded-full'
                                />
                            ) : (
                                <div className='bg-purple-500 h-10 w-10 flex items-center justify-center rounded-full relative'>
                                    <span className='text-xl text-white'>
                                        {gigData?.createdBy?.email[0].toUpperCase()}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className='flex gap-2 items-center'>
                            <h4 className='text-white font-bold'>
                                {gigData?.createdBy?.fullName}
                            </h4>
                            <h6 className='text-gray-400'>@{gigData?.createdBy?.username}</h6>
                        </div>
                        <div className='flex items-center gap-3'>
                            <div className='flex items-center'>
                                {[1,2,3,4,5].map((star) => (
                                    <FaStar
                                        key={star}
                                        // className={`cursor-pointer ${Math.ceil(averageRatings) >= star ? 'text-yellow-400' : 'text-gray-200'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col gap-4'>
                        <div className='max-h-[1000px] max-w-[1000px] overflow-hidden'>
                            <Image
                                src={HOST + "/uploads/" + currentImages}
                                alt='gig'
                                height={1000}
                                width={1000}
                                className='hover:scale-110 transition-all duration-500'
                            />
                        </div>
                        <div className='flex flex-wrap gap-4'>  
                            {gigData?.images.length > 1 && gigData.images.map((image) => (
                                <Image
                                    src={HOST + "/uploads/" + image}
                                    alt='Gig'
                                    height={100}
                                    width={100}
                                    key={image}
                                    onClick={() => setCurrentImages(image)}
                                    className={`${currentImages === image ? "" : 'blur-sm'} cursor-pointer transition-all duration-500`}
                                />
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3>about this gig</h3>
                        <div>
                            <p>{gigData?.description}</p>
                        </div>
                    </div>
                    <div className=''>
                        <h3 className='text-3xl my-5 font-semibold text-gray-400'>
                            About The Seller
                        </h3>
                        <div className='flex gap-4'>
                            <div>
                                {gigData?.createdBy?.profileImage ? (
                                    <Image
                                        src={HOST + '/' + gigData?.createdBy?.profileImage}
                                        alt='profile'
                                        height={120}
                                        width={120}
                                        className='rounded-full'
                                    />
                                ) : (
                                    <div className='bg-purple-500 h-10 w-10 flex items-center justify-center rounded-full relative'>
                                        <span className='text-xl text-white'>
                                            {gigData?.createdBy?.email[0].toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className='flex flex-col gap-3'>
                                <div className='flex gap-2 items-center'>
                                    <h4 className='font-medium text-lg'>
                                        {gigData?.createdBy?.fullName}
                                    </h4>
                                    <span className='text-gray-400'>
                                        @{gigData?.createdBy?.username}
                                    </span>
                                </div>
                                <div className=''>
                                    <p>{gigData?.createdBy?.description}</p>
                                </div>
                                <div className='flex items-center gap-3'>
                                    <div className='flex text-yellow-400'>
                                        {[1,2,3,4,5].map((star) => (
                                            <FaStar
                                                key={star}
                                                className={`cursor-pointer ${Math.ceil(gigData?.averageRating) >= star ? 'text-yellow-400' : 'text-gray-200'}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Details