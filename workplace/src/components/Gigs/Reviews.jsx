import { useStateProvider } from '@/context/StateContext'
import { HOST } from '@/utils/constant';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { FaStar } from 'react-icons/fa';

const Reviews = () => {
    const [{gigData}] = useStateProvider();
    const [averageRatings, setAverageRatings] = useState("0");
    // console.log('gigData', gigData)
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
                <div className='mb-10'>
                    <h3 className='text-2xl my-5 font-medium'>
                        Reviews
                    </h3>
                    <div className='flex gap-3 mb-5'>
                        <h3>{gigData.reviews.length} reviews for this Gig</h3>
                        <div className='flex items-center gap-2 text-yellow-400'>
                            <div className='flex gap-1'>
                                {[1,2,3,4,5].map((star) => (
                                    <FaStar
                                        key={star}
                                        className={`cursor-pointer ${Math.ceil(averageRatings) >= star ? 'text-yellow-400' : 'text-gray-200'}`}
                                    />
                                ))}
                            </div>
                            <span className=''>{averageRatings}</span>
                        </div>
                    </div>
                    <div className='flex flex-col gap-3'>
                        <h1>All Reviews</h1>
                        {gigData.reviews.map((review) => (
                            <div className='flex gap-3 border-t pt-6' key={review?.id}>
                                <div>
                                    {review.reviewer.profileImage ? (
                                        <Image
                                            src={HOST + "/" + review.reviewer.profileImage}
                                            height={40}
                                            width={40}
                                            className='rounded-full'
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
                                    <h4>{review.reviewer.fullName}</h4>
                                    <div className='flex text-yellow-500 items-center gap-2'>
                                        <div className='flex gap-1'>
                                            {[1,2,3,4,5].map((star) => (
                                                <FaStar
                                                    key={star}
                                                    className={`cursor-pointer ${review.rating  >= star ? 'text-yellow-400' : 'text-gray-200'}`}
                                                />
                                            ))}
                                        </div>  
                                    </div>
                                        <h2>{review.reviewText}</h2>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) }
        </div>
    )
}

export default Reviews