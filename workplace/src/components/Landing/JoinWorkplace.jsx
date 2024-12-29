import React from 'react'
import Image from 'next/image'

const JoinWorkplace = () => {
    return (
        <div className='mx-32 my-16 relative'>
            <div className='absolute z-10 top-1/3 left-10'>
                <h4 className='text-white text-5xl am-10'>
                    Suddenly it&apos;s all so <i>doable.</i>
                </h4>
                <button 
                    className='border text-base font-medium px-5 py-2 border-[#1dbf73] bg-[#1dbf73] text-white' 
                    type='button'
                >
                    join Workplace
                </button>
            </div>
            <div className='w-full h-96'>
                <Image  src="/images/bg-signup.webp" fill alt='signup' className='rounded-md'/>
            </div>
        </div>
    )
    }

    export default JoinWorkplace