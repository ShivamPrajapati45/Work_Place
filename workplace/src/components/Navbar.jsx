'use client'
import { useStateProvider } from '@/context/StateContext';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import Logo from './Logo';
import {IoSearchOutline} from 'react-icons/io5'
import {useCookies} from 'react-cookie'
import axios from 'axios';
import { EDIT_USER_IMAGE, EDIT_USER_INFO, GET_USER_INFO, HOST, LOGOUT_ROUTES } from '@/utils/constant';
import { reducerCases } from '@/context/constants';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {Sheet,SheetClose,SheetContent,SheetDescription,SheetFooter,SheetHeader,SheetTitle,SheetTrigger} from '@/components/ui/sheet'
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
    const [image, setImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [error, setError] = useState('');
    const [imageHover, setImageHover] = useState(false);
    const [loader, setLoader] = useState(false);
    const [data, setData] = useState({
        fullName: '',
        username: '',
        email: '',
        description: ''
    });

    useEffect(() => {
        const handleData = {...data};
        if(userInfo){
            if(userInfo?.userName) handleData.username = userInfo.username;
            if(userInfo?.fullName) handleData.fullName = userInfo.fullName;
            if(userInfo?.description) handleData.description = userInfo.description;
            if(userInfo.email) handleData.email = userInfo.email;
        };
        setData(handleData);

    },[userInfo])

    console.log(userInfo)

    const handleValueChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if(file){
            const fileType = file.type;
            const validImageType = ['image/png', 'image/jpeg', 'image/jpg'];
            if(validImageType.includes(fileType)){
                const imageUrl = URL.createObjectURL(file);
                setImage(file);
                setPreviewImage(imageUrl)
            }else{
                console.error('Invalid Image Type !');
            }
        }else{
            console.error('No file Selected !');

        }
    }

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
            setLoader(true)
            const res = await axios.post(EDIT_USER_INFO,{...data},{withCredentials: true});
            console.log('res : ', res);
            if(res.data.userNameError){
                setError(res.data.msg);
            }else{
                setError('');
                if(image){
                    const formData = new FormData();
                    formData.append('profileImage', image);
                    const {data: {user}} = await axios.post(EDIT_USER_IMAGE, formData, {
                        withCredentials: true,
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                    console.log('user : ', user)
                    if(res.data.success){
                        setLoader(false);
                        dispatch({
                            type: reducerCases.SET_USER,
                            userInfo: {
                                ...userInfo,
                                ...user
                            }
                        });
                    }
                }
            }
            
        }catch(err){
            console.log("Edit : ", err);
        }finally{
            setLoader(false);
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
                                    <ul className='flex gap-4  items-center' >
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
                                                </SheetTrigger>
                                                <SheetContent>
                                                    <SheetHeader>
                                                        <SheetTitle>Edit Profile</SheetTitle>
                                                        <SheetDescription>
                                                            Make changes to your profile here. Click save when you're done.
                                                        </SheetDescription>
                                                    </SheetHeader>
                                                        
                                                    <div 
                                                        className='flex flex-col items-center'
                                                        
                                                    >
                                                        <label className='mb-2 text-lg font-medium text-slate-800 dark:text-white'>Select a profile picture</label>
                                                        <div 
                                                            className='h-20 w-20 cursor-pointer flex items-center justify-center rounded-full relative'
                                                            onMouseEnter={() => setImageHover(true)}
                                                            onMouseLeave={() => setImageHover(false)}
                                                        >
                                                            {
                                                                previewImage ?  (
                                                                    <img
                                                                        src={previewImage}
                                                                        alt='Profile'
                                                                        className='rounded-full h-full w-full object-contain'
                                                                    />
                                                                ) : (
                                                                    <img
                                                                        src={`${userInfo?.profileImage ? userInfo.profileImage : '/images/avatar.png'}`}
                                                                        alt='Profile'
                                                                        className='rounded-full h-full w-full object-contain'
                                                                    />
                                                                )
                                                            }
                                                            <div className={`absolute bg-slate-400 h-20 w-20 rounded-full flex items-center justify-center transition-all duration-500 ${imageHover ? 'opacity-100' : 'opacity-0'}`}>
                                                                <span className={'flex items-center justify-center relative cursor-pointer'}>
                                                                    <svg
                                                                        xmlns='http://www.w1.org/2000/svg'
                                                                        className='w-12 h-12 text-white absolute cursor-pointer'
                                                                        fill='currentColor'
                                                                        viewBox='0 0 20 20'
                                                                    >
                                                                        <path
                                                                            fillRule='evenodd'
                                                                            clipRule='evenodd'
                                                                            d='M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z'
                                                                        />
                                                                    </svg>
                                                                    <input 
                                                                        type="file" 
                                                                        onChange={handleFileChange}
                                                                        className='opacity-0 cursor-pointer'
                                                                        name='profileImage'
                                                                        multiple={true}
                                                                    />
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="grid gap-4 py-4">
                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                            <label htmlFor="fullName" className="text-right font-semibold">
                                                                Name
                                                            </label>
                                                            <input 
                                                                disabled={edit} 
                                                                id="fullName" 
                                                                name='fullName'
                                                                value={data.fullName}
                                                                onChange={handleValueChange}
                                                                className="text-black col-span-3 px-3 py-1 rounded-lg border-[1.5px] border-slate-400" 
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                            <label htmlFor="username" className="text-right font-semibold">
                                                                Username
                                                            </label>
                                                            <input 
                                                                disabled={edit} 
                                                                id="username" 
                                                                name='username'
                                                                value={data.username} 
                                                                onChange={handleValueChange}
                                                                className="text-black col-span-3 px-3 py-1 rounded-lg border-[1.5px] border-slate-400" 
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                            <label htmlFor="email" className="text-right font-semibold">
                                                                Email
                                                            </label>
                                                            <input 
                                                                disabled={edit} 
                                                                id="email" 
                                                                name='email'
                                                                value={data.email}
                                                                onChange={handleValueChange} 
                                                                className="text-black col-span-3 px-3 py-1 rounded-lg border-[1.5px] border-slate-400" 
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-4 items-center gap-4">
                                                            <label htmlFor="description" className="text-right font-semibold">
                                                                Description
                                                            </label>
                                                            <input 
                                                                disabled={edit} 
                                                                id="description" 
                                                                name='description'
                                                                value={data.description} 
                                                                onChange={handleValueChange}
                                                                className="text-black col-span-3 px-3 py-1 rounded-lg border-[1.5px] border-slate-400" 
                                                            />
                                                        </div>
                                                    </div>
                                                    <SheetFooter>
                                                        <SheetClose asChild>
                                                            <Button 
                                                                type='submit' 
                                                                className='font-semibold uppercase'
                                                                onClick={handleEditProfile}
                                                            >Save Changes</Button>
                                                        </SheetClose>
                                                        <button 
                                                            type='button' 
                                                            className='border-blue-600 hover:bg-gray-50 border-2 text-blue-600 px-5 transition-all py-1 rounded-md font-semibold' 
                                                            onClick={() => setEdit(!edit)}
                                                        >
                                                            EDIT
                                                        </button>
                                                        <SheetClose asChild>
                                                            <Button
                                                                type='button'
                                                                onClick={logout}
                                                                >
                                                                Logout
                                                            </Button>
                                                        </SheetClose>
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