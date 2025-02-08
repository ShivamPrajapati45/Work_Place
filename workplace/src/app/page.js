'use client'
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
  const [{ userInfo }] = useStateProvider();
  const [isLogin, setIsLogin] = useState(false);
  const token = Cookies.get('token');

  useEffect(() => {
    if(token || userInfo){
      setIsLogin(true);
    }else{
      setIsLogin(false);
    }
  },[token, userInfo]);
  
  return (
    <div className="relative overflow-auto box-border p-0 m-0">
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
