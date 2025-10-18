// import { PrismaClient } from "@prisma/client";
// import { withAccelerate } from "@prisma/extension-accelerate"
// import { env } from "$env/dynamic/private";

// class Singleton {
//     private static instance: Singleton;

//     private prisma: PrismaClient;

//     private constructor() {
//         // Initialize Prisma Client for edge runtime

//         // let test = new PrismaClient().$extends(withAccelerate());
//         // Cast the extended client back to PrismaClient to satisfy the declared type
//         // this.prisma = test as unknown as PrismaClient;

//         this.prisma = new PrismaClient({
//             datasourceUrl: env.DATABASE_URL,
//         }).$extends(withAccelerate())
//     }

//     public static getInstance(): Singleton {
//         if (!Singleton.instance) {
//             Singleton.instance = new Singleton();
//         }

//         return Singleton.instance;
//     }

//     public getPrisma() {
//         return this.prisma;
//     }

// }

// export default Singleton;
