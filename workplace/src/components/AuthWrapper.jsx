'use client'
import React, { useState } from 'react'
import {MdFacebook} from 'react-icons/md'
import {FcGoogle} from 'react-icons/fc'
import { useStateProvider } from '@/context/StateContext'
import { reducerCases } from '@/context/constants'
import axios from 'axios'
import { LOGIN_ROUTES, SIGNUP_ROUTES } from '@/utils/constant'
import { useCookies } from 'react-cookie'

const AuthWrapper = ({ type }) => {
    const [ cookies, setCookie, removeCookie ] = useCookies();
    const [{showLogInModel, showSignUpModel}, dispatch] = useStateProvider();
    const [values, setValues] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value
        })
    };

    const handleClick = async () => {
        try{
            const { email, password } = values;
            if(email && password){
                const {
                    data: {user,token},res // Destructuring user and token from data coming by response
                } = await axios.post(
                    type === 'login' ? 
                    LOGIN_ROUTES :
                    SIGNUP_ROUTES,
                    {email, password},
                    {withCredentials: true}
                );
                // console.log("res",res);
                // setCookie("token",{token});
                dispatch({type: reducerCases.CLOSE_AUTH_MODEL});
                if(user){
                    dispatch({type: reducerCases.SET_USER, userInfo: user});
                    window.location.reload();
                }
            };

        }catch(err){
            console.log("error: ",err);
        }
    }

  return (
    <div className='fixed top-0 z-[100]'>
        <div 
            className='h-[100vh] w-[100vw] backdrop-blur-md fixed top-0'
            id='blur-div'
        >
        </div>
        <div className='h-[100vh] w-[100vw] flex flex-col justify-center items-center'>
            <div 
                className=' fixed z-[101] h-max w-max  bg-white flex justify-center items-center'
                id='auth-model'
            >
                <div className='p-8 gap-5 flex flex-col justify-center items-center'>
                    <h3 className='text-black'>
                        {
                            type === 'login' ? 
                            'LOGIN To WORKPLACE' : 
                            'SIGNUP To WORKPLACE'
                        }
                    </h3>
                    <div className='flex flex-col gap-5'>
                        <button className='text-white bg-blue-500 p-3 font-semibold w-80 flex items-center justify-center'>
                            <MdFacebook className='absolute text-2xl left-10'/>
                            Login with Facebook
                        </button>
                        <button className='text-black border border-gray-400 bg-white p-3 font-semibold w-80 flex items-center justify-center'>
                            <FcGoogle className='absolute text-2xl left-10'/>
                            Login with Google
                        </button>
                    </div>
                    <div className='relative w-full text-center'>
                        <span className="before:content-[''] before:h-[0.5px] before:w-80 before:absolute before:top-[50%] before:left-0 before:bg-slate-400">
                            <span className='bg-white text-gray-500 relative z-10 px-2'>OR</span>
                        </span>
                    </div>
                    <div className='flex flex-col gap-4'>
                        <input 
                            type="email" 
                            placeholder='Email'
                            name='email'
                            className='p-3 text-black w-80 border border-slate-600'
                            value={values.email}
                            onChange={handleChange}
                        />
                        <input 
                            type="password"
                            placeholder='Password'
                            className='p-3 text-black w-80 border border-slate-600'
                            name='password'
                            value={values.password}
                            onChange={handleChange}
                        />
                        <button 
                            className='text-white bg-black px-12 text-lg font-semibold rounded-md p-3 w-80'
                            onClick={handleClick}
                        >
                            Continue
                        </button>
                    </div>
                    <div className='py-5 w-full flex justify-center items-center border-t border-r-slate-400'>
                        {
                            type === 'login' ? 
                            (
                                <>
                                    <span className='text-sm text-slate-700'>
                                        Not a member yet ?&nbsp;&nbsp;
                                        <span 
                                            className='cursor-pointer text-green-500'
                                            onClick={() => {
                                                dispatch({
                                                    type: reducerCases.TOGGLE_LOGIN_MODEL,
                                                    showLogInModel: false
                                                });
                                                dispatch({
                                                    type: reducerCases.TOGGLE_SIGNUP_MODEL,
                                                    showSignUpModel: true
                                                });
                                            }}
                                        >JOIN NOW</span>
                                    </span>
                                </>
                            ) : 
                            (
                                <>
                                    <span className='text-sm text-slate-700'>
                                        Already a member ?&nbsp;&nbsp;
                                        <span 
                                            className='cursor-pointer text-green-500'
                                            onClick={() => {
                                                dispatch({
                                                    type: reducerCases.TOGGLE_SIGNUP_MODEL,
                                                    showSignUpModel: false
                                                });
                                                dispatch({  
                                                    type: reducerCases.TOGGLE_LOGIN_MODEL,
                                                    showLogInModel: true
                                                });
                                            }}
                                        >LOGIN</span>
                                    </span>
                                </>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>        
    </div>
  )
}

export default AuthWrapper