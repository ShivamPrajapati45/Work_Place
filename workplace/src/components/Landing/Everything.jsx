import React, { useEffect } from 'react'
import Image from 'next/image'
import { BsCheckCircle } from "react-icons/bs"
import Aos from 'aos'

const Everything = () => {

    useEffect(() => {
            Aos.init({ duration: 1200, once:false }); // Initialize AOS
    }, []);


    const everyThingData = [
        {
            title: "Stick to your budget",
            subtitle: "Find the right service for your price point. No hourly rates, just project-based pricing."
        },
        {
            title: "Get quality work done quickly",
            subtitle: "Hand your project to talented freelancers in minutes, get long-lasting results."
        },
        {
            title: "Pay when you're happy",
            subtitle: "Upfront quotes mean no surprises. Payments only get released when you approve."
        },
        {
            title: "Count on 24/7 support",
            subtitle: "Our round-the-clock support team is available to help anytime, anywhere."
        }
    ];

    return (
        <div 
            className='bg-white bg-gradient-to-t from-gray-500 to-gray-600 py-12 px-6 md:px-16 lg:px-6 flex w-full gap-5 lg:flex-row items-center'

        >
            <div 
                className='flex flex-col p-4 items-start bg-gray-200 rounded-lg shadow-xl transform transition duration-500 hover:shadow-2xl'
                data-aos='fade-right'
                data-aos-delay='200'
            >
                <h2 className='text-2xl mb-5 font-semibold text-[#212121] text-center lg:text-left'>
                    Know About.
                </h2>
                <ul className='flex flex-col gap-7'>
                    {everyThingData.map(({ title, subtitle }) => {
                        return (
                            <li key={title} className='flex flex-col'>
                                <div className='flex items-center gap-2 text-xl text-gray-700'>
                                    <BsCheckCircle className='text-[#1A73E8] text-2xl' />
                                    <h4 className='font-semibold text-lg'>{title}</h4>
                                </div>
                                <p className='mt-2 text-gray-600 text-lg'>{subtitle}</p>
                            </li>
                        )
                    })}
                </ul>
            </div>
            <div 
                className='relative h-screen py-8 w-full lg:w-2/4 overflow-hidden rounded-lg transform transition duration-500'
                data-aos='fade-left'
                data-aos-delay='200'
            >
                <img
                    src="/images/everything.webp"
                    alt='everything'
                    className='w-full h-full object-cover rounded-lg shadow-lg'
                />
            </div>
        </div>
    )
}

export default Everything
