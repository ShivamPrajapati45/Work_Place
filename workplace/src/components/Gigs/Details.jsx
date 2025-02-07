import Home from '@/app/page';
import { useStateProvider } from '@/context/StateContext'
import { HOST } from '@/utils/constant';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { FaStar } from 'react-icons/fa';
import Reviews from './Reviews';
import AddReview from './AddReview';
import { ChevronLeft, ChevronRight } from 'lucide-react';


const Details = () => {
    const [{ gigData,hasOrdered }] = useStateProvider();
    const [currentImages, setCurrentImages] = useState();
    const [averageRatings, setAverageRatings] = useState("0");
    const [currentIndex, setCurrentIndex] = useState(0);
    
    useEffect(() => {
        if (gigData) {
            setCurrentIndex(0); // Start with the first image
        }
    }, [gigData]);

    useEffect(() => {
            if(gigData && gigData?.reviews.length){
                let avgRating  = 0;
                gigData.reviews.forEach(({ rating }) => (avgRating += rating));
                setAverageRatings((avgRating / gigData.reviews.length).toFixed(1));
            }
    },[gigData,averageRatings]);


    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % gigData.images.length);
    };

    const prevImage = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? gigData.images.length - 1 : prevIndex - 1
        );
    };

    return (
        <>
            {gigData && currentImages !== "" && (
                <div className='flex flex-col col-span-2 gap-3'>
                    <div className='flex w-full items-center justify-around'>
                        <div className='flex items-center justify-center gap-3'>
                            <div className='rounded-md'>
                                {gigData?.createdBy ? (
                                    <div className='h-14 w-14 overflow-hidden'>
                                        <img
                                            src={gigData?.createdBy?.profileImage}
                                            alt='profile'
                                            className='rounded-full h-full w-full object-cover'
                                        />
                                    </div>
                                ) : (
                                    <div className='bg-purple-500 h-10 w-10 flex items-center justify-center rounded-full relative'>
                                        <span className='text-xl text-white'>
                                            {gigData?.createdBy?.email[0].toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className='flex gap-2 items-center'>
                                <h6 className='text-slate-700'>@{gigData?.createdBy?.username}</h6>
                            </div>
                            <div className='flex items-center gap-3'>
                                <div className='flex items-center'>
                                    {[1,2,3,4,5].map((star) => (
                                        <FaStar
                                            key={star}
                                            className={`cursor-pointer ${Math.ceil(averageRatings) >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                                        />
                                    ))}
                                </div>
                                <span className='text-yellow-500 font-semibold underline'>
                                    {averageRatings}
                                </span>
                            </div>
                            
                        </div>
                        <div>
                            <h2 className='text-2xl text-center font-bold mb-1 text-[#212121]'>
                                {gigData?.title}
                            </h2>
                        </div>
                    </div>
                    <div className='flex items-center flex-col gap-4'>
                        <div 
                            className='max-h-[350px] border-[1.7px] border-slate-500 relative w-[680px] overflow-hidden rounded-lg'
                        >
                                <div
                                    className="flex h-[350px] items-center transition-transform duration-500 ease-in-out"
                                    style={{
                                        transform: `translateX(-${currentIndex * 100}%)`,
                                    }}
                                >
                                    {gigData?.images.map((image, index) => (
                                        <img
                                            key={index}
                                            src={HOST + "/uploads/" + image}
                                            alt="gig"
                                            className="h-full hover:scale-105 duration-500 backdrop-blur-md object-cover w-full flex-shrink-0"
                                        />
                                    ))}
                                </div>
                            <button
                                onClick={prevImage}
                                className='absolute  left-2 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/70 duration-500  text-white rounded-full p-2'>
                                <ChevronLeft/>
                            </button>
                            <button
                                onClick={nextImage}
                                className='absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/70 duration-500  text-white rounded-full p-2'>
                                <ChevronRight/>
                            </button>
                        </div>
                        <div className='flex flex-wrap gap-4'>  
                            {gigData?.images.length > 0 && gigData.images.map((image,index) => (
                                <img
                                    src={HOST + "/uploads/" + image}
                                    alt='Gig'
                                    key={image}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`${currentIndex === index ? "" : 'blur-sm'} hover:scale-105 cursor-pointer h-16 w-16 transition-all duration-500 rounded-md`}
                                />
                            ))}
                        </div>
                    </div>
                    <div className=''>
                        <h3 className='font-semibold text-[#212121] uppercase text-lg mt-3'>about this service</h3>
                        <p className='text-slate-600'>{gigData?.description}</p>
                    </div>
                    <div className='flex flex-col'>
                        <h3 className='text-2xl my-4 font-semibold text-slate-900'>
                            About The Seller
                        </h3>
                        <div className="relative mx-auto max-w-[31rem] rounded-lg bg-gradient-to-tr from-pink-400 to-blue-500 p-0.5 shadow-lg">

                        <div className='flex w-[30rem] gap-5 items-center rounded-lg p-5 bg-white shadow-lg transition-all duration-500 mx-auto '>
                            <div className='h-20 w-24 overflow-hidden'>
                                {gigData?.createdBy ? (
                                    <img
                                        src={gigData?.createdBy?.profileImage}
                                        alt='profile'
                                        className='rounded-full h-full w-full object-cover'
                                    />
                                ) : (
                                    <div className='bg-gradient-to-r from-purple-500 to-pink-500 h-20 w-20 flex items-center justify-center rounded-full'>
                                        <span className='text-2xl font-semibold text-white'>
                                            {gigData?.createdBy?.email[0].toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className='flex flex-col gap-2 w-full'>
                                <div className='flex justify-between items-center'>
                                    <h4 className='font-semibold uppercase text-xl text-gray-800'>
                                        {gigData?.createdBy?.fullName}
                                    </h4>
                                    <span className='text-gray-500 font-semibold text-lg '>
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
                                                className={`cursor-pointer ${Math.ceil(gigData?.averageRating) >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                                            />
                                        ))}
                                    </div>
                                    <span className='text-yellow-500 font-semibold'>{gigData?.averageRating > 0 ? gigData?.averageRating : 0}</span>
                                    <span className='text-gray-500'>({gigData.totalReviews} Reviews)</span>
                                </div>
                            </div>
                        </div>
                        </div>

                    </div>
                    {hasOrdered && <AddReview/>}
                    {/* <Reviews/> */}
                </div>
            )}
        </>
    )
}

export default Details