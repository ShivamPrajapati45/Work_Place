import { PrismaClient } from '@prisma/client'
import { getReceiverSocketId, io, userSocketMap } from '../socket/socket.js';


export const getUnreadMessages = async (req, res) => {
    try {
        if(req.user.userId){
            const prisma = new PrismaClient();
            const messages = await prisma.messages.findMany({
                where: {
                    recipientId: req.user.userId,
                    isRead: false
                },
                include: {
                    sender: true
                }
            });

            return res.status(201).json({
                messages,
                success: true
            })
        }
        return res.status(400).json({
            msg: 'User is not valid',
            success: false
        })
        
    } catch (error) {
        console.log(error);
        return res.status(501).json({
            msg: 'Internal Server Error',
            success: true
        })
    }
}

export const markAsRead = async (req, res) => {
    try {
        if(req.user.userId && req.params.messageId){
            const prisma = new PrismaClient();
            await prisma.messages.update({
                where: {
                    id: parseInt(eq.params.messageId),
                },
                data: {
                    isRead: true
                }
            });
            return res.status(201).json({
                msg: "Messages mark as read",
                success: true
            })
        }
        return res.status(400).json({
            msg: 'User is not valid',
            success: false
        })
        
    } catch (error) {
        console.log(error);
        return res.status(501).json({
            msg: 'Internal Server Error',
            success: true
        })
    }
}

// Sockets Parts Execution and implementation ✓✓✓✓

export const sendMessage = async (req, res) => {
    const prisma = new PrismaClient();
    try {
        const senderId = req.user.userId;  // This is the sender ID who is sending msg
        const {receiverId, orderId} = req.params;  // this is receiver ID the person jisko msg send kiya sender ne
        const {message} = req.body;

        let gotConversation = await prisma.conversation.findFirst({
            where: {
                AND: [
                    {participants: {some: {id: parseInt(senderId)}}},
                    {participants: {some: {id: parseInt(receiverId)}}},
                ]
            },
            include: {
                messages: true,
                participants: true
            }
        });

        if(!gotConversation){
            gotConversation = await prisma.conversation.create({
                data: {
                    participants: {
                        connect: [
                            { id: parseInt(senderId) },
                            { id: parseInt(receiverId) }
                        ]
                    }
                },
                include: {
                    participants: true
                }
            })
        };

        const newMessage = await prisma.messages.create({
            data: {
                text: message,
                sender: {
                    connect: {id: parseInt(senderId)}
                },
                recipient: {
                    connect: {id: parseInt(receiverId)}
                },
                order: {
                    connect: {id: parseInt(orderId)}
                },
                conversation: {
                    connect: {id: parseInt(gotConversation.id)}
                }
            },
        });

        if(newMessage){
            gotConversation.messages.push(newMessage.id);
        };

        // Here Socket IO Part will start
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit('newMessage',newMessage);
        }else {
            console.log('Receiver not online:', receiverId);
        }

        return res.status(201).json({
            msg: 'Message Sent',
            newMessage,
            success: true
        })

    } catch (error) {
        console.log('Sent Error: ', error)
        return res.status(501).json({
            msg: 'Internal Server Error',
            success: false
        });
    }
};

export const receiveMessage = async (req, res) => {
    const prisma = new PrismaClient();
    try {
        const {receiverId} = req.params;
        const senderId = req.user.userId;
        const conversation = await prisma.conversation.findFirst({
            where: {
                AND: [
                    { participants: {some : {id: parseInt(senderId)}} },
                    { participants: {some : {id: parseInt(receiverId)}} },
                ]
            },
            include: {
                messages: true,
                participants: true
            }
        });

        // console.log('conversation: ', conversation);
        return res.status(201).json({
            msg: 'Receive Successfully !!',
            conversation,
            success: true
        });
        
    } catch (error) {
        console.log('Receive Error: ', error)
        return res.status(501).json({
            msg: 'Internal Server Error',
            success: false
        });
    }
}