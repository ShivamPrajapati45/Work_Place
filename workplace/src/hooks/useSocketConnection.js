import React, { useEffect } from 'react'
import { io } from 'socket.io-client'
import Cookies from 'js-cookie'
import { useStateProvider } from '@/context/StateContext';
import { reducerCases } from '@/context/constants';

const useSocketConnection = () => {
    const token = Cookies.get('token');
    const [{ userInfo,socket,onlineUsers }, dispatch] = useStateProvider();
    useEffect(() => {
        if(token && userInfo){
            if(!socket && userInfo?.id){
                const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL,{
                    query: {
                        userId: userInfo?.id.toString()
                    }
                });

                socketInstance.on('getOnlineUsers', (users) => {
                    dispatch({
                        type: reducerCases.ONLINE_USERS,
                        onlineUsers: users
                    });
                    localStorage.setItem('onlineUsers',JSON.stringify(users));
                });

                dispatch({ type: reducerCases.SOCKET, socket: socketInstance });
            };
            return () => {};

        }else{
            if(socket){
                socket.disconnect();
                dispatch({
                    type: reducerCases.SOCKET,
                    socket: null
                })
            }
        }

        return () => {
            if(socket){
                socket.disconnect();
                dispatch({
                    type: reducerCases.SOCKET,
                    socket: null
                })
            }
        }

    },[userInfo,token,socket,dispatch])
}

export default useSocketConnection