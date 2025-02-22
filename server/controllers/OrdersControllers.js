import { v4 as uuidV4 } from 'uuid'
import prisma from '../prisma.js';
import { io } from '../socket/socket.js';

// aur ye wo orders he jis user ne service banaya he uske service pe kitne order aaye he
export const getSellerOrders = async (req, res) => {
    try {
        const {userId} = req?.user;
        console.log(userId);
        if(userId){
            const orders = await prisma.orders.findMany({
                where: {
                    gig: {
                        createdBy: {
                            id: parseInt(userId)
                        },
                    },
                    inCompleted: false
                },
                include: {
                    gig: true,
                    buyer: true
                }
            });

            return res.status(201).json({
                orders
            }) 
        }

        return res.status(400).json({
            msg: "User not found"
        })
        
    } catch (error) {
        console.log('er',error);
        return res.status(501).json({
            msg: 'Internal Server Error',
            success: true
        })
    }
}

// ye wo orders he jo buyer ne kiye he matlab buyer ne kitne service purchase kiye he
export const getBuyerOrders = async (req, res) => {
    try {
        if(req?.user?.userId){
            const orders = await prisma.orders.findMany({
                where: {buyerId: parseInt(req?.user?.userId)},
                include: {
                    gig: {
                        include: {
                            createdBy: {
                                select: {
                                    id: true,
                                    fullName: true,
                                    isProfileInfoSet: true,
                                    email: true,
                                    profileImage: true,
                                }
                            } 
                        }
                    }
                },
            });

            return res.status(201).json({
                orders
            }) 
        }

        return res.status(400).json({
            msg: "User not found"
        })
        
    } catch (error) {
        console.log('er',error);
        return res.status(501).json({
            msg: 'Internal Server Error',
            success: true
        })
    }
}

// Create an Order
export const createOrder = async (req, res) => {

    const {gigId,price,upfrontPayment,remainingAmount,paymentDetails} = req.body;
    const {userId} = req.user;  //Buyer Id
    let transactionId = uuidV4();
    try{
        const order = await prisma.orders.create({
            data: {
                gigId,
                buyerId: parseInt(userId),
                price,
                fullName: paymentDetails.fullName,
                transactionId,
                inCompleted: false,
                status: 'Pending',
                upfrontPayment,
                remainingAmount,
                paidAmount: upfrontPayment,
                inDispute: false
            }
        });

        const buyer = await prisma.user.findUnique({
            where: {id: parseInt(userId)}
        })
        
        const gig = await prisma.gigs.findUnique({
            where: {id: parseInt(gigId)},
            include: {createdBy: true}
        });
        const sellerId = gig.userId;  // seller id

        // Create notification for the seller
        // socket implementation
        const newNotification = await prisma.notifications.create({
            data: {
                message: `Your gig "${gig?.title}" has been purchased! by "${buyer?.isProfileInfoSet ? buyer?.fullName : buyer?.username}"`,
                sellerId: sellerId
            }
        });

        io.to(sellerId).emit('newNotification', newNotification);


        // Creating Payment Details
        await prisma.payments.create({
            data: {
                transactionId,
                amount: upfrontPayment,
                status: 'Success',
                orderId: order.id
            }
        })

        return res.status(201).json({
            order,
            success: true
        });
        

    }catch(error){
        console.log('Create Order: ', error)
        return res.status(501).json({
            msg: "Internal Server Error",
            success: false
        })
    }
};

// Notifications Controllers
export const markNotificationsAsRead = async (req, res) => {
    const { userId } = req.user;
    try {
        await prisma.notifications.updateMany({
            where: {sellerId: parseInt(userId),read: false},
            data: {
                read: true
            }
        })
        return res.status(201).json({
            msg: 'Read',
            success: true
        })
    } catch (error) {
        console.log('Mark Notifications: ', error);
        return res.status(500).json({ success: false, msg: "Internal Server Error" });
    }
};

export const markAsReadSingleNotification = async (req, res) => {
    const {id} = req.params;
    try {
        await prisma.notifications.update({
            where: {id: parseInt(id),read: false},
            data: {
                read: true
            }
        });

        return res.status(201).json({
            msg: 'Read',
            success: true
        })
        
    } catch (error) {
        return res.status(501).json({
            msg: 'Internal Server Error',
            success: false
        })
    }
}

export const unreadMessages = async (req, res) => {
    const { userId } = req.user;
    try {
        const unreadCount = await prisma.notifications.count({
            where: {sellerId: parseInt(userId),read:false}
        });

        const notifications = await prisma.notifications.findMany({
            where: {sellerId: parseInt(userId),read: false}
        })

        if(!notifications || !unreadCount === 0) return res.status(404).json({
            success: false
        });

        return res.status(202).json({
            unreadCount,
            notifications,
            success: true
        });
        
    } catch (error) {
        console.log('Mark Notifications: ', error);
        return res.status(500).json({ success: false, msg: "Internal Server Error" });
    }
}
export const readMessages = async (req, res) => {
    const { userId } = req.user;
    try {
        const notifications = await prisma.notifications.findMany({
            where: {sellerId: parseInt(userId),read: true}
        });

        if(!notifications) return res.status(404).json({
            success: false
        })

        return res.status(202).json({
            notifications,
            success: true
        });
        
    } catch (error) {
        console.log('Mark Notifications: ', error);
        return res.status(500).json({ success: false, msg: "Internal Server Error" });
    }
}

// Update an Order
export const updateOrder = async (req, res) => {
    const { orderId } = req.params;
    const { remainingAmount } = req.body;
    
    try {
        const existingOrder = await prisma.orders.findUnique({
            where: {id: parseInt(orderId)},
        });

        if(!existingOrder){
            return res.status(404).json({
                msg: 'Order Not Found',
                success: false
            })
        };

        const updatePaidAmount = existingOrder.paidAmount + parseInt(remainingAmount);
        const updateRemainingAmount = existingOrder.price - updatePaidAmount;

        let transactionId = uuidV4();
        const updatedOrder = await prisma.orders.update({
            where: {id: parseInt(orderId)},
            data: {
                inCompleted: true,
                inDispute: true,
                transactionId,
                status: "Paid",
                paidAmount: updatePaidAmount,
                remainingAmount: updateRemainingAmount
            }
        });

        await prisma.payments.create({
            data: {
                transactionId,
                amount: remainingAmount,
                status: 'Success',
                orderId: updatedOrder.id
            }
        })

        return res.status(201).json({
            order: updatedOrder,
            success: true
        })
        
    } catch (error) {
        console.log('Update Order: ', error)
        return res.status(501).json({
            msg: "Internal Server Error",
            success: false
        });
    }
};

// Delete an Order
export const deleteOrder = async (req, res) => {
    const {orderId} = req.params;
    try {
        await prisma.orders.delete({
            where: {id: parseInt(orderId)}
        });

        return res.status(201).json({
            msg: "Order Deleted Successfully",
            success: true
        })

        
    } catch (error) {
        console.log('Delete Order: ', error)
        return res.status(501).json({
            msg: "Internal Server Error",
            success: false
        })
    }
}

export const getOrderDetail = async (req, res) => {
    const { orderId } = req.params;
    try {
        const order = await prisma.orders.findUnique({
            where: {id: parseInt(orderId)}
        });

        if(!order){
            return res.status(404).json({
                msg: 'Something Went Wrong',
                success: false
            })
        };

        return res.status(201).json({
            order,
            success: true
        })
        
    } catch (error) {
        console.log('Error: ', error)
        return res.status(501).json({
            msg: 'Internal Server Error',
            success: false
        });
    }
}

