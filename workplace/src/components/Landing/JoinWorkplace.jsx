import React, { useEffect } from 'react'
import Aos from 'aos';
import { useStateProvider } from '@/context/StateContext';
import { reducerCases } from '@/context/constants';
import { useRouter } from 'next/navigation';

const JoinWorkplace = () => {
    const [{ showLogInModel,showSignUpModel }, dispatch] = useStateProvider();
    const router = useRouter();
    useEffect(() => {
        Aos.init({ duration: 1200, once:false }); // Initialize AOS
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
        router.push('/login');
    }

    return (
        <div className='relative bg-gray-200 text-white py-14 px-10 md:px-20'>
            <h2
                className='text-3xl text-[#212121] font-extrabold text-center mb-16'
                data-aos='zoom-in'
            >
                Transform Your Ideas Into Reality
            </h2>
        <div className='grid md:grid-cols-3 gap-12'>
            {/* Step 1 */}
            <div
                className='group relative flex flex-col items-center text-center bg-white text-gray-900 p-8 shadow-lg rounded-xl transition-transform duration-300 hover:scale-105 hover:shadow-2xl'
                data-aos='fade-up'
                data-aos-delay='200'
            >
                <div className='absolute -top-8 bg-gradient-to-r from-purple-400 to-purple-600 w-14 h-14 flex items-center justify-center rounded-full shadow-lg group-hover:-top-12 duration-500 transition-all'>
                    <span className='text-white text-xl font-bold'>1</span>
                </div>
                <div className='overflow-hidden rounded-lg mb-4'>
                    <img
                        src='/images/signup.jpg'
                        alt='Sign Up'
                        className='transition-transform duration-500'
                    />
                    </div>
                <h3 className='text-xl text-[#212121] font-semibold mb-2 group-hover:text-primary_text transition-colors duration-300'>
                    Join
                </h3>
                <p className='text-gray-700  transition-colors duration-3003'>
                    Create your profile and take the first step towards your goals.
                </p>
            </div>

            {/* Step 2 */}
            <div
                className='group relative flex flex-col items-center text-center bg-white text-gray-900 p-8 shadow-lg rounded-xl transition-transform duration-300 hover:scale-105 hover:shadow-2xl'
                data-aos='fade-up'
                data-aos-delay='200'
            >
                <div className='absolute -top-8 bg-gradient-to-r from-purple-400 to-purple-600 w-14 h-14 flex items-center justify-center rounded-full shadow-lg group-hover:-top-12 duration-500 transition-all'>
                    <span className='text-white text-xl font-bold'>2</span>
                </div>
                <div className='overflow-hidden rounded-lg mb-4'>
                    <img
                        src='/images/rb_508.png'
                        alt='Post a Job'
                        className='transition-transform duration-500'
                    />
                </div>
                <h3 className='text-xl text-[#212121] font-semibold mb-2 group-hover:text-primary_text transition-colors duration-300'>
                    Post Your Service
                </h3>
                <p className='text-gray-700  transition-colors duration-300'>
                    Share your skills and connect with top professionals.
                </p>
            </div>

            {/* Step 3 */}
            <div
                className='group relative flex flex-col items-center text-center bg-white text-gray-900 p-8 shadow-lg rounded-xl transition-transform duration-300 hover:scale-105 hover:shadow-2xl'
                data-aos='fade-up'
                data-aos-delay='200'
            >
                <div className='absolute -top-8 bg-gradient-to-r from-purple-400 to-purple-600 w-14 h-14 flex items-center justify-center rounded-full shadow-lg group-hover:-top-12 duration-500 transition-all'>
                    <span className='text-white text-xl font-bold'>3</span>
                </div>
                <div className='overflow-hidden rounded-lg mb-4'>
                    <img
                        src='/images/collab.png'
                        alt='Collaborate'
                        className=' transition-transform duration-500'
                    />
                </div>
                <h3 className='text-xl text-[#212121] font-semibold mb-2 group-hover:text-primary_text transition-colors duration-300'>
                    Collaborate & Grow
                </h3>
                <p className='text-gray-700 transition-colors duration-300'>
                    Build strong partnerships and achieve amazing results.
                </p>
            </div>
        </div>

        {/* Add a CTA Button */}
        <div className='text-center mt-12' data-aos='zoom-in'>
            <button
                onClick={handleClick}
                className="group bg-purple-500 hover:bg-purple-600 transition-all text-lg font-medium px-8 py-4 rounded-lg shadow-lg text-white relative overflow-hidden"
            >
                <span className="relative z-10">Get Started Now</span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out"></span>
            </button>
        </div>
    </div>
    )
    }

    export default JoinWorkplace