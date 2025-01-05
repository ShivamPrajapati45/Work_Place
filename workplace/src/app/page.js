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
import Cookies from "js-cookie";
import { useEffect, useState } from "react";


export default function Home() {
  const [{ showLogInModel, showSignUpModel,userinfo }] = useStateProvider();
  const [isLogin, setIsLogin] = useState(false);
  const token = Cookies.get('token');

  useEffect(() => {
    if(token || userinfo){
      setIsLogin(true);
    }else{
      setIsLogin(false);
    }
  },[token, userinfo])


  return (
    <div>
      <HeroBanner/>
      <PopularServices/>
      <Companies/>
      <Everything/>
      <Services/>
      {
        !isLogin && <>
            <Business/>
            <JoinWorkplace/>
        </>
      }
    </div>
  );
}
