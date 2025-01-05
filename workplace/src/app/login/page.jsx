'use client'
import AuthWrapper from '@/components/AuthWrapper';
import { useStateProvider } from '@/context/StateContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import React from 'react'

const page = () => {
    const [{ showLogInModel, showSignUpModel }] = useStateProvider();
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