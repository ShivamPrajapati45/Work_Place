'use client'
import { useStateProvider } from '@/context/StateContext';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import Logo from './Logo';
import {IoSearchOutline} from 'react-icons/io5'
import {useCookies} from 'react-cookie'
import axios from 'axios';
import { GET_USER_INFO, HOST, LOGOUT_ROUTES } from '@/utils/constant';
import { reducerCases } from '@/context/constants';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {Sheet,SheetClose,SheetContent,SheetDescription,SheetFooter,SheetHeader,SheetTitle,SheetTrigger} from '@/components/ui/sheet'
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';

const Navbar = () => {

    const [isLoaded, setIsLoaded] = useState(false);
    const [isFixed, setIsFixed] = useState(false);
    const [searchData, setSearchData] = useState("");
    const [{ userInfo,isSeller }, dispatch] = useStateProvider();
    const router = useRouter();
    const [cookies] = useCookies();
    const pathName = usePathname();
    const [showInput, setShowInput] = useState(false);
    const [edit, setEdit] = useState(true);
    const [data, setData] = useState({
        fullName: userInfo ? userInfo.fullName : '',
        userName: userInfo ? userInfo.username : '',
        email: userInfo ? userInfo.email : '',
        description: userInfo ? userInfo.description : ''
    });

    const handleValueChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }
    console.log('user', userInfo)

    useEffect(() => {
        if(pathName === '/'){
            console.log('in')
            const positionNavbar = () => {
                window.pageYOffset > 0 ? setIsFixed(true) : setIsFixed(false);
                window.pageYOffset > 300 ? setShowInput(true) : setShowInput(false);
            };
            window.addEventListener('scroll', positionNavbar);
            return () => window.removeEventListener('scroll',positionNavbar);
        }else{
            setIsFixed(true)
        }
    },[router,pathName]);

    const handleSignUp = () => {
            dispatch({
                type: reducerCases.TOGGLE_LOGIN_MODEL,
                showLogInModel: false
            });
            dispatch({
                type: reducerCases.TOGGLE_SIGNUP_MODEL,
                showSignUpModel: true
            });
            router.push('/login');
    };
    const handleLogin = () => {
            dispatch({
                type: reducerCases.TOGGLE_SIGNUP_MODEL,
                showSignUpModel: false
            });
            dispatch({
                type: reducerCases.TOGGLE_LOGIN_MODEL,
                showLogInModel: true
            });
            router.push('/login');
    };
    const handleClickToGigs = () => {
        router.push('/gigs')
    }

    const links = [
        { linkName: "Explore", handler: handleClickToGigs,type: 'link' },
        { linkName: "Sign In", handler: handleLogin,type: 'button' },
        { linkName: "Join ", handler: handleSignUp,type: 'button2' },
    ];

    useEffect(() => {
        // if token rahega and userinfo nahi hoga tab jake ye call hoga
        // console.log('token',cookies.token,userInfo);

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
            router.push('/buyer/orders');
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

    const logout = async () => {
        try{
            const res = await axios.post(LOGOUT_ROUTES,{},{withCredentials: true});
            if(res.data.success){
                dispatch({
                    type: reducerCases.SET_USER,
                    userInfo: undefined
                });
                router.push('/');
            }

        }catch(err){
            console.log(err);
        }
    }

    return (
        <>
            {
                isLoaded && (
                    <nav className={`flex w-screen px-24 justify-between h-14 items-center py-6 top-0 z-30 transition-all duration-300
                        ${isFixed || userInfo ? 'fixed bg-white border-b border-gray-200' : 'absolute  bg-transparent border-transparent'}`}>
                            <div className=''>
                                <Link href={'/'}>
                                    <Logo fillColor={!isFixed && userInfo ? '#fff' : '#404145'} />
                                </Link>
                            </div>
                            <div className={`flex ${showInput ? 'opacity-100' : 'opacity-0'}`}>
                                <input 
                                    type="text" 
                                    className='w-[20rem] text-black py-2 px-4 border'
                                    placeholder='search services are you looking for ?'
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
                                    <IoSearchOutline className='fill-white text-2xl  text-white ' />
                                </button>
                            </div>
                            {
                                !userInfo ? (
                                    <ul className='flex gap-4 items-center'>
                                        {links.map(({ linkName,handler,type }) => {
                                            return(
                                                <li
                                                    key={linkName}
                                                    className={`${isFixed ? 'text-base' : 'text-white'} font-medium `}
                                                >
                                                    {type === 'link' && <button 
                                                        className='py-[5px] px-2 rounded-md hover:bg-black/10 transition-all'
                                                        onClick={handleClickToGigs}
                                                    >
                                                        {linkName}
                                                    </button>}
                                                    {type === 'button' && (
                                                        <button 
                                                            className='py-[5px] px-2 rounded-md hover:bg-black/10 transition-all'
                                                            onClick={handler}
                                                        >
                                                            {linkName}
                                                        </button>
                                                    )}
                                                    {type === 'button2' && (
                                                        <button
                                                            onClick={handler}
                                                            className={`border uppercase text-lg font-semibold py-[2px] px-4 rounded-sm ${ isFixed ? 'bg-[#34A853] outline-none border-none text-white' : 'border-white text-white'} hover:bg-[#66ba7d] hover:text-white transition-all duration-500`}
                                                        >
                                                            {linkName}
                                                        </button>
                                                    )}
                                                </li>
                                            )
                                        })}
                                    </ul>
                                ) : (
                                    <ul className='flex gap-4 items-center' >
                                        {
                                            isSeller && (
                                                <li
                                                    className='py-[5px] cursor-pointer px-2 rounded-md hover:bg-black/10 transition-all'
                                                    onClick={() => router.push('/seller/gigs/create')}
                                                >
                                                    Create Gig
                                                </li>
                                            )
                                        }
                                        <li
                                            className='py-[5px] px-2 cursor-pointer rounded-md hover:bg-black/10 transition-all'
                                            onClick={handleOrdersNavigate}
                                        >
                                            Orders
                                        </li>
                                        <li
                                            className='py-[5px] px-2 cursor-pointer rounded-md hover:bg-black/10 transition-all'
                                            onClick={handleModeSwitch}
                                        >
                                                Switch to {isSeller ? 'Buyer' : 'Seller'}
                                        </li>
                                        <li
                                            className='py-[5px] px-2 rounded-md hover:bg-black/10 transition-all'

                                        >
                                            <button
                                                onClick={logout}
                                                className=''
                                            >
                                                Logout
                                            </button>
                                        </li>
                                        <li
                                            className='cursor-pointer'
                                            onClick={(e) => {
                                                e.stopPropagation();
                                            }}
                                            title='profile'
                                        >
                                            <Sheet>
                                                <SheetTrigger asChild>
                                                    {
                                                        userInfo?.isProfileInfoSet ? (
                                                            <Image
                                                                src={userInfo?.imageName}
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
                                                </SheetTrigger>
                                                <SheetContent>
                                                    <SheetHeader>
                                                        <SheetTitle>Edit Profile</SheetTitle>
                                                        <SheetDescription>
                                                            Make changes to your profile here. Click save when you're done.
                                                        </SheetDescription>
                                                    </SheetHeader>
                                                        
                                                    <div className="grid gap-4 py-4">
                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                            <Label htmlFor="fullName" className="text-right">
                                                                Name
                                                            </Label>
                                                            <Input disabled={edit} id="fullName" value={data.fullName} className="col-span-3" />
                                                        </div>
                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                            <Label htmlFor="username" className="text-right">
                                                                Username
                                                            </Label>
                                                            <Input disabled={edit} id="username" value={data.userName} className="col-span-3" />
                                                        </div>
                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                            <Label htmlFor="email" className="text-right">
                                                                Email
                                                            </Label>
                                                            <Input disabled={edit} id="email" value={data.email} className="col-span-3" />
                                                        </div>
                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                            <Label htmlFor="description" className="text-right">
                                                                Description
                                                            </Label>
                                                            <Input disabled={edit} id="description" value={data.description} className="col-span-3" />
                                                        </div>
                                                    </div>
                                                    <SheetFooter>
                                                        <SheetClose asChild>
                                                            <Button type='submit' className='font-semibold uppercase'>Save Changes</Button>
                                                        </SheetClose>
                                                        <button 
                                                            type='button' 
                                                            className='border-blue-600 hover:bg-gray-50 border-2 text-blue-600 px-5 transition-all py-1 rounded-md font-semibold' 
                                                            onClick={() => setEdit(!edit)}
                                                        >
                                                            EDIT
                                                        </button>
                                                    </SheetFooter>
                                                </SheetContent>
                                            </Sheet>
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