import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";

const stripe = new Stripe(
    "sk_test_51QbRQjGdqwTyou2eUVVfw1iEH4EeQNvp9r7ih6mAk2hVyItMZwJP3Sy0PlWDz64XoNSehUC4b3acUKMZRIJyHUW200LNcKYUQq"
);


export const addOrder = async (req, res) => {
    try {
        const prisma = new PrismaClient();
        if(req.body.gigId){
            const {gigId} = req.body;
            const gig = await prisma.gigs.findUnique({
                where: {id: parseInt(gigId)}
            });

            const paymentIntent = await stripe.paymentIntents.create({
                amount: gig?.price * 100,
                currency: "usd",
                // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
                automatic_payment_methods: {
                    enabled: true,
                },
            });
            await prisma.orders.create({
                data: {
                    paymentIntent: paymentIntent.id,
                    price: gig?.price,
                    buyer: {connect: {id: req?.user?.userId}},
                    gig: {connect: {id: parseInt(gigId)}}
                }
            });


            return res.status(201).json({
                clientSecret: paymentIntent.client_secret,
                success: true
            })
        };

        return res.status(404).json({
            msg: "GigId is required",
            success: false
        })

    } catch (error) {
        console.log('err', error);
        return res.status(501).json({
            msg: 'Internal Server Error',
            success: false
        });
    }
};

export const confirmOrder = async (req, res) => {
    try {
        if(req.body.paymentIntent){
            const prisma = new PrismaClient();
            await prisma.orders.update({
                where: {paymentIntent: req.body.paymentIntent},
                data: { inCompleted: true }
            });

            return res.status(201).json({
                msg: "Order Success",
                success: true
            })
        }

        return res.status(404).json({
            msg: "Intent is found",
            success: false
        })
        
    } catch (error) {
        console.log('err', error);
        return res.status(501).json({
            msg: 'Internal Server Error',
            success: false
        });
    }
};

// this is for getting all seller orders matlab user ne kitne gig order kiye he
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