import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";

const stripe = new Stripe(
    process.env.STRIPE_SECRET_KEY
);


// export const addOrder = async (req, res) => {
//     try {
//         const prisma = new PrismaClient();
//         if(req.body.gigId){
//             const {gigId} = req.body;
            
//             // fetch the gig details
//             const gig = await prisma.gigs.findUnique({
//                 where: {id: parseInt(gigId)}
//             });

//             if(!gig){
//                 return res.status(404).json({
//                     msg: 'Gig Not Found',
//                     success: false
//                 })
//             };
//             const {orderId} = req.body;
//             const halfPrice = Math.max(Math.floor(gig?.price / 2), 50);

//             if(orderId){
//                 const existsOrder = await prisma.orders.findFirst({
//                     where: {
//                         id: parseInt(orderId)
//                     }
//                 });
//                 // console.log("Exist: ", existsOrder)
//                 if(existsOrder){
//                     // console.log('Exist: ',existsOrder);
//                     const paymentIntent = await stripe.paymentIntents.create({
//                         amount: halfPrice * 100,
//                         currency: 'usd',
//                         automatic_payment_methods: {
//                             enabled: true
//                         }
//                     });
//                     return res.status(201).json({
//                         clientSecret: paymentIntent.client_secret,
//                         success: true
//                     })
//                 }
//             }

//             const paymentIntent = await stripe.paymentIntents.create({
//                 amount: halfPrice * 100,
//                 currency: "usd",
//                 automatic_payment_methods: {
//                     enabled: true,
//                 },
//             });
//             const order = await prisma.orders.create({
//                 data: {
//                     paymentIntent: paymentIntent.id,
//                     price: gig?.price,
//                     paidAmount: 0,
//                     buyer: {connect: {id: req?.user?.userId}},
//                     gig: {connect: {id: parseInt(gigId)}},
//                     status: 'Pending',
//                     inCompleted: true
//                 }
//             });


//             return res.status(201).json({
//                 clientSecret: paymentIntent.client_secret,
//                 orderId: order.id,
//                 success: true
//             })
//         };

//         return res.status(404).json({
//             msg: "GigId is required",
//             success: false
//         })

//     } catch (error) {
//         console.log('err', error);
//         return res.status(501).json({
//             msg: 'Internal Server Error',
//             success: false
//         });
//     }
// };

// export const confirmOrder = async (req, res) => {
//     const prisma = new PrismaClient();
//     try {
//         const {orderId} = req.params;

//         // Fetch the order by paymentIntent
//         if(!orderId){
//             return res.status(400).json({
//                 msg: "OrderId is required",
//                 success: false,
//             });
//         }
//         const order = await prisma.orders.findUnique({
//             where: { id: parseInt(orderId) },
//         });


//         console.log("order: ",order)

//         if (!order) {
//             return res.status(404).json({
//                 msg: "Order not found",
//                 success: false,
//             });
//         }

//         // Check if the order is already fully paid
//         if (order.paidAmount >= order.price) {
//             return res.status(400).json({
//                 msg: "Order is already fully paid",
//                 success: false,
//             });
//         }

//         // Determine the payment amount (50% of the total price or the remaining balance)
//         const halfPrice = Math.floor(order.price / 2); // Half of the price
//         const remainingAmount = order.price - order.paidAmount;
//         const paymentAmount = Math.min(halfPrice, remainingAmount);

//         // Update the order with the calculated payment amount
//         const newPaidAmount = order.paidAmount + paymentAmount;

//         const updatedOrder = await prisma.orders.update({
//             where: { id: parseInt(orderId) },
//             data: {
//                 paidAmount: newPaidAmount,
//                 status: newPaidAmount === order.price ? "Completed" : "Partial Payment",
//                 inCompleted: newPaidAmount !== order.price, // Set to false only if fully paid
//             },
//         });

//         return res.status(200).json({
//             msg: newPaidAmount === order.price ? "Order completed successfully" : "Partial payment received",
//             updatedOrder,
//             success: true,
//         });

//     } catch (error) {
//         console.error("Error confirming order:", error);
//         return res.status(500).json({
//             msg: "Internal Server Error",
//             success: false,
//         });
//     }
// };

// Custom Payment Implementation by me


export const getSellerOrders = async (req, res) => {
    try {
        if(req?.user?.userId){
            const prisma = new PrismaClient();
            const orders = await prisma.orders.findMany({
                where: {
                    gig: {
                        createdBy: {
                            id: parseInt(req?.user?.userId)
                        },
                    },
                    inCompleted: true
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
// jisne gig banaya he uske gig ko kitne orders aaye he
export const getBuyerOrders = async (req, res) => {
    try {
        if(req?.user?.userId){
            const prisma = new PrismaClient();
            const orders = await prisma.orders.findMany({
                where: {buyerId: req?.user?.userId, inCompleted: true},
                include: {gig: true}
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

    const {gigId,price,upfrontPayment,remainingAmount} = req.body;
    // console.log("Body",req.body)
    const {userId} = req.user;  //Buyer Id
    const prisma = new PrismaClient();
    try{
        const newOrder = await prisma.orders.create({
            data: {
                gigId,
                buyerId: parseInt(userId),
                price,
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
        //
        const gig = await prisma.gigs.findUnique({
            where: {id: parseInt(gigId)},
            include: {createdBy: true}
        });
        const sellerId = gig.userId;  // seller id

        // Create notification for the seller
        await prisma.notifications.create({
            data: {
                message: `Your gig "${gig?.title}" has been purchased! by "${buyer?.fullName}"`,
                sellerId: sellerId
            }
        })

        return res.status(201).json({
            order: newOrder,
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
    const {userId} = req.user;
    const prisma = new PrismaClient();
    try {
        await prisma.notifications.updateMany({
            where: {sellerId: parseInt(userId),read: false},
            data: {
                read: true
            }
        })
        
    } catch (error) {
        console.log('Mark Notifications: ', error);
        return res.status(500).json({ success: false, msg: "Internal Server Error" });
    }
}

export const unreadMessages = async (req, res) => {
    const { userId } = req.user;
    const prisma = new PrismaClient();
    try {
        const unreadCount = await prisma.notifications.count({
            where: {sellerId: parseInt(userId),read: false}
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
    const prisma = new PrismaClient();
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
    const prisma = new PrismaClient(); 
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


        const updatedOrder = await prisma.orders.update({
            where: {id: parseInt(orderId)},
            data: {
                inCompleted: true,
                inDispute: true,
                status: "Paid",
                paidAmount: updatePaidAmount,
                remainingAmount: updateRemainingAmount
            }
        });

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
    const prisma = new PrismaClient();
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
    const prisma = new PrismaClient();
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

