'use client'
import AuthWrapper from '@/components/AuthWrapper';
import { useStateProvider } from '@/context/StateContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

const page = () => {
    const [{ showLogInModel,userinfo }] = useStateProvider();
    const token = Cookies.get('token');
    const router = useRouter();
    useEffect(() => {
        if(token && userinfo){
            router.push('/');
        }
    },[userinfo, token])
    return (
        <div>
            <GoogleOAuthProvider
                clientId="198016048437-u54f4ia3klfebhq4darcvhv2e5ba1noe.apps.googleusercontent.com"
            >
                <AuthWrapper type={showLogInModel ? 'login' : 'signup'} />
            </GoogleOAuthProvider>
        </div>
    )
}

export default page