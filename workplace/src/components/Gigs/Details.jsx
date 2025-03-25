import { useStateProvider } from '@/context/StateContext'
import { GET_SELLER_GIGS, HOST, RECOMMENDED_GIGS } from '@/utils/constant';
import React, { useEffect, useState } from 'react'
import { TiStar } from 'react-icons/ti';
import { FaStar } from 'react-icons/fa';
import Reviews from './Reviews';
import AddReview from './AddReview';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { Carousel,CarouselContent,CarouselItem,CarouselNext,CarouselPrevious } from '../ui/carousel';
import AllGigsCard from './AllGigsCard';
import { FreelancerProfile } from '../seller/FreelancerProfile';


const Details = () => {
    const [{ gigData,hasOrdered }] = useStateProvider();
    const [currentImages, setCurrentImages] = useState();
    const [averageRatings, setAverageRatings] = useState("0");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [recommendedGigs, setRecommendedGigs] = useState([]);
    const [userGigs, setUserGigs] = useState([]);
    

    useEffect(() => {
        if (gigData) {
            setCurrentIndex(0); // Start with the first image
        }
    }, [gigData]);

    // console.log(gigData)
    const fetchRecommendedGigs = async () => {
        try {
            const res = await axios.get(`${RECOMMENDED_GIGS}/${gigData?.id}?category=${gigData?.category}&desc=${gigData?.shortDesc}`,{withCredentials: true});
            if(res.data.success){
                setRecommendedGigs(res.data.gigs);
            }
            
        } catch (error) {
            console.log(error)
        }
    }

    const getMoreServices = async () => {
        try {
            let res = await axios.get(`${GET_SELLER_GIGS}/${gigData?.createdBy?.id}/${gigData?.id}`, {withCredentials: true});
            if(res.data.success){
                setUserGigs(res.data.gigs);
            }
            
        } catch (error) {
            console.log(error)
        }
    };

    console.log('user Gigs: ', userGigs)

    useEffect( () => {
        if(gigData){ 
            fetchRecommendedGigs();
            getMoreServices();
        };

        return () => {
            setRecommendedGigs([]);
            setUserGigs([]);
        }
    },[gigData])

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
                <div className='flex relative overflow-y-scroll flex-col items-start my-4 w-full max-h-screen col-span-2 gap-3 scrollbar-hide'>

                    <div className=' flex items-start justify-center gap-2.5 flex-col px-4 '>
                        <h1 className='text-2xl font-semibold'>{gigData?.shortDesc}</h1>
                        <div className='flex items-center justify-center gap-4'>
                            <div>
                                {gigData?.createdBy?.isProfileInfoSet ? (
                                    <div className='h-16 w-16 overflow-hidden'>
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
                            <div className='flex flex-col'>
                                <h1 className='text-xl'>{gigData?.createdBy?.fullName}</h1>
                                <div className="flex items-center justify-center">
                                        {[1,2,3,4,5].map((star) => (
                                            <TiStar
                                                key={star}
                                                className={`${Math.ceil(averageRatings) >= star ? 'text-yellow-400' : 'text-gray-400'}`}
                                                size={22}
                                            />
                                        ))}
                                    <span className='text-lg'>
                                        {averageRatings != 'NaN' ? averageRatings : 0.0}
                                    </span>
                                    <span className='text-gray-600  mx-1 text-lg font-light underline cursor-pointer'>
                                        ({gigData?.totalReviews} reviews)
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Image Section */}
                    <div className='flex items-center my-5 flex-col gap-4 bg-gray-100 rounded-md p-2'>
                        <div 
                            className='max-h-[370px] relative w-[680px] overflow-hidden rounded-lg'
                        >
                                <div
                                    className="flex h-[370px] items-center transition-transform duration-500 ease-in-out"
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
                        </div>
                        <button
                            onClick={prevImage}
                            className='absolute cursor-pointer  shadow-lg shadow-black top-[55%] transform left-[-20px] -translate-y-1/2 bg-white rounded-full p-2.5'>
                            <ChevronLeft className='text-black' size={26}/>
                        </button>
                        <button
                            onClick={nextImage}
                            className='absolute cursor-pointer shadow-sm shadow-black right-[140px] top-[55%] transform -translate-y-1/2 bg-white rounded-full p-2.5'>
                            <ChevronRight className='text-black' size={26}/>
                        </button>
                        <div className='flex flex-wrap items-center gap-5'>  
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

                    <div className='flex flex-col w-full justify-center'>
                        <h3 className='font-semibold text-[#212121] text-xl mt-3'>About this service</h3>
                        <p className='text-slate-600 mt-2.5'>{gigData?.description}</p>
                    </div>

                    <span className='text-xl'>Get to know {gigData?.createdBy?.fullName}</span>
                    <FreelancerProfile averageRatings={averageRatings} gigData={gigData} />

                    {recommendedGigs.length > 0 && (
                        <div className='bg-gray-100 rounded-md p-4'>
                            <p className='text-2xl text-slate-500 font-semibold mb-4 my-2'>Recommended for you</p>
                            {recommendedGigs.length > 0 && (
                                <div className=''>
                                    <Carousel
                                        opts={{
                                            align: "start",
                                        }}
                                        className="w-full mx-1 max-w-lg"
                                    >
                                        <CarouselContent>
                                            {recommendedGigs.map((gig, index) => (
                                                <CarouselItem
                                                    key={index}
                                                    className="w-1/2 md:w-1/2 lg:w-1/3 px-2"
                                                >
                                                    <AllGigsCard gig={gig}/>
                                                </CarouselItem>
                                            ))}
                                        </CarouselContent>
                                        {recommendedGigs.length > 1 && (
                                            <>
                                                <CarouselPrevious/>
                                                <CarouselNext/>
                                            </>
                                        )}
                                    </Carousel>
                                </div>
                            )}
                        </div>
                    )}
                    
                    {userGigs.length > 0 && (
                        <div className='bg-gray-100 rounded-md p-4'>
                            <p className='text-2xl font-semibold mb-4 my-2'>More from {gigData?.createdBy?.fullName}</p>
                            {userGigs.length > 0 && (
                                <div className=''>
                                    <Carousel
                                        opts={{
                                            align: "start",
                                        }}
                                        className="w-full mx-1 max-w-lg"
                                    >
                                        <CarouselContent>
                                            {userGigs.map((gig, index) => (
                                                <CarouselItem
                                                    key={index}
                                                    className="w-1/2 md:w-1/2 lg:w-1/3 px-2"
                                                >
                                                    <AllGigsCard gig={gig}/>
                                                </CarouselItem>
                                            ))}
                                        </CarouselContent>
                                        {userGigs.length > 1 && (
                                            <>
                                                <CarouselPrevious/>
                                                <CarouselNext/>
                                            </>
                                        )}
                                    </Carousel>
                                </div>
                            )}
                        </div>
                    )}
                    
                    {hasOrdered && <AddReview/>}
                    <div className='w-full'>
                        <Reviews/>
                    </div>
                </div>
            )}
        </>
    )
}

export default Details