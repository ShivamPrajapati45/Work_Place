'use client'
import { reducerCases } from '@/context/constants';
import { useStateProvider } from '@/context/StateContext';
import { HOST, SET_USER_IMAGE, SET_USER_INFO } from '@/utils/constant';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const page = () => {

    const router = useRouter();
    const [{userInfo},dispatch] = useStateProvider();
    const [isLoaded, setIsLoaded] = useState(true);
    const [imageHover, setImageHover] = useState(false);
    const [image, setImage] = useState(undefined);
    const [errorMsg, setErrorMsg] = useState("");
    const [data, setData] = useState({
        userName: '',
        fullName: '',
        description: ''
    });

    useEffect(() => {
        const handleData = {...data};
        if(userInfo){
            if(userInfo?.userName) handleData.userName = userInfo.userName;
            if(userInfo?.fullName) handleData.fullName = userInfo.fullName;
            if(userInfo?.description) handleData.description = userInfo.description;
        }

        if(userInfo?.imageName){
            const fileName = image;
            fetch(userInfo?.imageName).then(async (res) => {
                const contentType = res.headers.get('content-type');
                const blob = await res.blob();
                const files = new File([blob], fileName,{type: contentType});
                setImage(files);
            });
        }

        setData(handleData);
        setIsLoaded(true);
    },[userInfo]);

    const handleFileChange = (e) => {
        const file = e.target.files;
        if(file && file.length > 0){
            const fileType = file[0]['type'] || file[0].type;
            const validImageTypes = ['image/png', 'image/jpeg', 'image/jpg'];
            if (validImageTypes.includes(fileType)) {
                // const imageUrl = URL.createObjectURL(file[0]);
                setImage(file[0]);
            }else{
                console.error('Invalid File Type');
                
            }
        }else{
            console.error('No File Selected');
            
        }
    };

    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    };

    const setProfile = async () => {
        try {
            const res = await axios.post(SET_USER_INFO,{...data},{
                withCredentials: true
            });
            // console.log('res',res);
            
            if(res.data.userNameError){
                setErrorMsg(res.data.msg);
            }else{
                setErrorMsg("");
                // console.log('image',image);
                let imageName = '';
                if(image){
                    // console.log('image',image);
                    const formData = new FormData();
                    formData.append('profileImage', image);
                    const {data: { img }} = await axios.post(SET_USER_IMAGE,formData,{
                        withCredentials: true,
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                    imageName = img;
                }

                dispatch({
                    type: reducerCases.SET_USER,
                    userInfo: {
                        ...userInfo,
                        ...data,
                        image: imageName.length ? HOST + '/' + imageName : false,
                    },
                })
            }

        } catch (error) {
            console.log(error);
        }
    };

    const inputClassName = 'block p-4 w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500';
    const labelClassName = 'mb- text-lg font-medium text-gray-900 dark:text-white'
    // console.log(errorMsg);
    return (
        <>
                    {
                        isLoaded && (
                            <div className='border-2 border-red-400 flex flex-col items-center justify-start min-h-[80vh] gap-3'>
                                {
                                    errorMsg && (
                                        <div>
                                            <span className='text-red-500 font-bold'>{errorMsg}</span>
                                        </div>
                                    )
                                }
                                <h2 className='text-3xl'>Welcome</h2>
                                <h4 className='text-xl'>Please complete your profile to get started</h4>
                                <div className='flex flex-col items-center w-full gap-5'>
                                    <div 
                                        className='flex flex-col items-center cursor-pointer'
                                        onMouseEnter={() => setImageHover(true)}
                                        onMouseLeave={() =>
                                            setImageHover(false)}
                                    >
                                        <label className={labelClassName}>Select a profile picture</label>
                                        {/* <div className='bg-purple-500 h-36 w-36 flex items-center justify-center rounded-full relative'> */}
                                            {
                                                image && (
                                                    <Image
                                                        src={URL.createObjectURL(image)}
                                                        alt='Profile'
                                                        width={144}
                                                        height={144}
                                                        className='rounded-full h-10 w-10'
                                                        unoptimized
                                                    />
                                                )
                                            }
                                            {/* <div className='absolute bg-slate-400 h-full w-full rounded-full flex items-center justify-center'> */}
                                                {/* <span className={'flex items-center justify-center relative'}> */}
                                                    {/* <svg
                                                        xmlns='http://www.w1.org/2000/svg'
                                                        className='w-12 h-12 text-white absolute'
                                                        fill='currentColor'
                                                        viewBox='0 0 20 20'
                                                    >
                                                        <path
                                                            fillRule='evenodd'
                                                            clipRule='evenodd'
                                                            d=''
                                                        />
                                                    </svg> */}
                                                    <input 
                                                        type="file" 
                                                        onChange={handleFileChange}
                                                        className='opacity-100'
                                                        multiple={true}
                                                        name='profileImage'
                                                    />
                                                {/* </span> */}
                                            {/* </div> */}
                                        {/* </div> */}
                                    </div>
                                    <div className='grid grid-cols-2 gap-4 w-[500px]'>
                                        <div>
                                            <label className={labelClassName} htmlFor='username'>please select a username</label>
                                            <input 
                                                type="text" 
                                                className={inputClassName}
                                                name='userName'
                                                value={data.userName}
                                                onChange={handleChange}
                                                placeholder='Username'
                                            />
                                        </div>
                                        <div>
                                            <label className={labelClassName} htmlFor='fullName'>please select a fullName</label>
                                            <input 
                                                type="text" 
                                                className={inputClassName}
                                                name='fullName'
                                                value={data.fullName}
                                                onChange={handleChange}
                                                placeholder='FullName'
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelClassName} htmlFor='description'>Description</label>
                                        <textarea 
                                            id='description'
                                            className={inputClassName}
                                            name='description'
                                            value={data.description}
                                            onChange={handleChange}
                                            placeholder='Description'
                                        />
                                    </div>
                                    <button 
                                        className='border text-lg font-semibold px-5 py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600'
                                        onClick={setProfile}
                                        type='button'
                                    >
                                        Set Profile
                                    </button>
                                </div>
                            </div>
                        )
                    }
                </>
    )
}

export default page