import { Prisma, PrismaClient } from "@prisma/client";
import { compare, genSalt, hash } from "bcrypt";
import jwt from 'jsonwebtoken'
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { oauth2Client } from "../utils/googleConfig.js";
import bcrypt from 'bcrypt'
import axios from 'axios'
// Generating Bcrypt or Hash password
const generateHashPassword = async (password) => {
    const salt = await genSalt(10);
    return await hash(password, salt);
};

// Creating Token
const maxAge = 3 * 24 * 60 * 60;
const createToken =  (email, userId) => {
    return jwt.sign({email,userId},process.env.JWT_KEY,{
        expiresIn: maxAge
    });
}

export const signup = async (req, res) => {
    try {
        const prisma = new PrismaClient();
        const { email, password } = req.body;
        if(email && password){
            const existUser = await prisma.user.findUnique({
                where:{
                    email: email,
                },
            });
            if(existUser){
                return res.status(409).json({
                    msg: "User Already Exists with this Email",
                    success: false
                });
            };

            const user = await prisma.user.create({
                data:{
                    email,
                    password: await generateHashPassword(password)
                }
            });
            const token = createToken(email, user.id);
            return res
            .cookie('token',token,{
                httpOnly: false,
                maxAge: maxAge * 1000
            })
            .status(201)
            .json({
                user: {
                    id: user.id,
                    email: user.email
                },
                token,
                success: true
            });
        };


        return res.status(400).json({
            msg: 'Email & password is required',
            success: false
        })


    } catch (error) {
        console.log('Sign: ', error);
        return res.status(501).json({
            msg: 'Internal Server Error',
            success: false
        })
    }
};

export const googleAuth = async (req, res) => {
    try {
        const {code} = req.query;
        const googleRes = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(googleRes.tokens);

        const userRes = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
        );
        const {email, name, picture} = userRes.data;
        const data = userRes.data;
        console.log('data', data);
        const prisma = new PrismaClient();
        const existUser = await prisma.user.findUnique({
            where: {email},
        });
        if(existUser){
            const token = createToken(email, existUser.id);
            return res
            .cookie('token',token,{
                httpOnly: false,
                maxAge: maxAge * 1000
            })
            .status(201)
            .json({
                user: {
                    id: existUser.id,
                    email: existUser.email
                },
                token,
                success: true
            });
        }
        const randomPassword = await bcrypt.hash(Math.random().toString(36).slice(-8), 10);
        const user = await prisma.user.create({
            data:{
                email,
                fullName: name,
                password: randomPassword
            }
        });
        const token = createToken(email, user.id);
        return res
        .cookie('token',token,{
            httpOnly: false,
            maxAge: maxAge * 1000
        })
        .status(201)
        .json({
            user: {
                id: user.id,
                email: user.email
            },
            token,
            success: true
        });

    } catch (error) {
        console.log('google',error);
        return res.status(501).json({
            msg: 'Internal Server Error',
            success: false
        });
    }
}

export const login = async (req, res) => {
    try {
        const prisma = new PrismaClient();
        const { email, password } = req.body;
        if(email && password){
            const user = await prisma.user.findUnique({
                where:{ email },
            });

            if(!user){
                return res.status(404).json({
                    msg: "user not found",
                    success: false
                })
            };
            const auth = await compare(password, user.password);
            if(!auth){
                return res.status(400).json({
                    msg: "Invalid Password",
                    success: false
                })
            }

            const token = createToken(email, user.id);
            return res
            .cookie('token',token,{
                httpOnly: false,
                maxAge: maxAge * 1000,
                
            })
            .status(201)
            .json({
                user: {
                    id: user.id,
                    email: user.email
                },
                token,
                success: true
            });
        };


        return res.status(400).json({
            msg: 'Email & password is required',
            success: false
        })

    } catch (error) {
        console.log("Err :",error);
        return res.status(501).json({
            msg: "Internal Server Error",
            success: false
        });
    }
}

export const getUserInfo = async (req,res) => {
    try {
        if(req?.user){
            const prisma = new PrismaClient();
            const user = await prisma.user.findUnique({
                where:{
                    id: req?.user?.userId
                },
            });
            delete user.password;  // it will delete password from user object
            return res.status(200).json({
                user,
                success: true
            });
        }
        
    } catch (error) {
        console.log('err', error);
        return res.status(501).json({
            msg: 'Internal Server Error',
            success: false
        });
    }
}

export const setUserInfo = async (req,res) => {
    try {
        // console.log("Profile: ",req.body)
            const {userName, fullName, description, skills, socialLinks,location,portfolioLink} = req.body;
            const prisma = new PrismaClient();

            if(userName && fullName && description){
                const existUser = await prisma.user.findUnique({
                    where: {username:userName}
                });

                if(existUser && existUser.id !== req.user.userId){
                    return res.status(201).json({
                        msg: 'User Name Already Exists',
                        userNameError: true
                    });
                }

                const user = await prisma.user.update({
                    where: {id: req?.user?.userId},
                    data: {
                        username: userName,
                        fullName,
                        description,
                        skills: skills || [],
                        socialLinks: socialLinks || [],
                        portfolioLink: portfolioLink,
                        location: location,
                        isProfileInfoSet: true
                    },
                })
                return res.status(200).json({
                    user,
                    msg: 'Profile Updated Successfully',
                    success: true
                });
            }else{
                    return res.status(400).json({
                        msg: 'fields are required',
                        success: false
                    });
                }
        
    } catch (error) {
        console.log('err', error)
        if(error instanceof Prisma.PrismaClientKnownRequestError){
            if(error.code === 'P2002'){
                return res.status(409).json({
                    userNameError: true
                });
            }
        }else{
            return res.status(501).json({
                msg: 'Internal Server Error',
                success: false
            });
        }
        throw error
    }
}

// here i want to use cloudinary for uploading profileImage of user
export const setUserImage = async (req,res) => {
    try {
        if(req?.file){
                const localFile = req.file;
                if(!localFile) return res.status(404).json({
                    msg: 'image is required',
                    success: false
                })

                const cloud = await uploadOnCloudinary(localFile.path);
                if(!cloud) return res.status(404).json({
                    msg: 'Image Not Found',
                    success: false
                })
                const prisma = new PrismaClient();
                const user = await prisma.user.update({
                    where: {id: req?.user?.userId},
                    data: {
                        profileImage: cloud.secure_url
                    }
                });
                return res.status(200).json({
                    user,
                    img: user.profileImage,
                    success: true
                })
        }
        return res.status(404).json({
            msg: 'Image not Found',
            success: false
        })
        
    } catch (error) {
        // console.log('err', error);
        return res.status(501).json({
            msg: 'Internal Server Error',
            success: false
        });
    }
}

export const logOut = async (req,res) => {
    try {
        if(req.user.userId){
            return res.status(201).cookie('token','').json({
                msg: 'Logout successfully',
                success: true
            })
        }
        return res.status(404).json({
            msg: 'Invalid User',
            success: false
        })
        
    } catch (error) {
        console.log('logout',error);
        return res.status(501).json({
            msg: "Internal Server Error",
            success: false
        })
    }
}

export const editProfile = async (req,res) => {
    try {
            const {username, fullName, description} = req.body;

            if(username || fullName || description){
                const prisma = new PrismaClient();
                if(username){
                    const existUser = await prisma.user.findUnique({
                        where:{ username }
                    });
                    if(existUser){
                        return res.status(201).json({
                            msg: 'User Name Already taken',
                            userNameError: true
                        });
                    };
                };

                const user = await prisma.user.update({
                    where: {id: req?.user?.userId},
                    data: {
                        username,
                        fullName,
                        description,
                    },
                })
                return res.status(200).json({
                    user,
                    success: true
                });
            }

            return res.status(201).json({
                success: true
            })

        
    } catch (error) {
        console.log('err', error)
        if(error instanceof Prisma.PrismaClientKnownRequestError){
            if(error.code === 'P2002'){
                return res.status(409).json({
                    userNameError: true
                });
            }
        }else{
            return res.status(501).json({
                msg: 'Internal Server Error',
                success: false
            });
        }
        throw error
    }
}

export const editUserProfileImage = async (req,res) => {
    try {
        if(req?.file){
                const localFile = req.file;

                const cloud = await uploadOnCloudinary(localFile.path);
                if(!cloud) return res.status(404).json({
                    msg: 'Image not found',
                    success: false
                })
                const prisma = new PrismaClient();
                const user = await prisma.user.update({
                    where: {id: req?.user?.userId},
                    data: {
                        profileImage: cloud.secure_url,
                    }
                });
                return res.status(200).json({
                    user,
                    img: user.profileImage,
                    success: true
                })
        }
        return res.status(404).json({
            msg: 'Image not Found',
            success: false
        })
        
    } catch (error) {
        // console.log('err', error);
        return res.status(501).json({
            msg: 'Internal Server Error',
            success: false
        });
    }
}
