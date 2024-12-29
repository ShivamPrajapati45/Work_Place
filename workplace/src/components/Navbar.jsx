'use client'
import { useStateProvider } from '@/context/StateContext';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import Logo from './Logo';
import {IoSearchOutline} from 'react-icons/io5'
import {useCookies} from 'react-cookie'
import axios from 'axios';
import { GET_USER_INFO, HOST } from '@/utils/constant';
import { reducerCases } from '@/context/constants';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const Navbar = () => {

    const [isLoaded, setIsLoaded] = useState(false);
    const [isFixed, setIsFixed] = useState(false);
    const [searchData, setSearchData] = useState("");
    const [{ showLogInModel,showSignUpModel,userInfo,isSeller }, dispatch] = useStateProvider();
    const router = useRouter();
    const [cookies] = useCookies();
    const pathName = usePathname();

    useEffect(() => {
        if(pathName === '/'){
            console.log('in')
            const positionNavbar = () => {
                window.pageYOffset > 0 ? setIsFixed(true) : setIsFixed(false);
            };
            window.addEventListener('scroll', positionNavbar);
            return () => window.removeEventListener('scroll',positionNavbar);
        }else{
            setIsFixed(true)
        }
    },[router,pathName]);

    const handleSignUp = () => {
        console.log('hello');
        // if(showLogInModel){
            dispatch({
                type: reducerCases.TOGGLE_LOGIN_MODEL,
                showLogInModel: false
            });
            dispatch({
                type: reducerCases.TOGGLE_SIGNUP_MODEL,
                showSignUpModel: true
            });
        // }
    };
    const handleLogin = () => {
        console.log('hello')
        // if(showSignUpModel){
            dispatch({
                type: reducerCases.TOGGLE_SIGNUP_MODEL,
                showSignUpModel: false
            });
            dispatch({
                type: reducerCases.TOGGLE_LOGIN_MODEL,
                showLogInModel: true
            });
        // }
    };

    const links = [
        { linkName: "Workplace Business", handler: '#',type: 'link' },
        { linkName: "Explore", handler: '#',type: 'link' },
        { linkName: "English", handler: '#',type: 'link' },
        { linkName: "Become a Seller", handler: '#',type: 'link' },
        { linkName: "Sign In", handler: handleLogin,type: 'button' },
        { linkName: "Join ", handler: handleSignUp,type: 'button2' },
    ];

    useEffect(() => {
        // if token rahega and userinfo nahi hoga tab jake ye call hoga
        console.log('token',cookies.token,userInfo);

        if(cookies.token && !userInfo){
            const getUserInfo = async () => {
                try {
                    const {data: {user}} = await axios.post(GET_USER_INFO,{},{withCredentials:true});
                    let projectedUserInfo = {...user};
                    if(user?.profileImage){
                        projectedUserInfo = {
                            ...projectedUserInfo,
                            imageName: HOST + '/' + user.profileImage,
                        }
                    }

                    delete projectedUserInfo.image;
                    dispatch({
                        type: reducerCases.SET_USER,
                        userInfo: projectedUserInfo
                    });
                    setIsLoaded(true);
                    if(user?.isProfileInfoSet === false){
                        router.push('/profile');
                    }

                } catch (error) {
                    console.log("GetUserInfo: ",error)
                }
            };
            getUserInfo();
        }else{
            setIsLoaded(true)
        }
        // console.log(2)
    },[cookies,userInfo]);

    // this method check if user is seller or buyer if seller then navigate to order
    const handleOrdersNavigate = () => {
        if(isSeller) router.push('/seller/orders')
            router.push('/buyer/orders')
    };

    const handleModeSwitch = () => {
        if(isSeller){
            dispatch({type: reducerCases.SWITCH_MODE});
            router.push('/buyer/orders');
        }else{
            dispatch({type: reducerCases.SWITCH_MODE});
            router.push('/seller');
        }
    }

    return (
        <>
            {
                isLoaded && (
                    <nav className={`w-full flex px-24 justify-between h-10 items-center py-6 top-0 z-30 transition-all duration-300
                        ${isFixed || userInfo ? 'fixed bg-white border-b border-gray-200' : 'absolute  bg-transparent border-transparent'}`}>
                            <div className=''>
                                <Link href={'/'}>
                                    <Logo fillColor={!isFixed && userInfo ? '#fff' : '#404145'} />
                                </Link>
                            </div>
                            <div className={`flex ${isFixed || userInfo ? 'opacity-100' : 'opacity-0'}`}>
                                <input 
                                    type="text" 
                                    className='w-[30rem] text-black py-2 px-4 border'
                                    placeholder='search service'
                                    value={searchData}
                                    onChange={(e) => setSearchData(e.target.value)}
                                />
                                <button 
                                    className='bg-gray-900 py-1 text-white w-16 flex justify-center items-center'
                                    onClick={() => {
                                        setSearchData("");
                                        router.push(`/search?q=${searchData}`)
                                    }}
                                >
                                    <IoSearchOutline className='fill-white text-white ' />
                                </button>
                            </div>
                            {
                                !userInfo ? (
                                    <ul className='flex gap-10 text-black items-center'>
                                        {links.map(({ linkName,handler,type }) => {
                                            return(
                                                <li
                                                    key={linkName}
                                                    className={`${isFixed ? 'text-base' : 'text-white'} font-medium`}
                                                >
                                                    {type === 'link' && <Link href={handler} >
                                                        {linkName}
                                                    </Link>}
                                                    {type === 'button' && (
                                                        <button 
                                                            onClick={handler}
                                                        >
                                                            {linkName}
                                                        </button>
                                                    )}
                                                    {type === 'button2' && (
                                                        <button
                                                            onClick={handler}
                                                            className={`border text-lg font-semibold py-1 px-3 rounded-sm ${ isFixed ? 'border-[#1dbf73] text-green-300' : 'border-white text-white'} hover:bg-green-300 hover:text-white transition-all duration-500`}
                                                        >
                                                            {linkName}
                                                        </button>
                                                    )}
                                                </li>
                                            )
                                        })}
                                    </ul>
                                ) : (
                                    <ul className='flex gap-10 items-center' >
                                        {
                                            isSeller && (
                                                <li
                                                    className='cursor-pointer font-medium text-green-400'
                                                    onClick={() => router.push('/seller/gigs/create')}
                                                >
                                                    Create Gig
                                                </li>
                                            )
                                        }
                                        <li
                                            className='cursor-pointer font-medium text-green-400'
                                            onClick={handleOrdersNavigate}
                                        >
                                            Orders
                                        </li>
                                        <li
                                            className='cursor-pointer font-medium'
                                            onClick={handleModeSwitch}
                                        >
                                                Switch to {isSeller ? 'Buyer' : 'Seller'}
                                        </li>
                                        <li
                                            className='cursor-pointer'
                                            onClick={(e) => {
                                                e.stopPropagation();
                                            }}
                                            title='profile'
                                        >
                                            {
                                                userInfo?.profileImage ? (
                                                    <Image
                                                        src={userInfo?.profileImage}
                                                        alt='Profile'
                                                        width={40}
                                                        height={40}
                                                        className='rounded-full'
                                                        unoptimized
                                                        
                                                    />
                                                ) : (
                                                    <div className='bg-purple-500 flex items-center justify-center h-10 w-10 rounded-full relative'>
                                                        <span className='text-xl text-white'>
                                                            {userInfo?.email[0].toUpperCase()}
                                                        </span>
                                                    </div>
                                                )
                                            }
                                        </li>
                                    </ul>
                                )
                            }
                        </nav>
                )
            }
        </>
    )
}

export default Navbar