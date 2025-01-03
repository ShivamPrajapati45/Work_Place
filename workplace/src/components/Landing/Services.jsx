'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { categories } from '@/utils/categories'

const Services = () => {
    const router = useRouter();
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [hoverColors, setHoverColors] = useState({});
    const colors = ['#1A73E8', '#FF5733', '#28B463', '#FFC300', '#8E44AD'];

    const handleMouseEnter = (index) => {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        setHoverColors((prevColors) => ({
            ...prevColors,
            [index]: randomColor,
        }));
        setHoveredIndex(index);
    };

    return (
        <div className='mx-20 my-16'>
            <h2 className='text-4xl mb-10 ml-10 font-bold text-blue-600'>You need it, we&apos;ve got it</h2>
            <ul className='grid grid-cols-5 gap-10'>
                {categories.map(({ name, logo }, index) => {
                    const color = hoverColors[index] || '#000';
                    return (
                        <li
                            key={name}
                            className={`flex flex-col rounded-xl justify-center items-center cursor-pointer hover:shadow-2xl hover:border-[#1A73E8] border-2 border-transparent p-5 transition-all duration-500 
                            ${hoveredIndex !== null && hoveredIndex !== index ? 'opacity-50 blur-sm' : ''}`}
                            onClick={() => router.push(`/search?category=${name}`)}
                            onMouseEnter={() => handleMouseEnter(index)} // Set hovered index
                            onMouseLeave={() => handleMouseEnter(null)} // Reset hovered index
                            style={{
                                borderColor: hoveredIndex === index ? color : 'transparent',
                            }}
                        >
                            <Image
                                sizes=''
                                src={logo}
                                alt='category'
                                width={50}
                                height={50}
                            />
                            <span
                                style={{
                                    color: hoveredIndex === index ? color : '#000',
                                }}
                                className={`relative transition-all duration-300`}
                            >
                                {name}
                                <span
                                    className={`absolute bottom-0 left-0 w-full h-[2px] transform transition-all duration-300 ${
                                        hoveredIndex === index ? 'scale-x-100' : 'scale-x-0'
                                    }`}
                                    style={{
                                        backgroundColor: color,
                                    }}
                                />
                            </span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default Services;
