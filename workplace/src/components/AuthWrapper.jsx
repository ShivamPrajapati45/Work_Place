'use client'
import React, { useState } from 'react'
import {FcGoogle} from 'react-icons/fc'
import {IoClose} from 'react-icons/io5'
import { useStateProvider } from '@/context/StateContext'
import { reducerCases } from '@/context/constants'
import axios from 'axios'
import { LOGIN_ROUTES, SIGNUP_ROUTES } from '@/utils/constant'
import { useGoogleLogin } from '@react-oauth/google'
import { googleAuth } from '@/utils/api'
import { useFormik } from 'formik'
import * as yup from 'yup';
import { useRouter } from 'next/navigation'

const AuthWrapper = ({ type }) => {
    const [{showLogInModel,showSignUpModel},dispatch] = useStateProvider();
    const router = useRouter();

    const responseGoogle = async (response) => {
        try {
            if(response['code']){
                const res = await googleAuth(response['code']);
                if(res.data.user){
                    dispatch({type: reducerCases.CLOSE_AUTH_MODEL});
                    dispatch({type: reducerCases.SET_USER, userInfo: res.data.user});
                    router.push('/');
                }else{
                    console.error('Something is Wrong!!!');
                    
                }
            }

        } catch (error) {
            console.log('google',error);
        }
    }

    const handleSignUp = () => {
                dispatch({
                    type: reducerCases.TOGGLE_LOGIN_MODEL,
                    showLogInModel: false
                });
                dispatch({
                    type: reducerCases.TOGGLE_SIGNUP_MODEL,
                    showSignUpModel: true
                })
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
    };
    const googleLogin = useGoogleLogin({
        onSuccess: responseGoogle,
        onError: responseGoogle,
        flow: 'auth-code',
    });

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: yup.object({
            email: yup.string()
            .matches(
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                'Invalid email address'
            )
            .email('Invalid email address').required('Email is required'),
            password: yup.string().min(3,'Password must be at least 6 characters').required('Password is required')
        }),

        onSubmit: async (values, {setSubmitting, setErrors}) => {
            try{
                const response = await axios.post( type === 'login' ? LOGIN_ROUTES : SIGNUP_ROUTES, values,{withCredentials: true} );
                if(response.data.success){
                    dispatch({ type: reducerCases.SET_USER, userInfo: response.data.user });
                    router.push('/');
                }

            }catch(err){
                setErrors({email: 'Invalid email or password', password: 'Invalid email or password'});
            }finally{
                setSubmitting(false);
            }
        }
    })

    return (
        <div className='fixed top-0 z-[100]'>
            <div 
                className='h-[100vh] w-[100vw] backdrop-blur-md fixed top-0'
                id='blur-div'
            >
            </div>
            <div className='h-[100vh] w-[100vw] flex flex-col justify-center items-center'>
                <div 
                    className=' fixed z-[101] h-max w-max rounded-2xl bg-[#fff] flex justify-center items-center'
                    id='auth-model'
                >
                    <div className='p-6 gap-4 flex flex-col justify-center items-center'>
                        <IoClose onClick={() => router.push('/')} className='cursor-pointer text-2xl absolute right-5 top-5 hover:scale-105 transition-all hover:bg-gray-100 hover:text-red-800 rounded-full '/>
                        <div>
                            <h3 className='text-[#212121] uppercase font-semibold text-xl'>
                                {
                                    type === 'login' ? 
                                    'LOGIN' : 
                                    'SIGNUP'
                                }
                            </h3>
                        </div>

                        <div className='flex flex-col gap-5'>
                            <button 
                                className='text-black rounded-md hover:bg-gray-50 duration-200 transition-all border bg-gray-100 p-3 font-semibold w-80 flex items-center justify-center uppercase'
                                onClick={googleLogin}
                            >
                                <FcGoogle className='absolute text-2xl h-8 w-10 left-10'/>
                                Continue With Google
                            </button>
                        </div>
                        <div className='relative w-full text-center'>
                            <span className="before:content-[''] before:h-[0.5px] before:w-80 before:absolute before:top-[50%] before:left-0 before:bg-slate-400">
                                <span className='bg-white text-gray-500 relative z-10 px-2'>OR</span>
                            </span>
                        </div>
                        <form 
                            className='flex flex-col gap-4'
                            onSubmit={formik.handleSubmit}
                        >
                            <input 
                                type="email" 
                                placeholder='Email'
                                name='email'
                                className='p-3 text-black rounded-md w-80 border border-slate-600'
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {
                                formik.touched.email && formik.errors.email ? (
                                    <span className='text-red-500 p-0 m-0 text-sm'>
                                        {formik.errors.email}
                                    </span>
                                ): null
                            }
                            <input 
                                type="password"
                                placeholder='Password'
                                className='p-3 text-black w-80 rounded-md border border-slate-600'
                                name='password'
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.password && formik.errors.password ? (
                                    <span className='text-red-500 text-sm p-0 m-0'>{formik.errors.password}</span>
                                ) : null}
                            <button 
                                className='text-white bg-black px-12 text-lg font-semibold rounded-md p-3 w-80'
                                onClick={formik.isSubmitting}
                            >
                                {formik.isSubmitting ? 'Processing...' : 'Continue'}
                            </button>
                            {formik.errors.apiError && (
                                    <span className='text-red-500 text-sm'>{formik.errors.apiError}</span>
                            )}
                        </form>
                        <div className='py-5 w-full flex justify-center items-center border-t border-r-slate-400'>
                            {
                                type === 'login' ? 
                                (
                                    <>
                                        <span className='text-slate-700'>
                                            <span className='text-lg'>
                                                Not a member yet ?&nbsp;&nbsp;
                                            </span>
                                            <span 
                                                className='cursor-pointer text-blue-500 hover:underline transition-all'
                                                onClick={handleSignUp}
                                            >JOIN NOW</span>
                                        </span>
                                    </>
                                ) : 
                                (
                                    <>
                                        <span className='text-slate-700'>
                                            <span className='text-lg'>
                                                Already a member ?&nbsp;&nbsp;
                                            </span>
                                            <span 
                                                className='cursor-pointer text-xl text-blue-500 hover:underline transition-all'
                                                onClick={handleLogin}
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