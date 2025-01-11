import { useStateProvider } from '@/context/StateContext';
import { HOST } from '@/utils/constant';
import Cookies from 'js-cookie';
import { ChevronLeft, ChevronRight, Clock, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const AllGigsCard = ({ gig }) => {
    const router = useRouter();
    const calculateRatings = () => {
        const { reviews } = gig;
        let rating = 0;
        if(!reviews?.length){
            return 0;
        }
        reviews?.forEach((review) => {
            rating += review.rating
        });
        return (rating / reviews.length).toFixed(1);
    }
    const [{userInfo}] = useStateProvider();
    const token = Cookies.get('token');

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % gig?.images.length);
    };
    const previousImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + gig?.images.length) % gig?.images.length);
    };

    const handleAuthUser = (id) => {
        if(token && userInfo){
            router.push(`/gig/${id}`)
        }else{
            router.push('/login');
        }
        
    }

    return (
        <div

        >
            <div
                className={`w-[280px] h-[350px] bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 ease-in-out ${
                    isHovered ? "shadow-lg shadow-gray-500 duration-500" : ""
                }`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="relative h-[170px] overflow-hidden">
                    <div 
                        className='flex transition-transform duration-500 ease-in-out' 
                        style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                    >
                        {
                            gig?.images.map((image, index) => (
                                <div key={index} className='w-full h-full flex-shrink-0'>
                                    <img 
                                        src={`${HOST}/uploads/${image}`} 
                                        alt={`Product ${index + 1}`}
                                        className="w-full h-full object-cover hover:scale-105 duration-500 transition-all"
                                    />
                                </div>
                            ))
                        }
                    </div>
                    <span className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded-full text-xs">
                        {gig?.category}
                    </span>
                        {isHovered && (
                        <>
                            <button
                                onClick={previousImage}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full hover:bg-white/90 transition-colors"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full hover:bg-white/90 transition-colors"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </>
                        )}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                        {gig?.images.map((_, index) => (
                            <div
                                key={index}
                                className={`w-1.5 h-1.5 rounded-full transition-colors ${index === currentImageIndex ? "bg-white" : "bg-white/50"}`}
                            />
                        ))}
                    </div>
                </div>

                {/* detail section */}
                <div
                    onClick={() => handleAuthUser(gig?.id)}
                    className='cursor-pointer px-4'
                >
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-lg truncate">{gig?.title}</h3>
                            <span className="font-bold text-lg">${gig?.price}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{gig?.shortDesc}</p>
                        <div className="flex flex-wrap gap-1 mb-2">
                            {gig?.features.slice(0, 3).map((feature, index) => (
                                <span
                                    key={index}
                                    className="bg-gray-200 uppercase font-semibold text-xs px-2 py-1 rounded-full"
                                >
                                    {feature}
                                </span>
                            ))}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mb-1">
                            <Clock size={14} className="mr-1" />
                            {gig?.deliveryTime} business days
                        </div>
                        <div className="flex items-center pt-3 border-t border-gray-100">
                            {
                                gig?.createdBy ? (
                                    <img
                                        src={gig?.createdBy?.profileImage}
                                        alt={gig?.createdBy?.username}
                                        className="w-9 h-9 rounded-full mr-2"
                                    />
                                ) : (
                                    <div className="bg-purple-400 h-7 w-7 flex items-center justify-center rounded-full relative">
                                        <span className="text-lg text-white">
                                            {gig?.createdBy?.email[0].toUpperCase()}
                                        </span>
                                    </div>
                                )
                            }
                        <span className="text-sm font-medium">@{gig?.createdBy?.username}</span>
                        <div className="ml-auto flex items-center">
                            <Star size={14} className="text-yellow-400"           fill="currentColor" />
                            <span className="text-sm ml-1">{calculateRatings()}</span>
                            <span className='text-sm'>{gig?.reviews?.length}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AllGigsCard