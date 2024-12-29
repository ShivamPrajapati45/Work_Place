import { Prisma, PrismaClient } from "@prisma/client";
import { compare, genSalt, hash } from "bcrypt";
import jwt from 'jsonwebtoken'
import fs from 'fs'

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
                    id: req.user.userId
                },
            });
            delete user.password;  // it will delete password from user object
            return res.status(200).json({
                user,
                success: true
            });
        }
        
    } catch (error) {
        // console.log('err', error);
        return res.status(501).json({
            msg: 'Internal Server Error',
            success: false
        });
    }
}

export const setUserInfo = async (req,res) => {
    try {
        // console.log(req)
            const {userName, fullName, description} = req.body;
            if(userName && fullName && description){
                const prisma = new PrismaClient();
                const existUser = await prisma.user.findUnique({
                    where:{username:userName}
                });
                if(existUser){
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
export const setUserImage = async (req,res) => {
    try {
        // console.log(req);
        console.log(req?.file);
        if(req?.file){
            if(req?.user?.userId){
                console.log(req?.file);
                const date =  Date.now();
                let fileName = 'uploads/profiles' + date + req.file.originalname;
                fs.renameSync(req.file.path, fileName);
                const prisma = new PrismaClient();
                await prisma.user.update({
                    where: {id: req?.user?.userId},
                    data: {
                        profileImage: fileName
                    }
                });
                return res.status(200).json({
                    img: fileName,
                    success: true
                })
            }
            return res.status(400).json({
                msg: 'Cookie Error',
                success: false
            })
        }
        return res.status(404).json({
            msg: 'Image not Found',
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