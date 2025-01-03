'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const PopularServices = () => {
    const router = useRouter();
    const popularServices = [
        {
        name : "AI Artist",
        label : "Add talent to AI",
        image : "/images/service1.png"
        },
        {
        name : "Logo Design",
        label : "Build Your Design",
        image : "/images/service2.jpeg"
        },
        {
        name : "WordPress",
        label : "Customize your site",
        image : "/images/service3.jpeg"
        },
        {
        name : "Voice over",
        label : "Share Message",
        image : "/images/service4.jpeg"
        },
        {
        name : "Social media",
        label : "Reach more customers",
        image : "/images/service5.jpeg"
        },
        {
        name : "SEO",
        label : "Unlock Growth online",
        image : "/images/service6.jpeg"
        },
        {
        name : "Illustration",
        label : "Color your areas",
        image : "/images/service3.jpeg"
        },
        {
        name : "Translation",
        label : "Go Global",
        image : "/images/service8.jpeg"
        },
    ]


    return (
        <div className='mt-3 text-white'>
        <h2 className='text-4xl mb-5  text-[#212121] text-center font-bold ml-4'>Popular Services</h2>
        <ul className='flex flex-wrap gap-10 justify-center bg-[#000] py-10'>
            {popularServices.map(({name,label,image})=>{
                const [isHovered, setIsHovered] = useState(false);
                return(
                    <li key={name} 
                        className='relative cursor-pointer' 
                        onClick={()=> router.push(`/search?q-${name.toLowerCase()}`)} 
                    >
                        <div className='absolute z-10  left-5 top-4'>
                            <span>{label}</span>
                            <h6 className={`font-extrabold text-2xl relative`}>
                                {name}
                                <span
                                    className={`absolute left-0 bottom-0 h-1 w-full bg-white transition-all duration-300 transform ${
                                                isHovered ? 'scale-x-100' : 'scale-x-0'
                                                } origin-left`}
                                ></span>
                            </h6>
                        </div>
                        <div className='h-60 w-60 overflow-hidden '>
                            <Image  
                                alt='service' 
                                src={image} 
                                fill
                                onMouseEnter={()=>setIsHovered(true)}
                                onMouseLeave={()=>setIsHovered(false)}
                                className='rounded-xl w-full hover:shadow-md h-full object-cover hover:scale-105 transition-all hover:shadow-blue-300' 
                            />
                        </div>
                    </li>
                )
            })}
        </ul>
        </div>
    )
    }

    export default PopularServices