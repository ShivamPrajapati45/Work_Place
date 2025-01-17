import { useStateProvider } from '@/context/StateContext'
import { HOST } from '@/utils/constant';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { FaStar } from 'react-icons/fa';

const Reviews = () => {
    const [{gigData}] = useStateProvider();
    const [averageRatings, setAverageRatings] = useState("0");
    useEffect(() => {
        if(gigData && gigData?.reviews.length){
            let avgRating  = 0;
            gigData.reviews.forEach(({ rating }) => (avgRating += rating));
            setAverageRatings((avgRating / gigData.reviews.length).toFixed(1));
        }
    },[gigData,averageRatings])

    return (
        <div>
            {gigData && (
                <div className='mb-10 p-6 rounded-lg '>
                    <h3 className='text-2xl my-4 font-semibold text-green-700'>
                        Reviews
                    </h3>
                    <div className='flex justify-between items-center mb-5 border-b pb-4'>
                        <h3 className='text-lg text-gray-800'>{gigData.reviews.length} reviews for this Gig</h3>
                        <div className='flex items-center gap-2 text-yellow-400'>
                            <div className='flex gap-1'>
                                {[1,2,3,4,5].map((star) => (
                                    <FaStar
                                        key={star}
                                        className={`cursor-pointer ${Math.ceil(averageRatings) >= star ? 'text-yellow-500' : 'text-gray-300'}`}
                                    />
                                ))}
                            </div>
                            <span className='text-lg font-medium text-yellow-500'>{averageRatings}</span>
                        </div>
                    </div>
                    <div className='flex flex-col gap-6'>
                        <h1 className='text-xl font-medium text-gray-800'>All Reviews</h1>
                        <div className=' rounded-lg max-h-[20rem] overflow-scroll'>
                        {gigData.reviews.map((review) => (
                            <div className='flex gap-4  border-b pb-4 mb-4 items-start' key={review?.id}>
                                <div className='h-16 w-16 rounded-full'>
                                    {review.reviewer ? (
                                        <img
                                            src={review.reviewer?.profileImage}
                                            className='rounded-full h-full w-full object-cover'
                                            alt='profile'
                                        />
                                    ) : (
                                        <div className='bg-purple-50 h-10 w-10 flex items-center justify-center rounded-full'>
                                            <span className='text-xl text-white'>
                                                {review.reviewer.email[0].toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <h4 className='text-lg font-medium text-gray-800'>{review.reviewer.fullName}</h4>
                                    <div className='flex  items-center gap-2'>
                                        <div className='flex gap-1'>
                                            {[1,2,3,4,5].map((star) => (
                                                <FaStar
                                                    key={star}
                                                    className={`cursor-pointer ${review.rating  >= star ? 'text-yellow-400' : 'text-gray-200'}`}
                                                />
                                            ))}
                                        </div>  
                                    </div>
                                        <p className='text-gray-600 text-sm'>{review.reviewText}</p>
                                </div>
                            </div>
                        ))}
                        </div>
                    </div>
                </div>
            ) }
        </div>
    )
}

export default Reviews