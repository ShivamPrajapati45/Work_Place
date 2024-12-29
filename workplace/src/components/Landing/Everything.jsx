import React from 'react'
import Image from 'next/image'
import { BsCheckCircle } from "react-icons/bs"

const Everything = () => {

    const everyThingData = [
        {
            title : "Stick to your budget",
            subtitle : "Find the right service for price point. No hourly rates, just project based pricing."
        },
        {
            title : "Get quality work done quickly",
            subtitle : "Hand your project to talented freelancer in minutes, get long-lasting results."
        },
        {
            title : "Pay when you're happy",
            subtitle : "Upfront quotes mean no surprises. Payments only get released when you approve"
        },
        {
            title : "Count on 24/7 support",
            subtitle : "Our round the clock support team is available to help anytime, anywhere"
        }
    ];

    return (
        <div className='bg-white flex py-20 justify-between px-24'>
        <div>
            <h2 className='text-4xl mb-5 font-bold text-black'>
            The best Part ? Everything.
            </h2>
            <ul className='flex flex-col gap-10'>
            {everyThingData.map(({title,subtitle})=>{
                return (
                <li key={title}>
                    <div className='flex gap-2 items-center text-xl'>
                    <BsCheckCircle className='text-gray-500'/>
                    <h4>{title}</h4>
                    </div>
                    <p className='text-black'>{subtitle}</p>
                </li>
                )
            })}
            </ul>
        </div>
        <div className='relative h-96 w-2/4'>
            <Image  src="/images/everything.webp" fill alt='everything' />
        </div>
        </div>
    )
    }

    export default Everything