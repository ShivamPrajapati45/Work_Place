'use client'
import Business from "@/components/Landing/Business";
import Companies from "@/components/Landing/Companies";
import Everything from "@/components/Landing/Everything";
import HeroBanner from "@/components/Landing/HeroBanner";
import JoinWorkplace from "@/components/Landing/JoinWorkplace";
import PopularServices from "@/components/Landing/PopularServices";
import Services from "@/components/Landing/Services";
import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function Home() {
  const [{ userInfo,socket },dispatch] = useStateProvider();
  const [isLogin, setIsLogin] = useState(false);
  const token = Cookies.get('token');

  useEffect(() => {
    if(token || userInfo){
      setIsLogin(true);
    }else{
      setIsLogin(false);
    }
  },[token, userInfo]);

  useEffect(() =>{
    if(token && userInfo){
      if(!socket && userInfo.id){
        const socketInstance = io('http://localhost:3001', {
          query: {
            userId: userInfo?.id.toString()
          }
        });

        socketInstance.on('getOnlineUsers', (users) => {
          dispatch({ type: reducerCases.ONLINE_USERS, onlineUsers: users });
          localStorage.setItem('onlineUsers', JSON.stringify(users))
        });
        dispatch({ type: reducerCases.SOCKET, socket:socketInstance });

      }
      return () => {};

    }else{
      if(socket){
        socket.close();
        dispatch({ type: reducerCases.SOCKET, socket: null });
      }
    }

    return () => {
      if (socket) {
        socket.close();  // Close socket on component unmount
        dispatch({ type: reducerCases.SOCKET, socket: null });
      }
    };

  },[token,userInfo,socket,dispatch]);

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
