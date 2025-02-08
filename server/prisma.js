import { PrismaClient } from "@prisma/client";

// using globalObject for only one instance
const globalForPrisma = globalThis;

// Pehle se koi instance hai to wahi use karo, nahi to naya banao
const prisma = globalForPrisma.prisma || new PrismaClient();


if(process.env.NODE_ENV !== 'production'){
    globalForPrisma.prisma = prisma;
};

export default prisma;