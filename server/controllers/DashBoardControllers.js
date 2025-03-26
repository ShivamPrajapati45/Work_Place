import prisma from '../connection.js';


export const getSellerData = async (req, res,_) => {
    try {
        if(req.user.userId){
            const gigs = await prisma.gigs.count({where: {userId: req.user.userId}});
            const {
                _count: {id: orders},
            } = await prisma.orders.aggregate({
                where: {
                    inCompleted: true,
                    gig: {
                        createdBy: {
                            id: req.user.userId
                        },
                    },
                },
                _count: {
                    id: true
                }
            });

            const unreadMessages = await prisma.messages.count({
                where: {
                    recipientId: req.user.userId,
                    isRead: false
                },
            });

            const today = new Date();
            const thisMonth = new Date(today.getFullYear(), today.getMonth(),1);
            const thisYear = new Date(today.getFullYear(), 0, 1);

            const {
                _sum: {price: revenue}
            } = await prisma.orders.aggregate({
                where: {
                    gig: {
                        createdBy: {
                            id: req.user.userId
                        },
                    },
                    inCompleted: true,
                    createdAt: {
                        gte: thisYear,
                    },
                },
                _sum: {
                    price: true
                },
            });

            // calculating DailyRevenue
            const {
                _sum: {price: dailyRevenue}
            } = await prisma.orders.aggregate({
                where: {
                    gig: {
                        createdBy: {
                            id: req.user.userId,
                        },
                    },
                    inCompleted: true,
                    createdAt: {
                        gte: new Date(new Date().setHours(0,0,0,0)),
                    },
                },
                _sum: {
                    price: true
                }
            });

            //CALCULATING Monthly Revenue
            const {
                _sum: {price: monthlyRevenue}
            } = await prisma.orders.aggregate({
                where: {
                    gig: {
                        createdBy: {
                            id: req.user.userId,
                        },
                    },
                    inCompleted: true,
                    createdAt: {
                        gte: thisMonth
                    },
                },
                _sum: {
                    price: true
                }
            });

            return res.status(201).json({
                dashBoardData: {
                    orders,
                    gigs,
                    unreadMessages,
                    dailyRevenue,
                    monthlyRevenue,
                    revenue
                },
                success: true
            });
        }
        return res.status(401).json({
            msg: 'User is inValid',
            success: false
        })

        
    } catch (error) {
        console.log(error);
        return res.status(501).json({
            msg: "Internal Server Error",
            success: false
        })
    }
}