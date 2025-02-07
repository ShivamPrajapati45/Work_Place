
import { useStateProvider } from '@/context/StateContext';
import { RECEIVE, SEND } from '@/utils/constant';
import axios from 'axios';
import { useParams, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import { BsCheckAll } from 'react-icons/bs';
import { FaRegPaperPlane } from 'react-icons/fa';

const MessageContainer = () => {

    const { orderId } = useParams();
    const [{ userInfo,socket }] = useStateProvider();
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState("");
    const scroll = useRef();
    const query = useSearchParams();
    const receiverId = query.get('second');   // this is the receiver ID
    
    useEffect(() => {
        if(socket){
            socket?.on('newMessage', (newMessage) => {
                console.log('NewMessage: ', newMessage)
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            });

            return () => socket?.off('newMessage');
        }else{
            console.log('Socket is null or not connected.');
        }
    },[socket]);

    // ye socket wala part 
    const receiveMessages = async () => {
        try {
            const response = await axios.get(`${RECEIVE}/${receiverId}`, {withCredentials: true});
            if(response.data.success){
                setMessages(response.data.conversation.messages);
            }{
                return;
            }
            
        } catch (error) {
            console.log(error);
        }
    }

    const sentMessageHandler = async (e) => {
        e.preventDefault();
        try {
            if(messageText !== ''){
                const res = await axios.post(`${SEND}/${receiverId}/${orderId}`, {message: messageText}, {
                    withCredentials: true
                });
                if(res.data.success){
                    console.log(res);
                    setMessages([...messages, res?.data?.newMessage]);
                    setMessageText('');
                };


            }
        } catch (error) {
            console.log("Sent : ",error)
        }
    }

    useEffect(() => {
                receiveMessages();
    },[])

    useEffect(() => {
        scroll.current?.scrollIntoView({behavior: 'smooth'})
    },[messageText])

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
        <div className='h-[80vh]'>
            <div className='flex flex-col items-center justify-center max-h-[80vh]' ref={scroll}>
                <div className='bg-black py-9 px-4 shadow-2xl sm:rounded-lg w-[80vw]'>
                    <div className='mt-8 bg-red-500' >
                        <div className='space-y-4 h-[50vh] overflow-y-auto pr-4'>
                            {messages.length > 0 && messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`flex ${message?.senderId === userInfo?.id ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div 
                                        className={`inline-block rounded-lg 
                                            ${message?.senderId === userInfo?.id 
                                                ? 'bg-green-400 text-white' 
                                                : 'bg-gray-200 text-gray-400'
                                            } px-4 py-2 break-all`}
                                    >
                                        <p>{message.text}</p>
                                        <span className='text-sm text-gray-100'>
                                            {formatTime(message.createdAt)}
                                        </span>
                                        <span>
                                            {message.senderId === userInfo.id && message.isRead && (
                                                <BsCheckAll/>
                                            )}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <form
                        className='flex mt-4'
                        onSubmit={sentMessageHandler}
                    >
                        <input 
                            type="text" 
                            className='rounded-full py-2 px-4 text-black mr-5 w-full'
                            placeholder='type a msg'
                            name='message'
                            onChange={(e) => setMessageText(e.target.value)}
                            value={messageText}
                        />
                        <button 
                            className='rounded-full bg-green-400 px-4 py-2 text-white'
                            type='submit'
                        >
                            <FaRegPaperPlane/>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default MessageContainer