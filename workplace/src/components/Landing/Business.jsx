import React, { useEffect } from 'react'
import {  BsCheckCircle } from 'react-icons/bs'
import Logo from '../Logo'
import Image from 'next/image'
import Aos from 'aos'
import { reducerCases } from '@/context/constants'
import { useStateProvider } from '@/context/StateContext'

const Business = () => {
    const [{ showLogInModel,showSignUpModel }, dispatch] = useStateProvider();
    
    useEffect(() => {
        Aos.init({ duration: 2000 });
    },[])
    const handleClick = () => {
            dispatch({
                type: reducerCases.TOGGLE_LOGIN_MODEL,
                showLogInModel: false
            });
            dispatch({
                type: reducerCases.TOGGLE_SIGNUP_MODEL,
                showSignUpModel: true
            });
        }
    

  return (
    <div className='bg-black px-20 py-16 flex gap-10'>
        <div className='text-white flex flex-col gap-6 justify-center items-center'>
            <div className='flex gap-2' data-aos='fade-right'>
                {/* <Logo/> */}
                <span className='text-white text-2xl font-bold'>WorkPlace</span>
            </div>
            <h2 className='font-bold text-3xl' data-aos='zoom-in'>A Solution Built for Business</h2>
            <h4 className='text-xl'>
                Upgrade to a curated experience to access vetted talent and exclusive tools
            </h4>
            <ul className='flex flex-col gap-4 text-lg'  data-aos='fade-left'>
                <li className='flex gap-2 items-center'>
                    <BsCheckCircle className='text-[#34A853]'/>
                    <span>Talent Matching</span>
                </li>
                <li className='flex gap-2 items-center'>
                    <BsCheckCircle className='text-[#34A853]'/>
                    <span>Dedicated Account Management</span>
                </li>
                <li className='flex gap-2 items-center'>
                    <BsCheckCircle className='text-[#34A853]'/>
                    <span>Team Collaboration tools</span>
                </li>
                <li className='flex gap-2 items-center'>
                    <BsCheckCircle className='text-[#34A853]'/>
                    <span>Business Payment Solutions</span>
                </li>
            </ul>
            <button 
                className='text-lg font-medium px-7 py-3 hover:bg-[#43be63] transition-all bg-[#34A853] text-white rounded-md'
                type='button'
                onClick={handleClick}

            >
                JOIN WORKPLACE
            </button>
        </div>
        <div className='relative h-[512px] w-2/3'  data-aos='fade-left'>
            <Image src='/images/business.webp' alt='business' fill />
        </div>
    </div>
  )
}

export default Business