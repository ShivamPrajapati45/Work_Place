import { HOST } from '@/utils/constant';
import Image from 'next/image';
import { useRouter } from 'next/navigation'
import React from 'react'
import { FaStar } from 'react-icons/fa'

const SearchGridItem = ({ gig }) => {

    console.log('gig', gig)
    const router = useRouter();
    const calculateRatings = () => {

    }

    return (
        <div
            className='max-w-[300px] flex flex-col gap-2 p-1 cursor-pointer mb-8'
            onClick={() => router.push(`/gig/${gig?.id}`)}
            // onClick={() => console.log('hello')}
            
        >
            <div className='relative w-64 h-40'>
                <Image
                    src={`${HOST}/uploads/${gig?.images[0]}`}
                    alt='gig'
                    fill
                    className='rounded-xl'
                />
            </div>
            <div className='flex items-center gap-2'>
                <div>
                    {gig?.createdBy?.profileImage ? (
                        <Image
                            src={HOST + "/" + gig?.createdBy?.profileImage}
                            alt='profile'
                            height={30}
                            width={30}
                            className='rounded-full'
                        />
                    ) : (

                        // if profileImage is not there then show the avatar
                        <div className='bg-purple-400 h-7 w-7 flex items-center justify-center rounded-full relative'>
                            <span className='text-lg text-white'>
                                {gig?.createdBy?.email[0].toUpperCase()}
                            </span>
                        </div>
                    )}
                </div>
                <span className='text-lg'>
                    <strong className='font-medium'>{gig?.createdBy?.username}</strong>
                </span>
            </div>
                <div>
                    <p className='line-clamp-2 text-white'>{gig?.title}</p>
                </div>
                <div className='flex items-center gap-1 text-yellow-200'>
                    <FaStar/>
                    <span className='font-medium'>{calculateRatings()}</span>
                    <span className='text-gray-505'>{gig?.reviews?.length}</span>
                </div>
                <div>
                    <strong className='font-medium'>From ${gig?.price}</strong>
                </div>
        </div>
    )
}

export default SearchGridItem