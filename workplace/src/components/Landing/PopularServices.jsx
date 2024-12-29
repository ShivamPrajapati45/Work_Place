'use client'
import React from 'react'
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
        <div className='mx-20 my-16 text-white'>
        <h2 className='text-4xl mb-10  text-white text-center font-bold ml-4'>Popular Services</h2>
        <ul className='flex flex-wrap gap-10 justify-center'>
            {popularServices.map(({name,label,image})=>(
            <li key={name} 
                className='relative cursor-pointer' 
                // Aisa ek page banana he click karne pe search page pe jaye with query
                onClick={()=> router.push(`/search?q-${name.toLowerCase()}`)} 
            >
                <div className='absolute z-10  left-5 top-4'>
                <span>{label}</span>
                <h6 className='font-extrabold text-2xl'>{name}</h6>
                </div>
                <div className='h-60 w-60 '>
                <Image  alt='service' src={image} className='rounded-xl hover:shadow-md transition-all hover:shadow-black' fill></Image>
                </div>
            </li>
            ))}
        </ul>
        </div>
    )
    }

    export default PopularServices