
import { useStateProvider } from '@/context/StateContext';
import { GET_MESSAGES } from '@/utils/constant';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'

const MessageContainer = () => {

    const [cookies] = useCookies();
    const router = useRouter();
    const { orderId } = useParams();
    const [{ userInfo }] = useStateProvider();
    const [recipientId, setRecipientId] = useState(undefined);
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState("");

    useEffect(() => {
        const getMessages = async () => {
            try {
                const {data} = await axios.get(`${GET_MESSAGES}/${orderId}`,{withCredentials: true})
                
                setMessages(data?.messages);
                setRecipientId(data.recipient);
            } catch (error) {
                console.log(error)
            }
        };
        if(orderId && userInfo) getMessages();
    },[orderId, userInfo])

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
                                        className={`inline-block rounded-lg ${message.senderId === userInfo.id ? 'bg-green-400 text-white' : 'bg-gray-200 text-gray-400'} px-4 py-2 break-all`}
                                    >
                                        <p>{message.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MessageContainer