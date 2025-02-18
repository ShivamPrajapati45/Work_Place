import React, { useState } from 'react'
import { ChevronLeft,ChevronRight } from 'lucide-react'
import AllGigsCard from './AllGigsCard'
import { useRouter } from 'next/navigation';

const ExploreMore = ({ allGigs }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const router = useRouter();
    const visibleCards = 4; // Ek baar me dikhne wale cards
    const totalCards = allGigs?.length;

    const nextSlide = () => {
        if (currentIndex + visibleCards < totalCards) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const prevSlide = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };


    return (
        <div className='relative rounded-lg p-4 bg-slate-50'>
            <div className='flex items-center justify-between mb-4'>
                <h2 className="text-xl font-bold">Explore more services you would like </h2>
                <button 
                    onClick={() => router.push("/gigs")}
                    className='hover:opacity-80 transition-all duration-300'
                >View All</button>
            </div>

            <div className='relative overflow-hidden'>
                <div 
                    className='relative flex gap-4 transition-transform'
                    style={{ 
                        transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`, 
                        maskImage: 'linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0,0,0,1) 20%, #0000009a 80%, rgba(0,0,0,0.1))',
                        WebkitMaskImage: "linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,1) 20%, rgba(0,0,0,1) 80%, rgba(0,0,0,0.2))"
                    }}
                >
                    {allGigs?.slice(0, totalCards).map((gig, index) => (
                        <div key={index} className='w-1/4 min-w-[250px]'>
                            <AllGigsCard gig={gig} />
                        </div>
                    ))}
                </div>
            </div>

            {/* navigation btns */}
            {currentIndex > 0 && (
                <button 
                    onClick={prevSlide} 
                    className='absolute rounded-full left-0 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 transition-all duration-300 p-2 shadow-md'>
                    <ChevronLeft size={20}/>
                </button>
            )}

            {currentIndex + visibleCards < totalCards && (
                <button onClick={nextSlide} className='absolute rounded-full right-0 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 transition-all duration-300 p-2 shadow-md'>
                    <ChevronRight size={20}/>
                </button>
            )}

        </div>
    )
}

export default ExploreMore