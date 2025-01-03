import React, { useEffect } from 'react'
import Image from 'next/image'
import Aos from 'aos';
import { useStateProvider } from '@/context/StateContext';
import { reducerCases } from '@/context/constants';

const JoinWorkplace = () => {
    const [{ showLogInModel,showSignUpModel }, dispatch] = useStateProvider();
    useEffect(() => {
        Aos.init({ duration: 1200, once:true }); // Initialize AOS
    }, []);

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
        <div className='relative bg-gray-200 text-white py-14 px-10 md:px-20'>
            <h2
                className='text-4xl text-[#212121] font-extrabold text-center mb-16'
                data-aos='zoom-in'
            >
                Transform Your Ideas Into Reality
            </h2>
        <div className='grid md:grid-cols-3 gap-12'>
            {/* Step 1 */}
            <div
                className='group relative flex flex-col items-center text-center bg-white text-gray-900 p-8 shadow-lg rounded-xl'
                data-aos='fade-up'
            >
                <div className='absolute -top-10 bg-gradient-to-r from-green-400 to-green-600 w-16 h-16 flex items-center justify-center rounded-full shadow-lg'>
                    <span className='text-white text-2xl font-bold'>1</span>
                </div>
                <Image
                    src='/images/signup.jpg'
                    alt='Sign Up'
                    width={250}
                    height={160}
                    className='rounded-lg mb-4'
                />
                <h3 className='text-2xl text-[#212121] font-semibold mb-2'>
                    Join
                </h3>
                <p className='text-gray-700'>
                    Create your profile and take the first step towards your goals.
                </p>
            </div>

            {/* Step 2 */}
            <div
                className='group relative flex flex-col items-center text-center bg-white text-gray-900 p-8 shadow-lg rounded-xl'
                data-aos='fade-up'
                data-aos-delay='200'
            >
                <div className='absolute -top-10 bg-gradient-to-r from-green-400 to-green-600 w-16 h-16 flex items-center justify-center rounded-full shadow-lg'>
                    <span className='text-white text-2xl font-bold'>2</span>
                </div>
                <Image
                    src='/images/rb_508.png'
                    alt='Post a Job'
                    width={250}
                    height={160}
                    className='rounded-lg mb-4'
                />
                <h3 className='text-2xl text-[#212121] font-semibold mb-2'>
                    Post Your Job
                </h3>
                <p className='text-gray-700'>
                    Share your requirements and connect with top professionals.
                </p>
            </div>

            {/* Step 3 */}
            <div
                className='group relative flex flex-col items-center text-center bg-white text-gray-900 p-8 shadow-lg rounded-xl'
                data-aos='fade-up'
                data-aos-delay='400'
            >
                <div className='absolute -top-10 bg-gradient-to-r from-green-400 to-green-600 w-16 h-16 flex items-center justify-center rounded-full shadow-lg'>
                    <span className='text-white text-2xl font-bold'>3</span>
                </div>
                <Image
                    src='/images/collab.png'
                    alt='Collaborate'
                    width={250}
                    height={160}
                    className='rounded-lg mb-4'
                />
                <h3 className='text-2xl text-[#212121] font-semibold mb-2'>
                    Collaborate & Grow
                </h3>
                <p className='text-gray-700'>
                    Build strong partnerships and achieve amazing results.
                </p>
            </div>
        </div>

        {/* Add a CTA Button */}
        <div className='text-center mt-12' data-aos='zoom-in'>
            <button
                onClick={handleClick}
                className="group bg-green-500 hover:bg-green-600 transition-all text-lg font-medium px-8 py-4 rounded-lg shadow-lg text-white relative overflow-hidden"
            >
                <span className="relative z-10">Get Started Now</span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out"></span>
            </button>
        </div>
    </div>
    )
    }

    export default JoinWorkplace