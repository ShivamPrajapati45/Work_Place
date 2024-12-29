'use client'
import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { categories } from '@/utils/categories'

const Services = () => {
    const router = useRouter();
    
    return (
        <div className='mx-20 my-16'>
        <h2 className='text-4xl mb-10 font-bold'>You need it, we&apos; we got it</h2>
        <ul className='grid grid-cols-5 gap-10 '>
            {categories.map(({ name,logo })=>(
            <li 
                key={name} 
                className='flex flex-col justify-center items-center cursor-pointer hover:shadow-xl p-5 transition-all duration-500'
                onClick={()=>router.push(`/search?category=${name}`)} 
            >
                <Image sizes='' src={logo} alt='category' width={50} height={50}/>
                <span>{name}</span>
            </li>
            ))}
        </ul>
        </div>
    )
}

export default Services