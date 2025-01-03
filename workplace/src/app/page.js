'use client'
import AuthWrapper from "@/components/AuthWrapper";
import Business from "@/components/Landing/Business";
import Companies from "@/components/Landing/Companies";
import Everything from "@/components/Landing/Everything";
import HeroBanner from "@/components/Landing/HeroBanner";
import JoinWorkplace from "@/components/Landing/JoinWorkplace";
import PopularServices from "@/components/Landing/PopularServices";
import Services from "@/components/Landing/Services";
import { useStateProvider } from "@/context/StateContext";
import {GoogleOAuthProvider} from '@react-oauth/google'


export default function Home() {
  const [{ showLogInModel, showSignUpModel }] = useStateProvider();

  return (
    <div className="">
      <HeroBanner/>
      <PopularServices/>
      <Companies/>
      <Everything/>
      <Services/>
      <Business/>
      <JoinWorkplace/>
      {
        (showLogInModel || showSignUpModel) && (
          <GoogleOAuthProvider clientId="198016048437-u54f4ia3klfebhq4darcvhv2e5ba1noe.apps.googleusercontent.com" >
            <AuthWrapper type = {showLogInModel ? 'login' : 'signup'} />
          </GoogleOAuthProvider>
        )
      }
    </div>
  );
}
