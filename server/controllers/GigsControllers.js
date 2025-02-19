import prisma from '../prisma.js';
import {existsSync, renameSync, unlinkSync} from 'fs'
import { uploadMultipleToCloudinary } from '../utils/cloudinary.js';


export const addGig = async (req,res) => {
    try {
        if(req.files && req.query){

            const filesKeys = Object.keys(req.files);
            const fileNames = [];
            filesKeys.forEach((file) => {
                const date = Date.now();
                renameSync(
                    req.files[file].path,
                    "uploads/" + date + req.files[file].originalname
                );
                fileNames.push(date + req.files[file].originalname);
            });

            const cloudResponse = await uploadMultipleToCloudinary(req.files);
                const {
                    title, 
                    description,
                    category,
                    features,
                    price,
                    revisions,
                    time,
                    shortDesc, 
                } = req.query;

                await prisma.gigs.create({
                    data: {
                        title,
                        description,
                        deliveryTime: parseInt(time),
                        category,
                        features,
                        price: parseFloat(price),
                        shortDesc,
                        revisions: parseInt(revisions),
                        images: fileNames,
                        createdBy: {connect: {id: req.user.userId}}
                        
                    }
                });

                return res.status(200).json({
                    msg: 'Gig created successfully',
                    success: true
                });
        }

        return res.status(400).json({
            msg: 'All Field is Required',
            success: false
        });

    } catch (error) {
        console.log('err', error);
        return res.status(501).json({
            msg: 'Internal Server Error',
            success: false
        });
    }
}
// this getGigs function will get all the gigs of the user
export const getGigs = async (req, res) => {
    try{
        const user = await prisma.user.findUnique({
            where : {id: req?.user.userId},
            include: {
                gigs: true
            }
        })
        // console.log(user)
        return res.status(200).json({
            gigs: user?.gigs,
            msg: 'Gigs fetched successfully',
            success: true
        });

    }catch(err){
        console.log('err', err);
        return res.status(501).json({
            msg: 'Internal Server Error',
            success: false
        });
    }
}

export const getGigData = async (req, res) => {
    try {

        if(req?.params?.gigId){
            const gig = await prisma.gigs.findUnique({
                where: {id: parseInt(req.params.gigId)},
                include: {
                    createdBy: true,
                    reviews: {
                        include: {
                            reviewer: true
                        }
                    },
                    orders: {
                        where: {
                            gigId: parseInt(req?.params.gigId),
                            buyerId: req.user.userId
                        }
                    }
                }
            });

            const userWithGigs = await prisma.user.findUnique({
                where: {id: gig?.createdBy?.id},
                include: {gigs: {include: {reviews: true}}}
            })

            const totalReviews = userWithGigs.gigs.reduce(
                (acc, gig) => acc + gig.reviews.length,
                0
            )

            const averageRating = (
                userWithGigs.gigs.reduce(
                    (acc, gig) => acc = gig.reviews.reduce((sum, review) => sum + review.rating,0),
                    0
                )/ totalReviews
            ).toFixed(1);

            return res.status(200).json({ gig: {...gig, totalReviews, averageRating},success: true});
        }
        return res.status(404).json({
            msg: 'Gig not found',
            success: false
        });
        
    } catch (error) {
        console.log('err', error);
        return res.status(501).json({
            msg: 'Internal Server Error',
            success: false
        });
    }
};

export const editGig = async (req, res) => {
    try {
        if (req?.files && req.query) {

            const filesKeys = Object.keys(req.files);
            const fileNames = [];
            filesKeys.forEach((file) => {
                const date = Date.now();
                renameSync(
                    req.files[file].path,
                    "uploads/" + date + req.files[file].originalname
                );
                fileNames.push(date + req.files[file].originalname);
            });

            const {
                title,
                description,
                category,
                features,
                price,
                revisions,
                time,
                shortDesc,
            } = req.query;


            const oldGig = await prisma.gigs.findUnique({
                where: { id: parseInt(req?.params?.gigId) }, // Ensure gigId is parsed as an integer
            });

            // Update the gig with new data
            await prisma.gigs.update({
                where: { id: parseInt(req?.params?.gigId) },
                data: {
                    title,
                    description,
                    deliveryTime: parseInt(time),
                    category,
                    features,
                    price: parseFloat(price),
                    shortDesc,
                    revisions: parseInt(revisions),
                    images: fileNames,
                    createdBy: { connect: { id: req.user.userId } },
                },
            });

            oidData?.images?.forEach((image) => {
                if(existsSync(`uploads/${image}`)){
                    unlinkSync(`uploads/${image}`);
                } 
            })
            // If everything goes well, return the success message
            return res.status(200).json({
                msg: 'Gig updated successfully',
                success: true,
            });
        }

        // If any required field is missing, return an error
        return res.status(400).json({
            msg: 'All fields are required',
            success: false,
        });
    } catch (error) {
        console.log('err', error);
        return res.status(501).json({
            msg: 'Internal Server Error',
            success: false,
        });
    }
};

const createSearchQuery = (searchTerm, category) => {
    const query = {
        where: {
            OR: [],
        },
        include: {
            createdBy: true,
            reviews: {
                include: {
                    reviewer: true
                }
            }
    },
}
    
    if(searchTerm){
        query.where.OR.push({
            title: {
                contains: searchTerm,
                mode: 'insensitive'
            }
        });
        query.where.OR.push({
            category: {
                contains: searchTerm,
                mode: 'insensitive'
            },
        })
        query.where.OR.push({
            shortDesc: {
                contains: searchTerm,
                mode: 'insensitive'
            }
        });
        query.where.OR.push({
            description: {
                contains: searchTerm,
                mode: 'insensitive'
            }
        });
    }
    
    if(category){
        query.where.OR.push({
            title: {
                contains: category,
                mode: 'insensitive'
            }
        });
        query.where.OR.push({
            category: {
                contains: category,
                mode: 'insensitive'
            },
        });
        query.where.OR.push({
            shortDesc: {
                contains: category,
                mode: 'insensitive'
            }
        });
        query.where.OR.push({
            description: {
                contains: category,
                mode: 'insensitive'
            }
        });
    }

    return query;
};

export const searchGig = async (req, res) => {
    try {
        if(req?.query?.searchTerm || req?.query?.category){
            const gigs = await prisma.gigs.findMany(
                createSearchQuery(req.query.searchTerm, req.query.category)
            );
            return res.status(200).json({
                gigs,
                success: true
            })

        };

        // if the search term and category is not provided then we will return the error message
        return res.status(404).json({
            msg: 'Gigs not found',
            success: false
        });
        
    } catch (error) {
        console.log('err', error);
        return res.status(501).json({
            msg: 'Internal Server Error',
            success: false
        });
    }
};

const checkOrder = async (userId, gigId) => {
    try {
        const hasUserOrderedGig = await prisma.orders.findFirst({
            where: {
                buyerId: parseInt(userId),
                gigId: parseInt(gigId),
                inCompleted: true
            }
        });
        return hasUserOrderedGig;
    } catch (error) {
        console.log(error)
    }
}

export const checkGigOrder = async (req, res) => {
    try {
        if(req?.user?.userId && req?.params?.gigId){
            const hasUserOrderedGig = await checkOrder(req.user.userId, req.params.gigId);

            return res.status(201).json({
                hasUserOrderedGig: hasUserOrderedGig ? true : false
            })
        }

        return res.status(201).json({
            msg: 'Gig is not valid',
            success: false
        })
        
    } catch (error) {
        console.log('err', error);
        return res.status(501).json({
            msg: 'Internal Server Error',
            success: false
        });
    }
}

export const addReview = async (req, res, _) => {
    try {
        if(req?.user?.userId && req.params.gigId){
            if(await checkOrder(req?.user?.userId , req.params.gigId)){
                if(req.body.reviewText && req.body.rating){
                    const newReview = await prisma.reviews.create({
                        data: {
                            rating: req.body.rating,
                            reviewText: req.body.reviewText,
                            reviewer: { connect : {id: parseInt(req?.user?.userId)}},
                            gig: {connect: {id: parseInt(req?.params?.gigId)}}
                        },
                        include: {
                            reviewer: true
                        }
                    });
                    return res.status(201).json({
                        newReview,
                        success: true
                    });
                }
                return res.status(400).json({
                    msg: 'Rating and text is required',
                    success: false
                });
            }
            return res.status(400).json({
                msg: 'You need to purchase the gig to give a rating',
                success: false
            });
        };

        return res.status(400).json({
            msg: 'invalid',
            success: false
        });

        
    } catch (error) {
        console.log('err', error);
        return res.status(501).json({
            msg: 'Internal Server Error',
            success: false
        });
    }
}

const searchQuery = (searchTerm, category) => {
    const query = {
        where: {
            OR: [],
        },
        include: {
            createdBy: true,
            reviews: {
                include: {
                    reviewer: true
                }
            }
    },
}
    
    if(searchTerm){
        query.where.OR.push({
            title: {
                contains: searchTerm,
                mode: 'insensitive'
            }
        });
        query.where.OR.push({
            category: {
                contains: searchTerm,
                mode: 'insensitive'
            },
        })
        query.where.OR.push({
            shortDesc: {
                contains: searchTerm,
                mode: 'insensitive'
            }
        });
        query.where.OR.push({
            description: {
                contains: searchTerm,
                mode: 'insensitive'
            }
        });
    }
    
    if(category){
        query.where.OR.push({
            category: {
                contains: category,
                mode: 'insensitive'
            },
        });
    }

    return query;
};

export const getAllGigs = async (req,res) => {
    try {
        const { category,searchTerm } = req.query;
        if(category || searchTerm){
            const gigs = await prisma.gigs.findMany(
                searchQuery(searchTerm, category)
            );

            return res.status(201).json({
                gigs,
                success: true
            })
        };
        
        const gigs = await prisma.gigs.findMany({
            include: {
                createdBy: true,  // this will include the user who created the gig
                reviews: {
                    include: {
                        reviewer: true // this will include the user who reviewed the gig
                    }
                }
            }
        });

        return res.status(200).json({
            gigs,
            success: true
        })
        
    } catch (error) {
        console.log("Get All Gigs Error :", error);
        return res.status(500).json({
            msg: "Internal Server Error",
            success: false
        })
    }
}

export const getGigsByQuery = async (req,res) => {
    try {
        const gigs = await prisma.gigs.findMany({
            include: {
                createdBy: true,  // this will include the user who created the gig
                reviews: {
                    include: {
                        reviewer: true // this will include the user who reviewed the gig
                    }
                }
            }
        });

        return res.status(200).json({
            gigs,
            success: true
        })
        
    } catch (error) {
        console.log("Get All Gigs Error :", error);
        return res.status(500).json({
            msg: "Internal Server Error",
            success: false
        })
    }
}

export const searchRecommendedGigs = async (req, res) => {
    try{
        const {category, desc} = req.query;
        const {gigId} = req.params;

        if(category || desc && gigId){
            const gigs = await prisma.gigs.findMany({
                where: {
                    AND: [
                        {
                            OR: [
                                {
                                    category: {
                                        contains: category,
                                        mode: 'insensitive'
                                    },
                                },
                                {
                                    shortDesc: {
                                        contains: desc,
                                        mode: 'insensitive'
                                    }
                                }
                            ]
                        },
                        // {
                        //     id: {
                        //         not: parseInt(gigId)
                        //     }
                        // }
                    ]
                },
                include: {
                    createdBy: true,
                    reviews: {
                        include: {
                            reviewer: true
                        }
                    }
                }
            })
            return res.status(200).json({
                gigs,
                success: true
            });
        }

        return res.status(404).json({
            msg: 'Gigs not found',
            success: false
        });

    }catch(err){
        console.log('Search re:', err);
        return res.status(501).json({
            msg: 'Internal Server Error',
            success: true
        })
    }
}

export const getSellerGigs = async (req,res) => {
    try{
        const {sellerId,gigId} = req.params;
        if(!sellerId) return res.status(404).json({
            msg: 'Seller not found',
            success: false
        })
        const gigs = await prisma.gigs.findMany({
            where: {
                userId: parseInt(sellerId),
                id: {
                    not: parseInt(gigId)
                },
            },
            include: {
                createdBy: true,
                reviews: {
                    include: {
                        reviewer: true
                    }
                }
            }
        })
        

        return res.status(200).json({
            gigs,
            success: true
        })

    }catch(err){
        console.log(err);
        return res.status(501).json({
            msg: 'Internal Server Error',
            success: true
        })
    }
}
