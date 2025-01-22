
import { useStateProvider } from '@/context/StateContext';
import { ADD_MESSAGES, GET_MESSAGES } from '@/utils/constant';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import { BsCheckAll } from 'react-icons/bs';
import { FaRegPaperPlane } from 'react-icons/fa';

const MessageContainer = () => {

    const { orderId } = useParams();
    const [{ userInfo }] = useStateProvider();
    const [recipientId, setRecipientId] = useState(undefined);
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState("");
    const intervalRef = useRef(null);

    const getMessages = async () => {
        try {
            const {data} = await axios.get(`${GET_MESSAGES}/${orderId}`,{withCredentials: true})
            
            setMessages(data?.messages);
            setRecipientId(data.recipientId);
        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        if(orderId && userInfo){
            intervalRef.current = setInterval(() => {
                getMessages();
            }, 3000);
        };

        return () => {
            clearInterval(intervalRef.current);
        };
    },[orderId, userInfo,messageText,messages])

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

    const sendMessage = async () => {
        try {
            if(messageText.length){
                const response = await axios.post(`${ADD_MESSAGES}/${orderId}`,{message: messageText, recipientId},{withCredentials: true});

                if(response.data.success){
                    setMessages([...messages,response.data.message]);
                    setMessageText("");
                }
            }
            
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='h-[80vh]'>
            <div className='flex flex-col items-center justify-center max-h-[80vh]'>
                <div className='bg-white py-9 px-4 shadow-2xl sm:rounded-lg w-[80vw]'>
                    <div className='mt-8'>
                        <div className='space-y-4 h-[50vh] overflow-y-auto pr-4'>
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.senderId === userInfo.id ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div 
                                        className={`inline-block rounded-lg 
                                            ${message.senderId === userInfo.id 
                                                ? 'bg-green-400 text-white' 
                                                : 'bg-gray-200 text-gray-400'
                                            } px-4 py-2 break-all`}
                                    >
                                        <p>{message.text}</p>
                                        <span className='text-sm text-gray-400'>
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
                    <div className='flex mt-4'>
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
                            onClick={sendMessage}
                        >
                            <FaRegPaperPlane/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MessageContainer