import { useStateProvider } from '@/context/StateContext';
import { RECEIVE, SEND } from '@/utils/constant';
import axios from 'axios';
import { useParams, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import { BsCheckAll,BsCheck } from 'react-icons/bs';
import { FaRegPaperPlane } from 'react-icons/fa';
import { LuSendHorizontal } from 'react-icons/lu'
import {IoMdArrowDown} from 'react-icons/io';

const MessageContainer = () => {

    const { orderId } = useParams();
    const [{ userInfo,socket,onlineUsers }] = useStateProvider();
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState("");
    const [showScrollBtn, setShowScrollBtn] = useState(false);
    const scrollRef = useRef(null);
    const containerRef = useRef(null);
    const query = useSearchParams();
    const receiverId = query.get('second');   // this is the receiver ID
    
    useEffect(() => {
        if(socket){
            socket?.on('newMessage', (newMessage) => {
                // console.log('NewMessage: ', newMessage);
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            });

            return () => socket?.off('newMessage');
        }
    },[socket]);

    useEffect(() => {
        if(receiverId){
            const unreadCounts = JSON.parse(localStorage.getItem('unreadCounts')) || {};
            delete unreadCounts[receiverId];
            localStorage.setItem('unreadCounts',JSON.stringify(unreadCounts));
        }
    },[receiverId,socket]);
    // ye socket wala part 
    const receiveMessages = async () => {
        try {
            const response = await axios.get(`${RECEIVE}/${receiverId}`, {withCredentials: true});
            if(response.data.success){
                setMessages(response.data.conversation.messages);
            }
            
        } catch (error) {
            console.log(error);
        }
    }

    const sentMessageHandler = async (e) => {
        e.preventDefault();
        if(messageText.trim() === '') return;
        try {
                const res = await axios.post(`${SEND}/${receiverId}/${orderId}`, {message: messageText}, {
                    withCredentials: true
                });
                if(res.data.success){
                    // console.log(res);
                    setMessages([...messages, res?.data?.newMessage]);
                    setMessageText('');
                };

        } catch (error) {
            console.log("Sent : ",error)
        }
    }

    useEffect(() => {
        receiveMessages();
    },[]);

    useEffect(() => {
        if(containerRef.current){
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    },[messages]);

    useEffect(() => {
        const handleScroll = () => {
            if (containerRef.current) {
                setShowScrollBtn(containerRef.current.scrollTop < containerRef.current?.scrollHeight - containerRef.current?.clientHeight - 100);
            }
        };
        if (containerRef.current) {
            containerRef.current?.addEventListener('scroll', handleScroll);
        }
        return () => {
            if (containerRef.current) {
                containerRef.current.removeEventListener('scroll', handleScroll);
            }
        };
    },[])

    const formatTime = (timeStamp) => {
        const date = new Date(timeStamp);
        let hours = date.getHours();
        let minutes = date.getMinutes();
        const amPm = hours >= 12 ? 'PM' : 'AM';
        hours %= 12;
        hours = hours || 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        const formattedTime = `${hours}:${minutes}${amPm}`;
        return formattedTime
    };

    return (
        <div className='flex relative flex-col items-center w-full justify-center h-[85vh]'>
                <div ref={containerRef} className='flex-1 overflow-y-auto p-2 space-y-2 bg-slate-200 w-[50vw]  rounded-t-lg' style={{ scrollbarWidth: 'thin'}}>
                    {messages.length > 0 && messages.map((message, index) => (
                        <div 
                            key={index} 
                            className={`flex  ${message?.senderId === userInfo?.id ? 'justify-end' : 'justify-start'}`}
                        >
                            <div ref={scrollRef} className={`max-w-[75%] px-3 py-1 rounded-lg shadow-md text-white ${message?.senderId === userInfo?.id ? 'bg-green-600' : 'bg-blue-500'}`}>
                                <p className='text-white break-words'>{message?.text}</p>
                                <div className='text-xs opacity-80 flex gap-1 justify-between items-center mt-1'>
                                    <span>{formatTime(message?.createdAt)}</span>

                                    {message?.senderId === userInfo?.id && (
                                        message.isRead ? <BsCheckAll size={16} className='text-sky-300'/> : 
                                            onlineUsers?.includes(receiverId.toString()) ? 
                                            <BsCheckAll size={16} className='text-gray-400'/>
                                            : 
                                            <BsCheck size={16} className='text-gray-100'/>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <form onSubmit={sentMessageHandler} className='flex bg-slate-300 py-2 rounded-lg px-2 gap-3 items-center mt-4 w-1/2'>
                    <input 
                        type="text" 
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder='type a message...'
                        className='flex-1 rounded-lg p-2 text-black outline-none'
                    />
                    <button type='submit' className='bg-green-500 p-2 rounded-full text-white hover:bg-green-600 transition duration-200'>
                        <LuSendHorizontal size={26} />
                    </button>
                </form>
                {showScrollBtn && (
                <button 
                    className='absolute bottom-16 opacity-80 hover:opacity-90 transition-all bg-gray-800 text-white p-2 rounded-full shadow-lg'
                    onClick={() => containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: 'smooth' })}
                >
                    <IoMdArrowDown size={24}/>
                </button>
                )}
        </div>
    )
}

export default MessageContainer