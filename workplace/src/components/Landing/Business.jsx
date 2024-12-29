import React from 'react'
import {  BsCheckCircle } from 'react-icons/bs'
import Logo from '../Logo'
import Image from 'next/image'

const Business = () => {
  return (
    <div className='bg-black px-20 py-16 flex gap-10'>
        <div className='text-white flex flex-col gap-6 justify-center items-center'>
            <div className='flex gap-2'>
                <Logo/>
                <span className='text-white text-3xl font-bold'>Business</span>
            </div>
            <h2 className='font-bold text-3xl'>A Solution Built for Business</h2>
            <h4 className='text-xl'>
                Upgrade to a curated experience to access vetted talent and exclusive tools
            </h4>
            <ul className='flex flex-col gap-4'>
                <li className='flex gap-2 items-center'>
                    <BsCheckCircle className='text-[#62646a]'/>
                    <span>Talent Matching</span>
                </li>
                <li className='flex gap-2 items-center'>
                    <BsCheckCircle className='text-[#62646a]'/>
                    <span>Dedicated Account Management</span>
                </li>
                <li className='flex gap-2 items-center'>
                    <BsCheckCircle className='text-[#62646a]'/>
                    <span>Team Collaboration tools</span>
                </li>
                <li className='flex gap-2 items-center'>
                    <BsCheckCircle className='text-[#62646a]'/>
                    <span>Business Payment Solutions</span>
                </li>
            </ul>
            <button 
                className='border text-base font-medium px-5 py-2 bg-green-400 text-white rounded-md'
                type='button'
            >
                Explore Workplace business
            </button>
        </div>
        <div className='relative h-[512px] w-2/3'>
            <Image src='/images/business.webp' alt='business' fill />
        </div>
    </div>
  )
}

export default Business