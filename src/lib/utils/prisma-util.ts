// import Singleton from "./singleton";

import { PrismaClient } from "@prisma/client/edge";
import { env } from "$env/dynamic/private";
import { withAccelerate } from "@prisma/extension-accelerate";

// export const prisma = Singleton.getInstance().getPrisma()

export const prisma = new PrismaClient({
    datasourceUrl: env.DATABASE_URL,
}).$extends(withAccelerate())