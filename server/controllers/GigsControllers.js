import { PrismaClient } from '@prisma/client';
import { create } from 'domain';
import {existsSync, renameSync, unlinkSync} from 'fs'

export const addGig = async (req,res) => {
    try {
        if(req?.files){
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
            if(req.query){
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

                const prisma = new PrismaClient();
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
        console.log(req?.user)
        const prisma = new PrismaClient();
        const user = await prisma.user.findUnique({
            where : {id: req?.user.userId},
            // this include means that we want to include the gigs of the user
            include: {
                gigs: true
            }
        })
        console.log(user)
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
            const prisma = new PrismaClient();
            const gig = await prisma.gigs.findUnique({
                where: {id: parseInt(req.params.gigId)},
                include: {
                    createdBy: true
                }
            });

            return res.status(200).json({
                gig,
                success: true
            });
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

export const editGig = async (req,res) => {
    try {
        if(req?.files){
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
            if(req.query){
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

                const prisma = new PrismaClient();

                // first we will get the old data of the gig
                const oidData = await prisma.gigs.findUnique({
                    where: { id: parseInt(req?.params?.gigId) }
                })

                // then we will update the gig with the new data
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
                        createdBy: {connect: {id: req.user.userId}}
                        
                    }
                });


                // delete the old images
                oidData?.images?.forEach((image) => {
                    if(existsSync(`uploads/${image}`)){
                        unlinkSync(`uploads/${image}`);
                    } 
                })


                // if everything goes well then we will return the success message
                return res.status(200).json({
                    msg: 'Gig updated successfully',
                    success: true
                });
            }
        }

        // if anything goes wrong then we will return the error message
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

const createSearchQuery = (searchTerm, category) => {
    console.log(searchTerm, category);
    const query = {
        where: {
            OR: [],
        },
        include: {
            createdBy: true,
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
        // if the search term or category is provided then we will search the gigs
        if(req?.query?.searchTerm || req?.query?.category){
            const prisma = new PrismaClient();
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



