import { useStateProvider } from '@/context/StateContext'
import React, { useEffect, useState } from 'react'
import { FaStar } from 'react-icons/fa';

const Reviews = ({addReview, data, setData}) => {
    const [{gigData,socket}] = useStateProvider();
    const [averageRatings, setAverageRatings] = useState(0);
    const [reviews, setReviews] = useState(gigData?.reviews || []);

    useEffect(() => {
        if(gigData && gigData?.reviews?.length){
            let avgRating  = 0;
            gigData.reviews.forEach(({ rating }) => (avgRating += rating));
            setAverageRatings((avgRating / gigData.reviews.length).toFixed(1));
        }
        
        if(socket){
            socket?.on('newReview', (newReview) => {
                setReviews((prevReviews) => [...prevReviews, newReview]);
            })
        }

        return () => socket?.off('newReview');

    },[gigData,averageRatings,data]);

    // console.log(reviews);

    function formatDate(date, relative = false) {
        const now = new Date();
        const createdAt = new Date(date);
    
        if (relative) {
            const seconds = Math.floor((now - createdAt) / 1000);
            const intervals = {
                year: 31536000,
                month: 2592000,
                week: 604800,
                day: 86400,
                hour: 3600,
                minute: 60,
                second: 1,
            };
    
            for (const [unit, value] of Object.entries(intervals)) {
                const count = Math.floor(seconds / value);
                if (count > 0) {
                return `${count} ${unit}${count > 1 ? "s" : ""} ago`;
                }
            }
            return "just now";
            }
    
            return createdAt.toLocaleString("en-US", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            });
    }

    return (
        <div className=' rounded-none'>
            {gigData && (
                <div className='mb-10 p-5 rounded-lg border-2 border-gray-100'>
                    <h3 className='text-2xl my-4 font-semibold text-green-700'>
                        Reviews
                    </h3>
                    <div className='flex flex-col justify-between mb-5 border-b pb-4'>
                        <h3 className='text-lg text-gray-800'>{reviews?.length > 0 ? `${reviews?.length} for this service` :  `No reviews for this service till now`}</h3>
                        <div className='flex items-center gap-2 text-yellow-400'>
                            <div className='flex gap-1'>
                                {[1,2,3,4,5].map((star) => (
                                    <FaStar
                                        key={star}
                                        className={`cursor-pointer ${Math.ceil(averageRatings) >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                                    />
                                ))}
                            </div>
                            <span className='text-lg font-medium text-yellow-500'>{averageRatings !== 'NaN' ? averageRatings : 0.0} </span>
                            <span className='text-lg text-slate-500'>({reviews?.length} reviews)</span>

                        </div>
                    </div>
                    {reviews?.length > 0 && (
                        <div className='flex flex-col gap-6'>
                        <h1 className='text-xl font-medium text-gray-800'>All Reviews</h1>
                        <div className=' rounded-lg max-h-[20rem] overflow-scroll'>
                        {reviews?.map((review) => (
                            <div className='flex gap-4 mx-10 relative border-b-[1.5px] pb-4 mb-4 items-start' key={review?.id}>

                                <div className='h-16 w-16 rounded-full'>
                                    {review?.reviewer?.isProfileInfoSet ? (
                                        <img
                                            src={review?.reviewer?.profileImage}
                                            className='rounded-full h-full w-full object-cover'
                                            alt='profile'
                                        />
                                    ) : (
                                        <div className='bg-purple-500 h-16 w-16 flex items-center justify-center rounded-full'>
                                            <span className='text-4xl text-white'>
                                                {review?.reviewer?.email[0].toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className='flex flex-col gap-2'>
                                    <h4 className='text-lg font-medium text-gray-800'>{review?.reviewer?.fullName}</h4>
                                    <div className='flex  items-center gap-2'>
                                        <div className='flex gap-1'>
                                            {[1,2,3,4,5].map((star) => (
                                                <FaStar
                                                    key={star}
                                                    className={`cursor-pointer ${review?.rating  >= star ? 'text-yellow-400' : 'text-gray-200'}`}
                                                />
                                            ))}
                                        </div>  
                                    </div>
                                        <p className='text-gray-600 text-sm'>{review?.reviewText}</p>
                                </div>
                                <span className='absolute right-5 text-sm'>
                                    {
                                        formatDate(review?.createdAt, true)
                                    }
                                </span>
                            </div>
                        ))}
                        </div>
                    </div>
                    )}
                    
                </div>
            ) }
        </div>
    )
}

export default Reviews