'use client'
import { useStateProvider } from '@/context/StateContext';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import Logo from './Logo';
import {IoMenuOutline, IoNotificationsOutline, IoSearchOutline} from 'react-icons/io5'
import {useCookies} from 'react-cookie'
import axios from 'axios';
import { EDIT_USER_IMAGE, EDIT_USER_INFO, GET_NOTIFICATIONS, GET_USER_INFO, HOST, LOGOUT_ROUTES } from '@/utils/constant';
import { reducerCases } from '@/context/constants';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import EditProfile from './EditProfile';

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
    const [image, setImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [imageHover, setImageHover] = useState(false);
    const [change, setChange] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showMenu, setShowMenu] = useState(false);

    const [data, setData] = useState({
        fullName: '',
        username: '',
        email: '',
        description: ''
    });

    // Fetching UnreadCount
    useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                const {data} = await axios.get(GET_NOTIFICATIONS,{withCredentials: true});
                if(data.success){
                    setUnreadCount(data.notifications);
                }
                
            } catch (error) {
                console.log(error)
            }
        };
        if(userInfo) fetchUnreadCount();
    },[userInfo]);
    console.log('Count: ',unreadCount)

    useEffect(() => {
        const handleData = {...data};
        if(userInfo){
            if(userInfo?.username) handleData.username = userInfo.username;
            if(userInfo?.fullName) handleData.fullName = userInfo.fullName;
            if(userInfo?.description) handleData.description = userInfo.description;
            if(userInfo.email) handleData.email = userInfo.email;
        };
        setData(handleData);

    },[userInfo]);


    // console.log(userInfo)

    const handleValueChange = (e) => {
        const {name, value} = e.target;
        setData((prevData) => {
            const updatedData = {...prevData, [name]: value};

            const hasChange = Object.keys(updatedData).some(
                (key) => updatedData[key] !== userInfo[key]
            );

            setChange(hasChange);
            return updatedData;

        })
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if(file){
            const fileType = file.type;
            const validImageType = ['image/png', 'image/jpeg', 'image/jpg'];
            if(validImageType.includes(fileType)){
                const imageUrl = URL.createObjectURL(file);
                setImage(file);
                setPreviewImage(imageUrl)
                setChange(true)
            }else{
                console.error('Invalid Image Type !');
            }
        }else{
            console.error('No file Selected !');

        }
    }

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
                type: reducerCases.TOGGLE_SIGNUP_MODEL,
                showSignUpModel: true
            });
            router.push('/login');
    };
    const handleLogin = () => {
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
        { linkName: "Sign In", handler: handleLogin,type: 'login' },
        { linkName: "Join ", handler: handleSignUp,type: 'signup' },
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
        if(isSeller){
            router.push('/seller/orders')
        }else{
            router.push('/buyer/orders');
        }
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

    const handleEditProfile = async () => {
        try{
            // object with only updated value
            const updatedFields = {};
            Object.keys(data).forEach((key) => {
                if(data[key] !== userInfo[key]){
                    updatedFields[key] = data[key];
                }
            });

            const shouldUpdateField = Object.keys(updatedFields).length > 0;
            const shouldUpdateImage = !!image;

            if(shouldUpdateField){
                const res = await axios.post(EDIT_USER_INFO,updatedFields,{withCredentials: true});
                if(res.data.success){
                    dispatch({
                        type: reducerCases.SET_USER,
                        userInfo: {
                            ...userInfo,
                            ...res.data.user
                        }
                    })
                    setChange(false);
                }
            }
            
            if(shouldUpdateImage){
                    const formData = new FormData();
                    formData.append('profileImage', image);
                    const {data: {user}} = await axios.post(EDIT_USER_IMAGE, formData, {
                        withCredentials: true,
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                        dispatch({
                            type: reducerCases.SET_USER,
                            userInfo: {
                                ...userInfo,
                                ...user
                            }
                        });
                        setImage(null);
                        setChange(false);
            }
            
        }catch(err){
            console.log("Edit : ", err);
        }
    }

    return (
        <>
            {
                isLoaded && (
                    <nav className={`flex w-full px-6 md:px-12 lg:px-24 justify-between items-center h-14 py-6 top-0 z-30 transition-all duration-300
                        ${isFixed || userInfo 
                        ? 'fixed bg-white border-b border-gray-200' 
                        : 'absolute bg-transparent border-transparent'}`}
                    >

                            <div className='flex-shrink-0'>
                                <Link href={'/'}>
                                    <Logo fillColor={!isFixed && userInfo ? '#fff' : '#404145'} />
                                </Link>
                            </div>

                            {/* Mobile Menu toggle */}
                            <div className='md:hidden'>
                                <button
                                    onClick={() => setShowMenu((e) => !e)}
                                    className='text-gray-700 hover:text-gray-900 focus:outline-none'
                                >
                                    <IoMenuOutline className='text-4xl'/>
                                </button>
                            </div>

                            {/* screen Input */}
                            <div 
                                className={`hidden md:flex items-center ${
                                    showInput ? 'opacity-100' : 'opacity-0'
                                }`}
                            >
                                <input 
                                    type="text" 
                                    className='w-full rounded-l-lg md:w-[20rem] text-black py-2 px-4 border-2'
                                    placeholder='search services are you looking for ?'
                                    value={searchData}
                                    onChange={(e) => setSearchData(e.target.value)}
                                />
                                <button 
                                    className='bg-gray-900 h-11 rounded-r-lg hover:bg-gray-800 text-white w-12 md:w-16 flex justify-center items-center'
                                    onClick={() => {
                                        setSearchData("");
                                        router.push(`/search?q=${searchData}`)
                                    }}
                                >
                                    <IoSearchOutline className='fill-white text-xl md:text-2xl text-white ' />
                                </button>
                            </div>

                            {/* User desktop section */}
                            <div className='hidden md:flex  items-center'>
                                {
                                    !userInfo ? (
                                        <ul className='flex gap-4 items-center text-sm md:text-base'>
                                            {links.map(({ linkName,handler,type }) => {
                                                return(
                                                    <li
                                                        key={linkName}
                                                        className={`${isFixed ? 'text-base' : 'text-black'} font-medium `}
                                                    >
                                                        {type === 'link' && <button 
                                                            className={`${pathName === '/gigs' ? 'text-blue-600' : ''}py-[5px] px-2 rounded-md hover:bg-black/5 transition-all`}
                                                            onClick={handleClickToGigs}
                                                        >
                                                            {linkName}
                                                        </button>}
                                                        {type === 'login' && (
                                                            <button 
                                                                className='py-[5px] px-2 rounded-md hover:bg-black/5 transition-all'
                                                                onClick={handler}
                                                            >
                                                                {linkName}
                                                            </button>
                                                        )}
                                                        {type === 'signup' && (
                                                            <button
                                                                onClick={handler}
                                                                className='uppercase text-sm md:text-lg font-semibold py-[2px] px-4 rounded-sm bg-[#34A853] hover:bg-[#66ba7d] text-white transition-all duration-500'
                                                            >
                                                                {linkName}
                                                            </button>
                                                        )}
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    ) : (
                                        <ul className='flex gap-4 items-center lg:gap-2 text-sm md:text-base'>
                                            {
                                                isSeller && (
                                                    <>
                                                        <li
                                                            className={`${pathName === '/seller/gigs/create' ? 'text-blue-600' : ''} py-[5px] cursor-pointer px-2 rounded-md hover:bg-black/5 transition-all`}
                                                            onClick={() => router.push('/seller/gigs/create')}
                                                        >
                                                            Create Gig
                                                        </li>
                                                        <li
                                                            className={`${pathName === '/seller' ? 'text-blue-600' : ''} py-[5px] cursor-pointer px-2 rounded-md hover:bg-black/5 transition-all`}
                                                            onClick={() => router.push('/seller')}
                                                        >
                                                            Dashboard
                                                        </li>
                                                    </>
                                                )
                                            }
                                            <li
                                                className={`${pathName === '/seller/orders' || pathName === '/buyer/orders' ? 'text-blue-600' : ''} py-[5px] px-2 cursor-pointer rounded-md hover:bg-black/5 transition-all`}
                                                onClick={handleOrdersNavigate}
                                            >
                                                Orders
                                            </li>
                                            <li
                                                className={`${pathName == '/gigs' ? 'text-blue-600' : ''} py-[5px] px-2 cursor-pointer rounded-md hover:bg-black/5 transition-all`}
                                                onClick={handleClickToGigs}
                                            >
                                                Explore
                                            </li>
                                            <li
                                                className={`py-[5px] px-2 cursor-pointer rounded-md hover:bg-black/5 transition-all`}
                                                onClick={handleModeSwitch}
                                            >
                                                    Switch to {isSeller ? 'Buyer' : 'Seller'}
                                            </li>
                                            <li className='relative'>
                                                <button
                                                    onClick={() => router.push("/seller/notifications")}
                                                >
                                                    <IoNotificationsOutline className='text-2xl' />
                                                    {unreadCount > 0 && (
                                                        <span className='absolute top-0 right-0 text-xs bg-red-500 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center'>
                                                            {unreadCount}
                                                        </span>
                                                    )}
                                                </button>
                                            </li>
                                            <li
                                                className='cursor-pointer'
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                }}
                                                title='profile'
                                            >
                                                <EditProfile
                                                    change={change}
                                                    data={data}
                                                    edit={edit}
                                                    handleEditProfile={handleEditProfile}
                                                    handleFileChange={handleFileChange}
                                                    handleValueChange={handleValueChange}
                                                    imageHover={imageHover}
                                                    logout={logout}
                                                    previewImage={previewImage}
                                                    setEdit={setEdit}
                                                    setImageHover={setImageHover}
                                                    userInfo={userInfo}

                                                />
                                            </li>
                                        </ul>
                                    )
                                }
                            </div>

                            {/* Mobile Navbar */}
                            {showMenu && (
                                <div className='absolute flex justify-center items-center top-14 left-0 w-full bg-white shadow-lg md:hidden transition-all duration-500 ease-in-out'>
                                    <div className='space-y-2 p-4'>
                                    {
                                    !userInfo ? (
                                        <ul className='flex gap-10 border border-black items-center md:text-base'>
                                            {links.map(({ linkName,handler,type }) => {
                                                return(
                                                    <li
                                                        key={linkName}
                                                        className={`${isFixed ? 'text-base' : 'text-white'} font-medium `}
                                                    >
                                                        {type === 'link' && <button 
                                                            className={`${pathName === '/gigs' ? 'text-blue-600' : ''}py-[5px] px-2 rounded-md hover:bg-black/10 transition-all`}
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
                                                                className={`border uppercase text-sm md:text-lg font-semibold py-[2px] px-4 rounded-sm ${ isFixed ? 'bg-[#34A853] outline-none border-none text-white' : 'border-white text-white'} hover:bg-[#66ba7d] hover:text-white transition-all duration-500`}
                                                            >
                                                                {linkName}
                                                            </button>
                                                        )}
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    ) : (
                                        <ul className='flex gap-6 items-center text-base font-semibold md:text-base'>
                                            {
                                                isSeller && (
                                                    <>
                                                        <li
                                                            className={`${pathName === '/seller/gigs/create' ? 'text-blue-600' : ''} py-[5px] cursor-pointer px-2 rounded-md hover:bg-black/5 transition-all`}
                                                            onClick={() => router.push('/seller/gigs/create')}
                                                        >
                                                            Create Gig
                                                        </li>
                                                        <li
                                                            className={`${pathName === '/seller' ? 'text-blue-600' : ''} py-[5px] cursor-pointer px-2 rounded-md hover:bg-black/5 transition-all`}
                                                            onClick={() => router.push('/seller')}
                                                        >
                                                            Dashboard
                                                        </li>
                                                    </>
                                                )
                                            }
                                            <li
                                                className={`${pathName === '/seller/orders' || pathName === '/buyer/orders' ? 'text-blue-600' : ''} py-[5px] px-2 cursor-pointer rounded-md hover:bg-black/5 transition-all`}
                                                onClick={handleOrdersNavigate}
                                            >
                                                Orders
                                            </li>
                                            <li
                                                className={`${pathName == '/gigs' ? 'text-blue-600' : ''} py-[5px] px-2 cursor-pointer rounded-md hover:bg-black/5 transition-all`}
                                                onClick={handleClickToGigs}
                                            >
                                                Explore
                                            </li>
                                            <li
                                                className={`py-[5px] px-2 cursor-pointer rounded-md hover:bg-black/5 transition-all`}
                                                onClick={handleModeSwitch}
                                            >
                                                    Switch to {isSeller ? 'Buyer' : 'Seller'}
                                            </li>
                                            <li className='relative'>
                                                <button
                                                    onClick={() => router.push("/seller/notifications")}
                                                >
                                                    <IoNotificationsOutline className='text-2xl' />
                                                    {unreadCount > 0 && (
                                                        <span className='absolute top-0 right-0 text-xs bg-red-500 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center'>
                                                            {unreadCount}
                                                        </span>
                                                    )}
                                                </button>
                                            </li>
                                            <li
                                                className='cursor-pointer'
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                }}
                                                title='profile'
                                            >
                                                <EditProfile
                                                    userInfo={userInfo}
                                                    edit={edit}
                                                    setEdit={setEdit}
                                                    imageHover={imageHover}
                                                    setImageHover={setImageHover}
                                                    previewImage={previewImage}
                                                    handleFileChange={handleFileChange}
                                                    handleValueChange={handleValueChange}
                                                    data={data}
                                                    handleEditProfile={handleEditProfile}
                                                    logout={logout}
                                                    change={change}
                                                />
                                            </li>
                                        </ul>
                                    )
                                }
                                    </div>
                                </div>
                            )}
                        </nav>
                )
            }
        </>
    )
}

export default Navbar