import { PrismaClient } from '@prisma/client'

export const addMessage = async (req, res) => {
    try {
        const prisma = new PrismaClient();
        if(req.body.recipientId && req.params.orderId && req.body.message){
            const message = await prisma.messages.create({
                data: {
                    sender: {
                        connect: {id: parseInt(req?.user.userId)}
                    },
                    recipient: {
                        connect: {id: parseInt(req.body.recipientId)}
                    },
                    order: {
                        connect: {id: parseInt(req.params.orderId)}
                    },
                    text: req.body.message
                },
            });
            return res.status(201).json({
                message,
                success: true
            })
        }

        return res.status(400).json({
            msg: 'Msg is Required',
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

export const getMessages = async (req, res) => {
    try {
        const prisma = new PrismaClient();
        if(req.params.orderId && req.user.userId){
            const messages = await prisma.messages.findMany({
                where: {
                    order: {
                        id: parseInt(req.params.orderId)
                    },
                },
                orderBy: {
                    createdAt: "asc"
                },
            });

            await prisma.messages.updateMany({
                where: {
                    orderId: parseInt(req.params.orderId),
                    recipientId: parseInt(req.user.userId)
                },
                data: {
                    isRead: true
                },
            });

            const order = await prisma.orders.findUnique({
                where: { id: parseInt(req.params.orderId)},
                include: {gig: true}
            });
            let recipientId;
            if(order.buyerId === req.user.userId){
                recipientId = order.gig.userId;
            } else if(order.gig.userId === req.user.userId){
                recipientId = order.buyerId
            };

            return res.status(201).json({
                messages,
                recipientId,
                success: true
            })
        }

        return res.status(201).json({
            msg: 'Order id is required',
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